// MYTHWROUGHT's compact three-row everyday menu. Original save/vault/mirror
// DOM nodes are MOVED into an explicit recovery drawer, not cloned or removed.
// Existing listeners and their checked storage/repair semantics remain intact.
const make=(tag,cls,text)=>{const n=document.createElement(tag);
  if(cls)n.className=cls;
  if(text!==undefined)n.textContent=text;
  return n;
};
function button(label,handler){
  const element=make('button','player-menu-button',label);
  element.type='button';
  element.addEventListener('click',async()=>{
    if(element.disabled)return;
    element.disabled=true;
    try{await handler();}
    catch(error){
      const panel=element.closest('.player-menu');
      const status=panel?.querySelector(panel.classList.contains('safety-open')?
        '.player-safety-feedback':'.player-menu-status');
      if(status)status.textContent='Action protected: '+String(error?.message||error);
    }finally{element.disabled=false;}
  });
  return element;
}
export function installPlayerMenu({
  container,onDiagnostics,onDay,onNight,onNewWorld,onClose,
  onSave,onExport,onImport,onArchive,onCheckUpdate,isReadOnly
}={}){
  if(!container?.prepend||[onDiagnostics,onDay,onNight,onNewWorld,onClose,
    onSave,onExport,onImport,onArchive,onCheckUpdate,isReadOnly]
    .some(fn=>typeof fn!=='function'))
    throw TypeError('Player settings require actual mounted save and UI callbacks');
  const panel=make('section','player-menu');
  panel.id='playerMenu';
  panel.setAttribute('aria-label','Mythwrought player settings');
  const heading=make('h1','player-menu-heading','✦ MYTHWROUGHT');
  const tagline=make('p','player-menu-tagline','WORLD SETTINGS');
  const diagnostics=make('div','player-menu-row');
  diagnostics.append(make('span','player-menu-label','Test Code'));
  diagnostics.append(button('COPY TEST CODE',onDiagnostics));
  const clock=make('div','player-menu-row');
  clock.append(make('span','player-menu-label','Time of Day'));
  const times=make('div','player-menu-times');
  times.append(button('☀ DAY',onDay),button('☾ NIGHT',onNight));
  clock.append(times);
  const world=make('div','player-menu-row');
  world.append(make('span','player-menu-label','World Generation'));
  world.append(button('✦ NEW WORLD',onNewWorld));
  const status=make('p','player-menu-status','Current accepted generation · saves protected');
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');

  // Backup tools are deliberately discoverable, but are NOT a fourth scrolling
  // development settings section. Only choosing them opens the scrollable drawer.
  const safety=make('section','player-safety');
  safety.id='playerSafety';
  safety.hidden=true;
  safety.setAttribute('aria-label','Saved worlds and recovery');
  const safetyHeading=make('h2','player-safety-heading','✦ SAVED WORLDS & RECOVERY');
  const safetyNote=make('p','player-safety-note');
  const actions=make('div','player-safety-actions');
  actions.append(
    button('SAVE CURRENT WORLD',onSave),
    button('EXPORT CURRENT WORLD',onExport),
    button('IMPORT VERIFIED CURRENT WORLD',onImport)
  );
  // iPhone Home Screen Safari requires the actual DOWNLOAD to be a second
  // trusted user tap, like the existing proven Device Vault export.
  // Preparing the bytes never writes game state and never navigates away.
  let preparedArchiveUrl=null;
  const archiveDownload=make('a','vault-download player-safety-download',
    '↓ DOWNLOAD VERIFIED LOCAL SAVE JSON');
  archiveDownload.hidden=true;
  const archive=button('PREPARE LOCAL SAVE ARCHIVE',()=>{
    const file=onArchive();
    if(typeof file?.text!=='string'||typeof file.filename!=='string'||
       !/^mythwrought-local-saves-\d{4}-\d{2}-\d{2}\.json$/.test(file.filename))
      throw Error('Read-only archive did not produce verified bytes and a safe filename');
    const url=URL.createObjectURL(new Blob([file.text],{type:'application/json'}));
    if(preparedArchiveUrl)URL.revokeObjectURL(preparedArchiveUrl);
    preparedArchiveUrl=url;
    archiveDownload.href=url;
    archiveDownload.download=file.filename;
    archiveDownload.hidden=false;
    safetyFeedback.textContent='Verified '+file.count+
      ' local-save records prepared. Tap DOWNLOAD VERIFIED LOCAL SAVE JSON to save on iPhone.';
  });
  archive.classList.add('player-safety-archive');
  const safetyFeedback=make('p','player-safety-feedback','');
  safetyFeedback.setAttribute('role','status');
  safetyFeedback.setAttribute('aria-live','polite');
  const updater=button('CHECK APP UPDATE',onCheckUpdate);
  const returnSettings=button('← BACK TO SETTINGS',()=>showSafety(false));
  returnSettings.classList.add('player-safety-back');
  safety.append(returnSettings,safetyHeading,safetyNote,archive,
    archiveDownload,safetyFeedback,actions,updater);
  const backing=[...container.querySelectorAll('.vault-settings,.mirror-settings')];
  if(backing.length!==2)throw Error('Original save-vault and mirror controls missing');
  for(const original of backing)safety.append(original);
  const safetyLink=button('⚿ BACKUPS & RECOVERY',()=>showSafety(true));
  safetyLink.classList.add('player-menu-safety-link');
  const back=button('RETURN TO GAME',()=>{showSafety(false);return onClose();});
  back.classList.add('player-menu-close');
  panel.append(heading,tagline,diagnostics,clock,world,status,safetyLink,back,safety);
  container.prepend(panel);
  function showSafety(open){
    if(!open&&preparedArchiveUrl){
      URL.revokeObjectURL(preparedArchiveUrl);
      preparedArchiveUrl=null;
      archiveDownload.hidden=true;
      archiveDownload.removeAttribute('href');
    }
    const blocked=Boolean(isReadOnly());
    actions.hidden=blocked;
    // IndexedDB vault snapshots are independently retained. Their list and
    // verified JSON download must remain available even when the CURRENT
    // playable world is a protected preview of obsolete/damaged terrain.
    // All mutating operations are blocked in the actual event handlers too;
    // a disabled button alone is never a data-safety boundary.
    const [vault,mirror]=backing;
    vault.hidden=false;
    mirror.hidden=false;
    for(const [root,ids] of [
      [vault,['vaultBackup','vaultRestore','vaultDelete']],
      [mirror,['mirrorSync','mirrorRestore','mirrorEnabled']]
    ]){
      for(const id of ids){
        const control=root.querySelector('#'+id);
        if(!control)throw Error('Original backup recovery action missing: '+id);
        control.disabled=blocked;
      }
    }
    safetyNote.textContent=blocked?
      'Older/damaged worlds remain archived. Download raw local saves, or inspect and download original IndexedDB vault AND mirror snapshots below. All save, sync, restore, and delete actions are disabled.':
      'Download localStorage saves here. IndexedDB device-vault and mirrored snapshots need separate downloads below.';
    panel.classList.toggle('safety-open',Boolean(open));
    safety.hidden=!open;
    return open;
  }
  return Object.freeze({
    panel,safety,openSafety:()=>showSafety(true),
    closeSafety:()=>showSafety(false),
    showStatus:message=>{status.textContent=message;safetyFeedback.textContent=message;}
  });
}
