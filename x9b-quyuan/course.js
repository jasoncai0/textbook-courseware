'use strict';
/* 屈原（节选）· 本课互动。本课独有：舞台剧本版式分角色读 + 舞台说明高亮与归类 + “雷电颂”风雷电意象的情感递进曲线 */

/* ---------- 分角色朗读：点角色，只亮该角色的台词；“舞台说明”按钮只亮括号和说明 ---------- */
function initRoles() {
  document.querySelectorAll('.role-bar').forEach((bar) => {
    const script = bar.parentElement.querySelector('.script');
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('[data-role]');
      if (!b) return;
      const same = script.dataset.role === b.dataset.role;
      script.dataset.role = same ? '' : b.dataset.role;
      bar.querySelectorAll('[data-role]').forEach((x) => x.classList.toggle('solid', !same && x === b));
    });
  });
}

/* ---------- 雷电颂：当前段落只显示最新一段 ---------- */
function updateOde(slide) {
  const segs = [...slide.querySelectorAll('.ode-seg')];
  if (!segs.length) return;
  const on = segs.filter((s) => s.classList.contains('on'));
  segs.forEach((s) => s.classList.toggle('cur', s === on[on.length - 1]));
}

/* ---------- 舞台说明归类：先点说明，再点类别 ---------- */
const BINS = ['布景 · 地点', '灯光 · 音响', '上场 · 下场', '外貌 · 动作 · 神态'];
const DIRS = [
  ['东皇太一庙之正殿。与第二幕明堂相似，四柱三间，唯无帘幕。', 0],
  ['左室为一龙船，船首向右，湘君坐船中吹笙，湘夫人立船尾摇橹。', 0],
  ['各室均有灯，光甚昏暗，室外雷电交加，时有大风咆哮。', 1],
  ['靳尚带卫士二人，各蒙面，诡谲地由右侧登场。', 2],
  ['靳尚与二卫士由左首下场。', 2],
  ['（迟疑地）上官大夫，我觉得有点儿为难。', 3],
  ['郑詹尹立在神殿中，沉默有间，最后下定了决心……', 3],
  ['屈原手足已戴刑具，颈上并系有长链，仍着其白日所着之玄衣，披发……', 3],
  ['时而伫立睥睨，目中含有怒火。', 3],
];
const WHY = ['交代时间、地点、布景，营造环境', '渲染气氛，暗示人物处境与心情', '安排人物上下场，推动情节', '刻画人物形象，提示表演'];
function initSort() {
  const list = document.getElementById('dirList');
  const bins = document.getElementById('dirBins');
  const fb = document.getElementById('dirFb');
  let picked = null;
  list.innerHTML = DIRS.map(([t], i) => `<button type="button" class="dir" data-i="${i}">${t}</button>`).join('');
  bins.innerHTML = BINS.map((b, i) => `<button type="button" class="bin" data-b="${i}"><b>${b}</b><small>${WHY[i]}</small><span class="cnt"></span></button>`).join('');
  list.addEventListener('click', (e) => {
    const d = e.target.closest('.dir');
    if (!d || d.classList.contains('done')) return;
    picked = d;
    list.querySelectorAll('.dir').forEach((x) => x.classList.toggle('sel', x === d));
    fb.textContent = '现在点下面的一个类别。';
  });
  bins.addEventListener('click', (e) => {
    const b = e.target.closest('.bin');
    if (!b || !picked) return;
    const ok = DIRS[picked.dataset.i][1] === +b.dataset.b;
    if (ok) {
      picked.classList.remove('sel');
      picked.classList.add('done');
      picked.dataset.k = b.dataset.b;
      const n = list.querySelectorAll(`.dir.done[data-k="${b.dataset.b}"]`).length;
      b.querySelector('.cnt').textContent = `✓ ${n}`;
      fb.textContent = `对！“${BINS[b.dataset.b]}”——${WHY[b.dataset.b]}。`;
      picked = null;
      if (!list.querySelector('.dir:not(.done)')) fb.textContent = '全部归好类了！舞台说明不只是“说明”：它交代环境、渲染气氛、推动情节、刻画人物。';
    } else {
      fb.textContent = '再想想：这句说明主要是写环境、写声光，还是写人物？';
    }
  });
}

/* ---------- 朗读符号开关 ---------- */
function initMarks() {
  document.getElementById('markBtn').addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('solid', document.getElementById('readText').classList.toggle('marks-show'));
  });
}

/* ---------- 象征卡 ---------- */
function initSymbols() {
  document.getElementById('symCards').addEventListener('click', (e) => {
    const c = e.target.closest('.sym');
    if (c) c.classList.toggle('open');
  });
}

/* 读读写写里四字词的卡片加宽（pinyin.js 已先渲染好卡片） */
document.querySelectorAll('.zy-write').forEach((c) => { if (c.querySelector('ruby').firstChild.textContent.length > 3) c.classList.add('zy-long'); });

window.LESSON = {
  init() {
    Narrative.init({});
    initRoles();
    initSort();
    initMarks();
    initSymbols();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateOde(slide);
  },
};
