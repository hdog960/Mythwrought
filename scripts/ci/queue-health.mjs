// GitHub Actions backlog snapshot; read-only, advisory, never blocks CI.
export function summarizeRuns(runs,now=Date.now()){
 if(!Array.isArray(runs))throw TypeError('Expected array');
 const act=runs.filter(x=>x&&['queued','waiting','pending','in_progress'].includes(x.status));
 const queued=act.filter(x=>x.status!=='in_progress');
 const old=queued.filter(x=>Number.isFinite(Date.parse(x.created_at))&&now-Date.parse(x.created_at)>900000);
 return {sampled:runs.length,queued:queued.length,running:act.length-queued.length,old:old.length,warning:queued.length>=8||old.length>=3};
}
async function run(){
 const repo=process.env.GITHUB_REPOSITORY||'',token=process.env.GITHUB_TOKEN||'';
 if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)||!token){process.stdout.write('Queue health unavailable; nonblocking.\n');return;}
 try{
  const resp=await fetch('https://api.github.com/repos/'+repo+'/actions/runs?per_page=100',{
   headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(8000)});
  if(!resp.ok)throw Error('GitHub Actions API '+resp.status);
  const q=summarizeRuns((await resp.json()).workflow_runs);
  const report='Mythwrought queue: '+q.queued+' queued, '+q.running+' running, '+q.old+' queued >15m'+(q.warning?' — INVESTIGATE':'');
  process.stdout.write(report+'\n');
  if(process.env.GITHUB_STEP_SUMMARY)(await import('node:fs/promises')).appendFile(process.env.GITHUB_STEP_SUMMARY,'\n### CI backlog\n'+report+'\n').catch(()=>{});
 }catch(e){process.stdout.write('Queue health unavailable (nonblocking): '+e.message+'\n');}
}
if(process.argv[1]&&import.meta.url.endsWith('/'+process.argv[1].split('/').pop()))await run();
