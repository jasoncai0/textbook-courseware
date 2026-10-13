'use strict';
/* 无言之美 · 本课数据。读与写见 ../shared/narrative.js；
 * 本课独有：“说尽 / 无言”对照例证卡（每张卡两种版本切换）+ 删字器（说出来的越少，留给读者的越多） */

/* 例证卡：yan = 原作（无言 / 含蓄），jin = 假如“说尽”会怎样 */
const CARDS = [
  { k: '绘画', pic: 'huangcun', t: '图画与相片', yan: '美术家先加一番选择，再加一番理想化，把人格参加进去——所表现的只是实物一部分。', jin: '相片包罗尽致，体积、比例和实物两两相称，不会有丝毫错误……', why: '图画不如相片“逼真”，美感却浓厚得多。' },
  { k: '文学', t: '孔子观水', yan: '逝者如斯夫，不舍昼夜。', jin: '河水滚滚地流去，日夜都是这样，没有一刻停止。……我看见这流水心中好不惨伤呀！', why: '九个字比“长而臭的演义”值得玩味多了。' },
  { k: '诗', pic: 'shuqing', t: '钱起《省试湘灵鼓瑟》', yan: '曲终人不见，江上数峰青。', jin: '一曲终了，弹琴的人走了，我站在江边望着青山，心里多么凄凉、多么舍不得啊！', why: '没说心绪，凄凉惜别的神情自然流露于言语之外。' },
  { k: '诗', t: '陈子昂 · 李白', yan: '念天地之悠悠，独怆然而涕下！／但见泪痕湿，不知心恨谁。', jin: '（把为什么孤独、恨的是谁、哭了多久都一一写清楚……）', why: '说出来的多么简单，所含蓄的多么深远！' },
  { k: '写景', t: '陶渊明 · 杜甫', yan: '暧暧远人村，依依墟里烟。狗吠深巷中，鸡鸣桑树颠。／落日照大旗，马鸣风萧萧。', jin: '（把乡村的每一处景物、战地的每一种情况都描写出来……）', why: '大手笔只选两三件事轻描淡写，完全境遇便呈露眼前。' },
  { k: '音乐', t: '白居易《琵琶行》', yan: '冰泉冷涩弦凝绝，凝绝不通声暂歇。别有幽愁暗恨生，此时无声胜有声。', jin: '（琴声一刻不停，从头弹到尾，没有一处停顿……）', why: '由宏壮急促变到无声时，精神上有一种沉默渊穆和平愉快的景象。' },
  { k: '雕刻', pic: 'dimei', t: '金刚怒目 · 菩萨低眉', yan: '菩萨低眉：低头闭目的神像，印象往往特别深刻。', jin: '金刚怒目：把情绪全写在脸上，流露无遗。', why: '“金刚怒目，不如菩萨低眉。”怒目是流露，低眉是含蓄。' },
  { k: '雕刻', t: '希腊雕刻《拉奥孔》', yan: '只雕出将达苦痛极点前一顷刻的神情——条条筋肉、根根毛发都暗示极苦痛的神情。', jin: '若雕最惨的那一顷刻，一定带了挣扎呼号的样子。', why: '悲哀含蓄不露，反而让人觉得“有一种难言之痛”。' },
];

/* 删字器：从演义删回原话 */
const CUTS = [
  { t: '河水滚滚地流去，日夜都是这样，没有一刻停止。世界上一切事物不都像这流水时常变化不尽吗？过去的事物不就永远过去绝不回头吗？我看见这流水心中好不惨伤呀！……', said: 95, left: 10, n: '“演义”版：情绪、道理、景象全说了，读者没什么可想的——作者说它“长而臭”。' },
  { t: '河水滚滚地流去，日夜都是这样，没有一刻停止。世界上一切事物不都像这流水时常变化不尽吗？', said: 70, left: 35, n: '删去“惨伤”：不直说情绪，读者开始自己体会。' },
  { t: '河水滚滚地流去，日夜都是这样，没有一刻停止。', said: 45, left: 60, n: '只剩景象：道理和情感都留给读者去想。' },
  { t: '逝者如斯夫，不舍昼夜。', said: 15, left: 95, n: '孔子原话：九个字，“如斯夫”更笼统——却最值得玩味。' },
];

const MOMENTS = [
  {
    name: '再举一例', pic: 'shuqing',
    prompt: '旁批：你还能举出一些其他的例子吗？从诗文、绘画、音乐、电影中找一个“无言之美”的例子，说说它美在哪里。',
    hint: '先说例子，再说它“没说出来”的是什么，最后说这样有什么好处。',
    example: '朱自清《背影》写父亲爬月台买橘子，没有一句“我爱你”，只写了蹒跚的背影和“我的泪很快地流下来了”。父亲的爱和“我”的愧疚都没说破，却让读者每读一次都心头一热——这就是无言之美。',
  },
  {
    name: '改得含蓄些', pic: 'huangcun',
    prompt: '下面这段话“说尽”了，把它改得含蓄一些：“毕业那天，我非常难过，非常舍不得同学们，心里很伤心，眼泪都要掉下来了。”',
    hint: '不直接写“难过”“舍不得”，选一两个细节或景物，让读者自己体会。',
    example: '毕业那天，我最后一个离开教室，把每一张椅子都轻轻推进桌下。黑板上还留着值日生的名字，我没有擦。',
  },
];

function initCards() {
  const box = document.getElementById('wyCards');
  box.innerHTML = CARDS.map((c, i) => `<div class="wy-card" data-i="${i}">
      ${c.pic ? `<div class="wy-cpic" data-bg="assets/${c.pic}.jpg"></div>` : ''}
      <small>${c.k}</small><b>${c.t}</b>
      <p class="wy-v yan">${c.yan}</p><p class="wy-v jin">${c.jin}</p>
      <em>${c.why}</em>
      <button type="button" class="btn">说尽版</button>
    </div>`).join('');
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('.wy-card .btn');
    if (!btn) return;
    const card = btn.closest('.wy-card');
    const jin = card.classList.toggle('jin');
    btn.textContent = jin ? '无言版' : '说尽版';
    btn.classList.toggle('solid', jin);
  });
}

function initVase() {
  const btn = document.getElementById('wyShow');
  btn.addEventListener('click', () => {
    const on = btn.closest('.slide').classList.toggle('real');
    btn.textContent = on ? '回到虚线' : '看看实物';
  });
}

function initCut() {
  let i = 0;
  const $ = (id) => document.getElementById(id);
  const show = () => {
    const c = CUTS[i];
    $('wyCut').textContent = c.t;
    $('wyCut').classList.toggle('short', i === CUTS.length - 1);
    $('wySaid').style.width = `${c.said}%`;
    $('wyLeft').style.width = `${c.left}%`;
    $('wyNote').textContent = c.n;
    $('wyLess').disabled = i === CUTS.length - 1;
  };
  $('wyLess').addEventListener('click', () => { i = Math.min(i + 1, CUTS.length - 1); show(); });
  $('wyReset').addEventListener('click', () => { i = 0; show(); });
  show();
}

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initCards();
    initVase();
    initCut();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
  },
};
