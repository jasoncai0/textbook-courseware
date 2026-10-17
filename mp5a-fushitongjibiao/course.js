'use strict';
/* 五上 复式统计表 · 本课互动：四张单式统计表“搬”进复式统计表、点格子读数据（行列高亮）、
 * 物种数目与世界的十分之一比较、课堂调查表自动求和。数据照课本 p84、p87。 */
const $ = (id) => document.getElementById(id);

// [组别, 合计, 男, 女]（课本 p84，2012 年 11 月）
const GROUPS = [['古筝', 28, 7, 21], ['葫芦丝', 27, 17, 10], ['笛子', 22, 16, 6], ['小提琴', 30, 14, 16]];
const COLS = ['合计', '男', '女'];

const single = ([g, t, m, f], i) => `<div class="stab" data-i="${i}"><p class="st-cap">五年级${g}兴趣小组人数统计表<small>2012 年 11 月</small></p>
  <table class="mtab mini"><tr><th>性别</th><th>合计</th><th>男</th><th>女</th></tr><tr><th>人数</th><td>${t}</td><td>${m}</td><td>${f}</td></tr></table></div>`;

/* ---------- 第 3、4 页：四张单式表 → 复式表 ---------- */
function initMerge() {
  $('singles').innerHTML = GROUPS.map(single).join('');
  $('movers').innerHTML = GROUPS.map(single).join('');
  const tab = $('fuTab');
  const rows = GROUPS.map(([g]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<th>${g}小组</th><td></td><td></td><td></td>`;
    tab.appendChild(tr);
    return tr;
  });
  const move = (i) => {
    const card = $('movers').querySelector(`[data-i="${i}"]`);
    if (card.classList.contains('moved')) return;
    card.classList.add('moved');
    GROUPS[i].slice(1).forEach((v, k) => {
      const td = rows[i].children[k + 1];
      td.textContent = v;
      td.classList.remove('fill');
      void td.offsetWidth; // 重新触发动画
      td.classList.add('fill');
    });
  };
  $('movers').addEventListener('click', (e) => {
    const card = e.target.closest('.stab');
    if (card) move(+card.dataset.i);
  });
  $('mvAll').addEventListener('click', () => GROUPS.forEach((_, i) => move(i)));
  $('mvReset').addEventListener('click', () => {
    $('movers').querySelectorAll('.stab').forEach((c) => c.classList.remove('moved'));
    rows.forEach((tr) => [1, 2, 3].forEach((k) => { tr.children[k].textContent = ''; tr.children[k].classList.remove('fill'); }));
  });
}

/* ---------- 第 5 页：点格子读数据 ---------- */
function initRead() {
  const sum = (k) => GROUPS.reduce((s, r) => s + r[k], 0);
  const all = [['总计', sum(1), sum(2), sum(3)], ...GROUPS];
  const tab = $('readTab');
  tab.innerHTML = `<caption>青云小学五年级乐器兴趣小组人数统计表<small>2012 年 11 月</small></caption>
    <tr><th class="diag"><span class="d1">性别</span><span class="d2">数量/人</span><span class="d3">组别</span></th>${COLS.map((c) => `<th>${c}</th>`).join('')}</tr>
    ${all.map((r, i) => `<tr${i ? '' : ' class="tot"'}><th>${i ? `${r[0]}小组` : '总　计'}</th>${r.slice(1).map((v, k) => `<td data-r="${i}" data-c="${k}" tabindex="0">${v}</td>`).join('')}</tr>`).join('')}`;
  const say = (r, c) => {
    const [g, ...v] = all[r];
    const who = r === 0 ? '四个小组' : `${g}小组`;
    const what = ['一共有', '的男生有', '的女生有'][c];
    return `${who}${what} ${v[c]} 人。`;
  };
  tab.addEventListener('click', (e) => {
    const td = e.target.closest('td[data-r]');
    if (!td) return;
    const [r, c] = [+td.dataset.r, +td.dataset.c];
    tab.querySelectorAll('td, th').forEach((x) => x.classList.remove('hr', 'hc', 'hit'));
    tab.querySelectorAll(`td[data-r="${r}"]`).forEach((x) => x.classList.add('hr'));
    tab.querySelectorAll(`td[data-c="${c}"]`).forEach((x) => x.classList.add('hc'));
    tab.rows[r + 1].cells[0].classList.add('hr');
    tab.rows[0].cells[c + 1].classList.add('hc');
    td.classList.add('hit');
    $('readSay').textContent = say(r, c);
  });
}

/* ---------- 第 8 页：物种数目与世界的十分之一 ---------- */
const CHINA = [57260, 499, 1244, 376, 279, 3862, 51000];
const WORLD = [965105, 4181, 9040, 6300, 4184, 21400, 920000];
function initTenth() {
  const tr = $('tenthRow');
  const jr = $('judgeRow');
  WORLD.forEach((w, i) => {
    const td = document.createElement('td');
    td.className = 'tv';
    td.textContent = String(w / 10);
    tr.appendChild(td);
    const tj = document.createElement('td');
    tj.innerHTML = `<div class="pick mini-pick" data-ans="${CHINA[i] * 10 > w ? 'y' : 'n'}"><button type="button" data-k="y">超过</button><button type="button" data-k="n">不足</button></div>`;
    jr.appendChild(tj);
  });
  MCheck.init(jr);
  $('tenthGo').addEventListener('click', () => tr.classList.add('show'));
}

/* ---------- 第 9 页：调查表自动求和 ---------- */
function initSurvey() {
  const tab = $('survey');
  const val = (r, c) => +(tab.querySelector(`input[data-r="${r}"][data-c="${c}"]`).value.replace(/[^\d]/g, '') || 0);
  const upd = () => {
    const rs = [0, 1].map((r) => [0, 1, 2, 3].reduce((s, c) => s + val(r, c), 0));
    tab.querySelectorAll('.sum').forEach((td) => {
      const { r, c } = td.dataset;
      if (r === 't') td.textContent = rs[0] + rs[1];
      else if (r !== undefined) td.textContent = rs[+r];
      else td.textContent = val(0, +c) + val(1, +c);
    });
    const tot = [0, 1, 2, 3].map((c) => val(0, c) + val(1, c));
    const max = Math.max(...tot);
    const names = ['古筝', '葫芦丝', '笛子', '小提琴'];
    $('surveySay').textContent = max ? `想学${names.filter((_, c) => tot[c] === max).join('、')}的人最多（${max} 人）。` : '填好男生、女生的人数，“总计”和“合计”会自动算出来。';
  };
  tab.addEventListener('input', upd);
}

window.LESSON = {
  init() {
    initMerge();
    initRead();
    initTenth();
    initSurvey();
  },
};
