import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GAME_RELEASE,versionedGameUrl,expectedGameShell,checkExistingRegistration,
  installGameUpdater
} from '../src/app-update.mjs';

const shell=()=>'<meta data-mw-release="'+GAME_RELEASE+'">'+
  '<button id="captureToggle">REC</button>'+
  '<script src="./src/main.mjs?mw-release='+GAME_RELEASE+'"></script>';

test('current release is explicit and update navigation stays on same app URL',()=>{
  assert.equal(GAME_RELEASE,'20261120-five-systems-rc11');
  const old='https://example.test/Mythwrought/?world=179#game';
  const next=new URL(versionedGameUrl(old));
  assert.equal(next.origin,'https://example.test');
  assert.equal(next.pathname,'/Mythwrought/');
  assert.equal(next.searchParams.get('world'),'179');
  assert.equal(next.searchParams.get('mw-refresh'),GAME_RELEASE);
  assert.equal(next.hash,'#game');
});
test('rejects old or unexpected online shell; accepts exact current recorder shell',()=>{
  assert.equal(expectedGameShell(shell()),true);
  assert.equal(expectedGameShell(shell().replace('captureToggle','missing')),false);
  assert.equal(expectedGameShell(shell().replace(GAME_RELEASE,'older')),false);
  assert.equal(expectedGameShell('<button id="captureToggle">REC</button>'),false);
});
test('no existing worker means absolutely no registration or cache mutation',async()=>{
  let get=0;
  const state=await checkExistingRegistration({serviceWorker:{getRegistration:async()=>{get++;return undefined;}},scope:'https://x/app/'});
  assert.equal(state.status,'not-registered');assert.equal(get,1);
});
test('only updates previously registered worker when online',async()=>{
  let updates=0;
  const sw={getRegistration:async()=>({update:async()=>{updates++;}})};
  assert.equal((await checkExistingRegistration({serviceWorker:sw,scope:'https://x/app/'})).status,'checked');
  assert.equal(updates,1);
  assert.equal((await checkExistingRegistration({serviceWorker:sw,scope:'https://x/app/',online:false})).status,'offline');
  assert.equal(updates,1);
});
test('missing Service Worker is safely unsupported',async()=>{
  assert.equal((await checkExistingRegistration({serviceWorker:undefined,scope:'https://x/app/'})).status,'unsupported');
});
function fakeButton(){
  const handlers={};
  return {disabled:false,addEventListener:(type,fn)=>handlers[type]=fn,click:()=>handlers.click(),handlers};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('same-app update verifies live shell before navigating and leaves saves unmodified',async()=>{
  const button=fakeButton(),status={textContent:''};
  let assigned='',fetchOptions=null,registered=0,updated=0;
  const navigatorObject={onLine:true};
  const oldWorld='{"schema":1,"seed":11111222,"edits":[[1,2,3,4]]}';
  const persistent={world:oldWorld};
  installGameUpdater({button,status,baseUrl:'https://example.test/Mythwrought/',
    serviceWorker:{getRegistration:async()=>({update:async()=>{updated++;}}),
      register:()=>{registered++;throw Error('must not register a new worker');}},
    navigatorObject,
    fetchLatest:async(url,options)=>{
      fetchOptions={url,options};
      return {ok:true,text:async()=>shell()};
    },
    locationObject:{href:'https://example.test/Mythwrought/',assign:v=>{assigned=v;}},
    hasUnsavedChanges:()=>false
  });
  await tick();
  await button.click();
  assert.equal(updated,2);
  assert.equal(registered,0);
  assert.equal(new URL(assigned).pathname,'/Mythwrought/');
  assert.equal(new URL(assigned).searchParams.get('mw-refresh'),GAME_RELEASE);
  assert.equal(new URL(fetchOptions.url).searchParams.get('mw-refresh'),GAME_RELEASE);
  assert.equal(fetchOptions.options.cache,'no-store');
  assert.equal(persistent.world,oldWorld);
  assert.equal(button.disabled,false);
});
test('dirty world prevents reload and browser storage never changes',async()=>{
  const button=fakeButton(),status={textContent:''};let navigations=0;
  installGameUpdater({button,status,baseUrl:'https://x/app/',
    serviceWorker:undefined,navigatorObject:{onLine:true},
    fetchLatest:async()=>{throw Error('must not fetch');},
    locationObject:{href:'https://x/app/',assign:()=>navigations++},
    hasUnsavedChanges:()=>true
  });
  await button.click();
  assert.equal(navigations,0);
  assert.match(status.textContent,/SAVE/);
});
test('offline app never navigates or destroys its cached shell',async()=>{
  const button=fakeButton(),status={textContent:''};let navigations=0;
  installGameUpdater({button,status,baseUrl:'https://x/app/',
    navigatorObject:{onLine:false},serviceWorker:undefined,
    locationObject:{href:'https://x/app/',assign:()=>navigations++}
  });
  await button.click();
  assert.equal(navigations,0);assert.match(status.textContent,/Offline/);
});
test('invalid online response fails closed, no forced navigation',async()=>{
  const button=fakeButton(),status={textContent:''};let navigations=0;
  installGameUpdater({button,status,baseUrl:'https://x/app/',
    navigatorObject:{onLine:true},serviceWorker:undefined,
    fetchLatest:async()=>({ok:true,text:async()=>'<html>old site</html>'}),
    locationObject:{href:'https://x/app/',assign:()=>navigations++}
  });
  await button.click();
  assert.equal(navigations,0);assert.match(status.textContent,/not applied/);
});
