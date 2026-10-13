'use strict';
/* 古诗词诵读（二）· 本课数据。诗文模板见 ../shared/poem.js，归类见 ../shared/narrative.js
 * 注释：课本注释照录；课本没有、为帮助理解补上的，标“（补充）”。注释词不能跨越节奏线，整句注释挂在句尾词上 */

const POEMS = {
  bc: {
    title: '泊船瓜洲', author: '［宋］王安石',
    lines: [
      { t: '京口瓜洲一水间，', r: '京口/瓜洲/一水间，', f: '1.12 50% 60%' },
      { t: '钟山只隔数重山。', r: '钟山/只隔/数重山。', f: '1.15 50% 35%' },
      { t: '春风又绿江南岸，', r: '春风/又绿/江南岸，', f: '1.2 50% 55%' },
      { t: '明月何时照我还。', r: '明月/何时/照我还。', f: '1.25 60% 25%' },
    ],
    notes: {
      京口: '在今江苏镇江，位于长江南岸', 瓜洲: '在今江苏扬州一带，位于长江北岸', 钟山: '今江苏南京紫金山',
      一水间: '只隔着一条江水（补充）', 数重: '几层（补充）', 绿: '吹绿，使……变绿（补充）', 还: '回去，读 huán（补充）',
    },
  },
  yy: {
    title: '游园不值', author: '［宋］叶绍翁',
    lines: [
      { t: '应怜屐齿印苍苔，', r: '应怜/屐齿/印苍苔，', f: '1.3 45% 75%' },
      { t: '小扣柴扉久不开。', r: '小扣/柴扉/久不开。', f: '1.2 45% 55%' },
      { t: '春色满园关不住，', r: '春色/满园/关不住，', f: '1.05 50% 45%' },
      { t: '一枝红杏出墙来。', r: '一枝/红杏/出墙来。', f: '1.3 55% 25%' },
    ],
    notes: {
      应: '大概，表示猜测', 怜: '怜惜', 屐齿: '指木屐底下突出的部分。屐，木鞋', 印苍苔: '在青苔上留下印迹',
      小扣: '轻轻地敲', 柴扉: '用木柴、树枝编成的门',
    },
  },
  bsz: {
    title: '卜算子·送鲍浩然之浙东', author: '［宋］王观',
    lines: [
      { t: '水是眼波横，', r: '水是/眼波横，', f: '1.15 50% 70%' },
      { t: '山是眉峰聚。', r: '山是/眉峰聚。', f: '1.15 50% 30%' },
      { t: '欲问行人去那边？', r: '欲问/行人/去那边？', f: '1.2 55% 55%' },
      { t: '眉眼盈盈处。', r: '眉眼/盈盈处。', f: '1.08 50% 50%' },
      { t: '才始送春归，', r: '才始/送春归，', f: '1.04 50% 50%' },
      { t: '又送君归去。', r: '又送/君归去。', f: '1.2 55% 55%' },
      { t: '若到江南赶上春，', r: '若到/江南/赶上春，', f: '1.08 50% 45%' },
      { t: '千万和春住。', r: '千万/和春住。', f: '1.04 50% 50%' },
    ],
    notes: {
      眼波横: '“水是眼波横”：水像美人流动的眼波', 眉峰聚: '“山是眉峰聚”：山如美人蹙起的眉毛', 那: '同“哪”',
      盈盈处: '“眉眼盈盈处”：山水交汇的地方。盈盈，仪态美好的样子', 才始: '方才', 行人: '远行的人，指鲍浩然（补充）',
    },
  },
  hxs: {
    title: '浣溪沙', author: '［宋］苏轼',
    lines: [
      { t: '游蕲水清泉寺，寺临兰溪，溪水西流。', f: '1.04 50% 50%' },
      { t: '山下兰芽短浸溪，', r: '山下/兰芽/短浸溪，', f: '1.25 45% 75%' },
      { t: '松间沙路净无泥。', r: '松间/沙路/净无泥。', f: '1.15 50% 60%' },
      { t: '萧萧暮雨子规啼。', r: '萧萧/暮雨/子规啼。', f: '1.2 60% 35%' },
      { t: '谁道人生无再少？', r: '谁道/人生/无再少？', f: '1.04 50% 50%' },
      { t: '门前流水尚能西！', r: '门前/流水/尚能西！', f: '1.15 45% 70%' },
      { t: '休将白发唱黄鸡。', r: '休将/白发/唱黄鸡。', f: '1.04 50% 50%' },
    ],
    notes: {
      蕲水: '在今湖北浠水一带', 短浸溪: '指初生的兰芽浸润在溪水中', 萧萧: '这里形容雨声', 子规: '杜鹃鸟',
      无再少: '不能再回到少年时代', 唱黄鸡: '“休将白发唱黄鸡”：不要因老去而悲叹。唱黄鸡，语出白居易“黄鸡催晓丑时鸣”，比喻时光流逝',
      尚能西: '还能向西流。我国的江河大多向东流（补充）',
    },
  },
  qpl: {
    title: '清平乐', author: '［宋］黄庭坚',
    lines: [
      { t: '春归何处？', r: '春归/何处？', f: '1.04 50% 50%' },
      { t: '寂寞无行路。', r: '寂寞/无行路。', f: '1.15 45% 70%' },
      { t: '若有人知春去处，', r: '若有人/知春去处，', f: '1.08 50% 50%' },
      { t: '唤取归来同住。', r: '唤取/归来/同住。', f: '1.12 50% 55%' },
      { t: '春无踪迹谁知？', r: '春无/踪迹/谁知？', f: '1.04 50% 50%' },
      { t: '除非问取黄鹂。', r: '除非/问取/黄鹂。', f: '1.3 55% 35%' },
      { t: '百啭无人能解，', r: '百啭/无人/能解，', f: '1.25 55% 35%' },
      { t: '因风飞过蔷薇。', r: '因风/飞过/蔷薇。', f: '1.2 50% 60%' },
    ],
    notes: { 无行路: '没有留下春去的行踪', 啭: '鸟婉转地鸣叫', 因风: '借着风势。因，凭借', 唤取: '唤来（补充）', 问取: '问一问（补充）' },
  },
};
// 背诵用：浣溪沙去掉词前小序
POEMS.hxsR = { ...POEMS.hxs, lines: POEMS.hxs.lines.slice(1) };
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

/* 主题归类 */
const KINDS = ['思乡', '送别', '赏春惜春', '抒怀'];
const SORT_ITEMS = [
  { s: '《泊船瓜洲》：春风又绿江南岸，明月何时照我还。', ok: ['思乡'], q: '江南又绿了，我何时回家？' },
  { s: '《游园不值》：春色满园关不住，一枝红杏出墙来。', ok: ['赏春惜春'], q: '一枝红杏，看见满园春色' },
  { s: '《卜算子》：才始送春归，又送君归去。', ok: ['送别'], q: '刚送走春天，又送走朋友' },
  { s: '《浣溪沙》：谁道人生无再少？门前流水尚能西！', ok: ['抒怀'], q: '溪水西流，人也能重新振作' },
  { s: '《清平乐》：春归何处？寂寞无行路。', ok: ['赏春惜春'], q: '春天去了哪里？寻春、惜春' },
];

/* 名句品读 · 换字比较 */
const SWAPS = {
  lv: {
    before: '春风又', after: '江南岸，', ans: '绿',
    opts: [
      { w: '到', why: '“到”只说春风来了，看不见春天的样子。' },
      { w: '过', why: '“过”像春风一吹就走了，没留下什么。' },
      { w: '入', why: '“入”写春风进来了，还是看不见颜色。' },
      { w: '满', why: '“满”说春风到处都是，可春风看不见、摸不着。' },
      { w: '绿', why: '“绿”把看不见的春风变成了看得见的颜色：春风吹过，江南岸一片新绿，有颜色，有变化，有生机。' },
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
