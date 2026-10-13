'use strict';
/* 邓稼先 · 本课数据与本课独有的“小标题结构导图”。通用互动见 ../shared/narrative.js */

/* 六个小标题：role 在文中的作用，key 关键句（课文原句），say 写了什么 */
const PARTS = [
  { t: '从“任人宰割”到“站起来了”', role: '时代背景', key: '那是中华民族任人宰割的时代，是有亡国灭种的危险的时代。今天，一个世纪以后，中国人民站起来了。', say: '先不写邓稼先，写一百年来民族命运的巨大转变，再引出“对这一转变做出了巨大贡献的”科学家。' },
  { t: '“两弹”元勋', role: '一生功绩', key: '“鞠躬尽瘁，死而后已”正好准确地描述了他的一生。', say: '用一串日期简述生平：留学、回国、研制原子弹和氢弹、至死不懈。' },
  { t: '邓稼先与奥本海默', role: '气质品格', key: '人们知道他没有私心，人们绝对相信他。', say: '与美国“原子弹之父”对比，写出他忠厚平实、真诚坦白、最有中国农民朴实气质的品格。' },
  { t: '民族感情？友情？', role: '友情与民族情', key: '是为了民族而自豪，还是为了稼先而感到骄傲？——我始终想不清楚。', say: '一封短信证实没有外国人参加中国原子弹工程，作者热泪满眶。' },
  { t: '“我不能走”', role: '献身精神', key: '人们劝他回去，他只说了一句话：“我不能走。”', say: '想象戈壁的艰苦危险，用《吊古战场文》和“五四”歌曲表达牵挂与敬仰。' },
  { t: '永恒的骄傲', role: '永恒评价', key: '如果稼先再次选择他的人生的话，他仍会走他已走过的道路。', say: '引用写给邓稼先夫人的电报与书信，对他的一生做出评价。' },
];
const NUMS = ['一', '二', '三', '四', '五', '六'];

// 必须在 deck.js 统计分步之前生成（deck.js 在加载时就数 data-step）
document.getElementById('mapGrid').innerHTML = PARTS.map((p, i) =>
  `<button type="button" class="map-node" data-step="${i + 1}" data-i="${i}"><i>${NUMS[i]}</i><b>${p.t}</b><small>${p.role}</small></button>`).join('');

function showPart(i) {
  const p = PARTS[i];
  document.querySelectorAll('.map-node').forEach((n, k) => n.classList.toggle('cur', k === i));
  document.getElementById('mapDetail').innerHTML = `<p class="md-no">第${NUMS[i]}部分 · ${p.role}</p><h3>${p.t}</h3>
    <p class="md-say">${p.say}</p><blockquote>${p.key}</blockquote>`;
}

/* 对比：归类 */
const SORT = [
  { s: '拔尖的人物，锋芒毕露', ok: ['奥本海默'], q: '才华外露，咄咄逼人' },
  { s: '最不要引人注目的人物', ok: ['邓稼先'], q: '低调，不求名' },
  { s: '在别人做学术报告时打断报告，走上讲台拿起粉笔', ok: ['奥本海默'], q: '使演讲者难堪' },
  { s: '忠厚平实，真诚坦白，从不骄人', ok: ['邓稼先'], q: '为人厚道' },
  { s: '没有小心眼儿，一生喜欢“纯”字所代表的品格', ok: ['邓稼先'], q: '纯粹、无私' },
  { s: '佩服他、仰慕他的人很多，不喜欢他的人也不少', ok: ['奥本海默'], q: '毁誉参半' },
  { s: '最有中国农民的朴实气质的人', ok: ['邓稼先'], q: '朴实' },
];

const MOMENTS = [
  {
    name: '写一位你敬佩的人', pic: 'zhuoan',
    prompt: '写一位你敬佩的人（老师、家人、邻居都可以），用一个典型细节表现他的精神。',
    hint: '学课文：一句话、一个动作就够了（“我不能走”）。最后加一句点睛的议论或抒情。',
    example: '晚上十点，教学楼只剩三楼一间办公室亮着灯。王老师把我们的作文本摊满一桌，红笔在每一页的空白处写得密密麻麻。保安叔叔来催，她头也不抬：“还有六本。”——她就是这样，把每一个学生都放在心上。',
  },
  {
    name: '用对比写人', pic: 'beiying',
    prompt: '选两个性格不同的人（比如两位同学），用对比突出其中一个人的特点。',
    hint: '像奥本海默与邓稼先：地位相当，性格相反；先写对方，再写他。',
    example: '小林上课总抢着发言，答错了也不脸红；小周却总是安安静静的，直到全班都卡住了，才轻轻举起手——一开口，就把难题讲透了。',
  },
  {
    name: '介绍一位“两弹一星”科学家', pic: 'xingkong',
    prompt: '积累拓展五：选一位“两弹一星”科学家，写一段 150 字左右的介绍词。',
    hint: '一句话写功绩，一个故事写品格，一句话写评价。',
    example: '于敏，核物理学家，长期领导并参加核武器的研究、设计工作，获“两弹一星”功勋奖章和国家最高科技奖。他曾和邓稼先联合署名，写下关于我国核武器发展的建议书。这样的人，默默无闻几十年，却把力量留给了国家。',
  },
];

function initShort() {
  const boxes = [document.getElementById('shortBox'), document.getElementById('shortBox2')];
  const split = document.getElementById('splitBtn');
  const merge = document.getElementById('mergeBtn');
  const set = (merged) => {
    boxes.forEach((b) => b.classList.toggle('merged', merged));
    split.classList.toggle('solid', !merged);
    merge.classList.toggle('solid', merged);
  };
  split.addEventListener('click', () => set(false));
  merge.addEventListener('click', () => set(true));
}

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['奥本海默', '邓稼先'], moments: MOMENTS });
    document.getElementById('mapGrid').addEventListener('click', (e) => {
      const n = e.target.closest('.map-node');
      if (n) showPart(+n.dataset.i);
    });
    initShort();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-map') && step >= 1) showPart(Math.min(step, PARTS.length) - 1);
  },
};
