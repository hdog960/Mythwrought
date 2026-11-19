// :36 independent PNG structural integrity gate; does not attest Chromium provenance.
import {createHash} from 'node:crypto';
const signature=Uint8Array.from([137,80,78,71,13,10,26,10]);
const table=Uint32Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
function crc32(bytes,start,end){let c=0xffffffff;for(let i=start;i<end;i++)c=table[(c^bytes[i])&255]^(c>>>8);return (c^0xffffffff)>>>0;}
export function inspectFittingPng(bytes,{maxBytes=16*1024*1024}={}){
 if(!(bytes instanceof Uint8Array)||bytes.length<57||bytes.length>maxBytes||signature.some((v,i)=>bytes[i]!==v))throw Error('invalid PNG signature or size');
 const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 let offset=8,width,height,seenIHDR=false,seenIDAT=false,seenIEND=false,chunks=0;
 while(offset<bytes.length){
  if(offset+12>bytes.length)throw Error('truncated PNG chunk');
  const len=dv.getUint32(offset),end=offset+12+len;
  if(end>bytes.length)throw Error('PNG chunk length exceeds buffer');
  const type=String.fromCharCode(...bytes.subarray(offset+4,offset+8));
  if(!/^[A-Za-z]{4}$/.test(type))throw Error('invalid PNG chunk type');
  if(dv.getUint32(offset+8+len)!==crc32(bytes,offset+4,offset+8+len))throw Error('PNG CRC mismatch');
  if(!seenIHDR){
   if(type!=='IHDR'||len!==13)throw Error('IHDR must be first');
   width=dv.getUint32(offset+8);height=dv.getUint32(offset+12);
   if(!width||!height||width>8192||height>8192||bytes[offset+16]!==8||![2,6].includes(bytes[offset+17])||bytes[offset+20]!==0)throw Error('unsupported PNG format');
   seenIHDR=true;
  }else if(type==='IHDR')throw Error('duplicate IHDR');
  if(type==='IDAT'){if(seenIEND||len===0)throw Error('invalid IDAT');seenIDAT=true;}
  if(type==='IEND'){
   if(len!==0||!seenIDAT||end!==bytes.length)throw Error('invalid PNG terminator');
   seenIEND=true;break;
  }
  if(++chunks>4096)throw Error('excessive PNG chunks');
  offset=end;
 }
 if(!seenIEND)throw Error('missing PNG terminator');
 return Object.freeze({width,height,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),structurallyValid:true,chromiumProvenanceVerified:false});
}
