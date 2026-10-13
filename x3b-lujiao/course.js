'use strict';
/* 鹿角和鹿腿 · 本课数据与互动。记叙文模板见 ../shared/narrative.js */

/* 课后第 2 题 · 按提示讲故事 */
const PLOT = [
  { step: 1, stage: '起因', text: '角：美丽　欣赏', pic: 'zhaoying', x: 12, y: 90 },
  { step: 1, stage: '起因', text: '腿：难看　抱怨', pic: 'zhaoying', pos: '50% 85%', x: 34, y: 66 },
  { step: 2, stage: '经过', text: '腿：狮口逃生', pic: 'taopao', x: 57, y: 44 },
  { step: 2, stage: '经过', text: '角：差点儿送命', pic: 'guazhu', x: 78, y: 40 },
  { step: 3, stage: '结果', text: '小溪边叹气：明白了', pic: 'xibian', x: 92, y: 80 },
];

/* 联系生活 */
const PICKS = {
  life: [
    { t: '同桌字写得不漂亮，可他算数又快又准，我很佩服他', ok: true, why: '看到别人的长处' },
    { t: '只买好看的文具，好不好用无所谓', ok: false, why: '只看外表' },
    { t: '我个子矮，可我跑得快，踢球照样厉害', ok: true, why: '看到自己的长处' },
    { t: '新同学穿得朴素，我就不和他玩', ok: false, why: '以貌取人' },
  ],
};

/* 读与写 · 讲故事 */
const MOMENTS = [
  {
    name: '按提示讲故事', pic: 'zhaoying',
    prompt: '根据提示，用自己的话讲讲这个故事：角：美丽　欣赏　差点儿送命；腿：难看　抱怨　狮口逃生。',
    hint: '按“照影子—狮子来了—角被挂住—小溪边”的顺序讲，讲出鹿的心情变化。',
    example: '一只鹿在池塘边喝水，看见水里的影子，得意极了：“我的角多美呀，像珊瑚一样！”可一看到自己的细腿，他又噘起嘴抱怨起来。忽然，一头狮子扑了过来！鹿撒开长腿就跑，很快把狮子甩在后面。没想到，他的角被树枝挂住了，差点儿被狮子追上。他使劲一扯，才逃了出来。鹿叹了口气说：“美丽的角差点儿害了我，难看的腿却救了我的命啊！”',
  },
  {
    name: '续编：鹿又来照影子', pic: 'xibian',
    prompt: '过了几天，鹿又来到池塘边照影子。这一次，他会怎么看自己的角和腿？',
    hint: '想一想：经历了狮口逃生，鹿明白了什么？',
    example: '鹿又来到池塘边。他看看水里的长腿，笑着说：“好腿呀，多亏了你！”他又看看头上的角：“角呀，你也很漂亮，以后跑的时候，我得小心别让你挂住树枝。你们俩，我都喜欢！”',
  },
];

/* 品 · 天平：池塘边倒向角，狮子来了倒向腿 */
const TILT_DEG = 12;
const ARM = 190;
const MODES = {
  pool: { deg: -TILT_DEG, l: '精美别致 · 像珊瑚', r: '太细了 · 配不上' },
  lion: { deg: TILT_DEG, l: '被挂住 · 差点送命', r: '有力 · 狮口逃生' },
  none: { deg: 0, l: '', r: '' },
};
function setScale(mode) {
  const m = MODES[mode];
  const dy = ARM * Math.sin(m.deg * Math.PI / 180);
  document.getElementById('ljBeam').style.transform = `rotate(${m.deg}deg)`;
  document.getElementById('ljPanL').style.transform = `translateY(${-dy}px)`;
  document.getElementById('ljPanR').style.transform = `translateY(${dy}px)`;
  document.getElementById('ljSayL').textContent = m.l;
  document.getElementById('ljSayR').textContent = m.r;
  document.querySelectorAll('.lj-modes [data-mode]').forEach((b) => b.classList.toggle('solid', b.dataset.mode === mode));
}
function initScale() {
  document.querySelector('.lj-modes').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (b) setScale(b.dataset.mode);
  });
  setScale('none');
}
const STEP_MODE = ['none', 'pool', 'lion', 'lion'];
function updateScale(slide, step) {
  if (slide.querySelector('#ljScale')) setScale(STEP_MODE[step] || 'lion');
}

/* 课后第 3 题 · 选一选 */
function initVote() {
  const box = document.querySelector('.lj-vote');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.lj-opt');
    if (b) box.querySelectorAll('.lj-opt').forEach((x) => x.classList.toggle('chosen', x === b));
  });
}

/* 寓言卡：正面故事，背面道理 */
function initFable() {
  document.querySelectorAll('.fable-card').forEach((c) => c.addEventListener('click', () => c.classList.toggle('flipped')));
}

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, picks: PICKS, moments: MOMENTS });
    initScale();
    initVote();
    initFable();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateScale(slide, step);
  },
};
