'use strict';
/* 女娲造人 · 本课数据与互动（枝干长成大树、神性人性分类、旁批问答）。翻页引擎见 ../shared/deck.js */

/* 树叶：x、y 为 SVG 坐标；old 为《风俗通》里对应的枝干（没有则为空），add 为课文增添的内容 */
const LEAVES = [
  { x: 80, y: 268, name: '动机', old: '天地开辟，未有人民', add: '世间“荒凉寂寞”，女娲“感到非常孤独”，想“添一点儿什么东西进去”。' },
  { x: 95, y: 205, name: '灵感', old: '', add: '池水照见她的面容：“她笑，池水里的影子也向着她笑”——她想创造“像自己的生物”。' },
  { x: 345, y: 205, name: '第一个人', old: '女娲抟黄土作人', add: '掘黄泥、掺水、“揉团着，揉团着”；泥人一落地就活，开口喊“妈妈！”' },
  { x: 100, y: 110, name: '取名“人”', old: '', add: '女娲“满心欢喜，眉开眼笑”，给心爱的孩子取名叫“人”，人有“管理宇宙的非凡的气概”。' },
  { x: 360, y: 268, name: '日夜劳作', old: '务剧，力不暇供', add: '“一直工作到晚霞布满天空”，“把头枕在山崖上，略睡一睡”，最后“疲倦不堪”。' },
  { x: 345, y: 100, name: '藤条挥洒', old: '乃引絙于泥中，举以为人', add: '拉下枯藤，伸入泥潭，“向地面上这么一挥洒”，泥点儿溅落处出现许多“叫着跳着的人儿”。' },
  { x: 222, y: 30, name: '分男女', old: '女娲祷神祠，祈而为女媒，因置婚姻', add: '担心人会死亡，就把小人儿分为男女，让他们“自己去创造后代”，人类“世世代代绵延下来”。' },
];
function buildTree() {
  const svg = document.getElementById('treeSvg');
  svg.insertAdjacentHTML('beforeend', LEAVES.map((l, i) => `<g class="leaf" data-step="${i + 1}" data-i="${i}">
    <ellipse cx="${l.x}" cy="${l.y}" rx="44" ry="20"/><text x="${l.x}" y="${l.y + 5}" class="t-m t-c">${l.name}</text></g>`).join(''));
}
buildTree(); // 叶子带 data-step，必须在 deck.js 统计分步之前

function initTree() {
  const box = document.getElementById('leafText');
  document.getElementById('treeSvg').addEventListener('click', (e) => {
    const g = e.target.closest('.leaf');
    if (!g) return;
    const l = LEAVES[+g.dataset.i];
    document.querySelectorAll('.leaf.cur').forEach((x) => x.classList.remove('cur'));
    g.classList.add('cur');
    box.innerHTML = `<b>${l.name}</b><br>${l.old ? `古书：<i>${l.old}</i><br>` : '古书：<i>（没有）</i><br>'}课文：${l.add}`;
  });
}

const KINDS = ['神的本领', '人的特性'];
const SORT = [
  { s: '据说，她一天当中能够变化七十次。', ok: ['神的本领'], q: '神通广大' },
  { s: '看看周围的景象，感到非常孤独。', ok: ['人的特性'], q: '会孤独' },
  { s: '她笑，池水里的影子也向着她笑；她假装生气，池水里的影子也向着她生气。', ok: ['人的特性'], q: '会笑、会“假装生气”' },
  { s: '这个泥捏的小家伙，刚一接触到地面，马上就活了起来', ok: ['神的本领'], q: '赋予生命' },
  { s: '不由得满心欢喜，眉开眼笑。', ok: ['人的特性'], q: '像母亲一样欢喜' },
  { s: '夜深了，她只把头枕在山崖上，略睡一睡。', ok: ['神的本领', '人的特性'], q: '身躯巨大，又会困倦' },
  { s: '而她本人已经疲倦不堪了。', ok: ['人的特性'], q: '会累' },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: KINDS });
    initTree();
    document.querySelectorAll('.side-q .btn').forEach((b) => b.addEventListener('click', () => b.closest('.side-q').classList.toggle('open')));
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
