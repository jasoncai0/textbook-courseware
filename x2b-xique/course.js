'use strict';
/* 枫树上的喜鹊 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 喜鹊叫声导入（WebAudio）；② 鹊语课堂；③ 鹊语翻译机（同色对应：鹊语 ↔ 翻译）；④ 课后鹊语翻译员；⑤ 送喜鹊回窝识字。 */

/* 二下只给生字注音：data-pyk="渡:dù" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

const shake = (el) => { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); };

/* ================= 喜鹊叫：几声短促下滑的“喳” ================= */
const CHIRPS = [0, 0.45, 0.62, 0.79]; // 鹊！ 鹊鹊鹊？（最后一声上扬）
function playChirps() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ac = new AC();
  CHIRPS.forEach((t0, i) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    const t = ac.currentTime + t0;
    const last = i === CHIRPS.length - 1;
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(last ? 1800 : 2600, t);
    o.frequency.exponentialRampToValueAtTime(last ? 3000 : 1500, t + 0.12);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
    o.connect(g).connect(ac.destination);
    o.start(t);
    o.stop(t + 0.15);
  });
  setTimeout(() => ac.close(), 1500);
}
document.getElementById('xqChirp').addEventListener('click', () => {
  playChirps();
  const b = document.getElementById('xqBub');
  b.classList.remove('go'); void b.offsetWidth; b.classList.add('go');
});

/* ================= 课后第 2 题：鹊语翻译员 ================= */
const SCENES = [
  {
    lead: '我看见喜鹊阿姨找了一条虫子回来，站在窝边。喜鹊弟弟一齐叫道：',
    que: '“鹊！鹊！鹊鹊鹊！”',
    then: '我懂得，他们的意思是：',
    opts: ['妈妈！妈妈！我饿了，快给我吃！', '妈妈回来了！有好吃的虫子！', '妈妈！妈妈！先给我，先给我！'],
  },
  {
    lead: '喜鹊阿姨把虫子送到喜鹊弟弟嘴里，叫起来：',
    que: '“鹊，鹊，鹊……”',
    then: '我知道，她是在说：',
    opts: ['慢慢吃，别着急……', '一个一个来，大家都有……', '多吃点，快快长大……'],
  },
];
function initWrite(box) {
  box.innerHTML = SCENES.map((s, i) => `<div class="xq-scene" data-i="${i}">
      <p class="xq-lead">${s.lead}<b class="xq-que">${s.que}</b></p>
      <p class="xq-then">${s.then}“<span class="xq-blank">　　　　　　　</span>”</p>
      <div class="xq-opts">${s.opts.map((o) => `<button type="button" class="xq-o">${o}</button>`).join('')}<button type="button" class="xq-o mine">我来说……</button></div>
    </div>`).join('');
  box.addEventListener('click', (e) => {
    const o = e.target.closest('.xq-o');
    if (!o) return;
    const sc = o.closest('.xq-scene');
    sc.querySelectorAll('.xq-o').forEach((x) => x.classList.toggle('on', x === o));
    const blank = sc.querySelector('.xq-blank');
    blank.textContent = o.classList.contains('mine') ? '（请你说一说）' : o.textContent;
    blank.classList.remove('pop'); void blank.offsetWidth; blank.classList.add('pop');
  });
}
initWrite(document.getElementById('xqWrite'));

/* ================= 送喜鹊回窝 ================= */
const NEST_Q = [
  { q: '（　）口', ans: '渡', opts: ['度', '渡', '镀'] },
  { q: '绿（　）', ans: '荫', opts: ['荫', '阴', '茵'] },
  { q: '遮（　）', ans: '蔽', opts: ['敝', '弊', '蔽'] },
  { q: '（　）着渡船', ans: '撑', opts: ['撑', '掌', '堂'] },
  { q: '（　）来到渡口', ans: '便', opts: ['使', '便', '更'] },
  { q: '（　）音', ans: '拼', opts: ['饼', '并', '拼'] },
  { q: '字（　）', ans: '母', opts: ['母', '每', '毋'] },
  { q: '山（　）', ans: '冈', opts: ['网', '冈', '岗'] },
  { q: '（　）得', ans: '懂', opts: ['董', '憧', '懂'] },
  { q: '答（　）', ans: '案', opts: ['案', '安', '按'] },
];
const NEST_NEXT_MS = 1300;
function initNest(box) {
  let i = 0;
  let busy = false;
  box.innerHTML = `<div class="xq-tree"><div class="xq-home"><span class="xq-in">0</span>🪺</div></div>
    <p class="xq-nq"></p><div class="xq-birds"></div><p class="xq-nmsg"></p><div class="hz-dots"></div>`;
  const show = () => {
    const it = NEST_Q[i];
    box.querySelector('.xq-nq').textContent = it.q;
    box.querySelector('.xq-birds').innerHTML = it.opts.map((o) => `<button type="button" class="xq-bird" data-o="${o}"><i>🐦</i><b>${o}</b></button>`).join('');
    box.querySelector('.xq-nmsg').textContent = '';
    box.querySelector('.hz-dots').innerHTML = NEST_Q.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'cur' : ''}"></i>`).join('');
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { i = 0; box.querySelector('.xq-in').textContent = '0'; show(); return; }
    const b = e.target.closest('.xq-bird');
    if (!b || busy) return;
    const it = NEST_Q[i];
    if (b.dataset.o !== it.ans) { shake(b); box.querySelector('.xq-nmsg').textContent = '不是这只，再看看。'; return; }
    busy = true;
    b.classList.add('fly');
    i += 1;
    box.querySelector('.xq-in').textContent = i;
    box.querySelector('.xq-nmsg').textContent = `飞回家啦！${it.q.replace('（　）', it.ans)}`;
    setTimeout(() => {
      if (i < NEST_Q.length) { show(); return; }
      box.querySelector('.xq-nq').textContent = '喜鹊们都回窝了！';
      box.querySelector('.xq-birds').innerHTML = '<button type="button" class="btn solid" data-again>再玩一次</button>';
      box.classList.add('done');
    }, NEST_NEXT_MS);
  });
  show();
}
initNest(document.getElementById('xqNest'));

Hanzi.init({
  cards: [
    { z: '渡', py: 'dù', words: [['渡口', 'dù kǒu'], ['渡船', 'dù chuán']] },
    { z: '荫', py: 'yīn', words: [['绿荫', 'lǜ yīn'], ['树荫', 'shù yīn']] },
    { z: '蔽', py: 'bì', words: [['遮蔽', 'zhē bì'], ['隐蔽', 'yǐn bì']] },
    { z: '撑', py: 'chēng', words: [['撑船', 'chēng chuán'], ['撑伞', 'chēng sǎn']] },
    { z: '便', py: 'biàn', words: [['便来到', 'biàn lái dào'], ['方便', 'fāng biàn']] },
    { z: '拼', py: 'pīn', words: [['拼音', 'pīn yīn'], ['拼图', 'pīn tú']] },
    { z: '母', py: 'mǔ', words: [['字母', 'zì mǔ'], ['母亲', 'mǔ qīn']] },
    { z: '冈', py: 'gāng', words: [['山冈', 'shān gāng']] },
    { z: '懂', py: 'dǒng', words: [['懂得', 'dǒng de'], ['听懂', 'tīng dǒng']] },
    { z: '案', py: 'àn', words: [['答案', 'dá àn'], ['方案', 'fāng àn']] },
  ],
  write: {
    a: [
      { z: '伞', py: 'sǎn', bs: '人', bh: 6 },
      { z: '姨', py: 'yí', bs: '女', bh: 9 },
      { z: '弟', py: 'dì', bh: 7 },
      { z: '便', py: 'biàn', bs: '亻', bh: 9 },
    ],
    b: [
      { z: '教', py: 'jiāo', bs: '攵', bh: 11 },
      { z: '游', py: 'yóu', bs: '氵', bh: 12 },
      { z: '戏', py: 'xì', bs: '戈', bh: 6 },
      { z: '母', py: 'mǔ', bh: 5 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
