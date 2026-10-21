/* Unified 30-episode proportional revival timeline. All original text is loaded from a local, immutable data file. */
(function(){
'use strict';
const EVENTS=window.REVIVAL_ATLAS_30;
if(!Array.isArray(EVENTS)||EVENTS.length!==30){document.getElementById('story').textContent='연대표 자료를 불러오지 못했습니다.';return;}
const byId=new Map(EVENTS.map(e=>[e.id,e]));
const stage=document.getElementById('timelineStage'),viewport=document.getElementById('timelineViewport');
const detail=document.getElementById('detail'),title=document.getElementById('detailTitle'),story=document.getElementById('story');
const search=document.getElementById('eventSearch');
let selectedId=null,activeCentury='all',query='';
// Time-point positions stay strictly proportional to historical start years.
// Cards may be offset horizontally (via subtle connector lines) to avoid crowding.
const SCALE=28,BASE_YEAR=1625,LEFT=170,CARD_W=272,CARD_H=46,CARD_GAP=14;
const AXIS_Y=140,HEIGHT=309,LANE_Y=[72,12,164,222];
const positions=EVENTS.map(e=>({...e,x:LEFT+(e.year-BASE_YEAR)*SCALE}));
const clusters=[];
for(const p of positions){
  const cluster=clusters[clusters.length-1];
  if(!cluster||p.x-cluster[cluster.length-1].x>CARD_W+CARD_GAP)clusters.push([p]);
  else cluster.push(p);
}
const lanePatterns=[[0,2,1,3],[2,0,3,1],[0,3,2,1],[2,1,0,3],[1,3,0,2],[3,1,2,0],[1,2,3,0],[3,0,1,2]];
const minDistance=CARD_W+CARD_GAP;
// Equal-weight isotonic projection gives minimum movement for every card on a row.
function packLane(seq){
  const blocks=[];
  seq.forEach((p,i)=>{
    blocks.push({begin:i,end:i,average:p.x-i*minDistance,count:1});
    while(blocks.length>1&&blocks[blocks.length-2].average>blocks[blocks.length-1].average){
      const right=blocks.pop(),left=blocks.pop();
      blocks.push({begin:left.begin,end:right.end,average:(left.average*left.count+right.average*right.count)/(left.count+right.count),count:left.count+right.count});
    }
  });
  const packed=[];
  for(const b of blocks)for(let i=b.begin;i<=b.end;i++)packed[i]=b.average+i*minDistance;
  return packed;
}
for(const cluster of clusters){
  let chosen=null;
  for(const pattern of lanePatterns){
    const bins=[[],[],[],[]];
    cluster.forEach((p,i)=>bins[pattern[i%4]].push(p));
    const placements=[];let cost=0;
    for(let lane=0;lane<4;lane++){
      const seq=bins[lane],centers=packLane(seq);
      seq.forEach((p,j)=>{
        const center=centers[j],drift=center-p.x;
        cost+=drift*drift + (Math.abs(drift)>145 ? 3*Math.pow(Math.abs(drift)-145,2) : 0);
        cost+=(lane===0?0:lane===2?8:lane===1?16:24);
        placements.push({p,lane,center});
      });
    }
    if(!chosen||cost<chosen.cost)chosen={placements,cost};
  }
  for(const entry of chosen.placements){entry.p.lane=entry.lane;entry.p.cardX=entry.center;}
}
const STAGE_W=Math.ceil(Math.max(LEFT+((2023-BASE_YEAR)*SCALE)+CARD_W, ...positions.map(p=>p.cardX+CARD_W/2+22)));
stage.style.width=STAGE_W+'px';stage.style.height=HEIGHT+'px';
stage.querySelector('.axis').style.top=AXIS_Y+'px';
function create(tag,className,text){const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;}
function xOf(y){return LEFT+(y-BASE_YEAR)*SCALE;}
for(let year=1625;year<=2023;year+=25){let tick=create('div','tick'),span=create('span','',year+'');tick.style.left=xOf(year)+'px';tick.style.top=(AXIS_Y-13)+'px';tick.setAttribute('aria-hidden','true');tick.appendChild(span);stage.appendChild(tick);}
const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
svg.setAttribute('viewBox','0 0 '+STAGE_W+' '+HEIGHT);svg.setAttribute('width',STAGE_W);svg.setAttribute('height',HEIGHT);svg.classList.add('timeline-connectors');svg.setAttribute('aria-hidden','true');stage.appendChild(svg);
const nodes=[];
for(const p of positions){
  const top=LANE_Y[p.lane],fromTop=p.lane<2,edgeY=fromTop?top+CARD_H:top;
  const line=document.createElementNS('http://www.w3.org/2000/svg','path');line.setAttribute('class','connector-path');
  const bend=fromTop?AXIS_Y-13:AXIS_Y+13;
  line.setAttribute('d',`M ${p.x} ${AXIS_Y} L ${p.x} ${bend} L ${p.cardX} ${edgeY}`);svg.appendChild(line);
  const dot=create('button','dot');dot.type='button';dot.style.left=p.x+'px';dot.style.top=(AXIS_Y+1)+'px';dot.setAttribute('aria-label',p.date+' '+p.title+' 선택');dot.title=p.date+' · '+p.title;dot.addEventListener('click',()=>selectEvent(p.id,true,true));stage.appendChild(dot);
  const card=create('button','event-node');card.type='button';card.dataset.eventId=p.id;card.style.left=(p.cardX-CARD_W/2)+'px';card.style.top=top+'px';card.title=p.date+' · '+p.title;card.setAttribute('aria-label',p.date+' '+p.title+' 상세 내용 읽기');card.setAttribute('aria-pressed','false');card.append(create('span','date',p.date),create('span','separator','·'),create('span','name',p.title));card.addEventListener('click',()=>selectEvent(p.id,true,true));stage.appendChild(card);nodes.push({p,card,dot,top});
}
window.__revivalAtlasGeometry={scale:SCALE,baseYear:BASE_YEAR,axisY:AXIS_Y,width:STAGE_W,height:HEIGHT,nodes:nodes.map(({p,top})=>({id:p.id,year:p.year,x:p.x,cardX:p.cardX,top,width:CARD_W,height:CARD_H,lane:p.lane})),lanes:4};
function safeURL(href){try{let u=new URL(href,location.href);return u.protocol==='https:'||u.protocol==='http:'?u.href:null;}catch{return null;}}
function appendTrustedMarkup(container,markup){
    // Source HTML comes from the installed manuscript package, not user-input strings.
    // No embedded scripts, inline event handlers, forms or arbitrary frame elements are allowed.
    const template=document.createElement('template');template.innerHTML=markup;
    for(const unsafe of template.content.querySelectorAll('script,iframe,object,embed,form,svg'))unsafe.remove();
    for(const el of template.content.querySelectorAll('*')){
        for(const a of Array.from(el.attributes)){
            if(/^on/i.test(a.name)||a.name==='srcdoc'||(a.name==='href'&&/^(?:javascript|data):/i.test(a.value)))el.removeAttribute(a.name);
        }
        if(el.tagName==='A'){
            const href=el.getAttribute('href');if(href&&/^https?:/i.test(href)&&safeURL(href)){el.target='_blank';el.rel='noopener noreferrer';}
        }
    }
    container.appendChild(template.content);
}
function renderAnnotationRow(e){
    const row=create('div','annotation-row');
    const a=create('details','annotation-gate'),b=create('details','annotation-gate');
    const as=create('summary','', '학술주석 및 사료·신학 검토 펼치기');
    const bs=create('summary','', '출처 보기');
    const contentA=create('div','annotation-content');appendTrustedMarkup(contentA,e.annotations);
    {
      const res=create('details','reserve-details');res.append(create('summary','','연구상 유보사항'),(()=>{const el=create('div','reserve-content');if(e.reservations&&e.reservations.trim())appendTrustedMarkup(el,e.reservations);else el.appendChild(create('p','','원고에 독립된 연구상 유보사항 구획은 없습니다. 검증 수준과 사료상 한계에 관한 원문 내용은 위 학술주석에서 확인할 수 있습니다.'));return el;})());contentA.appendChild(res);
    }
    const contentB=create('div','annotation-content');appendTrustedMarkup(contentB,e.sources);
    a.append(as,contentA);b.append(bs,contentB);row.append(a,b);return row;
}
function renderStory(e){
  story.replaceChildren();
  const main=create('div','history-story');
  if(e.kind==='video'){
    const dl=create('dl','history-intro');
    for(const key of ['지역','교단·신학적 배경','발단','전개','영향','신학적 평가']){
      let line=create('div','intro-line');line.append(create('dt','',key),create('dd','',e.intro[key]||''));dl.appendChild(line);
    }
    main.appendChild(dl);
    const film=create('section','atlas-film');film.appendChild(create('h3','','동영상'));
    if(e.videoId&&e.videoUrl){
      const frame=create('iframe','atlas-player');frame.loading='lazy';frame.title=e.title+' 기존 역사 영상';frame.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');frame.setAttribute('allowfullscreen','');frame.src='https://www.youtube-nocookie.com/embed/'+e.videoId;
      const watch=create('a','','YouTube에서 영상 보기 ↗');watch.href=e.videoUrl;watch.target='_blank';watch.rel='noopener noreferrer';film.append(frame,watch);
    }else film.appendChild(create('p','video-pending','동영상은 아직 등록되지 않았습니다. 영상이 제작되면 이 영역에 추가됩니다.'));
    main.appendChild(film);
    const details=create('details','atlas-expand atlas-story-details');details.dataset.storyDetails='true';details.appendChild(create('summary','','상세 이야기 읽기'));
    const body=create('article','long-body');appendTrustedMarkup(body,e.body);details.appendChild(body);
    details.appendChild(renderAnnotationRow(e));main.appendChild(details);
  }else{
    const research=create('article','long-body research-text');appendTrustedMarkup(research,e.body);main.appendChild(research);
    main.appendChild(renderAnnotationRow(e));
  }
  story.appendChild(main);
}
function requestFocus(){
  if(document.documentElement.classList.contains('atlas-home-embedded')){
    window.parent.postMessage({type:'revival-atlas:focus',offset:detail.getBoundingClientRect().top+window.scrollY},location.origin);
  }else detail.scrollIntoView({block:'start',behavior:'auto'});
}
function currentShareURL(id){const u=new URL('revival-atlas-share.html',location.href);u.search='?event='+encodeURIComponent(id);u.hash='';return u.href;}
function fallbackCopy(value){let input=document.createElement('textarea');input.value=value;input.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';document.body.appendChild(input);input.select();let ok=false;try{ok=document.execCommand('copy');}catch{}input.remove();if(!ok)window.prompt('아래 주소를 복사하세요.',value);return ok;}
const copyBtn=document.getElementById('eventCopyButton');
copyBtn.addEventListener('click',async()=>{
  if(!selectedId)return;let u=currentShareURL(selectedId),ok=false;
  try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(u);ok=true;}}catch{}
  if(!ok)ok=fallbackCopy(u);
  if(ok){copyBtn.textContent='복사됨 ✓';window.setTimeout(()=>copyBtn.textContent='링크 복사',2000);}
});
function activateVisualSelection(id){
  for(const {p,card,dot} of nodes){let on=p.id===id;card.classList.toggle('active',on);dot.classList.toggle('active',on);card.setAttribute('aria-pressed',String(on));}
}
function scrollCardIntoView(id){const n=nodes.find(x=>x.p.id===id);if(!n)return;const desired=n.p.cardX-viewport.clientWidth/2;viewport.scrollTo({left:Math.max(0,desired),behavior:'auto'});}
function selectEvent(id,bringDetail,writeHistory){
  if(id==='shotts')id='stewarton';if(id==='kilsyth1742')id='cambuslang';
  const e=byId.get(id);if(!e)return;
  selectedId=id;activateVisualSelection(id);
  let index=EVENTS.indexOf(e);
  document.getElementById('detailCount').textContent=(index+1)+' / 30';
  title.textContent=e.title;document.getElementById('detailMeta').textContent=e.date+' · '+e.region+' · '+(e.kind==='research'?'비영상 신학·역사 연구':'영상용 역사서사');
  document.getElementById('prevBtn').disabled=index===0;document.getElementById('nextBtn').disabled=index===29;
  renderStory(e);scrollCardIntoView(id);
  if(writeHistory){let u=new URL(location.href);u.searchParams.set('event',id);if(document.documentElement.classList.contains('atlas-home-embedded'))history.replaceState({revivalEvent:id},'',u);else history.pushState({revivalEvent:id},'',u);}
  if(bringDetail)requestFocus();
}
function changeFilter(){
  let cnt=0;for(const {p,card,dot} of nodes){const matchesCentury=activeCentury==='all'||String(Math.ceil(p.year/100))===activeCentury;const hay=(p.title+' '+p.date+' '+p.region+' '+Object.values(p.intro||{}).join(' ')).toLocaleLowerCase();const matchesText=!query||hay.includes(query);const visible=matchesCentury&&matchesText;card.classList.toggle('muted',!visible);dot.classList.toggle('muted',!visible);dot.disabled=!visible;if(visible)cnt++;}
  document.getElementById('trackStatus').textContent=query?cnt+'개 검색 결과':activeCentury==='all'?'전체 30개 사건':activeCentury+'세기 · '+cnt+'개 사건';
}
search.addEventListener('input',()=>{query=search.value.trim().toLocaleLowerCase();changeFilter();if(query){let hit=nodes.find(({p,card})=>!card.classList.contains('muted'));if(hit)scrollCardIntoView(hit.p.id);}});
for(const tab of document.querySelectorAll('[data-century]'))tab.addEventListener('click',()=>{
  activeCentury=tab.dataset.century;for(const el of document.querySelectorAll('[data-century]'))el.classList.toggle('active',el===tab);
  changeFilter();const first=nodes.find(({card})=>!card.classList.contains('muted'));if(first)scrollCardIntoView(first.p.id);
});
document.getElementById('prevBtn').addEventListener('click',()=>{let i=EVENTS.findIndex(e=>e.id===selectedId);if(i>0)selectEvent(EVENTS[i-1].id,true,true);});
document.getElementById('nextBtn').addEventListener('click',()=>{let i=EVENTS.findIndex(e=>e.id===selectedId);if(i<29)selectEvent(EVENTS[i+1].id,true,true);});
function initialID(){let q=new URLSearchParams(location.search).get('event');if(q)return q;let m=location.hash.match(/^#revival-event-([a-z0-9_-]+)$/);return m?m[1]:null;}
window.addEventListener('message',(evt)=>{if(evt.origin!==location.origin||evt.source!==window.parent)return;let v=evt.data;if(v&&v.type==='revival-atlas:select'&&typeof v.id==='string')selectEvent(v.id,true,false);});
window.addEventListener('popstate',()=>{let id=initialID();if(id)selectEvent(id,true,false);});
window.addEventListener('hashchange',()=>{let id=initialID();if(id)selectEvent(id,true,false);});
// Keep current homepage iframe protocol and avoid nested vertical scrollbars.
if(document.documentElement.classList.contains('atlas-home-embedded')){
 let previous=-1;
 function report(){let main=document.getElementById('main');if(!main)return;let h=Math.ceil(main.getBoundingClientRect().bottom+window.scrollY+2);if(Math.abs(h-previous)>1){previous=h;window.parent.postMessage({type:'revival-atlas:height',height:h},location.origin);}}
 if('ResizeObserver' in window)new ResizeObserver(report).observe(document.getElementById('main'));
 window.addEventListener('load',report);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(report);report();
}
changeFilter();selectEvent(initialID()||EVENTS[0].id,!!initialID(),false);
})();
