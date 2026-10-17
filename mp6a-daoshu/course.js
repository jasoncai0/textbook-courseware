'use strict';
/* 六上 倒数的认识 · 本课互动：例 7 找朋友（点两张卡算乘积）、翻牌求倒数（含整数、1、0、自己出题）、
 * 练习六 17 配对、思考题填圆圈（每条线乘积为 1）。乘积一律用整数分子分母精确计算。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const gcd = FracFig.gcd;
const NS = 'http://www.w3.org/2000/svg';
const el = FracFig.el;

const fr = (n, d = 1) => ({ n, d });
const ftex = ({ n, d }) => (d === 1 ? `${n}` : `\\dfrac{${n}}{${d}}`);
const mul = (p, q) => {
  const n = p.n * q.n;
  const d = p.d * q.d;
  const g = gcd(n, d) || 1;
  return fr(n / g, d / g);
};
const isOne = (x) => x.n === x.d;

/* 例 7 / 练习六 17：点两张卡片，乘积是 1 就配成一对 */
function pairGame(box, nums, onMsg, pairsBox) {
  let sel = null;
  nums.forEach((x, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'card';
    b.innerHTML = `$${ftex(x)}$`;
    b.addEventListener('click', () => {
      if (b.classList.contains('paired')) return;
      if (sel === null) { sel = i; b.classList.add('sel'); onMsg(`选了 $${ftex(x)}$，再点一张。`); return; }
      const prev = box.children[sel];
      prev.classList.remove('sel');
      if (sel === i) { sel = null; onMsg('先点一张，再点一张。'); return; }
      const p = mul(nums[sel], x);
      const eq = `$${ftex(nums[sel])}\\times${ftex(x)}=\\dfrac{${nums[sel].n}\\times${x.n}}{${nums[sel].d}\\times${x.d}}=${ftex(p)}$`;
      if (isOne(p)) {
        prev.classList.add('paired'); b.classList.add('paired');
        onMsg(`<b>✓ 乘积是 1！</b>${eq}`, true);
        if (pairsBox) {
          const s = document.createElement('span');
          s.className = 'pair-tag';
          s.innerHTML = `$${ftex(nums[sel])}$ 和 $${ftex(x)}$`;
          pairsBox.appendChild(s);
          tex(s);
        }
      } else onMsg(`${eq}，不是 1。再试试。`);
      sel = null;
    });
    box.appendChild(b);
  });
  tex(box);
}
function initPairs() {
  const say = (id) => (html, ok) => { const m = $(id); m.innerHTML = html; m.classList.toggle('fb-ok', !!ok); tex(m); };
  pairGame($('cards8'), [fr(3, 8), fr(5, 4), fr(3, 5), fr(7, 10), fr(4, 5), fr(2, 3), fr(10, 7), fr(8, 3)], say('c8Msg'), $('c8Pairs'));
  pairGame($('cards17'), [fr(1, 4), fr(1, 6), fr(4), fr(3, 7), fr(11, 6), fr(7, 3), fr(6), fr(6, 11)], say('c17Msg'));
}

/* 翻牌：正面是这个数，背面是分子分母调换后的数 */
function flipMsg(x) {
  if (x.n === 0) return `$0=\\dfrac01$，翻过来是 $\\dfrac10$——分母是 0，<b>没有意义</b>！0 乘任何数都得 0，不可能得 1，所以 <b>0 没有倒数</b>。`;
  const back = fr(x.d, x.n);
  const pre = x.d === 1 ? `$${x.n}=\\dfrac{${x.n}}{1}$，翻过来是 $\\dfrac{1}{${x.n}}$。` : '';
  return `${pre}检验：$${ftex(x)}\\times${ftex(back)}=${ftex(mul(x, back))}$ ✓　所以 $${ftex(x)}$ 的倒数是 $${ftex(back)}$。`;
}
function makeFlip(x) {
  const c = document.createElement('button');
  c.type = 'button';
  c.className = `flip${x.n === 0 ? ' zero' : ''}`;
  const front = x.d === 1 ? `${x.n}` : `\\dfrac{${x.n}}{${x.d}}`;
  const back = x.n === 0 ? '\\dfrac{1}{0}' : (x.n === 1 && x.d === 1 ? '1' : `\\dfrac{${x.d}}{${x.n}}`);
  c.innerHTML = `<span class="fi"><span class="ff">$${front}$</span><span class="fb">$${back}$</span></span>`;
  c.addEventListener('click', () => {
    c.classList.toggle('on');
    const m = $('flipMsg');
    m.innerHTML = c.classList.contains('on') ? flipMsg(x) : `$${front}$ 翻回来了。`;
    m.classList.toggle('fb-ok', c.classList.contains('on') && x.n !== 0);
    tex(m);
  });
  tex(c);
  return c;
}
const MAX_IN = 999;
function initFlips() {
  const box = $('flips');
  [fr(3, 5), fr(2, 3), fr(5), fr(1), fr(0)].forEach((x) => box.appendChild(makeFlip(x)));
  $('ownGo').addEventListener('click', () => {
    const s = $('ownIn').value.trim().replace(/／/g, '/');
    const m = s.match(/^(\d{1,3})(?:\/(\d{1,3}))?$/);
    const msg = $('flipMsg');
    if (!m || (m[2] !== undefined && +m[2] === 0) || +m[1] > MAX_IN) {
      msg.innerHTML = '请输入一个整数或分数，例如 7/9 或 6（分母不能是 0）。';
      msg.classList.remove('fb-ok');
      return;
    }
    const x = fr(+m[1], m[2] ? +m[2] : 1);
    if (box.children.length >= 8) box.removeChild(box.children[5]);
    box.appendChild(makeFlip(x));
    msg.innerHTML = '新卡片做好了，点它翻一翻。';
  });
}

/* 思考题：7 个圆圈，3 条线都过中间的圆 */
const TREE_NUMS = [fr(3, 4), fr(5, 6), fr(5, 7), fr(5, 4), fr(9, 8), fr(16, 15), fr(21, 16)];
const SPOTS = [[210, 40], [210, 108], [210, 178], [150, 220], [88, 262], [270, 220], [332, 262]];
const LINES = [[0, 1, 2], [2, 3, 4], [2, 5, 6]];
function initTree() {
  const svg = $('tree');
  const chips = $('chips7');
  const slot = Array(7).fill(null);
  let pick = null;
  LINES.forEach((ln) => {
    const [a, , c] = ln.map((k) => SPOTS[k]);
    el('line', { x1: a[0], y1: a[1], x2: c[0], y2: c[1], stroke: '#9aa7b3', 'stroke-width': 3 }, svg);
  });
  const circles = SPOTS.map(([x, y], k) => {
    const g = el('g', { class: 'spot' }, svg);
    el('circle', { cx: x, cy: y, r: 28, fill: '#fff', stroke: '#2a9fd6', 'stroke-width': 3 }, g);
    const t1 = el('text', { x, y: y - 4, class: 'tn' }, g);
    const t2 = el('text', { x, y: y + 20, class: 'tn' }, g);
    const bar = el('line', { x1: x - 14, x2: x + 14, y1: y + 2, y2: y + 2, stroke: 'transparent', 'stroke-width': 2 }, g);
    g.addEventListener('click', () => {
      if (pick === null) { slot[k] = null; render(); return; }
      const old = slot.indexOf(pick);
      if (old >= 0) slot[old] = null;
      slot[k] = pick; pick = null; render();
    });
    return { t1, t2, bar };
  });
  const render = () => {
    circles.forEach(({ t1, t2, bar }, k) => {
      const v = slot[k] === null ? null : TREE_NUMS[slot[k]];
      t1.textContent = v ? v.n : '';
      t2.textContent = v ? v.d : '';
      bar.setAttribute('stroke', v ? '#1f2d3a' : 'transparent');
    });
    chips.querySelectorAll('button').forEach((b, i) => {
      b.classList.toggle('used', slot.includes(i));
      b.classList.toggle('sel', pick === i);
    });
    const parts = LINES.map((ln) => {
      if (ln.some((k) => slot[k] === null)) return '（未填满）';
      const p = ln.map((k) => TREE_NUMS[slot[k]]).reduce(mul);
      return `$${ftex(p)}$${isOne(p) ? ' ✓' : ''}`;
    });
    const allOk = parts.every((s) => s.includes('✓'));
    const m = $('treeMsg');
    m.innerHTML = `竖线：${parts[0]}<br>左线：${parts[1]}<br>右线：${parts[2]}${allOk ? '<br><b>✓ 三条线的乘积都是 1！</b>' : ''}`;
    m.classList.toggle('fb-ok', allOk);
    tex(m);
  };
  TREE_NUMS.forEach((x, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn';
    b.innerHTML = `$${ftex(x)}$`;
    b.addEventListener('click', () => { pick = pick === i ? null : i; render(); });
    chips.appendChild(b);
  });
  tex(chips);
  render();
}

window.LESSON = {
  init() {
    initPairs();
    initFlips();
    initTree();
    FracFig.exact();
  },
};
