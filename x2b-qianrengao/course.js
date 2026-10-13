'use strict';
/* 千人糕 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 对话剧场（爸爸、孩子、旁白轮流亮起，“孩子想”用云朵泡泡）；② 劳动链条层层展开（米、糖、做好以后，人数越来越多）；
 *           ③ 弯弯的劳动之路；④ 衣服 / 铅笔 / 课本举例；⑤ 揭蒸笼读词；⑥ 蒸笼取米糕（摘苹果组件换皮）。 */

/* 二下课文只给生字注音：data-pyk="特:tè" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 对话剧场：只留最近几句，说话的人亮起 ================= */
const DL_KEEP = 3;
function updateDialog(slide, step) {
  const lines = [...slide.querySelectorAll('.dl-l')];
  const shown = lines.filter((l) => +l.dataset.step <= step);
  lines.forEach((l) => l.classList.toggle('gone', shown.indexOf(l) >= 0 && shown.indexOf(l) < shown.length - DL_KEEP));
  const last = shown[shown.length - 1];
  slide.querySelectorAll('.dl-who').forEach((w) => w.classList.toggle('talk', Boolean(last) && w.classList.contains(last.dataset.w)));
}

/* ================= 劳动链条层层展开 ================= */
function initTree(box) {
  const n = document.getElementById('trN');
  const people = document.getElementById('trPeople');
  const end = document.getElementById('trEnd');
  const update = () => {
    const opened = [...box.querySelectorAll('.tr-node.on')];
    const count = opened.reduce((s, el) => s + (+el.dataset.n || 0), 0);
    n.textContent = count;
    people.innerHTML = Array.from({ length: count }, () => '<i>👤</i>').join('');
    const all = !box.querySelector('.tr-node:not(.on)');
    end.classList.toggle('on', all);
    box.classList.toggle('all', all);
  };
  box.addEventListener('click', (e) => {
    const head = e.target.closest('.tr-head');
    if (!head) return;
    const next = head.parentElement.querySelector('.tr-node:not(.on)');
    if (next) next.classList.add('on');
    if (!head.parentElement.querySelector('.tr-node:not(.on)')) head.querySelector('i').textContent = '展开完了';
    update();
  });
}
const trBox = document.getElementById('trBox');
if (trBox) initTree(trBox);

/* ================= 弯弯的劳动之路 ================= */
const ROAD_STOPS = [
  ['🌱', '种稻'], ['🌾', '收割'], ['⚙️', '磨米成粉'], ['🎋', '种甘蔗、熬糖'],
  ['🍥', '做米糕'], ['📦', '包装'], ['🚚', '送货'], ['🏪', '销售'],
];
const ROAD_XY = [[90, 330], [230, 210], [380, 300], [520, 170], [670, 270], [800, 140], [920, 250], [1060, 140]];
function buildRoad(box) {
  const d = ROAD_XY.map(([x, y], i) => {
    if (!i) return `M${x} ${y}`;
    const [px, py] = ROAD_XY[i - 1];
    return `C${px + 60} ${py} ${x - 60} ${y} ${x} ${y}`;
  }).join('');
  box.innerHTML = `<svg viewBox="0 0 1150 420" aria-hidden="true">
    <rect width="1150" height="420" rx="20" class="ld-bg"/>
    <path d="${d}" class="ld-path"/>
    ${ROAD_STOPS.map(([e, t], i) => `<g transform="translate(${ROAD_XY[i][0]} ${ROAD_XY[i][1]})"><g class="ld-stop" data-step="${i + 1}"><circle r="52"/><text class="e" y="16">${e}</text><text class="t" y="${ROAD_XY[i][1] > 250 ? 86 : -66}">${t}</text><text class="n" x="-40" y="-36">${i + 1}</text></g></g>`).join('')}
  </svg>`;
}
const ldRoad = document.getElementById('ldRoad');
if (ldRoad) buildRoad(ldRoad);

/* ================= 举例：衣服 / 铅笔 / 课本 ================= */
const EG = [
  ['🌱 种棉花', '🧶 纺纱', '🧵 织布', '✂️ 裁剪缝制', '🚚 运输', '🏪 销售'],
  ['🌲 种树、伐木', '⛏️ 采石墨', '✏️ 做铅芯和笔杆', '🎨 刷漆', '🚚 运输', '🏪 销售'],
  ['✍️ 作家写文章', '🖍️ 画家画插图', '🌲 造纸', '🖨️ 印刷、装订', '🚚 运到学校'],
];
function initEg(box) {
  const chain = document.getElementById('egChain');
  const show = (k) => {
    box.querySelectorAll('.eg-t').forEach((t) => t.classList.toggle('on', +t.dataset.k === k));
    chain.innerHTML = EG[k].map((s, i) => `<span style="--i:${i}">${s}</span>`).join('<i>→</i>');
  };
  box.addEventListener('click', (e) => {
    const t = e.target.closest('.eg-t');
    if (t) show(+t.dataset.k);
  });
  show(0);
}
const egBox = document.getElementById('egBox');
if (egBox) initEg(egBox);

/* ================= 揭蒸笼 ================= */
document.querySelectorAll('.zl').forEach((z) => z.addEventListener('click', () => z.classList.toggle('open')));

Hanzi.init({
  cards: [
    { z: '糕', py: 'gāo', words: [['米糕', 'mǐ gāo'], ['蛋糕', 'dàn gāo']] },
    { z: '特', py: 'tè', words: [['特别', 'tè bié']] },
    { z: '嘛', py: 'ma', words: [['米糕嘛', 'mǐ gāo ma']] },
    { z: '买', py: 'mǎi', words: [['买过', 'mǎi guò'], ['买菜', 'mǎi cài']] },
    { z: '粉', py: 'fěn', words: [['面粉', 'miàn fěn'], ['粉笔', 'fěn bǐ']] },
    { z: '糖', py: 'táng', words: [['加糖', 'jiā táng'], ['糖果', 'táng guǒ']] },
    { z: '蔗', py: 'zhè', words: [['甘蔗', 'gān zhè'], ['蔗糖', 'zhè táng']] },
    { z: '汁', py: 'zhī', words: [['果汁', 'guǒ zhī'], ['甘蔗汁', 'gān zhè zhī']] },
    { z: '菜', py: 'cài', words: [['甜菜', 'tián cài'], ['青菜', 'qīng cài']] },
    { z: '熬', py: 'áo', words: [['熬糖', 'áo táng'], ['熬粥', 'áo zhōu']] },
    { z: '算', py: 'suàn', words: [['就算', 'jiù suàn'], ['算数', 'suàn shù']] },
    { z: '销', py: 'xiāo', words: [['销售', 'xiāo shòu']] },
    { z: '劳', py: 'láo', words: [['劳动', 'láo dòng'], ['勤劳', 'qín láo']] },
    { z: '的', py: 'dí', words: [['的确', 'dí què']] },
    { z: '确', py: 'què', words: [['的确', 'dí què'], ['正确', 'zhèng què']] },
    { z: '应', py: 'yīng', words: [['应该', 'yīng gāi']] },
  ],
  apples: [['糕', 'gāo'], ['特', 'tè'], ['买', 'mǎi'], ['粉', 'fěn'], ['糖', 'táng'], ['蔗', 'zhè'], ['汁', 'zhī'], ['熬', 'áo'], ['算', 'suàn'], ['销', 'xiāo'], ['劳', 'láo'], ['确', 'què']],
  write: {
    a: [
      { z: '能', py: 'néng', bh: 10 },
      { z: '桌', py: 'zhuō', bs: '木', bh: 10 },
      { z: '味', py: 'wèi', bs: '口', bh: 8 },
      { z: '买', py: 'mǎi', bh: 6 },
      { z: '具', py: 'jù', bh: 8 },
    ],
    b: [
      { z: '甘', py: 'gān', bs: '甘', bh: 5 },
      { z: '甜', py: 'tián', bh: 11 },
      { z: '菜', py: 'cài', bs: '艹', bh: 11 },
      { z: '劳', py: 'láo', bh: 7 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.querySelector('.dl-lines')) updateDialog(slide, step);
  },
};
