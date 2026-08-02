(() => {
  const body = document.body;
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const hero = document.querySelector('.hero');
  const heroVideo = document.querySelector('.hero-video');
  const heroPlay = document.querySelector('.hero-play');
  const mobileGive = document.getElementById('mobile-give');
  const mobileGiveClose = mobileGive?.querySelector('button');
  let mobileGiveDismissed = false;
  let mobileGiveFrame = 0;

  try { mobileGiveDismissed = sessionStorage.getItem('hope-mobile-give-dismissed') === 'true'; } catch (error) {}

  navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navLinks?.classList.toggle('open', !open);
  });

  navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  function showVideo(){ heroVideo?.classList.add('ready'); }
  function showPlayButton(){ heroPlay?.classList.add('visible'); }
  function tryAutoplay(){
    if(!heroVideo) return;
    heroVideo.muted = true;
    const attempt = heroVideo.play();
    if(attempt && typeof attempt.then === 'function') attempt.then(() => { showVideo(); heroPlay?.classList.remove('visible'); }).catch(showPlayButton);
  }
  heroPlay?.addEventListener('click', async () => {
    if(!heroVideo) return;
    try { heroVideo.muted = true; await heroVideo.play(); showVideo(); heroPlay.classList.remove('visible'); }
    catch(error){ showPlayButton(); }
  });
  heroVideo?.addEventListener('loadeddata', showVideo, {once:true});
  heroVideo?.addEventListener('canplay', tryAutoplay, {once:true});
  heroVideo?.addEventListener('pause', showPlayButton);
  heroVideo?.addEventListener('play', () => heroPlay?.classList.remove('visible'));
  tryAutoplay();

  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if(!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {rootMargin:'0px 0px -8% 0px', threshold:.08}) : null;
  document.querySelectorAll('.reveal').forEach((element) => revealObserver ? revealObserver.observe(element) : element.classList.add('is-visible'));

  function setModalState(open){ body.classList.toggle('modal-open', open); scheduleMobileGiveUpdate(); }
  function openDialog(dialog){
    if(!dialog) return;
    setModalState(true);
    if(typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open','');
  }
  function closeDialog(dialog){
    if(!dialog) return;
    if(typeof dialog.close === 'function') dialog.close(); else { dialog.removeAttribute('open'); setModalState(false); }
  }
  function wireBackdropClose(dialog){
    dialog?.addEventListener('click', (event) => { if(event.target === dialog) closeDialog(dialog); });
    dialog?.addEventListener('close', () => setModalState(false));
  }

  const visionDialog = document.getElementById('vision-modal');
  const visionImage = document.getElementById('vision-modal-image');
  document.querySelectorAll('[data-vision-image]').forEach((opener) => opener.addEventListener('click', () => {
    if(!visionDialog || !visionImage) return;
    visionImage.src = opener.dataset.visionImage || '';
    visionImage.alt = opener.dataset.visionAlt || '100 Acres of Hope vision';
    openDialog(visionDialog);
  }));
  visionDialog?.querySelector('[data-vision-close]')?.addEventListener('click', () => closeDialog(visionDialog));
  visionDialog?.addEventListener('close', () => { if(visionImage){ visionImage.src=''; visionImage.alt=''; } });
  wireBackdropClose(visionDialog);

  document.querySelectorAll('[data-bio-open]').forEach((opener) => opener.addEventListener('click', () => openDialog(document.getElementById(opener.dataset.bioOpen))));
  document.querySelectorAll('.bio-modal').forEach((dialog) => {
    dialog.querySelector('[data-bio-close]')?.addEventListener('click', () => closeDialog(dialog));
    wireBackdropClose(dialog);
  });

  const giftDialog = document.getElementById('gift-modal');
  document.querySelectorAll('[data-gift-open]').forEach((opener) => opener.addEventListener('click', () => openDialog(giftDialog)));
  giftDialog?.querySelector('[data-gift-close]')?.addEventListener('click', () => closeDialog(giftDialog));
  wireBackdropClose(giftDialog);

  const giftPreviewDialog = document.getElementById('gift-preview-modal');
  const giftPreviewTitle = document.getElementById('gift-preview-title');
  const giftPreviewNote = document.getElementById('gift-preview-note');
  const giftPreviewGrid = document.getElementById('gift-preview-grid');
  document.querySelectorAll('[data-gift-preview]').forEach((opener) => opener.addEventListener('click', () => {
    if(!giftPreviewDialog || !giftPreviewTitle || !giftPreviewNote || !giftPreviewGrid) return;
    const images = (opener.dataset.giftImages || '').split('|').filter(Boolean);
    const alts = (opener.dataset.giftAlts || '').split('|');
    const captions = (opener.dataset.giftCaptions || '').split('|');
    giftPreviewTitle.textContent = opener.dataset.giftTitle || 'Supporter gift';
    giftPreviewNote.textContent = opener.dataset.giftNote || '';
    giftPreviewGrid.replaceChildren();
    images.forEach((src,index) => {
      const figure=document.createElement('figure'); figure.className='gift-preview-card';
      const image=document.createElement('img'); image.src=src; image.alt=alts[index] || captions[index] || 'Supporter gift preview';
      const caption=document.createElement('figcaption'); caption.textContent=captions[index] || image.alt;
      figure.append(image,caption); giftPreviewGrid.append(figure);
    });
    openDialog(giftPreviewDialog);
  }));
  giftPreviewDialog?.querySelector('[data-gift-preview-close]')?.addEventListener('click', () => closeDialog(giftPreviewDialog));
  giftPreviewDialog?.addEventListener('close', () => giftPreviewGrid?.replaceChildren());
  wireBackdropClose(giftPreviewDialog);

  document.addEventListener('keydown', (event) => { if(event.key === 'Escape') document.querySelectorAll('dialog[open]').forEach(closeDialog); });
  document.querySelectorAll('.faq details').forEach((detail) => detail.addEventListener('toggle', () => {
    if(!detail.open) return;
    document.querySelectorAll('.faq details[open]').forEach((other) => { if(other !== detail) other.removeAttribute('open'); });
  }));

  const copyLink=document.getElementById('copy-link');
  const shareStatus=document.getElementById('share-status');
  copyLink?.addEventListener('click', async () => {
    const url='https://100acresofhope.com/';
    try { await navigator.clipboard.writeText(url); }
    catch(error){ const input=document.createElement('input'); input.value=url; body.append(input); input.select(); document.execCommand('copy'); input.remove(); }
    if(shareStatus) shareStatus.textContent='Link copied.';
  });

  const hiddenZones=[document.getElementById('give'),document.querySelector('.share'),document.querySelector('.faq'),document.querySelector('.partners'),document.querySelector('.final-cta'),document.querySelector('footer')].filter(Boolean);
  function zoneIsVisible(zone){ const rect=zone.getBoundingClientRect(); return rect.top < window.innerHeight-24 && rect.bottom > 80; }
  function updateMobileGive(){
    mobileGiveFrame=0;
    if(!mobileGive) return;
    const mobile=window.innerWidth <= 620;
    const heroPassed=Boolean(hero && hero.getBoundingClientRect().bottom < 90);
    const blocked=hiddenZones.some(zoneIsVisible);
    mobileGive.classList.toggle('visible', mobile && !mobileGiveDismissed && heroPassed && !blocked && !body.classList.contains('modal-open'));
  }
  function scheduleMobileGiveUpdate(){ if(!mobileGiveFrame) mobileGiveFrame=requestAnimationFrame(updateMobileGive); }
  mobileGiveClose?.addEventListener('click', () => {
    mobileGiveDismissed=true;
    try { sessionStorage.setItem('hope-mobile-give-dismissed','true'); } catch(error){}
    mobileGive?.classList.remove('visible');
  });
  window.addEventListener('scroll', scheduleMobileGiveUpdate, {passive:true});
  window.addEventListener('resize', scheduleMobileGiveUpdate);
  document.addEventListener('visibilitychange', () => { if(!document.hidden){ tryAutoplay(); scheduleMobileGiveUpdate(); } });
  updateMobileGive();
})();