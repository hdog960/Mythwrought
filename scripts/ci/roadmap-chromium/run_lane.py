"""Exact-PR-head candidate acceptance. Never claims Canvas2D or a GL probe as an asset WebGL2 pass."""
from __future__ import annotations
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path
from PIL import Image

LANES={
 'pack-1':(113,'canvas2d',93,30),
 'pack-2':(114,'canvas2d',89,66),
 'pack-3':(112,'canvas2d',72,3),
 'pack-4':(115,'webgl2',181,12),
 'pack-5':(119,'webgl2',156,36),
 'roadmap-1':(121,'canvas2d',85,54),
 'roadmap-2':(124,'canvas2d',48,90),
 'roadmap-3':(122,'webgl2-diagnostic',56,180),
 'roadmap-4':(123,'webgl2-diagnostic',60,180),
}
SIZES={(667,375),(844,390),(932,430)}

def command(args,repo,env,logfile,timeout=2400):
    print('RUN',' '.join(args),flush=True)
    with logfile.open('a',encoding='utf-8') as log:
        log.write('\n$ '+' '.join(args)+'\n')
        p=subprocess.Popen(args,cwd=repo,env=env,stdout=subprocess.PIPE,
                           stderr=subprocess.STDOUT,text=True,bufsize=1)
        try:
            for line in p.stdout:
                print(line,end='',flush=True)
                log.write(line)
            status=p.wait(timeout=timeout)
        except Exception:
            p.kill();p.wait();raise
    if status:raise RuntimeError(f'Command failed with status {status}: {args!r}')

def verify_native(log,minimum,special):
    content=log.read_text(errors='replace')
    tests=[int(x) for x in re.findall(r'^# tests\s+(\d+)\s*$',content,re.M)]
    passed=[int(x) for x in re.findall(r'^# pass\s+(\d+)\s*$',content,re.M)]
    failed=[int(x) for x in re.findall(r'^# fail\s+(\d+)\s*$',content,re.M)]
    skipped=[int(x) for x in re.findall(r'^# skipped\s+(\d+)\s*$',content,re.M)]
    todo=[int(x) for x in re.findall(r'^# todo\s+(\d+)\s*$',content,re.M)]
    assert tests and passed,'Missing native Node TAP footer'
    assert sum(tests)>=minimum,f'Insufficient native tests {sum(tests)} < {minimum}'
    assert sum(tests)==sum(passed) and not sum(failed) and not sum(skipped) and not sum(todo),\
        'Native tests failed, skipped or omitted'
    if special=='pack-1':assert 'PACK1_NATIVE_ACCEPTANCE_PASS' in content
    if special=='pack-2':assert 'Completed exact-head candidate QA' in content
    if special=='pack-4':assert 'PACK4_ACCEPTANCE: native Node and genuine 3-viewport Chromium gallery PASSED' in content
    return {'tests':sum(tests),'passed':sum(passed),'failed':sum(failed),
            'skipped':sum(skipped),'todo':sum(todo),'realNativeNode':True}

def verify_images(paths,minimum,lane):
    images=[]
    for path in sorted(paths):
        found=re.search(r'(667x375|844x390|932x430)',path.name)
        if not found:raise RuntimeError(f'Candidate PNG without viewport provenance: {path}')
        w,h=(int(x) for x in found.group(1).split('x'))
        with Image.open(path) as im:im.verify()
        with Image.open(path) as im:
            # Pack 2's individual candidate canvases are smaller than the viewport.
            cropped=lane=='pack-2' and 'water-full-' not in path.name
            if cropped:
                if im.width<48 or im.height<48 or im.width>w or im.height>h:
                    raise RuntimeError(f'Invalid Pack2 viewport crop {path}: {im.size}')
            elif im.width!=w or im.height<h:
                raise RuntimeError(f'Wrong screenshot dimensions {path}: {im.size} vs {(w,h)}')
            colors=len(set(im.convert('RGB').resize((64,36)).getdata()))
            if colors<6:raise RuntimeError(f'Blank/uniform screenshot {path}: {colors} colors')
            dimensions=[im.width,im.height]
        body=path.read_bytes()
        images.append({'filename':path.name,'sha256':hashlib.sha256(body).hexdigest(),
            'bytes':len(body),'pngDimensions':dimensions,'cssViewport':[w,h],
            'sampleColors':colors})
    observed={tuple(i['cssViewport']) for i in images}
    if len(images)<minimum:raise RuntimeError(f'Only {len(images)} candidate PNGs, expected {minimum}')
    if observed!=SIZES:raise RuntimeError(f'Incomplete landscape screenshot viewport coverage: {observed}')
    return images

def main():
    lane,checkout,sha,report_root,tooling=sys.argv[1:6]
    checkout=Path(checkout).resolve()
    report_root=Path(report_root).resolve()
    tooling=Path(tooling).resolve()
    assert lane in LANES and re.fullmatch(r'[0-9a-f]{40}',sha)
    pr,renderer,min_tests,min_images=LANES[lane]
    report=report_root/lane;report.mkdir(parents=True,exist_ok=True)
    evidence={'lane':lane,'candidatePR':pr,'candidateCommit':sha,
        'requiredLandscapeCSSViewports':sorted(SIZES),
        'candidateRendererType':renderer,'status':'BLOCKED',
        'productionGameTested':False,'realIPhoneTested':False,
        'creatorArtOrControlsApproved':False,'integrated':False,'deployed':False}
    try:
        actual=subprocess.check_output(['git','rev-parse','HEAD'],cwd=checkout,text=True).strip()
        assert actual==sha,f'Wrong candidate head {actual} vs {sha}'
        dirty=subprocess.check_output(['git','status','--porcelain','--','src','tests','docs'],
                                      cwd=checkout,text=True).strip()
        if lane=='pack-4':
            main_sha=os.environ.get('MYTHWROUGHT_COMPOSITE_MAIN_SHA','')
            assert re.fullmatch(r'[0-9a-f]{40}',main_sha), 'Pack4 must have source-pinned main dependency overlay'
            main_modules={'src/voxel-shape-interactions.mjs','src/voxel-shape-fit.mjs',
                          'src/voxel-orientation-sidecar.mjs','src/shape-prototypes.mjs'}
            changes={line[3:] for line in dirty.splitlines() if line}
            assert changes==main_modules, f'Unexpected Pack4 source changes: {changes}'
            overlay={}
            for path in sorted(main_modules):
                expected=subprocess.check_output(['git','rev-parse',f'{main_sha}:{path}'],
                  cwd=checkout,text=True).strip()
                actual_blob=subprocess.check_output(['git','hash-object',path],
                  cwd=checkout,text=True).strip()
                assert actual_blob==expected, f'Pack4 main source overlay blob mismatch: {path}'
                overlay[path]=actual_blob
            evidence['sourceOverlay']={'candidatePRHead':sha,'mainCommit':main_sha,
                                       'strictVerifiedMainBlobs':overlay,'temporaryOnly':True}
        else:
            assert not dirty,f'Candidate source modified before test: {dirty}'
        env=dict(os.environ)
        # No bearer token is passed to code living in candidate branches.
        env.pop('GH_TOKEN',None);env.pop('GITHUB_TOKEN',None)
        env.update({
            'PACK1_EXPECTED_HEAD':sha,'MYTHWROUGHT_PACK2_EXPECT_HEAD':sha,
            'PACK3_CHROMIUM':'/usr/bin/chromium','CHROMIUM_PATH':'/usr/bin/chromium',
            'CHROMIUM_BIN':'/usr/bin/chromium','R4_CHROMIUM':'/usr/bin/chromium',
            'PACK4_CHROMIUM_PATH':'/usr/bin/chromium','PACK4_CHROMIUM_HEADFUL':'1',
            'PACK4_INJECT_SOURCE':'1','MYTHWROUGHT_PACK2_CHROMIUM':'/usr/bin/chromium',
            'PACK1_ARTIFACT_DIR':str(checkout/'artifacts/pack-1'),
            'MYTHWROUGHT_PACK2_SCREENSHOTS':str(checkout/'artifacts/roadmap-ci/pack-2'),
            'PACK3_SCREENSHOT_DIR':str(checkout/'artifacts/roadmap-ci/pack-3'),
            'PACK3_MATRIX_DIR':str(checkout/'artifacts/roadmap-ci/pack-3-matrix'),
            'R1_ARTIFACT_DIR':str(checkout/'artifacts/roadmap-ci/roadmap-1'),
            'MYTHWROUGHT_R2_M1_SHOTS':str(checkout/'artifacts/roadmap-ci/roadmap-2')
        })
        # Genuine WebGL2 context + GPU readback (transport only, not candidate).
        command(['xvfb-run','-a','python',str(tooling/'probe_webgl2.py'),str(report/'preflight')],
                checkout,env,report/'transport.log',timeout=180)
        command(['npm','install','--no-save','--no-audit','--no-fund','playwright@1.58.2','pngjs@7.0.0'],
                checkout,env,report/'dependencies.log',timeout=300)
        native=report/'native.log';browserlog=report/'browser.log'
        base='tests/block-packs/' if lane.startswith('pack') else 'tests/building-pool/'
        directory=checkout/base/lane
        tests=sorted(directory.rglob('*.test.mjs'))
        assert tests,f'No candidate-owned nested Node test suite in {directory}'
        if lane=='pack-1':
            command(['xvfb-run','-a','node',base+lane+'/run-acceptance.mjs'],checkout,env,native)
        elif lane=='pack-2':
            command(['xvfb-run','-a','bash',base+lane+'/run-acceptance.sh'],checkout,env,native)
        elif lane=='pack-4':
            command(['xvfb-run','-a','node',base+lane+'/verify-final.mjs'],checkout,env,native)
        else:
            command(['node','--test',*[str(p.relative_to(checkout)) for p in tests]],checkout,env,native)
        evidence['nativeNode']=verify_native(native,min_tests,lane)
        b=base+lane+'/'
        if lane=='pack-3':
            command(['xvfb-run','-a','python',b+'gallery-browser.py'],checkout,env,browserlog)
            command(['xvfb-run','-a','python',b+'creator-review-matrix.py'],checkout,env,browserlog)
        elif lane=='pack-5':
            for mode in ['m1','m2','m3','m3b','m4','m5']:
                command(['xvfb-run','-a','python',b+'esm-webgl-browser.py',mode,
                         str(checkout/'artifacts/roadmap-ci/pack-5'/mode)],checkout,env,browserlog)
        elif lane=='roadmap-1':
            command(['xvfb-run','-a','python',b+'m1-browser.py'],checkout,env,browserlog)
        elif lane=='roadmap-2':
            command(['xvfb-run','-a','python',b+'m1-gallery-browser.py'],checkout,env,browserlog)
        elif lane=='roadmap-3':
            command(['xvfb-run','-a','python',b+'preview-webgl2-inline.py'],checkout,env,browserlog)
        elif lane=='roadmap-4':
            command(['xvfb-run','-a','python',b+'webgl2-preview-browser.py'],checkout,env,browserlog)
        # Packs 1, 2, and 4 execute genuine browser checks inside strict native orchestrators.
        roots={
          'pack-1':'artifacts/pack-1',
          'pack-2':'artifacts/roadmap-ci/pack-2',
          'pack-3':'artifacts/roadmap-ci/pack-3',
          'pack-4':'artifacts/pack-4',
          'pack-5':'artifacts/roadmap-ci/pack-5',
          'roadmap-1':'artifacts/roadmap-ci/roadmap-1',
          'roadmap-2':'artifacts/roadmap-ci/roadmap-2',
          'roadmap-3':'artifacts/roadmap3-m1-webgl2',
          'roadmap-4':'artifacts/r4-webgl2-genuine'
        }
        folder=checkout/roots[lane]
        assert folder.exists(),f'Candidate generated zero screenshot directory: {folder}'
        shots=list(folder.rglob('*.png'))
        # Authentic partials may be inspected, but their presence never asserts PASS.
        dest=report/'screenshots';dest.mkdir(parents=True,exist_ok=True)
        for p in shots:
            target=dest/p.relative_to(folder)
            target.parent.mkdir(parents=True,exist_ok=True)
            shutil.copy2(p,target)
        if lane=='pack-3':
            matrix=checkout/'artifacts/roadmap-ci/pack-3-matrix'
            if matrix.exists():shutil.copytree(matrix,report/'contact-sheets',dirs_exist_ok=True)
        evidence['candidateScreenshots']=verify_images(shots,min_images,lane)
        evidence['candidateImageCount']=len(shots)
        evidence['candidateImageSource']='Actual checked-out candidate renderer; never transport probe'
        if renderer=='canvas2d':
            raise RuntimeError('Canvas2D candidate preview passed, but candidate-specific WebGL2 has NOT run. Transport WebGL2 probe cannot satisfy asset acceptance.')
        evidence['status']='ISOLATED_DIAGNOSTIC_PASS' if renderer=='webgl2-diagnostic' else 'CANDIDATE_TECHNICAL_PASS'
        evidence['remainingGates']='Live engine/asset integration, physical iPhone and creator artwork/controls remain OPEN'
        print(evidence['status'],lane,sha,flush=True)
    except Exception as e:
        evidence['status']='BLOCKED';evidence['blocker']=str(e)
        print('CANDIDATE_ACCEPTANCE_BLOCKED',lane,str(e),file=sys.stderr,flush=True)
    finally:
        (report/'evidence.json').write_text(json.dumps(evidence,indent=2,sort_keys=True)+'\n')
    return evidence['status'] in ('CANDIDATE_TECHNICAL_PASS','ISOLATED_DIAGNOSTIC_PASS')

if __name__=='__main__':
    try:success=main()
    except Exception as e:
        print('FATAL_CANDIDATE_RUNNER',e,file=sys.stderr)
        sys.exit(1)
    sys.exit(0 if success else 1)
