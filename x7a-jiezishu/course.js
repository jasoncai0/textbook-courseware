'use strict';
/* 诫子书 · 本课数据。诗文模板（横排 + 译文）见 ../shared/poem.js；本课独有：静—俭—志—学关系链、点空隙划节奏 */

const LINES = [
  { t: '夫君子之行，静以修身，俭以养德。', r: '夫/君子之行，静/以修身，俭/以养德。', y: '品德高尚的人，依靠内心宁静来修养身心，依靠节俭来培养品德。' },
  { t: '非淡泊无以明志，非宁静无以致远。', r: '非淡泊/无以明志，非宁静/无以致远。', y: '不恬淡寡欲就无法明确志向，不宁静专一就无法达到远大目标。' },
  { t: '夫学须静也，才须学也，非学无以广才，非志无以成学。', r: '夫学/须静也，才/须学也，非学/无以广才，非志/无以成学。', y: '学习必须宁静专一，才干必须通过学习获得。不学习就无法增长才干，没有志向就无法使学业有所成就。' },
  { t: '淫慢则不能励精，险躁则不能治性。', r: '淫慢/则不能励精，险躁/则不能治性。', y: '放纵懈怠就不能振奋精神，轻薄浮躁就不能修养性情。' },
  { t: '年与时驰，意与日去，遂成枯落，多不接世，悲守穷庐，将复何及！', r: '年/与时驰，意/与日去，遂成/枯落，多不/接世，悲守/穷庐，将复/何及！', y: '年纪随着时光飞逝，意志随着岁月消磨，最终像枯叶一样凋落，大多对社会没有任何贡献，只能悲哀地守着穷困的破屋，那时再后悔又怎么来得及！' },
];

const POEMS = {
  jzs: {
    title: '诫子书', author: '诸葛亮', layout: 'h', lines: LINES,
    notes: {
      夫: '助词，用于句首，表示发端（读 fú）', 静: '屏除杂念和干扰，宁静专一', 以: '连词，表示后者是前者的目的',
      淡泊: '内心恬淡，不慕名利', 无以: '没有什么可以拿来，没办法', 明志: '明确志向。明，明确、坚定', 致远: '达到远大目标。致，达到',
      广: '增长', 淫慢: '放纵懈怠（“淫”读 yín）', 励精: '振奋精神', 险躁: '轻薄浮躁，与上文“宁静”相对', 治性: '修养性情',
      驰: '疾行，指迅速逝去（年与时驰：年纪随同时光而疾速逝去）', 去: '意与日去：意志随同岁月而丧失', 枯落: '凋落，衰残。比喻人年老志衰，没有用处',
      接世: '多不接世：大多对社会没有任何贡献', 穷庐: '穷困潦倒之人住的陋室', 何及: '将复何及：又怎么来得及',
    },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* ---------- 积累拓展四：点空隙划节奏 ---------- */
const RHYTHM = [LINES[0].r, LINES[1].r, LINES[3].r, LINES[4].r];
const PUNCT = /[，。！？；：]/;

function rhythmHtml(r, i) {
  const chars = [];
  const cuts = new Set();
  [...r].forEach((ch) => { if (ch === '/') cuts.add(chars.length); else chars.push(ch); });
  let html = '';
  chars.forEach((ch, k) => {
    const prevOk = k > 0 && !PUNCT.test(chars[k - 1]) && !PUNCT.test(ch);
    if (prevOk) html += `<button type="button" class="gap" data-k="${k}" data-ans="${cuts.has(k) ? 1 : 0}" aria-label="在这里划节奏"></button>`;
    html += `<span>${ch}</span>`;
  });
  return `<p class="rh-line" data-i="${i}"><b>${i + 1}.</b>${html}</p>`;
}

function initRhythm() {
  const box = document.getElementById('rhythm');
  const res = document.getElementById('rhRes');
  box.innerHTML = RHYTHM.map(rhythmHtml).join('');
  box.addEventListener('click', (e) => {
    const g = e.target.closest('.gap');
    if (!g) return;
    g.classList.toggle('cut');
    box.classList.remove('checked');
  });
  document.getElementById('rhCheck').addEventListener('click', () => {
    let right = 0;
    let total = 0;
    box.querySelectorAll('.gap').forEach((g) => {
      const ans = g.dataset.ans === '1';
      const cut = g.classList.contains('cut');
      if (ans) total += 1;
      if (ans && cut) right += 1;
      g.classList.toggle('miss', ans && !cut);
      g.classList.toggle('extra', !ans && cut);
    });
    box.classList.add('checked');
    res.textContent = `划对 ${right} / ${total} 处。橙色虚线是漏掉的，红色是多划的。`;
  });
  document.getElementById('rhShow').addEventListener('click', () => {
    box.querySelectorAll('.gap').forEach((g) => { g.classList.toggle('cut', g.dataset.ans === '1'); g.classList.remove('miss', 'extra'); });
    res.textContent = '参考划分：句首发语词“夫”后停；“非……/无以……”“……/则不能……”；四字短句二二分。';
  });
}

/* ---------- 字词板：点词看释义 ---------- */
function initWordBoard() {
  document.querySelector('.wb').addEventListener('click', (e) => {
    const w = e.target.closest('.wb-w');
    if (w) w.classList.toggle('open');
  });
}

const MOMENTS = [
  {
    name: '写给自己的“诫己书”', pic: 'caolu',
    prompt: '学诸葛亮，给自己写一段“诫己书”：提醒自己在学习上要做到什么、避免什么。',
    hint: '可以学课文的句式：“非……无以……”“……则不能……”；正反对照，简洁有力。',
    example: '学须专也，功须勤也。非专心无以成学，非恒心无以致远。贪玩则不能进步，浮躁则不能深思。时光易逝，莫待白头方悔。',
  },
  {
    name: '父母的叮嘱', pic: 'shuxin',
    prompt: '你的父母或长辈对你说过哪些叮嘱？和《诫子书》比一比。',
    hint: '想一想：叮嘱背后是怎样的期望和爱？',
    example: '妈妈常说：“做作业时手机放远一点。”这不就是“学须静也”吗……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    Poem.init();
    initRhythm();
    initWordBoard();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
