'use strict';
/* 文言文二则 · 本课数据与互动。诗文模板（横排 + 译文）见 ../shared/poem.js，讲故事见 ../shared/narrative.js
 * 本课独有：捉萤火虫照书（体会“数十萤火”）、磨铁杵（体会“欲作针”的恒心）、一字变一词（课后第 3 题） */

const POEMS = {
  ny: {
    title: '囊萤夜读', author: '《晋书·车胤传》', layout: 'h',
    lines: [
      { t: '胤恭勤不倦，博学多通。', r: '胤/恭勤/不倦，博学/多通。', y: '车胤肃敬勤勉，从不知道疲倦，学识广博，通晓很多知识。' },
      { t: '家贫不常得油，', r: '家贫/不常/得油，', y: '他家里贫穷，不能经常得到点灯用的油。' },
      { t: '夏月则练囊盛数十萤火以照书，', r: '夏月/则/练囊/盛/数十萤火/以/照书，', f: '1.25 50% 35%', y: '夏天的夜晚，他就用白绢做的口袋装几十只萤火虫，照着书本读书，' },
      { t: '以夜继日焉。', r: '以夜/继日/焉。', y: '夜以继日地学习。' },
    ],
    notes: { 胤: '车胤，晋朝人', 恭勤: '肃敬勤勉', 通: '通晓，明白', 练囊: '白色薄绢做的口袋', 盛: '装（读 chéng）', 焉: '语气词，无实义' },
  },
  tc: {
    title: '铁杵成针', author: '［宋］祝穆《方舆胜览·眉州》', layout: 'h',
    lines: [
      { t: '磨针溪，在象耳山下。', r: '磨针溪，在/象耳山下。', y: '磨针溪，在象耳山下。' },
      { t: '世传李太白读书山中，未成，弃去。', r: '世传/李太白/读书/山中，未成，弃去。', y: '世代相传，李白在山中读书，没有完成学业，就放弃学习离开了。' },
      { t: '过是溪，逢老媪方磨铁杵。', r: '过/是溪，逢/老媪/方磨/铁杵。', f: '1.2 50% 55%', y: '他路过这条小溪，遇见一位老奶奶正在磨一根铁棒。' },
      { t: '问之，曰：“欲作针。”', r: '问之，曰：“欲/作针。”', y: '李白问她磨铁棒做什么，她说：“想把它磨成针。”' },
      { t: '太白感其意，还卒业。', r: '太白/感其意，还卒业。', y: '李白被她的意志感动，回去完成了学业。' },
    ],
    notes: { 铁杵: '用来舂米或捣衣的铁棒', 李太白: '李白，字太白，唐代大诗人', 是: '这', 老媪: '老妇人', 方: '正在', 感其意: '被她的意志感动', 还卒业: '回去完成了学业' },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* 捉萤火虫照书 */
const YING_STEP = 5;
const YING_ENOUGH = 40;
const YING_MAX = 60;
function initYing() {
  const $ = (id) => document.getElementById(id);
  let n = 0;
  const draw = () => {
    const k = Math.min(1, n / YING_ENOUGH);
    $('yHalo').setAttribute('opacity', (k * 0.9).toFixed(2));
    $('yWords').setAttribute('opacity', (0.08 + k * 0.85).toFixed(2));
    $('yCount').textContent = n === 0 ? '口袋里还没有萤火虫'
      : n < YING_ENOUGH ? `${n} 只萤火虫……书上的字还看不清` : `${n} 只萤火虫——“数十萤火”，能照书了！`;
  };
  $('yingAdd').addEventListener('click', () => {
    if (n >= YING_MAX) return;
    const bugs = Array.from({ length: YING_STEP }, (_, i) => {
      const x = 268 + Math.random() * 64;
      const y = 84 + Math.random() * 96;
      return `<circle class="bug" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="3.4" style="animation-delay:${(Math.random() * 1.6).toFixed(2)}s;--i:${i}"/>`;
    }).join('');
    $('yBugs').insertAdjacentHTML('beforeend', bugs);
    n += YING_STEP;
    draw();
  });
  $('yingReset').addEventListener('click', () => { n = 0; $('yBugs').innerHTML = ''; draw(); });
  draw();
}

/* 磨铁杵：每磨一次细一点，最后成针 */
const MO_TIMES = 8;
const MO_SAY = ['一根粗粗的铁杵', '磨了一天，好像没变', '磨了十天，细了一点点', '磨了一个月', '磨了好几个月', '磨了一年', '还在磨……', '越来越细了', '终于磨成了一根针！'];
function initMo() {
  const $ = (id) => document.getElementById(id);
  let n = 0;
  const draw = () => {
    const k = n / MO_TIMES;
    const h = 60 - 56 * k;
    const w = 400 - 120 * k;
    $('moBar').setAttribute('height', h.toFixed(1));
    $('moBar').setAttribute('y', (150 - h / 2).toFixed(1));
    $('moBar').setAttribute('width', w.toFixed(0));
    $('moBar').setAttribute('x', (300 - w / 2).toFixed(0));
    $('moBar').setAttribute('rx', (h / 2).toFixed(1));
    $('moBar').setAttribute('fill', n === MO_TIMES ? '#b7c0c9' : '#5d636b');
    $('moShine').setAttribute('opacity', (1 - k).toFixed(2));
    $('moEye').setAttribute('opacity', n === MO_TIMES ? '1' : '0');
    $('moEye').setAttribute('cx', (300 + w / 2 - 12).toFixed(0));
    $('moDays').textContent = MO_SAY[n];
  };
  $('moGo').addEventListener('click', () => {
    if (n >= MO_TIMES) return;
    n += 1;
    draw();
    const rod = $('moRod');
    rod.classList.remove('grind');
    void rod.getBBox(); // 重新触发磨的动画
    rod.classList.add('grind');
  });
  $('moReset').addEventListener('click', () => { n = 0; draw(); });
  draw();
}

/* 课后第 3 题：一个字变成一个词（前三行是课后题，后两行拓展） */
const CI = [
  { pre: '胤恭勤不', ch: '倦', post: '。', word: '疲倦', given: true },
  { pre: '家', ch: '贫', post: '不常得油。', word: '贫穷' },
  { pre: '世传李太白读书山中，未成，', ch: '弃', post: '去。', word: '放弃' },
  { pre: '过是溪，', ch: '逢', post: '老媪方磨铁杵。', word: '遇见', extra: true },
  { pre: '太白', ch: '感', post: '其意，还卒业。', word: '感动', extra: true },
];
function initCi() {
  const box = document.getElementById('ciList');
  box.innerHTML = CI.map((c, i) => `<button type="button" class="ci-row${c.given ? ' open' : ''}${c.extra ? ' extra' : ''}" data-i="${i}">
    <span class="ci-s">${c.pre}<b>${c.ch}</b>${c.post}</span><span class="ci-w">（<em>${c.word}</em>）</span>${c.given ? '<small>例</small>' : ''}${c.extra ? '<small>试一试</small>' : ''}</button>`).join('');
  box.addEventListener('click', (e) => {
    const row = e.target.closest('.ci-row');
    if (row) row.classList.add('open');
  });
}

/* 讲故事 */
const MOMENTS = [
  {
    name: '讲《囊萤夜读》', pic: 'zhuoying',
    prompt: '用自己的话讲讲车胤囊萤夜读的故事。',
    hint: '先说车胤是个怎样的人，再说他遇到什么困难，最后说他想了什么办法。',
    example: '晋朝有个叫车胤的人，学习非常勤奋，从不觉得累，懂得的知识很多。可是他家里很穷，常常买不起点灯的油。夏天的晚上，他就捉来几十只萤火虫，装进白绢做的口袋里，借着萤火虫的光读书，白天读，晚上接着读。',
  },
  {
    name: '讲《铁杵成针》', pic: 'mozhen',
    prompt: '用自己的话讲讲李白遇到老奶奶的故事。',
    hint: '可以加上李白和老奶奶的对话：李白问了什么？老奶奶怎么回答？李白听了心里怎么想？',
    example: '李白小时候在山里读书，还没学成就不想读了，偷偷下了山。走到一条小溪边，他看见一位老奶奶正在石头上磨一根粗铁棒。李白好奇地问：“老奶奶，您磨它做什么呀？”老奶奶说：“我要把它磨成一根针。”李白心想：这么粗的铁棒都能磨成针，我读书怎么能半途而废呢？于是他回到山中，完成了学业。',
  },
  {
    name: '我想对李白说', pic: 'qiqu',
    prompt: '李白“未成，弃去”的时候，如果你遇见他，会对他说什么？',
    hint: '可以用上“铁杵磨成针”“半途而废”这样的词。',
    example: '李白哥哥，你别急着走呀！学习就像磨铁杵，一天看不出变化，可是天天坚持，总有一天能成功的。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    Poem.init();
    initYing();
    initMo();
    initCi();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
