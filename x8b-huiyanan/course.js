'use strict';
/* 回延安 · 本课数据与专属互动：五部分情感线、信天游打拍子（节拍 + 韵脚）、比兴拆解、地方特色词、修辞分类、分部分背诵 */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- 全诗（背诵用，逐字照课本） ---------- */
const PARTS_TEXT = [
  ['心口呀莫要这么厉害地跳，', '灰尘呀莫把我眼睛挡住了……', '手抓黄土我不放，', '紧紧儿贴在心窝上。', '……几回回梦里回延安，', '双手搂定宝塔山。', '千声万声呼唤你，', '——母亲延安就在这里！', '杜甫川唱来柳林铺笑，', '红旗飘飘把手招。', '白羊肚手巾红腰带，', '亲人们迎过延河来。', '满心话登时说不出来，', '一头扑在亲人怀……'],
  ['……二十里铺送过柳林铺迎，', '分别十年又回家中。', '树梢树枝树根根，', '亲山亲水有亲人。', '羊羔羔吃奶眼望着妈，', '小米饭养活我长大。', '东山的糜子西山的谷，', '肩膀上的红旗手中的书。', '手把手儿教会了我，', '母亲打发我们过黄河。', '革命的道路千万里，', '天南海北想着你……'],
  ['米酒油馍木炭火，', '团团围定炕上坐。', '满窑里围得不透风，', '脑畔上还响着脚步声。', '老爷爷进门气喘得紧：', '“我梦见鸡毛信来——可真见亲人……”', '亲人见了亲人面，', '欢喜的眼泪眼眶里转。', '“保卫延安你们费了心，', '白头发添了几根根。”', '团支书又领进社主任，', '当年的放羊娃如今长成人。', '白生生的窗纸红窗花，', '娃娃们争抢来把手拉。', '一口口的米酒千万句话，', '长江大河起浪花。', '十年来革命大发展，', '说不尽这三千六百天……'],
  ['千万条腿来千万只眼，', '也不够我走来也不够我看！', '头顶着蓝天大明镜，', '延安城照在我心中：', '一条条街道宽又平，', '一座座楼房披彩虹；', '一盏盏电灯亮又明，', '一排排绿树迎春风……', '对照过去我认不出了你，', '母亲延安换新衣。'],
  ['杨家岭的红旗啊高高地飘，', '革命万里起高潮！', '宝塔山下留脚印，', '毛主席登上了天安门！', '枣园的灯光照人心，', '延河滚滚喊“前进”！', '赤卫军，青年团，红领巾，', '走着咱英雄几辈辈人……', '社会主义路上大踏步走，', '光荣的延河还要在前头！', '身长翅膀吧脚生云，', '再回延安看母亲！'],
];
const NUM = ['一', '二', '三', '四', '五'];
const POEMS = {};
PARTS_TEXT.forEach((lines, i) => { POEMS[`p${i + 1}`] = { title: `回延安（${NUM[i]}）`, author: '贺敬之', lines: lines.map((t) => ({ t })) }; });
Poem.render(POEMS);

/* ---------- 五部分 · 情感温度（顶层生成：deck.js 统计分步） ---------- */
const PARTS = [
  { t: '回到延安', f: '激动', h: 92, s: '满心话登时说不出来，一头扑在亲人怀……', d: '诗人踏上延安的土地，激动得说不出话。' },
  { t: '忆当年', f: '感恩', h: 70, s: '羊羔羔吃奶眼望着妈，小米饭养活我长大。', d: '回忆延安对自己的哺育和教导。' },
  { t: '话家常', f: '喜悦', h: 80, s: '一口口的米酒千万句话，长江大河起浪花。', d: '在窑洞里和乡亲们叙旧，亲热欢喜。' },
  { t: '看新貌', f: '赞美', h: 86, s: '对照过去我认不出了你，母亲延安换新衣。', d: '看到延安城的巨大变化，由衷赞叹。' },
  { t: '望未来', f: '豪迈', h: 100, s: '身长翅膀吧脚生云，再回延安看母亲！', d: '回顾延安的光荣历史，展望未来，抒发豪情。' },
];
function buildParts() {
  document.getElementById('parts').innerHTML = PARTS.map((p, i) => `<button type="button" class="part" data-step="${i + 1}" data-i="${i}">
    <span class="part-n">${NUM[i]}</span><b>${p.t}</b>
    <span class="therm"><i style="height:${p.h}%"></i></span><span class="part-f">${p.f}</span></button>`).join('');
}
buildParts();
function initParts() {
  const info = document.getElementById('partsInfo');
  document.getElementById('parts').addEventListener('click', (e) => {
    const b = e.target.closest('.part');
    if (!b) return;
    document.querySelectorAll('#parts .part').forEach((x) => x.classList.toggle('sel', x === b));
    const p = PARTS[+b.dataset.i];
    info.innerHTML = `<b>第${NUM[+b.dataset.i]}部分 · ${p.t}：</b>${p.d}<br><span class="yw">${p.s}</span>`;
  });
}

/* ---------- 信天游打拍子：/ 分节拍，韵脚是下句最后一个字 ---------- */
const BEATS = [
  { up: '手抓/黄土/我不放，', down: '紧紧儿/贴在/心窝上。', rhyme: 'ang', why: '“放”“上”押 ang 韵。上句写动作，下句写把黄土当宝贝贴在心上——动作越来越重，情越来越浓。' },
  { up: '……几回回/梦里/回延安，', down: '双手/搂定/宝塔山。', rhyme: 'an', why: '“安”“山”押 an 韵。上句说梦，下句写梦里的动作，“搂定”把思念写得可触可感。' },
  { up: '杜甫川/唱来/柳林铺笑，', down: '红旗/飘飘/把手招。', rhyme: 'ao', why: '“笑”“招”押 ao 韵。上下句都用拟人：河在唱、村在笑、红旗招手，写出迎接的热烈。' },
  { up: '羊羔羔/吃奶/眼望着妈，', down: '小米饭/养活我/长大。', rhyme: 'a', why: '“妈”“大”押 a 韵。上句起兴，下句点题：延安像母亲一样哺育了“我”。' },
  { up: '米酒/油馍/木炭火，', down: '团团/围定/炕上坐。', rhyme: 'uo', why: '“火”“坐”押 uo 韵。上句罗列三样东西，下句写人，窑洞里的热乎气扑面而来。' },
  { up: '千万条腿来/千万只眼，', down: '也不够我走来/也不够我看！', rhyme: 'an', why: '“眼”“看”押 an 韵。上下句对应（腿—走，眼—看），夸张写出看不够的欢喜。' },
];
function initBeat() {
  const pick = document.getElementById('beatPick');
  const up = document.getElementById('beatUp');
  const down = document.getElementById('beatDown');
  const info = document.getElementById('beatInfo');
  let cur = 0;
  let timer = null;
  const line = (s, isDown) => {
    const segs = s.split('/');
    return segs.map((g, i) => {
      const last = isDown && i === segs.length - 1;
      const m = last ? g.match(/^(.*?)(.)([，。！、：；……]*)$/) : null;
      const body = m ? `${esc(m[1])}<em class="yun">${esc(m[2])}</em>${esc(m[3])}` : esc(g);
      return `<span class="seg">${body}</span>`;
    }).join('<i class="bar">|</i>');
  };
  const show = (i) => {
    clearInterval(timer);
    cur = i;
    const b = BEATS[i];
    // 上句韵脚也标出来（去掉标点后的最后一个字）
    up.innerHTML = line(b.up, true);
    down.innerHTML = line(b.down, true);
    info.innerHTML = `<b>韵：${b.rhyme}</b><br>${b.why}`;
    pick.querySelectorAll('.btn').forEach((x, k) => x.classList.toggle('solid', k === i));
  };
  pick.innerHTML = BEATS.map((b, i) => `<button type="button" class="btn" data-i="${i}">${esc(b.up.replace(/[/…，]/g, ''))}</button>`).join('');
  pick.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) show(+b.dataset.i); });
  document.getElementById('beatPlay').addEventListener('click', () => {
    clearInterval(timer);
    const segs = [...document.querySelectorAll('#beatCard .seg')];
    segs.forEach((s) => s.classList.remove('hit'));
    document.getElementById('beatCard').classList.remove('done');
    let k = 0;
    timer = setInterval(() => {
      if (k >= segs.length) { clearInterval(timer); document.getElementById('beatCard').classList.add('done'); return; }
      segs[k].classList.add('hit');
      k += 1;
    }, 650);
  });
  show(cur);
}

/* ---------- 比兴拆解 ---------- */
const BIXING = [
  { up: '树梢树枝树根根，', down: '亲山亲水有亲人。', k: '兴', why: '从树梢说到树根，一层比一层深，引出延安的山、水、人都是亲的。' },
  { up: '羊羔羔吃奶眼望着妈，', down: '小米饭养活我长大。', k: '比兴', why: '用羊羔吃奶望着母羊作比，引出延安的小米饭哺育了“我”——延安就是母亲。' },
  { up: '东山的糜子西山的谷，', down: '肩膀上的红旗手中的书。', k: '兴', why: '先说延安山上的庄稼，再说在这里得到的革命理想和知识——物质和精神都由延安供养。' },
  { up: '一口口的米酒千万句话，', down: '长江大河起浪花。', k: '比', why: '把说不完的话、翻腾的感情比作长江大河掀起的浪花，奔涌不息。' },
  { up: '头顶着蓝天大明镜，', down: '延安城照在我心中：', k: '比', why: '把蓝天比作明镜，延安城的新面貌像映在镜中一样，清清楚楚照进诗人心里。' },
];
function initBixing() {
  const list = document.getElementById('bxList');
  list.innerHTML = BIXING.map((b, i) => `<button type="button" class="bx" data-i="${i}">
    <span class="bx-up"><small>${b.k}</small>${esc(b.up)}</span>
    <span class="bx-down">${esc(b.down)}</span>
    <span class="bx-why">${esc(b.why)}</span></button>`).join('');
  list.addEventListener('click', (e) => { const b = e.target.closest('.bx'); if (b) b.classList.toggle('open'); });
}

/* ---------- 背诵：一部分一部分 ---------- */
function initRecitePick() {
  const pick = document.getElementById('recitePick');
  const boxes = [...document.querySelectorAll('.s-recite .recite')];
  pick.innerHTML = NUM.map((n, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">第${n}部分</button>`).join('');
  pick.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    boxes.forEach((x, k) => { x.hidden = k !== +b.dataset.i; });
    pick.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
  });
}

/* ---------- 地方特色词（选一选） ---------- */
const LOCAL = [
  { t: '几回回', ok: true, why: '方言：一回又一回' },
  { t: '白羊肚手巾', ok: true, why: '陕北人头上扎的白毛巾' },
  { t: '米酒油馍', ok: true, why: '黍米酒和油炸黍米面饼' },
  { t: '脑畔上', ok: true, why: '窑洞的顶上' },
  { t: '羊羔羔', ok: true, why: '方言叠词，亲切' },
  { t: '红窗花', ok: true, why: '窑洞窗纸上的剪纸' },
  { t: '糜子', ok: true, why: '当地的黍类谷物' },
  { t: '鸡毛信', ok: false, why: '战争年代的紧急信件，是时代特色' },
  { t: '电灯', ok: false, why: '城市新面貌，不是地方特色' },
  { t: '青年团', ok: false, why: '时代特色，不是方言' },
];

/* ---------- 积累拓展四：修辞 ---------- */
const SORT = [
  { s: '千声万声呼唤你，——母亲延安就在这里！', ok: ['呼告', '比喻', '夸张'], q: '直接对延安呼唤（呼告），把延安比作母亲，“千声万声”夸张——感情喷涌而出。' },
  { s: '杜甫川唱来柳林铺笑，红旗飘飘把手招。', ok: ['拟人'], q: '河会唱、村会笑、红旗会招手，整个延安都在欢迎游子归来，热烈欢快。' },
  { s: '千万条腿来千万只眼，也不够我走来也不够我看！', ok: ['夸张'], q: '极言延安变化之大、景物之多，写出诗人看不够、走不够的喜悦。' },
  { s: '对照过去我认不出了你，母亲延安换新衣。', ok: ['比喻', '拟人', '对比'], q: '与过去对比，把延安城的新面貌说成母亲“换新衣”，亲切又形象。' },
];

const MOMENTS = [
  {
    name: '写家乡', pic: 'xintianyou',
    prompt: '用信天游的形式写两节，表达你对家乡的感情。',
    hint: '上句写家乡的一样东西（一棵树、一条河、一种吃的），下句写你的感情；两句末字押韵。',
    example: '村口的老槐树枝连着枝，走多远我也把你记在心里。\n门前的小河水哗哗地流，梦里头还在你身边走。',
  },
  {
    name: '写母校', pic: 'yinglai',
    prompt: '假如多年后你回到母校，用两节信天游写写那一刻。',
    hint: '可以学“手抓黄土我不放”，用一个动作写激动；用一个比兴写感恩。',
    example: '操场上的跑道红又长，一圈圈跑出我的好时光。\n老师的粉笔一寸寸短，教会我天南海北都敢闯。',
  },
  {
    name: '新延安', pic: 'baota',
    prompt: '口语交际情境 1：假如诗人新世纪重回延安，替他写两节。',
    hint: '上句写看到的新变化，下句写心情；可以用“一条条……一座座……”的句式。',
    example: '宝塔山下的高楼排成行，延河两岸的灯火亮堂堂。\n千山万水我又回来看，母亲延安你换了新衣衫。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['比喻', '拟人', '夸张', '对比', '呼告'], picks: { local: LOCAL }, moments: MOMENTS });
    Poem.init();
    initParts();
    initBeat();
    initBixing();
    initRecitePick();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
