'use strict';
/* 五下 2和5的倍数的特征 · 本课互动：例 4 百数表画记号、看个位整列、大数检验器、数字卡片组数。
 * 通用部分见 ../shared/math.js、mcheck.js、mnum.js */
const $ = (id) => document.getElementById(id);
const is2 = (n) => n % 2 === 0;
const is5 = (n) => n % 5 === 0;

/* ---------- 第 3 页：学生自己画 ---------- */
function initDraw() {
  const count = (t) => {
    $('h4nT').textContent = t.marked('t').filter(is5).length;
    $('h4nO').textContent = t.marked('o').filter(is2).length;
  };
  const t = MNum.table($('h4'), { from: 1, to: 100, cols: 10, tools: { t: is5, o: is2 }, onChange: count });
  MNum.tools($('h4Tools'), t);
  $('h4AutoT').addEventListener('click', () => { t.clear('t'); t.auto('t', 90); });
  $('h4AutoO').addEventListener('click', () => { t.clear('o'); t.auto('o', 45); });
  $('h4Clear').addEventListener('click', () => { t.clear('t'); t.clear('o'); });
}

/* ---------- 第 4 页：看个位（整列加底色） ---------- */
function initCols() {
  const t = MNum.table($('h5'), { from: 1, to: 100, cols: 10, tools: { t: is5, o: is2 }, readonly: true });
  const show = (k) => {
    const test = k === 't' ? is5 : is2;
    t.clear('t');
    t.clear('o');
    t.hl(test);
    t.auto(k, 25);
    $('h5Col5').classList.toggle('solid', k === 't');
    $('h5Col2').classList.toggle('solid', k === 'o');
  };
  $('h5Col5').addEventListener('click', () => show('t'));
  $('h5Col2').addEventListener('click', () => show('o'));
  show('t');
}

/* ---------- 第 5 页：大数检验器 ---------- */
function initChecker() {
  const run = () => {
    const raw = $('ckIn').value.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '').slice(0, 12);
    if (!raw || raw === '0') {
      $('ckShow').textContent = '请输入一个不是 0 的自然数';
      $('ck2').innerHTML = '';
      $('ck5').innerHTML = '';
      return;
    }
    $('ckIn').value = raw;
    const d = +raw.slice(-1);
    $('ckShow').innerHTML = [...raw].map((c, i) => `<span class="${i === raw.length - 1 ? 'one' : ''}">${c}</span>`).join('');
    // 用 BigInt 算除法，长数也精确
    const n = BigInt(raw);
    const line = (k) => {
      const q = n / BigInt(k);
      const r = n % BigInt(k);
      return r === 0n ? `${raw} ÷ ${k} = ${q}，<b class="ok">没有余数</b>` : `${raw} ÷ ${k} = ${q}……${r}，<b class="no">有余数</b>`;
    };
    $('ck2').innerHTML = `<h4>是 2 的倍数吗？</h4><p>个位是 <b class="one-t">${d}</b> → ${d % 2 === 0 ? '<b class="ok">是 2 的倍数（偶数）</b>' : '<b class="no">不是 2 的倍数（奇数）</b>'}</p><p class="vf">验证：${line(2)}</p>`;
    $('ck5').innerHTML = `<h4>是 5 的倍数吗？</h4><p>个位是 <b class="one-t">${d}</b> → ${d % 5 === 0 ? '<b class="ok">是 5 的倍数</b>' : '<b class="no">不是 5 的倍数</b>'}</p><p class="vf">验证：${line(5)}</p>`;
  };
  $('ckGo').addEventListener('click', run);
  $('ckIn').addEventListener('keydown', (e) => { if (e.key === 'Enter') run(); });
  $('ckEg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    $('ckIn').value = b.dataset.v;
    run();
  });
  run();
}

/* ---------- 第 6 页：既是 2 又是 5 的倍数 ---------- */
function initBoth() {
  const t = MNum.table($('h6'), { from: 1, to: 100, cols: 10, tools: { t: is5, o: is2 }, readonly: true });
  t.auto('t', 0);
  t.auto('o', 0);
  $('h6Both').addEventListener('click', () => t.hl((n) => n % 10 === 0));
}

/* ---------- 第 7 页：数字卡片组成两位数 ---------- */
const CARDS = [0, 5, 6, 7];
const ALL_NUMS = CARDS.flatMap((a) => CARDS.filter((b) => b !== a && a !== 0).map((b) => a * 10 + b));
const GROUPS = [
  { id: 'A', test: is2 },
  { id: 'B', test: is5 },
  { id: 'C', test: (n) => is2(n) && is5(n) },
];
function initCards() {
  const st = { tens: null, found: new Set() };
  const nums = $('cdNum').children;
  const render = () => {
    GROUPS.forEach(({ id, test }) => {
      const want = ALL_NUMS.filter(test);
      const got = want.filter((n) => st.found.has(n)).sort((a, b) => a - b);
      $(`cd${id}`).textContent = got.join('，');
      $(`cd${id}n`).textContent = `${got.length}/${want.length}`;
      $(`cd${id}n`).classList.toggle('full', got.length === want.length);
    });
  };
  $('cdPick').addEventListener('click', (e) => {
    const b = e.target.closest('[data-d]');
    if (!b) return;
    const d = +b.dataset.d;
    if (st.tens === null) {
      if (d === 0) { $('cdMsg').textContent = '十位不能是 0，换一张卡片。'; return; }
      st.tens = d;
      nums[0].textContent = d;
      nums[1].textContent = '?';
      b.disabled = true;
      $('cdMsg').textContent = '再点一张卡片放在个位。';
      return;
    }
    const n = st.tens * 10 + d;
    nums[1].textContent = d;
    const tags = [is2(n) ? '偶数' : '奇数', is5(n) ? '是 5 的倍数' : '不是 5 的倍数'];
    $('cdMsg').textContent = `${n}：个位是 ${d}，${tags.join('，')}。`;
    st.found.add(n);
    st.tens = null;
    $('cdPick').querySelectorAll('button').forEach((x) => { x.disabled = false; });
    render();
  });
  render();
}

window.LESSON = {
  init() {
    initDraw();
    initCols();
    initChecker();
    initBoth();
    initCards();
  },
};
