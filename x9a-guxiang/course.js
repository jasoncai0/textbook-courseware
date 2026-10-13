'use strict';
/* 故乡 · 本课数据。记叙文模板见 ../shared/narrative.js；
 * 本课独有：回乡—在乡—离乡结构图（故乡变化示意图）+ 闰土 / 杨二嫂今昔对比卡 + “厚障壁”砌墙 */

/* 今昔对比：每行 [方面, 二十年前, 现在] */
const PEOPLE = {
  runtu: {
    name: '闰土', then: 'shenyi', now: 'runtu',
    rows: [
      ['外貌', '紫色的圆脸，头戴一顶小毡帽，颈上套一个明晃晃的银项圈', '先前的紫色的圆脸，已经变作灰黄，而且加上了很深的皱纹；头上是一顶破毡帽，身上只一件极薄的棉衣'],
      ['手', '红活圆实的手（“我所记得的”）', '又粗又笨而且开裂，像是松树皮了'],
      ['神态', '只是不怕我……于是不到半日，我们便熟识了', '脸上现出欢喜和凄凉的神情……仿佛石像一般'],
      ['称呼', '（哥弟称呼）迅哥儿', '“老爷！……”'],
      ['语言', '“现在太冷，你夏天到我们这里来。我们日里到海边检贝壳去……”', '“非常难。第六个孩子也会帮忙了，却总是吃不够……”'],
      ['形象', '海边的小英雄：机灵、勇敢、见多识广', '木偶人：麻木、恭敬、迟钝'],
    ],
    why: '多子，饥荒，苛税，兵，匪，官，绅，都苦得他像一个木偶人了。',
  },
  yang: {
    name: '杨二嫂', then: '', now: 'yuangui',
    rows: [
      ['外貌', '擦着白粉，颧骨没有这么高，嘴唇也没有这么薄', '凸颧骨，薄嘴唇，五十岁上下'],
      ['姿态', '终日坐着', '两手搭在髀间，没有系裙，张着两脚，正像一个画图仪器里细脚伶仃的圆规'],
      ['称号', '“豆腐西施”', '“圆规”'],
      ['言行', '因为伊，这豆腐店的买卖非常好', '“你放了道台了，还说不阔？”顺便将我母亲的一副手套塞在裤腰里'],
      ['又一件事', '——', '在灰堆里掏出碗碟，说是闰土埋的；自己拿了狗气杀，飞也似的跑了'],
      ['形象', '年轻、安分的小店主', '尖酸刻薄、自私、贪小便宜'],
    ],
    why: '生活的贫困和世风的败坏，把一个“豆腐西施”变成了“圆规”。',
  },
};

function showPerson(slide, key) {
  const p = PEOPLE[key];
  slide.querySelectorAll('[data-who]').forEach((b) => b.classList.toggle('solid', b.dataset.who === key));
  const pics = slide.querySelectorAll('.gx-pic');
  pics[0].style.backgroundImage = p.then ? `url(assets/${p.then}.jpg)` : 'none';
  pics[0].classList.toggle('empty', !p.then);
  pics[1].style.backgroundImage = `url(assets/${p.now}.jpg)`;
  slide.querySelector('.gx-rows').innerHTML = p.rows.map(([k, a, b]) => `<div class="gx-row"><b>${k}</b><p class="then">${a}</p><p class="now">${b}</p></div>`).join('');
  slide.querySelector('.gx-why').textContent = p.why;
}

function initPeople() {
  const slide = document.querySelector('.s-then');
  slide.querySelectorAll('[data-who]').forEach((b) => b.addEventListener('click', () => showPerson(slide, b.dataset.who)));
  slide.querySelector('#gxNow').addEventListener('click', (e) => {
    const on = slide.classList.toggle('only-then');
    e.target.textContent = on ? '显示“现在”' : '先只看“二十年前”';
  });
  showPerson(slide, 'runtu');
}

/* 第 1 步：只看闰土的“二十年前”；第 2 步：出现“现在”；第 3 步：换到杨二嫂 */
function updatePeople(slide, step) {
  if (!slide.classList.contains('s-then')) return;
  slide.classList.toggle('only-then', step === 1);
  if (step >= 1) showPerson(slide, step >= 3 ? 'yang' : 'runtu');
}

const MOMENTS = [
  {
    name: '宏儿和水生重逢', pic: 'shenyi',
    prompt: '积累拓展五：发挥想象，续写宏儿和水生长大后见面的情景。300 字左右。',
    hint: '想一想：他们会怎样称呼对方？会不会像“我”和闰土那样隔膜？“新的生活”是什么样子？可以写一个细节（一样小东西、一句称呼）作为呼应。',
    example: '二十年后，宏儿坐车回到海边。沙地上还种着西瓜，一个晒得黝黑的汉子迎上来，远远就喊：“宏儿！”宏儿也喊：“水生！”两人都笑了——谁也没有叫谁“老爷”。水生从口袋里摸出一枚贝壳：“还记得吗？你走那年我想送你的。”宏儿接过来，说起城里的学校，水生说起合作社新修的渠……月亮升起来了，两人坐在瓜地边，说个不停。',
  },
  {
    name: '一处环境描写', pic: 'huixiang',
    prompt: '思考探究三迁移：写一段环境描写，让景物带上人物的心情（如“我的心禁不住悲凉起来了”）。',
    hint: '先定心情，再选景物和颜色：悲凉——苍黄、萧索、冷风；欢喜——深蓝、金黄、碧绿。最后一句可以点明心情。',
    example: '放学时天已经暗了，操场边的梧桐只剩几片叶子，风一吹，簌簌地落在空荡荡的跑道上。远处教学楼的灯一盏一盏熄了。我拎着那张不及格的卷子，觉得连路灯都比平时昏黄。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initPeople();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updatePeople(slide, step);
  },
};
