'use strict';
/* 课本插件 · 通用翻页引擎
 * 用法：页面先加载本课 course.js（定义 window.LESSON = { init, onRender }），再加载本文件。
 * 约定：.slide 为一页；页内 [data-step=n] 第 n 步出现；.media-btn[data-img|data-video] 素材存在才显示；
 *       .note 为教师提示（N 键）；[data-noswipe] 区域内不触发滑动翻页。
 */
const LESSON = window.LESSON || {};

/* ================= 实景 / 想象图：素材存在才显示按钮 ================= */
// 检查素材是否存在，存在才显示按钮。由 loadMediaNear 在翻到附近时调用，避免一打开就下载全部素材
function probeMedia(btn) {
  if (btn.dataset.probed) return;
  btn.dataset.probed = '1';
  if (btn.dataset.audio) {
    const au = new Audio();
    au.preload = 'metadata';
    au.onloadedmetadata = () => { btn.hidden = false; };
    au.src = btn.dataset.audio;
    btn.audio = au;
    return;
  }
  const img = new Image();
  img.onload = () => { btn.hidden = false; };
  img.src = btn.dataset.img;
  if (btn.dataset.video) {
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => { btn.dataset.hasVideo = '1'; btn.hidden = false; };
    v.src = btn.dataset.video;
  }
}

function initMedia() {
  document.querySelectorAll('.media-btn').forEach((btn) => {
    if (btn.dataset.audio) {
      // 音频（如乐曲录音）：点击播放 / 暂停，不开灯箱
      btn.addEventListener('click', () => {
        const au = btn.audio;
        if (!au) return;
        if (au.paused) au.play(); else au.pause();
        btn.classList.toggle('playing', !au.paused);
      });
      return;
    }
    btn.addEventListener('click', () => openLightbox(btn));
  });
  document.getElementById('lbClose').onclick = closeLightbox;
}

function openLightbox(btn) {
  const media = document.getElementById('lbMedia');
  media.innerHTML = btn.dataset.hasVideo
    ? `<video src="${btn.dataset.video}" controls autoplay muted loop poster="${btn.dataset.img}"></video>`
    : `<img src="${btn.dataset.img}" alt="${btn.textContent}">`;
  document.getElementById('lbCap').textContent = btn.dataset.cap || '';
  document.getElementById('lightbox').classList.add('open');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.getElementById('lbMedia').innerHTML = '';
}

/* ================= 翻页引擎：页内分步 + 页间转场 ================= */
const slides = [...document.querySelectorAll('.slide')];
// 在课程 init 之后统计（init 里可能生成带 data-step 的元素）
let maxSteps = [];
const countSteps = () => slides.map((s) => Math.max(0, ...[...s.querySelectorAll('[data-step]')].map((e) => +e.dataset.step)));
let cur = 0;
let step = 0;

function countUp(el) {
  const target = +el.dataset.count;
  const start = performance.now();
  const DURATION = 1200;
  const tick = (now) => {
    const p = Math.min(1, (now - start) / DURATION);
    el.textContent = Math.round(target * (1 - (1 - p) ** 3));
    if (p < 1 && el.dataset.running === '1') requestAnimationFrame(tick);
  };
  el.dataset.running = '1';
  requestAnimationFrame(tick);
}

function render() {
  loadMediaNear(cur);
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === cur);
    s.classList.toggle('past', i < cur);
  });
  const slide = slides[cur];
  slide.querySelectorAll('[data-step]').forEach((el) => {
    const on = +el.dataset.step <= step;
    el.classList.toggle('on', on);
    el.querySelectorAll('[data-count]').forEach((c) => {
      if (on && c.dataset.running !== '1') countUp(c);
      if (!on) { c.dataset.running = '0'; c.textContent = '0'; }
    });
  });
  if (LESSON.onRender) LESSON.onRender(slide, step);
  document.querySelectorAll('#progress i').forEach((d, i) => {
    d.classList.toggle('cur', i === cur);
    d.classList.toggle('done', i < cur);
  });
  document.getElementById('pageno').textContent = `${cur + 1} / ${slides.length}`;
  document.getElementById('next').classList.toggle('more', step < maxSteps[cur]);
  try { history.replaceState(null, '', `#${cur + 1}`); } catch (e) { /* file:// 下可能不允许，忽略即可 */ }
}

function go(i, s) {
  cur = Math.max(0, Math.min(slides.length - 1, i));
  step = s === 'end' ? maxSteps[cur] : Math.max(0, Math.min(maxSteps[cur], Number(s) || 0));
  slides[cur].scrollTop = 0;
  document.getElementById('frame').classList.remove('scrolled');
  render();
}

const isPhoneLayout = window.matchMedia('(max-width: 820px), (max-height: 520px)');

// 手机单栏布局下，分步出现的内容可能在屏幕外，滚过去让学生看到
function revealStep() {
  if (!isPhoneLayout.matches) return;
  const slide = slides[cur];
  const el = slide.querySelector(`[data-step="${step}"]:not(.mark)`) || slide.querySelector(`[data-step="${step}"]`);
  if (el) (el.closest('svg') || el).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function next() { if (step < maxSteps[cur]) { step += 1; render(); revealStep(); } else if (cur < slides.length - 1) go(cur + 1, 0); }
function prev() { if (step > 0) { step -= 1; render(); } else if (cur > 0) go(cur - 1, 'end'); }

// 每课都放在目录页的下一级（<课目录>/index.html），左下角给一个回目录的入口；
// 封面写着“五年级上册 · …”，回目录时带上 #五年级上册，直接落在这一册
const BOOK = ((document.querySelector('.cover-unit') || document.querySelector('.hd .tag') || {}).textContent || '').split('·')[0].trim();
// 非语文学科在页面里写 <meta name="subject" content="数学">，回目录时带上学科（各学科有同名册）
const SUBJECT = (document.querySelector('meta[name="subject"]') || {}).content;
const HOME = /(年级|高[一二三])[上下]册$/.test(BOOK) ? `../#${SUBJECT ? encodeURIComponent(SUBJECT) + '/' : ''}${encodeURIComponent(BOOK)}` : '../';
function addHomeLink() {
  const ctrl = document.querySelector('.ctrl');
  ctrl.insertAdjacentHTML('afterbegin', '<a class="nav home" href="' + HOME + '" title="返回目录（H）" aria-label="返回目录">目录</a>');
}

function initNav() {
  addHomeLink();
  document.getElementById('progress').innerHTML = slides.map(() => '<i></i>').join('');
  document.querySelectorAll('#progress i').forEach((d, i) => d.addEventListener('click', () => go(i, 0)));
  document.getElementById('next').onclick = next;
  document.getElementById('prev').onclick = prev;
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, select')) return;
    if (e.key === 'Escape') { closeLightbox(); return; }
    if (document.getElementById('lightbox').classList.contains('open')) return;
    const k = e.key;
    if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'h' || k === 'H') location.href = HOME;
    else if (k === 'Home') go(0, 0);
    else if (k === 'End') go(slides.length - 1, 'end');
    else if (k === 'n' || k === 'N') document.getElementById('frame').classList.toggle('show-notes');
    else if (k === 'f' || k === 'F') {
      if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen();
    }
  });
}

const SWIPE_MIN_PX = 50;
function initSwipe() {
  const frame = document.getElementById('frame');
  // 手机上页面往下滚后，加 scrolled 让各课把右上角的指示器（小地图等）收起来
  slides.forEach((s) => s.addEventListener('scroll', () => frame.classList.toggle('scrolled', s.scrollTop > 40), { passive: true }));
  let start = null;
  frame.addEventListener('touchstart', (e) => {
    const ignore = e.touches.length !== 1 || e.target.closest('input, .lightbox, [data-noswipe]');
    start = ignore ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  frame.addEventListener('touchend', (e) => {
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    start = null;
    // 横向为主才算翻页，纵向滑动留给页面滚动
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) next(); else prev();
  }, { passive: true });
}

/* 按需加载：页面打开时只加载当前页和下一页的背景图、视频，其余等翻到附近再加载（服务器带宽有限，一课有 6–10 MB 素材）。
 * 课件 HTML 里背景图写 data-bg="assets/x.jpg"，视频写 data-src / data-poster；脚本生成的 style 背景图也会被 deferMedia 转成按需。 */
const LOOKAHEAD = 1;
function deferMedia() {
  slides.forEach((s) => {
    s.querySelectorAll('[style*="background-image"]').forEach((el) => {
      const m = el.getAttribute('style').match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
      if (!m) return;
      el.dataset.bg = m[1];
      el.style.backgroundImage = 'none';
    });
    s.querySelectorAll('video[src]').forEach((v) => {
      v.dataset.src = v.getAttribute('src');
      v.removeAttribute('src');
      v.preload = 'none';
    });
  });
}
function loadMediaNear(i) {
  for (let k = Math.max(0, i - 1); k <= Math.min(slides.length - 1, i + LOOKAHEAD); k += 1) {
    slides[k].querySelectorAll('[data-bg]').forEach((el) => { el.style.backgroundImage = `url('${el.dataset.bg}')`; el.removeAttribute('data-bg'); });
    slides[k].querySelectorAll('video[data-src]').forEach((v) => {
      if (v.dataset.poster) v.poster = v.dataset.poster;
      v.src = v.dataset.src; v.removeAttribute('data-src'); v.preload = 'auto';
    });
    slides[k].querySelectorAll('.media-btn').forEach(probeMedia);
  }
}

function init() {
  if (LESSON.init) LESSON.init();
  maxSteps = countSteps();
  deferMedia(); // 放在课程 init 之后：课程脚本生成的卡片图片也一起按需加载
  initMedia();
  initNav();
  initSwipe();
  const fromHash = parseInt(location.hash.slice(1), 10);
  go(Number.isFinite(fromHash) ? fromHash - 1 : 0, 0);
}

init();
