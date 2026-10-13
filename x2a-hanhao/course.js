'use strict';
/* 寒号鸟 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：读课文时右上角的“时间轴 + 温度计”（天气一天比一天冷）、喜鹊/寒号鸟双线对比、“得直…/得像…”心情转盘、衔草做窝识字游戏 */

Hanzi.init({
  cards: [
    { z: '号', py: 'háo', bs: '口', bh: 5, words: [['寒号鸟', 'hán háo niǎo'], ['哀号', 'āi háo']] },
    { z: '堵', py: 'dǔ', bs: '土', bh: 11, words: [['一堵墙', 'yì dǔ qiáng'], ['堵住', 'dǔ zhù']] },
    { z: '缝', py: 'fèng', bs: '纟', bh: 13, words: [['崖缝', 'yá fèng'], ['门缝', 'mén fèng']] },
    { z: '当', py: 'dàng', bs: '⺌', bh: 6, words: [['当作', 'dàng zuò'], ['上当', 'shàng dàng']] },
    { z: '鹊', py: 'què', bs: '鸟', bh: 13, words: [['喜鹊', 'xǐ què']] },
    { z: '朗', py: 'lǎng', bs: '月', bh: 10, words: [['晴朗', 'qíng lǎng'], ['朗读', 'lǎng dú']] },
    { z: '衔', py: 'xián', bs: '彳', bh: 11, words: [['衔回来', 'xián huí lái'], ['衔着', 'xián zhe']] },
    { z: '枯', py: 'kū', bs: '木', bh: 9, words: [['枯草', 'kū cǎo'], ['枯叶', 'kū yè']] },
    { z: '劝', py: 'quàn', bs: '力', bh: 4, words: [['劝告', 'quàn gào'], ['劝说', 'quàn shuō']] },
    { z: '趁', py: 'chèn', bs: '走', bh: 12, words: [['趁天晴', 'chèn tiān qíng'], ['趁早', 'chèn zǎo']] },
    { z: '将', py: 'jiāng', bs: '丬', bh: 9, words: [['将来', 'jiāng lái'], ['即将', 'jí jiāng']] },
    { z: '难', py: 'nán', bs: '又', bh: 10, words: [['难过', 'nán guò'], ['难题', 'nán tí']] },
    { z: '且', py: 'qiě', bs: '一', bh: 5, words: [['得过且过', 'dé guò qiě guò'], ['而且', 'ér qiě']] },
    { z: '狂', py: 'kuáng', bs: '犭', bh: 7, words: [['狂吼', 'kuáng hǒu'], ['狂风', 'kuáng fēng']] },
    { z: '吼', py: 'hǒu', bs: '口', bh: 7, words: [['狂吼', 'kuáng hǒu'], ['吼叫', 'hǒu jiào']] },
    { z: '复', py: 'fù', bs: '夂', bh: 9, words: [['重复', 'chóng fù'], ['复习', 'fù xí']] },
    { z: '哀', py: 'āi', bs: '口', bh: 9, words: [['哀号', 'āi háo'], ['悲哀', 'bēi āi']] },
  ],
  write: [
    { z: '脚', py: 'jiǎo', bs: '月', bh: 11 },
    { z: '面', py: 'miàn', bs: '面', bh: 9 },
    { z: '阵', py: 'zhèn', bs: '阝', bh: 6 },
    { z: '朗', py: 'lǎng', bs: '月', bh: 10 },
    { z: '枯', py: 'kū', bs: '木', bh: 9 },
    { z: '却', py: 'què', bs: '卩', bh: 7 },
    { z: '第', py: 'dì', bs: '⺮', bh: 11 },
    { z: '将', py: 'jiāng', bs: '丬', bh: 9 },
    { z: '难', py: 'nán', bs: '又', bh: 10 },
    { z: '纷', py: 'fēn', bs: '纟', bh: 7 },
  ],
});

const STORY = {
  picks: {
    why: [
      { t: '天气晴朗的时候，喜鹊就忙着做窝，准备过冬', ok: true, why: '对！喜鹊早早做好准备' },
      { t: '寒号鸟只知道玩和睡觉，总说“明天就做窝”', ok: true, why: '对！“明天”一直没有做' },
      { t: '寒号鸟不听喜鹊的劝告，得过且过', ok: true, why: '对！喜鹊劝了好几次' },
      { t: '喜鹊的运气比寒号鸟好', ok: false, why: '不是运气，是喜鹊早做了准备' },
    ],
  },
};

/* ---------- 读课文：时间轴 + 温度计（字幕行上的 data-at = 走到第几站） ---------- */
const TIME = [
  { t: '秋风', heat: 50, word: '凉' },
  { t: '晴朗', heat: 66, word: '暖' },
  { t: '寒风', heat: 24, word: '冷' },
  { t: '清早', heat: 58, word: '暖' },
  { t: '腊月', heat: 6, word: '冷极了' },
  { t: '天亮', heat: 10, word: '冷极了' },
];
document.querySelectorAll('[data-time]').forEach((box) => {
  box.innerHTML = `<ol class="hh-stops">${TIME.map((s) => `<li><i></i>${s.t}</li>`).join('')}</ol>
    <div class="hh-thermo"><div class="hh-tube"><i></i></div><b></b></div>`;
});
function updateTime(slide, step) {
  const box = slide.querySelector('[data-time]');
  if (!box) return;
  let at = -1;
  slide.querySelectorAll('.subs p[data-at]').forEach((p) => { if (+p.dataset.step <= step) at = +p.dataset.at; });
  box.classList.toggle('show', at >= 0);
  box.querySelectorAll('.hh-stops li').forEach((li, i) => {
    li.classList.toggle('now', i === at);
    li.classList.toggle('past', i < at);
  });
  const s = TIME[Math.max(0, at)];
  const tube = box.querySelector('.hh-tube i');
  tube.style.height = `${s.heat}%`;
  tube.style.background = s.heat < 30 ? '#4f8fd6' : (s.heat < 55 ? '#e6a23c' : '#e2683c');
  box.querySelector('.hh-thermo b').textContent = s.word;
  slide.classList.toggle('freeze', at === 2 || at >= 4);
}

/* ---------- 照样子说一说：心情转盘 ---------- */
const FEEL = [
  { k: '冷', a: ['冻得直打哆嗦', 'dòng de zhí dǎ duō suo'], b: ['冷得像冰窖', 'lěng de xiàng bīng jiào'], src: '课文' },
  { k: '热', a: ['热得直冒汗', 'rè de zhí mào hàn'], b: ['热得像蒸笼', 'rè de xiàng zhēng lóng'], src: '课本' },
  { k: '累', a: ['累得直喘气', 'lèi de zhí chuǎn qì'], b: ['累得像散了架', 'lèi de xiàng sǎn le jià'], src: '' },
  { k: '急', a: ['急得直跺脚', 'jí de zhí duò jiǎo'], b: ['急得像热锅上的蚂蚁', 'jí de xiàng rè guō shàng de mǎ yǐ'], src: '' },
  { k: '高兴', a: ['高兴得直拍手', 'gāo xìng de zhí pāi shǒu'], b: ['高兴得像过年', 'gāo xìng de xiàng guò nián'], src: '' },
];
const SPIN_TURNS = 3;
function initSpin() {
  const box = document.getElementById('hhSpin');
  const seg = 360 / FEEL.length;
  box.innerHTML = `<div class="hh-wheelbox">
      <div class="hh-pointer"></div>
      <div class="hh-wheel">${FEEL.map((f, i) => `<span style="--a:${i * seg + seg / 2}deg">${f.k}</span>`).join('')}</div>
      <button type="button" class="btn solid hh-go">转一转</button>
    </div>
    <div class="hh-pair">
      <div class="hh-feels">${FEEL.map((f, i) => `<button type="button" class="btn" data-i="${i}">${f.k}</button>`).join('')}</div>
      <div class="hh-out" id="hhOut"></div>
      <p class="hh-yours">你来说：<b>＿＿</b>得直<b>＿＿＿</b>，<b>＿＿</b>得像<b>＿＿＿</b>。</p>
    </div>`;
  const wheel = box.querySelector('.hh-wheel');
  const out = box.querySelector('#hhOut');
  let turn = 0;
  const show = (i) => {
    const f = FEEL[i];
    out.innerHTML = `<p class="py">${Hanzi.ruby(...f.a)}</p><p class="py">${Hanzi.ruby(...f.b)}</p>${f.src ? `<small>（${f.src}里的句子）</small>` : ''}`;
    box.querySelectorAll('.hh-feels .btn').forEach((b) => b.classList.toggle('solid', +b.dataset.i === i));
    out.classList.remove('pop'); void out.offsetWidth; out.classList.add('pop');
  };
  const spinTo = (i) => {
    turn += SPIN_TURNS;
    wheel.style.transform = `rotate(${turn * 360 - (i * seg + seg / 2)}deg)`;
  };
  wheel.addEventListener('transitionend', () => show(+wheel.dataset.i));
  box.addEventListener('click', (e) => {
    if (e.target.closest('.hh-go')) {
      const i = Math.floor(Math.random() * FEEL.length);
      wheel.dataset.i = i;
      spinTo(i);
      return;
    }
    const b = e.target.closest('.hh-feels .btn');
    if (b) show(+b.dataset.i);
  });
  show(0);
}

/* ---------- 识字游戏：衔草做窝 ---------- */
const STRAW = [['号', 'háo'], ['堵', 'dǔ'], ['缝', 'fèng'], ['当', 'dàng'], ['鹊', 'què'], ['朗', 'lǎng'], ['衔', 'xián'], ['枯', 'kū'], ['劝', 'quàn'], ['趁', 'chèn'], ['将', 'jiāng'], ['难', 'nán'], ['且', 'qiě'], ['狂', 'kuáng'], ['吼', 'hǒu'], ['复', 'fù'], ['哀', 'āi']];
function nestLayer(i) {
  const y = 150 - i * 4.2;
  const w = 70 + Math.min(i, 8) * 4;
  const color = i % 2 ? '#a87a3a' : '#c99a52';
  return `<path class="hh-twig" d="M${150 - w} ${y}Q150 ${y + 44} ${150 + w} ${y}" stroke="${color}"/>`;
}
function initBuild() {
  const box = document.getElementById('hhBuild');
  box.innerHTML = `<div class="hh-straws">${STRAW.map(([z, p], i) => `<button type="button" class="hh-straw" data-i="${i}" style="--r:${(i % 5) * 3 - 6}deg">${Hanzi.ruby(z, p)}</button>`).join('')}</div>
    <div class="hh-nestbox">
      <svg viewBox="0 0 300 220" aria-label="喜鹊的窝">
        <path d="M0 150Q120 140 300 120" stroke="#6e4a2a" stroke-width="10" fill="none" stroke-linecap="round"/>
        <g class="hh-layers"></g>
        <g class="hh-bird">
          <ellipse cx="150" cy="96" rx="26" ry="18" fill="#222"/>
          <ellipse cx="156" cy="102" rx="16" ry="10" fill="#fff"/>
          <circle cx="174" cy="82" r="12" fill="#222"/><circle cx="178" cy="79" r="2.5" fill="#fff"/>
          <path d="M185 82L196 85L185 88Z" fill="#333"/>
          <path d="M126 92L92 82L96 96Z" fill="#1d3a5c"/>
        </g>
      </svg>
      <p class="hh-build-msg" id="hhBuildMsg"></p>
      <button type="button" class="btn" id="hhBuildReset">拆了重搭</button>
    </div>`;
  const layers = box.querySelector('.hh-layers');
  const msg = box.querySelector('#hhBuildMsg');
  const update = () => {
    const n = layers.children.length;
    box.classList.toggle('done', n === STRAW.length);
    msg.textContent = n === STRAW.length ? '窝搭好啦！喜鹊住进了温暖的窝。' : `衔了 ${n} 根枯草`;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('#hhBuildReset')) {
      layers.innerHTML = '';
      box.querySelectorAll('.hh-straw').forEach((s) => s.classList.remove('used'));
      update();
      return;
    }
    const s = e.target.closest('.hh-straw:not(.used)');
    if (!s) return;
    s.classList.add('used');
    layers.insertAdjacentHTML('beforeend', nestLayer(layers.children.length));
    update();
  });
  update();
}

window.LESSON = {
  init() {
    Narrative.init(STORY);
    initSpin();
    initBuild();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateTime(slide, step);
  },
};
