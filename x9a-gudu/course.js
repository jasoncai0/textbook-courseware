'use strict';
/* 孤独之旅 · 本课数据。记叙文模板见 ../shared/narrative.js；
 * 本课独有：杜小康心理变化阶梯（小人一级级往上走）+ 环境描写 ↔ 心理配对 */

/* 心理阶梯：每级 [心理, 原文依据, 环境] */
const STAIRS = [
  { w: '茫然', q: '“我不去放鸭了，我要上岸回家……”', env: '已经不见油麻地 · 朦胧的树烟' },
  { w: '恐惧', q: '他害怕了——这是他出门以来第一回真正感到害怕。', env: '芦苇如绿色的浪潮直涌到天边' },
  { w: '孤独想家', q: '直至夜里做梦看到母亲，哇哇大哭起来', env: '一连十多天遇不到一个人' },
  { w: '适应', q: '就不会再忽然地恐慌起来。', env: '浮云 · 浩浩荡荡的芦苇 · 一缕炊烟' },
  { w: '坚强', q: '“还是分头去找吧。”说完，就又走了。', env: '暴风雨 · 一片黑海' },
  { w: '长大', q: '他觉得自己突然地长大了，坚强了。', env: '雨后天晴 · 蓝得透亮的天空' },
];
const ST = { x0: 40, dx: 118, y0: 345, dy: 46, w: 108 };

function buildStairs() {
  const svg = document.getElementById('stairSvg');
  svg.innerHTML = STAIRS.map((s, i) => {
    const x = ST.x0 + i * ST.dx;
    const y = ST.y0 - (i + 1) * ST.dy;
    return `<g class="gd-step" data-step="${i + 1}" data-i="${i}">
      <rect x="${x}" y="${y}" width="${ST.w + 10}" height="${ST.y0 - y + 10}" rx="6"/>
      <text class="gd-w" x="${x + ST.w / 2 + 5}" y="${y + 32}">${s.w}</text></g>`;
  }).join('') + '<g id="gdBoy" class="gd-boy"><circle cx="0" cy="-30" r="9"/><path d="M0 -21 L0 -2 M0 -14 L-9 -6 M0 -14 L9 -8 M0 -2 L-7 12 M0 -2 L7 12"/></g>';
}
buildStairs();

function moveBoy(i) {
  const boy = document.getElementById('gdBoy');
  const k = Math.max(0, i);
  const x = ST.x0 + k * ST.dx + ST.w / 2 + 5;
  const y = ST.y0 - (k + 1) * ST.dy - 2;
  boy.style.transform = `translate(${x}px, ${y}px)`;
  boy.style.opacity = i < 0 ? 0 : 1;
  document.querySelectorAll('.gd-step').forEach((g) => g.classList.toggle('sel', +g.dataset.i === i));
  const info = document.getElementById('stairInfo');
  if (i < 0) { info.innerHTML = '按 → 让杜小康一级一级往上走；也可以点台阶。'; return; }
  const s = STAIRS[i];
  info.innerHTML = `<b>${s.w}</b><span class="gd-q">${s.q}</span><small>环境：${s.env}</small>`;
}

function initStairs() {
  document.getElementById('stairSvg').addEventListener('click', (e) => {
    const g = e.target.closest('.gd-step');
    if (g) moveBoy(+g.dataset.i);
  });
  moveBoy(-1);
}

function updateStairs(slide, step) {
  if (!slide.querySelector('#stairSvg')) return;
  moveBoy(Math.min(step, STAIRS.length) - 1);
}

/* 环境 ↔ 心理配对：先点左边环境句，再点右边心理词 */
const ENV = [
  { k: '寂寞', t: '已经是陌生的天空和陌生的水面……没有其他声音，天地又如此空旷', why: '空旷陌生的水面，烘托出离家后的茫然与寂寞。' },
  { k: '恐惧', t: '芦荡如万重大山围住了小船。杜小康有一种永远逃不走了的感觉。', why: '比喻写芦荡的压迫感，直接引出“第一回真正感到害怕”。' },
  { k: '安慰', t: '水边的芦叶里，飞着无数萤火虫……居然能把水面照亮', why: '清香与萤火给孩子一点温柔的安慰——但“无论如何也不能完全驱除杜小康的恐慌”。' },
  { k: '磨难', t: '天黑，河水也黑，芦苇荡成了一片黑海。杜小康甚至觉得风也是黑的。', why: '暴风雨是对人物的考验，推动情节，也逼出了杜小康的坚强。' },
  { k: '成长', t: '雨后天晴，天空比任何一个夜晚都要明亮。', why: '风雨过后的明净天空，象征杜小康内心的成长与开朗。' },
];
const MOODS = ['恐惧', '成长', '寂寞', '磨难', '安慰'];

function initMatch() {
  const box = document.getElementById('gdMatch');
  box.querySelector('.gm-env').innerHTML = ENV.map((e, i) => `<button type="button" class="gm-e" data-i="${i}">${e.t}<small></small></button>`).join('');
  box.querySelector('.gm-moods').innerHTML = MOODS.map((m) => `<button type="button" class="gm-m" data-k="${m}">${m}</button>`).join('');
  let pick = null;
  box.addEventListener('click', (e) => {
    const env = e.target.closest('.gm-e');
    if (env && !env.classList.contains('ok')) {
      box.querySelectorAll('.gm-e').forEach((b) => b.classList.toggle('sel', b === env));
      pick = env;
      return;
    }
    const mood = e.target.closest('.gm-m');
    if (!mood || !pick || mood.classList.contains('used')) return;
    const item = ENV[+pick.dataset.i];
    if (item.k === mood.dataset.k) {
      pick.classList.remove('sel');
      pick.classList.add('ok');
      pick.querySelector('small').textContent = `${item.k}：${item.why}`;
      mood.classList.add('used');
      pick = null;
      const done = box.querySelectorAll('.gm-e.ok').length;
      box.querySelector('.gm-count b').textContent = done;
    } else {
      mood.classList.remove('no');
      void mood.offsetWidth; // 重新触发抖动动画
      mood.classList.add('no');
    }
  });
}

const MOMENTS = [
  {
    name: '我也“突然长大了”', pic: 'yuewan',
    prompt: '阅读提示：在生活中，你也有过“突然地长大了，坚强了”的感受吗？写一个片段。',
    hint: '学杜小康：先写当时的处境和害怕，再写一个转折的时刻（一件事、一句话、一片天空），最后写心里的变化。可以用一处环境描写烘托心情。',
    example: '那年暑假，妈妈住院，我第一次一个人坐公交车去送饭。车窗外的雨下个不停，我抱着保温桶，心怦怦直跳，生怕坐过站。走进病房，妈妈看见我，愣了一下，眼圈红了。回家的路上，雨停了，天边露出一道很淡的彩虹。我忽然觉得，自己好像长大了一点。',
  },
  {
    name: '题目的含义', pic: 'chufa',
    prompt: '阅读提示：结合课文，用两三句话说说题目“孤独之旅”的含义。',
    hint: '“旅”是什么旅？表面是放鸭的路途，深层呢？“孤独”对杜小康意味着什么？',
    example: '表面上，这是杜小康随父亲赶着鸭群、离家远行的放鸭之旅；深层看，这是一个少年在孤独和磨难中走向坚强的成长之旅。孤独压迫着他，也锤炼了他。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initStairs();
    initMatch();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateStairs(slide, step);
  },
};
