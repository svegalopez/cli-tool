import { createReadStream } from 'fs';
import { Writable } from 'stream';
import { getConnection, InsertQueryBuilder } from 'typeorm';
import { connectToDb } from './data';
import { Story } from './data/entities/Story';
const csv = require('fast-csv');

type CsvRow = { launchDate: string, title: string, privacy: string, likes: string }
type StoryReq = Omit<Story, "id">

let rows: CsvRow[] = [];
let qb: InsertQueryBuilder<Story>;

async function main() {

    await connectToDb()

    qb = getConnection()
        .createQueryBuilder()
        .insert()
        .into(Story)

    const readStream = createReadStream('./stories.csv')
    const transformStream = readStream.pipe(csv.parse({ headers: true }))
    const writeStream = new Writable({ write, objectMode: true })

    transformStream.pipe(writeStream)

    writeStream.on('finish', async () => {

        if (rows.length > 0) {
            try {
                // insert the remainders
                await insertAsserted(rows);

            } catch (err) {
                console.error(err)
            }
        }

        console.log('finished')
        return getConnection().close()
    })

    writeStream.on('error', (err: Error) => {
        console.log('There was an error writing: ')
        console.log(err)
        getConnection().close()
    })

    readStream.on('error', (err: Error) => {
        console.log('There was an error reading the csv file: ')
        console.error(err)
        getConnection().close()
    })

    transformStream.on('error', (err: Error) => {
        console.log('There was an error parsing the csv: ')
        console.error(err)
        getConnection().close()
    })
}

function write(row: CsvRow, enc: string, cb: (err?: Error | null) => void): void {
    //console.log(`write ${row.title}`)
    rows.push(row);
    if (rows.length === 3) {
        insertAsserted(rows).then(_ => { rows = []; cb() }).catch((err: Error) => { cb(err) })
    } else {
        cb()
    }
}

/** Inserts asserted records to the db */
async function insertAsserted(rows: CsvRow[]): Promise<void> {

    const asserted = rows.map(el => {
        const storyReq: StoryReq = {
            likes: parseInt(el.likes),
            privacy: el.privacy as "private" | "public",
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

function isStoryReq(args: any): args is StoryReq {
    return typeof args.launchDate === "string"
        && typeof args.likes === "number"
        && typeof args.title === "string"
        && typeof args.privacy === "string"
        && ["private", "public"].includes(args.privacy)
}

main().catch(err => console.error(err))






