'use strict';
/* 金木水火土 · 本课数据。识字模板见 ../shared/hanzi.js（必须在顶层调用，deck.js 加载前渲染完）
 * 识字 2 在学拼音之前：游戏用看图、古字形，不用“看拼音选字”。 */

/* 看图选字：把 assets/<name>.jpg 放大 z 倍，镜头对准图上 (cx%, cy%) */
const crop = (name, cx, cy, z = 4) => {
  const p = (c) => `${Math.min(100, Math.max(0, ((c / 100 - 0.5 / z) / (1 - 1 / z)) * 100)).toFixed(1)}%`;
  return { pic: `assets/${name}.jpg`, pos: `${p(cx)} ${p(cy)}`, size: `${z * 100}%` };
};

/* 开火车读：点“开车”，火车开进来，车厢一节一节亮起，一人读一节；点车厢也能单独亮 */
const TRAIN_START = 1600;
const TRAIN_GAP = 1300;
function initTrain(box, list) {
  box.innerHTML = `<div class="tr-rail"><div class="tr-cars"><span class="tr-engine"></span>${list.map(([z, py]) => `<button type="button" class="tr-car"><small>${py || ''}</small><b>${z}</b></button>`).join('')}</div></div>
    <p class="tr-btns"><button type="button" class="btn" data-go>开车</button></p>`;
  const cars = [...box.querySelectorAll('.tr-car')];
  let timers = [];
  box.addEventListener('click', (e) => {
    const car = e.target.closest('.tr-car');
    if (car) { car.classList.toggle('on'); return; }
    if (!e.target.closest('[data-go]')) return;
    timers.forEach(clearTimeout);
    cars.forEach((c) => c.classList.remove('on'));
    box.classList.remove('run');
    void box.offsetWidth;
    box.classList.add('run');
    timers = cars.map((c, i) => setTimeout(() => c.classList.add('on'), TRAIN_START + i * TRAIN_GAP));
  });
}
/* 识字 2 在学拼音之前：车厢上只写字，不注拼音 */
initTrain(document.getElementById('train'), [['一'], ['二'], ['三'], ['四'], ['五'], ['上'], ['下']]);

/* 五行小动画：点一下图标再动一次 */
document.querySelector('.jm-wx').addEventListener('click', (e) => {
  const it = e.target.closest('.jm-wx-i.on');
  if (!it) return;
  it.classList.remove('on');
  void it.offsetWidth;
  it.classList.add('on');
});

Hanzi.init({
  /* 本课补的古字形（示意简笔，100 × 100，一笔一条 path） */
  shapes: {
    四: ['M20 22H80', 'M20 41H80', 'M20 60H80', 'M20 79H80'],
    五: ['M14 16H86', 'M28 18L72 82', 'M72 18L28 82', 'M14 84H86'],
    上: ['M10 74Q50 64 90 74', 'M38 42H62'],
    下: ['M10 28Q50 38 90 28', 'M38 60H62'],
  },
  evolve: [
    { z: '四', note: '古时候“四”写成四横，像摆了四根小棒。' },
    { z: '五', note: '古字像上下两横，中间交叉一个“×”。' },
    { z: '上', note: '长长一横是地面，短短一横在它上边——“上”。' },
    { z: '下', note: '长长一横在上面，短短一横在它下边——“下”。' },
  ],
  pick: {
    /* 看图找字：把配图放大到某一处（已对照生成图） */
    kan: [
      { ...crop('wuxing', 13, 46), ans: '木', opts: ['木', '水', '土'] },
      { ...crop('wuxing', 31, 72), ans: '水', opts: ['火', '水', '金'] },
      { ...crop('wuxing', 50, 71), ans: '火', opts: ['火', '木', '土'] },
      { ...crop('wuxing', 67, 72), ans: '土', opts: ['金', '水', '土'] },
      { ...crop('wuxing', 88, 70), ans: '金', opts: ['金', '火', '木'] },
      { ...crop('shangxia', 56, 18, 3), ans: '上', opts: ['上', '下'] },
      { ...crop('shangxia', 59, 78, 3), ans: '下', opts: ['上', '下'] },
    ],
    old: [
      { old: '上', ans: '上', opts: ['下', '上', '土'] },
      { old: '木', ans: '木', opts: ['木', '水', '火'] },
      { old: '下', ans: '下', opts: ['上', '五', '下'] },
      { old: '水', ans: '水', opts: ['火', '水', '木'] },
      { old: '五', ans: '五', opts: ['四', '五', '三'] },
      { old: '火', ans: '火', opts: ['水', '木', '火'] },
    ],
  },
  cards: [
    { z: '一', py: 'yī', bs: '一', bh: 1, words: [['一个', 'yí gè'], ['一天', 'yì tiān']] },
    { z: '二', py: 'èr', bs: '二', bh: 2, words: [['二月', 'èr yuè'], ['十二', 'shí èr']] },
    { z: '三', py: 'sān', bs: '一', bh: 3, words: [['三个', 'sān gè'], ['三月', 'sān yuè']] },
    { z: '四', py: 'sì', bs: '囗', bh: 5, words: [['四个', 'sì gè'], ['四月', 'sì yuè']] },
    { z: '五', py: 'wǔ', bs: '一', bh: 4, words: [['五个', 'wǔ gè'], ['五月', 'wǔ yuè']] },
    { z: '上', py: 'shàng', bs: '一', bh: 3, words: [['上下', 'shàng xià'], ['天上', 'tiān shàng']] },
    { z: '下', py: 'xià', bs: '一', bh: 3, words: [['下面', 'xià miàn'], ['地下', 'dì xià']] },
  ],
  write: [
    { z: '一', py: 'yī', bs: '一', bh: 1 },
    { z: '二', py: 'èr', bs: '二', bh: 2 },
    { z: '三', py: 'sān', bs: '一', bh: 3 },
    { z: '上', py: 'shàng', bs: '一', bh: 3 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
