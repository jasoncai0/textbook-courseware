'use strict';
/* 雾在哪里 · 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用）
 * 本课独有：① 雾的“遮罩”：同一幅海边小城，跟着课文一样一样被雾藏起来，再一样一样露出来（字幕行上写 data-fog / data-clear / data-kid）；
 *           ② 擦一擦：用手指擦掉雾，找出藏起来的东西；③ 照样子说话机；④ 拨开云雾记忆游戏。 */
const FOGS = ['sea', 'sky', 'dark', 'beach', 'city', 'house', 'street', 'tree', 'bridge', 'people', 'cat', 'walk'];
const KID_POS = { left: [40, 240], sea: [330, 300], sky: [560, 40], shore: [880, 250], top: [1130, 70], hide: [1130, 70], gone: [1130, 70] };

/* 淘气的雾（小云朵，有眼睛、会笑） */
const KID_SHAPE = `<symbol id="wuKidShape" viewBox="0 0 200 130">
  <path d="M30 110Q0 110 4 84Q8 62 34 62Q34 28 70 26Q92 0 124 18Q160 10 166 46Q198 50 196 82Q194 112 160 110Z" fill="#fff" stroke="#c9d6e2" stroke-width="4"/>
  <circle cx="82" cy="70" r="8" fill="#334"/><circle cx="124" cy="70" r="8" fill="#334"/><circle cx="85" cy="67" r="2.5" fill="#fff"/><circle cx="127" cy="67" r="2.5" fill="#fff"/>
  <path d="M90 88Q103 100 116 88" fill="none" stroke="#334" stroke-width="5" stroke-linecap="round"/>
  <circle cx="66" cy="86" r="8" fill="#ffc9c9"/><circle cx="140" cy="86" r="8" fill="#ffc9c9"/></symbol>`;
document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${KID_SHAPE}</svg>`);

const puff = (list) => list.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('');
const HOUSES = [[960, 380, '#e0735a'], [1090, 360, '#5a8fd0'], [1230, 380, '#f0b64a'], [1370, 350, '#7ab06a'], [1500, 380, '#d0607a']];
function sceneSvg() {
  return `<svg class="wu-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="wuSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ec0ef"/><stop offset="1" stop-color="#d8eefa"/></linearGradient>
      <linearGradient id="wuSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f9fd6"/><stop offset="1" stop-color="#1f6fae"/></linearGradient>
      <filter id="wuBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
    </defs>
    <rect width="1600" height="900" fill="url(#wuSky)"/>
    <g class="w-sun"><circle cx="330" cy="150" r="72" fill="#ffd24a"/>${Array.from({ length: 10 }, (_, i) => { const a = (i * Math.PI) / 5; return `<path d="M${330 + Math.cos(a) * 92} ${150 + Math.sin(a) * 92}L${330 + Math.cos(a) * 124} ${150 + Math.sin(a) * 124}" stroke="#ffc21a" stroke-width="12" stroke-linecap="round"/>`; }).join('')}</g>
    <path d="M0 430H900L760 900H0Z" fill="url(#wuSea)"/>
    <path d="M0 430H900L890 470H0Z" fill="#9fd0f0"/>
    <g fill="none" stroke="#e6f4ff" stroke-width="7" stroke-linecap="round"><path d="M60 560q30-20 60 0t60 0"/><path d="M420 640q30-20 60 0t60 0"/><path d="M140 800q30-20 60 0t60 0"/><path d="M560 760q30-20 60 0"/></g>
    <g transform="translate(250 640)"><path d="M-120 0H120L84 50H-84Z" fill="#b5532f"/><path d="M0 0V-190" stroke="#5a3a2a" stroke-width="10"/><path d="M8 -180L110 -20H8Z" fill="#fff"/><path d="M-8 -150L-90 -20H-8Z" fill="#f3f0e6"/></g>
    <g transform="translate(600 520) scale(.6)"><path d="M-120 0H120L84 50H-84Z" fill="#3e6f9e"/><path d="M0 0V-190" stroke="#5a3a2a" stroke-width="10"/><path d="M8 -180L110 -20H8Z" fill="#fff"/></g>
    <path d="M900 430H1600V900H760Z" fill="#eadfc4"/>
    <path d="M900 430L760 900H860L970 430Z" fill="#f6e2a2"/>
    ${HOUSES.map(([x, y, c]) => `<g><rect x="${x - 55}" y="${y}" width="110" height="${520 - y}" fill="#fbf5e8" stroke="#cbb48a" stroke-width="3"/><path d="M${x - 72} ${y + 4}L${x} ${y - 70}L${x + 72} ${y + 4}Z" fill="${c}"/><rect x="${x - 30}" y="${y + 40}" width="24" height="28" fill="#8cc8ee"/><rect x="${x + 8}" y="${y + 40}" width="24" height="28" fill="#8cc8ee"/></g>`).join('')}
    <path d="M1110 900C1060 760 1210 660 1250 520" fill="none" stroke="#b9b2a6" stroke-width="90"/>
    <path d="M1110 900C1060 760 1210 660 1250 520" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="30 26"/>
    ${[[1010, 600], [1480, 600], [1560, 720]].map(([x, y]) => `<g><rect x="${x - 10}" y="${y}" width="20" height="80" fill="#8a5a36"/><circle cx="${x}" cy="${y - 20}" r="58" fill="#5fae4e"/><circle cx="${x - 30}" cy="${y + 4}" r="34" fill="#4f9c40"/></g>`).join('')}
    <path d="M1290 900Q1360 760 1600 700V800Q1420 830 1400 900Z" fill="#7cc2e6"/>
    <path d="M1320 770Q1410 690 1500 735" fill="none" stroke="#9a8a78" stroke-width="22"/><path d="M1335 790Q1410 735 1488 760" fill="none" stroke="#9a8a78" stroke-width="8"/>
    ${[[1060, 770, '#d9534f'], [1140, 720, '#3f7fbf']].map(([x, y, c]) => `<g><circle cx="${x}" cy="${y - 64}" r="16" fill="#f2c9a0"/><path d="M${x - 18} ${y - 46}H${x + 18}L${x + 14} ${y}H${x - 14}Z" fill="${c}"/><path d="M${x - 8} ${y}v22M${x + 8} ${y}v22" stroke="#444" stroke-width="7"/></g>`).join('')}
    <g class="w-cat"><g class="w-catb" transform="translate(1250 840)"><path class="w-tail" d="M40 -10Q78 -30 70 -70" fill="none" stroke="#222" stroke-width="10" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="48" ry="26" fill="#222"/><circle cx="-46" cy="-22" r="22" fill="#222"/><path d="M-62 -38L-60 -60L-46 -42ZM-40 -42L-30 -60L-28 -36Z" fill="#222"/><circle cx="-52" cy="-24" r="4" fill="#ffe14a"/><path d="M-30 20v18M-10 20v18M14 20v18M32 20v18" stroke="#222" stroke-width="8"/></g></g>
    <g class="f f-sea" filter="url(#wuBlur)">${puff([[160, 520, 260, 140], [520, 520, 280, 140], [820, 560, 160, 160], [200, 760, 280, 160], [580, 760, 260, 160], [300, 640, 260, 120]])}</g>
    <g class="f f-sky" filter="url(#wuBlur)">${puff([[200, 160, 300, 190], [620, 120, 320, 160], [1040, 140, 320, 170], [1440, 150, 300, 180], [800, 360, 820, 120], [330, 300, 300, 140]])}</g>
    <g class="f f-beach" filter="url(#wuBlur)">${puff([[880, 560, 110, 180], [830, 780, 120, 160]])}</g>
    <g class="f f-house" filter="url(#wuBlur)">${puff([[1080, 430, 220, 120], [1380, 420, 230, 120]])}</g>
    <g class="f f-street" filter="url(#wuBlur)">${puff([[1110, 840, 120, 80], [1190, 640, 110, 90]])}</g>
    <g class="f f-tree" filter="url(#wuBlur)">${puff([[1000, 580, 100, 110], [1500, 620, 120, 150]])}</g>
    <g class="f f-bridge" filter="url(#wuBlur)">${puff([[1410, 760, 140, 90]])}</g>
    <g class="f f-people" filter="url(#wuBlur)">${puff([[1100, 730, 110, 100]])}</g>
    <g class="f f-cat" filter="url(#wuBlur)">${puff([[1240, 830, 110, 70]])}</g>
    <g class="f f-city" filter="url(#wuBlur)">${puff([[1000, 500, 260, 220], [1300, 480, 300, 220], [1500, 560, 200, 260], [1060, 780, 260, 200], [1380, 800, 260, 180]])}</g>
    <rect class="f-darkr" width="1600" height="900"/>
    <g class="w-kid"><use href="#wuKidShape" width="240" height="156"/></g>
  </svg>`;
}

/* 每页的雾：data-init 初始状态 + 已经出现的字幕行上的 data-fog（加雾）/ data-clear（散雾）/ data-kid（雾娃娃的位置） */
const words = (s) => (s || '').split(/\s+/).filter(Boolean);
function applyFog(slide, step) {
  slide.querySelectorAll('.wu-scene').forEach((sc) => {
    const fog = new Set(words(sc.dataset.init));
    let kid = sc.dataset.kid0 || 'gone';
    [...slide.querySelectorAll('[data-step]')]
      .filter((e) => +e.dataset.step <= step && (e.dataset.fog || e.dataset.clear || e.dataset.kid))
      .sort((a, b) => a.dataset.step - b.dataset.step)
      .forEach((e) => {
        words(e.dataset.fog).forEach((k) => fog.add(k));
        words(e.dataset.clear).forEach((k) => fog.delete(k));
        if (e.dataset.kid) kid = e.dataset.kid;
      });
    FOGS.forEach((k) => sc.classList.toggle(`fog-${k}`, fog.has(k)));
    sc.dataset.kid = kid;
    const [x, y] = KID_POS[kid] || KID_POS.gone;
    sc.querySelector('.w-kid').style.transform = `translate(${x}px, ${y}px)`;
  });
}
document.querySelectorAll('.wu-scene').forEach((sc) => { sc.innerHTML = sceneSvg(); });
document.querySelectorAll('.slide').forEach((s) => { if (s.querySelector('.wu-scene')) applyFog(s, 0); });

/* ================= 擦一擦：画布上的雾，擦到东西就打勾 ================= */
const FIND = [[[300, 720], [140, 560]], [[250, 590], [600, 470]], [[330, 150]], [[1100, 440], [1370, 420], [960, 430]], [[1410, 750]], [[1240, 830]]];
const FIND_R = 110;
const ERASE_R = 0.06;
function initWipe(box) {
  if (!box) return;
  const cv = box.querySelector('canvas');
  const ctx = cv.getContext('2d');
  const items = document.querySelectorAll('#wuList .wu-find');
  const found = new Set();
  const fill = () => {
    const r = cv.getBoundingClientRect();
    cv.width = Math.max(1, Math.round(r.width));
    cv.height = Math.max(1, Math.round(r.height));
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(244, 247, 250, .96)';
    ctx.fillRect(0, 0, cv.width, cv.height);
    for (let i = 0; i < 40; i += 1) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, cv.width * 0.12);
      g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.save(); ctx.translate(Math.random() * cv.width, Math.random() * cv.height); ctx.fillStyle = g;
      ctx.fillRect(-cv.width * 0.12, -cv.width * 0.12, cv.width * 0.24, cv.width * 0.24); ctx.restore();
    }
    found.clear(); items.forEach((it) => it.classList.remove('ok')); box.classList.remove('clear');
  };
  const erase = (e) => {
    const r = cv.getBoundingClientRect();
    const x = e.clientX - r.left; const y = e.clientY - r.top;
    const rad = cv.width * ERASE_R;
    ctx.globalCompositeOperation = 'destination-out';
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.7, 'rgba(0,0,0,.8)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    const sx = (x / r.width) * 1600; const sy = (y / r.height) * 900;
    FIND.forEach((pts, k) => {
      if (found.has(k) || !pts.some(([px, py]) => Math.hypot(px - sx, py - sy) < FIND_R)) return;
      found.add(k); items[k].classList.add('ok');
    });
  };
  let down = false;
  cv.addEventListener('pointerdown', (e) => { down = true; cv.setPointerCapture(e.pointerId); erase(e); });
  cv.addEventListener('pointermove', (e) => { if (down) erase(e); });
  cv.addEventListener('pointerup', () => { down = false; });
  box.parentElement.querySelector('[data-fogaway]').addEventListener('click', () => { box.classList.add('clear'); items.forEach((it, k) => { found.add(k); it.classList.add('ok'); }); });
  box.parentElement.querySelector('[data-fogback]').addEventListener('click', fill);
  box.fill = fill;
  fill();
}
initWipe(document.getElementById('wuWipe'));

/* ================= 照样子说一说 ================= */
const SAY = [
  { t: '雾把天空藏了起来。无论是天空，还是天空中的太阳，都看不见了。', py: 'wù bǎ tiān kōng cáng le qǐ lái wú lùn shì tiān kōng hái shi tiān kōng zhōng de tài yáng dōu kàn bú jiàn le', img: 'assets/haishang.jpg' },
  { t: '雾把城市藏了起来。无论是房屋、街道、树木、桥梁，还是行人和小黑猫，都看不见了。', py: 'wù bǎ chéng shì cáng le qǐ lái wú lùn shì fáng wū jiē dào shù mù qiáo liáng hái shi xíng rén hé xiǎo hēi māo dōu kàn bú jiàn le', img: 'assets/chengshi.jpg' },
  { t: '雾把校园藏了起来。无论是教学楼、操场，还是高高的旗杆，都看不见了。', py: 'wù bǎ xiào yuán cáng le qǐ lái wú lùn shì jiào xué lóu cāo chǎng hái shi gāo gāo de qí gān dōu kàn bú jiàn le', icon: '🏫' },
  { t: '雾把公园藏了起来。无论是大树、花坛，还是小湖里的小船，都看不见了。', py: 'wù bǎ gōng yuán cáng le qǐ lái wú lùn shì dà shù huā tán hái shi xiǎo hú lǐ de xiǎo chuán dōu kàn bú jiàn le', icon: '🌳' },
];
function initSay() {
  const tabs = document.getElementById('wuTabs');
  if (!tabs) return;
  const out = document.getElementById('wuOut');
  const pic = document.getElementById('wuPic');
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    const d = SAY[+b.dataset.t];
    tabs.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    out.innerHTML = `<span class="py">${Hanzi.ruby(d.t, d.py)}</span>${d.icon ? '<small>（示例，先自己说一说）</small>' : ''}`;
    pic.style.backgroundImage = d.img ? `url(${d.img})` : 'none';
    pic.textContent = d.icon || '';
    pic.classList.remove('foggy'); void pic.offsetWidth; pic.classList.add('foggy');
  });
}
initSay();

/* ================= 拨开云雾（记忆游戏） ================= */
const GAME = [['雾', 'wù'], ['淘', 'táo'], ['于', 'yú'], ['暗', 'àn'], ['岸', 'àn'], ['街', 'jiē'], ['梁', 'liáng'], ['甚', 'shèn'], ['至', 'zhì'], ['切', 'qiè'], ['躲', 'duǒ'], ['失', 'shī']];
const LAYOUT = [5, 0, 9, 2, 11, 7, 1, 10, 3, 8, 6, 4];
const ASK = [0, 6, 2, 8, 4, 10, 1, 7, 3, 9, 5, 11];
const COVER_MS = 1100;
function initGame(box) {
  if (!box) return;
  box.innerHTML = `<div class="wg-bar"><span class="wg-q"></span><span class="wg-msg">点一团雾，看看里面藏着哪个字。</span><button type="button" class="btn" data-again>再玩一次</button></div>
    <div class="wg-grid">${LAYOUT.map((g) => `<button type="button" class="wg-cell" data-g="${g}"><b>${Hanzi.ruby(GAME[g][0], GAME[g][1])}</b><i class="wg-fog"></i></button>`).join('')}</div>`;
  const q = box.querySelector('.wg-q');
  const msg = box.querySelector('.wg-msg');
  let k = 0;
  let busy = false;
  // “暗、岸”同音：问 àn 时两个都算对
  const ask = () => { q.textContent = k < ASK.length ? GAME[ASK[k]][1] : '★'; };
  const isRight = (g) => GAME[g][1] === GAME[ASK[k]][1];
  ask();
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      k = 0; busy = false; box.classList.remove('all-done');
      box.querySelectorAll('.wg-cell').forEach((c) => c.classList.remove('open', 'ok'));
      msg.textContent = '点一团雾，看看里面藏着哪个字。'; ask(); return;
    }
    const c = e.target.closest('.wg-cell:not(.ok)');
    if (!c || busy || k >= ASK.length) return;
    const g = +c.dataset.g;
    c.classList.add('open');
    if (isRight(g)) {
      c.classList.add('ok');
      // 同音字被提前找到：把它从题目里换到当前位置
      const j = ASK.indexOf(g, k);
      [ASK[k], ASK[j]] = [ASK[j], ASK[k]];
      k += 1;
      msg.textContent = k < ASK.length ? `找到了“${GAME[g][0]}”！读一读。` : '雾全散了，12 个字都找到了！';
      box.classList.toggle('all-done', k === ASK.length);
      ask();
      return;
    }
    busy = true;
    msg.textContent = `这是“${GAME[g][0]}”，记住它在哪儿！`;
    setTimeout(() => { c.classList.remove('open'); busy = false; }, COVER_MS);
  });
}
initGame(document.getElementById('wuGame'));

Hanzi.init({
  cards: [
    { z: '雾', py: 'wù', bs: '雨', bh: 13, words: [['大雾', 'dà wù'], ['雾气', 'wù qì']] },
    { z: '淘', py: 'táo', bs: '氵', bh: 11, words: [['淘气', 'táo qì'], ['淘米', 'táo mǐ']] },
    { z: '于', py: 'yú', bs: '一', bh: 3, words: [['于是', 'yú shì'], ['终于', 'zhōng yú']] },
    { z: '暗', py: 'àn', bs: '日', bh: 13, words: [['变暗', 'biàn àn'], ['黑暗', 'hēi àn']] },
    { z: '岸', py: 'àn', bs: '山', bh: 8, words: [['海岸', 'hǎi àn'], ['岸边', 'àn biān']] },
    { z: '街', py: 'jiē', bs: '彳', bh: 12, words: [['街道', 'jiē dào'], ['大街', 'dà jiē']] },
    { z: '梁', py: 'liáng', bs: '木', bh: 11, words: [['桥梁', 'qiáo liáng'], ['房梁', 'fáng liáng']] },
    { z: '甚', py: 'shèn', bh: 9, words: [['甚至', 'shèn zhì']] },
    { z: '至', py: 'zhì', bs: '至', bh: 6, words: [['甚至', 'shèn zhì'], ['至少', 'zhì shǎo']] },
    { z: '切', py: 'qiè', bs: '刀', bh: 4, words: [['一切', 'yí qiè'], ['亲切', 'qīn qiè']] },
    { z: '躲', py: 'duǒ', bs: '身', bh: 13, words: [['躲到', 'duǒ dào'], ['躲雨', 'duǒ yǔ']] },
    { z: '失', py: 'shī', bh: 5, words: [['消失', 'xiāo shī'], ['丢失', 'diū shī']] },
  ],
  write: {
    a: [
      { z: '于', py: 'yú', bs: '一', bh: 3 },
      { z: '论', py: 'lùn', bs: '讠', bh: 6 },
      { z: '岸', py: 'àn', bs: '山', bh: 8 },
      { z: '屋', py: 'wū', bs: '尸', bh: 9 },
    ],
    b: [
      { z: '切', py: 'qiè', bs: '刀', bh: 4 },
      { z: '久', py: 'jiǔ', bs: '丿', bh: 3 },
      { z: '散', py: 'sàn', bs: '攵', bh: 12 },
      { z: '步', py: 'bù', bs: '止', bh: 7 },
    ],
  },
});

window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.querySelector('.wu-scene')) applyFog(slide, step);
  },
};
