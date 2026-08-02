const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];

// 公開デモ用：見た目は元の同窓会サイトを保ち、固有名詞だけ架空設定にする。
document.title='あつまれ島中学校｜同窓会デモ';
const replaceExact=(selector,from,to)=>$$(selector).forEach(el=>{if(el.textContent.trim()===from)el.textContent=to});
const replaceContains=(selector,from,to)=>$$(selector).forEach(el=>{if(el.textContent.includes(from))el.innerHTML=el.innerHTML.split(from).join(to)});

const brand=$('.brand');if(brand)brand.textContent='島に、おかえり。';
const eyebrow=$('.eyebrow');if(eyebrow)eyebrow.textContent='ATSUMARE SHIMA JUNIOR HIGH SCHOOL REUNION';
const heroTitle=$('.hero h1');if(heroTitle)heroTitle.innerHTML='島に、おかえり。<br>あつまれ島中学校。';
const location=$('.location');if(location)location.textContent='ATSUMARE ISLAND';
replaceExact('nav a','糸島の今','島の今');
replaceContains('h2,p,dd,span,strong,a','糸島','あつまれ島');
replaceContains('h1,h2,h3,p,dd,span,strong,a','志摩中','島中学校');
replaceContains('h1,h2,h3,p,dd,span,strong,a','加也小','どんぐり小');
replaceContains('h1,h2,h3,p,dd,span,strong,a','引津小','しおかぜ小');
replaceContains('h1,h2,h3,p,dd,span,strong,a','桜野小','こもれび小');

// 写真は先頭2枚だけ残す。
const allSlides=$$('.hero-gallery .photo');
allSlides.slice(2).forEach(slide=>slide.remove());
const galleryLabel=$('.hero-gallery');if(galleryLabel)galleryLabel.setAttribute('aria-label','島の思い出写真が自動で切り替わります');

// 幹事プロフィールは架空の島民風名称へ。
const organizerName=$('.organizer-name');
if(organizerName)organizerName.innerHTML='<strong>しま長 ポンきち</strong><span>どんぐり小・島中学校つり部・案内所勤務</span>';
const organizerHeading=$('#organizer-message-title');if(organizerHeading)organizerHeading.textContent='しま長からのご挨拶';

const team=$('.organizer-team-grid');
if(team){
  const cards=$$('.team-member',team);
  const people=[
    {school:'どんぐり小',name:'モコ',role:'お知らせ係／世話焼き'},
    {school:'しおかぜ小',name:'ペンタ',role:'会場係／盛り上げ担当'},
    {school:'こもれび小',name:'コンタ',role:'サイト係／島のIT担当'}
  ];
  cards.forEach((card,index)=>{
    const person=people[index];if(!person)return;
    const school=$('.team-school',card);if(school)school.textContent=person.school;
    const name=$('h3',card);if(name)name.textContent=person.name;
    const role=$('.team-role',card);if(role)role.textContent=person.role;
  });
}

const button=$('.menu-button');const nav=$('#site-nav');button?.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));nav?.classList.toggle('open',!open)});nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');button?.setAttribute('aria-expanded','false')}));

// 架空の名簿。回答はこの端末内だけに保存する。
const roster=[
{id:'D001',surname:'モコ',givenName:'リス',school:'どんぐり小',classroom:'1組',teacher:'フクロウ先生'},
{id:'D002',surname:'ペンタ',givenName:'ペンギン',school:'しおかぜ小',classroom:'2組',teacher:'カモメ先生'},
{id:'D003',surname:'コンタ',givenName:'キツネ',school:'こもれび小',classroom:'3組',teacher:'ヤギ先生'},
{id:'D004',surname:'ミミ',givenName:'ウサギ',school:'どんぐり小',classroom:'1組',teacher:'フクロウ先生'},
{id:'D005',surname:'クルミ',givenName:'クマ',school:'しおかぜ小',classroom:'2組',teacher:'カモメ先生'},
{id:'D006',surname:'ナギ',givenName:'ネコ',school:'こもれび小',classroom:'3組',teacher:'ヤギ先生'}
];
const schoolSelect=$('#school');if(schoolSelect)schoolSelect.innerHTML='<option value="">選んでください</option><option selected>どんぐり小</option><option>しおかぜ小</option><option>こもれび小</option><option>不明</option>';
const classTeacher=$('#class-teacher');if(classTeacher)classTeacher.innerHTML='<option value="">選んでください</option><option value="1組|フクロウ先生" selected>1組｜フクロウ先生</option><option value="2組|カモメ先生">2組｜カモメ先生</option><option value="3組|ヤギ先生">3組｜ヤギ先生</option>';
const nameQuery=$('#name-query');if(nameQuery){nameQuery.value='モ';nameQuery.placeholder='例：モ、ペンタ'}
const mask=name=>name.length<=1?'＊':`${name[0]}${'＊'.repeat(Math.max(1,name.length-2))}${name.at(-1)}`;
const openInterestSearch=$('#open-interest-search'),interestPrototype=$('#interest-prototype'),searchForm=$('#person-search-form'),intentForm=$('#intent-form'),message=$('#form-message'),candidateArea=$('#candidate-area'),candidateList=$('#candidate-list'),selectedPerson=$('#selected-person'),completion=$('#completion');let selected=null;
openInterestSearch?.addEventListener('click',()=>{interestPrototype.hidden=false;openInterestSearch.hidden=true;openInterestSearch.setAttribute('aria-expanded','true');interestPrototype.scrollIntoView({behavior:'smooth',block:'start'});searchForm?.querySelector('button[type="submit"]')?.focus({preventScroll:true})});
function setMessage(text,type='info'){message.textContent=text;message.className=`form-message ${type}`}
function showSearch(){selected=null;intentForm.hidden=true;completion.hidden=true;candidateArea.hidden=true;searchForm.hidden=false;setMessage('')}
function selectCandidate(person){selected=person;selectedPerson.textContent=`${mask(person.surname)} ${mask(person.givenName)}・${person.classroom}・${person.teacher}`;candidateArea.hidden=true;intentForm.hidden=false;setMessage('候補を選択しました。参加意向を回答してください。','success');intentForm.scrollIntoView({behavior:'smooth',block:'center'})}
searchForm?.addEventListener('submit',event=>{event.preventDefault();const school=schoolSelect.value,[classroom,teacher]=classTeacher.value.split('|'),query=nameQuery.value.trim().replace(/\s/g,'');const matches=roster.filter(person=>person.school===school&&person.classroom===classroom&&person.teacher===teacher&&`${person.surname}${person.givenName}`.includes(query)).slice(0,3);intentForm.hidden=true;completion.hidden=true;candidateList.replaceChildren();if(!matches.length){candidateArea.hidden=true;setMessage('候補が見つかりませんでした。選択内容や名前の一部を確認してください。','error');return}matches.forEach(person=>{const candidate=document.createElement('button');candidate.type='button';candidate.className='candidate';candidate.innerHTML=`<strong>${mask(person.surname)} ${mask(person.givenName)}</strong><span>${person.school}・${person.classroom}・${person.teacher}</span>`;candidate.addEventListener('click',()=>selectCandidate(person));candidateList.append(candidate)});candidateArea.hidden=false;setMessage(`${matches.length}件の候補が見つかりました。`,'success')});
intentForm?.addEventListener('submit',event=>{event.preventDefault();if(!selected)return;const intent=new FormData(intentForm).get('intent');if(!intent||!$('#privacy-agreement').checked)return;const saved=JSON.parse(localStorage.getItem('atsumare-shimachu-demo')||'[]');saved.push({id:selected.id,intent,at:new Date().toISOString()});localStorage.setItem('atsumare-shimachu-demo',JSON.stringify(saved));intentForm.hidden=true;searchForm.hidden=true;candidateArea.hidden=true;completion.hidden=false;setMessage('');$('#completion-message').textContent=`「${intent}」として受け付けました。`;completion.scrollIntoView({behavior:'smooth',block:'center')});
$('#back-to-search')?.addEventListener('click',showSearch);

// 思い出写真：元のデザインのまま、自動再生＋手動切り替え。
const heroGallery=$('.hero-gallery');const heroSlides=$$('.photo',heroGallery);const galleryDots=$('.gallery-dots');const galleryPrev=$('.gallery-prev');const galleryNext=$('.gallery-next');let heroSlideIndex=0;let heroSlideTimer;
if(heroSlides.length>1&&galleryDots){const showHeroSlide=index=>{heroSlides[heroSlideIndex].classList.remove('is-active');galleryDots.children[heroSlideIndex]?.classList.remove('is-active');galleryDots.children[heroSlideIndex]?.removeAttribute('aria-current');heroSlideIndex=(index+heroSlides.length)%heroSlides.length;heroSlides[heroSlideIndex].classList.add('is-active');galleryDots.children[heroSlideIndex]?.classList.add('is-active');galleryDots.children[heroSlideIndex]?.setAttribute('aria-current','true')};const startHeroSlideshow=()=>{clearInterval(heroSlideTimer);heroSlideTimer=setInterval(()=>showHeroSlide(heroSlideIndex+1),4000)};const chooseHeroSlide=index=>{showHeroSlide(index);startHeroSlideshow()};heroSlides.forEach((slide,index)=>{const dot=document.createElement('button');dot.type='button';dot.className='gallery-dot';dot.setAttribute('aria-label',`${index+1}枚目の写真を表示`);if(index===0){dot.classList.add('is-active');dot.setAttribute('aria-current','true')}dot.addEventListener('click',()=>chooseHeroSlide(index));galleryDots.append(dot)});galleryPrev?.addEventListener('click',()=>chooseHeroSlide(heroSlideIndex-1));galleryNext?.addEventListener('click',()=>chooseHeroSlide(heroSlideIndex+1));heroGallery?.setAttribute('tabindex','0');startHeroSlideshow();document.addEventListener('visibilitychange',()=>document.hidden?clearInterval(heroSlideTimer):startHeroSlideshow())}

const finalInterestCta=$('#final-interest-cta'),stickyInterestCta=$('#sticky-interest-cta'),interestJumpButtons=$$('.interest-jump,#sticky-interest-cta');let interestSectionVisible=false,finalCtaVisible=false;
const updateStickyInterestCta=()=>{if(!stickyInterestCta)return;const hasScrolled=window.scrollY>window.innerHeight*.72,formIsOpen=interestPrototype&&!interestPrototype.hidden,isComplete=completion&&!completion.hidden;stickyInterestCta.hidden=!hasScrolled||interestSectionVisible||finalCtaVisible||formIsOpen||isComplete};
interestJumpButtons.forEach(ctaButton=>ctaButton?.addEventListener('click',()=>{if(openInterestSearch&&!openInterestSearch.hidden)openInterestSearch.click();interestPrototype?.scrollIntoView({behavior:'smooth',block:'start'});updateStickyInterestCta()}));
if('IntersectionObserver'in window){const ctaObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.target===$('#interest'))interestSectionVisible=entry.isIntersecting;if(entry.target===finalInterestCta)finalCtaVisible=entry.isIntersecting});updateStickyInterestCta()},{threshold:.15});const interestSection=$('#interest');if(interestSection)ctaObserver.observe(interestSection);if(finalInterestCta)ctaObserver.observe(finalInterestCta)}
window.addEventListener('scroll',updateStickyInterestCta,{passive:true});window.addEventListener('resize',updateStickyInterestCta);updateStickyInterestCta();