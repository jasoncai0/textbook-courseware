'use strict';
/* 夏天里的成长 · 本课逻辑。故事页 / 选一选用 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

const NS = 'http://www.w3.org/2000/svg';
const clamp01 = (v) => Math.max(0, Math.min(1, v));

/* ================= 延时摄影：每一格按课文写的速度长 ================= */
const LAPSE_DAYS = 30;
const PLAY_SECONDS = 9;
const PANEL_W = 288;
const PANEL_H = 205;

function panel(svg, col, row, title) {
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('transform', `translate(${10 + col * 297} ${8 + row * 213})`);
  g.innerHTML = `<rect width="${PANEL_W}" height="${PANEL_H}" rx="10" fill="#fff" stroke="#d6e3c8"/>
    <text class="t-s" x="12" y="20" fill="#3d6b2e">${title}</text><text class="t-s cnt" x="${PANEL_W - 12}" y="20" text-anchor="end" fill="#b0471f"></text>`;
  svg.appendChild(g);
  return g;
}

// 瓜藤：一天可以长出几寸
function vinePanel(svg) {
  const g = panel(svg, 0, 0, '瓜藤 · 一天可以长出几寸');
  const path = 'M60 190 C 55 150, 70 120, 62 80 S 70 45, 110 42 S 190 50, 250 42';
  const leaves = Array.from({ length: 9 }, (_, i) => i);
  g.insertAdjacentHTML('beforeend', `
    <g stroke="#b08a57" stroke-width="5"><line x1="62" y1="195" x2="62" y2="40"/><line x1="250" y1="195" x2="250" y2="40"/><line x1="55" y1="42" x2="258" y2="42"/></g>
    <path class="vine" d="${path}" fill="none" stroke="#4f9a3a" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    <g class="leaves"></g>`);
  const vine = g.querySelector('.vine');
  const len = vine.getTotalLength();
  const leafG = g.querySelector('.leaves');
  leafG.innerHTML = leaves.map((i) => {
    const p = vine.getPointAtLength(len * (i + 1) / (leaves.length + 1));
    const flower = i % 3 === 2;
    return `<g class="leaf" data-at="${(i + 1) / (leaves.length + 1)}" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})">
      <ellipse rx="9" ry="6" fill="#6db84f" transform="rotate(${i % 2 ? 30 : -30})"/>${flower ? '<circle cy="-9" r="5" fill="#f2c230"/>' : ''}</g>`;
  }).join('');
  const DAYS_TO_FULL = 8;
  const INCH_PER_DAY = 3;
  return (day) => {
    const p = clamp01(day / DAYS_TO_FULL);
    vine.setAttribute('stroke-dashoffset', (1 - p).toFixed(3));
    leafG.querySelectorAll('.leaf').forEach((l) => { l.style.opacity = p >= +l.dataset.at ? 1 : 0; });
    g.querySelector('.cnt').textContent = `长了约 ${Math.round(day * INCH_PER_DAY)} 寸`;
  };
}

// 竹子、高粱：一夜可以多出半节
function bambooPanel(svg) {
  const g = panel(svg, 1, 0, '竹子 高粱 · 一夜可以多出半节');
  g.insertAdjacentHTML('beforeend', '<rect x="10" y="190" width="268" height="12" fill="#a5845a"/><g class="stalks"></g><text class="t-m pop" x="210" y="80" fill="#b0471f" opacity="0">叭！</text>');
  const stalks = g.querySelector('.stalks');
  const HALF = 5;
  const START = 6;
  const MAX = 30;
  let lastNight = -1;
  return (day, playing) => {
    const halves = Math.min(MAX, START + Math.floor(day));
    const h = halves * HALF;
    const joints = Array.from({ length: Math.floor(halves / 2) }, (_, i) => `<line x1="72" x2="94" y1="${190 - (i + 1) * HALF * 2}" y2="${190 - (i + 1) * HALF * 2}" stroke="#2f6b2e" stroke-width="2"/>`).join('');
    stalks.innerHTML = `<rect x="74" y="${190 - h}" width="18" height="${h}" fill="#5aa04a"/>${joints}
      <rect x="164" y="${190 - h * .9}" width="7" height="${h * .9}" fill="#7a9a3a"/>
      <ellipse cx="167" cy="${190 - h * .9 - 10}" rx="9" ry="16" fill="#a0442a"/>
      <text class="t-s" x="83" y="186" text-anchor="middle" fill="#fff">竹</text><text class="t-s" x="190" y="186" fill="#5d4a2a">高粱</text>`;
    const night = Math.floor(day);
    if (playing && night !== lastNight && halves < MAX) {
      const pop = g.querySelector('.pop');
      pop.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-14px)' }], { duration: 500 });
    }
    lastNight = night;
    g.querySelector('.cnt').textContent = `多出了 ${(halves - START) / 2} 节`;
  };
}

// 苞蕾 → 鲜花 → 小果实
function flowerPanel(svg) {
  const g = panel(svg, 2, 0, '昨天是苞蕾，今天是鲜花，明天就变成了小果实');
  g.insertAdjacentHTML('beforeend', `
    <path d="M144 172 V110" stroke="#4f9a3a" stroke-width="5"/><ellipse cx="128" cy="160" rx="16" ry="7" fill="#6db84f" transform="rotate(-25 128 160)"/>
    <g class="bud"><ellipse cx="144" cy="96" rx="11" ry="18" fill="#7bbf5a"/><path d="M137 84 Q144 70 151 84" fill="#e87a9a"/></g>
    <g class="bloom">${Array.from({ length: 6 }, (_, i) => `<ellipse cx="144" cy="72" rx="11" ry="22" fill="#f08bb0" transform="rotate(${i * 60} 144 96)"/>`).join('')}<circle cx="144" cy="96" r="10" fill="#f2c230"/></g>
    <g class="fruit"><circle class="fruit-ball" cx="144" cy="100" r="16" fill="#e0592f"/><path d="M144 84 l-6 -8 h12 Z" fill="#4f9a3a"/></g>
    <g class="t-s"><text class="d0" x="60" y="195">昨天</text><text class="d1" x="132" y="195">今天</text><text class="d2" x="204" y="195">明天</text></g>`);
  const show = (cls, on) => { g.querySelector(cls).style.opacity = on ? 1 : 0; };
  return (day) => {
    show('.bud', day < 1);
    show('.bloom', day >= 1 && day < 2);
    show('.fruit', day >= 2);
    g.querySelector('.fruit-ball').setAttribute('r', (10 + 8 * clamp01((day - 2) / 6)).toFixed(1));
    ['.d0', '.d1', '.d2'].forEach((c, i) => {
      const el = g.querySelector(c);
      const isNow = i === Math.min(2, Math.floor(day));
      el.setAttribute('fill', isNow ? '#b0471f' : '#9aa59a');
      el.setAttribute('font-weight', isNow ? 'bold' : 'normal');
    });
    g.querySelector('.cnt').textContent = '';
  };
}

// 白石头 → 苔藓；几天不见
function mossPanel(svg) {
  const g = panel(svg, 0, 1, '白石头，几天不见，就长满了苔藓');
  const blobs = Array.from({ length: 26 }, (_, i) => {
    const a = (i / 26) * Math.PI * 2;
    const r = 30 + (i % 4) * 12;
    return `<circle class="moss" cx="${(144 + Math.cos(a) * r * 1.5).toFixed(0)}" cy="${(128 + Math.sin(a) * r * .7).toFixed(0)}" r="${8 + (i % 3) * 3}" fill="#5f9a3e"/>`;
  }).join('');
  g.insertAdjacentHTML('beforeend', `<ellipse cx="144" cy="130" rx="105" ry="55" fill="#ecebe5" stroke="#c9c6bb"/><g class="mosses">${blobs}</g>`);
  const DAYS = 5;
  return (day) => {
    const p = clamp01(day / DAYS);
    g.querySelectorAll('.moss').forEach((m, i, all) => { m.style.opacity = i < p * all.length ? .9 : 0; });
    g.querySelector('.cnt').textContent = p >= 1 ? '长满了' : '';
  };
}

// 黄泥土 → 草坪菜畦
function fieldPanel(svg) {
  const g = panel(svg, 1, 1, '黄泥土，几天不见，就变成了草坪菜畦');
  const rows = Array.from({ length: 4 }, (_, r) => Array.from({ length: 9 }, (_, c) =>
    `<g class="veg" transform="translate(${30 + c * 28} ${70 + r * 34})"><ellipse rx="10" ry="7" fill="#58a83f"/><ellipse rx="5" ry="9" fill="#7cc35a"/></g>`).join('')).join('');
  g.insertAdjacentHTML('beforeend', `<rect x="12" y="50" width="264" height="145" rx="6" fill="#c9a46a"/><rect class="lawn" x="12" y="50" width="264" height="145" rx="6" fill="#9fd07a" opacity="0"/>${rows}`);
  const DAYS = 5;
  return (day) => {
    const p = clamp01(day / DAYS);
    g.querySelector('.lawn').setAttribute('opacity', (p * .7).toFixed(2));
    g.querySelectorAll('.veg').forEach((v, i, all) => {
      const s = clamp01(p * 1.4 - (i % 9) / 30);
      v.setAttribute('transform', v.getAttribute('transform').replace(/ scale\([^)]*\)/, '') + ` scale(${s.toFixed(2)})`);
    });
    g.querySelector('.cnt').textContent = '';
  };
}

// 小猫：个把月，就有了妈妈的一半大
function catPanel(svg) {
  const g = panel(svg, 2, 1, '小猫 · 个把月就有妈妈的一半大');
  const cat = (fill) => `<ellipse cx="0" cy="0" rx="46" ry="30" fill="${fill}"/><circle cx="-44" cy="-26" r="24" fill="${fill}"/>
    <path d="M-62 -42 l6 -22 l12 16 Z M-38 -46 l10 -20 l6 22 Z" fill="${fill}"/><path d="M44 -6 q30 -10 26 -40" fill="none" stroke="${fill}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="-52" cy="-28" r="3" fill="#2b2420"/><circle cx="-38" cy="-28" r="3" fill="#2b2420"/>`;
  g.insertAdjacentHTML('beforeend', `<rect x="12" y="185" width="264" height="10" fill="#d9cdb6"/>
    <g transform="translate(90 152)">${cat('#e8a05a')}</g><g class="kitten" transform="translate(210 185)"><g class="kitten-body">${cat('#f2c08a')}</g></g>
    <text class="t-s" x="90" y="110" text-anchor="middle" fill="#8a5a2a">妈妈</text>`);
  const START = .25;
  const END = .5;
  return (day) => {
    const s = START + (END - START) * clamp01(day / LAPSE_DAYS);
    g.querySelector('.kitten-body').setAttribute('transform', `translate(0 ${(-30 * s).toFixed(1)}) scale(${s.toFixed(3)})`);
    g.querySelector('.cnt').textContent = `妈妈的 ${Math.round(s * 100)}%`;
  };
}

function initLapse() {
  const svg = document.getElementById('lapse');
  const updaters = [vinePanel, bambooPanel, flowerPanel, mossPanel, fieldPanel, catPanel].map((f) => f(svg));
  const range = document.getElementById('lapseDay');
  const label = document.getElementById('lapseDayText');
  const btn = document.getElementById('lapsePlay');
  const setDay = (day, playing = false) => {
    range.value = day;
    label.textContent = Math.floor(day);
    updaters.forEach((u) => u(day, playing));
  };
  let raf = 0;
  const stop = () => { cancelAnimationFrame(raf); raf = 0; btn.textContent = '▶ 播放一个夏天'; };
  btn.addEventListener('click', () => {
    if (raf) { stop(); return; }
    const from = +range.value >= LAPSE_DAYS ? 0 : +range.value;
    const t0 = performance.now() - (from / LAPSE_DAYS) * PLAY_SECONDS * 1000;
    btn.textContent = '❚❚ 暂停';
    const tick = (now) => {
      const day = Math.min(LAPSE_DAYS, ((now - t0) / 1000 / PLAY_SECONDS) * LAPSE_DAYS);
      setDay(day, true);
      if (day < LAPSE_DAYS) raf = requestAnimationFrame(tick); else stop();
    };
    raf = requestAnimationFrame(tick);
  });
  range.addEventListener('input', () => { stop(); setDay(+range.value); });
  setDay(0);
  return stop;
}

/* ================= 第 3 段：山更丰满、庄稼更高 ================= */
function initNature() {
  const svg = document.getElementById('nature');
  svg.querySelector('.hill-trees').innerHTML = Array.from({ length: 14 }, (_, i) => {
    const x = 40 + (i * 13) % 170;
    const y = 214 - Math.sin(((x - 10) / 230) * Math.PI) * 88 + (i % 3) * 6;
    return `<circle class="pop" cx="${x}" cy="${y.toFixed(0)}" r="${9 + (i % 3) * 3}" fill="#4f8f3a" style="animation-delay:${(i * .08).toFixed(2)}s"/>`;
  }).join('');
  svg.querySelector('.crops').innerHTML = Array.from({ length: 10 }, (_, i) =>
    `<rect class="crop" x="${22 + i * 22}" y="70" width="${i % 2 ? 6 : 9}" height="120" fill="${i % 2 ? '#6aa84f' : '#8a6d3a'}" style="transition-delay:${(i * .07).toFixed(2)}s"/>`).join('');
}

/* ================= 选一选 ================= */
const PICKS = {
  beings: [
    { t: '瓜藤', ok: true, why: '一天几寸' }, { t: '向日葵', ok: false, why: '课文没写' },
    { t: '竹子', ok: true, why: '一夜半节' }, { t: '高粱', ok: true, why: '一夜半节' },
    { t: '知了', ok: false, why: '课文没写' }, { t: '苞蕾、鲜花、小果实', ok: true, why: '一天一变' },
    { t: '苔藓', ok: true, why: '几天长满' }, { t: '荷花', ok: false, why: '课文没写' },
    { t: '草坪菜畦', ok: true, why: '几天变成' }, { t: '小猫小狗小鸡小鸭', ok: true, why: '个把月' },
    { t: '青蛙', ok: false, why: '课文没写' },
  ],
  xmi: [
    { t: '跑了几十里地去看戏。', ok: true, why: '√ 为看戏不怕远' },
    { t: '常给我们讲故事。', ok: false, why: '✗ 和“戏迷”无关' },
    { t: '在爷爷的倡导下，街道组织了业余戏班子。', ok: true, why: '√ 爱戏到组织戏班' },
    { t: '干活时会哼上两句流行歌曲。', ok: false, why: '✗ 流行歌曲不是戏曲' },
    { t: '边炒菜边做戏曲里的动作，把菜炒煳了。', ok: true, why: '√ 入迷' },
    { t: '到文化馆拜师学戏。', ok: true, why: '√ 不光看还要学' },
    { t: '每天看书看到很晚。', ok: false, why: '✗ 和“戏迷”无关' },
    { t: '一看到戏曲表演就占着电视。', ok: true, why: '√ 爱看戏' },
  ],
};

/* ================= 接入通用引擎（../shared/deck.js） ================= */
let stopLapse = () => {};
window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS });
    stopLapse = initLapse();
    initNature();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (!slide.classList.contains('s-lapse')) stopLapse();
  },
};
