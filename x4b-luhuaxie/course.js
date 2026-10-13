'use strict';
/* 芦花鞋 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课独有：卖鞋路线 + 心情曲线（随分步一段段画出）、自己写小标题 */

/* 卖鞋路线上的六个点：x 位置、心情高低（0～100）、心情词、地点 */
const MOOD = [
  { x: 80, m: 80, feel: '兴奋', at: '家里' },
  { x: 230, m: 62, feel: '坚定', at: '风雪出门' },
  { x: 380, m: 22, feel: '盼望 · 着急', at: '镇上守鞋' },
  { x: 520, m: 86, feel: '惊喜', at: '卖完十双' },
  { x: 630, m: 38, feel: '遗憾 · 对不住', at: '回家路上' },
  { x: 740, m: 96, feel: '笑了', at: '追回去' },
];
const moodY = (m) => 220 - m * 1.8;

function initSell() {
  const d = MOOD.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${moodY(p.m).toFixed(0)}`).join(' ');
  document.getElementById('moodBase').setAttribute('d', d);
  document.getElementById('moodDots').innerHTML = MOOD.map((p, i) => {
    const y = moodY(p.m);
    return `<g class="md" data-i="${i + 1}"><circle cx="${p.x}" cy="${y.toFixed(0)}" r="10"/>
      <text class="t-m t-c md-feel" x="${p.x}" y="${(y - 18).toFixed(0)}">${p.feel}</text>
      <text class="t-s t-c md-at" x="${p.x}" y="316">${p.at}</text></g>`;
  }).join('');
}

function renderSell(slide, step) {
  if (!slide.classList.contains('s-sell')) return;
  const pts = MOOD.slice(0, Math.max(1, step));
  const line = document.getElementById('moodLine');
  line.setAttribute('d', step ? pts.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${moodY(p.m).toFixed(0)}`).join(' ') : '');
  slide.querySelectorAll('.md').forEach((g) => g.classList.toggle('on', +g.dataset.i <= step));
  slide.querySelectorAll('.sell-say p').forEach((p) => p.classList.toggle('now', +p.dataset.step === step));
}

/* 自己列小标题 */
const PART_TITLES = [
  { n: '一', gist: '芦花鞋怎样做；全家编了一百零一双', ref: '编织芦花鞋' },
  { n: '二', gist: '大雪天，家人劝他别去，他坚持去', ref: '雪天去卖鞋' },
  { n: '三', gist: '镇上守鞋，城里人买走了十双', ref: '十双鞋卖完了' },
  { n: '四', gist: '回家路上，把脚上的鞋卖给了那个人', ref: '卖掉自己的鞋' },
];
function initMyTitles() {
  const box = document.getElementById('myTitles');
  box.innerHTML = PART_TITLES.map((p, i) => `<div class="my-row"><b>第${p.n}部分</b><span class="gist">${p.gist}</span>
    <input type="text" maxlength="12" placeholder="我的小标题" aria-label="第${p.n}部分的小标题">
    <button class="btn" type="button" data-i="${i}">看看参考</button><em class="ref"></em></div>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-i]');
    if (b) b.nextElementSibling.textContent = `参考：${PART_TITLES[+b.dataset.i].ref}`;
  });
}

/* 印象最深 */
const MOMENTS = [
  {
    name: '赤脚追过去', pic: 'chijiao',
    prompt: '青铜光着脚追过去的时候，心里在想什么？',
    hint: '想想：脚上的鞋暖和和的；那个人一摊手、叹了口气；这双鞋还是新的……',
    example: '那个人那么喜欢芦花鞋，没买到多可惜呀！我的脚冻一冻没关系，回家奶奶又会给我编一双。这双鞋还是新的，一点儿都不脏，他一定会喜欢的。快追上他！',
  },
  {
    name: '风雪中守鞋', pic: 'xueshou',
    prompt: '我印象最深的是青铜在大雪里守着芦花鞋。说说为什么。',
    hint: '找一找：别人叫他进屋，他怎么做？他心里不住地说什么？',
    example: '我印象最深的是青铜在风雪里守鞋。对面的人叫他进屋烤火，他摇摇手，坚持守在鞋旁，心里不住地喊“买鞋的，快来吧”。他知道这些鞋对家里有多重要，一点儿也不怕冷。',
  },
  {
    name: '兄妹采芦花', pic: 'caihua',
    prompt: '葵花见到漂亮的芦花，为什么自己不采，总是喊哥哥？',
    hint: '从这件小事里，你看出兄妹之间怎样的感情？',
    example: '葵花想让哥哥采到最好的芦花，编出最好看的鞋。她喊“哥，这儿有一穗”，哥哥就笑眯眯的——兄妹俩多么亲啊！',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initSell();
    initMyTitles();
  },
  onRender: (slide, step) => {
    Narrative.onRender(slide, step);
    renderSell(slide, step);
  },
};
