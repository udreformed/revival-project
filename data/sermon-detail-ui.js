(function(){
"use strict";
const all=(window.SERMON_SERIES_DATA?.sermons||[]).slice().sort((a,b)=>a.order-b.order);
const K=window.KRVBible;if(!K)return;
const root=document.getElementById('sermonDocument');
const nav=document.getElementById('sermonBottomNav');
const modal=document.getElementById('verseModal');
const modalVerses=document.getElementById('modalVerses');
const order=Number(new URLSearchParams(location.search).get('sermon'))||1;
const sermon=all.find(s=>s.order===order)||all[0];
if(!sermon)return;
const safe=K.safe;
document.title=sermon.title+' | 설교원고 준비중 | 부흥 프로젝트';
const mainRefs=sermon.primaryRefs||[];
const extra=sermon.extraRefs||[];
const outline=(sermon.outline||[]).map(x=>`<div class="outline-block"><strong>${safe(x.title)}</strong><p>${safe(x.content)}</p></div>`).join('');
const refItems=extra.map((ref,i)=>`<button class="ref-button" type="button" data-ref="${i}">${safe(ref.text)} <span class="ref-label">${safe(ref.kind)}</span></button>`).join('');
const target=K.commentaryUrl(mainRefs[0]);
const pRef=mainRefs.map(x=>x.text).join(' · ');
const refBooks=(sermon.references||[]).map(x=>`<div class="reference-book"><strong>${safe(x.author)} — ${safe(x.title)}</strong><small>참고 주제: ${safe(x.category||'')} · 추가 원전 확인 필요</small></div>`).join('');
root.innerHTML=`<header class="document-header"><small>SERMON ${String(sermon.order).padStart(2,'0')} · ${safe(sermon.topic)}</small><h1>${safe(sermon.title)}</h1><p>설교원고 준비중</p></header><div class="document-body">
<section class="section"><h2>성경본문 · 개역한글</h2><p class="scripture-ref-title">${safe(pRef)}</p><div class="scripture-passage" id="mainVerses"></div><a class="commentary-link" href="${safe(target)}" target="_blank" rel="noopener noreferrer">성경해설서 페이지로 넘어가기</a><p class="source-note">본문 출처: 대한성서공회 『성경전서 개역한글판』(1961). 성경해설서 링크에는 해당 장절 정보가 포함되어 있으나, 대상 사이트의 자동 선택 기능은 별도 연동이 필요할 수 있습니다.</p></section>
<section class="section"><h2>보조·후보 성경구절</h2><div class="ref-items">${refItems||'<p>기록된 보조·후보 구절이 없습니다.</p>'}</div><p class="source-note">구절을 누르면 해당 개역한글 본문을 대화창에서 읽을 수 있습니다.</p></section>
<section class="section"><h2>주제단락</h2><p>${safe(sermon.themeParagraph||'')}</p></section>
<section class="section"><h2>아웃트라인</h2>${outline||'<p>준비 중입니다.</p>'}</section>
<section class="section"><h2>관련 참고 도서</h2>${refBooks||'<p>자료 확인 중입니다.</p>'}</section>
</div>`;
K.show(mainRefs,document.getElementById('mainVerses'));
root.querySelectorAll('button[data-ref]').forEach(btn=>btn.addEventListener('click',()=>{
 const ref=extra[Number(btn.dataset.ref)];if(!ref)return;
 document.getElementById('modalTitle').textContent=ref.text+' · 개역한글';
 modal.showModal();
 K.show([ref],modalVerses);
}));
const i=all.findIndex(x=>x.order===sermon.order), prev=all[(i+all.length-1)%all.length],next=all[(i+1)%all.length];
nav.innerHTML=`<a href="sermon-detail.html?sermon=${prev.order}">← 이전 설교<br><small>${safe(prev.title)}</small></a><a href="sermon-detail.html?sermon=${next.order}">다음 설교 →<br><small>${safe(next.title)}</small></a>`;
document.getElementById('closeModal').addEventListener('click',()=>modal.close());
modal.addEventListener('click',event=>{if(event.target===modal)modal.close()});
})();
