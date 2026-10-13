'use strict';
/* 寓言二则（亡羊补牢 · 揠苗助长）· 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 亡羊补牢“数羊”——羊圈窟窿、羊一只只变少、补好后日历翻过去羊数不变；
 *          ② 揠苗助长“前后对比”——田里禾苗被拔高、太阳落山，再到三幅剖面图：拔之前 / 拔以后 / 第二天枯死；
 *          ③ 补窟窿识字游戏。 */

/* 二下课文只给生字注音：data-pyk="脱:tuō 袄:ǎo" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 亡羊补牢：羊圈 ================= */
const SHEEP_POS = [[250, 268], [395, 250], [560, 268], [215, 372], [380, 386], [585, 378]];
const GONE_ORDER = [2, 5]; // 离窟窿最近的两只先不见
const HOLE = { x: 704, y: 330 };
const sheep = ([x, y], i) => `<g class="yy-sheep" data-i="${i}" style="--x:${HOLE.x - x}px;--y:${HOLE.y - y}px"><g transform="translate(${x} ${y})">
  <path d="M-30 18v24M-12 22v22M12 22v22M30 18v24" stroke="#4a3f38" stroke-width="7" stroke-linecap="round"/>
  <g fill="#fffdf6" stroke="#d8cfbd" stroke-width="2"><circle cx="-26" cy="0" r="20"/><circle cx="0" cy="-10" r="24"/><circle cx="24" cy="0" r="22"/><circle cx="-6" cy="14" r="22"/><circle cx="18" cy="16" r="18"/></g>
  <ellipse cx="-44" cy="-6" rx="14" ry="18" fill="#4a3f38"/><ellipse cx="-56" cy="-14" rx="9" ry="4" fill="#4a3f38" transform="rotate(-25 -56 -14)"/>
  <circle cx="-48" cy="-9" r="2.6" fill="#fff"/><circle cx="-40" cy="-9" r="2.6" fill="#fff"/>
  <text class="yy-num" x="0" y="-42">${i + 1}</text></g></g>`;

function fencePosts(x1, y1, x2, y2, n, skip) {
  let out = '';
  for (let k = 0; k <= n; k += 1) {
    const t = k / n;
    if (skip && t > skip[0] && t < skip[1]) continue; // eslint-disable-line no-continue
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    out += `<path d="M${x.toFixed(0)} ${y.toFixed(0)}v-62" />`;
  }
  return out;
}

function buildPen(svg) {
  svg.innerHTML = `
    <defs><linearGradient id="yySky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7ecf5"/><stop offset="1" stop-color="#f6efdc"/></linearGradient></defs>
    <rect width="800" height="520" fill="url(#yySky)"/>
    <circle cx="90" cy="70" r="34" fill="#ffe08a"/>
    <path d="M0 200Q200 170 400 186T800 180V520H0Z" fill="#cfe4b0"/>
    <path d="M120 198H680L740 456H60Z" fill="#ead9b4"/>
    <g class="yy-prints">${[0, 1, 2, 3, 4].map((k) => `<g transform="translate(${726 + k * 16} ${334 + (k % 2 ? 14 : -4) + k * 10})"><ellipse rx="5" ry="6"/><circle cx="-5" cy="-8" r="2.2"/><circle cx="0" cy="-10" r="2.2"/><circle cx="5" cy="-8" r="2.2"/></g>`).join('')}</g>
    <g class="yy-fence">
      <path d="M120 170H680M120 150H680"/>${fencePosts(120, 198, 680, 198, 14)}
      <path d="M120 150L60 410M120 172L60 432"/>${fencePosts(120, 198, 60, 456, 7)}
      <path d="M680 150L700 236M680 172L703 268M724 344L740 410M727 380L740 432"/>${fencePosts(680, 198, 740, 456, 7, [0.38, 0.64])}
    </g>
    <g class="yy-holemark"><ellipse cx="${HOLE.x + 6}" cy="${HOLE.y - 14}" rx="40" ry="62"/></g>
    <g class="yy-stub"><path d="M706 268l6 20l-10 -6zM722 344l-4 -18l10 8z"/></g>
    ${SHEEP_POS.map(sheep).join('')}
    <g class="yy-fence front"><path d="M60 410H740M60 432H740"/>${fencePosts(60, 456, 740, 456, 16)}</g>
    <g class="yy-planks"><rect x="690" y="262" width="44" height="120" rx="6" transform="rotate(-12 712 322)"/><rect x="684" y="282" width="40" height="110" rx="6" transform="rotate(14 704 337)"/>
      <circle cx="704" cy="282" r="4"/><circle cx="720" cy="364" r="4"/><circle cx="696" cy="300" r="4"/><circle cx="714" cy="380" r="4"/></g>
    <g class="yy-cnt"><rect x="560" y="18" width="220" height="70" rx="16"/><text x="670" y="66">羊：<tspan class="yy-cntn">6</tspan> 只</text></g>
    <g class="yy-bub jie"><rect x="16" y="20" width="330" height="104" rx="18"/><path d="M80 122l-10 26l34 -26z"/><text x="181" y="62">街坊：赶紧把羊圈修一修，</text><text x="181" y="104">堵上那个窟窿吧！</text></g>
    <g class="yy-bub ta"><rect x="16" y="20" width="330" height="104" rx="18"/><path d="M80 122l-10 26l34 -26z"/><text x="181" y="62">他：羊已经丢了，</text><text x="181" y="104">还修羊圈干什么？</text></g>
    <g class="yy-bub xin"><rect x="16" y="40" width="330" height="64" rx="32"/><circle cx="70" cy="120" r="8"/><circle cx="58" cy="140" r="5"/><text x="181" y="82">现在修还不晚！</text></g>
    <g class="yy-cal">${[3, 4, 5, 6].map((d, k) => `<g transform="translate(${24 + k * 132} 104)" style="--d:${k * 0.5}s"><rect width="120" height="44" rx="10"/><text x="60" y="31">第${d}天 4只</text></g>`).join('')}</g>`;
}

/* 每页每一步的羊圈状态 */
const PEN_STATES = {
  a: [{ gone: 0 }, { gone: 1, hole: 1 }, { gone: 1, hole: 1, bub: 'jie' }, { gone: 1, hole: 1, bub: 'ta' }],
  b: [{ gone: 1, hole: 1 }, { gone: 2, hole: 1 }, { gone: 2, hole: 1, bub: 'xin' }, { gone: 2, fixed: 1 }, { gone: 2, fixed: 1, cal: 1 }],
};
function setPen(svg, st) {
  svg.querySelectorAll('.yy-sheep').forEach((g) => {
    g.classList.toggle('gone', GONE_ORDER.slice(0, st.gone).includes(+g.dataset.i));
    g.classList.remove('hl');
  });
  svg.classList.toggle('hole', !!st.hole);
  svg.classList.toggle('fixed', !!st.fixed);
  svg.classList.toggle('cal', !!st.cal);
  svg.querySelectorAll('.yy-bub').forEach((b) => b.classList.toggle('on', b.classList.contains(st.bub)));
  svg.querySelector('.yy-cntn').textContent = SHEEP_POS.length - st.gone;
}

function countSheep(svg) {
  const left = [...svg.querySelectorAll('.yy-sheep:not(.gone)')];
  left.forEach((g) => g.classList.remove('hl'));
  const cnt = svg.querySelector('.yy-cnt');
  left.forEach((g, k) => setTimeout(() => {
    g.querySelector('.yy-num').textContent = k + 1;
    g.classList.add('hl');
    if (k === left.length - 1) { cnt.classList.remove('flash'); void cnt.getBBox(); cnt.classList.add('flash'); }
  }, 450 * k));
}

document.querySelectorAll('.yy-pen-slide').forEach((slide) => {
  const svg = slide.querySelector('.yy-pen');
  buildPen(svg);
  setPen(svg, PEN_STATES[slide.dataset.pen][0]);
  slide.querySelector('.yy-count').addEventListener('click', () => countSheep(svg));
});

/* ================= 揠苗助长：田里的禾苗 ================= */
const ROWS = [{ y: 300, n: 8, s: 0.7 }, { y: 370, n: 7, s: 0.85 }, { y: 452, n: 6, s: 1 }];
const seedling = (x, y, s, d) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="yy-sp" style="--d:${d}s">
  <path class="yy-root" d="M0 0q-6 14 -14 22M0 0q2 16 -2 26M0 0q6 12 14 20"/>
  <path class="yy-leaf" d="M0 0q-4 -36 -26 -58q16 26 4 58zM0 0q2 -44 18 -66q-6 30 -10 66zM0 0q8 -26 30 -40q-20 18 -22 40z"/></g></g>`;
function buildField(svg) {
  const rows = ROWS.map((r, ri) => {
    const gap = 640 / r.n;
    const plants = Array.from({ length: r.n }, (_, k) => seedling(110 + gap * k + (ri % 2) * gap / 2, r.y, r.s, (k + ri) * 0.12)).join('');
    return `${plants}<path class="yy-mud" d="M0 ${r.y}H800V${r.y + 34}H0Z"/><path class="yy-water" d="M0 ${r.y + 2}H800"/>`;
  }).join('');
  svg.innerHTML = `
    <defs><linearGradient id="yyFieldSky" x1="0" y1="0" x2="0" y2="1"><stop class="s1" offset="0"/><stop class="s2" offset="1"/></linearGradient></defs>
    <rect width="800" height="520" fill="url(#yyFieldSky)"/>
    <g class="yy-sun"><circle cx="400" cy="70" r="40"/></g>
    <path d="M0 262Q260 236 520 254T800 246V520H0Z" fill="#9cc77c"/>
    ${rows}
    <g class="yy-ruler"><rect x="738" y="300" width="40" height="160" rx="6"/>${Array.from({ length: 9 }, (_, k) => `<path d="M738 ${452 - k * 18}h${k % 2 ? 10 : 18}"/>`).join('')}
      <path class="yy-mark" d="M730 392h56"/></g>`;
}
const field = document.getElementById('yyField');
if (field) buildField(field);

/* ================= 前后对比：三幅剖面图 ================= */
function sprout(state) {
  const up = state ? -56 : 0;
  const leaf = state === 2 ? '#c7a454' : '#5aa845';
  const droop = state === 2 ? 'rotate(18)' : '';
  return `<rect width="240" height="300" fill="${state === 2 ? '#f6ecd6' : '#e6f3fb'}"/>
    <path d="M0 196H240V300H0Z" fill="#a77b52"/><path d="M0 196H240V206H0Z" fill="#8a6440"/>
    ${state ? '<path d="M104 196q16 22 32 0" fill="#6e4d31"/>' : ''}
    <g transform="translate(120 ${196 + up})">
      <path d="M0 0q-12 26 -28 40M0 0q4 30 -4 50M0 0q12 22 28 36" stroke="${state === 2 ? '#d9c9a6' : '#f4ead8'}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g transform="${droop}"><path d="M0 0q-6 -60 -44 -96q28 44 8 96zM0 0q4 -76 30 -112q-10 52 -16 112zM0 0q14 -44 50 -66q-34 30 -36 66z" fill="${leaf}"/></g>
    </g>
    <path d="M214 196V40" stroke="#c03a2b" stroke-width="3" stroke-dasharray="6 5"/>
    <path d="M204 ${state ? 84 : 100}h20" stroke="#c03a2b" stroke-width="4"/>`;
}
document.querySelectorAll('[data-sprout]').forEach((svg) => { svg.innerHTML = sprout(+svg.dataset.sprout); });

/* ================= 翻卡 ================= */
document.querySelectorAll('.yy-flip').forEach((card) => card.addEventListener('click', () => card.classList.toggle('flipped')));

/* ================= 分一分：生活中的事例 ================= */
const SORT_ITEMS = [
  { t: '小明有道题做错了，听老师讲完马上改正，后来再也没错过。', a: 0, why: '错了马上改——亡羊补牢。' },
  { t: '小花嫌盆里的花开得慢，一天浇好多次水，结果花根烂了。', a: 1, why: '太着急，帮了倒忙——揠苗助长。' },
  { t: '自行车刹车松了，摔了一跤后，爸爸赶紧把它修好了。', a: 0, why: '出了事赶紧补救——亡羊补牢。' },
  { t: '弟弟刚学写字，就想一天学会一百个字，结果一个也没记住。', a: 1, why: '学习要一步一步来——揠苗助长。' },
  { t: '书包进了雨水，书都湿了，我给书包套上了防雨罩。', a: 0, why: '吃了亏就想办法补上——亡羊补牢。' },
  { t: '小蝌蚪还没长出腿，就被急着捞上岸，想让它快点变青蛙。', a: 1, why: '不按规律来，反而害了它——揠苗助长。' },
];
const IDIOMS = ['亡羊补牢', '揠苗助长'];
function initSort(box) {
  box.innerHTML = `<div class="yy-sortlist">${SORT_ITEMS.map((it, i) => `<div class="yy-si" data-i="${i}"><p>${it.t}</p>
    <div class="yy-sb">${IDIOMS.map((name, k) => `<button type="button" class="btn" data-a="${k}">${name}</button>`).join('')}</div><small></small></div>`).join('')}</div>`;
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-a]');
    if (!btn) return;
    const row = btn.closest('.yy-si');
    const it = SORT_ITEMS[+row.dataset.i];
    if (+btn.dataset.a !== it.a) { row.classList.remove('no'); void row.offsetWidth; row.classList.add('no'); return; }
    row.classList.add('ok', it.a ? 'b' : 'a');
    row.querySelector('small').textContent = it.why;
  });
}
const sortBox = document.getElementById('yySort');
if (sortBox) initSort(sortBox);

/* ================= 识字游戏：补窟窿 ================= */
const FIX_Q = [
  { q: 'láo', ans: '牢', opts: ['宇', '牢', '军'] },
  { q: 'zuān', ans: '钻', opts: ['钻', '站', '粘'] },
  { q: 'diāo', ans: '叼', opts: ['叫', '叨', '叼'] },
  { q: 'fāng', ans: '坊', opts: ['访', '坊', '防'] },
  { q: 'huǐ', ans: '悔', opts: ['悔', '梅', '海'] },
  { q: 'jiāo', ans: '焦', opts: ['集', '准', '焦'] },
  { q: 'chuǎn', ans: '喘', opts: ['端', '喘', '瑞'] },
  { q: 'jié', ans: '截', opts: ['截', '栽', '裁'] },
];
function initFix(box) {
  let i = 0;
  let busy = false;
  box.innerHTML = `<div class="yy-rail">${FIX_Q.map((_, k) => `<span class="yy-slot" data-k="${k}"><b></b></span>`).join('')}</div>
    <div class="yy-fixask"></div>`;
  const ask = box.querySelector('.yy-fixask');
  const show = () => {
    const it = FIX_Q[i];
    box.querySelectorAll('.yy-slot').forEach((s, k) => s.classList.toggle('cur', k === i));
    ask.innerHTML = `<p class="yy-q hz-latin">${it.q}</p>
      <div class="yy-boards">${it.opts.map((o) => `<button type="button" class="yy-board" data-o="${o}">${o}</button>`).join('')}</div>
      <p class="yy-msg">${i ? '' : '哪块木板上的字读这个音？'}</p>`;
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      i = 0;
      box.querySelectorAll('.yy-slot').forEach((s) => { s.classList.remove('done'); s.querySelector('b').textContent = ''; });
      box.classList.remove('all');
      show();
      return;
    }
    const bd = e.target.closest('.yy-board');
    if (!bd || busy) return;
    const msg = box.querySelector('.yy-msg');
    if (bd.dataset.o !== FIX_Q[i].ans) {
      bd.classList.remove('wrong'); void bd.offsetWidth; bd.classList.add('wrong');
      msg.textContent = '这块木板不对，再读一读拼音';
      return;
    }
    busy = true;
    const slot = box.querySelector(`.yy-slot[data-k="${i}"]`);
    slot.querySelector('b').textContent = FIX_Q[i].ans;
    slot.classList.add('done');
    bd.classList.add('used');
    msg.textContent = `咚咚咚，钉好了！${FIX_Q[i].ans}（${FIX_Q[i].q}）`;
    setTimeout(() => {
      i += 1;
      if (i < FIX_Q.length) { show(); return; }
      box.classList.add('all');
      box.querySelectorAll('.yy-slot').forEach((s) => s.classList.remove('cur'));
      ask.innerHTML = '<p class="yy-q">羊圈修得结结实实，羊再也不会丢了！</p><button type="button" class="btn solid" data-again>再修一次</button>';
    }, 1100);
  });
  show();
}
const fixBox = document.getElementById('yyFix');
if (fixBox) initFix(fixBox);

Hanzi.init({
  cards: [
    { z: '寓', py: 'yù', words: [['寓言', 'yù yán']] },
    { z: '则', py: 'zé', words: [['二则', 'èr zé'], ['规则', 'guī zé']] },
    { z: '亡', py: 'wáng', words: [['亡羊补牢', 'wáng yáng bǔ láo'], ['逃亡', 'táo wáng']] },
    { z: '牢', py: 'láo', words: [['补牢', 'bǔ láo'], ['牢固', 'láo gù']] },
    { z: '圈', py: 'juàn', words: [['羊圈', 'yáng juàn'], ['猪圈', 'zhū juàn']] },
    { z: '钻', py: 'zuān', words: [['钻进去', 'zuān jìn qù'], ['钻研', 'zuān yán']] },
    { z: '叼', py: 'diāo', words: [['叼走', 'diāo zǒu']] },
    { z: '坊', py: 'fāng', words: [['街坊', 'jiē fāng']] },
    { z: '悔', py: 'huǐ', words: [['后悔', 'hòu huǐ'], ['悔改', 'huǐ gǎi']] },
    { z: '此', py: 'cǐ', words: [['从此', 'cóng cǐ'], ['因此', 'yīn cǐ']] },
    { z: '焦', py: 'jiāo', words: [['焦急', 'jiāo jí']] },
    { z: '筋', py: 'jīn', words: [['筋疲力尽', 'jīn pí lì jìn'], ['脑筋', 'nǎo jīn']] },
    { z: '疲', py: 'pí', words: [['疲劳', 'pí láo'], ['疲倦', 'pí juàn']] },
    { z: '喘', py: 'chuǎn', words: [['喘气', 'chuǎn qì']] },
    { z: '截', py: 'jié', words: [['一大截', 'yí dà jié'], ['半截', 'bàn jié']] },
  ],
  write: {
    a: [
      { z: '亡', py: 'wáng', bh: 3 },
      { z: '牢', py: 'láo', bs: '宀', bh: 7 },
      { z: '钻', py: 'zuān', bs: '钅', bh: 10 },
      { z: '劝', py: 'quàn', bh: 4 },
    ],
    b: [
      { z: '丢', py: 'diū', bh: 6 },
      { z: '告', py: 'gào', bs: '口', bh: 7 },
      { z: '筋', py: 'jīn', bs: '⺮', bh: 12 },
      { z: '疲', py: 'pí', bs: '疒', bh: 10 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.dataset.pen) {
      const st = PEN_STATES[slide.dataset.pen];
      setPen(slide.querySelector('.yy-pen'), st[Math.min(step, st.length - 1)]);
    }
    if (slide.contains(field)) {
      field.classList.toggle('pulled', step >= 4);
      field.classList.toggle('grow', step >= 1 && step < 4);
      field.dataset.day = Math.min(step, 3);
    }
  },
};
