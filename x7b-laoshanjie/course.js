'use strict';
/* 老山界 · 本课独有的“行军路线时空图”与“声音坐标”。通用部分见 ../shared/narrative.js */

/* 站点：x/y 在路线图上的位置；lx/ly/la 标签位置与对齐；seg 从上一站走到这一站的路径 */
const STOPS = [
  { x: 60, y: 395, lx: 30, ly: 430, la: 'start', time: '下午', place: '沿山沟向上走', q: '前面不知道为什么走不动，等了好久，才走了几步又要停下来等。', feel: '队伍挤得紧紧的，走走停停，又饿又烦。' },
  { x: 150, y: 380, lx: 150, ly: 356, la: 'middle', time: '下午', place: '瑶民家', seg: 'M60 395 L150 380', q: '我们给她钱，她不要。……我们还是把这整袋子米送给她。', feel: '攀谈、喝粥、送米，还贴标语“不准拆篱笆当火把”——红军爱护群众。' },
  { x: 240, y: 360, lx: 248, ly: 392, la: 'start', time: '天黑', place: '山脚竹林', seg: 'M150 380 L240 360', q: '只见火把排成许多“之”字形，一直连到天上，跟星光接起来，分不出是火把还是星星。', feel: '生平没见过的奇观——惊叹、豪迈。' },
  { x: 330, y: 250, lx: 318, ly: 270, la: 'end', time: '半夜', place: '峭壁下的窄路', seg: 'M240 360 L280 340 L250 320 L295 300 L265 280 L330 250', q: '路只有一尺来宽……只得裹一条毯子，横着心躺下去。', feel: '寒气逼人，却看见宝石般的星星，听见不可捉摸的声响。' },
  { x: 362, y: 232, lx: 372, ly: 254, la: 'start', time: '黎明', place: '原地出发', seg: 'M330 250 L362 232', q: '山下有人送饭上来，不管三七二十一，抢了一碗就吃。', feel: '马上写标语，分配人喊口号、演说，帮助病员和运输员。' },
  { x: 420, y: 160, lx: 432, ly: 182, la: 'start', time: '早上', place: '雷公岩', seg: 'M362 232 L420 225 L420 160', q: '几乎是九十度的垂直的石梯，只有一尺多宽；旁边就是悬崖……', feel: '最险的一段：崖下有马匹跌断了脚骨。' },
  { x: 540, y: 90, lx: 552, ly: 112, la: 'start', time: '接着', place: '二十多里陡山', seg: 'M420 160 L470 130 L540 90', q: '肚子很饿，气力不够，但是必须鼓着勇气前进。', feel: '一路写标语，掉了队；医务人员搀扶伤员病员，一点也不知道疲倦。' },
  { x: 640, y: 55, lx: 640, ly: 32, la: 'middle', time: '下午两点多', place: '山顶', seg: 'M540 90 L640 55', q: '难翻的老山界被我们这样笨重的队伍战胜了。', feel: '长长地吐了一口气——胜利的自豪。' },
  { x: 940, y: 395, lx: 985, ly: 430, la: 'end', time: '最后', place: '下山十五里 · 宿营地', seg: 'M640 55 C 760 120, 820 300, 940 395', q: '我们一口气儿跑下去，跑得真快。', feel: '部队养成新习惯：用脸盆、饭盒子、茶缸煮饭吃。' },
];
const FULL_ROUTE = `M60 395 ${STOPS.slice(1).map((s) => s.seg.replace(/^M[\d. ]+/, '')).join(' ')}`;

function buildRoute() {
  const stars = Array.from({ length: 46 }, (_, i) => `<circle cx="${(i * 97) % 1000}" cy="${(i * 53) % 170}" r="${1 + (i % 3) * .7}" fill="#fff" opacity="${.4 + (i % 4) * .15}"/>`).join('');
  document.getElementById('route').innerHTML = `
    <defs><linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101a33"/><stop offset="1" stop-color="#3a4a6a"/></linearGradient></defs>
    <rect width="1000" height="440" fill="url(#nightSky)"/>${stars}
    <path d="M0 440 L0 405 L60 400 L240 365 L330 258 L420 165 L540 92 L640 48 L760 128 L880 330 L1000 392 L1000 440 Z" fill="#26324a"/>
    <path d="M330 258 L420 165 L540 92 L640 48 L760 128" fill="none" stroke="#56688c" stroke-width="2"/>
    <path class="route-all" d="${FULL_ROUTE}"/>
    ${STOPS.slice(1).map((s, i) => `<path class="route-done draw" pathLength="1" data-step="${i + 2}" d="${s.seg}"/>`).join('')}
    ${STOPS.map((s, i) => `<g class="stop" data-step="${i + 1}" data-i="${i}"><circle cx="${s.x}" cy="${s.y}" r="11"/><text class="t-s" x="${s.lx}" y="${s.ly}" text-anchor="${s.la}">${s.time} · ${s.place}</text></g>`).join('')}
    <circle id="walker" r="7" cx="60" cy="395"/>`;
}
buildRoute(); // 必须在 deck.js 统计分步之前

function showStop(i) {
  const s = STOPS[i];
  document.querySelectorAll('#route .stop').forEach((g, k) => g.classList.toggle('cur', k === i));
  const w = document.getElementById('walker');
  w.setAttribute('cx', s.x);
  w.setAttribute('cy', s.y);
  document.getElementById('routeCard').innerHTML = `<p class="rc-no">第 ${i + 1} 站 · ${s.time}</p><h3>${s.place}</h3><blockquote>${s.q}</blockquote><p class="rc-feel">${s.feel}</p>`;
}

/* 声音坐标：x 0 细切 → 100 洪大；y 0 近 → 100 远 */
const SOUNDS = [
  { t: '春蚕在咀嚼桑叶', x: 22, y: 26, say: '细细的、密密的，好像就在耳边——极细切，又极近。' },
  { t: '山泉在呜咽', x: 25, y: 74, say: '低低的、断断续续，从远处山涧传来——细切而遥远，还带着一点哀婉。' },
  { t: '野马在平原上奔驰', x: 76, y: 70, say: '轰隆隆的，由远处滚滚而来——极洪大，又极远。' },
  { t: '波涛在澎湃', x: 74, y: 28, say: '一阵一阵涌过来，仿佛就在身边翻滚——洪大而切近。' },
];

function initSound() {
  const map = document.getElementById('soundMap');
  map.insertAdjacentHTML('beforeend', SOUNDS.map((s, i) => `<button type="button" class="snd" data-i="${i}" style="left:${s.x}%;top:${s.y}%"><i></i>${s.t}</button>`).join(''));
  map.addEventListener('click', (e) => {
    const b = e.target.closest('.snd');
    if (!b) return;
    map.querySelectorAll('.snd').forEach((x) => x.classList.toggle('on-sound', x === b));
    document.getElementById('soundSay').innerHTML = `<b>${SOUNDS[+b.dataset.i].t}：</b>${SOUNDS[+b.dataset.i].say}`;
  });
}

const PICKS = {
  hard: [
    { t: '山路陡峭', ok: true, why: '雷公岩几乎九十度' }, { t: '夜里寒冷', ok: true, why: '寒气逼人，刺入肌骨' },
    { t: '大雨滂沱', ok: false, why: '文中满天星光' }, { t: '饥饿', ok: true, why: '晚饭早饭都没吃饱' },
    { t: '疲劳', ok: true, why: '累得走不动就躺一会儿' }, { t: '迷失方向', ok: false, why: '有瑶民指路' },
    { t: '路窄难眠', ok: true, why: '路只有一尺来宽' }, { t: '后有追兵', ok: true, why: '五、八军团正在后面阻击' },
    { t: '缺水', ok: false, why: '泉水清得透底' }, { t: '队伍拥挤', ok: true, why: '走几步又要停下来' },
  ],
};

const CLUE_LABELS = ['揣摩', '读出的意思'];
const CLUES = [
  { q: '男人大概是因为听到过队伍，照着习惯，到什么地方去躲起来了。<br><small>从“照着习惯”和“躲”，你读出了什么？</small>', a: '过去的军队常欺压百姓，瑶民一听说来了队伍就躲——“习惯”说明受害已久；也反衬出红军与旧军队的不同。' },
  { q: '这真是我生平没见过的奇观。<br><small>“奇观”奇在哪里？蕴含怎样的情感？</small>', a: '火把排成“之”字一直连到天上，与星光连成一片；奇在壮美，也奇在山高路陡。字里有惊叹，更有乐观豪迈。' },
  { q: '远远地还听见敌人飞机的叹息，大概是在叹息自己的命运：为什么不到抗日的战线上去显显身手呢？<br><small>这句话有什么含义？</small>', a: '把飞机声说成“叹息”，是幽默的嘲讽：讽刺国民党军队不去抗日，反而追击北上抗日的红军；也见出红军的乐观。' },
  { q: '难翻的老山界被我们这样笨重的队伍战胜了。<br><small>如何理解“笨重”？</small>', a: '队伍庞大，行李多，还有伤员病员，行动不灵便；正因“笨重”，战胜大山更显出意志的强大——自谦里有自豪。' },
];

const MOMENTS = [
  {
    name: '写一次爬山', pic: 'leigongyan',
    prompt: '回忆一次爬山、远足或长途行走，用“时间 + 地点”做路标，写一个 300 字左右的片段。',
    hint: '先列路标：几点在哪里，发生了什么。选最难的一段详写，写出当时看到的、听到的、心里想的。',
    example: '早上七点，我们从山门出发……十点到了半山腰的“好汉坡”，台阶陡得像梯子，我的腿开始发抖，扶着铁链一步一歇。回头一看，山下的村子小得像积木，爸爸在后面喊：“别往下看，往上看！”中午十二点，我终于站上山顶，风呼呼地吹，我把水壶举得高高的——这座山，被我这双“笨重”的腿战胜了！',
  },
  {
    name: '写一种声音', pic: 'yesu',
    prompt: '学“像春蚕在咀嚼桑叶……”，写一种你在安静时听到的声音，用两三个比喻。',
    hint: '可以写深夜的雨声、考场里的笔声、清晨的鸟叫……',
    example: '考场里只剩下笔尖的声音，沙沙沙，像细雨落在树叶上，像小蚕在啃桑叶，又像时间自己在纸上悄悄地走。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    document.getElementById('route').addEventListener('click', (e) => {
      const g = e.target.closest('.stop');
      if (g) showStop(+g.dataset.i);
    });
    initSound();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-route') && step >= 1) showStop(Math.min(step, STOPS.length) - 1);
  },
};
