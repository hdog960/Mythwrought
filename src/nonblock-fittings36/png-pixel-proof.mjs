import {createHash} from 'node:crypto';
// :36 opt-in pixel-decodability gate. CRC-only PNGs are not visual/browser evidence.
import {inflateSync} from 'node:zlib';
import {inspectFittingPng} from './png-integrity.mjs';
export function inspectFittingPngPixels(bytes,{maxBytes=16*1024*1024,maxPixels=932*430*4}={}){
 const meta=inspectFittingPng(bytes,{maxBytes});
 if(meta.width*meta.height>maxPixels)throw Error('PNG pixel budget exceeded');
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 const colorType=bytes[25],channels=colorType===6?4:3;
 if(bytes[28]!==0)throw Error('interlaced PNG unsupported');
 let offset=8,seenData=false,dataEnded=false;
 const compressed=[];
 while(offset<bytes.length){
  const len=view.getUint32(offset),type=String.fromCharCode(...bytes.subarray(offset+4,offset+8));
  if(type==='IDAT'){
   if(dataEnded)throw Error('noncontiguous IDAT');
   seenData=true;compressed.push(bytes.subarray(offset+8,offset+8+len));
  }else if(seenData)dataEnded=true;
  offset+=12+len;
 }
 const rowBytes=meta.width*channels,expected=meta.height*(rowBytes+1);
 if(!Number.isSafeInteger(expected)||expected>maxPixels*5+8192)throw Error('PNG inflated size budget exceeded');
 let raw;
 try{raw=inflateSync(Buffer.concat(compressed),{maxOutputLength:expected+1});}
 catch{throw Error('PNG IDAT deflate invalid or oversized');}
 if(raw.length!==expected)throw Error('PNG scanline byte count mismatch');
 // Decode all five PNG filter modes rather than merely checking filter bytes.
 // This detects malformed scanline reconstruction and yields a stable pixel digest
 // independent of PNG compression choices. It is NOT browser provenance.
 const decoded=Buffer.allocUnsafe(rowBytes*meta.height);
 for(let y=0;y<meta.height;y++){
  const start=y*(rowBytes+1),filter=raw[start],dst=y*rowBytes;
  if(filter>4)throw Error('PNG invalid scanline filter');
  for(let x=0;x<rowBytes;x++){
   const left=x>=channels?decoded[dst+x-channels]:0;
   const above=y?decoded[dst-rowBytes+x]:0;
   const upperLeft=y&&x>=channels?decoded[dst-rowBytes+x-channels]:0;
   let predictor=0;
   if(filter===1)predictor=left;
   else if(filter===2)predictor=above;
   else if(filter===3)predictor=Math.floor((left+above)/2);
   else if(filter===4){
    const p=left+above-upperLeft,a=Math.abs(p-left),b=Math.abs(p-above),c=Math.abs(p-upperLeft);
    predictor=a<=b&&a<=c?left:b<=c?above:upperLeft;
   }
   decoded[dst+x]=(raw[start+1+x]+predictor)&255;
  }
 }
 return Object.freeze({...meta,pixelDataDecodable:true,pixelSha256:createHash('sha256').update(decoded).digest('hex'),chromiumProvenanceVerified:false});
}
