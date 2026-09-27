const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")})},{threshold:.12});
document.querySelectorAll(".section,.work-card,.service,.about-card,.tool-row").forEach(el=>{el.classList.add("reveal");observer.observe(el)});
// Thumbnail navigation wraps in either direction, without automatic motion.
document.querySelectorAll('.thumbnail-carousel').forEach(carousel => {
  const slides = [...carousel.querySelectorAll('.thumbnail-slide')];
  const selectors = [...carousel.querySelectorAll('[data-slide]')];
  let current = 0;
  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    selectors.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    carousel.querySelector('.thumbnail-count').textContent = `${current + 1} of ${slides.length}`;
  }
  carousel.querySelectorAll('[data-direction]').forEach(button => {
    button.addEventListener('click', () => showSlide(current + Number(button.dataset.direction)));
  });
  selectors.forEach(button => button.addEventListener('click', () => showSlide(Number(button.dataset.slide))));
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
});