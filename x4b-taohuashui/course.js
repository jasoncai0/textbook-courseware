'use strict';
/* 三月桃花水（略读）· 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：封面“听一听”铃铛声、春天的竖琴（拨三根弦，一弦一种水声）、春天的明镜（上下倒影）。
 * 声音用 Web Audio 现场合成，没有音频文件；浏览器不支持时静默跳过。
 */

let audio = null;
function tone(freq, at, dur, type = 'sine', vol = 0.25) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const t = audio.currentTime + at;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + dur);
  } catch (e) { /* 没有声音也不影响上课 */ }
}

/* 封面：一串小铃铛 */
const BELLS = [1568, 1760, 2093, 1760, 2349, 2093];
function initBell() {
  document.getElementById('coverBell').addEventListener('click', () => {
    BELLS.forEach((f, i) => tone(f, i * 0.16, 0.9, 'sine', 0.15));
  });
}

/* 竖琴：三根弦（音高、拨弦节奏各不同） */
const STRINGS = [
  { notes: [196, 262, 196, 330], gap: 0.22 },   // 忽大忽小的水声
  { notes: [523, 587, 523], gap: 0.35 },        // 纤细的低语
  { notes: [1047, 1319, 1047, 1319], gap: 0.12 }, // 叮当声
];
function initHarp() {
  const svg = document.getElementById('harp');
  const lines = document.getElementById('harpLines');
  svg.addEventListener('click', (e) => {
    const hit = e.target.closest('[data-s]');
    if (!hit) return;
    const i = +hit.dataset.s;
    STRINGS[i].notes.forEach((f, k) => tone(f, k * STRINGS[i].gap, 1.2, 'triangle', i === 1 ? 0.12 : 0.22));
    const str = svg.querySelector(`line[data-s="${i}"]`);
    str.classList.remove('pluck');
    void str.getBoundingClientRect(); // 重新触发振动动画
    str.classList.add('pluck');
    lines.querySelectorAll('p').forEach((p) => p.classList.toggle('on', +p.dataset.s === i));
  });
}

/* 明镜：它看见…… */
const MIRROR = [
  { pos: '50% 15%', t: '它看见燕子飞过天空，翅膀上裹着白云；' },
  { pos: '15% 40%', t: '它看见垂柳披上了长发，如雾如烟；' },
  { pos: '60% 70%', t: '它看见一群姑娘来到河边，水底立刻浮起一朵朵红莲，她们捧起了水，像抖落一片片花瓣……' },
];
function initMirror() {
  const up = document.querySelector('#mirror .m-up');
  const down = document.querySelector('#mirror .m-down');
  const text = document.getElementById('mText');
  document.getElementById('mBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-m]');
    if (!b) return;
    const m = MIRROR[+b.dataset.m];
    document.querySelectorAll('#mBtns .btn').forEach((x) => x.classList.toggle('solid', x === b));
    [up, down].forEach((el) => { el.style.backgroundPosition = m.pos; el.style.backgroundSize = '220%'; });
    text.textContent = m.t;
  });
}

/* 比喻还是拟人 */
const SORT = [
  { s: '像一串小铃铛，轻轻地走过村边', ok: ['比喻', '拟人'], q: '像铃铛（比喻），会“走”（拟人）' },
  { s: '像一匹明洁的丝绸，映照着蓝天', ok: ['比喻'], q: '河水像丝绸' },
  { s: '啊，河流醒来了！', ok: ['拟人'], q: '河流像人一样“醒来”' },
  { s: '舞动着绮丽的朝霞，向前流啊', ok: ['拟人'], q: '河水会“舞动”' },
  { s: '有一万个小酒窝，在水中回旋', ok: ['比喻'], q: '小漩涡像酒窝' },
  { s: '三月的桃花水，是春天的竖琴', ok: ['比喻'], q: '桃花水就是竖琴' },
  { s: '那纤细的低语，是在和……麦苗谈心', ok: ['拟人'], q: '河水会“谈心”' },
  { s: '它看见垂柳披上了长发，如雾如烟', ok: ['拟人', '比喻'], q: '河水会“看见”，柳丝如雾如烟' },
  { s: '地上草如茵，两岸柳如眉', ok: ['比喻'], q: '草像垫子，柳叶像眉毛' },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['比喻', '拟人'] });
    initBell();
    initHarp();
    initMirror();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
