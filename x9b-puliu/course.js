'use strict';
/* 蒲柳人家 · 本课数据与互动：人物群像名片（标签切换外貌/本事/名场面/矛盾）、人物关系图、语言特色分类、写人物名片 */

const svgNS = (tag, attrs, text) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text) el.textContent = text;
  return el;
};

/* ---------- 人物名片 ---------- */
const TABS = [['look', '外貌'], ['skill', '本事'], ['scene', '名场面'], ['knot', '矛盾']];
const PEOPLE = [
  {
    name: '何满子', tagline: '六岁 · 奶奶的“小祖宗儿”', pic: 'manzi', keys: ['野', '灵', '倔'],
    look: '剃个光葫芦头，天灵盖上留着个木梳背儿；晒得两道眉毛只剩下淡淡的痕影，鼻梁子裂了皮，全身上下就像刚从烟囱里爬出来。',
    skill: '聪慧灵秀，脑瓜儿记性好，爱听故事，过耳不忘；好问个字儿，过目不忘。一册唱本不够他几天念的。',
    scene: '何满子却隐匿在柳棵子地里，深藏到芦苇丛中，潜伏在青纱帐内的豆棵下，跟奶奶捉迷藏，暗暗发笑。',
    knot: '不肯穿花红兜肚，怕被叫“小丫头儿”；本想哄爷爷开心，却被拴在葡萄架下逼着写一百个字——心里委屈而又憋闷。',
  },
  {
    name: '一丈青大娘', tagline: '何满子的奶奶 · 能镇八方', pic: 'yizhangqing', keys: ['泼辣', '能干', '疼孙'],
    look: '大高个儿，一双大脚，青铜肤色，嗓门也亮堂；手腕子上两只叮叮当当响的黄铜镯子。',
    skill: '骂人一气呵成，三五个大小伙子不够她打一锅的；种地、撑船、打鱼都是行家，还会扎针、拔罐子、接生、接骨、看红伤。',
    scene: '只听咔吧一声，一丈青大娘折断了一棵茶碗口粗细的河柳，带着呼呼风声挥舞起来，把这几个纤夫扫下河去，就像正月十五煮元宵，纷纷落水。',
    knot: '能镇八方，却管不了何满子；疼孙子，就和儿媳妇发生了尖锐的矛盾——爱面子，又偷偷掉了好几回眼泪。',
  },
  {
    name: '何大学问', tagline: '何满子的爷爷 · 赶马人', pic: 'daxuewen', keys: ['豪爽', '好面子', '盼孙成才'],
    look: '人高马大，膀阔腰圆，面如重枣，浓眉朗目，一副关公相貌。',
    skill: '会耍大刀，打一手好鞭花；几百匹野马在他一杆大鞭下乖乖地像绵羊；编起故事来，有枝有叶，有文有武。',
    scene: '这位身穿长衫的何大学问，骑一匹光背儿马，左肩挂一只书囊，右肩扛一杆一丈八尺的大鞭，那形象是既威风凛凛又滑稽可笑。',
    knot: '斗大的字认不得三筐，却被尊称“大学问”，当真穿长衫、咬文嚼字；盼孙子成为真正的大学问，自己却财力不足——夜深人静时阵阵悲凉。',
  },
];

function buildCards() {
  document.getElementById('cards').innerHTML = PEOPLE.map((p, i) => `<div class="pcard" data-step="${i + 1}" data-i="${i}">
    <div class="pc-top"><i class="pc-pic" data-bg="assets/${p.pic}.jpg"></i>
      <div class="pc-id"><b>${p.name}</b><small>${p.tagline}</small><span>${p.keys.map((k) => `<em>${k}</em>`).join('')}</span></div></div>
    <div class="pc-tabs">${TABS.map(([k, t], j) => `<button type="button" class="pc-tab${j ? '' : ' on'}" data-k="${k}">${t}</button>`).join('')}</div>
    <p class="pc-body">${p.look}</p></div>`).join('');
}
buildCards();

function initCards() {
  document.getElementById('cards').addEventListener('click', (e) => {
    const tab = e.target.closest('.pc-tab');
    if (!tab) return;
    const card = tab.closest('.pcard');
    card.querySelectorAll('.pc-tab').forEach((t) => t.classList.toggle('on', t === tab));
    const body = card.querySelector('.pc-body');
    body.textContent = PEOPLE[+card.dataset.i][tab.dataset.k];
    body.classList.toggle('quote', tab.dataset.k === 'scene');
  });
}

/* ---------- 人物关系图：何满子居中 ---------- */
const REL = [
  { n: '何满子', x: 320, y: 190, c: 'me', d: '六岁，在奶奶身边长大，像野鸟不入笼。' },
  { n: '一丈青大娘', x: 120, y: 80, line: '疼爱 · 怕勾魂', d: '“心尖子，肺叶子，眼珠子，命根子”；又打又骂，最后总是“小祖宗儿！”' },
  { n: '何大学问', x: 520, y: 80, line: '盼成才 · 拴住', d: '盼孙子成为真正的大学问；坐牢回来满腔怒火，把孙子拴在葡萄架下。' },
  { n: '母亲', x: 110, y: 300, line: '上学前留在奶奶身边', d: '城里书铺掌柜的女儿，斯文；婆媳不和，只能把何满子留在乡下。' },
  { n: '老秀才', x: 530, y: 300, line: '烟袋敲头', d: '整天板着阴沉沉的长脸，用长杆烟袋敲何满子的光葫芦头。' },
  { n: '周檎', x: 320, y: 350, line: '教字 · 形影不离', d: '在通州念书的洋学生，教会何满子一大堆字儿，还不花一文钱。' },
];

function buildRel() {
  const svg = document.getElementById('relSvg');
  const c = REL[0];
  REL.slice(1).forEach((r, i) => {
    const g = svgNS('g', { class: 'rel-l', 'data-step': i + 2 });
    g.appendChild(svgNS('line', { x1: c.x, y1: c.y, x2: r.x, y2: r.y }));
    g.appendChild(svgNS('text', { class: 'rel-lt t-c', x: (c.x + r.x) / 2, y: (c.y + r.y) / 2 - 6 }, r.line));
    svg.appendChild(g);
  });
  REL.forEach((r, i) => {
    const g = svgNS('g', { class: `rel-n${i ? '' : ' me'}`, 'data-step': i ? i + 1 : 1, 'data-i': i });
    g.appendChild(svgNS('rect', { x: r.x - 62, y: r.y - 22, width: 124, height: 44, rx: 22 }));
    g.appendChild(svgNS('text', { class: 'rel-t t-c', x: r.x, y: r.y + 7 }, r.n));
    svg.appendChild(g);
  });
}
buildRel();

function initRel() {
  document.getElementById('relSvg').addEventListener('click', (e) => {
    const g = e.target.closest('[data-i]');
    if (!g) return;
    const r = REL[+g.dataset.i];
    document.getElementById('relInfo').innerHTML = `<b>${r.n}</b><br>${r.d}`;
  });
}

/* ---------- 语言特色 ---------- */
const SORT = [
  { s: '奶奶气得咬牙切齿地骂他，手握着擀面杖要梆他，还威吓要三天不给他饭吃。', ok: ['口语'], q: '“梆”是方言口语，敲打的意思，干脆、有声响。' },
  { s: '人配衣裳马配鞍，何满子穿上这条花红兜肚，一定会在小伙伴们中间出人头地。', ok: ['俗语'], q: '“人配衣裳马配鞍”是俗语，通俗形象，说明衣着打扮的重要。' },
  { s: '一丈青大娘骂人，就像雨打芭蕉，长短句，四六体，鼓点似的骂一天，一气呵成，也不倒嗓子。', ok: ['评书腔'], q: '借鉴传统小说和评书的语言，节奏铿锵、句式整齐，绘声绘色。' },
  { s: '这几个纤夫头顶着火盆子，拉了百八十里路，顶水又逆风，还没有歇脚打尖，个顶个窝着一肚子饿火。', ok: ['俗语', '口语'], q: '“窝着一肚子饿火”通俗形象，又饿又气的样子跃然纸上。' },
  { s: '但是，前思后想，千里搭长棚，没有不散的筵席，到了儿点了头。', ok: ['俗语'], q: '“千里搭长棚，没有不散的筵席”是俗语，写出奶奶无奈地同意分家。' },
  { s: '何大学问人高马大，膀阔腰圆，面如重枣，浓眉朗目，一副关公相貌。', ok: ['评书腔'], q: '四字短语连用，像说书人在“开脸”，人物一出场就威风凛凛。' },
];

const MOMENTS = [
  {
    name: '起个外号', pic: 'daxuewen',
    prompt: '学“一丈青”“何大学问”，为身边一个人起一个善意的外号，并写清外号的由来。',
    hint: '外号要抓住他最鲜明的特点；由来要有一个小故事，最好带点夸张。',
    example: '我们班的“百科全书”是小林。有一回物理老师问“彩虹为什么是弯的”，全班鸦雀无声，他慢悠悠站起来，从光的折射一路讲到古人怎么解释彩虹，讲得老师都坐下来听。从那天起，“百科全书”就叫开了。',
  },
  {
    name: '写一个名场面', pic: 'yizhangqing',
    prompt: '为身边一个人写一个“名场面”：用一串动作和一两句话，把他的性格写活。',
    hint: '多角度：表情、语言、动作、心理；可以学课文用比喻和夸张，让画面更有趣。',
    example: '外婆一听说有人踩了她的菜地，把围裙一解，往肩上一搭，三步并作两步冲出院门，嗓门亮得半条街都听得见：“谁家的鸡？给我出来！”回来时，手里却多了两个邻居塞的鸡蛋，脸上笑开了花。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['口语', '俗语', '评书腔'], moments: MOMENTS });
    initCards();
    initRel();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
