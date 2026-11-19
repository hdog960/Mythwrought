import test from 'node:test';
import assert from 'node:assert/strict';
import { deflateSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { auditPngPixels } from '../../src/auto-integration-support/nonblock-png-pixel-stream.mjs';
const sig=Buffer.from('89504e470d0a1a0a','hex');
function crc(b){let c=0xffffffff;for(const v of b){c^=v;for(let i=0;i<8;i++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;}return(c^0xffffffff)>>>0;}
function chunk(type,data){const t=Buffer.from(type),l=Buffer.alloc(4),sum=Buffer.alloc(4);l.writeUInt32BE(data.length);sum.writeUInt32BE(crc(Buffer.concat([t,data])));return Buffer.concat([l,t,data,sum]);}
function png({filter=0,raw=null}={}){const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(2,0);ihdr.writeUInt32BE(1,4);ihdr[8]=8;ihdr[9]=6;const scan=raw??Buffer.from([filter,255,0,0,255,0,255,0,255]);return Buffer.concat([sig,chunk('IHDR',ihdr),chunk('IDAT',deflateSync(scan)),chunk('IEND',Buffer.alloc(0))]);}
function audit(b,opts={}){return auditPngPixels(b,{width:2,height:1,sha256:createHash('sha256').update(b).digest('hex'),...opts});}
test('accepts complete bounded RGBA PNG, never authenticates Chromium',()=>{const r=audit(png());assert.equal(r.ok,true);assert.equal(r.chromiumVerified,false);assert.equal(r.live,false);});
test('rejects valid CRC but invalid deflate',()=>{const b=png();const p=Buffer.concat([sig,chunk('IHDR',b.subarray(16,29)),chunk('IDAT',Buffer.from([1,2,3])),chunk('IEND',Buffer.alloc(0))]);assert.equal(audit(p).reason,'inflate');});
test('rejects invalid filter even when zlib and CRC are valid',()=>assert.equal(audit(png({filter:5})).reason,'filter-byte'));
test('rejects truncated scanline even when compressed data valid',()=>assert.equal(audit(png({raw:Buffer.from([0,1])})).reason,'scanline-size'));
test('rejects inflated output beyond declared budget',()=>assert.equal(audit(png(),{maxInflatedBytes:4}).reason,'inflate-budget'));
test('rejects tampered bytes',()=>{const b=png();b[20]^=1;assert.equal(audit(b).reason,'crc');});
test('rejects incorrect declared screenshot dimensions',()=>assert.equal(audit(png(),{width:3}).reason,'unsupported-format'));
test('rejects incorrect SHA-256',()=>assert.equal(audit(png(),{sha256:'0'.repeat(64)}).reason,'hash'));
test('rejects trailing bytes',()=>assert.equal(audit(Buffer.concat([png(),Buffer.from([1])])).reason,'iend-trailing'));
