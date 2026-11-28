// Isolated player-facing preview; host owns mounting, focus and gameplay control release.
import {SKILL_CATEGORIES} from './registry.mjs';
import {layoutSkillTree,progressionFeedback} from './skill-view.mjs';
import {getCandidateTree} from './candidate-trees.mjs';
import {skillStatistics} from './skill-actions.mjs';
const glyphs={combat:'⚔',gathering:'◆',exploration:'✦',specialized:'✧'};
export function mountSkillPanel({root,view,actions=null,onClose=()=>{}}={}){
  if(!root?.ownerDocument||typeof view?.read!=='function')throw Error('Invalid panel host');
  const d=root.ownerDocument,make=(tag,cls,text)=>{const e=d.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  const panel=make('section','pm-panel'),header=make('header','pm-header'),heading=make('h2','','Path of Mastery'),close=make('button','pm-close','Close'),tabs=make('nav','pm-tabs'),body=make('div','pm-body'),list=make('div','pm-list'),detail=make('div','pm-detail'),notice=make('p','pm-notice','Loading verified progression…');
  panel.setAttribute('aria-label','Path of Mastery');notice.setAttribute('role','status');header.append(heading,close);body.append(list,detail);panel.append(header,tabs,body,notice);root.append(panel);
  let category='combat',selected=null,prior=null,disposed=false,epoch=0,zoom=1;
  const button=(text,fn)=>{const b=make('button','',text);b.type='button';b.addEventListener('click',fn);return b;};
  function destroy(){if(disposed)return;disposed=true;epoch++;view.invalidate?.();actions?.close();panel.remove();}
  close.type='button';close.addEventListener('click',()=>{destroy();onClose();});
  async function refresh(){const token=++epoch;let state;try{state=await view.read(category,selected);}catch{state={ok:false,reason:'unavailable'};}if(disposed||token!==epoch)return;
    if(!state.ok){list.replaceChildren();detail.replaceChildren();notice.textContent='Progression unavailable · no changes made';return;}
    selected=state.skill.id;tabs.replaceChildren(...SKILL_CATEGORIES.map(c=>{const b=button(glyphs[c]+' '+c,()=>{category=c;selected=null;zoom=1;refresh();});b.setAttribute('aria-pressed',String(c===category));return b;}));
    list.replaceChildren(...state.entries.map(s=>{const b=button(s.name+' · '+s.level,()=>{selected=s.id;zoom=1;refresh();});b.setAttribute('aria-pressed',String(s.id===selected));return b;}));
    const s=state.skill,stats=skillStatistics(state),title=make('h3','',s.name+' · Level '+s.level+'/99'),desc=make('p','',s.description),meter=make('progress','pm-xp');meter.max=1;meter.value=s.fraction;meter.setAttribute('aria-label',s.name+' level progress');
    detail.replaceChildren(title,desc,meter,make('p','pm-meta',s.xp.toLocaleString()+' XP · '+(s.maxed?'Mastered':s.xpToNext.toLocaleString()+' to next level')),make('p','pm-deferred','Development preview · gameplay progression deferred'),make('p','pm-meta',stats?'Total level '+stats.totalLevel+' · '+stats.totalXp.toLocaleString()+' XP · '+stats.maxed+' maxed':''));
    if(state.tree&&state.allocation){const layout=layoutSkillTree(state.tree),tools=make('div','pm-tree-tools'),viewport=make('div','pm-tree-viewport'),surface=make('div','pm-tree-surface'),graph=make('div','pm-tree-graph'),info=make('p','pm-meta','Select a node to inspect prerequisites');viewport.tabIndex=0;viewport.setAttribute('aria-label','Skill tree; scroll to explore');
      graph.style.width=layout.width+'px';graph.style.height=layout.height+'px';const setZoom=z=>{zoom=Math.max(1,Math.min(1.6,z));surface.style.width=layout.width*zoom+'px';surface.style.height=layout.height*zoom+'px';graph.style.transform='scale('+zoom+')';};
      tools.append(make('span','',state.allocation.remaining+' points available'),button('−',()=>setZoom(zoom-.15)),button('+',()=>setZoom(zoom+.15)),button('Reset view',()=>{setZoom(1);viewport.scrollTo(0,0);}));
      const svg=d.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('width',layout.width);svg.setAttribute('height',layout.height);svg.setAttribute('aria-hidden','true');svg.classList.add('pm-links');
      for(const p of layout.nodes){const n=state.tree.nodes.find(n=>n.id===p.id);for(const req of n.requires){const from=layout.nodes.find(q=>q.id===req.id),line=d.createElementNS('http://www.w3.org/2000/svg','line');for(const [key,value] of Object.entries({x1:from.x+140,y1:from.y+24,x2:p.x,y2:p.y+24}))line.setAttribute(key,value);svg.append(line);}}graph.append(svg);
      const controls=make('div','pm-tree-tools'),status=make('p','pm-meta',''),label=id=>getCandidateTree(s.id)?.labels[id]??id;
      let pending=false,chosen=null,preview=null;
      async function act(fn){if(pending||disposed||token!==epoch)return;pending=true;let result;try{result=await fn();}catch{result={ok:false,reason:'unavailable'};}finally{pending=false;}if(disposed||token!==epoch)return;await refresh();if(!disposed&&token+1===epoch)notice.textContent=result.ok?'Specialization updated':'Change refused · '+result.reason;}
      if(actions&&state.kind!=='sealed'){
        const buy=button('Purchase rank',()=>{if(chosen)act(()=>actions.purchase(s.id,state.allocation.revision,chosen));});buy.disabled=true;
        const confirm=button('Confirm free respec',()=>{if(preview)act(()=>actions.confirmRespec(preview));});confirm.disabled=true;
        const respec=button('Preview respec',async()=>{if(pending||disposed||token!==epoch)return;const p=await actions.previewRespec(s.id,state.allocation.revision);if(disposed||token!==epoch)return;preview=p.ok?p:null;confirm.disabled=!preview;status.textContent=p.ok?'Refund '+p.refund+' points · XP and levels retained':'Respec unavailable';});
        const name=make('input','pm-preset-name');name.maxLength=40;name.placeholder='Preset name';name.setAttribute('aria-label','Preset name');
        const presets=make('select','pm-presets');presets.setAttribute('aria-label','Saved presets');for(const n of state.allocation.presets){const option=make('option','',n);option.value=n;presets.append(option);}
        controls.append(buy,respec,confirm,name,button('Save preset',()=>act(()=>actions.savePreset(s.id,state.allocation.revision,name.value))),presets,button('Apply preset',()=>act(()=>actions.applyPreset(s.id,state.allocation.revision,presets.value))),button('Remove preset',()=>act(()=>actions.removePreset(s.id,state.allocation.revision,presets.value))));
        controls.addEventListener('pm-node-selected',()=>{buy.disabled=!chosen;});
      }
      for(const p of layout.nodes){const n=state.tree.nodes.find(n=>n.id===p.id),rank=state.allocation.ranks[n.id]??0;const e=button(label(n.id)+' · '+rank+'/'+n.costs.length,()=>{chosen=n.id;controls.dispatchEvent(new d.defaultView.Event('pm-node-selected'));info.textContent=label(n.id)+' · Level '+n.level+' · '+(n.requires.map(r=>r.id+' rank '+r.rank).join(', ')||'No prerequisites')+' · Costs '+n.costs.join('/')+' · '+n.effect;});e.className='pm-node';e.style.left=p.x+'px';e.style.top=p.y+'px';e.setAttribute('aria-label',n.id+' rank '+rank+' of '+n.costs.length);e.dataset.purchased=String(rank>0);graph.append(e);}surface.append(graph);setZoom(zoom);viewport.append(surface);detail.append(tools,viewport,info,controls,status);
    }else detail.append(make('p','pm-empty','Specialization tree not available yet.'));
    const changes=progressionFeedback(prior,state);prior=state;notice.textContent=changes.length?changes.map(c=>c.name+' +'+c.gain+' XP'+(c.levels?' · +'+c.levels+' levels':'')).join(' | '):'Development preview · no gameplay XP is issued';
  }
  refresh();return Object.freeze({refresh,destroy});
}
