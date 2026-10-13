'use strict';
/* 秋天的怀念 · 本课数据与互动。画面、字幕、小练笔见 ../shared/narrative.js */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ================= “好好儿活”情感线：图上的圆点 ================= */
const FEEL = [
  { tag: '第 1 段 · 母亲说', quote: '母亲扑过来抓住我的手，忍住哭声说：“咱娘儿俩在一块儿，<em>好好儿活</em>，好好儿活……”',
    mean: '第一声：“我”喊“我可活什么劲儿”，母亲扑过来抓住“我”的手——<b>别放弃，要活下去</b>。' },
  { tag: '第 1 段 · 母亲又说', quote: '……好好儿活，<em>好好儿活</em>……',
    mean: '第二声：重复，是恳求，也是给自己打气。“咱娘儿俩在一块儿”——<b>妈妈陪着你，我们一起好好活</b>。她自己已身患重病，却瞒着儿子。' },
  { tag: '第 3 段 · 看花', quote: '“北海的菊花开了，我推着你去看看吧。”她憔悴的脸上现出央求般的神色。',
    mean: '没有说“好好儿活”，却是在做“好好儿活”：<b>带儿子走出屋子，重新热爱生活</b>。“看花”是母亲一次次的努力。' },
  { tag: '第 6 段 · 没说完的话', quote: '“我那个有病的儿子和我那个还未成年的女儿……”',
    mean: '母亲最后的牵挂全在儿女身上。省略号里没说完的，就是：<b>你们要好好儿活</b>。' },
  { tag: '第 7 段 · “我”说', quote: '我懂得母亲没有说完的话。妹妹也懂。我俩在一块儿，要<em>好好儿活</em>……',
    mean: '第三声：从母亲嘴里说到“我”的嘴里。“我俩在一块儿”呼应“咱娘儿俩在一块儿”——<b>“我”懂了，要坚强、有尊严地活下去，还要照顾妹妹</b>。' },
];

function initFeel() {
  const svg = document.getElementById('feel');
  const card = document.getElementById('feelCard');
  svg.addEventListener('click', (e) => {
    const node = e.target.closest('.node');
    if (!node) return;
    const f = FEEL[+node.dataset.k];
    svg.querySelectorAll('.node').forEach((n) => n.classList.toggle('cur', n === node));
    card.innerHTML = `<small>${f.tag}</small><p class="feel-q">${f.quote}</p><p class="feel-m">${f.mean}</p>`;
  });
}

/* ================= 细节聚光灯 ================= */
const SPOTS = [
  { t: '悄悄地躲出去，偷偷地听', s: '母亲就悄悄地躲出去，在我看不见的地方偷偷地听着我的动静。',
    a: '“躲出去”是给儿子留出发泄的空间，怕刺激他；“偷偷地听”是放心不下，怕他出事。两个修饰语，写尽了母亲的小心和担忧。' },
  { t: '扑过来，抓住，忍住', s: '母亲扑过来抓住我的手，忍住哭声说：“咱娘儿俩在一块儿，好好儿活，好好儿活……”',
    a: '“扑”是急，“抓住”是怕儿子伤害自己，“忍住哭声”是强忍悲痛给儿子力量。母亲自己身患重病，却把坚强留给儿子。' },
  { t: '挡在窗前，央求般的神色', s: '母亲进来了，挡在窗前：“北海的菊花开了，我推着你去看看吧。”她憔悴的脸上现出央求般的神色。',
    a: '“挡”住窗外的落叶，怕儿子触景伤情；“央求”——明明是为儿子好，却像在求儿子帮她一个忙。“憔悴”暗示她病得很重。' },
  { t: '她忽然不说了', s: '她忽然不说了。对于“跑”和“踩”一类的字眼儿，她比我还敏感。',
    a: '说到“跑”“踩”，母亲猛然想到儿子再也不能跑了，怕刺痛他。“比我还敏感”——儿子的痛，在母亲心里更痛。' },
  { t: '最后一句话', s: '她昏迷前的最后一句话是：“我那个有病的儿子和我那个还未成年的女儿……”',
    a: '生命的最后一刻，想的不是自己，全是儿女。省略号里是说不完的牵挂。' },
];
function initSpots() {
  const list = document.getElementById('spotList');
  const out = document.getElementById('spotOut');
  list.innerHTML = SPOTS.map((s, i) => `<button type="button" class="spot" data-i="${i}">${esc(s.t)}</button>`).join('');
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.spot');
    if (!b) return;
    const s = SPOTS[+b.dataset.i];
    list.querySelectorAll('.spot').forEach((x) => x.classList.toggle('on', x === b));
    out.innerHTML = `<p class="spot-s">${esc(s.s)}</p><p class="spot-a">${esc(s.a)}</p>`;
    out.classList.remove('lit'); void out.offsetWidth; out.classList.add('lit');
  });
}

/* ================= 加点词：[ ] 是加点词 ================= */
const DOTS = [
  { s: '可我却[一直]都不知道，她的病已经到了那步田地。', why: '“一直”：母亲病了那么久，“我”竟从来不知道——满是愧疚和悔恨。' },
  { s: '她出去了，就[再也]没回来。', why: '“再也”：这一次出门，就是永别。平平淡淡一句，痛到极点。' },
  { s: '看着三轮车远去，也[绝]没有想到那[竟]是永远的诀别。', why: '“绝”：完全、根本没有想到；“竟”：出乎意料。两个词写出“我”的震惊、悲痛与追悔。' },
];
function initDots() {
  const list = document.getElementById('dotList');
  list.innerHTML = DOTS.map((d, i) => {
    const full = esc(d.s).replace(/\[([^\]]+)\]/g, '<em>$1</em>');
    const bare = esc(d.s.replace(/\[[^\]]+\]/g, '').replace('都不', '不'));
    return `<div class="dot-row" data-i="${i}"><p class="dot-s"><span class="full">${i + 1}. ${full}</span><span class="bare">${i + 1}. ${bare}</span></p>
      <div class="dot-foot"><button type="button" class="btn">去掉试试</button><span class="dot-why">${esc(d.why)}</span></div></div>`;
  }).join('');
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.btn');
    if (!b) return;
    const row = b.closest('.dot-row');
    const bare = row.classList.toggle('bare-on');
    row.classList.add('seen');
    b.textContent = bare ? '换回原句' : '去掉试试';
  });
}

/* ================= 分角色朗读：r 为节奏标注（/ 停顿，// 长停顿） ================= */
const ROLE1 = [
  { who: '母亲', tone: '小心，试探', t: '“听说北海的花都开了，我推着你去走走。”', r: '“听说/北海的花/都开了，//我推着你/去走走。”' },
  { who: '我', tone: '暴躁，绝望', t: '“不，我不去！”', r: '“不，//我不去！”' },
  { who: '我', tone: '喊叫', t: '“我可活什么劲儿！”', r: '“我可活/什么劲儿！”' },
  { who: '母亲', tone: '忍住哭声，哀求', t: '“咱娘儿俩在一块儿，好好儿活，好好儿活……”', r: '“咱娘儿俩/在一块儿，//好好儿活，//好好儿活……”' },
];
const ROLE3 = [
  { who: '母亲', tone: '央求', t: '“北海的菊花开了，我推着你去看看吧。”', r: '“北海的菊花/开了，//我推着你/去看看吧。”' },
  { who: '我', tone: '平淡，略有松动', t: '“什么时候？”', r: '“什么时候？”' },
  { who: '母亲', tone: '小心翼翼，怕他反悔', t: '“你要是愿意，就明天？”', r: '“你要是/愿意，//就明天？”' },
  { who: '我', tone: '勉强答应', t: '“好吧，就明天。”', r: '“好吧，//就明天。”' },
  { who: '母亲', tone: '喜出望外，急切', t: '“那就赶紧准备准备。”', r: '“那就/赶紧/准备准备。”' },
  { who: '我', tone: '不耐烦，其实已软化', t: '“哎呀，烦不烦？几步路，有什么好准备的！”', r: '“哎呀，/烦不烦？//几步路，/有什么/好准备的！”' },
];
function roleHtml(list) {
  const rhythm = (r) => esc(r).replace(/\/\//g, '\u0001').replace(/\//g, '<i class="pz">\u0002</i>')
    .replace(/\u0001/g, '<i class="pz2">\u0002\u0002</i>').replace(/\u0002/g, '/');
  return list.map((l) => `<div class="role ${l.who === '我' ? 'me' : 'mom'}"><b>${l.who}</b><p><span class="plain">${esc(l.t)}</span><span class="rh">${rhythm(l.r)}</span><small>${l.tone}</small></p></div>`).join('');
}
function initRoles() {
  document.getElementById('role1').innerHTML = roleHtml(ROLE1);
  document.getElementById('role3').innerHTML = roleHtml(ROLE3);
  document.getElementById('roleMarks').addEventListener('click', (e) => {
    const on = e.target.closest('.slide').classList.toggle('rh-on');
    e.target.textContent = on ? '隐藏节奏' : '显示节奏';
  });
}

/* ================= 小练笔 ================= */
const MOMENTS = [
  { name: '一个小动作', pic: 'menwai', prompt: '写家人一个“悄悄地”“偷偷地”做的小动作。',
    hint: '想一想：你生病、考砸、发脾气的时候，家人做过什么不让你发现的事？用上准确的动词和修饰语。',
    example: '那天我考砸了，把自己关在房里。过了很久，门轻轻地开了一条缝，又轻轻地关上。等我出去时，桌上放着一碗面，卧着两个荷包蛋——那是我最爱吃的，面已经有点儿坨了。' },
  { name: '一句没说完的话', pic: 'chuangqian', prompt: '写家人一句欲言又止、没说完的话。',
    hint: '母亲“忽然不说了”，母亲最后的话没说完——没说完的话，往往最动人。',
    example: '送我去住校那天，爸爸把行李放下，站在门口说：“在学校要……”他顿了顿，挥挥手，“算了，你都懂。”转身走了。我看见他走到楼梯口，又回头望了一眼。' },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initFeel();
    initSpots();
    initDots();
    initRoles();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
