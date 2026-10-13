'use strict';
/* 赵州桥（三下 11）· 本课数据与互动。翻卡、写作框见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 桥的结构示意（不按真实比例） =================
 * 主拱：M150 300 Q400 120 650 300（拱顶约在 y=210）；桥面 y=140；
 * 小桥洞：大桥洞两肩各两个，用 evenodd 挖空，后面的河水能“透”过来 */
const DECK = 'M70 140 H730 L745 300 H650 Q400 120 150 300 H55 Z';
const HOLES = [[165, 225, 250], [240, 290, 222], [575, 635, 250], [510, 560, 222]];
const holePath = ([x1, x2, y]) => `M${x1} ${y} A${(x2 - x1) / 2} ${(x2 - x1) / 2} 0 0 1 ${x2} ${y} Z`;
const posts = () => Array.from({ length: 22 }, (_, i) => `<rect x="${78 + i * 30}" y="122" width="5" height="18" fill="#9b917c"/>`).join('');

function bridgeBase(withHoles) {
  return `<path class="body" d="${DECK} ${withHoles ? HOLES.map(holePath).join(' ') : ''}" fill="#c4b89e" stroke="#7d735f" stroke-width="2.5" fill-rule="evenodd"/>
    <path d="M150 300 Q400 120 650 300" fill="none" stroke="#968a72" stroke-width="7"/>
    <rect x="66" y="132" width="668" height="8" fill="#b9af99"/>${posts()}`;
}

function bridgeSvg(kind) {
  const waves = Array.from({ length: 14 }, (_, i) => `<path d="M${20 + i * 56} 14 q14 -8 28 0" stroke="#d6ecf7" stroke-width="3" fill="none"/>`).join('');
  const water = `<g class="waterg"><rect width="800" height="420" fill="#7fb6d8"/><g class="waves">${waves}</g></g>`;
  const banks = '<path d="M0 292 H74 L86 380 H0 Z M800 292 H726 L714 380 H800 Z" fill="#b9a77f"/>';
  const sky = '<rect width="800" height="380" fill="#f2f8fb"/>';
  if (kind === 'A') {
    return `<svg viewBox="0 0 800 380" class="bridge calm">${sky}${water}${banks}
      <g class="ghost" data-step="3"><rect x="300" y="236" width="36" height="96" fill="none" stroke="#c0392b" stroke-width="3" stroke-dasharray="8 6"/><rect x="464" y="236" width="36" height="96" fill="none" stroke="#c0392b" stroke-width="3" stroke-dasharray="8 6"/>
        <path d="M296 250 l44 50 M340 250 l-44 50 M460 250 l44 50 M504 250 l-44 50" stroke="#c0392b" stroke-width="5"/></g>
      ${bridgeBase(true)}
      <g data-step="1"><path d="M70 62 H730" stroke="#6d2a1a" stroke-width="2.5"/><path d="M70 54 v16 M730 54 v16" stroke="#6d2a1a" stroke-width="2.5"/><rect x="300" y="44" width="200" height="36" rx="18" fill="#fff" stroke="#6d2a1a"/><text class="t-m t-c" x="400" y="69" fill="#6d2a1a">桥长 五十多米</text></g>
      <g data-step="2"><g class="cart"><rect x="370" y="106" width="44" height="18" rx="3" fill="#8a5a2a"/><circle cx="380" cy="128" r="7" fill="#5a3a1a"/><circle cx="404" cy="128" r="7" fill="#5a3a1a"/><path d="M414 116 h20 M432 100 q10 2 10 14 v12 M436 126 v6 M444 126 v6" stroke="#5a3a1a" stroke-width="4" fill="none"/></g>
        <g fill="#2f6b5e"><circle cx="200" cy="112" r="6"/><rect x="196" y="118" width="8" height="14"/><circle cx="610" cy="112" r="6"/><rect x="606" y="118" width="8" height="14"/></g>
        <text class="t-m t-c" x="400" y="168" fill="#4a4030">宽九米多：中间行车马，两旁走人</text></g>
      <g data-step="3"><rect x="324" y="232" width="152" height="30" rx="15" fill="#fff"/><text class="t-m t-c" x="400" y="254" fill="#c0392b">下面没有桥墩！</text></g>
      <g data-step="4"><path d="M150 312 H650" stroke="#1f4e79" stroke-width="2.5" stroke-dasharray="6 4"/><path d="M150 304 v16 M650 304 v16" stroke="#1f4e79" stroke-width="2.5"/>
        <rect x="236" y="336" width="328" height="32" rx="16" fill="#fff"/><text class="t-m t-c" x="400" y="359" fill="#1f4e79">一个大桥洞 · 横跨三十七米多宽</text></g>
    </svg>`;
  }
  const rings = HOLES.map(([x1, x2, y]) => `<path d="${holePath([x1, x2, y]).replace(' Z', '')}" fill="none" stroke="#f2b62c" stroke-width="5"/>`).join('');
  return `<svg viewBox="0 0 800 380" class="bridge calm" id="floodSvg">${sky}${water}${banks}
    <g class="with-holes">${bridgeBase(true)}</g>
    <g class="no-holes">${bridgeBase(false)}</g>
    <g class="rings" data-step="1">${rings}<text class="t-m t-c" x="232" y="182" fill="#8a5a00">小桥洞</text><text class="t-m t-c" x="568" y="182" fill="#8a5a00">小桥洞</text></g>
    <g class="splash"><path d="M150 230 q20 -40 40 -10 q14 -30 30 0 M580 230 q20 -40 40 -10 q14 -30 30 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>
      <rect x="250" y="62" width="300" height="34" rx="17" fill="#c0392b"/><text class="t-m t-c" x="400" y="86" fill="#fff">大水全撞在桥身上！</text></g>
    <g class="say-calm"><rect x="270" y="318" width="260" height="32" rx="16" fill="#fff"/><text class="t-m t-c" x="400" y="341" fill="#1f4e79">平时：水从大桥洞流过</text></g>
    <g class="say-flood"><rect x="230" y="62" width="340" height="34" rx="17" fill="#fff"/><text class="t-m t-c" x="400" y="86" fill="#1f4e79">发大水：还能从四个小桥洞流过</text></g>
  </svg>`;
}
document.getElementById('bridgeA').innerHTML = bridgeSvg('A');
document.getElementById('bridgeB').innerHTML = bridgeSvg('B'); // 顶层生成：deck.js 统计分步前

function initFlood() {
  const svg = document.getElementById('floodSvg');
  document.querySelector('.flood-btns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (!b) return;
    svg.classList.remove('calm', 'flood', 'solid');
    svg.classList.add(b.dataset.mode);
    document.querySelectorAll('.flood-btns .btn').forEach((x) => x.classList.toggle('solid', x === b));
  });
}

/* 第 1 段：名片卡 */
const CLUE_LABELS = ['小问题', '课文里说'];
const CLUES = [
  { q: '赵州桥在哪里？', a: '河北省赵县的洨河上。' },
  { q: '它还叫什么名字？', a: '安济桥。它是一座世界闻名的石拱桥。' },
  { q: '是谁设计的？', a: '隋朝的石匠李春设计并参加建造的。' },
  { q: '到现在有多少年了？', a: '一千四百多年了。' },
];

/* 排一排：第 3 段的句子顺序 */
const ORDER = [
  '这座桥不但坚固，而且美观。',
  '桥面两侧有石栏，栏板上雕刻着精美的图案：',
  '有的刻着两条相互缠绕的龙，嘴里吐出美丽的水花；有的刻着两条飞龙，前爪相互抵着，各自回首遥望；还有的刻着双龙戏珠。',
  '所有的龙似乎都在游动，真像活了一样。',
];
const SHUFFLED = [2, 0, 3, 1];

function initOrder() {
  const box = document.getElementById('order');
  let next = 0;
  box.innerHTML = SHUFFLED.map((k) => `<button type="button" class="ord" data-k="${k}"><i></i>${ORDER[k]}</button>`).join('') +
    '<p class="ord-done">全部排对了！第一句先说“美观”，后面一句一句写具体。</p>';
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.ord');
    if (!b || b.classList.contains('done')) return;
    if (+b.dataset.k === next) {
      next += 1;
      b.classList.add('done');
      b.querySelector('i').textContent = next;
      box.classList.toggle('all', next === ORDER.length);
    } else {
      b.classList.remove('nope');
      void b.offsetWidth; // 重新触发抖动
      b.classList.add('nope');
    }
  });
}

/* 小导游 */
const MOMENTS = [
  {
    name: '世界闻名', pic: 'qiao',
    prompt: '用“世界闻名”开个头：介绍桥在哪里、叫什么、有多少年了。',
    hint: '导游先要问好：游客朋友们，大家好！',
    example: '游客朋友们，大家好！眼前这座就是世界闻名的赵州桥。它在河北省赵县的洨河上，是隋朝的石匠李春设计并参加建造的，到现在已经有一千四百多年了。',
  },
  {
    name: '雄伟', pic: 'qiao',
    prompt: '说说赵州桥怎样雄伟：桥有多长、多宽？桥洞是什么样的？',
    hint: '用上课文里的数字：五十多米、九米多、三十七米多。',
    example: '大家看，赵州桥非常雄伟。它长五十多米，有九米多宽，中间能走车马，两旁能走人。这么长的桥，下面却没有一个桥墩，只用一个大桥洞就横跨了三十七米多宽的河面。',
  },
  {
    name: '创举', pic: 'dashui',
    prompt: '介绍四个小桥洞，说说它为什么是“创举”。',
    hint: '用上“既……又……”说出两个好处。',
    example: '请大家看大桥洞顶上的四个小桥洞，这是建桥史上的一个创举。发大水的时候，河水可以从小桥洞流过，既减轻了流水对桥身的冲击力，让桥不容易被冲毁，又减轻了桥身的重量，节省了石料。',
  },
  {
    name: '美观', pic: 'lanban',
    prompt: '带游客看看石栏上的龙，最后和游客告别。',
    hint: '用上“有的……有的……还有的……”。',
    example: '我们走近看看桥面两侧的石栏。栏板上雕刻着精美的龙：有的两条龙相互缠绕，嘴里吐出水花；有的两条飞龙前爪相抵，回首遥望；还有的是双龙戏珠。是不是像活了一样？谢谢大家！',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initFlood();
    initOrder();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
