// Generates public/favicon.ico from public/favicon-32x32.png
// ICO format: ICONDIR header + ICONDIRENTRY + raw PNG bytes
import { readFileSync, writeFileSync } from 'fs';

const png = readFileSync('public/favicon-32x32.png');
const pngSize = png.byteLength;

// 6-byte ICONDIR + 16-byte ICONDIRENTRY = 22 bytes before image data
const headerSize = 6 + 16;

const buf = Buffer.alloc(headerSize + pngSize);

// ICONDIR
buf.writeUInt16LE(0, 0);        // reserved
buf.writeUInt16LE(1, 2);        // type: 1 = icon
buf.writeUInt16LE(1, 4);        // image count

// ICONDIRENTRY
buf.writeUInt8(32, 6);          // width
buf.writeUInt8(32, 7);          // height
buf.writeUInt8(0, 8);           // color count (0 = no palette)
buf.writeUInt8(0, 9);           // reserved
buf.writeUInt16LE(1, 10);       // planes
buf.writeUInt16LE(32, 12);      // bit count
buf.writeUInt32LE(pngSize, 14); // size of image data
buf.writeUInt32LE(headerSize, 18); // offset to image data

png.copy(buf, headerSize);

writeFileSync('public/favicon.ico', buf);
console.log(`Written public/favicon.ico (${buf.byteLength} bytes)`);
