'use strict';
/* 我是一只小虫子 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 投票导入；② 小虫子的一天路线图（小虫子沿小路一站站走）；③ 好 / 不好分类罐；④ 身体里的“月”；⑤ 露珠洗字。 */

/* 二下只给生字注音：data-pyk="屁:pì" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

const shake = (el) => { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); };

/* ================= 投票 ================= */
document.getElementById('czVote').addEventListener('click', (e) => {
  const b = e.target.closest('[data-v]');
  if (!b) return;
  const n = b.querySelector('b');
  n.textContent = +n.textContent + 1;
});

/* ================= 路线图：第 k 步时小虫子站在第 k 站 ================= */
const map = document.getElementById('czMap');
function renderMap(step) {
  const st = map.querySelector(`.cz-st[data-k="${Math.max(1, step)}"]`);
  const bug = map.querySelector('.cz-bug');
  bug.style.left = st.style.left;
  bug.style.top = st.style.top;
  bug.classList.toggle('sing', step >= 7);
  map.querySelectorAll('.cz-st').forEach((s) => s.classList.toggle('past', +s.dataset.k <= step));
}

/* ================= 好 / 不好 分类罐 ================= */
const SORT_ITEMS = [
  ['苍耳刺痛屁股', 'bad'], ['蹦进狗尿“深水”', 'bad'], ['小鸟会吃虫子', 'bad'], ['在草叶上伸懒腰', 'good'], ['用露珠洗脸', 'good'],
  ['坐免费的特快列车', 'good'], ['屎壳郎会撞伤我', 'bad'], ['螳螂想吃掉我', 'bad'], ['天牛大婶想顶我', 'bad'], ['夜晚在草地里唱歌', 'good'],
];
function initSort(box) {
  const order = SORT_ITEMS.map((_, i) => i).sort(() => Math.random() - 0.5);
  box.innerHTML = `<div class="cz-jars"><div class="cz-jar" data-k="bad"><b>😣 不好</b><div class="cz-in"></div></div><div class="cz-jar" data-k="good"><b>😊 真不错</b><div class="cz-in"></div></div></div>
    <div class="cz-tray">${order.map((i) => `<button type="button" class="cz-it" data-i="${i}">${SORT_ITEMS[i][0]}</button>`).join('')}</div>
    <p class="cz-smsg">把小虫子的经历放进罐子里。</p>`;
  const msg = box.querySelector('.cz-smsg');
  let sel = null;
  let drag = null;
  const drop = (it, jar) => {
    if (!jar) return;
    const [t, k] = SORT_ITEMS[+it.dataset.i];
    if (jar.dataset.k !== k) { shake(it); shake(jar); msg.textContent = `“${t}”，对小虫子来说是好事吗？`; return; }
    jar.querySelector('.cz-in').insertAdjacentHTML('beforeend', `<span>${t}</span>`);
    it.classList.add('used');
    const left = box.querySelectorAll('.cz-it:not(.used)').length;
    msg.textContent = left ? '放对了！' : '分好了！虽然有烦恼，可快乐也很多——“我喜欢当一只小虫子”。';
    box.classList.toggle('all-done', !left);
  };
  box.addEventListener('pointerdown', (e) => {
    const it = e.target.closest('.cz-it:not(.used)');
    if (!it) return;
    it.setPointerCapture(e.pointerId);
    drag = { it, x: e.clientX, y: e.clientY, moved: false };
  });
  box.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.hypot(dx, dy) > 6) drag.moved = true;
    if (drag.moved) { drag.it.classList.add('dragging'); drag.it.style.translate = `${dx}px ${dy}px`; }
  });
  box.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const { it, moved } = drag;
    drag = null;
    it.classList.remove('dragging');
    it.style.translate = '';
    if (moved) { drop(it, document.elementsFromPoint(e.clientX, e.clientY).map((el) => el.closest('.cz-jar')).find(Boolean)); return; }
    sel = sel === it ? null : it;
    box.querySelectorAll('.cz-it').forEach((x) => x.classList.toggle('sel', x === sel));
  });
  box.addEventListener('click', (e) => {
    const jar = e.target.closest('.cz-jar');
    if (!jar || !sel) return;
    drop(sel, jar);
    sel.classList.remove('sel');
    sel = null;
  });
}
initSort(document.getElementById('czSort'));

/* ================= 身体里的“月”：点词，身体部位亮起（位置为示意） ================= */
const BODY = [
  { w: '屁股', py: 'pì gu', dot: 1, at: [[100, 205]], tip: '屁股：坐下时着地的地方' },
  { w: '脾气', py: 'pí qi', dot: 0, at: [[84, 140]], tip: '脾：肚子里的一个器官，“脾气”说人的性情' },
  { w: '腹部', py: 'fù bù', dot: 0, at: [[100, 165]], tip: '腹部：肚子' },
  { w: '胳膊', py: 'gē bo', dot: [0, 1], at: [[56, 125], [144, 125]], tip: '胳膊：从肩膀到手腕' },
  { w: '肩', py: 'jiān', dot: 0, at: [[68, 88], [132, 88]], tip: '肩：脖子两边、胳膊上面' },
  { w: '手臂', py: 'shǒu bì', dot: 1, at: [[50, 140], [150, 140]], tip: '手臂：胳膊' },
  { w: '胃', py: 'wèi', dot: 0, at: [[108, 135]], tip: '胃：装食物、消化食物的地方' },
  { w: '肾', py: 'shèn', dot: 0, at: [[86, 155], [114, 155]], tip: '肾：在腰的两边（示意）' },
];
function initBody(box) {
  const dotted = (b) => [...b.w].map((ch, i) => ([].concat(b.dot).includes(i) ? `<em>${ch}</em>` : ch)).join('');
  box.innerHTML = `<div class="cz-fig"><svg viewBox="0 0 200 260" aria-hidden="true">
      <circle cx="100" cy="40" r="26" fill="#fde3c8" stroke="#d9a77a" stroke-width="2"/>
      <path d="M60 80 Q100 66 140 80 L150 180 Q100 196 50 180Z" fill="#cfe6f7" stroke="#8fb6d6" stroke-width="2"/>
      <path d="M62 82 L40 150 L50 156 M138 82 L160 150 L150 156" fill="none" stroke="#fde3c8" stroke-width="14" stroke-linecap="round"/>
      <path d="M72 180 L70 250 M128 180 L130 250" stroke="#7d9cc4" stroke-width="20" stroke-linecap="round"/>
      <g class="cz-spots"></g></svg><small>（部位示意）</small></div>
    <div class="cz-words">${BODY.map((b, i) => `<button type="button" class="cz-bw" data-i="${i}">${dotted(b)}</button>`).join('')}
      <p class="cz-btip">点一个词，看看它在身体的哪儿</p>
      <p class="cz-find">我发现：加点的字都有“月”，它们大多和<b>身体</b>有关。</p></div>`;
  const spots = box.querySelector('.cz-spots');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.cz-bw');
    if (!b) return;
    const it = BODY[+b.dataset.i];
    box.querySelectorAll('.cz-bw').forEach((x) => x.classList.toggle('on', x === b));
    b.classList.add('seen');
    spots.innerHTML = it.at.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11"/>`).join('');
    box.querySelector('.cz-btip').innerHTML = `${Hanzi.ruby(it.w, it.py)}　${it.tip.split('：')[1]}`;
    box.classList.toggle('found', box.querySelectorAll('.cz-bw.seen').length >= 3);
  });
}
initBody(document.getElementById('czBody'));

/* ================= 露珠洗字 ================= */
const WASH = [['屁', 'pì'], ['股', 'gǔ'], ['昏', 'hūn'], ['泡', 'pāo'], ['尿', 'niào'], ['茸', 'róng'], ['醒', 'xǐng'], ['晃', 'huàng'],
  ['免', 'miǎn'], ['费', 'fèi'], ['列', 'liè'], ['屎', 'shǐ'], ['撞', 'zhuàng'], ['贪', 'tān'], ['脾', 'pí'], ['婶', 'shěn']];
function initWash(box) {
  box.innerHTML = `<div class="cz-grid">${WASH.map(([z, py]) => `<button type="button" class="cz-wc"><span class="cz-wpy">${py}</span><b>${z}</b><i class="cz-drop">💧</i></button>`).join('')}</div>
    <div class="cz-wbar"><span class="cz-wmsg">先读一读，再点一下用露珠洗干净。</span><button type="button" class="btn" data-reset>再蒙上灰</button></div>`;
  const msg = box.querySelector('.cz-wmsg');
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) {
      box.querySelectorAll('.cz-wc').forEach((c) => c.classList.remove('clean'));
      box.classList.remove('all-done');
      msg.textContent = '先读一读，再点一下用露珠洗干净。';
      return;
    }
    const c = e.target.closest('.cz-wc:not(.clean)');
    if (!c) return;
    c.classList.add('clean');
    const left = box.querySelectorAll('.cz-wc:not(.clean)').length;
    msg.textContent = left ? `洗干净了！还有 ${left} 张。` : '全洗干净了！小虫子开心地叫哇叫：唧唧唧——';
    box.classList.toggle('all-done', !left);
  });
}
initWash(document.getElementById('czWash'));

Hanzi.init({
  cards: [
    { z: '屁', py: 'pì', words: [['屁股', 'pì gu']] },
    { z: '股', py: 'gǔ', words: [['屁股', 'pì gu'], ['一股风', 'yì gǔ fēng']] },
    { z: '昏', py: 'hūn', words: [['昏头昏脑', 'hūn tóu hūn nǎo'], ['黄昏', 'huáng hūn']] },
    { z: '泡', py: 'pāo', words: [['一泡尿', 'yì pāo niào'], ['泡泡', 'pào pao']] },
    { z: '尿', py: 'niào', words: [['尿布', 'niào bù']] },
    { z: '茸', py: 'róng', words: [['毛茸茸', 'máo róng róng']] },
    { z: '醒', py: 'xǐng', words: [['醒来', 'xǐng lái'], ['提醒', 'tí xǐng']] },
    { z: '晃', py: 'huàng', words: [['摇晃', 'yáo huàng'], ['摇摇晃晃', 'yáo yáo huàng huàng']] },
    { z: '免', py: 'miǎn', words: [['免费', 'miǎn fèi'], ['以免', 'yǐ miǎn']] },
    { z: '费', py: 'fèi', words: [['免费', 'miǎn fèi'], ['浪费', 'làng fèi']] },
    { z: '列', py: 'liè', words: [['列车', 'liè chē'], ['排列', 'pái liè']] },
    { z: '屎', py: 'shǐ', words: [['屎壳郎', 'shǐ ke làng']] },
    { z: '撞', py: 'zhuàng', words: [['撞伤', 'zhuàng shāng'], ['碰撞', 'pèng zhuàng']] },
    { z: '贪', py: 'tān', words: [['贪吃', 'tān chī'], ['贪玩', 'tān wán']] },
    { z: '脾', py: 'pí', words: [['脾气', 'pí qi']] },
    { z: '婶', py: 'shěn', words: [['大婶', 'dà shěn'], ['婶婶', 'shěn shen']] },
  ],
  write: {
    a: [
      { z: '屁', py: 'pì', bs: '尸', bh: 7 },
      { z: '股', py: 'gǔ', bs: '月', bh: 8 },
      { z: '尿', py: 'niào', bs: '尸', bh: 7 },
      { z: '净', py: 'jìng', bs: '冫', bh: 8 },
    ],
    b: [
      { z: '屎', py: 'shǐ', bs: '尸', bh: 9 },
      { z: '幸', py: 'xìng', bh: 8 },
      { z: '使', py: 'shǐ', bs: '亻', bh: 8 },
      { z: '劲', py: 'jìn', bs: '力', bh: 7 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.contains(map)) renderMap(step);
  },
};
