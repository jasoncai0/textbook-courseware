'use strict';
/* 古诗二首（晓出净慈寺送林子方 · 绝句）· 本课数据与本课互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：① 西湖荷花长卷——2400 宽的全景，一句一段往右展开，莲叶一直铺到天边（接天），太阳升起荷花变红（映日）；
 *          ② 绝句四句四景拼贴——一句一幅小画，最后加上窗框拼成草堂窗景；③ 白鹭上青天识字游戏。 */

/* 二下课文只给生字注音：data-pyk="脱:tuō 袄:ǎo" → 按顺序给这些字注音，其余字上面空着（与课本一致） */
document.querySelectorAll('[data-pyk]').forEach((el) => {
  const want = el.dataset.pyk.trim().split(/\s+/).filter(Boolean).map((s) => s.split(':'));
  let k = 0;
  const syl = [...el.textContent].filter((ch) => /\p{Script=Han}/u.test(ch))
    .map((ch) => (k < want.length && ch === want[k][0] ? want[k++][1] : '_'));
  if (k < want.length) console.warn(`注音字没找到：${want[k][0]}（${el.textContent}）`); // eslint-disable-line no-console
  el.dataset.py = syl.join(' ');
});

/* ================= 西湖长卷 ================= */
const PANO_W = 2400;
const HORIZON = 250;
// 伪随机（固定种子），每次打开长卷都一样
const rnd = (() => { let s = 7; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();
function lotusLeaves() {
  let out = '';
  for (let r = 0; r <= 9; r += 1) {
    const t = r / 9; // 0 远 → 1 近
    const y = HORIZON + 6 + t * t * 250;
    const size = 8 + t * 46;
    const x0 = 560 - t * 160; // 越近越往左铺
    for (let x = x0 + rnd() * size; x < PANO_W + size; x += size * (1.5 + rnd() * 0.5)) {
      const g = 38 + Math.round(rnd() * 22);
      out += `<ellipse cx="${x.toFixed(0)}" cy="${(y + rnd() * size * 0.3).toFixed(0)}" rx="${size.toFixed(1)}" ry="${(size * 0.42).toFixed(1)}" fill="hsl(${130 + rnd() * 20} 45% ${g}%)"/>`;
      if (t > 0.3 && rnd() < 0.16) {
        const fx = x + size * 0.3;
        const fy = y - size * 0.55;
        const s = size * 0.42;
        out += `<g class="gs-lotus" transform="translate(${fx.toFixed(0)} ${fy.toFixed(0)}) scale(${(s / 20).toFixed(2)})"><path d="M0 0q-14 -10 -10 -30q8 6 10 18q2 -12 10 -18q4 20 -10 30z"/><path d="M0 0q-22 -2 -24 -20q12 2 18 12zM0 0q22 -2 24 -20q-12 2 -18 12z"/></g>`;
      }
    }
  }
  return out;
}
function buildPano(svg) {
  svg.innerHTML = `
    <defs><linearGradient id="gsSky" x1="0" y1="0" x2="0" y2="1"><stop class="k1" offset="0"/><stop class="k2" offset="1"/></linearGradient>
      <radialGradient id="gsSunG"><stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#ffb347"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs>
    <g class="gs-pano">
      <rect width="${PANO_W}" height="520" fill="url(#gsSky)"/>
      <g class="gs-sun"><circle cx="2050" cy="${HORIZON + 10}" r="110" fill="url(#gsSunG)"/><circle cx="2050" cy="${HORIZON + 10}" r="38" fill="#ff8a3d"/></g>
      <path d="M0 ${HORIZON}Q180 150 360 ${HORIZON - 20}T760 ${HORIZON - 10}T1100 ${HORIZON}V${HORIZON + 8}H0Z" fill="#b9cbd6"/>
      <g transform="translate(250 ${HORIZON - 70})" fill="#7a6a5a"><path d="M-40 40h80v30h-80z"/><path d="M-60 42l60 -36l60 36z"/><path d="M-30 6l30 -20l30 20z"/></g>
      <rect y="${HORIZON}" width="${PANO_W}" height="${520 - HORIZON}" fill="#cfe6e8"/>
      <path d="M0 ${HORIZON + 4}H${PANO_W}" stroke="#ffffff" stroke-width="3" opacity=".6"/>
      <path d="M0 360Q160 330 300 352T560 356L560 520H0Z" fill="#d8c9a4"/>
      <g transform="translate(150 344)"><circle cy="-46" r="9" fill="#efe2cf"/><path d="M-12 -36h24l6 40h-36z" fill="#8a9aa8"/></g>
      <g transform="translate(190 344)"><circle cy="-46" r="9" fill="#efe2cf"/><path d="M-12 -36h24l6 40h-36z" fill="#5e8a7a"/></g>
      ${lotusLeaves()}
    </g>`;
}
const pano = document.getElementById('gsPano');
const panoRange = document.getElementById('gsRange');
function panTo(x, slow) {
  const g = pano.querySelector('.gs-pano');
  g.style.transitionDuration = slow ? '3.5s' : '.4s';
  g.style.transform = `translateX(${-x}px)`;
  panoRange.value = x;
}
if (pano) {
  buildPano(pano);
  panoRange.addEventListener('input', () => panTo(+panoRange.value, false));
}

/* ================= 绝句：四幅小画 ================= */
const egret = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0q20 -6 36 2q-16 2 -24 12z" fill="#fff"/><path d="M6 -2q-10 -26 -30 -30q12 18 18 32z" fill="#f4f4ef"/><path d="M36 2l14 -4" stroke="#e0b030" stroke-width="3"/><path d="M4 10l-14 18M10 10l-8 20" stroke="#333" stroke-width="2"/></g>`;
const oriole = (x, y, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1)"><ellipse rx="20" ry="12" fill="#f2c230"/><circle cx="16" cy="-8" r="9" fill="#f2c230"/><path d="M24 -8l10 3l-10 2z" fill="#e07b2a"/><path d="M10 -12l14 0" stroke="#222" stroke-width="3"/><path d="M-18 0l-16 -6l4 12z" fill="#333"/><path d="M-4 -4q-10 -16 -22 -10q10 10 22 10z" fill="#222"/></g>`;
const TILES = [
  () => `<rect width="400" height="300" fill="#e9f4dc"/>
    <path d="M40 0q-10 90 20 300M110 0q-14 100 10 300M330 0q10 110 -16 300" stroke="#6b4a2a" stroke-width="10" fill="none"/>
    ${Array.from({ length: 16 }, (_, i) => `<path class="gs-strand" d="M${20 + i * 24} 0q${i % 2 ? 14 : -14} 120 ${i % 3 ? 6 : -6} ${200 + (i % 4) * 22}" style="animation-delay:${(i % 5) * 0.3}s"/>`).join('')}
    ${oriole(170, 130, 0)}${oriole(250, 170, 1)}
    <text class="gs-note" x="196" y="96">♪</text><text class="gs-note" x="282" y="136">♫</text>`,
  () => `<rect width="400" height="300" fill="#7fb6e6"/><rect width="400" height="300" fill="url(#gsTileSky)"/>
    <defs><linearGradient id="gsTileSky" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#c9e4f6"/><stop offset="1" stop-color="#4f8fd6"/></linearGradient></defs>
    <g class="gs-egrets">${[0, 1, 2, 3, 4, 5].map((k) => egret(50 + k * 52, 240 - k * 34, 1.1)).join('')}</g>`,
  () => `<rect width="400" height="300" fill="#efe6d4"/>
    <rect x="60" y="34" width="280" height="200" fill="#bcd8ee"/>
    <path d="M60 234L130 120L180 170L240 80L300 150L340 120V234Z" fill="#8aa0b4"/>
    <path d="M130 120L110 152L150 146ZM240 80L214 124L260 116L278 132ZM340 120L318 140L340 146Z" fill="#fff"/>
    <rect x="60" y="34" width="280" height="200" fill="none" stroke="#7a5432" stroke-width="16"/>
    <path d="M200 34V234M60 134H340" stroke="#7a5432" stroke-width="8"/>`,
  () => `<rect width="400" height="300" fill="#dcecf2"/>
    <rect y="170" width="400" height="130" fill="#7fb3cf"/>
    <path d="M0 0H44V300H0Z" fill="#7a5432"/><path d="M44 0H60V300H44Z" fill="#9a6a3c"/>
    ${[[130, 190, 1], [250, 210, 0.8], [330, 186, 0.6]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-60 20h120l-20 26h-80z" fill="#8a5a2a"/><path d="M0 18V-80" stroke="#5a3a1a" stroke-width="5"/><path d="M4 -76q44 40 0 88z" fill="#f6efe0"/></g>`).join('')}
    <path d="M70 250q30 -8 60 0t60 0t60 0t60 0" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>`,
];
document.querySelectorAll('[data-tile]').forEach((svg) => { svg.innerHTML = TILES[+svg.dataset.tile](); });

/* ================= 识字游戏：一行白鹭上青天 ================= */
const EGRET_Q = [
  { q: 'xiǎo', ans: '晓', opts: ['烧', '晓', '浇'] },
  { q: 'cí', ans: '慈', opts: ['慈', '滋', '磁'] },
  { q: 'bì', ans: '毕', opts: ['华', '比', '毕'] },
  { q: 'yìng', ans: '映', opts: ['映', '英', '央'] },
  { q: 'lí', ans: '鹂', opts: ['丽', '鹂', '鹏'] },
  { q: 'míng', ans: '鸣', opts: ['鸟', '呜', '鸣'] },
  { q: 'lǐng', ans: '岭', opts: ['岭', '铃', '冷'] },
  { q: 'bó', ans: '泊', opts: ['拍', '泊', '怕'] },
];
const slotPos = (k) => [12 + k * 10.5, 78 - k * 9];
function initEgrets(box) {
  let i = 0;
  let busy = false;
  box.innerHTML = `<div class="gs-sky">${EGRET_Q.map((_, k) => { const [x, y] = slotPos(k); return `<span class="gs-slot" style="left:${x}%;top:${y}%"></span>`; }).join('')}</div><div class="gs-gask"></div>`;
  const ask = box.querySelector('.gs-gask');
  const show = () => {
    const it = EGRET_Q[i];
    ask.innerHTML = `<p class="gs-q hz-latin">${it.q}</p>
      <div class="gs-opts">${it.opts.map((o) => `<button type="button" class="gs-opt" data-o="${o}">${o}</button>`).join('')}</div>
      <p class="gs-msg">${i ? '' : '哪个字读这个音？'}</p>`;
    busy = false;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-again]')) {
      i = 0;
      box.querySelectorAll('.gs-slot').forEach((s) => { s.classList.remove('done'); s.textContent = ''; });
      show();
      return;
    }
    const opt = e.target.closest('.gs-opt');
    if (!opt || busy) return;
    const msg = box.querySelector('.gs-msg');
    if (opt.dataset.o !== EGRET_Q[i].ans) {
      opt.classList.remove('wrong'); void opt.offsetWidth; opt.classList.add('wrong');
      msg.textContent = '再看看，这个字不读这个音';
      return;
    }
    busy = true;
    opt.classList.add('right');
    const slot = box.querySelectorAll('.gs-slot')[i];
    slot.textContent = EGRET_Q[i].ans;
    slot.classList.add('done');
    msg.textContent = `白鹭飞上去了！${EGRET_Q[i].ans}（${EGRET_Q[i].q}）`;
    setTimeout(() => {
      i += 1;
      if (i < EGRET_Q.length) { show(); return; }
      ask.innerHTML = '<p class="gs-q">一行白鹭上青天！</p><button type="button" class="btn solid" data-again>再飞一次</button>';
    }, 1100);
  });
  show();
}
const egretBox = document.getElementById('gsEgret');
if (egretBox) initEgrets(egretBox);

Hanzi.init({
  cards: [
    { z: '晓', py: 'xiǎo', words: [['晓出', 'xiǎo chū'], ['春晓', 'chūn xiǎo']] },
    { z: '慈', py: 'cí', words: [['净慈寺', 'jìng cí sì'], ['慈爱', 'cí ài']] },
    { z: '毕', py: 'bì', words: [['毕竟', 'bì jìng'], ['毕业', 'bì yè']] },
    { z: '竟', py: 'jìng', words: [['毕竟', 'bì jìng'], ['竟然', 'jìng rán']] },
    { z: '映', py: 'yìng', words: [['映日', 'yìng rì'], ['倒映', 'dào yìng']] },
    { z: '绝', py: 'jué', words: [['绝句', 'jué jù']] },
    { z: '鹂', py: 'lí', words: [['黄鹂', 'huáng lí']] },
    { z: '鸣', py: 'míng', words: [['鸣叫', 'míng jiào'], ['鸟鸣', 'niǎo míng']] },
    { z: '行', py: 'háng', words: [['一行', 'yì háng'], ['行列', 'háng liè']] },
    { z: '含', py: 'hán', words: [['窗含', 'chuāng hán'], ['含笑', 'hán xiào']] },
    { z: '岭', py: 'lǐng', words: [['西岭', 'xī lǐng'], ['山岭', 'shān lǐng']] },
    { z: '泊', py: 'bó', words: [['门泊', 'mén bó'], ['停泊', 'tíng bó']] },
  ],
  write: {
    a: [
      { z: '湖', py: 'hú', bs: '氵', bh: 12 },
      { z: '莲', py: 'lián', bs: '艹', bh: 10 },
      { z: '穷', py: 'qióng', bs: '穴', bh: 7 },
      { z: '荷', py: 'hé', bs: '艹', bh: 10 },
    ],
    b: [
      { z: '绝', py: 'jué', bs: '纟', bh: 9 },
      { z: '含', py: 'hán', bh: 7 },
      { z: '岭', py: 'lǐng', bs: '山', bh: 8 },
      { z: '吴', py: 'wú', bs: '口', bh: 7 },
    ],
  },
});

const PAN_AT = [0, 0, 0, 1600, 1600];
window.LESSON = {
  init() { Narrative.init({}); },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (pano && slide.contains(pano)) {
      panTo(PAN_AT[Math.min(step, 4)], step === 3);
      pano.classList.toggle('sunrise', step >= 4);
    }
  },
};
