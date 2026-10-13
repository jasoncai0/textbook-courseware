'use strict';
/* 青山不老 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

const KINDS = ['自然条件', '老人的条件', '奇迹'];
const SORT_ITEMS = [
  { s: '这是西伯利亚大风常来肆虐的地方，是干旱、霜冻、沙尘暴等与生命作对的怪物盘踞之地。', ok: ['自然条件'], q: '险恶' },
  { s: '风大作时，能逆吹牛马使倒行，或擎之高二三丈而坠。', ok: ['自然条件'], q: '风沙之猛' },
  { s: '一排三间房，就剩下老者一人。', ok: ['老人的条件'], q: '孤独' },
  { s: '他已经八十一岁，知道终有一天自己也会爬不起来。', ok: ['老人的条件'], q: '年迈' },
  { s: '十五年啊，绿化了八条沟，造了七条防风林带、三千七百亩林网。', ok: ['奇迹'], q: '了不起' },
  { s: '他用林业收入资助每户村民买了一台电视机。', ok: ['奇迹'], q: '造福乡亲' },
];

const CLUE_LABELS = ['“青山不老”……', '意思是……'];
const CLUES = [
  { q: '青山', a: '老人和伙伴们十五年种出的满山绿树——这是看得见的青山。' },
  { q: '不老', a: '树会一年年长下去，绿会一代代传下去，这片青山会一直绿着。' },
  { q: '老人会老', a: '老人八十一岁了，“也许进去后就再也出不来了”。可他的生命已经“转化为另一种东西”。' },
  { q: '精神不老', a: '他与山川共存、与日月同辉——他的精神像青山一样，永远不老。' },
];

const MOMENTS = [
  {
    name: '女儿来接他时', pic: 'laoren',
    prompt: '唯一的女儿三番五次从城里回来，要接他去享清福，他不走。这时，他心里在想什么？',
    hint: '想一想：屋后的青山对他意味着什么？为什么说“种树是命运的选择”？',
    example: '闺女，爹知道你孝顺。可这山上的树都是爹一棵一棵栽的，它们就是爹的命。爹走了，谁来看着它们？',
  },
  {
    name: '老伴去世那天', pic: 'daobie',
    prompt: '一天他栽树回来时，发现老伴已静静地躺在炕上过世了。那一刻，他在想什么？',
    hint: '想一想：老伴与他“风雨同舟一生”。他会停下来不种树吗？',
    example: '老伴啊，你陪我吃了一辈子苦，我还没让你享上一天福……你放心，我把沟里的树种满，就算是给你种的。',
  },
  {
    name: '扛着铁锹上山时', pic: 'laoren',
    prompt: '每天早晨，他扛上铁锹进沟上山。看着自己种的树，他会想些什么？',
    hint: '想一想：七位老汉，现在只剩下他和一个伙伴了。',
    example: '老伙计们，你们种的树都活了，长得比人还高。我再多种几棵，等我爬不起来了，就躺在这青山里。',
  },
  {
    name: '我想对老人说', pic: 'shulin',
    prompt: '读完课文，你想对这位老人说些什么？',
    hint: '可以写你的敬佩，也可以写你从他身上明白了什么。',
    example: '老爷爷，您让我明白了：一个普通人也可以做出了不起的事。您种的不只是树，是一片永远不老的青山。',
  },
];

/* 3700 亩林网：一棵树代表 100 亩 */
const MU_PER_TREE = 100;
const TOTAL_MU = 3700;

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    document.querySelector('.trees-row').innerHTML = Array.from({ length: TOTAL_MU / MU_PER_TREE }, (_, i) =>
      `<span style="animation-delay:${(i * .05).toFixed(2)}s">🌳</span>`).join('') + `<small>每棵代表 ${MU_PER_TREE} 亩</small>`;
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
