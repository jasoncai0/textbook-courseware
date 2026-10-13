'use strict';
/* 创造宣言 · 本课数据与互动：论证线索、五种借口辩论台、东山樵夫寓意卡、读写迁移。通用部分见 ../shared/narrative.js */

/* 论证线索每一站的关键句（课本原文） */
const PATH = [
  '教育者不是造神，不是造石像，不是造爱人。他们所要创造的是真善美的活人。',
  '所以处处是创造之地，天天是创造之时，人人是创造之人，让我们至少走两步退一步，向着创造之路迈进吧。',
  '像屋檐水一样，一点一滴，滴穿阶沿石。点滴的创造固不如整体的创造，但不要轻视点滴的创造而不为，呆望着大创造从天而降。',
  '创造之神！你回来呀！只有你回来，才能保证参天大树之长成。',
  '只要有一滴汗，一滴血，一滴热情，便是创造之神所爱住的行宫，就能开创造之花，结创造之果，繁殖创造之森林。',
];

function initPath() {
  const detail = document.getElementById('ptDetail');
  document.getElementById('path').addEventListener('click', (e) => {
    const b = e.target.closest('.pt');
    if (!b) return;
    const i = [...b.parentElement.children].indexOf(b);
    document.querySelectorAll('.pt').forEach((x) => x.classList.toggle('cur', x === b));
    detail.textContent = PATH[i];
  });
}

/* 五种借口：con 借口原文，kind 客观 / 主观，evs 反驳的事例，verdict 一针见血的结论（均为课本原文） */
const ROUNDS = [
  { tab: '环境太平凡', kind: '客观', con: '有人说：环境太平凡了，不能创造。', evs: ['平凡无过于一张白纸，八大山人挥毫画他几笔，便成为一幅名贵的杰作。', '平凡也无过于一块石头，到了飞帝亚斯、米开朗基的手里可以成为不朽的塑像。'], verdict: '可见平凡单调，只是懒惰者之遁词。' },
  { tab: '生活太单调', kind: '客观', con: '有人说：生活太单调了，不能创造。', evs: ['单调无过于坐监牢，但是就在监牢中，产生了《易经》之卦辞，产生了《正气歌》，产生了苏联的国歌，产生了《尼赫鲁自传》。', '单调又无过于沙漠了，而雷塞布竟能在沙漠中造成苏彝士运河，把地中海与红海贯通起来。', '单调又无过于开肉包铺子，而竟在这里面，产生了平凡而伟大的平老静。'], verdict: '我们是要在平凡上造出不平凡，在单调上造出不单调。' },
  { tab: '年纪太小', kind: '主观', con: '有人说：年纪太小，不能创造，见着幼年研究生之名而哈哈大笑。', evs: ['但是当你把莫扎尔特、爱迪生及冲破父亲数学层层封锁之帕斯加尔的幼年研究生活翻给他看，'], verdict: '他又只好哑口无言了。' },
  { tab: '太无能', kind: '主观', con: '有人说：我是太无能了，不能创造，', evs: ['但是鲁钝的曾参，传了孔子的道统；不识字的慧能，传了黄梅的教义。', '慧能说：“下下人有上上智。”我们岂可以自暴自弃呀！'], verdict: '可见无能也是借口。' },
  { tab: '山穷水尽', kind: '主观', con: '有人说：山穷水尽，走投无路，陷入绝境，等死而已，不能创造。', evs: ['但是遭遇八十一难之玄奘，毕竟取得佛经；', '粮水断绝、众叛亲离之哥伦布，毕竟发现了美洲；', '冻饿病三重压迫下之莫扎尔特，毕竟写出了《安魂曲》。'], verdict: '绝望是懦夫的幻想。' },
];

function initDebate() {
  const $ = (id) => document.getElementById(id);
  const done = new Set();
  let cur = 0;
  const show = (i) => {
    cur = i;
    const r = ROUNDS[i];
    document.querySelectorAll('.db-tab').forEach((t, k) => t.classList.toggle('cur', k === i));
    $('dbCon').textContent = r.con;
    $('dbKind').textContent = `${r.kind}方面的借口`;
    $('dbEvs').innerHTML = r.evs.map((t) => `<p>${t}</p>`).join('');
    $('dbVerdict').textContent = r.verdict;
    $('debate').classList.toggle('shot', done.has(i));
  };
  $('dbTabs').innerHTML = ROUNDS.map((r, i) => `<button type="button" class="db-tab" data-i="${i}"><b>${i + 1}</b>${r.tab}</button>`).join('');
  $('dbTabs').addEventListener('click', (e) => {
    const t = e.target.closest('.db-tab');
    if (t) show(+t.dataset.i);
  });
  $('dbGo').addEventListener('click', () => {
    done.add(cur);
    document.querySelector(`.db-tab[data-i="${cur}"]`).classList.add('done');
    $('debate').classList.add('shot');
    $('dbFinal').hidden = done.size < ROUNDS.length;
  });
  show(0);
}

/* 东山樵夫：故事里的事物 → 比喻什么（答案不唯一） */
const FABLE = [
  { k: '樵夫', a: '只看眼前用处、因循守旧的人；他“断定泰山是一座平凡之山”。' },
  { k: '茅草', a: '平凡之物；樵夫眼里只有它，看不见奇峰、大树和“登泰山而小天下之境界”。' },
  { k: '树苗', a: '有幻想、能长成参天大树的人才（比如学生），却“幻想换换环境”，结果被拔去烧了锅。' },
  { k: '雪亮的镰刀', a: '摧残幼苗、扼杀创造的力量。' },
  { k: '创造之神', a: '创造精神；“只有你回来，才能保证参天大树之长成”。' },
];

function initFable() {
  const box = document.getElementById('fable');
  box.innerHTML = FABLE.map((f) => `<button type="button" class="fb"><b>${f.k}</b><span>${f.a}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.fb');
    if (b) b.classList.toggle('open');
  });
}

const MOMENTS = [
  {
    name: '仿写：驳一个借口', pic: 'yanshui',
    prompt: '有人说：“我太忙了，没有时间读书。”仿照课文“有人说……可见……”的写法，驳倒这个借口。',
    hint: '三步：先摆出“有人说”；再举两三个事例（越具体越有力）；最后用一句话一针见血地点破。',
    example: '有人说：我太忙了，没有时间读书。可是忙无过于欧阳修做官，他却在“马上、枕上、厕上”读书作文；忙也无过于董遇耕田，他却利用“冬者岁之余，夜者日之余，阴雨者时之余”读书。可见“没有时间”，只是不想读书者的遁词。',
  },
  {
    name: '摘抄：含义深刻的句子', pic: 'shulin',
    prompt: '找出文中一句含义深刻的句子，抄下来，再用自己的话说说它的意思。',
    hint: '可以选：“绝望是懦夫的幻想。”“像屋檐水一样，一点一滴，滴穿阶沿石。”“处处是创造之地……”',
    example: '“像屋檐水一样，一点一滴，滴穿阶沿石。”——屋檐水很柔弱，可是日积月累，竟能在坚硬的石头上滴出小坑。创造也是这样，不要轻视点滴的小创造，坚持下去，就能成就大事。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initPath();
    initDebate();
    initFable();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
