// Pack 3 material selector stays in the existing accessible settings panel.
// This never takes space from the two landscape touch rails.
import {PACK3_BUILDER_SYMBOLS,resolvePack3BuilderAsset} from './pack3.mjs';

export function installPack3Palette(help,onChoose,{onExport=null,onImport=null}={}){
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
  if(onExport||onImport){
    if(typeof onExport!=='function'||typeof onImport!=='function')
      throw new TypeError('Pack 3 portable actions must be paired');
    const actions=document.createElement('div');actions.className='helpbuttons';
    const exportButton=document.createElement('button');
    exportButton.type='button';exportButton.id='pack3Export';
    exportButton.textContent='EXPORT PACK 3';
    const importButton=document.createElement('button');
    importButton.type='button';importButton.id='pack3Import';
    importButton.textContent='IMPORT PACK 3';
    const file=document.createElement('input');
    file.type='file';file.id='pack3ImportFile';file.hidden=true;
    file.accept='.json,application/json';
    const status=document.createElement('p');
    status.className='controlhint';status.id='pack3BackupStatus';
    status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    status.textContent='Pack 3 uses a separate physical-construction save. EXPORT WORLD does not include these blocks.';
    actions.append(exportButton,importButton);
    panel.append(actions,file,status);
    exportButton.addEventListener('click',()=>{
      try{
        const payload=onExport();
        const blob=new Blob([payload.raw],{type:'application/json'});
        const url=URL.createObjectURL(blob),anchor=document.createElement('a');
        anchor.href=url;anchor.download='mythwrought-pack3-seed-'+payload.seed+'.json';
        document.body.append(anchor);anchor.click();anchor.remove();
        setTimeout(()=>URL.revokeObjectURL(url),3000);
        status.textContent='Physical construction backup prepared for seed '+payload.seed+'. Keep this file with your regular world export.';
      }catch(error){status.textContent='Pack 3 backup not exported: '+String(error.message||error);}
    });
    importButton.addEventListener('click',()=>file.click());
    file.addEventListener('change',async()=>{
      const chosen=file.files?.[0];if(!chosen)return;
      importButton.disabled=true;exportButton.disabled=true;
      try{
        if(chosen.size>450000)throw Error('Pack 3 backup file is too large');
        const result=await onImport(await chosen.text());
        status.textContent=result?.message||'Pack 3 restore completed. Reload required.';
      }catch(error){status.textContent='Pack 3 restore rejected; data preserved: '+String(error.message||error);}
      finally{file.value='';importButton.disabled=false;exportButton.disabled=false;}
    });
  }
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
