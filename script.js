const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];

// Public demo only: all names, schools and responses below are fictional.
document.title='あつまれ島中学校｜同窓会デモ';
document.body.classList.add('island-demo');

const textReplacements=new Map([
  ['糸島に、おかえり。','島に、おかえり。'],
  ['SHIMA JUNIOR HIGH SCHOOL REUNION','ATSUMARE SHIMA JUNIOR HIGH REUNION'],
  ['糸島に、おかえり。\nただいま、志摩中。','島に、おかえり。\nあつまれ、島中学校。'],
  ['ただいま、志摩中。','あつまれ、島中学校。'],
  ['糸島の今','島のくらし'],
  ['大人になった今、\n糸島の良さを再発見。','大人になった今、\n島の思い出を再発見。'],
  ['懐かしい場所、新しくできたお店、変わっていく風景。再会だけでなく、糸島の今とこれからも一緒に楽しみませんか。','浜辺、森、商店街、放課後の校庭。島で過ごした時間を、のんびり思い出してみませんか。'],
  ['ITOSHIMA, FUKUOKA','ATSUMARE ISLAND'],
  ['志摩中同窓会 2026–2027 幹事会','あつまれ島中学校 同窓会デモ運営局'],
]);
$$('h1,h2,h3,p,a,small,strong,span,dd').forEach(el=>{
  const normalized=el.textContent.trim();
  for(const [from,to] of textReplacements){
    if(normalized===from){
      if(to.includes('\n')) el.innerHTML=to.replace('\n','<br>');
      else el.textContent=to;
    }
  }
});

const brand=$('.brand'); if(brand) brand.textContent='あつまれ島中学校';
const heroTitle=$('.hero h1'); if(heroTitle) heroTitle.innerHTML='島に、おかえり。<br>あつまれ、島中学校。';
const eyebrow=$('.eyebrow'); if(eyebrow) eyebrow.textContent='ATSUMARE SHIMA JUNIOR HIGH REUNION';
const location=$('.location'); if(location) location.textContent='ATSUMARE ISLAND';

// Add demo notice and original island residents.
const notice=document.createElement('div');
notice.className='demo-ribbon';
notice.textContent='🌴 公開デモ：登場人物・学校名・回答データはすべて架空です';
document.body.prepend(notice);

const team=$('.organizer-team-grid');
if(team){
  const residents=[
    {icon:'🐿️',school:'どんぐり小',name:'モコ',role:'島内放送／おしゃべり係',comment:'久しぶりでも、すぐいつもの空気に戻れるよ〜。'},
    {icon:'🐧',school:'しおかぜ小',name:'ペンタ',role:'会場づくり／氷菓担当',comment:'会場は涼しく、気持ちはあったかく。'},
    {icon:'🦊',school:'こもれび小',name:'コンタ',role:'島のIT係／サイト番',comment:'名簿は安全に、思い出は楽しく守ります。'},
  ];
  team.innerHTML=residents.map(r=>`<article class="team-member island-resident"><div class="resident-avatar" aria-hidden="true">${r.icon}</div><div><p class="team-school">${r.school}</p><h3>${r.name}</h3><p class="team-role">${r.role}</p><p class="team-comment">${r.comment}</p></div></article>`).join('');
}
const organizerName=$('.organizer-name');
if(organizerName) organizerName.innerHTML='<strong>しま長 ポンきち</strong><span>どんぐり小・島中つり部・案内所勤務</span>';
const organizerImage=$('.organizer-photo-placeholder');
if(organizerImage) organizerImage.innerHTML='<div class="resident-avatar resident-avatar-large" aria-label="しま長ポンきちの架空キャラクター">🦝</div>';

// Fictional roster with cozy island-game-inspired original residents.
const roster=[
  {id:'D0001',name:'モコ',icon:'🐿️',school:'どんぐり小',classroom:'1組',teacher:'フクロウ先生'},
  {id:'D0002',name:'ペンタ',icon:'🐧',school:'しおかぜ小',classroom:'2組',teacher:'カモメ先生'},
  {id:'D0003',name:'コンタ',icon:'🦊',school:'こもれび小',classroom:'3組',teacher:'ヤギ先生'},
  {id:'D0004',name:'ミミ',icon:'🐰',school:'どんぐり小',classroom:'1組',teacher:'フクロウ先生'},
  {id:'D0005',name:'クルミ',icon:'🐻',school:'しおかぜ小',classroom:'2組',teacher:'カモメ先生'},
  {id:'D0006',name:'ナギ',icon:'🐱',school:'こもれび小',classroom:'3組',teacher:'ヤギ先生'},
];
const schoolSelect=$('#school');
if(schoolSelect) schoolSelect.innerHTML='<option value="">選んでください</option><option selected>どんぐり小</option><option>しおかぜ小</option><option>こもれび小</option>';
const classTeacher=$('#class-teacher');
if(classTeacher) classTeacher.innerHTML='<option value="">選んでください</option><option value="1組|フクロウ先生" selected>1組｜フクロウ先生</option><option value="2組|カモメ先生">2組｜カモメ先生</option><option value="3組|ヤギ先生">3組｜ヤギ先生</option>';
const nameQuery=$('#name-query'); if(nameQuery){nameQuery.value='モ';nameQuery.placeholder='例：モ、ペンタ';}

const button=$('.menu-button'),nav=$('#site-nav');
button?.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));nav?.classList.toggle('open',!open)});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');button?.setAttribute('aria-expanded','false')}));

const openButton=$('#open-interest-search'),panel=$('#interest-prototype'),searchForm=$('#person-search-form'),intentForm=$('#intent-form'),message=$('#form-message'),candidateArea=$('#candidate-area'),candidateList=$('#candidate-list'),selectedPerson=$('#selected-person'),completion=$('#completion');
let selected=null;
function setMessage(text,type='info'){if(!message)return;message.textContent=text;message.className=`form-message ${type}`;}
function resetFlow(){selected=null;if(intentForm)intentForm.hidden=true;if(completion)completion.hidden=true;if(candidateArea)candidateArea.hidden=true;if(searchForm)searchForm.hidden=false;setMessage('');}
openButton?.addEventListener('click',()=>{panel.hidden=false;openButton.hidden=true;panel.scrollIntoView({behavior:'smooth',block:'start'});});
searchForm?.addEventListener('submit',event=>{
  event.preventDefault();
  const school=schoolSelect.value,[classroom,teacher]=classTeacher.value.split('|'),query=nameQuery.value.trim();
  const matches=roster.filter(p=>p.school===school&&p.classroom===classroom&&p.teacher===teacher&&p.name.includes(query)).slice(0,3);
  candidateList.replaceChildren(); if(intentForm)intentForm.hidden=true;
  if(!matches.length){candidateArea.hidden=true;setMessage('島の名簿では見つかりませんでした。選択内容を確認してね。','error');return;}
  matches.forEach(person=>{const candidate=document.createElement('button');candidate.type='button';candidate.className='candidate island-candidate';candidate.innerHTML=`<span class="candidate-icon">${person.icon}</span><strong>${person.name}</strong><span>${person.school}・${person.classroom}・${person.teacher}</span>`;candidate.addEventListener('click',()=>{selected=person;selectedPerson.textContent=`${person.icon} ${person.name}・${person.classroom}・${person.teacher}`;candidateArea.hidden=true;intentForm.hidden=false;setMessage('見つかった！ 今の気持ちを教えてね。','success');});candidateList.append(candidate);});
  candidateArea.hidden=false;setMessage(`${matches.length}人の島民が見つかりました。`,'success');
});
intentForm?.addEventListener('submit',event=>{event.preventDefault();if(!selected)return;const intent=new FormData(intentForm).get('intent');if(!intent||!$('#privacy-agreement').checked)return;const saved=JSON.parse(localStorage.getItem('atsumare-shimachu-demo')||'[]');saved.push({personId:selected.id,intent,at:new Date().toISOString()});localStorage.setItem('atsumare-shimachu-demo',JSON.stringify(saved));intentForm.hidden=true;searchForm.hidden=true;completion.hidden=false;setMessage('');$('#completion-message').textContent=`${selected.icon} ${selected.name}さんの「${intent}」を、島の案内所で受け付けました。`;});
$('#back-to-search')?.addEventListener('click',resetFlow);

// Slideshow.
const gallery=$('.hero-gallery'),slides=$$('.photo',gallery),dots=$('.gallery-dots');let index=0,timer;
if(slides.length>1&&dots){const show=i=>{slides[index].classList.remove('is-active');dots.children[index]?.classList.remove('is-active');index=(i+slides.length)%slides.length;slides[index].classList.add('is-active');dots.children[index]?.classList.add('is-active');};slides.forEach((_,i)=>{const dot=document.createElement('button');dot.className='gallery-dot'+(i===0?' is-active':'');dot.type='button';dot.setAttribute('aria-label',`${i+1}枚目`);dot.addEventListener('click',()=>{show(i);clearInterval(timer);timer=setInterval(()=>show(index+1),4500)});dots.append(dot)});$('.gallery-prev')?.addEventListener('click',()=>show(index-1));$('.gallery-next')?.addEventListener('click',()=>show(index+1));timer=setInterval(()=>show(index+1),4500);}

// Cozy original island-game visual language. No official characters or assets are used.
const style=document.createElement('style');
style.textContent=`
:root{--island-green:#79b95a;--island-leaf:#4c8f4f;--island-sand:#fff1bd;--island-sky:#9eddf2;--island-wood:#a97145;--island-ink:#4c4a3f}
body.island-demo{color:var(--island-ink);background:linear-gradient(#bcecff 0 8%,#fff9dc 28%,#f7f2d8 100%);font-family:"Klee One","Noto Sans JP",sans-serif}
.demo-ribbon{position:sticky;top:0;z-index:1000;text-align:center;padding:7px 12px;background:#fff0a8;color:#65572c;font-size:12px;font-weight:700;border-bottom:2px dashed #d7bd55}
.site-header{top:34px}.brand,.hero h1,.section-shell h2{color:#396f48}.hero:before{content:'☁️　　☁️';position:absolute;top:115px;right:8%;font-size:36px;opacity:.8}.hero:after{content:'🌴';border:0;width:auto;height:auto;font-size:150px;right:0;bottom:0;opacity:.25}.eyebrow,.section-kicker{color:#dd7959}.button.primary{background:#f08b67;border:3px solid #fff;border-radius:999px;box-shadow:0 6px 0 #c9684a,0 12px 24px #725b3830}.text-link{background:#fff8cf;border:2px solid #d9bd69;border-radius:999px;padding:9px 22px}.date-card{background:#fff6c9;border:3px solid #b78b52;border-radius:18px;transform:rotate(-1deg)}
.postcard-stack,.interest-prototype,.organizer-message-card,.team-member,.facts>div,.safety-list p{border-radius:24px!important;border:3px solid #ffffff!important;box-shadow:0 7px 0 #b8d6a8,0 15px 30px #526b4930!important}.notice{background:#e8f6d9}.itoshima{background:linear-gradient(145deg,#6fc6d8,#58a967)}.coming-soon-board{background:#79583d!important;border:8px solid #a77a4c!important}.schedule time{display:inline-grid;place-items:center;background:#fff0a8;border-radius:50%;width:74px;height:74px;color:#7f6534}.safety{background:#dff4cf}
.resident-avatar{display:grid;place-items:center;width:92px;height:92px;border-radius:50%;background:linear-gradient(#fff4b9,#ffd68a);font-size:54px;border:4px solid white;box-shadow:0 5px 0 #caa966}.resident-avatar-large{width:190px;height:190px;font-size:116px;margin:auto}.island-resident{background:#fffaf0!important}.candidate-icon{font-size:32px}.island-candidate{justify-content:flex-start}.island-candidate span:last-child{margin-left:auto}.gallery-dot{width:10px;height:10px;border:0;border-radius:50%;background:#d7cf9c}.gallery-dot.is-active{background:#ef8d68;transform:scale(1.35)}
footer{background:#477f58}.footer-copy span:first-child{display:none}
@media(max-width:900px){.site-header{top:34px}.resident-avatar-large{width:130px;height:130px;font-size:78px}.island-candidate{display:grid;grid-template-columns:auto 1fr}.island-candidate span:last-child{grid-column:1/-1;margin:0}.hero:after{font-size:90px}}
`;
document.head.append(style);
