'use strict';
/* 狐假虎威 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用）
 * 本课独有：① 舞台剧：台词一句句亮起，狐狸、老虎跟着做动作（字幕行上写 data-set / data-unset 加减舞台状态，data-who 谁在说）；
 *           ② 神态词分类：放对了角色就把词“演”出来；③ 草丛里“吓”出生字。 */

/* ================= 角色（脚底在 0,0；狐狸朝右，老虎朝左） ================= */
const FOX = `<g class="fx">
  <g class="fx-tail"><path d="M-50 -70Q-170 -60 -160 -200Q-120 -130 -40 -110Z" fill="#e8762c"/><path d="M-160 -200Q-150 -160 -128 -150Q-168 -170 -160 -200Z" fill="#fff"/></g>
  <path d="M-40 -40v40M-10 -36v36M30 -36v36M55 -40v40" stroke="#c75a1c" stroke-width="14" stroke-linecap="round"/>
  <ellipse cx="10" cy="-80" rx="72" ry="52" fill="#ef8a3a"/><ellipse cx="34" cy="-70" rx="32" ry="34" fill="#fff6ea"/>
  <g class="fx-arm"><path d="M50 -90Q90 -100 100 -70" fill="none" stroke="#ef8a3a" stroke-width="16" stroke-linecap="round"/></g>
  <g class="fx-head">
    <path d="M30 -200L40 -262L76 -214ZM80 -212L112 -258L112 -196Z" fill="#e8762c"/><path d="M42 -222L46 -246L64 -220Z" fill="#fff"/>
    <ellipse cx="70" cy="-176" rx="56" ry="46" fill="#ef8a3a"/>
    <path d="M92 -180L162 -160L96 -138Z" fill="#fff6ea"/><circle cx="160" cy="-160" r="9" fill="#2a1a10"/>
    <g class="fx-eyes"><ellipse cx="62" cy="-188" rx="11" ry="13" fill="#fff"/><ellipse cx="96" cy="-190" rx="10" ry="12" fill="#fff"/>
      <g class="fx-pupil"><circle cx="66" cy="-188" r="6" fill="#2a1a10"/><circle cx="99" cy="-190" r="6" fill="#2a1a10"/></g></g>
    <path d="M110 -150Q122 -142 134 -150" fill="none" stroke="#2a1a10" stroke-width="4" stroke-linecap="round"/>
  </g>
</g>`;
const TIGER = `<g class="tg">
  <path class="tg-tail" d="M110 -110Q200 -120 190 -220Q186 -250 210 -250" fill="none" stroke="#f2a33a" stroke-width="20" stroke-linecap="round"/>
  <path d="M-80 -50v50M-40 -46v46M50 -46v46M90 -50v50" stroke="#e08f22" stroke-width="26" stroke-linecap="round"/>
  <ellipse cx="10" cy="-110" rx="125" ry="78" fill="#f2a33a"/>
  <path d="M-20 -186Q-30 -150 -14 -120M20 -188Q10 -150 26 -118M60 -180Q50 -150 66 -122" fill="none" stroke="#3a2a1a" stroke-width="12" stroke-linecap="round"/>
  <g class="tg-paw"><ellipse cx="-118" cy="-30" rx="36" ry="24" fill="#f2a33a" stroke="#e08f22" stroke-width="4"/></g>
  <g class="tg-reach"><path d="M-60 -110L-330 -90" stroke="#f2a33a" stroke-width="34" stroke-linecap="round"/><path d="M-130 -122l-6 26M-200 -116l-6 26M-270 -110l-6 26" stroke="#3a2a1a" stroke-width="8" stroke-linecap="round"/><ellipse cx="-340" cy="-86" rx="40" ry="26" fill="#f2a33a" stroke="#e08f22" stroke-width="4"/></g>
  <g class="tg-head">
    <circle cx="-120" cy="-212" r="26" fill="#f2a33a"/><circle cx="-40" cy="-226" r="26" fill="#f2a33a"/><circle cx="-120" cy="-212" r="13" fill="#ffd9b0"/><circle cx="-40" cy="-226" r="13" fill="#ffd9b0"/>
    <circle cx="-90" cy="-170" r="78" fill="#f2a33a"/>
    <path d="M-90 -246v20M-112 -240l6 16M-68 -240l-6 16M-166 -170h22M-14 -170h-22" stroke="#3a2a1a" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="-100" cy="-138" rx="46" ry="32" fill="#fff6ea"/>
    <g class="tg-eyes"><circle cx="-122" cy="-182" r="12" fill="#fff"/><circle cx="-70" cy="-182" r="12" fill="#fff"/><circle class="tg-p" cx="-125" cy="-182" r="7" fill="#2a1a10"/><circle class="tg-p" cx="-73" cy="-182" r="7" fill="#2a1a10"/></g>
    <path d="M-112 -154h24l-12 12Z" fill="#c0504a"/>
    <path class="tg-mouth" d="M-116 -128Q-100 -118 -84 -128" fill="none" stroke="#2a1a10" stroke-width="4" stroke-linecap="round"/>
    <text class="tg-q" x="-60" y="-280">?!</text>
    <g class="tg-dizzy" fill="none" stroke="#6a5acd" stroke-width="5"><path d="M-130 -280q20-20 40 0t40 0"/><path d="M-120 -300q16-14 32 0t32 0"/></g>
  </g>
</g>`;
const ANIMALS = ['🐗', '🦌', '🐇', '🐇', '🦌'];

function stageSvg(scene) {
  const trees = Array.from({ length: 9 }, (_, i) => {
    const x = i * 220 + 40;
    return `<g transform="translate(${x} 0)"><rect x="-14" y="300" width="28" height="200" fill="#7a5233"/><circle cx="0" cy="270" r="${80 + (i % 3) * 18}" fill="${i % 2 ? '#5f9e4a' : '#4c8a3c'}"/><circle cx="-50" cy="320" r="50" fill="#6aaa52"/></g>`;
  }).join('');
  const animals = ANIMALS.map((a, i) => `<text class="hj-an" x="${1130 + (i % 3) * 105}" y="${470 + Math.floor(i / 3) * 70}" style="--d:${i * 0.15}s">${a}<tspan class="hj-anq" dx="-30" dy="-60">?</tspan></text>`).join('');
  return `<svg viewBox="0 0 1600 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="1600" height="640" fill="#cfe9c4"/>
    <g class="hj-trees">${trees}${trees.replace(/translate\((\d+) 0\)/g, (_, x) => `translate(${+x + 1980} 0)`)}</g>
    <path d="M0 520Q800 490 1600 520V640H0Z" fill="#9ccc72"/>
    ${scene === '2' ? `<g class="hj-animals">${animals}</g>` : ''}
    <g class="hj-fox" transform="${scene === '2' ? 'translate(1000 590)' : 'translate(520 590)'}"><g class="hj-in">${FOX}</g></g>
    <g class="hj-tiger" transform="${scene === '2' ? 'translate(470 590) scale(-1 1)' : 'translate(1080 590)'}"><g class="hj-in">${TIGER}</g></g>
    <g class="hj-truth"><text x="${scene === '2' ? 470 : 1080}" y="250">百兽怕的是老虎！</text><text x="1000" y="250" class="small">借威风</text></g>
    <path d="M0 0H130Q110 300 140 640H0Z" fill="#b8322c"/><path d="M1600 0H1470Q1490 300 1460 640H1600Z" fill="#b8322c"/>
    <path d="M0 0H1600V40Q800 70 0 40Z" fill="#9e2a25"/>
  </svg><span class="hj-bub fox">💬</span><span class="hj-bub tiger">💬</span>`;
}

/* 舞台状态：data-init + 已出现台词的 data-set / data-unset；只显示最新一句台词 */
const words = (s) => (s || '').split(/\s+/).filter(Boolean);
const STATES = ['tiger', 'fox', 'caught', 'roll', 'proud', 'leng', 'up', 'release', 'dizzy', 'wag', 'walk', 'sway', 'look', 'animals', 'ask', 'run', 'truth'];
function applyStage(slide, step) {
  const st = slide.querySelector('.hj-stage');  // 只认舞台；分类页的小演员用 .hj-act
  if (!st) return;
  const on = new Set(words(st.dataset.init));
  let who = '';
  const lines = [...slide.querySelectorAll('.hj-l')];
  lines.filter((l) => +l.dataset.step <= step).forEach((l) => {
    words(l.dataset.set).forEach((k) => on.add(k));
    words(l.dataset.unset).forEach((k) => on.delete(k));
    who = l.dataset.who;
  });
  STATES.forEach((k) => st.classList.toggle(`s-${k}`, on.has(k)));
  st.dataset.who = who;
  lines.forEach((l) => l.classList.toggle('cur', +l.dataset.step === step));
}
document.querySelectorAll('.hj-stage').forEach((st) => { st.innerHTML = stageSvg(st.dataset.scene); });
document.querySelectorAll('.slide').forEach((s) => applyStage(s, 0));

/* ================= 神态词分类 ================= */
const SORT = [['神气活现', 'shén qì huó xiàn', 'fox', 'proud'], ['半信半疑', 'bàn xìn bàn yí', 'tiger', 'leng'], ['摇头摆尾', 'yáo tóu bǎi wěi', 'fox', 'sway'],
  ['东张西望', 'dōng zhāng xī wàng', 'tiger', 'look'], ['大摇大摆', 'dà yáo dà bǎi', 'fox', 'walk']];
function miniSvg(who) {
  return `<svg viewBox="${who === 'fox' ? '-200 -290 400 300' : '-230 -320 460 330'}" aria-hidden="true"><g class="hj-in">${who === 'fox' ? FOX : TIGER}</g></svg>`;
}
function initSort(box) {
  if (!box) return;
  box.innerHTML = `<div class="hs-zone" data-z="fox"><div class="hs-actor hj-act">${miniSvg('fox')}</div><b>写狐狸</b><div class="hs-got"></div></div>
    <div class="hs-mid"><div class="hs-words">${SORT.map(([w, py], i) => `<button type="button" class="hs-w" data-i="${i}">${Hanzi.ruby(w, py)}</button>`).join('')}</div><p class="hs-msg">先点一个词，再点狐狸或老虎。</p><button type="button" class="btn" data-again>重新分</button></div>
    <div class="hs-zone" data-z="tiger"><div class="hs-actor hj-act">${miniSvg('tiger')}</div><b>写老虎</b><div class="hs-got"></div></div>`;
  const msg = box.querySelector('.hs-msg');
  let sel = null;
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      sel = null; box.classList.remove('all-done');
      box.querySelectorAll('.hs-w').forEach((w) => w.classList.remove('used', 'sel', 'wrong'));
      box.querySelectorAll('.hs-got').forEach((g) => { g.innerHTML = ''; });
      box.querySelectorAll('.hs-actor').forEach((a) => { a.className = 'hs-actor hj-act'; });
      msg.textContent = '先点一个词，再点狐狸或老虎。'; return;
    }
    const w = e.target.closest('.hs-w:not(.used)');
    if (w) {
      box.querySelectorAll('.hs-w').forEach((x) => x.classList.toggle('sel', x === w));
      sel = +w.dataset.i; msg.textContent = `“${SORT[sel][0]}”是写谁的？点狐狸或老虎。`; return;
    }
    const z = e.target.closest('.hs-zone');
    if (!z || sel === null) return;
    const [word, py, who, act] = SORT[sel];
    const btn = box.querySelector(`.hs-w[data-i="${sel}"]`);
    if (z.dataset.z !== who) {
      btn.classList.remove('wrong'); void btn.offsetWidth; btn.classList.add('wrong');
      msg.textContent = '再想想，课文里这个词写的是谁？'; return;
    }
    btn.classList.add('used'); btn.classList.remove('sel');
    z.querySelector('.hs-got').insertAdjacentHTML('beforeend', `<span>${Hanzi.ruby(word, py)}</span>`);
    const actor = z.querySelector('.hs-actor');
    actor.className = `hs-actor hj-stage s-${act} s-fox s-tiger`;
    sel = null;
    const left = box.querySelectorAll('.hs-w:not(.used)').length;
    msg.textContent = left ? `对！看，${who === 'fox' ? '狐狸' : '老虎'}演“${word}”。` : '全分好了！分角色演一演吧。';
    box.classList.toggle('all-done', !left);
  });
}
initSort(document.getElementById('hjSort'));

/* ================= 草丛里“吓”出生字 ================= */
const GAME = [['假', 'jiǎ'], ['威', 'wēi'], ['转', 'zhuàn'], ['扯', 'chě'], ['嗓', 'sǎng'], ['兽', 'shòu'], ['违', 'wéi'], ['抗', 'kàng'], ['爪', 'zhuǎ'],
  ['趟', 'tàng'], ['神', 'shén'], ['猪', 'zhū'], ['纳', 'nà'], ['闷', 'mèn'], ['受', 'shòu'], ['骗', 'piàn'], ['借', 'jiè']];
const ASK = [0, 11, 3, 15, 7, 13, 1, 9, 5, 16, 2, 12, 8, 4, 10, 6, 14];
const RUNNERS = ['🐗', '🦌', '🐇', '🐿️', '🦔'];
function initBush(box) {
  if (!box) return;
  box.innerHTML = `<div class="hg-bar"><span class="hg-q"></span><span class="hg-msg">哪个草丛里藏着这个字？</span><button type="button" class="btn" data-again>再玩一次</button></div>
    <div class="hg-field">${GAME.map(([z], i) => `<button type="button" class="hg-bush" data-i="${i}"><b>${z}</b><i class="hg-leaf"></i><span class="hg-run">${RUNNERS[i % RUNNERS.length]}</span></button>`).join('')}</div>`;
  const q = box.querySelector('.hg-q');
  const msg = box.querySelector('.hg-msg');
  let k = 0;
  // “兽、受”同音：问 shòu 时两个都算对
  const ask = () => { q.textContent = k < ASK.length ? GAME[ASK[k]][1] : '★'; };
  ask();
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      k = 0; box.classList.remove('all-done');
      box.querySelectorAll('.hg-bush').forEach((b) => b.classList.remove('ok', 'wrong'));
      msg.textContent = '哪个草丛里藏着这个字？'; ask(); return;
    }
    const b = e.target.closest('.hg-bush:not(.ok)');
    if (!b || k >= ASK.length) return;
    const i = +b.dataset.i;
    if (GAME[i][1] !== GAME[ASK[k]][1]) {
      b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
      msg.textContent = '这里没有，再找找！'; return;
    }
    const j = ASK.indexOf(i, k);
    [ASK[k], ASK[j]] = [ASK[j], ASK[k]];
    b.classList.add('ok');
    k += 1;
    msg.textContent = k < ASK.length ? `“${GAME[i][0]}”！小动物撒腿就跑啦。` : '17 个字都找到了！';
    box.classList.toggle('all-done', k === ASK.length);
    ask();
  });
}
initBush(document.getElementById('hjGame'));

Hanzi.init({
  cards: [
    { z: '假', py: 'jiǎ', bs: '亻', bh: 11, words: [['狐假虎威', 'hú jiǎ hǔ wēi'], ['真假', 'zhēn jiǎ']] },
    { z: '威', py: 'wēi', bh: 9, words: [['威风', 'wēi fēng']] },
    { z: '转', py: 'zhuàn', bs: '车', bh: 8, words: [['一转', 'yí zhuàn'], ['转圈', 'zhuàn quān']] },
    { z: '扯', py: 'chě', bs: '扌', bh: 7, words: [['扯着嗓子', 'chě zhe sǎng zi']] },
    { z: '嗓', py: 'sǎng', bs: '口', bh: 13, words: [['嗓子', 'sǎng zi']] },
    { z: '兽', py: 'shòu', bh: 11, words: [['百兽', 'bǎi shòu'], ['野兽', 'yě shòu']] },
    { z: '违', py: 'wéi', bs: '辶', bh: 7, words: [['违抗', 'wéi kàng']] },
    { z: '抗', py: 'kàng', bs: '扌', bh: 7, words: [['违抗', 'wéi kàng'], ['抵抗', 'dǐ kàng']] },
    { z: '爪', py: 'zhuǎ', bs: '爪', bh: 4, words: [['爪子', 'zhuǎ zi']] },
    { z: '趟', py: 'tàng', bs: '走', bh: 15, words: [['走一趟', 'zǒu yí tàng']] },
    { z: '神', py: 'shén', bs: '礻', bh: 9, words: [['神气', 'shén qì'], ['精神', 'jīng shen']] },
    { z: '猪', py: 'zhū', bs: '犭', bh: 11, words: [['野猪', 'yě zhū'], ['小猪', 'xiǎo zhū']] },
    { z: '纳', py: 'nà', bs: '纟', bh: 7, words: [['纳闷', 'nà mèn']] },
    { z: '闷', py: 'mèn', bs: '门', bh: 7, words: [['纳闷', 'nà mèn']] },
    { z: '受', py: 'shòu', bs: '爫', bh: 8, words: [['受骗', 'shòu piàn'], ['难受', 'nán shòu']] },
    { z: '骗', py: 'piàn', bs: '马', bh: 12, words: [['受骗', 'shòu piàn'], ['骗人', 'piàn rén']] },
    { z: '借', py: 'jiè', bs: '亻', bh: 10, words: [['借着', 'jiè zhe'], ['借书', 'jiè shū']] },
  ],
  pick: {
    yin: [
      { q: '把狐狸“逮”住了', py: 'bǎ hú li dǎi zhù le', ans: 'dǎi', opts: ['dài', 'dǎi'] },
      { q: '眼珠子骨碌碌一“转”', py: 'yǎn zhū zi gū lū lū yí zhuàn', ans: 'zhuàn', opts: ['zhuǎn', 'zhuàn'] },
      { q: '老虎被“蒙”住了', py: 'lǎo hǔ bèi mēng zhù le', ans: 'mēng', opts: ['méng', 'mēng'] },
      { q: '松开了“爪”子', py: 'sōng kāi le zhuǎ zi', ans: 'zhuǎ', opts: ['zhǎo', 'zhuǎ'] },
      { q: '吓得“撒”腿就跑', py: 'xià de sā tuǐ jiù pǎo', ans: 'sā', opts: ['sā', 'sǎ'] },
    ],
  },
  write: {
    a: [
      { z: '食', py: 'shí', bs: '人', bh: 9 },
      { z: '物', py: 'wù', bs: '牛', bh: 8 },
      { z: '爷', py: 'yé', bs: '父', bh: 6 },
      { z: '就', py: 'jiù', bs: '尢', bh: 12 },
    ],
    b: [
      { z: '爪', py: 'zhuǎ', bs: '爪', bh: 4 },
      { z: '神', py: 'shén', bs: '礻', bh: 9 },
      { z: '活', py: 'huó', bs: '氵', bh: 9 },
      { z: '猪', py: 'zhū', bs: '犭', bh: 11 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    applyStage(slide, step);
  },
};
