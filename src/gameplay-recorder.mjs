// Opt-in, local-only ten-second capture of the existing Mythwrought WebGL canvas.
// No audio, camera/microphone permission, world edits, persistence, or new renderer.
export const MAX_CAPTURE_MS=10000;
export const MAX_CAPTURE_BYTES=24*1024*1024;
export const CAPTURE_FPS=24;
export const MIME_PREFERENCES=Object.freeze([
  'video/mp4;codecs=avc1.42E01E','video/mp4',
  'video/webm;codecs=vp8','video/webm'
]);

export function recordingMime(MediaRecorderType){
  if(typeof MediaRecorderType!=='function')return null;
  if(typeof MediaRecorderType.isTypeSupported!=='function')return '';
  return MIME_PREFERENCES.find(type=>{
    try{return MediaRecorderType.isTypeSupported(type);}catch(_){return false;}
  })??'';
}
export function recordingFilename(date=new Date(),mime='video/mp4'){
  const time=Number.isFinite(date?.getTime?.())?date.toISOString().replace(/[:.]/g,'-'):'undated';
  return 'mythwrought-'+time+(String(mime).includes('webm')?'.webm':'.mp4');
}
export function installGameplayRecorder({
  canvas,button,panel,video,info,saveLink,shareButton,closeButton,
  canRecord=()=>true
}){
  if(!canvas||!button||!panel||!video||!info||!saveLink||!shareButton||!closeButton)
    throw Error('Gameplay recorder controls missing');
  let state='idle',recorder=null,stream=null,chunks=[],bytes=0,started=0;
  let tickTimer=null,finishTimer=null,watchdog=null,framePulseTimer=null;
  let objectUrl=null,output=null;
  let outputName='',recordedMime='',initialWidth=0,initialHeight=0,generation=0;
  // The strict original Chromium recording showed a real 0.0333s/ONE-frame
  // H264 artifact even while WebGL continued drawing. A timer pulse outside
  // the WebGL draw phase can miss every real rendered canvas. Request source
  // capture only AFTER finished genuine game WebGL frames; no fake clocks,
  // staged pixels, extra rendering pass, altered formats or save writes.
  let lastLiveVideoFrame=-Infinity,sourceFramePulses=0;

  function timers(){
    if(tickTimer!==null)clearInterval(tickTimer);
    if(finishTimer!==null)clearTimeout(finishTimer);
    if(watchdog!==null)clearTimeout(watchdog);
    if(framePulseTimer!==null)clearInterval(framePulseTimer);
    tickTimer=finishTimer=watchdog=framePulseTimer=null;
  }
  function releaseTracks(){
    try{stream?.getTracks().forEach(track=>track.stop());}catch(_){}
    stream=null;
  }
  function clearPreview(){
    video.pause();
    video.removeAttribute('src');
    video.load();
    if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null;}
    output=null;outputName='';recordedMime='';
    saveLink.removeAttribute('href');
    saveLink.hidden=true;
    shareButton.disabled=true;
  }
  function buttonState(){
    const active=state==='recording';
    button.classList.toggle('capturing',active);
    button.setAttribute('aria-pressed',active?'true':'false');
    if(active){
      const remaining=Math.max(0,Math.ceil((MAX_CAPTURE_MS-(performance.now()-started))/1000));
      button.textContent='■ '+remaining+'s';
      button.setAttribute('aria-label','Stop gameplay recording, '+remaining+' seconds remaining');
    }else{
      button.textContent=state==='finalizing'?'SAVING…':'● REC';
      button.setAttribute('aria-label',state==='finalizing'?'Finishing gameplay clip':'Record 10 seconds of gameplay');
    }
    button.disabled=state==='finalizing';
  }
  function reportError(reason){
    timers();releaseTracks();recorder=null;chunks=[];bytes=0;
    clearPreview();
    state='idle';buttonState();
    panel.hidden=false;
    video.hidden=true;
    info.textContent=reason+' Use iPhone Control Center Screen Recording if this browser cannot capture the game canvas.';
  }
  function interrupt(reason='Recording interrupted'){
    if(state!=='recording'&&state!=='finalizing')return;
    generation++;
    state='aborted';
    timers();
    try{if(recorder&&recorder.state!=='inactive')recorder.stop();}catch(_){}
    releaseTracks();recorder=null;chunks=[];bytes=0;
    reportError(reason+'. Partial video discarded; world saves unchanged.');
  }
  function finish(){
    if(state!=='recording')return;
    state='finalizing';buttonState();timers();
    try{
      if(recorder?.state!=='recording')throw Error('Encoder stopped unexpectedly');
      recorder.stop();
      watchdog=setTimeout(()=>{
        if(state==='finalizing')interrupt('Video encoder did not finish');
      },6000);
    }catch(error){interrupt('Could not finalize recording: '+String(error?.message||error));}
  }
  function presentClip(){
    timers();releaseTracks();
    const mime=String(recorder?.mimeType||recordedMime||'video/mp4').split(';')[0];
    recorder=null;
    const parts=chunks;chunks=[];
    if(!parts.length||bytes<2048||bytes>MAX_CAPTURE_BYTES){
      reportError('Recording produced no usable video data');return;
    }
    const clip=new Blob(parts,{type:mime});
    if(!clip.size){reportError('Recording file is empty');return;}
    output=clip;recordedMime=mime;outputName=recordingFilename(new Date(),mime);
    objectUrl=URL.createObjectURL(clip);
    video.hidden=false;
    video.src=objectUrl;
    video.load();
    saveLink.href=objectUrl;
    saveLink.download=outputName;
    saveLink.hidden=false;
    shareButton.disabled=!(typeof navigator.share==='function'&&typeof File==='function');
    panel.hidden=false;state='ready';buttonState();
    info.textContent='Recorded '+Math.min(10,(performance.now()-started)/1000).toFixed(1)+
      ' seconds · '+(clip.size/1048576).toFixed(1)+' MiB. Play the video to confirm moving gameplay frames, then Save or Share.';
    video.onloadedmetadata=()=>{
      if(state!=='ready')return;
      if(video.videoWidth<1||video.videoHeight<1){
        info.textContent='Video has no decoded picture. Try native iPhone Screen Recording.';
      }else if(Number.isFinite(video.duration)&&video.duration>MAX_CAPTURE_MS/1000+3){
        info.textContent='Video duration looks incorrect. Preview carefully before sharing.';
      }
    };
    video.onerror=()=>{
      if(state==='ready')info.textContent='Video playback failed in this browser. Try Save, or use native iPhone Screen Recording.';
    };
  }
  function startCapture(){
    if(state==='recording'||state==='finalizing')return;
    clearPreview();panel.hidden=true;video.hidden=true;
    const MediaRecorderType=globalThis.MediaRecorder;
    const type=recordingMime(MediaRecorderType);
    if(type===null||typeof canvas.captureStream!=='function'){
      reportError('Canvas video recording is not available in this browser');return;
    }
    if(document.hidden||!canRecord()||canvas.width<1||canvas.height<1){
      reportError('Return to a visible, loaded 3D game before recording');return;
    }
    try{
      initialWidth=canvas.width;initialHeight=canvas.height;
      stream=canvas.captureStream(CAPTURE_FPS);
      if(!stream?.getVideoTracks()?.length)throw Error('No canvas video track available');
      recorder=new MediaRecorderType(stream,type?{mimeType:type}:undefined);
      recordedMime=recorder.mimeType||type||'video/mp4';
      chunks=[];bytes=0;started=performance.now();state='recording';
      lastLiveVideoFrame=-Infinity;sourceFramePulses=0;
      const token=++generation;
      recorder.ondataavailable=event=>{
        if(token!==generation||state==='aborted'||!event.data?.size)return;
        chunks.push(event.data);bytes+=event.data.size;
        if(bytes>MAX_CAPTURE_BYTES)interrupt('Clip exceeded the 24 MiB memory limit');
      };
      recorder.onerror=event=>{
        if(token===generation)interrupt('Video encoder error: '+String(event.error?.message||'unknown'));
      };
      recorder.onstop=()=>{
        if(token!==generation||state!=='finalizing')return;
        presentClip();
      };
      recorder.start(1000);
      // Chromium software WebGL2 produced a genuine but truncated 0.304s
      // 3-frame MP4 despite the user's 3s recording interval. Its canvas
      // track can request source-canvas frames explicitly, independently of
      // the renderer's GPU upload cadence. Every pulse captures the ACTUAL
      // WebGL canvas; no synthetic image, simulated clock, replay or audio.
      // Safari implementations without requestFrame keep ordinary capture.
      const videoTrack=stream.getVideoTracks()[0];
      if(typeof videoTrack?.requestFrame==='function'){
        try{videoTrack.requestFrame();}catch(_){}
        framePulseTimer=setInterval(()=>{
          if(state!=='recording')return;
          try{videoTrack.requestFrame();}catch(error){
            // Some browsers disallow explicit capture while continuing their
            // implicit canvas stream. Stop this optional pulse, not recording.
            clearInterval(framePulseTimer);framePulseTimer=null;
          }
        },100);
      }
      buttonState();
      tickTimer=setInterval(()=>{
        if(canvas.width!==initialWidth||canvas.height!==initialHeight){
          interrupt('Game resolution changed during recording');return;
        }
        buttonState();
      },200);
      finishTimer=setTimeout(finish,MAX_CAPTURE_MS);
    }catch(error){
      generation++;
      try{if(recorder?.state==='recording')recorder.stop();}catch(_){}
      reportError('Recording could not start: '+String(error?.message||error));
    }
  }
  function captureGameFrame(when=performance.now()){
    if(state!=='recording'||!stream||!Number.isFinite(when)||
       when-lastLiveVideoFrame<1000/CAPTURE_FPS)return false;
    const track=stream.getVideoTracks?.()[0];
    if(typeof track?.requestFrame!=='function')return false;
    try{
      track.requestFrame();lastLiveVideoFrame=when;sourceFramePulses++;
      return true;
    }catch(_){return false;}
  }
  function dismiss(){
    if(state==='recording'||state==='finalizing')interrupt('Recording canceled');
    panel.hidden=true;clearPreview();state='idle';buttonState();
  }
  button.addEventListener('click',()=>{
    if(state==='recording')finish();
    else startCapture();
  });
  closeButton.addEventListener('click',dismiss);
  saveLink.addEventListener('click',()=>{if(!output)saveLink.removeAttribute('href');});
  shareButton.addEventListener('click',async()=>{
    if(!output||typeof navigator.share!=='function'||typeof File!=='function')return;
    const file=new File([output],outputName,{type:recordedMime});
    try{
      if(typeof navigator.canShare==='function'&&!navigator.canShare({files:[file]})){
        info.textContent='File sharing is unavailable. Use Save Video instead.';return;
      }
      await navigator.share({files:[file],title:'Mythwrought gameplay clip'});
      info.textContent='Sharing completed. The clip remains available until you close this preview.';
    }catch(error){
      if(error?.name!=='AbortError')info.textContent='Share failed. Use Save Video instead.';
    }
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)interrupt('Recording stopped because the game was backgrounded');
  });
  window.addEventListener('pagehide',()=>interrupt('Recording stopped when the page closed'));
  canvas.addEventListener('webglcontextlost',()=>interrupt('Graphics context was lost'));
  buttonState();
  return Object.freeze({
    interrupt,state:()=>state,captureGameFrame,
    framePulseCount:()=>sourceFramePulses
  });
}
