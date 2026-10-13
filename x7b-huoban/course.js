'use strict';
/* 活板 · 本课数据与专属互动：工序动画、程序表、“活”在哪里、字词梳理。文言横排模板见 ../shared/poem.js */

const NOTES = {
  板印: '指雕版印刷', 冯瀛王: '即冯道，五代时人，死后被追封为瀛王，我国古代大规模官刻儒家经籍的首倡者', 已后: '以后。已，同“以”', 板本: '版印书籍，相对于抄本而言',
  庆历: '宋仁宗赵祯年号（1041—1048）', 布衣: '平民。古代平民不能穿锦绣，故称“布衣”', 毕昇: '北宋工匠、发明家，首创活字印刷术', 钱唇: '铜钱的边缘',
  和: '混合（读 huò）', 冒之: '覆盖它。冒，覆盖', 铁范: '铁框子。范，模子', 就火: '靠近火。就，靠近', 炀之: '烘烤它。炀（yáng），烘烤',
  药: '指上文说的松脂、蜡等的混合物', 镕: '同“熔”，用高温使固态物质转变为液态', 如砥: '像磨刀石一样平。砥（dǐ），磨刀石', 止印: '只印',
  已自: '已经另外。自，另自，另外', 已具: '已经准备好了。具，准备', 更互: '交替，轮流。更，读 gēng', 可就: '可以完成。就，完成',
  帖之: '用纸条做标签标记它们。帖（tiè），标签，这里用作动词', 每韵: '每个韵部。韵书中把同韵的字归在一起成为一部', 贮之: '存放它们', 奇字: '生僻字', 旋: '随即，立刻',
  木理: '木头的纹理', 燔土: '烧过的胶泥（字印）。燔（fán），烧', 用讫: '用完。讫（qì），完毕', 殊: '根本', 群从: '指堂兄弟及诸子侄（从，读 cóng）', 宝藏: '珍藏（藏，读 cáng）',
};

const POEMS = {
  hb1: {
    title: '活板', author: '［宋］沈括', layout: 'h', notes: NOTES,
    lines: [
      { t: '板印书籍，唐人尚未盛为之。', r: '板印/书籍，唐人/尚未/盛为之。', y: '用雕版印刷书籍，唐朝人还没有大规模地这样做。' },
      { t: '自冯瀛王始印五经，已后典籍皆为板本。', r: '自/冯瀛王/始印/五经，已后/典籍/皆为/板本。', y: '自从冯瀛王开始印刷五经，以后的典籍都是版印的书本了。' },
      { t: '庆历中，有布衣毕昇，又为活板。', r: '庆历中，有/布衣/毕昇，又为/活板。', y: '宋仁宗庆历年间，有个平民毕昇，又创制了活字版。' },
      { t: '其法：用胶泥刻字，薄如钱唇，每字为一印，火烧令坚。', r: '其法：用/胶泥/刻字，薄/如/钱唇，每字/为/一印，火烧/令坚。', y: '它的方法是：用胶泥刻字，薄得像铜钱的边缘，每个字制成一个字印，用火烧使它坚硬。' },
      { t: '先设一铁板，其上以松脂、蜡和纸灰之类冒之。', r: '先设/一铁板，其上/以/松脂、蜡/和/纸灰/之类/冒之。', y: '先准备一块铁板，在上面用松脂、蜡混合纸灰这一类东西覆盖它。' },
      { t: '欲印，则以一铁范置铁板上，乃密布字印，满铁范为一板，持就火炀之；', r: '欲印，则/以/一铁范/置/铁板上，乃/密布/字印，满/铁范/为一板，持/就火/炀之；', y: '想要印刷，就拿一个铁框子放在铁板上，然后密密地排上字印，排满一铁框就作为一版，拿着它靠近火烘烤；' },
      { t: '药稍镕，则以一平板按其面，则字平如砥。', r: '药/稍镕，则/以/一平板/按/其面，则/字平/如砥。', y: '等药稍微熔化，就用一块平板按压它的表面，那么排在铁板上的字印就平得像磨刀石一样。' },
    ],
  },
  hb2: {
    title: '活板（续）', author: '第 2 段', layout: 'h', notes: NOTES,
    lines: [
      { t: '若止印三二本，未为简易；若印数十百千本，则极为神速。', r: '若/止印/三二本，未为/简易；若/印/数十百千本，则/极为/神速。', y: '如果只印两三本，不算简便；如果印几十、几百、几千本，那就非常快了。' },
      { t: '常作二铁板，一板印刷，一板已自布字，此印者才毕，则第二板已具，更互用之，瞬息可就。', r: '常作/二铁板，一板/印刷，一板/已自/布字，此/印者/才毕，则/第二板/已具，更互/用之，瞬息/可就。', y: '通常制作两块铁板，一块印刷，另一块已经另外在排字，这一块刚印完，第二块已经准备好了，两块交替使用，极短的时间就可以完成。' },
      { t: '每一字皆有数印，如“之”“也”等字，每字有二十余印，以备一板内有重复者。', r: '每一字/皆有/数印，如/“之”“也”/等字，每字/有/二十余印，以备/一板内/有/重复者。', y: '每一个字都有几个字印，像“之”“也”等字，每个字有二十多个字印，以备一版里面有重复的字。' },
      { t: '不用，则以纸帖之，每韵为一帖，木格贮之。', r: '不用，则/以纸/帖之，每韵/为/一帖，木格/贮之。', y: '不用时，就用纸条做标签标记它们，每一个韵部做一个标签，用木格把它们存放起来。' },
      { t: '有奇字素无备者，旋刻之，以草火烧，瞬息可成。', r: '有/奇字/素无备者，旋/刻之，以/草火/烧，瞬息/可成。', y: '遇到平时没有准备的生僻字，马上把它刻出来，用草火烧，很快就能制成。' },
    ],
  },
  hb3: {
    title: '活板（续）', author: '第 2—3 段', layout: 'h', notes: NOTES,
    lines: [
      { t: '不以木为之者，木理有疏密，沾水则高下不平，兼与药相粘，不可取；', r: '不以/木/为之者，木理/有/疏密，沾水/则/高下/不平，兼/与药/相粘，不可取；', y: '不用木头制作字印的原因是，木头的纹理有的疏松有的紧密，沾了水就高低不平，再加上会和药粘在一起，不能取下来；' },
      { t: '不若燔土，用讫再火令药镕，以手拂之，其印自落，殊不沾污。', r: '不若/燔土，用讫/再火/令药镕，以手/拂之，其印/自落，殊/不/沾污。', y: '不如用烧过的胶泥字印，用完后再用火烘烤，使药熔化，用手轻轻一拂，那些字印就自己掉下来，一点也不会被弄脏。' },
      { t: '昇死，其印为余群从所得，至今宝藏。', r: '昇/死，其印/为/余/群从/所得，至今/宝藏。', y: '毕昇死后，他的字印被我的堂兄弟和侄子们得到，到现在还珍藏着。' },
    ],
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* 思考探究一：程序表，ans 为空格答案（点一下显示） */
const TABLE = [
  { stage: '制字', rows: [['活字原料', '胶泥'], ['活字厚度', '薄如钱唇'], ['与雕版不同之处', '每字为一印'], ['活字如何成型', '火烧令坚']] },
  { stage: '排版', rows: [['1', '先设一铁板', true], ['2', '其上以松脂、蜡和纸灰之类冒之'], ['3', '以一铁范置铁板上'], ['4', '乃密布字印，满铁范为一板'], ['5', '持就火炀之；药稍镕，则以一平板按其面']] },
  { stage: '印刷', rows: [['1', '一板印刷', true], ['2', '一板已自布字'], ['3', '更互用之，瞬息可就']] },
];

const PICKS = {
  huo: [
    { t: '每字为一印', ok: true, why: '一字一印，可自由组合' },
    { t: '板印书籍，唐人尚未盛为之', ok: false, why: '讲雕版的历史' },
    { t: '一板印刷，一板已自布字……更互用之', ok: true, why: '两板交替' },
    { t: '每字有二十余印，以备一板内有重复者', ok: true, why: '常用字多备' },
    { t: '若止印三二本，未为简易', ok: false, why: '说的是局限' },
    { t: '不用，则以纸帖之，每韵为一帖，木格贮之', ok: true, why: '拆下分类收存' },
    { t: '有奇字素无备者，旋刻之', ok: true, why: '生字随刻随用' },
    { t: '用讫再火令药镕，以手拂之，其印自落', ok: true, why: '拆版方便，反复使用' },
    { t: '昇死，其印为余群从所得', ok: false, why: '交代活字下落' },
  ],
};

const WORDS = {
  duoyi: [
    { w: '为', items: [['唐人尚未盛为之', '做'], ['其印为余群从所得', '被']] },
    { w: '印', items: [['自冯瀛王始印五经', '印刷（动词）'], ['其印自落', '字印，活字（名词）']] },
    { w: '火', items: [['火烧令坚', '用火（名词作状语）'], ['用讫再火令药镕', '用火烘烤（名词作动词）']] },
    { w: '就', items: [['持就火炀之', '靠近'], ['瞬息可就', '完成']] },
    { w: '自', items: [['自冯瀛王始印五经', '从'], ['一板已自布字', '另自，另外'], ['其印自落', '自己']] },
  ],
  tongjia: [
    { w: '已', items: [['已后典籍皆为板本', '同“以”']] },
    { w: '板', items: [['又为活板', '同“版”']] },
    { w: '镕', items: [['药稍镕', '同“熔”']] },
  ],
  gujin: [
    { w: '布衣', items: [['有布衣毕昇', '古：平民　今：布做的衣服']] },
    { w: '药', items: [['药稍镕', '古：松脂、蜡等的混合物　今：药物']] },
    { w: '宝藏', items: [['至今宝藏', '古：珍藏（动词）　今：储藏的珍宝']] },
    { w: '殊', items: [['殊不沾污', '古：根本　今：特别、不同']] },
  ],
  huoyong: [
    { w: '帖', items: [['以纸帖之', '名词作动词：用纸条做标签标记']] },
    { w: '火', items: [['火烧令坚', '名词作状语：用火'], ['用讫再火令药镕', '名词作动词：用火烘烤']] },
  ],
};

/* ---------- 工序动画：字印方格、第二块板、木格（顶层生成） ---------- */
function grid(x0, y0, cols, rows, size, gap, cls) {
  let html = '';
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const d = ((r * cols + c) * 0.03).toFixed(2);
      html += `<rect class="${cls}" style="animation-delay:${d}s" x="${x0 + c * (size + gap)}" y="${y0 + r * (size + gap)}" width="${size}" height="${size}" rx="2"/>`;
    }
  }
  return html;
}
document.querySelector('#proc .types').innerHTML = grid(186, 66, 8, 7, 22, 4.5, 'ty');
document.querySelector('#proc .types2').innerHTML = grid(482, 92, 5, 4, 18, 6, 'ty');
document.querySelector('#proc .falling').innerHTML = grid(186, 66, 8, 6, 22, 4.5, 'ty fall');
document.querySelector('#proc .cabinet').innerHTML = (() => {
  let html = '<rect x="150" y="30" width="340" height="250" rx="6" fill="#9b6b3a" stroke="#5a3a1a" stroke-width="3"/>';
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 6; c += 1) {
      const x = 162 + c * 54;
      const y = 42 + r * 58;
      html += `<rect x="${x}" y="${y}" width="48" height="52" fill="#c99a62" stroke="#5a3a1a" stroke-width="1.5"/>${grid(x + 6, y + 18, 3, 2, 10, 3, 'ty')}<rect x="${x + 10}" y="${y + 4}" width="28" height="10" fill="#fbf7ec"/>`;
    }
  }
  return html;
})();

function renderProcess(step) {
  document.querySelectorAll('#proc .ph').forEach((g) => {
    g.classList.toggle('vis', step >= +g.dataset.from && step <= +g.dataset.to);
  });
  document.getElementById('proc').classList.toggle('melt', step >= 6);
  const phase = step <= 0 ? 0 : step <= 2 ? 1 : step <= 7 ? 2 : step === 8 ? 3 : 4;
  document.querySelectorAll('#phases span').forEach((s) => s.classList.toggle('cur', +s.dataset.ph === phase));
  document.querySelectorAll('#caps p').forEach((p) => p.classList.toggle('now', +p.dataset.step === step));
}

function initTable() {
  const box = document.getElementById('procTable');
  box.innerHTML = TABLE.map((t) => `<div class="pt-block"><b class="pt-stage">${t.stage}</b><div class="pt-rows">${t.rows.map(([k, v, given]) =>
    `<div class="pt-row"><span class="pt-k">${k}</span>${given ? `<span class="pt-v given">${v}</span>` : `<button type="button" class="pt-v blank" data-a="${v}">点一下看答案</button>`}</div>`).join('')}</div></div>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.blank');
    if (!b) return;
    b.textContent = b.dataset.a;
    b.classList.add('shown');
  });
}

function renderWords(kind) {
  document.getElementById('wordGrid').innerHTML = WORDS[kind].map((w) => `<button type="button" class="wcard"><b>${w.w}</b>
    <span class="w-items">${w.items.map(([eg, mean]) => `<span><i>${eg}</i><em>${mean}</em></span>`).join('')}</span></button>`).join('');
  document.querySelectorAll('#wordTabs .btn').forEach((b) => b.classList.toggle('solid', b.dataset.wt === kind));
}

function initWords() {
  renderWords('duoyi');
  document.getElementById('wordTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-wt]');
    if (b) renderWords(b.dataset.wt);
  });
  document.getElementById('wordGrid').addEventListener('click', (e) => {
    const c = e.target.closest('.wcard');
    if (c) c.classList.toggle('open');
  });
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS });
    Poem.init();
    initTable();
    initWords();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-process')) renderProcess(step);
  },
};
