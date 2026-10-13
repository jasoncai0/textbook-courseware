'use strict';
/* 灰雀 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 2 题：对话时各自心里想什么（背面只是一种推断） */
const CLUE_LABELS = ['他说', '他心里可能在想'];
const CLUES = [
  { q: '<b>列宁：</b>“孩子，你看见过一只深红色胸脯的灰雀吗？”', a: '那只最好看的灰雀去哪儿了？会不会是这个孩子知道？' },
  { q: '<b>男孩：</b>“没……我没看见。”', a: '糟了！灰雀在我家里……我不敢说，怕他批评我。' },
  { q: '<b>列宁：</b>“一定是飞走了或者是冻死了。天气严寒，它怕冷。”', a: '（列宁看出男孩很紧张）我这样说，看看他会怎么做。' },
  { q: '<b>列宁：</b>“多好的灰雀呀，可惜再也飞不回来了。”', a: '真舍不得它呀！孩子，你听见了吗？' },
  { q: '<b>男孩：</b>“会飞回来的，一定会飞回来的。它还活着。”', a: '他这么喜欢那只灰雀，我不能让他伤心。我要把灰雀放回来！' },
  { q: '<b>列宁：</b>“你好！灰雀，昨天你到哪儿去了？”', a: '我知道是你把它放回来的。你是个诚实的孩子，我就不再问了。' },
];

/* 排一排：男孩的心情变化（按正确顺序写，页面上会打乱） */
const ORDER = [
  { t: '“没……我没看见。”', feel: '心虚 · 害怕' },
  { t: '本来想告诉列宁，但又不敢讲', feel: '犹豫' },
  { t: '听到“可惜再也飞不回来了”', feel: '难过 · 后悔' },
  { t: '“一定会飞回来！”', feel: '下定决心' },
  { t: '第二天站在树旁，低着头', feel: '惭愧' },
];

/* 课后第 3 题：从哪里看出喜爱灰雀 */
const KINDS = ['列宁', '男孩'];
const SORT_ITEMS = [
  { s: '列宁每次走到白桦树下，都要停下来，仰望这三只欢快的灰雀', ok: ['列宁'], q: '“每次”“都要”' },
  { s: '还经常给它们带来面包渣和谷粒', ok: ['列宁'], q: '“经常”，天天记挂着' },
  { s: '他在周围的树林中找遍了，也没有找到', ok: ['列宁'], q: '“找遍了”，着急' },
  { s: '“多好的灰雀呀，可惜再也飞不回来了。”', ok: ['列宁'], q: '惋惜、舍不得' },
  { s: '“会飞回来的，一定会飞回来的。它还活着。”', ok: ['男孩'], q: '他把灰雀照顾得好好的' },
  { s: '灰雀欢蹦乱跳地在枝头歌唱', ok: ['男孩', '列宁'], q: '男孩放回了它，列宁看见它很高兴' },
];

const MOMENTS = [
  {
    name: '捉回灰雀那天', pic: 'baihua',
    prompt: '男孩为什么把那只深红胸脯的灰雀捉回家？那天他心里是怎么想的？',
    hint: '想一想：这只灰雀有什么特别？男孩喜欢它吗？',
    example: '这只灰雀的胸脯红红的，唱歌那么好听，我太喜欢它了！要是把它带回家，我就能天天听它唱歌了……',
  },
  {
    name: '放回灰雀的早上', pic: 'huilai',
    prompt: '第二天一早，男孩把灰雀放回了白桦树。放走它的时候，男孩心里在想什么？',
    hint: '想一想：他为什么决定放回来？他还舍得吗？',
    example: '小灰雀，回到你的树上去吧。那位叔叔那么喜欢你，找你找得好着急。我不该把你关在笼子里，对不起……',
  },
  {
    name: '列宁微笑的时候', pic: 'duihua',
    prompt: '列宁看看男孩，又看看灰雀，微笑着说：“你好！灰雀……”这时男孩低着头，他心里会想什么？',
    hint: '男孩听出列宁话里的意思了吗？他会害怕，还是感激？',
    example: '他一定知道是我了……可他没有批评我，还在对灰雀笑。我以后再也不做这样的事了。',
  },
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
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, kinds: KINDS, sort: SORT_ITEMS, moments: MOMENTS });
    const box = document.getElementById('order');
    if (box) initOrder(box, ORDER);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
