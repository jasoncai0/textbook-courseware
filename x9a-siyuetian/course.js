'use strict';
/* 你是人间的四月天 · 本课数据与互动：转行/颜色标记、比喻意象调色盘、押韵字、仿写。通用部分见 ../shared/narrative.js */

const SWATCHES = [
  { n: '四月天', c: '#f6c9a0', line: '我说你是人间的四月天', t: '温暖明媚（总的比喻）' },
  { n: '笑响 · 风', c: '#ffe08a', line: '笑响点亮了四面风；轻灵在春的光艳中交舞着变', t: '活泼、轻灵' },
  { n: '云烟', c: '#dfe4f0', line: '你是四月早天里的云烟', t: '轻柔、缥缈' },
  { n: '风的软', c: '#cfe8d8', line: '黄昏吹着风的软', t: '温柔' },
  { n: '星子', c: '#fff1a8', line: '星子在无意中闪', t: '灵动、闪亮' },
  { n: '细雨', c: '#b9d4e8', line: '细雨点洒在花前', t: '细腻、滋润' },
  { n: '月圆', c: '#efe9c4', line: '你是夜夜的月圆', t: '天真、庄严、圆满' },
  { n: '鹅黄', c: '#f0d75c', line: '雪化后那片鹅黄，你像', t: '新鲜、娇嫩' },
  { n: '新绿', c: '#a9d78c', line: '新鲜初放芽的绿，你是', t: '生机勃勃、柔嫩喜悦' },
  { n: '白莲', c: '#fbfbf6', line: '水光浮动着你梦期待中白莲', t: '纯洁、美好的期待' },
  { n: '花开', c: '#f5b6c4', line: '你是一树一树的花开', t: '绚烂、生命力' },
  { n: '燕呢喃', c: '#9fb0c4', line: '是燕在梁间呢喃', t: '温馨、亲切' },
];

function initPalette() {
  const pal = document.getElementById('pal');
  const you = document.getElementById('you');
  const info = document.getElementById('palInfo');
  const count = document.getElementById('palCount');
  const picked = [];
  pal.innerHTML = SWATCHES.map((s, i) => {
    const a = (i / SWATCHES.length) * 360;
    return `<button type="button" class="sw" data-i="${i}" style="--a:${a}deg;--c:${s.c}"><span>${s.n}</span></button>`;
  }).join('');
  const paint = () => {
    if (!picked.length) { you.style.background = '#fff'; return; }
    const cols = picked.map((i) => SWATCHES[i].c);
    you.style.background = cols.length === 1 ? cols[0] : `conic-gradient(${[...cols, cols[0]].join(',')})`;
  };
  pal.addEventListener('click', (e) => {
    const b = e.target.closest('.sw');
    if (!b) return;
    const i = +b.dataset.i;
    const k = picked.indexOf(i);
    if (k >= 0) picked.splice(k, 1); else picked.push(i);
    b.classList.toggle('on', k < 0);
    const s = SWATCHES[i];
    info.innerHTML = `<p class="pi-line">“${s.line}”</p><p class="pi-t"><i style="background:${s.c}"></i>喻体：${s.n} → “你”：<b>${s.t}</b></p>`;
    count.textContent = picked.length === SWATCHES.length ? '全部调进去了：你是爱，是暖，是希望，你是人间的四月天！' : `已调入 ${picked.length} / ${SWATCHES.length} 种颜色`;
    paint();
  });
  paint();
}

const RHYME = [['天', 'ti', 'ān'], ['烟', 'y', 'ān'], ['前', 'qi', 'án'], ['圆', 'yu', 'án'], ['鲜', 'xi', 'ān'], ['莲', 'li', 'án'], ['燕', 'y', 'àn'], ['暖', 'nu', 'ǎn']];

function initRhyme() {
  const row = document.getElementById('rhRow');
  row.innerHTML = RHYME.map(([z, h, t]) => `<button type="button" class="rh"><b>${z}</b><small>${h}<em>${t}</em></small></button>`).join('');
  row.addEventListener('click', (e) => {
    const b = e.target.closest('.rh');
    if (b) b.classList.toggle('on');
  });
}

function initPoemMarks() {
  const slide = document.querySelector('.s-poem');
  slide.querySelectorAll('[data-m]').forEach((b) => b.addEventListener('click', () => {
    const on = slide.classList.toggle(`m-${b.dataset.m}`);
    b.classList.toggle('solid', on);
  }));
}

const MOMENTS = [
  {
    name: '你是人间的五月风', pic: 'huakai',
    prompt: '以《你是＿＿》为题，写给一个你爱的人（妈妈、朋友、老师）。先用一个总比喻，再用三四个小比喻展开，结尾点明“你是……”。',
    hint: '小比喻都要和总比喻同属一个季节或场景；可以加颜色词；试试转行。',
    example: '你是清晨的第一缕光；\n推开窗帘，叫醒整间屋子，\n叫醒我。\n你是厨房里升起的白汽，\n是阳台上一盆小小的绿萝，\n是灯下\n那杯不烫也不凉的牛奶，\n——你是暖，是安心，\n你是我每一天的清晨！',
  },
  {
    name: '只写颜色', pic: 'ehuang',
    prompt: '用三种颜色来写一个人，每种颜色配一个景物。',
    hint: '颜色要贴合人物的特点。',
    example: '你像初春那片鹅黄，嫩嫩的，带着笑；\n你是雨后新洗的绿，干干净净；\n你是夜里那轮月的白，安静，又让人放心。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initPoemMarks();
    initPalette();
    initRhyme();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
