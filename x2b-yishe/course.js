'use strict';
/* 羿射九日 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 扶桑树上的十个太阳（轮流值日坐两轮车 → 一齐跑出来）；② 射日动画（射下九个、最后一个躲进大海、世界变黑、留下一个；只表现火花，不血腥）；
 *           ③ 起因—经过—结果情节图；④ 太阳回家识字游戏 */

/* 二下课文只给生字注音：data-pyk="值:zhí 炙:zhì" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
const HAN = /\p{Script=Han}/u;
function pykToPy(text, spec) {
  const want = spec.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...text].filter((ch) => HAN.test(ch)).map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${text}）`); // eslint-disable-line no-console
  return syl.join(' ');
}
document.querySelectorAll('[data-pyk]').forEach((el) => { el.dataset.py = pykToPy(el.textContent, el.dataset.pyk); });

const sunG = (cls = '') => `<g class="ys-sun ${cls}"><circle r="26" class="ys-glow"/><circle r="18" class="ys-core"/></g>`;

/* ---------- 扶桑树：十个太阳（onRender 加 s1–s3） ---------- */
const FS_SUNS = [[640, 92], [560, 170], [600, 200], [650, 180], [700, 205], [740, 170], [590, 250], [640, 262], [690, 248], [730, 240]];
const FS_SKY = [[90, 70], [190, 120], [280, 60], [360, 130], [450, 70], [120, 190], [250, 210], [400, 200], [520, 120], [600, 60]];
document.querySelectorAll('[data-fusang]').forEach((el) => {
  el.innerHTML = `<svg viewBox="0 0 800 420" aria-label="扶桑树和十个太阳">
    <rect class="ys-fsky" width="800" height="420"/>
    <path class="ys-sea" d="M0 330Q200 316 400 330T800 326V420H0Z"/>
    <path class="ys-trunk-s" d="M640 330C632 280 636 240 640 120M640 240C610 220 580 200 560 176M640 240C670 220 710 208 740 176M640 210C610 230 596 244 590 252M640 210C668 236 690 246 700 250"/>
    <g class="ys-crown"><circle cx="560" cy="150" r="46"/><circle cx="640" cy="120" r="56"/><circle cx="720" cy="150" r="48"/><circle cx="600" cy="220" r="44"/><circle cx="690" cy="220" r="46"/></g>
    ${FS_SUNS.map(([x, y], i) => `<g class="ys-fspos" style="--x:${x}px;--y:${y}px;--tx:${FS_SKY[i][0]}px;--ty:${FS_SKY[i][1]}px;--d:${i * 0.08}s">${sunG(i === 0 ? 'top' : '')}</g>`).join('')}
    <g class="ys-cart"><path d="M-30 4H30L22 22H-22Z" fill="#c2803e"/><circle cx="-14" cy="26" r="9" class="ys-wheel"/><circle cx="14" cy="26" r="9" class="ys-wheel"/>${sunG()}</g>
    <g class="ys-tag"><rect x="40" y="350" width="250" height="52" rx="26"/><text x="165" y="386">1 + 9 = 10 个</text></g>
  </svg>`;
});

Hanzi.init({
  shapes: {
    弓: ['M40 10Q76 30 74 50Q72 70 40 90', 'M40 10C34 30 30 70 40 90'],
    射: ['M30 10Q66 30 64 50Q62 70 30 90', 'M30 10C24 30 20 70 30 90', 'M10 50H90', 'M80 42L92 50L80 58'],
  },
  cards: [
    { z: '射', py: 'shè', bs: '身', bh: 10, words: [['射箭', 'shè jiàn'], ['射下', 'shè xià']] },
    { z: '值', py: 'zhí', bs: '亻', bh: 10, words: [['值日', 'zhí rì'], ['价值', 'jià zhí']] },
    { z: '熔', py: 'róng', bs: '火', bh: 14, words: [['熔化', 'róng huà']] },
    { z: '类', py: 'lèi', bs: '米', bh: 9, words: [['人类', 'rén lèi'], ['种类', 'zhǒng lèi']] },
    { z: '艰', py: 'jiān', bs: '又', bh: 8, words: [['艰难', 'jiān nán'], ['艰苦', 'jiān kǔ']] },
    { z: '箭', py: 'jiàn', bs: '竹', bh: 15, words: [['神箭', 'shén jiàn'], ['弓箭', 'gōng jiàn']] },
    { z: '裂', py: 'liè', bs: '衣', bh: 12, words: [['爆裂', 'bào liè'], ['裂开', 'liè kāi']] },
    { z: '炎', py: 'yán', bs: '火', bh: 8, words: [['炎热', 'yán rè'], ['炎炎夏日', 'yán yán xià rì']] },
    { z: '退', py: 'tuì', bs: '辶', bh: 9, words: [['退去', 'tuì qù'], ['后退', 'hòu tuì']] },
    { z: '庄', py: 'zhuāng', bs: '广', bh: 6, words: [['庄稼', 'zhuāng jia'], ['村庄', 'cūn zhuāng']] },
    { z: '稼', py: 'jià', bs: '禾', bh: 15, words: [['庄稼', 'zhuāng jia']] },
    { z: '滋', py: 'zī', bs: '氵', bh: 12, words: [['滋润', 'zī rùn']] },
    { z: '腾', py: 'téng', bs: '月', bh: 13, words: [['奔腾', 'bēn téng'], ['欢腾', 'huān téng']] },
  ],
  evolve: [
    { z: '弓', note: '就像一张弯弯的弓：一根弯木头，两头拴着弦。羿“拉开神弓”，拉的就是它。' },
    { z: '射', note: '古字形是弓上搭着一支箭，箭头朝前，表示把箭射出去。后来字形变成了“身”和“寸”。' },
  ],
  write: [
    { z: '觉', py: 'jué', bs: '见', bh: 9 },
    { z: '值', py: 'zhí', bs: '亻', bh: 10 },
    { z: '类', py: 'lèi', bs: '米', bh: 9 },
    { z: '艰', py: 'jiān', bs: '又', bh: 8 },
    { z: '弓', py: 'gōng', bs: '弓', bh: 3 },
    { z: '炎', py: 'yán', bs: '火', bh: 8 },
    { z: '害', py: 'hài', bs: '宀', bh: 10 },
    { z: '此', py: 'cǐ', bs: '止', bh: 6 },
  ],
});

const STORY = {
  picks: {
    magic: [
      { t: '天上有十个太阳，轮流值日', ok: true, why: '神奇！真实的天上只有一个太阳' },
      { t: '太阳坐上两轮车穿过天空', ok: true, why: '神奇！把太阳想成了会坐车的人' },
      { t: '羿一箭就把太阳射下来', ok: true, why: '神奇！神箭手的本领真大' },
      { t: '最后一个太阳害怕地躲进大海', ok: true, why: '神奇！太阳也会害怕' },
      { t: '天太热，禾苗被晒枯了', ok: false, why: '现实中天太热也会这样' },
      { t: '太阳从东方升起，到西方落下', ok: false, why: '这是我们每天都能看到的' },
    ],
  },
};

/* ---------- 射日动画 ---------- */
const SKY_SUNS = [[140, 70], [250, 120], [350, 60], [450, 130], [540, 70], [640, 120], [720, 60], [200, 200], [400, 210], [600, 210]];
const ARCHER = [110, 318];
const SEA_Y = 360;
const SAY = {
  shot: (n) => [`嗖——射下了 ${n} 个`, ''],
  nine: ['羿一口气射下了九个太阳，炎热渐渐退去。', '炎:yán 退:tuì'],
  hide: ['羿又伸手拔箭，准备射下最后一个太阳。这个太阳害怕极了，慌慌张张地躲进了大海里。', ''],
  dark: ['天上没有了太阳，整个世界一片黑暗。羿想，没有了太阳，就没有了光明和温暖，庄稼不能生长，人类和动物也没法活下去。', '庄:zhuāng 稼:jià'],
  keep: ['于是，羿留下了最后一个太阳。', ''],
};
const BTN = { shoot: '嗖——射一箭', draw: '羿又伸手拔箭……', think: '天上没有了太阳……', keep: '留下最后一个太阳', done: '大地有了光明和温暖' };
function initShoot() {
  const sky = document.getElementById('ysSky');
  const act = document.getElementById('ysAct');
  const say = document.getElementById('ysSay');
  const heat = document.getElementById('ysHeat');
  const count = document.getElementById('ysCount');
  let shot = 0;
  let phase = 'shoot';
  let busy = false;
  const speak = ([t, spec]) => { say.innerHTML = Hanzi.ruby(t, pykToPy(t, spec || '')); };
  const update = () => {
    const left = 10 - shot - (phase === 'think' || phase === 'keep' ? 1 : 0);
    heat.style.height = `${Math.max(0, left) * 10}%`;
    count.textContent = `天上：${Math.max(0, left)} 个太阳`;
    act.textContent = BTN[phase];
    act.disabled = phase === 'done';
  };
  const draw = () => {
    shot = 0; phase = 'shoot'; busy = false;
    sky.setAttribute('class', 'ys-sky hot');
    sky.innerHTML = `<rect class="ys-bg" width="800" height="420"/>
      <path class="ys-ground" d="M0 330Q120 300 260 330L300 420H0Z"/><path class="ys-water" d="M260 330Q520 346 800 336V420H300Z"/>
      ${SKY_SUNS.map(([x, y], i) => `<g class="ys-ss" data-i="${i}" transform="translate(${x} ${y})">${sunG()}<g class="ys-sparks">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<circle r="5" style="--dx:${(46 * Math.cos((a * Math.PI) / 180)).toFixed(0)}px;--dy:${(46 * Math.sin((a * Math.PI) / 180)).toFixed(0)}px"/>`).join('')}</g></g>`).join('')}
      <g class="ys-archer" transform="translate(${ARCHER[0]} ${ARCHER[1]})"><circle cy="-46" r="11"/><path d="M-6 -34H6L10 0H-10Z"/><path class="bow" d="M14 -70Q46 -40 14 -10"/><path class="band" d="M-11 -50l-16 6"/></g>
      <line class="ys-arrow" id="ysArrow" x1="${ARCHER[0] + 10}" y1="${ARCHER[1] - 40}" x2="${ARCHER[0] + 10}" y2="${ARCHER[1] - 40}"/>
      <rect class="ys-night" width="800" height="420"/>`;
    say.innerHTML = '点按钮，帮羿射下天上多余的太阳。';
    update();
  };
  const shootOne = () => {
    const target = sky.querySelector(`.ys-ss[data-i="${shot}"]`);
    const [x, y] = SKY_SUNS[shot];
    const arrow = document.getElementById('ysArrow');
    arrow.setAttribute('x2', x);
    arrow.setAttribute('y2', y);
    arrow.classList.remove('fly'); void arrow.getBoundingClientRect(); arrow.classList.add('fly');
    busy = true;
    setTimeout(() => {
      target.classList.add('burst');
      shot += 1;
      if (shot === 9) { phase = 'draw'; sky.classList.remove('hot'); speak(SAY.nine); } else speak(SAY.shot(shot));
      update();
      busy = false;
    }, 450);
  };
  act.addEventListener('click', () => {
    if (busy) return;
    if (phase === 'shoot') { shootOne(); return; }
    if (phase === 'draw') {
      sky.querySelector('.ys-ss[data-i="9"]').classList.add('hide');
      phase = 'think'; speak(SAY.hide);
      setTimeout(() => sky.classList.add('dark'), 1400);
    } else if (phase === 'think') {
      phase = 'keep'; speak(SAY.dark);
    } else if (phase === 'keep') {
      sky.classList.remove('dark');
      sky.classList.add('bright');
      sky.querySelector('.ys-ss[data-i="9"]').classList.replace('hide', 'rise');
      phase = 'done'; speak(SAY.keep);
    }
    update();
  });
  document.getElementById('ysReset').addEventListener('click', draw);
  draw();
}

/* ---------- 识字游戏：太阳回家 ---------- */
const GAME = [['射', 'shè'], ['值', 'zhí'], ['熔', 'róng'], ['类', 'lèi'], ['艰', 'jiān'], ['箭', 'jiàn'], ['裂', 'liè'],
  ['炎', 'yán'], ['退', 'tuì'], ['庄', 'zhuāng'], ['稼', 'jià'], ['滋', 'zī'], ['腾', 'téng']];
function initHome() {
  const suns = document.getElementById('ysSuns');
  const tree = document.getElementById('ysTree');
  const msg = document.getElementById('ysGMsg');
  const draw = () => {
    tree.querySelectorAll('.ys-gs').forEach((s) => s.remove());
    suns.innerHTML = GAME.map(([z, p], i) => `<button type="button" class="ys-gs" style="--d:${(i % 4) * 0.3}s">${Hanzi.ruby(z, p)}</button>`).join('');
    msg.textContent = '回家了 0 个太阳';
  };
  suns.addEventListener('click', (e) => {
    const b = e.target.closest('.ys-gs');
    if (!b) return;
    b.classList.add('home');
    tree.appendChild(b);
    const n = tree.querySelectorAll('.ys-gs').length;
    msg.innerHTML = n === GAME.length ? '太阳都回到扶桑树上了！<button type="button" class="btn" id="ysAgain">再来一次</button>' : `回家了 ${n} 个太阳`;
  });
  msg.addEventListener('click', (e) => { if (e.target.id === 'ysAgain') draw(); });
  draw();
}

window.LESSON = {
  init() {
    Narrative.init(STORY);
    initShoot();
    initHome();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    const fs = slide.querySelector('.ys-fs svg');
    if (!fs) return;
    for (let k = 1; k <= 3; k += 1) fs.classList.toggle(`s${k}`, k <= step);
  },
};
