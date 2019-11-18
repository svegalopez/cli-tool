import { QueryRunner } from 'typeorm';
import { createReadStream } from 'fs';
import { Writable } from 'stream';
import { getConnection, InsertQueryBuilder } from 'typeorm';
import { connectToDb } from './data';
import { Story, Privacy } from './data/entities/Story';
const csv = require('fast-csv');

type CsvRow = { launchDate: string, title: string, privacy: string, likes: string }
type StoryReq = Omit<Story, "id">;

let rows: CsvRow[] = [];
let qb: InsertQueryBuilder<Story>;
let qr: QueryRunner;
const numRows = 100 // will save 100 rows at a time.

async function main() {

    await connectToDb();

    // get a connection and create a new query runner
    qr = getConnection().createQueryRunner();

    // start a transaction
    await qr.startTransaction();

    // prepare the queryBuilder
    qb = qr
        .manager
        .createQueryBuilder()
        .insert()
        .into(Story)

    const readStream = createReadStream('./stories.csv')
    const transformStream = readStream.pipe(csv.parse({ headers: true }))
    const writeStream = new Writable({ write, objectMode: true })

    console.log(`Starting. Will save ${numRows} at a time...`)
    transformStream.pipe(writeStream)

    writeStream.on('finish', async () => {

        if (rows.length > 0) {
            try {
                // insert the remainders, eg: 56 in this example
                await insertAsserted(rows);

            } catch (err) {
                console.error(err)
                handleError()
            }
        }

        console.log('finished')
        await qr.commitTransaction();
        return await getConnection().close()
    })

    writeStream.on('error', async (err: Error) => {
        console.log('There was an error writing: ')
        console.log(err)
        await handleError()
    })

    readStream.on('error', async (err: Error) => {
        console.log('There was an error reading the csv file: ')
        console.error(err)
        await handleError()
    })

    transformStream.on('error', async (err: Error) => {
        console.log('There was an error parsing the csv: ')
        console.error(err)
        await handleError()
    })

    async function handleError() {
        await qr.rollbackTransaction()
        await getConnection().close()
    }
}

function write(row: CsvRow, enc: string, cb: (err?: Error | null) => void): void {
    //console.log(`write ${row.title}`)
    rows.push(row);
    if (rows.length === numRows) {
        insertAsserted(rows)
            .then(_ => { rows = []; cb() })
            .catch((err: Error) => { cb(err) })
    } else {
        cb()
    }
}

/** Inserts asserted records to the db */
async function insertAsserted(rows: CsvRow[]): Promise<void> {

    const asserted = rows.map(el => {
        const storyReq: StoryReq = {
            likes: parseInt(el.likes),
            privacy: el.privacy as Privacy,
            launchDate: el.launchDate,
            title: el.title
        }
        if (isStoryReq(storyReq)) return storyReq
        else throw Error(`${JSON.stringify(el)} does not meet schema`)
    })

    await qb
        .values(asserted)
        .execute();

    console.log(`saved ${asserted.length} rows`);
}

function isStoryReq(args: StoryReq): args is StoryReq {
    return typeof args.launchDate === "string"
        && typeof args.likes === "number"
        && typeof args.title === "string"
        && typeof args.privacy === "string"
        && Object.values(Privacy).includes(args.privacy)
}

main().catch(err => console.error(err))






