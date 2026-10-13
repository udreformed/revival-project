/* 부흥프로젝트: 31일 기도 팝업과 앤드루 머리 기도문 샘플, 공통 개역한글 성경 대화창 */
(function(){
  'use strict';
  var prayers=window.RevivalDailyPrayerData;
  if(!Array.isArray(prayers)||prayers.length!==31){console.error('31일 기도문 데이터가 필요합니다.');return;}
  var dayByNumber=new Map(prayers.map(function(p){return [p.day,p];}));
  var bookFiles={
    '시편':'Psalms','에베소서':'Ephesians','빌립보서':'Philippians','느헤미야':'Nehemiah',
    '데살로니가전서':'1Thessalonians','요한일서':'1John','요한복음':'John','로마서':'Romans',
    '골로새서':'Colossians','디모데후서':'2Timothy','이사야':'Isaiah','히브리서':'Hebrews',
    '에스겔':'Ezekiel','마태복음':'Matthew','사도행전':'Acts','베드로전서':'1Peter',
    '잠언':'Proverbs','야고보서':'James','마가복음':'Mark','디모데전서':'1Timothy',
    '요한계시록':'Revelation','고린도후서':'2Corinthians','고린도전서':'1Corinthians',
    '갈라디아서':'Galatians','누가복음':'Luke'
  };
  var CDN='https://cdn.jsdelivr.net/gh/bluesaurel/Korean-Bible-1961-KRV@main/data/';
  var RAW='https://raw.githubusercontent.com/bluesaurel/Korean-Bible-1961-KRV/main/data/';
  var cachedBooks=new Map();
  var bibleDialog,mainDialog,selectedDate,previousFocus;
  function el(tag,className,text){var n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;}
  function button(text,cls){var n=el('button',cls,text);n.type='button';return n;}
  function addStyle(){
    if(document.getElementById('revival-daily-style'))return;
    var c=document.createElement('style');c.id='revival-daily-style';
    c.textContent=`
      .daily-nav-trigger{background:transparent;border:0;border-bottom:2px solid transparent;padding:4px 0;cursor:pointer;color:inherit;font:inherit;font-weight:750;line-height:inherit;white-space:nowrap}
      .daily-nav-trigger:hover,.daily-nav-trigger:focus-visible{color:#216f69;border-bottom-color:#216f69}
      .daily-verse-buttons{display:flex;flex-wrap:wrap;gap:8px 10px;margin:9px 0 20px;align-items:center}
      .daily-verse-button{border:1px solid #b9d0c5;border-radius:6px;background:#f1f7f2;color:#265c57;font:700 12px/1.5 'Apple SD Gothic Neo','Noto Sans KR',sans-serif;padding:6px 10px;cursor:pointer}
      .daily-verse-button:hover,.daily-verse-button:focus-visible{background:#e3f1e8;border-color:#78a597;outline-offset:3px}
      .daily-prayer-modal,.daily-bible-modal{border:1px solid #c8d9d0;border-radius:14px;background:#fff;color:#203b3f;box-shadow:0 28px 85px #0c2a2c4a;padding:0;max-width:calc(100vw - 24px);box-sizing:border-box}
      .daily-prayer-modal::backdrop,.daily-bible-modal::backdrop{background:rgba(12,30,30,.62);backdrop-filter:blur(3px)}
      .daily-prayer-modal{width:min(780px,calc(100vw - 24px));max-height:min(90vh,900px);overflow:hidden}
      .daily-modal-shell{display:flex;flex-direction:column;max-height:min(90vh,900px);min-height:0}
      .daily-modal-head{flex:none;padding:23px 64px 14px 27px;background:linear-gradient(105deg,#eff5ee,#fff);border-bottom:1px solid #e0e9e2;position:relative}
      .daily-modal-tag{display:block;margin:0 0 8px;color:#59766d;letter-spacing:.06em;font:700 11px/1.5 'Apple SD Gothic Neo','Noto Sans KR',sans-serif}
      .daily-modal-title{font:700 clamp(20px,3.8vw,28px)/1.48 'Noto Serif KR','Nanum Myeongjo',serif;letter-spacing:-.025em;margin:0;word-break:keep-all}
      .daily-close{position:absolute;right:14px;top:13px;width:43px;height:43px;border:0;border-radius:8px;background:transparent;color:#3b5754;cursor:pointer;font:400 27px/1 sans-serif}
      .daily-close:hover,.daily-close:focus-visible{background:#e4f0e7;outline-offset:2px}
      .daily-modal-body{overflow-y:auto;overscroll-behavior:contain;padding:23px 31px 26px;min-height:0}
      .daily-prayer-prose{font:16px/2.07 'Noto Serif KR','Nanum Myeongjo',serif;word-break:keep-all;overflow-wrap:break-word}
      .daily-prayer-prose p{margin:0 0 1.32em}
      .daily-modal-footer{flex:none;border-top:1px solid #e0e9e2;padding:12px 19px;background:#fafcf9;display:flex;align-items:center;justify-content:space-between;gap:9px;flex-wrap:wrap}
      .daily-move{border:1px solid #c2d5c9;background:#fff;color:#285d56;border-radius:7px;padding:9px 12px;cursor:pointer;font:700 13px/1.5 'Apple SD Gothic Neo','Noto Sans KR',sans-serif}
      .daily-move:hover,.daily-move:focus-visible{background:#eaf4ee}
      .daily-share-btn{border:1px solid #216f69;background:#216f69;color:#fff;border-radius:7px;padding:9px 13px;cursor:pointer;font:750 13px/1.5 'Apple SD Gothic Neo','Noto Sans KR',sans-serif;white-space:nowrap}
      .daily-share-btn:hover,.daily-share-btn:focus-visible{background:#184b48;outline-offset:2px}
      .daily-share-status{font:12px/1.6 'Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:#286b60;text-align:center;min-height:0}
      .daily-modal-footer{display:grid;grid-template-columns:1fr auto 1fr;column-gap:8px;row-gap:7px}
      .daily-modal-footer .daily-prev-share{justify-self:start}
      .daily-modal-footer .daily-next-share{justify-self:end}
      .daily-modal-footer .daily-pdf-link{grid-column:1/-1;justify-self:center}
      .daily-modal-footer .daily-share-status{grid-column:1/-1;justify-self:center}
      @media(max-width:650px){.daily-share-btn{font-size:12px;padding:9px 9px}.daily-modal-footer{column-gap:5px}.daily-modal-footer .daily-pdf-link{order:unset;width:auto}}
      .daily-pdf-link{font:700 12px/1.5 'Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:#326960;text-decoration:underline;text-underline-offset:3px}
      .daily-bible-modal{width:min(560px,calc(100vw - 24px));max-height:min(80vh,750px);overflow:hidden}
      .daily-bible-heading{position:relative;background:#eff5ee;padding:20px 58px 15px 23px;border-bottom:1px solid #dfebe3}
      .daily-bible-heading h2{margin:0;font:700 20px/1.6 'Noto Serif KR',serif;color:#214a45}
      .daily-bible-heading small{display:block;color:#597a6c;font-size:12px;margin-top:2px}
      .daily-bible-content{padding:19px 24px 24px;max-height:calc(80vh - 112px);overflow-y:auto;font:15px/2 'Noto Serif KR','Nanum Myeongjo',serif}
      .daily-krv-verse{margin:0 0 12px;word-break:keep-all}.daily-krv-num{font-size:11px;color:#216f69;font-weight:850;margin-right:9px;vertical-align:baseline}
      .daily-bible-error{color:#7c423b;font:14px/1.9 'Noto Sans KR',sans-serif}
      .daily-bible-retry{border:1px solid #b1cfc0;background:#f2f8f3;color:#245f58;padding:6px 11px;border-radius:6px;cursor:pointer}
      @media(max-width:650px){.daily-prayer-modal{max-height:93dvh}.daily-modal-shell{max-height:93dvh}.daily-modal-head{padding:21px 53px 13px 18px}.daily-modal-body{padding:17px 18px 21px}.daily-prayer-prose{font-size:15px;line-height:1.95}.daily-modal-footer{padding:11px 13px}.daily-move{font-size:12px;padding:9px 10px}.daily-pdf-link{width:100%;text-align:center;order:3}.daily-bible-content{padding:16px 18px}.daily-bible-heading{padding:17px 52px 13px 18px}}
      @media(prefers-reduced-motion:reduce){.daily-modal-shell *{scroll-behavior:auto!important}}
      /* fixed modal, independently scrolling prayer content */
      html.daily-popup-open,html.daily-popup-open body{overflow:hidden!important}
      .daily-prayer-modal{position:fixed;inset:0;margin:auto;width:min(820px,calc(100vw - 24px));height:min(89dvh,880px);max-height:none;overflow:hidden}
      .daily-modal-shell{height:100%;max-height:none;min-height:0;display:flex;flex-direction:column}
      .daily-modal-body{flex:1 1 auto;min-height:0;overflow-y:scroll;-webkit-overflow-scrolling:touch;touch-action:pan-y;scrollbar-gutter:stable;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#9fb9ae #f2f6f2}
      .daily-modal-body::-webkit-scrollbar{width:10px}
      .daily-modal-body::-webkit-scrollbar-thumb{background:#9fb9ae;border-radius:9px;border:2px solid #f2f6f2}
      .daily-modal-body::-webkit-scrollbar-track{background:#f2f6f2}
      .daily-modal-head{padding-right:91px}
      .daily-modal-title-row{display:flex;gap:10px 15px;align-items:center;flex-wrap:wrap}
      .daily-modal-title{min-width:0;flex:0 1 auto}
      .daily-share-btn{align-self:center;flex:none}
      .daily-prayer-modal .daily-close{top:12px;right:15px;width:59px;height:59px;font-size:36px;font-weight:500;background:#fff;border:1px solid #aac5b8;border-radius:12px;display:grid;place-items:center;z-index:1}
      .daily-prayer-modal .daily-close:hover,.daily-prayer-modal .daily-close:focus-visible{background:#e4f0e7;border-color:#216f69}
      .daily-share-status{margin-top:5px;text-align:left}
      .daily-modal-footer{display:flex;justify-content:space-between;align-items:center;padding:12px 24px}
      .daily-modal-footer .daily-move{justify-self:auto}
      .daily-pdf-link{display:none!important}
      @media(max-width:650px){
        .daily-prayer-modal{width:calc(100vw - 16px);height:calc(100dvh - 24px);max-height:none}
        .daily-modal-shell{height:100%;max-height:none}
        .daily-modal-head{padding:18px 79px 13px 18px}
        .daily-modal-title-row{gap:9px;align-items:center}
        .daily-modal-title{font-size:clamp(19px,5vw,23px);line-height:1.48}
        .daily-share-btn{padding:7px 11px}
        .daily-prayer-modal .daily-close{top:10px;right:10px;width:56px;height:56px;font-size:34px}
        .daily-modal-body{padding:19px 14px 23px 18px}
        .daily-modal-footer{padding:12px 14px;flex-wrap:nowrap}
      }
      @media(max-width:390px){.daily-modal-head{padding-right:75px}.daily-modal-title{font-size:19px}.daily-share-btn{font-size:12px}}
      @media print{.daily-prayer-modal,.daily-bible-modal{display:none!important}}
    `;
    document.head.appendChild(c);
  }
  function makeReferenceLinks(refs){
    var wrap=el('div','daily-verse-buttons');wrap.setAttribute('aria-label','관련 성경 구절 · 클릭하면 개역한글 본문 열기');
    refs.forEach(function(r){var b=button(r,'daily-verse-button');b.title='개역한글 성경 본문 보기: '+r;b.addEventListener('click',function(){showVerse(r);});wrap.appendChild(b);});return wrap;
  }
  function makePrayerText(p){var div=el('div','daily-prayer-prose');p.paragraphs.forEach(function(line){div.appendChild(el('p','',line));});return div;}
  function createBibleDialog(){
    if(bibleDialog)return bibleDialog;
    bibleDialog=el('dialog','daily-bible-modal');bibleDialog.id='daily-bible-dialog';
    var head=el('div','daily-bible-heading');var close=button('×','daily-close');close.setAttribute('aria-label','성경 본문 창 닫기');close.addEventListener('click',function(){bibleDialog.close();});
    var title=el('h2');title.id='daily-bible-title';var subtitle=el('small','', '개역한글판 · 1961');
    head.append(title,subtitle,close);
    var content=el('div','daily-bible-content');content.id='daily-bible-content';
    bibleDialog.append(head,content);document.body.appendChild(bibleDialog);
    bibleDialog.addEventListener('click',function(e){if(e.target===bibleDialog)bibleDialog.close();});
    return bibleDialog;
  }
  function parseRef(ref){var m=/^(.+?)\s+(\d+):(\d+)(?:[–-](\d+))?$/.exec(ref);if(!m)throw Error('성경 장절 형식을 확인해 주세요.');var file=bookFiles[m[1]];if(!file)throw Error('성경 권 이름을 확인해 주세요.');return {book:m[1],file:file,chapter:Number(m[2]),start:Number(m[3]),end:Number(m[4]||m[3])};}
  async function fetchBook(file){
    if(cachedBooks.has(file))return cachedBooks.get(file);
    var loading=(async function(){
      var lastError;
      for(var base of [CDN,RAW]){
        var ctrl=new AbortController();var t=setTimeout(function(){ctrl.abort();},9000);
        try{
          var response=await fetch(base+file+'.json',{signal:ctrl.signal,mode:'cors',cache:'force-cache'});
          if(!response.ok)throw Error('HTTP '+response.status);
          var book=await response.json();
          if(!Array.isArray(book.chapters))throw Error('잘못된 성경 데이터 형식');
          return book;
        }catch(e){lastError=e;}finally{clearTimeout(t);}
      }
      throw lastError||Error('성경 자료를 확인할 수 없습니다.');
    })();
    cachedBooks.set(file,loading);
    loading.catch(function(){cachedBooks.delete(file);});
    return loading;
  }
  async function showVerse(ref){
    var d=createBibleDialog(),t=d.querySelector('#daily-bible-title'),content=d.querySelector('#daily-bible-content');
    t.textContent=ref;content.replaceChildren(el('p','','개역한글 본문을 불러오는 중입니다…'));
    if(!d.open)d.showModal();
    var currentRef=ref;d.dataset.currentReference=currentRef;
    try{
      var part=parseRef(ref),book=await fetchBook(part.file);
      if(!d.open||d.dataset.currentReference!==currentRef)return;
      var ch=book.chapters.find(function(x){return Number(x.chapter)===part.chapter;});
      if(!ch)throw Error('요청한 장이 없습니다.');
      var verses=ch.verses.filter(function(v){return Number(v.verse)>=part.start&&Number(v.verse)<=part.end;});
      if(verses.length!==part.end-part.start+1)throw Error('요청한 절 중 누락이 있습니다.');
      content.replaceChildren();
      verses.forEach(function(v){var p=el('p','daily-krv-verse');p.append(el('span','daily-krv-num',String(v.verse)),document.createTextNode(v.text));content.appendChild(p);});
    }catch(e){
      if(!d.open||d.dataset.currentReference!==currentRef)return;
      content.replaceChildren();
      content.appendChild(el('p','daily-bible-error','성경 본문을 불러오지 못했습니다. 인터넷 연결을 확인한 후 다시 시도해 주세요.'));
      var retry=button('다시 시도','daily-bible-retry');retry.addEventListener('click',function(){showVerse(ref);});content.appendChild(retry);
      console.warn('개역한글 본문 조회 실패:',ref,e);
    }
  }
  function localDay(date){return new Date(date.getFullYear(),date.getMonth(),date.getDate(),12,0,0);}
  function sameDate(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();}
  function dateLabel(d){return (d.getMonth()+1)+'월 '+d.getDate()+'일';}
  /* Share URLs are static HTML pages so KakaoTalk's crawler can read per-day Open Graph metadata.
     The optional date parameter preserves the actual calendar date on which the prayer was viewed. */
  function isoDate(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function sharingUrl(date){
    var d=localDay(date);
    var path='/prayer-share/'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+'.html';
    var u=new URL(path,document.baseURI);
    u.searchParams.set('date',isoDate(d));
    return u.href;
  }
  async function copyShareUrl(){
    if(!selectedDate)return;
    var link=sharingUrl(selectedDate);
    var status=mainDialog&&mainDialog.querySelector('#daily-share-status');
    try{
      if(navigator.clipboard&&window.isSecureContext){
        await navigator.clipboard.writeText(link);
      }else{
        var tmp=document.createElement('textarea');tmp.value=link;tmp.style.position='fixed';tmp.style.opacity='0';
        document.body.appendChild(tmp);tmp.select();
        var ok=document.execCommand('copy');tmp.remove();if(!ok)throw Error('복사 지원되지 않음');
      }
      if(status)status.textContent='링크를 복사했습니다. 카카오톡 채팅방에 붙여넣어 공유하세요.';
    }catch(err){
      if(status)status.textContent='자동 복사가 불가능합니다. 표시된 링크를 직접 복사해 주세요.';
      window.prompt('공유 링크를 복사하세요',link);
    }
  }
  function readDeepLink(){
    var params=new URLSearchParams(window.location.search);
    var raw=params.get('prayer-date');
    if(raw&&/^\d{4}-\d{2}-\d{2}$/.test(raw)){
      var parts=raw.split('-').map(Number),d=new Date(parts[0],parts[1]-1,parts[2],12);
      if(isoDate(d)===raw&&dayByNumber.has(d.getDate()))return d;
    }
    var rawDay=params.get('prayer-day');
    if(rawDay&&/^\d{1,2}$/.test(rawDay)){
      var n=Number(rawDay);if(n>=1&&n<=31){
        var now=new Date();
        for(var k=0;k<13;k++){
          var first=new Date(now.getFullYear(),now.getMonth()+k,1,12);
          if(n<=new Date(first.getFullYear(),first.getMonth()+1,0).getDate())return new Date(first.getFullYear(),first.getMonth(),n,12);
        }
      }
    }
    return null;
  }
  function createMainDialog(){
    if(mainDialog)return mainDialog;
    mainDialog=el('dialog','daily-prayer-modal');mainDialog.id='daily-prayer-dialog';mainDialog.setAttribute('aria-labelledby','daily-prayer-dialog-title');
    var shell=el('div','daily-modal-shell'),head=el('div','daily-modal-head');
    var tag=el('small','daily-modal-tag','오늘의 기도 · 매월 반복');
    var row=el('div','daily-modal-title-row');
    var title=el('h2','daily-modal-title');title.id='daily-prayer-dialog-title';
    var share=button('링크 복사','daily-share-btn');share.id='daily-share';
    share.title='현재 기도문을 카카오톡 등으로 공유할 링크 복사';share.addEventListener('click',copyShareUrl);
    var status=el('div','daily-share-status');status.id='daily-share-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    var close=button('×','daily-close');close.setAttribute('aria-label','오늘의 기도 창 닫기');close.addEventListener('click',function(){mainDialog.close();});
    row.append(title,share);head.append(tag,row,status,close);
    var body=el('div','daily-modal-body');body.id='daily-prayer-body';
    var footer=el('div','daily-modal-footer');
    var prev=button('← 전날 기도','daily-move daily-prev-share');prev.id='daily-prev';prev.addEventListener('click',function(){moveDay(-1);});
    var next=button('다음날 기도 →','daily-move daily-next-share');next.id='daily-next';next.addEventListener('click',function(){moveDay(1);});
    footer.append(prev,next);shell.append(head,body,footer);mainDialog.appendChild(shell);document.body.appendChild(mainDialog);
    mainDialog.addEventListener('click',function(e){if(e.target===mainDialog)mainDialog.close();});
    mainDialog.addEventListener('close',function(){document.documentElement.classList.remove('daily-popup-open');if(previousFocus&&document.contains(previousFocus))previousFocus.focus();});
    return mainDialog;
  }
  function showDate(date){
    selectedDate=localDay(date);
    var p=dayByNumber.get(selectedDate.getDate());if(!p)return;
    var dialog=createMainDialog();
    dialog.querySelector('#daily-prayer-dialog-title').textContent=dateLabel(selectedDate)+' — '+p.title;
    var body=dialog.querySelector('#daily-prayer-body');body.replaceChildren(makeReferenceLinks(p.references),makePrayerText(p));body.scrollTop=0;
    dialog.querySelector('#daily-share-status').textContent='';
    var current=sameDate(selectedDate,new Date());
    dialog.querySelector('.daily-modal-tag').textContent=(current?'오늘의 기도 · ':'매일의 기도 · ')+selectedDate.getFullYear()+'년';
    dialog.querySelector('#daily-prev').setAttribute('aria-label',dateLabel(new Date(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate()-1))+' 기도 보기');
    dialog.querySelector('#daily-next').setAttribute('aria-label',dateLabel(new Date(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate()+1))+' 기도 보기');
    if(!dialog.open)dialog.showModal();
    return p;
  }
  function moveDay(delta){if(!selectedDate)return;showDate(new Date(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate()+delta,12));}
  function addMenu(){
    var nav=document.querySelector('header .top nav');if(!nav||nav.querySelector('.daily-nav-trigger'))return;
    var trigger=button('오늘의 기도','daily-nav-trigger');trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-controls','daily-prayer-dialog');
    trigger.addEventListener('click',function(){previousFocus=trigger;showDate(new Date());});
    var prayerLink=nav.querySelector('a[href="#prayer"]');nav.insertBefore(trigger,prayerLink||nav.firstChild);
  }
  function addMurraySamples(){
    var blocks=document.querySelectorAll('.daily-murray-sample[data-prayer-day]');
    blocks.forEach(function(detail){
      var day=Number(detail.dataset.prayerDay),p=dayByNumber.get(day);if(!p)return;
      var content=detail.querySelector('.daily-murray-sample-content');if(!content)return;
      var heading=el('h4','',p.title);
      var refs=makeReferenceLinks(p.references);refs.classList.add('daily-sample-ref');
      var prose=makePrayerText(p);prose.classList.add('daily-sample-prayer');
      content.replaceChildren(heading,refs,prose);
      detail.querySelector('summary').setAttribute('aria-label','제'+day+'일 기도문 샘플 펼치기 또는 접기');
    });
  }
  function init(){addStyle();addMenu();addMurraySamples();var requested=readDeepLink();if(requested&&document.querySelector('header .top nav')){previousFocus=document.querySelector('.daily-nav-trigger');showDate(requested);}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.RevivalPrayerUI={showDate:showDate,showVerse:showVerse,moveDay:moveDay,dateLabel:dateLabel,sharingUrl:sharingUrl};
})();
