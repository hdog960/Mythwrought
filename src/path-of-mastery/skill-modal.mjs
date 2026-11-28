// Host owns the game input lease. No global gameplay listeners or production imports.
import {mountSkillPanel} from './skill-panel.mjs';
export function mountFixtureSkillModal({root,session,acquireInput,onClose=()=>{}}={}){
  if(!root?.ownerDocument||typeof acquireInput!=='function'||!session?.view||!session?.actions)throw Error('Invalid modal host');
  const doc=root.ownerDocument,previous=doc.activeElement,release=acquireInput();if(typeof release!=='function')throw Error('Input lease required');
  let panel,closed=false;
  const shell=doc.createElement('div');shell.className='pm-modal';shell.setAttribute('role','dialog');shell.setAttribute('aria-modal','true');shell.setAttribute('aria-label','Path of Mastery');shell.tabIndex=-1;
  function close(){if(closed)return;closed=true;try{panel?.destroy();}finally{shell.remove();try{session.close();}finally{release();if(previous?.isConnected)previous.focus();onClose();}}}
  try{root.append(shell);panel=mountSkillPanel({root:shell,view:session.view,actions:session.actions,onClose:close});
    shell.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return;}if(e.key!=='Tab')return;
      const items=[...shell.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]')].filter(x=>x.getClientRects().length);if(!items.length){e.preventDefault();shell.focus();return;}const first=items[0],last=items.at(-1);if(e.shiftKey&&(doc.activeElement===first||!shell.contains(doc.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(doc.activeElement===last||!shell.contains(doc.activeElement))){e.preventDefault();first.focus();}});
    shell.querySelector('button')?.focus();return Object.freeze({close,refresh:panel.refresh});
  }catch(e){close();throw e;}
}
