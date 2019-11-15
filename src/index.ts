import { createReadStream } from 'fs';
import { Writable, Transform } from 'stream';
const csv = require('fast-csv');

const rs = createReadStream('./data.csv');

const x: Transform = rs.pipe(csv.parse({ headers: true }))

const outStream = new Writable({
    write(chunk, encoding, callback) {
        writeToDB(chunk).then(_ => callback())
    },
    objectMode: true
});

//x.pipe(outStream)

x.on('data', (row: any) => {
    outStream.write(row)
})


function writeToDB(row: any): Promise<void> {
    return new Promise(res => setTimeout(() => {
        console.log(row);
        res()
    }, 100))
}
