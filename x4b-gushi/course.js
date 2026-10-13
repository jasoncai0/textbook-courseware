'use strict';
/* 古诗三首（四下 22）· 本课数据与互动。诗文模板见 ../shared/poem.js，画面见 ../shared/narrative.js
 * 本课独有：三首诗三种呈现——芙蓉楼“诗画卷轴”逐段展开、塞下曲“雪越下越大”、墨梅“点墨开花”；连一连诗句与品格。
 */

const POEMS = {
  fr: {
    title: '芙蓉楼送辛渐', author: '［唐］王昌龄',
    lines: [
      { t: '寒雨连江夜入吴，', r: '寒雨/连江/夜入吴，' },
      { t: '平明送客楚山孤。', r: '平明/送客/楚山孤。' },
      { t: '洛阳亲友如相问，', r: '洛阳/亲友/如相问，' },
      { t: '一片冰心在玉壶。', r: '一片/冰心/在玉壶。' },
    ],
  },
  sx: {
    title: '塞下曲', author: '［唐］卢纶',
    lines: [
      { t: '月黑雁飞高，', r: '月黑/雁飞高，', f: '1.2 50% 25%' },
      { t: '单于夜遁逃。', r: '单于/夜遁逃。', f: '1.15 40% 55%' },
      { t: '欲将轻骑逐，', r: '欲将/轻骑逐，', f: '1.25 45% 70%' },
      { t: '大雪满弓刀。', r: '大雪/满弓刀。', f: '1.4 45% 70%' },
    ],
    notes: { 单于: '匈奴的首领。这里泛指侵扰唐朝的游牧民族首领。读 chán yú', 骑: '骑兵' },
  },
  mm: {
    title: '墨梅', author: '［元］王冕',
    lines: [
      { t: '我家洗砚池头树，' },
      { t: '朵朵花开淡墨痕。' },
      { t: '不要人夸好颜色，' },
      { t: '只留清气满乾坤。' },
    ],
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

/* 塞下曲：雪花层（第 4 句出现时再加一层，雪下大了） */
const SNOW_A = 40;
const SNOW_B = 90;
function fillSnow(el, n, big) {
  const rnd = (a, b) => a + Math.random() * (b - a);
  el.innerHTML = Array.from({ length: n }, () => {
    const size = big ? rnd(.25, .6) : rnd(.15, .35);
    return `<i style="left:${rnd(0, 100).toFixed(1)}%;width:${size.toFixed(2)}em;height:${size.toFixed(2)}em;animation-duration:${rnd(4, 9).toFixed(1)}s;animation-delay:-${rnd(0, 9).toFixed(1)}s"></i>`;
  }).join('');
}

/* 塞下曲：点词推镜头 */
const ZOOM = [
  { w: '月黑', pos: '50% 10%', a: '没有月亮，天黑得伸手不见五指——环境多么险恶。' },
  { w: '雁飞高', pos: '60% 15%', a: '大雁被惊动，高高飞起——夜里有动静，敌人在悄悄逃跑。' },
  { w: '夜遁逃', pos: '80% 55%', a: '单于趁着黑夜偷偷溜走——将士们必须马上追！' },
  { w: '欲将轻骑逐', pos: '40% 75%', a: '“欲将”：正要带领。轻快的骑兵立刻集合，准备出发，一刻也不耽误。' },
  { w: '大雪满弓刀', pos: '45% 80%', a: '刚要出发，大雪就落满了弓和刀——天寒地冻，可是没有一个人退缩。' },
];
function initZoom() {
  const $ = (id) => document.getElementById(id);
  $('zoomBtns').innerHTML = ZOOM.map((z, i) => `<button class="btn" type="button" data-i="${i}">${z.w}</button>`).join('');
  const show = (i) => {
    const z = ZOOM[i];
    $('zoomBtns').querySelectorAll('.btn').forEach((b, k) => b.classList.toggle('solid', k === i));
    $('zoomPic').style.backgroundPosition = z.pos;
    $('zoomCard').innerHTML = `<b>${z.w}</b><span>${z.a}</span>`;
    $('zoomCap').textContent = `镜头：${z.w}`;
  };
  $('zoomBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (b) show(+b.dataset.i);
  });
  show(0);
}

/* 墨梅：点墨开花、换颜色、清气满乾坤 */
const BUDS = [[250, 175], [300, 128], [340, 92], [380, 140], [420, 122], [330, 222], [400, 210], [470, 180], [530, 158], [460, 246], [515, 250], [130, 252], [90, 218], [180, 320]];
function blossom(x, y) {
  const petals = [0, 72, 144, 216, 288].map((a) => {
    const r = (a * Math.PI) / 180;
    return `<circle cx="${(x + Math.cos(r) * 9).toFixed(1)}" cy="${(y + Math.sin(r) * 9).toFixed(1)}" r="9"/>`;
  }).join('');
  return `<g class="flower">${petals}<circle class="ctr" cx="${x}" cy="${y}" r="3.5"/></g>`;
}
function initMei() {
  const svg = document.getElementById('meiSvg');
  const buds = document.getElementById('meiBuds');
  const msg = document.getElementById('meiMsg');
  buds.innerHTML = BUDS.map(([x, y], i) => `<g class="bud-g" data-i="${i}"><circle class="bud" cx="${x}" cy="${y}" r="7"/>${blossom(x, y)}</g>`).join('');
  const count = () => buds.querySelectorAll('.bud-g.open').length;
  const update = () => {
    const n = count();
    if (n === BUDS.length) msg.textContent = '朵朵花开淡墨痕——一树墨梅，素净淡雅。';
    else if (n) msg.textContent = `已经点开 ${n} 朵，再点一点……`;
  };
  buds.addEventListener('click', (e) => {
    const g = e.target.closest('.bud-g');
    if (!g) return;
    g.classList.add('open');
    update();
  });
  document.getElementById('meiAll').addEventListener('click', () => {
    buds.querySelectorAll('.bud-g').forEach((g, i) => setTimeout(() => g.classList.add('open'), i * 120));
    setTimeout(update, BUDS.length * 120);
  });
  const colorBtn = document.getElementById('meiColor');
  colorBtn.addEventListener('click', () => {
    const on = svg.classList.toggle('colorful');
    buds.querySelectorAll('.bud-g').forEach((g) => g.classList.add('open'));
    colorBtn.textContent = on ? '还是墨梅好' : '换成鲜艳的颜色？';
    msg.textContent = on ? '红梅艳丽，人人都会夸——可诗人说：“不要人夸好颜色。”' : '淡墨梅花，不求人夸，只留清气。';
  });
}

/* 连一连：诗句与品格（本课与《宝葫芦的秘密》各用一次连线） */
const MATCH = [
  { l: '洛阳亲友如相问，一片冰心在玉壶。', r: '纯洁清白，不改初心' },
  { l: '欲将轻骑逐，大雪满弓刀。', r: '英勇无畏，不怕艰苦' },
  { l: '不要人夸好颜色，只留清气满乾坤。', r: '不慕名利，品格高洁' },
];
const MATCH_ORDER = [2, 0, 1];
function initMatch(box, pairs, order) {
  box.innerHTML = `<svg class="mt-lines"></svg>
    <div class="mt-col">${pairs.map((p, i) => `<button type="button" class="mt-item mt-l" data-i="${i}">${p.l}</button>`).join('')}</div>
    <div class="mt-col">${order.map((i) => `<button type="button" class="mt-item mt-r" data-i="${i}">${pairs[i].r}</button>`).join('')}</div>`;
  const svg = box.querySelector('.mt-lines');
  const done = [];
  let sel = null;
  const draw = () => {
    const b = box.getBoundingClientRect();
    if (!b.width) return;
    svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
    svg.innerHTML = done.map((i) => {
      const l = box.querySelector(`.mt-l[data-i="${i}"]`).getBoundingClientRect();
      const r = box.querySelector(`.mt-r[data-i="${i}"]`).getBoundingClientRect();
      return `<line x1="${l.right - b.left}" y1="${l.top + l.height / 2 - b.top}" x2="${r.left - b.left}" y2="${r.top + r.height / 2 - b.top}"/>`;
    }).join('');
  };
  box.addEventListener('click', (e) => {
    const it = e.target.closest('.mt-item');
    if (!it || it.classList.contains('ok')) return;
    if (it.classList.contains('mt-l')) {
      sel = it;
      box.querySelectorAll('.mt-l').forEach((x) => x.classList.toggle('sel', x === it));
      return;
    }
    if (!sel) return;
    if (sel.dataset.i === it.dataset.i) {
      done.push(sel.dataset.i);
      sel.classList.add('ok'); it.classList.add('ok');
      sel.classList.remove('sel'); sel = null;
      draw();
      box.classList.toggle('all-done', done.length === pairs.length);
    } else {
      it.classList.remove('no'); void it.offsetWidth; it.classList.add('no'); // 重新触发抖动动画
    }
  });
  new ResizeObserver(draw).observe(box);
}

/* 读与写 */
const MOMENTS = [
  { name: '寒雨送客', pic: 'furong', prompt: '寒雨连江夜入吴，平明送客楚山孤。', hint: '天气怎样？江面怎样？诗人和朋友分别时会说什么、做什么？朋友走后，诗人望着什么？',
    example: '冷冷的秋雨下了一夜，江面上白茫茫的一片。天刚亮，诗人送辛渐到江边。他紧紧握着朋友的手说：“到了洛阳，替我问候亲友。告诉他们，我的心还像玉壶里的冰一样干净。”小船越走越远，只剩下对岸那座青山，孤零零地立在雨里。' },
  { name: '雪夜出发', pic: 'saixia', prompt: '欲将轻骑逐，大雪满弓刀。', hint: '夜有多黑？雪有多大？将士们是怎样集合、怎样出发的？',
    example: '漆黑的夜里，忽然有大雁惊叫着飞上高空。“敌人逃了！”将军一声令下，骑兵们翻身上马。北风卷着大雪扑面而来，不一会儿，弓上、刀上都落满了雪。可是没有一个人皱一下眉头，马蹄声踏破了雪夜，向远方追去。' },
  { name: '我对墨梅说', pic: 'momei', prompt: '不要人夸好颜色，只留清气满乾坤。', hint: '你想对这树墨梅（或者画墨梅的王冕）说什么？你身边有没有“不要人夸”的人？',
    example: '墨梅，你没有桃花那样艳丽，也没有牡丹那样富贵，可你一点也不在乎。你只是静静地开着，把淡淡的清香留给天地。我想起了每天早早到校扫地的王爷爷，他从不要人夸，可校园因为他变得干干净净。' },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    Poem.init();
    fillSnow(document.getElementById('snowA'), SNOW_A, false);
    fillSnow(document.getElementById('snowB'), SNOW_B, true);
    initZoom();
    initMei();
    initMatch(document.getElementById('matchPoem'), MATCH, MATCH_ORDER);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-mei')) document.getElementById('meiSvg').classList.toggle('qi', step >= 4);
  },
};
