// Independent, source-authentic WebGL2 PNG contrast and camera-parity audit.
// Fail closed if a real M7 glacier field is absent or remains deeply blue
// after the frost treatment. No game world, texture or saved file changes.
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import pngjs from 'pngjs';
const out='artifacts/snowy-s0-provenance';
const digest=b=>createHash('sha256').update(b).digest('hex');
const result={kind:'strict-snow-s1-multiseed-visual-parity',
  exactHead:process.env.SNOW_EXPECTED_HEAD??null,
  comparisons:[]};
for(const seed of [179,2026]){
  const suffix=seed===179?'':'-seed'+seed;
  const pre=JSON.parse(await readFile(out+'/before-webgl2'+suffix+'.json','utf8'));
  const post=JSON.parse(await readFile(out+'/after-webgl2'+suffix+'.json','utf8'));
  assert.equal(pre.seed??179,seed);assert.equal(post.seed??179,seed);
  assert.equal(pre.exactHead,post.exactHead);
  for(const [width,height] of [[844,390],[956,440]]){
    const name=(stage)=>stage+'-snowy-overlook'+suffix+'-'+width+'x'+height+'.png';
    const meta=(obj,stage)=>obj.captures.find(c=>c.name===name(stage));
    const b=meta(pre,'before'),a=meta(post,'after');
    assert.ok(b&&a,'Missing real elevated before/after image');
    assert.deepEqual(b.dimensions,[width,height]);
    assert.deepEqual(a.dimensions,[width,height]);
    assert.equal(b.scene.seed,seed);assert.equal(a.scene.seed,seed);
    assert.equal(b.scene.iceBlock,276);assert.equal(a.scene.iceBlock,276);
    assert.equal(b.glinfo.exists,true);assert.equal(a.glinfo.exists,true);
    assert.ok(b.glinfo.version.includes('WebGL 2.0')&&
      a.glinfo.version.includes('WebGL 2.0'));
    assert.equal(b.glinfo.biome,'snow');assert.equal(a.glinfo.biome,'snow');
    assert.deepEqual(b.scene.aim,a.scene.aim);
    assert.deepEqual(b.scene.lookout.chosen,a.scene.lookout.chosen);
    assert.deepEqual(b.scene.lookout.pose,a.scene.lookout.pose);
    const bytesB=await readFile(out+'/'+name('before'));
    const bytesA=await readFile(out+'/'+name('after'));
    assert.equal(digest(bytesB),b.sha256);
    assert.equal(digest(bytesA),a.sha256);
    const pngB=pngjs.PNG.sync.read(bytesB),pngA=pngjs.PNG.sync.read(bytesA);
    assert.deepEqual([pngB.width,pngB.height,pngA.width,pngA.height],
      [width,height,width,height]);
    // Common center-region ROI avoids chrome/HUD and the uppermost sky.
    // Color contrast is a strict corroborating metric, not a claim to
    // recognize an entire snow biome through pixel classification alone.
    const x0=Math.round(width*.18),x1=Math.round(width*.82);
    const y0=Math.round(height*.22),y1=Math.round(height*.9);
    let beforeBlue=0,afterBlue=0,changed=0,count=0;
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
      const i=(y*width+x)*4, B=pngB.data,A=pngA.data;
      if(B[i+2]-B[i]>65)beforeBlue++;
      if(A[i+2]-A[i]>65)afterBlue++;
      if(Math.max(Math.abs(A[i]-B[i]),
        Math.abs(A[i+1]-B[i+1]),Math.abs(A[i+2]-B[i+2]))>=10)changed++;
      count++;
    }
    const stats={seed,width,height,aim:b.scene.aim,lookout:b.scene.lookout.pose,
      beforeBlueFraction:beforeBlue/count,afterBlueFraction:afterBlue/count,
      changedFraction:changed/count,pixels:count,
      beforeSha256:b.sha256,afterSha256:a.sha256};
    console.log('SNOW_S1_MULTISEED_CONTRAST '+JSON.stringify(stats));
    assert.ok(stats.beforeBlueFraction>.04,
      'Original real landscape lacks the measurable ugly blue ice in this exact camera');
    assert.ok(stats.afterBlueFraction<.02&&
      stats.afterBlueFraction<=stats.beforeBlueFraction*.25,
      'Natural frost ice still has visually harsh original blue checker contrast');
    assert.ok(stats.changedFraction>.025,
      'Real renderer did not visibly modify enough of the sampled glacier field');
    result.comparisons.push(stats);
  }
}
assert.equal(result.comparisons.length,4);
await writeFile(out+'/snow-s1-multiseed-visual-parity.json',
  JSON.stringify(result,null,2)+'\n');
