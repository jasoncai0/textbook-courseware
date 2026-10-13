'use strict';
/* 中国美食 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 读菜单：点菜名，“做法字”跳进篮子；② 两口锅：火字旁 / 四点底归类；③ 食材配做法；④ 部首在哪儿；⑤ 小服务员上菜。 */

/* 二下只给生字注音：data-pyk="拌:bàn" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

const shake = (el) => { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); };

/* 拖放或“先点再点”：item 拖到 target 上，交给 onDrop(item, target) 判断 */
function dragDrop(box, itemSel, targetSel, onDrop) {
  let sel = null;
  let drag = null;
  box.addEventListener('pointerdown', (e) => {
    const it = e.target.closest(`${itemSel}:not(.used)`);
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
    if (moved) {
      const t = document.elementsFromPoint(e.clientX, e.clientY).map((el) => el.closest(targetSel)).find(Boolean);
      if (t) onDrop(it, t);
      return;
    }
    sel = sel === it ? null : it;
    box.querySelectorAll(itemSel).forEach((x) => x.classList.toggle('sel', x === sel));
  });
  box.addEventListener('click', (e) => {
    const t = e.target.closest(targetSel);
    if (!t || !sel) return;
    onDrop(sel, t);
    sel.classList.remove('sel');
    sel = null;
  });
}

/* ================= 读菜单：点菜，做法字跳进篮子 ================= */
const VERB_TOTAL = 10;
function initMenu(box) {
  const verbs = box.querySelector('.ms-verbs');
  const n = box.querySelector('.ms-n');
  box.addEventListener('click', (e) => {
    const d = e.target.closest('.ms-dish');
    if (!d) return;
    box.querySelectorAll('.ms-dish').forEach((x) => x.classList.toggle('on', x === d));
    d.classList.remove('jump'); void d.offsetWidth; d.classList.add('jump');
    const v = d.dataset.v;
    if (!v) { n.textContent = '小米粥是慢慢熬出来的，菜名里没写做法哦。'; return; }
    if (!verbs.querySelector(`[data-v="${v}"]`)) verbs.insertAdjacentHTML('beforeend', `<span data-v="${v}">${v}</span>`);
    const k = verbs.children.length;
    n.textContent = k < VERB_TOTAL ? `${k} / ${VERB_TOTAL}` : `找齐了！10 种做法`;
    box.classList.toggle('all-done', k === VERB_TOTAL);
  });
}
initMenu(document.getElementById('msMenu'));

/* ================= 两口锅：火字旁 / 四点底 ================= */
const POT_VERBS = [['炒', 'chǎo', 'h'], ['烤', 'kǎo', 'h'], ['烧', 'shāo', 'h'], ['爆', 'bào', 'h'], ['炖', 'dùn', 'h'], ['炸', 'zhá', 'h'], ['煎', 'jiān', 'd'], ['蒸', 'zhēng', 'd'], ['煮', 'zhǔ', 'd']];
function initPots(box) {
  const order = POT_VERBS.map((_, i) => i).sort(() => Math.random() - 0.5);
  box.innerHTML = `<div class="ms-potrow">
      <div class="ms-pot" data-k="h"><div class="ms-in"></div><div class="ms-body"><b>火</b>火字旁</div><i class="ms-fire"></i></div>
      <div class="ms-pot" data-k="d"><div class="ms-in"></div><div class="ms-body"><b>灬</b>四点底</div><i class="ms-fire"></i></div>
    </div>
    <div class="ms-tray">${order.map((i) => `<button type="button" class="ms-vc" data-i="${i}">${Hanzi.ruby(POT_VERBS[i][0], POT_VERBS[i][1])}</button>`).join('')}</div>
    <p class="ms-pmsg">把做法字拖进锅里。</p>`;
  const msg = box.querySelector('.ms-pmsg');
  dragDrop(box, '.ms-vc', '.ms-pot', (it, pot) => {
    const [z, , k] = POT_VERBS[+it.dataset.i];
    if (pot.dataset.k !== k) { shake(it); shake(pot); msg.textContent = `看看“${z}”的火在左边还是在下面？`; return; }
    pot.querySelector('.ms-in').insertAdjacentHTML('beforeend', `<span>${it.innerHTML}</span>`);
    pot.style.setProperty('--n', pot.querySelectorAll('.ms-in span').length);
    it.classList.add('used');
    const left = box.querySelectorAll('.ms-vc:not(.used)').length;
    msg.textContent = left ? `“${z}”放对了！` : '都放好了！“灬”是“火”变的，这些字都和火有关。';
    box.classList.toggle('all-done', !left);
  });
}
initPots(document.getElementById('msPots'));

/* ================= 食材配做法 ================= */
const FOODS = [
  ['🥚', '鸡蛋', ['煮', '煎', '炒', '蒸']], ['🐟', '鱼', ['蒸', '煮', '烧', '煎', '炸']], ['🍢', '肉串', ['烤']],
  ['🥔', '土豆', ['炒', '烧', '炖', '炸']], ['🥟', '饺子', ['蒸', '煮', '煎']], ['🥬', '青菜', ['炒', '拌', '煮']],
];
const ALL_WAYS = ['炒', '烤', '烧', '爆', '炖', '炸', '煎', '蒸', '煮', '拌'];
function initCook(box) {
  box.innerHTML = `<div class="ms-foods">${FOODS.map(([e, n], i) => `<button type="button" class="ms-food" data-i="${i}"><i>${e}</i>${n}</button>`).join('')}</div>
    <div class="ms-stove"><div class="ms-ways">${ALL_WAYS.map((w) => `<span data-w="${w}">${w}</span>`).join('')}</div><p class="ms-say">先点一样食材</p></div>`;
  box.addEventListener('click', (e) => {
    const f = e.target.closest('.ms-food');
    if (!f) return;
    const [, name, ways] = FOODS[+f.dataset.i];
    box.querySelectorAll('.ms-food').forEach((x) => x.classList.toggle('on', x === f));
    box.querySelectorAll('.ms-ways span').forEach((s) => s.classList.toggle('on', ways.includes(s.dataset.w)));
    box.querySelector('.ms-say').textContent = ways.map((w) => `${w}${name}`).join('、');
  });
}
initCook(document.getElementById('msCook'));

/* ================= 部首在哪儿 ================= */
document.getElementById('msFind').addEventListener('click', (e) => {
  const c = e.target.closest('.ms-fc');
  if (!c || c.classList.contains('open')) return;
  c.classList.add('open');
  c.insertAdjacentHTML('beforeend', `<small>${c.dataset.b} 在${c.dataset.p}</small>`);
});

/* ================= 小服务员上菜 ================= */
const ORDERS = [
  { py: 'zhēng jiǎo', ans: '蒸饺', opts: ['煎饺', '蒸饺', '炸饺'], e: '🥟' },
  { py: 'kǎo yā', ans: '烤鸭', opts: ['烤鸭', '炖鸭', '烧鸭'], e: '🦆' },
  { py: 'hóng shāo qié zi', ans: '红烧茄子', opts: ['凉拌茄子', '红烧豆腐', '红烧茄子'], e: '🍆' },
  { py: 'shuǐ zhǔ yú', ans: '水煮鱼', opts: ['水煮鱼', '红烧鱼', '清蒸鱼'], e: '🐟' },
  { py: 'xiāng jiān dòu fu', ans: '香煎豆腐', opts: ['红烧豆腐', '香煎豆腐', '凉拌豆腐'], e: '🧈' },
  { py: 'cōng bào yáng ròu', ans: '葱爆羊肉', opts: ['烤羊肉', '红烧羊肉', '葱爆羊肉'], e: '🥩' },
  { py: 'xiǎo jī dùn mó gu', ans: '小鸡炖蘑菇', opts: ['小鸡炖蘑菇', '小鸡炒蘑菇', '蘑菇炖豆腐'], e: '🍄' },
  { py: 'zhá jiàng miàn', ans: '炸酱面', opts: ['炒面', '炸酱面', '煮面'], e: '🍜' },
  { py: 'xiǎo mǐ zhōu', ans: '小米粥', opts: ['小米饭', '大米粥', '小米粥'], e: '🥣' },
  { py: 'dàn chǎo fàn', ans: '蛋炒饭', opts: ['蛋炒饭', '炒鸡蛋', '鸡蛋饭'], e: '🍳' },
];
const WAIT_NEXT_MS = 1200;
function initWaiter(box) {
  let i = 0;
  let busy = false;
  box.innerHTML = `<div class="ms-guest"><span class="ms-face">🧑‍🍳</span><p class="ms-bubble"></p></div>
    <div class="ms-cards"></div><p class="ms-wmsg"></p><div class="ms-table"><small>餐桌</small></div>`;
  const show = () => {
    const it = ORDERS[i];
    box.querySelector('.ms-bubble').innerHTML = `我要一份 <b class="hz-latin">${it.py}</b>`;
    box.querySelector('.ms-cards').innerHTML = it.opts.map((o) => `<button type="button" class="ms-card" data-o="${o}">${o}</button>`).join('');
    box.querySelector('.ms-wmsg').textContent = '';
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) { i = 0; box.querySelector('.ms-table').innerHTML = '<small>餐桌</small>'; show(); return; }
    const c = e.target.closest('.ms-card');
    if (!c || busy) return;
    const it = ORDERS[i];
    if (c.dataset.o !== it.ans) { shake(c); box.querySelector('.ms-wmsg').textContent = '客人摇摇头：不是这道菜。'; return; }
    busy = true;
    c.classList.add('right');
    box.querySelector('.ms-table').insertAdjacentHTML('beforeend', `<span title="${it.ans}">${it.e}</span>`);
    box.querySelector('.ms-wmsg').textContent = `上菜啦：${it.ans}！`;
    i += 1;
    setTimeout(() => {
      if (i < ORDERS.length) { show(); return; }
      box.querySelector('.ms-bubble').textContent = '菜上齐了，真香！谢谢小服务员！';
      box.querySelector('.ms-cards').innerHTML = '<button type="button" class="btn solid" data-again>再来一桌</button>';
      box.classList.add('done');
    }, WAIT_NEXT_MS);
  });
  show();
}
initWaiter(document.getElementById('msWait'));

Hanzi.init({
  cards: [
    { z: '菠', py: 'bō', words: [['菠菜', 'bō cài'], ['菠萝', 'bō luó']] },
    { z: '煎', py: 'jiān', words: [['香煎', 'xiāng jiān'], ['煎饼', 'jiān bing']] },
    { z: '腐', py: 'fǔ', words: [['豆腐', 'dòu fu'], ['腐烂', 'fǔ làn']] },
    { z: '茄', py: 'qié', words: [['茄子', 'qié zi'], ['番茄', 'fān qié']] },
    { z: '烤', py: 'kǎo', words: [['烤鸭', 'kǎo yā'], ['烤肉', 'kǎo ròu']] },
    { z: '煮', py: 'zhǔ', words: [['水煮鱼', 'shuǐ zhǔ yú'], ['煮饭', 'zhǔ fàn']] },
    { z: '爆', py: 'bào', words: [['葱爆', 'cōng bào'], ['爆米花', 'bào mǐ huā']] },
    { z: '炖', py: 'dùn', words: [['炖蘑菇', 'dùn mó gu'], ['清炖', 'qīng dùn']] },
    { z: '蘑', py: 'mó', words: [['蘑菇', 'mó gu']] },
    { z: '菇', py: 'gū', words: [['蘑菇', 'mó gu'], ['香菇', 'xiāng gū']] },
    { z: '蒸', py: 'zhēng', words: [['蒸饺', 'zhēng jiǎo'], ['清蒸', 'qīng zhēng']] },
    { z: '饺', py: 'jiǎo', words: [['饺子', 'jiǎo zi'], ['蒸饺', 'zhēng jiǎo']] },
    { z: '炸', py: 'zhá', words: [['炸酱面', 'zhá jiàng miàn'], ['油炸', 'yóu zhá']] },
    { z: '酱', py: 'jiàng', words: [['炸酱面', 'zhá jiàng miàn'], ['酱油', 'jiàng yóu']] },
    { z: '粥', py: 'zhōu', words: [['小米粥', 'xiǎo mǐ zhōu'], ['喝粥', 'hē zhōu']] },
    { z: '蛋', py: 'dàn', words: [['鸡蛋', 'jī dàn'], ['蛋炒饭', 'dàn chǎo fàn']] },
  ],
  write: {
    a: [
      { z: '烧', py: 'shāo', bs: '火', bh: 10 },
      { z: '茄', py: 'qié', bs: '艹', bh: 8 },
      { z: '烤', py: 'kǎo', bs: '火', bh: 10 },
      { z: '鸭', py: 'yā', bs: '鸟', bh: 10 },
      { z: '肉', py: 'ròu', bh: 6 },
    ],
    b: [
      { z: '鸡', py: 'jī', bh: 7 },
      { z: '蛋', py: 'dàn', bh: 11 },
      { z: '炒', py: 'chǎo', bs: '火', bh: 8 },
      { z: '饭', py: 'fàn', bs: '饣', bh: 7 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
