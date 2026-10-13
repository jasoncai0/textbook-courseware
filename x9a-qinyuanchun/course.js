'use strict';
/* 沁园春·雪 · 本课数据与互动：“望”所领景物分类、“惜”字链、诵读三种标记（节奏 / 领字 / 韵脚）、赏析小练笔。通用部分见 ../shared/narrative.js */

const SORT = [
  { s: '惟余莽莽（只剩下白茫茫一片）', ok: ['目力所及'], q: '眼前的雪野，是实景' },
  { s: '望长城内外', ok: ['想象所及'], q: '长城绵延万里，目力不能及，是心中所见' },
  { s: '大河上下，顿失滔滔', ok: ['想象所及'], q: '大河上下千里，同样是想象中的全景' },
  { s: '山舞银蛇，原驰蜡象', ok: ['目力所及', '想象所及'], q: '眼前的群山高原，又加上想象，化静为动' },
  { s: '须晴日，看红装素裹', ok: ['想象所及'], q: '此时正下雪，“晴日”是想象中的美景' },
];

/* 诵读标记：/ 停顿，{ } 领字，[ ] 韵脚 */
const CI = [
  ['上阕', ['北国/风光，', '千里/冰封，', '万里/雪[飘]。', '{望}/长城/内外，', '惟余/莽莽；', '大河/上下，', '顿失/滔[滔]。',
    '山舞/银蛇，', '原驰/蜡象，', '欲与/天公/试比[高]。', '须/晴日，', '看/红装/素裹，', '分外/妖[娆]。']],
  ['下阕', ['江山/如此/多[娇]，', '引/无数英雄/竞/折[腰]。', '{惜}/秦皇汉武，', '略输/文采；', '唐宗宋祖，', '稍逊/风[骚]。',
    '一代/天骄，', '成吉思汗，', '只识/弯弓/射大[雕]。', '俱往矣，', '数/风流人物，', '还看/今[朝]。']],
];

function renderLine(s) {
  return s.replace(/\//g, '<i class="ps">|</i>').replace(/\{(.)\}/g, '<b class="lead">$1</b>').replace(/\[(.)\]/g, '<em class="rhyme">$1</em>');
}

function initRecite() {
  const box = document.getElementById('ci');
  box.innerHTML = CI.map(([h, lines]) => `<div class="ci-col"><h4>${h}</h4>${lines.map((l) => `<p>${renderLine(l)}</p>`).join('')}</div>`).join('');
  const slide = box.closest('.slide');
  slide.querySelectorAll('[data-m]').forEach((b) => b.addEventListener('click', () => {
    const on = slide.classList.toggle(`m-${b.dataset.m}`);
    b.classList.toggle('solid', on);
  }));
}

function initXi() {
  document.getElementById('xiChain').addEventListener('click', (e) => {
    const c = e.target.closest('.xi-card');
    if (c) c.classList.toggle('open');
  });
}

const MOMENTS = [
  {
    name: '赏析“望”字', pic: 'beiguo',
    prompt: '从“望长城内外……欲与天公试比高”中选一两句，赏析领字“望”或“山舞银蛇，原驰蜡象”的妙处。',
    hint: '可以从“视野”“虚实”“化静为动”“胸襟”这些角度说。',
    example: '“望”是领字，统领七句。诗人的目光由长城到大河，由群山到高原，千里万里尽收眼底，这远非目力所能及，而是心中所见。实景与想象交融，不仅写出北国雪景的壮阔，更见出诗人开阔的胸襟。',
  },
  {
    name: '赏析“惜”字', pic: 'hongzhuang',
    prompt: '赏析下阕“惜秦皇汉武……还看今朝”，说说“惜”字和“略输”“稍逊”“只识”的分寸。',
    hint: '注意评语的轻重，以及结尾“今朝”与历代帝王的对比。',
    example: '一个“惜”字领起，纵论千年。“略输”“稍逊”语气委婉，肯定中有惋惜；“只识弯弓射大雕”则略带调侃。历代帝王都已过去，“俱往矣”三字一笔收住，引出“还看今朝”，以古衬今，豪情满怀。',
  },
  {
    name: '赏析一个画面', pic: 'yinshe',
    prompt: '选你最喜欢的一个画面（如“红装素裹”），写出画面的颜色、动态，以及它表达的情感。',
    hint: '先描述画面，再点出修辞或用词，最后说感受。',
    example: '“须晴日，看红装素裹，分外妖娆”，诗人想象雪后初晴：红日照在白雪上，像一位身着红装、外披白衣的少女，艳丽动人。由眼前的风雪写到想象中的晴日，色彩由白转红，情感也更加明朗热烈。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['目力所及', '想象所及'], moments: MOMENTS });
    initRecite();
    initXi();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
