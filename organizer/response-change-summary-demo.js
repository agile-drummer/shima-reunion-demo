(() => {
  const KEY = 'atsumare-response-change-history';
  const seed = [
    {id:'demo-1',name:'モコ リス',className:'3組',before:'参加したい',after:'今回は欠席予定',changedAt:'8/8 17:10',assignee:'コンタ',confirmed:false},
    {id:'demo-2',name:'ペンタ ネコ',className:'3組',before:'まだわからない',after:'参加したい',changedAt:'8/8 16:42',assignee:'コンタ',confirmed:true},
  ];
  const card = document.getElementById('responseChangeSummaryCard');
  const count = document.getElementById('responseChangeSummaryCount');
  const list = document.getElementById('responseChangeSummaryList');
  const roleBadge = document.getElementById('roleBadge');
  if (!card || !count || !list || !roleBadge) return;

  const mask = name => String(name || '').split(' ').map(x => x.slice(0, 1) + '＊'.repeat(Math.max(1, x.length - 1))).join(' ');
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || seed; } catch { return seed; } };

  const rolloutCard = document.createElement('section');
  rolloutCard.id = 'rolloutQuickLinks';
  rolloutCard.className = 'card';
  rolloutCard.innerHTML = `
    <div class="change-summary-head"><div><p class="eyebrow">PHASE 1 ROLLOUT</p><h2>一次打診の準備</h2></div></div>
    <p class="person-summary">本番と同じ順番で、通知・実機確認・少人数テストの状態を確認できます。</p>
    <a class="change-all" href="rollout-dashboard/">一次打診 Rollout Dashboard →</a>
    <a class="change-all" href="rollout/">実機E2Eを確認 →</a>
    <a class="change-all" href="notification-readiness/">LINE通知 readiness →</a>`;
  card.insertAdjacentElement('afterend', rolloutCard);

  function render() {
    const isMember = roleBadge.textContent.trim() === 'メンバー';
    rolloutCard.hidden = isMember;
    if (isMember) {
      card.hidden = true;
      return;
    }
    const items = read();
    count.textContent = String(items.filter(item => !item.confirmed).length);
    list.innerHTML = items.slice(0, 3).map(item => `<article class="change-mini"><div><strong>${mask(item.name)}</strong> <span>${item.className}</span></div><small>${item.changedAt} ／ ${item.confirmed ? '確認済み' : '未確認'}</small><p>${item.before} → ${item.after}</p></article>`).join('');
    card.hidden = false;
  }

  render();
  new MutationObserver(render).observe(roleBadge, { childList: true, subtree: true });
})();
