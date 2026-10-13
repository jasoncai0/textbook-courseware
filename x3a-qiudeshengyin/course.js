'use strict';
/* 听听，秋的声音 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

const CLUE_LABELS = ['我听到了……', '这是……'];
const CLUES = [
  { q: '“唰唰”', a: '大树抖抖手臂，是黄叶道别的话音。' },
  { q: '“㘗㘗”', a: '蟋蟀振动翅膀，是和阳台告别的歌韵。' },
  { q: '暖暖的叮咛', a: '一排排大雁追上白云，撒下来的。' },
  { q: '丰收的歌吟', a: '一阵阵秋风掠过田野，送来的。' },
];

const KINDS = ['联系上下文', '看图', '生活经验', '查字典'];
const SORT_ITEMS = [
  { s: '撒下一阵暖暖的<b>叮咛</b>', ok: ['查字典', '联系上下文'], q: '反复地嘱咐，关心的话' },
  { s: '一阵阵秋风<b>掠过</b>田野', ok: ['看图', '生活经验'], q: '轻轻擦过，很快地吹过' },
  { s: '走进这<b>辽阔</b>透明的音乐厅', ok: ['看图', '查字典'], q: '宽广，一眼望不到边' },
];

const MOMENTS = [
  { name: '秋雨', pic: 'dayan', prompt: '听听，秋雨的声音是什么样的？写一节小诗。', hint: '谁在做什么？发出什么声音？像在说什么？', example: '听听，\n秋的声音，\n秋雨敲敲窗户，\n“滴答滴答”，\n是给小树写信的笔音。' },
  { name: '果园', pic: 'huangye', prompt: '秋天的果园里，你会听到什么声音？', hint: '果子落地、小鸟啄果子、摘果子的笑声……', example: '听听，\n秋的声音，\n苹果跳下枝头，\n“咚咚”，\n是和大树告别的脚步声。' },
  { name: '校园', pic: 'xishuai', prompt: '秋天的校园里有什么声音？', hint: '扫落叶、踩落叶、风吹国旗……', example: '听听，\n秋的声音，\n我踩着落叶回家，\n“咔嚓咔嚓”，\n是秋天在我脚下唱歌。' },
];

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
