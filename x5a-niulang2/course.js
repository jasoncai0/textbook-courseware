'use strict';
/* 牛郎织女（二） · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 阅读提示 · 第 2 问：连环画。前 5 幅用第 10 课的画面；pic 为空的一幅留给学生自己构思 */
const L1 = '../x5a-niulang1/assets/';
const COMIC = [
  { pic: `${L1}fangniu.jpg`, cap: '牛郎从小受哥嫂虐待，只有老牛跟他亲密。' },
  { pic: `${L1}likai.jpg`, cap: '分家时，牛郎只要了老牛和破车，离开了家。' },
  { pic: `${L1}niuhua.jpg`, cap: '星光下，老牛开口说话，指点牛郎去湖边。' },
  { pic: `${L1}hubian.jpg`, cap: '牛郎在湖边拿起粉红色的纱衣，结识了织女。' },
  { pic: `${L1}xiangjian.jpg`, cap: '织女留在人间，和牛郎结为夫妻。' },
  { pic: 'assets/meiman.jpg', cap: '男耕女织，儿女双全，日子过得挺美满。' },
  { pic: '', cap: '老牛临死前嘱咐：留下我的皮，有急事就披上。' },
  { pic: 'assets/zhuaqu.jpg', cap: '王母娘娘闯进家门，抓走了织女。' },
  { pic: 'assets/zhuigan.jpg', cap: '牛郎披上牛皮，挑着一双儿女飞上天去追。' },
  { pic: 'assets/tianhe.jpg', cap: '王母娘娘拔下玉簪一划，出现了一条天河。' },
  { pic: 'assets/queqiao.jpg', cap: '每年七月初七，喜鹊搭桥，牛郎织女相会。' },
];

/* 讲故事 · 创造性复述 */
const RETELL = [
  {
    mode: '改个结尾',
    items: [
      { name: '如果追上了', prompt: '如果王母娘娘还没来得及拔下玉簪，牛郎就追上了，故事会怎样结束？',
        points: ['新结尾要合理：王母娘娘会轻易放手吗？', '牛郎、织女和孩子们会怎样做、怎样说？', '和原结尾比一比：人们为什么让他们“每年七月初七会一次面”？'],
        start: '眼看就要追上了，两个孩子伸出小手，拼命地喊“娘”。织女回过头，一下子挣开了王母娘娘的手……' },
      { name: '喜鹊来帮忙', prompt: '原结尾说喜鹊每年七月初七搭桥。如果喜鹊们决定每天都来，故事会怎样？',
        points: ['喜鹊们为什么愿意帮忙？', '王母娘娘知道了会怎样？', '结尾怎样让人觉得温暖？'],
        start: '牛郎织女分开以后，天河边的喜鹊们都看在眼里。一只老喜鹊说：“伙伴们，咱们不能只在七月初七去……”' },
    ],
  },
  {
    mode: '换个角色讲',
    items: [
      { name: '男孩的口吻', prompt: '用牛郎织女的儿子“我”的口吻，讲讲娘被抓走、爹挑着我们追上天的经过。',
        points: ['“我”看见了什么：怒气冲冲的老太婆、被拉走的娘', '“我”做了什么：拉住娘的衣裳，跑去找爹', '坐在筐里飞上天，“我”看见、听见了什么'],
        start: '那天，爹在地里干活，娘在家里织布。忽然，一个怒气冲冲的老太婆闯了进来，一把抓住娘就往外走。我冲过去拉住娘的衣裳……' },
      { name: '喜鹊的口吻', prompt: '用一只喜鹊的口吻，讲讲七月初七搭桥的事。',
        points: ['为什么那一天人们很少看见喜鹊', '搭桥时喜鹊们怎样一只接一只', '桥上的牛郎织女说了什么（合理想象）'],
        start: '每年农历七月初七，我和伙伴们天不亮就出发，往天河那儿飞。地上的人们找不到我们，可他们不知道，我们正忙着搭桥呢……' },
    ],
  },
  {
    mode: '添加情节',
    items: [
      { name: '织女不肯死心', prompt: '课文只说织女“不肯死心”，王母娘娘“也拗不过她”。织女是怎样坚持的？',
        points: ['织女在天上受了怎样的惩罚', '她怎样一次次地坚持', '王母娘娘为什么最后答应了'],
        start: '织女被关进了机房，可她不肯再织彩锦。王母娘娘问她：“你知错了吗？”织女抬起头说：“我没有错。我只想跟牛郎、跟孩子们在一块儿过日子……”' },
      { name: '演一演被带走', prompt: '口语交际的提示：表演织女被王母娘娘带走时的情形。',
        points: ['王母娘娘：怒气冲冲，一把抓住', '织女：心里恨极了，望着孩子不知怎么办', '男孩：拉住衣裳；最后一句“快去找你爹！”要喊出来'],
        start: '（王母娘娘冲进门，一把抓住织女的手腕）王母娘娘：“好大的胆子！跟我回去！”（男孩跑过来，拉住织女的衣裳）' },
    ],
  },
];

/* 连环画：点一点看参考配文 */
function initComic(box, panels) {
  box.innerHTML = panels.map((p, i) => `<button type="button" class="panel-card">
      <div class="panel-pic${p.pic ? '' : ' empty'}"${p.pic ? ` data-bg="${p.pic}"` : ''}>${p.pic ? '' : '这一幅，你来画'}</div>
      <span class="panel-no">${i + 1}</span><span class="panel-cap">${p.cap}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.panel-card');
    if (card) card.classList.toggle('show');
  });
}

/* 阅读提示 · 默读计时：字数从课件里的课文字幕统计 */
function initTimer() {
  const btn = document.getElementById('timerBtn');
  const face = document.getElementById('timerSec');
  const res = document.getElementById('timerRes');
  const chars = [...document.querySelectorAll('.scene .subs p')].map((p) => p.textContent).join('').replace(/[^一-鿿]/g, '').length;
  const SECONDS_PER_MIN = 60;
  const fmt = (s) => `${Math.floor(s / SECONDS_PER_MIN)}:${String(s % SECONDS_PER_MIN).padStart(2, '0')}`;
  let start = 0;
  let tick = null;
  btn.addEventListener('click', () => {
    if (!tick) {
      start = Date.now();
      face.textContent = '0:00';
      tick = setInterval(() => { face.textContent = fmt(Math.round((Date.now() - start) / 1000)); }, 1000);
      btn.textContent = '读完了';
      res.textContent = '专心读，不回读……';
      return;
    }
    clearInterval(tick);
    tick = null;
    const sec = Math.max(1, Math.round((Date.now() - start) / 1000));
    face.textContent = fmt(sec);
    btn.textContent = '再读一次';
    res.innerHTML = `课文约 <b>${chars}</b> 字，你用了 <b>${fmt(sec)}</b>，每分钟约 <b>${Math.round(chars / sec * SECONDS_PER_MIN)}</b> 字。`;
  });
}

/* 创造性复述：选讲法 → 选角度 → 看要点、听开头 */
function initRetell(box, modes) {
  const state = { m: 0, i: 0 };
  const draw = () => {
    const mode = modes[state.m];
    const it = mode.items[state.i];
    box.innerHTML = `<div class="rt-side">
        <div class="rt-modes">${modes.map((m, k) => `<button type="button" class="btn${k === state.m ? ' solid' : ''}" data-m="${k}">${m.mode}</button>`).join('')}</div>
        <div class="rt-items">${mode.items.map((x, k) => `<button type="button" class="rt-item${k === state.i ? ' on' : ''}" data-i="${k}">${x.name}</button>`).join('')}</div>
      </div>
      <div class="rt-card">
        <p class="rt-prompt">${it.prompt}</p>
        <ul class="rt-points">${it.points.map((p) => `<li>${p}</li>`).join('')}</ul>
        <button type="button" class="btn" data-start>听听开头</button>
        <p class="rt-start" hidden>${it.start}</p>
      </div>`;
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.m !== undefined) { state.m = +b.dataset.m; state.i = 0; draw(); }
    else if (b.dataset.i !== undefined) { state.i = +b.dataset.i; draw(); }
    else if (b.hasAttribute('data-start')) box.querySelector('.rt-start').hidden = false;
  });
  draw();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initComic(document.getElementById('comic'), COMIC);
    initRetell(document.getElementById('retell'), RETELL);
    initTimer();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
