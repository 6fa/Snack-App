
(function() {
  'use strict';
  let docElem = document.documentElement;
  let dpr = window.devicePixelRatio || 1;
  let viewportEl = document.querySelector('meta[name="viewport"]');
  let maxWidth = 640;
  let minWidth = 320;

  dpr = dpr >= 3 ? 3 : (dpr >= 2 ? 2 : 1);

  docElem.setAttribute('data-dpr', dpr);
  docElem.setAttribute('maxWidth', maxWidth);
  docElem.setAttribute('minWidth', minWidth);

  let scale = 1/dpr,
      content = `width=device-width, initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale},user-scalable=no`;
  
  if(viewportEl) {
    viewportEl.setAttribute('content',content);
  }else{
    viewportEl = document.createElement('meta');
    viewportEl.setAttribute('name','viewport');
    viewportEl.setAttribute('content',content);
  }

  setRemUnit();

  window.addEventListener('resize', setRemUnit);

  function setRemUnit() {
    let viewWidth = docElem.clientWidth || docElem.getBoundingClientRect() || window.innerWidth;
    let ratio = 18.75;

    if(maxWidth && (viewWidth/dpr > maxWidth)) {
      viewWidth = maxWidth * dpr;
    }else if(minWidth && (viewWidth/dpr < minWidth)) {
      viewWidth = minWidth * dpr;
    }
    docElem.style.fontSize = viewWidth/ratio + 'px';
    docElem.setAttribute('fontsize',viewWidth/ratio);
    docElem.setAttribute('width',viewWidth);
  }

})();