'use strict';
/* 回忆我的母亲 · 本课数据与本课独有的“品质卡”“母子双轨时间轴”。通用互动见 ../shared/narrative.js */

/* 品质卡：q 为课文原句 */
const QUALITIES = [
  { k: '勤劳', icon: '锄', q: ['从我能记忆时起，总是天不亮就起床。', '母亲把饭煮了，还要种田，种菜，喂猪，养蚕，纺棉花。因为她身体高大结实，还能挑水挑粪。', '母亲生我前一分钟还在灶上煮饭。虽到老年，仍然热爱生产。'] },
  { k: '聪明能干', icon: '灶', q: ['我们用桐子榨油来点灯，吃的是豌豆饭、菜饭、红薯饭、杂粮饭……这类地主富人家看也不看的饭食，母亲却能做得使一家人吃起来有滋味。', '母亲亲手纺出线，请人织成布，染了颜色，我们叫它“家织布”。'] },
  { k: '宽厚仁慈', icon: '和', q: ['母亲在家庭里极能任劳任怨。她性格和蔼，没有打骂过我们，也没有同任何人吵过架。'] },
  { k: '俭朴', icon: '俭', q: ['她自己是很节省的。父亲有时吸点旱烟，喝点酒；母亲管束着我们，不允许我们染上一点。'] },
  { k: '同情穷苦，反感为富不仁', icon: '济', q: ['母亲同情贫苦的人……虽然自己不富裕，还周济和照顾比自己更穷的亲戚。', '母亲没有灰心，她对穷苦农民的同情和对为富不仁者的反感却更强烈了。'] },
  { k: '深明大义', icon: '义', q: ['我到云南后，从家信中知道，我母亲对我这一举动不但不反对，还给我许多慰勉。', '母亲知道我所做的事业，她期望着中国民族解放的成功。她知道我们党的困难，依然在家里过着勤苦的农妇生活。'] },
];

// 必须在 deck.js 统计分步之前生成
document.getElementById('badges').innerHTML = QUALITIES.map((x, i) =>
  `<button type="button" class="badge" data-step="${i + 1}" data-i="${i}"><i>${x.icon}</i><b>${x.k}</b></button>`).join('');

function showQuality(i) {
  const x = QUALITIES[i];
  document.querySelectorAll('.badge').forEach((b, k) => b.classList.toggle('cur', k === i));
  document.getElementById('caseBox').innerHTML = `<h3>${x.k}</h3>${x.q.map((s) => `<blockquote>${s}</blockquote>`).join('')}`;
}

/* 母子双轨：t 时间，m 母亲，w “我” */
const DUAL = [
  { t: '幼年', m: '天不亮就起床，煮饭、种田、喂猪、纺棉花', w: '四五岁帮忙，八九岁能挑能背、会种地' },
  { t: '乙未（1895）', m: '被地主逼着退佃，一家人连夜分散；母亲没有灰心', w: '启发了反抗压迫追求光明的思想' },
  { t: '庚子（1900）前后', m: '连年旱灾，仅仅吃些小菜叶、高粱', w: '亲眼见到许多不平事实' },
  { t: '1905', m: '和父亲节衣缩食，培养一个读书人', w: '考了科举，到顺庆和成都读书' },
  { t: '1908', m: '—', w: '在仪陇县办高等小学，一年回家两三次看母亲' },
  { t: '1909', m: '不但不反对，还给我许多慰勉', w: '瞒着母亲远走云南，参加新军和同盟会' },
  { t: '1919', m: '劳动惯了，离开土地就不舒服，还是回了家', w: '把父亲和母亲接出来' },
  { t: '大革命失败后', m: '靠那三十亩地独立支持一家人的生活', w: '加入中国共产党；和家庭完全隔绝' },
  { t: '抗战以后', m: '期望着中国民族解放的成功', w: '能和家里通信，寄回几百元钱和几张照片' },
  { t: '去年 · 现在', m: '“甚望见你一面”；仍不辍劳作，尤喜纺棉', w: '献身于民族抗战事业，竟未能报答母亲的希望' },
];

document.getElementById('dual').innerHTML = `<div class="du-lab"><span>母亲</span><span>“我”</span></div>` +
  DUAL.map((d, i) => `<div class="du" data-step="${i + 1}"><p class="du-m">${d.m}</p><b>${d.t}</b><p class="du-w">${d.w}</p></div>`).join('');

const PICKS = {
  yi: [
    { t: '勤劳的家庭是有规律有组织的。', ok: true, why: '议论：总括' },
    { t: '母亲同情贫苦的人——这是朴素的阶级意识', ok: true, why: '议论：评价' },
    { t: '但是灾难不因为中国农民的和平就不降临到他们身上。', ok: true, why: '议论：过渡' },
    { t: '只有这种知识，这种意志，才是世界上最可宝贵的财产。', ok: true, why: '议论：升华' },
    { t: '正是这千百万人创造了和创造着中国的历史。', ok: true, why: '议论：主旨' },
    { t: '母亲一共生了十三个儿女。', ok: false, why: '叙述事实' },
    { t: '我们用桐子榨油来点灯', ok: false, why: '叙述事实' },
    { t: '父亲就在回家途中死了。', ok: false, why: '叙述事实' },
  ],
};

const MOMENTS = [
  {
    name: '亲人的一双手', pic: 'zaotai',
    prompt: '写写家里某位亲人的一双手，以及这双手每天做的事。',
    hint: '用一串动词写他（她）做的事；最后一句朴素地说出你的感受。',
    example: '奶奶的手很粗，指节鼓鼓的。天不亮，这双手就开始忙：淘米，生火，剁菜，晾衣服。我写作业的时候，她在旁边择豆角，一根一根，掐头去尾。有一回我握了一下，像握着一块晒过太阳的树皮。那一刻我才明白，我们家的日子，是从这双手里一点点长出来的。',
  },
  {
    name: '一句家常话', pic: 'shanlu',
    prompt: '写亲人常说的一句家常话，和这句话背后的事。',
    hint: '像课文引用家信那样，原话照录；不加修饰，让话自己说话。',
    example: '每次我出门，妈妈都要说：“到了发个消息。”我嫌她啰嗦。去年我去外地参加比赛，到了宾馆一忙就忘了。晚上十点，手机响了，是一条很短的消息：“到了吗？”后面没有标点，我知道，她是一个字一个字按出来的。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    document.getElementById('badges').addEventListener('click', (e) => {
      const b = e.target.closest('.badge');
      if (b) showQuality(+b.dataset.i);
    });
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-card') && step >= 1) showQuality(Math.min(step, QUALITIES.length) - 1);
  },
};
