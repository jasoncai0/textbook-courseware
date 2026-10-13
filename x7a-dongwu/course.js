'use strict';
/* 动物笑谈 · 本课数据与互动（趣事卡、视角切换、找调侃句）。翻页引擎见 ../shared/deck.js */

/* 第三张卡没有配图：用扣子示意图（三堆扣子，一丝不错） */
const BUTTONS_SVG = `<svg viewBox="0 0 300 170" class="btn-svg" aria-label="三堆扣子示意图">
  <rect width="300" height="170" fill="#f3ead8"/>
  ${[['袖子上的', 55, 4], ['背心上的', 150, 5], ['裤子上的', 245, 6]].map(([t, x, n]) => `
    <g>${Array.from({ length: n }, (_, k) => `<circle cx="${x - 20 + (k % 3) * 20}" cy="${70 + Math.floor(k / 3) * 22}" r="8" fill="#7a5b3a"/><circle cx="${x - 22 + (k % 3) * 20}" cy="${68 + Math.floor(k / 3) * 22}" r="1.6" fill="#f3ead8"/><circle cx="${x - 18 + (k % 3) * 20}" cy="${72 + Math.floor(k / 3) * 22}" r="1.6" fill="#f3ead8"/>`).join('')}
    <text x="${x}" y="140" text-anchor="middle" font-size="15" fill="#5a4636">${t}</text></g>`).join('')}
  <text x="150" y="30" text-anchor="middle" font-size="16" fill="#8a3b2a">“犯罪”现场：整整齐齐排作三堆</text>
</svg>`;

const CARDS = [
  {
    pic: 'xiaoya',
    text: '……我不但得蹲在地上爬行，还得不停地嘎嘎地叫，这真不是好玩的。不过为了探求真理，也只好忍受这种考验了。',
    me: '蹲着、爬着、“呱格格格”地叫，为小鸭的服从暗自得意',
    animal: '小凫把“我”当母亲，紧紧跟随，一不叫就尖声哭',
    others: '园子栏杆边的观光客“全都脸色煞白”',
  },
  {
    pic: 'keke',
    text: '如果一个人用尽全身之力，把嗓门憋得尖尖的，发出“哦——啊”的叫声，虽说比不上大鹦鹉的气势，听起来也蛮像了。',
    me: '在火车站人群里扯着嗓子学鹦鹉叫',
    animal: '可可迟疑一会儿，敛翼俯冲，停在“我”的手臂上',
    others: '“我四周的人一个个都像生了根似的定在那里”',
  },
  {
    svg: BUTTONS_SVG,
    text: '果然，可可不但把这位老教授身上的扣子全咬下来了，而且还整整齐齐地排在地上：袖子上的扣子作一堆，背心上的作一堆；另外，一丝不错地，裤子上的扣子也排作一堆。',
    me: '跑到“犯罪”现场一看',
    animal: '咬下扣子，还分门别类排好——调皮又聪明',
    others: '父亲“像个大兵似的大声咒骂”，抓着裤腰蹒跚走来',
  },
  {
    pic: 'maoxian',
    text: '它总是一口咬住露在外面的活线头，很快地飞到空中，把一整团线都打开来，就像一个纸风筝拖着一条极长的尾巴。',
    me: '（母亲）一刻不停地织着毛衣',
    animal: '拖着毛线绕柠檬树打转，把整棵树缠上鲜艳的毛线',
    others: '客人“在这棵树前一站半天”，想不出是怎么缠上去的',
  },
];

const PICKS = {
  humor: [
    { t: '好像只要我不出声，它们就以为我死了，或者以为我不再爱它们了。这真是值得大哭特哭的理由呢！', ok: true, why: '一本正经地替小鸭“抱屈”' },
    { t: '只要会像母鸭一样叫唤，不管是只肥胖的北京鸭还是一个更胖的人，都成了它们的母亲。', ok: true, why: '拿自己的胖开玩笑' },
    { t: '只要想想用老法子杀猪时猪的嚎声，再用扩音器放大几倍就得了。', ok: true, why: '夸张的比方，叫人发笑' },
    { t: '我跑到“犯罪”现场一看……', ok: true, why: '把鹦鹉当“罪犯”，调侃' },
    { t: '我从维也纳坐火车回艾顿堡。', ok: false, why: '平实交代，不是调侃' },
    { t: '他最喜欢在我们房子西南面的阳台上睡午觉。', ok: false, why: '平实叙述，为后文做铺垫' },
  ],
};

function initCards() {
  const tabs = document.getElementById('cardTabs');
  const show = (i) => {
    const c = CARDS[i];
    tabs.querySelectorAll('.ncard').forEach((b, k) => b.classList.toggle('cur', k === i));
    const pic = document.getElementById('npPic');
    pic.innerHTML = c.svg || '';
    pic.style.backgroundImage = c.pic ? `url(assets/${c.pic}.jpg)` : 'none';
    document.getElementById('npText').textContent = c.text;
    document.getElementById('npMe').textContent = c.me;
    document.getElementById('npAnimal').textContent = c.animal;
    document.getElementById('npOthers').textContent = c.others;
    const page = document.getElementById('cardPage');
    page.classList.remove('turn');
    void page.offsetWidth; // 重新触发翻页动画
    page.classList.add('turn');
  };
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('.ncard');
    if (b) show(+b.dataset.i);
  });
  show(0);
}

const VIEW_CAP = {
  me: '“我”眼里：一队小鸭子信任地跟着“我”，多么听话！',
  them: '观光客眼里：小鸭子藏在深草里看不见，只有一个大胡子男人在草地上爬着学鸭叫……',
};
function initView() {
  const slide = document.querySelector('.s-view');
  const set = (v) => {
    slide.dataset.view = v;
    slide.querySelectorAll('[data-view]').forEach((b) => b.classList.toggle('solid', b.dataset.view === v));
    document.getElementById('viewCap').textContent = VIEW_CAP[v];
  };
  slide.querySelector('.view-tools').addEventListener('click', (e) => {
    const b = e.target.closest('[data-view]');
    if (b) set(b.dataset.view);
  });
  set('me');
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS });
    initCards();
    initView();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
