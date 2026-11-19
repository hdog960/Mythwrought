import test from 'node:test';
import assert from 'node:assert/strict';
import {deflateSync} from 'node:zlib';
import {inspectFittingPngPixels} from '../src/nonblock-fittings36/png-pixel-proof.mjs';
const signature=Buffer.from('89504e470d0a1a0a','hex');
function crc32(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
function chunk(type,data){const tag=Buffer.from(type),body=Buffer.concat([tag,data]),size=Buffer.alloc(4),crc=Buffer.alloc(4);size.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(body));return Buffer.concat([size,body,crc]);}
const pixels=[Buffer.from([10,20,30,40,50,60]),Buffer.from([70,80,90,100,110,120])];
function encode(filter){const rows=[];for(let y=0;y<2;y++){const row=pixels[y],prev=y?pixels[y-1]:Buffer.alloc(6),encoded=Buffer.alloc(7);encoded[0]=filter;for(let x=0;x<6;x++){const a=x>=3?row[x-3]:0,b=prev[x],c=x>=3?prev[x-3]:0;let p=0;if(filter===1)p=a;else if(filter===2)p=b;else if(filter===3)p=Math.floor((a+b)/2);else if(filter===4){const q=a+b-c,da=Math.abs(q-a),db=Math.abs(q-b),dc=Math.abs(q-c);p=da<=db&&da<=dc?a:db<=dc?b:c;}encoded[x+1]=(row[x]-p+256)&255;}rows.push(encoded);}const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(2,0);ihdr.writeUInt32BE(2,4);ihdr[8]=8;ihdr[9]=2;return Buffer.concat([signature,chunk('IHDR',ihdr),chunk('IDAT',deflateSync(Buffer.concat(rows))),chunk('IEND',Buffer.alloc(0))]);}
test('all five PNG filters reconstruct identical pixel digest',()=>{const digests=[0,1,2,3,4].map(filter=>inspectFittingPngPixels(encode(filter)).pixelSha256);assert.equal(new Set(digests).size,1);assert.match(digests[0],/^[0-9a-f]{64}$/);});
test('pixel digest differs for changed pixel data',()=>{const before=inspectFittingPngPixels(encode(0)).pixelSha256;pixels[1][5]^=1;try{assert.notEqual(inspectFittingPngPixels(encode(0)).pixelSha256,before);}finally{pixels[1][5]^=1;}});
