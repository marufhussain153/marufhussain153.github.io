const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")})},{threshold:.12});
document.querySelectorAll(".section,.work-card,.service,.about-card,.tool-row").forEach(el=>{el.classList.add("reveal");observer.observe(el)});

// Shared manual carousel for thumbnails and Shorts.
document.querySelectorAll('.thumbnail-carousel').forEach(carousel => {
  const slides = [...carousel.querySelectorAll('.thumbnail-slide')];
  const selectors = [...carousel.querySelectorAll('[data-slide]')];
  const buttons = [...carousel.querySelectorAll('button')];
  let current = 0;
  let moving = false;
  async function showSlide(index, direction) {
    const next = (index + slides.length) % slides.length;
    if (moving || next === current) return;
    moving = true;
    buttons.forEach(button => { button.disabled = true; });
    const outgoing = slides[current];
    const incoming = slides[next];
    const oldVideo = outgoing.querySelector('iframe');
    if (oldVideo) oldVideo.src = 'about:blank';
    const newVideo = incoming.querySelector('iframe');
    if (newVideo) newVideo.src = newVideo.dataset.videoSrc;
    outgoing.setAttribute('aria-hidden', 'true');
    outgoing.inert = true;
    incoming.hidden = false;
    incoming.removeAttribute('aria-hidden');
    incoming.inert = false;
    const animations = [];
    try {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && incoming.animate) {
        const options = {duration: 340, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both'};
        animations.push(outgoing.animate([{transform:'translateX(0)'},{transform:`translateX(${-direction * 100}%)`}], options));
        animations.push(incoming.animate([{transform:`translateX(${direction * 100}%)`},{transform:'translateX(0)'}], options));
        await Promise.allSettled(animations.map(animation => animation.finished));
      }
    } finally {
      outgoing.hidden = true;
      animations.forEach(animation => animation.cancel());
      current = next;
      selectors.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
      carousel.querySelector('.thumbnail-count').textContent = `${current + 1} of ${slides.length}`;
      buttons.forEach(button => { button.disabled = false; });
      moving = false;
    }
  }
  carousel.querySelectorAll('[data-direction]').forEach(button => {
    button.addEventListener('click', () => {
      const direction = Number(button.dataset.direction);
      showSlide(current + direction, direction);
    });
  });
  selectors.forEach(button => button.addEventListener('click', () => {
    const next = Number(button.dataset.slide);
    showSlide(next, next >= current ? 1 : -1);
  }));
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      showSlide(current + direction, direction);
    }
  });
});