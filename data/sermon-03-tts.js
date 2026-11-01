/* 제1·2·3회 설교 원고: 전체/소제목별 한국어 음성 낭독
 * Web Speech API (SpeechSynthesis) / 서버, API 키, MP3 불필요.
 * 기존 확정 원고는 변경하지 않음. 제4회 이후와 제51회 초안에는 동작하지 않음.
 */
(function () {
  'use strict';

  const sermonNumber = Number(new URLSearchParams(window.location.search).get('sermon'));
  if (![1, 2, 3].includes(sermonNumber)) return;

  const root = document.getElementById('sermonFullText');
  if (!root || root.dataset.ttsReady === 'yes') return;
  root.dataset.ttsReady = 'yes';

  const nativeTTS = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const synthesis = nativeTTS ? window.speechSynthesis : null;
  const headings = Array.from(root.querySelectorAll('h3'));
  if (!headings.length) return;

  // 읽을 문단은 제목 다음부터 다음 제목 직전까지입니다. 원고 HTML은 수정하지 않습니다.
  const sections = headings.map(function (heading, index) {
    const paragraphs = [];
    let node = heading.nextElementSibling;
    while (node && node.tagName !== 'H3' && !node.classList.contains('sermon-read-bottom')) {
      if (node.matches('p,li,blockquote')) {
        const value = (node.textContent || '').replace(/\s+/g, ' ').trim();
        if (value) paragraphs.push(value);
      } else if (node.matches('div,section')) {
        node.querySelectorAll('p,li,blockquote').forEach(function (child) {
          const value = (child.textContent || '').replace(/\s+/g, ' ').trim();
          if (value) paragraphs.push(value);
        });
      }
      node = node.nextElementSibling;
    }
    const title = (heading.textContent || '').replace(/\s+/g, ' ').trim();
    const shortLabel = index === 0 ? '도입' : /^\d+\./.test(title)
      ? title.match(/^\d+/)[0] + '대지' : title.split(' — ')[0];
    return { heading: heading, title: title, shortLabel: shortLabel, paragraphs: paragraphs };
  });

  // 단락별로 150자 안팎으로 자릅니다. 긴 한국어 원고에서 브라우저 TTS가 중단되는 현상을 줄입니다.
  function segment(text) {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return [];
    const sentenceBreaks = clean.replace(/([.!?。！？]+[”"’']?)(\s+|$)/g, '$1\u241e');
    const sentences = sentenceBreaks.split('\u241e').map(function (s) { return s.trim(); }).filter(Boolean);
    const result = [];
    const LIMIT = 155;
    sentences.forEach(function (sentence) {
      let remaining = sentence;
      while (remaining.length > LIMIT) {
        let split = remaining.lastIndexOf(' ', LIMIT);
        if (split < 75) split = LIMIT;
        result.push(remaining.slice(0, split).trim());
        remaining = remaining.slice(split).trim();
      }
      if (remaining) result.push(remaining);
    });
    return result;
  }

  const css = document.createElement('style');
  css.id = 'sermon03-tts-styles';
  css.textContent = `
    .sermon-tts-panel {margin:4px 0 25px;padding:14px 16px;border:1px solid #c8ddd2;border-radius:12px;background:#f5faf7;color:#24483e}
    .sermon-tts-panel-heading {margin:0 0 9px!important;color:#245346;font-size:15px;font-weight:800}
    .sermon-tts-actions {display:flex;flex-wrap:wrap;gap:8px;align-items:center}
    .sermon-tts-btn {appearance:none;border:1px solid #90b7a8;border-radius:8px;padding:9px 13px;background:#fff;color:#20584b;font:700 14px/1.45 system-ui,-apple-system,"Noto Sans KR",sans-serif;cursor:pointer;touch-action:manipulation}
    .sermon-tts-btn:hover,.sermon-tts-btn:focus-visible {background:#e6f3ec;outline-offset:2px}
    .sermon-tts-btn.sermon-tts-full {background:#196e5b;color:#fff;border-color:#196e5b;font-weight:800}
    .sermon-tts-btn.sermon-tts-full:hover,.sermon-tts-btn.sermon-tts-full:focus-visible {background:#11513f}
    .sermon-tts-btn:disabled {opacity:.45;cursor:not-allowed}
    .sermon-tts-btn.is-active {background:#196e5b;border-color:#196e5b;color:white}
    .sermon-tts-select {background:white;border:1px solid #90b7a8;border-radius:7px;padding:7px;color:#20584b;font-size:14px}
    .sermon-tts-speed {display:inline-flex;align-items:center;gap:6px;color:#326557;font-size:13px;font-weight:700}
    /* 낭독 상태는 보조기기용이며 화면에는 표시하지 않습니다. */
    .sermon-tts-status {position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
    .sermon-tts-section {display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin:-4px 0 17px}
    .sermon-tts-section .sermon-tts-btn {font-size:13px;padding:7px 12px}
    @media (max-width:700px) {.sermon-tts-panel {padding:13px 12px}.sermon-tts-btn {font-size:13px;padding:9px 11px}.sermon-tts-section {margin-top:-5px}}
  `;
  document.head.appendChild(css);

  const panel = document.createElement('div');
  panel.className = 'sermon-tts-panel';
  panel.setAttribute('aria-label', '제' + sermonNumber + '회 설교 음성 낭독');
  const headingText = document.createElement('div');
  headingText.className = 'sermon-tts-panel-heading';
  headingText.textContent = '설교 원고 음성 듣기';
  panel.appendChild(headingText);

  const actions = document.createElement('div');
  actions.className = 'sermon-tts-actions';
  // 원고 낭독 컨트롤의 첫 번째 버튼: 처음부터 결론까지 6개 부분 전체듣기.
  const fullButton = document.createElement('button');
  fullButton.type = 'button';
  fullButton.className = 'sermon-tts-btn sermon-tts-full';
  fullButton.textContent = '전체듣기';
  fullButton.setAttribute('aria-label', '제' + sermonNumber + '회 설교 원고 전체듣기');
  fullButton.setAttribute('aria-pressed', 'false');
  fullButton.disabled = !nativeTTS;
  actions.appendChild(fullButton);
  const pauseButton = document.createElement('button');
  pauseButton.type = 'button';
  pauseButton.className = 'sermon-tts-btn';
  pauseButton.textContent = '⏸ 일시정지';
  pauseButton.disabled = true;
  const stopButton = document.createElement('button');
  stopButton.type = 'button';
  stopButton.className = 'sermon-tts-btn';
  stopButton.textContent = '■ 정지';
  stopButton.disabled = true;
  actions.appendChild(pauseButton);
  actions.appendChild(stopButton);

  const speedWrap = document.createElement('label');
  speedWrap.className = 'sermon-tts-speed';
  speedWrap.textContent = '낭독 속도';
  const speedSelect = document.createElement('select');
  speedSelect.className = 'sermon-tts-select';
  speedSelect.setAttribute('aria-label', '낭독 속도');
  [0.8, 0.9, 1, 1.1, 1.2, 1.3].forEach(function (v) {
    const option = document.createElement('option');
    option.value = String(v);
    option.textContent = v.toFixed(1) + '배';
    if (v === 1) option.selected = true;
    speedSelect.appendChild(option);
  });
  speedWrap.appendChild(speedSelect);
  actions.appendChild(speedWrap);
  panel.appendChild(actions);

  const status = document.createElement('p');
  status.className = 'sermon-tts-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.textContent = nativeTTS ? '음성 듣기 준비' : '이 브라우저는 음성 합성을 지원하지 않습니다.';
  panel.appendChild(status);
  root.insertBefore(panel, headings[0]);

  const ALL_SECTIONS = sections.length; // 소제목 인덱스와 구분하는 전체듣기 모드
  let activeIndex = -1;
  let activeButton = null;
  let currentUtterance = null;
  let queue = [];
  let pointer = 0;
  let paused = false;
  let generation = 0;
  const buttons = [];

  sections.forEach(function (section, index) {
    const row = document.createElement('div');
    row.className = 'sermon-tts-section';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sermon-tts-btn sermon-tts-play';
    button.textContent = '▶ ' + section.shortLabel + ' 듣기';
    button.setAttribute('aria-label', section.title + ' 낭독 시작');
    button.disabled = !nativeTTS || section.paragraphs.length === 0;
    button.addEventListener('click', function () { startSection(index); });
    row.appendChild(button);
    section.heading.insertAdjacentElement('afterend', row);
    buttons.push(button);
  });

  function chooseKoreanVoice() {
    if (!nativeTTS) return null;
    const list = synthesis.getVoices();
    const korean = list.filter(function (v) { return /^ko([_-]|$)/i.test(v.lang); });
    return korean.find(function (v) { return v.localService && /premium|enhanced|yuna|sora|유나/i.test(v.name); }) ||
      korean.find(function (v) { return v.localService; }) || korean[0] || null;
  }
  if (nativeTTS) {
    if (typeof synthesis.addEventListener === 'function') synthesis.addEventListener('voiceschanged', chooseKoreanVoice);
    synthesis.getVoices();
  }

  function activeLabel() {
    return activeIndex === ALL_SECTIONS ? '전체 원고' : activeIndex >= 0 ? sections[activeIndex].shortLabel : '';
  }

  function updateButtons() {
    const playingAll = activeIndex === ALL_SECTIONS;
    fullButton.classList.toggle('is-active', playingAll);
    fullButton.setAttribute('aria-pressed', String(playingAll));
    buttons.forEach(function (button, index) {
      const selected = index === activeIndex;
      button.classList.toggle('is-active', selected);
      button.textContent = selected ? '↺ ' + sections[index].shortLabel + ' 처음부터' : '▶ ' + sections[index].shortLabel + ' 듣기';
      button.setAttribute('aria-pressed', String(selected));
    });
    pauseButton.disabled = activeIndex === -1;
    stopButton.disabled = activeIndex === -1;
    pauseButton.textContent = paused ? '▶ 이어 듣기' : '⏸ 일시정지';
  }

  function clearPlayback(message) {
    generation++;
    activeIndex = -1;
    activeButton = null;
    currentUtterance = null;
    queue = [];
    pointer = 0;
    paused = false;
    if (nativeTTS) synthesis.cancel();
    if (message) status.textContent = message;
    updateButtons();
  }

  function speakNext(token) {
    if (token !== generation || activeIndex < 0 || paused) return;
    if (pointer >= queue.length) {
      const label = activeLabel();
      clearPlayback(label + ' 완료');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(queue[pointer++]);
    utterance.lang = 'ko-KR';
    utterance.rate = Number(speedSelect.value) || 1;
    utterance.pitch = 1;
    const voice = chooseKoreanVoice();
    if (voice) utterance.voice = voice;
    currentUtterance = utterance;
    utterance.onend = function () {
      if (token !== generation || currentUtterance !== utterance) return;
      currentUtterance = null;
      // 일부 모바일 브라우저는 다음 문장을 즉시 예약할 경우 누락하므로 짧은 간격을 둡니다.
      window.setTimeout(function () { speakNext(token); }, 60);
    };
    utterance.onerror = function (event) {
      if (token !== generation || currentUtterance !== utterance) return;
      if (event.error === 'canceled' || event.error === 'interrupted') return;
      clearPlayback('음성 재생을 시작하지 못했습니다. 기기에 한국어 음성이 있는지 확인해 주세요.');
    };
    try { synthesis.speak(utterance); }
    catch (error) { clearPlayback('이 브라우저에서 음성 재생을 시작할 수 없습니다.'); }
  }

  function startAll() {
    if (!nativeTTS) return;
    clearPlayback();
    // 모든 소제목과 그 아래 원고를 순서대로 한 번씩만 읽습니다.
    queue = [];
    sections.forEach(function (section) {
      queue.push(section.title);
      section.paragraphs.forEach(function (text) {
        queue.push.apply(queue, segment(text));
      });
    });
    if (!queue.length) {
      status.textContent = '읽을 원고가 없습니다.';
      return;
    }
    pointer = 0;
    activeIndex = ALL_SECTIONS;
    paused = false;
    status.textContent = '전체 원고 재생 중';
    updateButtons();
    speakNext(generation);
  }
  fullButton.addEventListener('click', startAll);

  function startSection(index) {
    if (!nativeTTS || index < 0 || index >= sections.length) return;
    clearPlayback();
    const section = sections[index];
    // 제목을 먼저 읽은 다음 선택한 대지의 실제 원고만 낭독합니다.
    queue = [section.title];
    section.paragraphs.forEach(function (text) { queue.push.apply(queue, segment(text)); });
    pointer = 0;
    activeIndex = index;
    activeButton = buttons[index];
    paused = false;
    status.textContent = section.shortLabel + ' 재생 중';
    updateButtons();
    speakNext(generation);
  }

  pauseButton.addEventListener('click', function () {
    if (!nativeTTS || activeIndex < 0) return;
    if (paused) {
      paused = false;
      synthesis.resume();
      status.textContent = activeLabel() + ' 다시 재생 중';
      if (!currentUtterance) speakNext(generation);
    } else {
      paused = true;
      synthesis.pause();
      status.textContent = activeLabel() + ' 일시정지';
    }
    updateButtons();
  });
  stopButton.addEventListener('click', function () { clearPlayback('음성 정지'); });

  // 원고가 접혀 낭독 위치가 보이지 않게 되면 자동 정지합니다.
  const readToggle = document.getElementById('sermonReadToggle');
  const readClose = document.getElementById('sermonReadClose');
  function stopIfHidden() { if (root.hidden) clearPlayback('원고 접힘, 음성 정지'); }
  if (readToggle) readToggle.addEventListener('click', stopIfHidden);
  if (readClose) readClose.addEventListener('click', stopIfHidden);
  window.addEventListener('pagehide', function () { clearPlayback(); });
  updateButtons();
})();
