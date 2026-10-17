(function(){
"use strict";
const all=(window.SERMON_SERIES_DATA?.sermons||[]).slice().sort((a,b)=>a.order-b.order);
const K=window.KRVBible;if(!K)return;
const root=document.getElementById('sermonDocument');
const nav=document.getElementById('sermonTopNav');
const following=document.getElementById('sermonFollowingList');
const popover=document.getElementById('versePopover');
const verses=document.getElementById('popoverVerses');
const order=Number(new URLSearchParams(location.search).get('sermon'))||1;
const sermon=all.find(s=>s.order===order)||all[0];
if(!sermon||!root||!nav||!following||!popover||!verses)return;
const safe=K.safe;
document.title=sermon.title+' | 하나님의 성품 시리즈 설교 | 부흥 프로젝트';
const mainRefs=sermon.primaryRefs||[];
const extra=sermon.extraRefs||[];
const outline=(sermon.outline||[]).map(x=>`<div class="outline-block"><strong>${safe(x.title)}</strong><p>${safe(x.content)}</p></div>`).join('');
const refItems=extra.map((ref,i)=>`<button class="ref-button" type="button" data-ref="${i}" aria-describedby="versePopover" aria-label="${safe(ref.text)} · ${safe(ref.kind)} 본문 미리보기">${safe(ref.text)}</button>`).join('');
const refBooks=(sermon.references||[]).map(x=>{
  const id=/^book(0[1-9]|1[0-5])$/.test(x.id||'')?x.id.slice(4):null;
  const bookTitle=`<strong>${safe(x.author)} — ${safe(x.title)}</strong>`;
  const category=`<small>${safe(x.category||'')}</small>`;
  return id?`<a class="reference-book" href="core-book-summaries.html#book-${id}" aria-label="${safe(x.title)} 도서요약보기">${bookTitle}<span class="reference-book-meta">${category}<span class="reference-book-link">도서요약보기</span></span></a>`
           :`<div class="reference-book">${bookTitle}${category}</div>`;
}).join('');
root.innerHTML=`<header class="document-header"><small>SERMON ${String(sermon.order).padStart(2,'0')} · ${safe(sermon.topic)}</small><h1>${safe(sermon.title)}</h1><p>설교원고 준비중</p></header><div class="document-body">

<section class="section"><h2>주제문</h2><p>${safe(sermon.mainStatement||'')}</p></section>
<section class="section"><h2>성경본문 · 개역한글</h2><div class="scripture-passage" id="mainVerses"></div><button class="scripture-more-button" id="mainVersesToggle" type="button" aria-controls="mainVerses" aria-expanded="false" hidden>더 보기</button></section>
<section class="section"><h2>보조·후보 성경구절</h2><div class="ref-items">${refItems||'<p>기록된 보조·후보 구절이 없습니다.</p>'}</div></section>
<section class="section"><h2>주제단락</h2><p>${safe(sermon.themeParagraph||'')}</p></section>
<section class="section"><h2>OUTLINE</h2>${outline||'<p>준비 중입니다.</p>'}</section>
<section class="section"><h2>관련 참고 도서</h2>${refBooks||'<p>자료 확인 중입니다.</p>'}</section>
</div>`;
// Show five Bible verses initially. The existing KRV Bible loader is unchanged.
const mainVerses=document.getElementById('mainVerses');
const mainVersesToggle=document.getElementById('mainVersesToggle');
K.show(mainRefs,mainVerses).then(()=>{
  const sections=Array.from(mainVerses.querySelectorAll('.scripture-section'));
  let count=0;
  for(const section of sections){
    const before=count;
    for(const child of section.children){
      if(child.classList.contains('scripture-chapter') && count>=5){
        child.classList.add('scripture-extra-content');
      }
      if(child.classList.contains('scripture-verse')){
        if(count>=5)child.classList.add('scripture-extra-content');
        count++;
      }
    }
    // Hide later passage headings when their entire passage is beyond verse five.
    if(before>=5 && count>before)section.classList.add('scripture-extra-content');
  }
  if(count>5){
    mainVerses.classList.add('scripture-collapsed');
    mainVersesToggle.hidden=false;
    mainVersesToggle.addEventListener('click',()=>{
      const collapsed=mainVerses.classList.toggle('scripture-collapsed');
      mainVersesToggle.textContent=collapsed?'더 보기':'접기';
      mainVersesToggle.setAttribute('aria-expanded',String(!collapsed));
    });
  }
});
let activeTrigger=null,closeTimeout=null,displayToken=0;
function positionPopover(anchor){
  if(!anchor||popover.hidden)return;
  const r=anchor.getBoundingClientRect();
  const width=Math.min(570,window.innerWidth-24);
  const height=Math.min(popover.offsetHeight,window.innerHeight*.65);
  let left=Math.max(12,Math.min(r.left,width<=window.innerWidth?window.innerWidth-width-12:12));
  let top=r.bottom+9;
  if(top+height>window.innerHeight-12)top=r.top-height-9;
  if(top<10)top=Math.max(10,Math.min(window.innerHeight-height-10,Math.round(window.innerHeight*.14)));
  popover.style.left=left+'px';popover.style.top=top+'px';
}
function openPopover(ref,btn){
  clearTimeout(closeTimeout);
  displayToken++;
  const token=displayToken;
  activeTrigger=btn;
  popover.hidden=false;
  document.getElementById('popoverTitle').textContent=ref.text+' · 개역한글';
  const body=document.createElement('div');verses.replaceChildren(body);
  K.show([ref],body);
  positionPopover(btn);
  // Async text loading may change popover dimensions; reposition after content arrives.
  const observer=new MutationObserver(()=>{if(token===displayToken&&!popover.hidden)positionPopover(activeTrigger);else observer.disconnect()});
  observer.observe(body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),9000);
}
function closePopover(){clearTimeout(closeTimeout);displayToken++;popover.hidden=true;activeTrigger=null;}
function scheduleClose(){clearTimeout(closeTimeout);closeTimeout=setTimeout(()=>{
 if(popover.matches(':hover')||activeTrigger?.matches(':hover')||popover.contains(document.activeElement)||activeTrigger===document.activeElement)return;
 closePopover();
},160)}
root.querySelectorAll('button[data-ref]').forEach(btn=>{
 const ref=extra[Number(btn.dataset.ref)];if(!ref)return;
 btn.addEventListener('mouseenter',()=>{if(window.matchMedia('(hover: hover)').matches)openPopover(ref,btn)});
 btn.addEventListener('mouseleave',scheduleClose);
 btn.addEventListener('focus',()=>{if(btn.matches(':focus-visible'))openPopover(ref,btn)});
 btn.addEventListener('blur',scheduleClose);
 // Touch devices lack hover, so tapping the same underlined verse toggles preview.
 btn.addEventListener('click',event=>{if(window.matchMedia('(hover: hover)').matches)return; if(activeTrigger===btn&&!popover.hidden){closePopover()}else{openPopover(ref,btn)}});
});
popover.addEventListener('mouseenter',()=>clearTimeout(closeTimeout));
popover.addEventListener('mouseleave',scheduleClose);
popover.addEventListener('focusout',scheduleClose);
document.getElementById('popoverClose').addEventListener('click',closePopover);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePopover()});
document.addEventListener('pointerdown',e=>{
 if(!popover.hidden&&!popover.contains(e.target)&&!e.target.closest('button[data-ref]'))closePopover();
});
window.addEventListener('resize',()=>positionPopover(activeTrigger));
window.addEventListener('scroll',()=>positionPopover(activeTrigger),{passive:true});
const i=all.findIndex(x=>x.order===sermon.order),prev=all[(i+all.length-1)%all.length],next=all[(i+1)%all.length];
nav.innerHTML=`<a href="sermon-detail.html?sermon=${prev.order}">← 이전 설교<br><small>${safe(prev.title)}</small></a><a href="sermon-detail.html?sermon=${next.order}">다음 설교 →<br><small>${safe(next.title)}</small></a>`;
// Continue from the current sermon to the end and then wrap to sermon 1.
// The current sermon itself is excluded, yielding exactly 49 other entries.
const followingSermons=Array.from({length:all.length-1},(_,offset)=>all[(i+offset+1)%all.length]);
following.innerHTML=`<h2>하나님의 성품 시리즈 설교 목록 <small>다음 순서부터 ${followingSermons.length}편</small></h2><ol class="sermon-following-grid">${followingSermons.map(s=>
  `<li><a href="sermon-detail.html?sermon=${encodeURIComponent(s.order)}"><span class="sermon-following-number">${String(s.order).padStart(2,'0')}회</span><span class="sermon-following-title">${safe(s.title)}</span><span class="sermon-following-topic">${safe(s.topic||'')}</span></a></li>`
).join('')}</ol>`;
})();
