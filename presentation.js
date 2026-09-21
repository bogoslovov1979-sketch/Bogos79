(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('[data-slide]')];
  const dialog = document.getElementById('sources-dialog');
  const mobile = matchMedia('(max-width: 700px)');
  let current = 0;
  document.documentElement.classList.add('enhanced');
  const initialHash = Number(location.hash.slice(1));
  if (Number.isInteger(initialHash) && initialHash >= 1 && initialHash <= slides.length) current = initialHash - 1;

  function display(index, scroll = false) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => i === current ? dot.setAttribute('aria-current', 'step') : dot.removeAttribute('aria-current'));
    document.getElementById('page-count').textContent = `${String(current + 1).padStart(2, '0')} / 05`;
    document.getElementById('slide-label').textContent = slides[current].dataset.title;
    document.getElementById('prev').disabled = current === 0;
    document.getElementById('next').disabled = current === slides.length - 1;
    if (scroll && mobile.matches) slides[current].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    if (!mobile.matches) window.scrollTo({top:0,behavior:'instant'});
    if (location.hash !== `#${current + 1}`) history.replaceState(null, '', `#${current + 1}`);
  }
  document.getElementById('prev').addEventListener('click', () => display(current - 1));
  document.getElementById('next').addEventListener('click', () => display(current + 1));
  document.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => display(current + 1, true)));
  dots.forEach(b => b.addEventListener('click', () => display(Number(b.dataset.slide), true)));
  document.querySelector('.brand').addEventListener('click', e => {e.preventDefault();display(0, true);});
  addEventListener('hashchange', () => {const n=Number(location.hash.slice(1));if(Number.isInteger(n)&&n>=1&&n<=5)display(n-1,true);});
  addEventListener('keydown', e => {
    if(dialog.open || mobile.matches || e.altKey || e.ctrlKey || e.metaKey || ['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(document.activeElement.tagName))return;
    if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();display(current+1);}
    if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();display(current-1);}
    if(e.key==='Home'){e.preventDefault();display(0);}
    if(e.key==='End'){e.preventDefault();display(slides.length-1);}
  });
  document.getElementById('sources-open').addEventListener('click', () => dialog.showModal());
  document.getElementById('sources-close').addEventListener('click', () => dialog.close());
  document.getElementById('print').addEventListener('click', () => {dialog.close();window.print();});
  const fullscreen = document.getElementById('fullscreen');
  if(!document.fullscreenEnabled)fullscreen.hidden=true;
  fullscreen.addEventListener('click', async () => {
    try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{fullscreen.hidden=true;}
  });
  document.addEventListener('fullscreenchange', () => {fullscreen.textContent=document.fullscreenElement?'Изход от цял екран':'Цял екран ⤢';fullscreen.setAttribute('aria-label',document.fullscreenElement?'Изход от цял екран':'Презентация на цял екран');});
  let startX=0,startY=0;
  document.getElementById('slides').addEventListener('touchstart',e=>{startX=e.changedTouches[0].screenX;startY=e.changedTouches[0].screenY;},{passive:true});
  document.getElementById('slides').addEventListener('touchend',e=>{if(mobile.matches)return;const dx=e.changedTouches[0].screenX-startX,dy=e.changedTouches[0].screenY-startY;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*2)display(current+(dx<0?1:-1));},{passive:true});
  mobile.addEventListener('change',()=>display(current));
  display(current);
})();
