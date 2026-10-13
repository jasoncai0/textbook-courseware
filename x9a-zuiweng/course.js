'use strict';
/* 醉翁亭记 · 本课数据。诗文模板（横排 + 译文）见 ../shared/poem.js；
 * 本课独有：“乐”字线索串联四种乐 + 21 个“也”字节奏朗读（逐句点亮、去掉“也”对比语气） */

const NOTES = {
  环滁: '环绕着滁州城（滁读 chú）', 林壑: '树林和山谷', 蔚然: '茂盛的样子', 琅琊: '琅琊山（读 láng yá）', 峰回路转: '山势回环，路也跟着转弯',
  翼然: '（亭角翘起）像鸟张开翅膀一样', 临: '居高面下', 太守自谓: '太守用自己的别号（醉翁）来命名', 辄: '就', 意: '意趣，情趣',
  得之心而寓之酒: '领会于心间，寄托在酒上', 林霏开: '树林里的雾气散开。霏，弥漫的云气', 云归而岩穴暝: '云雾聚拢，山谷就显得昏暗了',
  晦明变化: '或暗或明，变化不一', 野芳发而幽香: '野花开放，有一股清幽的香味。芳，花', 佳木秀而繁阴: '好的树木枝叶繁茂，形成浓密的绿荫。秀，茂盛',
  风霜高洁: '天高气爽，霜色洁白', 负者: '背着东西的人', 休于树: '在树下休息', 伛偻提携: '老老少少的行人。伛偻指老人，提携指儿童',
  洌: '清（读 liè）', 山肴野蔌: '野味野菜（蔌读 sù）', 陈: '陈列，摆开', 非丝非竹: '不在于音乐。丝，弦乐器；竹，管乐器', 射: '投壶，宴饮时的一种游戏',
  弈: '下棋', 觥筹交错: '酒杯和酒筹交互错杂', 苍颜: '苍老的容颜', 颓然乎其间: '醉倒在众人中间', 已而: '不久', 阴翳: '形容枝叶茂密成荫',
  鸣声上下: '禽鸟在高处低处鸣叫', 乐其乐: '以游人的快乐为快乐', 述以文: '用文章记述', 谓: '为，是', 庐陵: '庐陵郡，就是吉州',
};

const LINES = [
  { t: '环滁皆山也。', r: '环滁/皆山也。', y: '环绕着滁州城的都是山。' },
  { t: '其西南诸峰，林壑尤美，望之蔚然而深秀者，琅琊也。', r: '其/西南/诸峰，林壑/尤美，望之/蔚然/而深秀者，琅琊也。', y: '它西南面的各个山峰，树林和山谷格外优美。一眼望去，树木茂盛又幽深秀丽的，是琅琊山。' },
  { t: '山行六七里，渐闻水声潺潺，而泻出于两峰之间者，酿泉也。', r: '山行/六七里，渐闻/水声/潺潺，而泻出/于两峰/之间者，酿泉也。', y: '沿着山路走六七里，渐渐听到潺潺的水声，从两座山峰之间倾泻出来的，是酿泉。' },
  { t: '峰回路转，有亭翼然临于泉上者，醉翁亭也。', r: '峰回/路转，有亭/翼然/临于/泉上者，醉翁亭也。', y: '山势回环，路也跟着转弯，有一座亭子像鸟张开翅膀一样，高踞于泉水之上，这就是醉翁亭。' },
  { t: '作亭者谁？山之僧智仙也。名之者谁？太守自谓也。', r: '作亭者/谁？山之僧/智仙也。名之者/谁？太守/自谓也。', y: '建造亭子的是谁？是山里的和尚智仙。给它命名的是谁？是太守用自己的别号来命名的。' },
  { t: '太守与客来饮于此，饮少辄醉，而年又最高，故自号曰醉翁也。', r: '太守/与客/来饮/于此，饮少/辄醉，而/年又/最高，故/自号曰/醉翁也。', y: '太守和宾客来这里饮酒，喝一点就醉了，而且年纪又最大，所以给自己取了个别号叫“醉翁”。' },
  { t: '醉翁之意不在酒，在乎山水之间也。山水之乐，得之心而寓之酒也。', r: '醉翁之意/不在酒，在乎/山水之间也。山水之乐，得之心/而寓之酒也。', y: '醉翁的情趣不在于喝酒，而在于山水之间。欣赏山水的乐趣，领会在心里，寄托在酒上。' },
  { t: '若夫日出而林霏开，云归而岩穴暝，晦明变化者，山间之朝暮也。', r: '若夫/日出/而林霏开，云归/而岩穴暝，晦明/变化者，山间/之朝暮也。', y: '太阳出来，树林里的雾气散开；云雾聚拢，山谷就显得昏暗；或明或暗，变化不一，这就是山间的早晨和傍晚。' },
  { t: '野芳发而幽香，佳木秀而繁阴，风霜高洁，水落而石出者，山间之四时也。', r: '野芳发/而幽香，佳木秀/而繁阴，风霜/高洁，水落/而石出者，山间/之四时也。', y: '野花开放，有一股清幽的香味；好的树木枝叶繁茂，形成浓密的绿荫；天高气爽，霜色洁白；水位降低，石头露出，这就是山间的四季。' },
  { t: '朝而往，暮而归，四时之景不同，而乐亦无穷也。', r: '朝/而往，暮/而归，四时之景/不同，而乐/亦无穷也。', y: '早晨进山，傍晚归来，四季的景色不同，乐趣也是无穷无尽的。' },
  { t: '至于负者歌于途，行者休于树，前者呼，后者应，伛偻提携，往来而不绝者，滁人游也。', r: '至于/负者/歌于途，行者/休于树，前者呼，后者应，伛偻/提携，往来/而不绝者，滁人/游也。', y: '至于背着东西的人在路上唱歌，走路的人在树下休息，前面的人呼喊，后面的人应答，老老少少来来往往不断，这是滁州人在出游。' },
  { t: '临溪而渔，溪深而鱼肥，酿泉为酒，泉香而酒洌，山肴野蔌，杂然而前陈者，太守宴也。', r: '临溪/而渔，溪深/而鱼肥，酿泉/为酒，泉香/而酒洌，山肴/野蔌，杂然/而前陈者，太守/宴也。', y: '到溪边钓鱼，溪水深，鱼儿肥；用酿泉的水酿酒，泉水香，酒也清；野味野菜，横七竖八地摆在面前，这是太守在宴请宾客。' },
  { t: '宴酣之乐，非丝非竹，射者中，弈者胜，觥筹交错，起坐而喧哗者，众宾欢也。', r: '宴酣/之乐，非丝/非竹，射者/中，弈者/胜，觥筹/交错，起坐/而喧哗者，众宾/欢也。', y: '宴中欢饮的乐趣，不在于音乐，投壶的投中了，下棋的赢了，酒杯和酒筹交互错杂，人们时起时坐，大声喧闹，这是宾客们在尽情欢乐。' },
  { t: '苍颜白发，颓然乎其间者，太守醉也。', r: '苍颜/白发，颓然/乎其间者，太守/醉也。', y: '容颜苍老，头发花白，醉醺醺地倒在众人中间的，是喝醉了的太守。' },
  { t: '已而夕阳在山，人影散乱，太守归而宾客从也。', r: '已而/夕阳/在山，人影/散乱，太守/归而/宾客/从也。', y: '不久，夕阳落到山头，人影散乱，太守回去，宾客们跟随着。' },
  { t: '树林阴翳，鸣声上下，游人去而禽鸟乐也。', r: '树林/阴翳，鸣声/上下，游人/去而/禽鸟/乐也。', y: '树林枝叶茂密成荫，鸟儿在高处低处鸣叫，这是游人离开后鸟儿在欢乐。' },
  { t: '然而禽鸟知山林之乐，而不知人之乐；人知从太守游而乐，而不知太守之乐其乐也。', r: '然而/禽鸟/知/山林之乐，而/不知/人之乐；人/知/从太守游/而乐，而/不知/太守/之乐其乐也。', y: '然而鸟儿只知道山林的乐趣，却不知道人的乐趣；人们只知道跟随太守游玩的乐趣，却不知道太守以他们的快乐为快乐。' },
  { t: '醉能同其乐，醒能述以文者，太守也。太守谓谁？庐陵欧阳修也。', r: '醉能/同其乐，醒能/述以文者，太守也。太守/谓谁？庐陵/欧阳修也。', y: '醉了能够同大家一起欢乐，醒来能够用文章记述这件事的人，是太守。太守是谁？是庐陵人欧阳修。' },
];

const POEMS = {
  zwt: { title: '醉翁亭记', author: '欧阳修', layout: 'h', notes: NOTES, lines: LINES },
  zwtR: { title: '醉翁亭记', author: '欧阳修', lines: LINES },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* 21 个“也”：从原文按句号、问号切出以“也”结尾的句子 */
const YE_SENTENCES = LINES.map((l) => l.t).join('')
  .split(/(?<=[。？；])/)
  .flatMap((s) => s.split(/(?<=也)(?=[^。？；])/))
  .map((s) => s.replace(/[。？；]$/, ''))
  .filter((s) => s.endsWith('也'));

/* 四种乐 */
const LE = [
  { k: 'shan', name: '山水之乐', pic: 'ting', lines: ['醉翁之意不在酒，在乎山水之间也。', '山水之乐，得之心而寓之酒也。', '四时之景不同，而乐亦无穷也。'], say: '乐在朝暮、四时变化无穷的山水之美。' },
  { k: 'yan', name: '宴游之乐', pic: 'yan', lines: ['负者歌于途……滁人游也。', '射者中，弈者胜，觥筹交错，起坐而喧哗者，众宾欢也。', '苍颜白发，颓然乎其间者，太守醉也。'], say: '滁人游、太守宴、众宾欢、太守醉——百姓安乐，宾主尽欢。' },
  { k: 'qin', name: '禽鸟之乐', pic: 'xiyang', lines: ['树林阴翳，鸣声上下，游人去而禽鸟乐也。', '然而禽鸟知山林之乐，而不知人之乐。'], say: '禽鸟只知山林之乐——一层一层往上推，引出人之乐、太守之乐。' },
  { k: 'min', name: '与民同乐', pic: 'youren', lines: ['人知从太守游而乐，而不知太守之乐其乐也。', '醉能同其乐，醒能述以文者，太守也。'], say: '太守之乐，是以百姓之乐为乐——这才是全文的落脚点。' },
];

const CLUES = [
  { q: '醉翁之意不在酒', a: '文中：醉翁的情趣不在喝酒，而在山水之间。今义：比喻本意不在此而在别的方面（多含贬义）。' },
  { q: '峰回路转', a: '文中：山势回环，路也跟着转弯。今义：也比喻事情经过曲折后出现新的转机。' },
  { q: '水落石出', a: '文中：水位降低，石头露出来，写山间冬景。今义：比喻事情的真相完全显露出来。' },
  { q: '觥筹交错', a: '文中：酒杯和酒筹交互错杂。今义：形容许多人相聚饮酒的热闹场面，语义基本未变。' },
  { q: '心旷神怡（岳阳楼记）', a: '文中：登楼看到明丽春景时心胸开阔、精神愉快。今义：多指被美景打动后的心情，语义基本未变。' },
  { q: '百废具兴（岳阳楼记）', a: '文中：许多荒废的事业都兴办起来了。今写作“百废俱兴”，语义基本未变。' },
];

const WORDS = [
  { k: '虚词 · 而', w: '而（表修饰）', a: '连接状语和中心语。', e: '朝而往，暮而归' },
  { k: '虚词 · 而', w: '而（表并列）', a: '并且，又。', e: '溪深而鱼肥／泉香而酒洌' },
  { k: '虚词 · 而', w: '而（表转折）', a: '却，但是。', e: '而不知人之乐' },
  { k: '虚词 · 而', w: '而（表顺承）', a: '接着，就。', e: '日出而林霏开／太守归而宾客从也' },
  { k: '虚词 · 者', w: '者', a: '……的人（负者、行者）；……的样子/地方（深秀者、前陈者），常与“也”组成判断句。', e: '负者歌于途／望之蔚然而深秀者，琅琊也' },
  { k: '虚词 · 之', w: '之', a: '代词，指代琅琊山（望之）；结构助词，的（山水之乐）。', e: '望之蔚然／山水之乐' },
  { k: '实词', w: '秀', a: '茂盛。', e: '佳木秀而繁阴' },
  { k: '实词', w: '归', a: '聚拢（云归）；回去（太守归）。', e: '云归而岩穴暝／太守归而宾客从也' },
  { k: '实词', w: '临', a: '居高面下（临于泉上）；靠近（临溪而渔）。', e: '有亭翼然临于泉上／临溪而渔' },
  { k: '实词', w: '谓', a: '命名（太守自谓）；为，是（太守谓谁）。', e: '太守自谓也／太守谓谁' },
];

/* ============ 乐字线索 ============ */
function showLe(slide, i) {
  const le = LE[i];
  slide.querySelectorAll('.le-node').forEach((n, k) => n.classList.toggle('sel', k === i));
  const view = slide.querySelector('#leView');
  view.querySelector('.le-pic').dataset.bg = `assets/${le.pic}.jpg`;
  view.querySelector('.le-pic').style.backgroundImage = `url(assets/${le.pic}.jpg)`;
  view.querySelector('h3').textContent = le.name;
  view.querySelector('.le-lines').innerHTML = le.lines.map((l) => `<p>${l.replace(/乐/g, '<b>乐</b>')}</p>`).join('');
  view.querySelector('.le-say').textContent = le.say;
}

function initLe() {
  const slide = document.querySelector('.s-le');
  slide.querySelectorAll('.le-node').forEach((n, i) => n.addEventListener('click', () => showLe(slide, i)));
  showLe(slide, 0);
}

function updateLe(slide, step) {
  if (!slide.classList.contains('s-le') || step < 1 || step > LE.length) return;
  showLe(slide, step - 1);
}

/* ============ 21 个“也” ============ */
let yeTimer = null;
function stopYe(box) {
  clearInterval(yeTimer);
  yeTimer = null;
  box.querySelectorAll('.ye').forEach((s) => s.classList.remove('beat'));
}

function initYe() {
  const box = document.getElementById('yeBox');
  const list = box.querySelector('.ye-list');
  list.innerHTML = YE_SENTENCES.map((s, i) => `<span class="ye" data-i="${i}"><i>${i + 1}</i>${s.slice(0, -1).replace(/者/g, '<u>者</u>')}<b>也</b></span>`).join('');
  const count = box.querySelector('.ye-count b');
  count.textContent = 0;
  box.querySelector('#yePlay').addEventListener('click', () => {
    if (yeTimer) { stopYe(box); return; }
    let i = 0;
    const tick = () => {
      box.querySelectorAll('.ye').forEach((s, k) => { s.classList.toggle('beat', k === i); s.classList.toggle('done', k <= i); });
      count.textContent = i + 1;
      i += 1;
      if (i >= YE_SENTENCES.length) { clearInterval(yeTimer); yeTimer = null; }
    };
    tick();
    yeTimer = setInterval(tick, 1800);
  });
  box.querySelector('#yeDrop').addEventListener('click', (e) => {
    const on = box.classList.toggle('no-ye');
    e.target.textContent = on ? '把“也”放回去' : '去掉“也”读一读';
  });
  box.querySelector('#yeZhe').addEventListener('click', () => box.classList.toggle('show-zhe'));
  list.addEventListener('click', (e) => {
    const s = e.target.closest('.ye');
    if (s) s.classList.toggle('done');
  });
}

function initWords() {
  const box = document.getElementById('words');
  box.innerHTML = WORDS.map((w) => `<button type="button" class="wcard"><small>${w.k}</small><b>${w.w}</b><span class="wa">${w.a}<em>${w.e}</em></span></button>`).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.wcard');
    if (c) c.classList.toggle('open');
  });
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['成语', '文中义 → 今义'] });
    Poem.init();
    initLe();
    initYe();
    initWords();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateLe(slide, step);
    if (!slide.querySelector('#yeBox')) stopYe(document.getElementById('yeBox'));
  },
};
