'use strict';
/* 怀疑与学问 · 本课数据与互动：论证链 + 方法印章、四个“常常”排序、名言卡、读写迁移。通用部分见 ../shared/narrative.js */

const METHODS = ['引用论证', '举例论证', '道理论证', '对比论证', '假设论证'];

/* 两个分论点下的论据（t 为课本原文）；m：论证方法（可多选其一） */
const EVIDENCE = [
  [
    { n: '口头消息与亲身视察', m: ['举例论证'], t: '譬如在国难危急的时候，各地一定有许多口头的消息，说得如何凶险，那便是别人的传说，不一定可靠；要知道实际的情形，只有靠自己亲身视察。' },
    { n: '三皇、五帝；腐草为萤', m: ['举例论证'], t: '我们听说中国古代有三皇、五帝，便要问问：这是谁说的话？最先见于何书？' },
    { n: '怀疑—思索—辨别', m: ['道理论证'], t: '经过“怀疑”“思索”“辨别”三步以后，那本书才是自己的书，那种学问才是自己的学问。否则便是盲从，便是迷信。' },
    { n: '孟子“尽信书则不如无书”', m: ['引用论证'], t: '孟子所谓“尽信书则不如无书”，也就是教我们有一点怀疑的精神，不要随便盲从或迷信。' },
  ],
  [
    { n: '懒惰的脑筋与发问的脑筋', m: ['对比论证', '道理论证'], t: '对于别人的话，都不打折扣地承认，那是思想上的懒惰。这样的脑筋永远是被动的，永远不能治学。只有常常怀疑、常常发问的脑筋才有问题，有问题才想求解答。' },
    { n: '戴震幼时发问', m: ['举例论证'], t: '他便问宋代的人如何能知道一千多年前的著者的意思。' },
    { n: '笛卡儿“我怀疑，所以我存在”', m: ['引用论证'], t: '法国的大哲学家笛卡儿也说：“我怀疑，所以我存在。”他的哲学就建立在对于万事万物的怀疑和明辨上。' },
    { n: '若使后之学者都墨守旧说', m: ['假设论证'], t: '若使后之学者都墨守前人的旧说，那就没有新问题，没有新发明，一切学术停滞，人类的文化也就不会进步了。' },
  ],
];

function initChain() {
  const detail = document.getElementById('chDetail');
  let stamp = null;
  document.getElementById('stamps').innerHTML = METHODS.map((m) => `<button type="button" class="stamp" data-m="${m}">${m}</button>`).join('');
  document.querySelectorAll('.ch-evs').forEach((box) => {
    const b = +box.dataset.b;
    box.innerHTML = EVIDENCE[b].map((e, i) => `<button type="button" class="ch-ev" data-b="${b}" data-i="${i}"><span>${e.n}</span><em>？</em></button>`).join('');
  });
  document.getElementById('chain').addEventListener('click', (e) => {
    const s = e.target.closest('.stamp');
    if (s) {
      stamp = s.dataset.m;
      document.querySelectorAll('.stamp').forEach((x) => x.classList.toggle('cur', x === s));
      detail.textContent = `已拿起“${stamp}”印章，点一条论据盖上去。`;
      return;
    }
    const c = e.target.closest('.ch-ev');
    if (!c) return;
    const ev = EVIDENCE[+c.dataset.b][+c.dataset.i];
    if (c.classList.contains('ok') || !stamp) {
      detail.innerHTML = c.classList.contains('ok') ? `<i>${c.dataset.got}</i>${ev.t}` : '先在下面选一枚印章。';
      return;
    }
    if (ev.m.includes(stamp)) {
      c.classList.add('ok');
      c.dataset.got = stamp;
      c.querySelector('em').textContent = stamp;
      detail.innerHTML = `<i>${stamp}</i>${ev.t}`;
    } else {
      c.classList.remove('no');
      void c.offsetWidth; // 重新触发抖动动画
      c.classList.add('no');
      detail.textContent = `“${ev.n}”用的不是${stamp}，再想想。`;
    }
  });
}

/* 积累拓展三：四个“常常”按顺序点 */
const ORDER = ['常常要抱怀疑的态度', '常常和书中的学说辩论', '常常评判书中的学说', '常常修正书中的学说'];
const SHUFFLED = [2, 0, 3, 1];

function initOrder() {
  const box = document.getElementById('order');
  const out = document.getElementById('orderOut');
  const msg = document.getElementById('orderMsg');
  let next = 0;
  const reset = () => {
    next = 0;
    box.innerHTML = SHUFFLED.map((k) => `<button type="button" class="ord" data-k="${k}">${ORDER[k]}</button>`).join('');
    out.innerHTML = '';
    msg.hidden = true;
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.ord');
    if (!b || b.disabled) return;
    if (+b.dataset.k === next) {
      b.disabled = true;
      out.insertAdjacentHTML('beforeend', `<span>${next + 1}　${ORDER[next]}</span>`);
      next += 1;
      if (next === ORDER.length) msg.hidden = false;
    } else {
      b.classList.remove('no');
      void b.offsetWidth;
      b.classList.add('no');
    }
  });
  document.getElementById('orderReset').addEventListener('click', reset);
  reset();
}

const CLUES = [
  { q: '“学者先要会疑。”——程颐', a: '求学的人首先要学会提出疑问。课文开篇引用，开门见山。' },
  { q: '“在可疑而不疑者，不曾学；学则须疑。”——张载', a: '该怀疑却不怀疑，就等于没有学；要学习就必须有疑问。' },
  { q: '“尽信书则不如无书。”——孟子', a: '完全相信书本，还不如没有书。教我们不要盲从、迷信书本。' },
  { q: '“我怀疑，所以我存在。”——笛卡儿', a: '怀疑和思考是人存在的证明；他的哲学建立在对万事万物的怀疑和明辨上。' },
  { q: '“学而不思则罔，思而不学则殆。”——《论语》', a: '（课外）只读书不思考就会迷惑，只空想不读书就会疑惑不定。' },
  { q: '“学贵知疑，小疑则小进，大疑则大进。”——陈献章', a: '（课外）学习贵在能发现疑问，疑问越大，进步越大。' },
];

const MOMENTS = [
  {
    name: '论证：不要盲从', pic: 'shuzhai',
    prompt: '论证“做学问不要盲从或迷信，要有怀疑的精神”。200 字左右。',
    hint: '亮出观点 → 一个事例或名言 → 分析材料为什么能证明观点（“可见”“正因为……所以……”）。',
    example: '做学问不能盲从，要有怀疑的精神。伽利略之前，人们都相信亚里士多德“重的物体下落得快”的说法。伽利略却没有盲从，他想：如果把一重一轻两个物体绑在一起，结果该快还是该慢？正是这一怀疑，让他通过实验推翻了流传近两千年的旧说。可见，书本和权威并非不会出错，只有经过自己的怀疑、思索和辨别，学问才能真正成为自己的学问。',
  },
  {
    name: '生活中的“腐草为萤”', pic: 'yinghuo',
    prompt: '生活中有哪些流传很广、却经不起追问的说法？挑一个，像课文一样连续追问几句。',
    hint: '用“这是谁说的？有什么根据？……”这样一连串的问题，最后得出你的判断。',
    example: '有人说“吃什么补什么”。这是谁说的话？有什么科学根据？猪脑里的营养真能跑进人的大脑吗？查了资料才知道，食物被消化后都会分解成营养物质，并不会“对号入座”。这样一追问，这个说法便不攻自破了。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['名言', '意思'], moments: MOMENTS });
    initChain();
    initOrder();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
