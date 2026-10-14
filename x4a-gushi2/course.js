'use strict';
/* 古诗三首（四上 21）· 本课数据与互动。诗文模板见 ../shared/poem.js，画面与翻卡片见 ../shared/narrative.js */

const POEMS = {
  cs: {
    title: '出塞', author: '［唐］王昌龄',
    lines: [
      { t: '秦时明月汉时关，', r: '秦时/明月/汉时关，', f: '1.15 75% 25%' },
      { t: '万里长征人未还。', r: '万里/长征/人未还。', f: '1.1 40% 60%' },
      { t: '但使龙城飞将在，', r: '但使/龙城/飞将在，', f: '1.2 50% 45%' },
      { t: '不教胡马度阴山。', r: '不教/胡马/度阴山。', f: '1.25 30% 55%' },
    ],
    notes: { 但使: '只要', 飞将: '“龙城飞将”指汉朝名将李广。这里泛指英勇善战的将领', 教: '令，使', 胡马: '指侵扰中原的北方游牧民族骑兵', 阴山: '位于今内蒙古中部及河北北部' },
  },
  lz: {
    title: '凉州词', author: '［唐］王翰',
    lines: [
      { t: '葡萄美酒夜光杯，', r: '葡萄/美酒/夜光杯，', f: '1.25 50% 60%' },
      { t: '欲饮琵琶马上催。', r: '欲饮/琵琶/马上催。', f: '1.25 70% 55%' },
      { t: '醉卧沙场君莫笑，', r: '醉卧/沙场/君莫笑，', f: '1.1 50% 50%' },
      { t: '古来征战几人回？', r: '古来/征战/几人回？', f: '1.05 50% 40%' },
    ],
    notes: { 夜光杯: '用美玉制成的杯子，夜间能够发光。这里指极精致的酒杯', 马上催: '“欲饮琵琶马上催”：正要举杯痛饮，却听到马上弹起琵琶的声音，在催人出发了', 沙场: '战场' },
  },
  xr: {
    title: '夏日绝句', author: '［宋］李清照',
    lines: [
      { t: '生当作人杰，', r: '生当/作人杰，', f: '1.15 60% 45%' },
      { t: '死亦为鬼雄。', r: '死亦/为鬼雄。', f: '1.2 60% 50%' },
      { t: '至今思项羽，', r: '至今/思项羽，', f: '1.25 55% 45%' },
      { t: '不肯过江东。', r: '不肯/过江东。', f: '1.15 35% 60%' },
    ],
    notes: { 项羽: '秦朝末年的起义军领袖，后来与刘邦争夺天下，失败自杀', 过江东: '项羽失败后，有人劝他东渡长江，再作打算。但他觉得无颜见江东父老，不肯渡江。江东：长江南岸地区' },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

/* 凉州词 · 翻卡片看画面 */
/* 课后第 2 题 · 比一比语气：点哪句，温度计升到哪句的“感情温度” */
function initTone(box) {
  if (!box) return;
  const fill = box.querySelector('.tone-meter em');
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.tone-card');
    if (!card) return;
    box.querySelectorAll('.tone-card').forEach((c) => c.classList.toggle('picked', c === card));
    fill.style.height = `${card.dataset.heat}%`;
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initTone(document.querySelector('.tone'));
    Poem.init();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
