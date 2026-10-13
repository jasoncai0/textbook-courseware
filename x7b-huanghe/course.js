'use strict';
/* 黄河颂 · 本课数据与互动：朗诵版式的朗读符号、批注示例、批注工作台、合唱式朗诵设计。通用部分见 ../shared/narrative.js */

/* 直接抒情的句子 */
const PICKS = {
  way: [
    { t: '啊！黄河！你是中华民族的摇篮！', ok: true, why: '呼告 + 赞美' },
    { t: '惊涛澎湃，掀起万丈狂澜；', ok: false, why: '描写黄河的气势' },
    { t: '我们祖国的英雄儿女，将要学习你的榜样，', ok: true, why: '直接表明决心' },
    { t: '浊流宛转，结成九曲连环；', ok: false, why: '描写黄河的形态' },
    { t: '啊！黄河！你是伟大坚强，', ok: true, why: '呼告 + 赞叹' },
    { t: '从昆仑山下奔向黄海之边；', ok: false, why: '描写黄河的流向' },
    { t: '像你一样的伟大坚强！', ok: true, why: '反复，抒发豪情' },
    { t: '把中原大地劈成南北两面。', ok: false, why: '描写，“劈”字见气势' },
  ],
};

/* 课文旁的批注示例 */
const PIZHU = [
  { line: '它表现出我们民族的精神：伟大而又坚强！', note: '点出黄河是中华民族精神的象征。', angle: '内容 · 象征意义' },
  { line: '我站在高山之巅，望黄河滚滚，奔向东南。', note: '“望”引出对黄河形象的描写，有画面感。', angle: '写法 · 描写' },
  { line: '啊！黄河！你是中华民族的摇篮！', note: '转入“颂”。直抒胸臆。', angle: '结构 + 抒情方式' },
  { line: '啊！黄河！你一泻万丈，浩浩荡荡，', note: '“啊！黄河！”反复出现，营造出一种回环往复的韵律美。', angle: '修辞 · 韵律' },
  { line: '像你一样的伟大坚强！像你一样的伟大坚强！', note: '结尾铿锵有力，庄严豪迈！', angle: '感受 · 评价' },
];

function initPizhu() {
  const box = document.getElementById('pzList');
  box.innerHTML = PIZHU.map((p) => `<button type="button" class="pz-card"><span class="pz-line">${p.line}</span>
    <span class="pz-note">批注：${p.note}</span><span class="pz-angle">角度：${p.angle}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.pz-card');
    if (c) c.classList.toggle('open');
  });
}

/* 批注工作台 */
const BENCH_LINES = ['黄河以它英雄的气魄，出现在亚洲的原野；', '望黄河滚滚，奔向东南。', '惊涛澎湃，掀起万丈狂澜；', '浊流宛转，结成九曲连环；',
  '把中原大地劈成南北两面。', '你是中华民族的摇篮！', '像一个巨人出现在亚洲平原之上，', '筑成我们民族的屏障。', '向南北两岸伸出千万条铁的臂膀。', '像你一样的伟大坚强！'];
const ANGLES = ['词语', '修辞', '描写', '情感', '疑问'];
const BENCH_EG = { i: 4, a: '词语', t: '“劈”字用得好：黄河像一把巨斧，把大地一分为二，写出了它不可阻挡的力量。' };

function initBench() {
  const $ = (id) => document.getElementById(id);
  let pick = -1;
  let angle = ANGLES[0];
  const notes = BENCH_LINES.map(() => []);
  const draw = () => {
    $('benchLines').innerHTML = BENCH_LINES.map((l, i) => `<div class="bl${i === pick ? ' cur' : ''}" data-i="${i}"><span>${l}</span>
      ${notes[i].map((n) => `<small><b>${n.a}</b>${n.t}</small>`).join('')}</div>`).join('');
    $('benchPick').textContent = pick < 0 ? '还没有选句子' : BENCH_LINES[pick];
    $('benchAngles').innerHTML = ANGLES.map((a) => `<button type="button" class="btn${a === angle ? ' solid' : ''}" data-a="${a}">${a}</button>`).join('');
  };
  const add = (i, a, t) => { notes[i].push({ a, t }); draw(); };
  $('benchLines').addEventListener('click', (e) => {
    const l = e.target.closest('.bl');
    if (l) { pick = +l.dataset.i; draw(); }
  });
  $('benchAngles').addEventListener('click', (e) => {
    const b = e.target.closest('[data-a]');
    if (b) { angle = b.dataset.a; draw(); }
  });
  $('benchAdd').addEventListener('click', () => {
    const t = $('benchText').value.trim();
    if (pick < 0) { $('benchMsg').textContent = '先在左边点选一句诗。'; return; }
    if (!t) { $('benchMsg').textContent = '先写下批注内容。'; return; }
    add(pick, angle, t);
    $('benchText').value = '';
    $('benchMsg').textContent = '已贴上。再选一处试试？';
  });
  $('benchEg').addEventListener('click', () => { pick = BENCH_EG.i; add(BENCH_EG.i, BENCH_EG.a, BENCH_EG.t); });
  draw();
}

/* 合唱式朗诵：r 是参考方案 */
const CHOIR = [
  { t: '啊，朋友！……唱出我们的赞歌。（朗诵词）', r: '领' },
  { t: '我站在高山之巅，望黄河滚滚，奔向东南。', r: '男' },
  { t: '惊涛澎湃，掀起万丈狂澜；', r: '男' },
  { t: '浊流宛转，结成九曲连环；', r: '女' },
  { t: '从昆仑山下奔向黄海之边；把中原大地劈成南北两面。', r: '合' },
  { t: '啊！黄河！', r: '合' },
  { t: '你是中华民族的摇篮！……在你的身边扮演！', r: '女' },
  { t: '啊！黄河！', r: '合' },
  { t: '你是伟大坚强，……筑成我们民族的屏障。', r: '男' },
  { t: '啊！黄河！', r: '合' },
  { t: '你一泻万丈，浩浩荡荡，向南北两岸伸出千万条铁的臂膀。', r: '男' },
  { t: '我们民族的伟大精神，将要在你的哺育下发扬滋长！', r: '女' },
  { t: '我们祖国的英雄儿女，将要学习你的榜样，', r: '领' },
  { t: '像你一样的伟大坚强！像你一样的伟大坚强！（渐强）', r: '合' },
];
const ROLES = ['', '领', '男', '女', '合'];

function initChoir() {
  const box = document.getElementById('choir');
  const roles = CHOIR.map(() => '');
  const draw = () => {
    box.innerHTML = CHOIR.map((c, i) => `<div class="ch-row"><button type="button" class="ch-role r-${roles[i] || 'none'}" data-i="${i}">${roles[i] || '？'}</button><span>${c.t}</span></div>`).join('');
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.ch-role');
    if (!b) return;
    const i = +b.dataset.i;
    roles[i] = ROLES[(ROLES.indexOf(roles[i]) + 1) % ROLES.length];
    draw();
  });
  document.getElementById('choirRef').addEventListener('click', () => { CHOIR.forEach((c, i) => { roles[i] = c.r; }); draw(); });
  document.getElementById('choirClear').addEventListener('click', () => { roles.fill(''); draw(); });
  draw();
}

function initRhythm() {
  document.querySelectorAll('.rhythm-btn').forEach((btn) => btn.addEventListener('click', () => {
    const on = btn.closest('.slide').classList.toggle('marks-on');
    btn.textContent = on ? '隐藏朗读符号' : '显示朗读符号';
  }));
}

const MOMENTS = [
  {
    name: '颂一条河', pic: 'kuanglan',
    prompt: '选家乡的一条河（或一座山、一棵老树），学《黄河颂》写几行诗：先描写它的样子，再用“啊！……！”呼告，最后反复一句收尾。',
    hint: '描写要具体（颜色、声音、动作），呼告要真诚，不要空喊。',
    example: '我站在石桥上，\n看小河弯弯，\n绕过整个村庄。\n春天，它捧来桃花；\n秋天，它照着稻浪。\n啊！小河！\n你是我们村的血脉，\n你把日子流成了诗行。\n我要像你一样，\n不停地向远方流淌！',
  },
  {
    name: '间接抒情试一试', pic: 'jiuqu',
    prompt: '不出现“爱”“喜欢”“赞美”这样的词，只描写一处景物，让读者感到你的情感。',
    hint: '选最能代表你心情的几个细节，用比喻、拟人让它们“活”起来。',
    example: '放学路上的那排梧桐，叶子一片片黄了，风一吹，就在脚边打着旋儿，好像在追着我回家。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initRhythm();
    initPizhu();
    initBench();
    initChoir();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
