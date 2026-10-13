'use strict';
/* 大雁归来 · 本课专属互动：大雁春归时间线（按月份排列观察节点）、拟人词点亮、孤雁之谜雁队示意 */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- 时间线：m 月份列 ---------- */
const MONTHS = ['11 月', '3 月', '4 月', '5 月'];
const NODES = [
  { m: 0, t: '南飞：一声不响', s: '11月份南飞的鸟群，目空一切地从我们的头上高高飞过，即使发现了它们所喜欢的沙滩和沼泽，也几乎是一声不响。', o: '秋天是狩猎季节，大雁知道“每个沼泽地和池塘边，都有瞄准它们的猎枪”——警觉、沉默。作为对比出现。' },
  { m: 1, t: '休战：低低穿行', s: '3月的大雁则不同。尽管它们在冬天的大部分时间里都可能受到枪击，但现在却是休战时刻。', o: '春天禁猎，大雁“顺着弯曲的河流拐来拐去”，向沙滩低语、向池塘问好——放松、亲切。' },
  { m: 1, t: '降落：抖掉冬天', s: '一触到水，我们刚到的客人就会叫起来，似乎它们溅起的水花能抖掉那脆弱的香蒲身上的冬天。', o: '试探性盘旋 → 白色尾部朝着远山 → 慢慢扇动黑色翅膀 → 滑翔下来。观察细致。' },
  { m: 1, t: '邀请：喧嚷着', s: '第一群大雁一旦来到这里，它们便向每一个迁徙的雁群喧嚷着发出邀请。', o: '不消几天，沼泽地里到处都可以看到它们。' },
  { m: 2, t: '记录：642 只', s: '1946年4月11日，我们记录下来的大雁是642只。', o: '用“所种的松树和停留的大雁”两个数字衡量春天的富足——精确的观察记录。' },
  { m: 2, t: '玉米地：每天一次旅行', s: '从早到晚，它们一群一群地喧闹着往收割后的玉米地飞去。', o: '出发前“高声而有趣的辩论”，返回时“像凋零的枫叶一样”摇晃着落下。' },
  { m: 2, t: '孤雁之谜', s: '六只或以六的倍数组成的雁队，要比偶尔出现一只，多得多。', o: '观察—推测—数据分析：孤雁是丧失了亲人的幸存者。' },
  { m: 2, t: '夜晚集会', s: '在4月的夜间，当天气暖和得可以待在屋外时，我们喜欢倾听大雁在沼泽中集会时的鸣叫。', o: '旁批：这段写雁声细致入微，情趣盎然——翅膀拍水声、蹼划水声、激烈辩论、最后发言。' },
  { m: 3, t: '集会渐少', s: '等到白头翁花盛开的时候，我们的大雁集会也就逐渐少下来。', o: '用白头翁花开标记时间——又是物候；5 月，沼泽弥漫着青草气息。' },
];
function buildMonths() {
  let step = 0;
  document.getElementById('months').innerHTML = MONTHS.map((name, m) => `<div class="mcol m${m}"><b class="mname">${name}</b><div class="mnodes">${
    NODES.map((n, i) => (n.m === m ? `<button type="button" class="gn" data-step="${(step += 1)}" data-i="${i}"><i></i>${esc(n.t)}</button>` : '')).join('')}</div></div>`).join('');
}
buildMonths();
function initMonths() {
  const card = document.getElementById('gcard');
  document.getElementById('months').addEventListener('click', (e) => {
    const b = e.target.closest('.gn');
    if (!b) return;
    document.querySelectorAll('#months .gn').forEach((x) => x.classList.toggle('sel', x === b));
    const i = +b.dataset.i;
    const n = NODES[i];
    const pic = n.m === 2 && i >= 5 && i <= 6 ? 'yumi' : (i === 2 || i === 3 ? 'luoshui' : 'guilai');
    card.innerHTML = `<span class="gc-pic" style="background-image:url('assets/${pic}.jpg')"></span><p class="gc-s">${esc(n.s)}</p><p class="gc-o"><b>观察：</b>${esc(n.o)}</p>`;
  });
}

/* ---------- 拟人词：[[词|解释]] ---------- */
const NH = [
  '而一只定期迁徙的大雁，下定了在黑夜飞行 200 英里的[[赌注|“赌注”：迁徙是拿生命冒险，一旦起程就难以撤回——写出大雁的果敢和迁徙的艰险（旁批一）。]]，它一旦起程再要撤回去就不那么容易了。',
  '向我们农场宣告新的季节来临的大雁[[知道很多事情，其中包括威斯康星的法规|大雁“懂法”：秋天是狩猎季节，春天禁猎。所以秋雁沉默警觉，春雁放松喧闹（旁批二）。]]。',
  '它们顺着弯曲的河流拐来拐去，穿过现在已经没有猎枪的狩猎点和小洲，[[向每个沙滩低语着，如同向久别的朋友低语一样|像归乡的游子见到老朋友，亲切而深情。]]。',
  '似乎它们溅起的水花能[[抖掉|冬天被写成可以“抖掉”的东西：水花一溅，残冬褪去，春天来了（旁批三）。]]那脆弱的香蒲身上的冬天。',
  '每次出发之前，都有一场[[高声而有趣的辩论|像一群人在开会讨论，热闹又有趣。]]，而每次返回之前的争论则更为响亮。',
  '那接着而来的低语，是它们在[[论述食物的价值|把咕咕的低语想象成“论述”，幽默风趣：玉米粒被雪藏了一冬，格外珍贵。]]。',
];
function initNh() {
  const list = document.getElementById('nhList');
  const info = document.getElementById('nhInfo');
  const notes = [];
  list.innerHTML = NH.map((s) => `<p class="nh-s">${esc(s).replace(/\[\[(.+?)\|(.+?)\]\]/g, (_, w, why) => {
    notes.push(why);
    return `<button type="button" class="nhw" data-i="${notes.length - 1}">${w}</button>`;
  })}</p>`).join('');
  list.addEventListener('click', (e) => {
    const w = e.target.closest('.nhw');
    if (!w) return;
    w.classList.add('lit');
    info.innerHTML = `<b>${w.textContent}</b><br>${notes[+w.dataset.i]}`;
  });
}

/* ---------- 孤雁之谜：雁队示意 ---------- */
function buildGeese() {
  const team = (n) => `<span class="team">${'<i class="goose"></i>'.repeat(n)}</span>`;
  document.getElementById('geese').innerHTML = `${team(6)}${team(6)}${team(12)}${team(1)}<span class="g-lab">六只一队、十二只一队……偶尔一只孤雁</span>`;
}

const MOMENTS = [
  {
    name: '窗外的麻雀', pic: 'yumi',
    prompt: '连续观察几天窗外或校园里的鸟，写一则观察笔记。',
    hint: '记下日期和时间；数一数有几只；它们在做什么；用一处拟人写出你的喜爱。',
    example: '10 月 13 日，早上 7 点。教学楼前的香樟树上停着 9 只麻雀，三只一伙，叽叽喳喳地“开早会”。一只胆大的跳到台阶上，歪着头打量我，好像在问：“今天的面包屑呢？”',
  },
  {
    name: '一盆植物', pic: 'luoshui',
    prompt: '观察家里的一盆植物一周，写下它的变化。',
    hint: '用尺量一量、数一数叶子；记录浇水、晒太阳的情况；推测一下变化的原因。',
    example: '星期一，绿萝新长出的叶子还卷着，长约 2 厘米；星期五，它已经完全舒展，量一量有 6 厘米。我把它从书桌挪到窗台后，新叶明显长得快了——大概它也想多晒晒太阳。',
  },
  {
    name: '蚂蚁搬家', pic: 'guilai',
    prompt: '观察一次蚂蚁、蜗牛或其他小动物的活动，学习“观察—推测—验证”。',
    hint: '你看到了什么现象？你猜是为什么？怎样验证你的猜测？',
    example: '傍晚，我发现一队蚂蚁正排着长队往高处搬运白色的卵。我猜：要下雨了。第二天早上果然下起了大雨。下次我还要再观察几次，看看这个规律是不是每次都灵。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initMonths();
    initNh();
    buildGeese();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
