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

  function render() {
    if (roleBadge.textContent.trim() === 'メンバー') {
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
