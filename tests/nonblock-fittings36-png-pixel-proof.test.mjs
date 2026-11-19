import test from 'node:test';
import assert from 'node:assert/strict';
import {deflateSync} from 'node:zlib';
import {inspectFittingPngPixels} from '../src/nonblock-fittings36/png-pixel-proof.mjs';
const table=Uint32Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
function crc(b){let c=0xffffffff;for(const v of b)c=table[(c^v)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function chunk(type,data){const t=Buffer.from(type),len=Buffer.alloc(4),sum=Buffer.alloc(4);len.writeUInt32BE(data.length);sum.writeUInt32BE(crc(Buffer.concat([t,data])));return Buffer.concat([len,t,data,sum]);}
function png(raw,{width=1,height=1,interlace=0}={}){const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(width,0);ihdr.writeUInt32BE(height,4);ihdr[8]=8;ihdr[9]=6;ihdr[12]=interlace;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
test('decodes real complete RGBA scanline without asserting browser provenance',()=>{const r=inspectFittingPngPixels(png(Buffer.from([0,1,2,3,255])));assert.equal(r.pixelDataDecodable,true);assert.equal(r.chromiumProvenanceVerified,false);});
test('rejects CRC-valid but incorrect decompressed scanline length',()=>{assert.throws(()=>inspectFittingPngPixels(png(Buffer.from([0,1,2]))),/scanline/);});
test('rejects CRC-valid invalid filter and interlace',()=>{assert.throws(()=>inspectFittingPngPixels(png(Buffer.from([5,1,2,3,4]))),/filter/);assert.throws(()=>inspectFittingPngPixels(png(Buffer.from([0,1,2,3,4]),{interlace:1})),/interlaced/);});
test('rejects oversized decompressed image and invalid compressed stream',()=>{assert.throws(()=>inspectFittingPngPixels(png(Buffer.from([0,1,2,3,4]),{width:1000,height:1000}),{maxPixels:100}),/pixel budget/);const b=png(Buffer.from([0,1,2,3,4]));const broken=Buffer.from(b);const idat=broken.indexOf(Buffer.from('IDAT'));broken[idat+4]^=1;assert.throws(()=>inspectFittingPngPixels(broken),/CRC/);});
