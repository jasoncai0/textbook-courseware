'use strict';
/* 古诗二首 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：两幅夏日小景“看图找一找”（找到景物，对应诗句亮起）、撑小艇分浮萍识字游戏 */

const POEMS = {
  chishang: {
    title: ['池上', 'chí shàng'], author: ['［唐］白居易', 'táng bái jū yì'],
    lines: [['小娃撑小艇，', 'xiǎo wá chēng xiǎo tǐng'], ['偷采白莲回。', 'tōu cǎi bái lián huí'], ['不解藏踪迹，', 'bù jiě cáng zōng jì'], ['浮萍一道开。', 'fú píng yí dào kāi']],
    focus: ['1.2 66% 40%', '1.25 58% 45%', '1.15 35% 50%', '1.2 25% 50%'],
    notes: [['小娃', '小孩子'], ['撑', '用竹篙抵着水底，让船往前走'], ['小艇', '小船'], ['不解', '不知道，不懂得'], ['踪迹', '走过留下的痕迹'], ['浮萍', '浮在水面上的小草']],
  },
  xiaochi: {
    title: ['小池', 'xiǎo chí'], author: ['［宋］杨万里', 'sòng yáng wàn lǐ'],
    lines: [['泉眼无声惜细流，', 'quán yǎn wú shēng xī xì liú'], ['树阴照水爱晴柔。', 'shù yīn zhào shuǐ ài qíng róu'], ['小荷才露尖尖角，', 'xiǎo hé cái lù jiān jiān jiǎo'], ['早有蜻蜓立上头。', 'zǎo yǒu qīng tíng lì shàng tóu']],
    focus: ['1.3 10% 70%', '1.15 38% 60%', '1.3 56% 65%', '1.35 60% 50%'],
    notes: [['泉眼', '泉水流出来的小洞'], ['惜', '爱惜，舍不得'], ['晴柔', '晴天里柔和的风光'], ['小荷', '刚长出来的嫩荷叶'], ['尖尖角', '还没有展开的荷叶尖']],
  },
};
document.querySelectorAll('.gs-card[data-poem]').forEach((box) => {
  const p = POEMS[box.dataset.poem];
  box.innerHTML = `<h3>${Hanzi.ruby(...p.title)}</h3><p class="gs-au">${Hanzi.ruby(...p.author)}</p>
    ${p.lines.map((l, i) => `<p class="gs-l" data-step="${i + 1}" data-focus="${p.focus[i]}">${Hanzi.ruby(...l)}</p>`).join('')}
    <button type="button" class="btn gs-nt-btn" data-noswipe>注释</button>
    <dl class="gs-notes">${p.notes.map(([w, m]) => `<dt>${w}</dt><dd>${m}</dd>`).join('')}</dl>`;
});

/* 看图找一找：x / y 是图上百分比（按生成的图核对过） */
const SPOTS = {
  chishang: [
    { x: 67, y: 34, w: ['小娃', 'xiǎo wá'], line: 0 },
    { x: 47, y: 58, w: ['小艇', 'xiǎo tǐng'], line: 0, below: true },
    { x: 54, y: 48, w: ['白莲', 'bái lián'], line: 1 },
    { x: 22, y: 50, w: ['一道开的浮萍', 'yí dào kāi de fú píng'], line: 3, key: true },
  ],
  xiaochi: [
    { x: 7, y: 62, w: ['泉眼', 'quán yǎn'], line: 0 },
    { x: 36, y: 84, w: ['树阴', 'shù yīn'], line: 1 },
    { x: 55, y: 67, w: ['小荷', 'xiǎo hé'], line: 2 },
    { x: 61, y: 47, w: ['蜻蜓', 'qīng tíng'], line: 3 },
  ],
};
const FIND_DONE = {
  chishang: ['原来是浮萍“说出”了秘密：小船分开的那一道水路，就是小娃的踪迹！', 'yuán lái shì fú píng shuō chū le mì mì xiǎo chuán fēn kāi de nà yí dào shuǐ lù jiù shì xiǎo wá de zōng jì'],
  xiaochi: ['小池真美！泉水、树阴、小荷、蜻蜓都找到了。', 'xiǎo chí zhēn měi quán shuǐ shù yīn xiǎo hé qīng tíng dōu zhǎo dào le'],
};
document.querySelectorAll('.gs-find[data-find]').forEach((box) => {
  const key = box.dataset.find;
  box.innerHTML = SPOTS[key].map((s, i) => `<button type="button" class="gs-spot${s.below ? ' gs-below' : ''}" data-i="${i}" style="left:${s.x}%;top:${s.y}%" aria-label="找一找"><span class="gs-lab">${Hanzi.ruby(...s.w)}</span></button>`).join('');
  const side = document.querySelector(`.gs-findside[data-side="${key}"]`);
  side.innerHTML = `${POEMS[key].lines.map((l, i) => `<p class="gs-fl" data-l="${i}">${Hanzi.ruby(...l)}</p>`).join('')}
    <p class="gs-fcount">找到 <b>0</b> / ${SPOTS[key].length}</p><p class="gs-fdone"></p>`;
});

Hanzi.init({
  shapes: {
    泉: ['M14 40Q14 10 50 10Q86 10 86 40', 'M14 40V90', 'M86 40V90', 'M50 30V52', 'M50 52C44 64 56 72 50 92', 'M38 62L30 78', 'M62 62L70 78'],
    角: ['M28 92C22 56 34 24 62 6C54 30 60 60 72 92Z', 'M36 32H58', 'M30 52H64', 'M30 72H68'],
  },
  cards: [
    { z: '首', py: 'shǒu', bs: '首', bh: 9, words: [['二首', 'èr shǒu'], ['首先', 'shǒu xiān']] },
    { z: '踪', py: 'zōng', bs: '足', bh: 15, words: [['踪迹', 'zōng jì'], ['跟踪', 'gēn zōng']] },
    { z: '迹', py: 'jì', bs: '辶', bh: 9, words: [['踪迹', 'zōng jì'], ['足迹', 'zú jì']] },
    { z: '浮', py: 'fú', bs: '氵', bh: 10, words: [['浮萍', 'fú píng'], ['漂浮', 'piāo fú']] },
    { z: '萍', py: 'píng', bs: '艹', bh: 11, words: [['浮萍', 'fú píng'], ['青萍', 'qīng píng']] },
    { z: '泉', py: 'quán', bs: '水', bh: 9, words: [['泉眼', 'quán yǎn'], ['泉水', 'quán shuǐ']] },
    { z: '流', py: 'liú', bs: '氵', bh: 10, words: [['细流', 'xì liú'], ['流水', 'liú shuǐ']] },
    { z: '爱', py: 'ài', bs: '爫', bh: 10, words: [['爱护', 'ài hù'], ['可爱', 'kě ài']] },
    { z: '柔', py: 'róu', bs: '木', bh: 9, words: [['晴柔', 'qíng róu'], ['温柔', 'wēn róu']] },
    { z: '荷', py: 'hé', bs: '艹', bh: 10, words: [['小荷', 'xiǎo hé'], ['荷叶', 'hé yè']] },
    { z: '露', py: 'lù', bs: '雨', bh: 21, words: [['才露', 'cái lù'], ['露水', 'lù shuǐ']] },
    { z: '角', py: 'jiǎo', bs: '角', bh: 7, words: [['尖尖角', 'jiān jiān jiǎo'], ['牛角', 'niú jiǎo']] },
  ],
  evolve: [
    { z: '泉', note: '像山石上的一个洞，水从洞里流出来——泉水流出来的地方就叫“泉眼”。' },
    { z: '角', note: '像一只尖尖的牛角，上面有一道道纹路。小荷叶卷着，尖尖的，也像一只小角。' },
  ],
  write: [
    { z: '首', py: 'shǒu', bs: '首', bh: 9 },
    { z: '采', py: 'cǎi', bs: '爫', bh: 8 },
    { z: '无', py: 'wú', bs: '一', bh: 4 },
    { z: '树', py: 'shù', bs: '木', bh: 9 },
    { z: '爱', py: 'ài', bs: '爫', bh: 10 },
    { z: '尖', py: 'jiān', bs: '小', bh: 6 },
    { z: '角', py: 'jiǎo', bs: '角', bh: 7 },
  ],
});

function initFind() {
  document.querySelectorAll('.gs-find[data-find]').forEach((box) => {
    const key = box.dataset.find;
    const side = document.querySelector(`.gs-findside[data-side="${key}"]`);
    box.addEventListener('click', (e) => {
      const b = e.target.closest('.gs-spot');
      if (!b) return;
      const s = SPOTS[key][+b.dataset.i];
      b.classList.add('found');
      side.querySelectorAll('.gs-fl').forEach((p) => p.classList.toggle('now', +p.dataset.l === s.line));
      side.querySelector(`.gs-fl[data-l="${s.line}"]`).classList.add('lit');
      const n = box.querySelectorAll('.found').length;
      side.querySelector('.gs-fcount b').textContent = n;
      if (n === SPOTS[key].length) side.querySelector('.gs-fdone').innerHTML = Hanzi.ruby(...FIND_DONE[key]);
    });
  });
}

/* 撑小艇：读对一个字，浮萍分开 */
const WEEDS = [['首', 'shǒu'], ['踪', 'zōng'], ['迹', 'jì'], ['浮', 'fú'], ['萍', 'píng'], ['泉', 'quán'], ['流', 'liú'], ['爱', 'ài'], ['柔', 'róu'], ['荷', 'hé'], ['露', 'lù'], ['角', 'jiǎo']];
function initPond() {
  const weeds = document.getElementById('weeds');
  const water = document.getElementById('pondWater');
  const msg = document.getElementById('pondMsg');
  const tip = msg.textContent;
  weeds.innerHTML = WEEDS.map(([z, p], i) => `<button type="button" class="gs-weed" style="left:${16 + (i % 6) * 14}%;top:${i < 6 ? 20 : 80}%">${Hanzi.ruby(z, p)}</button>`).join('');
  const update = () => {
    const n = weeds.querySelectorAll('.open').length;
    water.style.setProperty('--p', n / WEEDS.length);
    msg.textContent = n === WEEDS.length ? '浮萍一道开！小艇撑到荷花边啦！' : (n ? `读对 ${n} 个，小艇往前撑！` : tip);
    msg.classList.toggle('win', n === WEEDS.length);
  };
  weeds.addEventListener('click', (e) => {
    const w = e.target.closest('.gs-weed:not(.open)');
    if (!w) return;
    w.classList.add('open');
    update();
  });
  document.getElementById('pondReset').addEventListener('click', () => {
    weeds.querySelectorAll('.open').forEach((w) => w.classList.remove('open'));
    update();
  });
  update();
}

window.LESSON = {
  init() {
    Narrative.init({});
    document.addEventListener('click', (e) => {
      const b = e.target.closest('.gs-nt-btn');
      if (b) b.classList.toggle('on', b.closest('.gs-card').classList.toggle('show-nt'));
    });
    initFind();
    initPond();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
