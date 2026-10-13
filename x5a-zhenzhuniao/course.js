'use strict';
/* 珍珠鸟 · 本课逻辑：信赖进度条、找可爱的句子。页面逻辑见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

const PICKS = {
  cute: [
    { t: '却见它们可爱的鲜红小嘴从绿叶中伸出来。', ok: true, why: '鲜红小嘴 · 外形' },
    { t: '有人说，这是一种怕人的鸟。', ok: false, why: '写别人的看法' },
    { t: '它好肥，整个身子好像一个蓬松的球儿。', ok: true, why: '蓬松的球儿 · 外形' },
    { t: '一会儿神气十足地站在书架上，啄着书脊上那些大文豪的名字。', ok: true, why: '神气十足 · 淘气' },
    { t: '我把鸟笼挂在窗前。', ok: false, why: '写“我”的做法' },
    { t: '然后蹦到我的杯子上，俯下头来喝茶，再偏过脸瞧瞧我的反应。', ok: true, why: '偏过脸瞧 · 机灵' },
    { t: '跳动的小红爪子在纸上发出嚓嚓的响声。', ok: true, why: '小红爪子 · 嚓嚓' },
    { t: '我只是微微一笑，依旧写东西。', ok: false, why: '写“我”的神态' },
    { t: '扭动滚圆的身子，挤开那些绿叶钻进去。', ok: true, why: '滚圆的身子 · 憨' },
    { t: '我轻轻抬一抬肩，它没醒，睡得好熟！还咂咂嘴，难道在做梦？', ok: true, why: '咂咂嘴 · 像个孩子' },
  ],
};

/* 信赖进度：第 n 步，小鸟走到第 n 站（共 9 站） */
const STATIONS = 9;
function moveBird(slide, step) {
  const n = Math.min(step, STATIONS);
  const pct = (n / STATIONS) * 100;
  slide.querySelector('#trustBird').style.left = `${pct}%`;
  slide.querySelector('#trustFill').style.width = `${pct}%`;
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS });
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-trust')) moveBird(slide, step);
  },
};
