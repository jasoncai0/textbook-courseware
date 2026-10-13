'use strict';
/* 纪念白求恩 · 本课数据与本课独有互动：叙—议结构图、对比表格核对、双重否定换说法、词语感情色彩 */

const POEMS = {
  p4: {
    title: '纪念白求恩（第 4 段）', author: '毛泽东',
    lines: [
      { t: '我和白求恩同志只见过一面。后来他给我来过许多信。' },
      { t: '可是因为忙，仅回过他一封信，还不知他收到没有。对于他的死，我是很悲痛的。' },
      { t: '现在大家纪念他，可见他的精神感人之深。' },
      { t: '我们大家要学习他毫无自私自利之心的精神。从这点出发，就可以变为大有利于人民的人。' },
      { t: '一个人能力有大小，但只要有这点精神，就是一个高尚的人，一个纯粹的人，一个有道德的人，一个脱离了低级趣味的人，一个有益于人民的人。' },
    ],
  },
};
Poem.render(POEMS);

const SORT = [
  { s: '白求恩同志是加拿大共产党员，五十多岁了，为了帮助中国的抗日战争……不远万里，来到中国。', ok: ['叙'], q: '交代事实' },
  { s: '这是国际主义的精神，这是共产主义的精神，每一个中国共产党员都要学习这种精神。', ok: ['议'], q: '评价 + 号召' },
  { s: '白求恩同志毫不利己专门利人的精神，表现在他对工作的极端的负责任，对同志对人民的极端的热忱。', ok: ['议'], q: '第 2 段的观点句' },
  { s: '晋察冀边区的军民，凡亲身受过白求恩医生的治疗和亲眼看过白求恩医生的工作的，无不为之感动。', ok: ['叙'], q: '用事实证明' },
  { s: '在整个八路军医务系统中，他的医术是很高明的。', ok: ['叙'], q: '事实：医术高明' },
  { s: '这对于一班见异思迁的人……也是一个极好的教训。', ok: ['议'], q: '由事实引出的评论' },
  { s: '我和白求恩同志只见过一面。后来他给我来过许多信。', ok: ['叙'], q: '叙述交往' },
];

const COLORS = [
  ['高尚', 'bao'], ['纯粹', 'bao'], ['热忱', 'bao'], ['精益求精', 'bao'], ['佩服', 'bao'], ['高明', 'bao'],
  ['狭隘', 'bian'], ['拈轻怕重', 'bian'], ['漠不关心', 'bian'], ['麻木不仁', 'bian'], ['见异思迁', 'bian'], ['鄙薄', 'bian'],
  ['派遣', 'zhong'], ['动机', 'zhong'], ['出路', 'zhong'], ['冷清', 'zhong'],
];

const MOMENTS = [
  {
    name: '我敬佩的老师', pic: 'xinjian',
    prompt: '用“没有一个不……”写一位你敬佩的老师。',
    hint: '先写一两件具体的事，再用双重否定句表达大家的评价。',
    example: '王老师每天最早到校、最晚离开，作业本上的批语一笔一画，从不潦草。毕业那天，我们班没有一个不舍得她，没有一个不说她是我们遇到的最好的老师。',
  },
  {
    name: '身边的平凡人', pic: 'chenqi',
    prompt: '用“一个……的人”写一位身边默默付出的普通人。',
    hint: '排比要有层次：从品格写到对别人的贡献。',
    example: '小区门口的保安大叔，风雨无阻地站岗，帮老人提菜，替孩子收快递。他是一个尽职的人，一个热心的人，一个让整个小区都安心的人。',
  },
];

/* 对比表：点“？”显出原文 */
function initTable() {
  document.getElementById('cmpTable').addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (cell) cell.classList.add('open');
  });
}

/* 双重否定：换成肯定句比一比 */
function initSwap() {
  document.querySelector('[data-swap]').addEventListener('click', (e) => {
    const card = e.target.closest('.taste-card');
    const on = card.classList.toggle('swapped');
    e.target.textContent = on ? '换回原句' : '改成肯定句比一比';
  });
}

/* 感情色彩：点词语显色 */
function initColors() {
  const box = document.getElementById('colors');
  box.innerHTML = COLORS.map(([w, c]) => `<button type="button" class="cw" data-c="${c}">${w}</button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.cw');
    if (b) b.classList.add(`c-${b.dataset.c}`, 'shown');
  });
}

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['叙', '议'], moments: MOMENTS });
    Poem.init();
    initTable();
    initSwap();
    initColors();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
