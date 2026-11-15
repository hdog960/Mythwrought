"""One read-only GitHub-hosted runner for nine isolated candidate PRs."""
from __future__ import annotations
import json
import os
import subprocess
import sys
from pathlib import Path

LANES={
 'pack-1':(113,('src/block-packs/pack-1/','tests/block-packs/pack-1/')),
 'pack-2':(114,('src/block-packs/pack-2/','tests/block-packs/pack-2/')),
 'pack-3':(112,('src/block-packs/pack-3/','tests/block-packs/pack-3/')),
 'pack-4':(115,('src/block-packs/pack-4/','tests/block-packs/pack-4/')),
 'pack-5':(119,('src/block-packs/pack-5/','tests/block-packs/pack-5/')),
 'roadmap-1':(121,('src/building-pool/roadmap-1/','tests/building-pool/roadmap-1/','docs/building-pool/roadmap-1/')),
 'roadmap-2':(124,('src/building-pool/roadmap-2/','tests/building-pool/roadmap-2/','docs/building-pool/roadmap-2/')),
 'roadmap-3':(122,('src/building-pool/roadmap-3/','tests/building-pool/roadmap-3/','docs/building-pool/roadmap-3/')),
 'roadmap-4':(123,('src/building-pool/roadmap-4/','tests/building-pool/roadmap-4/','docs/building-pool/roadmap-4/')),
}
INFRA={'.github/workflows/roadmap-chromium-acceptance.yml','docs/ci/ROADMAP_CHROMIUM_GATE.md'}

def cmd(argv:list[str],cwd:Path|None=None)->str:
    p=subprocess.run(argv,cwd=cwd,text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    if p.returncode: raise RuntimeError(f'{argv} exited {p.returncode}: {p.stderr[:1000]}')
    return p.stdout.strip()

def gh_json(endpoint):return json.loads(cmd(['gh','api',endpoint]))

def choose(paths):
    if any(p in INFRA or p.startswith('scripts/ci/roadmap-chromium/') for p in paths):
        return list(LANES)
    chosen={lane for path in paths for lane,(_,prefixes) in LANES.items() if path.startswith(prefixes)}
    if not chosen: raise RuntimeError('No recognized owned roadmap scope; fail closed')
    return [lane for lane in LANES if lane in chosen]

def choose_for_run(paths,incoming,origin,pack1_mode):
    if not pack1_mode:
        return choose(paths)
    if incoming!=136 or origin['head']['ref']!='infra/chromium-roadmap-gate-20261114':
        raise RuntimeError('Pack1-only mode is restricted to infrastructure draft PR #136')
    if origin['head']['repo']['full_name']!='hdog960/Mythwrought':
        raise RuntimeError('Unexpected Pack1-only repository')
    if not any(p=='.github/workflows/roadmap-chromium-acceptance.yml'
               or p.startswith('scripts/ci/roadmap-chromium/') for p in paths):
        raise RuntimeError('Pack1-only mode requires a real infrastructure change')
    return ['pack-1']

def main():
    report=Path(os.environ['MYTHWROUGHT_REPORT_ROOT']);report.mkdir(parents=True,exist_ok=True)
    repo=os.environ['MYTHWROUGHT_REPO'];incoming=int(os.environ['MYTHWROUGHT_PR'])
    assert repo=='hdog960/Mythwrought', 'This scope is for the audited Mythwrought repository only'
    origin=gh_json(f'repos/{repo}/pulls/{incoming}')
    assert origin['state']=='open' and origin['head']['repo']['full_name']==repo and origin['base']['ref']=='main'
    # Paginate all changed files. Never silently omit paths past page one.
    files=[];page=1
    while True:
        batch=gh_json(f'repos/{repo}/pulls/{incoming}/files?per_page=100&page={page}')
        assert isinstance(batch,list)
        files.extend(x['filename'] for x in batch)
        if len(batch)<100:break
        page+=1
    pack1_mode=os.environ.get('MYTHWROUGHT_PACK1_CANVAS2D_ONLY')=='1'
    selected=choose_for_run(files,incoming,origin,pack1_mode)
    (report/'selection.json').write_text(json.dumps({'workflowPR':incoming,'changedFiles':files,
      'selectedLanes':selected,'selectionMode':'pack1-canvas2d-only' if pack1_mode else ('infra-all' if len(selected)==9 else 'owned-paths')},indent=2)+'\n')
    print('Selected exact source candidate lanes',selected,flush=True)
    tooling=Path.cwd().resolve()/ 'scripts/ci/roadmap-chromium'
    failures=[]
    for lane in selected:
        pr=LANES[lane][0]
        try:
            info=gh_json(f'repos/{repo}/pulls/{pr}')
            assert info['state']=='open' and info['draft'] and info['base']['ref']=='main', 'Candidate must remain an open draft against main'
            assert info['head']['repo']['full_name']==repo, 'No external fork code permitted'
            sha=info['head']['sha']
            assert len(sha)==40 and all(c in '0123456789abcdef' for c in sha)
            # Fetch PR head, not GitHub's synthetic merge ref. Never push or rebase.
            cmd(['git','fetch','--no-tags','--depth=1','origin',f'refs/pull/{pr}/head'])
            actual=cmd(['git','rev-parse','FETCH_HEAD'])
            assert sha==actual, f'Candidate moved mid-fetch {sha} -> {actual}'
            worktree=report.parent/f'mythwrought-exact-pr-{pr}'
            cmd(['git','worktree','add','--detach',str(worktree),sha])
            candidate_env=dict(os.environ)
            if lane=='pack-4':
                # Pack 4's strict runner requires four real shape modules only
                # available on main, not its older PR base. Use a local overlay:
                # candidate HEAD stays unchanged; main and source blobs are pinned.
                main_sha=gh_json(f'repos/{repo}/commits/main')['sha']
                cmd(['git','fetch','--no-tags','--depth=1','origin','main'])
                assert cmd(['git','rev-parse','FETCH_HEAD'])==main_sha, 'main changed during acquisition'
                main_modules=['src/voxel-shape-interactions.mjs','src/voxel-shape-fit.mjs',
                              'src/voxel-orientation-sidecar.mjs','src/shape-prototypes.mjs']
                cmd(['git','restore',f'--source={main_sha}','--worktree','--',*main_modules],cwd=worktree)
                for path in main_modules:
                    expected=cmd(['git','rev-parse',f'{main_sha}:{path}'],cwd=worktree)
                    actual_blob=cmd(['git','hash-object',path],cwd=worktree)
                    assert actual_blob==expected, f'Non-source-exact main overlay: {path}'
                candidate_env['MYTHWROUGHT_COMPOSITE_MAIN_SHA']=main_sha
            result=subprocess.run(['python',str(tooling/'run_lane.py'),lane,str(worktree),sha,str(report),str(tooling)],
                                  cwd=Path.cwd(),env=candidate_env)
            if pack1_mode and lane=='pack-1':
                latest=gh_json(f'repos/{repo}/pulls/{pr}')
                if latest['head']['sha']!=sha:
                    raise RuntimeError('Pack1 draft head advanced during acceptance; reject stale evidence')
            if result.returncode: failures.append({'lane':lane,'pr':pr,'sha':sha,'reason':'lane acceptance blocked; see evidence.json'})
        except Exception as exc:
            failures.append({'lane':lane,'pr':pr,'reason':str(exc)})
            sub=report/lane;sub.mkdir(parents=True,exist_ok=True)
            (sub/'evidence.json').write_text(json.dumps({'lane':lane,'pr':pr,'status':'BLOCKED','blocker':str(exc)},indent=2)+'\n')
            print('BLOCKED',lane,str(exc),file=sys.stderr,flush=True)
    (report/'summary.json').write_text(json.dumps({'selected':selected,'failed':failures,
      'allCandidateGatesPassed':(not failures) if not pack1_mode else False,
      'allSelectedCanvas2DAcceptancePassed':(not failures) if pack1_mode else None,
      'productionWebGL2Approved':False,'note':'Supplementary source-only QA. No Gate A, creator, hardware or deployment approval.'},indent=2)+'\n')
    if failures:raise RuntimeError(f'{len(failures)} of {len(selected)} lanes have incomplete acceptance; see uploaded evidence')

if __name__=='__main__':
    try:main()
    except Exception as e:
        print('ROADMAP_CHROMIUM_GATE_BLOCKED',str(e),file=sys.stderr,flush=True)
        sys.exit(1)
