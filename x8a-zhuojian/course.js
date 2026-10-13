'use strict';
/* 一着惊海天 · 本课数据与本课独有的“目击者时间轴”。通用互动见 ../shared/narrative.js
 * 时间轴每个节点：t 时间标记，h 小标题，see/hear/feel 为记者看到、听到、感到（均为课文原句，“—”表示原文没写） */
const NODES = [
  { t: '8 时', h: '甲板就位', see: '身着不同颜色马甲的甲板工作人员在战位就位。阻拦索安全观察员手持专业工具，一丝不苟地对阻拦索做最后一次检查。', hear: '渤海某海域，海风呼啸，海浪澎湃。', feel: '备受外界关注的我国航母舰载战斗机首次着舰进入最关键时刻。' },
  { t: '背景', h: '不普通', see: '—', hear: '—', feel: '这不是一次普通的飞行。……这更不是一次普通的降落。这是世界公认的最具风险的难题。' },
  { t: '起飞后', h: '塔台广播', see: '着舰指挥员从容地走上甲板指挥平台。', hear: '飞行塔台内的广播响了：“歼-15飞机552号已于××××起飞，预计××××临空！”', feel: '“刀尖上的舞蹈”就要开始了，现场所有的人都捏着一把汗。塔台内，时钟指针的每次跳动，都在揪着人心。' },
  { t: '航行', h: '调整航向', see: '辽宁舰官兵娴熟地操纵着航空母舰，舰艉留下一道宽阔笔直的航迹。', hear: '“航向××，航速××节……”', feel: '—' },
  { t: '×时××分', h: '舰载机临空', see: '湛蓝的天幕上，一架歼-15舰载机正向辽宁舰飞来。……一双双布满血丝的眼睛，紧盯着监视屏幕上不断跳动的参数和曲线。', hear: '远方的天空中传来舰载机的低吼声。', feel: '—' },
  { t: '下滑', h: '舰、机配合', see: '歼-15舰载机像凌波海燕，轻巧灵活地调整好姿态飞至舰艉后上方，对准甲板跑道，以几近完美的轨迹迅速下滑。', hear: '飞行员：“请示下降高度！”着舰指挥员：“可以下降高度至×××！”', feel: '在两人时断时续、不急不缓的对话声中，舰、机配合堪称完美。' },
  { t: '9 时 08 分', h: '成功着舰', see: '舰载机的两个主轮触到航母甲板上，机腹后方的尾钩牢牢地挂住了第二道阻拦索。……定格了一个象征胜利的巨大“V”字。', hear: '伴随震耳欲聋的喷气式发动机轰鸣声。', feel: '惊心动魄的一幕出现了。', hot: true },
  { t: '随后', h: '欢呼落泪', see: '每个人的脸上都绽放出胜利的笑容。许多人落泪了！', hear: '“成功了！”……他们说：“太让人激动了！”', feel: '一颗颗揪紧的心，一下子舒展开来。……今天，终于有了一个圆满的结果，能不激动吗？' },
  { t: '几分钟后', h: '开舱合影', see: '鲜花映衬着飞行员的笑脸，人们忘情地与飞行员紧紧拥抱，争相与飞行员合影留念……', hear: '飞行员冲着围过来的将士们说：“一切正常，感觉好极了！”“咔嚓！”“咔嚓！”', feel: '中国第一位成功着舰的航母舰载战斗机飞行员的风采，定格在人们的镜头里，镌刻在共和国的史册上。' },
];

// 必须在 deck.js 统计分步之前生成
document.getElementById('axis').innerHTML = NODES.map((n, i) =>
  `<li data-step="${i + 1}"><button type="button" class="ax${n.hot ? ' hot' : ''}" data-i="${i}"><b>${n.t}</b><span>${n.h}</span></button></li>`).join('');

function showNode(i) {
  const n = NODES[i];
  document.querySelectorAll('#axis .ax').forEach((b, k) => b.classList.toggle('cur', k === i));
  document.getElementById('eyeT').textContent = `${n.t} · ${n.h}`;
  document.getElementById('eyeSee').textContent = n.see;
  document.getElementById('eyeHear').textContent = n.hear;
  document.getElementById('eyeFeel').textContent = n.feel;
}

const MOMENTS = [
  {
    name: '一次消防演练', pic: 'jiaban',
    prompt: '写学校的一次消防疏散演练：从警报响起，到全校在操场集合完毕。',
    hint: '用时间词串起过程（9 时 30 分、30 秒后、3 分 10 秒）；写出看到和听到的细节。',
    example: '上午 9 时 30 分，警铃骤然响起。“弯腰，捂住口鼻！”走廊里传来老师的口令。记者看到，同学们用湿毛巾捂着嘴，沿着墙边一个跟着一个快步下楼，没有一个人推挤。3 分 10 秒后，最后一个班在操场站定。校长举起秒表：比上学期快了 40 秒。',
  },
  {
    name: '艺术节开幕', pic: 'haimian',
    prompt: '写校园艺术节开幕式：从候场到第一个节目谢幕。',
    hint: '先写等待时的紧张，再写关键的一刻，最后写现场反应；插一句背景（准备了多久）。',
    example: '下午 2 时，礼堂座无虚席。后台，合唱队的同学一遍遍整理衣领。为了这四分钟，她们已经利用午休排练了一个多月。2 时 10 分，大幕拉开，第一个音符响起，台下一下安静了。歌声落下，掌声持续了足足半分钟。',
  },
  {
    name: '社区义诊', pic: 'jianjin',
    prompt: '写一次社区义诊或志愿服务活动的现场。',
    hint: '记者视角：“记者看到……”“记者注意到……”；用人物的原话增加真实感。',
    example: '早上 8 点不到，社区广场的桌子前已经排起长队。记者看到，一位医生俯下身子，一边给老人量血压，一边大声报数：“一百三，不高！”老人笑了：“那我今天多走两圈。”到上午 11 时，义诊共接待居民一百二十余人次。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    document.getElementById('axis').addEventListener('click', (e) => {
      const b = e.target.closest('.ax');
      if (b) showNode(+b.dataset.i);
    });
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-axis') && step >= 1) showNode(Math.min(step, NODES.length) - 1);
  },
};
