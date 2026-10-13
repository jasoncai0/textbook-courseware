'use strict';
/* 土地的誓言 · 本课独有的“东北意象胶片”与“她 / 它”对读。通用部分（朗读符号）见 ../shared/narrative.js */

/* 第一段铺排的形象（课文原词）：sense 感官；c 色块颜色 */
const FRAMES = [
  { t: '参天碧绿的白桦林', sense: '看', c: '#4f8a4a' },
  { t: '标直漂亮的白桦树在原野上呻吟', sense: '听', c: '#e9e4d6' },
  { t: '奔流似的马群', sense: '看', c: '#8a5a3a' },
  { t: '蒙古狗深夜的嗥鸣', sense: '听', c: '#2c2c3a' },
  { t: '皮鞭滚落在山涧里的脆响', sense: '听', c: '#5a6a7a' },
  { t: '红布似的高粱', sense: '看', c: '#b8322a' },
  { t: '金黄的豆粒', sense: '看', c: '#e0b030' },
  { t: '黑色的土地', sense: '看', c: '#2a2420' },
  { t: '红玉的脸庞，黑玉的眼睛', sense: '看', c: '#c4584a' },
  { t: '斑斓的山雕', sense: '看', c: '#7a6040' },
  { t: '奔驰的鹿群', sense: '看', c: '#a8743a' },
  { t: '带着松香气味的煤块', sense: '闻', c: '#3a3a36' },
  { t: '带着赤色的足金', sense: '看', c: '#c88a2a' },
  { t: '幽远的车铃', sense: '听', c: '#6a7a8a' },
  { t: '马儿戴着串铃在溜直的大道上跑着', sense: '听', c: '#8a7a5a' },
  { t: '狐仙姑深夜的谰语', sense: '听', c: '#4a3a5a' },
  { t: '原野上怪诞的狂风', sense: '听', c: '#7a8a8a' },
];
const PLAY_MS = 420;

function initFilm() {
  const film = document.getElementById('film');
  film.innerHTML = FRAMES.map((f) => `<button type="button" class="frm" data-sense="${f.sense}" style="--c:${f.c}"><i>${f.sense}</i><span>${f.t}</span></button>`).join('');
  const count = () => {
    const shown = [...film.children].filter((x) => !x.hidden);
    document.getElementById('filmCount').textContent = `${shown.length} 个镜头`;
  };
  film.addEventListener('click', (e) => {
    const f = e.target.closest('.frm');
    if (f) f.classList.toggle('lit');
  });
  document.querySelector('.film-tools').addEventListener('click', (e) => {
    const b = e.target.closest('[data-sense]');
    if (!b) return;
    document.querySelectorAll('.film-tools [data-sense]').forEach((x) => x.classList.toggle('solid', x === b));
    [...film.children].forEach((x) => { x.hidden = Boolean(b.dataset.sense) && x.dataset.sense !== b.dataset.sense; });
    count();
  });
  let timer = null;
  document.getElementById('filmPlay').addEventListener('click', () => {
    clearInterval(timer);
    const shown = [...film.children].filter((x) => !x.hidden);
    shown.forEach((x) => x.classList.remove('lit'));
    let k = 0;
    timer = setInterval(() => {
      if (k >= shown.length) { clearInterval(timer); return; }
      shown[k].classList.add('lit');
      k += 1;
    }, PLAY_MS);
  });
  count();
}

function initTa() {
  const q = document.getElementById('taQuote');
  const set = (it) => {
    q.querySelectorAll('.ta').forEach((s) => { s.textContent = it ? '它' : '她'; });
    q.classList.toggle('it', it);
    document.getElementById('taShe').classList.toggle('solid', !it);
    document.getElementById('taIt').classList.toggle('solid', it);
  };
  document.getElementById('taShe').addEventListener('click', () => set(false));
  document.getElementById('taIt').addEventListener('click', () => set(true));
}

window.LESSON = {
  init() {
    Narrative.init({});
    initFilm();
    initTa();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
