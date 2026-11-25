/* 부흥 프로젝트 공통 성경 본문 로더 — 개역개정 4판 전용
 * 운영 규칙: 모든 설교의 주본문, 보조본문, 성경구절 팝업은 개역개정 4판만 사용.
 * 신규 회차도 동일 로더를 재사용하고 KRV(개역한글) CDN으로 되돌리지 않습니다.
 * 데이터: data/sermon-bible-krv4.json (사용자 제공 구약+신약 원문)
 * 제1~51회 설교 페이지 공통. 기존 KRVBible API를 보존합니다.
 */
(function(root){
'use strict';
const URL='data/sermon-bible-krv4.json?v=20261125c';
let biblePromise;
function safe(s){return String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function getBible(){
  if(!biblePromise){
    biblePromise=fetch(URL,{cache:'default'}).then(response=>{
      if(!response.ok)throw new Error('HTTP '+response.status);
      return response.json();
    }).then(data=>{
      if(data.version!=='개역개정 4판'||!data.books||!data.books.Romans)throw new Error('개역개정 성경 데이터가 올바르지 않습니다.');
      return data.books;
    }).catch(error=>{biblePromise=null;throw error;});
  }
  return biblePromise;
}
function rowsFor(ref,book){
  const result=[],seen=new Set();
  const chapters=book.chapters||{};
  for(const part of ref.parts||[]){
    if(part.endChapter<part.startChapter||part.endChapter-part.startChapter>20)continue;
    for(let chapter=part.startChapter;chapter<=part.endChapter;chapter++){
      const start=chapter===part.startChapter?part.startVerse:1;
      const end=chapter===part.endChapter?(part.endVerse??Number.MAX_SAFE_INTEGER):Number.MAX_SAFE_INTEGER;
      for(const entry of chapters[String(chapter)]||[]){
        const from=Number(entry.v),to=Number(entry.to||from);
        if(to<start||from>end)continue;
        const key=chapter+':'+from+'-'+to;
        if(seen.has(key))continue;seen.add(key);
        result.push({chapter,verse:from,to,text:entry.t||''});
      }
    }
  }
  return result;
}
async function show(refs,node){
  if(!node)return;
  // 비동기 연속 클릭에 의한 이전 결과 덮어쓰기를 방지합니다.
  const token=String((Number(node.dataset.bibleRequestId)||0)+1);
  node.dataset.bibleRequestId=token;
  node.innerHTML='<p class="scripture-loading">개역개정 4판 본문을 불러오는 중입니다…</p>';
  try{
    const books=await getBible();
    const body=[];
    for(const ref of refs){
      const book=books[ref.file];
      const rows=book?rowsFor(ref,book):[];
      body.push('<div class="scripture-section"><h3>'+safe(ref.text)+'</h3>'+(rows.length?
        rows.map((v,i)=>{
          const chap=(i===0||rows[i-1].chapter!==v.chapter)?'<div class="scripture-chapter">'+safe(ref.book)+' '+v.chapter+'장</div>':'';
          const num=v.to>v.verse? v.verse+'–'+v.to : String(v.verse);
          return chap+'<p class="scripture-verse"><span class="scripture-verse-number">'+num+'</span> '+safe(v.text)+'</p>';
        }).join(''):'<p class="scripture-unavailable">첨부된 개역개정 데이터에 해당 구절이 없습니다. 장·절 표기를 확인해 주세요.</p>')+'</div>');
    }
    if(node.dataset.bibleRequestId===token)node.innerHTML=body.join('');
  }catch(e){
    if(node.dataset.bibleRequestId===token)node.innerHTML='<p class="scripture-unavailable">개역개정 본문을 불러오지 못했습니다. data/sermon-bible-krv4.json 업로드 여부를 확인해 주세요.</p>';
  }
}
function commentaryUrl(ref){
  const first=ref&&ref.parts&&ref.parts[0];
  const url=new URL('https://bible-66-commentary.pages.dev/');
  if(ref){
    url.searchParams.set('passage',ref.text);
    url.searchParams.set('book',ref.file);
    url.searchParams.set('chapter',String(first?first.startChapter:ref.chapter));
    url.searchParams.set('verse',String(first?first.startVerse:1));
  }
  return url.toString();
}
root.KRVBible={show,commentaryUrl,safe};
// HTML 템플릿의 예전 '개역한글' 안내를 실제 로더와 일치시키는 표시 보정입니다.
function relabel(){
  const targets=document.querySelectorAll('#sermonDocument h2,#popoverTitle,#sermonDocument [aria-label]');
  targets.forEach(el=>{
    if(el.childElementCount===0 && el.textContent.includes('개역한글')){
      el.textContent=el.textContent.replaceAll('개역한글','개역개정 4판');
    }
    const attr=el.getAttribute('aria-label');
    if(attr&&attr.includes('개역한글'))el.setAttribute('aria-label',attr.replaceAll('개역한글','개역개정 4판'));
  });
}
function initLabels(){
  relabel();
  const rootEl=document.getElementById('sermonDocument');
  if(rootEl)new MutationObserver(relabel).observe(rootEl,{childList:true,subtree:true});
  const popup=document.getElementById('popoverTitle');
  if(popup)new MutationObserver(relabel).observe(popup,{childList:true,characterData:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initLabels,{once:true});
else initLabels();
})(window);
