const toggle=document.querySelector('.nav-toggle');
const links=document.querySelector('.nav-links');
const hero=document.querySelector('.hero');
const heroVideo=document.querySelector('.hero-video');
const heroPlay=document.querySelector('.hero-play');
const heroPlayIcon=document.querySelector('.hero-play-icon');
const heroPlayText=document.querySelector('.hero-play-text');
const mobileGive=document.getElementById('mobile-give');
const mobileGiveClose=document.querySelector('.mobile-give-close');
const mobileGiveHiddenZones=[
  document.getElementById('give'),
  document.querySelector('.share-section'),
  document.querySelector('.faq'),
  document.querySelector('.partners'),
  document.querySelector('.final'),
  document.querySelector('footer')
].filter(Boolean);
let mobileGiveDismissed=false;
let mobileGiveFrame=0;
try{mobileGiveDismissed=sessionStorage.getItem('hope-mobile-give-dismissed')==='true'}catch(e){}

toggle?.addEventListener('click',()=>{
  const open=toggle.getAttribute('aria-expanded')==='true';
  toggle.setAttribute('aria-expanded',String(!open));
  toggle.textContent=open?'☰':'×';
  toggle.setAttribute('aria-label',open?'Open menu':'Close menu');
  links.classList.toggle('open',!open);
});

links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  links.classList.remove('open');
  toggle.setAttribute('aria-expanded','false');
  toggle.setAttribute('aria-label','Open menu');
  toggle.textContent='☰';
}));

function updateVideoButton(){
  if(!heroVideo||!heroPlay)return;
  if(heroVideo.paused){
    heroPlayIcon.textContent='▶';
    heroPlayText.textContent='Play video';
    heroPlay.setAttribute('aria-label','Play opening video');
    heroPlay.classList.add('visible');
  }else heroPlay.classList.remove('visible');
}

function showVideo(){heroVideo?.classList.add('ready')}
function tryAutoplay(){
  if(!heroVideo)return;
  heroVideo.muted=true;
  const attempt=heroVideo.play();
  if(attempt&&typeof attempt.then==='function')attempt.then(()=>{showVideo();heroPlay?.classList.remove('visible')}).catch(updateVideoButton);
}

heroPlay?.addEventListener('click',async()=>{
  if(!heroVideo)return;
  try{heroVideo.muted=true;await heroVideo.play();showVideo();heroPlay.classList.remove('visible')}
  catch(e){heroPlay.classList.add('visible');heroPlayText.textContent='Tap again to play'}
});
heroVideo?.addEventListener('loadeddata',showVideo,{once:true});
heroVideo?.addEventListener('canplay',()=>{showVideo();tryAutoplay()},{once:true});
heroVideo?.addEventListener('play',()=>{showVideo();heroPlay?.classList.remove('visible')});
heroVideo?.addEventListener('pause',updateVideoButton);

function zoneIsVisible(zone){
  const rect=zone.getBoundingClientRect();
  return rect.top<window.innerHeight-28&&rect.bottom>86;
}

function updateMobileGive(){
  mobileGiveFrame=0;
  if(!mobileGive)return;
  const mobile=window.innerWidth<=720;
  const heroPassed=Boolean(hero&&hero.getBoundingClientRect().bottom<86);
  const blocked=mobileGiveHiddenZones.some(zoneIsVisible);
  const shouldShow=mobile&&!mobileGiveDismissed&&heroPassed&&!blocked&&!document.body.classList.contains('modal-open');
  mobileGive.classList.toggle('visible',shouldShow);
}

function scheduleMobileGiveUpdate(){
  if(mobileGiveFrame)return;
  mobileGiveFrame=requestAnimationFrame(updateMobileGive);
}

mobileGiveClose?.addEventListener('click',()=>{
  mobileGiveDismissed=true;
  try{sessionStorage.setItem('hope-mobile-give-dismissed','true')}catch(e){}
  mobileGive?.classList.remove('visible');
});
window.addEventListener('scroll',scheduleMobileGiveUpdate,{passive:true});
window.addEventListener('resize',scheduleMobileGiveUpdate);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){tryAutoplay();scheduleMobileGiveUpdate()}});
tryAutoplay();
updateMobileGive();

const visionDialog=document.getElementById('vision-modal');
const visionImage=document.getElementById('vision-modal-image');
document.querySelectorAll('[data-vision-image]').forEach(opener=>opener.addEventListener('click',()=>{
  if(!visionDialog||!visionImage)return;
  visionImage.src=opener.dataset.visionImage;
  visionImage.alt=opener.dataset.visionAlt||opener.textContent.trim();
  document.body.classList.add('modal-open');
  scheduleMobileGiveUpdate();
  if(typeof visionDialog.showModal==='function')visionDialog.showModal();else visionDialog.setAttribute('open','');
}));
visionDialog?.querySelector('[data-vision-close]')?.addEventListener('click',()=>visionDialog.close());
visionDialog?.addEventListener('click',event=>{if(event.target===visionDialog)visionDialog.close()});
visionDialog?.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(visionImage){visionImage.src='';visionImage.alt=''}scheduleMobileGiveUpdate()});

const giftDialog=document.getElementById('gift-modal');
document.querySelectorAll('[data-gift-open]').forEach(opener=>opener.addEventListener('click',()=>{
  if(!giftDialog)return;
  document.body.classList.add('modal-open');
  scheduleMobileGiveUpdate();
  if(typeof giftDialog.showModal==='function')giftDialog.showModal();else giftDialog.setAttribute('open','');
}));
giftDialog?.querySelector('[data-gift-close]')?.addEventListener('click',()=>giftDialog.close());
giftDialog?.addEventListener('click',event=>{if(event.target===giftDialog)giftDialog.close()});
giftDialog?.addEventListener('close',()=>{document.body.classList.remove('modal-open');scheduleMobileGiveUpdate()});

const giftPreviewDialog=document.getElementById('gift-preview-modal');
const giftPreviewTitle=document.getElementById('gift-preview-title');
const giftPreviewNote=document.getElementById('gift-preview-note');
const giftPreviewGrid=document.getElementById('gift-preview-grid');
document.querySelectorAll('[data-gift-preview]').forEach(opener=>opener.addEventListener('click',()=>{
  if(!giftPreviewDialog||!giftPreviewTitle||!giftPreviewNote||!giftPreviewGrid)return;
  const images=(opener.dataset.giftImages||'').split('|').filter(Boolean);
  const alts=(opener.dataset.giftAlts||'').split('|');
  const captions=(opener.dataset.giftCaptions||'').split('|');
  giftPreviewTitle.textContent=opener.dataset.giftTitle||'Supporter gift';
  giftPreviewNote.textContent=opener.dataset.giftNote||'';
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
  document.body.classList.add('modal-open');
  scheduleMobileGiveUpdate();
  if(typeof giftPreviewDialog.showModal==='function')giftPreviewDialog.showModal();else giftPreviewDialog.setAttribute('open','');
}));
giftPreviewDialog?.querySelector('[data-gift-preview-close]')?.addEventListener('click',()=>giftPreviewDialog.close());
giftPreviewDialog?.addEventListener('click',event=>{if(event.target===giftPreviewDialog)giftPreviewDialog.close()});
giftPreviewDialog?.addEventListener('close',()=>{document.body.classList.remove('modal-open');giftPreviewGrid?.replaceChildren();scheduleMobileGiveUpdate()});

const bioDialogs=document.querySelectorAll('.bio-modal');
document.querySelectorAll('[data-bio-open]').forEach(opener=>opener.addEventListener('click',()=>{
  const dialog=document.getElementById(opener.dataset.bioOpen);
  if(!dialog)return;
  document.body.classList.add('modal-open');
  scheduleMobileGiveUpdate();
  if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
}));
bioDialogs.forEach(dialog=>{
  dialog.querySelector('[data-bio-close]')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');scheduleMobileGiveUpdate()});
});

const copyLink=document.getElementById('copy-link');
const shareStatus=document.getElementById('share-status');
copyLink?.addEventListener('click',async()=>{
  const url='https://100acresofhope.com/';
  try{
    await navigator.clipboard.writeText(url);
    shareStatus.textContent='Link copied.';
  }catch(e){
    const input=document.createElement('input');
    input.value=url;
    document.body.append(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    shareStatus.textContent='Link copied.';
  }
});
