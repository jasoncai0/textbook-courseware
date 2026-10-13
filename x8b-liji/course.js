'use strict';
/* 《礼记》二则 · 本课数据。本课独有：“教学相长”推理链、大同社会要素拼图 */

const POEMS = {
  jiayao: {
    title: '虽有嘉肴', author: '《礼记·学记》', layout: 'h',
    lines: [
      { t: '虽有嘉肴，弗食，不知其旨也；', r: '虽有/嘉肴，弗食，不知/其旨也；', y: '即使有美味的菜肴，不吃，就不知道它味道的甘美；' },
      { t: '虽有至道，弗学，不知其善也。', r: '虽有/至道，弗学，不知/其善也。', y: '即使有最好的道理，不学习，就不知道它的好处。' },
      { t: '是故学然后知不足，教然后知困。', r: '是故/学/然后/知不足，教/然后/知困。', y: '所以，学习之后才知道自己的不足，教人之后才知道自己有困惑。' },
      { t: '知不足，然后能自反也；知困，然后能自强也。', r: '知不足，然后/能/自反也；知困，然后/能/自强也。', y: '知道了不足，然后才能自我反思；知道了困惑，然后才能自我勉励。' },
      { t: '故曰：教学相长也。', r: '故曰：教学/相长也。', y: '所以说：教与学是互相推动、互相促进的。' },
      { t: '《兑命》曰“学学半”，其此之谓乎！', r: '《兑命》曰“学学半”，其/此之谓乎！', y: '《兑命》说“教别人，占自己学习的一半”，大概说的就是这个道理吧！' },
    ],
    notes: {
      嘉肴: '美味的菜。嘉，美好', 弗: '不', 旨: '味美', 至道: '最好的道理', 困: '困惑', 自反: '自我反思', 自强: '自我勉励',
      教学: '教学相长：教与学是互相推动、互相促进的', 兑命: '即《说命》，《尚书》中的一篇。兑，读 yuè', 学学半: '教别人，占自己学习的一半。前一个“学”同“敩（xiào）”，教导',
    },
  },
  datong: {
    title: '大道之行也', author: '《礼记·礼运》', layout: 'h',
    lines: [
      { t: '大道之行也，天下为公。', r: '大道/之行也，天下/为公。', y: '在大道施行的时候，天下是公共的。' },
      { t: '选贤与能，讲信修睦。', r: '选贤/与能，讲信/修睦。', y: '选拔推举品德高尚、有才干的人，讲求诚信，培养和睦的气氛。' },
      { t: '故人不独亲其亲，不独子其子，', r: '故/人/不独/亲其亲，不独/子其子，', y: '所以人们不只敬爱自己的父母，不只疼爱自己的子女，' },
      { t: '使老有所终，壮有所用，幼有所长，', r: '使/老/有所终，壮/有所用，幼/有所长，', y: '使老年人有终老的保障，壮年人能发挥才能，幼童能健康成长，' },
      { t: '矜、寡、孤、独、废疾者皆有所养，', r: '矜、寡、孤、独、废疾者/皆/有所养，', y: '老而无妻的、老而无夫的、幼而无父的、老而无子的和残疾的人都能得到供养，' },
      { t: '男有分，女有归。', r: '男/有分，女/有归。', y: '男子有职分，女子有归宿。' },
      { t: '货恶其弃于地也，不必藏于己；', r: '货/恶/其弃于地也，不必/藏于己；', y: '财物，人们厌恶把它扔在地上，但不一定要据为己有；' },
      { t: '力恶其不出于身也，不必为己。', r: '力/恶/其不出于身也，不必/为己。', y: '力气，人们厌恶它不从自己身上使出来，但不一定是为了自己。' },
      { t: '是故谋闭而不兴，盗窃乱贼而不作，故外户而不闭。', r: '是故/谋闭/而不兴，盗窃/乱贼/而不作，故/外户/而不闭。', y: '因此图谋之心闭塞而不会兴起，盗窃、作乱害人的事不会发生，所以家家户户都不用闩门。' },
      { t: '是谓大同。', r: '是谓/大同。', y: '这就叫作大同。' },
    ],
    notes: {
      大道: '指儒家推崇的上古时代的政治制度', 为公: '天下为公：天下是公共的', 与能: '选贤与能：选拔推举品德高尚、有才干的人。与，同“举”，读 jǔ',
      修睦: '讲信修睦：讲求诚信，培养和睦气氛。修，培养', 亲其亲: '不独亲其亲：不只是敬爱自己的父母。第一个“亲”用作动词，以……为亲',
      子其子: '不独子其子：不只是疼爱自己的子女', 有所终: '有终老的保障', 有所用: '能够发挥自己的才能，为社会效力', 矜: '同“鳏（guān）”，老而无妻',
      有分: '分（fèn），职分，职守', 有归: '归，女子出嫁', 恶: '厌恶，读 wù', 谋闭: '谋闭而不兴：图谋之心闭塞而不会兴起', 乱贼: '作乱害人',
      不作: '作，兴起', 外户: '外户而不闭：门从外面带上，而不从里面闩上',
    },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* ================= 大同拼图 ================= */
const PIECES = [
  { t: '天下为公', z: 0 }, { t: '选贤与能', z: 0 }, { t: '讲信修睦', z: 0 },
  { t: '不独亲其亲，不独子其子', z: 1 },
  { t: '老有所终', z: 2 }, { t: '壮有所用', z: 2 }, { t: '幼有所长', z: 2 }, { t: '矜、寡、孤、独、废疾者皆有所养', z: 2 }, { t: '男有分，女有归', z: 2 },
  { t: '货……不必藏于己', z: 3 }, { t: '力……不必为己', z: 3 }, { t: '谋闭而不兴，盗窃乱贼而不作', z: 3 }, { t: '外户而不闭', z: 3 },
];
// 打乱顺序（固定种子，课堂每次一致）
const ORDER = [7, 2, 10, 0, 12, 4, 9, 1, 6, 11, 3, 8, 5];

function initPuzzle() {
  const pool = document.getElementById('pzPool');
  const board = document.getElementById('pzBoard');
  const count = document.getElementById('pzCount');
  pool.innerHTML = ORDER.map((i) => `<button type="button" class="pz-piece" data-i="${i}">${PIECES[i].t}</button>`).join('');
  let picked = null;
  const update = () => {
    const placed = board.querySelectorAll('.pz-piece').length;
    count.textContent = `已拼 ${placed} / ${PIECES.length}`;
    board.classList.toggle('done', placed === PIECES.length);
  };
  pool.addEventListener('click', (e) => {
    const p = e.target.closest('.pz-piece');
    if (!p) return;
    pool.querySelectorAll('.pz-piece').forEach((x) => x.classList.toggle('sel', x === p && !p.classList.contains('sel')));
    picked = p.classList.contains('sel') ? p : null;
  });
  board.addEventListener('click', (e) => {
    const zone = e.target.closest('.pz-zone');
    if (!zone || !picked) return;
    if (PIECES[+picked.dataset.i].z === +zone.dataset.z) {
      picked.classList.remove('sel', 'no');
      zone.querySelector('.pz-in').appendChild(picked);
      picked = null;
      update();
    } else {
      zone.classList.remove('no');
      void zone.offsetWidth; // 重新触发抖动动画
      zone.classList.add('no');
    }
  });
  update();
}

/* ================= 古今异义 ================= */
const GUJIN = [
  { w: '教学', e: '故曰：教学相长也', gu: '教与学（两件事）', jin: '教师把知识传授给学生' },
  { w: '子', e: '不独子其子', gu: '前一个“子”：以……为子，疼爱；后一个：子女', jin: '儿子' },
  { w: '归', e: '男有分，女有归', gu: '女子出嫁', jin: '返回、归还' },
  { w: '恶', e: '货恶其弃于地也', gu: '厌恶（读 wù）', jin: '凶恶、恶劣（读 è）' },
  { w: '作', e: '盗窃乱贼而不作', gu: '兴起', jin: '做、写作' },
  { w: '亲', e: '不独亲其亲', gu: '前：以……为亲，敬爱；后：父母', jin: '亲人；亲近' },
];
function initGujin() {
  const box = document.getElementById('gjList');
  box.innerHTML = GUJIN.map((g) => `<div class="gj-row"><b>${g.w}</b><span class="gj-e">${g.e}</span>
    <button type="button" class="gj-gu"><span>看古义</span><em>${g.gu}</em></button><span class="gj-jin">今：${g.jin}</span></div>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.gj-gu');
    if (b) b.classList.toggle('open');
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    Poem.init();
    initPuzzle();
    initGujin();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
  },
};
