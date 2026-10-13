'use strict';
/* 安塞腰鼓 · 本课专属互动：击鼓朗读（按标点分拍，句式决定鼓点快慢，可开鼓声）、四个“好一个”、仿写 */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- 鼓点朗读：bpm 0 表示静（不敲）；句子按标点切成拍 ---------- */
const DRUMS = [
  { s: '他们的神情沉稳而安静。紧贴在他们身体一侧的腰鼓，呆呆的，似乎从来不曾响过。', tag: '长句 · 静', bpm: 0 },
  { s: '一捶起来就发狠了，忘情了，没命了！', tag: '短句', bpm: 110 },
  { s: '骤雨一样，是急促的鼓点；旋风一样，是飞扬的流苏；乱蛙一样，是蹦跳的脚步；火花一样，是闪射的瞳仁；斗虎一样，是强健的风姿。', tag: '比喻 + 排比', bpm: 140 },
  { s: '这腰鼓，使冰冷的空气立即变得燥热了，使恬静的阳光立即变得飞溅了，使困倦的世界立即变得亢奋了。', tag: '排比', bpm: 120 },
  { s: '容不得束缚，容不得羁绊，容不得闭塞。是挣脱了、冲破了、撞开了的那么一股劲！', tag: '排比 · 短语', bpm: 150 },
  { s: '只听见隆隆，隆隆，隆隆。', tag: '反复 · 拟声', bpm: 130 },
  { s: '每一个舞姿都充满了力量。每一个舞姿都呼呼作响。每一个舞姿都是光和影的匆匆变幻。', tag: '排比', bpm: 160 },
  { s: '愈捶愈烈！形体成了沉重而又纷飞的思绪！愈捶愈烈！思绪中不存任何隐秘！', tag: '反复', bpm: 180 },
  { s: '交织！旋转！凝聚！奔突！辐射！翻飞！升华！', tag: '单词成句', bpm: 220 },
  { s: '当它戛然而止的时候，世界出奇地寂静，以至使人感到对她十分陌生了。', tag: '戛然而止', bpm: 0 },
];
const MAX_BPM = 220;

let audioCtx = null;
let soundOn = false;
function thump() {
  if (!soundOn) return;
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(50, t + 0.18);
  gain.gain.setValueAtTime(0.9, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + 0.26);
}

function initDrum() {
  const list = document.getElementById('drumList');
  const drum = document.getElementById('drum');
  const bar = document.getElementById('tempoBar');
  const num = document.getElementById('tempoNum');
  let timer = null;
  list.innerHTML = DRUMS.map((d, i) => {
    const beats = d.s.match(/[^，。！；、]+[，。！；、]*/g);
    return `<button type="button" class="dl" data-i="${i}"><small>${d.tag}</small>${beats.map((b) => `<span class="bt">${esc(b)}</span>`).join('')}</button>`;
  }).join('');
  const stop = () => { clearInterval(timer); drum.classList.remove('beat'); };
  list.addEventListener('click', (e) => {
    const row = e.target.closest('.dl');
    if (!row) return;
    stop();
    const d = DRUMS[+row.dataset.i];
    list.querySelectorAll('.dl').forEach((x) => x.classList.toggle('sel', x === row));
    const beats = [...row.querySelectorAll('.bt')];
    beats.forEach((b) => b.classList.remove('hit'));
    bar.style.width = `${(d.bpm / MAX_BPM) * 100}%`;
    num.textContent = d.bpm ? `${d.bpm} 拍/分` : '静';
    drum.classList.toggle('still', !d.bpm);
    const gap = d.bpm ? 60000 / d.bpm : 900; // 静的句子慢慢亮，不敲鼓
    let k = 0;
    timer = setInterval(() => {
      if (k >= beats.length) { stop(); return; }
      beats[k].classList.add('hit');
      if (d.bpm) {
        drum.classList.remove('beat');
        void drum.getBoundingClientRect(); // 重新触发敲击动画
        drum.classList.add('beat');
        thump();
      }
      k += 1;
    }, gap);
  });
  document.getElementById('soundBtn').addEventListener('click', (e) => {
    soundOn = !soundOn;
    e.currentTarget.textContent = soundOn ? '🔊 鼓声：开' : '🔈 鼓声：关';
    e.currentTarget.classList.toggle('solid', soundOn);
  });
}

/* ---------- 四个“好一个”（顶层生成：deck.js 统计分步） ---------- */
const FOUR = [
  { t: '好一个安塞腰鼓！', what: '赞舞蹈的气势', s: '容不得束缚，容不得羁绊，容不得闭塞。是挣脱了、冲破了、撞开了的那么一股劲！' },
  { t: '好一个安塞腰鼓！', what: '赞鼓声的震撼', s: '隆隆隆隆的豪壮的抒情，隆隆隆隆的严峻的思索……' },
  { t: '好一个黄土高原！好一个安塞腰鼓！', what: '赞后生的生命力与黄土高原', s: '除了黄土高原，哪里再有这么厚这么厚的土层啊！' },
  { t: '好一个痛快了山河、蓬勃了想象力的安塞腰鼓！', what: '赞舞姿的变幻与艺术之美', s: '每一个舞姿都使人战栗在浓烈的艺术享受中，使人叹为观止。' },
];
function buildFour() {
  document.getElementById('four').innerHTML = FOUR.map((f, i) => `<button type="button" class="fr" data-step="${i + 1}">
    <span class="fr-n">${i + 1}</span><b>${esc(f.t)}</b><span class="fr-what">${f.what}</span><span class="fr-s">${esc(f.s)}</span></button>`).join('');
}
buildFour();
function initFour() {
  document.getElementById('four').addEventListener('click', (e) => { const b = e.target.closest('.fr'); if (b) b.classList.toggle('open'); });
}

const MOMENTS = [
  {
    name: '运动会接力', pic: 'qunwu',
    prompt: '仿照“骤雨一样，是急促的鼓点”，写运动会接力赛的场面，至少三组。',
    hint: '先想本体：脚步、呐喊、接力棒、汗水、眼神……再给每个本体找一个有力量的喻体，放在前面。',
    example: '离弦之箭一样，是起跑的身影；擂鼓一样，是看台的呐喊；闪电一样，是交接的接力棒；燃烧的火炬一样，是冲线时的眼神！',
  },
  {
    name: '暴雨来临', pic: 'jingli',
    prompt: '用“______一样，是______”的句式写一场夏日暴雨。',
    hint: '可以写雷、闪电、雨点、风、街上奔跑的人；最后用一个短句收束。',
    example: '战鼓一样，是滚过天边的雷声；银蛇一样，是撕开乌云的闪电；万箭齐发一样，是砸向地面的雨点。好一场暴雨！',
  },
  {
    name: '节日舞龙', pic: 'jiting',
    prompt: '写一个你见过的民俗表演（舞龙、舞狮、秧歌……），学习“每一个……都……”的排比。',
    hint: '先写静，再写动，最后用一个短句或一声赞叹收尾。',
    example: '每一次腾跃都卷起一阵风。每一次翻滚都闪着金光。每一次昂首都引来满街的喝彩。好一条金龙！',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initDrum();
    initFour();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
