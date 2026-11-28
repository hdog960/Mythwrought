// Run on an approved isolated HTTP(S) origin, with a fresh fixture scope and imported skill-panel.css.
import {openFixtureStorage} from '../../src/path-of-mastery/fixture-storage.mjs';
import {createFixtureReplay} from '../../src/path-of-mastery/replay-bridge.mjs';
import {createAtomicFixtureSkillSession} from '../../src/path-of-mastery/guarded-allocation.mjs';
import {COMPLETE_TREES} from '../../src/path-of-mastery/complete-trees.mjs';
import {mountFixtureSkillModal} from '../../src/path-of-mastery/skill-modal.mjs';
export async function runSession11Browser({root,indexedDB,scope}){
  let checks=0,leases=0;const assert=(ok,msg)=>{if(!ok)throw Error(msg);checks++;};
  const proof={},readContext=()=>({scope,mode:'survival',writable:true,inCombat:false,hostileEngagement:false});
  const open=()=>openFixtureStorage({indexedDB,scope,producer:'mine',sharedClaims:true,verify:t=>t===proof?'natural:fixture-vein':null,readContext});
  const replay=storage=>createFixtureReplay({scope,source:'mine',skill:'pm:mining',amount:4946060,storage,readContext});
  const create=storage=>createAtomicFixtureSkillSession({scope,ledger:replay(storage),readLedgerBytes:storage.read,readContext,storageFor:id=>storage.specializationPort(id),definitions:COMPLETE_TREES});
  const wait=async predicate=>{for(let i=0;i<100;i++){if(predicate())return;await new Promise(r=>setTimeout(r,25));}throw Error('UI wait timed out');};
  const button=label=>[...root.querySelectorAll('button')].find(b=>b.textContent===label),click=label=>{const b=button(label);if(!b||b.disabled)throw Error('Unavailable '+label);b.click();};
  const db=await open();let modal;
  try{assert((await db.record(proof)).ok,'fresh committed fixture event');assert((await replay(db).replayNext()).ok,'fixture replay');
    const session=create(db);modal=mountFixtureSkillModal({root,session,acquireInput:()=>{leases++;return ()=>{leases--;};}});
    await wait(()=>button('◆ gathering'));click('◆ gathering');await wait(()=>button('Mining · 99'));click('Mining · 99');await wait(()=>button('Stonecraft · 0/3'));
    click('Stonecraft · 0/3');click('Purchase rank');await wait(()=>button('Stonecraft · 1/3'));assert(leases===1,'input lease active');assert(root.textContent.includes('Mastery · 5/120 milestones'),'mastery displayed');
    root.querySelector('.pm-preset-name').value='Stone';click('Save preset');await wait(()=>root.querySelector('.pm-presets')?.value==='Stone');
    click('Preview respec');await wait(()=>button('Confirm free respec')&&!button('Confirm free respec').disabled);click('Confirm free respec');await wait(()=>button('Stonecraft · 0/3'));
    assert((await session.view.read('gathering','pm:mining')).allocation.spent===0,'actual respec');modal.close();modal=null;assert(leases===0,'input lease released');db.close();
    const again=await open();try{const reopened=create(again),v=await reopened.view.read('gathering','pm:mining');assert(v.skill.level===99&&v.allocation.presets.includes('Stone'),'reopened storage');assert((await reopened.actions.applyPreset('pm:mining',v.allocation.revision,'Stone')).view.spent===1,'preset restored');assert((await reopened.view.read('gathering','pm:mining')).skill.xp===4946060,'XP unchanged');reopened.close();}finally{again.close();}
  }finally{modal?.close();db.close();}return checks;
}
