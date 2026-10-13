'use strict';
/* 月是故乡明（略读）· 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 阅读提示 · 选做：借月亮写思乡的古诗 */
const PICKS = {
  moon: [
    { t: '举头望明月，低头思故乡。', ok: true, why: '李白《静夜思》' },
    { t: '独在异乡为异客，每逢佳节倍思亲。', ok: false, why: '思乡，但没有写月亮' },
    { t: '露从今夜白，月是故乡明。', ok: true, why: '杜甫《月夜忆舍弟》' },
    { t: '小时不识月，呼作白玉盘。', ok: false, why: '写月亮，不写思乡' },
    { t: '春风又绿江南岸，明月何时照我还？', ok: true, why: '王安石《泊船瓜洲》' },
    { t: '两个黄鹂鸣翠柳，一行白鹭上青天。', ok: false, why: '写春景' },
    { t: '今夜月明人尽望，不知秋思落谁家。', ok: true, why: '王建《十五夜望月》' },
  ],
};

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS });
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
