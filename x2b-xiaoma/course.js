'use strict';
/* 小马过河 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 水深尺——同一条河、同样深的水，老牛下水只没过小腿，松鼠比水还矮，小马自己蹚过去水到膝盖；
 *          ② 对话气泡读第 7 段；③ 你同意吗（判断 + 理由）；④ 故事路线图讲故事；⑤ 踩石头过河识字。 */

/* 二下课文只给生字注音：data-pyk="脱:tuō 袄:ǎo" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 水深尺 ================= */
const BED = 384;
const SURFACE = 294;
const legs = (x, y0, len, xs, color) => xs.map((dx) => `<rect x="${x + dx - 7}" y="${y0}" width="14" height="${len}" rx="6" fill="${color}"/>`).join('');
const COW = `<g class="xm-f niu">
  ${legs(230, 196, BED - 196, [-56, -30, 30, 56], '#b98a3c')}
  <ellipse cx="230" cy="184" rx="90" ry="46" fill="#d9a54a"/><ellipse cx="200" cy="176" rx="26" ry="18" fill="#f3e2b8"/>
  <ellipse cx="326" cy="150" rx="34" ry="28" fill="#d9a54a"/><ellipse cx="346" cy="162" rx="16" ry="12" fill="#f3d7c0"/>
  <path d="M312 126q-6 -22 -26 -26M334 124q8 -22 28 -24" stroke="#f5efe0" stroke-width="7" fill="none" stroke-linecap="round"/>
  <circle cx="330" cy="144" r="4" fill="#3a2a1a"/><path d="M140 176q-24 10 -22 46" stroke="#b98a3c" stroke-width="6" fill="none"/>
  <text class="xm-say" x="236" y="110">老牛</text></g>`;
const PONY = `<g class="xm-f ma">
  ${legs(440, 270, BED - 270, [-40, -20, 22, 40], '#a5532c')}
  <ellipse cx="440" cy="260" rx="62" ry="30" fill="#c0643a"/>
  <path d="M488 250q16 -34 24 -60l26 6q-6 34 -26 62z" fill="#c0643a"/><ellipse cx="530" cy="192" rx="24" ry="15" fill="#c0643a" transform="rotate(20 530 192)"/>
  <path d="M492 220q8 -34 20 -40q2 26 -8 50z" fill="#f2d48a"/><path d="M380 254q-30 6 -26 42q16 -24 28 -30z" fill="#f2d48a"/>
  <circle cx="532" cy="186" r="3.5" fill="#2a1a10"/><rect x="410" y="224" width="56" height="24" rx="8" fill="#f7f3ea" stroke="#cbbfa8" stroke-width="2"/>
  <text class="xm-say" x="440" y="212">小马</text></g>`;
const SQUIRREL = `<g class="xm-f shu" fill="none" stroke="#7a4a1a" stroke-width="3" stroke-dasharray="6 5">
  <ellipse cx="632" cy="${BED - 22}" rx="14" ry="22"/><circle cx="636" cy="${BED - 54}" r="11"/>
  <path d="M620 ${BED - 8}q-30 -10 -24 -52q4 -20 18 -14q-6 26 10 52"/>
  <text class="xm-say" x="630" y="282" stroke-dasharray="none">松鼠</text>
  <text class="xm-small" x="630" y="420" stroke="none">（只比一比个子）</text></g>`;
function buildRiver(svg) {
  const marks = Array.from({ length: 13 }, (_, k) => `<path d="M700 ${BED - k * 15}h${k % 2 ? 12 : 22}"/>`).join('');
  svg.innerHTML = `
    <rect width="800" height="480" fill="#e5f2f8"/>
    <path d="M0 250H130L176 ${BED}H624L670 250H800V480H0Z" fill="#9c7a52"/>
    <path d="M0 250H130L120 236H0Z M670 250H800V236H680Z" fill="#8fc46a"/>
    ${COW}${PONY}${SQUIRREL}
    <path class="xm-water" d="M145 ${SURFACE}H655L624 ${BED}H176Z"/>
    <path class="xm-surf" d="M145 ${SURFACE}H655"/>
    <g class="xm-ruler"><rect x="690" y="${BED - 190}" width="40" height="190" rx="5"/>${marks}
      <path class="xm-lvl" d="M680 ${SURFACE}h64"/><text x="760" y="${SURFACE + 8}">水面</text></g>`;
}
const river = document.getElementById('xmRiver');
function showWho(set) {
  ['niu', 'shu', 'ma'].forEach((w) => river.classList.toggle(`s-${w}`, set.includes(w)));
  document.querySelectorAll('.xm-who').forEach((b) => b.classList.toggle('on', set.includes(b.dataset.w)));
}
if (river) {
  buildRiver(river);
  document.querySelectorAll('.xm-who').forEach((btn) => btn.addEventListener('click', () => {
    const w = btn.dataset.w;
    const cur = ['niu', 'shu', 'ma'].filter((x) => river.classList.contains(`s-${x}`));
    showWho(cur.includes(w) ? cur.filter((x) => x !== w) : [...cur, w]);
  }));
}
const WHO_STEPS = [[], ['niu'], ['niu', 'shu'], ['niu', 'shu', 'ma'], ['niu', 'shu', 'ma']];

/* ================= 你同意吗 ================= */
const judge = document.getElementById('xmJudge');
if (judge) {
  judge.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-v]');
    if (!btn) return;
    const row = btn.closest('.xm-j');
    if (btn.dataset.v !== row.dataset.ok) { row.classList.remove('no'); void row.offsetWidth; row.classList.add('no'); return; }
    row.classList.add('ok', row.dataset.ok === '1' ? 'yes' : 'nope');
  });
}

/* ================= 故事路线图 ================= */
const STOPS = [
  { x: 80, y: 330, ico: '🏡', name: '马棚', words: ['马棚', '愿意', '磨坊'] },
  { x: 250, y: 170, ico: '🌊', name: '小河边', words: ['驮', '挡住', '为难'] },
  { x: 420, y: 320, ico: '🌳', name: '大树下', words: ['突然', '拦住', '吃惊'] },
  { x: 580, y: 160, ico: '🏡', name: '回到家', words: ['难为情', '动脑筋'] },
  { x: 730, y: 300, ico: '🌾', name: '过河了', words: ['小心'] },
];
function buildRoute(svg) {
  const d = STOPS.map((s, i) => (i ? `Q${(s.x + STOPS[i - 1].x) / 2} ${i % 2 ? s.y - 90 : s.y + 90} ${s.x} ${s.y}` : `M${s.x} ${s.y}`)).join(' ');
  svg.innerHTML = `<rect width="800" height="420" rx="20" fill="#eef6e2"/>
    <path class="xm-path" d="${d}"/>
    ${STOPS.map((s, i) => `<g class="xm-stop" data-i="${i}" transform="translate(${s.x} ${s.y})" role="button" aria-label="${s.name}">
      <circle r="40"/><text class="xm-ico" y="14">${s.ico}</text><text class="xm-sn" y="70">${i + 1} ${s.name}</text></g>`).join('')}
    <g class="xm-pony" transform="translate(${STOPS[0].x} ${STOPS[0].y - 56})"><text y="0">🐴</text></g>`;
}
const route = document.getElementById('xmRoute');
if (route) {
  buildRoute(route);
  const words = document.getElementById('xmWords');
  route.addEventListener('click', (e) => {
    const g = e.target.closest('.xm-stop');
    if (!g) return;
    const s = STOPS[+g.dataset.i];
    route.querySelector('.xm-pony').setAttribute('transform', `translate(${s.x} ${s.y - 56})`);
    g.classList.add('been');
    route.querySelectorAll('.xm-stop').forEach((x) => x.classList.toggle('now', x === g));
    words.innerHTML = `<p class="xm-wname">${s.ico} ${s.name}</p><div class="xm-wcards">${s.words.map((w) => `<span>${w}</span>`).join('')}</div>`;
  });
}

/* ================= 识字游戏：踩石头过河 ================= */
const STONE_Q = [
  { q: 'péng', ans: '棚', opts: ['朋', '棚', '鹏'] },
  { q: 'tuó', ans: '驮', opts: ['驮', '驼', '驰'] },
  { q: 'dǎng', ans: '挡', opts: ['当', '档', '挡'] },
  { q: 'qiǎn', ans: '浅', opts: ['钱', '浅', '线'] },
  { q: 'tū', ans: '突', opts: ['突', '空', '究'] },
  { q: 'tàn', ans: '叹', opts: ['汉', '吹', '叹'] },
  { q: 'tí', ans: '蹄', opts: ['啼', '蹄', '帝'] },
  { q: 'jì', ans: '既', opts: ['即', '概', '既'] },
];
const stoneX = (k) => 13 + k * 10.6;
function initStones(box) {
  let i = 0;
  let busy = false;
  box.innerHTML = `<div class="xm-rv"><i class="xm-bank l"></i><i class="xm-bank r"></i>
    ${STONE_Q.map((_, k) => `<span class="xm-stone" style="left:${stoneX(k)}%"></span>`).join('')}
    <span class="xm-hop" style="left:4%">🐴</span></div><div class="xm-gask"></div>`;
  const ask = box.querySelector('.xm-gask');
  const hop = box.querySelector('.xm-hop');
  const show = () => {
    const it = STONE_Q[i];
    ask.innerHTML = `<p class="xm-q hz-latin">${it.q}</p>
      <div class="xm-opts">${it.opts.map((o) => `<button type="button" class="xm-opt" data-o="${o}">${o}</button>`).join('')}</div>
      <p class="xm-msg">${i ? '' : '选对了，小马就跳到下一块石头上。'}</p>`;
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      i = 0;
      hop.style.left = '4%';
      box.querySelectorAll('.xm-stone').forEach((s) => { s.classList.remove('done'); s.textContent = ''; });
      show();
      return;
    }
    const opt = e.target.closest('.xm-opt');
    if (!opt || busy) return;
    const msg = box.querySelector('.xm-msg');
    if (opt.dataset.o !== STONE_Q[i].ans) {
      opt.classList.remove('wrong'); void opt.offsetWidth; opt.classList.add('wrong');
      msg.textContent = '小心，这块石头不对！再读一读拼音。';
      return;
    }
    busy = true;
    opt.classList.add('right');
    const stone = box.querySelectorAll('.xm-stone')[i];
    stone.textContent = STONE_Q[i].ans;
    stone.classList.add('done');
    hop.style.left = `${stoneX(i)}%`;
    hop.classList.remove('jump'); void hop.offsetWidth; hop.classList.add('jump');
    msg.textContent = `跳过去了！${STONE_Q[i].ans}（${STONE_Q[i].q}）`;
    setTimeout(() => {
      i += 1;
      if (i < STONE_Q.length) { show(); return; }
      hop.style.left = '93%';
      ask.innerHTML = '<p class="xm-q">小马过河啦！</p><button type="button" class="btn solid" data-again>再过一次</button>';
    }, 1100);
  });
  show();
}
const stones = document.getElementById('xmStones');
if (stones) initStones(stones);

Hanzi.init({
  cards: [
    { z: '棚', py: 'péng', words: [['马棚', 'mǎ péng'], ['草棚', 'cǎo péng']] },
    { z: '驮', py: 'tuó', words: [['驮起', 'tuó qǐ'], ['驮东西', 'tuó dōng xi']] },
    { z: '磨', py: 'mò', words: [['磨坊', 'mò fáng']] },
    { z: '坊', py: 'fáng', words: [['磨坊', 'mò fáng'], ['油坊', 'yóu fáng']] },
    { z: '挡', py: 'dǎng', words: [['挡住', 'dǎng zhù'], ['阻挡', 'zǔ dǎng']] },
    { z: '伯', py: 'bó', words: [['牛伯伯', 'niú bó bo'], ['伯父', 'bó fù']] },
    { z: '浅', py: 'qiǎn', words: [['很浅', 'hěn qiǎn'], ['深浅', 'shēn qiǎn']] },
    { z: '刻', py: 'kè', words: [['立刻', 'lì kè'], ['时刻', 'shí kè']] },
    { z: '突', py: 'tū', words: [['突然', 'tū rán']] },
    { z: '叹', py: 'tàn', words: [['叹气', 'tàn qì']] },
    { z: '唉', py: 'ài', words: [['唉！', 'ài']] },
    { z: '试', py: 'shì', words: [['试一试', 'shì yi shì'], ['考试', 'kǎo shì']] },
    { z: '蹄', py: 'tí', words: [['前蹄', 'qián tí'], ['马蹄', 'mǎ tí']] },
    { z: '既', py: 'jì', words: [['既……也……', 'jì yě']] },
  ],
  write: {
    a: [
      { z: '愿', py: 'yuàn', bs: '心', bh: 14 },
      { z: '意', py: 'yì', bs: '心', bh: 13 },
      { z: '麦', py: 'mài', bs: '麦', bh: 7 },
      { z: '该', py: 'gāi', bs: '讠', bh: 8 },
    ],
    b: [
      { z: '伯', py: 'bó', bs: '亻', bh: 7 },
      { z: '刻', py: 'kè', bs: '刂', bh: 8 },
      { z: '突', py: 'tū', bs: '穴', bh: 9 },
      { z: '掉', py: 'diào', bs: '扌', bh: 11 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (river && slide.contains(river)) showWho(WHO_STEPS[Math.min(step, 4)]);
    const chat = document.getElementById('xmChat');
    if (chat && slide.contains(chat)) setTimeout(() => { chat.scrollTop = chat.scrollHeight; }, 650);
  },
};
