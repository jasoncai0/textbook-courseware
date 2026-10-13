'use strict';
/* 古代诗歌四首 · 本课数据与互动。诗文模板见 ../shared/poem.js；画面、翻卡见 ../shared/narrative.js */

const POEMS = {
  gch: {
    title: '观沧海', author: '［东汉］曹操',
    lines: [
      { t: '东临碣石，以观沧海。', r: '东临/碣石，以观/沧海。', f: '1.15 30% 60%' },
      { t: '水何澹澹，山岛竦峙。', r: '水何/澹澹，山岛/竦峙。', f: '1.2 60% 55%' },
      { t: '树木丛生，百草丰茂。', r: '树木/丛生，百草/丰茂。', f: '1.25 65% 50%' },
      { t: '秋风萧瑟，洪波涌起。', r: '秋风/萧瑟，洪波/涌起。', f: '1.2 50% 70%' },
      { t: '日月之行，若出其中；', r: '日月/之行，若出/其中；', f: '1.15 60% 35%' },
      { t: '星汉灿烂，若出其里。', r: '星汉/灿烂，若出/其里。', f: '1.1 50% 25%' },
      { t: '幸甚至哉，歌以咏志。', r: '幸甚/至哉，歌以/咏志。', f: '1.04 50% 50%' },
    ],
    notes: { 临: '到达，登上', 碣石: '山名，在今河北昌黎西北', 澹澹: '水波荡漾的样子（读 dàn dàn）', 竦峙: '耸立（读 sǒng zhì）', 星汉: '银河', 幸甚至哉: '幸运得很，好极了。最后两句是合乐时所加的套语' },
  },
  lb: {
    title: '闻王昌龄左迁龙标遥有此寄', author: '［唐］李白',
    lines: [
      { t: '杨花落尽子规啼，', r: '杨花/落尽/子规啼，', f: '1.25 40% 40%' },
      { t: '闻道龙标过五溪。', r: '闻道/龙标/过五溪。', f: '1.2 55% 65%' },
      { t: '我寄愁心与明月，', r: '我寄/愁心/与明月，', f: '1.25 60% 20%' },
      { t: '随君直到夜郎西。', r: '随君/直到/夜郎西。', f: '1.1 40% 50%' },
    ],
    notes: { 杨花: '柳絮', 子规: '即布谷鸟，又称“杜鹃”', 龙标: '指王昌龄。古代常用官职或任官之地的州县名来称呼一个人', 五溪: '今湖南西部、贵州东部五条溪流的合称', 夜郎: '这里所说的“夜郎”在今湖南怀化境内' },
  },
  bg: {
    title: '次北固山下', author: '［唐］王湾',
    lines: [
      { t: '客路青山外，', r: '客路/青山外，', f: '1.2 70% 40%' },
      { t: '行舟绿水前。', r: '行舟/绿水前。', f: '1.25 55% 60%' },
      { t: '潮平两岸阔，', r: '潮平/两岸阔，', f: '1.1 50% 60%' },
      { t: '风正一帆悬。', r: '风正/一帆悬。', f: '1.3 50% 50%' },
      { t: '海日生残夜，', r: '海日/生残夜，', f: '1.25 60% 35%' },
      { t: '江春入旧年。', r: '江春/入旧年。', f: '1.1 50% 50%' },
      { t: '乡书何处达？', r: '乡书/何处达？', f: '1.15 50% 45%' },
      { t: '归雁洛阳边。', r: '归雁/洛阳边。', f: '1.25 40% 20%' },
    ],
    notes: { 客路: '旅人前行的路', 潮平两岸阔: '潮水涨满，两岸与江水齐平，整个江面十分开阔', 海日生残夜: '夜还未消尽，红日已从海上升起。残夜，指夜将尽未尽之时', 江春入旧年: '江上春早，旧年未过新春已来', 归雁洛阳边: '希望北归的大雁捎一封家书到洛阳' },
  },
  qs: {
    title: '天净沙·秋思', author: '［元］马致远',
    lines: [
      { t: '枯藤老树昏鸦，', r: '枯藤/老树/昏鸦，', f: '1.25 30% 40%' },
      { t: '小桥流水人家，', r: '小桥/流水/人家，', f: '1.25 55% 60%' },
      { t: '古道西风瘦马。', r: '古道/西风/瘦马。', f: '1.25 60% 65%' },
      { t: '夕阳西下，', r: '夕阳/西下，', f: '1.1 70% 30%' },
      { t: '断肠人在天涯。', r: '断肠人/在天涯。', f: '1.04 50% 50%' },
    ],
    notes: { 昏鸦: '黄昏时将要回巢的乌鸦', 断肠: '形容悲伤到极点', 天涯: '天边，指远离家乡的地方' },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

/* ================= 观沧海 · 击节朗读：每两字一拍依次亮起 ================= */
const BEAT_MS = 520;
let jijiTimer = null;
function initJiji() {
  const box = document.getElementById('jijiLines');
  box.innerHTML = POEMS.gch.lines.map((l) => `<p>${l.r.split('/').map((g) => `<span class="beat">${g}</span>`).join('')}</p>`).join('');
  const beats = [...box.querySelectorAll('.beat')];
  const btn = document.getElementById('jijiBtn');
  const stop = () => { clearInterval(jijiTimer); jijiTimer = null; beats.forEach((b) => b.classList.remove('hit')); btn.textContent = '开始击节'; };
  btn.addEventListener('click', () => {
    if (jijiTimer) { stop(); return; }
    let i = 0;
    btn.textContent = '停止';
    jijiTimer = setInterval(() => {
      beats.forEach((b, k) => b.classList.toggle('hit', k === i));
      i += 1;
      if (i > beats.length) stop();
    }, BEAT_MS);
  });
  return stop;
}

/* ================= 龙标 · 明月沿路送愁心 ================= */
const MOON_MS = 3200;
let moonAnim = 0;
function placeMoon(pos, path, t) {
  const pt = path.getPointAtLength(path.getTotalLength() * t);
  pos.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
}
function updateMoon(slide, step) {
  const pos = slide.querySelector('#moonPos');
  if (!pos) return;
  const path = slide.querySelector('#moonPath');
  cancelAnimationFrame(moonAnim);
  if (step < 4) { placeMoon(pos, path, 0); return; }
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / MOON_MS);
    placeMoon(pos, path, 1 - (1 - p) ** 2);
    if (p < 1) moonAnim = requestAnimationFrame(tick);
  };
  moonAnim = requestAnimationFrame(tick);
}

/* ================= 次北固山下 · 残夜到日出 ================= */
function initTime() {
  const slider = document.getElementById('timeSlider');
  const sky = document.getElementById('timeSky');
  const sun = document.getElementById('timeSun');
  const text = document.getElementById('timeText');
  const paint = () => {
    const v = +slider.value / 100;
    sky.style.setProperty('--t', v);
    sun.style.bottom = `${-20 + v * 62}%`;
    text.textContent = v < .35 ? '残夜：天还黑着，星星未退……' : v < .7 ? '海日生残夜：夜未尽，红日已从海上升起' : '江春入旧年：旧年未过，春意已到江上';
  };
  slider.addEventListener('input', paint);
  paint();
}

/* ================= 天净沙 · 意象拼图 ================= */
const YX = ['枯藤', '老树', '昏鸦', '小桥', '流水', '人家', '古道', '西风', '瘦马'];
function initYx() {
  const tiles = document.getElementById('yxTiles');
  const scene = document.getElementById('yxScene');
  tiles.innerHTML = YX.map((y) => `<button type="button" class="yx-tile${['小桥', '流水', '人家'].includes(y) ? ' warm' : ''}" data-yx="${y}">${y}</button>`).join('');
  tiles.addEventListener('click', (e) => {
    const b = e.target.closest('.yx-tile');
    if (!b) return;
    const on = b.classList.toggle('on');
    scene.querySelector(`.yx[data-yx="${b.dataset.yx}"]`).classList.toggle('show', on);
    const n = tiles.querySelectorAll('.yx-tile.on').length;
    scene.classList.toggle('full', n === YX.length);
    document.getElementById('yxOut').textContent = n === YX.length ? '九个意象都放进去了：萧瑟的秋景里，只有“小桥流水人家”是暖的。' : `已放入 ${n} / 9`;
  });
}

/* ================= 明月寄情 ================= */
const CLUE_LABELS = ['诗句', '诗人借月说'];
const CLUES = [
  { q: '三五二八时，千里与君同。<small>——鲍照《玩月城西门廨中》</small>', a: '十五、十六月圆的时候，我们虽隔千里，看到的却是同一轮明月。' },
  { q: '露从今夜白，月是故乡明。<small>——杜甫《月夜忆舍弟》</small>', a: '同一个月亮，诗人偏说故乡的最明——思乡情浓，看什么都是故乡的好。' },
  { q: '明月不谙离恨苦，斜光到晓穿朱户。<small>——晏殊《蝶恋花》</small>', a: '明月不懂离别的痛苦，整夜照进屋里，让人更睡不着。（谙：熟悉，懂得）' },
  { q: '但愿人长久，千里共婵娟。<small>——苏轼《水调歌头》</small>', a: '只愿亲人平安长久，相隔千里也能共赏这一轮明月。（婵娟：指月亮）' },
];

let stopJiji = () => {};
window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS });
    Poem.init();
    stopJiji = initJiji();
    initTime();
    initYx();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateMoon(slide, step);
    if (!slide.querySelector('#jijiLines')) stopJiji();
  },
};
