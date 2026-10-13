'use strict';
/* 一个粗瓷大碗 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 排一排：碗的旅程（按正确顺序写，页面上会打乱） */
const ORDER = [
  { t: '在战斗中找到这个碗' },
  { t: '通讯员送给赵一曼' },
  { t: '“请你还到哪里去！”' },
  { t: '盛满高粱米饭' },
  { t: '饭倒回锅里，盛半碗野菜粥' },
  { t: '碗“丢”了' },
  { t: '成了七班的菜盆' },
  { t: '陈列在博物馆里' },
];

/* 问题 2：哪里让你感动 */
const CLUE_LABELS = ['课文里写', '我感动，因为'];
const CLUES = [
  { q: '赵一曼吃饭用的搪瓷缸子早就送给一个新战士了。', a: '她自己没有碗吃饭，也要先想着新战士。' },
  { q: '“哪里拿来的，请你还到哪里去！”', a: '一个碗也不随便要，她对自己要求很严格。' },
  { q: '把碗里的饭倒进锅里，又从另一口锅里盛了半碗野菜粥。', a: '几个月没沾过粮食，她还是把高粱米饭留给伤病员，自己和战士们一样吃野菜粥。' },
  { q: '炊事员老李……没吭声，眼里却含着泪花。', a: '老李看见了，被政委感动得说不出话——我们读到这里也想流泪。' },
  { q: '通讯员一直想给她另找一个碗，好不容易……找到了。', a: '小通讯员处处关心政委，同志之间多么友爱。' },
  { q: '这个粗瓷大碗已经成了七班的菜盆了。', a: '碗又被她送给了战士。她笑着说“丢”，心里想的全是别人。' },
];

/* 排一排：点卡片按顺序放进格子，点错会抖一下 */
function initOrder(box, items) {
  // 固定的打乱方式（每次一样，方便老师备课）
  const shuffled = items.map((it, i) => ({ ...it, i })).sort((a, b) => ((a.i * 3 + 2) % items.length) - ((b.i * 3 + 2) % items.length));
  let next = 0;
  const render = () => {
    next = 0;
    box.innerHTML = `<div class="ord-slots">${items.map((_, k) => `<div class="ord-slot"><span class="ord-no">${k + 1}</span></div>`).join('')}</div>
      <div class="ord-pool">${shuffled.map((it) => `<button class="ord-card" type="button" data-i="${it.i}">${it.t}</button>`).join('')}</div>
      <div class="ord-foot"><p class="ord-msg"></p><button class="btn ord-reset" type="button">重新排</button></div>`;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('.ord-reset')) { render(); return; }
    const card = e.target.closest('.ord-card');
    if (!card || card.disabled) return;
    const i = +card.dataset.i;
    const msg = box.querySelector('.ord-msg');
    if (i !== next) {
      card.classList.remove('nope'); void card.offsetWidth; card.classList.add('nope');
      msg.textContent = '再想想：故事里先发生的是哪一个？';
      return;
    }
    card.disabled = true;
    const slot = box.querySelectorAll('.ord-slot')[i];
    slot.insertAdjacentHTML('beforeend', `<p>${items[i].t}</p>${items[i].feel ? `<b>${items[i].feel}</b>` : ''}`);
    slot.classList.add('done');
    next += 1;
    msg.textContent = next === items.length ? '排好了！' : '';
  });
  render();
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS });
    const box = document.getElementById('order');
    if (box) initOrder(box, ORDER);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
