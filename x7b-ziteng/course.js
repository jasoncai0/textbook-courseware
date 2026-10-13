'use strict';
/* 紫藤萝瀑布 · 本课数据与本课专属互动（花穗色阶、改一改比一比）。记叙文通用互动见 ../shared/narrative.js */

/* 物—情—理：句子归类，归对后左侧花穗对应的一层亮起 */
const SORT = [
  { s: '只见一片辉煌的淡紫色，像一条瀑布，从空中垂下，不见其发端，也不见其终极。', ok: ['物'], q: '写花的颜色和形状' },
  { s: '花朵儿一串挨着一串，一朵接着一朵，彼此推着挤着，好不活泼热闹！', ok: ['物'], q: '写花的繁密、活泼' },
  { s: '它带走了这些时一直压在我心上的关于生死的疑惑，关于疾病的痛楚。', ok: ['情'], q: '花从眼前流进心里' },
  { s: '有的只是精神的宁静和生的喜悦。', ok: ['情'], q: '悲痛化为宁静、喜悦' },
  { s: '花和人都会遇到各种各样的不幸，但是生命的长河是无止境的。', ok: ['理'], q: '由花到人，悟出道理' },
  { s: '它是万花中的一朵，也正是一朵一朵花，组成了万花灿烂的流动的瀑布。', ok: ['理'], q: '个体与整体：每个生命都汇入长河' },
];

/* 思考探究二：原句 / 平淡改写 / 手法 */
const TASTE = [
  {
    tag: '化静为动',
    orig: '每一朵盛开的花就像是一个小小的张满了的帆，帆下带着尖底的舱。船舱鼓鼓的，又像一个忍俊不禁的笑容，就要绽开似的。',
    plain: '每一朵盛开的花都是鼓鼓的，好像就要开了。',
    why: '静止的花成了“张满了的帆”，鼓鼓的花苞成了“忍俊不禁的笑容”——花像要启航，像要笑出声，充满生命力。',
  },
  {
    tag: '多感官互通',
    orig: '这里除了光彩，还有淡淡的芳香，香气似乎也是浅紫色的，梦幻一般轻轻地笼罩着我。',
    plain: '这里除了光彩，还有淡淡的芳香。',
    why: '香气本是闻到的，作者却说它“浅紫色的”——嗅觉写成视觉（通感），香和色融成一片，梦幻般把“我”包围。',
  },
  {
    tag: '物我交融',
    orig: '紫色的瀑布遮住了粗壮的盘虬卧龙般的枝干，不断地流着，流着，流向人的心底。',
    plain: '紫色的花遮住了粗壮的枝干。',
    why: '“流着，流着”反复，像瀑布不停；“流向人的心底”——花的生命力流进人心，花与人融为一体。',
  },
];

const MOMENTS = [
  {
    name: '谈谈这句话', pic: 'beiying',
    prompt: '结合自己的经历或见闻，谈谈你对“花和人都会遇到各种各样的不幸，但是生命的长河是无止境的”这句话的理解。',
    hint: '先说句子的意思（不幸是暂时的，生命总要向前），再举一个具体的例子：自己、家人、书里或新闻里的人。',
    example: '去年爷爷生了一场大病，家里的空气好像都凝固了。可是出院后的第一个春天，他又在阳台上种满了花，每天早上给它们浇水。我这才明白：不幸会来，但日子总要往前过。就像紫藤萝，经历了稀落、被拆的年代，还是开成了一条瀑布。生命的长河，不会因为一块石头就停止流动。',
  },
  {
    name: '写一种景物', pic: 'huasui',
    prompt: '选一种你喜欢的景或物（一棵树、一盆花、一片云……），写一个片段，不少于 200 字。',
    hint: '①先观察它的特别之处：形状、颜色、光、声音、气味；②可以学课文“由整体到局部”“化静为动”“多感官互通”；③想一想它让你想到了什么——这就是“志”的种子。写完自己读一遍，做到文从字顺。',
    example: '楼下那棵老银杏，夏天绿得发黑，一到深秋却像忽然点着了。一树金黄，风一吹，叶子哗啦啦地响，像一群小扇子一齐鼓掌。阳光穿过叶缝，在地上洒下一层碎金。我捡起一片，叶脉一根一根清清楚楚，像老人手背上的纹路。它站在这里好几十年了，见过多少人来来去去，却每年都把最亮的颜色留到最后……',
  },
];

/* 花穗：三层由浅到深，越往下越窄 */
const BANDS = [
  { cls: 'b1', y0: 70, y1: 180, w0: 120, w1: 100, color: '#d8c4ee' },
  { cls: 'b2', y0: 180, y1: 290, w0: 100, w1: 74, color: '#a77fd0' },
  { cls: 'b3', y0: 290, y1: 405, w0: 74, w1: 30, color: '#5a2c8c' },
];

function buildSpike() {
  BANDS.forEach((b) => {
    const g = document.querySelector(`#spike .${b.cls} .petals`);
    let html = '';
    for (let y = b.y0; y < b.y1; y += 13) {
      const t = (y - b.y0) / (b.y1 - b.y0);
      const w = b.w0 + (b.w1 - b.w0) * t;
      const n = Math.max(2, Math.round(w / 22));
      for (let k = 0; k < n; k += 1) {
        const x = 150 - w / 2 + (w / (n - 1 || 1)) * k + (y % 2 ? 6 : -6);
        const r = 9 - t * 2;
        html += `<ellipse cx="${x.toFixed(1)}" cy="${y}" rx="${r.toFixed(1)}" ry="${(r * 0.8).toFixed(1)}" fill="${b.color}" stroke="#fff" stroke-width="1"/>`;
      }
    }
    g.innerHTML = html;
  });
}

function lightBand(kind) {
  const band = document.querySelector(`#spike [data-band="${kind}"]`);
  if (band) band.classList.add('lit');
}

function initSpike() {
  buildSpike();
  document.getElementById('spike').addEventListener('click', (e) => {
    const band = e.target.closest('.band');
    if (band) band.classList.toggle('lit');
  });
  // 归类正确时（shared 的分类逻辑先给行加 ok），点亮对应的一层
  document.getElementById('sortList').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-k]');
    if (btn && btn.closest('.sort-row').classList.contains('ok')) lightBand(btn.dataset.k);
  });
}

function initTaste() {
  const box = document.getElementById('tasteList');
  box.innerHTML = TASTE.map((t, i) => `<div class="taste" data-i="${i}">
      <p class="taste-s"><span class="orig">${t.orig}</span><span class="plain">${t.plain}</span></p>
      <div class="taste-ft">
        <button type="button" class="btn" data-act="plain">改成平淡的说法</button>
        <button type="button" class="btn" data-act="why">妙在哪里</button>
        <span class="taste-tag">${t.tag}</span>
      </div>
      <p class="taste-why" hidden>${t.why}</p>
    </div>`).join('');
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const card = btn.closest('.taste');
    if (btn.dataset.act === 'plain') {
      const on = card.classList.toggle('is-plain');
      btn.textContent = on ? '还原原句' : '改成平淡的说法';
    } else {
      card.classList.add('show-tag');
      card.querySelector('.taste-why').hidden = false;
    }
  });
}

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['物', '情', '理'], moments: MOMENTS });
    initSpike();
    initTaste();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
