'use strict';
/* 出师表 · 本课数据。诗文模板（横排 + 译文）见 ../shared/poem.js；本课独有：“叙—议”交织的十三次“先帝”标注、三条建议卡、点字断句 */

// 八段原文，每段若干句：t 原文，y 译文；k 标记本段以“议”（劝谏）还是“叙”（追述）为主
const PARAS = [
  { k: '议', lines: [
    { t: '先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。', y: '先帝开创的大业还没有完成一半，就中途去世了。现在天下分为三国，益州困苦疲惫，这实在是国家危急存亡的时候啊。' },
    { t: '然侍卫之臣不懈于内，忠志之士忘身于外者，盖追先帝之殊遇，欲报之于陛下也。', y: '然而侍卫大臣在朝廷里毫不懈怠，忠诚有志的将士在疆场上舍生忘死，大概是追念先帝对他们的特殊礼遇，想要报答在陛下身上啊。' },
    { t: '诚宜开张圣听，以光先帝遗德，恢弘志士之气，不宜妄自菲薄，引喻失义，以塞忠谏之路也。', y: '陛下确实应该扩大听闻的范围，来发扬光大先帝留下的美德，发扬志士的气概，不应该随意看轻自己，说话不恰当，以致堵塞了忠诚进谏的道路。' },
  ] },
  { k: '议', lines: [
    { t: '宫中府中，俱为一体，陟罚臧否，不宜异同。', y: '皇宫中和丞相府中，都是一个整体，晋升、处罚、赞扬、批评，不应该有所不同。' },
    { t: '若有作奸犯科及为忠善者，宜付有司论其刑赏，以昭陛下平明之理，不宜偏私，使内外异法也。', y: '如果有做奸邪事情、触犯科条以及忠心做善事的人，应当交给主管的官员评定对他们的处罚和奖赏，来显示陛下公平清明的治理，不应偏袒徇私，使宫内和丞相府的赏罚标准不同。' },
  ] },
  { k: '议', lines: [
    { t: '侍中、侍郎郭攸之、费祎、董允等，此皆良实，志虑忠纯，是以先帝简拔以遗陛下。', y: '侍中、侍郎郭攸之、费祎、董允等人，这些都是忠良诚实的人，他们的志向和思虑都忠诚纯正，因此先帝把他们选拔出来留给陛下。' },
    { t: '愚以为宫中之事，事无大小，悉以咨之，然后施行，必能裨补阙漏，有所广益。', y: '我认为宫中的事情，无论大小，都拿来询问他们，然后再去施行，一定能够弥补缺失疏漏，得到更多的好处。' },
  ] },
  { k: '议', lines: [
    { t: '将军向宠，性行淑均，晓畅军事，试用于昔日，先帝称之曰能，是以众议举宠为督。', y: '将军向宠，性情品行善良公正，精通军事，从前任用时，先帝称赞他有才能，因此大家商议推举他做中部督。' },
    { t: '愚以为营中之事，悉以咨之，必能使行阵和睦，优劣得所。', y: '我认为军营中的事情，都拿来询问他，一定能够使军队团结和睦，才能高的和才能低的都能各得其所。' },
  ] },
  { k: '议', lines: [
    { t: '亲贤臣，远小人，此先汉所以兴隆也；亲小人，远贤臣，此后汉所以倾颓也。', y: '亲近贤臣，疏远小人，这是西汉兴盛的原因；亲近小人，疏远贤臣，这是东汉衰败的原因。' },
    { t: '先帝在时，每与臣论此事，未尝不叹息痛恨于桓、灵也。', y: '先帝在世时，每次和我谈论这件事，没有一次不对桓帝、灵帝的做法叹息痛心遗憾的。' },
    { t: '侍中、尚书、长史、参军，此悉贞良死节之臣，愿陛下亲之信之，则汉室之隆，可计日而待也。', y: '侍中、尚书、长史、参军，这些都是忠贞贤良、能以死报国的大臣，希望陛下亲近他们、信任他们，那么汉朝的兴盛，就指日可待了。' },
  ] },
  { k: '叙', lines: [
    { t: '臣本布衣，躬耕于南阳，苟全性命于乱世，不求闻达于诸侯。', y: '我本来是平民，在南阳亲自耕种，只求在乱世中苟且保全性命，不谋求在诸侯中扬名显贵。' },
    { t: '先帝不以臣卑鄙，猥自枉屈，三顾臣于草庐之中，咨臣以当世之事，由是感激，遂许先帝以驱驰。', y: '先帝不因为我地位低微、见识短浅，降低身份委屈自己，三次到草庐中来看望我，向我询问当今天下的大事，我因此感奋激发，于是答应为先帝奔走效劳。' },
    { t: '后值倾覆，受任于败军之际，奉命于危难之间，尔来二十有一年矣。', y: '后来遇到兵败，在战败的时候接受重任，在危难之中奉命出使，从那时以来已经二十一年了。' },
  ] },
  { k: '叙', lines: [
    { t: '先帝知臣谨慎，故临崩寄臣以大事也。', y: '先帝知道我做事谨慎，所以临终时把国家大事托付给我。' },
    { t: '受命以来，夙夜忧叹，恐托付不效，以伤先帝之明，故五月渡泸，深入不毛。', y: '接受遗命以来，我日夜忧虑叹息，唯恐先帝托付的事情不能完成，以致损害先帝的英明，所以五月渡过泸水，深入到不长草木的荒凉地方。' },
    { t: '今南方已定，兵甲已足，当奖率三军，北定中原，庶竭驽钝，攘除奸凶，兴复汉室，还于旧都。', y: '如今南方已经平定，兵器铠甲已经充足，应当鼓励率领全军，北上平定中原，希望竭尽我平庸的才能，铲除奸邪凶恶的敌人，复兴汉室，回到原来的都城。' },
    { t: '此臣所以报先帝而忠陛下之职分也。至于斟酌损益，进尽忠言，则攸之、祎、允之任也。', y: '这就是我用来报答先帝、忠于陛下的职责本分。至于斟酌利弊，进献忠言，那就是郭攸之、费祎、董允的责任了。' },
  ] },
  { k: '议', lines: [
    { t: '愿陛下托臣以讨贼兴复之效；不效，则治臣之罪，以告先帝之灵。', y: '希望陛下把讨伐奸贼、兴复汉室的任务交给我；如果没有成效，就惩治我的罪过，来祭告先帝的在天之灵。' },
    { t: '若无兴德之言，则责攸之、祎、允等之慢，以彰其咎。', y: '如果没有发扬圣德的忠言，就责罚郭攸之、费祎、董允等人的怠慢，来揭示他们的过失。' },
    { t: '陛下亦宜自谋，以咨诹善道，察纳雅言，深追先帝遗诏。', y: '陛下也应该自己谋划，征询治国的好方法，识别采纳正确的言论，深切追念先帝的遗诏。' },
    { t: '臣不胜受恩感激。今当远离，临表涕零，不知所言。', y: '我受恩感激不尽。如今将要远离陛下，面对这份奏表禁不住流泪，不知道说了些什么。' },
  ] },
];
const NOTES = {
  先帝: '指蜀汉的创建者刘备', 崩殂: '指帝王之死（殂读 cú）', 秋: '时候', 内: '朝廷', 外: '这里指疆场', 追: '追念', 殊遇: '特殊的礼遇',
  开张圣听: '扩大皇上听闻（的范围），即广泛听取意见', 光: '发扬光大', 恢弘: '发扬，扩展', 妄自菲薄: '随意地看轻自己', 引喻失义: '说话不恰当',
  宫中府中: '皇宫和丞相府中', 陟罚臧否: '晋升、处罚，赞扬、批评。否读 pǐ', 异同: '这里指不同', 作奸犯科: '做奸邪事情，触犯科条', 有司: '负责专职的官员', 刑: '罚',
  平明之理: '公平清明的治理', 内外异法: '宫内和丞相府的赏罚标准不同', 良实: '忠良诚实的人', 志虑忠纯: '志向和思虑忠诚纯正', 简拔: '选拔', 愚: '我，谦称', 咨: '询问',
  裨补阙漏: '弥补缺失疏漏（裨读 bì，阙读 quē）', 广益: '有所广益：有启发和帮助', 性行淑均: '性情品行善良公正', 督: '武官名，统领都城警卫部队', 行阵: '行伍，部队（行读 háng）',
  先汉: '即西汉；后汉即东汉', 所以: '这里表示原因', 痛恨: '痛心、遗憾', '桓、灵': '东汉桓帝、灵帝，宠信宦官，政治腐败', 贞良死节: '忠正贤明，以死报国',
  布衣: '平民', 躬耕: '亲身耕种', 闻达: '有名望，显贵', 卑鄙: '社会地位低微，见识短浅', 猥: '辱，谦辞（读 wěi）', 枉屈: '屈尊就卑', 感激: '感奋激发', 驱驰: '奔走效劳',
  倾覆: '这里指兵败（208 年长坂坡之败）', 尔来: '自那时以来', 二十有一年: '二十一年', 临崩寄臣以大事: '刘备临终前把国家大事托付给诸葛亮', 夙夜: '早晚，日日夜夜',
  不效: '没有效果', 五月渡泸: '225 年五月冒着瘴气强渡泸水', 不毛: '不生长草木，指贫瘠荒凉之地', 奖: '鼓励', 庶: '表示期望', 驽钝: '比喻才能平庸，自谦',
  攘除: '排除，铲除', 旧都: '原来的都城，指东汉都城洛阳', 斟酌损益: '斟酌利弊', 效: '功效', 告: '祭告', 兴德之言: '发扬圣德的话', 慢: '怠慢，疏忽', 彰其咎: '揭示他们的过失',
  咨诹善道: '询问治国的好方法（诹读 zōu）', 雅言: '正确合理的言论', 先帝遗诏: '刘备给后主的遗诏：“勿以恶小而为之，勿以善小而不为。”', 涕零: '流泪，落泪',
};
const POEMS = {
  cs1: { title: '出师表（第 1—5 段）', author: '［三国·蜀］诸葛亮 · 劝谏：三条建议', layout: 'h', lines: PARAS.slice(0, 5).flatMap((p) => p.lines), notes: NOTES },
  cs2: { title: '出师表（第 6—8 段）', author: '［三国·蜀］诸葛亮 · 追述往事，表明心志', layout: 'h', lines: PARAS.slice(5).flatMap((p) => p.lines), notes: NOTES },
  csR: { title: '出师表', author: '背诵', lines: PARAS.map((p) => ({ t: p.lines.map((l) => l.t).join('') })) },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* 十三次“先帝”：顶层生成（data-step 要在 deck.js 统计前就位），每次出现一个编号 */
(function buildXiandi() {
  const box = document.getElementById('xdText');
  let n = 0;
  box.innerHTML = PARAS.map((p, i) => `<p class="xd-p ${p.k === '叙' ? 'xu' : 'yi'}"><span class="xd-k">${i + 1} · ${p.k}</span>${
    p.lines.map((l) => l.t).join('').replace(/先帝/g, () => { n += 1; return `<mark class="xd" data-step="${n}"><sup>${n}</sup>先帝</mark>`; })}</p>`).join('');
  document.getElementById('xdCount').dataset.step = n + 1;
  document.getElementById('xdCount').querySelector('b').textContent = n;
}());

/* 断句：点一个字，在它后面加 / 再点去掉；“参考”显示课本式的划分 */
const CUTS = [
  '愚/以为/营中之事，悉/以咨之，必能/使行阵和睦，优劣/得所。',
  '先帝/不以臣卑鄙，猥/自枉屈，三顾臣/于草庐之中，咨臣/以当世之事，由是/感激，遂许/先帝/以驱驰。',
  '先帝/知臣谨慎，故/临崩/寄臣以大事也。受命/以来，夙夜/忧叹，恐/托付不效，以伤/先帝之明，故/五月渡泸，深入/不毛。',
];
function initCuts() {
  const box = document.getElementById('cutBox');
  box.innerHTML = CUTS.map((s, i) => {
    const chars = [];
    [...s].forEach((ch) => { if (ch === '/') chars[chars.length - 1].ans = true; else chars.push({ ch, ans: false }); });
    return `<p class="cut-line"><b>${i + 1}</b>${chars.map((c) => `<span class="ch${c.ans ? ' ans' : ''}">${c.ch}</span>`).join('')}</p>`;
  }).join('');
  box.addEventListener('click', (e) => { const c = e.target.closest('.ch'); if (c) c.classList.toggle('cut'); });
  document.getElementById('cutTools').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cut]');
    if (!b) return;
    if (b.dataset.cut === 'show') box.classList.toggle('show-ans');
    else box.querySelectorAll('.ch').forEach((c) => c.classList.remove('cut'));
  });
}

/* 三条建议：投票选“最重要” */
function initVote() {
  const wrap = document.getElementById('advice');
  wrap.addEventListener('click', (e) => {
    const b = e.target.closest('.vote');
    if (!b) return;
    const out = b.querySelector('b');
    out.textContent = Number(out.textContent) + 1;
  });
}

const WORDS = {
  古今异义: [
    { w: '开张', e: '诚宜开张圣听', a: '古：扩大　今：商店开始营业' },
    { w: '异同', e: '陟罚臧否，不宜异同', a: '古：偏义复词，只取“异”，不同　今：不同之处和相同之处' },
    { w: '痛恨', e: '未尝不叹息痛恨于桓、灵也', a: '古：痛心、遗憾　今：深切地憎恨' },
    { w: '卑鄙', e: '先帝不以臣卑鄙', a: '古：地位低微，见识短浅　今：品质恶劣' },
    { w: '感激', e: '由是感激', a: '古：感奋激发　今：衷心感谢' },
  ],
  成语: [
    { w: '妄自菲薄', e: '不宜妄自菲薄', a: '过分看轻自己，形容自卑' },
    { w: '作奸犯科', e: '若有作奸犯科及为忠善者', a: '为非作歹，触犯法纪' },
    { w: '危急存亡之秋', e: '此诚危急存亡之秋也', a: '形容关系到生存或灭亡的紧急关头' },
    { w: '三顾茅庐', e: '三顾臣于草庐之中', a: '比喻真心诚意，一再邀请' },
    { w: '计日而待', e: '可计日而待也', a: '可以数着日子等待，形容为期不远' },
    { w: '临表涕零', e: '临表涕零，不知所言', a: '面对奏表落泪，形容感激、动情' },
    { w: '深入不毛', e: '五月渡泸，深入不毛', a: '深入到荒凉贫瘠的地方' },
  ],
};
function initWords() {
  const tabs = document.getElementById('wdTabs');
  const grid = document.getElementById('wdGrid');
  const show = (k) => {
    tabs.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.k === k));
    grid.innerHTML = WORDS[k].map((x) => `<button type="button" class="wd-card"><b>${x.w}</b><span class="wd-e">${x.e}</span><span class="wd-a">${x.a}</span></button>`).join('');
  };
  tabs.innerHTML = Object.keys(WORDS).map((k) => `<button type="button" class="btn" data-k="${k}">${k}</button>`).join('');
  tabs.addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) show(b.dataset.k); });
  grid.addEventListener('click', (e) => { const c = e.target.closest('.wd-card'); if (c) c.classList.toggle('open'); });
  show('古今异义');
}

/* “叙 / 议”着色开关 */
function initXdTools() {
  document.getElementById('xdTools').addEventListener('click', (e) => {
    const b = e.target.closest('[data-xd]');
    if (!b) return;
    b.classList.toggle('solid', document.getElementById('xdText').classList.toggle(b.dataset.xd));
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    Poem.init();
    initXdTools();
    initCuts();
    initVote();
    initWords();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    // 先帝页：让最新标出的“先帝”滚到可见处
    const marks = slide.querySelectorAll('mark.xd.on');
    if (marks.length) marks[marks.length - 1].scrollIntoView({ block: 'nearest' });
  },
};
