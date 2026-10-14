'use strict';
/* 一个粗瓷大碗 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 碗的特写：一个 SVG，按 data-k 切换碗的样子 ================= */
const BOWL_SAY = {
  museum: '陈列在博物馆里', bag: '装在鼓鼓的挂包里', empty: '空碗：“请你还到哪里去！”',
  rice: '满满一碗高粱米饭', gruel: '只剩半碗野菜粥', gone: '碗又“丢”了？', caipen: '成了七班的菜盆',
};
const BOWL_SVG = `<svg class="bowl" viewBox="0 0 240 170" data-k="empty">
  <g class="k k-museum"><rect x="22" y="8" width="196" height="150" rx="6" fill="rgba(220,235,240,.35)" stroke="#9fb2b8" stroke-width="3"/><path d="M60 8 L40 60 M180 8 L200 60" stroke="#fff3c4" stroke-width="10" opacity=".5"/><rect x="40" y="140" width="160" height="14" fill="#7a5a3a"/></g>
  <ellipse cx="120" cy="138" rx="58" ry="8" fill="rgba(0,0,0,.18)"/>
  <g class="bowl-body"><path d="M44 78 Q50 136 120 138 Q190 136 196 78 Z" fill="#c8a46a" stroke="#8a6a3a" stroke-width="3"/><path d="M98 136 h44 v8 h-44 z" fill="#a8844f"/><ellipse cx="120" cy="78" rx="76" ry="16" fill="#e2c78f" stroke="#8a6a3a" stroke-width="3"/><path d="M168 70 l6 -4 l4 6" stroke="#8a6a3a" stroke-width="2" fill="none"/><path d="M60 98 Q120 110 180 98" stroke="#a8844f" stroke-width="2" fill="none" opacity=".6"/></g>
  <g class="k k-rice"><path d="M50 80 Q60 34 120 30 Q180 34 190 80 Z" fill="#b5553a"/><g fill="#d9784f"><circle cx="90" cy="56" r="4"/><circle cx="120" cy="44" r="4"/><circle cx="150" cy="58" r="4"/><circle cx="105" cy="68" r="4"/><circle cx="140" cy="70" r="4"/></g><path d="M100 22 q-6 -10 0 -18 M120 20 q-6 -10 0 -18 M140 22 q-6 -10 0 -18" stroke="#ccc" stroke-width="2" fill="none"/></g>
  <g class="k k-gruel"><ellipse cx="120" cy="84" rx="62" ry="11" fill="#8a9a5a"/><g fill="#4f6b2c"><ellipse cx="100" cy="84" rx="8" ry="3"/><ellipse cx="132" cy="86" rx="9" ry="3"/><ellipse cx="150" cy="82" rx="6" ry="2.5"/></g></g>
  <g class="k k-cai"><g fill="#5e8c3a"><path d="M70 76 q20 -40 40 -4 z"/><path d="M110 72 q16 -46 36 0 z"/><path d="M140 76 q20 -34 34 2 z"/></g><g fill="#e8e2c8"><circle cx="96" cy="74" r="8"/><circle cx="160" cy="74" r="7"/></g></g>
  <g class="k k-bag"><path d="M26 96 Q24 160 120 162 Q216 160 214 96 L196 84 Q120 100 44 84 Z" fill="#6f7a5a" stroke="#4a5238" stroke-width="3"/><path d="M44 84 Q30 20 120 14 Q210 20 196 84" fill="none" stroke="#4a5238" stroke-width="6"/><rect x="104" y="112" width="32" height="20" rx="4" fill="#4a5238"/></g>
  <g class="k k-gone"><text x="120" y="100" text-anchor="middle" font-size="90" font-weight="bold" fill="#9a5a2a">?</text></g>
</svg>`;

function setBowl(box, k) {
  box.querySelector('.bowl').dataset.k = k;
  box.querySelector('.bowl-say').textContent = BOWL_SAY[k] || '';
}

function initBowls() {
  document.querySelectorAll('.bowl-svg').forEach((el) => { el.innerHTML = BOWL_SVG; });
}

function updateBowl(slide, step) {
  if (!slide.classList.contains('s-bowl')) return;
  const lines = [...slide.querySelectorAll('[data-bowl]')];
  const shown = lines.filter((p) => +p.dataset.step <= step);
  const cur = shown[shown.length - 1] || lines[0];
  setBowl(slide.querySelector('.bowl-box'), cur.dataset.bowl);
  lines.forEach((p) => p.classList.toggle('now', p === shown[shown.length - 1]));
}

/* ================= 问题 1：碗的旅程（按顺序点站点，碗跟着走） ================= */
const TRIP = [
  { t: '战场上', k: 'bag', say: '通讯员在战斗中找到它，装进挂包送来' },
  { t: '赵一曼手里', k: 'empty', say: '“哪里拿来的，请你还到哪里去！”' },
  { t: '饭桌上', k: 'rice', say: '通讯员盛了满满一碗高粱米饭' },
  { t: '炊事棚', k: 'gruel', say: '饭倒回锅里，换成半碗野菜粥' },
  { t: '七班', k: 'caipen', say: '碗“丢”了——成了七班的菜盆' },
  { t: '博物馆', k: 'museum', say: '陈列在军事博物馆里，老战士都认得它' },
];

function initTrip() {
  const trip = document.getElementById('trip');
  if (!trip) return;
  const box = document.querySelector('.trip-cam .bowl-box');
  const msg = document.getElementById('tripMsg');
  let next = 0;
  const reset = () => {
    next = 0;
    trip.innerHTML = TRIP.map((st, i) => `<button class="trip-st" type="button" data-i="${i}"><i>${i + 1}</i><b>${st.t}</b><span></span></button>`).join('');
    box.querySelector('.bowl').dataset.k = 'gone';
    box.querySelector('.bowl-say').textContent = '碗在哪里？从第 1 站出发吧。';
    msg.textContent = '';
  };
  trip.addEventListener('click', (e) => {
    const btn = e.target.closest('.trip-st');
    if (!btn) return;
    const i = +btn.dataset.i;
    if (i > next) {
      btn.classList.remove('nope'); void btn.offsetWidth; btn.classList.add('nope');
      msg.textContent = '碗还没走到这儿呢，先去前一站。';
      return;
    }
    const st = TRIP[i];
    if (i === next) {
      btn.classList.add('done');
      btn.querySelector('span').textContent = st.say;
      next += 1;
    }
    trip.querySelectorAll('.trip-st').forEach((b, k) => b.classList.toggle('here', k === i));
    setBowl(box, st.k);
    box.querySelector('.bowl-say').textContent = st.say;
    msg.textContent = next === TRIP.length ? '走完了！只用过一次的碗，走了这么长的路。' : '';
  });
  document.getElementById('tripReset').addEventListener('click', reset);
  reset();
}

/* ================= 问题 2：默读画一画（点句子画波浪线，旁边出批注） ================= */
const MARKS = [
  { q: '赵一曼吃饭用的搪瓷缸子早就送给一个新战士了。', a: '她自己没有碗吃饭，也要先想着新战士。' },
  { q: '通讯员一直想给她另找一个碗，好不容易在这次战斗中找到了……', a: '小通讯员处处关心政委，同志之间多么友爱。' },
  { q: '“哪里拿来的，请你还到哪里去！”', a: '一个碗也不随便要，她对自己要求很严格。' },
  { q: '把碗里的饭倒进锅里，又从另一口锅里盛了半碗野菜粥。', a: '几个月没沾过粮食，她还是把高粱米饭留给伤病员，自己和战士们一样吃野菜粥。' },
  { q: '炊事员老李在旁边看得清楚，他没吭声，眼里却含着泪花。', a: '老李被政委感动得说不出话——我们读到这里也想流泪。' },
  { q: '这个粗瓷大碗已经成了七班的菜盆了。', a: '碗又被她送给了战士。她笑着说“丢”，心里想的全是别人。' },
];

function initMarks() {
  const text = document.getElementById('markText');
  const notes = document.getElementById('markNotes');
  if (!text) return;
  text.innerHTML = MARKS.map((m, i) => `<button class="mk" type="button" data-i="${i}">${m.q}</button>`).join('');
  text.addEventListener('click', (e) => {
    const btn = e.target.closest('.mk');
    if (!btn) return;
    const on = btn.classList.toggle('marked');
    const i = +btn.dataset.i;
    const old = notes.querySelector(`[data-i="${i}"]`);
    if (old) old.remove();
    if (on) notes.insertAdjacentHTML('beforeend', `<p class="mn" data-i="${i}"><b>批注</b>${MARKS[i].a}</p>`);
    notes.querySelector('.mn-empty').hidden = Boolean(notes.querySelector('.mn'));
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initBowls();
    initTrip();
    initMarks();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateBowl(slide, step);
  },
};
