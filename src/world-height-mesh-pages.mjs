// Bounded triangle-aligned CPU emission pages; never extra GPU owners.
import {UPPER_SECTION_BYTES} from './world-height-budget.mjs';
export const UPPER_PAGE_BYTES=216*1024;
export class UpperMeshPages{
 #pages=[];#used=0;#page=null;
 get vertexCount(){return this.#used/9;}
 get pageCount(){return this.#pages.length;}
 append(x,y,z,r,g,b,u,v,id){
  if(this.#used*4+36>UPPER_SECTION_BYTES)throw Error('Upper mesh exceeds original staging budget');
  const offset=this.#used%(UPPER_PAGE_BYTES/4);
  if(!offset){this.#page=new Float32Array(UPPER_PAGE_BYTES/4);this.#pages.push(this.#page);}
  const p=this.#page;
  p[offset]=x;p[offset+1]=y;p[offset+2]=z;p[offset+3]=r;p[offset+4]=g;p[offset+5]=b;p[offset+6]=u;p[offset+7]=v;p[offset+8]=id;
  this.#used+=9;
 }
 finish(){
  if(this.#used%27)throw Error('Incomplete upper triangle');
  const out=new Float32Array(this.#used);let at=0;
  for(const page of this.#pages){const n=Math.min(page.length,out.length-at);out.set(page.subarray(0,n),at);at+=n;}
  this.#pages=[];this.#page=null;return out;
 }
}
