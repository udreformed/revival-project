(function(root){
"use strict";
const BASES=[
  "https://cdn.jsdelivr.net/gh/bluesaurel/Korean-Bible-1961-KRV@main/data/",
  "https://raw.githubusercontent.com/bluesaurel/Korean-Bible-1961-KRV/main/data/"
];
const cache=new Map();
async function getBook(filename){
  if(!cache.has(filename)) cache.set(filename,(async()=>{
    let err=null;
    for(const base of BASES){
      try{
        const response=await fetch(base+encodeURIComponent(filename)+'.json',{mode:'cors'});
        if(!response.ok) throw new Error('HTTP '+response.status);
        const data=await response.json();
        if(!data||!Array.isArray(data.chapters)) throw new Error('장 데이터 누락');
        return data;
      } catch(e){err=e;}
    }
    throw err||new Error('성경 자료를 불러올 수 없습니다');
  })());
  return cache.get(filename);
}
function safe(s){return String(s??'').replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}
function rowsFor(ref, book){
 const found=[];const already=new Set();
 for(const part of ref.parts||[]){
   if(part.endChapter<part.startChapter) continue;
   if(part.endChapter-part.startChapter>20)continue;
   for(let chapter=part.startChapter; chapter<=part.endChapter;chapter++){
     const ch=book.chapters.find(item=>Number(item.chapter)===chapter);
     if(!ch)continue;
     const start=chapter===part.startChapter?part.startVerse:1;
     const end=chapter===part.endChapter?(part.endVerse??Number.MAX_SAFE_INTEGER):Number.MAX_SAFE_INTEGER;
     for(const verse of ch.verses||[]){
       const n=Number(verse.verse);if(n<start||n>end)continue;
       const key=chapter+':'+n;
       if(already.has(key))continue;already.add(key);
       found.push({chapter,verse:n,text:verse.text});
     }
   }
 }
 return found;
}
async function show(refs, node){
 if(!node)return;
 node.innerHTML='<p class="scripture-loading">개역한글 본문을 불러오는 중입니다…</p>';
 const body=[];
 for(const ref of refs){
   try{
     const book=await getBook(ref.file);const rows=rowsFor(ref,book);
     body.push('<div class="scripture-section"><h3>'+safe(ref.text)+'</h3>'+(rows.length
       ?rows.map((verse,index)=>{
         const heading=(index===0||verse.chapter!==rows[index-1].chapter)
           ?'<div class="scripture-chapter">'+safe(ref.book)+' '+verse.chapter+'장</div>':'';
         return heading+'<p class="scripture-verse"><span class="scripture-verse-number">'+verse.verse+'</span> '+safe(verse.text)+'</p>';
       }).join('')
       :'<p class="scripture-unavailable">이 구절의 본문이 데이터에 없습니다. 장·절 표기를 확인해 주세요.</p>')+'</div>');
   } catch(e){
     body.push('<p class="scripture-unavailable">'+safe(ref.text)+'의 본문을 불러오지 못했습니다. 인터넷 연결을 확인하거나 잠시 후 다시 시도해 주세요.</p>');
   }
 }
 node.innerHTML=body.join('');
}
// Commentary site may not yet accept deep-link parameters; this encodes both human and machine-readable location.
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
})(window);
