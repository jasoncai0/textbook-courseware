'use strict';
/* 白鹅 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：“高傲”三联漫画 + 吃相四格连环画、鸭鹅步调动画、直接夸 / 明贬实褒判一判（比较两位作家）。
 */

/* ================= 判一判：每句选一种写法（样式仿 .sort-row，类名 .jd-row 另起，免得和分类页混在一起） ================= */
function initJudge(list, items, kinds) {
  list.innerHTML = items.map((it, i) => `<div class="jd-row" data-i="${i}">
    <span class="s">${it.s}<small>${it.from}</small></span>
    <span class="btns">${kinds.map((k) => `<button class="btn" type="button" data-k="${k}">${k}</button>`).join('')}</span>
    <span class="res"></span></div>`).join('');
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-k]');
    if (!btn) return;
    const row = btn.closest('.jd-row');
    const item = items[+row.dataset.i];
    row.classList.remove('no');
    if (btn.dataset.k === item.ok) {
      row.classList.add('ok');
      row.querySelectorAll('button').forEach((b) => b.classList.toggle('solid', b === btn));
      row.querySelector('.res').textContent = `→ ${item.q}`;
    } else {
      void row.offsetWidth; // 重新触发抖动动画
      row.classList.add('no');
      row.querySelector('.res').textContent = '再想想';
    }
  });
}

const JUDGE_KINDS = ['直接夸', '明贬实褒'];
const JUDGE = [
  { s: '这种古怪的小动物，真让人觉得可爱。', from: '老舍《猫》', ok: '直接夸', q: '直接说“可爱”' },
  { s: '我们这位鹅老爷的脾气', from: '丰子恺《白鹅》', ok: '明贬实褒', q: '笑它摆架子，其实很亲' },
  { s: '它们是那么生气勃勃，天真可爱！', from: '老舍《猫》', ok: '直接夸', q: '直接夸小猫' },
  { s: '鹅便昂首大叫，似乎责备人们供养不周。', from: '丰子恺《白鹅》', ok: '明贬实褒', q: '像在告状，好笑又可爱' },
  { s: '因此鹅吃饭时，非有一个人侍候不可，真是架子十足！', from: '丰子恺《白鹅》', ok: '明贬实褒', q: '像埋怨，其实喜爱' },
  { s: '院中的花草可遭了殃。', from: '老舍《猫》', ok: '明贬实褒', q: '老舍有时也这样写' },
];

const SORT = [
  { s: '厉声呵斥', ok: ['叫声'], q: '叫声像在骂人' },
  { s: '引吭大叫', ok: ['叫声'], q: '伸长脖子大叫' },
  { s: '大模大样', ok: ['步态'], q: '走路神气' },
  { s: '傲然地站着　毫不相让', ok: ['步态'], q: '见人也不让路' },
  { s: '三眼一板，一丝不苟', ok: ['吃相'], q: '吃饭讲究顺序' },
  { s: '架子十足', ok: ['吃相'], q: '非有人侍候不可' },
  { s: '昂首大叫', ok: ['吃相', '叫声'], q: '饭没了，还“责备”人' },
];

const CLUES = [
  { q: '鹅老爷', a: '把鹅叫成“老爷”，笑它摆架子；能这样开玩笑，说明把它当成了家里的一员。' },
  { q: '像饭馆里的堂倌一样（人侍候鹅）', a: '人倒成了伺候鹅的“服务员”——好笑，也看出主人对鹅的宠爱。' },
  { q: '似乎责备人们供养不周', a: '鹅当然不会“责备”，是作者把它想成了发脾气的老爷，越想越好笑。' },
  { q: '真是架子十足！', a: '像在埋怨，其实是笑着说的：这只鹅真有个性！' },
];

const MOMENTS = [
  { name: '帮我找小羊', pic: 'butai', prompt: '星期天放羊回来，最喜爱的一只小羊不见了，请小伙伴帮忙找。',
    hint: '要写清它和别的羊不一样的地方（样子、叫声、习惯）。', example: '我的小羊个子比别的羊小一圈，左眼圈是黑色的，像戴了半副墨镜。它特别爱跟人，一听见我吹口哨就“咩咩”地跑过来……' },
  { name: '请邻居喂小狗', pic: 'chifan', prompt: '全家外出旅行，请邻居帮忙喂养小狗。',
    hint: '重点写它吃饭的习惯，可以学《白鹅》写吃相。', example: '我家小狗吃饭可讲究了：先吃肉，再喝水，最后才肯吃狗粮。要是只给狗粮，它就趴在碗边一动不动，好像在说：“肉呢？”' },
  { name: '请同学收养小猫', pic: 'gaoao', prompt: '要搬家了，想请一位同学收养你的小猫。',
    hint: '多写它可爱的地方，让同学愿意收养。', example: '……' },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['叫声', '步态', '吃相'], clues: CLUES, clueLabels: ['字面上', '其实'], moments: MOMENTS });
    initJudge(document.getElementById('judge'), JUDGE, JUDGE_KINDS);
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    document.querySelectorAll('video.cm-pic').forEach((v) => {
      if (v.closest('.slide') === slide && step >= 3) v.play().catch(() => { /* 素材未生成或浏览器拒绝自动播放 */ });
      else v.pause();
    });
  },
};
