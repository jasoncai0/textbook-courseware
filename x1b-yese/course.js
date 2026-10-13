'use strict';
/* 夜色 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：故事页“关灯—月光亮起”明暗变化 + 表情从害怕到微笑；以前/后来开关对比；词语串串；手电筒照字 */

/* 课后“读一读，记一记”：一个字串一串词 */
const BEADS = [
  { z: ['胆', 'dǎn'], words: [['胆子', 'dǎn zi'], ['胆量', 'dǎn liàng'], ['大胆', 'dà dǎn']] },
  { z: ['勇', 'yǒng'], words: [['勇敢', 'yǒng gǎn'], ['勇气', 'yǒng qì'], ['勇士', 'yǒng shì']] },
  { z: ['原', 'yuán'], words: [['原来', 'yuán lái'], ['草原', 'cǎo yuán'], ['高原', 'gāo yuán']] },
  { z: ['微', 'wēi'], words: [['微笑', 'wēi xiào'], ['微小', 'wēi xiǎo'], ['微风', 'wēi fēng']] },
];
document.getElementById('beads').innerHTML = BEADS.map((b, i) => `<div class="ys-bead" data-i="${i}">
  <button type="button" class="ys-bead-z">${Hanzi.ruby(...b.z)}</button>
  <div class="ys-stick">${b.words.map((w, k) => `<span class="ys-w" style="--d:${k * .25}s">${Hanzi.ruby(...w)}</span>`).join('')}</div>
</div>`).join('');

Hanzi.init({
  shapes: {
    手: ['M50 8V92', 'M28 26Q50 20 72 26', 'M22 46Q50 40 78 46', 'M50 92Q40 90 34 82'],
    笑: ['M22 10L14 28', 'M22 18H40', 'M70 10L62 28', 'M70 18H88', 'M50 40Q36 52 24 54', 'M50 40Q66 50 82 50', 'M50 40V70', 'M50 70L30 92', 'M50 70L74 92'],
  },
  cards: [
    { z: '胆', py: 'dǎn', bs: '月', bh: 9, words: [['胆子', 'dǎn zi'], ['大胆', 'dà dǎn']] },
    { z: '敢', py: 'gǎn', bs: '攵', bh: 11, words: [['勇敢', 'yǒng gǎn'], ['不敢', 'bù gǎn']] },
    { z: '往', py: 'wǎng', bs: '彳', bh: 8, words: [['往外', 'wǎng wài'], ['往前', 'wǎng qián']] },
    { z: '外', py: 'wài', bs: '夕', bh: 5, words: [['窗外', 'chuāng wài'], ['外面', 'wài miàn']] },
    { z: '勇', py: 'yǒng', bs: '力', bh: 9, words: [['勇敢', 'yǒng gǎn'], ['勇气', 'yǒng qì']] },
    { z: '窗', py: 'chuāng', bs: '穴', bh: 12, words: [['窗外', 'chuāng wài'], ['窗口', 'chuāng kǒu']] },
    { z: '乱', py: 'luàn', bs: '舌', bh: 7, words: [['乱跳', 'luàn tiào'], ['乱说', 'luàn shuō']] },
    { z: '偏', py: 'piān', bs: '亻', bh: 11, words: [['偏要', 'piān yào'], ['偏偏', 'piān piān']] },
    { z: '散', py: 'sàn', bs: '攵', bh: 12, words: [['散步', 'sàn bù'], ['散开', 'sàn kāi']] },
    { z: '原', py: 'yuán', bs: '厂', bh: 10, words: [['原来', 'yuán lái'], ['草原', 'cǎo yuán']] },
    { z: '像', py: 'xiàng', bs: '亻', bh: 13, words: [['好像', 'hǎo xiàng'], ['画像', 'huà xiàng']] },
    { z: '微', py: 'wēi', bs: '彳', bh: 13, words: [['微笑', 'wēi xiào'], ['微风', 'wēi fēng']] },
  ],
  evolve: [
    { z: '看', old: ['手', '目'], note: '上面是一只手，下面是眼睛（目）：把手搭在眼睛上往远处看，就是“看”。' },
    { z: '笑', note: '上面像竹叶，下面像弯着腰的人：竹子被风一吹弯下腰，像人笑弯了腰。（帮助记字的说法）' },
  ],
  write: [
    { z: '色', py: 'sè', bs: '色', bh: 6 },
    { z: '外', py: 'wài', bs: '夕', bh: 5 },
    { z: '看', py: 'kàn', bs: '目', bh: 9 },
    { z: '爸', py: 'bà', bs: '父', bh: 8 },
    { z: '晚', py: 'wǎn', bs: '日', bh: 11 },
    { z: '笑', py: 'xiào', bs: '⺮', bh: 10 },
    { z: '再', py: 'zài', bs: '一', bh: 6 },
  ],
});

/* ---------- 手电筒照字 ---------- */
const HIDDEN = [['胆', 'dǎn', 12, 22], ['敢', 'gǎn', 30, 46], ['往', 'wǎng', 48, 18], ['外', 'wài', 66, 40], ['勇', 'yǒng', 86, 26], ['窗', 'chuāng', 20, 66],
  ['乱', 'luàn', 40, 76], ['偏', 'piān', 58, 64], ['散', 'sàn', 78, 72], ['原', 'yuán', 10, 86], ['像', 'xiàng', 92, 88], ['微', 'wēi', 62, 88]];
function initTorch() {
  const torch = document.getElementById('torch');
  const words = document.getElementById('torchWords');
  const list = document.getElementById('foundList');
  const n = document.getElementById('foundN');
  document.getElementById('foundAll').textContent = HIDDEN.length;
  words.innerHTML = HIDDEN.map(([z, , x, y], i) => `<button type="button" class="ys-hid" data-i="${i}" style="left:${x}%;top:${y}%">${z}</button>`).join('');
  const aim = (e) => {
    const r = torch.getBoundingClientRect();
    torch.style.setProperty('--x', `${e.clientX - r.left}px`);
    torch.style.setProperty('--y', `${e.clientY - r.top}px`);
    torch.classList.add('on');
  };
  torch.addEventListener('pointermove', aim);
  torch.addEventListener('pointerdown', aim);
  words.addEventListener('click', (e) => {
    const b = e.target.closest('.ys-hid:not(.found)');
    if (!b) return;
    b.classList.add('found');
    const [z, p] = HIDDEN[+b.dataset.i];
    list.insertAdjacentHTML('beforeend', `<span>${Hanzi.ruby(z, p)}</span>`);
    n.textContent = list.children.length;
  });
  document.getElementById('torchReset').addEventListener('click', () => {
    words.querySelectorAll('.ys-hid').forEach((b) => b.classList.remove('found'));
    list.innerHTML = '';
    n.textContent = '0';
    torch.classList.remove('on');
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    const cmp = document.getElementById('cmp');
    document.getElementById('ysSwitch').addEventListener('click', () => cmp.classList.toggle('after'));
    document.getElementById('beads').addEventListener('click', (e) => {
      const b = e.target.closest('.ys-bead-z');
      if (b) b.parentElement.classList.toggle('open');
    });
    initTorch();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
