'use strict';
/* 大自然的语言 · 本课专属互动：四季物候卡（翻面看“大自然的语言”）、影响物候四因素交互图（纬度滑块 / 经度对比 / 高下切换 / 古今对比）、说明方法分类 */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- 四季物候卡：正面第 1 段原文，背面第 2 段“大自然的语言” ---------- */
const SEASONS = [
  { n: '春', pic: 'chun', s: '立春过后，大地渐渐从沉睡中苏醒过来。冰雪融化，草木萌发，各种花次第开放。再过两个月，燕子翩然归来。', b: '杏花开了，就好像大自然在传语要赶快耕地；桃花开了，又好像在暗示要赶快种谷子。' },
  { n: '夏', pic: 'bugu', s: '不久，布谷鸟也来了。于是转入炎热的夏季，这是植物孕育果实的时期。', b: '布谷鸟开始唱歌，劳动人民懂得它在唱什么：“阿公阿婆，割麦插禾。”' },
  { n: '秋', pic: 'qiu', s: '到了秋天，果实成熟，植物的叶子渐渐变黄，在秋风中簌簌地落下来。北雁南飞，活跃在田间草际的昆虫也都销声匿迹。', b: '这样看来，花香鸟语，草长莺飞，都是大自然的语言。' },
  { n: '冬', pic: '', s: '到处呈现一片衰草连天的景象，准备迎接风雪载途的寒冬。在地球上温带和亚热带区域里，年年如是，周而复始。', b: '几千年来，劳动人民注意了草木荣枯、候鸟去来等自然现象同气候的关系，据以安排农事。' },
];
function initPhen() {
  const box = document.getElementById('phen');
  box.innerHTML = SEASONS.map((s) => `<button type="button" class="ph ph-${s.pic || 'dong'}"><span class="ph-in">
    <span class="ph-f"><span class="ph-pic"${s.pic ? ` data-bg="assets/${s.pic}.jpg"` : ''}></span><b>${s.n}</b><span class="ph-s">${esc(s.s)}</span></span>
    <span class="ph-b"><small>大自然在说……</small>${esc(s.b)}</span></span></button>`).join('');
  box.addEventListener('click', (e) => { const c = e.target.closest('.ph'); if (c) c.classList.toggle('flip'); });
}

/* ---------- 四因素交互图 ---------- */
const FACTORS = {
  lat: {
    name: '纬度', info: '<b>首先是纬度：</b>越往北桃花开得越迟，候鸟也来得越晚。南北差异的日数因季节不同而不同——冬季南北温度悬殊，夏季相差不大。拖动滑块看看。',
    html: `<svg viewBox="0 0 640 300" class="fsvg">
      <text class="t-m" x="20" y="34">北京</text><text class="t-m" x="20" y="134">南京</text>
      <line x1="90" y1="28" x2="90" y2="128" class="ns"/><text class="t-s" x="96" y="80">越往北越迟</text>
      <rect id="latBj" x="200" y="16" height="28" rx="6" class="bar bj"/><rect x="200" y="116" width="40" height="28" rx="6" class="bar nj"/>
      <text class="t-s" x="200" y="64">花期来临（从南京开花算起）</text>
      <text id="latGap" class="t-l t-red" x="200" y="200"></text>
      <text id="latWhat" class="t-m" x="200" y="232"></text>
    </svg>
    <div class="slider-row"><span>早春三四月</span><input type="range" id="latRange" min="0" max="100" value="0"><span>晚春五月初</span></div>`,
  },
  lon: {
    name: '经度', info: '<b>经度的差异是第二个因素：</b>近海的地方比同纬度的内陆冬天温和，春天反而寒冷，所以沿海春天来得迟。',
    html: `<svg viewBox="0 0 640 300" class="fsvg">
      <path d="M0 250 H640" class="ground"/><path d="M470 250 Q520 240 640 236 V300 H470 Z" class="sea"/><text class="t-s" x="560" y="280">海</text>
      <text class="t-m" x="20" y="34">内陆</text><text class="t-m" x="560" y="34" text-anchor="end">沿海</text>
      <g data-k="a"><text class="t-m b-t" x="20" y="80">北京</text><text class="t-m b-t" x="400" y="80">大连</text>
        <text class="t-s" x="20" y="104">连翘、榆叶梅盛开</text><text class="t-s" x="400" y="104">纬度在北京以南约 1°，却迟一个星期</text></g>
      <g data-k="b"><text class="t-m b-t" x="20" y="160">济南</text><text class="t-m b-t" x="400" y="160">烟台</text>
        <text class="t-s" x="20" y="184">苹果开花：四月中或谷雨</text><text class="t-s" x="400" y="184">苹果开花：要到立夏</text></g>
      <path d="M150 74 H380" class="arrow"/><path d="M150 154 H380" class="arrow"/>
      <text class="t-s t-c" x="265" y="68">同纬度，越近海春天越迟</text><text class="t-s t-c" x="265" y="148">纬度相差无几，烟台靠海</text>
    </svg>`,
  },
  alt: {
    name: '高下', info: '<b>第三个因素是高下的差异：</b>春夏越往高处抽青、开花越迟；秋天乔木落叶越往高处越早。点按钮切换。',
    html: `<svg viewBox="0 0 640 300" class="fsvg" id="altSvg">
      <path d="M20 280 L320 40 L620 280 Z" class="mount"/>
      <g class="alt-spring"><circle cx="110" cy="250" r="9" class="fl"/><circle cx="200" cy="180" r="9" class="fl l2"/><circle cx="280" cy="110" r="9" class="fl l3"/>
        <text class="t-s" x="128" y="256">先开花</text><text class="t-s" x="216" y="186">后开花</text><text class="t-s" x="296" y="116">最迟</text></g>
      <g class="alt-autumn"><circle cx="440" cy="250" r="9" class="lf"/><circle cx="380" cy="180" r="9" class="lf l2"/><circle cx="350" cy="110" r="9" class="lf l3"/>
        <text class="t-s" x="456" y="256">最迟落叶</text><text class="t-s" x="396" y="186">较早</text><text class="t-s" x="366" y="116">最早落叶</text></g>
      <g class="alt-inv"><path d="M60 270 H580" class="frost"/><text class="t-m t-red" x="420" y="296">山脚：有霜</text>
        <path d="M170 196 H470" class="warm"/><text class="t-m warm-t" x="480" y="200">山腰：反无霜（逆温层）</text>
        <path d="M320 70 C 260 120, 200 200, 110 262" class="cold"/><text class="t-s" x="170" y="140">冷空气重，夜晚向低处流</text></g>
    </svg>
    <div class="btns"><button type="button" class="btn solid" data-alt="spring">春夏</button><button type="button" class="btn" data-alt="autumn">秋天</button><button type="button" class="btn" data-alt="inv">秋冬早晨 · 逆温层</button></div>`,
  },
  old: {
    name: '古今', info: '<b>此外，还有古今的差异：</b>英国南部的长期记录，两个十年平均值相比，后者比前者早九天——春天提前九天。',
    html: `<svg viewBox="0 0 640 300" class="fsvg">
      <text class="t-m" x="20" y="60">1741—1750 年</text><text class="t-s" x="20" y="80">十年平均</text>
      <rect x="180" y="40" width="380" height="36" rx="6" class="bar y60"/>
      <text class="t-m" x="20" y="150">1921—1930 年</text><text class="t-s" x="20" y="170">十年平均</text>
      <rect x="180" y="130" width="290" height="36" rx="6" class="bar y62 grow"/>
      <path d="M470 186 V200 H560 V186" class="bracket"/><text class="t-l t-red t-c" x="515" y="228">早九天</text>
      <text class="t-s" x="180" y="270">春初七种乔木抽青和开花日期（示意）</text>
    </svg>`,
  },
};
const LAT = { early: 20, late: 10 };
function updateLat(v) {
  const gap = Math.round(LAT.early + (LAT.late - LAT.early) * (v / 100));
  document.getElementById('latBj').setAttribute('width', 40 + gap * 14);
  document.getElementById('latGap').textContent = `北京比南京迟约 ${gap} 天`;
  document.getElementById('latWhat').textContent = v < 50 ? '早春：南京桃花比北京早开二十天' : '晚春五月初：南京刺槐开花只比北京早十天';
}
function showFactor(key) {
  const f = FACTORS[key];
  document.getElementById('fpanel').innerHTML = f.html;
  document.getElementById('finfo').innerHTML = f.info;
  document.querySelectorAll('#ftabs .btn').forEach((b) => b.classList.toggle('solid', b.dataset.f === key));
  if (key === 'lat') {
    const r = document.getElementById('latRange');
    r.addEventListener('input', () => updateLat(+r.value));
    updateLat(0);
  }
  if (key === 'alt') {
    const svg = document.getElementById('altSvg');
    svg.dataset.mode = 'spring';
    document.querySelectorAll('[data-alt]').forEach((b) => b.addEventListener('click', () => {
      svg.dataset.mode = b.dataset.alt;
      document.querySelectorAll('[data-alt]').forEach((x) => x.classList.toggle('solid', x === b));
    }));
  }
}
function initFactors() {
  const tabs = document.getElementById('ftabs');
  tabs.innerHTML = Object.entries(FACTORS).map(([k, f], i) => `<button type="button" class="btn" data-f="${k}"><i>${['首先', '第二', '第三', '此外'][i]}</i> ${f.name}</button>`).join('');
  tabs.addEventListener('click', (e) => { const b = e.target.closest('[data-f]'); if (b) showFactor(b.dataset.f); });
  showFactor('lat');
}

/* ---------- 思考探究三：说明方法 ---------- */
const SORT = [
  { s: '北京的物候记录，1962 年的山桃、杏花、苹果、榆叶梅、西府海棠、丁香、刺槐的花期比 1961 年迟十天左右，比 1960 年迟五六天。', ok: ['举例子', '列数字', '作比较'], q: '用北京的实例和数据，具体说明物候对农业的重要性。' },
  { s: '如在早春三四月间，南京桃花要比北京早开二十天，但是到晚春五月初，南京刺槐开花只比北京早十天。', ok: ['作比较', '列数字', '举例子'], q: '比较早春和晚春的差距，说明南北差异的日数因季节而不同。' },
  { s: '“阿公阿婆，割麦插禾。”', ok: ['引用'], q: '引用模拟布谷鸟叫声的农谚，生动说明物候与农事的关系。' },
  { s: '物候观测使用的是“活的仪器”，是活生生的生物。', ok: ['打比方'], q: '把生物比作“活的仪器”，形象说明物候观测的特点。' },
  { s: '它比气象仪器复杂得多，灵敏得多。', ok: ['作比较'], q: '与气象仪器比较，突出物候观测复杂、灵敏的特点。' },
  { s: '如大连纬度在北京以南约 1°，但是在大连，连翘和榆叶梅的盛开都比北京要迟一个星期。', ok: ['举例子', '作比较', '列数字'], q: '以大连和北京为例，说明近海地区春天来得迟。' },
];

const MOMENTS = [
  {
    name: '补充纬度例证', pic: 'chun',
    prompt: '查资料或问亲戚：你所在的城市和更南（或更北）的城市，同一种花开花的时间差多少？',
    hint: '写清楚两个地方、同一种植物、大约差几天，最后用一句话点明“纬度”。',
    example: '每年三月中旬，广州的木棉已经开得火红，而我家乡的木棉要到四月初才开，相差约半个月。两地经度相近，广州纬度更低——这正是纬度对物候的影响。（示例数据请核实后再用）',
  },
  {
    name: '补充高下例证', pic: 'nishi',
    prompt: '爬过山吗？写写山脚和山顶的植物有什么不同。',
    hint: '同一天，山下的花开到什么程度？山上呢？可以借用课文的话：“越往高处越迟”。',
    example: '五一假期我去爬山，山脚的杜鹃已经谢了，半山腰正开得热闹，到了山顶，枝头还只是小小的花苞。同一座山，花期竟相差了将近半个月。',
  },
  {
    name: '发现新因素', pic: 'bugu',
    prompt: '除了四个因素，你觉得还有什么会影响物候？说出你的理由。',
    hint: '想想城市和乡村、向阳和背阴、干旱和多雨……用一个具体的观察作证据。',
    example: '我发现城市里的柳树比郊外的柳树发芽早。可能是因为城市里楼房多、车多，温度比郊外高，这叫“城市热岛效应”。所以城市化可能也是影响物候的一个因素。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['举例子', '作比较', '列数字', '引用', '打比方'], moments: MOMENTS });
    initPhen();
    initFactors();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
