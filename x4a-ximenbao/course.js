'use strict';
/* 西门豹治邺 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 1 题 · 填小标题：fixed 为课本已给出的，opts / ok 为待填的选项和正确答案 */
const FILL = [
  { pic: 'diaocha', opts: ['河神娶亲', '调查民情', '开凿渠道'], ok: ['调查民情'] },
  { pic: 'hebian', opts: ['破除迷信', '送送新娘', '惩治巫婆和官绅'], ok: ['破除迷信', '惩治巫婆和官绅'] },
  { pic: 'shuili', fixed: '兴修水利' },
];

function initFill(box, items) {
  box.innerHTML = items.map((it, i) => `<div class="fill-card">
      <div class="fill-pic" data-bg="assets/${it.pic}.jpg"></div>
      <p class="fill-blank${it.fixed ? ' ok' : ''}">${it.fixed || '（　　　　）'}</p>
      ${it.fixed ? '' : `<div class="fill-opts">${it.opts.map((o) => `<button class="btn" type="button" data-i="${i}" data-o="${o}">${o}</button>`).join('')}</div>`}
    </div>${i < items.length - 1 ? '<i class="fill-arrow">→</i>' : ''}`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-o]');
    if (!b) return;
    const it = items[+b.dataset.i];
    const card = b.closest('.fill-card');
    const blank = card.querySelector('.fill-blank');
    blank.classList.remove('no');
    void blank.offsetWidth; // 重新触发抖动动画
    if (it.ok.includes(b.dataset.o)) {
      blank.textContent = b.dataset.o;
      blank.classList.add('ok');
      card.querySelectorAll('.fill-opts .btn').forEach((x) => x.classList.toggle('solid', x === b));
    } else {
      blank.classList.add('no');
    }
  });
}

/* 简要复述 · 删去细节：cut 为可以删去的细节 */
const RETELL = [
  {
    parts: [
      { t: '西门豹到了邺县，看到田地荒芜，人烟稀少，就找了位老大爷来，问他是怎么回事。' },
      { t: '老大爷说，都是河神娶媳妇给闹的。' },
      { t: '河神每年要娶一个年轻漂亮的姑娘，要不给他送去，漳河就要发大水。', cut: true },
      { t: '原来是巫婆和官绅借这件事硬逼着老百姓出钱，骗钱害人。' },
      { t: '每闹一次，他们要收几百万钱，办喜事只花二三十万，多下来的就分了。', cut: true },
      { t: '有女孩的人家差不多都逃到外地去了。', cut: true },
      { t: '漳河根本没发过大水，倒是年年干旱。', cut: true },
      { t: '西门豹说，下一回河神娶媳妇，他也去送送新娘。' },
    ],
  },
  {
    parts: [
      { t: '到了河神娶媳妇的日子，西门豹带着卫士来到漳河边。' },
      { t: '那巫婆已经七十多岁了，背后跟着十来个穿着绸褂的女徒弟。', cut: true },
      { t: '西门豹说新娘不漂亮，要巫婆去跟河神说一声，叫卫士把巫婆投进了漳河，' },
      { t: '又让官绅的头子去催，也投进了漳河。' },
      { t: '西门豹面对着漳河站了很久，官绅都提心吊胆，大气儿也不敢出。', cut: true },
      { t: '西门豹还要让其他官绅去催，官绅吓得跪下来磕头求饶。' },
      { t: '老百姓都明白了，巫婆和官绅都是骗钱害人的，从此谁也不敢再提给河神娶媳妇。' },
    ],
  },
  {
    parts: [
      { t: '西门豹发动老百姓开凿了十二条渠道，把漳河的水引到田里，' },
      { t: '庄稼得到灌溉，', cut: true },
      { t: '年年都获得好收成。' },
    ],
  },
];

function initRetell(data) {
  const box = document.getElementById('retellText');
  const cutBtn = document.getElementById('retellCut');
  const show = (k) => {
    box.classList.remove('cut');
    cutBtn.textContent = '删去细节';
    box.innerHTML = data[k].parts.map((p) => `<span class="${p.cut ? 'rt-cut' : 'rt-keep'}">${p.t}</span>`).join('');
    document.querySelectorAll('.retell-tabs .btn').forEach((b) => b.classList.toggle('solid', +b.dataset.part === k));
  };
  document.querySelector('.retell-tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-part]');
    if (b) show(+b.dataset.part);
  });
  cutBtn.addEventListener('click', () => {
    const on = box.classList.toggle('cut');
    cutBtn.textContent = on ? '恢复原样' : '删去细节';
  });
  show(0);
}

/* 课后第 2 题 · 西门豹的言行 */
const CLUE_LABELS = ['西门豹的言行', '好在哪里'];
const CLUES = [
  { q: '“不行，这个姑娘不漂亮，河神不会满意的。麻烦你去跟河神说一声……”', a: '顺着巫婆的说法：你不是能替河神办事吗？那就请你亲自去说一声——巫婆有苦说不出。' },
  { q: '“巫婆怎么还不回来，麻烦你去催一催吧。”', a: '接着“装糊涂”，把带头骗钱的官绅头子也惩治了。' },
  { q: '西门豹面对着漳河站了很久。', a: '故意等，让剩下的官绅越等越害怕，只好跪地求饶。' },
  { q: '“起来吧。看样子是河神把他们留下了。你们都回去吧。”', a: '不揭穿，也不多讲，老百姓自己就明白了：根本没有河神娶媳妇这回事！' },
];

/* 选做 · 改编剧本 */
const MOMENTS = [
  {
    name: '河边开场', pic: 'hebian',
    prompt: '接着“阅读链接”的剧本开头往下写。西门豹：什么时候送新娘子啊？老巫：……',
    hint: '人物名后面写台词，括号里写动作、神态。想想老巫会怎么回答，西门豹又怎么接话。',
    example: '西门豹：什么时候送新娘子啊？\n老巫：（得意地）大人，吉时一到，就把新娘送下河去。\n西门豹：先把新娘领来让我看看。\n〔小巫领新娘上，新娘低着头抹眼泪。〕\n西门豹：（摇摇头）不行，这个姑娘不漂亮，河神不会满意的。麻烦你去跟河神说一声……',
  },
  {
    name: '官绅求饶', pic: 'zhanli',
    prompt: '西门豹回过头说：“怎么还不回来，请你们去催催吧！”官绅们会怎么说、怎么做？',
    hint: '用动作和语言写出官绅的害怕：“面如土色”“跪下来磕头求饶”。',
    example: '西门豹：（回过头，慢慢地）怎么还不回来，请你们去催催吧！\n官绅甲：（扑通跪下）大人饶命！大人饶命！\n官绅乙：（浑身发抖）我们再也不敢骗钱了……\n西门豹：好吧，再等一会儿。',
  },
  {
    name: '调查民情', pic: 'diaocha',
    prompt: '把西门豹向老大爷调查的那一段改成剧本。',
    hint: '先写一句舞台说明（时间、地点、谁上场），再写对话。',
    example: '〔邺县田边，野草丛生。西门豹上，老大爷扛着锄头上。〕\n西门豹：老人家，这里的田地怎么这样荒凉？\n老大爷：（叹气）唉，都是河神娶媳妇给闹的……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initFill(document.getElementById('fill'), FILL);
    initRetell(RETELL);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
