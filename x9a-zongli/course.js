'use strict';
/* 周总理，你在哪里 · 本课数据与互动：问—答回声地图、形象翻卡、反复选一选、朗读提示、仿写。通用部分见 ../shared/narrative.js */

/* 第 2—6 节：喊—回音—回答 */
const PLACES = [
  { name: '高山', pic: 'gaoshan', who: '山谷回音', ans: ['革命征途千万里，', '他大步前进不停息！”'], trait: '为革命奔走不息' },
  { name: '大地', pic: 'dadi', who: '大地轰鸣', ans: ['你不见那沉甸甸的谷穗上，', '还闪着他辛勤的汗滴……”'], trait: '辛勤操劳，关心农业' },
  { name: '森林', pic: 'senlin', who: '松涛阵阵', ans: ['宿营地上篝火红啊，', '伐木工人正在回忆他亲切的笑语。”'], trait: '平易近人，和群众在一起' },
  { name: '大海', pic: 'dahai', who: '海浪声声', ans: ['你不见海防战士身上，', '他亲手给披的大衣……”'], trait: '关怀战士，体贴入微' },
];
const WORLD = ['我们找遍整个世界，', '啊，总理，', '你在革命需要的每一个地方，', '辽阔大地', '到处是你深深的足迹。'];

function initEcho() {
  const places = document.getElementById('places');
  const box = document.getElementById('echoBox');
  places.innerHTML = PLACES.map((p, i) => `<button type="button" class="place" data-i="${i}"><span class="place-pic" data-bg="assets/${p.pic}.jpg"></span><b>${p.name}</b></button>`).join('')
    + '<button type="button" class="place world" data-i="w"><b>整个世界</b></button>';
  const show = (i) => {
    places.querySelectorAll('.place').forEach((b) => b.classList.toggle('cur', b.dataset.i === String(i)));
    if (i === 'w') {
      box.innerHTML = `<div class="echo-in world-in">${WORLD.map((l) => `<p>${l}</p>`).join('')}<span class="echo-trait">总理的足迹遍及祖国大地</span></div>`;
      return;
    }
    const p = PLACES[i];
    box.innerHTML = `<div class="echo-in">
      <p class="we">我们对着${p.name}喊：</p>
      <p class="shout">周总理——</p>
      <p class="who">${p.who}：</p>
      <p class="gone">“他刚离去，他刚离去，<span aria-hidden="true">他刚离去……</span><span aria-hidden="true">他刚离去……</span></p>
      ${p.ans.map((l) => `<p class="ans">${l}</p>`).join('')}
      <span class="echo-trait">读出的总理：${p.trait}</span></div>`;
  };
  places.addEventListener('click', (e) => {
    const b = e.target.closest('.place');
    if (b) show(b.dataset.i === 'w' ? 'w' : +b.dataset.i);
  });
  show(0);
}

const CLUES = [
  { q: '“革命征途千万里，他大步前进不停息！”', a: '为国家、为革命奔走不息，鞠躬尽瘁。' },
  { q: '“你不见那沉甸甸的谷穗上，还闪着他辛勤的汗滴……”', a: '关心农业生产和人民生活，辛勤操劳。' },
  { q: '“宿营地上篝火红啊，伐木工人正在回忆他亲切的笑语。”', a: '深入基层，与群众亲密无间，平易近人。' },
  { q: '“你不见海防战士身上，他亲手给披的大衣……”', a: '关怀战士，体贴入微。' },
];

const PICKS = {
  rep: [
    { t: '他刚离去，他刚离去，', ok: true, why: '每节回声都重复' },
    { t: '我们对着高山喊：周总理——', ok: true, why: '“我们对着……喊”反复四次' },
    { t: '——在这里，在这里，在这里……', ok: true, why: '回声般的反复' },
    { t: '革命征途千万里，', ok: false, why: '只出现一次' },
    { t: '想念你啊，想念你——想——念——你……', ok: true, why: '反复，渐弱' },
    { t: '辽阔大地到处是你深深的足迹。', ok: false, why: '只出现一次' },
    { t: '你永远居住在……你永远居住在……', ok: true, why: '反复加排比' },
  ],
};

function initRhythm() {
  document.querySelectorAll('.rhythm-btn').forEach((btn) => btn.addEventListener('click', () => {
    const on = btn.closest('.slide').classList.toggle('marks-on');
    btn.textContent = on ? '隐藏朗读提示' : '显示朗读提示';
  }));
}

const MOMENTS = [
  {
    name: '对着星空喊', pic: 'gaoshan',
    prompt: '选一位你想念的人或一个已经离开的地方，仿照诗中格式写一节：我们（我）对着……喊——回音——一句具体的回答。',
    hint: '回答里要有一个具体细节（一件衣服、一句话、一个动作），而不是空泛的赞美。',
    example: '我对着老槐树喊：\n外婆——\n槐叶沙沙：\n“她刚出门，她刚出门，\n你不见那石凳上，\n还放着她没剥完的豆荚……”',
  },
  {
    name: '设计一次轮诵', pic: 'dahai',
    prompt: '为第 2—5 节设计朗诵分工：谁读“我们喊”，谁读“周总理——”，谁读回声？在哪里放慢、放轻？',
    hint: '可以一人领诵、众人回声；回声部分声音渐弱。',
    example: '领诵：我们对着高山喊——\n全体（拉长）：周总理——\n女声（轻）：山谷回音——\n男声（低沉）：“他刚离去，他刚离去，……”\n全体（渐强）：他大步前进不停息！',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, clues: CLUES, clueLabels: ['山河的回答', '读出的总理'], moments: MOMENTS });
    initEcho();
    initRhythm();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
