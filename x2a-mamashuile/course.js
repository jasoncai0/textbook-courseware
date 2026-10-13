'use strict';
/* 妈妈睡了 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：细节聚光灯（读到哪个词，画面上照亮哪里）、“美丽 · 温柔 · 好累”三张妈妈画像卡、词语积木、梦泡泡识字 */

Hanzi.init({
  cards: [
    { z: '哄', py: 'hǒng', bs: '口', bh: 9, words: [['哄我', 'hǒng wǒ'], ['哄孩子', 'hǒng hái zi']] },
    { z: '先', py: 'xiān', bs: '儿', bh: 6, words: [['先睡着', 'xiān shuì zháo'], ['先后', 'xiān hòu']] },
    { z: '梦', py: 'mèng', bs: '夕', bh: 11, words: [['睡梦', 'shuì mèng'], ['做梦', 'zuò mèng']] },
    { z: '闭', py: 'bì', bs: '门', bh: 6, words: [['闭上', 'bì shàng'], ['关闭', 'guān bì']] },
    { z: '紧', py: 'jǐn', bs: '糸', bh: 10, words: [['紧紧地', 'jǐn jǐn de'], ['要紧', 'yào jǐn']] },
    { z: '润', py: 'rùn', bs: '氵', bh: 10, words: [['红润', 'hóng rùn'], ['湿润', 'shī rùn']] },
    { z: '等', py: 'děng', bs: '⺮', bh: 12, words: [['等会儿', 'děng huìr _'], ['等一等', 'děng yi děng']] },
    { z: '累', py: 'lèi', bs: '糸', bh: 11, words: [['好累', 'hǎo lèi'], ['累了', 'lèi le']] },
    { z: '吸', py: 'xī', bs: '口', bh: 6, words: [['呼吸', 'hū xī'], ['吸气', 'xī qì']] },
    { z: '发', py: 'fà', bs: '又', bh: 5, words: [['头发', 'tóu fa'], ['理发', 'lǐ fà']] },
    { z: '粘', py: 'zhān', bs: '米', bh: 11, words: [['粘在', 'zhān zài'], ['粘贴', 'zhān tiē']] },
    { z: '汗', py: 'hàn', bs: '氵', bh: 6, words: [['汗珠', 'hàn zhū'], ['出汗', 'chū hàn']] },
    { z: '额', py: 'é', bs: '页', bh: 15, words: [['额头', 'é tóu']] },
    { z: '沙', py: 'shā', bs: '氵', bh: 7, words: [['沙沙', 'shā shā'], ['沙子', 'shā zi']] },
    { z: '乏', py: 'fá', bs: '丿', bh: 4, words: [['乏了', 'fá le'], ['疲乏', 'pí fá']] },
  ],
  write: [
    { z: '哄', py: 'hǒng', bs: '口', bh: 9 },
    { z: '先', py: 'xiān', bs: '儿', bh: 6 },
    { z: '闭', py: 'bì', bs: '门', bh: 6 },
    { z: '脸', py: 'liǎn', bs: '月', bh: 11 },
    { z: '沉', py: 'chén', bs: '氵', bh: 7 },
    { z: '发', py: 'fà', bs: '又', bh: 5 },
    { z: '窗', py: 'chuāng', bs: '穴', bh: 12 },
    { z: '沙', py: 'shā', bs: '氵', bh: 7 },
  ],
});

/* ---------- 细节聚光灯：读到带 data-spot="x y r" 的词，画面上照亮那里 ---------- */
function updateSpot(slide, step) {
  const box = slide.querySelector('.ms-spot');
  if (!box) return;
  let hit = null;
  slide.querySelectorAll('[data-spot][data-step]').forEach((el) => { if (+el.dataset.step <= step) hit = el; });
  box.classList.toggle('lit', Boolean(hit));
  if (!hit) return;
  const [x, y, r] = hit.dataset.spot.split(' ');
  box.style.setProperty('--x', `${x}%`);
  box.style.setProperty('--y', `${y}%`);
  box.style.setProperty('--r', `${(r / 100) * box.clientWidth}px`);
  const label = box.querySelector('.ms-label');
  label.textContent = hit.dataset.label || '';
  label.style.left = `${x}%`;
  const rp = (r / 100) * box.clientWidth;
  label.style.top = +y > 50 ? `calc(${y}% - ${rp}px - 2em)` : `calc(${y}% + ${rp}px + .3em)`;
}

/* ---------- 画像卡翻面 ---------- */
function initCards() {
  document.querySelector('.ms-cards').addEventListener('click', (e) => {
    const c = e.target.closest('.ms-pc');
    if (c) c.classList.toggle('flipped');
  });
}

/* ---------- 词语积木：点一个形容词，拼成短语 ---------- */
function initBlocks() {
  document.querySelectorAll('.ms-row').forEach((row) => {
    row.addEventListener('click', (e) => {
      const b = e.target.closest('.btn');
      if (!b) return;
      row.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
      const adj = row.querySelector('.ms-adj');
      adj.textContent = b.textContent;
      adj.classList.remove('pop'); void adj.offsetWidth; adj.classList.add('pop');
    });
  });
}

/* ---------- 梦泡泡 ---------- */
const DREAMS = [['哄', 'hǒng'], ['先', 'xiān'], ['梦', 'mèng'], ['闭', 'bì'], ['紧', 'jǐn'], ['润', 'rùn'], ['等', 'děng'], ['累', 'lèi'], ['吸', 'xī'], ['发', 'fà'], ['粘', 'zhān'], ['汗', 'hàn'], ['额', 'é'], ['沙', 'shā'], ['乏', 'fá']];
const BUBBLE_POS = [[8, 30], [22, 6], [36, 32], [50, 6], [64, 30], [78, 6], [91, 30], [14, 56], [29, 76], [43, 56], [57, 76], [71, 56], [85, 76], [6, 78], [92, 56]];
function initBubbles() {
  const box = document.getElementById('msBubbles');
  const n = document.getElementById('msN');
  const done = document.getElementById('msDone');
  box.innerHTML = DREAMS.map(([z, p], i) => `<button type="button" class="ms-bub" style="left:${BUBBLE_POS[i][0]}%;top:${BUBBLE_POS[i][1]}%;animation-delay:${(-i * 0.7).toFixed(1)}s"><span class="py">${Hanzi.ruby(z, p)}</span></button>`).join('');
  const update = () => {
    const k = box.querySelectorAll('.ms-bub.pop-ed').length;
    n.textContent = k;
    done.classList.toggle('show', k === DREAMS.length);
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.ms-bub:not(.pop-ed)');
    if (!b) return;
    b.classList.add('pop-ed');
    update();
  });
  document.getElementById('msReset').addEventListener('click', () => {
    box.querySelectorAll('.ms-bub').forEach((b) => b.classList.remove('pop-ed'));
    update();
  });
  update();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initCards();
    initBlocks();
    initBubbles();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateSpot(slide, step);
  },
};
