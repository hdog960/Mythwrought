// :12 opt-in evidence parser. PNG structural integrity is necessary, never proof of Chromium origin.
import {createHash} from 'node:crypto';
const fail=(reason)=>({ok:false,live:false,reason});
const crcTable=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=(n&1)?(0xedb88320^(n>>>1)):(n>>>1);return n>>>0;});
function crc32(bytes){let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
export function verifyPngEvidence(input,{width,height,sha256,maxBytes=16*1024*1024}={}){
 if(typeof input!=='string'||!Number.isSafeInteger(width)||!Number.isSafeInteger(height)||width<1||height<1||typeof sha256!=='string'||!/^[0-9a-f]{64}$/.test(sha256))return fail('invalid evidence declaration');
 const bytes=Buffer.from(input,'base64');
 if(!bytes.length||bytes.toString('base64')!==input||bytes.length>maxBytes)return fail('invalid or oversized base64');
 if(createHash('sha256').update(bytes).digest('hex')!==sha256)return fail('digest mismatch');
 if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')return fail('PNG signature missing');
 let offset=8,ihdr=0,idat=0,iend=0,seenEnd=false;
 while(offset<bytes.length){
  if(offset+12>bytes.length)return fail('truncated chunk header');
  const size=bytes.readUInt32BE(offset),start=offset+8,end=start+size;
  if(size>maxBytes||end+4>bytes.length)return fail('truncated chunk');
  const type=bytes.toString('ascii',offset+4,offset+8);
  if(!/^[A-Za-z]{4}$/.test(type))return fail('invalid chunk type');
  if(crc32(bytes.subarray(offset+4,end))!==bytes.readUInt32BE(end))return fail('chunk CRC mismatch');
  if(ihdr===0&&type!=='IHDR')return fail('IHDR must be first');
  if(type==='IHDR'){
   if(ihdr++||size!==13||bytes.readUInt32BE(start)!==width||bytes.readUInt32BE(start+4)!==height)return fail('IHDR mismatch');
   const depth=bytes[start+8],color=bytes[start+9];
   if(![[0,[1,2,4,8,16]],[2,[8,16]],[3,[1,2,4,8]],[4,[8,16]],[6,[8,16]]].some(([c,ds])=>c===color&&ds.includes(depth))||bytes[start+10]!==0||bytes[start+11]!==0||bytes[start+12]>1)return fail('unsupported PNG header');
  }
  if(type==='IDAT'){if(iend)return fail('IDAT after IEND');idat++;}
  if(type==='IEND'){if(size!==0||!idat||iend++)return fail('invalid IEND');seenEnd=true;if(end+4!==bytes.length)return fail('trailing bytes');}
  offset=end+4;
 }
 if(!ihdr||!idat||!seenEnd)return fail('incomplete PNG');
 return {ok:true,live:false,reason:'structurally valid PNG bytes; Chromium/WebGL2 provenance NOT VERIFIED',width,height,sha256};
}
