'use strict';
/* 传统节日 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 鞭炮声导入（WebAudio）；② 节日年轮（指针跟着分步转一圈，回到新春）；③ 挂灯笼：节日配习俗；④ 排一排；⑤ 放烟花识字。 */

/* 二下只给生字注音：data-pyk="贴:tiē" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

const shake = (el) => { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); };

/* ================= 鞭炮声：白噪声短脉冲（不需要音频文件） ================= */
const POP_COUNT = 22;
function playPops() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ac = new AC();
  const len = Math.floor(ac.sampleRate * 0.05);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  for (let i = 0; i < POP_COUNT; i += 1) {
    const src = ac.createBufferSource();
    const g = ac.createGain();
    src.buffer = buf;
    g.gain.value = 0.3 + Math.random() * 0.5;
    src.connect(g).connect(ac.destination);
    src.start(ac.currentTime + i * 0.09 + Math.random() * 0.05);
  }
  setTimeout(() => ac.close(), 3500);
}
document.getElementById('jrPop').addEventListener('click', () => {
  playPops();
  const t = document.getElementById('jrPopTxt');
  t.classList.remove('go'); void t.offsetWidth; t.classList.add('go');
});

/* ================= 节日年轮 ================= */
const RING = [
  ['🧧', '春节', 'chūn jié'], ['🏮', '元宵节', 'yuán xiāo jié'], ['🌧️', '清明节', 'qīng míng jié'], ['🛶', '端午节', 'duān wǔ jié'],
  ['🌉', '七夕', 'qī xī'], ['🥮', '中秋节', 'zhōng qiū jié'], ['🌼', '重阳节', 'chóng yáng jié'], ['🎆', '又是新春', 'yòu shì xīn chūn'],
];
const RING_R = 40; // 节点离圆心的距离（%）
function initRing(box) {
  box.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="${RING_R}" class="jr-track"/>
      <circle cx="50" cy="50" r="${RING_R}" class="jr-done" pathLength="8"/>
      <g class="jr-hand"><line x1="50" y1="50" x2="50" y2="${50 - RING_R + 12}"/><circle cx="50" cy="50" r="3"/></g></svg>
    <div class="jr-mid">一年</div>
    ${RING.map(([e, n, py], i) => {
      const a = (i * 45 - 90) * (Math.PI / 180);
      return `<button type="button" class="jr-node" data-k="${i + 1}" style="left:${50 + RING_R * Math.cos(a)}%;top:${50 + RING_R * Math.sin(a)}%"><i>${e}</i><span>${Hanzi.ruby(n, py)}</span></button>`;
    }).join('')}`;
  box.addEventListener('click', (e) => {
    const n = e.target.closest('.jr-node');
    if (n) go(cur, +n.dataset.k); // eslint-disable-line no-undef
  });
}
const ring = document.getElementById('jrRing');
initRing(ring);
function renderRing(step) {
  ring.style.setProperty('--k', Math.max(0, step - 1));
  ring.classList.toggle('started', step > 0);
  ring.querySelectorAll('.jr-node').forEach((n) => {
    n.classList.toggle('now', +n.dataset.k === step);
    n.classList.toggle('past', +n.dataset.k < step);
  });
}

/* ================= 排一排：按时间顺序点节日 ================= */
const ORDER_SHOW = ['端午节', '清明节', '元宵节', '春节', '重阳节', '中秋节']; // 课本给出的顺序
const ORDER_RIGHT = ['春节', '元宵节', '清明节', '端午节', '中秋节', '重阳节'];
const ORDER_PY = { 春节: 'chūn jié', 元宵节: 'yuán xiāo jié', 清明节: 'qīng míng jié', 端午节: 'duān wǔ jié', 中秋节: 'zhōng qiū jié', 重阳节: 'chóng yáng jié' };
function initOrder(box) {
  box.innerHTML = `<div class="jr-cal">${ORDER_RIGHT.map((_, i) => `<div class="jr-slot"><b>${i + 1}</b><span></span></div>`).join('')}</div>
    <div class="jr-pool">${ORDER_SHOW.map((f) => `<button type="button" class="jr-fest" data-f="${f}">${Hanzi.ruby(f, ORDER_PY[f])}</button>`).join('')}</div>
    <p class="jr-omsg">一年里，哪个节日最先到？</p>
    <button type="button" class="btn" data-reset>重新排</button>`;
  const msg = box.querySelector('.jr-omsg');
  let k = 0;
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) {
      k = 0;
      box.querySelectorAll('.jr-slot span').forEach((s) => { s.innerHTML = ''; });
      box.querySelectorAll('.jr-fest').forEach((f) => f.classList.remove('used'));
      box.classList.remove('all-done');
      msg.textContent = '一年里，哪个节日最先到？';
      return;
    }
    const f = e.target.closest('.jr-fest:not(.used)');
    if (!f) return;
    if (f.dataset.f !== ORDER_RIGHT[k]) { shake(f); msg.textContent = '还没到它呢，想想年轮上的顺序。'; return; }
    box.querySelectorAll('.jr-slot span')[k].innerHTML = f.innerHTML;
    f.classList.add('used');
    k += 1;
    msg.textContent = k < ORDER_RIGHT.length ? '对了！下一个是？' : '排好了！春节—元宵节—清明节—端午节—中秋节—重阳节。';
    box.classList.toggle('all-done', k === ORDER_RIGHT.length);
  });
}
initOrder(document.getElementById('jrOrder'));

/* ================= 挂灯笼：习俗挂到节日灯笼下 ================= */
const LANTERNS = ['春节', '元宵节', '清明节', '端午节', '七夕', '中秋节', '重阳节'];
const LAN_PY = { ...ORDER_PY, 七夕: 'qī xī' };
const CUSTOMS = [
  ['贴窗花', 'tiē chuāng huā', '春节'], ['放鞭炮', 'fàng biān pào', '春节'], ['看花灯', 'kàn huā dēng', '元宵节'],
  ['祭扫', 'jì sǎo', '清明节'], ['赛龙舟', 'sài lóng zhōu', '端午节'], ['吃粽子', 'chī zòng zi', '端午节'],
  ['乞巧', 'qǐ qiǎo', '七夕'], ['吃月饼', 'chī yuè bǐng', '中秋节'], ['赏菊登高', 'shǎng jú dēng gāo', '重阳节'],
];
function initLanterns(box) {
  const order = CUSTOMS.map((_, i) => i).sort(() => Math.random() - 0.5);
  box.innerHTML = `<div class="jr-rope">${LANTERNS.map((f) => `<div class="jr-lantern" data-f="${f}"><i class="jr-lamp">${Hanzi.ruby(f, LAN_PY[f])}</i><div class="jr-hang"></div></div>`).join('')}</div>
    <div class="jr-tray">${order.map((i) => `<button type="button" class="jr-cus" data-i="${i}">${Hanzi.ruby(CUSTOMS[i][0], CUSTOMS[i][1])}</button>`).join('')}</div>
    <p class="jr-lmsg">把习俗挂到节日灯笼下面。</p>`;
  const msg = box.querySelector('.jr-lmsg');
  let sel = null;
  let drag = null;
  const hang = (card, lan) => {
    if (!lan) return;
    const c = CUSTOMS[+card.dataset.i];
    if (lan.dataset.f !== c[2]) { shake(card); shake(lan); msg.textContent = `“${c[0]}”不是${lan.dataset.f}做的事，再想想。`; return; }
    lan.querySelector('.jr-hang').insertAdjacentHTML('beforeend', `<span>${card.innerHTML}</span>`);
    lan.classList.add('lit');
    card.classList.add('used');
    const left = box.querySelectorAll('.jr-cus:not(.used)').length;
    msg.textContent = left ? `${lan.dataset.f}到了，人们${c[0]}。` : '灯笼全亮了！每个节日都有自己的习俗。';
    box.classList.toggle('all-done', !left);
  };
  box.addEventListener('pointerdown', (e) => {
    const card = e.target.closest('.jr-cus:not(.used)');
    if (!card) return;
    card.setPointerCapture(e.pointerId);
    drag = { card, x: e.clientX, y: e.clientY, moved: false };
  });
  box.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.hypot(dx, dy) > 6) drag.moved = true;
    if (drag.moved) { drag.card.classList.add('dragging'); drag.card.style.translate = `${dx}px ${dy}px`; }
  });
  box.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const { card, moved } = drag;
    drag = null;
    card.classList.remove('dragging');
    card.style.translate = '';
    if (moved) { hang(card, document.elementsFromPoint(e.clientX, e.clientY).map((el) => el.closest('.jr-lantern')).find(Boolean)); return; }
    sel = sel === card ? null : card;
    box.querySelectorAll('.jr-cus').forEach((c) => c.classList.toggle('sel', c === sel));
  });
  box.addEventListener('click', (e) => {
    const lan = e.target.closest('.jr-lantern');
    if (!lan || !sel) return;
    hang(sel, lan);
    sel.classList.remove('sel');
    sel = null;
  });
}
initLanterns(document.getElementById('jrLan'));

/* ================= 放烟花：词语里填字 ================= */
const FIRE_Q = [
  { q: '（　）窗花', ans: '贴', opts: ['站', '贴', '帖'] },
  { q: '元（　）节', ans: '宵', opts: ['宵', '消', '霄'] },
  { q: '大街小（　）', ans: '巷', opts: ['港', '共', '巷'] },
  { q: '去（　）扫', ans: '祭', opts: ['祭', '察', '然'] },
  { q: '赛龙（　）', ans: '舟', opts: ['丹', '舟', '册'] },
  { q: '满（　）飘', ans: '堂', opts: ['常', '掌', '堂'] },
  { q: '来乞（　）', ans: '巧', opts: ['巧', '功', '朽'] },
  { q: '牛（　）织女', ans: '郎', opts: ['朗', '郎', '狼'] },
  { q: '吃月（　）', ans: '饼', opts: ['拼', '瓶', '饼'] },
  { q: '赏（　）', ans: '菊', opts: ['菊', '葡', '莉'] },
];
const FIRE_COLORS = ['#ffd166', '#ef476f', '#06d6a0', '#8ecae6', '#f78c6b', '#c77dff'];
const FIRE_NEXT_MS = 1300;
function initFire(box) {
  let i = 0;
  let busy = false;
  box.innerHTML = '<div class="jr-sky"></div><p class="jr-fq"></p><div class="jr-fopts"></div><p class="jr-fmsg"></p><div class="hz-dots"></div>';
  const sky = box.querySelector('.jr-sky');
  const show = () => {
    const it = FIRE_Q[i];
    box.querySelector('.jr-fq').textContent = it.q;
    box.querySelector('.jr-fopts').innerHTML = it.opts.map((o) => `<button type="button" class="jr-fo" data-o="${o}">${o}</button>`).join('');
    box.querySelector('.jr-fmsg').textContent = '';
    box.querySelector('.hz-dots').innerHTML = FIRE_Q.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'cur' : ''}"></i>`).join('');
    busy = false;
  };
  const burst = () => {
    const c = FIRE_COLORS[i % FIRE_COLORS.length];
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 40;
    sky.insertAdjacentHTML('beforeend', `<span class="jr-burst" style="left:${x}%;top:${y}%;--c:${c}">${Array.from({ length: 12 }, (_, k) => `<i style="--a:${k * 30}deg"></i>`).join('')}</span>`);
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { i = 0; sky.innerHTML = ''; show(); return; }
    const b = e.target.closest('.jr-fo');
    if (!b || busy) return;
    const it = FIRE_Q[i];
    if (b.dataset.o !== it.ans) { shake(b); box.querySelector('.jr-fmsg').textContent = '放进词里读一读，通不通？'; return; }
    busy = true;
    b.classList.add('right');
    burst();
    box.querySelector('.jr-fmsg').textContent = `砰！${it.q.replace('（　）', it.ans)}`;
    i += 1;
    setTimeout(() => {
      if (i < FIRE_Q.length) { show(); return; }
      box.querySelector('.jr-fq').textContent = '满天烟花，过节啦！';
      box.querySelector('.jr-fopts').innerHTML = '<button type="button" class="btn solid" data-again>再放一次</button>';
      box.classList.add('done');
    }, FIRE_NEXT_MS);
  });
  show();
}
initFire(document.getElementById('jrFire'));

Hanzi.init({
  cards: [
    { z: '传', py: 'chuán', words: [['传统', 'chuán tǒng'], ['传说', 'chuán shuō']] },
    { z: '统', py: 'tǒng', words: [['传统', 'chuán tǒng'], ['统一', 'tǒng yī']] },
    { z: '贴', py: 'tiē', words: [['贴窗花', 'tiē chuāng huā'], ['贴纸', 'tiē zhǐ']] },
    { z: '宵', py: 'xiāo', words: [['元宵', 'yuán xiāo'], ['通宵', 'tōng xiāo']] },
    { z: '巷', py: 'xiàng', words: [['小巷', 'xiǎo xiàng'], ['大街小巷', 'dà jiē xiǎo xiàng']] },
    { z: '祭', py: 'jì', words: [['祭扫', 'jì sǎo'], ['祭祀', 'jì sì']] },
    { z: '舟', py: 'zhōu', words: [['龙舟', 'lóng zhōu'], ['小舟', 'xiǎo zhōu']] },
    { z: '艾', py: 'ài', words: [['艾草', 'ài cǎo'], ['艾香', 'ài xiāng']] },
    { z: '堂', py: 'táng', words: [['满堂', 'mǎn táng'], ['课堂', 'kè táng']] },
    { z: '乞', py: 'qǐ', words: [['乞巧', 'qǐ qiǎo']] },
    { z: '巧', py: 'qiǎo', words: [['乞巧', 'qǐ qiǎo'], ['灵巧', 'líng qiǎo']] },
    { z: '郎', py: 'láng', words: [['牛郎', 'niú láng'], ['新郎', 'xīn láng']] },
    { z: '饼', py: 'bǐng', words: [['月饼', 'yuè bǐng'], ['烧饼', 'shāo bing']] },
    { z: '赏', py: 'shǎng', words: [['赏菊', 'shǎng jú'], ['欣赏', 'xīn shǎng']] },
    { z: '菊', py: 'jú', words: [['菊花', 'jú huā'], ['赏菊', 'shǎng jú']] },
  ],
  write: {
    a: [
      { z: '贴', py: 'tiē', bs: '贝', bh: 9 },
      { z: '街', py: 'jiē', bh: 12 },
      { z: '舟', py: 'zhōu', bs: '舟', bh: 6 },
      { z: '艾', py: 'ài', bs: '艹', bh: 5 },
      { z: '敬', py: 'jìng', bs: '攵', bh: 12 },
    ],
    b: [
      { z: '转', py: 'zhuǎn', bs: '车', bh: 8 },
      { z: '团', py: 'tuán', bs: '囗', bh: 6 },
      { z: '热', py: 'rè', bs: '灬', bh: 10 },
      { z: '闹', py: 'nào', bs: '门', bh: 8 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.contains(ring)) renderRing(step);
  },
};
