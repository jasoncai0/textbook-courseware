'use strict';
/* 竹节人 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：段落地图（三个任务各读哪几段）、竹节人木偶（松紧 / 动起来 / 对打 / 卡住）、步骤排序。
 */

/* ================= 段落地图：全文 29 个自然段，任务不同，细读的段落不同 ================= */
const PARAS = ['玩具自己做', '迷上斗竹节人', '怎样做竹节人', '毛笔总弄丢', '破课桌有裂缝', '裂缝正好玩', '发明者也坐破桌',
  '嵌入裂缝拉紧', '一松一紧对打', '线卡住挨揍', '齐天小圣', '金钩大王', '偃月刀、蛇矛', '古战场', '橡皮脑袋磕飞',
  '胡乱耸动', '黑虎掏心', '咚锵咚锵', '下课围观', '上课偷玩', '被老师发现', '竹节人被没收', '想去窗下捡',
  '同桌趴窗看', '看见了什么', '老师在玩', '神情一模一样', '相视一笑', '怨恨化为乌有'];
const PMAP_LEVELS = { deep: '细读', key: '参考', skim: '浏览' };
const PMAP_MODES = {
  t1: {
    label: '任务一：写制作指南，教别人玩', deep: [3, 8, 9, 10], key: [5, 6, 11, 12, 13],
    note: '先快速读全文，找到相关内容，再仔细读：第 3 段讲<b>怎么做</b>，第 8—10 段讲<b>怎么玩</b>；第 5、6 段的课桌裂缝、第 11—13 段的“兵器”可以作参考。',
  },
  t2: {
    label: '任务二：体会传统玩具的乐趣', deep: [1, 2, 4, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 26, 27], key: [],
    note: '特别注意写“我们”<b>投入地做玩具、玩玩具</b>的部分（主要在第 1—20 段），连老师也玩得“忘乎所以”（第 26、27 段）。边读边想象画面。',
  },
  t3: {
    label: '任务三：讲一个有关老师的故事', deep: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], key: [],
    note: '主要关注老师<b>没收玩具、玩玩具</b>的内容（第 20—29 段），梳理故事的起因、经过、结果。前面的部分浏览一下，知道“我们”迷上了斗竹节人就行。',
  },
};

function initPmap(box) {
  const keys = box.dataset.modes.split(',');
  const levels = Object.entries(PMAP_LEVELS).map(([k, t]) => `<span><i class="lv-${k}"></i>${t}</span>`).join('');
  box.innerHTML = `<div class="btns pmap-btns">${keys.map((k) => `<button class="btn" type="button" data-mode="${k}">${PMAP_MODES[k].label}</button>`).join('')}</div>
    <ol class="pmap-grid">${PARAS.map((t, i) => `<li data-n="${i + 1}"><b>${i + 1}</b>${t}</li>`).join('')}</ol>
    <p class="pmap-legend">${levels}</p>
    <p class="tip gold pmap-note" hidden></p>`;
  const select = (k) => {
    const m = PMAP_MODES[k];
    box.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('solid', b.dataset.mode === k));
    box.querySelectorAll('.pmap-grid li').forEach((li) => {
      const n = +li.dataset.n;
      li.className = m.deep.includes(n) ? 'deep' : m.key.includes(n) ? 'key' : 'skim';
    });
    const note = box.querySelector('.pmap-note');
    note.innerHTML = m.note;
    note.hidden = false;
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (b) select(b.dataset.mode);
  });
  if (keys.length === 1) select(keys[0]);
}

/* ================= 竹节人木偶：一个身躯 + 八截四肢，角度由“线的松紧”决定 ================= */
const ARM = [24, 22];
const LEG = [28, 28];
// 角度以“竖直向下”为 0，顺时针为正：左侧肢体正值向外张，右侧镜像
const SLACK = { a1: 10, a2: 5, b1: 50, b2: -95, tilt: 10 };
const TIGHT = { a1: 95, a2: 80, b1: 24, b2: -10, tilt: 0 };
const STUCK = { a1: 35, a2: 10, b1: 18, b2: -4, tilt: -14 }; // 线卡住：呆头呆脑，挺着肚子
const JOINTS = Object.keys(TIGHT);
const rad = (d) => d * Math.PI / 180;
const rand = (a, b) => a + Math.random() * (b - a);
const mix = (t) => Object.fromEntries(JOINTS.map((k) => [k, SLACK[k] + (TIGHT[k] - SLACK[k]) * t]));

function limbSvg(cls, x, y, [l1, l2], w) {
  return `<g class="${cls}" transform="translate(${x} ${y})">
    <line class="thread" x1="0" y1="0" x2="0" y2="${l1}"/><rect class="seg" x="${-w / 2}" y="1" width="${w}" height="${l1 - 2}" rx="3"/>
    <g class="lower" transform="translate(0 ${l1})"><line class="thread" x1="0" y1="0" x2="0" y2="${l2}"/><rect class="seg" x="${-w / 2 + .5}" y="1" width="${w - 1}" height="${l2 - 2}" rx="3"/></g>
  </g>`;
}

function buildFigure(g) {
  g.innerHTML = `<g class="body">
    ${limbSvg('aL', -13, -62, ARM, 10)}${limbSvg('aR', 13, -62, ARM, 10)}
    ${limbSvg('lL', -7, -2, LEG, 12)}${limbSvg('lR', 7, -2, LEG, 12)}
    <rect class="seg torso" x="-13" y="-80" width="26" height="80" rx="4"/>
    <ellipse class="hole" cx="0" cy="-78" rx="11" ry="3.2"/>
    <circle class="hole" cx="-13" cy="-62" r="2.4"/><circle class="hole" cx="13" cy="-62" r="2.4"/>
  </g>`;
  return { g, cur: { ...SLACK }, target: { ...SLACK }, lunge: 0, lungeTarget: 0 };
}

function setLimb(g, sel, base, a1, a2) {
  const limb = g.querySelector(sel);
  limb.setAttribute('transform', `${base} rotate(${a1.toFixed(1)})`);
  limb.querySelector('.lower').setAttribute('transform', `translate(0 ${sel.startsWith('.a') ? ARM[0] : LEG[0]}) rotate(${a2.toFixed(1)})`);
}

function drawFigure(f) {
  const p = f.cur;
  // 脚踩在原点（裂缝）上：按腿的角度算出胯的高度
  const hip = 2 + LEG[0] * Math.cos(rad(p.b1)) + LEG[1] * Math.cos(rad(p.b1 + p.b2));
  f.g.querySelector('.body').setAttribute('transform', `translate(0 ${(-hip).toFixed(1)}) rotate(${p.tilt.toFixed(1)})`);
  setLimb(f.g, '.aL', 'translate(-13 -62)', p.a1, p.a2);
  setLimb(f.g, '.aR', 'translate(13 -62)', -p.a1, -p.a2);
  setLimb(f.g, '.lL', 'translate(-7 -2)', p.b1, p.b2);
  setLimb(f.g, '.lR', 'translate(7 -2)', -p.b1, -p.b2);
}

/* ---------- 第 5 页：松紧滑块、动起来、对打、卡住 ---------- */
const MOVES = ['黑虎掏心！', '泰山压顶！', '双龙抢珠！', '咚锵咚锵咚咚锵！'];
const BEAT_MS = 220;
const play = { figs: [], mode: 'still', tension: 0, timer: null, raf: null, lastStep: null };

function jitter(base, k) {
  return { a1: base.a1 + rand(-35, 25) * k, a2: base.a2 + rand(-40, 30) * k, b1: base.b1 + rand(-10, 12) * k, b2: base.b2 + rand(-12, 10) * k, tilt: base.tilt + rand(-8, 8) * k };
}

function beat() {
  const [a, b] = play.figs;
  const t = play.tension;
  const bang = document.getElementById('bang');
  const lively = () => jitter(mix(rand(.55, 1)), 1);
  if (play.mode === 'dance') {
    a.target = lively();
    b.target = mix(t);
    a.lungeTarget = 0; b.lungeTarget = 0;
    bang.textContent = '';
  } else if (play.mode === 'fight' || play.mode === 'stuck') {
    a.target = lively();
    a.lungeTarget = Math.random() < .5 ? rand(18, 34) : 0;
    if (play.mode === 'fight') {
      b.target = lively();
      b.lungeTarget = a.lungeTarget ? 0 : rand(18, 34);
      if (Math.random() < .3) bang.textContent = MOVES[Math.floor(Math.random() * MOVES.length)];
    } else {
      b.target = { ...STUCK };
      b.lungeTarget = a.lungeTarget ? -6 : 0; // 挨了一下，往后一晃
      bang.textContent = '呆头呆脑，挺着肚子净挨揍';
    }
  }
}

function animate() {
  let moving = false;
  play.figs.forEach((f) => {
    JOINTS.forEach((k) => {
      const d = f.target[k] - f.cur[k];
      if (Math.abs(d) > .2) moving = true;
      f.cur[k] += d * .3;
    });
    f.lunge += (f.lungeTarget - f.lunge) * .3;
    f.g.closest('.lunge').setAttribute('transform', `translate(${f.lunge.toFixed(1)} 0)`);
    drawFigure(f);
  });
  play.raf = moving || play.mode !== 'still' ? requestAnimationFrame(animate) : null;
}
const kick = () => { if (!play.raf) play.raf = requestAnimationFrame(animate); };

function setMode(mode) {
  play.mode = mode;
  clearInterval(play.timer);
  play.timer = null;
  document.querySelectorAll('[data-play]').forEach((b) => b.classList.toggle('solid', b.dataset.play === mode));
  if (mode === 'still') {
    play.figs.forEach((f) => { f.target = mix(play.tension); f.lungeTarget = 0; });
    document.getElementById('bang').textContent = '';
  } else {
    beat();
    play.timer = setInterval(beat, BEAT_MS);
  }
  kick();
}

function setTension(t) {
  play.tension = t;
  document.getElementById('tension').value = Math.round(t * 100);
  if (play.mode === 'still') { play.figs.forEach((f) => { f.target = mix(t); }); kick(); }
}

function initPlay() {
  play.figs = [buildFigure(document.getElementById('figA')), buildFigure(document.getElementById('figB'))];
  play.figs.forEach(drawFigure);
  document.getElementById('tension').addEventListener('input', (e) => {
    if (play.mode !== 'still') setMode('still');
    setTension(e.target.value / 100);
  });
  document.querySelector('.play-ctrl').addEventListener('click', (e) => {
    const b = e.target.closest('[data-play]');
    if (!b) return;
    if (b.dataset.play === 'stop') { setMode('still'); return; }
    if (play.tension < .5) setTension(1); // 玩之前先把线拉紧
    setMode(b.dataset.play);
  });
}

// 讲到哪一句，木偶就演到哪一步；离开本页就停
const PLAY_BY_STEP = ['still', 'still', 'still', 'dance', 'fight', 'stuck'];
function syncPlay(slide, step) {
  if (!slide.classList.contains('s-play')) {
    if (play.mode !== 'still') setMode('still');
    play.lastStep = null;
    return;
  }
  if (play.lastStep === step) return;
  play.lastStep = step;
  setTension(step >= 1 ? 1 : 0);
  setMode(PLAY_BY_STEP[step] || 'still');
}

/* ================= 第 6 页：做法排序 ================= */
const ORDER = ['把毛笔杆锯成寸把长的一截，当脑袋连同身躯', '在上面钻一对小眼，供装手臂用', '再锯八截短的，分别当四肢', '用一根纳鞋底的线把它们穿在一起'];
const ORDER_SHOWN = [2, 0, 3, 1];

function initOrder(box) {
  let next = 0;
  box.innerHTML = ORDER_SHOWN.map((i) => `<button class="order-card" type="button" data-i="${i}"><em></em>${ORDER[i]}</button>`).join('');
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.order-card');
    if (!card || card.classList.contains('right')) return;
    card.classList.remove('wrong');
    void card.offsetWidth; // 重新触发抖动动画
    if (+card.dataset.i === next) {
      next += 1;
      card.classList.add('right');
      card.querySelector('em').textContent = next;
      document.getElementById('orderDone').hidden = next < ORDER.length;
    } else {
      card.classList.add('wrong');
    }
  });
}

/* ================= 记叙文模板数据 ================= */
const PLOT = [
  { step: 1, stage: '起因', text: '上课偷玩，被虎视眈眈的老师看出破绽', pic: 'pingfeng', x: 11, y: 96 },
  { step: 2, stage: '经过', text: '老师一拂“屏风”，没收了竹节人', pic: 'moshou', x: 30, y: 82 },
  { step: 2, stage: '经过', text: '下课溜到办公室窗下，想捡回竹节人', pic: 'toukan', pos: '80% 40%', x: 50, y: 66 },
  { step: 3, stage: '结果', text: '看见老师自己在玩，玩得入迷', pic: 'toukan', pos: '35% 45%', x: 70, y: 48 },
  { step: 3, stage: '结果', text: '相视一笑，怨恨和沮丧化为乌有', pic: 'toukan', x: 90, y: 66 },
];

const KINDS = ['做竹节人', '斗竹节人', '看斗竹节人'];
const SORT_ITEMS = [
  { s: '那一段时间，妈妈怪我总是把毛笔弄丢，而校门口卖毛笔的老头则生意特别好。', ok: ['做竹节人'], q: '人人锯毛笔做竹节人' },
  { s: '……号称“齐天小圣”，四个字歪歪斜斜刻在竹节人背上，神气！', ok: ['做竹节人'], q: '装扮、取名号，真得意' },
  { s: '两个竹节人放在一起，那就是搏斗了，没头没脑地对打着，不知疲倦，也永不会倒下。', ok: ['斗竹节人'], q: '打不完，越斗越带劲' },
  { s: '黑虎掏心！泰山压顶！双龙抢珠！咚锵咚锵咚咚锵！咚咚锵！', ok: ['斗竹节人'], q: '喊招式、配锣鼓，像演武戏' },
  { s: '吸引了一圈黑脑袋，攒着观战，还跺脚拍手，咋咋呼呼，好不热闹。', ok: ['看斗竹节人'], q: '看的人也热闹入迷' },
  { s: '偏偏后面的同学不知趣，看得入了迷，伸长脖子，恨不能从我们肩膀上探过来……', ok: ['看斗竹节人'], q: '看得忘了在上课' },
];

const CLUE_LABELS = ['没收竹节人时……', '窗外看见的……'];
const CLUES = [
  { q: '被那<b>虎视眈眈</b>的老师看出了破绽。', a: '嘴里念念有词，<b>全神贯注，忘乎所以</b>，一点儿也没注意到我们在偷看。' },
  { q: '老师大步流星走过来，<b>怒气冲冲</b>伸手一拂，“屏风”颓然倒了……', a: '只见老师在他自己的办公桌上，<b>玩着</b>刚才收去的那竹节人。双手在抽屉里扯着线……' },
  { q: '我们：不禁<b>沮丧得要命</b>……正<b>悻悻然</b>准备离去。', a: '我们：相视一笑，虽两手空空，但<b>心满意足</b>，轻手轻脚地溜了。' },
  { q: '我们希望老师能像往常一样，把没收的东西扯散了，随手扔出窗外。', a: '老师没有扔，他自己玩上了——“他脸上的神情，跟我们玩得<b>入迷</b>时一模一样。”' },
];

const MOMENTS = [
  {
    name: '看比赛入迷', pic: 'guanzhan',
    prompt: '学学“下课时，教室里摆开场子……好不热闹”，写一写你和同学看比赛、看热闹入迷的样子。',
    hint: '写动作（伸长脖子、跺脚拍手）、声音（咋咋呼呼），再写入迷的结果（常要等老师进来，才知道已经上课）。',
    example: '篮球赛只剩最后一分钟，场边的我们全踮起了脚，拳头攥得紧紧的。球一进框，大家跳起来又叫又拍，嗓子都喊哑了。直到上课铃响了好一阵，才想起下一节是数学课。',
  },
  {
    name: '老师玩竹节人', pic: 'toukan',
    prompt: '课文写老师玩竹节人“全神贯注，忘乎所以”。想象一下，他还会有哪些动作、神情？写几句。',
    hint: '从“双手在抽屉里扯着线，嘴里念念有词”展开：他念叨些什么？眉毛、嘴角是什么样子？',
    example: '老师弓着背，下巴快贴到桌面上了，双手在抽屉里一拉一放，嘴里小声念着：“看招！黑虎掏心！”竹节人一歪，他的身子也跟着一歪，眉毛一挑，嘴角都快咧到耳根了。',
  },
  {
    name: '做手工入迷', pic: 'zhizuo',
    prompt: '你有没有做一件事入迷、忘了时间的经历？做手工、读书、拼积木……选一件写一写。',
    hint: '学学语文园地里写罗丹的那段：用“一会儿……一会儿……”写动作，用“……过去了，……过去了”写时间。',
    example: '我捧着拼了一半的积木城堡，一会儿翻说明书，一会儿在零件堆里扒拉。一小时过去了，两小时过去了，妈妈喊了三遍吃饭，我才抬起头——窗外的天都黑了。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, kinds: KINDS, sort: SORT_ITEMS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    document.querySelectorAll('.pmap').forEach(initPmap);
    const makeFig = buildFigure(document.getElementById('makeFig'));
    makeFig.cur = { ...TIGHT };
    drawFigure(makeFig);
    initPlay();
    initOrder(document.getElementById('order'));
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    syncPlay(slide, step);
  },
};
