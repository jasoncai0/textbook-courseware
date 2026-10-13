'use strict';
/* 古诗词诵读（一）· 本课数据。诗文模板见 ../shared/poem.js，归类见 ../shared/narrative.js
 * 注释：课本注释照录；课本没有、为帮助理解补上的，标“（补充）” */

const POEMS = {
  cw: {
    title: '采薇（节选）', author: '《诗经·小雅》',
    lines: [
      { t: '昔我往矣，', r: '昔我/往矣，', f: '1.15 45% 55%' },
      { t: '杨柳依依。', r: '杨柳/依依。', f: '1.25 40% 40%' },
      { t: '今我来思，', r: '今我/来思，', f: '1.1 50% 50%' },
      { t: '雨雪霏霏。', r: '雨雪/霏霏。', f: '1.05 50% 30%' },
      { t: '行道迟迟，', r: '行道/迟迟，', f: '1.2 45% 70%' },
      { t: '载渴载饥。', r: '载渴/载饥。', f: '1.3 45% 65%' },
      { t: '我心伤悲，', r: '我心/伤悲，', f: '1.08 50% 50%' },
      { t: '莫知我哀！', r: '莫知/我哀！', f: '1.02 50% 50%' },
    ],
    notes: {
      昔: '从前，指出征时', 往: '指当初去从军', 依依: '形容柳丝轻轻随风摇曳的样子', 思: '句末语气词，没有实在意义',
      雨雪: '指下雪。“雨”，这里读 yù', 霏霏: '雪下得很大的样子', 迟迟: '迟缓的样子', 载: '则，又', 莫: '没有人',
    },
  },
  yr: {
    title: '送元二使安西', author: '［唐］王维',
    lines: [
      { t: '渭城朝雨浥轻尘，', r: '渭城/朝雨/浥轻尘，', f: '1.15 50% 70%' },
      { t: '客舍青青柳色新。', r: '客舍/青青/柳色新。', f: '1.2 40% 45%' },
      { t: '劝君更尽一杯酒，', r: '劝君/更尽/一杯酒，', f: '1.3 45% 60%' },
      { t: '西出阳关无故人。', r: '西出/阳关/无故人。', f: '1.05 70% 45%' },
    ],
    notes: {
      渭城: '秦时咸阳城，汉代改称渭城，在今陕西咸阳东北，位于渭水北岸', 浥: '湿润，沾湿', 阳关: '古关名，故址在今甘肃敦煌西南',
      朝雨: '早晨的雨。朝，读 zhāo（补充）', 客舍: '旅店（补充）', 更: '再（补充）', 故人: '老朋友（补充）',
    },
  },
  cy: {
    title: '春夜喜雨', author: '［唐］杜甫',
    lines: [
      { t: '好雨知时节，', r: '好雨/知时节，', f: '1.05 50% 40%' },
      { t: '当春乃发生。', r: '当春/乃发生。', f: '1.08 50% 50%' },
      { t: '随风潜入夜，', r: '随风/潜入夜，', f: '1.12 50% 35%' },
      { t: '润物细无声。', r: '润物/细无声。', f: '1.2 50% 65%' },
      { t: '野径云俱黑，', r: '野径/云俱黑，', f: '1.08 40% 45%' },
      { t: '江船火独明。', r: '江船/火独明。', f: '1.35 55% 65%' },
      { t: '晓看红湿处，', r: '晓看/红湿处，', f: '1.04 50% 50%' },
      { t: '花重锦官城。', r: '花重/锦官城。', f: '1.04 50% 50%' },
    ],
    notes: {
      发生: '使植物萌发、生长', 野径: '田野间的小路', 红湿处: '被雨水打湿的花丛', 花重: '花因为饱含雨水而显得沉重',
      锦官城: '成都的别称。成都曾经是主持织锦的官员的官署所在地，所以叫“锦官城”', 乃: '就（补充）', 潜: '悄悄地（补充）',
    },
  },
  zc: {
    title: '早春呈水部张十八员外', author: '［唐］韩愈',
    lines: [
      { t: '天街小雨润如酥，', r: '天街/小雨/润如酥，', f: '1.12 50% 40%' },
      { t: '草色遥看近却无。', r: '草色/遥看/近却无。', f: '1.2 50% 75%' },
      { t: '最是一年春好处，', r: '最是/一年/春好处，', f: '1.05 50% 50%' },
      { t: '绝胜烟柳满皇都。', r: '绝胜/烟柳/满皇都。', f: '1.15 70% 40%' },
    ],
    notes: { 天街: '京城街道', 润如酥: '形容春雨滋润细腻。酥，酥油', 处: '时', 绝胜: '远远胜过', 皇都: '京城（补充）' },
  },
  jy: {
    title: '江上渔者', author: '［宋］范仲淹',
    lines: [
      { t: '江上往来人，', r: '江上/往来人，', f: '1.12 40% 70%' },
      { t: '但爱鲈鱼美。', r: '但爱/鲈鱼美。', f: '1.25 35% 70%' },
      { t: '君看一叶舟，', r: '君看/一叶舟，', f: '1.2 60% 50%' },
      { t: '出没风波里。', r: '出没/风波里。', f: '1.35 60% 50%' },
    ],
    notes: { 但: '单单，只是', 鲈鱼: '一种味道鲜美的鱼（补充）', 出没: '一会儿看得见，一会儿看不见（补充）' },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

/* 诗中有画 · 主题归类（一首诗可以有不止一个答案） */
const KINDS = ['戍边', '送别', '春景', '民生'];
const SORT_ITEMS = [
  { s: '《采薇》：今我来思，雨雪霏霏。', ok: ['戍边'], q: '士兵从边地回家，满怀伤悲' },
  { s: '《送元二使安西》：劝君更尽一杯酒，西出阳关无故人。', ok: ['送别'], q: '渭城送友，再饮一杯' },
  { s: '《春夜喜雨》：随风潜入夜，润物细无声。', ok: ['春景'], q: '春夜好雨，悄悄滋润万物' },
  { s: '《早春呈水部张十八员外》：草色遥看近却无。', ok: ['春景'], q: '早春小雨，草色若有若无' },
  { s: '《江上渔者》：君看一叶舟，出没风波里。', ok: ['民生'], q: '吃鱼的人，要想到打鱼人的辛苦' },
];

/* 名句品读 · 换字比较：点一个字放进空格，看看和原句比有什么不同 */
const SWAPS = {
  qian: {
    before: '随风', after: '入夜，润物细无声。', ans: '潜',
    opts: [
      { w: '飘', why: '“飘”只写出雨随风飘落，看不出雨的心思。' },
      { w: '落', why: '“落”很普通，雨好像是“掉”下来的。' },
      { w: '洒', why: '“洒”的雨大而急，就不是“细无声”了。' },
      { w: '潜', why: '“潜”是悄悄地、不声不响地来——春雨像懂事的人，趁夜里不打扰人，默默滋润万物。' },
    ],
  },
};

function initSwap(box) {
  const d = SWAPS[box.dataset.swap];
  box.innerHTML = `<p class="swap-line">${d.before}<span class="slot">？</span>${d.after}</p>
    <div class="btns">${d.opts.map((o, i) => `<button type="button" class="btn" data-i="${i}">${o.w}</button>`).join('')}</div>
    <p class="swap-why"></p>`;
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-i]');
    if (!btn) return;
    const o = d.opts[+btn.dataset.i];
    const isBest = o.w === d.ans;
    box.querySelector('.slot').textContent = o.w;
    box.classList.toggle('best', isBest);
    box.querySelectorAll('button[data-i]').forEach((b) => b.classList.toggle('solid', b === btn));
    box.querySelector('.swap-why').textContent = isBest ? `原诗用“${o.w}”：${o.why}` : o.why;
  });
}

/* 背诵：一次只看一首，按钮切换 */
function initReciteTabs(box) {
  const show = (id) => {
    box.querySelectorAll('[data-show]').forEach((b) => b.classList.toggle('solid', b.dataset.show === id));
    box.querySelectorAll('.recite').forEach((r) => { r.hidden = r.dataset.recite !== id; });
  };
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-show]');
    if (btn) show(btn.dataset.show);
  });
  show(box.querySelector('[data-show]').dataset.show);
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS });
    Poem.init();
    document.querySelectorAll('[data-swap]').forEach(initSwap);
    document.querySelectorAll('.recite-one').forEach(initReciteTabs);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
