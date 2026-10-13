'use strict';
/* 古诗三首（三上 17）· 本课数据与互动。诗文模板见 ../shared/poem.js，画面见 ../shared/narrative.js */

const POEMS = {
  tmshan: {
    title: '望天门山', author: '［唐］李白',
    lines: [
      { t: '天门中断楚江开，', r: '天门/中断/楚江开，', f: '1.2 50% 50%' },
      { t: '碧水东流至此回。', r: '碧水/东流/至此回。', f: '1.25 50% 70%' },
      { t: '两岸青山相对出，', r: '两岸/青山/相对出，', f: '1.15 50% 50%' },
      { t: '孤帆一片日边来。', r: '孤帆/一片/日边来。', f: '1.3 50% 40%' },
    ],
    notes: { 天门: '天门山，今安徽东梁山与西梁山的合称，两山隔江相对，像天然的门户', 楚江: '长江中下游部分河段在古代流经楚地，所以叫楚江', 至此回: '流到这里打着旋儿回转' },
  },
  xihu: {
    title: '饮湖上初晴后雨', author: '［宋］苏轼',
    lines: [
      { t: '水光潋滟晴方好，', r: '水光/潋滟/晴方好，', f: '1.2 50% 65%' },
      { t: '山色空蒙雨亦奇。', r: '山色/空蒙/雨亦奇。', f: '1.15 55% 35%' },
      { t: '欲把西湖比西子，', r: '欲把/西湖/比西子，', f: '1.06 50% 50%' },
      { t: '淡妆浓抹总相宜。', r: '淡妆/浓抹/总相宜。', f: '1.04 50% 50%' },
    ],
    notes: { 潋滟: '波光闪动的样子', 方: '正', 空蒙: '迷茫缥缈的样子', 亦: '也', 西子: '即西施，春秋时代越国的美女' },
  },
  dongting: {
    title: '望洞庭', author: '［唐］刘禹锡',
    lines: [
      { t: '湖光秋月两相和，', r: '湖光/秋月/两相和，', f: '1.2 50% 35%' },
      { t: '潭面无风镜未磨。', r: '潭面/无风/镜未磨。', f: '1.2 50% 70%' },
      { t: '遥望洞庭山水翠，', r: '遥望/洞庭/山水翠，', f: '1.06 50% 50%' },
      { t: '白银盘里一青螺。', r: '白银盘里/一青螺。', f: '1.3 50% 55%' },
    ],
    notes: { 洞庭: '即洞庭湖，位于今湖南北部', 青螺: '青绿色的螺。这里用来形容洞庭湖中的君山', 两相和: '湖光和月光融合在一起' },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

const clamp01 = (v) => Math.max(0, Math.min(1, v));

/* ================= 望天门山：坐船往前，青山“出”来 ================= */
const SAIL_MS = 6000;
function initRiver() {
  const svg = document.getElementById('river');
  svg.innerHTML = `
    <defs><linearGradient id="rvSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe3ee"/><stop offset="1" stop-color="#f7ecd2"/></linearGradient></defs>
    <rect width="560" height="400" fill="url(#rvSky)"/>
    <circle cx="280" cy="168" r="26" fill="#f08a4b"/>
    <path d="M0 180 H560 V400 H0 Z" fill="#5fa79a"/>
    <path class="far" d="M0 180 Q140 172 280 180 T560 178" stroke="#e8f1ee" stroke-width="2" fill="none"/>
    <g class="sail"><path d="M0 0 V-22 L14 -2 Z" fill="#fbf6e8" stroke="#7a6a52"/><path d="M-10 0 H16 L12 5 H-6 Z" fill="#6b4b2a"/></g>
    <g class="mt mt-l"><path d="M0 0 L-60 -150 L-130 -70 L-220 10 Z" fill="#3f7f5e"/><path d="M-60 -150 L-90 -60 L-40 -40 Z" fill="#5f9a6a"/></g>
    <g class="mt mt-r"><path d="M0 0 L60 -160 L140 -60 L220 10 Z" fill="#3f7f5e"/><path d="M60 -160 L80 -70 L30 -40 Z" fill="#5f9a6a"/></g>
    <g class="waves" stroke="#e8f4ef" stroke-width="2" fill="none"></g>
    <path d="M200 400 Q280 360 360 400 Z" fill="#6b4b2a"/>
    <text class="t-m" x="16" y="30" fill="#2f5a4a">我在船上 · 往前看</text>`;
  const sail = svg.querySelector('.sail');
  const mtL = svg.querySelector('.mt-l');
  const mtR = svg.querySelector('.mt-r');
  const waves = svg.querySelector('.waves');
  const set = (p) => {
    // p: 0 远 → 1 近。山越来越大、往两边让开；帆从太阳边越来越近
    const s = .45 + 1.2 * p;
    const spread = 70 + 230 * p;
    mtL.setAttribute('transform', `translate(${280 - spread} ${190 + 120 * p}) scale(${s.toFixed(3)})`);
    mtR.setAttribute('transform', `translate(${280 + spread} ${190 + 120 * p}) scale(${s.toFixed(3)})`);
    sail.setAttribute('transform', `translate(${290 + 40 * p} ${186 + 120 * p}) scale(${(1 + 2.2 * p).toFixed(2)})`);
    waves.innerHTML = Array.from({ length: 6 }, (_, i) => {
      const k = ((i / 6) + p * 3) % 1;
      const y = 190 + k * k * 200;
      const w = 20 + k * 120;
      return `<path d="M${280 - w} ${y.toFixed(0)} q${w / 4} -6 ${w / 2} 0 M${280 + w / 2} ${y.toFixed(0)} q${w / 4} -6 ${w / 2} 0" opacity="${(1 - k * .6).toFixed(2)}"/>`;
    }).join('');
  };
  let raf = 0;
  const btn = document.getElementById('sailBtn');
  const stop = () => { cancelAnimationFrame(raf); raf = 0; btn.textContent = '▶ 坐船顺江而下'; };
  btn.addEventListener('click', () => {
    if (raf) { stop(); return; }
    const t0 = performance.now();
    btn.textContent = '❚❚ 停船';
    const tick = (now) => {
      const p = clamp01((now - t0) / SAIL_MS);
      set(p);
      if (p < 1) raf = requestAnimationFrame(tick); else stop();
    };
    raf = requestAnimationFrame(tick);
  });
  document.getElementById('sailReset').addEventListener('click', () => { stop(); set(0); });
  set(0);
  return stop;
}

/* ================= 饮湖上初晴后雨：晴天 / 雨天 ================= */
function initLake() {
  const svg = document.getElementById('lake');
  const sparkles = Array.from({ length: 26 }, (_, i) => {
    const x = 30 + (i * 83) % 500;
    const y = 230 + (i * 37) % 110;
    return `<path class="sp" d="M${x} ${y} l4 -4 l4 4 l-4 4 Z" style="animation-delay:${(i % 7) * .25}s"/>`;
  }).join('');
  const drops = Array.from({ length: 70 }, (_, i) => {
    const x = (i * 47) % 560;
    const y = (i * 29) % 360;
    return `<line x1="${x}" y1="${y}" x2="${x - 4}" y2="${y + 14}" style="animation-delay:${((i % 9) * .1).toFixed(1)}s"/>`;
  }).join('');
  svg.innerHTML = `
    <rect class="sky" width="560" height="360"/>
    <circle class="sun" cx="460" cy="70" r="30" fill="#ffd54f"/>
    <path class="hills" d="M0 210 Q70 120 150 170 Q230 90 320 160 Q400 110 480 150 Q530 130 560 160 V215 H0 Z"/>
    <rect class="water" y="210" width="560" height="150"/>
    <path d="M60 230 q20 -30 0 -60 M60 230 q-14 -20 -4 -50" stroke="#5f8a4a" stroke-width="3" fill="none"/>
    <g class="sparks">${sparkles}</g>
    <rect class="mist" width="560" height="360"/>
    <g class="drops">${drops}</g>
    <g class="boat" transform="translate(300 270)"><path d="M-40 0 H40 L30 10 H-30 Z" fill="#6b4b2a"/><path d="M-20 0 Q0 -18 20 0" fill="#c8a46a"/></g>`;
  const btns = document.querySelectorAll('[data-wx]');
  btns.forEach((b) => b.addEventListener('click', () => {
    svg.setAttribute('class', b.dataset.wx);
    btns.forEach((x) => x.classList.toggle('solid', x === b));
    document.querySelector('.s-weather').dataset.wx = b.dataset.wx;
  }));
  document.querySelector('.s-weather').dataset.wx = 'qing';
}

/* ================= 望洞庭：镜未磨、银盘青螺 ================= */
function initPlate() {
  const svg = document.getElementById('plate');
  svg.innerHTML = `
    <rect width="560" height="380" fill="#1f2c45"/>
    <g fill="#fff">${Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 71) % 560}" cy="${(i * 23) % 120}" r="${1 + (i % 3) * .5}"/>`).join('')}</g>
    <circle cx="420" cy="70" r="30" fill="#f6f1d8"/>
    <ellipse class="rim" cx="280" cy="250" rx="250" ry="104" fill="none" stroke="#e9eef3" stroke-width="12"/>
    <ellipse class="lake" cx="280" cy="250" rx="240" ry="96"/>
    <ellipse class="moon-r" cx="390" cy="235" rx="26" ry="9" fill="#f6f1d8" opacity=".75"/>
    <g class="ripples" stroke="#9fb3c8" stroke-width="2" fill="none">${Array.from({ length: 9 }, (_, i) =>
      `<path d="M${90 + (i % 3) * 140} ${210 + Math.floor(i / 3) * 30} q15 -6 30 0 t30 0"/>`).join('')}</g>
    <g class="junshan"><path d="M220 262 Q240 210 270 214 Q300 206 330 262 Z" fill="#3f7f5e"/><path d="M240 262 Q262 232 290 236 Q310 240 318 262 Z" fill="#5f9a6a"/></g>
    <g class="luo"><path d="M276 252 m-34 0 a34 30 0 1 1 68 0 a26 22 0 1 1 -52 0 a18 15 0 1 1 36 0 a10 8 0 1 1 -20 0" fill="none" stroke="#2f6b4e" stroke-width="5"/></g>
    <text class="t-m t-c lab-plate" x="280" y="366" fill="#e9eef3">白银盘</text>
    <text class="t-m t-c lab-luo" x="276" y="200" fill="#bfe3cf">青螺</text>`;
  document.getElementById('windBtn').addEventListener('click', (e) => {
    const windy = svg.classList.toggle('windy');
    e.target.textContent = windy ? '风停了' : '刮一阵风';
  });
  document.getElementById('plateBtn').addEventListener('click', (e) => {
    const on = svg.classList.toggle('plate');
    e.target.textContent = on ? '变回湖面' : '变成银盘青螺';
  });
}

/* ================= 接入通用引擎（../shared/deck.js） ================= */
let stopRiver = () => {};
window.LESSON = {
  init() {
    Narrative.init({});
    Poem.init();
    stopRiver = initRiver();
    initLake();
    initPlate();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (!slide.classList.contains('s-boat')) stopRiver();
  },
};
