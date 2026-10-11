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

/* 『부흥』 마틴 로이드 존스 — 도서 카드 상세 요약 페이지 연결 */
(function(){
  'use strict';
  function linkLloydJonesBook(){
    var library=document.getElementById('books');
    if(!library)return;
    var cards=Array.prototype.slice.call(library.querySelectorAll('.book'));
    var card=cards.find(function(el){
      var title=el.querySelector('h3');
      var para=el.querySelector('p');
      return title && title.textContent.trim()==='부흥' && para && para.textContent.indexOf('마틴 로이드 존스')!==-1;
    });
    if(!card||card.dataset.lloydJonesLinked==='1')return;
    card.dataset.lloydJonesLinked='1';
    var url='lloyd-jones-revival.html';
    var a=document.createElement('a');
    a.className='lloyd-summary-link';
    a.href=url;
    a.textContent='전체 상세 요약 읽기';
    a.setAttribute('aria-label','마틴 로이드 존스 부흥 전체 24장 상세 요약 읽기');
    a.style.cssText='display:inline-block;margin-top:10px;padding:0 0 2px;color:#216f69;font-size:13px;font-weight:800;text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px';
    card.appendChild(a);
    card.style.cursor='pointer';
    card.setAttribute('tabindex','0');
    card.setAttribute('role','link');
    card.setAttribute('aria-label','마틴 로이드 존스 부흥 전체 상세 요약 페이지 열기');
    card.addEventListener('click',function(event){
      if(event.target.closest('a,button'))return;
      window.location.href=url;
    });
    card.addEventListener('keydown',function(event){
      if(event.target===card&&(event.key==='Enter'||event.key===' ')){
        event.preventDefault();window.location.href=url;
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(linkLloydJonesBook,0);});
  else setTimeout(linkLloydJonesBook,0);
})();

/* 전체 도서 카드 공통 마우스 오버 효과 (현재 카드 + 향후 추가 카드 자동 적용) */
(function(){
  'use strict';
  var styleId='revival-library-card-hover-style';
  if(document.getElementById(styleId))return;
  var style=document.createElement('style');
  style.id=styleId;
  style.textContent=[
    '/* 링크가 연결된 카드와 일반 도서 카드에 동일한 부드러운 이동 효과. */',
    '#library .books > .book{',
      'transform:translateY(0);',
      'transition:transform .23s cubic-bezier(.2,.75,.3,1), box-shadow .23s ease, border-color .23s ease;',
      'box-shadow:0 1px 3px rgba(24,59,70,.025);',
    '}',
    '@media (hover:hover) and (pointer:fine){',
      '#library .books > .book:hover{',
        'transform:translateY(-5px);',
        'box-shadow:0 10px 24px rgba(24,59,70,.12);',
        'border-color:#91b7aa;',
      '}',
    '}',
    '#library .books > .book:focus-visible, #library .books > .book:focus-within{',
      'transform:translateY(-5px);',
      'box-shadow:0 10px 24px rgba(24,59,70,.12);',
      'border-color:#91b7aa;',
      'outline-offset:3px;',
    '}',
    '@media (prefers-reduced-motion:reduce){',
      '#library .books > .book{transition:none;}',
      '#library .books > .book:hover, #library .books > .book:focus-visible, #library .books > .book:focus-within{transform:none;}',
    '}',
  ].join('');
  (document.head||document.documentElement).appendChild(style);
})();
