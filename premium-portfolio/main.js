document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealOnScroll = () => {
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.85;
      if (isVisible) {
        el.classList.add('revealed');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check
});
