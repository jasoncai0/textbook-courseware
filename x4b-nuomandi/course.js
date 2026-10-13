'use strict';
/* “诺曼底号”遇难记（四下 23）· 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课独有：沉船二十分钟倒计时时间轴（钟一圈走完、船慢慢下沉、小艇来回穿梭）+ “六十人，还有一人”人数图 + 简短有力的对话 */

/* 六十人：28 名船员 + 1 名女服务员（第 2 步），31 名乘客其中 12 名妇女（第 3 步），船长（第 5 步） */
const CREW = 28;
const MAID = 1;
const WOMEN = 12;
const PASSENGERS = 31;
function initPeople() {
  const dot = (cls, step) => `<i class="pd ${cls}" data-step="${step}"></i>`;
  const html = [
    ...Array.from({ length: CREW + MAID }, (_, i) => dot(i < CREW ? 'crew' : 'woman', 2)),
    ...Array.from({ length: PASSENGERS }, (_, i) => dot(i < WOMEN ? 'woman' : 'man', 3)),
    dot('cap', 5),
  ];
  document.getElementById('people').innerHTML = html.join('');
}

/* 分角色读：给每句加上说话人 */
function initRoles() {
  const btn = document.getElementById('roleBtn');
  btn.addEventListener('click', () => {
    const on = document.getElementById('talk').classList.toggle('roles');
    btn.classList.toggle('solid', on);
  });
}

/* 倒计时：第 n 步走到第 n 条事件；船越沉越深，小艇越来越多 */
const TL_STEPS = 7;
const RING_R = 92;
const BOAT_N = 5;
function initBoats() {
  document.getElementById('boats').innerHTML = Array.from({ length: BOAT_N }, (_, i) =>
    `<g class="boat b${i}" style="animation-delay:${(-i * 1.3).toFixed(1)}s"><path d="M0 0 h26 l-4 7 h-18 z" fill="#c9a76a"/><circle cx="8" cy="-3" r="2.5" fill="#e8e4da"/><circle cx="16" cy="-3" r="2.5" fill="#e8e4da"/></g>`).join('');
}
function updateClock(step) {
  const p = Math.min(1, step / TL_STEPS);
  const len = 2 * Math.PI * RING_R;
  const ring = document.getElementById('clockRing');
  ring.style.strokeDasharray = len;
  ring.style.strokeDashoffset = len * p;
  const num = document.getElementById('clockNum');
  const unit = document.getElementById('clockUnit');
  if (step === 0) { num.textContent = '20'; unit.textContent = '分钟'; }
  else if (step >= TL_STEPS) { num.textContent = '到了'; unit.textContent = '二十分钟'; }
  else { num.textContent = '……'; unit.textContent = '时间在流逝'; }
  const ship = document.getElementById('shipG');
  ship.style.transform = `translate(0, ${(p * 85).toFixed(0)}px) rotate(${(p * 8).toFixed(1)}deg)`;
  document.querySelectorAll('#boats .boat').forEach((b, i) => b.classList.toggle('go', i < step - 1 && step < TL_STEPS + 1));
  document.getElementById('tl').querySelectorAll('li').forEach((li, i) => li.classList.toggle('now', i === step - 1));
}

/* 课后第 2 题：语言还是动作 */
const SORT = [
  { s: '“全体安静，注意听命令！把救生艇放下去。妇女先走，其他乘客跟上，船员断后。必须把六十人救出去！”', ok: ['语言'], q: '临危不乱，先人后己' },
  { s: '“哪个男人胆敢抢在女人前面，你就开枪打死他。”', ok: ['语言'], q: '果断威严，稳住秩序' },
  { s: '哈尔威巍然屹立在他的船长岗位上，指挥着，主宰着，领导着大家。', ok: ['动作'], q: '镇定自若，坚守岗位' },
  { s: '“把克莱芒救出去！”', ok: ['语言'], q: '想到每一个人，关爱弱小' },
  { s: '一个手势也没有做，一句话也没有说，犹如铁铸，纹丝不动，随着轮船一起沉入了深渊。', ok: ['动作'], q: '忠于职守，舍己为人' },
];

/* 读与写 */
const MOMENTS = [
  {
    name: '对生命的体会', pic: 'chenmo',
    prompt: '课后第 3 题：哈尔威船长的英雄壮举，让你对生命有了怎样的体会？',
    hint: '想一想：船长把活下去的机会给了谁？他为什么把自己“忘了”？生命的价值只在于活得长吗？',
    example: '哈尔威船长本可以第一个坐上救生艇，可他把六十个人都救了出去，自己却和轮船一起沉入大海。我明白了：生命是宝贵的，可有的人把生命的机会让给别人，他的生命就变得更有分量。他虽然离开了，却永远活在人们心里。',
  },
  {
    name: '我想对船长说', pic: 'zhihui',
    prompt: '如果你是被救上小艇的乘客（或者是见习水手克莱芒），望着“黑色的雕像”沉进大海，你想对船长说什么？',
    hint: '先选好你的身份，再想想当时的心情：害怕、感激、难过……',
    example: '船长，我是克莱芒。您在最危险的时候还记得我这个小小的见习水手。小艇离大船越来越远，我看见您一动不动地站在指挥台上。我会像您一样，一辈子忠于自己的职责。',
  },
  {
    name: '写一组连续的动作', pic: 'wu',
    prompt: '语文园地：学课文的样子，用一组连续的动作写一个人，让人看出他的品质。',
    hint: '可以写“妈妈下班回到家”“小男孩打羽毛球”。动作要一个接一个，用上准确的动词。',
    example: '妈妈推开门，顾不上换鞋，先放下包，挽起袖子钻进了厨房。她打开冰箱，拿出青菜，一边洗一边回头问我：“作业写完了吗？”',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['语言', '动作'], moments: MOMENTS });
    initPeople();
    initRoles();
    initBoats();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-clock')) updateClock(step);
  },
};
