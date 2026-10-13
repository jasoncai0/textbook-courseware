'use strict';
/* 雷雨 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 天气时间滑块——8 个自然段排在一条时间线上，拖到哪儿，画面（三张同构图的图交替）、
 *          动效（乌云、风、闪电、雨、彩虹）、声音（WebAudio 合成风声雨声雷声蛙鸣）和课文一起变；
 *          ② 声音导入封面；③ 压/垂/挂 动作卡；④ 四种雨；⑤ 雨后彩虹识字游戏。 */

/* 二下课文只给生字注音：data-pyk="脱:tuō 袄:ǎo" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 声音：白噪声过滤出风声、雨声，低频爆发是雷声，正弦扫频是蛙鸣蝉叫 ================= */
const Sound = (() => {
  let ac = null;
  let wind = null;
  let rain = null;
  const AC = window.AudioContext || window.webkitAudioContext;
  function noiseSource() {
    const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i += 1) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    return src;
  }
  function chain(type, freq) {
    const src = noiseSource();
    const f = ac.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const g = ac.createGain();
    g.gain.value = 0;
    src.connect(f).connect(g).connect(ac.destination);
    src.start();
    return g;
  }
  function start() {
    if (!AC) return false;
    if (!ac) {
      ac = new AC();
      wind = chain('lowpass', 500);
      rain = chain('highpass', 1800);
    }
    if (ac.state === 'suspended') ac.resume();
    return true;
  }
  function level(w, r) {
    if (!ac) return;
    wind.gain.setTargetAtTime(w, ac.currentTime, 0.6);
    rain.gain.setTargetAtTime(r, ac.currentTime, 0.6);
  }
  function thunder(delay = 0) {
    if (!ac) return;
    const src = noiseSource();
    const f = ac.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 140;
    const g = ac.createGain();
    const t = ac.currentTime + delay;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(1.6, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
    src.connect(f).connect(g).connect(ac.destination);
    src.start(t);
    src.stop(t + 2.4);
  }
  function croak(delay = 0, hi = false) {
    if (!ac) return;
    const o = ac.createOscillator();
    const g = ac.createGain();
    const t = ac.currentTime + delay;
    o.type = hi ? 'sine' : 'sawtooth';
    o.frequency.setValueAtTime(hi ? 4200 : 180, t);
    o.frequency.linearRampToValueAtTime(hi ? 4600 : 120, t + (hi ? 0.5 : 0.18));
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(hi ? 0.04 : 0.12, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (hi ? 0.5 : 0.2));
    o.connect(g).connect(ac.destination);
    o.start(t);
    o.stop(t + 0.6);
  }
  const off = () => level(0, 0);
  return { start, level, thunder, croak, off, get on() { return !!ac && ac.state === 'running'; } };
})();

/* 第 p 段（0–7）的声音：风、雨的音量，要不要打雷、蛙叫 */
const SOUND_AT = [
  { w: 0.04, r: 0 }, { w: 0.35, r: 0 }, { w: 0.15, r: 0.02, th: 1 }, { w: 0.1, r: 0.12, th: 1 },
  { w: 0.08, r: 0.3 }, { w: 0.02, r: 0.06 }, { w: 0, r: 0 }, { w: 0, r: 0, frog: 1 },
];
let soundOn = false;
function playFor(p) {
  if (!soundOn) return;
  const s = SOUND_AT[p];
  Sound.level(s.w, s.r);
  if (s.th) { Sound.thunder(0.3); Sound.thunder(2.6); }
  if (s.frog) [0, 0.5, 1.4, 1.9, 2.8].forEach((t, k) => Sound.croak(t, k % 2 === 1));
}

/* ================= 封面：听一听 ================= */
const listen = document.getElementById('lyListen');
if (listen) {
  listen.addEventListener('click', () => {
    if (!Sound.start()) { listen.textContent = '这台设备放不出声音，请老师学一学雷声'; return; }
    Sound.level(0.12, 0.25);
    Sound.thunder(0.4);
    Sound.thunder(3);
    setTimeout(Sound.off, 5200);
  });
}

/* ================= 天气时间滑块 ================= */
function buildFx(svg) {
  const drops = Array.from({ length: 70 }, (_, i) => {
    const x = (i * 53) % 820;
    const y = (i * 97) % 450;
    return `<path d="M${x} ${y}l-10 34" style="animation-delay:${((i * 37) % 100) / 100}s"/>`;
  }).join('');
  svg.innerHTML = `
    <g class="fx-cloud"><ellipse cx="160" cy="30" rx="220" ry="70"/><ellipse cx="460" cy="10" rx="260" ry="80"/><ellipse cx="720" cy="36" rx="200" ry="70"/></g>
    <g class="fx-wind"><path d="M-40 120q80 -30 160 0t160 0"/><path d="M60 200q80 -30 160 0t160 0"/><path d="M-20 280q80 -30 160 0t160 0"/></g>
    <g class="fx-spider"><path class="fx-thread" d="M150 60V160"/><g class="fx-sp"><circle cx="150" cy="166" r="8"/><path d="M142 162l-9 -6M142 168l-10 2M158 162l9 -6M158 168l10 2"/></g></g>
    <path class="fx-bolt" d="M520 0L470 120H520L460 260L590 100H530L580 0Z"/>
    <rect class="fx-flash" width="800" height="450"/>
    <g class="fx-rain">${drops}</g>
    <rect class="fx-fog" width="800" height="450"/>
    <g class="fx-bow" fill="none" stroke-width="12">${['#e8455a', '#f59a3a', '#f2d23a', '#5ab45a', '#4a8fd6', '#7a5ac6'].map((c, k) => `<path d="M${180 + k * 12} 330A${230 - k * 12} ${200 - k * 12} 0 0 1 ${640 - k * 12} 330" stroke="${c}"/>`).join('')}</g>
    <g class="fx-notes"><text x="560" y="380">♪</text><text x="610" y="350">♫</text><text x="300" y="150">♪</text></g>`;
}
const stage = document.getElementById('lyStage');
const lyRange = document.getElementById('lyRange');
const paras = document.getElementById('lyParas');
function setTime(p, sound = true) {
  stage.dataset.p = p;
  lyRange.value = p;
  paras.querySelectorAll('p').forEach((el, k) => el.classList.toggle('now', k === p));
  const now = paras.querySelectorAll('p')[p];
  paras.scrollTop = now.offsetTop - paras.offsetTop - paras.clientHeight / 2 + now.clientHeight / 2;
  if (sound) playFor(p);
}
if (stage) {
  buildFx(document.getElementById('lyFx'));
  lyRange.addEventListener('input', () => setTime(+lyRange.value));
  paras.addEventListener('click', (e) => {
    const p = e.target.closest('p');
    if (p) setTime([...paras.children].indexOf(p));
  });
  const btn = document.getElementById('lySound');
  btn.addEventListener('click', () => {
    soundOn = !soundOn;
    if (soundOn && !Sound.start()) { soundOn = false; btn.textContent = '这台设备没有声音'; return; }
    btn.textContent = soundOn ? '🔊 关掉声音' : '🔇 打开声音';
    if (soundOn) playFor(+stage.dataset.p); else Sound.off();
  });
}

/* ================= 分一分：雷雨前、中、后 ================= */
const SORT = [
  ['乌云黑沉沉地压下来', 0], ['叶子一动不动', 0], ['蝉一声也不出', 0], ['大风吹得树枝乱摆', 0], ['蜘蛛垂下来，逃走了', 0],
  ['闪电越来越亮', 1], ['雷声越来越响', 1], ['雨越下越大', 1], ['树和房子都看不清了', 1],
  ['清新的空气迎面扑来', 2], ['彩虹挂在天空', 2], ['蜘蛛又坐在网上', 2], ['青蛙叫起来了', 2],
];
const COLS = ['雷雨前', '雷雨中', '雷雨后'];
function initSort(box) {
  const order = SORT.map((_, i) => i).sort((a, b) => ((a * 7) % 13) - ((b * 7) % 13));
  box.innerHTML = `<div class="ly-pool">${order.map((i) => `<button type="button" class="ly-card" data-i="${i}">${SORT[i][0]}</button>`).join('')}</div>
    <div class="ly-cols">${COLS.map((c, k) => `<div class="ly-col c${k}" data-c="${k}"><b>${c}</b><div class="ly-in"></div></div>`).join('')}</div>`;
  let sel = null;
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.ly-card');
    if (card && card.closest('.ly-pool')) {
      sel = card;
      box.querySelectorAll('.ly-card').forEach((c) => c.classList.toggle('sel', c === sel));
      return;
    }
    const col = e.target.closest('.ly-col');
    if (!col || !sel) return;
    if (SORT[+sel.dataset.i][1] !== +col.dataset.c) { col.classList.remove('no'); void col.offsetWidth; col.classList.add('no'); return; }
    sel.classList.remove('sel');
    col.querySelector('.ly-in').append(sel);
    sel = null;
    if (!box.querySelector('.ly-pool .ly-card')) box.classList.add('all');
  });
}
const sortBox = document.getElementById('lySort');
if (sortBox) initSort(sortBox);

/* ================= 压 / 垂 / 挂；四种雨：点一下重放动画 ================= */
document.querySelectorAll('.ly-w, .ly-rain').forEach((btn) => btn.addEventListener('click', () => {
  btn.classList.remove('play'); void btn.offsetWidth; btn.classList.add('play');
}));

/* ================= 识字游戏：雨后彩虹 ================= */
const BOW_Q = [
  { q: 'yā', ans: '压', opts: ['历', '压', '庄'] },
  { q: 'chán', ans: '蝉', opts: ['蝉', '弹', '单'] },
  { q: 'chuí', ans: '垂', opts: ['睡', '锤', '垂'] },
  { q: 'huā', ans: '哗', opts: ['华', '哗', '桦'] },
  { q: 'hù', ans: '户', opts: ['户', '尸', '房'] },
  { q: 'pū', ans: '扑', opts: ['朴', '补', '扑'] },
  { q: 'léi', ans: '雷', opts: ['雷', '雪', '雾'] },
];
const BOW_C = ['#e8455a', '#f59a3a', '#f2d23a', '#5ab45a', '#3fb5c6', '#4a8fd6', '#7a5ac6'];
function initBow(box) {
  let i = 0;
  let busy = false;
  box.innerHTML = `<svg class="ly-bowsvg" viewBox="0 0 600 320" aria-hidden="true">${BOW_C.map((c, k) => `<path class="ly-band" d="M${40 + k * 18} 310A${260 - k * 18} ${260 - k * 18} 0 0 1 ${560 - k * 18} 310" style="--c:${c}"/>`).join('')}</svg><div class="ly-gask"></div>`;
  const ask = box.querySelector('.ly-gask');
  const bands = [...box.querySelectorAll('.ly-band')];
  const show = () => {
    const it = BOW_Q[i];
    ask.innerHTML = `<p class="ly-q hz-latin">${it.q}</p>
      <div class="ly-opts">${it.opts.map((o) => `<button type="button" class="ly-opt" data-o="${o}">${o}</button>`).join('')}</div>
      <p class="ly-msg">${i ? '' : '哪个字读这个音？'}</p>`;
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { i = 0; bands.forEach((b) => b.classList.remove('lit')); show(); return; }
    const opt = e.target.closest('.ly-opt');
    if (!opt || busy) return;
    const msg = box.querySelector('.ly-msg');
    if (opt.dataset.o !== BOW_Q[i].ans) {
      opt.classList.remove('wrong'); void opt.offsetWidth; opt.classList.add('wrong');
      msg.textContent = '再看看，这个字不读这个音';
      return;
    }
    busy = true;
    opt.classList.add('right');
    bands[i].classList.add('lit');
    msg.textContent = `画上一道颜色！${BOW_Q[i].ans}（${BOW_Q[i].q}）`;
    setTimeout(() => {
      i += 1;
      if (i < BOW_Q.length) { show(); return; }
      ask.innerHTML = '<p class="ly-q">一条彩虹挂在天空！</p><button type="button" class="btn solid" data-again>再画一次</button>';
    }, 1100);
  });
  show();
}
const bow = document.getElementById('lyBow');
if (bow) initBow(bow);

Hanzi.init({
  cards: [
    { z: '压', py: 'yā', words: [['压下来', 'yā xià lái'], ['压力', 'yā lì']] },
    { z: '蝉', py: 'chán', words: [['蝉叫了', 'chán jiào le'], ['蝉鸣', 'chán míng']] },
    { z: '垂', py: 'chuí', words: [['垂下来', 'chuí xià lái'], ['垂柳', 'chuí liǔ']] },
    { z: '哗', py: 'huā', words: [['哗哗', 'huā huā']] },
    { z: '户', py: 'hù', words: [['窗户', 'chuāng hù'], ['门户', 'mén hù']] },
    { z: '扑', py: 'pū', words: [['扑来', 'pū lái'], ['扑面', 'pū miàn']] },
  ],
  write: {
    a: [
      { z: '雷', py: 'léi', bs: '雨', bh: 13 },
      { z: '乌', py: 'wū', bh: 4 },
      { z: '黑', py: 'hēi', bs: '黑', bh: 12 },
      { z: '压', py: 'yā', bs: '厂', bh: 6 },
      { z: '垂', py: 'chuí', bh: 8 },
    ],
    b: [
      { z: '户', py: 'hù', bs: '户', bh: 4 },
      { z: '新', py: 'xīn', bs: '斤', bh: 13 },
      { z: '迎', py: 'yíng', bs: '辶', bh: 7 },
      { z: '扑', py: 'pū', bs: '扌', bh: 5 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (stage && slide.contains(stage)) setTime(Math.min(step, 7));
    else if (soundOn) Sound.off();
  },
};
