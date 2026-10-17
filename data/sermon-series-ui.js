(function(){
"use strict";
const all=(window.SERMON_SERIES_DATA?.sermons||[]).slice().sort((a,b)=>a.order-b.order);
const card=document.getElementById('sermonSingleCard');
const count=document.getElementById('sermonCount');
const board=document.getElementById('sermonBoard');
if(!card||!count||!board||!all.length)return;
const safe=window.KRVBible?.safe||((s)=>String(s??''));
let idx=Math.floor(Math.random()*all.length), timer=null, paused=false;
const wrap=i=>(i+all.length)%all.length;
function stop(){paused=true;if(timer){clearInterval(timer);timer=null;}}
function next(delta){idx=wrap(idx+delta);render();}
function render(){
 const s=all[idx];
 count.textContent=`${String(s.order).padStart(2,'0')} / ${String(all.length).padStart(2,'0')}`;
 const outline=(s.outline||[]).map(x=>`<div class="sermon-card-outline-item"><strong>${safe(x.title)}</strong>${x.content?`<p>${safe(x.content)}</p>`:''}</div>`).join('');
 card.innerHTML=`<div class="sermon-card-left"><span class="sermon-single-number">SERMON ${String(s.order).padStart(2,'0')}</span><h3>${safe(s.title)}</h3><p class="sermon-single-topic">${safe(s.topic)}</p><span class="sermon-question-label">핵심 질문</span><p class="sermon-single-question">${safe(s.question)}</p></div><div class="sermon-card-right"><div><h4 class="sermon-panel-title">주제문</h4><p class="sermon-single-thesis">${safe(s.mainStatement)}</p></div><div><h4 class="sermon-panel-title">아웃트라인</h4><div class="sermon-card-outline">${outline}</div></div><div class="sermon-card-footer"><a class="sermon-open-link" href="sermon-detail.html?sermon=${s.order}">원고보기</a></div></div>`;
}
function interaction(){stop();}
board.addEventListener('pointerdown',interaction,{passive:true});
board.addEventListener('touchstart',interaction,{passive:true});
board.addEventListener('focusin',interaction);
document.getElementById('sermonLeft').addEventListener('click',()=>{stop();next(-1)});
document.getElementById('sermonRight').addEventListener('click',()=>{stop();next(1)});
let sx=null;
card.addEventListener('touchstart',e=>{stop();sx=e.changedTouches[0].clientX},{passive:true});
card.addEventListener('touchend',e=>{if(sx===null)return;const d=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(d)>40)next(d<0?1:-1)},{passive:true});
board.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){stop();next(e.key==='ArrowLeft'?-1:1);e.preventDefault();}});
render();
if(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){timer=setInterval(()=>{if(!paused)next(1)},3000)}
})();
