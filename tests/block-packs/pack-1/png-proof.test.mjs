import test from 'node:test';
import assert from 'node:assert/strict';
import {deflateSync} from 'node:zlib';
import {verifyScreenshotPng} from './png-proof.mjs';
const SIGNATURE=Buffer.from([137,80,78,71,13,10,26,10]);
const crc=data=>{
  let x=0xffffffff;
  for(const b of data){x^=b;for(let i=0;i<8;i++)x=(x>>>1)^((x&1)?0xedb88320:0);}
  return (x^0xffffffff)>>>0;
};
function chunk(type,data=Buffer.alloc(0)){
  const label=Buffer.from(type,'ascii');
  const buffer=Buffer.alloc(12+data.length);
  buffer.writeUInt32BE(data.length,0);label.copy(buffer,4);data.copy(buffer,8);
  buffer.writeUInt32BE(crc(Buffer.concat([label,data])),8+data.length);
  return buffer;
}
function image(w=8,h=6,{color=6,filter=0,garbage=false}={}){
  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(w,0);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=color;
  const row=1+w*(color===6?4:3);
  const raw=Buffer.alloc(row*h,127);
  for(let y=0;y<h;y++)raw[y*row]=filter;
  return Buffer.concat([SIGNATURE,chunk('IHDR',ihdr),
    chunk('IDAT',garbage?Buffer.from([1,2,3]):deflateSync(raw)),chunk('IEND')]);
}
test('valid unmodified 8-bit RGBA screenshot returns dimensions and SHA-256',()=>{
  const b=image(8,6);
  const result=verifyScreenshotPng(b,{width:8,minHeight:6});
  assert.equal(result.width,8);assert.equal(result.height,6);
  assert.equal(result.bytes,b.length);assert.match(result.sha256,/^[0-9a-f]{64}$/);
});
test('valid 8-bit RGB screenshot is also supported',()=>{
  const a=verifyScreenshotPng(image(7,9,{color:2}),{width:7,minHeight:9});
  assert.equal(a.height,9);
});
test('incorrect screenshot viewport width or insufficient height fails closed',()=>{
  assert.throws(()=>verifyScreenshotPng(image(8,6),{width:9}),/width mismatch/);
  assert.throws(()=>verifyScreenshotPng(image(8,6),{minHeight:7}),/shorter/);
});
test('corrupt PNG signature and chunk checksums cannot become acceptance evidence',()=>{
  const b=image();b[0]=0;
  assert.throws(()=>verifyScreenshotPng(b),/signature/);
  const c=image();c[32]^=255;
  assert.throws(()=>verifyScreenshotPng(c),/CRC mismatch/);
});
test('truncated PNG, missing IEND, appended text, or fake IDAT is rejected',()=>{
  const b=image();
  assert.throws(()=>verifyScreenshotPng(b.subarray(0,b.length-12)),/Missing IEND/);
  assert.throws(()=>verifyScreenshotPng(Buffer.concat([b,Buffer.from('FAKE')])),/trailing/);
  assert.throws(()=>verifyScreenshotPng(image(8,6,{garbage:true})),/invalid|unexpected|incorrect|check|compressed|header|unknown/i);
});
test('invalid filter method or unsupported color format fails validation',()=>{
  assert.throws(()=>verifyScreenshotPng(image(8,6,{filter:5})),/filter/);
  assert.throws(()=>verifyScreenshotPng(image(8,6,{color:4})),/Unsupported PNG pixel format/);
});
test('non-buffer inputs and tiny pseudo-images never count as screenshots',()=>{
  assert.throws(()=>verifyScreenshotPng(null),TypeError);
  assert.throws(()=>verifyScreenshotPng(Buffer.alloc(40)),/signature/);
});
