import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const HEAD = '9ab03c3bbff5f449006a344e97e68c9d0141c228';
const ROOTS = ['index.html','styles.css','manifest.webmanifest','assets','src'];
function assert(ok, message) { if (!ok) throw new Error(message); }
function walk(p) {
  const stat = fs.lstatSync(p);
  assert(!stat.isSymbolicLink(), 'Symlinks not allowed: ' + p);
  if (!stat.isDirectory()) { assert(stat.isFile(), 'Not a regular file: ' + p); return [p]; }
  return fs.readdirSync(p).sort().flatMap(name => walk(path.join(p,name)));
}
function digest(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
function verifyImports(dst) {
  const root = path.resolve(dst, 'src');
  for (const f of walk(root).filter(f=>/\.(mjs|js)$/.test(f))) {
    const code = fs.readFileSync(f,'utf8');
    assert(!/navigator\s*\.\s*serviceWorker\s*\.\s*register\s*\(/.test(code), 'Unexpected service-worker registration: ' + f);
  }
  const seen = new Set();
  function visit(file) {
    const f = path.resolve(file);
    assert(f.startsWith(root + path.sep) && fs.existsSync(f), 'Import escapes source tree or is missing: ' + f);
    if (seen.has(f) || !/\.(mjs|js)$/.test(f)) return;
    seen.add(f);
    const code = fs.readFileSync(f,'utf8');
    const re = /(?:\bfrom\s*|\bimport\s*\(\s*)["']([^"']+)["']/g;
    for (const item of code.matchAll(re)) {
      const spec = item[1];
      assert(spec.startsWith('./') || spec.startsWith('../'), 'External browser module: ' + spec);
      visit(path.resolve(path.dirname(f), spec.split('?')[0]));
    }
  }
  visit(path.join(root,'main.mjs'));
  console.log('Verified browser import graph: ' + seen.size + ' modules');
}
function main() {
  const [source, output, metadata] = process.argv.slice(2);
  assert(source && output && metadata, 'Expected SOURCE OUTPUT VERIFICATION_JSON');
  const proof = JSON.parse(fs.readFileSync(metadata,'utf8'));
  assert(proof.source_commit === HEAD && proof.pr === 208 && proof.deployment === false, 'Unverified source candidate');
  assert(!fs.existsSync(output) || fs.readdirSync(output).length === 0, 'Output directory not empty');
  fs.mkdirSync(output,{recursive:true});
  for (const p of ROOTS) {
    const from = path.join(source,p);
    assert(fs.existsSync(from), 'Missing required source root: ' + p);
    walk(from);
    fs.cpSync(from,path.join(output,p),{recursive:true,force:false,errorOnExist:true});
  }
  const html = fs.readFileSync(path.join(output,'index.html'),'utf8');
  for (const pattern of [
    /rel="manifest"\s+href="\.\/manifest\.webmanifest"/,
    /href="\.\/styles\.css"/,
    /src="\.\/src\/main\.mjs"/,
    /href="\.\/assets\/icon\.svg"/
  ]) assert(pattern.test(html), 'Entry HTML has unexpected asset path');
  assert(!/<(?:script|link)\b[^>]*(?:src|href)=["']https?:\/\//i.test(html),
    'External script or stylesheet forbidden');
  const manifest = JSON.parse(fs.readFileSync(path.join(output,'manifest.webmanifest'),'utf8'));
  assert(manifest.start_url === './' && manifest.scope === './' &&
    manifest.display === 'standalone' && manifest.orientation === 'landscape',
    'Unexpected manifest launch/scope/orientation');
  assert(manifest.icons?.every(icon=>icon.src.startsWith('./')), 'Absolute manifest icon URL');
  verifyImports(output);
  const entries = [];
  for (const root of ROOTS) for (const f of walk(path.join(source,root))) {
    const relative = path.relative(source,f);
    const copied = path.join(output,relative);
    assert(fs.existsSync(copied) && digest(f) === digest(copied), 'Static source changed: ' + relative);
    entries.push({path:relative,sha256:digest(copied)});
  }
  assert(!fs.existsSync(path.join(output,'.github')) && !fs.existsSync(path.join(output,'tests')),
    'Internal build material leaked into static candidate');
  assert(!fs.existsSync(path.join(output,'service-worker.js')) &&
    !fs.existsSync(path.join(output,'sw.js')), 'Unexpected offline service worker');
  fs.writeFileSync(path.join(output,'preview-build.json'),JSON.stringify({
    ...proof, static_file_count:entries.length, static_files:entries,
    note:'Unpublished exact-source PR208 artifact. It is NOT a hosted iPhone Safari preview.'
  },null,2) + '\n');
  console.log('Packaged ' + entries.length + ' SHA-256 verified source files; no production edits or deployment.');
}
try { main(); } catch (e) {
  console.error('::error::' + e.message);
  process.exitCode = 1;
}
