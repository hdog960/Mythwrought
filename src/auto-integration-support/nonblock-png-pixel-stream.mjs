// Opt-in :12 PNG pixel-stream verification. Never a live :00 bridge.
import { inflateSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const signature = Buffer.from('89504e470d0a1a0a','hex');
const crcTable = Array.from({length:256},(_,n)=>{let c=n;for(let i=0;i<8;i++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
function crc32(bytes){let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
export function auditPngPixels(bytes,{width,height,sha256,maxInflatedBytes=16_000_000}={}){
 const fail=(reason)=>({ok:false,reason,chromiumVerified:false,live:false});
 if(!Buffer.isBuffer(bytes)||bytes.length<57||!bytes.subarray(0,8).equals(signature))return fail('signature');
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1)return fail('dimensions-request');
 if(typeof sha256!=='string'||createHash('sha256').update(bytes).digest('hex')!==sha256)return fail('hash');
 let pos=8,ihdr=null,ended=false,idat=[],sawIDAT=false,idatClosed=false;
 while(pos<bytes.length){
  if(pos+12>bytes.length)return fail('truncated-chunk');
  const size=bytes.readUInt32BE(pos),type=bytes.toString('ascii',pos+4,pos+8),end=pos+12+size;
  if(end>bytes.length)return fail('chunk-overflow');
  const body=bytes.subarray(pos+8,pos+8+size);
  if(crc32(bytes.subarray(pos+4,pos+8+size))!==bytes.readUInt32BE(pos+8+size))return fail('crc');
  if(!ihdr&&type!=='IHDR')return fail('ihdr-order');
  if(sawIDAT&&type!=='IDAT'&&type!=='IEND')idatClosed=true;
  if(type==='IHDR'){if(ihdr||size!==13)return fail('ihdr');ihdr=body;}
  else if(type==='IDAT'&&idatClosed)return fail('idat-nonconsecutive');
  else if(type==='IDAT'){if(ended)return fail('idat-order');sawIDAT=true;idat.push(body);}
  else if(type==='IEND'){if(size!==0||end!==bytes.length)return fail('iend-trailing');ended=true;break;}
  else if(type[0]===type[0].toUpperCase())return fail('unsupported-critical-chunk');
  pos=end;
 }
 if(!ended||!ihdr||!sawIDAT)return fail('missing-chunks');
 if(!Number.isSafeInteger(maxInflatedBytes)||maxInflatedBytes<1)return fail('inflate-budget-parameter');
 const w=ihdr.readUInt32BE(0),h=ihdr.readUInt32BE(4),depth=ihdr[8],color=ihdr[9];
 if(w!==width||h!==height||depth!==8||![2,6].includes(color)||ihdr[10]!==0||ihdr[11]!==0||ihdr[12]!==0)return fail('unsupported-format');
 const stride=w*(color===6?4:3),expected=h*(stride+1);
 if(expected>maxInflatedBytes)return fail('inflate-budget');
 let raw;try{raw=inflateSync(Buffer.concat(idat),{maxOutputLength:maxInflatedBytes});}catch{return fail('inflate');}
 if(raw.length!==expected)return fail('scanline-size');
 for(let y=0;y<h;y++)if(raw[y*(stride+1)]>4)return fail('filter-byte');
 return {ok:true,reason:'pixel-stream-structurally-valid',chromiumVerified:false,live:false,width:w,height:h,sha256};
}
