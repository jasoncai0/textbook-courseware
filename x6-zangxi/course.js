'use strict';
/* 藏戏 · 本课数据与“面具连一连”。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 面具（按课文顺序）。say = 课文原句；face = 示意图的画法（自绘简图，不是真实面具） */
const MASKS = [
  { role: '唐东杰布', face: 'tang', say: '他的面具是白色的，前额饰有日月，两颊贴着短发，眉眼嘴角永远带着神秘的笑。' },
  { role: '国王', face: 'red', say: '国王的面具是红色的，红色代表威严。' },
  { role: '王妃', face: 'green', say: '王妃的面具是绿色的，绿色代表柔顺。' },
  { role: '巫女', face: 'half', say: '巫女的面具半黑半白，代表其两面三刀。' },
  { role: '妖魔', face: 'demon', say: '妖魔的面具青面獠牙，以示压抑和恐怖。' },
  { role: '村民', face: 'cloth', say: '村民的面具则用白布或黄布缝制，眼睛和嘴唇处挖出窟窿，以示朴实敦厚。' },
];
// 打乱后的展示顺序（固定，便于老师讲解时说“第几个”）
const MASK_ORDER = [3, 0, 5, 1, 4, 2];

const EYES = '<ellipse cx="36" cy="54" rx="7" ry="4" fill="#fff"/><ellipse cx="64" cy="54" rx="7" ry="4" fill="#fff"/><circle cx="36" cy="54" r="2.6" fill="#222"/><circle cx="64" cy="54" r="2.6" fill="#222"/>';
const FACES = {
  tang: `<ellipse cx="50" cy="60" rx="36" ry="46" fill="#f6f2e8" stroke="#b9ad99" stroke-width="2"/>
    <circle cx="43" cy="26" r="6" fill="#d9442f"/><path d="M58 20 a7 7 0 1 0 0 12 a5.5 5.5 0 1 1 0 -12" fill="#e2b13c"/>
    <path d="M14 50 v26 M17 50 v28 M86 50 v26 M83 50 v28" stroke="#3a3330" stroke-width="2.4"/>
    ${EYES}<path d="M37 80 q13 10 26 0" stroke="#8a3a2a" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  red: `<ellipse cx="50" cy="60" rx="36" ry="46" fill="#c0392b"/><path d="M22 16 l8 -10 l10 8 l10 -10 l10 10 l10 -8 l8 10 z" fill="#e2b13c"/>
    <path d="M26 44 l18 4 M74 44 l-18 4" stroke="#1d1d1d" stroke-width="5" stroke-linecap="round"/>${EYES}
    <path d="M38 84 h24" stroke="#1d1d1d" stroke-width="4" stroke-linecap="round"/>`,
  green: `<ellipse cx="50" cy="60" rx="36" ry="46" fill="#4f9a62"/><circle cx="50" cy="30" r="4" fill="#e2b13c"/>
    <path d="M28 46 q8 -4 16 0 M56 46 q8 -4 16 0" stroke="#1d3a26" stroke-width="2.5" fill="none"/>${EYES}
    <path d="M42 82 q8 5 16 0" stroke="#7a1d1d" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  half: `<ellipse cx="50" cy="60" rx="36" ry="46" fill="#f6f2e8" stroke="#b9ad99" stroke-width="2"/><path d="M50 14 A36 46 0 0 0 50 106 Z" fill="#222"/>
    ${EYES}<path d="M36 84 q14 6 28 -2" stroke="#9e2b25" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  demon: `<ellipse cx="50" cy="60" rx="36" ry="46" fill="#2f6f8a"/>
    <path d="M24 42 l20 8 M76 42 l-20 8" stroke="#111" stroke-width="5" stroke-linecap="round"/>
    <circle cx="36" cy="56" r="8" fill="#f4d03f"/><circle cx="64" cy="56" r="8" fill="#f4d03f"/><circle cx="36" cy="56" r="3.4" fill="#111"/><circle cx="64" cy="56" r="3.4" fill="#111"/>
    <path d="M30 78 q20 14 40 0 q-20 6 -40 0" fill="#7a1d1d"/><path d="M34 79 l4 12 l4 -10 M66 79 l-4 12 l-4 -10" fill="#fff"/>`,
  cloth: `<path d="M18 30 q32 -26 64 0 v58 q-32 24 -64 0 z" fill="#ead8a2" stroke="#b49a5a" stroke-width="2" stroke-dasharray="4 3"/>
    <ellipse cx="37" cy="54" rx="7" ry="5" fill="#3a2a1a"/><ellipse cx="63" cy="54" rx="7" ry="5" fill="#3a2a1a"/><ellipse cx="50" cy="82" rx="9" ry="5" fill="#3a2a1a"/>`,
};

let picked = -1; // 当前选中的人物（MASKS 下标）

function buildMasks() {
  const roles = document.getElementById('zxRoles');
  const masks = document.getElementById('zxMasks');
  roles.innerHTML = MASKS.map((m, i) => `<button type="button" class="zx-role" data-i="${i}">${m.role}</button>`).join('');
  masks.innerHTML = MASK_ORDER.map((i) => `<button type="button" class="zx-mask" data-i="${i}">
      <svg viewBox="0 0 100 112" aria-hidden="true">${FACES[MASKS[i].face]}</svg>
      <span class="zx-who">这是谁？</span><span class="zx-say">${MASKS[i].say}</span></button>`).join('');
  roles.addEventListener('click', (e) => {
    const btn = e.target.closest('.zx-role:not(.done)');
    if (!btn) return;
    picked = +btn.dataset.i;
    roles.querySelectorAll('.zx-role').forEach((b) => b.classList.toggle('sel', b === btn));
  });
  masks.addEventListener('click', (e) => {
    const card = e.target.closest('.zx-mask:not(.right)');
    if (!card || picked < 0) return;
    card.classList.remove('wrong');
    if (+card.dataset.i !== picked) {
      void card.offsetWidth; // 重新触发抖动动画
      card.classList.add('wrong');
      return;
    }
    card.classList.add('right');
    card.querySelector('.zx-who').textContent = MASKS[picked].role;
    roles.querySelector(`[data-i="${picked}"]`).classList.add('done');
    roles.querySelector('.sel').classList.remove('sel');
    picked = -1;
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    buildMasks();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
