(function(){
"use strict";
const data=window.SERMON_SERIES_DATA?.sermons||[];
const all=data.slice().sort((a,b)=>a.order-b.order);
const card=document.getElementById('sermonSingleCard');
const count=document.getElementById('sermonCount');
const tabs=document.getElementById('sermonTopicTabs');
const board=document.getElementById('sermonBoard');
if(!card||!count||!tabs||!board||all.length===0)return;
const safe=window.KRVBible?.safe||((s)=>String(s??''));
let showing=all;
let idx=Math.floor(Math.random()*all.length);
let timer=null;
let paused=false;
const wrap=i=>(i+showing.length)%showing.length;
function stop(){paused=true;if(timer){clearInterval(timer);timer=null;}}
function advance(delta){if(!showing.length)return;idx=wrap(idx+delta);render();}
function render(){
 const s=showing[idx];
 if(!s)return;
 count.textContent=`${String(idx+1).padStart(2,'0')} / ${String(showing.length).padStart(2,'0')}`;
 card.innerHTML=`<div><span class="sermon-single-number">SERMON ${String(s.order).padStart(2,'0')}</span><h3>${safe(s.title)}</h3><p class="sermon-single-topic">성품 논점 · ${safe(s.topic)}</p><p class="sermon-single-thesis">${safe(s.mainStatement)}</p></div><a class="sermon-open-link" href="sermon-detail.html?sermon=${s.order}">원고보기</a>`;
}
const topics=[...new Set(all.map(s=>s.topic).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ko'));
function addTab(value,label){
 const btn=document.createElement('button');btn.className='sermon-topic-tab';btn.type='button';btn.textContent=label;
 btn.dataset.topic=value;btn.setAttribute('aria-pressed',value===''?'true':'false');
 btn.addEventListener('click',()=>{
   stop();
   tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
   showing=value?all.filter(s=>s.topic===value):all;
   idx=Math.floor(Math.random()*showing.length);render();
 });tabs.appendChild(btn);
}
addTab('','전체');topics.forEach(t=>addTab(t,t));
function captureTouch(){stop()}
for(const el of [board,card,tabs]){
  el.addEventListener('pointerdown',captureTouch,{passive:true});
  el.addEventListener('touchstart',captureTouch,{passive:true});
}
document.getElementById('sermonLeft').addEventListener('click',()=>{stop();advance(-1)});
document.getElementById('sermonRight').addEventListener('click',()=>{stop();advance(1)});
let sx=null;
card.addEventListener('touchstart',e=>{stop();sx=e.changedTouches[0].clientX},{passive:true});
card.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>40)advance(dx<0?1:-1)},{passive:true});
board.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){stop();advance(e.key==='ArrowLeft'?-1:1);e.preventDefault();}});
render();
timer=setInterval(()=>{if(!paused&&showing.length>1)advance(1)},3000);
})();
