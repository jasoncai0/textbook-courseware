'use strict';
/* 美丽的小兴安岭 · 本课逻辑。故事页 / 朗读 / 小练笔用 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 四季轮盘 ================= */
const SEASONS = [
  { name: '春', color: '#8cc65a', tree: '树木抽出新的枝条，长出嫩绿的叶子。', things: ['积雪融化', '小溪淙淙', '小鹿喝水、照影子'], why: '可以看小鹿在溪边散步，听雪水淙淙地流。' },
  { name: '夏', color: '#2f8f4e', tree: '树木长得葱葱茏茏，密密层层的枝叶把森林封得严严实实的。', things: ['乳白色的浓雾', '千万缕金光', '野花像大花坛'], why: '早晨看浓雾和金光，草地上的野花像个大花坛。' },
  { name: '秋', color: '#e0a020', tree: '白桦和栎树的叶子变黄了，松柏显得更苍翠了。', things: ['落叶飞舞', '山葡萄、榛子', '蘑菇、木耳、人参'], why: '可以看落叶飞舞，还能尝尝酸甜的山葡萄、香脆的榛子。' },
  { name: '冬', color: '#7fb3d5', tree: '树上积满了白雪。', things: ['雪没过膝盖', '黑熊冬眠', '紫貂、松鼠'], why: '可以踩厚厚的雪，看松鼠在枝头散步。' },
];
const SECTOR = 360 / SEASONS.length;
const R = 180;
const C = 210;

function polar(deg, r) {
  const a = (deg - 90) * Math.PI / 180; // 0 度在正上方，顺时针
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
}

// 四个季节的小图标（画在扇区中心）
const ICONS = [
  '<path d="M0 14 V-6" stroke="#2f6b2e" stroke-width="4"/><ellipse cx="-9" cy="-8" rx="9" ry="5" fill="#fff" transform="rotate(-30 -9 -8)"/><ellipse cx="9" cy="-12" rx="9" ry="5" fill="#fff" transform="rotate(30 9 -12)"/>',
  '<circle r="12" fill="#ffe27a"/><g stroke="#ffe27a" stroke-width="3">' + Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="-16" x2="0" y2="-22" transform="rotate(${i * 45})"/>`).join('') + '</g>',
  '<path d="M0 -18 Q16 -4 0 18 Q-16 -4 0 -18 Z" fill="#fff4d0"/><path d="M0 -14 V16" stroke="#c47a12" stroke-width="2"/>',
  '<g stroke="#fff" stroke-width="3" stroke-linecap="round">' + Array.from({ length: 3 }, (_, i) => `<line x1="0" y1="-18" x2="0" y2="18" transform="rotate(${i * 60})"/>`).join('') + '</g>',
];

function initWheel() {
  const svg = document.getElementById('wheel');
  const sectors = SEASONS.map((s, i) => {
    const a0 = i * SECTOR;
    const [x0, y0] = polar(a0, R);
    const [x1, y1] = polar(a0 + SECTOR, R);
    const [tx, ty] = polar(a0 + SECTOR / 2, R * .62);
    const [ix, iy] = polar(a0 + SECTOR / 2, R * .32);
    return `<g class="sector" data-i="${i}">
      <path d="M${C} ${C} L${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${s.color}" stroke="#fff" stroke-width="4"/>
      <g class="upright" style="transform-origin:${tx.toFixed(1)}px ${ty.toFixed(1)}px"><text x="${tx.toFixed(1)}" y="${(ty + 16).toFixed(1)}" class="w-name">${s.name}</text></g>
      <g class="upright" style="transform-origin:${ix.toFixed(1)}px ${iy.toFixed(1)}px"><g transform="translate(${ix.toFixed(1)} ${iy.toFixed(1)})">${ICONS[i]}</g></g></g>`;
  }).join('');
  svg.innerHTML = `<g class="wheel-rot">${sectors}<circle cx="${C}" cy="${C}" r="26" fill="#fff" stroke="#c9b48b" stroke-width="3"/></g>
    <path d="M${C - 18} 6 L${C + 18} 6 L${C} 40 Z" fill="#d2553f" stroke="#fff" stroke-width="3"/>`;
  const rot = svg.querySelector('.wheel-rot');
  const card = document.getElementById('seasonCard');
  let angle = 0;
  let cur = -1;
  const pick = (i, extraTurns = 0) => {
    // 让选中扇区的中心转到正上方（指针处），总是往前转
    const target = -(i * SECTOR + SECTOR / 2);
    let next = target + 360 * Math.ceil((angle - target) / 360);
    next -= 360 * extraTurns;
    if (next === angle && extraTurns === 0) next -= 360;
    angle = next;
    rot.style.transform = `rotate(${angle}deg)`;
    // 文字和图标反向转，始终保持正立
    svg.querySelectorAll('.upright').forEach((g) => { g.style.transform = `rotate(${-angle}deg)`; });
    cur = i;
    const s = SEASONS[i];
    svg.querySelectorAll('.sector').forEach((g) => g.classList.toggle('sel', +g.dataset.i === i));
    card.style.setProperty('--c', s.color);
    card.innerHTML = `<h3>${s.name}天</h3>
      <p class="sc-tree"><b>树木</b>${s.tree}</p>
      <div class="sc-things">${s.things.map((t) => `<span>${t}</span>`).join('')}</div>
      <p class="sc-why"><b>我想${s.name}天去，因为</b>${s.why}</p>`;
  };
  svg.addEventListener('click', (e) => {
    const sec = e.target.closest('.sector');
    if (sec) pick(+sec.dataset.i);
  });
  document.getElementById('spinBtn').addEventListener('click', () => {
    let i = Math.floor(Math.random() * SEASONS.length);
    if (i === cur) i = (i + 1) % SEASONS.length;
    pick(i, 1);
  });
}

/* ================= 抽出 / 浸 ================= */
const GROW_MS = { slow: 3200, fast: 700 };

function initSprout() {
  const svg = document.getElementById('sprout');
  const twigs = [[150, 120, -40, -46], [150, 100, 44, -40], [150, 80, -36, -34], [150, 62, 30, -30], [150, 50, 0, -36]];
  svg.innerHTML = `<rect width="300" height="170" rx="10" fill="#eef6e6"/>
    <path d="M140 170 L146 50 H154 L160 170 Z" fill="#8a6a4a"/>
    ${twigs.map(([x, y, dx, dy]) => `<g class="twig" style="transform-origin:${x}px ${y}px"><path d="M${x} ${y} q${dx / 2} ${dy / 3} ${dx} ${dy}" stroke="#6a8a3a" stroke-width="4" fill="none" pathLength="1"/>
      <ellipse cx="${x + dx}" cy="${y + dy}" rx="8" ry="5" fill="#8cc65a"/></g>`).join('')}`;
  const play = (speed) => {
    const ms = GROW_MS[speed];
    svg.querySelectorAll('.twig').forEach((g, i) => {
      g.animate([{ transform: 'scale(0)' }, { transform: speed === 'fast' ? 'scale(1.12)' : 'scale(.9)', offset: .8 }, { transform: 'scale(1)' }],
        { duration: ms, delay: i * (ms / 8), fill: 'both', easing: speed === 'fast' ? 'cubic-bezier(.2,1.4,.4,1)' : 'linear' });
    });
  };
  document.querySelectorAll('[data-grow]').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('[data-grow]').forEach((x) => x.classList.toggle('solid', x === b));
    play(b.dataset.grow);
  }));
}

function initSoak() {
  const svg = document.getElementById('soak');
  const trees = Array.from({ length: 11 }, (_, i) => {
    const x = 14 + i * 27;
    const h = 60 + (i * 37) % 40;
    return `<path d="M${x} 150 l-14 0 l14 -${h} l14 ${h} z" fill="${i % 2 ? '#2f6b3e' : '#3f7f4e'}"/>`;
  }).join('');
  svg.innerHTML = `<rect width="300" height="170" rx="10" fill="#cfe3ee"/>
    <path d="M0 150 Q150 110 300 150 V170 H0 Z" fill="#7a9a5a"/>${trees}
    <g class="fog-thin"><ellipse cx="70" cy="120" rx="50" ry="10"/><ellipse cx="220" cy="100" rx="40" ry="8"/></g>
    <rect class="fog-thick" width="300" height="170" rx="10"/>`;
  const set = (kind) => {
    svg.setAttribute('class', kind);
    document.querySelectorAll('[data-fog]').forEach((x) => x.classList.toggle('solid', x.dataset.fog === kind));
  };
  document.querySelectorAll('[data-fog]').forEach((b) => b.addEventListener('click', () => {
    set('');
    requestAnimationFrame(() => requestAnimationFrame(() => set(b.dataset.fog)));
  }));
  set('thick');
}

/* ================= 小练笔 ================= */
const MOMENTS = [
  {
    name: '春天', pic: 'chun',
    prompt: '你的家乡春天最美吗？第一句写“我的家乡春天最美”，再写树木和别的景物。',
    hint: '可以写柳树抽出新芽、桃花开了、燕子飞回来、小河解冻……',
    example: '我的家乡春天最美。河边的柳树抽出了细细的新枝条，像姑娘的长辫子。桃花一朵挨着一朵，开得粉嘟嘟的。燕子从南方飞回来了，在田野上空飞来飞去。',
  },
  {
    name: '秋天', pic: 'qiu',
    prompt: '你的家乡秋天最美吗？围绕“秋天最美”写一段话。',
    hint: '可以写树叶的颜色、果园里的果子、田野里的庄稼，用上“献出”这样的词。',
    example: '我的家乡秋天最美。银杏树的叶子变黄了，像一把把小扇子。果园向人们献出了红红的苹果、黄澄澄的梨。田野里，稻子弯着腰，好像在向我们点头。',
  },
  {
    name: '冬天', pic: 'dong',
    prompt: '你的家乡冬天最美吗？写一写冬天的景色和小动物。',
    hint: '可以写雪、冰、树枝，也可以写小动物怎样过冬。',
    example: '我的家乡冬天最美。一场大雪过后，屋顶、树枝、田野都盖上了厚厚的白被子。小麻雀在雪地上跳来跳去，留下一串串“竹叶”。我们在院子里堆雪人、打雪仗，玩得满头大汗。',
  },
];

/* ================= 接入通用引擎（../shared/deck.js） ================= */
window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initWheel();
    initSprout();
    initSoak();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
