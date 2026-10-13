'use strict';
/* 变色龙 · 本课数据与互动：态度翻转器（点“狗是谁的”切换六种说法）、态度曲线（分步）、讽刺手法分类、小品导演 */

const svgNS = (tag, attrs, text) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text) el.textContent = text;
  return el;
};

/* 六种说法（五次“变色”）。dog/man：0–100，对狗越高越“亲”，对赫留金越高越“撑腰”；coat：大衣状态 */
const STATES = [
  { zw: '不知谁家的', z: '弄死狗', who: '不知谁家的狗', by: '（还没人说）', color: '#8a8f6a', dog: 8, man: 92, coat: '穿着新大衣', judge: '弄死狗，惩罚狗主人', q: '“这条狗呢，把它弄死好了。马上去办，别拖！这多半是条疯狗……请问，这到底是谁家的狗？”' },
  { zw: '好像是将军家的', z: '错在赫留金', who: '好像是将军家的狗', by: '人群里有人说', color: '#c7563a', dog: 72, man: 18, coat: '脱下大衣：“天这么热”', judge: '错在赫留金：手指是小钉子弄破的', q: '“它是那么小；你呢，却长得这么魁梧！你那手指头一定是给小钉子弄破的，后来却异想天开，想得到一笔什么赔偿费了。”' },
  { zw: '不是将军家的', z: '下贱胚子', who: '不是将军家的狗', by: '巡警说', color: '#7b8b4a', dog: 12, man: 80, coat: '（大衣还脱着）', judge: '狗是下贱胚子，要给赫留金撑腰', q: '“这条狗呢，鬼才知道是什么玩意儿！毛色既不好，模样也不中看，完全是个下贱胚子。……你呢，赫留金，受了害，我们绝不能不管。”' },
  { zw: '也许是将军家的', z: '送回将军家', who: '也说不定就是将军家的狗', by: '巡警、人群里有人说', color: '#d08a2e', dog: 80, man: 10, coat: '穿上大衣：“好像起风了，挺冷”', judge: '送狗回将军家，骂赫留金', q: '“说不定这是条名贵的狗……狗是娇贵的动物……你这混蛋，把手放下来！不用把你那蠢手指头伸出来！怪你自己不好！……”' },
  { zw: '野狗', z: '弄死它', who: '不是将军家的狗，是野狗', by: '将军家的厨师普洛诃尔说', color: '#6f7d55', dog: 5, man: 60, coat: '（大衣还穿着）', judge: '野狗，弄死它算了', q: '“既然普洛诃尔说这是野狗，那它就是野狗。弄死它算了。”' },
  { zw: '将军哥哥的', z: '带走，恐吓赫留金', who: '是将军哥哥的狗', by: '普洛诃尔接着说', color: '#d9a33a', dog: 98, man: 4, coat: '裹紧大衣，径自走了', judge: '带走小狗，恐吓赫留金', q: '“这小狗还不赖，怪伶俐的，一口就咬破了这家伙的手指头！哈哈哈……”“我早晚要收拾你！”' },
];

function initFlip() {
  const dots = document.getElementById('flipDots');
  dots.innerHTML = STATES.map((_, i) => `<button type="button" class="fd" data-i="${i}" aria-label="第${i + 1}种说法">${i + 1}</button>`).join('');
  let cur = -1;
  const show = (i) => {
    cur = i;
    const s = STATES[i];
    document.getElementById('cham').style.setProperty('--c', s.color);
    document.getElementById('flipOwner').innerHTML = `<small>${s.by}</small><b>${s.who}</b>`;
    document.getElementById('flipCoat').textContent = `大衣：${s.coat}`;
    document.getElementById('mDog').style.width = `${s.dog}%`;
    document.getElementById('mMan').style.width = `${s.man}%`;
    document.getElementById('flipQuote').innerHTML = `<b>他说：</b>${s.q}`;
    document.getElementById('flipJudge').innerHTML = `<b>裁断：</b>${s.judge}${i ? `<br><small>第 ${i} 次“变色”</small>` : ''}`;
    dots.querySelectorAll('.fd').forEach((d, k) => d.classList.toggle('on', k === i));
    const ask = document.getElementById('flipAsk');
    ask.textContent = i === STATES.length - 1 ? '再从头问一遍 ↺' : '狗是谁的？ →';
  };
  document.getElementById('flipAsk').addEventListener('click', () => show((cur + 1) % STATES.length));
  dots.addEventListener('click', (e) => {
    const d = e.target.closest('.fd');
    if (d) show(+d.dataset.i);
  });
  show(0);
}

/* ---------- 态度曲线：左列“不是将军家的” 右列“是将军家的” ---------- */
function buildZig() {
  const svg = document.getElementById('zigSvg');
  svg.appendChild(svgNS('rect', { class: 'zz-l', x: 20, y: 10, width: 290, height: 340, rx: 10 }));
  svg.appendChild(svgNS('rect', { class: 'zz-r', x: 330, y: 10, width: 290, height: 340, rx: 10 }));
  svg.appendChild(svgNS('text', { class: 'zz-h t-c', x: 165, y: 38 }, '不是 / 不知是将军家的'));
  svg.appendChild(svgNS('text', { class: 'zz-h t-c', x: 475, y: 38 }, '是 / 也许是将军家的'));
  const pts = STATES.map((s, i) => [s.dog > 50 ? 475 : 165, 78 + i * 52]);
  for (let i = 1; i < pts.length; i += 1) {
    svg.appendChild(svgNS('line', { class: 'zz-line', x1: pts[i - 1][0], y1: pts[i - 1][1], x2: pts[i][0], y2: pts[i][1], 'data-step': i + 1 }));
  }
  STATES.forEach((s, i) => {
    const g = svgNS('g', { class: 'zz-pt', 'data-step': i + 1 });
    g.appendChild(svgNS('rect', { x: pts[i][0] - 130, y: pts[i][1] - 20, width: 260, height: 40, rx: 8, style: `fill:${s.color}` }));
    g.appendChild(svgNS('text', { class: 'zz-t t-c', x: pts[i][0], y: pts[i][1] + 6 }, `${s.zw} → ${s.z}`));
    svg.appendChild(g);
  });
}
buildZig();

/* ---------- 讽刺手法 ---------- */
const SORT = [
  { s: '“这条狗呢，把它弄死好了。”……“这小狗还不赖，怪伶俐的，一口就咬破了这家伙的手指头！”', ok: ['对比'], q: '同一条狗，前面要“弄死”，后面夸“伶俐”——前后言行自相矛盾，丑态毕露。' },
  { s: '“叶尔德林，帮我把大衣脱下来……真要命，天这么热……”“给我穿上大衣吧……好像起风了，挺冷……”', ok: ['夸张', '对比'], q: '一会儿热一会儿冷，脱了又穿，夸张地写出他内心的慌乱，用天气掩饰尴尬。' },
  { s: '他那半醉的脸上现出这样的神气：“我要揭你的皮，坏蛋！”就连那手指头也像是一面胜利的旗帜。', ok: ['夸张'], q: '把一根被咬的手指比作“胜利的旗帜”，夸张地写出赫留金借机讹钱的得意。' },
  { s: '“将军家里都是些名贵的、纯种的狗；这条狗呢，鬼才知道是什么玩意儿！”', ok: ['对比'], q: '狗还是那条狗，“名贵”与“鬼才知道”的评价只看主人的身份——对权势的谄媚昭然若揭。' },
  { s: '他的法律上说得明白，现在大家都平等啦。', ok: ['对比'], q: '赫留金嘴上的“平等”和小说里处处可见的等级、媚上欺下形成强烈反差——极具讽刺。' },
];

const MOMENTS = [
  {
    name: '奥楚蔑洛夫', pic: 'dayi',
    prompt: '为警官奥楚蔑洛夫设计衣着、表情、语气和动作。',
    hint: '抓住“新的军大衣”和五次“变色”：每一次变脸，表情和语气怎样一下子转过来？',
    example: '衣着：崭新的灰色军大衣，扣子擦得发亮，提着小包。表情：对赫留金拧起眉头、瞪眼；一听“将军”，眉头一松，堆出笑。语气：前面严厉、拖长腔；后面讨好、发颤。动作：脱大衣时手忙脚乱，穿大衣时缩着脖子，最后“裹紧大衣”昂头走开。',
  },
  {
    name: '叶尔德林', pic: 'guangchang',
    prompt: '为火红色头发的巡警叶尔德林设计表演。',
    hint: '他端着没收来的醋栗；他两次说出对狗主人的判断，“深思地”说话的样子怎么演？',
    example: '衣着：旧制服，端着一筛子醋栗。表情：木讷、慢半拍，说话前先“深思”地皱眉。语气：小心翼翼、吞吞吐吐。动作：一会儿帮长官脱大衣，一会儿帮他穿，筛子在两手之间换来换去，差点把醋栗撒了。',
  },
  {
    name: '赫留金', pic: 'shouzhi',
    prompt: '为首饰匠赫留金设计表演。',
    hint: '他半醉，举着手指头，想要赔偿；最后被众人哄笑，表情怎样变化？',
    example: '衣着：浆硬的花布衬衫，敞着怀的坎肩。表情：先是得意扬扬，后是委屈，最后灰溜溜。语气：拿手罩在嘴上咳嗽一下，装出可怜相，说话絮絮叨叨。动作：始终高举那根手指头，像举着一面旗；被骂时手指头慢慢放下来。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['对比', '夸张'], moments: MOMENTS });
    initFlip();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
