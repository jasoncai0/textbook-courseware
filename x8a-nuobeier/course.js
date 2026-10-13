'use strict';
/* 首届诺贝尔奖颁发 · 本课数据与本课独有互动：电报稿纸填空、获奖者连线、编辑删词。通用互动见 ../shared/narrative.js */

const FIELDS = [
  ['电头', '通讯社', '路透社'], ['电头', '发电地点', '斯德哥尔摩'], ['电头', '发电时间', '1901 年 12 月 10 日'],
  ['导语', '何人', '瑞典国王和挪威诺贝尔基金会'], ['导语', '何时', '今天'], ['导语', '何事', '首次颁发了诺贝尔奖'],
  ['导语', '依据', '诺贝尔的遗嘱'], ['导语', '奖给谁', '每年在物理学、化学、生理学或医学、文学及和平事业方面为人类做出最大贡献的人'],
];

function initFill() {
  const box = document.getElementById('fillForm');
  box.innerHTML = FIELDS.map(([g, k, v]) => `<div class="f-row"><span class="f-g ${g === '电头' ? 'g1' : 'g2'}">${g}</span><span class="f-k">${k}</span><button type="button" class="f-v">${v}</button></div>`).join('');
  box.addEventListener('click', (e) => {
    const v = e.target.closest('.f-v');
    if (v) v.classList.add('open');
  });
}

/* 连一连：k 为配对序号 */
const WINNERS = [
  { n: '伦琴', meta: '德国 · 物理学奖', a: '发现了 X 射线' },
  { n: '范托夫', meta: '荷兰 · 化学奖', a: '发现了化学动力学定律和渗透压定律' },
  { n: '贝林', meta: '德国 · 生理学或医学奖', a: '在血清疗法的研究方面卓有成就' },
  { n: '普吕多姆', meta: '法国 · 文学奖', a: '在诗歌创作方面颇有建树' },
  { n: '迪南', meta: '瑞士 · 和平奖', a: '于 1864 年建立了红十字会' },
  { n: '帕西', meta: '经济学家 · 和平奖', a: '建立了促进国际仲裁的各国议会联盟' },
];
const RIGHT_ORDER = [3, 0, 5, 1, 4, 2];

function initMatch() {
  const L = document.getElementById('mLeft');
  const R = document.getElementById('mRight');
  L.innerHTML = WINNERS.map((w, i) => `<button type="button" class="m-item m-l" data-k="${i}"><b>${w.n}</b><small>${w.meta}</small></button>`).join('');
  R.innerHTML = RIGHT_ORDER.map((i) => `<button type="button" class="m-item m-r" data-k="${i}">${WINNERS[i].a}</button>`).join('');
  let picked = null;
  const box = document.getElementById('match');
  box.addEventListener('click', (e) => {
    const it = e.target.closest('.m-item');
    if (!it || it.classList.contains('ok')) return;
    if (it.classList.contains('m-l')) {
      box.querySelectorAll('.m-l').forEach((b) => b.classList.toggle('sel', b === it));
      picked = it;
      return;
    }
    if (!picked) return;
    if (picked.dataset.k === it.dataset.k) {
      const n = box.querySelectorAll('.m-l.ok').length + 1;
      [picked, it].forEach((b) => { b.classList.remove('sel'); b.classList.add('ok'); b.dataset.n = n; });
      picked = null;
    } else {
      it.classList.remove('no');
      void it.offsetWidth; // 重新触发抖动
      it.classList.add('no');
    }
  });
}

const SORT = [
  { s: '瑞典国王和挪威诺贝尔基金会今天首次颁发了诺贝尔奖。', ok: ['客观陈述'], q: '本课 · 导语' },
  { s: '德国的伦琴（物理学奖），他发现了 X 射线', ok: ['客观陈述'], q: '本课 · 名单' },
  { s: '授奖仪式每年于 12 月 10 日……举行。', ok: ['客观陈述'], q: '本课 · 制度' },
  { s: '诺贝尔基金会……与诺贝尔奖的评定无关。', ok: ['客观陈述'], q: '本课 · 背景' },
  { s: '人民解放军英勇善战，锐不可当', ok: ['带有评价'], q: '第 1 课 · 赞美' },
  { s: '战犯汤恩伯二十一日到芜湖督战，不起丝毫作用。', ok: ['带有评价'], q: '第 1 课 · 轻蔑' },
];

function initCut() {
  const box = document.getElementById('cutBox');
  const total = box.querySelectorAll('.sub').length;
  box.addEventListener('click', (e) => {
    const s = e.target.closest('.sub');
    if (s) {
      s.classList.add('cut');
    } else if (e.target.closest('p')) {
      const p = e.target.closest('p');
      p.classList.remove('nope');
      void p.offsetWidth;
      p.classList.add('nope');
    }
    const n = box.querySelectorAll('.sub.cut').length;
    document.getElementById('cutCount').innerHTML = n === total ? `全部删对了：${n} / ${total}，读一读修改稿！` : `删掉 <b>${n}</b> / ${total}`;
  });
}

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['客观陈述', '带有评价'] });
    initFill();
    initMatch();
    initCut();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
  },
};
