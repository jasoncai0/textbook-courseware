'use strict';
/* 孔乙己 · 本课数据与互动：“笑”的串联（点笑看原文）、前后对比（分步）、“大约的确”证据链、揣摩语句翻卡、换视角讲故事 */

/* ---------- “笑”的串联 ---------- */
const LAUGHS = [
  { who: '酒客们', at: '脸上的新伤疤', s: '孔乙己一到店，所有喝酒的人便都看着他笑，有的叫道：“孔乙己，你脸上又添上新伤疤了！”', re: '他不回答，对柜里说：“温两碗酒，要一碟茴香豆。”' },
  { who: '众人', at: '偷书被打，还说“窃书不能算偷”', s: '接连便是难懂的话，什么“君子固穷”，什么“者乎”之类，引得众人都哄笑起来：店内外充满了快活的空气。', re: '涨红了脸，额上的青筋条条绽出，争辩。', pic: 'paichu' },
  { who: '众人', at: '连半个秀才也捞不到', s: '这回可是全是之乎者也之类，一些不懂了。在这时候，众人也都哄笑起来：店内外充满了快活的空气。', re: '立刻显出颓唐不安模样，脸上笼上了一层灰色。' },
  { who: '“我”和掌柜', at: '他的窘迫', s: '在这些时候，我可以附和着笑，掌柜是决不责备的。而且掌柜见了孔乙己，也每每这样问他，引人发笑。', re: '孔乙己自己知道不能和他们谈天，便只好向孩子说话。' },
  { who: '孩子们', at: '他的迂腐、着慌', s: '“不多不多！多乎哉？不多也。”于是这一群孩子都在笑声里走散了。', re: '伸开五指将碟子罩住，弯腰下去说道：“不多了，我已经不多了。”', pic: 'huixiang' },
  { who: '掌柜和众人', at: '被打断的腿', s: '此时已经聚集了几个人，便和掌柜都笑了。……不一会，他喝完酒，便又在旁人的说笑声中，坐着用这手慢慢走去了。', re: '“跌断，跌，跌……”他的眼色，很像恳求掌柜，不要再提。', pic: 'zuolai' },
];

function buildLaugh() {
  document.getElementById('laughLine').innerHTML = LAUGHS.map((l, i) => `<button type="button" class="lg" data-step="${i + 1}" data-i="${i}"><b>笑</b><small>${l.who}</small></button>`).join('');
}
buildLaugh();

function initLaugh() {
  const card = document.getElementById('laughCard');
  const line = document.getElementById('laughLine');
  line.addEventListener('click', (e) => {
    const b = e.target.closest('.lg');
    if (!b) return;
    document.querySelectorAll('.lg').forEach((x) => x.classList.toggle('sel', x === b));
    const l = LAUGHS[+b.dataset.i];
    card.innerHTML = `${l.pic ? `<i class="lc-pic" style="background-image:url(assets/${l.pic}.jpg)"></i>` : ''}<div><p class="lc-s">${l.s}</p>
      <p><em>谁在笑</em>${l.who}　<em>笑什么</em>${l.at}</p><p><em>孔乙己</em>${l.re}</p></div>`;
  });
}

/* ---------- “大约的确”：证据链 ---------- */
const EVIDENCE = [
  '“他打折了腿了。”“……谁晓得？许是死了。”',
  '见他满手是泥，原来他便用这手走来的。',
  '到第二年的端午，又说：“孔乙己还欠十九个钱呢！”',
  '到中秋可是没有说，再到年关也没有看见他。',
];

function initDayue() {
  const list = document.getElementById('evList');
  list.innerHTML = EVIDENCE.map((t) => `<button type="button" class="ev">${t}</button>`).join('');
  const colA = document.getElementById('dyColA');
  const colB = document.getElementById('dyColB');
  const end = document.getElementById('dyEnd');
  document.getElementById('dyA').addEventListener('click', (e) => { e.target.classList.add('on'); colA.classList.add('open'); });
  document.getElementById('dyB').addEventListener('click', (e) => { e.target.classList.add('on'); colB.classList.add('open'); });
  list.addEventListener('click', (e) => {
    const ev = e.target.closest('.ev');
    if (!ev) return;
    ev.classList.add('lit');
    end.classList.toggle('open', list.querySelectorAll('.ev.lit').length === EVIDENCE.length);
  });
}

/* ---------- 揣摩语句 ---------- */
const CLUES = [
  { q: '他们便接着说道：“你怎的连半个秀才也捞不到呢？”', a: '“捞”：随手就能得到的意思——连这样容易的东西都得不到。口吻轻蔑、嘲弄，专揭他的伤疤。' },
  { q: '孔乙己立刻显出颓唐不安模样，脸上笼上了一层灰色……', a: '“笼”：像一层灰色罩住了整张脸。没考上秀才是他最痛的地方，被戳中后羞愧、颓丧，又无法掩饰。' },
  { q: '掌柜也不再问，仍然慢慢的算他的账。', a: '听说孔乙己被打折了腿、“许是死了”，掌柜毫不在意，照样算账——他只关心那十九个钱。冷漠到了极点。' },
  { q: '孔乙己是这样的使人快活，可是没有他，别人也便这么过。', a: '孔乙己只是众人取乐的对象，有他多几声笑，没他也无所谓——他在人们心中没有任何分量。' },
];

const MOMENTS = [
  {
    name: '孔乙己讲', pic: 'zuolai',
    prompt: '用孔乙己的口吻，讲一讲他最后一次来到咸亨酒店。',
    hint: '想一想：他心里怎么看自己的“长衫”和“读书人”身份？被取笑时他在想什么？',
    example: '我是用这双手“走”到咸亨的。我不想让人看见我这副样子，可那一碗酒……我只说了一句“温一碗酒”。掌柜还是那句话：“你又偷了东西了！”我说是跌断的。他们又笑了。我只好喝完酒，在笑声里慢慢地挪回去。',
  },
  {
    name: '掌柜讲', pic: 'xianheng',
    prompt: '用掌柜的口吻，讲一讲他眼里的孔乙己。',
    hint: '掌柜最在乎什么？他会怎么提到“十九个钱”？',
    example: '那个孔乙己，倒是从不拖欠，就是又穷又酸。他一来，店里就热闹，我也跟着问几句，引大家笑笑。后来听说他腿被打折了，还欠着十九个钱呢。年关、端午我都记着……再后来，也就不记了。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['读这一句', '揣摩'], moments: MOMENTS });
    initLaugh();
    initDayue();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
