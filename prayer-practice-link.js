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

/* 복구 2026-10-12: index.html을 다시 덮어쓰지 않고 기도 카드 배치 복구.
   기존 독립형 대형 카드를 제거하고 두 번째 카드에서 24편 기도문으로 연결.
   도서 카드·읽기 자료·역사 연대표의 기존 기능은 수정하거나 초기화하지 않습니다. */
(function(){
  'use strict';
  function restorePrayerCard(){
    var section=document.getElementById('prayer');
    if(!section)return;

    // 잘못 별도로 들어간 대형 대표기도문 카드만 제거합니다.
    var separate=section.querySelector('.revival-prayers-feature');
    if(separate)separate.remove();
    Array.prototype.slice.call(section.querySelectorAll('style')).forEach(function(node){
      if((node.textContent||'').indexOf('.revival-prayers-feature')!==-1)node.remove();
    });

    var card=Array.prototype.find.call(section.querySelectorAll('.tile'),function(node){
      var label=node.querySelector('label');
      return label&&label.textContent.trim()==='02';
    });
    if(!card)return;
    if(card.matches('a.prayer-card-link[href="revival-prayers.html"]'))return;

    var replacement=document.createElement('a');
    replacement.className='tile prayer-card-link';
    replacement.href='revival-prayers.html';
    replacement.setAttribute('aria-label','부흥을 갈망하는 기도, 24편 전체 대표기도문 읽기');
    replacement.innerHTML='<label>02</label><h3>부흥을 갈망하는 기도</h3>'+
      '<p>마틴 로이드 존스의 『부흥』을 따라 드리는 24편의 대표기도문입니다.</p>'+
      '<span class="prayer-card-open">24편 전체 기도문 읽기 →</span>';
    card.replaceWith(replacement);

    if(!document.getElementById('restored-prayer-card-css')){
      var style=document.createElement('style');
      style.id='restored-prayer-card-css';
      style.textContent='#prayer .prayer-card-link{display:flex;flex-direction:column;'+
        'color:inherit;text-decoration:none;cursor:pointer;min-width:0;'+
        'transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}'+
        '#prayer .prayer-card-link:hover,#prayer .prayer-card-link:focus-visible{'+
        'transform:translateY(-5px);border-color:#99bcb1;box-shadow:0 12px 28px rgba(24,59,70,.13)}'+
        '#prayer .prayer-card-link:focus-visible{outline:3px solid #216f69;outline-offset:3px}'+
        '#prayer .prayer-card-open{align-self:flex-start;display:inline-block;margin-top:auto;'+
        'padding-top:12px;font-size:12px;font-weight:800;color:#216f69;'+
        'text-decoration:underline;text-underline-offset:3px}'+
        '@media(prefers-reduced-motion:reduce){#prayer .prayer-card-link{transition:none}'+
        '#prayer .prayer-card-link:hover,#prayer .prayer-card-link:focus-visible{transform:none}}';
      document.head.appendChild(style);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restorePrayerCard);
  else restorePrayerCard();
})();

/* 『부흥』 도서 카드의 상세 요약 링크 복구. 다른 도서 카드에 영향 없음. */
(function(){
  'use strict';
  function restoreLloydJonesBook(){
    var shelf=document.getElementById('books');
    if(!shelf)return;
    var card=Array.prototype.find.call(shelf.querySelectorAll('.book'),function(node){
      var heading=node.querySelector('h3');return heading&&heading.textContent.trim()==='부흥';
    });
    if(!card||card.dataset.lloydSummaryRestored==='1')return;
    card.dataset.lloydSummaryRestored='1';
    var href='lloyd-jones-revival.html';
    var anchor=card.querySelector('a[href*="lloyd-jones-revival"]');
    if(!anchor){
      anchor=document.createElement('a');
      anchor.href=href;anchor.textContent='전체 상세 요약 읽기 →';
      anchor.style.cssText='display:inline-block;margin-top:13px;font-size:12px;'+
        'font-weight:800;color:#216f69;text-decoration:none;border-bottom:1px solid #a3c8b7';
      (card.querySelector('.book-info')||card).appendChild(anchor);
    }
    card.style.cursor='pointer';card.setAttribute('role','link');card.tabIndex=0;
    card.setAttribute('aria-label','마틴 로이드 존스 부흥 전체 상세 요약 읽기');
    card.addEventListener('click',function(e){if(!e.target.closest('a'))window.location.href=href;});
    card.addEventListener('keydown',function(e){
      if(e.target===card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();window.location.href=href;}
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){setTimeout(restoreLloydJonesBook,90)});
  }else setTimeout(restoreLloydJonesBook,90);
})();


/* 2026-10-12: 도서 8종 hover 일괄 적용.
 * 기존 홈페이지 index.html, 연대표, 도서 카드 링크 및 표지 코드는 수정하지 않습니다.
 * data/site-data.js가 도서 카드를 렌더링한 뒤에도 적용되는 CSS 방식입니다.
 */
(function(){
  'use strict';
  if(document.getElementById('revival-all-book-hover-style'))return;
  var style=document.createElement('style');
  style.id='revival-all-book-hover-style';
  style.textContent=[
    '#library #books > .book{position:relative;transform:translateY(0);transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease,background-color .22s ease}',
    '#library #books > .book:hover,#library #books > .book:focus-visible,#library #books > .book:focus-within{transform:translateY(-5px)!important;border-color:#99bcb1!important;box-shadow:0 12px 28px rgba(24,59,70,.13)!important;background-color:#fff}',
    '#library #books > .book:focus-visible{outline:3px solid #216f69;outline-offset:3px}',
    '#library #books > .book:active{transform:translateY(-2px)!important}',
    '@media(prefers-reduced-motion:reduce){#library #books > .book{transition:none}#library #books > .book:hover,#library #books > .book:focus-visible,#library #books > .book:focus-within,#library #books > .book:active{transform:none!important}}'
  ].join('\n');
  document.head.appendChild(style);
})();

/* 읽기 자료 ⑧ — 스펄전, 『교회가 다시 살아나려면』.
 * ⑦ 카드와 기존 교회·기도회·도서 기능을 보존하고, ⑧ 카드만 추가한다.
 * 전체 카드가 기본 a 링크이며 기존 .tile-link hover·키보드 스타일을 재사용한다.
 */
(function(){
  'use strict';
  function addSpurgeonReading(){
    var section=document.getElementById('readings');
    if(!section)return;
    var tiles=section.querySelector('.tiles');
    if(!tiles)return;
    var link=tiles.querySelector('#reading-08-home, a[href="spurgeon-five-revivals.html"]');
    if(!link){
      link=document.createElement('a');
      link.className='tile tile-link';
      link.id='reading-08-home';
    }
    link.className='tile tile-link';
    link.id='reading-08-home';
    link.href='spurgeon-five-revivals.html';
    link.setAttribute('aria-label','읽기 자료 8번: 교회가 다시 살아나려면 — 본문 읽기');
    link.innerHTML='<span class="tile-kicker">08 · 교회의 부흥과 갱신</span>'+
      '<h3>교회가 다시 살아나려면</h3>'+
      '<p>스펄전의 권면을 따라 성령의 능력, 복음의 진리, 거룩한 삶과 가정, 신실한 믿음을 돌아봅니다.</p>'+
      '<span class="text-link" aria-hidden="true">본문 읽기 →</span>';
    // 다른 카드를 삭제하거나 변경하지 않고 ⑦ 바로 뒤에 배치한다.
    var seven=tiles.querySelector('#reading-07-home');
    if(seven){
      seven.insertAdjacentElement('afterend',link);
    }else if(tiles.lastElementChild!==link){
      tiles.appendChild(link);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addSpurgeonReading);
  else addSpurgeonReading();
})();


/* 기도와 실천 ③ — 스펄전의 부흥기도 읽기자료.
 * 기존 ① 연합기도회·② 로이드 존스 24편·읽기자료 ⑦⑧ 및 도서 카드 기능을 보존합니다.
 * ③ 카드 전체를 링크로 변경하고 기존 ②번과 동일한 hover 동작을 사용합니다.
 */
(function(){
  'use strict';
  function addSpurgeonPrayerCard(){
    var section=document.getElementById('prayer');
    if(!section)return;
    var tiles=section.querySelector('.tiles');
    if(!tiles)return;
    var old=Array.prototype.find.call(tiles.children,function(node){
      var label=node.querySelector('label');
      return label&&label.textContent.trim()==='03';
    });
    if(!old)return;
    var href='spurgeon-prayer-for-revival-reading.html';
    var link=document.createElement('a');
    link.className='tile prayer-card-link';
    link.href=href;
    link.setAttribute('aria-label','다시 우리를 살리소서 — 스펄전에게 배우는 부흥을 위한 기도 읽기');
    link.innerHTML='<label>03</label>'+
      '<h3>다시 우리를 살리소서</h3>'+
      '<p>스펄전에게 배우는 부흥을 위한 기도. 하나님의 주권을 의지하며 말씀과 공동 기도, 회개와 순종 속에서 교회의 갱신을 구합니다.</p>'+
      '<span class="prayer-card-open">부흥을 위한 기도 읽기 →</span>';
    old.replaceWith(link);
    // ② 카드가 제공하는 hover 스타일을 공유하되 실행 순서와 관계없이 유지합니다.
    if(!document.getElementById('restored-prayer-card-css') && !document.getElementById('spurgeon-prayer-card-style')){
      var style=document.createElement('style');
      style.id='spurgeon-prayer-card-style';
      style.textContent='#prayer .prayer-card-link{display:flex;flex-direction:column;color:inherit;text-decoration:none;cursor:pointer;min-width:0;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}'+
        '#prayer .prayer-card-link:hover,#prayer .prayer-card-link:focus-visible{transform:translateY(-5px);border-color:#99bcb1;box-shadow:0 12px 28px rgba(24,59,70,.13)}'+
        '#prayer .prayer-card-open{align-self:flex-start;display:inline-block;margin-top:auto;padding-top:12px;font-size:12px;font-weight:800;color:#216f69;text-decoration:underline;text-underline-offset:3px}';
      document.head.appendChild(style);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addSpurgeonPrayerCard);
  else addSpurgeonPrayerCard();
})();


/* 기도와 실천 ④ — 앤드루 머리 『쉬지 말고 기도하라』.
 * 번역 페이지 링크는 카드 전체에 유지하고, 카드 맨 아래에 새로 집필한 31편 기도문 PDF 다운로드 버튼을 별도로 둡니다.
 * 하나의 <a> 안에 또 다른 <a>를 중첩하지 않아 클릭·키보드 동작이 모두 올바릅니다.
 * 다른 카드, 도서, 읽기 자료와 「오늘의 기도」 메뉴는 변경하지 않습니다.
 */
(function(){
  'use strict';
  function addMurrayPrayerCard(){
    var section=document.getElementById('prayer');
    if(!section)return;
    var tiles=section.querySelector('.tiles');
    if(!tiles)return;
    var href='murray-intercession-31days-ko.html';
    var old=tiles.querySelector('#murray-intercession-prayer-card, a[href="'+href+'"]');
    var card;
    if(old && old.tagName.toLowerCase()==='article') card=old;
    else {
      card=document.createElement('article');
      if(old) old.replaceWith(card);
    }
    card.id='murray-intercession-prayer-card';
    card.className='tile prayer-card-link murray-download-card';
    card.innerHTML=
      '<a class="murray-card-main" href="'+href+'" aria-label="쉬지 말고 기도하라 — 31일 중보기도 지침 전체 읽기">'+
        '<label>04</label>'+
        '<h3>쉬지 말고 기도하라</h3>'+
        '<p>앤드루 머리의 31일 중보기도 지침 완역. 성경 말씀과 기도 주제, 실천 안내 및 신학적 편집자 주를 함께 읽습니다.</p>'+
        '<span class="prayer-card-open">31일 중보기도 자료 읽기 →</span>'+
      '</a>'+
      '<a class="murray-download-btn" href="daily-revival-prayers-31.pdf" download="부흥을_위한_매일의_기도_31편.pdf" aria-label="새롭게 집필한 31편 기도문 PDF 다운로드">'+
        '31편 기도문 PDF 다운로드 <span aria-hidden="true">↓</span>'+
      '</a>';
    var third=Array.prototype.find.call(tiles.children,function(node){
      var label=node.querySelector('label');
      return label&&label.textContent.trim()==='03';
    });
    if(third){
      if(third.nextElementSibling!==card)third.insertAdjacentElement('afterend',card);
    }else if(tiles.lastElementChild!==card){tiles.appendChild(card);}
    if(!document.getElementById('murray-prayer-download-css')){
      var style=document.createElement('style');
      style.id='murray-prayer-download-css';
      style.textContent=
        '#prayer .murray-download-card{position:relative}'+
        '#prayer .murray-card-main{display:flex;flex-direction:column;flex:1;color:inherit;text-decoration:none;min-width:0}'+
        '#prayer .murray-card-main::before{content:"";position:absolute;inset:0;z-index:1}'+
        '#prayer .murray-download-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;'+
          'position:relative;z-index:2;align-self:stretch;margin-top:17px;padding:11px 12px;'+
          'border:1px solid #bdd5c9;background:#edf5f0;border-radius:7px;'+
          'text-align:center;text-decoration:none;color:#216f69;font-weight:800;font-size:12px;line-height:1.55;'+
          'transition:background .15s,border-color .15s}'+
        '#prayer .murray-download-btn:hover{background:#dcefe5;border-color:#76a994}'+
        '#prayer .murray-download-card:focus-within{outline:2px solid #216f69;outline-offset:3px}'+
        '#prayer .murray-download-btn:focus-visible{outline:3px solid #b69661;outline-offset:3px}'+
        '@media(prefers-reduced-motion:reduce){#prayer .murray-download-btn{transition:none}}';
      document.head.appendChild(style);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addMurrayPrayerCard);
  else addMurrayPrayerCard();
})();

/* 메인 메뉴 「오늘의 기도」. 카드를 추가하지 않고 공용 31일 기도 데이터/팝업만 로드. */
(function(){
  'use strict';
  function attachTodayPrayer(){
    if(!document.querySelector('header .top nav'))return;
    function loadScript(src){return new Promise(function(resolve,reject){var s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});}
    loadScript('daily-prayer-data.js').then(function(){return loadScript('daily-prayer-ui.js');}).catch(function(err){console.error('오늘의 기도 구성 파일을 불러오지 못했습니다.',err);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attachTodayPrayer);
  else attachTodayPrayer();
})();
