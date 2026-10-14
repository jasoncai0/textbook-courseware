'use strict';
/* 繁星 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：三次看星时间轴 + 会随句子变化的星空（读一句，星空变一变）、三次看星对照表、看到的 / 想象的分一分。
 */

const KINDS = ['看到的', '想象的'];
const SORT = [
  { s: '深蓝色的天空里，悬着无数半明半昧的星。', ok: ['看到的'], q: '眼睛看到的星空' },
  { s: '我好像看见无数萤火虫在我的周围飞舞。', ok: ['想象的'], q: '星星像萤火虫' },
  { s: '船在动，星也在动，它们是这样低……', ok: ['看到的'], q: '船晃，星也跟着晃' },
  { s: '我仿佛看见它们在对我眨眼，我仿佛听见它们在小声说话。', ok: ['想象的'], q: '星星像朋友' },
  { s: '我觉得自己是一个小孩子，现在睡在母亲的怀里了。', ok: ['想象的'], q: '星空像母亲的怀抱' },
];

const MOMENTS = [
  { name: '乡下看星', pic: 'jiaxiang', prompt: '在乡下、在老家的院子里看星星，是什么样子？', hint: '星星多不多？像什么？你当时在做什么、想什么？',
    example: '暑假在外婆家，晚上我躺在院子里的竹床上看星星。星星又多又亮，密密麻麻的，像谁撒了一把碎银子。外婆一边摇扇子，一边给我讲牛郎织女的故事，我听着听着就睡着了。' },
  { name: '野外露营', pic: 'haishang', prompt: '在山上、海边或者露营时看星星，有什么感受？', hint: '四周安静吗？星星离你远还是近？',
    example: '那次露营，我们躺在草地上看星星。四周静悄悄的，只有虫子在叫。满天的星星低低的，好像伸手就能摸到。我觉得自己变得很小很小，天空却那么大。' },
  { name: '城里看星', pic: 'houmen', prompt: '在城市的阳台上、楼顶上，你看到过星星吗？', hint: '城里的星星多吗？看到时你心里怎么想？',
    example: '城里的星星很少。有一天晚上停电了，我和爸爸到阳台上，忽然看见天上冒出了好多星星，一颗一颗都在眨眼。爸爸说，原来星星一直都在，只是灯太亮了，我们没看见。' },
];

/* ================= 读一句，星空变一变 ================= */
const STAR_N = 80;
const STAR_FEW = 32; // 第一句之前只亮一部分，读到“密密麻麻”“星群密布”或到了海上才满天
const FX_TEXT = { many: '密密麻麻', glow: '光明无处不在', twinkle: '半明半昧', sway: '摇摇欲坠', fly: '像萤火虫在飞', blink: '眨眼 · 小声说话', warm: '像睡在母亲的怀里' };
function buildStars() {
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const stars = Array.from({ length: STAR_N }, (_, i) => {
    const r = (1.4 + rnd() * 2.4).toFixed(1);
    const dx = ((rnd() - 0.5) * 60).toFixed(0);
    const dy = ((rnd() - 0.5) * 40).toFixed(0);
    return `<circle class="st${i >= STAR_FEW ? ' more' : ''}" cx="${(rnd() * 800).toFixed(0)}" cy="${(rnd() * 300).toFixed(0)}" r="${r}" style="--d:${(rnd() * 2).toFixed(2)}s;--dx:${dx}px;--dy:${dy}px"/>`;
  }).join('');
  document.getElementById('skStars').innerHTML = `<g class="sk-g">${stars}</g>`;
}

function updateSky(slide, step) {
  const win = slide.querySelector('#skyWin');
  if (!win) return;
  const lines = [...slide.querySelectorAll('#skyTxt p')];
  const shown = lines.filter((p) => +p.dataset.step <= step);
  const now = shown[shown.length - 1];
  const pan = now ? +now.dataset.pan : 0;
  const part = now ? now.dataset.part : '0';
  win.querySelectorAll('.sk-bg').forEach((el, i) => el.classList.toggle('cur', i === pan));
  slide.querySelectorAll('#skyAxis span').forEach((el, i) => {
    el.classList.toggle('cur', i === pan);
    el.classList.toggle('done', i < pan);
  });
  const fx = now ? now.dataset.fx || '' : '';
  Object.keys(FX_TEXT).forEach((k) => win.classList.toggle(`fx-${k}`, k === fx));
  win.classList.toggle('dense', pan === 2 || shown.some((p) => +p.dataset.pan === pan && p.dataset.fx === 'many'));
  const tag = slide.querySelector('#skFx');
  tag.textContent = FX_TEXT[fx] || '';
  tag.classList.toggle('show', Boolean(fx));
  lines.forEach((p) => {
    p.classList.toggle('here', p.dataset.part === part);
    p.classList.toggle('now', p === now);
  });
}

window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT, moments: MOMENTS });
    buildStars();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateSky(slide, step);
  },
};
