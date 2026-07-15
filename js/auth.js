document.addEventListener('DOMContentLoaded', () => {
  const btnLogin = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');
  const boxLogin = document.getElementById('box-login');
  const boxRegister = document.getElementById('box-register');

  // URL Params Logic
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');

  const toggleGroup = document.getElementById('toggle-group');

  const setMode = (targetMode) => {
    if (targetMode === 'register') {
      btnRegister.classList.add('active');
      btnLogin.classList.remove('active');
      boxRegister.classList.add('active');
      boxLogin.classList.remove('active');
      toggleGroup.classList.add('register-active');
    } else {
      btnLogin.classList.add('active');
      btnRegister.classList.remove('active');
      boxLogin.classList.add('active');
      boxRegister.classList.remove('active');
      toggleGroup.classList.remove('register-active');
    }
  };

  if (mode === 'register') setMode('register');

  btnLogin.addEventListener('click', () => setMode('login'));
  btnRegister.addEventListener('click', () => setMode('register'));

  // GSAP Motion Design
  const tl = gsap.timeline();
  tl.to(".visual-content > *", {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    delay: 0.2
  });
  tl.fromTo(".form-box", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.8 }, "-=0.5");
});
