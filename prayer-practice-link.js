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
