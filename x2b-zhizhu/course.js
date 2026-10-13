'use strict';
/* 蜘蛛开店 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 读课文时招牌一块块换；② 开店路线图（口罩—河马、围巾—长颈鹿、袜子—蜈蚣）；③ 第四次开店续编机；④ 网上粘飞虫识字游戏 */

/* 二下课文只给生字注音：data-pyk="蹲:dūn 寂:jì" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ---------- 蜘蛛网（放射线 + 一圈圈） ---------- */
function webPaths(cx, cy, r, spokes, rings) {
  const pt = (a, rr) => [cx + rr * Math.cos(a), cy + rr * Math.sin(a)].map((v) => v.toFixed(1)).join(' ');
  const angles = Array.from({ length: spokes }, (_, i) => (i / spokes) * Math.PI * 2);
  const lines = angles.map((a) => `M${cx} ${cy}L${pt(a, r)}`).join('');
  const ringPaths = Array.from({ length: rings }, (_, k) => `M${angles.map((a) => pt(a, (r * (k + 1)) / rings)).join('L')}Z`).join('');
  return `<path class="zz-thread" d="${lines}"/><path class="zz-thread" d="${ringPaths}"/>`;
}
document.querySelectorAll('.zz-web').forEach((svg) => { svg.innerHTML = webPaths(400, 200, 460, 16, 7); });

Hanzi.init({
  shapes: {
    广: ['M50 8V18', 'M16 22H86', 'M24 22C24 58 20 78 10 94'],
    占: ['M44 8V46', 'M44 26H68', 'M26 50H74V88H26Z'],
    网: ['M14 14V90', 'M14 14H86V90', 'M30 30L48 60', 'M48 30L30 60', 'M54 30L72 60', 'M72 30L54 60'],
  },
  cards: [
    { z: '店', py: 'diàn', bs: '广', bh: 8, words: [['开店', 'kāi diàn'], ['商店', 'shāng diàn']] },
    { z: '蹲', py: 'dūn', bs: '⻊', bh: 19, words: [['蹲在网上', 'dūn zài wǎng shàng'], ['蹲下', 'dūn xià']] },
    { z: '寂', py: 'jì', bs: '宀', bh: 11, words: [['寂寞', 'jì mò'], ['寂静', 'jì jìng']] },
    { z: '寞', py: 'mò', bs: '宀', bh: 13, words: [['寂寞', 'jì mò']] },
    { z: '罩', py: 'zhào', bs: '罒', bh: 13, words: [['口罩', 'kǒu zhào'], ['灯罩', 'dēng zhào']] },
    { z: '编', py: 'biān', bs: '纟', bh: 12, words: [['编织', 'biān zhī'], ['编故事', 'biān gù shi']] },
    { z: '顾', py: 'gù', bs: '页', bh: 10, words: [['顾客', 'gù kè'], ['照顾', 'zhào gù']] },
    { z: '付', py: 'fù', bs: '亻', bh: 5, words: [['付钱', 'fù qián'], ['支付', 'zhī fù']] },
    { z: '夫', py: 'fū', bs: '大', bh: 4, words: [['工夫', 'gōng fū'], ['农夫', 'nóng fū']] },
    { z: '换', py: 'huàn', bs: '扌', bh: 10, words: [['换了', 'huàn le'], ['交换', 'jiāo huàn']] },
    { z: '颈', py: 'jǐng', bs: '页', bh: 11, words: [['长颈鹿', 'cháng jǐng lù'], ['颈部', 'jǐng bù']] },
    { z: '袜', py: 'wà', bs: '衤', bh: 10, words: [['袜子', 'wà zi'], ['棉袜', 'mián wà']] },
    { z: '匆', py: 'cōng', bs: '勹', bh: 5, words: [['匆忙', 'cōng máng'], ['匆匆', 'cōng cōng']] },
    { z: '蜈', py: 'wú', bs: '虫', bh: 13, words: [['蜈蚣', 'wú gōng']] },
    { z: '蚣', py: 'gōng', bs: '虫', bh: 10, words: [['蜈蚣', 'wú gōng']] },
  ],
  evolve: [
    { z: '店', old: ['广', '占'], note: '“广”像一间靠着山崖搭起来的屋子，“占”表示读音。做买卖的屋子就是“店”。' },
    { z: '罩', old: '网', note: '上面的“罒”就是“网”。罩子像一张网一样把东西罩住，口罩就罩在嘴巴和鼻子上。' },
  ],
  write: [
    { z: '店', py: 'diàn', bs: '广', bh: 8 },
    { z: '决', py: 'jué', bs: '冫', bh: 6 },
    { z: '定', py: 'dìng', bs: '宀', bh: 8 },
    { z: '商', py: 'shāng', bs: '亠', bh: 11 },
    { z: '夫', py: 'fū', bs: '大', bh: 4 },
    { z: '终', py: 'zhōng', bs: '纟', bh: 8 },
    { z: '完', py: 'wán', bs: '宀', bh: 7 },
    { z: '换', py: 'huàn', bs: '扌', bh: 10 },
    { z: '期', py: 'qī', bs: '月', bh: 12 },
  ],
});

const STORY = {
  clueLabels: ['蜘蛛以为', '结果'],
  clues: [
    { q: '口罩织起来很简单。', a: '河马嘴巴那么大，用了一整天的工夫，终于织完了。' },
    { q: '围巾织起来很简单。', a: '长颈鹿脖子和大树一样高，足足忙了一个星期，累得趴倒在地上。' },
    { q: '袜子织起来很简单。', a: '顾客是四十二只脚的蜈蚣！吓得匆忙跑回网上。' },
  ],
};

/* ---------- 续编机：第四次开店 ---------- */
const GOODS = ['手套', '帽子', '毛衣', '被子'];
const CUSTOMERS = [['🐙', '一只章鱼', '八只手'], ['🐘', '一头大象', '身子那么大'], ['🦔', '一只刺猬', '浑身是刺'], ['🐦', '一只小鸟', '身子小小的']];
function initNext() {
  const goodsBox = document.getElementById('zzGoods');
  const custBox = document.getElementById('zzCust');
  const sign = document.querySelector('#zzSign4 p');
  const frame = document.getElementById('zzFrame');
  let g = -1;
  let c = -1;
  goodsBox.innerHTML = GOODS.map((t, i) => `<button type="button" class="btn" data-i="${i}">${t}</button>`).join('');
  custBox.innerHTML = CUSTOMERS.map(([e, t], i) => `<button type="button" class="btn" data-i="${i}">${e} ${t.slice(2)}</button>`).join('');
  const update = () => {
    goodsBox.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.i === g));
    custBox.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.i === c));
    if (g < 0) return;
    sign.textContent = `${GOODS[g]}编织店`;
    const head = `还是卖${GOODS[g]}吧，因为${GOODS[g]}织起来很简单。第二天，蜘蛛的招牌又换了……`;
    frame.innerHTML = c < 0 ? `${head}<br><b>顾客来了，是谁呢？</b>`
      : `${head}<br>顾客来了，是${CUSTOMERS[c][1]}！它${CUSTOMERS[c][2]}……<br><b>接下来会怎样？讲给大家听。</b>`;
    frame.classList.remove('pop'); void frame.offsetWidth; frame.classList.add('pop');
  };
  goodsBox.addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (b) { g = +b.dataset.i; update(); } });
  custBox.addEventListener('click', (e) => { const b = e.target.closest('.btn'); if (b) { c = +b.dataset.i; update(); } });
}

/* ---------- 识字游戏：网上粘飞虫 ---------- */
const GAME = [['店', 'diàn'], ['蹲', 'dūn'], ['寂', 'jì'], ['寞', 'mò'], ['罩', 'zhào'], ['编', 'biān'], ['顾', 'gù'], ['付', 'fù'],
  ['夫', 'fū'], ['换', 'huàn'], ['颈', 'jǐng'], ['袜', 'wà'], ['匆', 'cōng'], ['蜈', 'wú'], ['蚣', 'gōng']];
function initGame() {
  const web = document.getElementById('zzGWeb');
  const flies = document.getElementById('zzFlies');
  const msg = document.getElementById('zzGMsg');
  web.innerHTML = `${webPaths(200, 200, 190, 12, 6)}<g id="zzStuck"></g>
    <g class="zz-spider" transform="translate(200 200)"><circle r="20"/><circle cy="-22" r="12"/>${[-1, 1].map((s) => [0, 1, 2, 3].map((k) => `<path d="M${s * 14} ${-8 + k * 8}q${s * 22} ${-14 + k * 6} ${s * 34} ${4 + k * 6}"/>`).join('')).join('')}<circle class="e" cx="-5" cy="-24" r="3"/><circle class="e" cx="5" cy="-24" r="3"/></g>`;
  const stuck = web.querySelector('#zzStuck');
  const draw = () => {
    stuck.innerHTML = '';
    flies.innerHTML = GAME.map(([z, p], i) => `<button type="button" class="zz-fly" data-i="${i}" style="--d:${(i % 4) * 0.35}s">${Hanzi.ruby(z, p)}</button>`).join('');
    msg.textContent = `网上粘住了 0 只`;
  };
  flies.addEventListener('click', (e) => {
    const f = e.target.closest('.zz-fly:not(.used)');
    if (!f) return;
    f.classList.add('used');
    const n = stuck.children.length;
    const a = (n / GAME.length) * Math.PI * 2 + 0.2;
    const r = 70 + (n % 3) * 38;
    const [z] = GAME[+f.dataset.i];
    stuck.insertAdjacentHTML('beforeend', `<g class="zz-stuck" transform="translate(${(200 + r * Math.cos(a)).toFixed(0)} ${(200 + r * Math.sin(a)).toFixed(0)})"><circle r="17"/><text y="7">${z}</text></g>`);
    const total = stuck.children.length;
    msg.innerHTML = total === GAME.length ? '粘满啦！蜘蛛不寂寞了。<button type="button" class="btn" id="zzAgain">再来一次</button>' : `网上粘住了 ${total} 只`;
  });
  msg.addEventListener('click', (e) => { if (e.target.id === 'zzAgain') draw(); });
  draw();
}

window.LESSON = {
  init() {
    Narrative.init(STORY);
    initNext();
    initGame();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
