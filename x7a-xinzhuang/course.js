'use strict';
/* 皇帝的新装 · 本课数据与互动（阅读计时、舞台剧角色、谎言传递链、选择分支）。翻页引擎见 ../shared/deck.js */

/* 谎言传递链：k = lie 假话 / truth 真话；生成的节点带 data-step，必须在 deck.js 统计分步之前 */
const CHAIN = [
  { who: '两个骗子', k: 'lie', said: '“任何不称职的或者愚蠢得不可救药的人，都看不见这衣服。”', fear: '为了骗钱、骗丝和金子，编出第一个谎' },
  { who: '皇帝', k: 'lie', said: '先派“诚实的老大臣”去看', fear: '心里“有些不大自然”：怕自己看不见' },
  { who: '老大臣', k: 'lie', said: '“哎呀，美极了！真是美妙极了！”', fear: '怕人知道自己“愚蠢”“不称职”' },
  { who: '另一位官员', k: 'lie', said: '“是的，那真是太美了！”', fear: '怕自己“不配有现在这样好的官职”' },
  { who: '皇帝', k: 'lie', said: '“哎呀，真是美极了！我十二分地满意！”', fear: '怕自己“不够资格当一个皇帝”' },
  { who: '全体随员', k: 'lie', said: '“这布是华丽的！精致的！无双的！”', fear: '每人都随声附和' },
  { who: '骑士们', k: 'lie', said: '“一点儿也不错。”', fear: '什么也看不见，却不敢说' },
  { who: '内臣', k: 'lie', said: '手中托着空气', fear: '“不敢让人瞧出他们实在什么东西也没有看见”' },
  { who: '街上的人', k: 'lie', said: '“乖乖！皇上的新装真是漂亮！”', fear: '怕“显出自己不称职，或是太愚蠢”' },
  { who: '一个小孩子', k: 'truth', said: '“可是他什么衣服也没有穿啊！”', fear: '天真，没有私心，什么也不怕' },
  { who: '所有的老百姓', k: 'truth', said: '“他实在没有穿什么衣服啊！”', fear: '真话一传十、十传百，谎言被戳穿' },
];
function buildChain() {
  document.getElementById('lieChain').innerHTML = CHAIN.map((c, i) =>
    `<button type="button" class="node ${c.k}" data-step="${i + 1}" data-i="${i}"><b>${c.who}</b><span>${c.k === 'lie' ? '说假话' : '说真话'}</span></button>`).join('<i class="arr">→</i>');
}
buildChain();

function initChain() {
  const box = document.getElementById('whyBox');
  document.getElementById('lieChain').addEventListener('click', (e) => {
    const n = e.target.closest('.node');
    if (!n) return;
    const c = CHAIN[+n.dataset.i];
    document.querySelectorAll('.node.cur').forEach((x) => x.classList.remove('cur'));
    n.classList.add('cur');
    box.innerHTML = `<b>${c.who}</b>　看见的：<em>${c.k === 'lie' && c.who !== '两个骗子' ? '什么也没有' : '什么也没有（真相）'}</em>　说的 / 做的：${c.said}　<b>心里：</b>${c.fear}`;
  });
}

/* 快速阅读计时：全文约 3000 字 */
const TOTAL_CHARS = 3000;
const GOAL = 400;
function initTimer() {
  const num = document.getElementById('timerNum');
  const go = document.getElementById('timerGo');
  const res = document.getElementById('timerRes');
  const bar = document.getElementById('timerBar');
  let start = 0;
  let tick = null;
  const fmt = (ms) => { const s = Math.floor(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
  const stop = () => { clearInterval(tick); tick = null; };
  go.onclick = () => {
    if (!tick && !start) {
      start = Date.now();
      tick = setInterval(() => { num.textContent = fmt(Date.now() - start); }, 250);
      go.textContent = '读完了';
      return;
    }
    if (!tick) return;
    stop();
    const min = (Date.now() - start) / 60000;
    const speed = Math.round(TOTAL_CHARS / Math.max(min, 0.05));
    res.innerHTML = `用时 ${fmt(Date.now() - start)}，约每分钟 <b>${speed}</b> 字。${speed >= GOAL ? '达到目标！' : '还没到 400 字，下次试着扩大视野、少回读。'}`;
    bar.style.width = `${Math.min(100, speed / 6)}%`;
    go.textContent = '开始计时';
    start = 0;
  };
  document.getElementById('timerReset').onclick = () => {
    stop(); start = 0; num.textContent = '00:00'; go.textContent = '开始计时'; bar.style.width = '0';
    res.textContent = `全文约 ${TOTAL_CHARS} 字。读完后点“读完了”，算出你的速度。`;
  };
}

/* 舞台剧：右上角选角色，台词高亮；当前说话的角色在舞台上亮起来 */
function initPlay() {
  document.querySelectorAll('.s-play').forEach((slide) => {
    const roles = [...slide.querySelectorAll('.cast span')];
    const pick = slide.querySelector('.role-pick');
    pick.innerHTML = `<small>分角色读：</small><button type="button" class="btn solid" data-r="">全部</button>${roles.map((r) => `<button type="button" class="btn" data-r="${r.dataset.role}">${r.textContent}</button>`).join('')}`;
    pick.addEventListener('click', (e) => {
      const b = e.target.closest('[data-r]');
      if (!b) return;
      pick.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
      slide.querySelectorAll('.ln').forEach((ln) => {
        ln.classList.toggle('mine', Boolean(b.dataset.r) && ln.dataset.role === b.dataset.r);
        ln.classList.toggle('dim', Boolean(b.dataset.r) && ln.dataset.role !== b.dataset.r);
      });
    });
  });
}
function updateSpeaker(slide, step) {
  if (!slide.classList.contains('s-play')) return;
  let role = '';
  slide.querySelectorAll('.ln').forEach((ln) => { if (+ln.dataset.step <= step) role = ln.dataset.role; });
  slide.querySelectorAll('.ln').forEach((ln) => ln.classList.toggle('now', +ln.dataset.step === step));
  slide.querySelectorAll('.cast span').forEach((s) => s.classList.toggle('speaking', s.dataset.role === role));
}

const BRANCHES = [
  '你跟着喊“真漂亮！”——你保住了“聪明”的名声，可你也成了谎言链上的一环。回家后，你会不会觉得有点儿不对劲？',
  '你心里明白，却什么也没说。这样最安全，可是谎言因为你的沉默又多活了一会儿。沉默算不算一种附和？',
  '你大声说出了真相。也许会有人瞪你、骂你，但也可能像那个小孩子一样，让大家终于敢说“他实在没有穿什么衣服啊！”说真话需要勇气，也需要方法。',
];
function initBranch() {
  const out = document.getElementById('branchOut');
  document.querySelector('.branch-btns').addEventListener('click', (e) => {
    const b = e.target.closest('.branch');
    if (!b) return;
    document.querySelectorAll('.branch').forEach((x) => x.classList.toggle('cur', x === b));
    out.innerHTML = `<p>${BRANCHES[+b.dataset.b]}</p>`;
    out.classList.remove('pop'); void out.offsetWidth; out.classList.add('pop');
  });
}

const MOMENTS = [
  {
    name: '游行结束后的宫殿', pic: 'jingzi',
    prompt: '游行大典终于结束了，皇帝回到宫里，站在那面大镜子前……接下来会发生什么？',
    hint: '皇帝爱面子，他会承认自己受骗吗？大臣们会怎样说？想象要符合人物性格。',
    example: '回到宫里，皇帝一屁股坐在宝座上，脸涨得通红。“把那两个织工给我带来！”可是御聘织师的屋子早就空了，织布机上只留下一根亮晶晶的蜘蛛丝。老大臣赶紧上前：“陛下，依臣看，那衣服……确实是有的，只是百姓们太愚蠢……”皇帝瞪了他一眼，半天没说话。',
  },
  {
    name: '骗子去了别的国家', pic: 'zhibu',
    prompt: '两个骗子带着金子和爵士头衔，来到了另一个国家，又想故技重施……',
    hint: '这一次，他们会遇到怎样的国王、怎样的百姓？骗局会成功吗？',
    example: '两个骗子来到邻国，又摆出两架空织布机。可是这里的国王说：“好啊，先织一块手帕给我看看。我看不见，就请全城的孩子来看。”骗子的脸一下子白了……',
  },
  {
    name: '那个小孩子长大后', pic: 'haizi',
    prompt: '多年以后，那个说真话的小孩子长大了。他会成为一个怎样的人？',
    hint: '他还会坚持说真话吗？会遇到什么新的“新装”？',
    example: '许多年后，那个孩子当上了城里的法官。有人送来一卷“只有公正的人才看得见”的判决书，他打开一看，里面一个字也没有。他笑着摇摇头：“我看不见。请拿一份真正写了字的来。”',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initTimer();
    initPlay();
    initChain();
    initBranch();
    document.querySelectorAll('.probe .btn').forEach((b) => b.addEventListener('click', () => b.closest('.probe').classList.toggle('open')));
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateSpeaker(slide, step);
  },
};
