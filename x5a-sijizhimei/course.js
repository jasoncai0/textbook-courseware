'use strict';
/* 四季之美（五上 22）· 本课数据。故事页、朗读、写话见 ../shared/narrative.js，背诵挖空见 ../shared/poem.js */

/* 背诵：一句一行，供挖空 */
const POEMS = {
  sj: {
    title: '四季之美', author: '［日本］清少纳言',
    lines: [
      { t: '春天最美是黎明。东方一点儿一点儿泛着鱼肚色的天空，染上微微的红晕，飘着红紫红紫的彩云。' },
      { t: '夏天最美是夜晚。明亮的月夜固然美，漆黑漆黑的暗夜，也有无数的萤火虫翩翩飞舞。' },
      { t: '即使是蒙蒙细雨的夜晚，也有一只两只萤火虫，闪着朦胧的微光在飞行，这情景着实迷人。' },
      { t: '秋天最美是黄昏。夕阳斜照西山时，动人的是点点归鸦急急匆匆地朝窠里飞去。' },
      { t: '成群结队的大雁，在高空中比翼而飞，更是叫人感动。夕阳西沉，夜幕降临，那风声、虫鸣，听起来也愈发叫人心旷神怡。' },
      { t: '冬天最美是早晨。落雪的早晨当然美，就是在遍地铺满白霜的早晨，或是在无雪无霜的凛冽的清晨，也要生起熊熊的炭火。' },
      { t: '手捧着暖和的火盆穿过走廊时，那闲逸的心情和这寒冷的冬晨多么和谐啊！' },
      { t: '只是到了中午，寒气渐退，火盆里的火炭，大多变成了一堆白灰，这未免令人有点儿扫兴。' },
    ],
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前调用

/* 选做：写一处印象最深的景致 */
const MOMENTS = [
  {
    name: '春天的早晨', pic: 'chun',
    prompt: '春天最美是____。选一个你见过的春天时刻写一写。',
    hint: '可以写雨后的柳枝、早晨的鸟叫、放学路上的花。写出它怎样动、怎样变。',
    example: '春天最美是雨后。柳枝刚洗过，嫩绿嫩绿的，风一吹，就轻轻地荡起来。几只麻雀从屋檐下钻出来，扑棱棱落到湿漉漉的草地上，蹦一蹦，啄一啄，又飞走了。',
  },
  {
    name: '夏天的夜晚', pic: 'xia',
    prompt: '夏天最美是____。写一个夏天里让你难忘的时刻。',
    hint: '可以写傍晚的晚霞、夜里的蛙声、雷雨过后的天空。别忘了写声音和动作。',
    example: '夏天最美是雷雨过后。乌云一下子散了，太阳又探出头来。屋檐上的水珠一滴一滴往下掉，“嗒、嗒”，像在数数。池塘里的青蛙憋了半天，这会儿“呱呱”地叫成了一片。',
  },
  {
    name: '秋天的黄昏', pic: 'qiu',
    prompt: '秋天最美是____。写一个秋天的时刻。',
    hint: '可以写落叶、晚霞、归鸟。用上“急急匆匆”“慢悠悠”这样写动作快慢的词。',
    example: '秋天最美是落叶的时候。一阵风吹过，银杏叶打着旋儿飘下来，像一只只金色的小蝴蝶。有的落在我的肩上，有的慢悠悠地躺在小路上，不一会儿，路就铺成了金黄色。',
  },
  {
    name: '冬天的早晨', pic: 'dong',
    prompt: '冬天最美是____。写一个冬天里让你觉得温暖或有趣的时刻。',
    hint: '可以写下雪、窗上的冰花、热气腾腾的早饭。冷和暖放在一起写，更有味道。',
    example: '冬天最美是下雪的早晨。推开窗，屋顶、树枝、院子全白了。小狗冲出门，在雪地上又蹦又跳，踩出一串小梅花。妈妈在厨房喊我喝粥，热气扑在冰凉的脸上，真舒服。',
  },
];

const rand = (a, b) => a + Math.random() * (b - a);

/* 萤火虫：一个个发光点在随机位置飘动、明灭 */
function fillFlies(box, n, maxTop) {
  box.innerHTML = Array.from({ length: n }, () =>
    `<i style="left:${rand(4, 96).toFixed(1)}%;top:${rand(12, maxTop).toFixed(1)}%;animation-delay:${rand(0, 4).toFixed(2)}s,${rand(0, 2).toFixed(2)}s;animation-duration:${rand(5, 9).toFixed(1)}s,${rand(1.2, 2.4).toFixed(1)}s"></i>`).join('');
}

const BIRD = 'M0 0 q8 -9 16 0 q8 -9 16 0';
/* 秋：归鸦从右往左下急飞，大雁排成人字在高空缓缓飞过 */
function buildBirds(svg) {
  svg.querySelector('.crows').innerHTML = Array.from({ length: 9 }, (_, i) =>
    `<g transform="translate(${1500 + (i % 3) * 60} ${240 + i * 22})"><path class="crow" d="${BIRD}" style="animation-delay:${(i * 0.35).toFixed(2)}s"/></g>`).join('');
  svg.querySelector('.geese').innerHTML = `<g class="vee-big">${Array.from({ length: 11 }, (_, i) => {
    const k = i - 5;
    return `<path d="${BIRD}" transform="translate(${Math.abs(k) * 42} ${k * 26}) scale(.8)"/>`;
  }).join('')}</g>`;
}

/* 课后第 2 题：三条小动画 */
function buildDynamic() {
  const fly = document.querySelector('.dyn-fly .drizzle');
  fly.innerHTML = Array.from({ length: 30 }, () => {
    const x = rand(0, 300).toFixed(0);
    const y = rand(-20, 100).toFixed(0);
    return `<line x1="${x}" y1="${y}" x2="${x - 3}" y2="${+y + 10}" style="animation-delay:${rand(0, 1).toFixed(2)}s"/>`;
  }).join('');
  document.querySelector('.dyn-geese .vee').innerHTML = Array.from({ length: 9 }, (_, i) => {
    const k = i - 4;
    return `<path d="M0 0 q5 -6 10 0 q5 -6 10 0" transform="translate(${Math.abs(k) * 16} ${50 + k * 9})"/>`;
  }).join('');
}

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    Poem.init();
    fillFlies(document.querySelector('.fx-flies.many'), 46, 80);
    fillFlies(document.querySelector('.fx-flies.few'), 2, 50);
    buildBirds(document.querySelector('.fx-birds'));
    buildDynamic();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
