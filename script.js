const button=document.querySelector('.menu-button');const nav=document.querySelector('#site-nav');button?.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');button?.setAttribute('aria-expanded','false')}));

// 幹事レビュー用。実運用ではCloudflare Workers APIに置き換え、名簿をブラウザへ配信しない。
const surnames=['青海','白浜','朝倉','風間','若松','水城','浜崎','森川','大空','西浦','花田','月岡','神崎','南野','高瀬','春日','波多野','小森','有村','松永','岩崎','川瀬','藤森','北原','星野','橘','早川','望月','宮原','日高'];
const givenNames=['海斗','美咲','陽介','奈緒','健太','彩花','亮平','由佳','拓海','真紀','航','麻衣','大輔','千尋','直樹','明日香','悠人','香織','和也','沙織','翔太','優子','浩平','恵','駿','里奈','隆史','愛','誠','佳奈'];
const schools=['加也小','引津小','桜野小','不明'];const teachers=['山先生（架空）','海先生（架空）','森先生（架空）','空先生（架空）'];
const dummyRoster=surnames.map((surname,index)=>({id:`D${String(index+1).padStart(4,'0')}`,surname,givenName:givenNames[index],school:schools[index%4],classroom:`${index%4+1}組`,teacher:teachers[index%4]}));
const storageKey='shima-reunion-dummy-responses-v1';const answered=()=>new Set(JSON.parse(localStorage.getItem(storageKey)||'[]'));const mask=name=>name.length<=1?'＊':`${name[0]}${'＊'.repeat(Math.max(1,name.length-2))}${name.at(-1)}`;
const openInterestSearch=document.querySelector('#open-interest-search'),interestPrototype=document.querySelector('#interest-prototype'),searchForm=document.querySelector('#person-search-form'),intentForm=document.querySelector('#intent-form'),message=document.querySelector('#form-message'),candidateArea=document.querySelector('#candidate-area'),candidateList=document.querySelector('#candidate-list'),selectedPerson=document.querySelector('#selected-person'),completion=document.querySelector('#completion');let selected=null;
openInterestSearch?.addEventListener('click',()=>{interestPrototype.hidden=false;openInterestSearch.hidden=true;openInterestSearch.setAttribute('aria-expanded','true');interestPrototype.scrollIntoView({behavior:'smooth',block:'start'});searchForm?.querySelector('button[type="submit"]')?.focus({preventScroll:true})});
function setMessage(text,type='info'){message.textContent=text;message.className=`form-message ${type}`}
function showSearch(){selected=null;intentForm.hidden=true;completion.hidden=true;candidateArea.hidden=true;searchForm.hidden=false;setMessage('')}
function selectCandidate(person){selected=person;selectedPerson.textContent=`${mask(person.surname)} ${mask(person.givenName)}・${person.classroom}・${person.teacher}`;candidateArea.hidden=true;intentForm.hidden=false;setMessage('候補を選択しました。参加意向を回答してください。','success');intentForm.scrollIntoView({behavior:'smooth',block:'center'})}
searchForm?.addEventListener('submit',event=>{event.preventDefault();const school=document.querySelector('#school').value,[classroom,teacher]=document.querySelector('#class-teacher').value.split('|'),query=document.querySelector('#name-query').value.trim().replace(/\s/g,'');const matches=dummyRoster.filter(person=>person.school===school&&person.classroom===classroom&&person.teacher===teacher&&`${person.surname}${person.givenName}`.includes(query)).slice(0,3);intentForm.hidden=true;completion.hidden=true;candidateList.replaceChildren();if(!matches.length){candidateArea.hidden=true;setMessage('候補が見つかりませんでした。選択内容や氏名の一部を確認してください。','error');return}matches.forEach(person=>{const candidate=document.createElement('button');candidate.type='button';candidate.className='candidate';candidate.innerHTML=`<strong>${mask(person.surname)} ${mask(person.givenName)}</strong><span>${person.school}・${person.classroom}・${person.teacher}</span>`;candidate.addEventListener('click',()=>selectCandidate(person));candidateList.append(candidate)});candidateArea.hidden=false;setMessage(`${matches.length}件の候補が見つかりました。`,'success')});
intentForm?.addEventListener('submit',event=>{event.preventDefault();if(!selected)return;const intent=new FormData(intentForm).get('intent');if(!intent||!document.querySelector('#privacy-agreement').checked)return;intentForm.hidden=true;searchForm.hidden=true;candidateArea.hidden=true;completion.hidden=false;setMessage('');document.querySelector('#completion-message').textContent=`「${intent}」として受け付けました。`;completion.scrollIntoView({behavior:'smooth',block:'center'})});
document.querySelector('#back-to-search')?.addEventListener('click',showSearch);


// 思い出写真：自動再生＋手動切り替え
const heroGallery=document.querySelector('.hero-gallery');
const heroSlides=[...(heroGallery?.querySelectorAll('.photo')||[])];
const galleryDots=document.querySelector('.gallery-dots');
const galleryPrev=document.querySelector('.gallery-prev');
const galleryNext=document.querySelector('.gallery-next');
let heroSlideIndex=0;
let heroSlideTimer;
if(heroSlides.length>1&&galleryDots){
  const showHeroSlide=index=>{
    heroSlides[heroSlideIndex].classList.remove('is-active');
    galleryDots.children[heroSlideIndex]?.classList.remove('is-active');
    galleryDots.children[heroSlideIndex]?.removeAttribute('aria-current');
    heroSlideIndex=(index+heroSlides.length)%heroSlides.length;
    heroSlides[heroSlideIndex].classList.add('is-active');
    galleryDots.children[heroSlideIndex]?.classList.add('is-active');
    galleryDots.children[heroSlideIndex]?.setAttribute('aria-current','true');
  };
  const startHeroSlideshow=()=>{
    clearInterval(heroSlideTimer);
    heroSlideTimer=setInterval(()=>showHeroSlide(heroSlideIndex+1),4000);
  };
  const chooseHeroSlide=index=>{showHeroSlide(index);startHeroSlideshow()};
  heroSlides.forEach((slide,index)=>{
    const dot=document.createElement('button');
    dot.type='button';
    dot.className='gallery-dot';
    dot.setAttribute('aria-label',`${index+1}枚目の写真を表示`);
    if(index===0){dot.classList.add('is-active');dot.setAttribute('aria-current','true')}
    dot.addEventListener('click',()=>chooseHeroSlide(index));
    galleryDots.append(dot);
  });
  galleryPrev?.addEventListener('click',()=>chooseHeroSlide(heroSlideIndex-1));
  galleryNext?.addEventListener('click',()=>chooseHeroSlide(heroSlideIndex+1));
  heroGallery?.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft')chooseHeroSlide(heroSlideIndex-1);
    if(event.key==='ArrowRight')chooseHeroSlide(heroSlideIndex+1);
  });
  heroGallery?.setAttribute('tabindex','0');
  startHeroSlideshow();
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)clearInterval(heroSlideTimer);
    else startHeroSlideshow();
  });
}


// LP型CTA：読み進めた後に回答導線を再提示
const finalInterestCta=document.querySelector('#final-interest-cta');
const stickyInterestCta=document.querySelector('#sticky-interest-cta');
const interestJumpButtons=document.querySelectorAll('.interest-jump,#sticky-interest-cta');
let interestSectionVisible=false;
let finalCtaVisible=false;

const updateStickyInterestCta=()=>{
  if(!stickyInterestCta)return;
  const hasScrolled=window.scrollY>window.innerHeight*.72;
  const formIsOpen=interestPrototype&&!interestPrototype.hidden;
  const isComplete=completion&&!completion.hidden;
  stickyInterestCta.hidden=!hasScrolled||interestSectionVisible||finalCtaVisible||formIsOpen||isComplete;
};

interestJumpButtons.forEach(ctaButton=>ctaButton?.addEventListener('click',()=>{
  if(openInterestSearch&&!openInterestSearch.hidden)openInterestSearch.click();
  interestPrototype?.scrollIntoView({behavior:'smooth',block:'start'});
  updateStickyInterestCta();
}));

if('IntersectionObserver'in window){
  const ctaObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.target===document.querySelector('#interest'))interestSectionVisible=entry.isIntersecting;
      if(entry.target===finalInterestCta)finalCtaVisible=entry.isIntersecting;
    });
    updateStickyInterestCta();
  },{threshold:.15});
  const interestSection=document.querySelector('#interest');
  if(interestSection)ctaObserver.observe(interestSection);
  if(finalInterestCta)ctaObserver.observe(finalInterestCta);
}
window.addEventListener('scroll',updateStickyInterestCta,{passive:true});
window.addEventListener('resize',updateStickyInterestCta);
updateStickyInterestCta();

// 開催時期の「初旬」が単独で折り返されないようにする
const reunionDate=document.querySelector('.date-card span');
if(reunionDate){
  reunionDate.innerHTML='2026年12月末–<span style="white-space:nowrap">2027年1月初旬</span>';
}
