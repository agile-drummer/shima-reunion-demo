(() => {
  const ANSWER_KEY='atsumare-shimachu-demo';
  const CURRENT_KEY='atsumare-shimachu-demo-current-id';
  const labels=new Map([
    ['参加したい','🙌 参加したい'],
    ['都合が合えば','🤔 予定が合えば行きたい'],
    ['欠席予定','🙏 今回はむずかしそう'],
    ['まだわからない','🌱 まだわからない'],
  ]);
  const read=()=>{try{return JSON.parse(localStorage.getItem(ANSWER_KEY)||'[]')}catch{return[]}};
  const write=rows=>localStorage.setItem(ANSWER_KEY,JSON.stringify(rows));
  const currentId=()=>localStorage.getItem(CURRENT_KEY)||read().at(-1)?.id||'';
  const latest=()=>{const id=currentId();return [...read()].reverse().find(row=>row.id===id)||null};

  const style=document.createElement('style');style.textContent=`
    .demo-my-page{max-width:920px;margin:0 auto 70px;padding:0 24px}.demo-my-page[hidden]{display:none}
    .demo-my-page-card{padding:clamp(24px,5vw,42px);border:1px solid #c9e2df;border-radius:24px;background:linear-gradient(145deg,#f0faf7,#fff);box-shadow:0 16px 46px rgba(7,51,74,.08)}
    .demo-my-page h2{margin:0 0 8px;color:#07334a}.demo-current{padding:20px;border-radius:16px;background:#fff;border:1px solid #dceae8}.demo-current strong{display:block;font-size:22px;color:#075b64}.demo-current small{color:#60747b}
    .demo-intents{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:18px}.demo-intent{min-height:58px;padding:12px;border:1.5px solid #bdd5dc;border-radius:13px;background:#fff;font:inherit;font-weight:700;cursor:pointer}.demo-intent.is-current{border-color:#087f8c;background:#e6f7f6;color:#075b64}.demo-update-message{min-height:26px;margin:12px 0;color:#287765;font-weight:700}.demo-note{font-size:13px;color:#60747b}@media(max-width:620px){.demo-intents{grid-template-columns:1fr}}
  `;document.head.append(style);

  const interest=document.querySelector('#interest');if(!interest)return;
  const section=document.createElement('section');section.id='my-page';section.className='demo-my-page';section.hidden=true;
  section.innerHTML=`<div class="demo-my-page-card"><p class="section-kicker">MY PAGE DEMO</p><h2>あなたの回答</h2><p>予定が変わったら、ここから自分で変更できます。</p><div class="demo-current"><span>現在の回答</span><strong id="demo-current-intent"></strong><small id="demo-current-at"></small></div><div id="demo-intents" class="demo-intents"></div><p id="demo-update-message" class="demo-update-message" role="status"></p><p class="demo-note">変更すると幹事側の集計にも反映される想定です。幹事への個別連絡は不要です。</p></div>`;
  interest.insertAdjacentElement('afterend',section);
  const currentIntent=section.querySelector('#demo-current-intent'),currentAt=section.querySelector('#demo-current-at'),buttons=section.querySelector('#demo-intents'),message=section.querySelector('#demo-update-message');

  function render(scroll=false){const row=latest();if(!row){section.hidden=true;return}section.hidden=false;currentIntent.textContent=labels.get(row.intent)||row.intent;currentAt.textContent=row.at?`最終更新 ${new Date(row.at).toLocaleString('ja-JP')}`:'';buttons.replaceChildren();for(const [intent,label] of labels){const b=document.createElement('button');b.type='button';b.className='demo-intent'+(row.intent===intent?' is-current':'');b.textContent=label;b.disabled=row.intent===intent;b.addEventListener('click',()=>update(intent));buttons.append(b)}if(scroll)section.scrollIntoView({behavior:'smooth',block:'start'})}
  function update(intent){const id=currentId(),rows=read(),now=new Date().toISOString();const filtered=rows.filter(row=>row.id!==id);filtered.push({id,intent,at:now});write(filtered);render();message.textContent='回答を更新しました。幹事への個別連絡は不要です ✓'}

  const completion=document.querySelector('#completion');
  if(completion){new MutationObserver(()=>{if(!completion.hidden){const row=read().at(-1);if(row?.id)localStorage.setItem(CURRENT_KEY,row.id);render()}}).observe(completion,{attributes:true,attributeFilter:['hidden']})}
  if(latest())render();
})();
