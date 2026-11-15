// Pack 3 material selector stays in the existing accessible settings panel.
// This never takes space from the two landscape touch rails.
import {PACK3_BUILDER_SYMBOLS,resolvePack3BuilderAsset} from './pack3.mjs';

export function installPack3Palette(help,onChoose){
  if(!help?.querySelector||typeof onChoose!=='function')
    throw new TypeError('Invalid Pack 3 palette host');
  const panel=document.createElement('section');
  panel.className='looksetting';
  panel.setAttribute('aria-label','Pack 3 physical building palette');
  const title=document.createElement('h2');
  title.className='audit-title';title.textContent='PACK 3 · PHYSICAL BUILDING BLOCKS';
  const note=document.createElement('p');
  note.className='controlhint';
  note.textContent='Choose an approved building block and direction. Tap RETURN to use the normal PLACE button. Physical blocks save in a separate seed-bound record.';
  const materialLabel=document.createElement('label');
  materialLabel.textContent='Building block';
  const material=document.createElement('select');
  material.id='pack3Material';
  material.setAttribute('aria-label','Pack 3 physical material');
  material.add(new Option('Select a Pack 3 block',''));
  for(const symbol of PACK3_BUILDER_SYMBOLS){
    const a=resolvePack3BuilderAsset(symbol);
    material.add(new Option(a.name+' · ID '+a.blockId,String(a.blockId)));
  }
  materialLabel.append(material);
  const rotationLabel=document.createElement('label');
  rotationLabel.textContent='Physical orientation';
  const yaw=document.createElement('select');
  yaw.id='pack3Rotation';
  yaw.setAttribute('aria-label','Physical block rotation');
  for(const [i,label] of ['North 0°','East 90°','South 180°','West 270°'].entries())
    yaw.add(new Option(label,String(i)));
  yaw.value='0';yaw.disabled=true;
  rotationLabel.append(yaw);
  panel.append(title,note,materialLabel,rotationLabel);
  const host=help.querySelector('.helpbody');
  if(!host)throw Error('Missing Mythwrought settings host');
  host.insertBefore(panel,host.querySelector('.seedselect'));
  const choose=()=>{
    const id=Number(material.value);
    if(!id)return;
    if(id<=112){yaw.value='0';yaw.disabled=true;}
    else yaw.disabled=false;
    onChoose(id,Number(yaw.value));
  };
  material.addEventListener('change',choose);
  yaw.addEventListener('change',choose);
  return Object.freeze({
    clear(){material.value='';},
    get id(){return Number(material.value)||0;},
    get yaw(){return Number(yaw.value)||0;},
    material,yaw
  });
}
