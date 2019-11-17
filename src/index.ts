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

    transformStream.pipe(writeStream).on('finish', () => {
        // insert the remainders
        if (rows.length > 0) {
            writeToDB(rows)
                .then(() => {
                    rows = [];
                    console.log('finished')
                    getConnection().close()
                })
                .catch((err: Error) => {
                    console.error(err)
                })
        }
    })

    writeStream.on('error', (err: Error) => {
        console.log('There was an error writing: ')
        console.log(err)
        getConnection().close()
    })

    readStream.on('error', (err: Error) => {
        console.log('There was an error reading: ')
        console.error(err)
        getConnection().close()
    })

    transformStream.on('error', (err: Error) => {
        console.log('There was an error transforming: ')
        console.error(err)
        getConnection().close()
    })
}

function write(row: CsvRow, enc: string, cb: (err?: Error | null) => void): void {
    rows.push(row);
    if (rows.length === 10000) {
        writeToDB(rows)
            .then(() => {
                rows = []
                cb()
            })
            .catch((err: Error) => {
                cb(err)
            })
    } else {
        cb()
    }
}

async function writeToDB(rows: CsvRow[]): Promise<void> {

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






