(() => {
  const LINE_KEY = 'atsumare-shimachu-line-friend';
  const ANSWER_KEY = 'atsumare-shimachu-demo';
  const isLineFriend = () => {
    try { return localStorage.getItem(LINE_KEY) === '1'; } catch { return false; }
  };
  const hasAnswered = () => {
    try { return JSON.parse(localStorage.getItem(ANSWER_KEY) || '[]').length > 0; } catch { return false; }
  };

  const style = document.createElement('style');
  style.textContent = `
    #official-line-contact{scroll-margin-top:88px}
    .official-line-contact{max-width:1120px;margin:20px auto 56px;padding:0 24px}
    .official-line-contact-card{display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center;padding:clamp(26px,5vw,44px);border-radius:24px;background:#effaf3;border:1px solid #bfe4ca;box-shadow:0 14px 42px rgba(7,87,53,.08)}
    .official-line-contact h2{margin:0 0 12px;font-size:clamp(25px,4vw,38px);color:#173f50}
    .official-line-contact p{margin:0;line-height:1.8;color:#48646d}
    .demo-line-button{display:inline-flex;align-items:center;justify-content:center;min-width:260px;padding:15px 20px;border:0;border-radius:14px;background:#06c755;color:#fff;font:inherit;font-weight:800;cursor:pointer;box-shadow:0 8px 22px rgba(6,199,85,.22)}
    .demo-line-button[disabled]{opacity:.72;cursor:default}
    .completion-line{margin-top:20px;padding:18px;border-radius:16px;background:#effaf3;border:1px solid #bfe4ca;text-align:left}
    .completion-line h4{margin:0 0 9px;color:#173f50;font-size:17px}.completion-line p{margin:5px 0;line-height:1.65}.completion-line .demo-line-button{width:100%;margin-top:12px}
    @media(max-width:720px){.official-line-contact-card{grid-template-columns:1fr}.demo-line-button{width:100%;min-width:0}}
  `;
  document.head.append(style);

  const nav = document.querySelector('#site-nav');
  const button = document.querySelector('.menu-button');

  if (nav) {
    if (!nav.querySelector('a[href="#official-line-contact"]')) {
      const lineLink = document.createElement('a');
      lineLink.href = '#official-line-contact';
      lineLink.textContent = '公式LINE・お問い合わせ';
      nav.append(lineLink);
    }
    if (!nav.querySelector('a[href="organizer/"]')) {
      const organizerLink = document.createElement('a');
      organizerLink.href = 'organizer/';
      organizerLink.textContent = '運営メンバーデモ';
      nav.append(organizerLink);
    }
  }

  if (button && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
      nav.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    };
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      nav.classList.contains('open') ? closeMenu() : openMenu();
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('click', event => {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(event.target) || button.contains(event.target)) return;
      closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  const updateLineButtons = () => {
    const added = isLineFriend();
    document.querySelectorAll('.demo-line-button').forEach(item => {
      item.textContent = added ? '公式LINE 友だち追加済み ✓' : '公式LINEを友だち追加（デモ）';
      item.disabled = added;
    });
  };

  const addLineFriend = () => {
    try { localStorage.setItem(LINE_KEY, '1'); } catch {}
    updateLineButtons();
  };

  if (!document.querySelector('#official-line-contact')) {
    const footer = document.querySelector('footer');
    const section = document.createElement('section');
    section.id = 'official-line-contact';
    section.className = 'official-line-contact demo-tools';
    section.setAttribute('aria-labelledby', 'official-line-contact-title');
    section.innerHTML = `
      <div class="official-line-contact-card">
        <div>
          <p class="section-kicker">CONTACT</p>
          <h2 id="official-line-contact-title">幹事へのご連絡はこちら</h2>
          <p>同窓会についての質問、回答内容の修正、サポーター希望などは、公式LINEから幹事へお知らせください。この公開デモでは外部通信せず、友だち追加済みの状態だけをブラウザに保存します。</p>
        </div>
        <a class="demo-line-button" href="line/">LINE風トーク画面を開く</a>
      </div>`;
    if (footer) footer.before(section);
    else document.body.append(section);
  }

  const ensureCompletionLine = () => {
    const completion = document.querySelector('#completion');
    if (!completion || completion.querySelector('.completion-line')) return;
    const guide = document.createElement('div');
    guide.className = 'completion-line';
    guide.innerHTML = `
      <h4>ご連絡・最新情報は公式LINEへ</h4>
      <p>本番では日程や会場のお知らせ、回答内容の修正、サポーター希望などを公式LINEで受け付けます。</p>
      <a class="demo-line-button" href="line/">LINE風トーク画面を開く</a>`;
    completion.append(guide);
    updateLineButtons();
  };
  ensureCompletionLine();

  const completion = document.querySelector('#completion');
  if (completion) {
    new MutationObserver(ensureCompletionLine).observe(completion, { attributes: true, attributeFilter: ['hidden'] });
  }

  const sticky = document.querySelector('#sticky-interest-cta');
  const openInterest = document.querySelector('#open-interest-search');
  const interestSection = document.querySelector('#interest');
  const finalCta = document.querySelector('#final-interest-cta');
  const updateSticky = () => {
    if (!sticky) return;
    const answered = hasAnswered();
    const visible = window.scrollY > window.innerHeight * .72;
    sticky.hidden = !visible;
    if (answered) {
      sticky.classList.add('is-line');
      sticky.innerHTML = '<span>幹事への連絡・最新情報</span><strong>公式LINEを開く →</strong>';
    } else {
      sticky.classList.remove('is-line');
      sticky.innerHTML = '<span>ちょっと興味ある？</span><strong>気持ちを回答する →</strong>';
    }
  };
  sticky?.addEventListener('click', () => {
    if (hasAnswered()) {
      document.querySelector('#official-line-contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      openInterest?.click();
      interestSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  finalCta?.querySelector('.interest-jump')?.addEventListener('click', () => {
    openInterest?.click();
    interestSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  window.addEventListener('scroll', updateSticky, { passive: true });
  window.addEventListener('storage', () => { updateLineButtons(); updateSticky(); });

  updateLineButtons();
  updateSticky();
})();
