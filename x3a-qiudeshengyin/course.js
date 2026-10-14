'use strict';
/* 听听，秋的声音 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 本课独有：秋的音乐厅（声音条 + 电脑模拟的声音，只帮助想象） ================= */
const PLAYERS = [
  { who: '黄叶', snd: '唰唰', kind: 'shua', pic: 'huangye', pos: '50% 30%', line: '大树抖抖手臂，<b>“唰唰”</b>，是黄叶道别的话音。' },
  { who: '蟋蟀', snd: '㘗㘗', kind: 'qu', pic: 'xishuai', pos: '71% 88%', line: '蟋蟀振动翅膀，<b>“㘗㘗”</b>，是和阳台告别的歌韵。' },
  { who: '大雁', snd: '叮咛', kind: 'ding', pic: 'dayan', pos: '50% 20%', line: '一排排大雁追上白云，撒下一阵<b>暖暖的叮咛</b>；' },
  { who: '秋风', snd: '歌吟', kind: 'ge', pic: 'dayan', pos: '50% 85%', line: '一阵阵秋风掠过田野，送来一片<b>丰收的歌吟</b>。' },
];
const BARS = 12;
const PLAY_MS = 2600;
let audio = null;

function noiseBuffer(ctx) {
  const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i += 1) d[i] = Math.random() * 2 - 1;
  return buf;
}
// 一段声音：type=noise 用滤波噪声，否则用振荡器；env = [[时间, 音量]…]，freq = [[时间, 频率]…]
function voice(ctx, t0, { type, filter = 'bandpass', q = 1, env, freq }) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  env.forEach(([t, v]) => g.gain.linearRampToValueAtTime(v, t0 + t));
  let src;
  let target;
  if (type === 'noise') {
    src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx);
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = filter; f.Q.value = q;
    src.connect(f); f.connect(g);
    target = f.frequency;
  } else {
    src = ctx.createOscillator();
    src.type = type;
    src.connect(g);
    target = src.frequency;
  }
  target.setValueAtTime(freq[0][1], t0);
  freq.slice(1).forEach(([t, v]) => target.linearRampToValueAtTime(v, t0 + t));
  g.connect(ctx.destination);
  src.start(t0);
  src.stop(t0 + env[env.length - 1][0] + 0.05);
}
const SOUNDS = {
  shua: (ctx, t) => [0, 0.32, 1.1, 1.42].forEach((d) => voice(ctx, t + d, { type: 'noise', q: 0.8, env: [[0.04, 0.35], [0.26, 0]], freq: [[0, 2600], [0.26, 4200]] })),
  qu: (ctx, t) => [0, 0.09, 0.18, 0.7, 0.79, 0.88].forEach((d) => voice(ctx, t + d, { type: 'sine', env: [[0.01, 0.12], [0.05, 0]], freq: [[0, 4300], [0.05, 4100]] })),
  ding: (ctx, t) => [[0, 523], [0.55, 440], [1.2, 523], [1.75, 392]].forEach(([d, f]) => voice(ctx, t + d, { type: 'triangle', env: [[0.08, 0.18], [0.45, 0.1], [0.6, 0]], freq: [[0, f], [0.5, f * 0.97]] })),
  ge: (ctx, t) => voice(ctx, t, { type: 'noise', filter: 'lowpass', q: 4, env: [[0.6, 0.3], [1.2, 0.12], [1.8, 0.32], [2.5, 0]], freq: [[0, 300], [0.6, 900], [1.2, 400], [1.8, 1100], [2.5, 300]] }),
};
SOUNDS.mine = SOUNDS.ding;

function playSound(kind) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audio = audio || new AC();
    if (audio.state === 'suspended') audio.resume();
    SOUNDS[kind](audio, audio.currentTime + 0.02);
  } catch (e) { /* 没有声音也不影响看声音条 */ }
}

function playerHtml(p, i) {
  const pic = p.pic ? `<span class="hp-pic" data-bg="assets/${p.pic}.jpg" style="background-position:${p.pos}"></span>` : '<span class="hp-pic mine">♪</span>';
  return `<button type="button" class="hp eq-${p.kind}" data-i="${i}">${pic}<b class="hp-who"></b><span class="hp-snd"></span>
    <span class="eq">${Array.from({ length: BARS }, (_, k) => `<i style="--k:${k}"></i>`).join('')}</span></button>`;
}

function initHall(box, players) {
  const list = [...players];
  const line = document.getElementById('hallLine');
  const add = (p) => {
    box.insertAdjacentHTML('beforeend', playerHtml(p, list.length - 1));
    const el = box.lastElementChild;
    el.querySelector('.hp-who').textContent = p.who; // 学生输入的内容一律当文本放
    el.querySelector('.hp-snd').textContent = p.snd;
  };
  players.forEach((p, i) => { box.insertAdjacentHTML('beforeend', playerHtml(p, i)); box.lastElementChild.querySelector('.hp-who').textContent = p.who; box.lastElementChild.querySelector('.hp-snd').textContent = `“${p.snd}”`; });
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.hp');
    if (!b) return;
    const p = list[+b.dataset.i];
    b.classList.remove('playing');
    void b.offsetWidth; // 重新开始动画
    b.classList.add('playing');
    clearTimeout(b.timer);
    b.timer = setTimeout(() => b.classList.remove('playing'), PLAY_MS);
    playSound(p.kind);
    if (p.line) line.innerHTML = p.line;
    else line.textContent = `听听，秋的声音，${p.who}……“${p.snd}”……`;
  });
  document.getElementById('hallAdd').addEventListener('click', () => {
    const who = document.getElementById('hallWho').value.trim();
    const snd = document.getElementById('hallSnd').value.trim();
    if (!who || !snd) { line.textContent = '先写上“谁”和“什么声音”，再请它上台。'; return; }
    list.push({ who, snd, kind: 'mine' });
    add({ who, snd: `“${snd}”`, kind: 'mine' });
    line.textContent = `欢迎${who}上台！点一点它，学着读出“${snd}”。`;
    document.getElementById('hallWho').value = '';
    document.getElementById('hallSnd').value = '';
  });
}

const KINDS = ['联系上下文', '看图', '生活经验', '查字典'];
const SORT_ITEMS = [
  { s: '撒下一阵暖暖的<b>叮咛</b>', ok: ['查字典', '联系上下文'], q: '反复地嘱咐，关心的话' },
  { s: '一阵阵秋风<b>掠过</b>田野', ok: ['看图', '生活经验'], q: '轻轻擦过，很快地吹过' },
  { s: '走进这<b>辽阔</b>透明的音乐厅', ok: ['看图', '查字典'], q: '宽广，一眼望不到边' },
];

const MOMENTS = [
  { name: '秋雨', pic: 'dayan', prompt: '听听，秋雨的声音是什么样的？写一节小诗。', hint: '谁在做什么？发出什么声音？像在说什么？', example: '听听，\n秋的声音，\n秋雨敲敲窗户，\n“滴答滴答”，\n是给小树写信的笔音。' },
  { name: '果园', pic: 'huangye', prompt: '秋天的果园里，你会听到什么声音？', hint: '果子落地、小鸟啄果子、摘果子的笑声……', example: '听听，\n秋的声音，\n苹果跳下枝头，\n“咚咚”，\n是和大树告别的脚步声。' },
  { name: '校园', pic: 'xishuai', prompt: '秋天的校园里有什么声音？', hint: '扫落叶、踩落叶、风吹国旗……', example: '听听，\n秋的声音，\n我踩着落叶回家，\n“咔嚓咔嚓”，\n是秋天在我脚下唱歌。' },
];

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, moments: MOMENTS });
    initHall(document.getElementById('hall'), PLAYERS);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
