/* 부흥 프로젝트 · 오늘의 기도 31일 팝업 + 앤드루 머리 기존 기도문 샘플 (로이드 존스 24편 + 스펄전 7편).
 * 앤드루 머리의 기존 데이터는 읽기 전용으로 참조합니다.
 * 기존 홈페이지의 nav와 카드 기능을 변경하지 않습니다.
 */
(function(){
  'use strict';
  var prayers=window.RevivalTodayPrayerData;
  var murray=window.RevivalDailyPrayerData;
  if(!Array.isArray(murray)||murray.length!==31){
    console.error('기존 앤드루 머리 31일 자료가 필요합니다.');return;
  }
  var today=new Map();
  var andrew=new Map(murray.map(function(p){return [p.day,p];}));
  var dialog, selectedDate, opener;
  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
  function btn(value,cls){var e=el('button',cls,value);e.type='button';return e;}
  function localDate(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate(),12,0,0);}
  function dateString(d){return (d.getMonth()+1)+'월 '+d.getDate()+'일';}
  function isoDate(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function textBody(record){
    var prose=el('div','daily-prayer-prose');
    (record.paragraphs||[]).forEach(function(line){prose.appendChild(el('p','',line));});
    return prose;
  }
  function addStyle(){
    if(document.getElementById('revival-today-prayer-style'))return;
    var css=el('style');css.id='revival-today-prayer-style';
    css.textContent=`
      .daily-nav-trigger{border:0;background:none;color:inherit;font:650 13px/1.5 'Noto Sans KR','Apple SD Gothic Neo',sans-serif;padding:4px 0;cursor:pointer}
      .daily-nav-trigger:hover,.daily-nav-trigger:focus-visible{color:#216f69;text-decoration:underline;text-underline-offset:3px}
      .daily-prayer-modal{border:1px solid #c8d9d0;border-radius:13px;background:#fff;color:#203b3f;box-shadow:0 28px 85px #0c2a2c4a;padding:0;width:min(780px,calc(100vw - 24px));height:min(89dvh,880px);max-height:none;overflow:hidden}
      .daily-prayer-modal::backdrop{background:rgba(12,30,30,.62);backdrop-filter:blur(3px)}
      .daily-modal-shell{display:flex;flex-direction:column;height:100%;min-height:0}
      .daily-modal-head{flex:none;padding:22px 64px 15px 27px;background:linear-gradient(105deg,#eff5ee,#fff);border-bottom:1px solid #e0e9e2;position:relative}
      .daily-modal-tag{display:block;color:#59766d;letter-spacing:.06em;font:700 11px/1.5 'Noto Sans KR',sans-serif;margin:0 0 8px}
      .daily-modal-title{font:700 clamp(20px,3.8vw,27px)/1.48 'Noto Serif KR','Nanum Myeongjo',serif;letter-spacing:-.025em;margin:0;word-break:keep-all}
      .daily-close{position:absolute;right:14px;top:13px;width:43px;height:43px;border:0;border-radius:8px;background:transparent;color:#3b5754;cursor:pointer;font:400 27px/1 sans-serif}
      .daily-close:hover,.daily-close:focus-visible{background:#e4f0e7;outline-offset:2px}
      .daily-modal-body{overflow-y:auto;overscroll-behavior:contain;padding:23px 31px 28px;min-height:0}
      .daily-prayer-prose{font:16px/2.07 'Noto Serif KR','Nanum Myeongjo',serif;word-break:keep-all;overflow-wrap:break-word}
      .daily-prayer-prose p{margin:0 0 1.32em}
      .daily-prayer-prose p:last-child{margin-bottom:0}
      .daily-murray-inline{margin:30px 0 0;padding:15px 16px 17px;border-top:1px solid #dce6df;background:#f6faf7;border-radius:7px}
      .daily-murray-inline summary{display:block;cursor:pointer;color:#216f69;text-decoration:underline;text-underline-offset:3px;font:700 14px/1.8 'Apple SD Gothic Neo','Noto Sans KR',sans-serif}
      .daily-murray-inline summary::after{content:'⌄';display:inline-block;margin-left:10px;text-decoration:none}
      .daily-murray-inline[open] summary::after{content:'⌃'}
      .daily-murray-inline .daily-prayer-prose{border-top:1px solid #dce6df;margin-top:13px;padding-top:17px;font-size:15px}
      .daily-modal-footer{flex:none;border-top:1px solid #e0e9e2;padding:12px 16px;background:#fafcf9;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px}
      .daily-move{border:1px solid #c2d5c9;background:#fff;color:#285d56;border-radius:7px;padding:9px 12px;cursor:pointer;font:700 13px/1.5 'Noto Sans KR',sans-serif}
      .daily-move:hover,.daily-move:focus-visible{background:#eaf4ee}
      .daily-share-btn{border:1px solid #216f69;background:#216f69;color:#fff;border-radius:7px;padding:9px 13px;cursor:pointer;font:750 13px/1.5 'Noto Sans KR',sans-serif;white-space:nowrap}
      .daily-share-btn:hover,.daily-share-btn:focus-visible{background:#184b48}
      .daily-share-status{grid-column:1/-1;text-align:center;min-height:0;font:12px/1.6 'Noto Sans KR',sans-serif;color:#286b60}
      .daily-prayer-modal button:focus-visible,.daily-murray-inline summary:focus-visible{outline:3px solid #b69661;outline-offset:3px}
      @media(max-width:650px){.daily-prayer-modal{height:93dvh}.daily-modal-head{padding:21px 53px 13px 18px}.daily-modal-body{padding:17px 18px 21px}.daily-prayer-prose{font-size:15px;line-height:1.95}.daily-modal-footer{padding:10px;gap:5px}.daily-move{font-size:12px;padding:9px 7px}.daily-share-btn{font-size:12px;padding:9px 9px}}
      @media print{.daily-prayer-modal{display:none!important}}
    `;document.head.appendChild(css);
  }
  function create(){
    if(dialog)return dialog;
    dialog=el('dialog','daily-prayer-modal');dialog.id='daily-prayer-dialog';dialog.setAttribute('aria-labelledby','daily-prayer-dialog-title');
    var shell=el('div','daily-modal-shell'),head=el('header','daily-modal-head');
    head.appendChild(el('small','daily-modal-tag','부흥을 위한 오늘의 기도'));
    var title=el('h2','daily-modal-title');title.id='daily-prayer-dialog-title';head.appendChild(title);
    var close=btn('×','daily-close');close.setAttribute('aria-label','오늘의 기도 닫기');close.addEventListener('click',function(){dialog.close();});head.appendChild(close);
    var body=el('div','daily-modal-body');body.id='daily-prayer-body';
    var footer=el('footer','daily-modal-footer');
    var prev=btn('← 전날 기도','daily-move');prev.id='daily-prev';prev.addEventListener('click',function(){moveDay(-1);});
    var share=btn('링크 복사','daily-share-btn');share.id='daily-share';share.addEventListener('click',copyLink);
    var next=btn('다음날 기도 →','daily-move');next.id='daily-next';next.addEventListener('click',function(){moveDay(1);});
    var status=el('div','daily-share-status');status.id='daily-share-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    footer.append(prev,share,next,status);shell.append(head,body,footer);dialog.appendChild(shell);document.body.appendChild(dialog);
    dialog.addEventListener('click',function(e){if(e.target===dialog)dialog.close();});
    dialog.addEventListener('close',function(){if(opener&&document.contains(opener))opener.focus();});
    return dialog;
  }
  function makeMurray(day){
    var panel=el('details','daily-murray-inline');panel.appendChild(el('summary','','앤드류머리의 중보기도문'));
    var sample=andrew.get(day);
    if(sample)panel.appendChild(textBody(sample));
    else panel.appendChild(el('p','','해당 날짜의 중보기도문을 찾을 수 없습니다.'));
    return panel;
  }
  function showDate(date){
    selectedDate=localDate(date);
    var day=selectedDate.getDate(),record=today.get(day);
    if(!record)return;
    var modal=create();
    modal.querySelector('#daily-prayer-dialog-title').textContent=dateString(selectedDate)+' — '+record.title;
    var body=modal.querySelector('#daily-prayer-body');body.replaceChildren(textBody(record),makeMurray(day));body.scrollTop=0;
    modal.querySelector('#daily-share-status').textContent='';
    modal.querySelector('#daily-prev').setAttribute('aria-label',dateString(new Date(selectedDate.getFullYear(),selectedDate.getMonth(),day-1))+' 기도 보기');
    modal.querySelector('#daily-next').setAttribute('aria-label',dateString(new Date(selectedDate.getFullYear(),selectedDate.getMonth(),day+1))+' 기도 보기');
    if(!modal.open)modal.showModal();
  }
  function moveDay(n){if(selectedDate)showDate(new Date(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate()+n,12));}
  function sharingUrl(d){return new URL('/?prayer-date='+encodeURIComponent(isoDate(d)),location.href).href;}
  async function copyLink(){
    if(!selectedDate)return;
    var status=dialog.querySelector('#daily-share-status');
    var url=sharingUrl(selectedDate);
    var copied=false;
    if(navigator.clipboard&&window.isSecureContext){
      try{await navigator.clipboard.writeText(url);copied=true;}
      catch(e){/* 클립보드 권한 거부 시 아래 대체 방식 사용 */}
    }
    if(!copied){
      var field=el('textarea');field.value=url;
      field.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(field);
      field.select();
      try{copied=!!document.execCommand('copy');}
      catch(e){copied=false;}
      field.remove();
    }
    if(copied){
      status.textContent='링크를 복사했습니다.';
    }else{
      status.textContent='자동 복사가 지원되지 않아 주소를 표시했습니다. 직접 복사해 주세요.';
      window.prompt('공유 링크를 복사하세요',url);
    }
  }
  function requestedDate(){
    var p=new URLSearchParams(location.search),raw=p.get('prayer-date');
    if(raw&&/^\d{4}-\d{2}-\d{2}$/.test(raw)){
      var a=raw.split('-').map(Number),d=new Date(a[0],a[1]-1,a[2],12);
      if(isoDate(d)===raw)return d;
    }
    var rawDay=p.get('prayer-day');
    if(rawDay&&/^\d{1,2}$/.test(rawDay)){
      var day=Number(rawDay),now=new Date();
      if(day>=1&&day<=31){
        for(var m=0;m<13;m++){
          var first=new Date(now.getFullYear(),now.getMonth()+m,1,12);
          if(day<=new Date(first.getFullYear(),first.getMonth()+1,0).getDate())return new Date(first.getFullYear(),first.getMonth(),day,12);
        }
      }
    }
    return null;
  }
  function addMurraySamples(){
    document.querySelectorAll('.daily-murray-sample[data-prayer-day]').forEach(function(detail){
      var day=Number(detail.dataset.prayerDay),sample=andrew.get(day);
      var box=detail.querySelector('.daily-murray-sample-content');
      if(!box||!sample)return;
      var prose=textBody(sample);prose.classList.add('daily-sample-prayer');
      box.replaceChildren(el('h4','',sample.title),prose);
      var summary=detail.querySelector('summary');
      if(summary)summary.setAttribute('aria-label','제'+day+'일 기도문 샘플 펼치기 또는 접기');
    });
  }
  function launchHome(nav){
    prayers=window.RevivalTodayPrayerData;
    if(!Array.isArray(prayers)||prayers.length!==31){
      console.error('새로운 오늘의 기도 31일 자료를 불러오지 못했습니다.');return;
    }
    today=new Map(prayers.map(function(p){return [p.day,p];}));
    addStyle();
    var trigger=nav.querySelector('.daily-nav-trigger');
    if(!trigger){
      trigger=btn('오늘의 기도','daily-nav-trigger');
      trigger.setAttribute('aria-haspopup','dialog');
      trigger.setAttribute('aria-controls','daily-prayer-dialog');
      var target=nav.querySelector('a[href="#prayer"]');
      nav.insertBefore(trigger,target||nav.firstChild);
    }
    trigger.addEventListener('click',function(){opener=trigger;showDate(new Date());});
    var request=requestedDate();if(request){opener=trigger;showDate(request);}
  }
  function init(){
    var nav=document.querySelector('header .top nav');
    if(!nav){addMurraySamples();return;}
    if(window.RevivalTodayPrayerData){launchHome(nav);return;}
    var script=document.createElement('script');
    script.src='today-prayer-data.js';
    script.onload=function(){launchHome(nav);};
    script.onerror=function(){console.error('today-prayer-data.js 파일을 확인해 주세요.');};
    document.head.appendChild(script);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.RevivalPrayerUI={showDate:showDate,moveDay:moveDay,sharingUrl:sharingUrl};
})();
