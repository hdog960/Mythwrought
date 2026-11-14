// Pack 1 opt-in Chromium screenshot integrity: no external dependencies.
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
const SIGNATURE=Buffer.from([137,80,78,71,13,10,26,10]);
function crc32(data){
  let crc=0xffffffff;
  for(const byte of data){
    crc^=byte;
    for(let bit=0;bit<8;bit++)crc=(crc>>>1)^(crc&1?0xedb88320:0);
  }
  return (crc^0xffffffff)>>>0;
}
export function verifyScreenshotPng(buffer,{width:expectedWidth,minHeight=1}={}){
  if(!Buffer.isBuffer(buffer))throw new TypeError('PNG must be a Buffer');
  if(buffer.length<60||!buffer.subarray(0,8).equals(SIGNATURE))
    throw new Error('Invalid or truncated PNG signature');
  let cursor=8,ihdr=null,ended=false,hasIDAT=false;
  const dataChunks=[];
  while(cursor+12<=buffer.length){
    const length=buffer.readUInt32BE(cursor);
    const end=cursor+12+length;
    if(length>64*1024*1024||end>buffer.length)throw new Error('Truncated or oversized PNG chunk');
    const type=buffer.toString('ascii',cursor+4,cursor+8);
    const crcExpected=buffer.readUInt32BE(cursor+8+length);
    const checksum=crc32(buffer.subarray(cursor+4,cursor+8+length));
    if(checksum!==crcExpected)throw new Error('PNG chunk CRC mismatch: '+type);
    if(!ihdr&&type!=='IHDR')throw new Error('PNG must begin with IHDR');
    if(type==='IHDR'){
      if(ihdr||length!==13)throw new Error('Duplicate or invalid PNG IHDR');
      ihdr=buffer.subarray(cursor+8,cursor+21);
    }else if(type==='IDAT'){
      if(!ihdr)throw new Error('PNG IDAT before IHDR');
      hasIDAT=true;
      dataChunks.push(buffer.subarray(cursor+8,cursor+8+length));
    }else if(type==='IEND'){
      if(length!==0||!hasIDAT)throw new Error('Invalid PNG IEND or no image data');
      ended=true;
      cursor=end;
      break;
    }
    cursor=end;
  }
  if(!ihdr||!ended||cursor!==buffer.length)throw new Error('Missing IEND or trailing bytes');
  const width=ihdr.readUInt32BE(0),height=ihdr.readUInt32BE(4);
  const depth=ihdr[8],color=ihdr[9],compression=ihdr[10],filter=ihdr[11],interlace=ihdr[12];
  if(width<1||width>16384||height<1||height>32768)
    throw new Error('PNG dimensions out of bounds');
  if(expectedWidth!==undefined&&width!==expectedWidth)
    throw new Error('PNG screenshot viewport width mismatch: '+width+' != '+expectedWidth);
  if(height<minHeight)throw new Error('PNG screenshot shorter than viewport');
  if(depth!==8||![2,6].includes(color)||compression!==0||filter!==0||interlace!==0)
    throw new Error('Unsupported PNG pixel format: require RGB/RGBA 8-bit noninterlaced');
  const channels=color===2?3:4;
  const expectedSize=(width*channels+1)*height;
  if(expectedSize>100*1024*1024)throw new Error('PNG decompressed size unsafe');
  const decoded=inflateSync(Buffer.concat(dataChunks),{maxOutputLength:expectedSize+1});
  if(decoded.length!==expectedSize)throw new Error('Truncated or unexpected PNG pixel payload');
  for(let row=0;row<height;row++){
    if(decoded[row*(width*channels+1)]>4)throw new Error('Invalid PNG row filter');
  }
  return Object.freeze({width,height,bytes:buffer.length,
    sha256:createHash('sha256').update(buffer).digest('hex')});
}
