'use strict';
/* 诗词五首 · 本课数据与互动。诗文模板见 ../shared/poem.js；五首五种呈现：见/望换字、情感阶梯、色板、假如分支、梦游路线 */

const POEMS = {
  yinjiu: {
    title: '饮酒（其五）', author: '［东晋］陶渊明',
    lines: [
      { t: '结庐在人境，', r: '结庐/在人境，', f: '1.1 60% 60%' }, { t: '而无车马喧。', r: '而无/车马喧。', f: '1.1 60% 60%' },
      { t: '问君何能尔？', r: '问君/何能尔？' }, { t: '心远地自偏。', r: '心远/地自偏。' },
      { t: '采菊东篱下，', r: '采菊/东篱下，', f: '1.35 35% 70%' }, { t: '悠然见南山。', r: '悠然/见南山。', f: '1.2 60% 35%' },
      { t: '山气日夕佳，', r: '山气/日夕佳，', f: '1.15 60% 30%' }, { t: '飞鸟相与还。', r: '飞鸟/相与还。', f: '1.25 55% 25%' },
      { t: '此中有真意，', r: '此中/有真意，' }, { t: '欲辨已忘言。', r: '欲辨/已忘言。', f: '1.04 50% 50%' },
    ],
    notes: { 结庐: '建造房舍。庐，简陋的房屋', 人境: '喧嚣扰攘的尘世', 尔: '如此，这样', 悠然: '闲适淡泊的样子', 山气: '山间的云气', 日夕: '傍晚', 忘言: '欲辨已忘言：想要分辨清楚，却已忘了怎样表达' },
  },
  chunwang: {
    title: '春望', author: '［唐］杜甫',
    lines: [
      { t: '国破山河在，', r: '国破/山河在，', f: '1.1 50% 40%' }, { t: '城春草木深。', r: '城春/草木深。', f: '1.3 45% 65%' },
      { t: '感时花溅泪，', r: '感时/花溅泪，', f: '1.4 30% 60%' }, { t: '恨别鸟惊心。', r: '恨别/鸟惊心。', f: '1.35 60% 30%' },
      { t: '烽火连三月，', r: '烽火/连三月，', f: '1.2 80% 40%' }, { t: '家书抵万金。', r: '家书/抵万金。' },
      { t: '白头搔更短，', r: '白头/搔更短，', f: '1.3 55% 45%' }, { t: '浑欲不胜簪。', r: '浑欲/不胜簪。', f: '1.05 50% 50%' },
    ],
    notes: { 城: '指长安城，当时被叛军占领', 烽火: '古时边防报警的烟火，这里借指战事', 浑: '简直', 不胜簪: '插不住簪子。胜，能够承受；簪，别住发髻的长条状首饰' },
  },
  yanmen: {
    title: '雁门太守行', author: '［唐］李贺',
    lines: [{ t: '黑云压城城欲摧，' }, { t: '甲光向日金鳞开。' }, { t: '角声满天秋色里，' }, { t: '塞上燕脂凝夜紫。' },
      { t: '半卷红旗临易水，' }, { t: '霜重鼓寒声不起。' }, { t: '报君黄金台上意，' }, { t: '提携玉龙为君死。' }],
  },
  chibi: {
    title: '赤壁', author: '［唐］杜牧',
    lines: [{ t: '折戟沉沙铁未销，' }, { t: '自将磨洗认前朝。' }, { t: '东风不与周郎便，' }, { t: '铜雀春深锁二乔。' }],
  },
  yujiaao: {
    title: '渔家傲', author: '［宋］李清照',
    lines: [{ t: '天接云涛连晓雾，星河欲转千帆舞。' }, { t: '仿佛梦魂归帝所，闻天语，殷勤问我归何处。' },
      { t: '我报路长嗟日暮，学诗谩有惊人句。' }, { t: '九万里风鹏正举。风休住，蓬舟吹取三山去！' }],
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* ---------- 饮酒：见 / 望 ---------- */
function initJian() {
  const w = document.getElementById('jianW');
  const btn = document.getElementById('jianBtn');
  const res = document.getElementById('jianRes');
  const MSG = {
    见: '“<b>见</b>”：采菊时无意间抬头，南山自然地映入眼帘——人闲、心闲，景也闲，悠然自得。',
    望: '“<b>望</b>”：特意抬头远望——有了“要去看”的念头，悠然的神气就“索然”了。',
  };
  const set = (ch) => {
    w.textContent = ch;
    w.classList.toggle('wang', ch === '望');
    btn.textContent = ch === '见' ? '换成“望”试试' : '换回“见”';
    res.innerHTML = MSG[ch];
  };
  btn.addEventListener('click', () => set(w.textContent === '见' ? '望' : '见'));
  w.addEventListener('click', () => btn.click());
  set('见');
}

/* ---------- 雁门太守行：色板 ---------- */
const COLORS = [
  { k: '黑', c: '#2b2b2f', w: '黑云', d: '黑云压城，乌云翻滚，像要把城墙压塌——敌军压境的气势。' },
  { k: '金', c: '#e0b23a', w: '金鳞', d: '云缝里射下阳光，守城将士的铠甲闪闪发光，像金色的鱼鳞——黑与金对照，战斗一触即发。' },
  { k: '秋', c: '#b98a4a', w: '秋色', d: '号角声响彻秋天的原野，苍凉悲壮。' },
  { k: '燕脂·紫', c: '#7a2a4a', w: '燕脂', d: '塞上泥土在暮色中凝成深紫——注释说指战场血迹。用颜色暗示战斗的惨烈，不着一个“血”字。' },
  { k: '红', c: '#c0392b', w: '红旗', d: '半卷红旗，悄悄逼近易水——援军夜袭，旗帜半卷以减少风阻、保持隐蔽。' },
  { k: '霜白', c: '#e8eef2', w: '霜重', d: '寒霜浓重，鼓声沉闷——环境艰苦，气氛悲壮。' },
  { k: '黄金', c: '#d4a017', w: '黄金台', d: '用燕昭王筑黄金台招贤的典故：为了报答君王的厚爱。' },
  { k: '玉', c: '#a8d5c2', w: '玉龙', d: '手提宝剑，甘愿为君战死——全诗在报国的誓言中结束。' },
];
function initColor() {
  const sw = document.getElementById('swatches');
  const poem = document.getElementById('ymPoem');
  const info = document.getElementById('colorInfo');
  let html = POEMS.yanmen.lines.map((l) => `<p>${l.t}</p>`).join('');
  COLORS.forEach((c, i) => { html = html.replace(c.w, `<span class="cw" data-i="${i}" style="--c:${c.c}">${c.w}</span>`); });
  poem.innerHTML = html;
  sw.innerHTML = COLORS.map((c, i) => `<button type="button" class="sw" data-i="${i}" style="--c:${c.c}"><i></i>${c.k}</button>`).join('');
  const pick = (i) => {
    document.querySelectorAll('.s-color [data-i]').forEach((x) => x.classList.toggle('sel', +x.dataset.i === i));
    info.innerHTML = `<b>${COLORS[i].w}</b>：${COLORS[i].d}`;
  };
  document.querySelector('.s-color').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) pick(+b.dataset.i); });
}

function initReciteTabs() {
  const boxes = [...document.querySelectorAll('.s-recite .recite')];
  document.getElementById('rcTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]');
    if (!b) return;
    boxes.forEach((x, i) => { x.hidden = i !== +b.dataset.r; });
    document.querySelectorAll('#rcTabs .btn').forEach((x) => x.classList.toggle('solid', x === b));
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    Poem.init();
    initJian();
    initColor();
    initReciteTabs();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
