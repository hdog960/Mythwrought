// A deterministic full local-column traversal for narrow underground passages.
// Species/rarity retain the original independent population draw. Each 256
// serial window covers every chunk column once, with a seed-specific order.
export function caveSpawnColumn(seed,cx,cz,section,serial){
  const cycle=Math.floor((serial-1)/256),offset=(serial-1)%256;
  let n=(seed|0)^Math.imul(cx,0x9e3779b9)^Math.imul(cz,0x85ebca6b)^
    Math.imul(section,0xc2b2ae35)^Math.imul(cycle+1,0x27d4eb2d)^0x58d7a32b;
  n=Math.imul(n^(n>>>16),0x7feb352d);
  n=Math.imul(n^(n>>>15),0x846ca68b);
  n=(n^(n>>>16))>>>0;
  const index=((n&255)+(((n>>>8)&255)|1)*offset)&255;
  return [index&15,index>>>4];
}
