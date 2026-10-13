'use strict';
/* 记金华的双龙洞 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课独有：① 游览路线图上走一遍；② 孔隙剖面“仰卧小船”体验 */

/* 游览路线：x/y = 地图上的位置，lx/ly = 站名相对站点的偏移；原文中“……”为略去部分 */
const ROUTE_START = [30, 420];
const STOPS = [
  { name: '路上', x: 120, y: 320, lx: 20, ly: 8, pic: 'lushang', text: '出金华城大约五公里到罗店，过了罗店就渐渐入山。公路盘曲而上。……粉红色的山，各色的映山红，再加上或浓或淡的新绿，眼前一片明艳。', feat: ['映山红', '粉红色的山', '溪流时宽时窄'] },
  { name: '洞口', x: 170, y: 190, lx: -20, ly: 8, pic: 'waidong', text: '在洞口抬头望，山相当高，突兀森郁，很有气势。洞口像桥洞似的，很宽。', feat: ['山高', '有气势', '洞口宽'] },
  { name: '外洞', x: 250, y: 140, lx: 0, ly: 42, pic: 'waidong', text: '走进去，仿佛到了个大会堂，周围是石壁，头上是高高的石顶，在那里聚集一千或是八百人开个会，一定不觉得拥挤。', feat: ['像大会堂', '大'] },
  { name: '孔隙', x: 340, y: 149, lx: 0, ly: 46, pic: 'kongxi', text: '虽说是孔隙，可也容得下一只小船进出。怎样小的小船呢？两个人并排仰卧，刚合适，再没法容第三个人，是这样小的小船。', feat: ['窄小', '★ 重点写'] },
  { name: '内洞', x: 430, y: 120, lx: 0, ly: 46, pic: 'neidong', text: '内洞一团漆黑，什么都看不见。……先看到的是蜿蜒在洞顶的双龙，一条黄龙，一条青龙。', feat: ['黑', '双龙', '石钟乳和石笋', '比外洞大'] },
  { name: '出洞', x: 300, y: 250, lx: 20, ly: 8, pic: 'kongxi', text: '我排队等候，又仰卧在小船里，出了洞。', feat: ['一句话带过'] },
];
const WALK_MS = 900;

// 经过各站的平滑路线（Catmull-Rom 转三次贝塞尔）
function routeD(pts) {
  return pts.reduce((d, p, i) => {
    if (i === 0) return `M${p[0]} ${p[1]}`;
    const p0 = pts[i - 2] || pts[i - 1];
    const p1 = pts[i - 1];
    const p3 = pts[i + 1] || p;
    const c1 = [p1[0] + (p[0] - p0[0]) / 6, p1[1] + (p[1] - p0[1]) / 6];
    const c2 = [p[0] - (p3[0] - p1[0]) / 6, p[1] - (p3[1] - p1[1]) / 6];
    return `${d} C${c1.map((v) => v.toFixed(1)).join(' ')} ${c2.map((v) => v.toFixed(1)).join(' ')} ${p[0]} ${p[1]}`;
  }, '');
}

function initRoute() {
  const $ = (id) => document.getElementById(id);
  const path = $('routePath');
  const pts = [ROUTE_START, ...STOPS.map((s) => [s.x, s.y])];
  path.setAttribute('d', routeD(pts));
  const len = path.getTotalLength();
  const ptAt = (f) => path.getPointAtLength(len * f);
  // 每一站在路线上的位置：用到该站为止的前缀路线长度
  const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  $('routeSvg').appendChild(probe); // 部分浏览器要求路径挂在文档里才能量长度
  STOPS.forEach((s, i) => { probe.setAttribute('d', routeD(pts).split(' C').slice(0, i + 2).join(' C')); s.at = probe.getTotalLength() / len; });
  probe.remove();
  $('routeNodes').innerHTML = STOPS.map((s, i) => {
    const anchor = s.lx > 0 ? 'start' : s.lx < 0 ? 'end' : 'middle';
    return `<g class="rt-node" data-i="${i}" tabindex="0"><circle cx="${s.x}" cy="${s.y}" r="15"/>
      <text class="t-l" x="${s.x + s.lx}" y="${s.y + s.ly}" text-anchor="${anchor}">${s.name}</text></g>`;
  }).join('');
  let cur = 0;
  let pos = 0;
  let anim = 0;
  function walkTo(target) {
    cancelAnimationFrame(anim);
    const from = pos;
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / WALK_MS);
      pos = from + (target - from) * (1 - (1 - k) ** 2);
      const p = ptAt(pos);
      $('walker').setAttribute('cx', p.x.toFixed(1));
      $('walker').setAttribute('cy', p.y.toFixed(1));
      if (k < 1) anim = requestAnimationFrame(tick);
    };
    anim = requestAnimationFrame(tick);
  }
  function show(i) {
    cur = Math.max(0, Math.min(STOPS.length - 1, i));
    const s = STOPS[cur];
    $('routeName').textContent = `第 ${cur + 1} 站 · ${s.name}`;
    $('routeText').textContent = s.text;
    $('routeFeat').innerHTML = s.feat.map((f) => `<span>${f}</span>`).join('');
    $('routePic').style.backgroundImage = `url(assets/${s.pic}.jpg)`;
    document.querySelectorAll('.rt-node').forEach((n, k) => n.classList.toggle('on', k <= cur));
    walkTo(s.at);
  }
  $('routeNodes').addEventListener('click', (e) => {
    const n = e.target.closest('.rt-node');
    if (n) show(+n.dataset.i);
  });
  $('routeNext').addEventListener('click', () => show(cur + 1));
  $('routePrev').addEventListener('click', () => show(cur - 1));
  show(0);
}

/* 孔隙体验：empty → lie → go → (up) → land */
const KS_SAY = {
  lie: '我怀着好奇的心情独个儿仰卧在小船里，自以为从后脑到肩背，到臀部，到脚跟，没有一处不贴着船底了，才说一声“行了”。',
  go: '船就慢慢移动。眼前昏暗了，可是还能感觉左右和上方的山石似乎都在朝我挤压过来。',
  up: '我又感觉要是把头稍微抬起一点儿，准会撞破额角，擦伤鼻子。',
  land: '大约行了两三丈的水程吧，就登陆了。这就到了内洞。',
  needLie: '还没躺好呢！先按 ①，从后脑到脚跟都贴着船底。',
  upOutside: '在外洞里还宽敞，抬头没事。进了孔隙再试试……',
  reset: '小船停在外洞。按 ① 躺进小船试试。',
};
function initBoat() {
  const svg = document.getElementById('boatSvg');
  const say = document.getElementById('ksSay');
  let state = 'empty';
  const set = (cls, msg) => { svg.setAttribute('class', cls); say.textContent = msg; };
  document.getElementById('ksBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ks]');
    if (!b) return;
    const act = b.dataset.ks;
    if (act === 'reset') { state = 'empty'; set('ks-empty', KS_SAY.reset); return; }
    if (act === 'lie') { state = 'lie'; set('ks-lie', KS_SAY.lie); return; }
    if (state === 'empty') { set('ks-empty', KS_SAY.needLie); return; }
    if (act === 'go') { state = 'go'; set('ks-go', KS_SAY.go); return; }
    if (act === 'up') {
      if (state !== 'go') { say.textContent = KS_SAY.upOutside; return; }
      set('ks-go ks-up', KS_SAY.up);
      return;
    }
    if (act === 'land') { state = 'land'; set('ks-land', KS_SAY.land); }
  });
}

/* 课后第 1 题：补充路线图 */
const FILL_ANSWER = ['洞口', '外洞', '孔隙', '内洞'];
const FILL_WORDS = ['内洞', '洞口', '孔隙', '外洞'];
function initFill() {
  const words = document.getElementById('fillWords');
  const blanks = [...document.querySelectorAll('#fillRoute .blank')];
  const msg = document.getElementById('fillMsg');
  let n = 0;
  words.innerHTML = FILL_WORDS.map((w) => `<button class="pick" type="button">${w}</button>`).join('');
  words.addEventListener('click', (e) => {
    const b = e.target.closest('.pick');
    if (!b || b.disabled || n >= FILL_ANSWER.length) return;
    b.classList.remove('wrong');
    if (b.textContent !== FILL_ANSWER[n]) {
      void b.offsetWidth; // 重新触发抖动动画
      b.classList.add('wrong');
      msg.textContent = `再想想：“${STOPS[n].name}”之后，作者先到了哪儿？`;
      return;
    }
    blanks[n].textContent = b.textContent;
    blanks[n].classList.add('ok');
    b.disabled = true;
    b.classList.add('right');
    n += 1;
    msg.textContent = n === FILL_ANSWER.length ? '路线完整了！这就是作者游览的顺序。' : '';
  });
}

/* 交流平台：每一站写了多少字（课文汉字数） */
const MUCH = [['路上', 174], ['洞口 · 外洞', 89], ['孔隙', 247], ['内洞', 225], ['出洞', 15]];
function initMuch() {
  const max = Math.max(...MUCH.map(([, c]) => c));
  document.getElementById('much').innerHTML = MUCH.map(([t, c]) =>
    `<div class="much-row${t === '孔隙' ? ' key' : ''}"><b>${t}</b><span class="much-bar"><i style="width:${(c / max * 100).toFixed(0)}%"></i></span><em>约 ${c} 字</em></div>`).join('');
}

/* 初试身手 */
const MOMENTS = [
  {
    name: '植物园', pic: 'lushang',
    prompt: '带同学参观植物园：南门 → 芍药园 → 天鹅湖 → 望湖亭 → 郁金香园 → 东南门，按顺序说一说。',
    hint: '用上“从……进去”“过了……往……”“就来到了……”这样的过渡句；选一处多说几句。',
    example: '我们从南门进去，过了小桥往西，就来到了芍药园。芍药开得正好，红的、粉的、白的……从芍药园往北走，就到了天鹅湖，湖面上几只白天鹅正悠闲地游着。绕过天鹅湖往东，登上望湖亭……',
  },
  {
    name: '我们的校园', pic: 'waidong',
    prompt: '带新同学参观校园，你会走一条什么路线？',
    hint: '先说从哪儿进，再按走过的地方说；最吸引你的地方（如操场、图书馆）多说几句。',
    example: '走进校门，迎面是一座白色的教学楼。从教学楼左边绕过去，就来到了大操场……',
  },
  {
    name: '我游过的地方', pic: 'neidong',
    prompt: '你游览过哪个地方？画一画路线，按顺序写一写。',
    hint: '为单元习作“游____”做准备：路线清楚，重点景物写出特点和感受。',
    example: '一走进公园大门，……沿着小路往前走，……最让我难忘的是……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initRoute();
    initBoat();
    initFill();
    initMuch();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
