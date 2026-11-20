import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {deflateSync} from 'node:zlib';
import {verifyPngEvidence} from '../../src/auto-integration-support/nonblock-png-structure-gate.mjs';
const table=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=(n&1)?(0xedb88320^(n>>>1)):(n>>>1);return n>>>0;});
const crc=b=>{let c=0xffffffff;for(const x of b)c=table[(c^x)&255]^(c>>>8);return(c^0xffffffff)>>>0;};
const chunk=(type,data)=>{const t=Buffer.from(type),len=Buffer.alloc(4),sum=Buffer.alloc(4);len.writeUInt32BE(data.length);sum.writeUInt32BE(crc(Buffer.concat([t,data])));return Buffer.concat([len,t,data,sum]);};
function png(){const hdr=Buffer.alloc(13);hdr.writeUInt32BE(1,0);hdr.writeUInt32BE(1,4);hdr[8]=8;hdr[9]=6;return Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),chunk('IHDR',hdr),chunk('IDAT',deflateSync(Buffer.from([0,1,2,3,255]))),chunk('IEND',Buffer.alloc(0))]);}
const check=b=>verifyPngEvidence(b.toString('base64'),{width:1,height:1,sha256:createHash('sha256').update(b).digest('hex')});
test('valid independently constructed 1x1 PNG accepted as bytes, not Chromium provenance',()=>{const r=check(png());assert.equal(r.ok,true);assert.equal(r.live,false);});
test('forged PNG signature and dimensions without chunks rejected',()=>{const b=Buffer.alloc(24);Buffer.from('89504e470d0a1a0a','hex').copy(b);b.writeUInt32BE(1,16);b.writeUInt32BE(1,20);assert.equal(check(b).ok,false);});
test('CRC corruption rejected despite matching supplied SHA256',()=>{const b=png();b[30]^=1;assert.match(check(b).reason,/CRC/);});
test('missing IEND rejected',()=>{const b=png();assert.equal(check(b.subarray(0,b.length-12)).ok,false);});
test('trailing bytes rejected',()=>{const b=Buffer.concat([png(),Buffer.from([0])]);assert.equal(check(b).ok,false);});
test('dimensions mismatch rejected',()=>{const b=png();const r=verifyPngEvidence(b.toString('base64'),{width:667,height:375,sha256:createHash('sha256').update(b).digest('hex')});assert.equal(r.ok,false);});
test('noncanonical base64 rejected',()=>{assert.equal(verifyPngEvidence(png().toString('base64')+'!',{width:1,height:1,sha256:'0'.repeat(64)}).ok,false);});
test('oversized input rejected',()=>{const b=png();assert.equal(verifyPngEvidence(b.toString('base64'),{width:1,height:1,sha256:createHash('sha256').update(b).digest('hex'),maxBytes:20}).ok,false);});
