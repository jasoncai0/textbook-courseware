'use strict';
/* 海燕 · 本课数据与互动：暴风雨三阶段（场景页分步 + 闪电）、勇敢—怯懦象征轴、衬托图、修辞分类、海燕的宣言 */

/* ---------- 象征轴：x 为横向位置（0 怯懦 — 100 勇敢） ---------- */
const BIRDS = [
  { n: '企鹅', x: 8, act: '蠢笨，胆怯地把肥胖的身体躲藏在悬崖底下', mean: '躲避斗争、贪图安逸的庸人' },
  { n: '海鸭', x: 28, act: '呻吟着，享受不了生活的战斗的欢乐，被雷声吓坏了', mean: '害怕斗争、只求苟安的人' },
  { n: '海鸥', x: 48, act: '呻吟，飞窜，充满恐惧，想把恐惧掩藏到大海深处', mean: '害怕革命、惊慌失措的人' },
  { n: '海燕', x: 90, act: '高傲地飞翔，叫喊，渴望暴风雨，深信乌云遮不住太阳', mean: '勇敢坚强、预言并迎接革命风暴的革命先驱者', main: true },
];

function buildAxis() {
  document.getElementById('symAxis').innerHTML = `<div class="ax-line"><span>恐惧 · 躲藏</span><span>渴望 · 迎接</span></div>
    ${BIRDS.map((b, i) => `<button type="button" class="ax-bird${b.main ? ' main' : ''}" data-step="${i + 1}" data-i="${i}" style="left:${b.x}%">
      <svg viewBox="0 0 60 30"><path d="M2 17 Q17 3 30 15 Q43 3 58 17 Q43 11 33 19 L30 27 L27 19 Q17 11 2 17Z"/></svg><b>${b.n}</b></button>`).join('')}`;
}
buildAxis();

function initAxis() {
  const card = document.getElementById('symCard');
  document.getElementById('symAxis').addEventListener('click', (e) => {
    const b = e.target.closest('.ax-bird');
    if (!b) return;
    document.querySelectorAll('.ax-bird').forEach((x) => x.classList.toggle('sel', x === b));
    const d = BIRDS[+b.dataset.i];
    card.innerHTML = `<h3>${d.n}</h3><p><i>表现与特征</i>${d.act}</p><p><i>象征意义</i>${d.mean}</p>`;
  });
}

/* ---------- 积累拓展四：修辞 ---------- */
const SORT = [
  { s: '在乌云和大海之间，海燕像黑色的闪电，在高傲地飞翔。', ok: ['比喻'], q: '把海燕比作“黑色的闪电”，写出它矫健、迅猛、勇敢的形象。' },
  { s: '海鸭也在呻吟着，——它们这些海鸭啊，享受不了生活的战斗的欢乐：轰隆隆的雷声就把它们吓坏了。', ok: ['拟人'], q: '写海鸭“呻吟”“享受不了……欢乐”，讽刺怯懦者贪图安逸、害怕斗争。' },
  { s: '看吧，狂风紧紧抱起一层层巨浪，恶狠狠地把它们甩到悬崖上，把这些大块的翡翠摔成尘雾和碎末。', ok: ['拟人', '比喻'], q: '“抱起”“恶狠狠地甩”把狂风人格化，“翡翠”比喻碧绿的巨浪——写出狂风巨浪搏斗的凶猛。' },
  { s: '——暴风雨！暴风雨就要来啦！', ok: ['反复'], q: '“暴风雨”连说两遍，表达海燕急切、兴奋、热烈的心情。' },
];

const MOMENTS = [
  {
    name: '向海鸥们', pic: 'qunniao',
    prompt: '海燕飞过呻吟的海鸥、海鸭和躲在悬崖下的企鹅，它会对它们说什么？',
    hint: '用第一人称“我”；先回应它们的恐惧，再说出自己的渴望和信念；可以用反复、感叹。',
    example: '海鸥啊，海鸭啊，你们为什么呻吟？你们把恐惧藏进大海深处，可大海也在怒吼！企鹅啊，悬崖底下并不安全。我不躲，我要飞上去——飞到乌云和大海之间！暴风雨不是灾难，是新生的号角。来吧，暴风雨！',
  },
  {
    name: '向狂风乌云', pic: 'baofengyu',
    prompt: '面对狂风、乌云和雷鸣，海燕会怎样宣告自己的心志？',
    hint: '写出对手的强大，更写出海燕的轻蔑和信心；记住“乌云遮不住太阳”。',
    example: '狂风，你尽管吼叫吧！乌云，你尽管压下来吧！雷声，你轰响得再凶，我也早听出了你的困乏。你们遮不住太阳——是的，遮不住的！我是暴风雨的预言者，我在你们中间飞翔，我在你们中间大笑！',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['比喻', '拟人', '反复'], moments: MOMENTS });
    initAxis();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
