'use strict';
/* 彩色的梦 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 彩铅画梦：一句一笔，白纸上涂出第 2、3 小节的梦境，最后变成真的画；② 色板说梦；③ 仿写机；④ 摘苹果（呼应“苹果般的太阳”）。 */

/* 二下只给生字注音：data-pyk="盒:hé" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 彩铅画梦：铅笔跟着每一步移到正在涂的地方（纸上百分比） ================= */
const PEN_AT = [
  [[8, 85], [60, 80], [40, 72], [55, 20], [80, 15]], // 第 2 小节，第 1～5 步
  [[22, 60], [32, 58], [40, 18], [78, 50], [86, 22], [86, 22]], // 第 3 小节，第 1～6 步
];
function placePen(slide, step) {
  const pen = slide.querySelector('.cm-pen');
  if (!pen) return;
  const k = [...document.querySelectorAll('.cm-draw')].indexOf(slide);
  const at = PEN_AT[k][Math.max(0, Math.min(step, PEN_AT[k].length) - 1)];
  pen.style.left = `${at[0]}%`;
  pen.style.top = `${at[1]}%`;
  pen.classList.toggle('show', step > 0);
}

/* ================= 色板：这种颜色在梦里画了什么 ================= */
const COLORS = [
  { c: '#4fa84a', n: '绿色', things: ['大块的草坪', '葱郁的森林', '雪松'] },
  { c: '#e5322d', n: '红色', things: ['大朵的野花', '苹果般的太阳'] },
  { c: '#3d8fe0', n: '蓝色', things: ['大片的天空', '溪水'] },
  { c: '#8a4bb5', n: '紫色', things: ['紫葡萄'] },
  { c: '#a0603a', n: '棕色', things: ['小屋', '烟囱'] },
  { c: '#f2b632', n: '黄色', things: ['？诗里没写，你来想'] },
];
function initColors(box) {
  box.innerHTML = `<div class="cm-pens">${COLORS.map((p, i) => `<button type="button" class="cm-pencil" data-i="${i}" style="--c:${p.c}"><i></i><span>${p.n}</span></button>`).join('')}</div>
    <div class="cm-board"><p class="cm-say">点一支彩色铅笔</p><div class="cm-things"></div></div>`;
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.cm-pencil');
    if (!b) return;
    const p = COLORS[+b.dataset.i];
    box.querySelectorAll('.cm-pencil').forEach((x) => x.classList.toggle('on', x === b));
    box.querySelector('.cm-say').innerHTML = `我的<b style="color:${p.c}">${p.n}</b>铅笔画出了——`;
    box.querySelector('.cm-things').innerHTML = p.things.map((t, k) => `<span style="--c:${p.c};animation-delay:${k * 0.25}s">${t}</span>`).join('');
  });
}
initColors(document.getElementById('cmColors'));

/* ================= 仿写机：大（块/朵/片）的＿＿，＿了； ================= */
const MAKE_ROWS = [
  [['大片的', '麦田', '黄了'], ['大片的', '沙滩', '金了'], ['大块的', '菜地', '绿了']],
  [['大朵的', '白云', '白了'], ['大朵的', '向日葵', '黄了'], ['大朵的', '荷花', '粉了']],
  [['大片的', '大海', '蓝了'], ['大片的', '枫叶', '红了'], ['大片的', '晚霞', '红了']],
];
function initMake(box) {
  box.innerHTML = `<div class="cm-rows">${MAKE_ROWS.map((row, r) => `<div class="cm-row" data-r="${r}">${row.map((o, k) => `<button type="button" class="cm-o${k ? '' : ' on'}" data-k="${k}">${o[1]}</button>`).join('')}</div>`).join('')}</div>
    <div class="cm-out"><p>脚尖滑过的地方，</p><p class="o0"></p><p class="o1"></p><p class="o2"></p></div>`;
  const update = () => {
    box.querySelectorAll('.cm-row').forEach((row, r) => {
      const o = MAKE_ROWS[r][+row.querySelector('.on').dataset.k];
      const p = box.querySelector(`.o${r}`);
      p.innerHTML = `${o[0]}${o[1]}，<b>${o[2]}</b>${r < 2 ? '；' : '！'}`;
    });
  };
  box.addEventListener('click', (e) => {
    const o = e.target.closest('.cm-o');
    if (!o) return;
    o.parentElement.querySelectorAll('.cm-o').forEach((x) => x.classList.toggle('on', x === o));
    update();
    const p = box.querySelector(`.o${o.parentElement.dataset.r}`);
    p.classList.remove('pop'); void p.offsetWidth; p.classList.add('pop');
  });
  update();
}
initMake(document.getElementById('cmMake'));

Hanzi.init({
  cards: [
    { z: '盒', py: 'hé', words: [['铅笔盒', 'qiān bǐ hé'], ['盒子', 'hé zi']] },
    { z: '聊', py: 'liáo', words: [['聊天', 'liáo tiān'], ['闲聊', 'xián liáo']] },
    { z: '坪', py: 'píng', words: [['草坪', 'cǎo píng'], ['停机坪', 'tíng jī píng']] },
    { z: '郁', py: 'yù', words: [['葱郁', 'cōng yù'], ['郁郁葱葱', 'yù yù cōng cōng']] },
    { z: '囱', py: 'cōng', words: [['烟囱', 'yān cōng']] },
    { z: '般', py: 'bān', words: [['苹果般', 'píng guǒ bān'], ['一般', 'yì bān']] },
    { z: '精', py: 'jīng', words: [['精灵', 'jīng líng'], ['精彩', 'jīng cǎi']] },
    { z: '叮', py: 'dīng', words: [['叮咛', 'dīng níng'], ['叮嘱', 'dīng zhǔ']] },
    { z: '咛', py: 'níng', words: [['叮咛', 'dīng níng']] },
  ],
  apples: [['盒', 'hé'], ['聊', 'liáo'], ['坪', 'píng'], ['郁', 'yù'], ['囱', 'cōng'], ['般', 'bān'], ['精', 'jīng'], ['叮', 'dīng'], ['咛', 'níng'], ['彩', 'cǎi'], ['梦', 'mèng'], ['森', 'sēn']],
  write: {
    a: [
      { z: '彩', py: 'cǎi', bs: '彡', bh: 11 },
      { z: '梦', py: 'mèng', bh: 11 },
      { z: '森', py: 'sēn', bs: '木', bh: 12 },
      { z: '拉', py: 'lā', bs: '扌', bh: 8 },
      { z: '结', py: 'jiē', bs: '纟', bh: 9 },
    ],
    b: [
      { z: '苹', py: 'píng', bs: '艹', bh: 8 },
      { z: '般', py: 'bān', bs: '舟', bh: 10 },
      { z: '精', py: 'jīng', bs: '米', bh: 14 },
      { z: '灵', py: 'líng', bh: 7 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('cm-draw')) placePen(slide, step);
  },
};
