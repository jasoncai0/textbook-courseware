'use strict';
/* 八下 7.3 频数和频率 · 本课互动：课堂唱票器（现场数据，自动划记、得票率）、47 城市空气质量逐个“唱”入分级
 * （划记 + 条形图同步）、分级统计图、脉搏数据分组高亮。数据均取自课本 p22–24。 */
const { tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];

/* ---------- 第 3 页：课堂唱票器 ---------- */
function initVote() {
  const names = ['候选人甲', '候选人乙', '候选人丙', '候选人丁'];
  const log = [];
  $('voteBtns').innerHTML = names.map((n, i) => `<span class="vote"><input type="text" value="${n}" data-i="${i}" aria-label="候选人姓名"><button type="button" class="btn solid" data-v="${i}">+1 票</button></span>`).join('');
  const nameOf = (i) => $('voteBtns').querySelector(`input[data-i="${i}"]`).value || `候选人${i + 1}`;
  const render = () => {
    const n = log.length;
    const cnt = names.map((_, i) => log.filter((v) => v === i).length);
    $('voteTab').innerHTML = '<tr><th>候选人</th><th>唱票记录</th><th>得票数</th><th>得票率</th></tr>'
      + cnt.map((c, i) => `<tr><td>${nameOf(i)}</td><td class="tl">${MStat.tally(c)}</td><td>${c}</td><td>${n ? (c / n).toFixed(3) : ''}</td></tr>`).join('')
      + `<tr><th>合计</th><td></td><td>${n}</td><td>${n ? '1' : ''}</td></tr>`;
    const msg = $('voteMsg');
    if (!n) { msg.className = 'tip feedback'; msg.textContent = '还没有唱票。'; return; }
    const max = Math.max(...cnt);
    const top = cnt.map((c, i) => (c === max ? nameOf(i) : null)).filter(Boolean);
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `已唱 ${n} 张票。目前领先：${top.join('、')}（${max} 票，得票率 $\\frac{${max}}{${n}}\\approx${(max / n).toFixed(3)}$）${top.length > 1 ? '——票数相同！' : ''}`;
    tex(msg);
  };
  $('voteBtns').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) { log.push(+b.dataset.v); render(); } });
  $('voteBtns').addEventListener('input', render);
  $('voteUndo').addEventListener('click', () => { log.pop(); render(); });
  $('voteClr').addEventListener('click', () => { log.length = 0; render(); });
  render();
}

/* ---------- 第 5 页：47 个城市（课本 p22–23，按课本表格顺序） ---------- */
const CITIES = [['郑州', 85], ['武汉', 99], ['长沙', 107], ['广州', 119], ['深圳', 94], ['珠海', 78], ['汕头', 67], ['湛江', 51], ['南宁', 111], ['桂林', 52], ['北海', 62],
  ['海口', 49], ['成都', 114], ['重庆', 174], ['贵阳', 96], ['昆明', 74], ['拉萨', 76], ['西安', 128], ['兰州', 128], ['西宁', 97], ['银川', 65], ['乌鲁木齐', 205], ['北京', 64],
  ['天津', 81], ['石家庄', 98], ['秦皇岛', 73], ['太原', 125], ['呼和浩特', 124], ['沈阳', 138], ['大连', 68], ['长春', 90], ['哈尔滨', 98], ['上海', 86], ['南京', 74],
  ['苏州', 89], ['南通', 79], ['连云港', 71], ['杭州', 92], ['宁波', 80], ['温州', 82], ['合肥', 81], ['福州', 79], ['厦门', 66], ['南昌', 101], ['济南', 93], ['青岛', 73], ['烟台', 53]];
const LV = ['Ⅰ级', 'Ⅱ级', 'Ⅲ级', 'Ⅳ级'];
const RANGE = ['1～50', '51～100', '101～200', '201～300'];
const level = (v) => (v <= 50 ? 0 : v <= 100 ? 1 : v <= 200 ? 2 : 3);
const N = CITIES.length;
const FINAL = LV.map((_, k) => CITIES.filter(([, v]) => level(v) === k).length); // 1 34 11 1

function initCities() {
  let done = 0;
  $('cities').innerHTML = CITIES.map(([c, v]) => `<span><b>${c}</b><i>${v}</i></span>`).join('');
  const cards = [...$('cities').children];
  const cnt = () => LV.map((_, k) => CITIES.slice(0, done).filter(([, v]) => level(v) === k).length);
  const bar = MStat.bars($('cityBar'), { cats: LV, ymax: 36, ty: 5, labels: ['', '频数'], w: 520, h: 230, gw: 0.5, series: [{ vals: cnt, color: '#4f9bd0' }] });
  boards.push(bar);
  const render = () => {
    const c = cnt();
    const cur = done ? CITIES[done - 1] : null;
    const curLv = cur ? level(cur[1]) : -1;
    const full = done === N;
    $('cityTab').innerHTML = `<tr><th>空气污染指数</th>${LV.map((l, k) => `<th class="${k === curLv ? 'on' : ''}">${l}<br><small>${RANGE[k]}</small></th>`).join('')}<th>合计</th></tr>`
      + `<tr><th>划记</th>${c.map((x, k) => `<td class="tl ${k === curLv ? 'on' : ''}">${MStat.tally(x)}</td>`).join('')}<td></td></tr>`
      + `<tr><th>频数</th>${c.map((x, k) => `<td class="${k === curLv ? 'on' : ''}">${x}</td>`).join('')}<td>${done}</td></tr>`
      + `<tr><th>频率<br><small>（精确到 0.001）</small></th>${c.map((x) => `<td>${full ? (x / N).toFixed(3) : ''}</td>`).join('')}<td>${full ? '0.999' : ''}</td></tr>`;
    cards.forEach((el, i) => { el.className = i === done - 1 ? 'cur' : i < done ? 'done' : ''; });
    const msg = $('cityMsg');
    if (!cur) { msg.className = 'tip feedback'; msg.textContent = '点“唱下一个”开始。'; }
    else if (full) { msg.className = 'tip feedback fb-ok'; msg.innerHTML = `47 个全部唱完：频数 ${FINAL.join(' + ')} = 47。频率 = 频数 ÷ 47。`; }
    else { msg.className = 'tip feedback fb-ok'; msg.innerHTML = `第 ${done} 个：${cur[0]} ${cur[1]}，在 ${RANGE[curLv]} 之间 → <b>${LV[curLv]}</b>`; }
    bar.update();
  };
  const go = (k) => { done = Math.min(N, done + k); render(); };
  $('cityOne').addEventListener('click', () => go(1));
  $('cityTen').addEventListener('click', () => go(10));
  $('cityAll').addEventListener('click', () => go(N));
  $('cityClr').addEventListener('click', () => { done = 0; render(); });
  render();
}

/* ---------- 第 6 页：分级统计图 ---------- */
function initLvCharts() {
  boards.push(MStat.bars($('lvBar'), { cats: LV, ymax: 36, ty: 5, labels: ['', '城市数'], w: 360, h: 280, gw: 0.5, series: [{ vals: FINAL, color: '#4f9bd0' }] }));
  MStat.pie($('lvPie'), LV.map((l, k) => ({ name: l, v: FINAL[k], color: ['#2f7d6b', '#4f9bd0', '#e0b03a', '#c0392b'][k] })), { r: 80, pad: 90, padY: 40, fs: 17, label: (it, p) => `${it.name} ${fmt(p, 1)}%` });
}

/* ---------- 第 8 页：脉搏数据（课本 p23） ---------- */
const PULSE = [144, 150, 156, 165, 141, 149, 162, 160, 135, 159, 150, 164, 168, 153, 158, 142, 161, 157, 154, 147];
function initPulse() {
  $('pulse').innerHTML = PULSE.map((v) => `<span>${v}</span>`).join('');
  const spans = [...$('pulse').children];
  const groups = [130, 140, 150, 160];
  $('pulseBtns').innerHTML = groups.map((a) => `<button type="button" class="btn" data-a="${a}">$${a}\\le x<${a + 10}$</button>`).join('');
  tex($('pulseBtns'));
  $('pulseBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-a]');
    if (!b) return;
    const a = +b.dataset.a;
    const inG = PULSE.map((v) => v >= a && v < a + 10);
    spans.forEach((s, i) => s.classList.toggle('on', inG[i]));
    $('pulseBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    const n = inG.filter(Boolean).length;
    const msg = $('pulseMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$${a}\\le x<${a + 10}$：亮起 ${n} 个数，频数 ${n}，频率 $\\frac{${n}}{20}=${fmt(n / 20, 2)}$。`;
    tex(msg);
  });
  $('pulseMsg').textContent = '先自己填表，再点左边的分组核对。';
}

window.LESSON = {
  init() {
    initVote();
    initCities();
    initLvCharts();
    initPulse();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
