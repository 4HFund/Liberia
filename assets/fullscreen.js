const body=document.body;
const navToggle=document.querySelector('.nav-toggle');
const navLinks=document.querySelector('.nav-links');

const heroProgressText=document.querySelector('.hero-progress p');
if(heroProgressText)heroProgressText.textContent='toward our first $500 milestone';
const milestoneText=document.querySelector('.milestone-top span');
if(milestoneText)milestoneText.textContent='First milestone: $500';

navToggle?.addEventListener('click',()=>{
  const open=navToggle.getAttribute('aria-expanded')==='true';
  navToggle.setAttribute('aria-expanded',String(!open));
  navToggle.setAttribute('aria-label',open?'Open navigation':'Close navigation');
  navLinks?.classList.toggle('open',!open);
});
navLinks?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  navLinks.classList.remove('open');
  navToggle?.setAttribute('aria-expanded','false');
  navToggle?.setAttribute('aria-label','Open navigation');
}));

const heroVideo=document.querySelector('.hero-video');
const heroPlay=document.querySelector('.hero-play');
const showHeroVideo=()=>heroVideo?.classList.add('ready');
const updateHeroPlay=()=>heroPlay?.classList.toggle('visible',Boolean(heroVideo?.paused));
const tryHeroPlay=()=>{
  if(!heroVideo)return;
  heroVideo.muted=true;
  const attempt=heroVideo.play();
  if(attempt&&typeof attempt.then==='function')attempt.then(()=>{showHeroVideo();heroPlay?.classList.remove('visible')}).catch(updateHeroPlay);
};
heroVideo?.addEventListener('loadeddata',showHeroVideo,{once:true});
heroVideo?.addEventListener('canplay',()=>{showHeroVideo();tryHeroPlay()},{once:true});
heroVideo?.addEventListener('play',()=>{showHeroVideo();heroPlay?.classList.remove('visible')});
heroVideo?.addEventListener('pause',updateHeroPlay);
heroPlay?.addEventListener('click',async()=>{
  try{await heroVideo?.play();showHeroVideo();heroPlay.classList.remove('visible')}catch(e){heroPlay.classList.add('visible')}
});
tryHeroPlay();

const reveals=document.querySelectorAll('.reveal');
if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}
  }),{rootMargin:'0px 0px -8% 0px',threshold:.08});
  reveals.forEach(item=>observer.observe(item));
}else reveals.forEach(item=>item.classList.add('in-view'));

function openDialog(dialog){
  if(!dialog)return;
  body.classList.add('modal-open');
  if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
}
function closeDialog(dialog){
  if(!dialog)return;
  if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');
}
function attachDialog(dialog,closeSelector,onClose){
  dialog?.querySelector(closeSelector)?.addEventListener('click',()=>closeDialog(dialog));
  dialog?.addEventListener('click',event=>{if(event.target===dialog)closeDialog(dialog)});
  dialog?.addEventListener('close',()=>{body.classList.remove('modal-open');onClose?.();scheduleMobileGive()});
}

const visionDialog=document.getElementById('vision-modal');
const visionImage=document.getElementById('vision-modal-image');
document.querySelectorAll('[data-vision-image]').forEach(button=>button.addEventListener('click',()=>{
  if(!visionImage)return;
  visionImage.src=button.dataset.visionImage||'';
  visionImage.alt=button.dataset.visionAlt||'';
  openDialog(visionDialog);
  scheduleMobileGive();
}));
attachDialog(visionDialog,'[data-vision-close]',()=>{if(visionImage){visionImage.src='';visionImage.alt=''}});

const bioDialogs=document.querySelectorAll('.bio-modal');
document.querySelectorAll('[data-bio-open]').forEach(button=>button.addEventListener('click',()=>{
  openDialog(document.getElementById(button.dataset.bioOpen));
  scheduleMobileGive();
}));
bioDialogs.forEach(dialog=>attachDialog(dialog,'[data-bio-close]'));

const giftDialog=document.getElementById('gift-modal');
document.querySelectorAll('[data-gift-open]').forEach(button=>button.addEventListener('click',()=>{
  openDialog(giftDialog);
  scheduleMobileGive();
}));
attachDialog(giftDialog,'[data-gift-close]');

const giftPreviewDialog=document.getElementById('gift-preview-modal');
const giftPreviewTitle=document.getElementById('gift-preview-title');
const giftPreviewNote=document.getElementById('gift-preview-note');
const giftPreviewGrid=document.getElementById('gift-preview-grid');
document.querySelectorAll('[data-gift-preview]').forEach(button=>button.addEventListener('click',()=>{
  if(!giftPreviewTitle||!giftPreviewNote||!giftPreviewGrid)return;
  const images=(button.dataset.giftImages||'').split('|').filter(Boolean);
  const alts=(button.dataset.giftAlts||'').split('|');
  const captions=(button.dataset.giftCaptions||'').split('|');
  giftPreviewTitle.textContent=button.dataset.giftTitle||'Supporter gift';
  giftPreviewNote.textContent=button.dataset.giftNote||'';
  giftPreviewGrid.replaceChildren();
  images.forEach((src,index)=>{
    const figure=document.createElement('figure');
    figure.className='gift-preview-card';
    const image=document.createElement('img');
    image.src=src;
    image.alt=alts[index]||captions[index]||'Supporter gift preview';
    const caption=document.createElement('figcaption');
    caption.textContent=captions[index]||image.alt;
    figure.append(image,caption);
    giftPreviewGrid.append(figure);
  });
  openDialog(giftPreviewDialog);
  scheduleMobileGive();
}));
attachDialog(giftPreviewDialog,'[data-gift-preview-close]',()=>giftPreviewGrid?.replaceChildren());

const copyLink=document.getElementById('copy-link');
const shareStatus=document.getElementById('share-status');
copyLink?.addEventListener('click',async()=>{
  const url='https://100acresofhope.com/';
  try{await navigator.clipboard.writeText(url)}catch(e){
    const input=document.createElement('input');
    input.value=url;
    body.append(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  }
  if(shareStatus)shareStatus.textContent='Link copied.';
});

const mobileGive=document.getElementById('mobile-give');
const mobileGiveClose=mobileGive?.querySelector('button');
const storyScenes=[...document.querySelectorAll('.story-scene')];
const mobileBlocked=[
  document.getElementById('give'),
  document.querySelector('.share'),
  document.querySelector('.faq'),
  document.querySelector('.partners'),
  document.querySelector('.final-cta'),
  document.querySelector('footer')
].filter(Boolean);
let mobileDismissed=false;
let mobileFrame=0;
try{mobileDismissed=sessionStorage.getItem('hope-mobile-give-hidden')==='true'}catch(e){}
function visibleInViewport(element){
  const rect=element.getBoundingClientRect();
  return rect.top<window.innerHeight-30&&rect.bottom>80;
}
function updateMobileGive(){
  mobileFrame=0;
  if(!mobileGive)return;
  const mobile=window.innerWidth<=720;
  const lastStory=storyScenes.at(-1);
  const storyPassed=Boolean(lastStory&&lastStory.getBoundingClientRect().bottom<window.innerHeight*.45);
  const blocked=mobileBlocked.some(visibleInViewport);
  mobileGive.classList.toggle('visible',mobile&&!mobileDismissed&&storyPassed&&!blocked&&!body.classList.contains('modal-open'));
}
function scheduleMobileGive(){
  if(mobileFrame)return;
  mobileFrame=requestAnimationFrame(updateMobileGive);
}
mobileGiveClose?.addEventListener('click',()=>{
  mobileDismissed=true;
  try{sessionStorage.setItem('hope-mobile-give-hidden','true')}catch(e){}
  mobileGive?.classList.remove('visible');
});
window.addEventListener('scroll',scheduleMobileGive,{passive:true});
window.addEventListener('resize',scheduleMobileGive);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){tryHeroPlay();scheduleMobileGive()}});
updateMobileGive();
