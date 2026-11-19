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
 for(let y=0;y<meta.height;y++){
  const filter=raw[y*(rowBytes+1)];
  if(filter>4)throw Error('PNG invalid scanline filter');
 }
 return Object.freeze({...meta,pixelDataDecodable:true,chromiumProvenanceVerified:false});
}
