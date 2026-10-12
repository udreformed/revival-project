/*
 * 부흥 프로젝트 도서 카드 연결: 제임스 뷰캐넌
 * 기존 도서 카드, 표지, 다른 책의 링크를 수정하지 않습니다.
 * index.html의 기존 스크립트 다음에 로드하세요.
 */
(() => {
  'use strict';
  const TARGET = 'buchanan-holy-spirit-summary.html';
  const books = document.getElementById('books') || document.querySelector('#library .books');
  if (!books) return;

  const isTarget = card => {
    const label = (card.textContent || '').replace(/\s+/g, ' ');
    const hasName = /뷰캐넌|뷰캐년|Buchanan|James Buchanan/i.test(label);
    const hasTitle = /성령의\s*사역|회심과\s*부흥|성령과\s*회심/.test(label);
    return (hasName && hasTitle) || (hasName && !/로이드|에드워즈|이안\s*머리/.test(label) && /성령/.test(label));
  };

  function linkCard(card) {
    if (!card || card.dataset.buchananLinked === '1') return;
    card.dataset.buchananLinked = '1';
    card.classList.add('buchanan-linked-card');

    // Keep current content (including any cover and independent links) intact.
    const existing = [...card.querySelectorAll('a[href]')].find(a =>
      /전체\s*(상세\s*)?요약\s*읽기|상세\s*요약|본문\s*읽기/.test(a.textContent || '')
    );
    if (card.tagName.toLowerCase() === 'a') {
      card.href = TARGET;
      if (!existing) {
        const label = document.createElement('span');
        label.className = 'buchanan-summary-link';
        label.textContent = '전체 상세 요약 읽기 →';
        card.appendChild(label);
      }
    } else if (existing) {
      existing.href = TARGET;
      existing.classList.add('buchanan-summary-link');
    } else {
      const a = document.createElement('a');
      a.href = TARGET;
      a.className = 'buchanan-summary-link';
      a.textContent = '전체 상세 요약 읽기 →';
      a.setAttribute('aria-label', '제임스 뷰캐넌 성령의 사역, 회심과 부흥 전체 상세 요약 읽기');
      card.appendChild(a);
    }

    // A pre-existing card-level anchor already provides entire-card navigation.
    if (card.tagName.toLowerCase() !== 'a') {
      card.setAttribute('role', 'link');
      if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
      card.setAttribute('aria-label', '제임스 뷰캐넌, 성령의 사역, 회심과 부흥 전체 상세 요약');
      card.addEventListener('click', e => {
        if (e.target.closest('a,button,input,select,textarea')) return;
        window.location.href = TARGET;
      });
      card.addEventListener('keydown', e => {
        if (e.target !== card) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); window.location.href = TARGET;
        }
      });
    } else {
      card.href = TARGET;
    }
  }

  function attach() {
    const cards = [...books.querySelectorAll('.book, article, a.book-history')];
    cards.filter(isTarget).forEach(linkCard);
    return cards.some(card => card.dataset.buchananLinked === '1');
  }
  const css = document.createElement('style');
  css.textContent = `
    .buchanan-linked-card {cursor:pointer;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}
    .buchanan-linked-card:hover,.buchanan-linked-card:focus-visible {transform:translateY(-4px);box-shadow:0 12px 25px #214d491a;border-color:#81b19d}
    .buchanan-summary-link {display:inline-block;margin-top:12px;color:#216f69;font-size:12px;font-weight:800;text-decoration:none;border-bottom:1px solid #a3c8b7}
    .buchanan-summary-link:hover,.buchanan-summary-link:focus-visible {color:#154d48;border-bottom-color:currentColor}
    @media(prefers-reduced-motion:reduce){.buchanan-linked-card{transition:none}.buchanan-linked-card:hover{transform:none}}
  `;
  document.head.appendChild(css);
  if (!attach()) {
    // Supports libraries rendered after this script executes.
    const observer = new MutationObserver(() => {if (attach()) observer.disconnect();});
    observer.observe(books, {childList:true,subtree:true});
  }
})();
