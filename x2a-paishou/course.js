'use strict';
/* 拍手歌 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：“拍手读”——点一下拍一下，一拍亮一个字，可以自动打节拍；“隹”和“鸟”的字理；保护动物判一判。 */

const VERSES = [
  ['你拍一，我拍一，', 'nǐ pāi yī wǒ pāi yī', '动物世界很新奇。', 'dòng wù shì jiè hěn xīn qí', '🐾'],
  ['你拍二，我拍二，', 'nǐ pāi èr wǒ pāi èr', '孔雀锦鸡是伙伴。', 'kǒng què jǐn jī shì huǒ bàn', '🦚'],
  ['你拍三，我拍三，', 'nǐ pāi sān wǒ pāi sān', '雄鹰飞翔云彩间。', 'xióng yīng fēi xiáng yún cai jiān', '🦅'],
  ['你拍四，我拍四，', 'nǐ pāi sì wǒ pāi sì', '天空雁群会写字。', 'tiān kōng yàn qún huì xiě zì', '🕊️'],
  ['你拍五，我拍五，', 'nǐ pāi wǔ wǒ pāi wǔ', '丛林深处有猛虎。', 'cóng lín shēn chù yǒu měng hǔ', '🐯'],
  ['你拍六，我拍六，', 'nǐ pāi liù wǒ pāi liù', '黄鹂百灵唱不休。', 'huáng lí bǎi líng chàng bù xiū', '🐦'],
  ['你拍七，我拍七，', 'nǐ pāi qī wǒ pāi qī', '竹林熊猫在嬉戏。', 'zhú lín xióng māo zài xī xì', '🐼'],
  ['你拍八，我拍八，', 'nǐ pāi bā wǒ pāi bā', '大小动物都有家。', 'dà xiǎo dòng wù dōu yǒu jiā', '🏡'],
  ['你拍九，我拍九，', 'nǐ pāi jiǔ wǒ pāi jiǔ', '人和动物是朋友。', 'rén hé dòng wù shì péng you', '🤝'],
  ['你拍十，我拍十，', 'nǐ pāi shí wǒ pāi shí', '保护动物是大事。', 'bǎo hù dòng wù shì dà shì', '💚'],
];
const NUMS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const BEAT_MS = 520;

/* 拍手声：一小段噪声，不用音频文件 */
let audio = null;
function clapSound() {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const len = Math.floor(audio.sampleRate * 0.09);
    const buf = audio.createBuffer(1, len, audio.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
    const src = audio.createBufferSource();
    const f = audio.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1400;
    src.buffer = buf;
    src.connect(f).connect(audio.destination);
    src.start();
  } catch (e) { /* 浏览器不支持声音时只有动画 */ }
}

// 一行字拆成“字”和“标点”，每个字是一拍
const beats = (text, py) => {
  const syl = py.split(' ');
  let k = 0;
  return [...text].map((ch) => (/\p{Script=Han}/u.test(ch) ? `<span class="ps-b">${Hanzi.ruby(ch, syl[k++])}</span>` : `<span class="ps-p">${ch}</span>`)).join('');
};

function initClap(box) {
  box.innerHTML = `<div class="ps-nums">${NUMS.map((n, i) => `<button type="button" class="ps-num" data-v="${i}">${n}</button>`).join('')}</div>
    <div class="ps-card"><span class="ps-emo"></span><p class="ps-l1"></p><p class="ps-l2"></p></div>
    <div class="ps-ctrl">
      <button type="button" class="ps-pad" aria-label="拍一下"><span class="hand l">🤚</span><span class="hand r">🤚</span><b>拍！</b></button>
      <div class="ps-side"><button type="button" class="btn solid" data-auto>自动打拍子</button><button type="button" class="btn" data-restart>重新拍这一节</button><p class="ps-msg">点“拍！”，拍一下读一个字。</p></div>
    </div>`;
  const card = box.querySelector('.ps-card');
  const pad = box.querySelector('.ps-pad');
  const msg = box.querySelector('.ps-msg');
  const autoBtn = box.querySelector('[data-auto]');
  let v = 0;
  let k = 0;
  let timer = 0;
  const stopAuto = () => { clearInterval(timer); timer = 0; autoBtn.textContent = '自动打拍子'; };
  const show = (i) => {
    v = i;
    k = 0;
    const [l1, p1, l2, p2, emo] = VERSES[v];
    box.querySelector('.ps-l1').innerHTML = beats(l1, p1);
    box.querySelector('.ps-l2').innerHTML = beats(l2, p2);
    box.querySelector('.ps-emo').textContent = emo;
    card.classList.remove('done');
    box.querySelectorAll('.ps-num').forEach((b, n) => b.classList.toggle('on', n === v));
    msg.textContent = '点“拍！”，拍一下读一个字。';
  };
  const clap = () => {
    const all = box.querySelectorAll('.ps-b');
    if (k >= all.length) {
      if (v < VERSES.length - 1) { show(v + 1); return; }
      stopAuto();
      msg.textContent = '十节都拍完啦！';
      return;
    }
    all[k].classList.add('lit');
    k += 1;
    pad.classList.remove('hit');
    void pad.offsetWidth;
    pad.classList.add('hit');
    clapSound();
    if (k === all.length) { card.classList.add('done'); msg.textContent = v < VERSES.length - 1 ? '这一节拍完了！再拍一下进入下一节。' : '十节都拍完啦！'; }
  };
  box.addEventListener('click', (e) => {
    const num = e.target.closest('.ps-num');
    if (num) { stopAuto(); show(+num.dataset.v); return; }
    if (e.target.closest('.ps-pad')) { clap(); return; }
    if (e.target.closest('[data-restart]')) { stopAuto(); show(v); return; }
    if (e.target.closest('[data-auto]')) {
      if (timer) { stopAuto(); return; }
      autoBtn.textContent = '停下来';
      timer = setInterval(clap, BEAT_MS);
    }
  });
  // 离开本页时停下自动节拍
  new MutationObserver(() => { if (!box.closest('.slide').classList.contains('active')) stopAuto(); })
    .observe(box.closest('.slide'), { attributes: true, attributeFilter: ['class'] });
  show(0);
}
initClap(document.getElementById('psClap'));

const STORY = {
  picks: {
    hu: [
      { t: '冬天给小鸟撒些谷子', ok: true, why: '✓ 帮小鸟过冬' },
      { t: '用弹弓打树上的小鸟', ok: false, why: '✗ 会伤害小鸟' },
      { t: '不买野生动物做的东西', ok: true, why: '✓ 不让人去捕杀它们' },
      { t: '把小鸟关进笼子里玩', ok: false, why: '✗ 小鸟属于天空和树林' },
      { t: '节约用纸，爱护树林', ok: true, why: '✓ 树林是动物的家' },
      { t: '在动物园敲玻璃吓动物', ok: false, why: '✗ 会吓坏它们' },
      { t: '看到受伤的小动物，告诉大人', ok: true, why: '✓ 请大人帮忙救它' },
    ],
  },
};

Hanzi.init({
  shapes: {
    鸟: ['M30 30a10 10 0 1 0 20 0a10 10 0 1 0-20 0', 'M28 28L14 32L28 36', 'M48 36Q80 30 88 54Q70 72 40 64Q30 50 48 36', 'M88 54L98 44', 'M50 64L46 92', 'M64 66L62 92'],
    隹: ['M42 22a9 9 0 1 0 18 0a9 9 0 1 0-18 0', 'M42 22L28 26L42 30', 'M58 28Q80 36 72 62Q56 72 40 60Q34 40 58 28', 'M72 62L80 68', 'M50 66L48 92', 'M62 66L62 92'],
  },
  evolve: [
    { z: '鸟', note: '像一只鸟：有头、有嘴、有翅膀、长长的尾巴。“鸡、鹂、鹅”都带“鸟”。' },
    { z: '隹', note: '也是鸟，古人说是短尾巴的鸟。“雀、雁、鹰”都带“隹”（zhuī）。' },
  ],
  cards: [
    { z: '世', py: 'shì', words: [['世界', 'shì jiè']] },
    { z: '界', py: 'jiè', words: [['世界', 'shì jiè'], ['国界', 'guó jiè']] },
    { z: '孔', py: 'kǒng', words: [['孔雀', 'kǒng què']] },
    { z: '雀', py: 'què', words: [['孔雀', 'kǒng què'], ['麻雀', 'má què']] },
    { z: '锦', py: 'jǐn', words: [['锦鸡', 'jǐn jī']] },
    { z: '雄', py: 'xióng', words: [['雄鹰', 'xióng yīng'], ['英雄', 'yīng xióng']] },
    { z: '鹰', py: 'yīng', words: [['雄鹰', 'xióng yīng'], ['老鹰', 'lǎo yīng']] },
    { z: '翔', py: 'xiáng', words: [['飞翔', 'fēi xiáng']] },
    { z: '雁', py: 'yàn', words: [['大雁', 'dà yàn'], ['雁群', 'yàn qún']] },
    { z: '丛', py: 'cóng', words: [['丛林', 'cóng lín'], ['草丛', 'cǎo cóng']] },
    { z: '深', py: 'shēn', words: [['深处', 'shēn chù'], ['深海', 'shēn hǎi']] },
    { z: '猛', py: 'měng', words: [['猛虎', 'měng hǔ'], ['勇猛', 'yǒng měng']] },
    { z: '灵', py: 'líng', words: [['百灵', 'bǎi líng'], ['灵活', 'líng huó']] },
    { z: '休', py: 'xiū', words: [['不休', 'bù xiū'], ['休息', 'xiū xi']] },
  ],
  pick: [
    { q: 'què', ans: '雀', opts: ['雀', '省', '准'] },
    { q: 'yīng', ans: '鹰', opts: ['应', '鹰', '鹏'] },
    { q: 'yàn', ans: '雁', opts: ['燕', '厌', '雁'] },
    { q: 'xiáng', ans: '翔', opts: ['翔', '详', '羊'] },
    { q: 'měng', ans: '猛', opts: ['孟', '猛', '狗'] },
    { q: 'jiè', ans: '界', opts: ['介', '果', '界'] },
    { q: 'xiū', ans: '休', opts: ['体', '休', '木'] },
  ],
  write: {
    a: [
      { z: '歌', py: 'gē', bs: '欠', bh: 14 },
      { z: '写', py: 'xiě', bs: '冖', bh: 5 },
      { z: '丛', py: 'cóng', bs: '一', bh: 5 },
      { z: '深', py: 'shēn', bs: '氵', bh: 11 },
      { z: '六', py: 'liù', bs: '八', bh: 4 },
    ],
    b: [
      { z: '熊', py: 'xióng', bs: '灬', bh: 14 },
      { z: '猫', py: 'māo', bs: '犭', bh: 11 },
      { z: '九', py: 'jiǔ', bs: '丿', bh: 2 },
      { z: '朋', py: 'péng', bs: '月', bh: 8 },
      { z: '友', py: 'yǒu', bs: '又', bh: 4 },
    ],
  },
});

/* 读儿歌页只显示当前这一节（两行一节） */
window.LESSON = {
  init() { Narrative.init(STORY); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
