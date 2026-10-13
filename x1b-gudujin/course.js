'use strict';
/* 古对今 · 本课数据。识字组件见 ../shared/hanzi.js；对对子见 zuzi.js（都在顶层调用，deck.js 加载前渲染完） */

/* 拍手读对子（本课独有）：每行按“拍”分组，[文字, 拼音]；点一下亮一拍 */
const CLAP = [
  [['古', 'gǔ'], ['对', 'duì'], ['今，', 'jīn'], ['圆', 'yuán'], ['对', 'duì'], ['方。', 'fāng']],
  [['严寒', 'yán hán'], ['对', 'duì'], ['酷暑，', 'kù shǔ'], ['春暖', 'chūn nuǎn'], ['对', 'duì'], ['秋凉。', 'qiū liáng']],
  [['晨', 'chén'], ['对', 'duì'], ['暮，', 'mù'], ['雪', 'xuě'], ['对', 'duì'], ['霜。', 'shuāng']],
  [['和风', 'hé fēng'], ['对', 'duì'], ['细雨，', 'xì yǔ'], ['朝霞', 'zhāo xiá'], ['对', 'duì'], ['夕阳。', 'xī yáng']],
  [['桃', 'táo'], ['对', 'duì'], ['李，', 'lǐ'], ['柳', 'liǔ'], ['对', 'duì'], ['杨。', 'yáng']],
  [['莺歌', 'yīng gē'], ['对', 'duì'], ['燕舞，', 'yàn wǔ'], ['鸟语', 'niǎo yǔ'], ['对', 'duì'], ['花香。', 'huā xiāng']],
];

function initClap(box) {
  box.innerHTML = `<div class="gj-lines">${CLAP.map((line, i) => `<p class="${i % 2 ? '' : 'gj-gap'}">${line.map(([t, py]) => `<span class="gj-beat${t === '对' ? ' dui' : ''}">${Hanzi.ruby(t, py)}</span>`).join('')}</p>`).join('')}</div>
    <div class="gj-ctrl"><button type="button" class="btn solid" data-clap-go>拍一下</button><span class="gj-count">已拍 <b>0</b> 下</span><button type="button" class="btn" data-clap-reset>从头拍</button></div>`;
  const beats = [...box.querySelectorAll('.gj-beat')];
  const count = box.querySelector('.gj-count b');
  let n = 0;
  const go = () => {
    if (n >= beats.length) return;
    beats.forEach((b) => b.classList.remove('now'));
    beats[n].classList.add('now', 'done');
    n += 1;
    count.textContent = n;
    box.classList.toggle('all-done', n === beats.length);
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-clap-reset]')) {
      n = 0; count.textContent = 0;
      beats.forEach((b) => b.classList.remove('now', 'done'));
      box.classList.remove('all-done');
      return;
    }
    if (e.target.closest('[data-clap-go], .gj-lines')) go();
  });
}
document.querySelectorAll('[data-clap]').forEach(initClap);

Zuzi.init({
  sort: {
    dui: {
      buckets: [
        { t: '古对□', py: 'gǔ duì', ok: ['今'] },
        { t: '圆对□', py: 'yuán duì', ok: ['方'] },
        { t: '严寒对□', py: 'yán hán duì', ok: ['酷暑'] },
        { t: '春暖对□', py: 'chūn nuǎn duì', ok: ['秋凉'] },
        { t: '晨对□', py: 'chén duì', ok: ['暮'] },
        { t: '雪对□', py: 'xuě duì', ok: ['霜'] },
        { t: '和风对□', py: 'hé fēng duì', ok: ['细雨'] },
        { t: '朝霞对□', py: 'zhāo xiá duì', ok: ['夕阳'] },
      ],
      cards: [['今', 'jīn'], ['方', 'fāng'], ['酷暑', 'kù shǔ'], ['秋凉', 'qiū liáng'], ['暮', 'mù'], ['霜', 'shuāng'], ['细雨', 'xì yǔ'], ['夕阳', 'xī yáng']],
    },
  },
});

Hanzi.init({
  shapes: {
    雨: ['M12 14H88', 'M18 30V90', 'M18 30H82V90', 'M50 14V58', 'M32 44L36 54', 'M32 66L36 76', 'M64 44L68 54', 'M64 66L68 76'],
  },
  evolve: [
    { z: '木', note: '像一棵树。“桃、李、柳、杨”都是树，都有“木”。' },
    { z: '日', note: '像太阳。“晨、暑、暖”都和太阳有关，都有“日”。' },
    { z: '雨', note: '像天上落下雨点。“雪、霜、霞”都和天气有关，都有雨字头。' },
  ],
  cards: [
    { z: '圆', py: 'yuán', bs: '囗', bh: 10, words: [['圆对方', 'yuán duì fāng'], ['圆形', 'yuán xíng']] },
    { z: '严', py: 'yán', bs: '一', bh: 7, words: [['严寒', 'yán hán']] },
    { z: '寒', py: 'hán', bs: '宀', bh: 12, words: [['严寒', 'yán hán'], ['寒冷', 'hán lěng']] },
    { z: '酷', py: 'kù', bs: '酉', bh: 14, words: [['酷暑', 'kù shǔ']] },
    { z: '暑', py: 'shǔ', bs: '日', bh: 12, words: [['酷暑', 'kù shǔ'], ['暑假', 'shǔ jià']] },
    { z: '凉', py: 'liáng', bs: '冫', bh: 10, words: [['秋凉', 'qiū liáng'], ['凉快', 'liáng kuai']] },
    { z: '晨', py: 'chén', bs: '日', bh: 11, words: [['早晨', 'zǎo chen'], ['清晨', 'qīng chén']] },
    { z: '细', py: 'xì', bs: '纟', bh: 8, words: [['细雨', 'xì yǔ'], ['细小', 'xì xiǎo']] },
    { z: '朝', py: 'zhāo', bs: '月', bh: 12, words: [['朝霞', 'zhāo xiá']] },
    { z: '霞', py: 'xiá', bs: '雨', bh: 17, words: [['朝霞', 'zhāo xiá'], ['彩霞', 'cǎi xiá']] },
    { z: '夕', py: 'xī', bs: '夕', bh: 3, words: [['夕阳', 'xī yáng']] },
    { z: '杨', py: 'yáng', bs: '木', bh: 7, words: [['杨树', 'yáng shù'], ['柳对杨', 'liǔ duì yáng']] },
  ],
  write: {
    a: [
      { z: '古', py: 'gǔ', bs: '十', bh: 5 },
      { z: '凉', py: 'liáng', bs: '冫', bh: 10 },
      { z: '细', py: 'xì', bs: '纟', bh: 8 },
      { z: '夕', py: 'xī', bs: '夕', bh: 3 },
    ],
    b: [
      { z: '李', py: 'lǐ', bs: '木', bh: 7 },
      { z: '语', py: 'yǔ', bs: '讠', bh: 9 },
      { z: '香', py: 'xiāng', bs: '香', bh: 9 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
