'use strict';
/* 棉花姑娘 · 本课数据与本课互动。记叙文故事页见 ../shared/narrative.js，低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完） */

/* ================= 角色小图 ================= */
const PIC = {
  swallow: '<svg viewBox="0 0 80 50"><path d="M10 25L0 12L18 21Z M10 25L0 38L18 29Z" fill="#1d2a4a"/><ellipse cx="38" cy="26" rx="24" ry="9" fill="#1d2a4a"/><ellipse cx="42" cy="29" rx="14" ry="5" fill="#fff"/><path d="M30 22Q42 0 58 6Q46 16 40 24Z" fill="#2c3d66"/><circle cx="60" cy="24" r="8" fill="#1d2a4a"/><circle cx="62" cy="27" r="3" fill="#d9573f"/><circle cx="62" cy="21" r="1.6" fill="#fff"/><path d="M67 22L77 24L67 26Z" fill="#333"/></svg>',
  woodpecker: '<svg viewBox="0 0 60 70"><ellipse cx="28" cy="42" rx="13" ry="20" fill="#2b2b2b"/><path d="M22 34H34M22 42H34M22 50H34" stroke="#fff" stroke-width="3"/><circle cx="32" cy="18" r="11" fill="#fff" stroke="#2b2b2b" stroke-width="2"/><path d="M21 15Q29 1 43 12Z" fill="#d93a32"/><circle cx="35" cy="17" r="2" fill="#222"/><path d="M42 18L58 21L42 23Z" fill="#555"/><path d="M24 60L18 70M30 60L34 70" stroke="#2b2b2b" stroke-width="3"/></svg>',
  frog: '<span class="mh-emoji">🐸</span>',
  ladybug: '<span class="mh-emoji">🐞</span>',
  cotton: '<svg viewBox="0 0 120 160" class="mh-cotton"><path d="M60 158V64" stroke="#5c8a3a" stroke-width="6"/><ellipse class="mh-leaf" cx="34" cy="104" rx="26" ry="13" transform="rotate(-25 34 104)"/><ellipse class="mh-leaf" cx="86" cy="118" rx="26" ry="13" transform="rotate(25 86 118)"/><ellipse class="mh-leaf" cx="36" cy="140" rx="22" ry="11" transform="rotate(-15 36 140)"/><g class="mh-aphids"><circle cx="26" cy="100" r="3"/><circle cx="36" cy="106" r="3"/><circle cx="44" cy="99" r="2.6"/><circle cx="80" cy="114" r="3"/><circle cx="92" cy="120" r="2.6"/><circle cx="30" cy="140" r="2.6"/><circle cx="42" cy="138" r="3"/></g><circle cx="60" cy="40" r="30" fill="#fffdf6" stroke="#d9cfb8" stroke-width="3"/><path d="M40 16Q60 4 80 16" stroke="#7aa64e" stroke-width="5" fill="none"/><circle cx="50" cy="38" r="3" fill="#333"/><circle cx="70" cy="38" r="3" fill="#333"/><path class="mh-mouth" d="M50 54Q60 46 70 54" stroke="#c45a4a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
};

/* ================= 舞台剧：燕子、啄木鸟、青蛙一个个上场 ================= */
const CAST = {
  n: { name: '旁白' },
  cotton: { name: '棉花姑娘' },
  swallow: { name: '燕子', where: ['☁️', '空中', 'kōng zhōng'] },
  woodpecker: { name: '啄木鸟', where: ['🌳', '树干里', 'shù gàn lǐ'] },
  frog: { name: '青蛙', where: ['🌾', '田里', 'tián lǐ'] },
};
const PLAY = [ // enter：这一句时上场；tag：这一句时亮出它捉哪里的害虫
  { who: 'n', t: '燕子飞来了。', py: 'yàn zi fēi lái le', enter: 'swallow' },
  { who: 'cotton', t: '棉花姑娘说：“请你帮我捉害虫吧！”', py: 'mián huā gū niang shuō qǐng nǐ bāng wǒ zhuō hài chóng ba' },
  { who: 'swallow', t: '燕子说：“对不起，我只会捉空中飞的害虫，你还是请别人帮忙吧！”', py: 'yàn zi shuō duì bu qǐ wǒ zhǐ huì zhuō kōng zhōng fēi de hài chóng nǐ hái shi qǐng bié rén bāng máng ba', tag: 'swallow' },
  { who: 'n', t: '啄木鸟飞来了。', py: 'zhuó mù niǎo fēi lái le', enter: 'woodpecker' },
  { who: 'cotton', t: '棉花姑娘说：“请你帮我捉害虫吧！”', py: 'mián huā gū niang shuō qǐng nǐ bāng wǒ zhuō hài chóng ba' },
  { who: 'woodpecker', t: '啄木鸟说：“对不起，我只会捉树干里的害虫，你还是请别人帮忙吧！”', py: 'zhuó mù niǎo shuō duì bu qǐ wǒ zhǐ huì zhuō shù gàn lǐ de hài chóng nǐ hái shi qǐng bié rén bāng máng ba', tag: 'woodpecker' },
  { who: 'n', t: '青蛙跳来了。', py: 'qīng wā tiào lái le', enter: 'frog' },
  { who: 'cotton', t: '棉花姑娘高兴地说：“请你帮我捉害虫吧！”', py: 'mián huā gū niang gāo xìng de shuō qǐng nǐ bāng wǒ zhuō hài chóng ba' },
  { who: 'frog', t: '青蛙说：“对不起，我只会捉田里的害虫，你还是请别人帮忙吧！”', py: 'qīng wā shuō duì bu qǐ wǒ zhǐ huì zhuō tián lǐ de hài chóng nǐ hái shi qǐng bié rén bāng máng ba', tag: 'frog' },
];
const LINE_KEEP = 2;

function buildStage(stage, lines) {
  stage.innerHTML = `<div class="mh-sky"></div><div class="mh-trunk"></div><div class="mh-field"></div>
    <div class="mh-role mh-cotton-role" data-role="cotton">${PIC.cotton}<b>${Hanzi.ruby('棉花姑娘', 'mián huā gū niang')}</b></div>
    ${['swallow', 'woodpecker', 'frog'].map((k) => `<div class="mh-role" data-role="${k}">${PIC[k]}<b>${Hanzi.ruby(CAST[k].name, { swallow: 'yàn zi', woodpecker: 'zhuó mù niǎo', frog: 'qīng wā' }[k])}</b>
      <span class="mh-where">${CAST[k].where[0]} ${Hanzi.ruby(CAST[k].where[1], CAST[k].where[2])}</span></div>`).join('')}`;
  lines.innerHTML = PLAY.map((ln, i) => `<p class="mh-line mh-${ln.who}" data-step="${i + 1}"${ln.enter ? ` data-enter="${ln.enter}"` : ''}${ln.tag ? ` data-tag="${ln.tag}"` : ''} data-who="${ln.who}">
    <span class="mh-badge">${CAST[ln.who].name}</span><span class="py">${Hanzi.ruby(ln.t, ln.py)}</span></p>`).join('');
}
buildStage(document.getElementById('stage'), document.getElementById('lines'));

function updatePlay(slide, step) {
  const stage = slide.querySelector('.mh-stage');
  if (!stage) return;
  const lines = [...slide.querySelectorAll('.mh-line')];
  const shown = lines.filter((ln) => +ln.dataset.step <= step);
  const now = shown[shown.length - 1];
  lines.forEach((ln) => {
    const k = shown.indexOf(ln);
    ln.classList.toggle('gone', k >= 0 && k < shown.length - LINE_KEEP);
    ln.classList.toggle('now', ln === now);
  });
  stage.querySelectorAll('.mh-role').forEach((role) => {
    const r = role.dataset.role;
    role.classList.toggle('in', r === 'cotton' || shown.some((ln) => ln.dataset.enter === r));
    role.classList.toggle('talk', Boolean(now) && now.dataset.who === r);
    role.classList.toggle('tagged', shown.some((ln) => ln.dataset.tag === r));
  });
}

/* ================= 第 5、6 段：数一数瓢虫背上的斑点 ================= */
const SPOTS = [[100, 70], [70, 96], [130, 96], [62, 132], [138, 132], [84, 162], [116, 162]];
function buildLady(box) {
  box.innerHTML = `<svg viewBox="0 0 200 210" class="mh-lady-svg" aria-label="七星瓢虫">
      <path d="M60 50Q100 6 140 50Z" fill="#222"/><circle cx="84" cy="34" r="6" fill="#fff"/><circle cx="116" cy="34" r="6" fill="#fff"/>
      <path d="M80 18L70 4M120 18L130 4" stroke="#222" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="100" cy="122" rx="78" ry="80" fill="#e23d2f" stroke="#a5261c" stroke-width="4"/>
      <path d="M100 44V200" stroke="#7c1d15" stroke-width="4"/>
      ${SPOTS.map(([x, y], i) => `<g class="mh-spot" data-i="${i}"><circle cx="${x}" cy="${y}" r="15"/><text x="${x}" y="${y + 6}"></text></g>`).join('')}
    </svg>
    <p class="mh-count">点一点斑点，数一数：<b>0</b> 个</p>`;
  let n = 0;
  box.addEventListener('click', (e) => {
    const spot = e.target.closest('.mh-spot:not(.on)');
    if (spot) {
      n += 1;
      spot.classList.add('on');
      spot.querySelector('text').textContent = n;
      box.querySelector('.mh-count').innerHTML = n === SPOTS.length ? '<b>7</b> 个斑点，就像七颗星星！' : `点一点斑点，数一数：<b>${n}</b> 个`;
      return;
    }
    if (n === SPOTS.length) { // 数完了再点一下，重新数
      n = 0;
      box.querySelectorAll('.mh-spot').forEach((s) => { s.classList.remove('on'); s.querySelector('text').textContent = ''; });
      box.querySelector('.mh-count').innerHTML = '点一点斑点，数一数：<b>0</b> 个';
    }
  });
}
buildLady(document.getElementById('lady'));

/* ================= 课后第 2 题：连一连 ================= */
const LINK_L = [
  { k: 'swallow', pic: PIC.swallow, t: '燕子', py: 'yàn zi' },
  { k: 'woodpecker', pic: PIC.woodpecker, t: '啄木鸟', py: 'zhuó mù niǎo' },
  { k: 'frog', pic: PIC.frog, t: '青蛙', py: 'qīng wā' },
  { k: 'ladybug', pic: PIC.ladybug, t: '七星瓢虫', py: 'qī xīng piáo chóng' },
];
const LINK_R = [ // 打乱顺序显示
  { k: 'frog', t: '捉田里的害虫', py: 'zhuō tián lǐ de hài chóng' },
  { k: 'ladybug', t: '捉棉花叶子上的害虫', py: 'zhuō mián huā yè zi shàng de hài chóng' },
  { k: 'swallow', t: '捉空中的害虫', py: 'zhuō kōng zhōng de hài chóng' },
  { k: 'woodpecker', t: '捉树干里的害虫', py: 'zhuō shù gàn lǐ de hài chóng' },
];
function buildLink(box) {
  box.innerHTML = `<div class="mh-lk-col">${LINK_L.map((it) => `<button type="button" class="mh-lk mh-lk-l" data-k="${it.k}"><i>${it.pic}</i>${Hanzi.ruby(it.t, it.py)}</button>`).join('')}</div>
    <svg class="mh-lk-svg"></svg>
    <div class="mh-lk-col">${LINK_R.map((it) => `<button type="button" class="mh-lk mh-lk-r" data-k="${it.k}">${Hanzi.ruby(it.t, it.py)}</button>`).join('')}</div>
    <div class="mh-lk-bar"><span class="mh-lk-msg">先点左边的动物，再点右边。</span><button type="button" class="btn" data-reset>重新连</button></div>`;
  const svg = box.querySelector('.mh-lk-svg');
  const msg = box.querySelector('.mh-lk-msg');
  let sel = null;
  const draw = () => {
    const b = svg.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
    svg.innerHTML = [...box.querySelectorAll('.mh-lk-l.done')].map((l) => {
      const r = box.querySelector(`.mh-lk-r[data-k="${l.dataset.k}"]`);
      const a = l.getBoundingClientRect();
      const c = r.getBoundingClientRect();
      return `<line x1="0" y1="${a.top + a.height / 2 - b.top}" x2="${b.width}" y2="${c.top + c.height / 2 - b.top}"/>`;
    }).join('');
  };
  new ResizeObserver(draw).observe(svg);
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) {
      box.querySelectorAll('.mh-lk').forEach((x) => x.classList.remove('done', 'sel'));
      sel = null; msg.textContent = '先点左边的动物，再点右边。'; box.classList.remove('all'); draw();
      return;
    }
    const l = e.target.closest('.mh-lk-l:not(.done)');
    if (l) { sel = l; box.querySelectorAll('.mh-lk-l').forEach((x) => x.classList.toggle('sel', x === l)); return; }
    const r = e.target.closest('.mh-lk-r:not(.done)');
    if (!r || !sel) return;
    if (r.dataset.k !== sel.dataset.k) {
      [r, sel].forEach((x) => { x.classList.remove('wrong'); void x.offsetWidth; x.classList.add('wrong'); });
      msg.textContent = '再想想：它会捉哪里的害虫？';
      return;
    }
    sel.classList.remove('sel');
    sel.classList.add('done');
    r.classList.add('done');
    sel = null;
    draw();
    const all = !box.querySelector('.mh-lk-l:not(.done)');
    box.classList.toggle('all', all);
    msg.textContent = all ? '全连对了！说一说：燕子只会捉空中的害虫……' : '连对了！';
  });
}
buildLink(document.getElementById('link'));

/* ================= 课后第 3 题：碧绿碧绿的…… 雪白雪白的…… ================= */
const COLORS = [
  { k: 'green', head: ['碧绿碧绿的', 'bì lǜ bì lǜ de'], first: ['叶子', 'yè zi'] },
  { k: 'white', head: ['雪白雪白的', 'xuě bái xuě bái de'], first: ['棉花', 'mián huā'] },
];
const WORDS = [['荷叶', 'hé yè', 'green'], ['白云', 'bái yún', 'white'], ['草地', 'cǎo dì', 'green'], ['羊毛', 'yáng máo', 'white'], ['西瓜皮', 'xī guā pí', 'green'], ['牙齿', 'yá chǐ', 'white']];
function buildColor(box) {
  box.innerHTML = `${COLORS.map((c, i) => `<div class="mh-crow${i ? '' : ' on'}" data-k="${c.k}"><i class="mh-sw"></i><b class="py">${Hanzi.ruby(...c.head)}</b><span class="mh-got"><span>${Hanzi.ruby(...c.first)}</span></span></div>`).join('')}
    <p class="mh-chint">先点上面一行，再点下面的词：</p>
    <div class="mh-pool">${WORDS.map(([t, py, k]) => `<button type="button" class="mh-w" data-k="${k}">${Hanzi.ruby(t, py)}</button>`).join('')}</div>`;
  box.addEventListener('click', (e) => {
    const row = e.target.closest('.mh-crow');
    if (row) { box.querySelectorAll('.mh-crow').forEach((x) => x.classList.toggle('on', x === row)); return; }
    const w = e.target.closest('.mh-w:not(.used)');
    if (!w) return;
    const cur = box.querySelector('.mh-crow.on');
    if (w.dataset.k !== cur.dataset.k) { w.classList.remove('wrong'); void w.offsetWidth; w.classList.add('wrong'); return; }
    w.classList.add('used');
    cur.querySelector('.mh-got').insertAdjacentHTML('beforeend', `<span class="new">${w.innerHTML}</span>`);
  });
}
buildColor(document.getElementById('color'));

/* ================= 识字游戏：捉蚜虫 ================= */
const APHIDS = [['棉', 'mián'], ['娘', 'niáng'], ['治', 'zhì'], ['燕', 'yàn'], ['别', 'bié'], ['干', 'gàn'], ['然', 'rán'], ['奇', 'qí'], ['颗', 'kē'], ['瓢', 'piáo'], ['碧', 'bì'], ['吐', 'tǔ'], ['啦', 'la']];
const APHID_POS = [[22, 30], [38, 20], [55, 26], [72, 22], [84, 38], [16, 52], [32, 46], [50, 50], [68, 48], [24, 72], [42, 70], [60, 74], [78, 66]];
function buildAphid(box) {
  box.innerHTML = `<div class="mh-bigleaf" style="--eat:0">${APHIDS.map(([z, py], i) => `<button type="button" class="mh-ap" data-i="${i}" style="left:${APHID_POS[i][0]}%;top:${APHID_POS[i][1]}%"><ruby>${z}<rt>${py}</rt></ruby></button>`).join('')}<i class="mh-lb">🐞</i></div>
    <div class="mh-ap-bar"><span>吃掉了 <b>0</b> / ${APHIDS.length} 只蚜虫</span><button type="button" class="btn" data-reset>再来一次</button></div>`;
  const leaf = box.querySelector('.mh-bigleaf');
  const bug = box.querySelector(".mh-lb");
  const count = box.querySelector('.mh-ap-bar b');
  const set = (n) => { count.textContent = n; leaf.style.setProperty('--eat', n / APHIDS.length); box.classList.toggle('all', n === APHIDS.length); };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) {
      box.querySelectorAll('.mh-ap').forEach((a) => a.classList.remove('eaten'));
      bug.style.left = ''; bug.style.top = '';
      set(0);
      return;
    }
    const ap = e.target.closest('.mh-ap:not(.eaten)');
    if (!ap) return;
    bug.style.left = ap.style.left;
    bug.style.top = ap.style.top;
    ap.classList.add('eaten');
    set(box.querySelectorAll('.mh-ap.eaten').length);
  });
}
buildAphid(document.getElementById('aphid'));

Hanzi.init({
  cards: [
    { z: '棉', py: 'mián', bs: '木', bh: 12, words: [['棉花', 'mián huā']] },
    { z: '娘', py: 'niáng', bs: '女', bh: 10, words: [['姑娘', 'gū niang']] },
    { z: '治', py: 'zhì', bs: '氵', bh: 8, words: [['治病', 'zhì bìng']] },
    { z: '燕', py: 'yàn', bs: '灬', bh: 16, words: [['燕子', 'yàn zi']] },
    { z: '别', py: 'bié', bs: '刂', bh: 7, words: [['别人', 'bié rén']] },
    { z: '干', py: 'gàn', bs: '干', bh: 3, words: [['树干', 'shù gàn']] },
    { z: '然', py: 'rán', bs: '灬', bh: 12, words: [['忽然', 'hū rán']] },
    { z: '奇', py: 'qí', bs: '大', bh: 8, words: [['惊奇', 'jīng qí'], ['奇怪', 'qí guài']] },
    { z: '颗', py: 'kē', bs: '页', bh: 14, words: [['七颗星星', 'qī kē xīng xing']] },
    { z: '瓢', py: 'piáo', bs: '瓜', bh: 16, words: [['瓢虫', 'piáo chóng']] },
    { z: '碧', py: 'bì', bs: '石', bh: 14, words: [['碧绿', 'bì lǜ']] },
    { z: '吐', py: 'tǔ', bs: '口', bh: 6, words: [['吐出', 'tǔ chū']] },
    { z: '啦', py: 'la', bs: '口', bh: 11, words: [['笑啦', 'xiào la']] },
  ],
  write: [
    { z: '病', py: 'bìng', bs: '疒', bh: 10 },
    { z: '医', py: 'yī', bs: '匚', bh: 7 },
    { z: '别', py: 'bié', bs: '刂', bh: 7 },
    { z: '干', py: 'gàn', bs: '干', bh: 3 },
    { z: '奇', py: 'qí', bs: '大', bh: 8 },
    { z: '七', py: 'qī', bs: '一', bh: 2 },
    { z: '星', py: 'xīng', bs: '日', bh: 9 },
  ],
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updatePlay(slide, step);
  },
};
