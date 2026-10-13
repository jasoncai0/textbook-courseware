'use strict';
/* 谁是最可爱的人 · 本课独有的“事例 + 抒情议论”结构图、叙述与引用对照、抒情工具高亮。通用部分见 ../shared/narrative.js */

/* kind：view 观点 / case 事例 / lyric 抒情议论；q：对应开头四个“那样地”中的哪几项 */
const FLOW = [
  { kind: 'view', t: '开头 · 提出观点', s: '谁是我们最可爱的人呢？我们的战士，我感到他们是最可爱的人。', say: '开门见山。紧接着用四个“那样地”概括战士的品质、意志、气质、胸怀——全文的“纲”。', q: [0, 1, 2, 3] },
  { kind: 'case', t: '事例一 · 松骨峰战斗', s: '勇士们……把枪一摔，向敌人扑去，身上帽子上呼呼地冒着火苗……', say: '对敌人“狠”：英勇顽强，视死如归。', q: [1] },
  { kind: 'lyric', t: '抒情议论', s: '你不觉得我们的战士是可爱的吗？', say: '用反问把读者拉进来；接着一句过渡：“对敌人这样狠，而对朝鲜人民却是那样地爱”。', q: [] },
  { kind: 'case', t: '事例二 · 马玉祥火中救孩子', s: '“朝鲜人民和我们祖国的人民不是一样的吗？”', say: '对人民“爱”：国际主义的深厚热情。', q: [3] },
  { kind: 'lyric', t: '抒情议论', s: '你不觉得我们的战士是最可爱的人吗？', say: '注意：第一次是“可爱的”，这一次是“最可爱的人”——感情层层加深。', q: [] },
  { kind: 'case', t: '事例三 · 防空洞里吃雪', s: '“我在这里吃雪，正是为了我们祖国的人民不吃雪。”', say: '对祖国“忠”：乐观，甘愿吃苦，不图回报。', q: [0, 2] },
  { kind: 'lyric', t: '结尾 · 抒情总结', s: '他们确实是我们最可爱的人！', say: '“当你……的时候”一连串排比，把读者的幸福生活和战士的牺牲联系起来，回扣题目。', q: [0, 1, 2, 3] },
];
const KIND_NAME = { view: '观点', case: '事例', lyric: '抒情议论' };

// 必须在 deck.js 统计分步之前生成
document.getElementById('flow').innerHTML = FLOW.map((f, i) => `<button type="button" class="fl fl-${f.kind}" data-step="${i + 1}" data-i="${i}">
  <small>${KIND_NAME[f.kind]}</small><b>${f.t}</b></button>`).join('');

function showFlow(i) {
  const f = FLOW[i];
  document.querySelectorAll('#flow .fl').forEach((n, k) => n.classList.toggle('cur', k === i));
  document.querySelectorAll('#quals .qual').forEach((q) => q.classList.toggle('lit', f.q.includes(+q.dataset.q)));
  document.getElementById('flowSay').innerHTML = `<blockquote>${f.s}</blockquote><p>${f.say}</p>`;
}

function initVoice() {
  const tools = document.querySelector('.voice-tools');
  tools.addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    tools.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    const box = document.getElementById('voice');
    box.classList.toggle('only-nar', b.dataset.v === 'nar');
    box.classList.toggle('only-say', b.dataset.v === 'say');
  });
}

const LYRIC_SAY = {
  p2: '<b>第二人称：</b>“朋友”“你”——像面对面谈心，读者不再是旁观者，感情直接传递过去。',
  pb: '<b>排比：</b>六个“当你……的时候”，把工厂、田野、学校、办公室、家庭里平常的幸福一幕幕排开，气势充沛；前一段“我们以……而骄傲，我们以……而自豪”也是排比。',
  wen: '<b>问句：</b>“你是否意识到你是在幸福之中呢？”——引人思考：这份平常的幸福是谁换来的？',
  tan: '<b>感叹：</b>“优秀之花！”“祖国之花！”“他们确实是我们最可爱的人！”——感情喷薄而出，直接抒情。',
};

function initLyric() {
  const box = document.getElementById('lyric');
  document.querySelector('.lyric-tools').addEventListener('click', (e) => {
    const b = e.target.closest('[data-l]');
    if (!b) return;
    const k = b.dataset.l;
    const on = !box.classList.contains(`show-${k}`);
    Object.keys(LYRIC_SAY).forEach((x) => box.classList.remove(`show-${x}`));
    document.querySelectorAll('.lyric-tools .btn').forEach((x) => x.classList.toggle('solid', on && x === b));
    if (on) box.classList.add(`show-${k}`);
    document.getElementById('lyricSay').innerHTML = on ? LYRIC_SAY[k] : '点上面的按钮，看看课文用了哪些“抒情工具”。';
  });
}

const MOMENTS = [
  {
    name: '删一个例子', pic: 'xueling',
    prompt: '找出以前写的一篇写人作文，看看用了几个事例：哪一个最典型？哪一个可以删掉或换掉？写下你的修改思路。',
    hint: '问自己：这几个事例是不是在说同一个方面？能不能各写人物的一个侧面？',
    example: '我写《我的妈妈》用了四件事：做饭、洗衣、接我放学、陪我看病。前三件都在说“辛苦”，重复了。修改：保留“雨夜背我去医院”（最典型），删掉做饭和洗衣，再换一件她坚持自学考证的事，写出妈妈要强的一面。',
  },
  {
    name: '事例后面加一句抒情', pic: 'heping',
    prompt: '学课文：在一个事例后面，用第二人称加一两句抒情议论，把读者拉进来。',
    hint: '可以用“朋友，……你不觉得……吗？”这样的句式。',
    example: '凌晨四点，环卫工人已经把整条街扫得干干净净。朋友，当你踩着清爽的路面走进校门时，你可曾想过，是谁替你赶走了满地的落叶和尘土？',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    document.getElementById('flow').addEventListener('click', (e) => {
      const n = e.target.closest('.fl');
      if (n) showFlow(+n.dataset.i);
    });
    initVoice();
    initLyric();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-frame') && step >= 1) showFlow(Math.min(step, FLOW.length) - 1);
  },
};
