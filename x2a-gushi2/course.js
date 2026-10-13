'use strict';
/* 古诗二首（夜宿山寺 / 敕勒歌） · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用）
 * 本课独有：① 夜宿山寺“镜头上升”：从山脚一层层升到楼顶，伸手摘星；② 敕勒歌“草原长卷”：读一句镜头右移一段，拖动手指吹风，草低露出牛羊；
 *           ③ 摘星星识字游戏。 */
const SVGNS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs) => {
  const el = document.createElementNS(SVGNS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
};
const STAR_PATH = (r) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`;
  });
  return `M${pts.join('L')}Z`;
};

/* ================= 夜宿山寺：五层高楼 + 百尺刻度 + 身边的星星 ================= */
const FLOORS = 5;
const FLOOR_H = 218;
const TOWER_BASE = 1520;
function drawTower() {
  const g = document.getElementById('ysTower');
  if (!g) return;
  // 山上的寺（矮房子）
  g.append(svgEl('path', { d: 'M150 1530h300v-60h-300z', fill: '#7a3f2a' }), svgEl('path', { d: 'M120 1476L300 1430L480 1476Z', fill: '#2e2324' }));
  for (let i = 0; i < FLOORS; i += 1) {
    const yb = TOWER_BASE - i * FLOOR_H;
    const w = 190 - i * 18;
    g.append(svgEl('rect', { x: 300 - w / 2, y: yb - FLOOR_H + 30, width: w, height: FLOOR_H - 30, fill: '#8b4a2e' }));
    [-1, 1].forEach((s) => g.append(svgEl('rect', { x: 300 + s * w * 0.22 - 14, y: yb - FLOOR_H + 80, width: 28, height: 56, rx: 4, fill: '#ffd46b', class: 'ys-win' })));
    const ew = w + 70;
    g.append(svgEl('path', { d: `M${300 - ew / 2 - 14} ${yb - FLOOR_H + 40}Q${300 - ew / 2} ${yb - FLOOR_H + 30} ${300 - ew / 2 + 20} ${yb - FLOOR_H + 34}L300 ${yb - FLOOR_H}L${300 + ew / 2 - 20} ${yb - FLOOR_H + 34}Q${300 + ew / 2} ${yb - FLOOR_H + 30} ${300 + ew / 2 + 14} ${yb - FLOOR_H + 40}Z`, fill: '#2e2324' }));
  }
  // 楼顶平台和栏杆
  g.append(svgEl('path', { d: 'M226 432h148v-8h-148z', fill: '#5a3424' }), svgEl('path', { d: 'M232 424v-22M262 424v-22M292 424v-22M322 424v-22M352 424v-22M370 424v-22M230 404h142', stroke: '#5a3424', 'stroke-width': 5, fill: 'none' }));
  // 百尺刻度：每 10 尺一格
  const ticks = document.getElementById('ysTicks');
  for (let k = 0; k <= 10; k += 1) {
    const y = TOWER_BASE - k * ((TOWER_BASE - 420) / 10);
    ticks.append(svgEl('path', { d: `M40 ${y}h${k % 5 ? 16 : 28}` }));
    if (k && k % 2 === 0) {
      const t = svgEl('text', { x: 76, y: y + 10 });
      t.textContent = k === 10 ? '百尺' : `${k * 10}尺`;
      ticks.append(t);
    }
  }
  // 身边的星星（可以“摘”）
  const stars = document.getElementById('ysStars');
  const POS = [[150, 120, 26], [250, 70, 20], [380, 190, 30], [110, 300, 22], [430, 300, 24], [200, 230, 18], [330, 60, 18], [540, 250, 20], [60, 180, 16], [500, 400, 18]];
  POS.forEach(([x, y, r], i) => {
    const s = svgEl('g', { class: 'ys-star', transform: `translate(${x} ${y})`, style: `--d:${(i % 5) * 0.4}s` });
    s.append(svgEl('circle', { r: r * 1.8, fill: 'url(#ysGlow)' }), svgEl('path', { d: STAR_PATH(r), fill: '#ffe680' }));
    stars.append(s);
  });
  let got = 0;
  const msg = document.getElementById('ysGot');
  stars.addEventListener('click', (e) => {
    const s = e.target.closest('.ys-star:not(.got)');
    if (!s) return;
    s.classList.add('got');
    got += 1;
    msg.textContent = `摘到 ${got} 颗星星！`;
  });
}
drawTower();

/* ================= 敕勒歌：草原长卷 + 吹风 ================= */
const SEG = 1600;
const GRASS_X0 = 4800;
const BLADE_N = 110;
const BEND_MS = 2600;
const WIND_R = 140;
function drawGrassland() {
  const blades = document.getElementById('clBlades');
  if (!blades) return;
  // 藏在草里的牛羊（先画，草盖在上面）
  const animals = document.getElementById('clAnimals');
  const SHEEP = [[5000, 780], [5120, 800], [5520, 790], [5640, 770], [6000, 795], [6150, 780]];
  const COWS = [[5300, 760], [5850, 770], [6300, 760]];
  SHEEP.forEach(([x, y]) => {
    const g = svgEl('g', { class: 'cl-sheep', transform: `translate(${x} ${y})` });
    g.append(svgEl('path', { d: 'M-40 10v34M30 10v34', stroke: '#333', 'stroke-width': 8 }),
      svgEl('ellipse', { cx: 0, cy: 0, rx: 58, ry: 36, fill: '#fbfbf4' }),
      svgEl('circle', { cx: -24, cy: -22, r: 24, fill: '#fbfbf4' }), svgEl('circle', { cx: 20, cy: -24, r: 22, fill: '#fbfbf4' }),
      svgEl('ellipse', { cx: -64, cy: -10, rx: 20, ry: 24, fill: '#3b3b3b' }));
    animals.append(g);
  });
  COWS.forEach(([x, y]) => {
    const g = svgEl('g', { class: 'cl-cow', transform: `translate(${x} ${y})` });
    g.append(svgEl('path', { d: 'M-60 20v50M-30 20v50M40 20v50M66 20v50', stroke: '#6b4226', 'stroke-width': 12 }),
      svgEl('rect', { x: -80, y: -40, width: 170, height: 76, rx: 30, fill: '#a0612f' }),
      svgEl('ellipse', { cx: 20, cy: -6, rx: 26, ry: 18, fill: '#f3e5cf' }),
      svgEl('rect', { x: -128, y: -64, width: 60, height: 56, rx: 20, fill: '#8c5427' }),
      svgEl('path', { d: 'M-122 -60l-16 -20M-80 -60l12 -22', stroke: '#e8dcc0', 'stroke-width': 8, 'stroke-linecap': 'round' }));
    animals.append(g);
  });
  // 高高的草：一片一片叶子，底部固定
  for (let i = 0; i < BLADE_N; i += 1) {
    const x = GRASS_X0 + (i + Math.random() * 0.6) * (SEG / BLADE_N);
    const h = 300 + Math.random() * 90;
    const lean = (Math.random() - 0.5) * 50;
    const p = svgEl('path', { class: 'cl-blade', d: `M${x - 16} 900Q${x - 6 + lean / 2} ${900 - h / 2} ${x + lean} ${900 - h}Q${x + 8 + lean / 2} ${900 - h / 2} ${x + 16} 900Z`, fill: i % 3 ? '#5c9d3a' : '#77b347' });
    p.dataset.x = x;
    blades.append(p);
  }
}
drawGrassland();

function bendAt(x) {
  document.querySelectorAll('#clBlades .cl-blade').forEach((b) => {
    if (Math.abs(+b.dataset.x - x) > WIND_R) return;
    b.classList.add('bent');
    clearTimeout(b.timer);
    b.timer = setTimeout(() => b.classList.remove('bent'), BEND_MS);
  });
}
function sweepWind() {
  let x = GRASS_X0;
  const tick = () => { bendAt(x); x += 60; if (x <= GRASS_X0 + SEG + WIND_R) setTimeout(tick, 40); };
  tick();
}
function initWind() {
  const world = document.getElementById('clWorld');
  if (!world) return;
  const toWorldX = (e) => {
    const pt = world.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(world.getScreenCTM().inverse()).x;
  };
  let down = false;
  world.addEventListener('pointerdown', (e) => { down = true; bendAt(toWorldX(e)); });
  world.addEventListener('pointermove', (e) => { if (down) bendAt(toWorldX(e)); });
  window.addEventListener('pointerup', () => { down = false; });
  document.getElementById('clWind').addEventListener('click', sweepWind);
}
initWind();

/* ================= 摘星星识字游戏 ================= */
const GAME = [['宿', 'sù'], ['寺', 'sì'], ['危', 'wēi'], ['辰', 'chén'], ['恐', 'kǒng'], ['惊', 'jīng'], ['似', 'sì'], ['庐', 'lú'], ['笼', 'lǒng'], ['盖', 'gài'], ['苍', 'cāng'], ['茫', 'máng']];
const GAME_POS = [[10, 22], [26, 40], [40, 16], [55, 34], [70, 18], [84, 36], [14, 62], [30, 76], [46, 56], [62, 72], [76, 58], [90, 70]];
function initStarGame(box) {
  if (!box) return;
  // 题目顺序固定打乱（同音的“寺、似”分开）
  const ORDER = [2, 7, 0, 10, 4, 8, 1, 11, 5, 9, 3, 6];
  box.innerHTML = `<div class="sg-sky">${GAME.map(([z], i) => `<button type="button" class="sg-star" data-i="${i}" style="left:${GAME_POS[i][0]}%;top:${GAME_POS[i][1]}%">
      <svg viewBox="-30 -30 60 60" aria-hidden="true"><path d="${STAR_PATH(28)}"/></svg><b>${z}</b></button>`).join('')}
      <div class="sg-jar"><span class="sg-in"></span><b>0</b></div></div>
    <div class="sg-bar"><span class="sg-q"></span><span class="sg-msg">找到这个字的星星，点一下！</span><button type="button" class="btn" data-again>再摘一次</button></div>`;
  const q = box.querySelector('.sg-q');
  const msg = box.querySelector('.sg-msg');
  const cnt = box.querySelector('.sg-jar b');
  const jar = box.querySelector('.sg-in');
  let k = 0;
  const ask = () => { q.textContent = k < ORDER.length ? GAME[ORDER[k]][1] : '★'; };
  ask();
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      k = 0; jar.innerHTML = ''; cnt.textContent = '0'; box.classList.remove('all-done');
      box.querySelectorAll('.sg-star').forEach((s) => s.classList.remove('got', 'wrong'));
      msg.textContent = '找到这个字的星星，点一下！'; ask(); return;
    }
    const s = e.target.closest('.sg-star:not(.got)');
    if (!s || k >= ORDER.length) return;
    if (+s.dataset.i !== ORDER[k]) {
      s.classList.remove('wrong'); void s.offsetWidth; s.classList.add('wrong');
      msg.textContent = '不是这颗，再看看拼音！'; return;
    }
    s.classList.add('got');
    const [z, py] = GAME[ORDER[k]];
    jar.insertAdjacentHTML('beforeend', `<i>${Hanzi.ruby(z, py)}</i>`);
    k += 1; cnt.textContent = k;
    msg.textContent = k < ORDER.length ? `摘到“${z}”！大声读一读。` : '12 颗星星都摘到啦！';
    box.classList.toggle('all-done', k === ORDER.length);
    ask();
  });
}
initStarGame(document.getElementById('ysGame'));

Hanzi.init({
  cards: [
    { z: '宿', py: 'sù', bs: '宀', bh: 11, words: [['夜宿', 'yè sù'], ['宿舍', 'sù shè']] },
    { z: '寺', py: 'sì', bs: '寸', bh: 6, words: [['山寺', 'shān sì'], ['寺庙', 'sì miào']] },
    { z: '危', py: 'wēi', bs: '卩', bh: 6, words: [['危楼', 'wēi lóu'], ['危险', 'wēi xiǎn']] },
    { z: '辰', py: 'chén', bs: '辰', bh: 7, words: [['星辰', 'xīng chén'], ['时辰', 'shí chen']] },
    { z: '恐', py: 'kǒng', bs: '心', bh: 10, words: [['恐惊', 'kǒng jīng'], ['恐龙', 'kǒng lóng']] },
    { z: '惊', py: 'jīng', bs: '忄', bh: 11, words: [['吃惊', 'chī jīng'], ['惊喜', 'jīng xǐ']] },
    { z: '似', py: 'sì', bs: '亻', bh: 6, words: [['天似穹庐', 'tiān sì qióng lú'], ['好似', 'hǎo sì']] },
    { z: '庐', py: 'lú', bs: '广', bh: 7, words: [['穹庐', 'qióng lú'], ['草庐', 'cǎo lú']] },
    { z: '笼', py: 'lǒng', bs: '⺮', bh: 11, words: [['笼盖', 'lǒng gài'], ['鸟笼', 'niǎo lóng']] },
    { z: '盖', py: 'gài', bs: '皿', bh: 11, words: [['笼盖', 'lǒng gài'], ['盖子', 'gài zi']] },
    { z: '苍', py: 'cāng', bs: '艹', bh: 7, words: [['苍苍', 'cāng cāng'], ['苍天', 'cāng tiān']] },
    { z: '茫', py: 'máng', bs: '艹', bh: 9, words: [['茫茫', 'máng máng'], ['白茫茫', 'bái máng máng']] },
  ],
  pick: {
    yin: [
      { q: '风吹草低“见”牛羊', py: 'fēng chuī cǎo dī xiàn niú yáng', ans: 'xiàn', opts: ['jiàn', 'xiàn'] },
      { q: '夜“宿”山寺', py: 'yè sù shān sì', ans: 'sù', opts: ['sù', 'xiǔ'] },
      { q: '“笼”盖四野', py: 'lǒng gài sì yě', ans: 'lǒng', opts: ['lóng', 'lǒng'] },
      { q: '北“朝”民歌', py: 'běi cháo mín gē', ans: 'cháo', opts: ['zhāo', 'cháo'] },
    ],
  },
  write: {
    a: [
      { z: '危', py: 'wēi', bs: '卩', bh: 6 },
      { z: '敢', py: 'gǎn', bs: '攵', bh: 11 },
      { z: '惊', py: 'jīng', bs: '忄', bh: 11 },
      { z: '阴', py: 'yīn', bs: '阝', bh: 6 },
    ],
    b: [
      { z: '似', py: 'sì', bs: '亻', bh: 6 },
      { z: '野', py: 'yě', bs: '里', bh: 11 },
      { z: '苍', py: 'cāng', bs: '艹', bh: 7 },
      { z: '茫', py: 'máng', bs: '艹', bh: 9 },
    ],
  },
});

/* 长卷镜头：第 n 句 → 第 n 段（第 0、1 步都在第一段）；第 4 句自动吹一阵风 */
let windDone = false;
window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    const world = slide.querySelector('#clWorld');
    if (!world) return;
    world.style.setProperty('--seg', Math.max(0, step - 1));
    if (step >= 4 && !windDone) { windDone = true; setTimeout(sweepWind, 1600); }
    if (step < 4) windDone = false;
  },
};
