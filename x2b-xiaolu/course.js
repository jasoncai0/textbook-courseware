'use strict';
/* 开满鲜花的小路 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 连环画分格读故事；② 种子的旅行（包裹破洞漏花籽 → 冬眠 → 春天开花的因果动画）；③ 分角色舞台对话气泡；④ 拆礼物；⑤ 送包裹识字。 */

/* 二下课文只给生字注音：data-pyk="邮:yóu 递:dì" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 封面：点包裹 ================= */
const parcel = document.getElementById('xlParcel');
if (parcel) {
  parcel.addEventListener('click', () => {
    const open = parcel.classList.toggle('open');
    parcel.querySelector('.xl-box').textContent = open ? '📭' : '📦';
    parcel.querySelector('.xl-say').innerHTML = open ? '咦？里面空空的！<br>东西去哪儿了？' : '长颈鹿大叔寄来一个包裹，<br>里面是什么？点一点';
  });
}

/* ================= 种子的旅行 ================= */
const ROAD = [[60, 330], [240, 300], [420, 330], [600, 290], [780, 305], [950, 260]];
const HOUSES = [
  { x: 60, e: '🏠', name: '鼹鼠先生家' },
  { x: 330, e: '🦔', name: '刺猬太太家' },
  { x: 650, e: '🦊', name: '狐狸太太家' },
  { x: 950, e: '🐿️', name: '松鼠太太家' },
];
const SEED_N = 18;
const PARCEL_SEC = 5;
function along(t) {
  const segs = ROAD.length - 1;
  const f = Math.min(t * segs, segs - 1e-6);
  const i = Math.floor(f);
  const u = f - i;
  return [ROAD[i][0] + (ROAD[i + 1][0] - ROAD[i][0]) * u, ROAD[i][1] + (ROAD[i + 1][1] - ROAD[i][1]) * u];
}
const FLOWER_COLORS = ['#f06c8f', '#f5b83d', '#a46bd6', '#f08a4b', '#5fa8d3', '#ec5a5a'];
function buildSeedMap(box) {
  const seeds = Array.from({ length: SEED_N }, (_, i) => {
    const t = (i + 1.5) / (SEED_N + 2);
    const [x, y] = along(t);
    const dx = (i % 2 ? 14 : -10);
    return { x: x + dx, y: y + (i % 3) * 6 - 4, t };
  });
  const road = ROAD.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');
  box.innerHTML = `<svg viewBox="0 0 1000 420" aria-hidden="true">
    <rect width="1000" height="420" class="zz-sky"/>
    <path d="M0 250Q300 210 520 240T1000 210V420H0Z" class="zz-ground"/>
    <path d="${road}" class="zz-road"/>
    ${HOUSES.map((h) => `<g transform="translate(${h.x} ${along((h.x - 60) / 890)[1] - 40})"><rect x="-38" y="-46" width="76" height="56" rx="6" class="zz-house"/><path d="M-48 -44L0 -86L48 -44Z" class="zz-roof"/><text y="-6" class="zz-e">${h.e}</text><text y="-96" class="zz-name">${h.name}</text></g>`).join('')}
    <g class="zz-seeds">${seeds.map((s, i) => `<circle cx="${s.x.toFixed(0)}" cy="${s.y.toFixed(0)}" r="5" style="--d:${(s.t * PARCEL_SEC).toFixed(2)}s;--i:${i}"/>`).join('')}</g>
    <g class="zz-flowers">${seeds.map((s, i) => `<g transform="translate(${s.x.toFixed(0)} ${s.y.toFixed(0)})"><g class="zz-fl" style="--i:${i}"><path d="M0 0V-22" class="zz-stem"/>${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-30" rx="6" ry="9" transform="rotate(${a} 0 -22)" fill="${FLOWER_COLORS[i % FLOWER_COLORS.length]}"/>`).join('')}<circle cy="-22" r="5" fill="#ffe27a"/></g></g>`).join('')}</g>
    <g class="zz-snow"><rect width="1000" height="420"/>${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 97) % 1000}" cy="${(i * 53) % 400}" r="${3 + (i % 3)}" style="--i:${i}"/>`).join('')}</g>
    <g class="zz-parcel"><g transform="translate(-26 -70)"><text class="zz-e big" x="26" y="40">📦</text></g><text class="zz-hole" x="18" y="-22">破洞</text></g>
    <text class="zz-season" x="40" y="50"></text>
  </svg>`;
}
const zzMap = document.getElementById('zzMap');
if (zzMap) buildSeedMap(zzMap);

/* ================= 拆礼物 ================= */
document.querySelectorAll('.gf').forEach((g) => g.addEventListener('click', () => g.classList.toggle('open')));

/* ================= 送包裹：包裹上是字，门牌上是拼音 ================= */
const PARCEL_Q = [
  { z: '邮', ans: 'yóu', opts: ['yòu', 'yóu', 'yǒu'] },
  { z: '递', ans: 'dì', opts: ['dì', 'tì', 'dí'] },
  { z: '裹', ans: 'guǒ', opts: ['guó', 'kuò', 'guǒ'] },
  { z: '寄', ans: 'jì', opts: ['qí', 'jì', 'jī'] },
  { z: '局', ans: 'jú', opts: ['jú', 'jù', 'qú'] },
  { z: '堆', ans: 'duī', opts: ['tuī', 'zhuī', 'duī'] },
  { z: '漏', ans: 'lòu', opts: ['lù', 'lòu', 'lóu'] },
  { z: '礼', ans: 'lǐ', opts: ['lǐ', 'nǐ', 'lì'] },
];
const HOUSE_COLORS = ['#e07a5f', '#5fa8d3', '#8ac26b'];
function initParcels(box) {
  let i = 0;
  let busy = false;
  const show = () => {
    const it = PARCEL_Q[i];
    box.innerHTML = `<div class="bg-parcel"><span>${it.z}</span></div>
      <div class="bg-row">${it.opts.map((o, k) => `<button type="button" class="bg-house" data-o="${o}" style="--c:${HOUSE_COLORS[k]}"><i class="bg-roof"></i><span class="bg-door"></span><b class="hz-latin">${o}</b></button>`).join('')}</div>
      <p class="bg-msg">${i ? '' : '包裹上的字读什么？送到门牌对的房子。'}</p>
      <div class="hz-dots">${PARCEL_Q.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'cur' : ''}"></i>`).join('')}</div>`;
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { i = 0; show(); return; }
    const house = e.target.closest('.bg-house');
    if (!house || busy) return;
    const msg = box.querySelector('.bg-msg');
    if (house.dataset.o !== PARCEL_Q[i].ans) {
      house.classList.remove('wrong'); void house.offsetWidth; house.classList.add('wrong');
      msg.textContent = '送错啦，再读一读门牌';
      return;
    }
    busy = true;
    const pr = box.querySelector('.bg-parcel');
    const a = pr.getBoundingClientRect();
    const b = house.getBoundingClientRect();
    pr.style.translate = `${b.left + b.width / 2 - (a.left + a.width / 2)}px ${b.top + b.height / 2 - (a.top + a.height / 2)}px`;
    pr.classList.add('go');
    house.classList.add('got');
    msg.textContent = `送到了！${PARCEL_Q[i].z}（${PARCEL_Q[i].ans}）`;
    setTimeout(() => {
      i += 1;
      if (i < PARCEL_Q.length) { show(); return; }
      box.innerHTML = '<p class="bg-msg big">包裹全部送到啦！你是出色的小邮递员！</p><button type="button" class="btn solid" data-again>再送一次</button>';
    }, 1400);
  });
  show();
}
const bgGame = document.getElementById('bgGame');
if (bgGame) initParcels(bgGame);

/* ================= 分角色舞台：说话的角色亮起来，气泡在它头上 ================= */
const WHO_X = [10, 30, 50, 70, 90];
function updateStage(slide, step) {
  let last = null;
  slide.querySelectorAll('.st-line').forEach((l) => { if (+l.dataset.step <= step) last = l; });
  slide.querySelectorAll('.st-who').forEach((w) => w.classList.remove('talk'));
  slide.querySelectorAll('.st-line').forEach((l) => l.classList.toggle('cur', l === last));
  if (!last) return;
  const w = +last.dataset.w;
  slide.querySelector(`.st-who.w${w}`).classList.add('talk');
  last.style.setProperty('--x', `${WHO_X[w]}%`);
}

Hanzi.init({
  cards: [
    { z: '邮', py: 'yóu', words: [['邮递员', 'yóu dì yuán'], ['邮局', 'yóu jú']] },
    { z: '递', py: 'dì', words: [['传递', 'chuán dì'], ['递给', 'dì gěi']] },
    { z: '裹', py: 'guǒ', words: [['包裹', 'bāo guǒ']] },
    { z: '寄', py: 'jì', words: [['寄来', 'jì lái'], ['寄信', 'jì xìn']] },
    { z: '局', py: 'jú', words: [['邮局', 'yóu jú']] },
    { z: '堆', py: 'duī', words: [['一堆', 'yì duī'], ['雪堆', 'xuě duī']] },
    { z: '认', py: 'rèn', words: [['认出', 'rèn chū'], ['认真', 'rèn zhēn']] },
    { z: '破', py: 'pò', words: [['破了', 'pò le'], ['打破', 'dǎ pò']] },
    { z: '漏', py: 'lòu', words: [['漏水', 'lòu shuǐ'], ['漏掉', 'lòu diào']] },
    { z: '懊', py: 'ào', words: [['懊丧', 'ào sàng']] },
    { z: '丧', py: 'sàng', words: [['懊丧', 'ào sàng']] },
    { z: '啊', py: 'à', words: [['啊，开满了花', 'à kāi mǎn le huā']] },
    { z: '猬', py: 'wèi', words: [['刺猬', 'cì wèi']] },
    { z: '绚', py: 'xuàn', words: [['绚丽多彩', 'xuàn lì duō cǎi']] },
    { z: '礼', py: 'lǐ', words: [['礼物', 'lǐ wù'], ['礼貌', 'lǐ mào']] },
  ],
  write: {
    a: [
      { z: '鲜', py: 'xiān', bs: '鱼', bh: 14 },
      { z: '邮', py: 'yóu', bs: '阝', bh: 7 },
      { z: '递', py: 'dì', bs: '辶', bh: 10 },
      { z: '员', py: 'yuán', bs: '口', bh: 7 },
      { z: '原', py: 'yuán', bs: '厂', bh: 10 },
    ],
    b: [
      { z: '叔', py: 'shū', bs: '又', bh: 8 },
      { z: '局', py: 'jú', bs: '尸', bh: 7 },
      { z: '堆', py: 'duī', bs: '土', bh: 11 },
      { z: '认', py: 'rèn', bs: '讠', bh: 4 },
      { z: '礼', py: 'lǐ', bs: '礻', bh: 5 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.querySelector('.st-stage')) updateStage(slide, step);
    if (slide.contains(zzMap)) zzMap.querySelector('.zz-season').textContent = ['', '去年秋天', '去年秋天', '冬天', '春天来了', '春天来了'][step];
  },
};
