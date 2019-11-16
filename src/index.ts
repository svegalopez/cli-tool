import { createReadStream } from 'fs';
import { Writable, WritableOptions } from 'stream';
const csv = require('fast-csv');

type Story = {
    launchDate: string,
    title: string,
    privacy: 'public' | 'private',
    likes: number
}

let rows: Story[] = [];

const write = (row: Story, enc: string, cb: (err?: Error | null) => void): void => {
    rows.push(row);
    if (rows.length === 100000) {
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

const readStream = createReadStream('./stories.csv')
const transformStream = readStream.pipe(csv.parse({ headers: true }))
const writeStream = new Writable({ write, objectMode: true })

transformStream.pipe(writeStream).on('finish', () => {
    if (rows.length > 0) {
        writeToDB(rows)
            .then(() => {
                rows = [];
                console.log('done')
            })
            .catch((err: Error) => {
                console.log(err)
            })
    }
})

function writeToDB(rows: Story[]): Promise<void> {
    return new Promise((res, rej) => {
        setTimeout(() => {
            console.log(rows)
            res()
        }, 100)
    })
}

writeStream.on('error', (err: Error) => {
    console.log('There was an error writing: ')
    console.log(err)
})

readStream.on('error', (err: Error) => {
    console.log('There was an error reading: ')
    console.error(err)
})

transformStream.on('error', (err: Error) => {
    console.log('There was an error transforming: ')
    console.error(err)
})




