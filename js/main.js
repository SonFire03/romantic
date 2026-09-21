'use strict';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)');

function setPersonalText() {
  $$('[data-girlfriend]').forEach(el => { el.textContent = LOVE_CONFIG.girlfriendName || 'mon amour'; });
  $$('[data-boyfriend]').forEach(el => { el.textContent = LOVE_CONFIG.boyfriendName || 'moi'; });
  $$('[data-main-message]').forEach(el => { el.textContent = LOVE_CONFIG.mainMessage || 'Je t’aime ❤️'; });
  $$('[data-final-question]').forEach(el => { el.textContent = LOVE_CONFIG.finalQuestion || 'Tu veux être ma copine pour la vie ?'; });
  document.title = `Une affaire de cœur — pour ${LOVE_CONFIG.girlfriendName || 'toi'} 💗`;
}

let toastTimeout;
function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('is-visible'), 3200);
}

function revealOnScroll() {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    $$('[data-reveal]').forEach(el => el.classList.add('is-visible'));
    startCounter();
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -30px 0px' });
  $$('[data-reveal]').forEach(el => observer.observe(el));

  const counterObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      startCounter();
      counterObserver.disconnect();
    }
  }, { threshold: .25 });
  counterObserver.observe($('#compteur'));
}

function updateReadingProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  $('#reading-progress').style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
}

let counterTimer;
function startCounter() {
  clearTimeout(counterTimer);
  const values = [10, 25, 47, 89, 100, 143, 482, 999, 9999];
  const number = $('#love-value');
  const bar = $('#love-bar');
  const message = $('#counter-message');
  const machine = $('.counter-machine');
  machine.classList.remove('is-error', 'is-infinite');
  if (reducedMotion.matches) {
    number.textContent = '∞ %';
    bar.style.width = '100%';
    message.textContent = 'Bon… on va dire ∞ %. La physique a abandonné.';
    return;
  }
  number.textContent = '0 %';
  bar.style.width = '0%';
  message.textContent = 'Analyse des sentiments en cours…';
  let index = 0;
  const step = () => {
    if (index < values.length) {
      const value = values[index++];
      number.textContent = `${value} %`;
      bar.style.width = `${Math.min(value, 100)}%`;
      if (value > 100) message.textContent = 'Hum… il y a un problème avec les unités.';
      counterTimer = setTimeout(step, value >= 999 ? 700 : 450);
    } else {
      number.textContent = 'ERR !';
      message.textContent = 'ERREUR : valeur supérieure aux limites autorisées par la physique.';
      machine.classList.add('is-error');
      counterTimer = setTimeout(() => {
        machine.classList.remove('is-error');
        machine.classList.add('is-infinite');
        number.textContent = '∞ %';
        message.textContent = 'Bon… on va dire ∞ %.';
      }, 1650);
    }
  };
  counterTimer = setTimeout(step, 300);
}

const quiz = [
  { question: 'Selon toi, qui est la plus belle fille du monde ?', answers: ['Toi', 'Toi, évidemment', 'Encore toi', 'Mauvaise question : c’est toi'] },
  { question: 'Qui est responsable de mon addiction aux câlins ?', answers: ['Toi', 'La personne qui lit ceci', 'Toi, en version câline', 'Une certaine fille incroyable'] },
  { question: 'Qui occupe environ 93 % de mes pensées ?', answers: ['Toi', 'Toi avec un café', 'Toi sans café', 'Toujours toi'] },
  { question: 'Qui mérite officiellement 14 827 bisous ?', answers: ['Toi', 'Toi × 14 827', 'La reine de ce quiz (toi)', 'Encore et toujours toi'] }
];
let quizIndex = 0;
let quizAnswered = false;
function renderQuiz() {
  const item = quiz[quizIndex];
  quizAnswered = false;
  $('#quiz-progress').textContent = `QUESTION ${String(quizIndex + 1).padStart(2, '0')} / ${String(quiz.length).padStart(2, '0')}`;
  $('#quiz-question').textContent = item.question;
  $('#quiz-feedback').textContent = '';
  $('#quiz-next').hidden = true;
  const answers = $('#quiz-answers');
  answers.replaceChildren();
  item.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-option';
    const letter = document.createElement('span');
    letter.className = 'option-letter';
    letter.textContent = 'ABCD'[index];
    button.append(letter, document.createTextNode(answer));
    button.addEventListener('click', () => {
      if (quizAnswered) return;
      quizAnswered = true;
      button.classList.add('is-selected');
      $$('.quiz-option').forEach(option => { option.disabled = true; });
      $('#quiz-feedback').textContent = quizIndex === quiz.length - 1 ? 'Bonne réponse 😌❤️ Diplôme officiel obtenu !' : 'Bonne réponse 😌❤️';
      const next = $('#quiz-next');
      next.textContent = quizIndex === quiz.length - 1 ? 'Rejouer le quiz ↻' : 'Question suivante →';
      next.hidden = false;
    });
    answers.append(button);
  });
}

function burst(layer, count, symbols, x = 50, y = 55) {
  if (reducedMotion.matches) return;
  for (let i = 0; i < count; i++) {
    const part = document.createElement('span');
    part.className = 'burst';
    part.textContent = symbols[i % symbols.length];
    part.style.setProperty('--x', `${x + (Math.random() - .5) * 20}%`);
    part.style.setProperty('--y', `${y + (Math.random() - .5) * 14}%`);
    part.style.setProperty('--size', `${1.1 + Math.random() * 1.4}rem`);
    part.style.setProperty('--drift', `${(Math.random() - .5) * 150}px`);
    layer.append(part);
    setTimeout(() => part.remove(), 1500);
  }
}

let kisses = 0;
function sendKiss() {
  kisses++;
  $('#kiss-count').textContent = `Bisous envoyés : ${kisses}`;
  const milestones = { 10: 'Ça commence à faire beaucoup de bisous.', 25: 'Toujours là ? 😭', 50: 'Techniquement tu me dois maintenant 50 bisous.', 100: 'Bon. J’espère que tu as prévu ton après-midi.' };
  $('#kiss-message').textContent = milestones[kisses] || (kisses % 5 === 0 ? 'MWAH 💋 Encore un pour la route !' : 'MWAH 💋');
  burst($('#kiss-burst'), 7, ['♥', '💋', '♡'], 50, 60);
}

let hugTimeout;
function sendHug() {
  const mascots = $('#hug-mascots');
  mascots.classList.remove('is-hugging');
  void mascots.offsetWidth;
  mascots.classList.add('is-hugging');
  $('#hug-message').textContent = 'Câlin envoyé avec succès. Temps de livraison estimé : immédiatement dès que je te vois.';
  burst($('#hug-burst'), 12, ['♥', '♡', '✨'], 45, 30);
  clearTimeout(hugTimeout);
  hugTimeout = setTimeout(() => mascots.classList.remove('is-hugging'), 1600);
}

function showProposal() {
  const section = $('#question-finale');
  section.hidden = false;
  section.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  setTimeout(() => $('#yes-button').focus({ preventScroll: true }), reducedMotion.matches ? 0 : 650);
}

function celebrate(count = 110) {
  if (reducedMotion.matches) return;
  const layer = $('#confetti-layer');
  const colors = ['#e65b8a', '#ffb7cf', '#c7a9e6', '#f4b891', '#fff9fa', '#d87fa9'];
  const total = Math.min(count, 150);
  for (let i = 0; i < total; i++) {
    const part = document.createElement('span');
    part.className = 'confetti-piece' + (i % 6 === 0 ? ' is-heart' : '');
    if (i % 6 === 0) part.textContent = '♥';
    part.style.setProperty('--x', `${Math.random() * 100}%`);
    part.style.setProperty('--size', `${7 + Math.random() * 13}px`);
    part.style.setProperty('--color', colors[i % colors.length]);
    part.style.setProperty('--duration', `${3 + Math.random() * 3}s`);
    part.style.setProperty('--rotate', `${Math.random() * 360}deg`);
    part.style.setProperty('--drift', `${(Math.random() - .5) * 220}px`);
    part.style.animationDelay = `${Math.random() * 1.8}s`;
    layer.append(part);
    setTimeout(() => part.remove(), 8500);
  }
}

function showResult(which) {
  $('#proposal-content').hidden = true;
  const result = $(`#${which}-result`);
  result.hidden = false;
  result.focus({ preventScroll: true });
  if (which === 'yes') celebrate();
}

let noAttempts = 0;
const noLabels = ['🙄 Non', 'T’es sûre ? 😭', 'Genre vraiment ?', 'Je vais pleurer là', 'Ce bouton est manifestement cassé', 'Bon clique sur oui stp 😭'];
function nextNoLabel() {
  noAttempts++;
  $('#no-button').textContent = noLabels[Math.min(noAttempts, noLabels.length - 1)];
  $('#honest-no').hidden = false;
  $('#no-hint').textContent = 'Ton choix reste possible : « Je choisis vraiment non ».';
}

function addPersonalContent() {
  const section = $('#nos-souvenirs');
  const content = $('#personal-content');
  const addCard = (title, text, src, link) => {
    const card = document.createElement('article');
    card.className = 'personal-item';
    if (src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = title || 'Un de nos souvenirs';
      img.loading = 'lazy';
      card.append(img);
    }
    const heading = document.createElement('h3');
    heading.textContent = title || 'Un souvenir';
    card.append(heading);
    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      card.append(p);
    }
    if (link) {
      const a = document.createElement('a');
      a.href = link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'Écouter notre chanson ↗';
      card.append(a);
    }
    content.append(card);
  };
  if (LOVE_CONFIG.startDate) {
    const date = new Date(`${LOVE_CONFIG.startDate}T12:00:00`);
    if (!Number.isNaN(date.valueOf())) addCard('Notre rencontre', date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }));
  }
  for (const item of LOVE_CONFIG.photos || []) addCard(item.title, item.caption, item.src);
  if (LOVE_CONFIG.song?.title && LOVE_CONFIG.song?.url) addCard(LOVE_CONFIG.song.title, 'La bande-son de notre histoire.', null, LOVE_CONFIG.song.url);
  for (const group of ['memories', 'privateJokes', 'travels']) for (const item of LOVE_CONFIG[group] || []) addCard(item.title, item.text);
  for (const item of LOVE_CONFIG.futurePhotos || []) addCard(item.title, item.caption, item.src);
  section.hidden = content.childElementCount === 0;
}

let secretClicks = 0;
let mascotClicks = 0;
const mascotPhrases = ['psst… je t’aime !', 'hihi 🌸', 'encore ? 🥺', 'je rougis !', 'bisou ! 💋'];
const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
function initEasterEggs() {
  $('#secret-heart').addEventListener('click', () => {
    secretClicks++;
    if (secretClicks === 5) toast('Tu cherches quelque chose ? 👀');
    else if (secretClicks === 10) toast('Arrête de maltraiter ce pauvre cœur 😭');
    else if (secretClicks > 10 && secretClicks % 5 === 0) toast('Bon, tu as gagné : ♥ ♥ ♥');
  });
  $('#mascot').addEventListener('click', () => {
    mascotClicks++;
    $('#mascot-speech').textContent = mascotPhrases[mascotClicks % mascotPhrases.length];
    if (mascotClicks === 5) toast('La mascotte t’a officiellement adoptée. 🧸');
    burst($('.hero-art'), 5, ['♥', '✦'], 52, 45);
  });
  document.addEventListener('keydown', event => {
    if (event.key === konami[konamiIndex] || event.key.toLowerCase() === konami[konamiIndex]) konamiIndex++;
    else konamiIndex = event.key === konami[0] ? 1 : 0;
    if (konamiIndex === konami.length) {
      konamiIndex = 0;
      toast('MODE AMOUR MAXIMUM ACTIVÉ 💗');
      showProposal();
      setTimeout(() => celebrate(150), reducedMotion.matches ? 0 : 650);
    }
  });
}

function initCursor() {
  if (!finePointer.matches || reducedMotion.matches) return;
  const cursor = $('#love-cursor');
  document.addEventListener('pointermove', event => {
    cursor.style.left = `${event.clientX + 15}px`;
    cursor.style.top = `${event.clientY + 17}px`;
    cursor.classList.add('is-active');
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
}

function init() {
  setPersonalText();
  addPersonalContent();
  revealOnScroll();
  updateReadingProgress();
  window.addEventListener('scroll', updateReadingProgress, { passive: true });
  $('#counter-replay').addEventListener('click', startCounter);
  $$('.reason-card').forEach(card => card.addEventListener('click', () => {
    const selected = card.getAttribute('aria-pressed') === 'true';
    card.setAttribute('aria-pressed', String(!selected));
    if (!selected) burst(card, 4, ['♥', '♡'], 80, 76);
  }));
  renderQuiz();
  $('#quiz-next').addEventListener('click', () => { quizIndex = (quizIndex + 1) % quiz.length; renderQuiz(); $('#quiz-question').focus(); });
  $('#kiss-button').addEventListener('click', sendKiss);
  $('#hug-button').addEventListener('click', sendHug);
  $('#continue-button').addEventListener('click', showProposal);
  $('#yes-button').addEventListener('click', () => showResult('yes'));
  $('#no-button').addEventListener('pointerenter', () => {
    if (!finePointer.matches || noAttempts >= 3) return;
    const shift = noAttempts % 2 ? -12 : 12;
    $('#no-button').style.transform = `translateX(${shift}px)`;
    setTimeout(() => { $('#no-button').style.transform = ''; }, 450);
  });
  $('#no-button').addEventListener('click', () => {
    if (noAttempts >= 5) showResult('no');
    else nextNoLabel();
  });
  $('#honest-no').addEventListener('click', () => showResult('no'));
  $('#back-to-question').addEventListener('click', () => {
    $('#no-result').hidden = true;
    $('#proposal-content').hidden = false;
    $('#yes-button').focus({ preventScroll: true });
  });
  $('#celebrate-again').addEventListener('click', () => celebrate());
  initEasterEggs();
  initCursor();
}

document.addEventListener('DOMContentLoaded', init);
