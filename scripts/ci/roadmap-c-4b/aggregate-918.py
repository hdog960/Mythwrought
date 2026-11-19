#!/usr/bin/env python3
"""Roadmap C Builder 4B fail-closed aggregate acceptance, new CI-owned file only.
All source jobs are the SAME GitHub workflow run, attempt and checked-out exact HEAD.
Historical source/tests are not modified. PNGs are genuine Chromium cube proxies,
NOT final manual-family physical rendering or iPhone gameplay acceptance.
"""
import collections,hashlib,json,os,pathlib,struct,sys,zipfile,zlib

ROOT=pathlib.Path("collected")
SOURCE=pathlib.Path("src/building-pool/roadmap-4b/m3-research-wave7-roadmap-c-single.mjs")
ACCEPTED=pathlib.Path("baseline-152.zip")
EXPECTED_BASE_SHA="573764035e7e0b630aade811230ea744721a27540c730b5cdf017db164c93e9a"
EXPECTED_SUNRIFT_SHA="8fb871a267e3fcb98ed3e3332c81549c516ff202fb74d6702dcdb453737aaa58"
SUNRIFT="r4:magical-research-institute:desert:large:01"
SIZES={(667,375),(844,390),(932,430)}
VIEWS={"exterior","section"}
SRC_ROOT="building-pool/roadmap-4b/"
def require(condition,message):
 if not condition:raise RuntimeError("FAIL CLOSED — "+message)
def sha(b):return hashlib.sha256(b).hexdigest()
def digest_file(p):
 with open(p,"rb") as f:return hashlib.sha256(f.read()).hexdigest()
def png_dimensions(data):
 require(data[:8]==b"\\x89PNG\\r\\n\\x1a\\n","not an actual PNG")
 pos=8;idat=[];dims=None;ended=False
 while pos<len(data):
  require(pos+12<=len(data),"truncated PNG chunk")
  n=struct.unpack_from(">I",data,pos)[0];type_=data[pos+4:pos+8]
  require(n<=40_000_000 and pos+n+12<=len(data),"out-of-bounds PNG chunk")
  chunk=data[pos+8:pos+8+n]
  stored=struct.unpack_from(">I",data,pos+8+n)[0]
  require(zlib.crc32(type_+chunk)&0xffffffff==stored,"invalid PNG CRC")
  if type_==b"IHDR":
   require(dims is None and n==13,"bad PNG header")
   w,h,depth,colour,compression,filter_,interlace=struct.unpack(">IIBBBBB",chunk)
   require((w,h) in SIZES and (depth,colour,compression,filter_,interlace)==(8,2,0,0,0),"PNG IHDR disagrees with expected 8-bit RGB phone landscape")
   dims=(w,h)
  elif type_==b"IDAT":idat.append(chunk)
  elif type_==b"IEND":require(n==0,"invalid IEND");ended=True;require(pos+n+12==len(data),"trailing PNG bytes");break
  pos+=n+12
 require(ended and dims is not None and len(idat)>0,"incomplete PNG")
 raw=zlib.decompress(b"".join(idat))
 width,height=dims;stride=3*width
 require(len(raw)==height*(stride+1),"PNG scanline byte count mismatch")
 require(all(raw[y*(stride+1)] in range(5) for y in range(height)),"invalid PNG filtering")
 return dims

def record_attestations():
 expected_mode={"roots":1,"native":1,"full":1,"browser":20}
 files=sorted((ROOT/"attestations").glob("*.json"))
 require(len(files)==23,"expected 23 same-attempt attestations, got "+str(len(files)))
 run=os.environ["GITHUB_RUN_ID"];attempt=os.environ["GITHUB_RUN_ATTEMPT"];head=os.environ["SOURCE_HEAD_SHA"]
 needs=json.loads(os.environ["NEEDS_JSON"])
 require(set(needs)=={"roots","native","chromium","webgl"},"wrong job dependency set")
 require(all(row.get("result")=="success" for row in needs.values()),"not all real CI jobs passed")
 count=collections.Counter();seen_browser=set();totals=collections.Counter()
 for path in files:
  a=json.loads(path.read_text())
  require(a.get("schema")=="mythwrought.roadmap-c-4b-ci-attestation.v1" and a.get("passed") is True,"invalid source attestation "+str(path))
  require(a.get("sourceHead")==head and a.get("runId")==run and str(a.get("runAttempt"))==attempt,"cross-commit / cross-workflow-attempt evidence "+str(path))
  mode=a["mode"];count[mode]+=1
  results=a.get("results")
  require(isinstance(results,list) and results,"empty test attestation "+str(path))
  for r in results:
   require(r.get("fail") in (0,None) and (r.get("tests") is None or r["tests"]==r["pass"]),"failed or skipped TAP evidence")
  if mode=="roots":
   require(len(results)==2 and [r["tests"] for r in results]==[12,922],"root/contract test total changed")
  if mode=="full":
   require(len(results)==20 and len(set(r.get("script") for r in results))==20,"full 20 true WebGL2 scripts missing")
   require(all(r.get("script","").startswith("tests/") for r in results),"fabricated WebGL2 script name")
  if mode=="native":
   require(len(results)==1,"native suite missing")
   totals["focused"]+=results[0]["tests"]
  if mode=="browser":
   ix=a.get("index");require(isinstance(ix,int) and 0<=ix<20 and ix not in seen_browser,"duplicate/missing browser file index")
   seen_browser.add(ix)
   require(len(results)==1 and results[0].get("index")==ix and results[0].get("manifest"),"one real browser test and its manifest required")
   totals["focused"]+=results[0]["tests"]
 require(count==expected_mode and seen_browser==set(range(20)),"42 historical test files not fully covered by exactly 20 real Chromium jobs")
 require(totals["focused"]==258,"original complete 258 focused tests not proved: "+str(totals["focused"]))
 return {"runId":run,"runAttempt":attempt,"sourceHead":head,"attestations":len(files),"focusedTests":totals["focused"],"contractTests":12,"rootTests":922,"fullRealWebGL2Scripts":20}

def parse_archive(z):
 records={};source={}
 for name in z.namelist():
  if not name.startswith(SRC_ROOT) or not name.endswith("/results.json"):continue
  manifest=json.loads(z.read(name));source[name]=manifest
  require(manifest.get("previewCategory")=="Chromium WebGL2 with cube proxies, not actual physical manual pack meshes","wrong renderer class "+name)
  require(manifest.get("physicalFamilyRendering") is False and manifest.get("liveGameplay") is False and manifest.get("physicalIphone") is False,"misleading real-play physical rendering claim")
  captures=manifest.get("captures",[])
  require(manifest.get("captureCount")==len(captures) and len(captures)>0,"incomplete source manifest "+name)
  for cap in captures:
   img=name.rsplit("/",1)[0]+"/"+cap["png"]
   require(img not in records and img in z.namelist(),"missing/duplicate archive image "+img)
   data=z.read(img);check_capture(cap,img,data)
   records[img]=(cap,sha(data),data,manifest.get("exactSourceSHA256"))
 return records,source

def check_capture(cap,path,data):
 require(len(data)==cap.get("byteCount") and len(data)>1000,"wrong screenshot byte count "+path)
 dims=png_dimensions(data)
 require(dims==(cap.get("width"),cap.get("height")),"screen dimensions not source-exact "+path)
 require(cap.get("ready") is True and cap.get("renderer")=="genuine-webgl2-cube-proxy" and cap.get("notPhysical") is True,"not genuine declared WebGL2 evidence "+path)
 require(cap.get("glError")==0 and cap.get("contextLost") is False,"GPU error/context loss "+path)
 require(cap.get("projectionWithinFrame") is True,"cropped camera framing "+path)
 fit=cap.get("cameraFit",{})
 require(all(isinstance(fit.get(k), (float,int)) and 0<fit[k]<0.86 for k in ("horizontalNdc","verticalNdc")),"invalid source camera fit "+path)
 require(cap.get("drawCalls",0)>0 and cap.get("triangles",0)>300 and cap.get("cells",0)>100,"no real building geometry "+path)
 require(isinstance(cap.get("roomCount"),int) and cap["roomCount"]>0,"rooms absent "+path)
 require(cap.get("view") in VIEWS and cap.get("sourceId","").startswith("r4:"),"invalid view/source id "+path)

def run():
 provenance=record_attestations()
 require(digest_file(ACCEPTED)==EXPECTED_BASE_SHA,"accepted 152-building archive hash changed")
 require(digest_file(SOURCE)==EXPECTED_SUNRIFT_SHA,"new source file bytes differ from accepted pinned Sunrift")
 originalZip=zipfile.ZipFile(ACCEPTED)
 base,baseline_manifests=parse_archive(originalZip)
 require(len(base)==912 and len(baseline_manifests)==19,"accepted baseline not exactly 152 sources")
 require(len(set(v[0]["sourceId"] for v in base.values()))==152,"baseline source ID roster inconsistent")
 files=sorted((ROOT/"building-pool/roadmap-4b").rglob("results.json"))
 require(len(files)==20,"exactly twenty real Chromium 4B manifests required")
 present={};sources={};ids=collections.defaultdict(set);png_shas=set()
 for file in files:
  name=file.relative_to(ROOT).as_posix()
  m=json.loads(file.read_bytes());sources[name]=m
  require(m.get("previewCategory")=="Chromium WebGL2 with cube proxies, not actual physical manual pack meshes","wrong real renderer category "+name)
  require(m.get("captureCount")==len(m.get("captures",[])) and len(m["captures"])>0,"partial/absent real captures "+name)
  require(m.get("physicalFamilyRendering") is False and m.get("physicalIphone") is False,"inaccurate physical test claim")
  for c in m["captures"]:
   png=file.parent/c["png"];label=png.relative_to(ROOT).as_posix()
   require(label not in present and png.is_file(),"missing/duplicate per-source PNG "+label)
   data=png.read_bytes();check_capture(c,label,data);h=sha(data)
   require(h not in png_shas,"duplicate screenshot SHA256 "+label)
   png_shas.add(h);present[label]=(c,h,data,m["exactSourceSHA256"])
   ids[c["sourceId"]].add((c["view"],(c["width"],c["height"])))
 require(len(present)==918 and len(ids)==153 and len(sources)==20,"918/153/20 strict raster roster absent")
 all_six={(v,s) for v in VIEWS for s in SIZES}
 require(all(frames==all_six for frames in ids.values()),"missing/duplicate 3-size exterior+section frame coverage")
 novel=[k for k in present if "/m3-research-wave7-roadmap-c-webgl2-cube-proxy/" in k]
 historical=[k for k in present if k not in novel]
 require(len(novel)==6 and len(historical)==912 and SUNRIFT in ids,"wrong old/new source roster")
 require(set(historical)==set(base),"accepted baseline historic PNG paths changed")
 for path in historical:
  require(present[path][2]==base[path][2],"historical PNG bytes changed: "+path)
  require(present[path][3]==base[path][3],"historical source SHA identity changed: "+path)
 for name in baseline_manifests:
  require(name in sources,"historical manifest dropped: "+name)
  require(sources[name]["exactSourceSHA256"]==baseline_manifests[name]["exactSourceSHA256"],"historical manifest source SHA changed")
 for path in novel:
  require(present[path][0]["sourceId"]==SUNRIFT and present[path][0]["roomCount"]==9,"invalid new Sunrift ID or rooms")
  require(present[path][3]==EXPECTED_SUNRIFT_SHA,"new Sunrift preview not from pinned canonical source")
 report={**provenance,"status":"PASS","authenticPNG":918,"historicalPNGByteIdentical":912,"newSunriftPNG":6,"sourceIDs":153,"uniqueSHA256":918,"sourceCanonicalSHA256":EXPECTED_SUNRIFT_SHA,"baselineArchiveSHA256":EXPECTED_BASE_SHA}
 pathlib.Path("acceptance").mkdir(exist_ok=True)
 pathlib.Path("acceptance/4b-acceptance.json").write_text(json.dumps(report,indent=2)+"\n")
 with zipfile.ZipFile("acceptance/roadmap-c-4b-918-source-exact.zip","w",compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for file in sorted((ROOT/"building-pool/roadmap-4b").rglob("*")):
   if file.is_file() and (file.suffix==".png" or file.name=="results.json"):
    z.write(file,file.relative_to(ROOT).as_posix())
  z.write("acceptance/4b-acceptance.json","acceptance.json")
 print(json.dumps(report,indent=2))
if __name__=="__main__":
 try:run()
 except Exception as e:
  pathlib.Path("acceptance").mkdir(exist_ok=True)
  report={"status":"FAIL","error":str(e),"runId":os.environ.get("GITHUB_RUN_ID"),"attempt":os.environ.get("GITHUB_RUN_ATTEMPT"),"sourceHead":os.environ.get("SOURCE_HEAD_SHA")}
  pathlib.Path("acceptance/4b-acceptance.json").write_text(json.dumps(report,indent=2)+"\n")
  print(json.dumps(report,indent=2),file=sys.stderr)
  sys.exit(1)
