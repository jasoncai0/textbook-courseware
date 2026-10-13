'use strict';
/* 静夜思 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：竖排注音诗板（拼音横写在每个字上方，从右往左一列一句）、“看地上—举头—低头”动作演示、点亮星星识字游戏 */

const POEM = {
  title: ['静夜思', 'jìng yè sī'],
  author: ['［唐］李白', 'táng lǐ bái'],
  lines: [
    { t: '床前明月光，', py: 'chuáng qián míng yuè guāng', f: '1.25 35% 70%', blank: [2, 5] },
    { t: '疑是地上霜。', py: 'yí shì dì shàng shuāng', f: '1.3 30% 80%', blank: [2, 5] },
    { t: '举头望明月，', py: 'jǔ tóu wàng míng yuè', f: '1.2 60% 30%', blank: [2, 5] },
    { t: '低头思故乡。', py: 'dī tóu sī gù xiāng', f: '1.2 30% 60%', blank: [2, 5] },
  ],
};
const HAN = /\p{Script=Han}/u;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* 一列竖排：每个汉字一格，拼音横写在字的上方；标点占小半格。blank = [从第几个字, 到第几个字) 挖空，配 step */
function column(text, py, { cls = '', step, focus, blank, blankStep } = {}) {
  const syl = py.split(/\s+/);
  let k = 0;
  const cells = [...text].map((ch) => {
    if (!HAN.test(ch)) return `<span class="jy-p">${esc(ch)}</span>`;
    const i = k++;
    const hole = blank && i >= blank[0] && i < blank[1];
    const pz = i === 2 && cls.includes('jy-line') ? '<i class="jy-pz">/</i>' : '';
    return `${pz}<span class="jy-c${hole ? ' hz-blank' : ''}"${hole ? ` data-step="${blankStep}"` : ''}><i>${esc(syl[i] || '')}</i>${esc(ch)}</span>`;
  }).join('');
  if (k !== syl.length) console.warn(`注音数量不符：${text} / ${py}`); // eslint-disable-line no-console
  return `<div class="jy-col ${cls}"${step ? ` data-step="${step}"` : ''}${focus ? ` data-focus="${focus}"` : ''}>${cells}</div>`;
}

function buildBoard(box, recite) {
  const head = column(...POEM.title, { cls: 'jy-title' }) + column(...POEM.author, { cls: 'jy-author' });
  box.innerHTML = head + POEM.lines.map((l, i) => (recite
    ? column(l.t, l.py, { cls: 'jy-line', blank: l.blank, blankStep: i + 1 })
    : column(l.t, l.py, { cls: 'jy-line', step: i + 1, focus: l.f }))).join('');
}
buildBoard(document.getElementById('poemBoard'), false);
buildBoard(document.getElementById('reciteBoard'), true);

Hanzi.init({
  shapes: {
    光: ['M50 6C42 20 34 30 37 42C40 52 60 52 63 42C66 30 58 20 50 6', 'M30 30L20 20', 'M70 30L80 20', 'M50 56C50 70 46 80 34 92', 'M48 70L66 76L64 92'],
    望: ['M14 34Q32 18 50 34Q32 50 14 34Z', 'M32 34m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0', 'M32 50C34 62 36 72 36 84', 'M34 62L52 56', 'M14 92H58', 'M86 10C70 18 70 42 86 50C76 40 76 20 86 10'],
  },
  cards: [
    { z: '夜', py: 'yè', bs: '亠', bh: 8, words: [['夜晚', 'yè wǎn'], ['静夜思', 'jìng yè sī']] },
    { z: '思', py: 'sī', bs: '心', bh: 9, words: [['思念', 'sī niàn'], ['思故乡', 'sī gù xiāng']] },
    { z: '床', py: 'chuáng', bs: '广', bh: 7, words: [['床前', 'chuáng qián'], ['起床', 'qǐ chuáng']] },
    { z: '光', py: 'guāng', bs: '⺌', bh: 6, words: [['月光', 'yuè guāng'], ['阳光', 'yáng guāng']] },
    { z: '疑', py: 'yí', bs: '疋', bh: 14, words: [['疑是', 'yí shì'], ['怀疑', 'huái yí']] },
    { z: '举', py: 'jǔ', bs: '丶', bh: 9, words: [['举头', 'jǔ tóu'], ['举手', 'jǔ shǒu']] },
    { z: '望', py: 'wàng', bs: '月', bh: 11, words: [['望月', 'wàng yuè'], ['远望', 'yuǎn wàng']] },
    { z: '低', py: 'dī', bs: '亻', bh: 7, words: [['低头', 'dī tóu'], ['高低', 'gāo dī']] },
    { z: '故', py: 'gù', bs: '攵', bh: 9, words: [['故乡', 'gù xiāng'], ['故事', 'gù shi']] },
  ],
  evolve: [
    { z: '光', note: '上面是一团火，下面是一个人——人举着火把，四周就亮了，这就是“光”。' },
    { z: '望', note: '一个人站在高处，睁大眼睛往远处看，天边有一弯月亮——“举头望明月”的“望”。' },
  ],
  write: [
    { z: '思', py: 'sī', bs: '心', bh: 9 },
    { z: '床', py: 'chuáng', bs: '广', bh: 7 },
    { z: '前', py: 'qián', bs: '丷', bh: 9 },
    { z: '光', py: 'guāng', bs: '⺌', bh: 6 },
    { z: '低', py: 'dī', bs: '亻', bh: 7 },
    { z: '故', py: 'gù', bs: '攵', bh: 9 },
    { z: '乡', py: 'xiāng', bs: '乙', bh: 3 },
  ],
});

/* ---------- 动作演示：看地上 → 举头 → 低头 ---------- */
const ACTS = {
  look: { lines: [POEM.lines[0], POEM.lines[1]], hint: '地上白白亮亮的，是霜吗？不是，是月光！“疑”就是“好像、以为”。' },
  up: { lines: [POEM.lines[2]], hint: '把头抬起来，看天上又圆又亮的月亮。' },
  down: { lines: [POEM.lines[3]], hint: '把头低下来，想一想远远的家乡。' },
};
function initActs() {
  const room = document.getElementById('room');
  const line = document.getElementById('actLine');
  const hint = document.getElementById('actHint');
  document.querySelector('.jy-acts').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    room.classList.remove('look', 'up', 'down');
    void room.getBoundingClientRect(); // 重新触发动画
    room.classList.add(act);
    document.querySelectorAll('.jy-do').forEach((x) => x.classList.toggle('on', x === b));
    line.innerHTML = ACTS[act].lines.map((l) => `<p>${Hanzi.ruby(l.t, l.py)}</p>`).join('');
    hint.textContent = ACTS[act].hint;
  });
}

/* ---------- 点亮星星 ---------- */
const STARS = [['夜', 'yè'], ['思', 'sī'], ['床', 'chuáng'], ['光', 'guāng'], ['疑', 'yí'], ['举', 'jǔ'], ['望', 'wàng'], ['低', 'dī'], ['故', 'gù'], ['前', 'qián'], ['乡', 'xiāng']];
const STAR_POS = [[10, 18], [28, 8], [46, 22], [64, 10], [80, 40], [18, 48], [38, 56], [58, 44], [76, 68], [26, 80], [52, 82]];
function initStars() {
  const box = document.getElementById('stars');
  const n = document.getElementById('litN');
  const done = document.getElementById('litDone');
  document.getElementById('litAll').textContent = STARS.length;
  box.innerHTML = STARS.map(([z, p], i) => `<button type="button" class="jy-star" style="left:${STAR_POS[i][0]}%;top:${STAR_POS[i][1]}%;animation-delay:${(i * .37).toFixed(2)}s"><span>${Hanzi.ruby(z, p)}</span></button>`).join('')
    + '<div class="jy-skymoon" aria-hidden="true"><i></i></div>';
  const update = () => {
    const lit = box.querySelectorAll('.jy-star.lit').length;
    n.textContent = lit;
    box.classList.toggle('all', lit === STARS.length);
    done.classList.toggle('show', lit === STARS.length);
  };
  box.addEventListener('click', (e) => {
    const s = e.target.closest('.jy-star');
    if (!s) return;
    s.classList.add('lit');
    update();
  });
  document.getElementById('starsReset').addEventListener('click', () => {
    box.querySelectorAll('.jy-star').forEach((s) => s.classList.remove('lit'));
    update();
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    document.querySelector('.jy-rhythm').addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('on', document.getElementById('poemBoard').classList.toggle('rhythm'));
    });
    initActs();
    initStars();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
