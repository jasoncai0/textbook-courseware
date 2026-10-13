'use strict';
/* 春 · 本课数据与互动。长卷、五幅图、批注、标重音停连都在这里；记叙文通用部分见 ../shared/narrative.js
 * 朗读标注小语法：{词} 重音，/ 停顿，~ 连读（只在打开“显示重音停连”时显示） */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const markup = (s) => esc(s)
  .replace(/\{([^}]+)\}/g, '\u0003$1\u0004')
  .replace(/\//g, '<i class="pz">\u0001</i>')
  .replace(/~/g, '<i class="lk">‿</i>')
  .replace(/\u0003/g, '<em>').replace(/\u0004/g, '</em>').replace(/\u0001/g, '/');

/* ================= 长卷：每一屏 = 一段画 + 原文 ================= */
const JUAN = [
  { part: '盼春', name: '盼春', pic: '', cls: 'pan', paras: [
    '盼望着，/盼望着，/{东风}来了，/春天的{脚步}/{近}了。',
    '一切都像{刚睡醒}的样子，/{欣欣然}张开了眼。/山{朗润}起来了，/水{涨}起来了，/太阳的脸{红}起来了。',
  ] },
  { part: '绘春', name: '春草图', pic: 'chuncao', paras: [
    '小草{偷偷地}/从土里{钻}出来，/{嫩嫩的}，/{绿绿的}。园子里，田野里，/瞧去，/{一大片一大片}满是的。坐着，~躺着，~打两个滚，~踢几脚球，~赛几趟跑，~捉几回迷藏。/风{轻悄悄}的，/草{软绵绵}的。',
  ] },
  { part: '绘春', name: '春花图', pic: 'chunhua', paras: [
    '桃树、杏树、梨树，/{你不让我}，{我不让你}，/都开满了花{赶趟儿}。{红的}像{火}，/{粉的}像{霞}，/{白的}像{雪}。花里带着{甜味儿}；/闭了眼，/树上仿佛已经{满是}桃儿、杏儿、梨儿。花下成千成百的蜜蜂{嗡嗡}地闹着，/大小的蝴蝶{飞来飞去}。野花遍地是：/杂样儿，/有名字的，没名字的，/散在草丛里，/像{眼睛}，像{星星}，/还{眨呀眨}的。',
  ] },
  { part: '绘春', name: '春风图', pic: 'chunfeng', paras: [
    '“吹面不寒杨柳风”，/{不错的}，/像{母亲的手}/抚摸着你。风里带来些新翻的{泥土}的气息，/混着{青草}味儿，/还有各种{花}的香，/都在微微润湿的空气里{酝酿}。鸟儿将窠巢安在繁花嫩叶当中，/{高兴}起来了，/{呼朋引伴}地卖弄清脆的喉咙，/唱出{宛转}的曲子，/与轻风流水{应和}着。牛背上牧童的短笛，/这时候也{成天}在{嘹亮}地响。',
  ] },
  { part: '绘春', name: '春雨图', pic: 'chunyu', video: true, paras: [
    '雨是{最寻常}的，/一下就是{三两天}。/{可别恼}。{看}，/像{牛毛}，像{花针}，像{细丝}，/{密密地}{斜织}着，/人家屋顶上全笼着一层{薄烟}。树叶子却绿得{发亮}，/小草也青得{逼你的眼}。傍晚时候，/上灯了，/一点点黄晕的光，/烘托出一片{安静而和平}的夜。乡下去，~小路上，~石桥边，/有撑起伞{慢慢}走着的人；/还有地里工作的农夫，/披着蓑，戴着笠的。他们的草屋，/稀稀疏疏的，/在雨里{静默}着。',
  ] },
  { part: '绘春', name: '迎春图', pic: '', cls: 'ying', paras: [
    '天上{风筝}渐渐多了，/地上{孩子}也多了。城里乡下，~家家户户，~老老小小，/他们也{赶趟儿}似的，/一个个都出来了。{舒活舒活}筋骨，/{抖擞抖擞}精神，/各做各的一份事去。“一年之计在于春”，/刚起头儿，/有的是{工夫}，/有的是{希望}。',
  ] },
  { part: '赞春', name: '赞春', pic: '', cls: 'zan', paras: [
    '春天像刚落地的{娃娃}，/从头到脚都是{新}的，/他{生长}着。',
    '春天像{小姑娘}，/{花枝招展}的，/{笑}着，/{走}着。',
    '春天像{健壮}的青年，/有{铁一般}的胳膊和腰脚，/他{领着我们}/{上前去}。',
  ] },
];

const YING_SVG = `<svg viewBox="0 0 400 220" class="ying-svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs><linearGradient id="yingSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3f5"/><stop offset="1" stop-color="#eef8e4"/></linearGradient></defs>
  <rect width="400" height="220" fill="url(#yingSky)"/>
  <path d="M0 175 Q100 150 200 170 T400 165 V220 H0Z" fill="#9fd07a"/>
  <g class="kite k1"><path d="M70 40 l18 -20 l18 20 l-18 26z" fill="#e85a4f"/><path d="M88 66 q-8 30 10 60 q-10 30 4 52" stroke="#8a6a4a" fill="none"/></g>
  <g class="kite k2"><path d="M190 30 l14 -16 l14 16 l-14 22z" fill="#f2b33d"/><path d="M204 52 q12 40 -6 76 q8 22 -4 44" stroke="#8a6a4a" fill="none"/></g>
  <g class="kite k3"><path d="M300 55 l16 -18 l16 18 l-16 24z" fill="#4f8fd6"/><path d="M316 79 q-14 30 6 60 q-8 20 2 36" stroke="#8a6a4a" fill="none"/></g>
  <g fill="#6b4b2a"><circle cx="98" cy="170" r="5"/><rect x="95" y="175" width="6" height="14" rx="3"/><circle cx="198" cy="166" r="6"/><rect x="194" y="172" width="8" height="18" rx="3"/><circle cx="214" cy="172" r="4"/><rect x="211" y="176" width="6" height="12" rx="3"/><circle cx="324" cy="168" r="5"/><rect x="321" y="173" width="6" height="15" rx="3"/></g>
</svg>`;

const ZAN_SVG = `<svg viewBox="0 0 400 220" class="ying-svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="400" height="220" fill="#f3f8ea"/><path d="M0 200 H400" stroke="#b8c99a" stroke-width="3"/>
  <path d="M70 200 v-26" stroke="#6a9a3a" stroke-width="4"/><path d="M70 182 q-18 -12 -24 -2 q12 8 24 2 M70 178 q16 -12 24 -2 q-12 9 -24 2" fill="#8cc152"/>
  <path d="M200 200 v-80 M200 150 l-24 -22 M200 134 l22 -20" stroke="#7a5a3a" stroke-width="4"/>
  <g fill="#f29bb2"><circle cx="176" cy="126" r="8"/><circle cx="222" cy="112" r="8"/><circle cx="202" cy="116" r="7"/></g>
  <path d="M330 200 v-120" stroke="#5a3e24" stroke-width="10"/><circle cx="330" cy="70" r="44" fill="#3f8a3a"/><circle cx="296" cy="96" r="24" fill="#4f9a45"/><circle cx="364" cy="92" r="26" fill="#4f9a45"/>
  <text class="t-m t-c" x="70" y="216" fill="#3d6b1f">娃娃·新</text><text class="t-m t-c" x="200" y="216" fill="#a33a5a">小姑娘·美</text><text class="t-m t-c" x="330" y="216" fill="#245a20">青年·力</text>
</svg>`;

function panelPic(j) {
  if (j.video) return `<div class="jp-pic"><video class="scene-bg" data-src="assets/${j.pic}.mp4" data-poster="assets/${j.pic}.jpg" muted loop playsinline preload="none"></video></div>`;
  if (j.pic) return `<div class="jp-pic" data-bg="assets/${j.pic}.jpg"></div>`;
  if (j.cls === 'ying') return `<div class="jp-pic svg">${YING_SVG}</div>`;
  if (j.cls === 'zan') return `<div class="jp-pic svg">${ZAN_SVG}</div>`;
  return '<div class="jp-pic svg pan-pic" aria-hidden="true"><span>盼</span><span>盼</span></div>';
}

function buildJuan() {
  const track = document.getElementById('juanTrack');
  track.innerHTML = JUAN.map((j, i) => `<article class="jp ${j.cls || ''}" data-step="${i}">
    ${panelPic(j)}<h3><small>${j.part}</small>${j.name}</h3>
    <div class="jp-text">${j.paras.map((p) => `<p>${markup(p)}</p>`).join('')}</div></article>`).join('');
  const parts = ['盼春', '春草', '春花', '春风', '春雨', '迎春', '赞春'];
  document.getElementById('juanMap').innerHTML = parts.map((t, i) => `<span class="${i === 0 || i === 6 ? 'end' : ''}">${t}</span>`).join('');
}
buildJuan(); // 必须在 deck.js 统计分步之前生成

function updateJuan(slide, step) {
  const track = slide.querySelector('#juanTrack');
  if (!track) return;
  slide.querySelectorAll('#juanMap span').forEach((s, i) => s.classList.toggle('cur', i === step));
  const panel = track.children[step];
  const view = track.parentElement.clientWidth;
  const x = Math.max(0, Math.min(panel.offsetLeft - (view - panel.offsetWidth) / 2, track.scrollWidth - view));
  track.style.transform = `translateX(${-x}px)`;
}

/* ================= 五幅图 ================= */
const TU = [
  { name: '春草图', pic: 'chuncao', things: ['小草', '园子', '田野', '孩子们', '风'], senses: '看（嫩、绿）· 触（轻悄悄、软绵绵）',
    how: '“偷偷地”“钻”是拟人，小草像顽皮的孩子；“嫩嫩的，绿绿的”叠词有童趣；“坐着，躺着，打两个滚……”一串短句，写人在草地上撒欢。', love: '我喜欢春草图：“偷偷地”三个字，好像小草怕被人发现，悄悄地冒出头来，特别可爱。' },
  { name: '春花图', pic: 'chunhua', things: ['桃花', '杏花', '梨花', '蜜蜂', '蝴蝶', '野花'], senses: '看（红、粉、白）· 闻（甜味儿）· 听（嗡嗡）· 想象（满是桃儿、杏儿、梨儿）',
    how: '“你不让我，我不让你”拟人，写花争着开；“红的像火，粉的像霞，白的像雪”排比加比喻；由树上写到树下，由花写到虫，再写到野花，有远有近。', love: '我喜欢春花图：闭上眼睛还能“看见”果子，作者从眼前的花一下想到了秋天的果，写得真妙。' },
  { name: '春风图', pic: 'chunfeng', things: ['杨柳风', '泥土', '青草', '花香', '鸟儿', '牧童短笛'], senses: '触（像母亲的手抚摸）· 闻（泥土、青草、花香）· 听（鸟鸣、流水、短笛）',
    how: '风看不见，作者用触觉、嗅觉、听觉来写；引古诗“吹面不寒杨柳风”开头，“像母亲的手抚摸着你”写出春风的温柔。', love: '我喜欢春风图：风明明看不见，作者却让我摸到、闻到、听到了它。' },
  { name: '春雨图', pic: 'chunyu', things: ['雨丝', '屋顶薄烟', '树叶', '小草', '灯光', '撑伞的人', '农夫', '草屋'], senses: '看（牛毛、花针、细丝；绿得发亮）· 想象（安静而和平的夜）',
    how: '三个比喻写雨的细、亮、密；“斜织”写雨的姿态；由雨中景写到雨中人，动静结合，画面安静和平。', love: '我喜欢春雨图：“小草也青得逼你的眼”，一个“逼”字，好像绿色要扑到眼睛里来。' },
  { name: '迎春图', svg: true, things: ['风筝', '孩子', '城里乡下的人们'], senses: '看（人们都出来了）· 想（一年之计在于春）',
    how: '“家家户户，老老小小”叠词写人多；“舒活舒活”“抖擞抖擞”写出人的精神；由景写到人，引出“希望”。', love: '我喜欢迎春图：前面都是景，这里人也“赶趟儿”似的出来了，春天让人有了希望。' },
];

function initTu() {
  const tabs = document.getElementById('tuTabs');
  const show = (i) => {
    const t = TU[i];
    tabs.querySelectorAll('.btn').forEach((b, k) => b.classList.toggle('solid', k === i));
    const pic = document.getElementById('tuPic');
    pic.style.backgroundImage = t.svg ? 'none' : `url(assets/${t.pic}.jpg)`;
    pic.innerHTML = t.svg ? YING_SVG : '';
    document.getElementById('tuInfo').innerHTML = `
      <p class="tip"><b>抓住的景物：</b>${t.things.map((x) => `<span class="chip">${x}</span>`).join(' ')}</p>
      <p class="tip"><b>调动的感官：</b>${t.senses}</p>
      <p class="tip"><b>怎么写的：</b>${t.how}</p>
      <details class="tu-love" data-noswipe><summary>我最喜欢，因为……（示例）</summary><p>${t.love}</p></details>`;
  };
  tabs.innerHTML = TU.map((t, i) => `<button type="button" class="btn" data-i="${i}">${t.name}</button>`).join('');
  tabs.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) show(+b.dataset.i); });
  show(0);
}

/* ================= 仿写比喻 ================= */
const FANG = [
  { y: '一位画家', a: '春天像一位画家，拿着蘸满颜料的笔，给山涂上新绿，给桃花点上胭脂。' },
  { y: '一首歌', a: '春天像一首歌，鸟儿唱高音，流水唱低音，风在中间轻轻地和声。' },
  { y: '一封信', a: '春天像一封信，每一片新叶都是一个字，写着“希望”。' },
];
function initFang() {
  const box = document.getElementById('fangBtns');
  box.innerHTML = FANG.map((f, i) => `<button type="button" class="btn" data-i="${i}">${f.y}</button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    box.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    document.getElementById('fangOut').textContent = FANG[+b.dataset.i].a;
  });
}

/* ================= 批注：加点语句 ================= */
const PI = [
  { s: '[盼望着，盼望着]，东风来了，春天的[脚步近了]。', note: '“盼望着”叠用，写出盼春的急切；“脚步近了”把春天当人来写，好像听得见它一步步走来。开篇就把“盼”的感情推出来。' },
  { s: '小草[偷偷地]从土里[钻]出来，[嫩嫩的]，[绿绿的]。', note: '“偷偷地”“钻”是拟人，写出小草不知不觉、充满力量地冒出来；“嫩嫩的，绿绿的”写出质感和颜色，带着孩子般的喜悦。' },
  { s: '野花遍地是：杂样儿，有名字的，没名字的，散在草丛里，[像眼睛，像星星，还眨呀眨的]。', note: '比喻写出野花的多、小、亮；“眨呀眨”又是拟人，好像野花在调皮地看着你，画面活了起来。' },
  { s: '看，[像牛毛，像花针，像细丝]，密密地斜织着，人家屋顶上全笼着一层薄烟。', note: '“牛毛”写多，“花针”写亮，“细丝”写柔长：三个比喻写出春雨细、密、亮、柔的特点，再接“密密地斜织着”，像在织一张网。' },
];
function initPi() {
  const list = document.getElementById('piList');
  list.innerHTML = PI.map((p, i) => `<div class="pi-row"><p class="pi-s">${i + 1}. ${esc(p.s).replace(/\[([^\]]+)\]/g, '<button type="button" class="pi-dot">$1</button>')}</p><p class="pi-note" hidden>${esc(p.note)}</p></div>`).join('');
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.pi-dot');
    if (!b) return;
    const row = b.closest('.pi-row');
    const note = row.querySelector('.pi-note');
    note.hidden = !note.hidden;
    row.querySelectorAll('.pi-dot').forEach((d) => d.classList.toggle('open', !note.hidden));
  });
}

/* ================= 标重音和停连：词块 | 分隔；参考答案 * 重音、/ 后停 ================= */
const LAB = [
  { name: '春草图', why: '“偷偷地”“钻”是拟人的关键，重读；“轻悄悄”“软绵绵”宜重音轻读，读出轻柔。',
    text: '小草|偷偷地*|从土里|钻*|出来，/|嫩嫩的*，|绿绿的*。/|风|轻悄悄*|的，/|草|软绵绵*|的。' },
  { name: '春花图', why: '三组“红、粉、白”与“火、霞、雪”是对应的，重读形成节奏；“你不让我，我不让你”要读出争抢的热闹。',
    text: '桃树、|杏树、|梨树，/|你不让我*，|我不让你*，/|都开满了花|赶趟儿*。/|红的*|像火*，/|粉的*|像霞*，/|白的*|像雪*。' },
  { name: '春雨图', why: '“看”后面停一停，像在提醒人抬头看；三个喻体重读；“密密地斜织着”放慢。',
    text: '看*，/|像|牛毛*，|像|花针*，|像|细丝*，/|密密地*|斜织*|着，/|人家屋顶上|全笼着|一层|薄烟*。' },
  { name: '赞春', why: '三个比喻层层推进，越读越昂扬；“领着我们上前去”是全文最强音，重读、放慢、上扬。',
    text: '春天像|健壮*|的青年，/|有|铁一般*|的胳膊和腰脚，/|他|领着我们*|上前去*。' },
];
function labChunks(text) {
  return text.split('|').map((c) => ({ t: c.replace(/[*/]/g, ''), stress: c.includes('*'), pause: c.endsWith('/') }));
}
function initLab() {
  const tabs = document.getElementById('labTabs');
  const box = document.getElementById('labText');
  let cur = 0;
  const show = (i) => {
    cur = i;
    tabs.querySelectorAll('.btn').forEach((b, k) => b.classList.toggle('solid', k === i));
    document.getElementById('labWhy').textContent = '';
    box.classList.remove('ref');
    box.innerHTML = labChunks(LAB[i].text).map((c, k) => `<button type="button" class="lab-w${c.stress ? ' ans-s' : ''}${c.pause ? ' ans-p' : ''}" data-k="${k}" data-st="0">${esc(c.t)}</button>`).join('');
  };
  tabs.innerHTML = LAB.map((l, i) => `<button type="button" class="btn" data-i="${i}">${l.name}</button>`).join('');
  tabs.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) show(+b.dataset.i); });
  box.addEventListener('click', (e) => {
    const w = e.target.closest('.lab-w');
    if (!w) return;
    w.dataset.st = (+w.dataset.st + 1) % 3;
  });
  document.getElementById('labRef').addEventListener('click', () => {
    box.classList.toggle('ref');
    document.getElementById('labWhy').textContent = box.classList.contains('ref') ? LAB[cur].why : '';
  });
  document.getElementById('labClear').addEventListener('click', () => show(cur));
  show(0);
}

/* ================= 读写迁移 ================= */
const MOMENTS = [
  { name: '多感官写一处景', pic: 'chunfeng', prompt: '像“春风图”那样，调动看、听、闻、触，写九月的一处景物。',
    hint: '风看不见，作者写它摸起来像母亲的手、闻起来有泥土青草花香、听起来有鸟鸣笛声。你也可以写九月的风、九月的早晨、九月的校园……',
    example: '九月的早晨推开窗，风凉凉地扑在脸上，不再是八月那股黏糊糊的热了。楼下桂花刚开，香气一阵一阵地钻进鼻子；树上的知了叫得有气无力，倒是草丛里的蟋蟀，一声比一声清亮。' },
  { name: '连用比喻', pic: 'chunyu', prompt: '像“春雨图”那样，连用几个比喻写一种秋天的景物。',
    hint: '“像牛毛，像花针，像细丝”——三个喻体各写出雨的一个特点。想一想：落叶像什么？秋天的云像什么？',
    example: '梧桐叶落下来了，像蝴蝶，像小船，像一封封寄给大地的信，打着旋儿，慢慢地，慢慢地，铺满了操场边的小路。' },
  { name: '写人的活动', pic: 'chuncao', prompt: '像“春草图”“迎春图”那样，用短句写写九月里人们在做什么。',
    hint: '“坐着，躺着，打两个滚，踢几脚球……”短句一串，节奏轻快。九月里，同学们、家人们都在忙什么？',
    example: '开学了，校门口热闹起来。背着新书包的，提着行李箱的，抱着篮球的，一个个都来了。打招呼，找教室，认新同学，各做各的一份事去。' },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initTu();
    initFang();
    initPi();
    initLab();
    document.querySelector('.juan-marks').addEventListener('click', (e) => {
      const on = e.target.closest('.slide').classList.toggle('marks-on');
      e.target.textContent = on ? '隐藏重音停连' : '显示重音停连';
    });
    window.addEventListener('resize', () => updateJuan(slides[cur], step));
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateJuan(slide, step);
  },
};
