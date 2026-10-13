'use strict';
/* 白桦 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：清晨时间滑块（朦胧 → 金晖 → 朝霞 → 银色光华）、比喻 / 拟人分一分、选词连成话。
 */

/* ================= 时间滑块：1 朦胧　2 金晖　3 朝霞　4 银色光华 ================= */
const TIMES = ['', '天还没亮，一切都朦朦胧胧', '第一缕金色的阳光照过来了', '朝霞慢慢地来了，围着白桦', '朝霞给树枝抹上一层银光'];

function setTime(t) {
  const view = document.getElementById('tlView');
  const k = Math.max(1, Math.min(4, t));
  view.dataset.t = k;
  document.getElementById('tlRange').value = k;
  document.getElementById('tlCap').textContent = TIMES[k];
  document.querySelectorAll('.tl-lines .mark').forEach((m) => m.classList.toggle('on', +m.dataset.step <= k));
  const v = view.querySelector('video');
  if (k >= 3 && v.closest('.slide.active')) v.play().catch(() => { /* 素材未生成或浏览器拒绝自动播放 */ });
}

function initTime() {
  document.getElementById('tlRange').addEventListener('input', (e) => setTime(+e.target.value));
}

/* ================= 选词连成话 ================= */
const XC_WORDS = ['洁白的流苏', '灿灿的金晖', '姗姗来迟的朝霞', '晶亮的雪花', '银色的光华', '白雪皑皑的树枝'];
const XC_FEELS = ['纯洁', '高雅', '美丽', '宁静', '挺拔'];
const XC_MAX = 3;

function initXuanci() {
  const words = [];
  let feel = '';
  const say = document.getElementById('xcSay');
  const wBox = document.getElementById('xcWords');
  const fBox = document.getElementById('xcFeels');
  wBox.innerHTML = XC_WORDS.map((w) => `<button class="pick" type="button">${w}</button>`).join('');
  fBox.innerHTML = XC_FEELS.map((w) => `<button class="pick" type="button">${w}</button>`).join('');
  const update = () => {
    wBox.querySelectorAll('.pick').forEach((b) => b.classList.toggle('right', words.includes(b.textContent)));
    fBox.querySelectorAll('.pick').forEach((b) => b.classList.toggle('right', b.textContent === feel));
    if (!words.length) { say.textContent = '点左边的词，这里会帮你连成一段话。'; return; }
    say.innerHTML = `我仿佛看到了<b>${words.join('</b>、<b>')}</b>……` +
      (feel ? `这棵白桦给我留下了<b>${feel}</b>的印象。` : '<span class="xc-wait">（再选一个印象）</span>');
  };
  wBox.addEventListener('click', (e) => {
    const b = e.target.closest('.pick');
    if (!b) return;
    const w = b.textContent;
    const i = words.indexOf(w);
    if (i >= 0) words.splice(i, 1); else if (words.length < XC_MAX) words.push(w);
    update();
  });
  fBox.addEventListener('click', (e) => {
    const b = e.target.closest('.pick');
    if (b) { feel = b.textContent; update(); }
  });
  document.getElementById('xcClear').addEventListener('click', () => { words.length = 0; feel = ''; update(); });
}

const SORT = [
  { s: '仿佛涂上银霜', ok: ['比喻'], q: '白桦上的霜雪像涂了一层银' },
  { s: '披了一身雪花', ok: ['拟人'], q: '像人披着衣服' },
  { s: '雪绣的花边潇洒', ok: ['拟人', '比喻'], q: '雪像人一样会“绣”，挂在枝头的雪像花边' },
  { s: '洁白的流苏如画', ok: ['比喻'], q: '挂雪的枝条像流苏' },
  { s: '玉立着这棵白桦', ok: ['拟人'], q: '像亭亭玉立的姑娘' },
  { s: '白桦四周徜徉着姗姗来迟的朝霞', ok: ['拟人'], q: '朝霞像人一样慢慢地走、来迟了' },
];

const MOMENTS = [
  { name: '写窗前的树', pic: 'chuangqian', prompt: '学着第 1 节，写写你窗前（或校园里）的一棵树。',
    hint: '照样子：在我的____，有一棵____，仿佛____，____。', example: '在我的窗前，\n有一棵石榴，\n仿佛挂满了小灯笼，\n红红地亮了一树。' },
  { name: '摘抄植物诗', pic: 'zhaoxia', prompt: '你知道哪些与植物有关的诗歌？抄下最喜欢的一首，写清作者。',
    hint: '可以是古诗，也可以是现代诗。', example: '墙角数枝梅，凌寒独自开。\n遥知不是雪，为有暗香来。\n——王安石《梅花》' },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['比喻', '拟人'], moments: MOMENTS });
    initTime();
    initXuanci();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-time')) setTime(step);
    else document.querySelector('#tlView video').pause();
  },
};
