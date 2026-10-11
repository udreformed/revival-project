/* 부흥 프로젝트: 기존 『기도합주회』 도서 카드와 새 요약 페이지 연결. 기존 카드/표지/다른 링크 보존. */
(function(){
  'use strict';
  function connectConcertBook(){
    var host=document.getElementById('books');
    if(!host)return;
    var cards=Array.prototype.slice.call(host.querySelectorAll('.book'));
    var card=cards.find(function(node){
      var h=node.querySelector('h3');
      return h && h.textContent.trim()==='기도합주회';
    });
    if(!card || card.getAttribute('data-concert-linked')==='yes')return;
    card.setAttribute('data-concert-linked','yes');
    var dest='edwards-concert-of-prayer.html';
    var a=document.createElement('a');
    a.href=dest;
    a.textContent='전체 상세 요약 읽기 →';
    a.style.cssText='display:inline-block;margin-top:14px;color:#216f69;font-size:12px;font-weight:800;text-decoration:none;border-bottom:1px solid #a3c8b7';
    a.addEventListener('click',function(e){e.stopPropagation()});
    (card.querySelector('.book-info')||card).appendChild(a);
    card.style.cursor='pointer';
    card.setAttribute('tabindex','0');
    card.setAttribute('role','link');
    card.setAttribute('aria-label','기도합주회 전체 상세 요약 열기');
    card.addEventListener('click',function(e){if(e.target.closest('a'))return;window.location.href=dest});
    card.addEventListener('keydown',function(e){if(e.target===card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();window.location.href=dest}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(connectConcertBook,10)});
  else setTimeout(connectConcertBook,10);
})();
