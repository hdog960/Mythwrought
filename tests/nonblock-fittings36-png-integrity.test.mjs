import test from 'node:test';
import assert from 'node:assert/strict';
import {deflateSync} from 'node:zlib';
import {inspectFittingPng} from '../src/nonblock-fittings36/png-integrity.mjs';
const table=Uint32Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
function crc(b){let c=0xffffffff;for(const v of b)c=table[(c^v)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function chunk(type,data){const t=Buffer.from(type),len=Buffer.alloc(4),sum=Buffer.alloc(4);len.writeUInt32BE(data.length);sum.writeUInt32BE(crc(Buffer.concat([t,data])));return Buffer.concat([len,t,data,sum]);}
function png(){const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(1,0);ihdr.writeUInt32BE(1,4);ihdr[8]=8;ihdr[9]=6;const raw=Buffer.from([0,255,0,0,255]);return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
test('accepts structurally sound complete PNG without claiming browser provenance',()=>{const b=png(),r=inspectFittingPng(b);assert.equal(r.width,1);assert.equal(r.height,1);assert.equal(r.sha256.length,64);assert.equal(r.chromiumProvenanceVerified,false);});
test('rejects header-only fake screenshot',()=>{const b=png();assert.throws(()=>inspectFittingPng(b.subarray(0,33)));});
test('rejects CRC corruption and trailing garbage',()=>{const b=png();const bad=Buffer.from(b);bad[30]^=1;assert.throws(()=>inspectFittingPng(bad),/CRC/);assert.throws(()=>inspectFittingPng(Buffer.concat([b,Buffer.from([1])])),/terminator/);});
test('rejects truncated PNG and budget overflow',()=>{const b=png();assert.throws(()=>inspectFittingPng(b.subarray(0,-1)));assert.throws(()=>inspectFittingPng(b,{maxBytes:b.length-1}));});
