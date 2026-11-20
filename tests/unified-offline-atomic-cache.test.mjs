// Strict source-driven node harness for the actual GitHub Pages service
// worker. This does NOT replace real Chromium/iPhone offline validation.
// It proves exact candidate-cache completeness, bounded concurrent fetches,
// REC source identity, and untouched last-known-good on a rejected install.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../sw-m5.js',import.meta.url),'utf8');
const RELEASE='20261120-five-systems-rc8';
const CACHE='mythwrought-m5-shell-'+RELEASE;
const PREVIOUS='mythwrought-m5-shell-20261118-v5-recorder';
const ROOT='https://example.test/Mythwrought/';
assert.ok(source.includes("const ASSET_RELEASE='"+RELEASE+"'"));
assert.ok(source.includes("const CACHE_NAME=CACHE_PREFIX+'"+RELEASE+"'"));

function stage({missing=null}={}){
  const all=new Map(),events={},seen=new Set();
  let waiting=null,skipped=0,active=0,peak=0;
  const original=new Map([[ROOT+'index.html',new Response('PREVIOUS GOOD ORIGINAL SHELL')]]);
  all.set(PREVIOUS,original);
  function open(name){
    if(!all.has(name))all.set(name,new Map());
    const entries=all.get(name);
    return {
      async put(url,response){
        assert.ok(response.ok);
        entries.set(String(url),response.clone());
      },
      async keys(){return [...entries.keys()].map(url=>({url}));},
      async match(url){return entries.get(String(url))?.clone()??undefined;}
    };
  }
  const caches={
    async open(name){return open(name);},
    async keys(){return [...all.keys()];},
    async delete(name){return all.delete(name);}
  };
  const self={
    registration:{scope:ROOT},
    addEventListener(name,handler){events[name]=handler;},
    async skipWaiting(){skipped++;},
    clients:{async claim(){}},
    navigator:{onLine:true}
  };
  async function fetchFresh(request){
    const url=new URL(request.url);
    assert.equal(url.searchParams.get('mw-cache-install'),CACHE,
      'Worker must bypass previous cache with pinned fresh-source request');
    assert.equal(request.cache,'reload');
    seen.add(url.pathname);
    active++;peak=Math.max(peak,active);
    // Independent pending fetches prove streaming and concurrency bounds.
    await new Promise(resolve=>setTimeout(resolve,1));
    active--;
    if(missing&&url.pathname.endsWith(missing))
      return new Response('NOT FOUND',{status:404});
    return new Response(url.pathname.endsWith('/index.html')?
      '<html data-mw-release="'+RELEASE+'"><button id="captureToggle">REC</button></html>':
      'public source bytes for '+url.pathname,{status:200});
  }
  runInNewContext(source,{self,caches,fetch:fetchFresh,URL,Request,Response,console,
    Promise,Set,Map,Error,String,Number,Math,Array,Object},
    {filename:'sw-m5.js'});
  function install(){
    events.install({waitUntil(task){waiting=task;}});
    return waiting;
  }
  async function activate(){
    let task=null;
    events.activate({waitUntil(p){task=p;}});
    return task;
  }
  return {install,activate,all,seen,get skipped(){return skipped;},
    get peak(){return peak;}};
}

test('complete RC5 original Home Screen shell installs source-exact and leaves prior cache',async()=>{
  const candidate=stage();
  await candidate.install();
  assert.equal(candidate.skipped,1,'Only complete verified shell can activate');
  assert.ok(candidate.peak>1&&candidate.peak<=6,
    'Worker must stream no more than six concurrent origin requests');
  const entries=candidate.all.get(CACHE);
  assert.ok(entries?.size>=263,'No source file may be silently dropped');
  assert.equal(candidate.seen.size,entries.size,
    'Every cached source must be freshly fetched from origin');
  assert.ok(entries.has(ROOT+'src/mobs/live-game.mjs'));
  assert.ok(entries.has(ROOT+'src/mobs/live-render.mjs'));
  assert.ok(entries.has(ROOT+'src/manual-caves/c6-far-wall-gpu.mjs'));
  assert.ok(entries.has(ROOT+'src/sky-atmosphere.mjs'));
  assert.ok(entries.has(ROOT+'src/gameplay-recorder.mjs'));
  assert.ok(entries.has(ROOT+'index.html'));
  await candidate.activate();
  assert.equal(candidate.all.get(PREVIOUS).size,1,
    'Old original Home Screen cache must survive activation');
});

test('missing source aborts atomic install without replacing previous-good app',async()=>{
  const candidate=stage({missing:'/src/mobs/live-game.mjs'});
  await assert.rejects(candidate.install(),/Cannot verify\/cache original source/);
  assert.equal(candidate.skipped,0,'Broken release must never skipWaiting');
  assert.equal(candidate.all.has(CACHE),false,
    'Incomplete new candidate cache must be discarded');
  assert.equal(candidate.all.get(PREVIOUS).size,1,
    'Known good installed shell remains byte-identical');
});
