'use strict';
/* 古代诗歌五首 · 本课数据与专属互动：望岳镜头、飞来峰高度滑块、山西村路线、落红动画、背诵切换。诗文模板见 ../shared/poem.js */

const POEMS = {
  youzhou: {
    title: '登幽州台歌', author: '［唐］陈子昂',
    lines: [{ t: '前不见古人，' }, { t: '后不见来者。' }, { t: '念天地之悠悠，' }, { t: '独怆然而涕下！' }],
  },
  wangyue: {
    title: '望岳', author: '［唐］杜甫',
    lines: [
      { t: '岱宗夫如何？', r: '岱宗/夫如何？', f: '1.1 50% 45%' },
      { t: '齐鲁青未了。', r: '齐鲁/青未了。', f: '1.05 50% 60%' },
      { t: '造化钟神秀，', r: '造化/钟神秀，', f: '1.25 50% 35%' },
      { t: '阴阳割昏晓。', r: '阴阳/割昏晓。', f: '1.3 40% 40%' },
      { t: '荡胸生曾云，', r: '荡胸/生曾云，', f: '1.35 45% 55%' },
      { t: '决眦入归鸟。', r: '决眦/入归鸟。', f: '1.4 30% 40%' },
      { t: '会当凌绝顶，', r: '会当/凌绝顶，', f: '1.5 50% 20%' },
      { t: '一览众山小。', r: '一览/众山小。', f: '1.05 50% 50%' },
    ],
    notes: {
      岱宗: '指泰山', 未了: '不尽。“齐鲁青未了”：泰山横跨齐鲁，青色的峰峦连绵不断', 造化: '指天地、大自然', 钟: '聚集',
      阴阳: '古人以山北水南为阴，山南水北为阳', 割: '分。“阴阳割昏晓”：山的南北两面，一面明亮一面昏暗', 曾云: '层云（曾，同“层”）',
      决眦: '张大眼睛（眦，眼眶）', 会当: '终当，终要', 凌绝顶: '登上泰山的顶峰。凌，登上',
    },
  },
  feilai: {
    title: '登飞来峰', author: '［宋］王安石',
    lines: [{ t: '飞来山上千寻塔，' }, { t: '闻说鸡鸣见日升。' }, { t: '不畏浮云遮望眼，' }, { t: '自缘身在最高层。' }],
  },
  shanxi: {
    title: '游山西村', author: '［宋］陆游',
    lines: [
      { t: '莫笑农家腊酒浑，', r: '莫笑/农家/腊酒浑，', f: '1.3 60% 65%' },
      { t: '丰年留客足鸡豚。', r: '丰年/留客/足鸡豚。', f: '1.3 60% 65%' },
      { t: '山重水复疑无路，', r: '山重/水复/疑无路，', f: '1.2 30% 40%' },
      { t: '柳暗花明又一村。', r: '柳暗/花明/又一村。', f: '1.3 60% 50%' },
      { t: '箫鼓追随春社近，', r: '箫鼓/追随/春社近，', f: '1.4 70% 55%' },
      { t: '衣冠简朴古风存。', r: '衣冠/简朴/古风存。', f: '1.3 65% 55%' },
      { t: '从今若许闲乘月，', r: '从今/若许/闲乘月，', f: '1.1 50% 30%' },
      { t: '拄杖无时夜叩门。', r: '拄杖/无时/夜叩门。', f: '1.3 35% 70%' },
    ],
    notes: {
      腊酒浑: '腊月所酿的酒，称为“腊酒”。浑，浑浊。酒以清为贵', 足鸡豚: '备足鸡肉、猪肉。豚（tún），小猪，这里指猪肉',
      春社: '古代立春后第五个戊日为春社日，祭社神（土地神），祈求丰收', 闲乘月: '趁着月明来闲游', 无时: '没有固定的时间，即随时',
    },
  },
  jihai: {
    title: '己亥杂诗（其五）', author: '［清］龚自珍',
    lines: [{ t: '浩荡离愁白日斜，' }, { t: '吟鞭东指即天涯。' }, { t: '落红不是无情物，' }, { t: '化作春泥更护花。' }],
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

const CLUES = [
  { q: '会当凌绝顶，一览众山小。<br><small>——杜甫《望岳》</small>', a: '<b>原意：</b>终要登上泰山顶峰，俯瞰群山，群山都显得渺小。<br><b>新意：</b>不怕困难、敢于攀登顶峰的雄心和气概。' },
  { q: '不畏浮云遮望眼，自缘身在最高层。<br><small>——王安石《登飞来峰》</small>', a: '<b>原意：</b>不怕浮云遮住远望的视线，因为自己站在塔的最高层。<br><b>新意：</b>站得高、看得远，就不会被表面现象迷惑。' },
  { q: '山重水复疑无路，柳暗花明又一村。<br><small>——陆游《游山西村》</small>', a: '<b>原意：</b>山水重重，正疑心无路可走，忽见柳绿花红，又出现一个村庄。<br><b>新意：</b>困境中坚持下去，往往会出现转机和希望。' },
  { q: '落红不是无情物，化作春泥更护花。<br><small>——龚自珍《己亥杂诗》</small>', a: '<b>原意：</b>落花并非无情之物，化成春泥还要养护新花。<br><b>新意：</b>为后来者、为事业默默奉献的精神（常用来赞美教师）。' },
];

/* ---------- 望岳：四个镜头（缩放 + 焦点） ---------- */
const LENS = [
  { name: '远望', s: 1, x: 50, y: 50 },
  { name: '近望', s: 1.6, x: 45, y: 40 },
  { name: '细望', s: 2.3, x: 35, y: 45 },
  { name: '想望', s: 2.8, x: 50, y: 12 },
];
function setLens(i) {
  const l = LENS[i];
  const img = document.querySelector('#lens .lens-img');
  img.style.transformOrigin = `${l.x}% ${l.y}%`;
  img.style.transform = `scale(${l.s})`;
  document.getElementById('lensTag').textContent = l.name;
  document.querySelectorAll('#lensBtns .btn').forEach((b, k) => b.classList.toggle('solid', k === i));
  document.querySelectorAll('.lens-lines .ll').forEach((b, k) => b.classList.toggle('cur', k === i));
}

/* ---------- 登飞来峰：滑块控制眼睛的高度 ---------- */
const EYE_BOTTOM = 250;
const EYE_TOP = 100;
const CLOUD_Y = 200;
function setClimb(v) {
  const y = EYE_BOTTOM - (EYE_BOTTOM - EYE_TOP) * (v / 100);
  document.getElementById('eye').setAttribute('transform', `translate(140 ${y.toFixed(1)})`);
  const above = y < CLOUD_Y - 22;
  document.getElementById('tower').classList.toggle('above', above);
  document.getElementById('climbSay').innerHTML = above
    ? '<b>在最高层：</b>浮云到了脚下，红日跃出云海——什么也遮不住望眼。'
    : '<b>还在浮云下面：</b>云层挡在眼前，看不见远处的日出。再往上爬！';
}

/* ---------- 游山西村：路线站点（顶层生成，分步才算得上） ---------- */
const STOPS = [
  { at: 0.02, name: '农家', line: '莫笑农家腊酒浑，丰年留客足鸡豚。', say: '酒虽浑，菜却足——农家人<b>热情好客</b>，丰年里日子富足。' },
  { at: 0.3, name: '山重水复', line: '山重水复疑无路，', say: '山一重又一重，水绕来绕去，诗人怀疑<b>没路</b>了……' },
  { at: 0.5, name: '柳暗花明', line: '柳暗花明又一村。', say: '转过山脚，柳色浓绿、花色明艳，忽然又出现一个村庄——<b>惊喜</b>！' },
  { at: 0.72, name: '箫鼓春社', line: '箫鼓追随春社近，衣冠简朴古风存。', say: '春社快到了，一路箫鼓声；村民衣着简朴，<b>保留着古朴的风俗</b>。' },
  { at: 0.98, name: '月夜叩门', line: '从今若许闲乘月，拄杖无时夜叩门。', say: '如果允许趁着月色闲游，我会随时拄着拐杖来敲门——<b>流连忘返</b>。' },
];
(function buildStops() {
  const path = document.getElementById('routePath');
  const len = path.getTotalLength();
  document.querySelector('#routeSvg .stops').innerHTML = STOPS.map((s, i) => {
    const p = path.getPointAtLength(len * s.at);
    const up = p.y > 200 ? -18 : 30;
    return `<g class="stop" data-step="${i + 1}" data-i="${i}"><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="11"/><text class="t-s t-c" x="${p.x.toFixed(1)}" y="${(p.y + up).toFixed(1)}">${s.name}</text></g>`;
  }).join('');
}());

function showStop(i) {
  const s = STOPS[i];
  document.getElementById('routeCard').innerHTML = `<p class="rc-line">${s.line}</p><p class="tip">${s.say}</p>`;
  document.querySelectorAll('#routeSvg .stop').forEach((g, k) => g.classList.toggle('cur', k === i));
}

function renderRoute(step) {
  const n = Math.min(step, STOPS.length);
  const at = n ? STOPS[n - 1].at : 0;
  document.getElementById('routePath').style.strokeDashoffset = 1 - at;
  if (n) showStop(n - 1);
}

/* ---------- 己亥杂诗：落花 ---------- */
function buildPetals() {
  const box = document.getElementById('petals');
  box.innerHTML = Array.from({ length: 22 }, (_, i) => {
    const left = 8 + ((i * 37) % 84);
    const delay = ((i * 0.53) % 6).toFixed(2);
    const dur = (5 + (i % 5) * 0.7).toFixed(1);
    return `<i style="left:${left}%;animation-delay:${delay}s;animation-duration:${dur}s"></i>`;
  }).join('');
}

function initTabs() {
  const tabs = document.getElementById('reciteTabs');
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    tabs.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    document.querySelectorAll('.s-recite .recite').forEach((r, i) => { r.hidden = i !== +btn.dataset.tab; });
  });
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['名句', '原意 · 新意'] });
    Poem.init();
    document.getElementById('lensBtns').addEventListener('click', (e) => {
      const b = e.target.closest('[data-lens]');
      if (b) setLens(+b.dataset.lens);
    });
    const climb = document.getElementById('climb');
    climb.addEventListener('input', () => setClimb(+climb.value));
    setClimb(+climb.value);
    document.querySelector('#routeSvg .stops').addEventListener('click', (e) => {
      const g = e.target.closest('.stop');
      if (g && g.classList.contains('on')) showStop(+g.dataset.i);
    });
    buildPetals();
    initTabs();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-lens')) setLens(Math.max(0, Math.min(3, step - 1)));
    if (slide.classList.contains('s-route')) renderRoute(step);
    if (slide.classList.contains('s-luohong')) slide.classList.toggle('falling', step >= 3);
  },
};
