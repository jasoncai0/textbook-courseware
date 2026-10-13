'use strict';
/* 曹冲称象 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：称象实验（赶象上船—画线—赶象上岸—装石头到线—称石头，按顺序一步步做）、排序讲过程、“装石头”识字游戏 */

Hanzi.init({
  shapes: {
    舟: ['M32 10C24 40 24 70 34 92', 'M68 10C76 40 76 70 66 92', 'M32 10H68', 'M30 40H70', 'M42 58L56 70', 'M30 92H68'],
    止: ['M36 92C34 64 36 40 46 16', 'M46 16L58 28', 'M50 56L74 44', 'M24 92H76'],
  },
  cards: [
    { z: '曹', py: 'cáo', bs: '曰', bh: 11, words: [['曹冲', 'cáo chōng'], ['曹操', 'cáo cāo']] },
    { z: '称', py: 'chēng', bs: '禾', bh: 10, words: [['称象', 'chēng xiàng'], ['称一称', 'chēng yi chēng']] },
    { z: '员', py: 'yuán', bs: '口', bh: 7, words: [['官员', 'guān yuán'], ['队员', 'duì yuán']] },
    { z: '根', py: 'gēn', bs: '木', bh: 10, words: [['四根', 'sì gēn'], ['树根', 'shù gēn']] },
    { z: '柱', py: 'zhù', bs: '木', bh: 9, words: [['柱子', 'zhù zi'], ['石柱', 'shí zhù']] },
    { z: '议', py: 'yì', bs: '讠', bh: 5, words: [['议论', 'yì lùn'], ['会议', 'huì yì']] },
    { z: '论', py: 'lùn', bs: '讠', bh: 6, words: [['议论', 'yì lùn'], ['讨论', 'tǎo lùn']] },
    { z: '重', py: 'zhòng', bs: '里', bh: 9, words: [['多重', 'duō zhòng'], ['重量', 'zhòng liàng']] },
    { z: '杆', py: 'gǎn', bs: '木', bh: 7, words: [['秤杆', 'chèng gǎn'], ['一杆秤', 'yì gǎn chèng']] },
    { z: '秤', py: 'chèng', bs: '禾', bh: 10, words: [['大秤', 'dà chèng'], ['秤杆', 'chèng gǎn']] },
    { z: '砍', py: 'kǎn', bs: '石', bh: 9, words: [['砍树', 'kǎn shù'], ['砍柴', 'kǎn chái']] },
    { z: '线', py: 'xiàn', bs: '纟', bh: 8, words: [['画线', 'huà xiàn'], ['一条线', 'yì tiáo xiàn']] },
    { z: '止', py: 'zhǐ', bs: '止', bh: 4, words: [['为止', 'wéi zhǐ'], ['停止', 'tíng zhǐ']] },
    { z: '量', py: 'liàng', bs: '日', bh: 12, words: [['重量', 'zhòng liàng'], ['力量', 'lì liàng']] },
  ],
  evolve: [
    { z: '船', old: '舟', note: '左边的“舟”像一条小船：两边是船帮，中间是横木。所以“船”是舟字旁。' },
    { z: '止', note: '像一只脚：脚停下来不走了，就是“止”。“装到画线的地方为止”，就是装到那里停下来。' },
  ],
  write: [
    { z: '称', py: 'chēng', bs: '禾', bh: 10 },
    { z: '柱', py: 'zhù', bs: '木', bh: 9 },
    { z: '底', py: 'dǐ', bs: '广', bh: 8 },
    { z: '杆', py: 'gǎn', bs: '木', bh: 7 },
    { z: '秤', py: 'chèng', bs: '禾', bh: 10 },
    { z: '做', py: 'zuò', bs: '亻', bh: 11 },
    { z: '岁', py: 'suì', bs: '山', bh: 6 },
    { z: '站', py: 'zhàn', bs: '立', bh: 10 },
    { z: '船', py: 'chuán', bs: '舟', bh: 11 },
    { z: '然', py: 'rán', bs: '灬', bh: 12 },
  ],
});

const STORY = {
  picks: {
    why: [
      { t: '大象不能直接称，石头可以一块一块地称', ok: true, why: '对！大象太重，石头分开称就容易了' },
      { t: '船沉到同一条线，石头和大象一样重', ok: true, why: '对！这就是画线的用处' },
      { t: '要砍一棵大树做秤杆', ok: false, why: '这是官员们的办法' },
      { t: '要找一个力气特别大的人', ok: false, why: '谁也提不起这杆大秤' },
    ],
  },
};

/* ---------- 称象实验：按顺序一步步做 ---------- */
const STONES_FULL = 8;          // 装几块石头正好沉到线
const SINK = 18;                // 大象上船时船下沉多少（SVG 坐标）
const SHORE = [78, 236];        // 大象在岸上的位置
const DECK = [480, 236];        // 大象在船上的位置
const STEP_TEXT = {
  1: ['把大象赶到一艘大船上，看船身下沉多少，', 'bǎ dà xiàng gǎn dào yì sōu dà chuán shàng kàn chuán shēn xià chén duō shǎo'],
  2: ['就沿着水面，在船舷上画一条线。', 'jiù yán zhe shuǐ miàn zài chuán xián shàng huà yì tiáo xiàn'],
  3: ['再把大象赶上岸，', 'zài bǎ dà xiàng gǎn shàng àn'],
  4: ['往船上装石头，装到船下沉到画线的地方为止。', 'wǎng chuán shàng zhuāng shí tou zhuāng dào chuán xià chén dào huà xiàn de dì fang wéi zhǐ'],
  5: ['然后称一称船上的石头。石头有多重，大象就有多重。', 'rán hòu chēng yi chēng chuán shàng de shí tou shí tou yǒu duō zhòng dà xiàng jiù yǒu duō zhòng'],
};
const HINTS = {
  0: '点 ①，把大象赶到船上。',
  1: '船沉下去了！点 ②，沿着水面画一条线。',
  2: '线画好了。点 ③，把大象赶上岸。',
  3: '大象上岸，船浮起来了，红线露出了水面。点 ④，一块一块装石头。',
  4: '还没到线，继续点 ④ 装石头。',
  5: '石头装到线了！点 ⑤，一块一块称石头。',
  6: '石头有多重，大象就有多重！',
};

function initSim() {
  const $ = (id) => document.getElementById(id);
  const boat = $('cxBoat');
  const ele = $('cxEle');
  const mark = $('cxMark');
  const stonesG = $('cxStones');
  const say = $('cxSay');
  const hint = $('cxHint');
  const scale = $('cxScale');
  const count = $('cxCount');
  let state = 0;
  let stones = 0;
  let onBoat = false;
  let timer = 0;

  const sink = () => (onBoat ? SINK : (stones / STONES_FULL) * SINK);
  const draw = () => {
    const s = sink();
    boat.style.transform = `translateY(${s}px)`;
    const [x, y] = onBoat ? DECK : SHORE;
    ele.style.transform = `translate(${x}px, ${y + (onBoat ? s : 0)}px)`;
  };
  const speak = (k) => { say.innerHTML = `<p>${Hanzi.ruby(...STEP_TEXT[k])}</p>`; };
  const addStone = (i) => {
    const x = 300 + (i % 4) * 92 + (i >= 4 ? 40 : 0);
    const y = i >= 4 ? 206 : 222;
    stonesG.insertAdjacentHTML('beforeend', `<ellipse class="cx-stone" cx="${x}" cy="${y}" rx="38" ry="16"/>`);
  };
  const reset = () => {
    clearInterval(timer);
    state = 0; stones = 0; onBoat = false;
    stonesG.innerHTML = '';
    mark.classList.remove('on');
    scale.classList.remove('on');
    count.textContent = '';
    say.innerHTML = '';
    hint.textContent = HINTS[0];
    document.querySelectorAll('#cxSteps .btn').forEach((b) => b.classList.remove('solid', 'wrong'));
    draw();
  };
  const weigh = () => {
    let n = 0;
    timer = setInterval(() => {
      const st = stonesG.querySelector('.cx-stone:not(.gone)');
      if (!st) {
        clearInterval(timer);
        count.textContent = `${n} 块加起来 = 大象的重量`;
        hint.textContent = HINTS[6];
        return;
      }
      st.classList.add('gone');
      n += 1;
      stones -= 1;
      count.textContent = `称了 ${n} 块`;
      draw();
    }, 600);
  };
  const ACT = {
    1: () => { onBoat = true; },
    2: () => { mark.classList.add('on'); },
    3: () => { onBoat = false; },
    4: () => { addStone(stones); stones += 1; },
    5: () => { scale.classList.add('on'); weigh(); },
  };

  $('cxSteps').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    const k = +b.dataset.k;
    // 第 4 步要点好几下：装满之前一直停在第 4 步
    const expect = state === 4 && stones < STONES_FULL ? 4 : state + 1;
    if (k !== expect || state >= 5) {
      b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
      hint.textContent = state >= 5 ? '已经做完啦，可以“重新来一遍”。' : `先做第 ${expect} 步哦。`;
      return;
    }
    ACT[k]();
    speak(k);
    b.classList.add('solid');
    state = k === 4 && stones < STONES_FULL ? 4 : k;
    if (k === 4) hint.textContent = stones < STONES_FULL ? `${HINTS[4]}（已经装了 ${stones} 块）` : HINTS[5];
    else hint.textContent = HINTS[k];
    draw();
  });
  $('cxReset').addEventListener('click', reset);
  reset();
}

/* ---------- 排一排：按顺序点卡片 ---------- */
const SORT = [
  ['赶象上船', '_ _ _ _'],
  ['在船舷上做记号', '_ _ xián _ _ _ _'],
  ['把大象赶上岸，往船上装石头', '_ _ _ _ _ àn _ _ _ _ _ _'],
  ['称石头的重量', '_ _ _ _ _ _'],
];
function initSort() {
  const box = document.getElementById('cxSort');
  const order = [2, 0, 3, 1]; // 打乱后的显示顺序
  box.innerHTML = order.map((i) => `<button type="button" class="cx-sc" data-i="${i}"><i></i><span class="py">${Hanzi.ruby(...SORT[i])}</span></button>`).join('')
    + '<button type="button" class="btn cx-sreset">重排</button>';
  let next = 0;
  box.addEventListener('click', (e) => {
    if (e.target.closest('.cx-sreset')) {
      next = 0;
      box.querySelectorAll('.cx-sc').forEach((c) => { c.classList.remove('ok'); c.querySelector('i').textContent = ''; });
      box.classList.remove('done');
      return;
    }
    const c = e.target.closest('.cx-sc:not(.ok)');
    if (!c) return;
    if (+c.dataset.i !== next) { c.classList.remove('wrong'); void c.offsetWidth; c.classList.add('wrong'); return; }
    next += 1;
    c.classList.add('ok');
    c.querySelector('i').textContent = next;
    box.classList.toggle('done', next === SORT.length);
  });
}

/* ---------- 识字游戏：装石头 ---------- */
const GAME = [['曹', 'cáo'], ['称', 'chēng'], ['员', 'yuán'], ['根', 'gēn'], ['柱', 'zhù'], ['议', 'yì'], ['论', 'lùn'], ['重', 'zhòng'], ['杆', 'gǎn'], ['秤', 'chèng'], ['砍', 'kǎn'], ['线', 'xiàn'], ['止', 'zhǐ'], ['量', 'liàng']];
const GAME_SINK = 24;
function initGame() {
  const pile = document.getElementById('cxPile');
  const load = document.getElementById('cxGLoad');
  const boat = document.getElementById('cxGBoat');
  const msg = document.getElementById('cxGMsg');
  pile.innerHTML = GAME.map(([z, p], i) => `<button type="button" class="cx-rock" data-i="${i}">${Hanzi.ruby(z, p)}</button>`).join('');
  const update = () => {
    const n = load.children.length;
    boat.style.transform = `translateY(${(n / GAME.length) * GAME_SINK}px)`;
    msg.textContent = n === GAME.length ? '到线了！石头装好了！' : `装了 ${n} 块`;
  };
  pile.addEventListener('click', (e) => {
    const r = e.target.closest('.cx-rock:not(.used)');
    if (!r) return;
    const n = load.children.length;
    r.classList.add('used');
    load.insertAdjacentHTML('beforeend', `<ellipse class="cx-stone pop" cx="${110 + (n % 7) * 64}" cy="${n < 7 ? 70 : 52}" rx="30" ry="13"/>`);
    update();
  });
  document.getElementById('cxGReset').addEventListener('click', () => {
    load.innerHTML = '';
    pile.querySelectorAll('.cx-rock').forEach((r) => r.classList.remove('used'));
    update();
  });
  update();
}

window.LESSON = {
  init() {
    Narrative.init(STORY);
    initSim();
    initSort();
    initGame();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
