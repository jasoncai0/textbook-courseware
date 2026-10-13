'use strict';
/* 项链 · 本课数据与本课互动。记叙文故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* 颜色小方块：配对成功后才显出颜色（不给答案提示） */
const sw = (c) => `<i class="xl-sw" style="--c:${c}"></i>`;
const CHOOSE = {
  /* 读一读，连一连：课文里的颜色词 */
  color: {
    opts: [['蓝蓝的', 'lán lán de'], ['黄黄的', 'huáng huáng de'], ['雪白雪白的', 'xuě bái xuě bái de'], ['彩色的', 'cǎi sè de'], ['金色的', 'jīn sè de']],
    items: [
      { t: '大海', py: 'dà hǎi', ok: ['蓝蓝的'], say: '又宽又远', icon: sw('#3d8fd6') },
      { t: '沙滩', py: 'shā tān', ok: ['黄黄的'], say: '又长又软', icon: sw('#e8c25a') },
      { t: '浪花', py: 'làng huā', ok: ['雪白雪白的'], say: '哗哗地笑着', icon: sw('#fff') },
      { t: '小娃娃的项链', py: 'xiǎo wá wa de xiàng liàn', ok: ['彩色的'], say: '海螺和贝壳穿成', icon: sw('conic-gradient(#e85a5a, #f2b33d, #6cc070, #4a90d9, #a070d0, #e85a5a)') },
      { t: '大海的项链', py: 'dà hǎi de xiàng liàn', ok: ['金色的'], say: '快活的脚印穿成', icon: sw('linear-gradient(135deg, #f7d774, #d49a1e)') },
    ],
  },
  /* 课后第 2 题：读一读，说一说，看谁说得多（课本插图：太阳、麦穗、羽毛、棉花、小鸟、星星） */
  say: {
    opts: [['金色的', 'jīn sè de'], ['雪白的', 'xuě bái de'], ['快活的', 'kuài huo de']],
    items: [
      { t: '太阳', py: 'tài yáng', ok: ['金色的', '快活的'] },
      { t: '麦穗', py: 'mài suì', ok: ['金色的'] },
      { t: '羽毛', py: 'yǔ máo', ok: ['雪白的'] },
      { t: '棉花', py: 'mián huā', ok: ['雪白的'] },
      { t: '小鸟', py: 'xiǎo niǎo', ok: ['快活的'] },
      { t: '星星', py: 'xīng xing', ok: ['金色的', '快活的'] },
    ],
  },
};

/* ================= 选一选（一上第七、八单元各课相同） =================
 * 容器 <div class="ch" data-choose="key" data-noswipe>；数据 CHOOSE[key] = { opts: [['很大', 'hěn dà'], ...], items: [{ t, py, ok: ['很大'], say, icon }] }
 * 每行点一个选项：对了整行变绿、显示 say（不写 say 就显示“选项 + 词”）；错了抖一下。t / py 是这一行的字（可省），icon 是行首的小图（SVG 字符串，可省）。
 * 在 Hanzi.init 之前调用（生成的注音直接用 Hanzi.ruby）。 */
function initChoose(box, { opts, items }) {
  const r = Hanzi.ruby;
  box.innerHTML = `${items.map((it, i) => `<div class="ch-row" data-i="${i}">
      ${it.icon ? `<span class="ch-ic">${it.icon}</span>` : ''}${it.t ? `<span class="ch-t py">${r(it.t, it.py)}</span>` : ''}
      <span class="ch-btns">${opts.map(([o, p]) => `<button type="button" class="ch-o" data-o="${o}"><span class="py">${r(o, p)}</span></button>`).join('')}</span>
      <span class="ch-say"></span></div>`).join('')}
    <p class="ch-count">做对了 <b>0</b> / ${items.length}</p>`;
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('.ch-o');
    const row = btn && btn.closest('.ch-row');
    if (!row || row.classList.contains('ok')) return;
    const it = items[+row.dataset.i];
    row.classList.remove('no');
    if (!it.ok.includes(btn.dataset.o)) {
      void row.offsetWidth; // 重新触发抖动动画
      row.classList.add('no');
      return;
    }
    row.classList.add('ok');
    btn.classList.add('solid');
    row.querySelector('.ch-say').textContent = it.say !== undefined ? it.say : `${btn.dataset.o}${it.t || ''}`; // 没写 say 就把选项和词连起来读
    const n = box.querySelectorAll('.ch-row.ok').length;
    box.querySelector('.ch-count b').textContent = n;
    box.classList.toggle('all-done', n === items.length);
    box.dispatchEvent(new CustomEvent('chosen', { detail: { i: +row.dataset.i, o: btn.dataset.o } }));
  });
}
document.querySelectorAll('[data-choose]').forEach((box) => initChoose(box, CHOOSE[box.dataset.choose]));

Hanzi.init({
  cards: [
    { z: '蓝', py: 'lán', bs: '艹', bh: 13, words: [['蓝蓝的', 'lán lán de'], ['蓝天', 'lán tiān']] },
    { z: '又', py: 'yòu', bs: '又', bh: 2, words: [['又宽又远', 'yòu kuān yòu yuǎn'], ['又长又软', 'yòu cháng yòu ruǎn']] },
    { z: '笑', py: 'xiào', bs: '⺮', bh: 10, words: [['笑着', 'xiào zhe'], ['大笑', 'dà xiào']] },
    { z: '着', py: 'zhe', bs: '目', bh: 11, words: [['笑着', 'xiào zhe'], ['看着', 'kàn zhe']] },
    { z: '向', py: 'xiàng', bs: '丿', bh: 6, words: [['涌向', 'yǒng xiàng'], ['向前', 'xiàng qián']] },
    { z: '和', py: 'hé', bs: '禾', bh: 8, words: [['海螺和贝壳', 'hǎi luó hé bèi ké'], ['和好', 'hé hǎo']] },
    { z: '贝', py: 'bèi', bs: '贝', bh: 4, words: [['贝壳', 'bèi ké'], ['宝贝', 'bǎo bèi']] },
    { z: '娃', py: 'wá', bs: '女', bh: 9, words: [['娃娃', 'wá wa'], ['小娃娃', 'xiǎo wá wa']] },
    { z: '挂', py: 'guà', bs: '扌', bh: 9, words: [['挂在', 'guà zài'], ['挂着', 'guà zhe']] },
    { z: '活', py: 'huó', bs: '氵', bh: 9, words: [['快活', 'kuài huo'], ['生活', 'shēng huó']] },
    { z: '金', py: 'jīn', bs: '金', bh: 8, words: [['金色', 'jīn sè'], ['金子', 'jīn zi']] },
  ],
  shapes: {
    贝: ['M50 10C24 10 14 40 22 66C28 84 40 92 50 92C60 92 72 84 78 66C86 40 76 10 50 10', 'M50 18V84', 'M36 34L44 38', 'M36 52L44 56', 'M64 34L56 38', 'M64 52L56 56'],
    又: ['M66 94C62 74 57 60 50 50', 'M50 50L24 20', 'M50 50L46 10', 'M50 50L74 20'],
  },
  evolve: [
    { z: '贝', note: '像一枚张开的贝壳。很早以前，人们把贝壳当钱用。' },
    { z: '又', note: '像一只伸出的右手（只画了三个手指）。' },
  ],
  apples: [['蓝', 'lán'], ['又', 'yòu'], ['笑', 'xiào'], ['着', 'zhe'], ['向', 'xiàng'], ['和', 'hé'], ['贝', 'bèi'], ['娃', 'wá'], ['挂', 'guà'], ['活', 'huó'], ['金', 'jīn']],
  write: [
    { z: '白', py: 'bái', bs: '白', bh: 5 },
    { z: '的', py: 'de', bs: '白', bh: 8 },
    { z: '又', py: 'yòu', bs: '又', bh: 2 },
    { z: '和', py: 'hé', bs: '禾', bh: 8 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
