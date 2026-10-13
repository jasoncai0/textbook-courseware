'use strict';
/* 雨的四季 · 本课数据与互动。四季雨卡片在这里；分类、翻卡、小练笔见 ../shared/narrative.js */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* 冬雨：页面自绘的“木刻”——课文说冬雨中的田野“像一幅干净利落的木刻” */
const WOODCUT = `<svg viewBox="0 0 320 200" class="woodcut" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="320" height="200" fill="#e9ece6"/>
  <g stroke="#2a2a2a" stroke-linecap="round" fill="none">
    <path d="M0 132 H320" stroke-width="2"/>
    <path d="M0 140 l320 -3 M0 150 l320 2 M0 162 l320 -2 M0 176 l320 1 M0 190 l320 -1" stroke-width="1.2"/>
    <path d="M70 132 v-70 M70 96 l-22 -26 M70 84 l18 -24 M70 110 l-14 -10 M58 82 l-8 -14 M84 66 l6 -12" stroke-width="3"/>
    <path d="M250 132 v-56 M250 100 l20 -22 M250 90 l-18 -20 M262 86 l8 -12" stroke-width="2.6"/>
    <path d="M150 132 q24 -46 48 0 z" fill="#2a2a2a"/>
    <path d="M156 124 q18 -30 36 0 M162 114 q12 -18 24 0" stroke="#e9ece6" stroke-width="1.4"/>
  </g>
  <g stroke="#555" stroke-width="1" opacity=".55">
    ${Array.from({ length: 26 }, (_, i) => `<line x1="${8 + i * 12}" y1="${6 + (i % 4) * 9}" x2="${4 + i * 12}" y2="${30 + (i % 4) * 9}"/>`).join('')}
  </g>
</svg>`;

const SEASONS = [
  { key: 'chun', name: '春雨', pic: 'chunyu', trait: '美丽 · 娇媚', look: '一场春雨“洗淋”，树睁开明亮的眼睛，叶子起伏成绿茵茵的波浪',
    word: '洗淋', pang: '作者没有直接描绘春雨，而是写万物经雨洗淋后的情态。这样写有什么好处？',
    text: '春天，树叶开始闪出黄青，花苞轻轻地在风中摆动，似乎还带着一种冬天的昏黄。可是只要经过一场春雨的洗淋，那种颜色和神态是难以想象的。每一棵树仿佛都睁开特别明亮的眼睛，树枝的手臂也顿时柔软了，而那萌发的叶子，简直就像起伏着一层绿茵茵的波浪。水珠子从花苞里滴下来，比少女的眼泪还娇媚。半空中似乎总挂着透明的水雾的丝帘，牵动着阳光的彩棱镜。这时，整个大地是美丽的。小草似乎像复苏的蚯蚓一样翻动，发出一种春天才能听到的沙沙声。呼吸变得畅快，空气里像有无数芳甜的果子，在诱惑着鼻子和嘴唇。真的，只有这一场雨，才完全驱走了冬天，才使世界改变了姿容。' },
  { key: 'xia', name: '夏雨', pic: 'xiayu', video: true, trait: '热烈 · 粗犷', look: '连雷的预告也没有，豆粒大的雨点就打来了；透雨“浇灌”，大地丰满',
    word: '浇灌', pang: '春雨“洗淋”万物，夏雨却“浇灌”大地，准确写出雨的不同特点。',
    text: '而夏天，就更是别有一番风情了。夏天的雨也有夏天的性格，热烈而又粗犷。天上聚集几朵乌云，有时连一点儿雷的预告也没有，你还来不及思索，豆粒大的雨点就打来了。可这时雨并不可怕，因为你浑身的毛孔都热得张开了嘴，巴望着那清凉的甘露。打伞、戴斗笠固然能保持身上的干爽，可光头浇、洗个雨澡更有滋味，只是淋湿的头发、额头、睫毛滴着水，挡着眼睛的视线，耳朵也有些痒嗦嗦的。这时，你会更喜欢一切。如果说，春雨给大地披上美丽的衣裳，而经过几场夏天的透雨的浇灌，大地就以自己的丰满而展示它全部的诱惑了。一切都毫不掩饰地敞开了。花朵怒放着，树叶鼓着浆汁，数不清的杂草争先恐后地成长，暑气被一片绿的海绵吸收着。而荷叶铺满了河面，迫切地等待着雨点，和远方的蝉声、近处的蛙鼓一起奏起夏天的雨的交响曲。' },
  { key: 'qiu', name: '秋雨', pic: 'qiuyu', trait: '端庄 · 沉静', look: '“不大出门”；夜晚敲响窗玻璃，天暗雨却闪着光，田静雨却在倾诉',
    word: '倾诉', pang: '凄冷的秋雨为什么能“纯净”人们的灵魂呢？',
    text: '当田野染上一层金黄，各种各样的果实摇着铃铛的时候，雨，似乎也像出嫁生了孩子的妇人，显得端庄而又沉静了。这时候，雨不大出门。田野上几乎总是金黄的太阳。也许，人们都忘记了雨。成熟的庄稼等待收割，金灿灿的种子需要晒干，甚至红透了的山果也希望最后的晒甜。忽然，在一个夜晚，窗玻璃上发出了响声，那是雨，是使人静谧、使人怀想、使人动情的秋雨啊！天空是暗的，但雨却闪着光；田野是静的，但雨在倾诉着。顿时，你会产生一脉悠远的情思。也许，在人们劳累了一个春夏，收获已经在大门口的时候，多么需要安静和沉思啊！雨变得更轻，也更深情了，水声在屋檐下，水花在窗玻璃上，会陪伴着你的夜梦。如果你怀着那种快乐感的话，那白天的秋雨也不会使人厌烦。你只会感到更高邈、深远，并让凄冷的雨滴，去纯净你的灵魂，而且一定会遥望到一场秋雨后将出现的一个更净美、开阔的大地。' },
  { key: 'dong', name: '冬雨', svg: WOODCUT, trait: '自然 · 平静', look: '化了妆变成雪花；在南国偶尔造访，透明、干巴，田野像一幅木刻',
    word: '造访', pang: '这种“特殊的温暖”，是一种怎样的感觉？',
    text: '也许，到冬天来临，人们会讨厌雨吧！但这时候，雨已经化了妆，它经常变成美丽的雪花，飘然莅临人间。但在南国，雨仍然偶尔造访大地，但它变得更吝啬了。它既不倾盆瓢泼，又不绵绵如丝，或淅淅沥沥，它显出一种自然、平静。在冬日灰蒙蒙的天空中，雨变得透明，甚至有些干巴，几乎没有春、夏、秋那样富有色彩。但是，人们受够了冷冽的风的刺激，讨厌那干涩而苦的气息，当雨在头顶上飘落的时候，似乎又降临了一种特殊的温暖，仿佛从那湿润中又漾出花和树叶的气息。那种清冷是柔和的，没有北风那样咄咄逼人。远远地望过去，收割过的田野变得很亮，没有叶的枝干、淋着雨的草垛，对着瓷色的天空，像一幅干净利落的木刻。而近处池畦里的油菜，经这冬雨一洗，甚至忘记了严冬。忽然到了晚间，水银柱降下来，黎明提前敲着窗户，你睁眼一看，屋顶、树枝、街道，都已经盖上柔软的雪被，地上的光亮比天上还亮。这雨的精灵，雨的公主，给南国城市和田野带来异常的蜜情，是它送给人们一年中最后的一份礼物。' },
];

function cardPic(s) {
  if (s.svg) return `<div class="rc-pic">${s.svg}</div>`;
  if (s.video) return `<div class="rc-pic"><video class="scene-bg" data-src="assets/${s.pic}.mp4" data-poster="assets/${s.pic}.jpg" muted loop playsinline preload="none"></video></div>`;
  return `<div class="rc-pic" data-bg="assets/${s.pic}.jpg"></div>`;
}

function buildCards() {
  document.getElementById('rainCards').innerHTML = SEASONS.map((s, i) => `<button type="button" class="rc rc-${s.key}" data-i="${i}" data-step="${i + 1}">
    ${cardPic(s)}<b>${s.name}</b><span>${s.trait}</span></button>`).join('');
}
buildCards(); // 必须在 deck.js 统计分步之前生成

function showSeason(i) {
  const s = SEASONS[i];
  document.querySelectorAll('#rainCards .rc').forEach((c, k) => c.classList.toggle('cur', k === i));
  const marked = esc(s.text).replace(esc(s.word), `<em>${esc(s.word)}</em>`);
  document.getElementById('rainDetail').innerHTML = `
    <div class="quote rd-text"><h4>${s.name} · 原文</h4><p>${marked}</p></div>
    <div class="rd-side">
      <p class="tip"><b>容貌：</b>${s.look}</p>
      <p class="tip"><b>性情：</b><span class="rd-trait">${s.trait}</span></p>
      <p class="tip jade"><b>旁批：</b>${s.pang}</p>
    </div>`;
}

function initCards() {
  document.getElementById('rainCards').addEventListener('click', (e) => {
    const c = e.target.closest('.rc');
    if (c) showSeason(+c.dataset.i);
  });
  showSeason(0);
}

// 卡片页：走到第 n 步就自动显示第 n 季（老师点卡片也能随时切换）
function updateCards(slide, step) {
  if (!slide.querySelector('#rainCards') || step < 1) return;
  showSeason(Math.min(step, SEASONS.length) - 1);
}

/* ================= 感官分类 ================= */
const KINDS = ['视觉', '听觉', '嗅觉', '触觉'];
const SORT = [
  { s: '水珠子从花苞里滴下来，比少女的眼泪还娇媚。', ok: ['视觉'], q: '看：晶莹的水珠' },
  { s: '小草似乎像复苏的蚯蚓一样翻动，发出一种春天才能听到的沙沙声。', ok: ['听觉', '视觉'], q: '听：沙沙声（也看到小草翻动）' },
  { s: '空气里像有无数芳甜的果子，在诱惑着鼻子和嘴唇。', ok: ['嗅觉'], q: '闻：芳甜的气息' },
  { s: '淋湿的头发、额头、睫毛滴着水，挡着眼睛的视线，耳朵也有些痒嗦嗦的。', ok: ['触觉'], q: '身体的感受：湿、痒' },
  { s: '天空是暗的，但雨却闪着光；田野是静的，但雨在倾诉着。', ok: ['视觉', '听觉'], q: '看：闪光；听：倾诉' },
  { s: '那种清冷是柔和的，没有北风那样咄咄逼人。', ok: ['触觉'], q: '皮肤感到的清冷、柔和' },
];

/* ================= 旁批翻卡 ================= */
const CLUE_LABELS = ['旁批', '可以这样想'];
const CLUES = [
  { q: '作者没有直接描绘春雨，而是写万物经雨洗淋后的情态。这样写有什么好处？', a: '春雨细、轻，不好直接写。写树“睁开眼睛”、叶子“绿茵茵的波浪”，从侧面写出春雨的滋润，更有画面感，也更生动。' },
  { q: '凄冷的秋雨为什么能“纯净”人们的灵魂呢？', a: '秋雨轻而深情，让劳累了一个春夏的人安静下来、沉思起来；心静了，杂念少了，就仿佛被洗得干净了。' },
  { q: '这种“特殊的温暖”，是一种怎样的感觉？', a: '受够了冷冽干涩的北风，一场湿润的冬雨飘下来，带着花和树叶的气息——清冷却柔和，像在寒冬里被轻轻安慰。' },
  { q: '春雨“洗淋”万物，夏雨却“浇灌”大地，准确写出雨的不同特点。<small>想一想：两个词换一换行吗？</small>', a: '不行。“洗淋”轻柔，写春雨细润；“浇灌”有力，写夏雨的透、猛。用词准确，才写出雨的不同性格。' },
];

/* ================= 小练笔 ================= */
const MOMENTS = [
  { name: '写一场雪', pic: 'qiuyu', prompt: '给“雪”写一张名片：写出它的容貌和性情。',
    hint: '雪落下来是什么样子？踩上去什么声音？摸起来什么感觉？它像一个什么样的人？',
    example: '雪是个安静的孩子。它来的时候从不敲门，一夜之间，屋顶、树枝、街道全换了白衣裳。早上踩上去咯吱咯吱，像它在偷偷地笑；捧一把在手心，凉丝丝的，一会儿就化成一汪水，好像害羞地跑掉了。' },
  { name: '写一阵风', pic: 'chunyu', prompt: '给“风”写一张名片：选一个季节的风来写。',
    hint: '风看不见，就写它让别的东西发生了什么变化——就像作者写春雨，写的是雨后万物的样子。',
    example: '秋天的风是个忙碌的邮递员，把一片片黄叶送到每家门口；它从稻田上跑过，稻穗就弯着腰向它点头；它钻进衣领，凉凉的，提醒你该加件衣服了。' },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: KINDS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initCards();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateCards(slide, step);
  },
};
