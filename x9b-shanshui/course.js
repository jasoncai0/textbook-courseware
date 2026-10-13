'use strict';
/* 山水画的意境 · 本课数据。翻卡、读与写见 ../shared/narrative.js；
 * 本课独有：“意境＝景＋情”算式拆解 + 意匠试验台（留白滑块 / 夸张山势 / 点景，SVG 山水） */

const CLUES = [
  { q: '故人西辞黄鹤楼，烟花三月下扬州。<br>孤帆远影碧空尽，唯见长江天际流。', a: '举例说明“意境就是景与情的结合”：后两句完全写景，却让人体会到深厚的友情——情寓于景。' },
  { q: '《十六字令三首》《沁园春·雪》', a: '说明写景就是写情：每一字都是说山，却歌颂了人；“北国风光”几句体现诗人胸怀和思想的崇高境界。' },
  { q: '缘物寄情', a: '用古人的话概括观点：借景物寄托感情——写景就是写情。凝练、有说服力。' },
  { q: '全马在胸 · 胸有成竹', a: '说明画家必须对所画对象非常熟悉、有整体把握，才能把握对象的精神实质。' },
  { q: '峨眉天下秀，夔门天下险，<br>剑阁天下雄，青城天下幽。', a: '用四川俗语说明每处风景都有各自不同的特色，如同人的性格差异——画家要抓住特色。' },
  { q: '意匠惨淡经营中<br>语不惊人死不休', a: '借杜甫的诗句说明诗人、画家要苦心经营意匠，才能找到打动人心的艺术语言。' },
];

const MOMENTS = [
  {
    name: '赏析古诗', pic: 'gufan',
    prompt: '积累拓展四：运用课文中有关意境的论述，选择一首自己喜欢的古诗词进行赏析。',
    hint: '三步：①找出诗中的景（选了哪几样景物）；②说说藏在景里的情；③景与情怎样结合成意境。',
    example: '马致远《天净沙·秋思》：枯藤、老树、昏鸦、小桥、流水、人家、古道、西风、瘦马——全是景，没有一个“愁”字。可“夕阳西下，断肠人在天涯”一出，满纸景物都染上了游子的孤寂。景是秋天的萧瑟，情是天涯的思乡，二者融为一体，这就是意境。',
  },
  {
    name: '画理与写作', pic: 'songshu',
    prompt: '思考探究三：从下面四条山水画创作心得中选一条，说说它对写作的启示。（熟悉对象 / 夸张渲染 / 真挚感情 / 不重复别人）',
    hint: '先说这条心得的意思，再联系一次自己的写作经历或一篇作文来谈。',
    example: '“对客观对象不熟悉或不太熟悉，就一定画不出好画。”写作也一样。我写《我的奶奶》，第一稿只有“勤劳、善良”几个词，空洞无物；后来我留心观察奶奶择菜、缝扣子、数药片的样子，写出了她手指的颤动和眯起的眼睛，文章才真正活了起来。',
  },
];

/* ============ 意匠试验台 ============ */
const LIUBAI_TIPS = [
  [25, '满纸是墨：山、天、水挤在一起，没有呼吸——像“地理图解”，没有画意。'],
  [65, '留出一些空白：云雾在山腰流动，山有了远近，画开始“透气”了。'],
  [101, '大片留白：云、水、天都由空白来表现——“空白”处正好安放画外之意，让看画的人自己去想。'],
];

function setLiubai(slide, v) {
  const paint = slide.querySelector('#ssPaint');
  paint.querySelector('.ss-mist').style.opacity = (v / 100).toFixed(2);
  paint.querySelector('.ss-fill').style.opacity = (0.75 * (1 - v / 100)).toFixed(2);
  slide.querySelector('#ssVal').textContent = `${v}%`;
  slide.querySelector('#ssTip1').innerHTML = `<b>留白 ${v}%：</b>${LIUBAI_TIPS.find(([max]) => v < max)[1]}`;
}

function initLiubai() {
  const slide = document.querySelector('.s-liubai');
  const range = slide.querySelector('#ssRange');
  range.addEventListener('input', () => setLiubai(slide, +range.value));
  const toggle = (id, cls) => {
    const btn = slide.querySelector(`#${id}`);
    btn.addEventListener('click', () => btn.classList.toggle('solid', slide.querySelector('#ssPaint').classList.toggle(cls)));
  };
  toggle('ssExag', 'exag');
  toggle('ssDian', 'dian');
  setLiubai(slide, +range.value);
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['引用', '作用'], moments: MOMENTS });
    initLiubai();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    // 算式页的视频不是 .scene-bg，手动播放 / 暂停
    document.querySelectorAll('.ss-vid').forEach((v) => {
      if (slide.contains(v) && v.src) v.play().catch(() => {});
      else v.pause();
    });
  },
};
