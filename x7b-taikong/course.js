'use strict';
/* 太空一日 · 本课数据与专属互动：飞行剖面意外表、共振 26 秒、敲击声（合成音示意）、情感句 */

/* 飞行剖面上的意外：at 是在路线上的位置比例，big 表示三大意外 */
const ACCIDENTS = [
  { at: 0.06, name: '共振', where: '起飞 · 三四十公里', big: true,
    what: '火箭和飞船急剧抖动，产生共振，又叠加约 6G 的负荷，持续 26 秒。',
    mind: '五脏六腑似乎都要碎了，“我真的以为自己要牺牲了”。',
    act: '咬牙承受，一动不动；回来后详细描述这个过程，帮助改进技术。' },
  { at: 0.2, name: '错觉', where: '入轨 · 失重',
    what: '进入失重状态，产生“本末倒置”的错觉：明明朝上坐，却感觉脑袋冲下。',
    mind: '很难受，担心诱发空间运动病、影响任务。',
    act: '闭着眼睛猛想地面训练的情景，几十分钟后调整过来；后来告诉了战友。' },
  { at: 0.5, name: '敲击声', where: '在轨 · 不定时', big: true,
    what: '时不时出现神秘的敲击声，像木头锤子敲铁桶，毫无规律。',
    mind: '很紧张，“生怕哪里出了问题”。',
    act: '趴在舷窗边听边看；回来后反复听模拟录音一年多，不像就不签字。' },
  { at: 0.8, name: '舷窗裂纹', where: '返回 · 黑障区', big: true,
    what: '舷窗外一片通红、碎片划过；右边舷窗出现裂纹，接着左边也出现裂纹。',
    mind: '汗出来了，想到“哥伦比亚号”；左边也裂，反而“放心一点儿了”。',
    act: '冷静分析：重复出现的故障概率不高；怀抱操作盒，屏息凝神等待配合程序。' },
  { at: 0.9, name: '开伞', where: '距地面 10 公里',
    what: '“砰”的一声巨响（164 分贝），引导伞、减速伞、主伞依次打开，被狠狠拽来拽去。',
    mind: '吓一跳；数据出来后，心里“真是踏实”。',
    act: '按程序准确操作；落地弹起，第二次落地时迅速按下切伞开关。' },
  { at: 1, name: '落地', where: '次日 6 时 23 分',
    what: '四周寂静无声，舷窗黑乎乎的，看不到外面的任何景象。',
    mind: '听到喊声、看到手电光：“他们找到飞船了，外边来人了！”',
    act: '静静等待——回到了祖国的怀抱。' },
];

const PICKS = {
  yanjin: [
    { t: '飞行回来后我详细描述了这种难受的过程。', ok: true, why: '如实报告，帮助改进' },
    { t: '火箭起飞了。', ok: false, why: '只是叙述' },
    { t: '我几次努力寻找长城，但是没有结果。', ok: true, why: '实事求是，不随大流' },
    { t: '我至今还没弄清那到底是些什么。', ok: true, why: '不清楚就不妄下结论' },
    { t: '所有的人都鼓掌欢呼起来。', ok: false, why: '写地面人员的喜悦' },
    { t: '不是当时的声音，我就不能签字。', ok: true, why: '反复核对，一丝不苟' },
    { t: '判断和操作都必须准确无误。', ok: true, why: '精准操作' },
    { t: '我曾俯瞰我们的首都北京。', ok: false, why: '写思念之情' },
  ],
};

const FEEL = [
  { s: '就这一下，指挥大厅有人大声喊道：“快看啊，他眨眼了，利伟还活着！”所有的人都鼓掌欢呼起来。', a: '地面人员从极度紧张、担忧到惊喜、激动：一个“眨眼”让悬着的心落了地——这是对航天员生命的关切。' },
  { s: '我曾俯瞰我们的首都北京，白天它是燕山山脉边的一片灰白，分辨不清，夜晚则呈现一片红晕，那里有我的战友和亲人。', a: '身在太空，心系祖国：一片灰白、一片红晕都看得那么认真，因为那里有战友和亲人——深深的思念和热爱。' },
  { s: '过了几分钟，我隐约听到外面喊叫的声音，手电的光束从舷窗上模糊地透进来。我知道：他们找到飞船了，外边来人了！', a: '经历了一路惊心动魄后，回到地面的安心、欣慰和喜悦；对战友的信赖，回到祖国怀抱的温暖。' },
];

const MOMENTS = [
  {
    name: '我想问', pic: 'jiangluo',
    prompt: '假如杨利伟到你们学校和大家交流，你会向他提什么问题？至少写两个。',
    hint: '好问题从课文里来：哪处“意外”你最想知道得更多？哪处心理你想深入了解？也可以问他怎样训练、怎样克服恐惧。',
    example: '1. 共振的那 26 秒里，您脑子里在想什么？是什么让您坚持下来的？\n2. 那个神秘的敲击声，后来有没有找到原因？听了一年多录音都不像，您会觉得烦吗？\n3. 您说“说不恐惧那是假话”，航天员应该怎样面对恐惧？',
  },
  {
    name: '他为什么是英雄', pic: 'fashe',
    prompt: '通过学习课文，说说杨利伟为什么被称为“航天英雄”。',
    hint: '从课文里找证据：面对意外时的表现、对待工作的态度、对后来者的关心。',
    example: '他是中国第一位进入太空的航天员，敢于承担未知的危险；共振、裂纹面前，他害怕却坚持，冷静分析、准确操作；他严谨到“不是当时的声音就不签字”；他还把自己遇到的每一个意外都讲给后来的战友，让他们少紧张一点。勇敢、严谨、无私，这就是英雄。',
  },
];

/* ---------- 飞行剖面：星星和意外标记（顶层生成，分步才算得上） ---------- */
(function buildFlight() {
  let seed = 3;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  document.querySelector('#flight .stars').innerHTML = Array.from({ length: 60 }, () =>
    `<circle cx="${(rnd() * 800).toFixed(0)}" cy="${(rnd() * 170).toFixed(0)}" r="${(rnd() * 1.4 + 0.3).toFixed(1)}" fill="#fff" opacity="${(0.4 + rnd() * 0.6).toFixed(2)}"/>`).join('');
  const path = document.getElementById('fpath');
  const len = path.getTotalLength();
  document.querySelector('#flight .fmarks').innerHTML = ACCIDENTS.map((a, i) => {
    const p = path.getPointAtLength(len * a.at);
    const below = p.y < 120;
    return `<g class="fm${a.big ? ' big' : ''}" data-step="${i + 1}" data-i="${i}">
      <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${a.big ? 13 : 9}"/>
      <text class="t-s t-c" x="${p.x.toFixed(1)}" y="${(p.y + (below ? 34 : -20)).toFixed(1)}">${a.name}</text></g>`;
  }).join('');
}());

function showAccident(i) {
  const a = ACCIDENTS[i];
  document.getElementById('accRow').innerHTML = `<div><small>${a.where}</small><b>${a.name}</b>${a.what}</div><div>${a.mind}</div><div>${a.act}</div>`;
  document.querySelectorAll('#flight .fm').forEach((g, k) => g.classList.toggle('cur', k === i));
}

/* ---------- 共振 26 秒 ---------- */
const SHAKE_SECONDS = 26;
let shakeTimer = 0;
function stopShake() {
  clearInterval(shakeTimer);
  shakeTimer = 0;
  document.getElementById('capsule').classList.remove('shaking');
}
function initShake() {
  const num = document.getElementById('secNum');
  document.getElementById('shakeGo').addEventListener('click', () => {
    stopShake();
    let left = SHAKE_SECONDS;
    num.textContent = left;
    document.getElementById('capsule').classList.add('shaking');
    shakeTimer = setInterval(() => {
      left -= 1;
      num.textContent = left;
      if (left <= 0) stopShake();
    }, 1000);
  });
  document.getElementById('shakeStop').addEventListener('click', () => {
    stopShake();
    num.textContent = SHAKE_SECONDS;
  });
}

/* ---------- 敲击声：Web Audio 合成“木头锤子敲铁桶”（示意） ---------- */
const KNOCKS = [0, 0.9, 1.15, 2.1]; // 咚……咚咚……咚……
let audioCtx = null;
function thump(ctx, t) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, t);
  osc.frequency.exponentialRampToValueAtTime(70, t + 0.25);
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.exponentialRampToValueAtTime(0.8, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.5);
}
function initKnock() {
  const wave = document.getElementById('knockWave');
  document.getElementById('knockBtn').addEventListener('click', () => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      audioCtx = audioCtx || new AC();
      const now = audioCtx.currentTime + 0.05;
      KNOCKS.forEach((k) => thump(audioCtx, now + k));
    }
    // 没有声音的设备上，也让波纹按节奏亮起
    wave.querySelectorAll('i').forEach((dot, k) => {
      dot.classList.remove('hit');
      setTimeout(() => { dot.classList.add('hit'); setTimeout(() => dot.classList.remove('hit'), 400); }, KNOCKS[k] * 1000);
    });
  });
}

function initFeel() {
  const box = document.getElementById('feelList');
  box.innerHTML = FEEL.map((f, i) => `<div class="feel"><p class="feel-s"><b>${i + 1}</b>${f.s}</p>
    <button type="button" class="btn">体会情感</button><p class="feel-a" hidden>${f.a}</p></div>`).join('');
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('.feel > .btn');
    if (btn) btn.nextElementSibling.hidden = false;
  });
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initShake();
    initKnock();
    initFeel();
    document.querySelector('#flight .fmarks').addEventListener('click', (e) => {
      const g = e.target.closest('.fm');
      if (g && g.classList.contains('on')) showAccident(+g.dataset.i);
    });
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-flight') && step > 0) showAccident(Math.min(step, ACCIDENTS.length) - 1);
    if (!slide.classList.contains('s-shake')) stopShake();
  },
};
