/* 제7회 설교 — 화면의 최신 원고를 직접 낭독하는 TTS 동기화 모듈.
 * 별도의 낭독 대본/MP3 없음. 제1~6회 및 제51회에는 작동하지 않습니다.
 * <script src="data/sermon-07-tts-sync.js?v=20261125"></script>
 * 를 sermon-detail.html의 기존 낭독 스크립트 뒤, </body> 직전에 추가하십시오.
 */
(function () {
  'use strict';
  if (Number(new URLSearchParams(location.search).get('sermon')) !== 7) return;
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;

  function initialize() {
    const root = document.getElementById('sermonFullText');
    if (!root || !root.querySelector('h3')) return false;
    if (root.dataset.sermon07Sync === 'yes') return true;
    root.dataset.sermon07Sync = 'yes';
    const synth = window.speechSynthesis;
    synth.cancel();

    // 이전 버전의 낭독 UI만 정리하고 원고 텍스트/아웃라인은 건드리지 않습니다.
    root.querySelectorAll('.sermon-tts-panel,.sermon-tts-section,[data-sermon-tts-panel],[data-sermon-tts-section]').forEach(el => el.remove());
    const title = root.querySelector('h3');
    const style = document.createElement('style');
    style.textContent = '.sermon07-sync{margin:6px 0 24px;padding:15px;border:1px solid #c8ddd2;border-radius:12px;background:#f5faf7;color:#24483e}' +
      '.sermon07-sync-title{font-weight:850;margin-bottom:10px}' +
      '.sermon07-sync-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center}' +
      '.sermon07-sync button,.sermon07-sync select,.sermon07-section-btn{padding:8px 11px;border:1px solid #90b7a8;border-radius:8px;background:#fff;color:#20584b;font:700 14px/1.45 system-ui,sans-serif;cursor:pointer}' +
      '.sermon07-sync button:disabled{opacity:.45;cursor:not-allowed}.sermon07-sync button.active,.sermon07-section-btn.active{background:#196e5b;color:#fff}' +
      '.sermon07-sync label{font-size:13px;font-weight:700}.sermon07-section-btn{margin:0 0 16px;font-size:13px}' +
      '.sermon07-sync-status{font-size:12px;margin-top:8px;color:#326557}';
    document.head.appendChild(style);
    const panel = document.createElement('div');
    panel.className = 'sermon07-sync';
    panel.setAttribute('aria-label', '제7회 설교 원고 낭독');
    panel.innerHTML = '<div class="sermon07-sync-title">설교 원고 음성 듣기</div><div class="sermon07-sync-actions"></div><div class="sermon07-sync-status" role="status" aria-live="polite">화면의 최신 원고를 직접 읽습니다.</div>';
    root.insertBefore(panel, title);
    const actions = panel.querySelector('.sermon07-sync-actions');
    const status = panel.querySelector('.sermon07-sync-status');
    function button(label) {const b=document.createElement('button');b.type='button';b.textContent=label;actions.appendChild(b);return b;}
    const allBtn=button('▶ 전체 듣기');
    const pauseBtn=button('⏸ 일시정지');
    const stopBtn=button('■ 정지');
    const speedLabel=document.createElement('label');speedLabel.textContent='속도 ';
    const speed=document.createElement('select');speed.setAttribute('aria-label','낭독 속도');
    [0.8,0.9,1,1.1,1.2,1.3].forEach(v=>{const o=document.createElement('option');o.value=String(v);o.textContent=v.toFixed(1)+'배';if(v===1)o.selected=true;speed.appendChild(o);});
    speedLabel.appendChild(speed);actions.appendChild(speedLabel);
    const voiceLabel=document.createElement('label');voiceLabel.textContent='음성 ';
    const voiceSelect=document.createElement('select');voiceSelect.setAttribute('aria-label','한국어 음성 선택');
    voiceLabel.appendChild(voiceSelect);actions.appendChild(voiceLabel);
    let voices=[];
    function updateVoices(){const prior=voiceSelect.value;voices=synth.getVoices().filter(v=>/^ko(?:[-_]|$)/i.test(v.lang));voiceSelect.replaceChildren();const auto=document.createElement('option');auto.value='';auto.textContent='한국어 자동';voiceSelect.appendChild(auto);voices.forEach((v,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=v.name;voiceSelect.appendChild(o);});if([...voiceSelect.options].some(o=>o.value===prior))voiceSelect.value=prior;}
    updateVoices();if(synth.addEventListener)synth.addEventListener('voiceschanged',updateVoices);

    const headers=[...root.querySelectorAll('h3')];
    // 낭독할 텍스트를 현재 화면 DOM에서 읽습니다. 별도 수기 원고를 유지하지 않습니다.
    function sectionsNow(){
      const sections=[];let current=null;
      root.querySelectorAll('h3,p,li').forEach(node=>{
        if(node.closest('.sermon07-sync,.sermon-tts-panel,.sermon-tts-section'))return;
        if(node.matches('h3')){current={title:node.textContent.replace(/\s+/g,' ').trim(),texts:[]};sections.push(current);return;}
        if(!current||node.closest('button,.sermon-read-control,.sermon07-sync'))return;
        if(node.matches('p')&&node.closest('li'))return; // 중첩 중복 방지
        if(node.matches('li')&&node.closest('li li'))return;
        const t=(node.textContent||'').replace(/\s+/g,' ').trim();if(t)current.texts.push(t);
      });
      return sections;
    }
    function chunks(t){
      const sentences=String(t).replace(/([.!?。！？]+[”"’']?)(\s+|$)/g,'$1\u241e').split('\u241e').map(s=>s.trim()).filter(Boolean);
      const out=[];
      sentences.forEach(sentence=>{while(sentence.length>155){let at=sentence.lastIndexOf(' ',155);if(at<75)at=155;out.push(sentence.slice(0,at).trim());sentence=sentence.slice(at).trim();}if(sentence)out.push(sentence);});
      return out;
    }
    let generation=0,queue=[],cursor=0,playing=false,paused=false,active=null,currentUtterance=null;
    const sectionBtns=[];
    function paint(){allBtn.classList.toggle('active',playing&&active===-1);sectionBtns.forEach((b,i)=>b.classList.toggle('active',playing&&active===i));pauseBtn.disabled=!playing;stopBtn.disabled=!playing;pauseBtn.textContent=paused?'▶ 이어 듣기':'⏸ 일시정지';}
    function stop(message){generation++;synth.cancel();queue=[];cursor=0;playing=false;paused=false;active=null;currentUtterance=null;if(message)status.textContent=message;paint();}
    function next(token){
      if(token!==generation||!playing||paused)return;
      if(cursor>=queue.length){stop('낭독 완료');return;}
      const u=new SpeechSynthesisUtterance(queue[cursor++]);u.lang='ko-KR';u.rate=Number(speed.value)||1;
      const selected=voiceSelect.value;if(selected!==''&&voices[Number(selected)])u.voice=voices[Number(selected)];else if(voices.length)u.voice=voices.find(v=>v.localService)||voices[0];
      currentUtterance=u;
      u.onend=()=>{if(token!==generation||currentUtterance!==u)return;currentUtterance=null;setTimeout(()=>next(token),70);};
      u.onerror=e=>{if(token!==generation||currentUtterance!==u)return;if(['interrupted','canceled'].includes(e.error))return;stop('낭독 오류: 한국어 음성 설정을 확인해 주세요.');};
      try{synth.speak(u);}catch(e){stop('이 브라우저에서 음성을 재생할 수 없습니다.');}
    }
    function start(index){
      stop();const sections=sectionsNow();const chosen=index===-1?sections:[sections[index]].filter(Boolean);
      queue=chosen.flatMap(s=>[s.title,...s.texts.flatMap(chunks)]);
      if(!queue.length){status.textContent='읽을 설교 원고가 없습니다.';return;}
      cursor=0;active=index;playing=true;status.textContent=index===-1?'최신 원고 전체 낭독 중':'선택한 부분 낭독 중';paint();next(generation);
    }
    headers.forEach((heading,i)=>{
      const b=document.createElement('button');b.type='button';b.className='sermon07-section-btn';
      const label=i===0?'서론':/^\d+\./.test(heading.textContent)?heading.textContent.match(/^\d+/)[0]+'대지':heading.textContent.split(' — ')[0].trim();
      b.textContent='▶ '+label+' 듣기';b.setAttribute('aria-label',heading.textContent.trim()+' 낭독');
      heading.insertAdjacentElement('afterend',b);b.addEventListener('click',()=>start(i));sectionBtns.push(b);
    });
    allBtn.addEventListener('click',()=>start(-1));
    pauseBtn.addEventListener('click',()=>{if(!playing)return;if(paused){paused=false;synth.resume();if(!currentUtterance)next(generation);status.textContent='이어서 낭독 중';}else{paused=true;synth.pause();status.textContent='일시정지';}paint();});
    stopBtn.addEventListener('click',()=>stop('낭독 정지'));
    ['sermonReadToggle','sermonReadClose'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('click',()=>{if(root.hidden)stop('원고를 접어 낭독을 정지했습니다.');});});
    window.addEventListener('pagehide',()=>stop());
    paint();return true;
  }
  if(!initialize()){
    const observer=new MutationObserver(()=>{if(initialize())observer.disconnect();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    window.addEventListener('load',()=>{if(initialize())observer.disconnect();},{once:true});
  }
})();
