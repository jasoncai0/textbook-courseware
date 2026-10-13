'use strict';
/* 小公鸡和小鸭子 · 本课数据与本课互动。故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* 角色头像：从草地图里裁出小公鸡（左）和小鸭子（右），按需加载 */
document.querySelectorAll('.gj-av.chick, .gj-av.duck').forEach((el) => { el.dataset.bg = 'assets/caodi.jpg'; });

/* ================= 分角色朗读：点角色，台词亮起来 ================= */
const SCRIPT = [
  ['nar', '他们走到小河边。小鸭子说：', 'tā men zǒu dào xiǎo hé biān xiǎo yā zi shuō'],
  ['duck', '“公鸡弟弟，我到河里捉鱼给你吃。”', 'gōng jī dì di wǒ dào hé lǐ zhuō yú gěi nǐ chī'],
  ['nar', '小公鸡说：', 'xiǎo gōng jī shuō'],
  ['chick', '“我也去。”', 'wǒ yě qù'],
  ['nar', '小鸭子说：', 'xiǎo yā zi shuō'],
  ['duck', '“不行，不行，你不会游泳，会淹死的！”', 'bù xíng bù xíng nǐ bú huì yóu yǒng huì yān sǐ de'],
  ['nar', '小公鸡不信，偷偷地跟在小鸭子后面，也下了水。……小公鸡上了岸，笑着对小鸭子说：', 'xiǎo gōng jī bú xìn tōu tōu de gēn zài xiǎo yā zi hòu miàn yě xià le shuǐ xiǎo gōng jī shàng le àn xiào zhe duì xiǎo yā zi shuō'],
  ['chick', '“鸭子哥哥，谢谢你。”', 'yā zi gē ge xiè xie nǐ'],
];
const ROLES = [['duck', '小鸭子'], ['chick', '小公鸡'], ['nar', '旁白']];
function initRoles(box) {
  box.innerHTML = `<div class="gj-rolebtns">${ROLES.map(([k, n]) => `<button type="button" class="gj-rolebtn" data-r="${k}"><span class="gj-av ${k}" ${k !== 'nar' ? 'data-bg="assets/caodi.jpg"' : ''}></span>${n}</button>`).join('')}</div>
    <div class="gj-script">${SCRIPT.map(([r, t, p]) => `<p class="gj-sl r-${r} py">${Hanzi.ruby(t, p)}</p>`).join('')}</div>`;
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.gj-rolebtn');
    if (!b) return;
    const on = !b.classList.contains('on');
    box.querySelectorAll('.gj-rolebtn').forEach((x) => x.classList.toggle('on', on && x === b));
    box.dataset.role = on ? b.dataset.r : '';
  });
}
initRoles(document.getElementById('roles'));

/* ================= 动作词配图：点动作，再点图 ================= */
const ACT_PICS = [['caodi', '草地上'], ['hebian', '小河边'], ['tuo', '河里']];
const ACTS = [
  ['捉到虫子', 'zhuō dào chóng zi', 'caodi'], ['急得直哭', 'jí de zhí kū', 'caodi'], ['偷偷地跟', 'tōu tōu de gēn', 'hebian'],
  ['喊救命', 'hǎn jiù mìng', 'hebian'], ['飞快地游', 'fēi kuài de yóu', 'tuo'], ['坐在背上', 'zuò zài bèi shàng', 'tuo'],
];
const ACT_ORDER = [4, 0, 3, 1, 5, 2];
function initActs(box) {
  box.innerHTML = `<div class="gj-acttray">${ACT_ORDER.map((i) => `<button type="button" class="gj-act" data-p="${ACTS[i][2]}">${Hanzi.ruby(ACTS[i][0], ACTS[i][1])}</button>`).join('')}</div>
    <div class="gj-actpics">${ACT_PICS.map(([p, n]) => `<div class="gj-actpic" data-p="${p}"><div class="gj-actimg" data-bg="assets/${p}.jpg"></div><b>${n}</b><div class="gj-actgot"></div></div>`).join('')}</div>
    <p class="gj-actmsg">先点一个动作，再点它在哪幅图里。</p>`;
  let sel = null;
  const msg = (t) => { box.querySelector('.gj-actmsg').textContent = t; };
  box.addEventListener('click', (e) => {
    const a = e.target.closest('.gj-acttray .gj-act');
    if (a) { sel = a; box.querySelectorAll('.gj-acttray .gj-act').forEach((x) => x.classList.toggle('sel', x === a)); return; }
    const pic = e.target.closest('.gj-actpic');
    if (!pic || !sel) return;
    if (pic.dataset.p !== sel.dataset.p) { pic.classList.remove('wrong'); void pic.offsetWidth; pic.classList.add('wrong'); msg('再看看图：这个动作发生在哪儿？'); return; }
    pic.querySelector('.gj-actgot').appendChild(sel);
    sel.classList.remove('sel');
    sel = null;
    const done = !box.querySelector('.gj-acttray .gj-act');
    box.classList.toggle('done', done);
    msg(done ? '小公鸡捉虫子给小鸭子，小鸭子驮小公鸡过河——好朋友互相帮助！' : '贴对了！再贴一个。');
  });
}
initActs(document.getElementById('acts'));

/* ================= 排一排（讲故事：按先后点卡片） =================
 * 容器 <div class="order" data-order="key" data-noswipe>；数据 ORDER[key] = [{ t, py, pic | svg }]，按正确顺序写。 */
const SVG_THANKS = '<svg viewBox="0 0 100 60"><path d="M0 44Q50 36 100 44V60H0Z" fill="#9fd486"/><path d="M50 30C44 18 28 22 32 34C35 42 50 50 50 50C50 50 65 42 68 34C72 22 56 18 50 30Z" fill="#ff7a8a"/></svg>';
const ORDER = {
  story: [
    { pic: 'caodi', t: '草地里，小公鸡捉到虫子给小鸭子吃。', py: 'cǎo dì lǐ xiǎo gōng jī zhuō dào chóng zi gěi xiǎo yā zi chī' },
    { pic: 'hebian', t: '小公鸡偷偷地跟着下了水，喊救命。', py: 'xiǎo gōng jī tōu tōu de gēn zhe xià le shuǐ hǎn jiù mìng' },
    { pic: 'tuo', t: '小鸭子让小公鸡坐在自己的背上。', py: 'xiǎo yā zi ràng xiǎo gōng jī zuò zài zì jǐ de bèi shàng' },
    { svg: SVG_THANKS, t: '小公鸡上了岸，说：“鸭子哥哥，谢谢你。”', py: 'xiǎo gōng jī shàng le àn shuō yā zi gē ge xiè xie nǐ' },
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

/* ================= 小鸭子钓鱼：点一条鱼，跳进小桶 ================= */
const FISH = [['块', 'kuài'], ['捉', 'zhuō'], ['急', 'jí'], ['直', 'zhí'], ['河', 'hé'], ['行', 'xíng'], ['死', 'sǐ'], ['信', 'xìn'], ['跟', 'gēn'], ['忽', 'hū'], ['喊', 'hǎn'], ['身', 'shēn']];
const FISH_COLORS = ['#ff9f6b', '#ffd36b', '#8fd18a', '#7cc4f5', '#c59cf2', '#ff8fb1'];
const FISH_SVG = (c) => `<svg viewBox="0 0 120 60" aria-hidden="true"><path d="M92 30L118 10V50Z" fill="${c}"/><ellipse cx="54" cy="30" rx="44" ry="24" fill="${c}"/><circle cx="24" cy="24" r="4" fill="#333"/></svg>`;
function initPond(box) {
  box.innerHTML = `<div class="gj-water">${FISH.map(([z, p], i) => `<button type="button" class="gj-fish" style="left:${6 + (i % 4) * 23}%;top:${8 + Math.floor(i / 4) * 30}%;--d:${(i % 5) * 0.7}s;--dir:${i % 2 ? -1 : 1}">${FISH_SVG(FISH_COLORS[i % FISH_COLORS.length])}<b>${z}</b></button>`).join('')}</div>
    <div class="gj-bucket"><p>小桶里有 <b class="gj-n">0</b> 条鱼</p><div class="gj-caught"></div><button type="button" class="btn" data-reset>把鱼放回河里</button></div>`;
  const show = () => { box.querySelector('.gj-n').textContent = box.querySelectorAll('.gj-caught span').length; };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) {
      box.querySelectorAll('.gj-fish').forEach((f) => f.classList.remove('caught'));
      box.querySelector('.gj-caught').innerHTML = '';
      show();
      return;
    }
    const f = e.target.closest('.gj-fish:not(.caught)');
    if (!f) return;
    f.classList.add('caught');
    const [z, p] = FISH.find(([ch]) => ch === f.querySelector('b').textContent);
    box.querySelector('.gj-caught').insertAdjacentHTML('beforeend', `<span>${Hanzi.ruby(z, p)}</span>`);
    show();
  });
}
initPond(document.getElementById('pond'));

Hanzi.init({
  cards: [
    { z: '块', py: 'kuài', bs: '土', bh: 7, words: [['一块儿', 'yí kuàir _'], ['石块', 'shí kuài']] },
    { z: '捉', py: 'zhuō', bs: '扌', bh: 10, words: [['捉虫子', 'zhuō chóng zi'], ['捉鱼', 'zhuō yú']] },
    { z: '急', py: 'jí', bs: '心', bh: 9, words: [['着急', 'zháo jí'], ['急忙', 'jí máng']] },
    { z: '直', py: 'zhí', bs: '十', bh: 8, words: [['一直', 'yì zhí'], ['笔直', 'bǐ zhí']] },
    { z: '河', py: 'hé', bs: '氵', bh: 8, words: [['小河', 'xiǎo hé'], ['河边', 'hé biān']] },
    { z: '行', py: 'xíng', bs: '彳', bh: 6, words: [['不行', 'bù xíng'], ['步行', 'bù xíng']] },
    { z: '死', py: 'sǐ', bs: '歹', bh: 6, words: [['淹死', 'yān sǐ']] },
    { z: '信', py: 'xìn', bs: '亻', bh: 9, words: [['不信', 'bú xìn'], ['相信', 'xiāng xìn']] },
    { z: '跟', py: 'gēn', bs: '⻊', bh: 13, words: [['跟着', 'gēn zhe'], ['跟在后面', 'gēn zài hòu miàn']] },
    { z: '忽', py: 'hū', bs: '心', bh: 8, words: [['忽然', 'hū rán']] },
    { z: '喊', py: 'hǎn', bs: '口', bh: 12, words: [['喊救命', 'hǎn jiù mìng'], ['大喊', 'dà hǎn']] },
    { z: '身', py: 'shēn', bs: '身', bh: 7, words: [['身边', 'shēn biān'], ['身体', 'shēn tǐ']] },
  ],
  shapes: {
    身: ['M50 6A9 9 0 1 0 50 24A9 9 0 1 0 50 6', 'M48 26C30 34 30 66 46 74', 'M48 26C70 36 72 64 46 74', 'M46 74L36 94', 'M52 72L62 94'],
    行: ['M38 8V38H8', 'M62 8V38H92', 'M38 92V62H8', 'M62 92V62H92'],
  },
  evolve: [
    { z: '身', note: '像一个侧身站着的人，肚子鼓鼓的。“身”就是身体。' },
    { z: '行', note: '像一个十字路口，本来指道路；人在路上走，所以“行”也表示走。' },
  ],
  write: [
    { z: '他', py: 'tā', bs: '亻', bh: 5 },
    { z: '地', py: 'dì', bs: '土', bh: 6 },
    { z: '河', py: 'hé', bs: '氵', bh: 8 },
    { z: '说', py: 'shuō', bs: '讠', bh: 9 },
    { z: '也', py: 'yě', bs: '乙', bh: 3 },
    { z: '听', py: 'tīng', bs: '口', bh: 7 },
    { z: '哥', py: 'gē', bs: '口', bh: 10 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
