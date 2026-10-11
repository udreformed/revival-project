/* 부흥 프로젝트 홈페이지 「말씀에서 기도와 실천으로」 첫 번째 카드 링크 적용. 다른 카드 보존. */
(function(){'use strict';
 function run(){
  var section=document.getElementById('prayer');
  if(!section)return;
  var cards=section.querySelectorAll('.tile');
  var card=Array.prototype.find.call(cards,function(n){var h=n.querySelector('h3');return h&&['하나님의 영광을 구하는 기도','지역교회 연합기도회'].includes(h.textContent.trim());});
  if(!card||card.dataset.prayerPracticeLinked==='1')return;
  card.dataset.prayerPracticeLinked='1';
  var heading=card.querySelector('h3');if(heading)heading.textContent='지역교회 연합기도회';
  var body=card.querySelector('p');if(body)body.textContent='기도 지침 · 현대어 기도문 샘플 · 실제 기도회 운영안을 확인해 보세요.';
  var link=document.createElement('a');link.href='prayer-practice.html';link.textContent='기도 지침과 기도문 샘플 보기 →';
  link.style.cssText='display:inline-block;margin-top:15px;font-size:12px;color:#216f69;font-weight:800;border-bottom:1px solid #aac9bd;text-decoration:none';
  link.setAttribute('aria-label','지역교회 연합기도회: 기도 지침과 기도문 샘플 페이지');
  card.appendChild(link);card.style.cursor='pointer';card.style.transition='box-shadow .15s,border-color .15s';
  card.setAttribute('role','link');card.setAttribute('tabindex','0');card.setAttribute('aria-label','지역교회 연합기도회 실천 자료 페이지 열기');
  card.addEventListener('click',function(e){if(e.target.closest('a'))return;window.location.href='prayer-practice.html'});
  card.addEventListener('keydown',function(e){if(e.target===card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();window.location.href='prayer-practice.html'}});
  card.addEventListener('mouseenter',function(){card.style.boxShadow='0 8px 22px #214d4920';card.style.borderColor='#7da69a'});
  card.addEventListener('mouseleave',function(){card.style.boxShadow='';card.style.borderColor=''});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();

/* 『기도합주회』 도서 카드 링크 복구: 기존 index.html 변경 없이 연결 파일 실행 */
(function(){
  'use strict';
  var scripts=Array.prototype.slice.call(document.querySelectorAll('script[src]'));
  var exists=scripts.some(function(s){return /(?:^|\/)edwards-concert-link\.js(?:\?.*)?$/.test(s.getAttribute('src')||'');});
  if(exists)return;
  var script=document.createElement('script');
  script.src='edwards-concert-link.js';
  script.async=false;
  document.body.appendChild(script);
})();

/* 부흥 프로젝트 읽기 자료 ⑦: 기존 ①–⑥과 동일한 전체 클릭 카드로 연결.
   사이트의 index.html에 이미 정의된 .tile-link의 hover/keyboard 효과를 그대로 활용한다.
   기도회 및 기도합주회 링크는 위의 기존 코드 그대로 보존한다. */
(function(){
  'use strict';
  function addHaykinReading(){
    var section=document.getElementById('readings');
    if(!section)return;
    var tiles=section.querySelector('.tiles');
    if(!tiles)return;

    var link=document.createElement('a');
    link.className='tile tile-link';
    link.id='reading-07-home';
    link.href='haykin-revival-reading.html';
    link.setAttribute('aria-label','읽기 자료 7번: 개혁주의 전통에서 발견하는 성령의 역사와 교회의 갱신 — 본문 읽기');
    link.innerHTML='<span class="tile-kicker">07 · 개혁주의 부흥신학</span>'+
      '<h3>개혁주의 전통에서 발견하는 성령의 역사와 교회의 갱신</h3>'+
      '<p>마이클 A. G. 헤이킨의 연구를 중심으로 성령의 주권, 말씀과 회심, 기도와 선교로 이어지는 교회의 갱신을 살펴봅니다.</p>'+
      '<span class="text-link" aria-hidden="true">본문 읽기 →</span>';

    // 이전 ④번 동적 카드가 존재하더라도 중복 표시하지 않는다.
    var previous=tiles.querySelector('#reading-04-home, #reading-07-home, a[href="haykin-revival-reading.html"]');
    if(previous)previous.replaceWith(link);
    else tiles.appendChild(link);
    // 이미 ①–⑥이 놓인 그리드의 마지막(⑦번)에 배치한다.
    if(tiles.lastElementChild!==link)tiles.appendChild(link);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addHaykinReading);
  else addHaykinReading();
})();
