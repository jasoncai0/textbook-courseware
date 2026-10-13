'use strict';
/* 当世界年纪还小的时候 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 世界学习课（黑黑空空的新世界里，万物第一次被叫出名字、学本领：太阳上山下山、唱歌吓坏世界；小草、云、雨、人一样样出现，世界亮起来、有了秩序）；
 *           ② 会变圆变缺的小月亮；③ 故事转盘续讲；④ 点亮星星识字 */

/* 二下课文只给生字注音：data-pyk="必:bì 须:xū" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ---------- 世界学习课：两幅 SVG。分步效果由 onRender 给 .nd-world 加 s1、s2…… ---------- */
const name = (x, y, t) => `<g class="nd-name" transform="translate(${x} ${y})"><rect x="-58" y="-34" width="116" height="52" rx="26"/><text y="6">${t}</text></g>`;
const SUN = (lit) => `<g class="nd-sun${lit ? ' lit' : ''}"><g class="nd-sunbody">
  <g class="nd-rays">${Array.from({ length: 12 }, (_, i) => `<path d="M0 -120V-150" transform="rotate(${i * 30})"/>`).join('')}</g>
  <circle class="nd-disc" r="90"/><circle class="nd-eye" cx="-28" cy="-12" r="8"/><circle class="nd-eye" cx="28" cy="-12" r="8"/><path class="nd-mouth" d="M-26 26Q0 46 26 26"/><ellipse class="nd-sing" cy="34" rx="18" ry="22"/>
</g>${name(0, 190, '太阳')}</g>`;
const WORLD = {
  1: `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" aria-label="世界学习课：太阳">
    <rect class="nd-skyr" width="1600" height="900"/>
    ${Array.from({ length: 40 }, (_, i) => `<circle class="nd-star" cx="${(i * 397) % 1600}" cy="${(i * 211) % 520}" r="${2 + (i % 3)}"/>`).join('')}
    <g class="nd-shake">
      <path class="nd-hill" d="M0 700Q260 520 520 690Q760 560 1000 700Q1280 540 1600 690V900H0Z"/>
      <g transform="translate(1180 470)">${SUN(false)}</g>
      <g class="nd-q" data-step="1"><text x="1180" y="330">？</text><text x="380" y="560">？</text><text x="820" y="600">？</text></g>
      <g class="nd-ghost"><circle cx="380" cy="640" r="40"/><path d="M760 760Q820 730 880 760"/></g>
      <g class="nd-waves">${[0, 1, 2].map((k) => `<path d="M${1300 + k * 60} ${360 - k * 30}l20 -30l20 30l20 -30l20 30" />`).join('')}${[0, 1, 2].map((k) => `<path d="M${1000 - k * 60} ${360 - k * 30}l-20 -30l-20 30l-20 -30l-20 30" />`).join('')}</g>
    </g>
  </svg>`,
  2: `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" aria-label="世界学习课：万物有了秩序">
    <rect class="nd-skyr" width="1600" height="900"/>
    ${Array.from({ length: 40 }, (_, i) => `<circle class="nd-star" cx="${(i * 397) % 1600}" cy="${(i * 211) % 520}" r="${2 + (i % 3)}"/>`).join('')}
    <g transform="translate(1320 300) scale(.7)">${SUN(true)}</g>
    <path class="nd-hill" d="M0 700Q260 520 520 690Q760 560 1000 700Q1280 540 1600 690V900H0Z"/>
    <path class="nd-river" d="M80 900Q300 760 520 800T980 760T1600 800"/>
    <path class="nd-flow" d="M80 900Q300 760 520 800T980 760T1600 800"/>
    <g class="nd-grow">${[[200, 720], [300, 700], [640, 690], [760, 720], [1100, 700], [1240, 690], [1420, 720]].map(([x, y], i) => `<path style="--d:${i * 0.15}s" d="M${x} ${y}q-6 -30 -28 -40q26 4 28 26q4 -36 30 -46q-20 22 -30 60Z"/>`).join('')}${name(250, 620, '小草')}</g>
    <g class="nd-cloud"><path d="M420 200a60 60 0 0 1 110 -30a70 70 0 0 1 130 20a50 50 0 0 1 10 100H430a50 50 0 0 1 -10 -90Z"/>${name(560, 140, '云')}</g>
    <g class="nd-rain">${Array.from({ length: 16 }, (_, i) => `<line x1="${440 + (i % 8) * 30}" y1="${310 + Math.floor(i / 8) * 40}" x2="${432 + (i % 8) * 30}" y2="${340 + Math.floor(i / 8) * 40}" style="--d:${(i % 5) * 0.2}s"/>`).join('')}${name(760, 420, '雨')}</g>
    <g class="nd-man" transform="translate(900 520)"><circle class="nd-head" r="44"/><path class="nd-body" d="M-46 120Q0 40 46 120Z"/><path class="nd-shut" d="M-24 -4h16M8 -4h16"/><g class="nd-open"><circle cx="-16" cy="-6" r="7"/><circle cx="16" cy="-6" r="7"/></g><path class="nd-smile" d="M-16 16Q0 28 16 16"/>${name(0, -80, '人')}</g>
    <g class="nd-order"><rect x="620" y="150" width="360" height="80" rx="40"/><text x="800" y="206">有秩序啦</text></g>
  </svg>`,
};
document.querySelectorAll('[data-world]').forEach((el) => { el.innerHTML = WORLD[el.dataset.world]; });

Hanzi.init({
  shapes: {
    竹: ['M30 8V94', 'M30 20L14 34', 'M30 20L44 30', 'M70 8V94', 'M70 20L54 34', 'M70 20L86 30'],
    间: ['M20 10L28 18', 'M18 24V92', 'M30 14H80V92', 'M40 40H66V70H40Z', 'M40 55H66'],
    争: ['M44 10L26 30', 'M44 10H70L60 24', 'M24 40H76V56', 'M20 56H82', 'M50 24V94'],
  },
  cards: [
    { z: '纪', py: 'jì', bs: '纟', bh: 6, words: [['年纪', 'nián jì'], ['纪念', 'jì niàn']] },
    { z: '必', py: 'bì', bs: '心', bh: 5, words: [['必须', 'bì xū'], ['不必', 'bú bì']] },
    { z: '须', py: 'xū', bs: '页', bh: 9, words: [['必须', 'bì xū'], ['胡须', 'hú xū']] },
    { z: '功', py: 'gōng', bs: '力', bh: 5, words: [['成功', 'chéng gōng'], ['功课', 'gōng kè']] },
    { z: '譬', py: 'pì', bs: '言', bh: 20, words: [['譬如', 'pì rú']] },
    { z: '糙', py: 'cāo', bs: '米', bh: 16, words: [['粗糙', 'cū cāo']] },
    { z: '敏', py: 'mǐn', bs: '攵', bh: 11, words: [['敏感', 'mǐn gǎn'], ['灵敏', 'líng mǐn']] },
    { z: '式', py: 'shì', bs: '弋', bh: 6, words: [['方式', 'fāng shì'], ['样式', 'yàng shì']] },
    { z: '简', py: 'jiǎn', bs: '竹', bh: 13, words: [['简单', 'jiǎn dān'], ['竹简', 'zhú jiǎn']] },
    { z: '由', py: 'yóu', bs: '田', bh: 5, words: [['自由', 'zì yóu'], ['由于', 'yóu yú']] },
    { z: '睁', py: 'zhēng', bs: '目', bh: 11, words: [['睁开', 'zhēng kāi'], ['睁眼', 'zhēng yǎn']] },
    { z: '秩', py: 'zhì', bs: '禾', bh: 10, words: [['秩序', 'zhì xù']] },
    { z: '序', py: 'xù', bs: '广', bh: 7, words: [['秩序', 'zhì xù'], ['顺序', 'shùn xù']] },
    { z: '哦', py: 'ò', bs: '口', bh: 10, words: [['哦', 'ò']] },
  ],
  evolve: [
    { z: '简', old: ['竹', '间'], note: '竹字头：古时候没有纸，字写在一根根竹片上，叫“竹简”。下面的“间”表示读音。' },
    { z: '睁', old: ['目', '争'], note: '左边“目”是眼睛，右边“争”表示读音。睁开的是眼睛，所以是目字旁。' },
  ],
  write: [
    { z: '世', py: 'shì', bs: '一', bh: 5 },
    { z: '界', py: 'jiè', bs: '田', bh: 9 },
    { z: '功', py: 'gōng', bs: '力', bh: 5 },
    { z: '复', py: 'fù', bs: '夂', bh: 9 },
    { z: '式', py: 'shì', bs: '弋', bh: 6 },
    { z: '简', py: 'jiǎn', bs: '竹', bh: 13 },
    { z: '弄', py: 'nòng', bs: '王', bh: 7 },
    { z: '由', py: 'yóu', bs: '田', bh: 5 },
  ],
});

/* ---------- 课后 1：最喜欢的部分 ---------- */
const FAV = [
  ['☀ 太阳学发光', '太阳开始学发光，学着怎么上山下山。它也试过做别的事，但是都没有成功。譬如说唱歌，它粗糙的声音，把这个敏感的新世界吓坏了。', '读到“粗糙的声音”，可以故意粗声粗气；“吓坏了”读出吃惊。'],
  ['🌙 月亮学变化', '月亮不知道自己该学些什么。学发光吗？白天它觉得这主意不好，晚上它又觉得这主意不错。它一直无法决定，只好反反复复，一下子变圆，一下子又变缺。于是它学会的是不断变化。', '“不好”“不错”对比着读；“一下子变圆，一下子又变缺”读得快一点。'],
  ['💧 水学流动', '水开始学习流动。它很快就学会了，因为只有一种方式，那就是：一直往低处流，往低处流，往低处流……', '三个“往低处流”一个比一个轻，像水流远了。'],
  ['🌱 世界有秩序', '世界在慢慢变化，万物在自由生长。雨从云里落下，滴进泥土里；人睁开眼睛，就可以看到一切有多美好……只要万物都做它最容易做的事，这世界就很有秩序了。', '读得慢慢的、美美的，“一切有多美好”可以停一停。'],
];
function initFav() {
  const box = document.getElementById('ndFav');
  const text = document.getElementById('ndFavText');
  box.innerHTML = FAV.map(([t], i) => `<button type="button" class="btn" data-i="${i}">${t}</button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.btn');
    if (!b) return;
    const [, txt, how] = FAV[+b.dataset.i];
    box.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    text.innerHTML = `<p class="nd-ft">${txt}</p><p class="nd-how">朗读提示：${how}</p>`;
  });
}

/* ---------- 课后 2：故事转盘 ---------- */
const WHO = [['🌬️', '风', '学吹'], ['⭐', '星星', '学眨眼'], ['🐦', '小鸟', '学唱歌'], ['🌸', '花', '学开放'], ['🪨', '石头', '学……'], ['🌱', '小草', '学长高']];
const STARTS = ['很久很久以前，当世界年纪还小的时候……', '这世界还相当有秩序……'];
function initSpin() {
  const wheel = document.getElementById('ndWheel');
  const frame = document.getElementById('ndFrame');
  const seg = 360 / WHO.length;
  let s = 0;
  let turn = 0;
  let who = -1;
  wheel.innerHTML = WHO.map(([e, n], i) => `<span style="--a:${i * seg + seg / 2}deg"><b>${e}</b>${n}</span>`).join('');
  const tell = () => {
    if (who < 0) { frame.textContent = `${STARTS[s]}（转一转，看看轮到谁）`; return; }
    const [e, n, act] = WHO[who];
    frame.innerHTML = s === 0
      ? `${STARTS[0]}<br>${e} ${n}开始${act}。它……<br><b>（接着讲：它学会了吗？学会的是什么？）</b>`
      : `${STARTS[1]}<br>可是有一天，${e} ${n}不想做它最容易做的事了……<br><b>（接着讲：世界会变成什么样？）</b>`;
  };
  document.querySelectorAll('[data-s]').forEach((b) => b.addEventListener('click', () => {
    s = +b.dataset.s;
    document.querySelectorAll('[data-s]').forEach((x) => x.classList.toggle('solid', x === b));
    tell();
  }));
  document.getElementById('ndGo').addEventListener('click', () => {
    who = Math.floor(Math.random() * WHO.length);
    turn += 3;
    wheel.style.transform = `rotate(${-(turn * 360 + who * seg + seg / 2)}deg)`;
    frame.textContent = '转呀转……';
    setTimeout(tell, 2100);
  });
  tell();
}

/* ---------- 识字游戏：点亮星星 ---------- */
const GAME = [['纪', 'jì'], ['必', 'bì'], ['须', 'xū'], ['功', 'gōng'], ['譬', 'pì'], ['糙', 'cāo'], ['敏', 'mǐn'],
  ['式', 'shì'], ['简', 'jiǎn'], ['由', 'yóu'], ['睁', 'zhēng'], ['秩', 'zhì'], ['序', 'xù'], ['哦', 'ò']];
const STAR_POS = [[8, 30], [20, 14], [30, 44], [40, 20], [50, 50], [58, 18], [68, 40], [78, 12], [88, 34], [14, 66], [32, 76], [54, 80], [72, 70], [90, 72]];
function initSky() {
  const sky = document.getElementById('ndSky');
  const msg = document.getElementById('ndGMsg');
  const draw = () => {
    sky.classList.remove('all');
    sky.innerHTML = GAME.map(([z, p], i) => `<button type="button" class="nd-st" style="left:${STAR_POS[i][0]}%;top:${STAR_POS[i][1]}%">${Hanzi.ruby(z, p)}</button>`).join('');
    msg.textContent = '亮了 0 颗星';
  };
  sky.addEventListener('click', (e) => {
    const b = e.target.closest('.nd-st:not(.lit)');
    if (!b) return;
    b.classList.add('lit');
    const n = sky.querySelectorAll('.nd-st.lit').length;
    sky.classList.toggle('all', n === GAME.length);
    msg.innerHTML = n === GAME.length ? '满天星星都亮了！<button type="button" class="btn" id="ndAgain">再来一次</button>' : `亮了 ${n} 颗星`;
  });
  msg.addEventListener('click', (e) => { if (e.target.id === 'ndAgain') draw(); });
  draw();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initFav();
    initSpin();
    initSky();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    const w = slide.querySelector('.nd-world');
    if (!w) return;
    for (let k = 1; k <= 5; k += 1) w.classList.toggle(`s${k}`, k <= step);
  },
};
