'use strict';
/* 老王 · 本课数据与本课独有的“细节聚光灯”。通用页面逻辑见 ../shared/narrative.js */

/* 聚光灯：每处细节的批注（序号与 index.html 里 .sp[data-n] 一致） */
const SPOTS = [
  { k: '肖像 · 动作', t: '“镶嵌”：人像嵌在门框里一样，直僵僵的，不能弯曲——病得只剩一副骨架，还是撑着来了。' },
  { k: '肖像 · 神态', t: '面色死灰、两眼结翳：已经病入膏肓，连哪只眼瞎都分不清了。' },
  { k: '肖像（夸张的比喻）', t: '“骷髅上绷着一层枯黄的干皮”：瘦到极点；“说得可笑些”——作者用笑掩着心里的惊恐与难过。' },
  { k: '动作', t: '“直着脚往里走，对我伸出两手”：一句话不多说，急着把东西交到“我”手里——这是他最后的心愿。' },
  { k: '“我”的感受', t: '记不清十个还是二十个，“多得数不完”：老王几乎把能给的都拿来了，这份情义在“我”心里重得数不清。' },
  { k: '语言', t: '“我不吃。”三个字：也许自知不久于人世，也许舍不得吃——好东西要留给恩人。' },
  { k: '语言', t: '“我不是要钱。”赶忙止住：他是来道谢的，不是来做买卖的——他把“我们”当亲人。' },
  { k: '“我”的语言', t: '两个“我知道”，一个“不过”：“我”懂他的心意，又怕他吃亏，只好找个理由付钱——善意里，仍隔着一层钱。' },
  { k: '细节', t: '“灰不灰、蓝不蓝的方格子破布”：穷到只有一块破布，却用它把鸡蛋包得好好的。' },
  { k: '动作 · 神态', t: '“一手拿着布，一手攥着钱，滞笨地转过身子”：钱攥在手里，心意没被收下——失落、无奈，也是病重的样子。' },
  { k: '“我”的心理', t: '“直担心他半楼梯摔倒”：“我”是真关心他。' },
  { k: '“我”的心理', t: '“回屋才感到抱歉，没请他坐坐喝口茶水”：事后的抱歉——“愧怍”的第一粒种子。' },
  { k: '“我”的心理', t: '“可是我害怕得糊涂了”：被他的样子吓住了，这是实话；可这句解释里，也藏着作者对自己的不原谅。' },
];

/* 愧怍：为什么心上不安（积累拓展五） */
const PICKS = {
  why: [
    { t: '因为吃了他的香油和鸡蛋', ok: false, why: '课文说：“都不是。”' },
    { t: '老王把“我们”当亲人，“我”只把他当需要同情、帮助的人', ok: true, why: '情感上不对等' },
    { t: '老王送来的是情义，“我”还给他的却是钱', ok: true, why: '没能用情义回报情义' },
    { t: '因为他来表示感谢，我却拿钱去侮辱他', ok: false, why: '课文说：“都不是。”“我”付钱并无恶意' },
    { t: '他临终前来看“我”，“我”连坐坐、喝口茶都没请他', ok: true, why: '错过了最后的机会' },
    { t: '同是在艰难的年代，“我”比他幸运得多，却没能给他更多关怀', ok: true, why: '幸运者对不幸者的自省' },
  ],
};

/* 读写迁移 */
const MOMENTS = [
  {
    name: '写一位身边的劳动者', pic: 'songbing',
    prompt: '写一位你常见到的普通劳动者（保安、保洁员、快递员、早餐店老板……），抓住一个最打动你的细节。',
    hint: '一个动作、一句话、一件物品都可以。像“抱着冰上三楼”“攥着钱”一样，写得具体、写出分寸。',
    example: '每天早上，校门口的保安叔叔都会站得笔直。那天下大雨，他的伞却一直斜在我们这边，自己半个肩膀湿透了，帽檐上往下滴水，他也只是笑着说：“慢点走，地滑。”',
  },
  {
    name: '补写：老王回家的路', pic: 'menkuang',
    prompt: '“我不能想象他是怎么回家的。”试着想象：老王攥着钱，一级一级下了楼，他一路上在想什么？',
    hint: '用老王的眼光写：他的身体、他的心情、那块方格子破布、手里的钱。',
    example: '楼梯真长啊。老王扶着墙，一级一级往下挪。手里的钱被攥得发热。“她还是给了钱……也好，她心里踏实。”他把那块方格子破布塞进怀里，那是他最后一件能送人的东西了。',
  },
  {
    name: '“我”想对老王说', pic: 'xiangyou',
    prompt: '几年后，作者“渐渐明白”了。如果还能见老王一面，她会说什么？',
    hint: '想想她“愧怍”的是什么：没请他坐坐？用钱回报情义？',
    example: '老王，那天你来，我该请你进屋坐坐，倒一碗热茶，像朋友那样跟你说说话。你送来的不是香油和鸡蛋，是一颗心；我还给你的，却只是几张钱。',
  },
];

/* 聚光灯：点亮的句子（分步或点击）显示批注 */
function showSpot(slide, sp) {
  slide.querySelectorAll('.sp').forEach((x) => x.classList.toggle('cur', x === sp));
  sp.classList.add('lit');
  const s = SPOTS[+sp.dataset.n];
  slide.querySelector('.spot-note').innerHTML = `<small>${s.k}</small>${s.t}`;
}
function initSpots() {
  document.querySelectorAll('.spot-text').forEach((box) => box.addEventListener('click', (e) => {
    const sp = e.target.closest('.sp');
    if (!sp) return;
    sp.classList.add('clicked');
    showSpot(box.closest('.slide'), sp);
  }));
}
function updateSpots(slide, step) {
  if (!slide.classList.contains('s-spot')) return;
  slide.querySelectorAll('.sp').forEach((sp) => sp.classList.toggle('lit', +sp.dataset.step <= step || sp.classList.contains('clicked')));
  const now = slide.querySelector(`.sp[data-step="${step}"]`);
  if (now) showSpot(slide, now);
}

/* 加点词：去掉读一读 */
function initDots() {
  document.querySelector('.dot-rows').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const off = btn.closest('.dot-row').classList.toggle('no-dot');
    btn.textContent = off ? '加上读读' : '去掉读读';
  });
}

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS, picks: PICKS });
    initSpots();
    initDots();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateSpots(slide, step);
  },
};
