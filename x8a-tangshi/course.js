'use strict';
/* 唐诗五首 · 本课数据。一首诗一种读法：意象拼贴 / 登楼视角 / 构图 / 水路 / 游湖路线；律诗格律对齐表 */

const POEMS = {
  yewang: { title: '野望', author: '［唐］王绩', lines: ['东皋薄暮望，', '徙倚欲何依。', '树树皆秋色，', '山山唯落晖。', '牧人驱犊返，', '猎马带禽归。', '相顾无相识，', '长歌怀采薇。'].map((t) => ({ t })), notes: {} },
  huanghelou: {
    title: '黄鹤楼', author: '［唐］崔颢',
    lines: [
      { t: '昔人已乘黄鹤去，', r: '昔人/已乘/黄鹤去，' }, { t: '此地空余黄鹤楼。', r: '此地/空余/黄鹤楼。' },
      { t: '黄鹤一去不复返，', r: '黄鹤/一去/不复返，' }, { t: '白云千载空悠悠。', r: '白云/千载/空悠悠。' },
      { t: '晴川历历汉阳树，', r: '晴川/历历/汉阳树，' }, { t: '芳草萋萋鹦鹉洲。', r: '芳草/萋萋/鹦鹉洲。' },
      { t: '日暮乡关何处是？', r: '日暮/乡关/何处是？' }, { t: '烟波江上使人愁。', r: '烟波/江上/使人愁。' },
    ],
    notes: { 昔人: '指传说中骑鹤飞去的仙人', 悠悠: '飘飘荡荡的样子', 晴川: '晴日里的原野。川，平川、原野', 历历: '分明的样子', 汉阳: '地名，今湖北武汉的汉阳区，与黄鹤楼隔江相望', 萋萋: '草木茂盛的样子（读 qī qī）', 鹦鹉洲: '长江中的小洲，在黄鹤楼东北', 乡关: '故乡' },
  },
  saishang: { title: '使至塞上', author: '［唐］王维', lines: ['单车欲问边，', '属国过居延。', '征蓬出汉塞，', '归雁入胡天。', '大漠孤烟直，', '长河落日圆。', '萧关逢候骑，', '都护在燕然。'].map((t) => ({ t })), notes: {} },
  jingmen: { title: '渡荆门送别', author: '［唐］李白', lines: ['渡远荆门外，', '来从楚国游。', '山随平野尽，', '江入大荒流。', '月下飞天镜，', '云生结海楼。', '仍怜故乡水，', '万里送行舟。'].map((t) => ({ t })), notes: {} },
  qiantang: { title: '钱塘湖春行', author: '［唐］白居易', lines: ['孤山寺北贾亭西，', '水面初平云脚低。', '几处早莺争暖树，', '谁家新燕啄春泥。', '乱花渐欲迷人眼，', '浅草才能没马蹄。', '最爱湖东行不足，', '绿杨阴里白沙堤。'].map((t) => ({ t })), notes: {} },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* ---------- 野望：意象拼贴（按 → 顺序拼；点按钮单独拼入 / 拿掉） ---------- */
const ywShown = (l) => l.classList.contains('pin') || (l.classList.contains('on') && !l.classList.contains('unpin'));
function syncYw() {
  document.querySelectorAll('#ywChips button').forEach((b) => b.classList.toggle('on', ywShown(document.querySelector(`#ywSvg .yw-l[data-l="${b.dataset.l}"]`))));
}
function initYw() {
  document.getElementById('ywChips').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-l]');
    if (!b) return;
    const layer = document.querySelector(`#ywSvg .yw-l[data-l="${b.dataset.l}"]`);
    const show = !ywShown(layer);
    layer.classList.toggle('pin', show);
    layer.classList.toggle('unpin', !show);
    syncYw();
  });
}
function updateYw(slide) {
  if (!slide.classList.contains('s-yw')) return;
  slide.querySelectorAll('.yw-l').forEach((l) => { if (!l.classList.contains('on')) l.classList.remove('unpin'); });
  syncYw();
}

/* ---------- 使至塞上：换字 ---------- */
const FEEL = {
  '直圆': '“直”：大漠无风，烽烟笔直上升，写出孤烟的劲拔和边塞的空旷；“圆”：落日浑圆，写出黄河上落日的苍茫、温暖。',
  '斜圆': '换成“斜”：烟被风吹歪了，画面不再挺拔，大漠的空旷、宁静也没了。',
  '直红': '换成“红”：只有颜色，没有形状——那种浑圆、苍茫、壮阔的感觉不见了。',
  '斜红': '两个字都换掉，一横一竖一圆的几何美全没了。可见“直”“圆”二字的锤炼。',
};
const ss = { smoke: '直', sun: '圆' };
function renderSs() {
  document.getElementById('ssSmoke').style.opacity = ss.smoke === '直' ? '.75' : '0';
  document.getElementById('ssSmokeBent').style.opacity = ss.smoke === '直' ? '0' : '.75';
  document.getElementById('ssSun').style.opacity = ss.sun === '圆' ? '1' : '0';
  document.getElementById('ssSunBlob').style.opacity = ss.sun === '圆' ? '0' : '1';
  document.getElementById('ssLine').innerHTML = `大漠孤烟<em>${ss.smoke}</em>，长河落日<em>${ss.sun}</em>。`;
  document.getElementById('ssFeel').textContent = FEEL[ss.smoke + ss.sun];
  document.querySelectorAll('.ss-try [data-smoke]').forEach((b) => b.classList.toggle('solid', b.dataset.smoke === ss.smoke));
  document.querySelectorAll('.ss-try [data-sun]').forEach((b) => b.classList.toggle('solid', b.dataset.sun === ss.sun));
}
function initSs() {
  document.querySelector('.ss-try').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.smoke) ss.smoke = b.dataset.smoke;
    if (b.dataset.sun) ss.sun = b.dataset.sun;
    renderSs();
  });
  renderSs();
}

/* ---------- 沿路径移动（渡荆门的船、钱塘湖的行人） ---------- */
function moveAlong(pathId, targetId, frac) {
  const path = document.getElementById(pathId);
  const pt = path.getPointAtLength(path.getTotalLength() * frac);
  document.getElementById(targetId).style.transform = `translate(${pt.x}px, ${pt.y}px)`;
}
const JM_POS = [0.12, 0.42, 0.6, 0.78, 0.9];
const QT_POS = [0, 0.04, 0.33, 0.62, 1, 1];
function updateRoutes(slide, step) {
  if (slide.classList.contains('s-jm')) {
    moveAlong('jmRiver', 'jmBoat', JM_POS[Math.min(step, 4)]);
    const svg = document.getElementById('jmSvg');
    svg.classList.toggle('night', step >= 3);
    svg.classList.toggle('back', step >= 4);
  }
  if (slide.classList.contains('s-qt')) moveAlong('qtPath', 'qtWalker', QT_POS[Math.min(step, 5)]);
}

/* ---------- 积累拓展五：春天的阶段 ---------- */
const SPRING = [
  { s: '带雪梅初暖，含烟柳尚青。（孟浩然）', ok: ['初春'], q: '还带着雪，梅花初暖，柳色尚青——初春' },
  { s: '雨中草色绿堪染，水上桃花红欲燃。（王维）', ok: ['仲春'], q: '草绿得能染东西，桃花红得像要燃烧——春意正浓' },
  { s: '杨柳阴阴细雨晴，残花落尽见流莺。（武元衡）', ok: ['暮春'], q: '柳荫浓密，残花落尽——春天将尽' },
  { s: '半烟半雨江桥畔，映杏映桃山路中。（郑谷）', ok: ['仲春'], q: '杏花、桃花盛开相映——仲春' },
];

/* ---------- 积累拓展六：律诗对齐表 ---------- */
const LV = {
  yewang: { name: '野望', dui: ['树树/皆/秋色', '山山/唯/落晖', '牧人/驱/犊/返', '猎马/带/禽/归'], yun: [1, 3, 5, 7], note: '韵脚：依、晖、归、薇。颔联“树树—山山”“秋色—落晖”，颈联“牧人—猎马”“犊—禽”“返—归”，对得工整。' },
  huanghelou: { name: '黄鹤楼', dui: ['黄鹤/一去/不复返', '白云/千载/空悠悠', '晴川/历历/汉阳树', '芳草/萋萋/鹦鹉洲'], yun: [1, 3, 5, 7], note: '韵脚：楼、悠、洲、愁。颈联“晴川历历—芳草萋萋”对仗工整；颔联不拘对仗，气势奔放。' },
  saishang: { name: '使至塞上', dui: ['征蓬/出/汉塞', '归雁/入/胡天', '大漠/孤烟/直', '长河/落日/圆'], yun: [0, 1, 3, 5, 7], note: '首句入韵。韵脚：边、延、天、圆、然。颈联“大漠—长河”“孤烟—落日”“直—圆”。' },
  jingmen: { name: '渡荆门送别', dui: ['山/随/平野/尽', '江/入/大荒/流', '月下/飞/天镜', '云生/结/海楼'], yun: [1, 3, 5, 7], note: '韵脚：游、流、楼、舟。颔联“山—江”“随—入”“平野—大荒”“尽—流”。' },
  qiantang: { name: '钱塘湖春行', dui: ['几处/早莺/争/暖树', '谁家/新燕/啄/春泥', '乱花/渐欲/迷/人眼', '浅草/才能/没/马蹄'], yun: [0, 1, 3, 5, 7], note: '首句入韵。韵脚：西、低、泥、蹄、堤。颔联“几处—谁家”“早莺—新燕”“争—啄”“暖树—春泥”。' },
};
const LIAN = ['首联', '颔联', '颈联', '尾联'];
const strip = (s) => s.replace(/[，。？！]/g, '');
let lvKey = 'saishang';
function renderLv() {
  const d = LV[lvKey];
  const lines = POEMS[lvKey].lines.map((l) => strip(l.t));
  document.getElementById('lvGrid').innerHTML = lines.map((line, i) => {
    const segLine = i >= 2 && i <= 5 ? d.dui[i - 2].split('/') : null;
    let cells;
    if (segLine) cells = segLine.map((seg, k) => [...seg].map((ch) => `<i class="sg sg${k % 4}">${ch}</i>`).join('')).join('');
    else cells = [...line].map((ch) => `<i>${ch}</i>`).join('');
    const yun = d.yun.includes(i) ? ' yun-line' : '';
    return `<div class="lv-row${yun}${segLine ? ' dui-line' : ''}"><b>${i % 2 === 0 ? LIAN[i / 2] : ''}</b>${cells}</div>`;
  }).join('');
  document.getElementById('lvNote').textContent = d.note;
  document.querySelectorAll('#lvPick .btn').forEach((b) => b.classList.toggle('solid', b.dataset.k === lvKey));
}
function initLv() {
  const pick = document.getElementById('lvPick');
  pick.innerHTML = Object.entries(LV).map(([k, v]) => `<button type="button" class="btn" data-k="${k}">${v.name}</button>`).join('');
  pick.addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) { lvKey = b.dataset.k; renderLv(); } });
  const slide = document.querySelector('.s-lv');
  document.getElementById('lvDui').onclick = (e) => e.target.classList.toggle('solid', slide.classList.toggle('show-dui'));
  document.getElementById('lvYun').onclick = (e) => e.target.classList.toggle('solid', slide.classList.toggle('show-yun'));
  renderLv();
}

/* ---------- 背诵：选诗 ---------- */
function initRecitePick() {
  const pick = document.getElementById('rcPick');
  const boxes = [...document.querySelectorAll('.rc-boxes .recite')];
  pick.innerHTML = boxes.map((b, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">${POEMS[b.dataset.recite].title}</button>`).join('');
  pick.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    boxes.forEach((x, i) => { x.hidden = i !== +b.dataset.i; });
    pick.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
  });
}

function initQtMark() {
  const btn = document.getElementById('qtMark');
  btn.addEventListener('click', () => btn.classList.toggle('solid', document.querySelector('.qt-poem').classList.toggle('marked')));
}

window.LESSON = {
  init() {
    Narrative.init({ sort: SPRING, kinds: ['初春', '仲春', '暮春'] });
    Poem.init();
    initYw();
    initSs();
    initLv();
    initRecitePick();
    initQtMark();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateYw(slide);
    updateRoutes(slide, step);
  },
};
