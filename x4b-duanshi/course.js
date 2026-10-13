'use strict';
/* 短诗三首 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：一句话“排成诗”、大字诗报、两个“风雨”分一分、诗句排一排（背诵）。
 */

/* ================= 一句话 ↔ 诗：同样的字，两种排法 ================= */
function initToPoem(box, btn) {
  btn.addEventListener('click', () => {
    const isPoem = box.classList.toggle('is-poem');
    btn.textContent = isPoem ? '变回一句话' : '排成诗';
  });
}

/* ================= 排一排：按顺序点诗句（打乱顺序显示，点对了移到右边） ================= */
function initOrder(pool, done, lines, shuffled) {
  pool.innerHTML = shuffled.map((i) => `<button class="order-line" type="button" data-i="${i}">${lines[i]}</button>`).join('');
  let next = 0;
  pool.addEventListener('click', (e) => {
    const btn = e.target.closest('.order-line');
    if (!btn) return;
    btn.classList.remove('wrong');
    void btn.offsetWidth; // 重新触发抖动动画
    if (+btn.dataset.i !== next) { btn.classList.add('wrong'); return; }
    next += 1;
    btn.remove();
    done.insertAdjacentHTML('beforeend', `<p>${lines[+btn.dataset.i]}</p>`);
    done.closest('.slide').classList.toggle('order-all', next === lines.length);
  });
}

const POEM159 = ['母亲啊！', '天上的风雨来了，', '鸟儿躲到它的巢里；', '心中的风雨来了，', '我只躲到你的怀里。'];

const SORT = [
  { s: '雷声轰隆隆，下起了大暴雨。', ok: ['天上的风雨'], q: '真的风雨' },
  { s: '考试没考好，心里很难过。', ok: ['心中的风雨'], q: '难过' },
  { s: '刮起大风，树枝乱摇。', ok: ['天上的风雨'], q: '真的风雨' },
  { s: '和好朋友吵架了。', ok: ['心中的风雨'], q: '烦恼' },
  { s: '被人误会了，觉得很委屈。', ok: ['心中的风雨'], q: '委屈' },
];

const PICKS = {
  feel: [
    { t: '温暖', ok: true, why: '母亲的膝上最暖和' },
    { t: '宁静', ok: true, why: '月光下的园子很安静' },
    { t: '幸福', ok: true, why: '有母亲陪着' },
    { t: '怀念', ok: true, why: '“永不漫灭的回忆”' },
    { t: '害怕', ok: false, why: '诗里没有可怕的东西' },
    { t: '热闹', ok: false, why: '月夜的园子很静' },
  ],
};

const MOMENTS = [
  { name: '学“一三一”', pic: 'dahai', prompt: '学着用“哪一……没有……？”写一写你喜欢的东西。',
    hint: '先呼唤它：“____啊！”再写两三个“哪一……没有……？”', example: '春天啊！\n哪一棵树没有新芽？\n哪一片草地没有野花？' },
  { name: '学“一五九”', pic: 'fengyu', prompt: '“我”有母亲的怀抱。你遇到“心中的风雨”时，会躲到哪里？',
    hint: '前两行写自然里的样子，后两行写自己。', example: '天黑了，\n星星躲进云里；\n害怕了，\n我躲到爸爸的背后。' },
  { name: '学“七一”', pic: 'tengluo', prompt: '你有哪些“永不漫灭的回忆”？用三个地方写出来。',
    hint: '照样子：“____的____，____的____，____的____。”', example: '这些事——\n是我最甜的回忆：\n夏夜的院子，\n葡萄架下，\n奶奶的蒲扇边。' },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['天上的风雨', '心中的风雨'], picks: PICKS, moments: MOMENTS });
    initToPoem(document.getElementById('toPoem'), document.getElementById('toPoemBtn'));
    initOrder(document.getElementById('orderPool'), document.getElementById('orderDone'), POEM159, [3, 0, 4, 2, 1]);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
