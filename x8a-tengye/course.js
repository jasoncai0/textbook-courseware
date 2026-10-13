'use strict';
/* 藤野先生 · 本课数据与本课独有的“心路曲线”“讲义里的四件事”。通用互动见 ../shared/narrative.js */

/* 心路：x/y 为曲线上的百分比位置（y 越小越振奋，只作示意）；t 小标题参考；q 课文原句；f “我”的感受 */
const MOOD = [
  { x: 6, y: 55, place: '东京', t: '东京见闻', q: '东京也无非是这样。', f: '失望、厌恶' },
  { x: 18, y: 48, place: '途中', t: '仙台途中', q: '其次却只记得水户了，这是明的遗民朱舜水先生客死的地方。', f: '怀念爱国志士' },
  { x: 30, y: 45, place: '仙台', t: '初到仙台', q: '大概是物以希为贵罢。……我到仙台也颇受了这样的优待。', f: '自嘲、幽默' },
  { x: 43, y: 22, place: '仙台', t: '添改讲义', q: '我拿下来打开看时，很吃了一惊，同时也感到一种不安和感激。', f: '感激' },
  { x: 56, y: 70, place: '仙台', t: '匿名信事件', q: '中国是弱国，所以中国人当然是低能儿……也无怪他们疑惑。', f: '屈辱、愤懑' },
  { x: 68, y: 90, place: '仙台', t: '看电影事件', q: '但在我，这一声却特别听得刺耳。……但在那时那地，我的意见却变化了。', f: '刺痛、觉醒' },
  { x: 81, y: 60, place: '仙台', t: '告别仙台', q: '他的脸色仿佛有些悲哀，似乎想说话，但竟没有说。', f: '不舍、愧疚' },
  { x: 94, y: 18, place: '北京', t: '怀念先生', q: '便使我忽又良心发现，而且增加勇气了，于是点上一枝烟，再继续写些为“正人君子”之流所深恶痛疾的文字。', f: '勇气、坚持' },
];

// 必须在 deck.js 统计分步之前生成
document.getElementById('mood').insertAdjacentHTML('beforeend', MOOD.map((m, i) =>
  `<button type="button" class="m-dot" data-step="${i + 1}" data-i="${i}" style="left:${m.x}%;top:${m.y}%"><span>${m.place}</span></button>`).join(''));

function drawMood(step) {
  const box = document.getElementById('mood');
  const w = box.clientWidth;
  const h = box.clientHeight;
  if (!w || !h) return;
  const svg = document.getElementById('moodSvg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  const pts = MOOD.slice(0, Math.max(0, step)).map((m) => `${(m.x / 100 * w).toFixed(1)},${(m.y / 100 * h).toFixed(1)}`);
  document.getElementById('moodLine').setAttribute('points', pts.join(' '));
}

function showMood(i) {
  const m = MOOD[i];
  document.querySelectorAll('.m-dot').forEach((d, k) => d.classList.toggle('cur', k === i));
  document.getElementById('mDetail').innerHTML = `<p class="md-no">${m.place} · 第 ${i + 1} 站</p><h3>${m.t}</h3>
    <blockquote>${m.q}</blockquote><p class="md-f">“我”的感受：<b>${m.f}</b></p>`;
}

/* 四件事：q 原文，d 细节，p 品质 */
const EVENTS = [
  { t: '添改讲义', q: '原来我的讲义已经从头到末，都用红笔添改过了，不但增加了许多脱漏的地方，连文法的错误，也都一一订正。这样一直继续到教完了他所担任的功课：骨学，血管学，神经学。', d: '“从头到末”“一一订正”“一直继续”', p: '认真负责，诲人不倦' },
  { t: '纠正解剖图', q: '“你看，你将这条血管移了一点位置了。——自然，这样一移，的确比较的好看些，然而解剖图不是美术，实物是那么样的，我们没法改换它。现在我给你改好了，以后你要全照着黑板上那样的画。”', d: '先肯定“好看些”，再讲道理，语气“和蔼”', p: '严谨求实，循循善诱' },
  { t: '关心解剖实习', q: '“我因为听说中国人是很敬重鬼的，所以很担心，怕你不肯解剖尸体。现在总算放心了，没有这回事。”', d: '“很担心”“总算放心了”', p: '关心学生，尊重异国习俗' },
  { t: '了解裹脚', q: '他听说中国的女人是裹脚的，但不知道详细，所以要问我怎么裹法，足骨变成怎样的畸形，还叹息道，“总要看一看才知道。究竟是怎么一回事呢？”', d: '“总要看一看才知道”', p: '求真求实的科学精神' },
];

function initEvents() {
  const tabs = document.getElementById('evTabs');
  tabs.innerHTML = EVENTS.map((e, i) => `<button type="button" class="btn" data-i="${i}">${i + 1}. ${e.t}</button>`).join('');
  tabs.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-i]');
    if (!b) return;
    const e = EVENTS[+b.dataset.i];
    tabs.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    document.getElementById('evPaper').innerHTML = `<h3>${e.t}</h3><p class="pq">${e.q}</p>
      <p class="pd"><span>细节</span>${e.d}</p><p class="pp"><span>品质</span>${e.p}</p>`;
  });
  tabs.querySelector('.btn').click();
}

function initEdit() {
  const slide = document.querySelector('.s-edit');
  slide.querySelector('.btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ed]');
    if (!b) return;
    slide.querySelectorAll('[data-ed]').forEach((x) => x.classList.toggle('solid', x === b));
    slide.classList.toggle('show-old', b.dataset.ed === 'old');
  });
}

const SORT = [
  { s: '清国留学生头顶盘着大辫子，形成一座富士山', ok: ['写见闻与感受'], q: '离开东京的原因' },
  { s: '他使助手来叫我了……“我的讲义，你能抄下来么？”', ok: ['写藤野先生'], q: '添改讲义' },
  { s: '学生会干事送来匿名信：“你改悔罢！”', ok: ['写见闻与感受'], q: '弱国国民受歧视' },
  { s: '“解剖图不是美术，实物是那么样的”', ok: ['写藤野先生'], q: '纠正解剖图' },
  { s: '“万岁！”他们都拍掌欢呼起来', ok: ['写见闻与感受'], q: '弃医从文的契机' },
  { s: '交给我一张照相，后面写着两个字道：“惜别”', ok: ['写藤野先生'], q: '临别赠照' },
];

const MOMENTS = [
  {
    name: '一位严格的老师', pic: 'jiangyi',
    prompt: '写一位老师批改作业（或纠正错误）的一件小事。',
    hint: '像藤野先生改讲义：写清他改了什么、怎么说的；再写你当时的感受。',
    example: '数学老师姓陈，个子不高，总穿一件洗得发白的蓝衬衫。我交上去的错题本发回来时，每道错题旁都多了一行小字：“这一步为什么能约分？再想想。”最后一页写着：“字可以再慢一点。”——那天我第一次觉得，错题本是有人在看的。',
  },
  {
    name: '老师的一句话', pic: 'zhaopian',
    prompt: '写老师说过的一句让你一直记得的话，以及它对你的影响。',
    hint: '原话要写准；结尾像课文那样，写出今天的你“想起”这句话时的样子。',
    example: '“慢一点不要紧，别停。”这是王老师在八百米测试时站在弯道上对我喊的话。后来每次想偷懒，耳边总会响起这句话，于是我又翻开了书。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['写藤野先生', '写见闻与感受'], moments: MOMENTS });
    document.getElementById('mood').addEventListener('click', (e) => {
      const d = e.target.closest('.m-dot');
      if (d && d.classList.contains('on')) showMood(+d.dataset.i);
    });
    new ResizeObserver(() => drawMood(document.querySelectorAll('.m-dot.on').length)).observe(document.getElementById('mood'));
    initEvents();
    initEdit();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-mood')) {
      drawMood(step);
      if (step >= 1) showMood(Math.min(step, MOOD.length) - 1);
    }
  },
};
