const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];

// 公開デモ用：元のデザインを保ち、固有名詞だけ架空の島設定へ変更する。
document.title='あつまれ島中学校｜同窓会デモ';

const replaceText=(selector,replacements)=>{
  $$(selector).forEach(el=>{
    let html=el.innerHTML;
    replacements.forEach(([from,to])=>{html=html.split(from).join(to)});
    el.innerHTML=html;
  });
};

const brand=$('.brand');
if(brand)brand.textContent='島に、おかえり。';
const eyebrow=$('.eyebrow');
if(eyebrow)eyebrow.textContent='ATSUMARE SHIMA JUNIOR HIGH SCHOOL REUNION';
const heroTitle=$('.hero h1');
if(heroTitle)heroTitle.innerHTML='島に、おかえり。<br>あつまれ島中学校。';
const locationLabel=$('.location');
if(locationLabel)locationLabel.textContent='DONGURI ISLAND';

replaceText('nav a,h1,h2,h3,p,dd,span,strong,a,small',[
  ['糸島市立志摩中学校','あつまれ島中学校'],
  ['志摩中学校','島中学校'],
  ['志摩中','島中学校'],
  ['糸島','島'],
  ['加也小','どんぐり小'],
  ['引津小','しおかぜ小'],
  ['桜野小','こもれび小'],
  ['山崎ヒロ','しま長 ポンきち'],
  ['山崎','ポンきち'],
  ['ナナエ','モコ'],
  ['前山','コンタ']
]);

if(brand)brand.textContent='島に、おかえり。';
if(heroTitle)heroTitle.innerHTML='島に、おかえり。<br>あつまれ島中学校。';
if(locationLabel)locationLabel.textContent='DONGURI ISLAND';

const allSlides=$$('.hero-gallery .photo');
allSlides.slice(2).forEach(slide=>slide.remove());
const gallery=$('.hero-gallery');
if(gallery)gallery.setAttribute('aria-label','島の思い出写真が自動で切り替わります');

const demoSurnames=['モコ','ペンタ','コンタ','ミミ','クルミ','ナギ','ソラ','リン','ポポ','タマ','ルル','ハル','ノア','ココ','ロロ','トト','フウ','マル','ベル','メイ','ララ','テト','ニコ','ピピ','レオ'];
const givenNames=['リス','ペンギン','キツネ','ウサギ','クマ','ネコ','イルカ','コアラ','ラッコ','パンダ','シカ','フクロウ','カモメ','ヤギ','ヒツジ','カワウソ','ハリネズミ','アザラシ','オオカミ','リャマ','トナカイ','ビーバー','モモンガ','フェネック','カピバラ'];
const classTeachers=['フクロウ先生','カモメ先生','ヤギ先生','イルカ先生'];
const demoSchools=['どんぐり小','しおかぜ小','こもれび小'];
const roster=Array.from({length:100},(_,index)=>{const classIndex=Math.floor(index/25);return{id:`D${String(index+1).padStart(3,'0')}`,surname:demoSurnames[index%25],givenName:givenNames[(index+classIndex*7)%25],school:demoSchools[index%3],classroom:`${classIndex+1}組`,teacher:classTeachers[classIndex]}});
const schoolSelect=$('#school');
if(schoolSelect)schoolSelect.innerHTML='<option value="">選んでください</option><option selected>どんぐり小</option><option>しおかぜ小</option><option>こもれび小</option><option>不明</option>';
const classTeacher=$('#class-teacher');
if(classTeacher)classTeacher.innerHTML='<option value="">選んでください</option><option value="1組|フクロウ先生" selected>1組｜フクロウ先生</option><option value="2組|カモメ先生">2組｜カモメ先生</option><option value="3組|ヤギ先生">3組｜ヤギ先生</option><option value="4組|イルカ先生">4組｜イルカ先生</option>';
const nameQuery=$('#name-query');
if(nameQuery){nameQuery.value='モ';nameQuery.placeholder='例：モ、ペンタ'}

const menuButton=$('.menu-button');const nav=$('#site-nav');
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));nav?.classList.toggle('open',!open)});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false')}));

const mask=name=>name.length<=1?'＊':`${name[0]}${'＊'.repeat(Math.max(1,name.length-2))}${name.at(-1)}`;
const openInterestSearch=$('#open-interest-search'),interestPrototype=$('#interest-prototype'),searchForm=$('#person-search-form'),intentForm=$('#intent-form'),message=$('#form-message'),candidateArea=$('#candidate-area'),candidateList=$('#candidate-list'),selectedPerson=$('#selected-person'),completion=$('#completion');let selected=null;
openInterestSearch?.addEventListener('click',()=>{interestPrototype.hidden=false;openInterestSearch.hidden=true;openInterestSearch.setAttribute('aria-expanded','true');interestPrototype.scrollIntoView({behavior:'smooth',block:'start'})});
function setMessage(text,type='info'){if(!message)return;message.textContent=text;message.className=`form-message ${type}`}
function showSearch(){selected=null;if(intentForm)intentForm.hidden=true;if(completion)completion.hidden=true;if(candidateArea)candidateArea.hidden=true;if(searchForm)searchForm.hidden=false;setMessage('')}
function selectCandidate(person){selected=person;selectedPerson.textContent=`${mask(person.surname)} ${mask(person.givenName)}・${person.classroom}・${person.teacher}`;candidateArea.hidden=true;intentForm.hidden=false;setMessage('候補を選択しました。参加意向を回答してください。','success')}
searchForm?.addEventListener('submit',event=>{event.preventDefault();const school=schoolSelect.value,[classroom,teacher]=classTeacher.value.split('|'),query=nameQuery.value.trim().replace(/\s/g,'');const matches=roster.filter(person=>person.school===school&&person.classroom===classroom&&person.teacher===teacher&&`${person.surname}${person.givenName}`.includes(query)).slice(0,3);intentForm.hidden=true;completion.hidden=true;candidateList.replaceChildren();if(!matches.length){candidateArea.hidden=true;setMessage('候補が見つかりませんでした。選択内容や名前の一部を確認してください。','error');return}matches.forEach(person=>{const candidate=document.createElement('button');candidate.type='button';candidate.className='candidate';candidate.innerHTML=`<strong>${mask(person.surname)} ${mask(person.givenName)}</strong><span>${person.school}・${person.classroom}・${person.teacher}</span>`;candidate.addEventListener('click',()=>selectCandidate(person));candidateList.append(candidate)});candidateArea.hidden=false;setMessage(`${matches.length}件の候補が見つかりました。`,'success')});
intentForm?.addEventListener('submit',event=>{event.preventDefault();if(!selected)return;const intent=new FormData(intentForm).get('intent');if(!intent||!$('#privacy-agreement').checked)return;const saved=JSON.parse(localStorage.getItem('atsumare-shimachu-demo')||'[]');saved.push({id:selected.id,intent,at:new Date().toISOString()});localStorage.setItem('atsumare-shimachu-demo',JSON.stringify(saved));intentForm.hidden=true;searchForm.hidden=true;candidateArea.hidden=true;completion.hidden=false;setMessage('');$('#completion-message').textContent=`「${intent}」として受け付けました。`;addLineGuide()});
$('#back-to-search')?.addEventListener('click',showSearch);

const heroSlides=$$('.hero-gallery .photo');const galleryDots=$('.gallery-dots');const galleryPrev=$('.gallery-prev');const galleryNext=$('.gallery-next');let heroSlideIndex=0;let heroSlideTimer;
if(heroSlides.length>1&&galleryDots){const showHeroSlide=index=>{heroSlides[heroSlideIndex].classList.remove('is-active');galleryDots.children[heroSlideIndex]?.classList.remove('is-active');heroSlideIndex=(index+heroSlides.length)%heroSlides.length;heroSlides[heroSlideIndex].classList.add('is-active');galleryDots.children[heroSlideIndex]?.classList.add('is-active')};const startHeroSlideshow=()=>{clearInterval(heroSlideTimer);heroSlideTimer=setInterval(()=>showHeroSlide(heroSlideIndex+1),4000)};heroSlides.forEach((_,index)=>{const dot=document.createElement('button');dot.type='button';dot.className='gallery-dot'+(index===0?' is-active':'');dot.setAttribute('aria-label',`${index+1}枚目の写真を表示`);dot.addEventListener('click',()=>{showHeroSlide(index);startHeroSlideshow()});galleryDots.append(dot)});galleryPrev?.addEventListener('click',()=>showHeroSlide(heroSlideIndex-1));galleryNext?.addEventListener('click',()=>showHeroSlide(heroSlideIndex+1));startHeroSlideshow()}

// 公式LINE・運営画面も、外部通信なしのデモとして体験できる。
const LINE_KEY='atsumare-shimachu-line-friend';
const isLineFriend=()=>localStorage.getItem(LINE_KEY)==='1';
function addLineFriend(){window.location.href='line/'}
function addLineGuide(){if(!completion||completion.querySelector('.demo-line-guide'))return;const guide=document.createElement('div');guide.className='demo-line-guide';guide.style.cssText='margin-top:20px;padding:18px;border-radius:16px;background:#effaf3;border:1px solid #bfe4ca;text-align:left';guide.innerHTML='<h4 style="margin:0 0 8px">公式LINEデモ</h4><p style="margin:0 0 12px;line-height:1.7">本番では最新情報や回答修正を公式LINEで受け付けます。このデモではブラウザ内だけで追加済みに切り替わります。</p><button type="button" class="button primary demo-line-button" style="width:100%;background:#06c755">LINE風トーク画面を開く</button>';const btn=guide.querySelector('button');btn.addEventListener('click',()=>addLineFriend(btn));completion.append(guide)}

if(nav&&!nav.querySelector('a[href="organizer/"]')){const organizerLink=document.createElement('a');organizerLink.href='line/';organizerLink.textContent='運営メンバーデモ';nav.append(organizerLink)}
const footer=document.querySelector('footer');if(footer&&!document.querySelector('.demo-tools')){const section=document.createElement('section');section.className='demo-tools section-shell';section.style.cssText='padding-top:28px;padding-bottom:28px';section.innerHTML='<div style="padding:24px;border-radius:20px;background:#effaf3;border:1px solid #bfe4ca"><p class="section-kicker">DEMO TOOLS</p><h2 style="margin-top:0">LINE・管理画面も試せます</h2><p style="line-height:1.8">すべて架空データです。外部サービスや実在の名簿には接続しません。</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="button primary demo-line-button" style="background:#06c755">LINE風トーク画面を開く</button><a class="button text-link" href="line/">運営メンバーデモを開く</a></div></div>';const btn=section.querySelector('button');btn.addEventListener('click',()=>addLineFriend(btn));footer.before(section)}
