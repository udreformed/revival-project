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
// 설교 흐름: 구절 표시는 숨기되 본문 참조 데이터는 보존합니다.
// 제2~50편의 확정 전 개요에도 적용되도록 UI 표시 단계에서만 정리합니다.
function flowNoVerses(value){
  return String(value??'')
    .replace(/(?:[가-힣]{1,4}\s*)?\d{1,3}:\d{1,3}(?:\s*[–~-]\s*\d{1,3})?(?:\s*[,，]\s*\d{1,3}(?:\s*[–~-]\s*\d{1,3})?)*(?:절)?(?:에서|의|과|와|부터|까지|에는|을|를|은|는|에)?/g,'')
    .replace(/\d{1,3}\s*[–~-]\s*\d{1,3}\s*절(?:에서|의|과|와|부터|까지|에는|을|를|은|는|에)?/g,'')
    .replace(/\d{1,3}\s*절(?:에서|의|과|와|부터|까지|에는|을|를|은|는|에)?/g,'')
    .replace(/\d{1,3}\s*장(?:에서|의|과|와|부터|까지|에는|을|를|은|는|에)?/g,'')
    .replace(/\s*[·]\s*/g,' · ')
    .replace(/^[\s·,.;:–~-]+/,'')
    .replace(/\s{2,}/g,' ')
    .trim();
}
const outline=(sermon.outline||[]).map((x,i,arr)=>`<div class="sermon-flow-item"><span class="sermon-flow-title">${safe(flowNoVerses(x.title))}</span><p class="sermon-flow-desc">${safe(flowNoVerses(x.content))}</p></div>${i<arr.length-1?'<div class="sermon-flow-arrow" aria-hidden="true">↓</div>':''}`).join('');
const detailedOutline=(sermon.manuscriptFinalized||sermon.draft===true)&&sermon.detailedOutlineHtml?`<section class="section"><h2>강단용 상세 아웃라인${sermon.draft===true?' · 초안':''}</h2><div class="sermon-outline-detail">${sermon.detailedOutlineHtml}</div></section>`:'';
const manuscript=(sermon.manuscriptFinalized||sermon.draft===true)&&sermon.manuscriptHtml?`<section class="section sermon-manuscript-section"><button class="sermon-read-control" id="sermonReadToggle" type="button" aria-controls="sermonFullText" aria-expanded="false">원고전체 읽기${sermon.draft===true?' · 초안':''}</button><div class="sermon-manuscript" id="sermonFullText" hidden>${sermon.manuscriptHtml}<button class="sermon-read-control sermon-read-bottom" id="sermonReadClose" type="button">접기 ↑</button></div></section>`:'';
const refItems=extra.map((ref,i)=>`<button class="ref-button" type="button" data-ref="${i}" aria-describedby="versePopover" aria-label="${safe(ref.text)} · ${safe(ref.kind)} 본문 미리보기">${safe(ref.text)}</button>`).join('');
const refBooks=(sermon.references||[]).map(x=>{
  const existing=/^book(0[1-9]|1[0-5])$/.exec(x.id||'');
  const life=/^life(0[1-9]|10)$/.exec(x.id||'');
  // 신규 10권도 기존 15권과 같은 카드 서식으로 제공합니다.
  const href=existing?`core-book-summaries-reader.html#book-${existing[1]}`
             :life?`life-revival-book-summaries.html#book-${life[1]}`:null;
  const bookTitle=`<strong>${safe(x.author)} — ${safe(x.title)}</strong>`;
  const category=`<small>${safe(x.category||'')}</small>`;
  return href?`<a class="reference-book" href="${href}" aria-label="${safe(x.title)} 도서요약보기">${bookTitle}<span class="reference-book-meta">${category}<span class="reference-book-link">도서요약보기</span></span></a>`
             :`<div class="reference-book">${bookTitle}${category}</div>`;
}).join('');
const research=window.SERMON_RESEARCH_SOURCES?.[String(sermon.order)]||null;
const commentaryCards=(research?.commentaries||[]).map(x=>`<div class="reference-book sermon-research-entry"><strong>${safe(x.author)} — <i>${safe(x.title)}</i></strong><small>${safe(x.series)}</small><p>${safe(x.note)}</p></div>`).join('');
const systematicCards=(research?.systematics||[]).map(x=>`<a class="reference-book sermon-research-entry" href="${safe(x.url)}" target="_blank" rel="noopener noreferrer"><strong>${safe(x.author)} — <i>${safe(x.title)}</i></strong><p>${safe(String(x.note||'').replace(/\s*[—–-]\s*Theo10 도서별 연구 요약\s*$/,'').trim())}</p><span class="reference-book-link">Theo10 연구 요약 읽기</span></a>`).join('');
const researchSections=research?`<section class="section sermon-research-section"><h2>주해 참고 주석</h2><div class="sermon-reference-grid">${commentaryCards}</div><h2 class="sermon-research-theo-heading">조직신학 연구 참고 · Theo10</h2><div class="sermon-reference-grid">${systematicCards}</div></section>`:'';
root.innerHTML=`<header class="document-header"><small>SERMON ${String(sermon.order).padStart(2,'0')} · ${safe(sermon.topic)}</small>${sermon.draft===true?'<div class="sermon-draft-banner" role="status">초안 · 검토 및 확정 전</div>':''}<h1>${safe(sermon.title)}</h1>${sermon.question?`<p class="sermon-detail-question">${safe(sermon.question)}</p>`:''}<p class="sermon-header-status">${sermon.draft===true?'초안 · 주해 및 주석 검토 전 · 강단용 아웃라인과 단락형 원고 임시 제공':sermon.manuscriptFinalized?'설교 원고 확정 · 강단용 상세 아웃라인 제공':'설교원고 준비중'}</p></header><div class="document-body">

<section class="section"><h2>주제문</h2><p>${safe(sermon.mainStatement||'')}</p></section>
<section class="section"><h2>성경본문 · 개역한글</h2><div class="scripture-passage" id="mainVerses"></div><button class="scripture-more-button" id="mainVersesToggle" type="button" aria-controls="mainVerses" aria-expanded="false" hidden>더 보기</button></section>
<section class="section"><h2>${sermon.manuscriptFinalized||sermon.draft===true?'보조 성경구절':'보조·후보 성경구절'}</h2><div class="ref-items">${refItems||'<p>기록된 보조·후보 구절이 없습니다.</p>'}</div></section>
<section class="section"><h2>주제단락</h2><p>${safe(sermon.themeParagraph||'')}</p></section>
<section class="section"><h2>설교 흐름</h2><div class="sermon-flow">${outline||'<p>준비 중입니다.</p>'}</div></section>
${detailedOutline}
${manuscript}
<section class="section sermon-reference-books-section"><h2>관련 참고 도서</h2>${refBooks?`<div class="sermon-reference-grid">${refBooks}</div>`:'<p>자료 확인 중입니다.</p>'}</section>
${researchSections}
</div>`;
// 강단용 상세 아웃라인 내 실제 성경 장·절 표기는 그대로 보존하며
// 보조 성경구절과 동일한 미리보기 동작을 제공합니다 (마우스/키보드/터치).
// 장절이 없는 본문 설명이나 자연어 구절 표현은 임의로 링크하지 않습니다.
const hoverRefs=extra.slice();
function linkOutlineVerses(container){
 if(!container)return;
 const books=new Map();
 for(const s of all){
  for(const r of [...(s.primaryRefs||[]),...(s.extraRefs||[]),...(s.supportRefs||[])]){
   if(r.abbr&&r.file&&r.book)books.set(r.abbr,{book:r.book,file:r.file});
  }
 }
 if(!books.size)return;
 const choices=Array.from(books.keys()).sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
 const re=new RegExp('('+choices+')?\\s*(\\d{1,3}):(\\d{1,3}(?:\\s*[–~-]\\s*\\d{1,3})?(?:\\s*[,，]\\s*\\d{1,3}(?:\\s*[–~-]\\s*\\d{1,3})?)*)','g');
 const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  const parent=node.parentElement;
  if(!parent||parent.closest('button,a,script,style'))continue;
  const text=node.nodeValue;
  re.lastIndex=0;
  if(!re.test(text))continue;
  re.lastIndex=0;
  const frag=document.createDocumentFragment();
  let start=0,lastBook=null,m;
  while((m=re.exec(text))!==null){
   // A reference may omit the repeated abbreviation: "히 4:15; 7:25".
   const abbr=m[1]||lastBook;
   if(!abbr||!books.has(abbr))continue;
   lastBook=abbr;
   const chapter=Number(m[2]);
   const spans=m[3].split(/\s*[,，]\s*/);
   const parts=[];
   for(const span of spans){
    const nums=span.split(/\s*[–~-]\s*/).map(Number);
    if(nums.some(n=>!Number.isInteger(n)||n<1)||nums.length>2||nums.length<1)continue;
    const from=nums[0],to=nums[nums.length-1];
    if(from>to||to>176)continue;
    parts.push({startChapter:chapter,startVerse:from,endChapter:chapter,endVerse:to});
   }
   if(!parts.length)continue;
   frag.append(document.createTextNode(text.slice(start,m.index)));
   const info=books.get(abbr);
   const visible=m[0];
   const ref={...info,abbr,chapter,parts,text:abbr+' '+chapter+':'+m[3]};
   const id=hoverRefs.length;hoverRefs.push(ref);
   const btn=document.createElement('button');
   btn.type='button';btn.className='ref-button outline-verse-link';btn.dataset.ref=String(id);
   btn.textContent=visible;
   btn.setAttribute('aria-label',ref.text+' · 개역한글 본문 미리보기');
   btn.setAttribute('aria-haspopup','dialog');
   frag.append(btn);
   start=m.index+m[0].length;
  }
  frag.append(document.createTextNode(text.slice(start)));
  if(frag.querySelector?.('button'))node.replaceWith(frag);
 }
}
linkOutlineVerses(root.querySelector('.sermon-outline-detail'));
// 확정 원고용 공통 토글: 상단은 열기/접기 공용, 하단은 접기 전용.
const readToggle=document.getElementById('sermonReadToggle');
const readContent=document.getElementById('sermonFullText');
const readClose=document.getElementById('sermonReadClose');
if(readToggle&&readContent&&readClose){
  function setReadOpen(open){
    readContent.hidden=!open;
    readToggle.setAttribute('aria-expanded',String(open));
    readToggle.textContent=open?'원고 접기':(sermon.draft===true?'원고전체 읽기 · 초안':'원고전체 읽기');
  }
  readToggle.addEventListener('click',()=>setReadOpen(readContent.hidden));
  readClose.addEventListener('click',()=>{
    setReadOpen(false);
    readToggle.scrollIntoView({behavior:'auto',block:'center'});
    readToggle.focus({preventScroll:true});
  });
}
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
 const ref=hoverRefs[Number(btn.dataset.ref)];if(!ref)return;
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
