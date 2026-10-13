'use strict';
/* 论教养 · 本课数据与互动：教养表现归档（点卡片再点抽屉）、自查清单。通用部分见 ../shared/narrative.js */

const BINS = [
  { n: '在家里', pic: 'jiating' },
  { n: '待人处世', pic: 'gongjiao' },
  { n: '举止风度', pic: 'canzhuo' },
  { n: '对社会与自然', pic: '' },
];
const CARDS = [
  { t: '帮疲惫的妻子刷洗餐具', b: 0 },
  { t: '了解亲人的性格、心理，关心他们的习惯和愿望', b: 0 },
  { t: '孩子做功课时，不把电视音量放得很大', b: 0 },
  { t: '对人一律谦让和礼让，无论年长年幼', b: 1 },
  { t: '珍惜别人的时间', b: 1 },
  { t: '允诺别人的事一定尽力去做', b: 1 },
  { t: '吃饭时不吧嗒嘴，喝汤不出声', b: 2 },
  { t: '穿着整洁，表明对别人的尊重', b: 2 },
  { t: '不只顾自己说笑，也让别人有机会说话', b: 2 },
  { t: '敬重社会', b: 3 },
  { t: '珍惜大自然、动物和花草树木', b: 3 },
  { t: '珍惜当地的美丽风光和居住地的历史', b: 3 },
];

function initBins() {
  const bins = document.getElementById('bins');
  const cards = document.getElementById('cards');
  const msg = document.getElementById('binMsg');
  let pick = -1;
  bins.innerHTML = BINS.map((b, i) => `<button type="button" class="bin" data-i="${i}"><span class="bin-pic"${b.pic ? ` data-bg="assets/${b.pic}.jpg"` : ''}></span><b>${b.n}</b><span class="bin-in"></span></button>`).join('');
  cards.innerHTML = CARDS.map((c, i) => `<button type="button" class="cd" data-i="${i}">${c.t}</button>`).join('');
  cards.addEventListener('click', (e) => {
    const c = e.target.closest('.cd');
    if (!c || c.classList.contains('done')) return;
    pick = +c.dataset.i;
    cards.querySelectorAll('.cd').forEach((x) => x.classList.toggle('cur', x === c));
    msg.textContent = '放进哪个抽屉？';
  });
  bins.addEventListener('click', (e) => {
    const b = e.target.closest('.bin');
    if (!b || pick < 0) return;
    const card = CARDS[pick];
    const el = cards.querySelector(`.cd[data-i="${pick}"]`);
    if (card.b !== +b.dataset.i) {
      el.classList.remove('no');
      void el.offsetWidth; // 重新触发抖动
      el.classList.add('no');
      msg.textContent = '再想想：这是在什么场合、对谁的态度？';
      return;
    }
    el.classList.add('done');
    el.classList.remove('cur');
    b.querySelector('.bin-in').insertAdjacentHTML('beforeend', `<i>${card.t}</i>`);
    pick = -1;
    const left = cards.querySelectorAll('.cd:not(.done)').length;
    msg.textContent = left ? `放对了！还剩 ${left} 张。` : '全部归档：教养从家里一直延伸到对社会和自然的态度。';
  });
}

const CHECKS = ['在家里，我会主动帮家人做家务', '家人休息或学习时，我会放轻声音', '我会准时赴约，珍惜别人的时间', '答应别人的事，我尽力做到', '吃饭时我不发出很大的声响', '聊天时我会让别人也有机会说话', '我不拿别人的缺点开玩笑', '我爱护公共环境和花草树木'];

function initChecks() {
  const box = document.getElementById('checks');
  const sum = document.getElementById('checkSum');
  box.innerHTML = CHECKS.map((c) => `<label class="ck"><input type="checkbox"><span>${c}</span></label>`).join('');
  const upd = () => {
    const n = box.querySelectorAll('input:checked').length;
    sum.textContent = `做到了 ${n} / ${CHECKS.length} 条${n === CHECKS.length ? '：真是个有教养的人！' : '。没做到的，就从明天开始。'}`;
  };
  box.addEventListener('change', upd);
  upd();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initBins();
    initChecks();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
