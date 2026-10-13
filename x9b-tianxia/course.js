'use strict';
/* 天下第一楼（节选）· 本课互动。本课独有：东家—柜上—外部三方冲突关系图 + 点台词看潜台词 + 衰落原因层层追问 */

/* ---------- 人物关系图：点人物看名片 ---------- */
const PEOPLE = {
  卢孟实: ['掌柜（“西”）', '精明强干，咬牙要强；治店严，待伙计厚；心里窝着父亲受辱的一口气', '“做饭庄子的就不能置产业？……我还想买济南府，买前门楼子哪！”'],
  王子西: ['二掌柜，推荐卢孟实当掌柜', '圆滑、怯懦，“多一事不如少一事”', '“（怯懦地）是，我……”'],
  修鼎新: ['瞭高儿兼账房，曾是克五的清客', '见过世面，看得透，说话一针见血', '“架不住，一个人干，八个人拆。”'],
  常贵: ['堂头，“有批老主顾不见常贵不吃饭”', '忠厚善良，同情穷伙计，身不由己', '“那边伙计也怪可怜的，跟掌柜的说说，怎么搭济一下。”'],
  罗大头: ['烤鸭师傅，福聚德“一根杆撑着”', '技艺精湛，居功自傲，脾气暴躁，也耿直有骨气', '“我一撂杆不干，福聚德就得关门。”'],
  玉雏儿: ['卢孟实的相好，“顶半个掌柜的”', '能干，护着卢孟实', '“他辛辛苦苦……就落了这名声，就太冤枉人了。”'],
  唐茂昌: ['老东家大儿子（“东”），好唱戏', '只会伸手要钱，听信闲话', '“你告诉他们，这儿是老唐家的买卖。把钱柜打开。”'],
  唐茂盛: ['老东家二儿子（“东”），好习武，管天津分号', '要钱又要人，专挖墙脚', '“分号缺个好堂头，我要常贵。”'],
  福子: ['唐茂昌的跟包', '狗仗人势', '“额外的？这儿全是大爷的！”'],
  克五: ['某王爷的后代，曾是著名食客，今在“闻香队”', '落魄无赖，借势讹诈', '“送我只鸭子咱们了事，要不然……”'],
  侦缉队: ['（未出场）主管侦查缉捕的机构', '“惹不起的祖宗”', '“不买账，看来想敲咱们一笔。”'],
};
function initPeople() {
  const card = document.getElementById('pCard');
  document.getElementById('rel').addEventListener('click', (e) => {
    const b = e.target.closest('.pp');
    if (!b) return;
    const [who, trait, line] = PEOPLE[b.dataset.p];
    document.querySelectorAll('#rel .pp').forEach((x) => x.classList.toggle('sel', x === b));
    card.innerHTML = `<b>${b.dataset.p}</b><span>${who}</span><em>${trait}</em><q>${line}</q>`;
  });
}

/* ---------- 冲突图表：点空格填答案 ---------- */
function initBlanks() {
  document.querySelectorAll('.cf-blank').forEach((b) => b.addEventListener('click', () => b.classList.add('open')));
}

/* ---------- 潜台词：点台词卡 ---------- */
function initSub() {
  document.getElementById('subCards').addEventListener('click', (e) => {
    const c = e.target.closest('.sub');
    if (c) c.classList.toggle('open');
  });
}

/* ---------- 京味词语 ---------- */
const JING = {
  '过了正五过初六': '老北京年俗：正月初五“破五”，初六店铺开张，年就算过完了',
  搭济: '帮人脱离困难', 拾掇: '收拾、整治', 拿糖: '拿乔，装模作样、故意为难，抬高身价', 打镲: '胡扯，胡搅',
  吃主儿: '讲究吃、懂吃的老主顾', 人五人六: '装模作样、摆架子', 不开眼: '没见过世面', 怵三分: '有点害怕',
  横插一杠子: '半路上插进来干预', 撂杆: '撂下烤杆，指甩手不干',
};
function initJing() {
  const out = document.getElementById('jingOut');
  const box = document.getElementById('jingWords');
  box.innerHTML = Object.keys(JING).map((k) => `<button type="button" class="jw">${k}</button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.jw');
    if (!b) return;
    box.querySelectorAll('.jw').forEach((x) => x.classList.toggle('sel', x === b));
    out.innerHTML = `<b>${b.textContent}</b>${JING[b.textContent]}`;
  });
}

/* 读读写写里四字词的卡片加宽（pinyin.js 已先渲染好卡片） */
document.querySelectorAll('.zy-write').forEach((c) => { if (c.querySelector('ruby').firstChild.textContent.length > 3) c.classList.add('zy-long'); });

window.LESSON = {
  init() {
    Narrative.init({});
    initPeople();
    initBlanks();
    initSub();
    initJing();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
