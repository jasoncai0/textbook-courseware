'use strict';
/* 驱遣我们的想象 · 本课数据。读与写见 ../shared/narrative.js；
 * 本课独有：“想象工作台”——选一句诗，逐词点亮 SVG 画面图层（大漠、长河、孤烟、直、落日、圆……），并显示由此生出的印象 */

const POEMS = [
  {
    t: '大漠孤烟直，长河落日圆', from: '王维《使至塞上》 · 课文示范',
    words: [
      { w: '大漠', on: ['damo'], n: '一片无边的沙漠——北方旷远的大地。' },
      { w: '长河', on: ['changhe'], n: '一条长河横在大漠尽头。' },
      { w: '孤烟', on: ['guyan'], n: '只有一缕烟——“孤”，四周再没有别的。' },
      { w: '直', on: ['zhi'], need: 'guyan', n: '给“孤烟”加上个“直”字：见得没有一丝的风，当然也没有风声——静寂。' },
      { w: '落日', on: ['luori'], n: '一轮落日。' },
      { w: '圆', on: ['yuan'], need: 'luori', n: '不是说唯有落日才圆，而是落日挂在地平线上的时候才见得“圆”——不声不响地衬托在长河背后。' },
    ],
    imp: [
      { need: ['damo', 'changhe', 'guyan', 'luori'], t: '旷远 · 荒凉' },
      { need: ['zhi'], t: '没有风，没有风声' },
      { need: ['yuan'], t: '静寂' },
      { need: ['zhi', 'yuan'], t: '一“直”一“圆”，简单的线条，构成通体的一致' },
    ],
    literal: '大漠上也许有几处地方聚集着人，难道不会有几缕的炊烟吗？假使起了风，烟不就曲折了吗？落日固然是圆的，难道朝阳就不圆吗？——这样地提问，似乎是在研究，在考察，可是也领会不到这两句诗的意思。',
  },
  {
    t: '孤帆远影碧空尽，唯见长江天际流', from: '李白《黄鹤楼送孟浩然之广陵》 · 自己试试',
    words: [
      { w: '长江', on: ['changjiang'], n: '浩浩荡荡的长江。' },
      { w: '孤帆', on: ['gufan'], n: '江上只有一只船——朋友就在船上。' },
      { w: '远影', on: ['yuanying'], need: 'gufan', n: '帆越来越远，只剩一个影子。' },
      { w: '碧空', on: ['bikong'], n: '水天相接处，一片碧蓝的天空。' },
      { w: '尽', on: ['jin'], need: 'gufan', n: '帆消失在天边了——可送别的人还没走。' },
      { w: '天际流', on: ['tianji'], n: '只看见江水流向天边……心也随着帆和流水去了。' },
    ],
    imp: [
      { need: ['changjiang', 'gufan'], t: '辽阔 · 孤单' },
      { need: ['jin'], t: '帆已不见，人还在望——久久伫立' },
      { need: ['jin', 'tianji'], t: '惜别的惆怅：情寓于景' },
    ],
    literal: '只按字面：一只帆船越走越远，看不见了，江水向天边流去——这有什么意思呢？可若驱遣想象，就会问：是谁一直望到帆影消失？他为什么不走？',
    always: ['louge'],
  },
];

const MOMENTS = [
  {
    name: '赏一句诗', pic: 'damo',
    prompt: '学叶圣陶的示范，驱遣想象赏析一句诗：“野旷天低树，江清月近人。”（孟浩然《宿建德江》）',
    hint: '①在想象中睁开眼睛：选了哪几样景物？②哪几个字最关键（“低”“近”）？③由此产生什么印象和情感？',
    example: '原野空旷，远处的天空好像比树还低；江水清澈，倒映的月亮仿佛就在身边。“低”写出原野的辽阔，“近”写出月与人的亲近——四野茫茫，能亲近的只有一轮水中月，旅人的孤寂就在这“近”字里。',
  },
  {
    name: '一段文字，一幅画', pic: 'haiyan',
    prompt: '选一段你喜欢的写景文字（课文或课外），用“我仿佛看见……仿佛听见……仿佛体会到……”写下你的想象。',
    hint: '不要只翻译字面，要补出画面里的颜色、声音、动作，以及你的感受。',
    example: '读“乱花渐欲迷人眼，浅草才能没马蹄”，我仿佛看见湖堤上红的、粉的、白的花开成一片，晃得人眼花；仿佛听见马蹄踩在嫩草上沙沙的轻响；仿佛体会到诗人骑马慢行、舍不得走的那份喜悦。',
  },
];

/* ============ 想象工作台 ============ */
let benchPoem = 0;
let benchLit = new Set();

function renderBench() {
  const p = POEMS[benchPoem];
  const $ = (id) => document.getElementById(id);
  document.querySelectorAll('.xx-svg').forEach((svg) => {
    const show = +svg.dataset.p === benchPoem;
    svg.classList.toggle('show', show);
    if (!show) return;
    const all = new Set([...benchLit, ...(p.always || [])]);
    svg.setAttribute('class', `xx-svg show ${[...all].map((k) => `on-${k}`).join(' ')}`);
  });
  $('xxWords').innerHTML = p.words.map((w, i) => {
    const on = w.on.every((k) => benchLit.has(k));
    const locked = w.need && !benchLit.has(w.need);
    return `<button type="button" class="xw${on ? ' on' : ''}${locked ? ' locked' : ''}" data-i="${i}">${w.w}</button>`;
  }).join('');
  const imps = p.imp.filter((m) => m.need.every((k) => benchLit.has(k)));
  $('xxImp').innerHTML = imps.map((m) => `<span>${m.t}</span>`).join('');
  document.querySelectorAll('#xxPoems .btn').forEach((b, i) => b.classList.toggle('solid', i === benchPoem));
  $('xxLitText').textContent = p.literal;
}

function initBench() {
  const $ = (id) => document.getElementById(id);
  $('xxPoems').innerHTML = POEMS.map((p, i) => `<button type="button" class="btn" data-p="${i}"><b>${p.t}</b><small>${p.from}</small></button>`).join('');
  $('xxPoems').addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b) return;
    benchPoem = +b.dataset.p;
    benchLit = new Set();
    $('xxNote').textContent = '点上面的词，把它“放”进画面。';
    $('xxLitText').hidden = true;
    renderBench();
  });
  $('xxWords').addEventListener('click', (e) => {
    const b = e.target.closest('.xw');
    if (!b) return;
    const w = POEMS[benchPoem].words[+b.dataset.i];
    if (w.need && !benchLit.has(w.need)) {
      $('xxNote').textContent = `先放“${POEMS[benchPoem].words.find((x) => x.on.includes(w.need)).w}”，再给它加上“${w.w}”。`;
      return;
    }
    const has = w.on.every((k) => benchLit.has(k));
    w.on.forEach((k) => (has ? benchLit.delete(k) : benchLit.add(k)));
    // 去掉某个词时，依赖它的修饰词一起去掉
    if (has) POEMS[benchPoem].words.filter((x) => x.need && w.on.includes(x.need)).forEach((x) => x.on.forEach((k) => benchLit.delete(k)));
    $('xxNote').innerHTML = has ? '已拿掉。' : `<b>${w.w}：</b>${w.n}`;
    renderBench();
  });
  $('xxLit').addEventListener('click', () => { $('xxLitText').hidden = !$('xxLitText').hidden; });
  renderBench();
}

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initBench();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
  },
};
