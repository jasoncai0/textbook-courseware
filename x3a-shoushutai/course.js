'use strict';
/* 手术台就是阵地 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 1 题：描写战斗激烈的内容 */
const PICKS = {
  battle: [
    { t: '几发炮弹落在小庙前的空地上', ok: true },
    { t: '硝烟滚滚，弹片纷飞', ok: true },
    { t: '他接过助手递过来的镊子', ok: false, why: '写白求恩做手术' },
    { t: '敌机不断地在上空吼叫', ok: true },
    { t: '炮弹不断地在周围爆炸', ok: true },
    { t: '白求恩低下头，继续给伤员做手术', ok: false, why: '写白求恩' },
    { t: '庙的一角落下了许多瓦片', ok: true },
    { t: '布帘烧着了，火苗向手术台扑过来', ok: true },
    { t: '担架队抬起做过手术的伤员', ok: false, why: '写转移伤员' },
  ],
};

/* 危险温度计：写危险的句子让温度计升一格，写白求恩的句子放到左下角 */
function initDanger() {
  const pool = document.getElementById('dangerPool');
  if (!pool) return;
  const items = PICKS.battle;
  const total = items.filter((it) => it.ok).length;
  const fill = document.getElementById('gaugeFill');
  const num = document.getElementById('gaugeNum');
  const list = document.getElementById('bethuneList');
  const GAUGE_H = 300;
  let found = 0;
  pool.innerHTML = items.map((it, i) => `<button class="dg" type="button" data-i="${i}">${it.t}<small></small></button>`).join('');
  pool.addEventListener('click', (e) => {
    const btn = e.target.closest('.dg');
    if (!btn || btn.disabled) return;
    const it = items[+btn.dataset.i];
    btn.disabled = true;
    if (it.ok) {
      found += 1;
      btn.classList.add('hot');
      btn.querySelector('small').textContent = '危险 +1';
      const h = (found / total) * GAUGE_H;
      fill.setAttribute('y', 340 - h);
      fill.setAttribute('height', h);
      num.textContent = found;
    } else {
      btn.classList.add('calm');
      btn.querySelector('small').textContent = it.why;
      if (it.why.startsWith('写白求恩')) list.insertAdjacentHTML('beforeend', `<li>${it.t}</li>`);
    }
  });
}

/* 课后第 2 题：理解加点词语的方法 */
const CLUE_LABELS = ['读句子', '我这样理解'];
const CLUES = [
  { q: '白求恩仍然<em>镇定</em>地站在手术台旁。', a: '<b>联系上下文：</b>前面炮弹落在小庙前，硝烟滚滚——他却一点也不慌。镇定就是遇到危险不慌不乱。' },
  { q: '部长<em>恳求</em>说：“白求恩同志，这儿危险……”', a: '<b>换个词：</b>恳求＝诚恳地请求。部长担心白求恩的安全，一再请他离开。' },
  { q: '白求恩仍然<em>争分夺秒</em>地给伤员做手术，做了一个又一个。', a: '<b>拆开想：</b>争一分，夺一秒——一点时间也不浪费。后面“做了一个又一个”就是证明。' },
];

/* 课后第 3 题：白求恩的印象 */
const KINDS = ['不怕危险', '不顾疲劳', '医术高超'];
const SORT_ITEMS = [
  { s: '他已经两天两夜没休息了，眼球上布满了血丝。', ok: ['不顾疲劳'], q: '累极了还在工作' },
  { s: '他接过助手递过来的镊子，敏捷地从伤员的腹腔里取出一块弹片，丢在盘子里。', ok: ['医术高超', '不怕危险'], q: '“敏捷”：又快又准' },
  { s: '“手术台是医生的阵地……我怎么能离开自己的阵地呢？”', ok: ['不怕危险'], q: '坚守阵地，不肯离开' },
  { s: '白求恩仍然镇定地站在手术台旁。', ok: ['不怕危险'], q: '炮弹落下也不慌' },
  { s: '白求恩大夫在手术台旁，连续工作了六十九个小时。', ok: ['不顾疲劳'], q: '忘我工作' },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, kinds: KINDS, sort: SORT_ITEMS });
    initDanger();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
