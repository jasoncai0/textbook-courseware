'use strict';
/* 月光曲 · 本课数据。故事页见 ../shared/narrative.js，背诵挖空借用 ../shared/poem.js */

// 第 9 自然段，按句子拆开，供背诵挖空
Poem.render({
  p9: {
    title: '第 9 自然段', author: '《月光曲》',
    lines: [
      { t: '皮鞋匠静静地听着。' },
      { t: '他好像面对着大海，月亮正从水天相接的地方升起来。' },
      { t: '微波粼粼的海面上，霎时间洒满了银光。' },
      { t: '月亮越升越高，穿过一缕一缕轻纱似的微云。' },
      { t: '忽然，海面上刮起了大风，卷起了巨浪。' },
      { t: '被月光照得雪亮的浪花，一个连一个朝着岸边涌过来……' },
    ],
  },
});

/* 乐曲起伏线：三段由轻到重 */
function buildWave() {
  const svg = document.getElementById('wave');
  const W = 900;
  const pts = [];
  for (let x = 40; x <= W - 30; x += 6) {
    const t = (x - 40) / (W - 70);
    const amp = t < .35 ? 8 : t < .65 ? 8 + (t - .35) * 100 : 40 + Math.sin(t * 40) * 6;
    const freq = t < .35 ? .05 : t < .65 ? .07 : .12;
    const base = 180 - t * 60;
    pts.push(`${x} ${(base + Math.sin(x * freq) * amp).toFixed(1)}`);
  }
  svg.querySelector('.music-line').setAttribute('d', `M${pts.join(' L')}`);
  svg.querySelector('.labels').innerHTML = [['轻柔', 150], ['渐强', 430], ['高昂激荡', 720]]
    .map(([t, x]) => `<text class="t-m t-c" x="${x}" y="40" fill="#cfe3f8">${t}</text>`).join('');
}

const MOMENTS = [
  {
    name: '轻柔的音乐', pic: 'dahai',
    prompt: '听一段轻柔、舒缓的音乐（比如摇篮曲、《春江花月夜》），你仿佛看到了什么？',
    hint: '学第 9 自然段：先写看到的景物，再写它怎样慢慢变化。',
    example: '琴声轻轻响起，我仿佛看见一条小河在月光下静静地流淌，河面上闪着细碎的银光。一只小船慢慢划过，船桨拨开的水纹一圈一圈荡开去……',
  },
  {
    name: '欢快的音乐', pic: 'xiaolu',
    prompt: '听一段欢快的音乐（比如《喜洋洋》《春节序曲》），你仿佛看到了什么？',
    hint: '音乐越来越快、越来越响时，画面也要跟着热闹起来。',
    example: '锣鼓一响，我仿佛走进了热闹的庙会：舞狮的跳上跳下，卖糖葫芦的吆喝着，孩子们拉着大人的手挤来挤去，鞭炮噼里啪啦响成一片……',
  },
  {
    name: '激昂的音乐', pic: 'dahai',
    prompt: '听一段激昂的音乐（比如《黄河大合唱》），你仿佛看到了什么？',
    hint: '想想有力量的景物：奔腾的江河、飞驰的骏马、翻滚的云……',
    example: '音乐一下子激昂起来，我仿佛站在黄河岸边，看见浊浪排山倒海般奔腾而来，船工们喊着号子，奋力摇着船桨，在浪尖上前进……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    Poem.init();
    buildWave();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
