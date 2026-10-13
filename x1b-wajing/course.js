'use strict';
/* 吃水不忘挖井人 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* ================= 刻碑文：竖排两行，从右往左；每行跟着 data-step 一个字一个字“刻”出来 ================= */
const STELE = [
  ['吃水不忘挖井人', 'chī shuǐ bú wàng wā jǐng rén'],
  ['时刻想念毛主席', 'shí kè xiǎng niàn máo zhǔ xí'],
];
document.querySelectorAll('#stele .wj-col').forEach((col, i) => {
  const [text, py] = STELE[i];
  const syl = py.split(' ');
  col.innerHTML = [...text].map((ch, k) => `<span class="wj-ch" style="--d:${(k * 0.35).toFixed(2)}s"><i>${syl[k]}</i>${ch}</span>`).join('');
});

/* ================= 排一排（讲故事：按先后点卡片） =================
 * 容器 <div class="order" data-order="key" data-noswipe>；数据 ORDER[key] = [{ t, py, pic | svg }]，按正确顺序写。 */
const SVG_STELE = '<svg viewBox="0 0 100 60"><path d="M36 6H64V50H36Z" fill="#c9c6bd" stroke="#8d897e" stroke-width="2"/><path d="M28 50H72V56H28Z" fill="#a8a397"/><path d="M44 12V44M56 12V44" stroke="#8d897e" stroke-width="2" stroke-dasharray="3 3"/></svg>';
const ORDER = {
  story: [
    { pic: 'tiaoshui', t: '村子里没有水井，乡亲们到很远的地方去挑水。', py: 'cūn zi lǐ méi yǒu shuǐ jǐng xiāng qīn men dào hěn yuǎn de dì fang qù tiāo shuǐ' },
    { pic: 'wajing', t: '毛主席带领战士和乡亲们挖了一口井。', py: 'máo zhǔ xí dài lǐng zhàn shì hé xiāng qīn men wā le yì kǒu jǐng' },
    { pic: 'shibei', t: '解放以后，乡亲们在井旁边立了一块石碑。', py: 'jiě fàng yǐ hòu xiāng qīn men zài jǐng páng biān lì le yí kuài shí bēi' },
    { svg: SVG_STELE, t: '石碑上刻着：“吃水不忘挖井人，时刻想念毛主席。”', py: 'shí bēi shàng kè zhe chī shuǐ bú wàng wā jǐng rén shí kè xiǎng niàn máo zhǔ xí' },
  ],
};
// 重新排时卡片是新生成的，图片直接显示（这时已经在当前页，不需要再按需加载）
function showBg(el) { el.style.backgroundImage = `url('${el.dataset.bg}')`; el.removeAttribute('data-bg'); }
function initOrder(box, items) {
  const face = (it) => (it.pic ? `<div class="o-pic" data-bg="assets/${it.pic}.jpg"></div>` : `<div class="o-pic">${it.svg}</div>`);
  const shuffled = () => {
    const idx = items.map((_, i) => i).sort(() => Math.random() - 0.5);
    return idx.every((v, i) => v === i) ? [...idx.slice(1), idx[0]] : idx;
  };
  let next = 0;
  const build = () => {
    next = 0;
    box.classList.remove('done');
    box.style.setProperty('--n', items.length);
    box.innerHTML = `<div class="order-slots">${items.map((_, i) => `<div class="o-slot" data-n="${i + 1}"></div>`).join('')}</div>
      <div class="order-pool">${shuffled().map((i) => `<button type="button" class="o-card" data-i="${i}">${face(items[i])}<span class="py">${Hanzi.ruby(items[i].t, items[i].py)}</span></button>`).join('')}</div>
      <div class="order-bar"><span class="order-msg">点一点：先发生的先点。</span><button type="button" class="btn" data-reset>重新排</button></div>`;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { build(); box.querySelectorAll('[data-bg]').forEach(showBg); return; }
    const card = e.target.closest('.o-card');
    if (!card || card.classList.contains('used')) return;
    card.classList.remove('wrong');
    if (+card.dataset.i !== next) {
      void card.offsetWidth; // 重新触发抖动动画
      card.classList.add('wrong');
      box.querySelector('.order-msg').textContent = '再想想：这件事是先发生的吗？';
      return;
    }
    const slot = box.querySelectorAll('.o-slot')[next];
    slot.innerHTML = card.innerHTML;
    slot.classList.add('filled');
    card.classList.add('used');
    next += 1;
    const done = next === items.length;
    box.classList.toggle('done', done);
    box.querySelector('.order-msg').textContent = done ? '排好了！看着格子，把故事讲一讲。' : `对了！接着找第 ${next + 1} 件事。`;
  });
  build();
}
document.querySelectorAll('[data-order]').forEach((box) => initOrder(box, ORDER[box.dataset.order]));

/* ================= 开火车读生字：读对一节，点亮一节，火车往前开 ================= */
const TRAIN = [['吃', 'chī'], ['忘', 'wàng'], ['井', 'jǐng'], ['村', 'cūn'], ['叫', 'jiào'], ['毛', 'máo'], ['主', 'zhǔ'], ['席', 'xí'], ['乡', 'xiāng'], ['亲', 'qīn'], ['战', 'zhàn'], ['士', 'shì'], ['面', 'miàn']];
const ENGINE = '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M10 30H70V12H96V62H10Z" fill="#c8452e"/><path d="M76 18H90V34H76Z" fill="#cfe8f5"/><path d="M22 4H36V30H22Z" fill="#3a3a40"/><circle cx="30" cy="66" r="11" fill="#3a3a40"/><circle cx="76" cy="66" r="11" fill="#3a3a40"/><path d="M96 50L114 62H96Z" fill="#e2b33c"/></svg>';
function initTrain(box) {
  box.innerHTML = `<div class="wj-track"><div class="wj-engine">${ENGINE}</div>${TRAIN.map(([z, py], i) => `<button type="button" class="wj-car" data-i="${i}"><i>${py}</i>${z}</button>`).join('')}</div>
    <div class="wj-train-bar"><span class="wj-train-msg">点一节车厢：读对了，它就亮起来。</span><b class="wj-train-n">0 / ${TRAIN.length}</b><button type="button" class="btn" data-reset>再开一次</button></div>`;
  const show = () => {
    const n = box.querySelectorAll('.wj-car.on').length;
    box.querySelector('.wj-train-n').textContent = `${n} / ${TRAIN.length}`;
    box.classList.toggle('arrive', n === TRAIN.length);
    box.querySelector('.wj-train-msg').textContent = n === TRAIN.length ? '火车到站啦！13 个生字全读对了。' : n ? '轰隆隆，火车往前开！下一节谁来读？' : '点一节车厢：读对了，它就亮起来。';
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { box.querySelectorAll('.wj-car').forEach((c) => c.classList.remove('on')); show(); return; }
    const car = e.target.closest('.wj-car');
    if (!car) return;
    car.classList.toggle('on');
    show();
  });
  show();
}
initTrain(document.getElementById('train'));

Hanzi.init({
  cards: [
    { z: '吃', py: 'chī', bs: '口', bh: 6, words: [['吃水', 'chī shuǐ'], ['好吃', 'hǎo chī']] },
    { z: '忘', py: 'wàng', bs: '心', bh: 7, words: [['不忘', 'bú wàng'], ['忘记', 'wàng jì']] },
    { z: '井', py: 'jǐng', bs: '二', bh: 4, words: [['水井', 'shuǐ jǐng'], ['井口', 'jǐng kǒu']] },
    { z: '村', py: 'cūn', bs: '木', bh: 7, words: [['村子', 'cūn zi'], ['山村', 'shān cūn']] },
    { z: '叫', py: 'jiào', bs: '口', bh: 5, words: [['叫声', 'jiào shēng'], ['叫好', 'jiào hǎo']] },
    { z: '毛', py: 'máo', bs: '毛', bh: 4, words: [['羽毛', 'yǔ máo'], ['毛衣', 'máo yī']] },
    { z: '主', py: 'zhǔ', bs: '丶', bh: 5, words: [['主席', 'zhǔ xí'], ['主人', 'zhǔ rén']] },
    { z: '席', py: 'xí', bs: '广', bh: 10, words: [['主席', 'zhǔ xí'], ['席子', 'xí zi']] },
    { z: '乡', py: 'xiāng', bs: '乙', bh: 3, words: [['乡亲', 'xiāng qīn'], ['家乡', 'jiā xiāng']] },
    { z: '亲', py: 'qīn', bs: '立', bh: 9, words: [['乡亲', 'xiāng qīn'], ['亲人', 'qīn rén']] },
    { z: '战', py: 'zhàn', bs: '戈', bh: 9, words: [['战士', 'zhàn shì'], ['战友', 'zhàn yǒu']] },
    { z: '士', py: 'shì', bs: '士', bh: 3, words: [['战士', 'zhàn shì'], ['护士', 'hù shi']] },
    { z: '面', py: 'miàn', bs: '面', bh: 9, words: [['上面', 'shàng miàn'], ['面前', 'miàn qián']] },
  ],
  shapes: {
    井: ['M34 8V92', 'M66 8V92', 'M8 34H92', 'M8 66H92'],
    毛: ['M44 94C46 64 54 34 70 8', 'M50 64L22 54', 'M54 46L26 32', 'M60 30L36 16', 'M51 58L80 50', 'M57 40L84 30'],
  },
  evolve: [
    { z: '井', note: '像井口四周用木头架起的“井”字形井栏，防止人掉下去。' },
    { z: '毛', note: '像一根羽毛：中间是毛杆，两边是细细的毛。' },
  ],
  write: [
    { z: '吃', py: 'chī', bs: '口', bh: 6 },
    { z: '叫', py: 'jiào', bs: '口', bh: 5 },
    { z: '主', py: 'zhǔ', bs: '丶', bh: 5 },
    { z: '江', py: 'jiāng', bs: '氵', bh: 6 },
    { z: '住', py: 'zhù', bs: '亻', bh: 7 },
    { z: '没', py: 'méi', bs: '氵', bh: 7 },
    { z: '以', py: 'yǐ', bs: '人', bh: 4 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
