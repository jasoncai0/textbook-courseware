'use strict';
/* 大青树下的小学 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 新鲜感词句收集卡：s 原句（<em> 是新鲜的词），feel 说说感觉 */
const FRESH = [
  { s: '早晨，<em>从山坡上，从坪坝里，从一条条开着绒球花和太阳花的小路上</em>，走来了许多小学生。', feel: '一连三个“从”，好像看见孩子们从四面八方走来，路边还开着花。' },
  { s: '那鲜艳的服装，把学校<em>打扮</em>得<em>绚丽多彩</em>。', feel: '学校像一个被打扮的小姑娘，衣服的颜色多得数不清。' },
  { s: '同学们<em>向</em>在校园里欢唱的<em>小鸟打招呼</em>。', feel: '跟小鸟打招呼！小鸟也是同学们的好朋友。' },
  { s: '树枝不摇了，鸟儿不叫了，蝴蝶停在花朵上，<em>好像都在听同学们读课文</em>。', feel: '树枝、鸟儿、蝴蝶都在“听”，读书声一定很好听。' },
  { s: '<em>这些山林里的朋友</em>，是那样<em>好奇</em>地听着。', feel: '把猴子叫作“朋友”，它们好像也想来上学。' },
  { s: '<em>连</em>松鼠也<em>赶来看热闹</em>。', feel: '一个“连”字，下课真是热闹极了，松鼠都急着赶来。' },
  { s: '凤尾竹的影子，在洁白的墙上<em>摇晃</em>……', feel: '静静的画面里有一点点动，像电影的最后一个镜头。' },
];

const PICKS = {
  special: [
    { t: '同学们来自不同的民族', ok: true }, { t: '大家穿戴不同，服装鲜艳', ok: true },
    { t: '大青树上挂着铜钟', ok: true }, { t: '上课时猴子跑来听', ok: true },
    { t: '学校在大城市中心', ok: false, why: '是一所边疆的小学' },
    { t: '下课跳孔雀舞、摔跤', ok: true }, { t: '松鼠赶来看热闹', ok: true },
    { t: '教室里有大屏幕', ok: false, why: '课文里没写' },
    { t: '凤尾竹的影子在墙上摇晃', ok: true }, { t: '下课大家去游泳', ok: false, why: '课文里没写' },
  ],
};

const MOMENTS = [
  { name: '教室里', pic: 'ketang', prompt: '上课的时候，教室里是什么样的？同学们在做什么？', hint: '可以说说听到的声音、看到的样子，窗外有什么。', example: '上课的时候，教室里静悄悄的，只听见沙沙的写字声。窗外的小鸟停在树枝上，好像也在认真听讲。' },
  { name: '操场上', pic: 'kexia', prompt: '下课了，操场上热闹吗？同学们在玩什么？', hint: '用上几个动作：跑、跳、拍、追……', example: '下课了，操场上可热闹了。有的同学在跳绳，有的在踢毽子，还有的在追来追去，笑声连树上的麻雀都引来了。' },
  { name: '花坛边', pic: 'zaochen', prompt: '学校的花坛边有什么花？同学们在花坛边做什么？', hint: '花是什么颜色的？像什么？', example: '花坛边的月季开了，红的、粉的、黄的，把校园打扮得漂漂亮亮。几个同学蹲在花坛边，正在看一只蜜蜂采蜜。' },
  { name: '图书室里', pic: 'ketang', prompt: '图书室里是什么样的？同学们在看什么书？', hint: '想想图书室里的“静”。', example: '图书室里安安静静的，同学们捧着书，看得入了迷，连翻书都轻轻的，好像怕吵醒书里的故事。' },
  { name: '教学楼前', pic: 'zaochen', prompt: '早晨或放学的时候，教学楼前是什么样的？', hint: '可以用“放学了……”开头。', example: '放学了，同学们排着整齐的队伍从教学楼里走出来，向老师挥手说“再见”，教学楼前的国旗还在高高飘扬。' },
  { name: '大树下', pic: 'tongzhong', prompt: '你的学校里有大树吗？大树下发生过什么事？', hint: '学着课文写一写大树下的人和小动物。', example: '学校门口有一棵老槐树。下课了，我们在大树下跳皮筋，树上的知了也“知了知了”地叫，好像在给我们数数。' },
];

/* 收集卡：点一下点亮，读一读，看感觉 */
function initFresh(box, items) {
  box.innerHTML = items.map((it, i) => `<button type="button" class="fresh-card" data-i="${i}">
    <span class="fc-star">★</span><span class="fc-s">${it.s}</span>
    <span class="fc-feel"><b>我的感觉：</b>${it.feel}</span></button>`).join('');
  document.getElementById('freshAll').textContent = items.length;
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.fresh-card');
    if (!card) return;
    card.classList.toggle('lit');
    document.getElementById('freshN').textContent = box.querySelectorAll('.fresh-card.lit').length;
  });
}

/* 安静开关：同学们一朗读，窗外就安静下来 */
function initQuiet() {
  const btn = document.getElementById('quietBtn');
  const slide = btn.closest('.slide');
  btn.addEventListener('click', () => {
    const quiet = slide.classList.toggle('quiet');
    btn.textContent = quiet ? '下课了，再热闹一下' : '同学们开始朗读';
  });
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initFresh(document.getElementById('fresh'), FRESH);
    initQuiet();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
