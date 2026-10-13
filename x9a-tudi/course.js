'use strict';
/* 我爱这土地 · 本课数据与互动：鸟的意象链、四意象卡、重音节奏标注台、仿写。通用部分见 ../shared/narrative.js */

const FOUR = [
  { name: '土地', pic: 'niao', pre: '被暴风雨所打击着的', feel: '沉重、悲痛', mean: '受难的祖国大地' },
  { name: '河流', pic: 'heliu', pre: '永远汹涌着我们的悲愤的', feel: '悲愤、不平', mean: '人民心中奔涌的悲愤' },
  { name: '风', pic: 'feng', pre: '无止息地吹刮着的激怒的', feel: '激愤、有力', mean: '人民不屈的反抗' },
  { name: '黎明', pic: 'liming', pre: '来自林间的无比温柔的', feel: '温柔、明亮', mean: '光明的前途和希望' },
];

function initFour() {
  const box = document.getElementById('four');
  box.innerHTML = FOUR.map((f) => `<button type="button" class="fc">
    <span class="fc-pic" data-bg="assets/${f.pic}.jpg"></span>
    <span class="fc-txt"><em>${f.pre}</em><b>${f.name}</b></span>
    <span class="fc-back"><i>感受：</i>${f.feel}<br><i>象征：</i>${f.mean}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.fc');
    if (c) c.classList.toggle('open');
  });
}

/* 标注台：* 开头为参考重音，/ 结尾为参考停顿 */
const LINES = [
  ['这', '被', '*暴风雨', '所', '*打击着的/', '土地，'],
  ['这', '*永远', '*汹涌着', '我们的', '*悲愤的/', '河流，'],
  ['这', '*无止息地', '吹刮着的/', '*激怒的/', '风，'],
  ['和那', '来自林间的/', '无比', '*温柔的/', '黎明……'],
  ['——然后/', '我', '*死了，'],
  ['连', '*羽毛', '也', '*腐烂/', '在土地里面。'],
  ['为什么/', '我的眼里', '*常含', '*泪水？'],
  ['因为/', '我对这土地', '爱得', '*深沉……'],
];

function initStress() {
  const box = document.getElementById('stress');
  box.innerHTML = LINES.map((l) => `<p>${l.map((w) => {
    const ref = w.startsWith('*');
    const ps = w.endsWith('/');
    const t = w.replace(/^\*/, '').replace(/\/$/, '');
    return `<button type="button" class="sw${ref ? ' ref' : ''}${ps ? ' rps' : ''}">${t}</button>`;
  }).join('')}</p>`).join('');
  box.addEventListener('click', (e) => {
    const w = e.target.closest('.sw');
    if (w) w.classList.toggle('st');
  });
  document.getElementById('stressRef').addEventListener('click', () => {
    box.querySelectorAll('.sw').forEach((w) => w.classList.toggle('st', w.classList.contains('ref')));
    box.classList.add('show-ps');
  });
  document.getElementById('stressClear').addEventListener('click', () => {
    box.querySelectorAll('.sw').forEach((w) => w.classList.remove('st'));
    box.classList.remove('show-ps');
  });
}

function initBird() {
  document.getElementById('birdChain').addEventListener('click', (e) => {
    const c = e.target.closest('.bc');
    if (c) c.classList.toggle('open');
  });
}

const MOMENTS = [
  {
    name: '我爱这小城', pic: 'liming',
    prompt: '仿照《我爱这土地》写一首同题小诗：“假如我是……，我也应该……”，再写三四个带修饰语的意象，最后自问自答。',
    hint: '修饰语要写出你的感受（如“被雨水洗亮的”“从早到晚喧闹着的”）；结尾的问答要真诚。',
    example: '假如我是一片梧桐叶，\n我也应该用全部的绿荫歌唱：\n这被晨雾轻轻笼着的小城，\n这从早到晚流淌着笑声的老街，\n这一年四季敞开着的校门，\n和那亮在窗口的温暖的灯火……\n——然后我飘落了，\n连叶脉也融进这片泥土里面。\n为什么我总想回头张望？\n因为我对这小城爱得太深……',
  },
  {
    name: '只写修饰语', pic: 'heliu',
    prompt: '给“操场”“教室”“妈妈的手”加上长修饰语，让它们带上你的感情。',
    hint: '修饰语里可以有动作、时间、颜色、感受。',
    example: '这被无数双球鞋踩出跑道的操场；\n这总在黄昏时亮起一盏灯的教室；\n这冬天里裂了口子却依然温暖的妈妈的手。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initBird();
    initFour();
    initStress();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
