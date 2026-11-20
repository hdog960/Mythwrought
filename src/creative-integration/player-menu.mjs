// MYTHWROUGHT player-facing no-scroll settings. Hidden legacy controls remain
// mounted for their proven gameplay/save adapters, never removed or cloned.
const make=(tag,cls,text)=>{const n=document.createElement(tag);
  if(cls)n.className=cls;if(text)n.textContent=text;return n;};
function button(label,handler){
  const element=make('button','player-menu-button',label);
  element.type='button';
  element.addEventListener('click',async()=>{
    if(element.disabled)return;
    element.disabled=true;
    try{await handler();}
    catch(error){const status=element.closest('.player-menu')?.querySelector('[role=status]');
      if(status)status.textContent='Action protected: '+String(error?.message||error);}
    finally{element.disabled=false;}
  });
  return element;
}
export function installPlayerMenu({container,onDiagnostics,onDay,onNight,
  onNewWorld,onClose}={}){
  if(!container?.prepend||[onDiagnostics,onDay,onNight,onNewWorld,onClose]
    .some(fn=>typeof fn!=='function'))
    throw TypeError('Player settings require mounted DOM and working callbacks');
  const panel=make('section','player-menu');
  panel.id='playerMenu';
  panel.setAttribute('aria-label','Mythwrought player settings');
  const heading=make('h1','player-menu-heading','✦ MYTHWROUGHT');
  const tagline=make('p','player-menu-tagline','WORLD SETTINGS');
  const diagnostics=make('div','player-menu-row');
  diagnostics.append(make('span','player-menu-label','Test Code'));
  diagnostics.append(button('COPY TEST CODE',onDiagnostics));
  const clock=make('div','player-menu-row');
  clock.append(make('span','player-menu-label','Time of Day'));
  const times=make('div','player-menu-times');
  times.append(button('☀ DAY',onDay),button('☾ NIGHT',onNight));clock.append(times);
  const world=make('div','player-menu-row');
  world.append(make('span','player-menu-label','World Generation'));
  world.append(button('✦ NEW WORLD',onNewWorld));
  const status=make('p','player-menu-status','Current accepted generation · saves protected');
  status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const back=button('RETURN TO GAME',onClose);
  back.classList.add('player-menu-close');
  panel.append(heading,tagline,diagnostics,clock,world,status,back);
  container.prepend(panel);
  return Object.freeze({panel,showStatus:(message)=>{status.textContent=message;}});
}
