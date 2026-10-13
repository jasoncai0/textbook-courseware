'use strict';
/* 找春天 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 田野寻宝（图上点出小草、野花、嫩芽、小溪，点小溪会“叮叮咚咚”）；② 连一连春天的样子；③ 仿说句子机；④ 花苞开花识字。 */

/* 二下课文只给生字注音：data-pyk="脱:tuō 袄:ǎo" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 叮叮咚咚：用 WebAudio 弹几个音（不需要音频文件） ================= */
const DING_NOTES = [1319, 1047, 1175, 880, 1047];
function playDing() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ac = new AC();
  DING_NOTES.forEach((f, i) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    const t = ac.currentTime + i * 0.22;
    o.type = 'triangle';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.connect(g).connect(ac.destination);
    o.start(t);
    o.stop(t + 0.55);
  });
  setTimeout(() => ac.close(), 2000);
}

/* ================= 田野寻宝 ================= */
function initHunt() {
  const pic = document.getElementById('xbPic');
  if (!pic) return;
  const slide = pic.closest('.slide');
  const n = document.getElementById('xbN');
  pic.addEventListener('click', (e) => {
    const spot = e.target.closest('.xb-spot');
    if (!spot) return;
    const i = spot.dataset.i;
    if (i === '3') playDing();
    spot.classList.add('found');
    const card = slide.querySelector(`.xb-card[data-i="${i}"]`);
    card.classList.add('found');
    slide.querySelectorAll('.xb-card').forEach((c) => c.classList.toggle('now', c === card));
    n.textContent = slide.querySelectorAll('.xb-card.found').length;
  });
}
initHunt();

/* ================= 连一连 ================= */
const LX_SAY = ['小草刚探出头，弯弯的，像春天的眉毛。', '野花一朵两朵，亮亮的，像春天的眼睛。', '嫩芽一点一点，像春天的音符。', '小溪叮叮咚咚，像春天在弹琴。'];
function initLink(box) {
  const svg = box.querySelector('.lx-lines');
  const say = document.getElementById('lxSay');
  const pairs = [];
  let sel = null;
  const draw = () => {
    const r = box.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
    svg.innerHTML = pairs.map(([a, b]) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return `<line x1="${ra.right - r.left}" y1="${ra.top + ra.height / 2 - r.top}" x2="${rb.left - r.left}" y2="${rb.top + rb.height / 2 - r.top}"/>`;
    }).join('');
  };
  box.addEventListener('click', (e) => {
    const it = e.target.closest('.lx-it:not(.done)');
    if (!it) return;
    if (it.dataset.a !== undefined) {
      sel = it;
      box.querySelectorAll('[data-a]').forEach((x) => x.classList.toggle('sel', x === sel));
      return;
    }
    if (!sel) { say.textContent = '先点左边的景物哦。'; return; }
    if (it.dataset.b !== sel.dataset.a) {
      it.classList.remove('wrong'); void it.offsetWidth; it.classList.add('wrong');
      say.textContent = '再想想，像不像？';
      return;
    }
    [sel, it].forEach((x) => x.classList.add('done'));
    sel.classList.remove('sel');
    pairs.push([sel, it]);
    say.textContent = pairs.length < 4 ? LX_SAY[+it.dataset.b] : '全连好了！小草是眉毛，野花是眼睛，嫩芽是音符，小溪是琴声。';
    sel = null;
    draw();
  });
  window.addEventListener('resize', draw);
  return draw;
}
const lxBox = document.getElementById('lxBox');
const lxDraw = lxBox ? initLink(lxBox) : null;

/* ================= 动作卡：点一下播放小动画 ================= */
document.querySelectorAll('.sg-act').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.classList.remove('play'); void btn.offsetWidth; btn.classList.add('play');
  });
});

/* ================= 仿说句子机 ================= */
function initMachine(box) {
  const out = document.getElementById('jqOut');
  const update = () => {
    const a = box.querySelector('[data-k="a"] .on').textContent;
    const b = box.querySelector('[data-k="b"] .on').textContent;
    out.innerHTML = `${a}，那是春天的<b>${b}</b>吧？`;
    out.classList.remove('pop'); void out.offsetWidth; out.classList.add('pop');
  };
  box.addEventListener('click', (e) => {
    const o = e.target.closest('.jq-o');
    if (!o) return;
    o.parentElement.querySelectorAll('.jq-o').forEach((x) => x.classList.toggle('on', x === o));
    update();
  });
  update();
}
const jq = document.getElementById('jqBox');
if (jq) initMachine(jq);

/* ================= 花苞开花：词语里填字 ================= */
const BUD_Q = [
  { q: '（　）掉棉袄', ans: '脱', opts: ['说', '脱', '悦'] },
  { q: '穿上棉（　）', ans: '袄', opts: ['袄', '妖', '沃'] },
  { q: '去（　）找春天', ans: '寻', opts: ['导', '寺', '寻'] },
  { q: '害（　）的小姑娘', ans: '羞', opts: ['羞', '差', '着'] },
  { q: '从地下（　）出头来', ans: '探', opts: ['深', '探', '抹'] },
  { q: '点点（　）芽', ans: '嫩', opts: ['懒', '漱', '嫩'] },
  { q: '春天的音（　）', ans: '符', opts: ['符', '付', '府'] },
  { q: '我们（　）到了她', ans: '触', opts: ['独', '触', '烛'] },
];
function initBuds(box) {
  let i = 0;
  let busy = false;
  const show = () => {
    const it = BUD_Q[i];
    box.innerHTML = `<p class="hb-q">${it.q}</p>
      <div class="hb-row">${it.opts.map((o) => `<button type="button" class="hb-bud" data-o="${o}"><i class="hb-petals"></i><span>${o}</span><i class="hb-stem"></i></button>`).join('')}</div>
      <p class="hb-msg"></p>
      <div class="hz-dots">${BUD_Q.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'cur' : ''}"></i>`).join('')}</div>`;
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { i = 0; show(); return; }
    const bud = e.target.closest('.hb-bud');
    if (!bud || busy) return;
    const msg = box.querySelector('.hb-msg');
    if (bud.dataset.o !== BUD_Q[i].ans) {
      bud.classList.remove('wrong'); void bud.offsetWidth; bud.classList.add('wrong');
      msg.textContent = '放进词语里读一读，通不通？';
      return;
    }
    busy = true;
    bud.classList.add('open');
    msg.textContent = `花开了！${BUD_Q[i].q.replace('（　）', BUD_Q[i].ans)}`;
    setTimeout(() => {
      i += 1;
      if (i < BUD_Q.length) { show(); return; }
      box.innerHTML = '<p class="hb-q">满园花都开了，春天来了！</p><button type="button" class="btn solid" data-again>再玩一次</button>';
    }, 1400);
  });
  show();
}
const hb = document.getElementById('hbGame');
if (hb) initBuds(hb);

Hanzi.init({
  cards: [
    { z: '脱', py: 'tuō', words: [['脱掉', 'tuō diào'], ['脱下', 'tuō xià']] },
    { z: '袄', py: 'ǎo', words: [['棉袄', 'mián ǎo'], ['小袄', 'xiǎo ǎo']] },
    { z: '寻', py: 'xún', words: [['寻找', 'xún zhǎo'], ['寻觅', 'xún mì']] },
    { z: '羞', py: 'xiū', words: [['害羞', 'hài xiū'], ['羞红了脸', 'xiū hóng le liǎn']] },
    { z: '姑', py: 'gū', words: [['姑娘', 'gū niang'], ['姑姑', 'gū gu']] },
    { z: '遮', py: 'zhē', words: [['遮掩', 'zhē yǎn'], ['遮住', 'zhē zhù']] },
    { z: '掩', py: 'yǎn', words: [['遮遮掩掩', 'zhē zhē yǎn yǎn'], ['掩上', 'yǎn shàng']] },
    { z: '探', py: 'tàn', words: [['探出头', 'tàn chū tóu'], ['探险', 'tàn xiǎn']] },
    { z: '嫩', py: 'nèn', words: [['嫩芽', 'nèn yá'], ['嫩绿', 'nèn lǜ']] },
    { z: '符', py: 'fú', words: [['音符', 'yīn fú'], ['符号', 'fú hào']] },
    { z: '解', py: 'jiě', words: [['解冻', 'jiě dòng'], ['了解', 'liǎo jiě']] },
    { z: '触', py: 'chù', words: [['触到', 'chù dào'], ['接触', 'jiē chù']] },
    { z: '杜', py: 'dù', words: [['杜鹃', 'dù juān']] },
    { z: '鹃', py: 'juān', words: [['杜鹃', 'dù juān']] },
  ],
  write: {
    a: [
      { z: '冲', py: 'chōng', bs: '冫', bh: 6 },
      { z: '寻', py: 'xún', bh: 6 },
      { z: '姑', py: 'gū', bs: '女', bh: 8 },
      { z: '娘', py: 'niáng', bs: '女', bh: 10 },
      { z: '仔', py: 'zǐ', bs: '亻', bh: 5 },
    ],
    b: [
      { z: '吐', py: 'tǔ', bs: '口', bh: 6 },
      { z: '柳', py: 'liǔ', bs: '木', bh: 9 },
      { z: '荡', py: 'dàng', bs: '艹', bh: 9 },
      { z: '桃', py: 'táo', bs: '木', bh: 10 },
      { z: '杏', py: 'xìng', bs: '木', bh: 7 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (lxDraw && slide.contains(lxBox)) setTimeout(lxDraw, 800);
  },
};
