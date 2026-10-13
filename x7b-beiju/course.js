'use strict';
/* 伟大的悲剧 · 本课数据与专属互动：浏览计时、南极往返时间轴、悲/伟大天平、品句 */

/* 时间轴：path 在哪条路上（go 去程 / back 回程）、at 位置比例、n 队伍人数 */
const EVENTS = [
  { path: 'go', at: 0.88, date: '1 月 16 日', n: 5, title: '雪地上的黑旗', q: '他们发现雪地上插着一根滑雪杆，上面绑着一面黑旗……阿蒙森在这里扎过营地了。', mood: '梦想破灭' },
  { path: 'back', at: 0, date: '1 月 18 日', n: 5, title: '到达极点', q: '“这里看不到任何东西，和前几天令人毛骨悚然的单调没有任何区别。”他们插上英国国旗，答应为阿蒙森送信。', mood: '失望 · 守信' },
  { path: 'back', at: 0.2, date: '返程途中', n: 5, title: '寒季提前', q: '他们鞋底下的白雪由软变硬，结成厚厚的冰凌……（威尔逊博士）他的雪橇上，除了一切必需的载重外，还拖着 16 公斤的珍贵岩石样品。', mood: '艰难 · 坚持科学' },
  { path: 'back', at: 0.38, date: '2 月 17 日', n: 4, title: '埃文斯死去', q: '最身强力壮的埃文斯突然精神失常……2 月 17 日夜里 1 点钟，这位不幸的英国海军军士死去了。', mood: '第一位同伴离去' },
  { path: 'back', at: 0.52, date: '3 月 2 日', n: 4, title: '贮藏点燃料太少', q: '3 月 2 日，他们到了下一个贮藏点，但再次使他们感到可怕的绝望：那里储存的燃料又是非常之少。', mood: '新的绝望' },
  { path: 'back', at: 0.64, date: '一天清早', n: 3, title: '奥茨走进暴风雪', q: '“我要到外边去走走，可能要多待一些时候。”……正像一个英雄似的向死神走去。', mood: '自我牺牲' },
  { path: 'back', at: 0.88, date: '3 月 21 日', n: 3, title: '离贮藏点只有 20 公里', q: '他们离下一个贮藏点只有 20 公里了。但暴风雪刮得异常凶猛……使他们无法离开帐篷。', mood: '近在咫尺，无法前进' },
  { path: 'back', at: 1, date: '3 月 29 日', n: 3, title: '帐篷里的最后日记', q: '骄傲地在帐篷里等待死神的来临……用冻僵的手指给他所爱的一切人写了书信。', mood: '尊严 · 爱' },
  { path: 'back', at: 1, date: '11 月 12 日', n: 0, title: '搜救队找到帐篷', q: '他们找到了那些书信和文件，并且为那几个悲惨死去的英雄垒了一个石墓。', mood: '英雄被记住' },
];

const SORT = [
  { s: '他们仅仅迟到了一个月……第二个到达者什么也不是。', ok: ['悲'], q: '失败：梦想破灭' },
  { s: '斯科特接受了这项任务，他要忠实地去履行这一最冷酷无情的职责。', ok: ['伟大'], q: '诚信，尊重对手' },
  { s: '他的雪橇上……还拖着 16 公斤的珍贵岩石样品。', ok: ['伟大'], q: '临死不忘科学' },
  { s: '这个苦命的人由于摔了一跤或者由于巨大的痛苦已经疯了。', ok: ['悲'], q: '同伴倒下' },
  { s: '把他抛弃在这没有生命的冰原上？不。', ok: ['伟大'], q: '不抛弃同伴' },
  { s: '“我要到外边去走走，可能要多待一些时候。”', ok: ['伟大'], q: '为同伴牺牲自己' },
  { s: '他们现在只能在两种死法中间进行选择：是饿死还是冻死。', ok: ['悲'], q: '绝境' },
  { s: '他们爬进各自的睡袋，却始终没有向世界哀叹过一声……', ok: ['伟大'], q: '面对死亡的尊严' },
];

const JU = [
  { s: '对人类来说，第一个到达者拥有一切，第二个到达者什么也不是。', q: '作者在这里要表达的是什么意思？你同意这种说法吗？',
    a: '写出探险竞争的残酷：世人只记得第一个，斯科特一行千辛万苦，却在“第一”的意义上成了徒劳，所以他们极度失望。但作者并不真这样认为——全文正是要告诉我们：第二个到达者留下了无比高尚的精神，同样值得尊敬。' },
  { s: '斯科特接受了这项任务，他要忠实地去履行这一最冷酷无情的职责：在世界面前为另一个人完成的业绩做证……', q: '你认为斯科特为什么要接受这项为他人业绩做证的任务？',
    a: '这是他人的委托，他诚实守信；他尊重对手的成功，敢于承认失败，光明磊落，有绅士风度。“冷酷无情”是对自己而言：亲手证明自己的失败，需要极大的勇气。' },
  { s: '劳伦斯·奥茨——这个英国皇家禁卫军的骑兵上尉正像一个英雄似的向死神走去。', q: '怎样理解这句话？',
    a: '奥茨知道自己已成了同伴的负担，为了让大家有活下去的希望，他平静地走进暴风雪，主动结束自己的生命。他的勇敢、责任感和牺牲精神，令同伴怀着“敬畏”，也使他成为英雄。' },
];

const PICKS = {
  real: [
    { t: '“回去的路使我感到非常可怕。”', ok: false, why: '斯科特日记原话：史实' },
    { t: '他们的心在战栗，只不过还想尽量安慰自己罢了……', ok: true, why: '人物心理：作者的想象' },
    { t: '挪威国旗耀武扬威、扬扬得意地在这被人类冲破的堡垒上猎猎作响。', ok: true, why: '拟人的环境描写：作者的想象' },
    { t: '2 月 17 日夜里 1 点钟，这位不幸的英国海军军士死去了。', ok: false, why: '有据可查的时间、事件：史实' },
    { t: '3 月 21 日，他们离下一个贮藏点只有 20 公里了。', ok: false, why: '有据可查：史实' },
    { t: '斯科特海军上校回想起了与自己有关的一切。', ok: true, why: '临终心理：作者的理解和想象' },
    { t: '“请把这本日记送到我的妻子手中！”', ok: false, why: '日记原话：史实' },
    { t: '一个人虽然在同不可战胜的厄运的搏斗中毁灭了自己，但他的心灵却因此变得无比高尚。', ok: true, why: '作者的议论' },
  ],
};

const MOMENTS = [
  {
    name: '阅读笔记', pic: 'zhangpeng',
    prompt: '读斯科特写给英国公众的绝命书（课本第 136 页），结合课文写一篇阅读笔记。',
    hint: '可以这样写：①摘抄绝命书中最打动你的一句；②说说它让你想起课文里的哪个场面；③写写你的感受和思考（如：怎样看待失败？什么才是真正的英雄？）。',
    example: '摘抄：“我对这次探险毫无悔意……”\n感想：写下这句话时，斯科特已经知道自己活不下去了。他没有怨天尤人，反而为同伴的坚忍不拔而骄傲。这让我想起课文里奥茨走进暴风雪、威尔逊拖着岩石样品的情景。他们输掉了比赛，也失去了生命，却没有输掉做人的尊严。我以前以为只有第一名才值得被记住，现在明白了：一个人怎样面对失败，比他是否成功更能说明他是谁。',
  },
  {
    name: '给斯科特写几句话', pic: 'shimu',
    prompt: '假如你能穿越到 1912 年那顶小小的帐篷外，你想对斯科特和他的伙伴说些什么？',
    hint: '想一想他们最在乎什么（日记、家人、祖国、同伴），用第二人称写，真诚、克制。',
    example: '斯科特上校：你一定很想知道，你的日记后来被找到了，你写下的每一行字都被很多人读过。人们没有忘记你们五个人。你说你对这次探险毫无悔意——我想告诉你，我们也为你们骄傲。',
  },
];

/* ---------- 地图标记（顶层生成，分步才算得上） ---------- */
function pointAt(name, at) {
  const path = document.querySelector(`#iceMap .${name === 'go' ? 'go' : 'back'}`);
  const len = path.getTotalLength();
  return path.getPointAtLength(len * at);
}
// 每个日期标签相对圆点的偏移（地图下方几个点挨得近，逐个摆开）
const LABEL_AT = [[-14, 5], [16, 5], [16, 5], [16, 5], [16, 5], [-14, 5], [16, 0], [-16, 24], [22, 34]];
(function buildMarks() {
  document.querySelector('#iceMap .marks').innerHTML = EVENTS.map((e, i) => {
    const p = pointAt(e.path, e.at);
    const [dx, dy] = LABEL_AT[i];
    return `<g class="mk" data-step="${i + 1}" data-i="${i}"><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${i === 8 ? 14 : 8}"/>
      <text class="t-s" x="${(p.x + dx).toFixed(1)}" y="${(p.y + dy).toFixed(1)}" text-anchor="${dx < 0 ? 'end' : 'start'}">${e.date}</text></g>`;
  }).join('');
}());

function showEvent(i) {
  const e = EVENTS[i];
  document.getElementById('evCard').innerHTML = `<p class="ev-date">${e.date}<span>${e.mood}</span></p><h3>${e.title}</h3><p class="ev-q">${e.q}</p>`;
  document.querySelectorAll('#team i').forEach((dot, k) => dot.classList.toggle('lost', k >= e.n));
  document.getElementById('teamNum').textContent = e.n ? `${e.n} 人` : '石墓';
  document.querySelectorAll('#iceMap .mk').forEach((g, k) => g.classList.toggle('cur', k === i));
}

function renderRoute(step) {
  const n = Math.min(step, EVENTS.length);
  const last = n ? EVENTS[n - 1] : null;
  const done = last && last.path === 'back' ? last.at : 0;
  document.getElementById('backDone').style.strokeDashoffset = 1 - done;
  if (n) showEvent(n - 1);
}

/* ---------- 浏览计时 ---------- */
const SKIM_SECONDS = 600;
const TEXT_CHARS = 4000;
let left = SKIM_SECONDS;
let ticker = 0;
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
function stopTimer() { clearInterval(ticker); ticker = 0; }
function initTimer() {
  const text = document.getElementById('timerText');
  const say = document.getElementById('timerSay');
  document.getElementById('timerGo').addEventListener('click', () => {
    if (ticker) return;
    say.textContent = '浏览中……一目数行，圈出时间和地点。';
    ticker = setInterval(() => {
      left = Math.max(0, left - 1);
      text.textContent = fmt(left);
      if (!left) { stopTimer(); say.textContent = '10 分钟到！没读完也没关系，先说说你抓住了哪些信息。'; }
    }, 1000);
  });
  document.getElementById('timerDone').addEventListener('click', () => {
    const used = SKIM_SECONDS - left;
    stopTimer();
    if (!used) { say.textContent = '还没开始计时哦。'; return; }
    const perMin = Math.round(TEXT_CHARS / (used / 60));
    say.textContent = `用时 ${fmt(used)}，约每分钟 ${perMin} 字。浏览不比快慢，关键是抓住了主要信息。`;
  });
  document.getElementById('timerReset').addEventListener('click', () => {
    stopTimer();
    left = SKIM_SECONDS;
    text.textContent = fmt(left);
    say.textContent = '点“开始浏览”，同时打开课本第 130 页。';
  });
}

/* ---------- 悲 / 伟大 天平 ---------- */
function updateScale() {
  const rows = [...document.querySelectorAll('#sortList .sort-row.ok')];
  const count = (k) => rows.filter((r) => r.querySelector('.btn.solid').dataset.k === k).length;
  const bei = count('悲');
  const wei = count('伟大');
  document.getElementById('beiN').textContent = bei;
  document.getElementById('weiN').textContent = wei;
  document.getElementById('scale').style.setProperty('--tilt', `${Math.max(-12, Math.min(12, (wei - bei) * 3))}deg`);
}

function initJu() {
  const box = document.getElementById('juList');
  box.innerHTML = JU.map((j, i) => `<div class="ju"><p class="ju-s"><b>${i + 1}</b>${j.s}</p>
    <p class="ju-q">${j.q}<button type="button" class="btn">参考理解</button></p><p class="ju-a" hidden>${j.a}</p></div>`).join('');
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('.ju-q .btn');
    if (btn) btn.closest('.ju').querySelector('.ju-a').hidden = false;
  });
}

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['悲', '伟大'], picks: PICKS, moments: MOMENTS });
    initTimer();
    initJu();
    document.getElementById('sortList').addEventListener('click', updateScale);
    document.querySelector('#iceMap .marks').addEventListener('click', (e) => {
      const g = e.target.closest('.mk');
      if (g && g.classList.contains('on')) showEvent(+g.dataset.i);
    });
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-route')) renderRoute(step);
  },
};
