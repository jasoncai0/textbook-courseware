'use strict';
/* 散步 · 本课数据与互动。画面、字幕、选一选见 ../shared/narrative.js */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* 写景句 · 选一选 */
const PICKS = {
  jing: [
    { t: '天气很好。', ok: true, why: '写天气' },
    { t: '大块儿小块儿的新绿随意地铺着，有的浓，有的淡', ok: true, why: '田野新绿' },
    { t: '树枝上的嫩芽儿也密了', ok: true, why: '嫩芽' },
    { t: '田里的冬水也咕咕地起着水泡儿', ok: true, why: '冬水起泡' },
    { t: '母亲信服地点点头，便去拿外套。', ok: false, why: '写人的动作' },
    { t: '那里有金色的菜花、两行整齐的桑树，尽头一口水波粼粼的鱼塘', ok: true, why: '小路风景' },
    { t: '我的母亲老了，她早已习惯听从她强壮的儿子', ok: false, why: '写人的关系' },
  ],
};

/* 对称句：a 左半句，b 右半句 */
const DUI = [
  { a: '我的母亲老了，她早已习惯听从她强壮的儿子；', b: '我的儿子还小，他还习惯听从他高大的父亲；', ex: true },
  { a: '我和母亲走在前面，', b: '我的妻子和儿子走在后面。' },
  { a: '前面也是妈妈和儿子，', b: '后面也是妈妈和儿子！' },
  { a: '我的母亲要走大路，大路平顺；', b: '我的儿子要走小路，小路有意思……' },
  { a: '我伴同他的时日还长，', b: '我伴同母亲的时日已短。' },
  { a: '我蹲下来，背起了我的母亲，', b: '妻子也蹲下来，背起了我们的儿子。' },
  { a: '我的母亲虽然高大，然而很瘦，自然不算重；', b: '儿子虽然很胖，毕竟幼小，自然也很轻。' },
];
function initDui() {
  const list = document.getElementById('duiList');
  list.innerHTML = DUI.map((d, i) => `<button type="button" class="dui" data-i="${i}"><span class="da">${esc(d.a)}</span><span class="db">${esc(d.b)}</span>${d.ex ? '<small>课本例句</small>' : ''}</button>`).join('');
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.dui');
    if (b) b.classList.toggle('open');
  });
}

/* 换个题目 */
const TITLES = [
  { t: '背', why: '抓住最后的画面：“我”背母亲，妻子背儿子——一个“背”字，背起了责任与爱。' },
  { t: '分歧', why: '抓住情节的关键：大路还是小路？分歧的化解，见出一家人的互相体谅。' },
  { t: '整个世界', why: '抓住全文的主旨句：老一辈和下一代，就是中年人的整个世界。' },
  { t: '大路与小路', why: '抓住两条路：一条是孝，一条是慈，选择里都是爱。' },
  { t: '初春的田野', why: '抓住环境：春天、生命，与母亲“熬过了一个严冬”呼应。' },
];
function initTitles() {
  const box = document.getElementById('titles');
  box.innerHTML = TITLES.map((t, i) => `<button type="button" class="title-card" data-i="${i}">《${t.t}》</button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.title-card');
    if (!b) return;
    box.querySelectorAll('.title-card').forEach((x) => x.classList.toggle('on', x === b));
    document.getElementById('titlesWhy').textContent = TITLES[+b.dataset.i].why;
  });
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS });
    initDui();
    initTitles();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
