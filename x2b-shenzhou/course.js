'use strict';
/* 神州谣 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 拍手读（三字一拍逐组亮起）；② 山河意象卡（奔、涌、长、耸的小动画）；③ 神州拼图（接下半句露出画面）；④ 登山峰识字。 */

/* 二下只给生字注音：data-pyk="华:huá" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

const shake = (el) => { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); };

/* ================= 拍手读：把每行按逗号切成三字一拍 ================= */
const BEAT_MS = { fast: 850, slow: 1300 };
function initClap(box) {
  // 每行 “我神州，称中华，” → 两个 .sz-beat（标点跟在前一拍后面）
  box.querySelectorAll('.sz-lines p').forEach((p) => {
    p.innerHTML = p.innerHTML.replace(/((?:<ruby>.*?<\/ruby>){3}[，。])/g, '<span class="sz-beat">$1</span>');
  });
  const beats = [...box.querySelectorAll('.sz-beat')];
  const msg = box.querySelector('.sz-msg');
  let timers = [];
  const stop = () => { timers.forEach(clearTimeout); timers = []; beats.forEach((b) => b.classList.remove('lit', 'now')); box.classList.remove('run'); };
  const run = (ms) => {
    stop();
    box.classList.add('run');
    beats.forEach((b, i) => timers.push(setTimeout(() => {
      beats.forEach((x) => x.classList.remove('now'));
      b.classList.add('lit', 'now');
      box.querySelector('.sz-hand').classList.remove('hit'); void box.offsetWidth; box.querySelector('.sz-hand').classList.add('hit');
    }, 400 + i * ms)));
    timers.push(setTimeout(() => { box.classList.remove('run'); beats.forEach((x) => x.classList.remove('now')); msg.textContent = '拍完啦！再来一遍，声音更响亮。'; }, 400 + beats.length * ms));
    msg.textContent = '亮到哪儿，拍到哪儿！';
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-go]')) run(BEAT_MS.fast);
    else if (e.target.closest('[data-slow]')) run(BEAT_MS.slow);
  });
  return stop;
}

/* ================= 意象卡：点一下重播动画 ================= */
document.querySelectorAll('.sz-card').forEach((c) => c.addEventListener('click', () => {
  c.classList.remove('play'); void c.offsetWidth; c.classList.add('play');
}));

/* ================= 神州拼图：上半句在板上，下半句在下面，放对露出画面 ================= */
const PUZZLE = [
  ['我神州', '称中华', 'wǒ shén zhōu', 'chēng zhōng huá'], ['山川美', '可入画', 'shān chuān měi', 'kě rù huà'],
  ['黄河奔', '长江涌', 'huáng hé bēn', 'cháng jiāng yǒng'], ['长城长', '珠峰耸', 'cháng chéng cháng', 'zhū fēng sǒng'],
  ['台湾岛', '隔海峡', 'tái wān dǎo', 'gé hǎi xiá'], ['与大陆', '是一家', 'yǔ dà lù', 'shì yì jiā'],
  ['各民族', '情谊浓', 'gè mín zú', 'qíng yì nóng'], ['齐奋发', '共繁荣', 'qí fèn fā', 'gòng fán róng'],
];
const PUZZLE_COLS = 4;
function initPuzzle(box) {
  const order = PUZZLE.map((_, i) => i).sort(() => Math.random() - 0.5);
  box.innerHTML = `<div class="sz-board">${PUZZLE.map(([a, , pa], i) => {
    const x = (i % PUZZLE_COLS) * (100 / (PUZZLE_COLS - 1));
    const y = Math.floor(i / PUZZLE_COLS) * 100;
    return `<div class="sz-cell" data-i="${i}" data-bg="assets/changcheng.jpg" style="background-position:${x}% ${y}%"><span class="sz-top">${Hanzi.ruby(a, pa)}，</span><span class="sz-slot">？</span></div>`;
  }).join('')}</div>
    <div class="sz-tray">${order.map((i) => `<button type="button" class="sz-piece" data-i="${i}">${Hanzi.ruby(PUZZLE[i][1], PUZZLE[i][3])}</button>`).join('')}</div>
    <p class="sz-pmsg">把下半句拖到上半句后面（也可以先点下半句，再点拼图块）。</p>`;
  const msg = box.querySelector('.sz-pmsg');
  let sel = null;
  let drag = null;
  const place = (piece, cell) => {
    if (!cell || cell.classList.contains('done')) return;
    if (cell.dataset.i !== piece.dataset.i) { shake(piece); shake(cell); msg.textContent = '读一读，接得上吗？'; return; }
    cell.classList.add('done');
    cell.querySelector('.sz-slot').innerHTML = `${piece.innerHTML}${+cell.dataset.i % 2 ? '。' : '，'}`;
    piece.classList.add('used');
    const left = box.querySelectorAll('.sz-piece:not(.used)').length;
    msg.textContent = left ? `接对了！还有 ${left} 块。` : '神州山河拼好了！连起来背一背吧。';
    box.classList.toggle('all-done', !left);
  };
  box.addEventListener('pointerdown', (e) => {
    const piece = e.target.closest('.sz-piece:not(.used)');
    if (!piece) return;
    piece.setPointerCapture(e.pointerId);
    drag = { piece, x: e.clientX, y: e.clientY, moved: false };
  });
  box.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.hypot(dx, dy) > 6) drag.moved = true;
    if (drag.moved) { drag.piece.classList.add('dragging'); drag.piece.style.translate = `${dx}px ${dy}px`; }
  });
  box.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const { piece, moved } = drag;
    drag = null;
    piece.classList.remove('dragging');
    piece.style.translate = '';
    if (moved) { place(piece, document.elementsFromPoint(e.clientX, e.clientY).map((el) => el.closest('.sz-cell')).find(Boolean)); return; }
    sel = sel === piece ? null : piece;
    box.querySelectorAll('.sz-piece').forEach((p) => p.classList.toggle('sel', p === sel));
  });
  box.addEventListener('click', (e) => {
    const cell = e.target.closest('.sz-cell');
    if (!cell || !sel) return;
    place(sel, cell);
    sel.classList.remove('sel');
    sel = null;
  });
}
initPuzzle(document.getElementById('szPuzzle'));

/* ================= 登山峰：选对一个字，往上爬一格 ================= */
const CLIMB = [
  { q: '珠（　）', py: 'zhū', ans: '峰', opts: ['锋', '峰', '蜂'] },
  { q: '长江（　）', py: 'cháng jiāng', ans: '涌', opts: ['涌', '通', '勇'] },
  { q: '隔海（　）', py: 'gé hǎi', ans: '峡', opts: ['侠', '狭', '峡'] },
  { q: '大（　）', py: 'dà', ans: '陆', opts: ['陆', '陵', '院'] },
  { q: '情（　）浓', py: 'qíng nóng', ans: '谊', opts: ['宜', '谊', '诣'] },
  { q: '共繁（　）', py: 'gòng fán', ans: '荣', opts: ['营', '莹', '荣'] },
  { q: '高（　）', py: 'gāo', ans: '耸', opts: ['耸', '茸', '聋'] },
];
const CLIMB_NEXT_MS = 1100;
function initClimb(box) {
  const n = CLIMB.length;
  box.innerHTML = `<div class="sz-mtn"><svg viewBox="0 0 300 220" aria-hidden="true">
      <path d="M10 215 L150 18 L290 215Z" fill="#8aa5bf"/><path d="M150 18 L126 52 L140 46 L150 58 L162 45 L176 52Z" fill="#fff"/>
      <path class="sz-trail" d="M60 205 L120 180 L80 150 L150 128 L110 100 L170 80 L135 56 L150 26" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 6"/>
    </svg><span class="sz-climber">🧗</span><span class="sz-top-flag" aria-hidden="true">🚩</span></div>
    <div class="sz-qbox"><p class="sz-q"></p><div class="sz-opts"></div><p class="sz-cmsg"></p><div class="hz-dots">${CLIMB.map(() => '<i></i>').join('')}</div></div>`;
  const STOPS = [[60, 205], [120, 180], [80, 150], [150, 128], [110, 100], [170, 80], [135, 56], [150, 26]];
  const climber = box.querySelector('.sz-climber');
  const q = box.querySelector('.sz-q');
  const opts = box.querySelector('.sz-opts');
  const msg = box.querySelector('.sz-cmsg');
  let i = 0;
  let busy = false;
  const moveTo = (k) => { climber.style.left = `${STOPS[k][0] / 3}%`; climber.style.top = `${STOPS[k][1] / 2.2}%`; };
  const show = () => {
    const it = CLIMB[i];
    q.innerHTML = Hanzi.ruby(it.q, it.py);
    opts.innerHTML = it.opts.map((o) => `<button type="button" class="sz-opt" data-o="${o}">${o}</button>`).join('');
    msg.textContent = '';
    box.querySelectorAll('.hz-dots i').forEach((d, k) => { d.className = k < i ? 'done' : k === i ? 'cur' : ''; });
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { i = 0; box.classList.remove('top'); moveTo(0); show(); return; }
    const b = e.target.closest('.sz-opt');
    if (!b || busy) return;
    if (b.dataset.o !== CLIMB[i].ans) { shake(b); msg.textContent = '再看看，哪个字和山、和水、和话有关？'; return; }
    busy = true;
    b.classList.add('right');
    i += 1;
    moveTo(i);
    msg.textContent = `对啦！${CLIMB[i - 1].q.replace('（　）', CLIMB[i - 1].ans)}`;
    if (i < n) { setTimeout(show, CLIMB_NEXT_MS); return; }
    box.classList.add('top');
    box.querySelectorAll('.hz-dots i').forEach((d) => { d.className = 'done'; });
    setTimeout(() => { q.textContent = '登上山顶啦！'; opts.innerHTML = '<button type="button" class="btn solid" data-again>再爬一次</button>'; }, CLIMB_NEXT_MS);
  });
  moveTo(0);
  show();
}
initClimb(document.getElementById('szClimb'));

Hanzi.init({
  cards: [
    { z: '州', py: 'zhōu', words: [['神州', 'shén zhōu'], ['九州', 'jiǔ zhōu']] },
    { z: '华', py: 'huá', words: [['中华', 'zhōng huá'], ['华夏', 'huá xià']] },
    { z: '涌', py: 'yǒng', words: [['涌出', 'yǒng chū'], ['汹涌', 'xiōng yǒng']] },
    { z: '峰', py: 'fēng', words: [['珠峰', 'zhū fēng'], ['山峰', 'shān fēng']] },
    { z: '耸', py: 'sǒng', words: [['高耸', 'gāo sǒng'], ['耸立', 'sǒng lì']] },
    { z: '隔', py: 'gé', words: [['隔开', 'gé kāi'], ['隔壁', 'gé bì']] },
    { z: '峡', py: 'xiá', words: [['海峡', 'hǎi xiá'], ['峡谷', 'xiá gǔ']] },
    { z: '与', py: 'yǔ', words: [['与大陆', 'yǔ dà lù'], ['我与你', 'wǒ yǔ nǐ']] },
    { z: '陆', py: 'lù', words: [['大陆', 'dà lù'], ['陆地', 'lù dì']] },
    { z: '谊', py: 'yì', words: [['情谊', 'qíng yì'], ['友谊', 'yǒu yì']] },
    { z: '浓', py: 'nóng', words: [['情谊浓', 'qíng yì nóng'], ['浓浓的', 'nóng nóng de']] },
    { z: '齐', py: 'qí', words: [['整齐', 'zhěng qí'], ['一齐', 'yì qí']] },
    { z: '奋', py: 'fèn', words: [['奋发', 'fèn fā'], ['兴奋', 'xīng fèn']] },
    { z: '繁', py: 'fán', words: [['繁荣', 'fán róng'], ['繁花', 'fán huā']] },
    { z: '荣', py: 'róng', words: [['繁荣', 'fán róng'], ['光荣', 'guāng róng']] },
  ],
  write: {
    a: [
      { z: '州', py: 'zhōu', bh: 6 },
      { z: '华', py: 'huá', bs: '十', bh: 6 },
      { z: '岛', py: 'dǎo', bs: '山', bh: 7 },
      { z: '峡', py: 'xiá', bs: '山', bh: 9 },
    ],
    b: [
      { z: '族', py: 'zú', bs: '方', bh: 11 },
      { z: '谊', py: 'yì', bs: '讠', bh: 10 },
      { z: '齐', py: 'qí', bh: 6 },
      { z: '奋', py: 'fèn', bs: '大', bh: 8 },
    ],
  },
});

// 拍手读要在注音（Hanzi.init）之后切拍
const stopClap = initClap(document.getElementById('szClap'));

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (!slide.querySelector('#szClap')) stopClap();
  },
};
