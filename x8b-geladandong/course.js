'use strict';
/* 在长江源头各拉丹冬 · 本课数据。本课独有：冰塔林游记路线图、感官分层、“身体—风景”双曲线 */

/* ================= 游记路线：站点（x, y 为地图坐标） ================= */
const STOPS = [
  { x: 470, y: 360, name: '草坝子营地', see: '搭起牛毛帐篷，喝上了长江源头的水；向导说东南阳坡才好看。', feel: '海拔接近六千米，手生冻疮、连夜高烧——“倒霉迹象接踵而至”。', q: '各拉丹冬值得你历尽艰辛去走上一遭。' },
  { x: 380, y: 290, name: '冰河上的砾石堆', see: '晶莹连绵的冰峰、平坦辽阔的冰河；同伴扛着大冰凌，“一列小小身影”。', feel: '面向雪峰行跪拜大礼；被奇美震撼。', q: '这一派奇美令人眩晕，造物主在这里尽情卖弄着它的无所不能的创造力。' },
  { x: 285, y: 240, name: '冰山屏风与冰洞', see: '冰山像屏风，精雕细刻；爬过冰洞，冰的庄园冰的院落。', feel: '新奇——“豁然又一番天地”。', q: '整座冰塔林就由许多冰的庄园冰的院落组成，自成一天地。' },
  { x: 225, y: 300, name: '后退拍照，摔倒', see: '为拍一座完整的冰山不断后退。', feel: '一屁股坐在冰河上，尾椎骨折断——乐极生悲。', q: '这一跤，使我在后来的旅行中备受折磨。' },
  { x: 150, y: 235, name: '冰山脚下蜷卧', see: '风扫雪粒；冰塔、冰柱、冰洞、冰廊、冰的流苏；冰山的裂纹像年轮。', feel: '“我要死了”——却发现冰窟里“远比想象的要温暖”。', q: '是琼瑶仙境，静穆的晶莹和洁白。' },
  { x: 230, y: 160, name: '第二天：冰河与砾石滩', see: '在滑极了的冰河上挪动、爬行、翻滚；在砾石滩上找化石，没有。', feel: '似乎已经衰竭，“就长眠于此吧”。', q: '人们越发有经验了，在有坡度的地方，就翻身滚将起来。' },
  { x: 330, y: 105, name: '冰河中间的砾石堆', see: '过午冰面疏松，流水漫溢；坚冰之下传来流水之声。', feel: '听见了长江的第一声——景与情在这里升华。', q: '那是坚冰之下的流水之声，它一刻不停，从这千山之巅、万水之源的藏北高原流出，开始演绎长江的故事。' },
];

function buildMap() {
  const svg = document.getElementById('glMap');
  const path = STOPS.slice(1).map((s, i) => {
    const a = STOPS[i];
    return `<line class="gl-seg" data-step="${i + 2}" x1="${a.x}" y1="${a.y}" x2="${s.x}" y2="${s.y}"/>`;
  }).join('');
  const stops = STOPS.map((s, i) => `<g class="gl-stop" data-step="${i + 1}" data-i="${i}">
      <circle cx="${s.x}" cy="${s.y}" r="15"/><text class="t-m t-c t-w" x="${s.x}" y="${s.y + 6}">${i + 1}</text>
      <text class="t-s gl-name" x="${s.x + 20}" y="${s.y + 4}">${s.name}</text></g>`).join('');
  svg.innerHTML = `
    <rect width="560" height="420" fill="#e9f0f4"/>
    <path d="M0 150 L70 60 L120 95 L150 30 L195 90 L240 55 L300 120 L0 160 Z" fill="#cfdbe4"/>
    <path d="M110 110 L150 30 L190 110 Z" fill="#fff" stroke="#9fb3c2"/>
    <text class="t-s" x="118" y="128" fill="#4d6577">各拉丹冬主峰</text>
    <path d="M20 400 C 120 360, 180 330, 230 300 S 300 220, 280 180 S 320 120, 360 80 S 470 40, 540 20" fill="none" stroke="#bcd5e6" stroke-width="26" stroke-linecap="round"/>
    <text class="t-s" x="430" y="60" fill="#4d6577">冰河</text>
    <g fill="#f7fbfd" stroke="#a9c1d1">
      <path d="M250 220 l12 -40 l12 40 Z"/><path d="M270 225 l9 -30 l9 30 Z"/><path d="M160 215 l14 -46 l14 46 Z"/>
      <path d="M190 220 l10 -32 l10 32 Z"/><path d="M300 210 l8 -26 l8 26 Z"/><path d="M130 225 l9 -28 l9 28 Z"/>
    </g>
    <text class="t-s" x="190" y="200" fill="#4d6577">冰塔林</text>
    ${path}${stops}`;
  svg.addEventListener('click', (e) => {
    const g = e.target.closest('.gl-stop.on');
    if (g) showStop(+g.dataset.i);
  });
}

function showStop(i) {
  const s = STOPS[i];
  document.querySelectorAll('#glMap .gl-stop').forEach((g, k) => g.classList.toggle('cur', k === i));
  document.getElementById('glCard').innerHTML = `<h3><i>${i + 1}</i>${s.name}</h3>
    <p><b>所见</b>${s.see}</p><p><b>所感</b>${s.feel}</p><blockquote>${s.q}</blockquote>`;
}

/* ================= 身体—风景双曲线：横轴站点刻度与数据点 ================= */
const CHART_X = [70, 140, 210, 280, 350, 420, 490];
const DOWN = [90, 140, 160, 230, 270, 285, 260];
const UP = [250, 170, 130, 150, 70, 90, 40];
function buildChart() {
  document.querySelector('.gl-x').innerHTML = CHART_X.map((x, i) => `<text class="t-s t-c" x="${x}" y="330" fill="#4d6577">${i + 1}</text>`).join('') +
    '<text class="t-s" x="250" y="352" fill="#4d6577">路线站点（同上一页）</text>';
  const dots = (ys, c) => CHART_X.map((x, i) => `<circle cx="${x}" cy="${ys[i]}" r="5" fill="${c}"/>`).join('');
  document.querySelector('.gl-pts-d').innerHTML = dots(DOWN, '#b5533c');
  document.querySelector('.gl-pts-u').innerHTML = dots(UP, '#2f6f9a');
}

/* 页面结构要在 deck.js 统计分步之前生成 */
buildMap();
buildChart();

/* ================= 感官分层 ================= */
function initSense() {
  const box = document.getElementById('glText');
  const tools = document.querySelector('.gl-tools');
  tools.addEventListener('click', (e) => {
    const b = e.target.closest('[data-layer]');
    if (!b) return;
    const layer = b.dataset.layer;
    if (layer === 'all') {
      const on = !['sv', 'sh', 'st'].every((k) => box.classList.contains(`on-${k}`));
      ['sv', 'sh', 'st'].forEach((k) => box.classList.toggle(`on-${k}`, on));
    } else {
      box.classList.toggle(`on-${layer}`);
    }
    tools.querySelectorAll('.gl-t').forEach((t) => t.classList.toggle('solid', box.classList.contains(`on-${t.dataset.layer}`)));
    box.closest('.stage').classList.toggle('all-on', ['sv', 'sh', 'st'].every((k) => box.classList.contains(`on-${k}`)));
  });
}

/* ================= 品句子：揭示与删减对比 ================= */
function initTaste() {
  document.querySelector('.gl-taste').addEventListener('click', (e) => {
    const open = e.target.closest('.gl-open');
    if (open) open.closest('.gl-s').classList.toggle('show');
    const cut = e.target.closest('.gl-cut');
    if (cut) {
      const s = cut.closest('.gl-s');
      const on = s.classList.toggle('cut');
      s.classList.add('show');
      cut.textContent = on ? '恢复原句' : '删去加点部分';
    }
  });
}

const MOMENTS = [
  {
    name: '多感官写一处景', pic: 'binglang',
    prompt: '选一处你去过的地方，调动视觉、听觉、触觉等至少三种感官，写一个 200 字左右的片段。',
    hint: '先写看到的（形、色、光），再写听到的，最后写身体的感受；加一句想象或感慨，让景中有情。',
    example: '推开山顶小庙的木门，一股凉气扑面而来。院里那棵老银杏通体金黄，叶子落了一地，踩上去软软的，沙沙作响。檐角挂着一只铜铃，风一过，“叮——”的一声，又细又长，好久才散。我把手贴在被太阳晒了一上午的石栏上，竟是温的。远处的山一层淡似一层，像谁用水把墨冲开了。我忽然想，这棵树大概已经这样站了几百年，看过多少个和今天一样的秋天。',
  },
  {
    name: '写一次艰难的游览', pic: 'bingtalin',
    prompt: '回忆一次很累、很不顺的出游，学习作者“以苦衬美”的写法，写一个片段。',
    hint: '身体的苦要写具体（喘、渴、疼……），再写出你在最累时看到的景，两者形成对照。',
    example: '爬到半山腰，我的腿已经不是自己的了，每抬一步都像拖着一袋沙。汗水流进眼睛，又涩又疼，我一屁股坐在台阶上，再也不想动。就在这时，云忽然散开了——对面的山峰整个儿亮了起来，金色的阳光顺着山脊流下来，一直流到我的脚边。那一刻我忘了腿疼，只想再往上走一点，再看得远一点。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initSense();
    initTaste();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-route') && step > 0) showStop(step - 1);
    if (slide.classList.contains('s-route') && step === 0) {
      document.getElementById('glCard').innerHTML = '<p class="gl-empty">从营地出发，按 → 开始。</p>';
      document.querySelectorAll('#glMap .gl-stop').forEach((g) => g.classList.remove('cur'));
    }
  },
};
