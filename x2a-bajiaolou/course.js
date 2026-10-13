'use strict';
/* 八角楼上 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：夜幕降临 → 灯亮了、“拨一拨灯芯”光圈由小变大、细节聚光灯（看插图体会词语）、点亮星星识字游戏
 * 安全：画面只用空镜、物件、背影剪影；不画人物正脸 */

Hanzi.init({
  cards: [
    { z: '楼', py: 'lóu', bs: '木', bh: 13, words: [['八角楼', 'bā jiǎo lóu'], ['楼房', 'lóu fáng']] },
    { z: '争', py: 'zhēng', bs: '⺈', bh: 6, words: [['斗争', 'dòu zhēng'], ['争先', 'zhēng xiān']] },
    { z: '代', py: 'dài', bs: '亻', bh: 5, words: [['年代', 'nián dài'], ['时代', 'shí dài']] },
    { z: '临', py: 'lín', bs: '丨', bh: 9, words: [['降临', 'jiàng lín'], ['来临', 'lái lín']] },
    { z: '腊', py: 'là', bs: '月', bh: 12, words: [['腊月', 'là yuè'], ['腊八', 'là bā']] },
    { z: '章', py: 'zhāng', bs: '立', bh: 11, words: [['文章', 'wén zhāng']] },
    { z: '握', py: 'wò', bs: '扌', bh: 12, words: [['握着', 'wò zhe'], ['握手', 'wò shǒu']] },
    { z: '视', py: 'shì', bs: '礻', bh: 8, words: [['凝视', 'níng shì'], ['电视', 'diàn shì']] },
    { z: '察', py: 'chá', bs: '宀', bh: 14, words: [['察觉', 'chá jué'], ['观察', 'guān chá']] },
    { z: '油', py: 'yóu', bs: '氵', bh: 8, words: [['清油灯', 'qīng yóu dēng'], ['油灯', 'yóu dēng']] },
  ],
  write: [
    { z: '楼', py: 'lóu', bs: '木', bh: 13 },
    { z: '年', py: 'nián', bs: '丿', bh: 6 },
    { z: '夜', py: 'yè', bs: '亠', bh: 8 },
    { z: '披', py: 'pī', bs: '扌', bh: 8 },
    { z: '轻', py: 'qīng', bs: '车', bh: 9 },
    { z: '利', py: 'lì', bs: '刂', bh: 7 },
  ],
});

/* ---------- 小油灯（简笔 SVG，封面、拨灯芯按钮共用） ---------- */
const LAMP_SVG = `<svg viewBox="0 0 100 120" aria-hidden="true">
  <circle class="bl-halo" cx="50" cy="40" r="34"/>
  <path class="bl-flame" d="M50 14C42 30 40 40 50 50C60 40 58 30 50 14Z"/>
  <line x1="50" y1="48" x2="50" y2="58" stroke="#3a2a1a" stroke-width="3"/>
  <path d="M22 58H78L70 70H30Z" fill="#6d4a2a"/>
  <rect x="46" y="70" width="8" height="34" fill="#5a3c22"/>
  <path d="M28 112H72L64 104H36Z" fill="#5a3c22"/>
</svg>`;
document.querySelectorAll('[data-lamp]').forEach((el) => { el.innerHTML = LAMP_SVG; });

/* ---------- 看插图体会词语：聚光灯（x / y / r 是图上的百分比位置，图生成后核对） ---------- */
const SPOTS = [
  { img: 'assets/louwai.jpg', x: 44, y: 55, r: 20,
    s: ['每当夜幕降临的时候，八角楼上的灯就亮了。', 'měi dāng yè mù jiàng lín de shí hou bā jiǎo lóu shàng de dēng jiù liàng le'], marks: ['夜幕降临'],
    tip: '夜幕降临：天黑了，夜色像一块大幕布，慢慢落下来。' },
  { img: 'assets/fuan.jpg', x: 64, y: 42, r: 22,
    s: ['这是个寒冬腊月的深夜，毛主席穿着单军衣，披着薄毯子，坐在竹椅上写文章。', 'zhè shì gè hán dōng là yuè de shēn yè máo zhǔ xí chuān zhe dān jūn yī pī zhe báo tǎn zi zuò zài zhú yǐ shàng xiě wén zhāng'], marks: ['寒冬腊月', '单军衣', '薄毯子'],
    tip: '寒冬腊月：一年里最冷的时候。单军衣、薄毯子：衣服和毯子都薄薄的。天这么冷，还在写文章。' },
  { img: 'assets/fuan.jpg', x: 70, y: 66, r: 18,
    s: ['凝视着这星星之火，毛主席在沉思，连毯子滑落下来也没有察觉到。', 'níng shì zhe zhè xīng xīng zhī huǒ máo zhǔ xí zài chén sī lián tǎn zi huá luò xià lái yě méi yǒu chá jué dào'], marks: ['凝视', '沉思', '察觉'],
    tip: '凝视：一动不动地看着。沉思：深深地想。毯子滑下来都没发现——想得太专心了。' },
];
function dotted(html, marks) {
  // 在已注音的 ruby 串里给词语加着重点：按字逐个包
  let out = html;
  marks.forEach((m) => {
    const re = new RegExp([...m].map((ch) => `<ruby>${ch}<rt>[^<]*</rt></ruby>`).join(''));
    out = out.replace(re, (hit) => `<em>${hit}</em>`);
  });
  return out;
}
function initSpot() {
  const box = document.getElementById('blSpot');
  const img = box.querySelector('.bl-spotimg');
  const mask = box.querySelector('.bl-spotmask');
  const text = box.querySelector('.bl-spottext');
  const show = (i) => {
    const s = SPOTS[i];
    img.dataset.bg = s.img;
    if (box.closest('.slide').classList.contains('active')) img.style.backgroundImage = `url('${s.img}')`;
    mask.style.setProperty('--x', `${s.x}%`);
    mask.style.setProperty('--y', `${s.y}%`);
    mask.style.setProperty('--r', `${s.r}%`);
    text.innerHTML = `<p class="py">${dotted(Hanzi.ruby(...s.s), s.marks)}</p><p class="bl-tip">${s.tip}</p>`;
    box.querySelectorAll('.bl-tabs .btn').forEach((b) => b.classList.toggle('solid', +b.dataset.t === i));
  };
  box.querySelector('.bl-tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    img.style.backgroundImage = `url('${SPOTS[+b.dataset.t].img}')`;
    show(+b.dataset.t);
  });
  show(0);
}

/* ---------- 说一说：点词卡填句子 ---------- */
const FILL = {
  parts: ['在', 0, '的深夜，毛主席穿着', 1, '，披着', 2, '，坐在', 3, '上写文章。他右手', 4, '，左手', 5, '。'],
  words: [['寒冬腊月', 'hán dōng là yuè'], ['单军衣', 'dān jūn yī'], ['薄毯子', 'báo tǎn zi'], ['竹椅', 'zhú yǐ'], ['握着笔', 'wò zhe bǐ'], ['拨了拨灯芯', 'bō le bō dēng xīn']],
  order: [3, 0, 5, 2, 4, 1],
};
function initFill() {
  const box = document.getElementById('blFill');
  box.innerHTML = `<p class="bl-sent">${FILL.parts.map((p) => (typeof p === 'number' ? `<span class="bl-blank" data-b="${p}"></span>` : p)).join('')}</p>
    <div class="bl-chips">${FILL.order.map((i) => `<button type="button" class="bl-chip py" data-w="${i}">${Hanzi.ruby(...FILL.words[i])}</button>`).join('')}</div>
    <button type="button" class="btn bl-fillreset">重新填</button>`;
  box.addEventListener('click', (e) => {
    if (e.target.closest('.bl-fillreset')) {
      box.querySelectorAll('.bl-blank').forEach((b) => { b.innerHTML = ''; b.classList.remove('ok'); });
      box.querySelectorAll('.bl-chip').forEach((c) => c.classList.remove('used', 'wrong'));
      return;
    }
    const c = e.target.closest('.bl-chip:not(.used)');
    if (!c) return;
    const next = box.querySelector('.bl-blank:not(.ok)');
    if (!next) return;
    if (next.dataset.b !== c.dataset.w) { c.classList.remove('wrong'); void c.offsetWidth; c.classList.add('wrong'); return; }
    next.innerHTML = Hanzi.ruby(...FILL.words[+c.dataset.w]);
    next.classList.add('ok');
    c.classList.add('used');
  });
}

/* ---------- 识字游戏：点亮星星 ---------- */
const STARS = [['楼', 'lóu'], ['争', 'zhēng'], ['代', 'dài'], ['临', 'lín'], ['腊', 'là'], ['章', 'zhāng'], ['握', 'wò'], ['视', 'shì'], ['察', 'chá'], ['油', 'yóu']];
const STAR_POS = [[12, 22], [28, 52], [40, 18], [52, 46], [64, 20], [76, 50], [88, 24], [20, 76], [60, 78], [84, 78]];
function initSky() {
  const box = document.getElementById('blSky');
  box.innerHTML = `${STARS.map(([z, p], i) => `<button type="button" class="bl-star" style="left:${STAR_POS[i][0]}%;top:${STAR_POS[i][1]}%">${Hanzi.ruby(z, p)}</button>`).join('')}
    <p class="bl-skymsg" id="blSkyMsg"></p><button type="button" class="btn bl-skyreset">再玩一次</button>`;
  const msg = box.querySelector('#blSkyMsg');
  const update = () => {
    const n = box.querySelectorAll('.bl-star.lit').length;
    box.classList.toggle('done', n === STARS.length);
    msg.textContent = n === STARS.length ? '星星全亮了！' : `点亮了 ${n} 颗`;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('.bl-skyreset')) { box.querySelectorAll('.bl-star').forEach((s) => s.classList.remove('lit')); update(); return; }
    const s = e.target.closest('.bl-star:not(.lit)');
    if (!s) return;
    s.classList.add('lit');
    update();
  });
  update();
}

/* ---------- 拨灯芯：第 2 步光圈变大；右上角小灯可以手动再拨亮 / 调暗 ---------- */
function initWick() {
  const slide = document.getElementById('blLamp');
  slide.querySelector('.bl-wick').addEventListener('click', () => slide.classList.toggle('manual'));
}

window.LESSON = {
  init() {
    Narrative.init({});
    initSpot();
    initFill();
    initSky();
    initWick();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.id === 'blLamp') {
      slide.classList.remove('manual');
      slide.classList.toggle('bright', step >= 2);
    }
  },
};
