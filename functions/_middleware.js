/**
 * 부흥프로젝트 · 중복 없는 공통 맨 위로 이동 버튼
 * 적용 위치: functions/_middleware.js (Cloudflare Pages Functions)
 * 기존 버튼 중 단순 앵커는 제거하고, JS에서 참조하는 버튼은 DOM에 남기되 화면에서 숨깁니다.
 * 이렇게 하면 기존 페이지별 스크립트가 버튼을 참조할 때도 오류가 나지 않습니다.
 */

const TOP_STYLE = `<style id="revival-top-style-v4">
/* 기존 페이지별 맨 위로 버튼: JS 이벤트 연결을 보존하기 위해 대부분 시각적으로 제거 */
#backToTop,#backTop,#back-top,#to-top,#go-top,
button.backtop,button.to-top,button.go-top,
a.top-link,a.top[href="#"],
[data-revival-old-top="1"] {
  display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
}
/* 모든 일반 페이지에서는 공통 원형 버튼 하나만 표시 */
#revival-back-to-top {
  position:fixed!important;right:20px;bottom:22px;z-index:2147483600;
  width:44px;height:44px;box-sizing:border-box;display:flex!important;
  align-items:center;justify-content:center;flex:0 0 auto;
  border:1px solid #c1d7cc;border-radius:50%;background:#fff;
  color:#216f69!important;text-decoration:none!important;
  box-shadow:0 4px 18px rgba(24,59,70,.18);
  opacity:1!important;visibility:visible!important;pointer-events:auto!important;
  transition:background-color .15s,color .15s;
  -webkit-tap-highlight-color:transparent;
}
#revival-back-to-top svg{width:21px;height:21px;display:block;flex:none;stroke:currentColor}
#revival-back-to-top:hover{background:#216f69;color:#fff!important}
#revival-back-to-top:focus-visible{outline:3px solid #b69661;outline-offset:3px}
@media(max-width:600px){#revival-back-to-top{right:12px;bottom:14px;width:40px;height:40px}}
@media(prefers-reduced-motion:reduce){#revival-back-to-top{transition:none}}
@media print{#revival-back-to-top{display:none!important}}
</style>`;

const TOP_ANCHOR = `<a href="#" id="revival-back-to-top" aria-label="화면 맨 위로 이동" title="맨 위로"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 14 6-6 6 6"/><path d="M12 9v11"/></svg></a>`;

const TOP_SCRIPT = `<script id="revival-top-script-v4">
(function(){'use strict';
  var common=document.getElementById('revival-back-to-top');
  if(!common)return;

  // HTMLRewriter가 미처 감지하지 못한 페이지별 버튼도 찾아 숨깁니다.
  // 부모 요소 전체를 없애거나 기존 스크립트가 사용하는 요소를 삭제하지 않습니다.
  var known='#backToTop,#backTop,#back-top,#to-top,#go-top,button.backtop,button.to-top,button.go-top,a.top-link,a.top[href="#"],[data-revival-old-top="1"]';
  function hide(el){
    if(!el||el.nodeType!==1||el===common||el.id==='revival-back-to-top'||el.hasAttribute('data-revival-old-top'))return;
    el.setAttribute('data-revival-old-top','1');
    el.setAttribute('aria-hidden','true');
    el.setAttribute('tabindex','-1');
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
  }
  function maybeHide(el){
    if(!el||el.nodeType!==1||el===common||el.id==='revival-back-to-top')return;
    if(el.matches&&el.matches(known)){hide(el);return;}
    if(!el.matches||!el.matches('a,button,[role="button"]'))return;
    var id=(el.id||'')+' '+String(el.className||'');
    var label=[el.getAttribute('aria-label')||'',el.getAttribute('title')||'',el.textContent||''].join(' ').trim();
    var matchesName=/back.?to.?top|scroll.?to.?top|to.?top.?btn|top.?button/i.test(id);
    var matchesLabel=/맨\\s*위(?:로)?|위로\\s*(?:가기|이동|올라가기)|back\\s*to\\s*top|scroll\\s*to\\s*top|^\\s*↑\\s*(?:맨|위)/i.test(label);
    if(!matchesName&&!matchesLabel)return;
    var st=window.getComputedStyle?window.getComputedStyle(el):null;
    if(!st)return;
    var fixed=st.position==='fixed';
    if(fixed){hide(el);return;}
    // 아직 숨겨진 상태거나 스크롤 조건으로 뒤늦게 고정되는 버튼.
    if(matchesName&&st.position==='absolute'&&st.bottom!=='auto'&&st.right!=='auto')hide(el);
  }
  function scan(root){
    if(!root)return;
    if(root.nodeType===1)maybeHide(root);
    if(root.querySelectorAll){
      // 페이지당 첫 검사와 추가된 노드만 검사하므로 큰 페이지에서도 비용이 낮습니다.
      root.querySelectorAll('a,button,[role="button"],[data-revival-old-top="1"]').forEach(maybeHide);
    }
  }
  scan(document);
  if(typeof MutationObserver==='function'){
    var observer=new MutationObserver(function(records){
      for(var i=0;i<records.length;i++){
        var nodes=records[i].addedNodes;
        for(var j=0;j<nodes.length;j++)if(nodes[j].nodeType===1)scan(nodes[j]);
      }
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }
  common.addEventListener('click',function(event){
    event.preventDefault();
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
  });
})();
</script>`;

const KEEP_OLD_IN_DOM = [
  '#backToTop','#backTop','#back-top','#to-top','#go-top',
  'button.backtop','button.to-top','button.go-top'
];

const oldButtonHandler = {
  element(el){
    // DOM 삭제 대신 시각적으로 숨김: 페이지별 getElementById(...).addEventListener 안전성 확보.
    const prior=el.getAttribute('style')||'';
    el.setAttribute('style',prior+';display:none!important;visibility:hidden!important');
    el.setAttribute('data-revival-old-top','1');
    el.setAttribute('aria-hidden','true');
    el.setAttribute('tabindex','-1');
  }
};

export async function onRequest(context){
  const response=await context.next();
  const type=response.headers.get('content-type')||'';
  if(context.request.method!=='GET'||response.status!==200||!/text\\/html/i.test(type))return response;
  const url=new URL(context.request.url);
  const page=url.pathname.replace(/\\/+$/,'').split('/').pop().toLowerCase();
  // 연대표가 홈페이지 iframe으로 열리는 경우 iframe 자체에는 별도의 고정 버튼을 놓지 않습니다.
  if(page==='revival-sermon-timeline.html'&&url.searchParams.get('embed')==='1')return response;

  let rewriter=new HTMLRewriter()
    .on('head',{element(el){el.append(TOP_STYLE,{html:true});}})
    .on('body',{element(el){el.append(TOP_ANCHOR+TOP_SCRIPT,{html:true});}})
    // 독립적인 정적 위로가기 앵커는 실제 DOM에서 삭제 (기존 JS가 참조하지 않음).
    .on('a.top-link',{element(el){el.remove();}})
    .on('a.top[href="#"]',{element(el){el.remove();}});
  for(const selector of KEEP_OLD_IN_DOM)rewriter=rewriter.on(selector,oldButtonHandler);
  return rewriter.transform(response);
}
