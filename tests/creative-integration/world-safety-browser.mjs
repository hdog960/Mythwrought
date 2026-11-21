// Genuine current-generation safety gate acceptance on the actual WebGL2 app.
// Original schema-1 bytes are authored by its real VoxelWorld serializer,
// NOT a synthetic replacement game. No production writes or deployments.
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
import {chromium} from 'playwright';
import {VoxelWorld,BLOCK} from '../../src/voxel.mjs';
import {M6_BALANCED_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {inspectReadOnlyGameArchive} from '../../src/creative-integration/world-safety.mjs';

const origin=process.env.CREATIVE_BROWSER_ORIGIN||'http://127.0.0.1:4174';
const legacy=new VoxelWorld(179);
assert.equal(legacy.set(2,15,2,BLOCK.CRYSTAL),true);
const original=JSON.stringify(legacy.save()),seed=179;
mkdirSync('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader','--disable-dev-shm-usage'
]});
try{
  const context=await browser.newContext({viewport:{width:956,height:440},
    hasTouch:true,isMobile:true,deviceScaleFactor:1,acceptDownloads:true});
  try{
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('#playerMenu').waitFor({state:'visible',timeout:30000});
    await page.evaluate(raw=>{
      localStorage.setItem('mythwrought-v002-selected-seed','179');
      localStorage.setItem('mythwrought-v002-world-179',raw);
      localStorage.setItem('mythwrought-v002-world-179-backup-v009','unaltered old backup');
    },original);
    // This is a genuine independently checked IndexedDB snapshot built from
    // the original VoxelWorld schema-1 serializer, not a forged vault row.
    const oldVault=await page.evaluate(raw=>
      import('./src/vault.mjs').then(mod=>mod.createVaultBackup(raw)),original);
    assert.equal(oldVault.seed,179);
    const oldMirror=await page.evaluate(raw=>
      import('./src/mirror.mjs').then(mod=>mod.writeMirror(raw)),original);
    assert.equal(oldMirror.seed,179,'Genuine original mirror did not persist');
    await page.reload({waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('#playerMenu').waitFor({state:'visible',timeout:30000});
    assert.equal(await page.locator('#help').isVisible(),true,
      'Legacy generator cannot enter live Creative gameplay');
    await page.screenshot({path:'artifacts/mythwrought-legacy-readonly-956x440.png'});
    await page.getByRole('button',{name:'RETURN TO GAME'}).click();
    assert.equal(await page.locator('#help').isVisible(),true,
      'Read-only gate must not be dismissed to render obsolete terrain');
    await page.locator('.player-menu-safety-link').click();
    assert.equal(await page.locator('#playerSafety').isVisible(),true);
    assert.equal(await page.locator('.player-safety-actions').isVisible(),false,
      'Old-world protection must block save/export/import on the read-only preview');
    assert.equal(await page.locator('#vaultRefresh').isVisible(),true,
      'Old-world gate concealed independently verified IndexedDB vault snapshots');
    for(const id of ['vaultBackup','vaultRestore','vaultDelete'])
      assert.equal(await page.locator('#'+id).isEnabled(),false,
        'Mutating vault action must remain disabled during protected preview: '+id);
    await page.locator('#vaultRefresh').click();
    await page.waitForFunction(()=>
      [...document.querySelector('#vaultSelect').options].some(x=>x.textContent.includes('Seed 179')),
      undefined,{timeout:15000});
    await page.locator('#vaultSelect').selectOption(oldVault.id);
    await page.locator('#vaultPrepare').click();
    await page.locator('#vaultDownloadLink').waitFor({state:'visible',timeout:15000});
    const vaultDownload=page.waitForEvent('download',{timeout:20000});
    await page.locator('#vaultDownloadLink').click();
    const originalVaultDownload=await vaultDownload;
    assert.equal(readFileSync(await originalVaultDownload.path(),'utf8'),original,
      'Verified historical IndexedDB JSON download changed even one original save byte');
    // Bypassing disabled DOM buttons is not sufficient: mutation handlers must
    // also reject direct invocation while an obsolete world is protected.
    const denied=await page.evaluate(async()=>{
      await document.getElementById('vaultDelete').onclick();
      return document.getElementById('vaultStatus').textContent;
    });
    assert.match(denied,/Protected old world/,
      'Historical vault deletion was not rejected inside the actual handler');
    assert.equal(await page.evaluate(async id=>
      (await import('./src/vault.mjs')).inspectVaultBackup(id).then(x=>x.raw),oldVault.id),
      original,'Rejected vault deletion removed or corrupted historical snapshot');
    // The opt-in legacy mirror may hold a previous good copy that exists only
    // in IndexedDB. Read the archived selected seed, never the V6 preview seed.
    assert.equal(await page.locator('#mirrorCheck').isVisible(),true,
      'Protected startup hid the original IndexedDB mirror export');
    for(const id of ['mirrorSync','mirrorRestore','mirrorEnabled'])
      assert.equal(await page.locator('#'+id).isEnabled(),false,
        'Read-only mirror write control unexpectedly enabled: '+id);
    await page.locator('#mirrorCheck').click();
    await page.waitForFunction(()=>
      document.getElementById('mirrorStatus').textContent.includes('Seed 179 (archived read-only)'),
      undefined,{timeout:15000});
    await page.locator('#mirrorPrepare').click();
    await page.locator('#mirrorDownload').waitFor({state:'visible',timeout:15000});
    const mirrorDownload=page.waitForEvent('download',{timeout:20000});
    await page.locator('#mirrorDownload').click();
    const mirrored=await mirrorDownload;
    assert.equal(readFileSync(await mirrored.path(),'utf8'),original,
      'IndexedDB mirror downloaded different legacy save bytes');
    const deniedMirror=await page.evaluate(async()=>{
      await document.getElementById('mirrorRestore').onclick();
      return document.getElementById('mirrorStatus').textContent;
    });
    assert.match(deniedMirror,/Protected older-world preview/,
      'Direct mirror restore was not rejected in real protected-world handler');
    assert.equal(await page.evaluate(async()=>
      (await import('./src/mirror.mjs')).getMirrorCopy(179).then(x=>x.raw)),
      original,'Rejected mirror restore corrupted the archived verified snapshot');
    await page.locator('.player-safety-archive').click();
    await page.locator('.player-safety-download').waitFor({state:'visible',timeout:15000});
    const downloadPromise=page.waitForEvent('download',{timeout:20000});
    await page.locator('.player-safety-download').click();
    const download=await downloadPromise;
    const archive=inspectReadOnlyGameArchive(readFileSync(await download.path(),'utf8'));
    const records=new Map(archive.entries);
    assert.equal(records.get('mythwrought-v002-world-179'),original,
      'The complete immutable original schema-1 save was absent from the recovery archive');
    assert.equal(records.get('mythwrought-v002-world-179-backup-v009'),
      'unaltered old backup','Old verified backup bytes were not preserved');
    assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')),
      original,'Recovery archive changed the original world');
    await page.locator('.player-safety-back').click();
    page.once('dialog',dialog=>dialog.accept());
    await page.getByRole('button',{name:/NEW WORLD/}).click();
    await page.locator('#help').waitFor({state:'hidden',timeout:30000});
    const current=await page.evaluate(()=>{
      const seed=localStorage.getItem('mythwrought-v002-selected-seed');
      return {seed,world:localStorage.getItem('mythwrought-v002-world-'+seed),
        preserved:localStorage.getItem('mythwrought-v002-world-179'),
        profile:window.__mythwroughtTest?.fourBiomeProfile?.()?.generator};
    });
    assert.notEqual(current.seed,'179','Fresh current world reused the archived legacy seed');
    assert.equal(current.preserved,original,'New V6 world overwrote original legacy data');
    assert.ok(current.world,'Fresh current V6 world lacks a verified schema-1 save');
    assert.equal(current.profile,M6_BALANCED_GENERATOR,
      'The newly entered world does not run the accepted current generator');

    // Genuine IndexedDB history must still be downloadable AFTER creating a
    // new current-gen V6 world. No archived mirror may become playable.
    await page.locator('#menu').click();
    await page.locator('.player-menu-safety-link').click();
    await page.locator('#mirrorArchiveRefresh').click();
    await page.waitForFunction(()=>
      [...document.getElementById('mirrorArchiveSeed').options]
        .some(option=>option.value==='179'),undefined,{timeout:15000});
    await page.locator('#mirrorArchiveSeed').selectOption('179');
    assert.equal(await page.locator('#mirrorRestore').isEnabled(),false,
      'Archived mirror became restorable after selecting a current V6 world');
    await page.locator('#mirrorCheck').click();
    await page.waitForFunction(()=>
      document.getElementById('mirrorStatus').textContent.includes('Seed 179 (archived read-only)'),
      undefined,{timeout:15000});
    await page.locator('#mirrorPrepare').click();
    await page.locator('#mirrorDownload').waitFor({state:'visible',timeout:15000});
    const archivedDownload=page.waitForEvent('download',{timeout:20000});
    await page.locator('#mirrorDownload').click();
    const archivedFile=await archivedDownload;
    assert.equal(readFileSync(await archivedFile.path(),'utf8'),original,
      'New V6 world made archived mirror unavailable or changed its bytes');
    await page.screenshot({path:'artifacts/mythwrought-archived-mirror-956x440.png'});
    assert.equal(await page.evaluate(async()=>
      (await import('./src/mirror.mjs')).getMirrorCopy(179).then(x=>x.raw)),original);
    assert.equal(await page.evaluate(()=>
      localStorage.getItem('mythwrought-v002-world-179')),original);
    // File imports use real original file-change handlers, not fabricated
    // methods. Old schema-1 backups must NOT replace this current world.
    await page.locator('#importFile').setInputFiles({
      name:'archived-legacy-world.json',mimeType:'application/json',
      buffer:Buffer.from(original)
    });
    await page.waitForFunction(()=>document.getElementById('status')?.textContent
      .includes('Import rejected'),undefined,{timeout:10000});
    const unchanged=await page.evaluate(()=>{
      const seed=localStorage.getItem('mythwrought-v002-selected-seed');
      return {seed,current:localStorage.getItem('mythwrought-v002-world-'+seed),
        legacy:localStorage.getItem('mythwrought-v002-world-179')};
    });
    assert.equal(unchanged.seed,current.seed,'Legacy import changed active world identity');
    assert.equal(unchanged.current,current.world,'Legacy import overwrote current world');
    assert.equal(unchanged.legacy,original,'Legacy import rewrote the archived source');
    await page.reload({waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForFunction(generator=>window.__mythwroughtTest?.fourBiomeProfile?.()?.generator===generator,
      M6_BALANCED_GENERATOR,{timeout:40000});
    assert.equal(await page.locator('#help').isVisible(),false,
      'Installed current V6 world did not resume normally on same-install reload');
    assert.deepEqual(errors,[],'Real-world rendering or safety gate raised browser exceptions');
    console.log('PASS current-generation startup / old-world archive / rejected legacy import / same-install reload');
  }finally{await context.close();}
}finally{await browser.close();}
