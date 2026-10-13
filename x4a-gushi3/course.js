'use strict';
/* 故事二则 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 扁鹊治病 · 病一步步往里走（r 为病点所在的半径，对应 SVG 里的四层） */
const BING = [
  { r: 140, where: '皮肤上', bq: '“您皮肤上有点儿小病。”', hou: '“我的身体很好，什么病也没有。”', zhi: '用热敷就能够治好', ok: true },
  { r: 97, where: '皮肉之间', bq: '“您的病已经发展到皮肉之间了。”', hou: '很不高兴，没有理睬他', zhi: '用扎针的方法可以治好', ok: true },
  { r: 56, where: '肠胃里', bq: '“您的病已经发展到肠胃里。”', hou: '非常不高兴', zhi: '服几剂汤药也还能治好', ok: true },
  { r: 0, where: '骨髓', bq: '老远望见，只看了几眼，就掉头跑了', hou: '觉得奇怪，派人去问', zhi: '只能等死，医生再也无能为力了', ok: false },
  { r: 0, where: '骨髓', bq: '几天前就跑到秦国去了', hou: '浑身疼痛，派人去请扁鹊——不久，病死了', zhi: '已经来不及了', ok: false },
];

function initBing(items) {
  const svg = document.getElementById('bingSvg');
  const dot = document.getElementById('bingDot');
  const card = document.getElementById('bingCard');
  const show = (k) => {
    const it = items[k];
    svg.setAttribute('class', `lv-${Math.min(k, 3)}`);
    dot.style.cx = `${-it.r}px`;
    dot.style.cy = it.r ? '0px' : '-14px';
    card.innerHTML = `<p><b>病在：</b>${it.where}</p><p><b>扁鹊：</b>${it.bq}</p><p><b>蔡桓侯：</b>${it.hou}</p>
      <p class="${it.ok ? 'can' : 'cannot'}"><b>还能治吗？</b>${it.zhi}</p>`;
    document.querySelectorAll('.bing-btns .btn').forEach((b) => b.classList.toggle('solid', +b.dataset.k === k));
  };
  document.querySelector('.bing-btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (b) show(+b.dataset.k);
  });
  show(0);
}

/* 纪昌学射 · 排一排（n 为正确顺序，按打乱后的顺序显示） */
const ORDER = [
  { n: 3, t: '盯着窗口的虱子，看得像车轮一样大' },
  { n: 1, t: '去向射箭能手飞卫请教' },
  { n: 5, t: '成了百发百中的射箭能手' },
  { n: 2, t: '躺在织布机下面，盯着踏板不眨眼' },
  { n: 4, t: '飞卫开始教他开弓、放箭' },
];

function initOrder(box, items) {
  let next = 1;
  const render = () => {
    next = 1;
    box.classList.remove('done');
    box.innerHTML = items.map((it, i) => `<button class="ord-card" type="button" data-i="${i}"><b class="ord-n"></b><span class="ord-t">${it.t}</span></button>`).join('');
  };
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.ord-card');
    if (!card || card.classList.contains('right')) return;
    const it = items[+card.dataset.i];
    card.classList.remove('wrong');
    void card.offsetWidth; // 重新触发抖动动画
    if (it.n === next) {
      card.classList.add('right');
      card.querySelector('.ord-n').textContent = next;
      next += 1;
      box.classList.toggle('done', next > items.length);
    } else {
      card.classList.add('wrong');
    }
  });
  document.getElementById('orderReset').addEventListener('click', render);
  render();
}

/* 简要复述 · 删去细节：cut 为可以删去的细节 */
const RETELL = [
  {
    parts: [
      { t: '有一天，名医扁鹊拜见蔡桓侯，说他皮肤上有点儿小病，蔡桓侯不信。' },
      { t: '扁鹊走后，蔡桓侯还对左右的人说，做医生的总喜欢给没有病的人治病，好显示自己的高明。', cut: true },
      { t: '过了十天，扁鹊说病已经到了皮肉之间，蔡桓侯不理睬他。' },
      { t: '十天后，扁鹊说病已经到了肠胃里，蔡桓侯非常不高兴。' },
      { t: '又过了十天，扁鹊老远望见蔡桓侯，掉头就跑，' },
      { t: '蔡桓侯派人去问，扁鹊解释说，病在皮肤上用热敷，在皮肉之间用扎针，在肠胃里服汤药，都还能治好；', cut: true },
      { t: '现在病已经深入骨髓，医生也无能为力了。' },
      { t: '五天之后，蔡桓侯浑身疼痛，派人去请扁鹊，扁鹊已经跑到秦国去了。不久，蔡桓侯病死了。' },
    ],
  },
  {
    parts: [
      { t: '纪昌想学射箭，去向射箭能手飞卫请教。' },
      { t: '飞卫让他先练眼力，盯住目标不能眨眼。' },
      { t: '妻子织布的时候，他躺在织布机下面，睁大眼睛，死死盯住织布机的踏板。', cut: true },
      { t: '两年以后，锥尖要刺到眼角了，他也不眨一下眼。' },
      { t: '飞卫又要他练到把极小的东西看得很大。' },
      { t: '他用一根牛尾毛拴住一只虱子，吊在窗口，每天站在旁边盯着看。', cut: true },
      { t: '练到后来，小虱子在他眼里大得像车轮一样。' },
      { t: '纪昌赶紧跑去报告好消息，飞卫高兴地说：“你就要成功了！”', cut: true },
      { t: '于是飞卫教他开弓放箭。后来，纪昌成了百发百中的射箭能手。' },
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
    document.querySelectorAll('.retell-tabs [data-part]').forEach((b) => b.classList.toggle('solid', +b.dataset.part === k));
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

/* 明白的道理 */
const CLUE_LABELS = ['想一想', '我的理解'];
const CLUES = [
  { q: '蔡桓侯为什么会病死？', a: '有病不肯承认，不听扁鹊的劝告，小病一拖再拖，拖成了治不好的大病。' },
  { q: '从《扁鹊治病》中，我明白了……', a: '有了病要及早医治，有了缺点、错误要及早改正；别人说得对，要虚心听取。' },
  { q: '纪昌为什么能成为射箭能手？', a: '他听老师的话，先下苦功练好眼力这个基本功，一练就是好几年，从不放弃。' },
  { q: '从《纪昌学射》中，我明白了……', a: '学本领要先打好基础，一步一步来，还要持之以恒。' },
];

/* 讲故事 */
const MOMENTS = [
  {
    name: '讲《扁鹊治病》', pic: 'bianque',
    prompt: '借顺序词，简要地讲讲《扁鹊治病》。',
    hint: '有一天 → 过了十天 → 十天后 → 又过了十天 → 五天之后 → 不久。每次见面讲一句话就够了。',
    example: '有一天，扁鹊拜见蔡桓侯，说他皮肤上有点儿小病，蔡桓侯不信。过了十天，扁鹊说病到了皮肉之间，蔡桓侯不理他。十天后，扁鹊说病到了肠胃里，蔡桓侯很不高兴。又过了十天，扁鹊一看见蔡桓侯掉头就跑，因为病已经深入骨髓，治不好了。五天之后，蔡桓侯浑身疼痛，派人去请扁鹊，扁鹊早已跑到秦国。不久，蔡桓侯就病死了。',
  },
  {
    name: '讲《纪昌学射》', pic: 'zhibu',
    prompt: '借顺序词，简要地讲讲《纪昌学射》。',
    hint: '开始练习的时候 → 两年以后 → 练到后来 → 于是 → 后来。抓住两次练眼力。',
    example: '纪昌向飞卫学射箭。开始练习的时候，飞卫让他先练眼力，他就躺在织布机下盯着踏板，两年以后，锥尖刺到眼角他都不眨眼。飞卫又让他练把小的看大，他就盯着吊在窗口的虱子看，练到后来，虱子大得像车轮。于是，飞卫开始教他开弓放箭。后来，纪昌成了百发百中的射箭能手。',
  },
  {
    name: '假如蔡桓侯听了劝', pic: 'shizi',
    prompt: '假如蔡桓侯第一次就听了扁鹊的话，故事会怎样？',
    hint: '想一想：病在皮肤上时，用什么方法就能治好？',
    example: '蔡桓侯听了扁鹊的话，连忙说：“请先生帮我治一治。”扁鹊给他热敷了几次，小病很快就好了。蔡桓侯高兴地说：“幸亏我听了你的劝告！”',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initBing(BING);
    initOrder(document.getElementById('order'), ORDER);
    initRetell(RETELL);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
