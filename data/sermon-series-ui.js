(function(){
"use strict";
const all=(window.SERMON_SERIES_DATA?.sermons||[]).slice().sort((a,b)=>a.order-b.order);
const card=document.getElementById('sermonSingleCard');
const count=document.getElementById('sermonCount');
const board=document.getElementById('sermonBoard');
if(!card||!count||!board||all.length===0)return;
// Only explicitly approved full manuscripts count as complete; planned '확정편' slots do not.
const workState=board.querySelector('.sermon-work-state');
if(workState){
 const completed=all.filter(s=>s.manuscriptFinalized===true&&typeof s.manuscriptHtml==='string'&&s.manuscriptHtml.trim().length>0).length;
 workState.textContent=`전체 ${all.length}편 중 ${completed}편 원고 확정`;
}

const safe=window.KRVBible?.safe||((s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
let idx=Math.floor(Math.random()*all.length),timer=null,paused=false;
const wrap=i=>(i+all.length)%all.length;
function stop(){paused=true;if(timer){clearInterval(timer);timer=null;}}
function next(delta){idx=wrap(idx+delta);render();}
function render(){
 const s=all[idx];
 card.href='sermon-detail.html?sermon='+encodeURIComponent(s.order);
 card.setAttribute('aria-label','설교 '+s.order+'회: '+s.title+' · 상세 원고보기');
 count.textContent=String(idx+1).padStart(2,'0')+' / '+String(all.length).padStart(2,'0');
 card.innerHTML='<div class="sermon-card-left">'
   +'<span class="sermon-single-number">SERMON '+String(s.order).padStart(2,'0')+'</span>'
   +'<h3>'+safe(s.title)+'</h3>'
   +'<span class="sermon-card-open" aria-hidden="true">원고보기</span>'
   +'</div><div class="sermon-card-right">'
   +'<section class="sermon-card-panel">'
   +'<p class="sermon-single-question">'+safe(s.question||'')+'</p></section>'
   +'<section class="sermon-card-panel"><h4 class="sermon-panel-title">주제문</h4>'
   +'<p class="sermon-single-thesis">'+safe(s.mainStatement||'')+'</p></section>'
   +'</div>';
}
function interact(){stop();}
board.addEventListener('pointerdown',interact,{passive:true});
board.addEventListener('touchstart',interact,{passive:true});
board.addEventListener('focusin',interact);
document.getElementById('sermonLeft').addEventListener('click',()=>{stop();next(-1)});
document.getElementById('sermonRight').addEventListener('click',()=>{stop();next(1)});
let sx=null,swiped=false;
card.addEventListener('touchstart',e=>{stop();sx=e.changedTouches[0].clientX;swiped=false},{passive:true});
card.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>42){swiped=true;next(dx<0?1:-1)}},{passive:true});
card.addEventListener('click',e=>{if(swiped){e.preventDefault();swiped=false;}else stop()});
board.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){stop();next(e.key==='ArrowLeft'?-1:1);e.preventDefault()}});
render();
if(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){timer=setInterval(()=>{if(!paused)next(1)},5000)}
})();
