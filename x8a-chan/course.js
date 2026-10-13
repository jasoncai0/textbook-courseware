'use strict';
/* 蝉 · 本课数据与专属互动：蝉的一生（地上地下循环图 + 四年对五星期）、观察笔记（作者怎么知道的） */

const STATIONS = [
  { x: 120, y: 200, t: '出土', c: '夏至 · 小圆孔', s: '每年蝉的初次出现是在夏至。在阳光暴晒的道路上有好些小圆孔……蝉的幼虫就从这些圆孔爬出。' },
  { x: 245, y: 110, t: '蜕皮', c: '约半小时', s: '外层的皮开始由背上裂开，里面露出淡绿色的蝉体……表演一种奇怪的体操……总的过程大概要半小时。……假定它在早晨九点钟占据了树枝，大概要到十二点半才扔下它的皮飞去。' },
  { x: 400, y: 62, t: '歌唱', c: '只有五星期', s: '在阳光中的歌唱只有五星期……长起可与飞鸟匹敌的翅膀，沐浴在温暖的阳光中。' },
  { x: 555, y: 110, t: '产卵', c: '三四百个', s: '选择最小的、差不多已经枯死的小枝，刺成一排小孔……一个小孔内约生十个卵，所以生卵总数约为三四百个。（危险：极小的蚋。）' },
  { x: 690, y: 140, t: '孵化', c: '鱼形幼虫', s: '开始很像极小的鱼，眼睛大而黑……脱下的皮自动形成一种线，幼虫靠它能够附着在树枝上，行日光浴，踢踢腿，试试筋力。' },
  { x: 690, y: 280, t: '落地', c: '钻入软土', s: '不久，它落到地上……必须立刻到地下寻觅藏身的地方……用前足的钩扒掘地面，几分钟以后，一个土穴就挖成了。' },
  { x: 400, y: 350, t: '地下', c: '大概四年', s: '未长成的蝉的地下生活，至今还是个秘密。不过……地下生活所经过的时间我们是知道的，大概是四年。' },
];
// 顶层生成：deck.js 要统计分步
(function buildLife() {
  const svg = document.getElementById('lifeSvg');
  svg.insertAdjacentHTML('beforeend', STATIONS.map((st, i) => `<g class="st" data-step="${i + 1}" data-i="${i}">
    <circle cx="${st.x}" cy="${st.y}" r="36"/><text class="st-t" x="${st.x}" y="${st.y + 8}">${st.t}</text>
    <text class="st-c" x="${st.x}" y="${st.y + (i === 2 ? -46 : 56)}">${st.c}</text></g>`).join(''));
}());

function initLife() {
  const info = document.getElementById('lifeInfo');
  document.getElementById('lifeSvg').addEventListener('click', (e) => {
    const g = e.target.closest('.st');
    if (!g) return;
    document.querySelectorAll('#lifeSvg .st').forEach((x) => x.classList.toggle('sel', x === g));
    const st = STATIONS[+g.dataset.i];
    info.innerHTML = `<b>${st.t}（${st.c}）</b><br>${st.s}`;
  });
}

const NOTES = [
  { f: '蝉的洞口周围一点儿土都没有。', m: '<b>作比较 + 推理：</b>和金蜣的窠比，金蜣从洞口往下挖，土堆在门口；蝉的幼虫从地下往上挖，最后才开门，所以门口没有土。' },
  { f: '隧道深十五六英寸，墙上涂着灰泥。', m: '<b>动手挖掘：</b>“我要考察它们遗弃下的储藏室，必须用刀子来挖掘。”' },
  { f: '蜕皮大约要半小时，九点到十二点半才飞走。', m: '<b>守候、计时：</b>一直守在树枝旁，从开始看到结束。' },
  { f: '一根枯枝上常刺出三四十个孔，每孔约十个卵。', m: '<b>计数、估算：</b>数孔、数卵，算出总数约三四百个。' },
  { f: '危险来自一种极小的蚋。', m: '<b>多次观察：</b>“我经过多次的观察，才知道这种危险是什么。”还见过三个蚋依次等着。' },
  { f: '卵孵化后像极小的鱼，眼睛大而黑。', m: '<b>放大镜：</b>“我从放大镜里见过蝉卵的孵化。”' },
  { f: '地下生活大概是四年。', m: '<b>实事求是：</b>“未长成的蝉的地下生活，至今还是个秘密。”——不知道的地方，作者不乱写。' },
];
function initNotes() {
  const nb = document.getElementById('nb');
  nb.innerHTML = NOTES.map((n, i) => `<div class="nb-card"><p class="nb-f"><i>${i + 1}</i>${n.f}</p>
    <button type="button" class="btn nb-btn">他怎么知道？</button><p class="nb-m" hidden>${n.m}</p></div>`).join('');
  nb.addEventListener('click', (e) => {
    const b = e.target.closest('.nb-btn');
    if (!b) return;
    b.hidden = true;
    b.nextElementSibling.hidden = false;
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initLife();
    initNotes();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
