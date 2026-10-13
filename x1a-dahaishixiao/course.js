'use strict';
/* 大还是小 · 本课数据与本课互动。记叙文故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* 课后第 2 题：什么时候觉得自己很大，什么时候很小（前四条是课文里的，后四条是生活里的） */
const CHOOSE = {
  dx: {
    opts: [['很大', 'hěn dà'], ['很小', 'hěn xiǎo']],
    items: [
      { t: '自己穿衣服', py: 'zì jǐ chuān yī fu', ok: ['很大'], say: '我长大了！' },
      { t: '自己系鞋带', py: 'zì jǐ jì xié dài', ok: ['很大'], say: '真能干！' },
      { t: '够不到门铃', py: 'gòu bú dào mén líng', ok: ['很小'], say: '还要长高呢' },
      { t: '听到雷声喊妈妈', py: 'tīng dào léi shēng hǎn mā ma', ok: ['很小'], say: '有点害怕' },
      { t: '帮妈妈扫地', py: 'bāng mā ma sǎo dì', ok: ['很大'], say: '会帮忙了' },
      { t: '自己整理书包', py: 'zì jǐ zhěng lǐ shū bāo', ok: ['很大'], say: '会自己做事了' },
      { t: '拧不开瓶盖', py: 'nǐng bù kāi píng gài', ok: ['很小'], say: '力气还小' },
      { t: '晚上不敢一个人睡', py: 'wǎn shang bù gǎn yí gè rén shuì', ok: ['很小'], say: '还有点胆小' },
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
    { z: '时', py: 'shí', bs: '日', bh: 7, words: [['时候', 'shí hou'], ['小时', 'xiǎo shí']] },
    { z: '候', py: 'hòu', bs: '亻', bh: 10, words: [['时候', 'shí hou'], ['问候', 'wèn hòu']] },
    { z: '觉', py: 'jué', bs: '见', bh: 9, words: [['觉得', 'jué de'], ['感觉', 'gǎn jué']] },
    { z: '得', py: 'de', bs: '彳', bh: 11, words: [['觉得', 'jué de'], ['跑得快', 'pǎo de kuài']] },
    { z: '自', py: 'zì', bs: '自', bh: 6, words: [['自己', 'zì jǐ'], ['自然', 'zì rán']] },
    { z: '己', py: 'jǐ', bs: '己', bh: 3, words: [['自己', 'zì jǐ']] },
    { z: '很', py: 'hěn', bs: '彳', bh: 9, words: [['很大', 'hěn dà'], ['很小', 'hěn xiǎo']] },
    { z: '穿', py: 'chuān', bs: '穴', bh: 9, words: [['穿衣服', 'chuān yī fu'], ['穿鞋', 'chuān xié']] },
    { z: '衣', py: 'yī', bs: '衣', bh: 6, words: [['衣服', 'yī fu'], ['上衣', 'shàng yī']] },
    { z: '服', py: 'fú', bs: '月', bh: 8, words: [['衣服', 'yī fu'], ['服装', 'fú zhuāng']] },
    { z: '门', py: 'mén', bs: '门', bh: 3, words: [['门铃', 'mén líng'], ['大门', 'dà mén']] },
    { z: '快', py: 'kuài', bs: '忄', bh: 7, words: [['快点儿', 'kuài diǎnr _'], ['快乐', 'kuài lè']] },
  ],
  shapes: {
    自: ['M50 8C34 10 22 30 24 58C26 84 74 84 76 58C78 30 66 10 50 8', 'M36 40H64', 'M36 58H64'],
    门: ['M16 8V94', 'M16 22H42V72H16', 'M84 8V94', 'M84 22H58V72H84'],
    衣: ['M50 6V20', 'M14 32Q50 16 86 32', 'M34 26L66 68', 'M66 26L34 68', 'M30 34L22 92H78L70 34'],
  },
  evolve: [
    { z: '自', note: '像人的鼻子。人们说“我自己”的时候，常常用手指着自己的鼻子。' },
    { z: '门', note: '像左右两扇门，中间可以打开。' },
    { z: '衣', note: '像一件上衣：上面是衣领，左右两片衣襟交叉着。' },
  ],
  apples: [['时', 'shí'], ['候', 'hòu'], ['觉', 'jué'], ['得', 'de'], ['自', 'zì'], ['己', 'jǐ'], ['很', 'hěn'], ['穿', 'chuān'], ['衣', 'yī'], ['服', 'fú'], ['门', 'mén'], ['快', 'kuài']],
  write: [
    { z: '自', py: 'zì', bs: '自', bh: 6 },
    { z: '己', py: 'jǐ', bs: '己', bh: 3 },
    { z: '门', py: 'mén', bs: '门', bh: 3 },
    { z: '衣', py: 'yī', bs: '衣', bh: 6 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
