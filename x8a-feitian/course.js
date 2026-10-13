'use strict';
/* “飞天”凌空 · 本课数据与本课独有的“慢镜头分解”（时间滑块 + 跳水弧线）。通用互动见 ../shared/narrative.js */

const SLOW_TOTAL = 1.7; // 课文：“1.7 秒的时间对她似乎特别慷慨”
const PHASE_AT = [0, 0.35, 0.85]; // 滑块位置（0~1）对应的三个阶段起点，只作示意
const PLAY_MS = 6000; // “慢放”全程时长：把 1.7 秒放慢到 6 秒

let playing = 0;

function phaseOf(r) {
  let ph = 0;
  PHASE_AT.forEach((at, i) => { if (r >= at) ph = i; });
  return ph;
}

function setSlow(r) {
  const slide = document.querySelector('.s-slow');
  const path = document.getElementById('arcPath');
  const pt = path.getPointAtLength(path.getTotalLength() * r);
  const dot = document.getElementById('arcDot');
  dot.setAttribute('cx', pt.x.toFixed(1));
  dot.setAttribute('cy', pt.y.toFixed(1));
  const ph = phaseOf(r);
  slide.querySelectorAll('[data-ph]').forEach((el) => el.classList.toggle('cur', +el.dataset.ph === ph));
  slide.querySelectorAll('[data-go]').forEach((b) => b.classList.toggle('solid', +b.dataset.go === ph));
  document.getElementById('shotT').textContent = `${(r * SLOW_TOTAL).toFixed(1)} 秒`;
  document.getElementById('slowRange').value = Math.round(r * 100);
}

function play() {
  cancelAnimationFrame(playing);
  const t0 = performance.now();
  const tick = (t) => {
    const r = Math.min(1, (t - t0) / PLAY_MS);
    setSlow(r);
    if (r < 1) playing = requestAnimationFrame(tick);
  };
  playing = requestAnimationFrame(tick);
}

function initSlow() {
  document.getElementById('slowRange').addEventListener('input', (e) => { cancelAnimationFrame(playing); setSlow(e.target.value / 100); });
  document.querySelector('.s-slow .ph-btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    if (b) { cancelAnimationFrame(playing); setSlow(PHASE_AT[+b.dataset.go] + 0.02); }
  });
  document.getElementById('playBtn').addEventListener('click', play);
  setSlow(0);
}

function initVersions() {
  const slide = document.querySelector('.s-vs');
  slide.querySelector('.btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ver]');
    if (!b) return;
    slide.querySelectorAll('[data-ver]').forEach((x) => x.classList.toggle('solid', x === b));
    slide.querySelectorAll('.ver').forEach((v) => v.classList.toggle('on', v.dataset.v === b.dataset.ver));
  });
}

const PICKS = {
  fig: [
    { t: '酷似敦煌壁画中凌空翔舞的“飞天”', ok: true, why: '比作飞天：美' },
    { t: '动作疾如流星', ok: true, why: '比作流星：快' },
    { t: '像轻盈的、笔直的箭', ok: true, why: '比作箭：直' },
    { t: '自天而降的仙女', ok: true, why: '比作仙女：美' },
    { t: '向前翻腾一周半', ok: false, why: '实写动作' },
    { t: '让几位裁判亮出了 9.5 分的高分', ok: false, why: '实写结果' },
  ],
};

const MOMENTS = [
  {
    name: '一次投篮', pic: 'kongzhong',
    prompt: '写篮球比赛最后几秒的一次投篮，用“慢镜头”写出起跳、出手、入筐。',
    hint: '三步各用一两个准动词；加一个比喻；最后写一句观众的反应。',
    example: '他双膝一沉，猛地拔地而起，手腕轻轻一压，篮球划出一道高高的弧线，像一只归巢的鸟，“唰”地钻进篮网，连篮筐都没碰一下。场边先是一静，接着整个球馆炸开了锅。',
  },
  {
    name: '一次跳远', pic: 'gaotai',
    prompt: '写运动会上一次跳远：助跑、起跳、落地。',
    hint: '先写“静”（站在起点），再写“动”，最后写“响”。',
    example: '她站在助跑道尽头，深吸一口气。起跑，步子越来越快，踏板的一刹那，右脚狠狠一蹬，整个人腾空而起，双臂前摆，像一张拉满的弓。沙坑里扬起一片细沙，裁判拉开皮尺：四米八二！看台上的同学们跳了起来。',
  },
  {
    name: '自选一个瞬间', pic: 'rushui',
    prompt: '选一个你亲眼看到的精彩瞬间（一次扑救、一个舞蹈动作、一次实验成功……）。',
    hint: '只写这个瞬间，不写来龙去脉——这就是“特写”。',
    example: '球从禁区角上飞来，又低又快。守门员向左一扑，整个人几乎贴着草皮横飞出去，指尖轻轻一拨，球擦着门柱滚出了底线。他趴在地上半天没动，直到队友冲过来把他拉起。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initSlow();
    initVersions();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-slow')) {
      cancelAnimationFrame(playing);
      setSlow(step === 0 ? 0 : PHASE_AT[Math.min(step, 3) - 1] + 0.02);
    }
  },
};
