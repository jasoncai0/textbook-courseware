'use strict';
/* 植树的牧羊人 · 本课数据与本课独有互动：三次见面的高原变化（年份切换）、十万颗橡子数据条、人物特点证据卡 */

const YEARS = {
  1913: {
    title: '初遇牧羊人', who: [
      '五十五岁，叫艾力泽·布菲；失去了独子和妻子，独自生活，与羊群和狗做伴',
      '不太爱说话，显得自信、平和；三年来一个人种树，已经种下十万颗橡子',
    ], land: [
      '到处是荒地，光秃秃的山上，稀稀拉拉地长着一些野生的薰衣草',
      '废弃的村庄，泉眼已经干涸；狂风像饥饿的野兽发出吼叫',
    ],
  },
  1920: {
    title: '再见牧羊人', who: [
      '还活着，而且身体还很硬朗；羊吃树苗，就不养羊了，改养蜜蜂',
      '战争并没有扰乱他的生活，他一直在种树：橡树、山毛榉、白桦树',
    ], land: [
      '一片灰灰的薄雾，像地毯一样铺在高原上——那是树林',
      '1910 年种的橡树已经比“我”都高；树林最大的一块有 11 公里宽；山下村子里看到了溪水',
    ],
  },
  1945: {
    title: '最后一次相见', who: [
      '已经 87 岁；靠一个人的体力与毅力，把这片荒漠变成了绿洲',
    ], land: [
      '猛烈而干燥的风，变成了飘着香气的微风；昔日的荒地成为一片沃土',
      '废墟上建起了干净的农舍；泉水、水渠、薄荷；一万多口人过上了幸福生活',
    ],
  },
};

/* 用固定种子生成树的位置，保证每次画面一样 */
function seeded(n) {
  let s = n;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function buildTrees() {
  const rnd = seeded(7);
  const g = document.getElementById('trees');
  const parts = [];
  for (let i = 0; i < 70; i += 1) {
    const x = 20 + rnd() * 760;
    const y = 205 + rnd() * 120;
    if (x > 420 && x < 570 && y < 260) continue; // 村庄留空
    const late = i % 2 === 1; // 一半树 1945 年才长出来
    const r = 7 + rnd() * 6;
    parts.push(`<g class="tr ${late ? 't45' : 't20'}" style="--x:${x.toFixed(0)}px;--y:${y.toFixed(0)}px"><rect x="${(x - 1.5).toFixed(0)}" y="${y.toFixed(0)}" width="3" height="${(r * 1.3).toFixed(0)}" fill="#6a4e33"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}"/></g>`);
  }
  g.innerHTML = parts.join('');
}

function showYear(yr) {
  const svg = document.getElementById('plateau');
  const d = YEARS[yr];
  svg.setAttribute('class', `y${yr}`);
  document.getElementById('yrBig').textContent = yr;
  document.querySelectorAll('[data-yr]').forEach((b) => b.classList.toggle('solid', b.dataset.yr === String(yr)));
  document.getElementById('yrPanel').innerHTML = `<h3>${yr} · ${d.title}</h3>
    <div class="yr-box"><b>牧羊人的情况</b><ul>${d.who.map((t) => `<li>${t}</li>`).join('')}</ul></div>
    <div class="yr-box land"><b>高原的情况</b><ul>${d.land.map((t) => `<li>${t}</li>`).join('')}</ul></div>`;
}

const TRAITS = [
  { k: '极为认真', ev: [['直接 · 动作', '一颗一颗仔细地挑选……按十个一堆把它们分开……把个儿小的，或者有裂缝的拣了出去'], ['直接 · 生活', '房间里收拾得很整齐，餐具洗得干干净净……补丁的针脚也很细，几乎看不出来']] },
  { k: '沉默平和', ev: [['直接', '这个男人不太爱说话……不过，他显得自信、平和'], ['间接 · 以狗衬人', '他的那条大狗也像主人一样，安静，忠厚，不张扬'], ['间接 · “我”的感受', '和牧羊人待在一起，让人心里很平静']] },
  { k: '慷慨无私', ev: [['直接 · 语言', '我问他，这块地是你的吗？他摇摇头说，不是……看起来他并不在意'], ['间接 · 结果', '一万多口人的幸福生活，都源于这位叫艾力泽·布菲的老人']] },
  { k: '坚忍执着', ev: [['直接', '战争并没有扰乱他的生活。他一直在种树'], ['间接 · “我”的评价', '我从没见过他有任何动摇或怀疑，只有天知道这有多难']] },
  { k: '有智慧', ev: [['直接', '他说，羊吃树苗，就不养羊了……改养蜜蜂了'], ['直接', '他认为谷底比较湿润，就把白桦树种在那里。他是对的']] },
];

function initTraits() {
  const btns = document.getElementById('traitBtns');
  const out = document.getElementById('traitOut');
  btns.innerHTML = TRAITS.map((t, i) => `<button type="button" class="btn" data-i="${i}">他是一个${t.k}的人</button>`).join('');
  btns.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    const t = TRAITS[+b.dataset.i];
    btns.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    out.innerHTML = `<h3>他是一个${t.k}的人</h3>${t.ev.map(([kind, s]) => `<p class="ev"><span>${kind}</span>${s}</p>`).join('')}`;
  });
}

const MOMENTS = [
  {
    name: '一位老教师', pic: 'zhongshu',
    prompt: '写一位几十年如一日、默默付出的老师（或其他人）。',
    hint: '选两三个“见面”的时刻：他做了什么？周围发生了什么变化？最后写你的评价。',
    example: '我上小学时，门卫刘爷爷就在校门口种了一排小树苗。每天放学，他都拎着水桶一棵棵浇水。六年后我毕业，那排树已经高过了围墙，夏天，整条路都是阴凉。前几天回母校，刘爷爷的头发全白了，他还在给新种的树苗浇水……',
  },
  {
    name: '治沙的人', pic: 'senlin',
    prompt: '查找资料，写一位在荒漠中植树造林的普通人。',
    hint: '用数字和前后对比写出变化；评价要落在他的精神上。',
    example: '他在沙漠边上一住就是几十年，一棵一棵地种下了几十万棵树。当年寸草不生的沙地，如今成了绿洲……',
  },
];

window.LESSON = {
  init() {
    buildTrees();
    showYear(1913);
    document.querySelector('.yr-btns').addEventListener('click', (e) => {
      const b = e.target.closest('[data-yr]');
      if (b) showYear(+b.dataset.yr);
    });
    initTraits();
    Narrative.init({ moments: MOMENTS });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
