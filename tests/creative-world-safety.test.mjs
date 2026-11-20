import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReadOnlyGameArchive,inspectReadOnlyGameArchive,GAME_ARCHIVE_FORMAT}
  from '../src/creative-integration/world-safety.mjs';

function storage(rows){
  const values=new Map(rows),writes=[];
  return {get length(){return values.size;},
    key:i=>[...values.keys()][i]??null,
    getItem:k=>values.has(k)?values.get(k):null,
    setItem:(k,v)=>writes.push([k,v]),writes};
}
test('read-only archive covers every actual Mythwrought world/sidecar byte but never other Pages apps',()=>{
  const rows=[
    ['mythwrought-v001-world','damaged raw original legacy bytes'],
    ['mythwrought-v002-selected-seed','179'],
    ['mythwrought-v002-world-179','{"schema":1,"edits":[]}'],
    ['mythwrought-v002-world-179-backup-v009','unaltered backup bytes'],
    ['mythwrought-caves-v1-seed-179','separate cave sidecar'],
    ['mythwrought-mobs-v1-seed-179','creature check'],
    ['mythwrought.pack5.builder.seed.179','interior construction'],
    ['mythwrought-v010-test-probe','diagnostic scratch'],
    ['unwritten-realms-save','another game is not part of this archive'],
    ['https://hdog960.github.io','not part of the saved game']
  ];
  const device=storage(rows),at='2026-11-20T19:00:00.000Z';
  const archive=buildReadOnlyGameArchive(device,at);
  assert.equal(archive.filename,'mythwrought-all-worlds-2026-11-20.json');
  const saved=inspectReadOnlyGameArchive(archive.text);
  assert.equal(JSON.parse(archive.text).format,GAME_ARCHIVE_FORMAT);
  assert.deepEqual(Object.fromEntries(saved.entries),
    Object.fromEntries(rows.filter(([key])=>key.startsWith('mythwrought'))));
  assert.equal(archive.count,8);
  assert.deepEqual(device.writes,[],'Recovery download must not mutate any local world');
});
test('archive inspection fails closed on corruption, duplicates and foreign origin keys',()=>{
  const archive=buildReadOnlyGameArchive(storage([
    ['mythwrought-v002-world-1','live world']]));
  assert.throws(()=>inspectReadOnlyGameArchive(archive.text.replace('live world','corrupted world')),
    /checksum/);
  const envelope=JSON.parse(archive.text);
  const corrupted=JSON.stringify({...envelope,checksum:'00000000'});
  assert.throws(()=>inspectReadOnlyGameArchive(corrupted),/checksum/);
  assert.throws(()=>inspectReadOnlyGameArchive('not JSON'),SyntaxError);
  assert.throws(()=>buildReadOnlyGameArchive({
    length:1,key:()=> 'mythwrought-v002-world-1',getItem:()=>null
  }),/changed/);
  assert.throws(()=>buildReadOnlyGameArchive({getItem(){return 'x';}}),/enumeration/);
});
