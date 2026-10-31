'use strict';
/* 六下 综合与实践《大树有多高》· 本课互动：阳光下的竹竿、大树与影子。
 * 影长 = 物高 ÷ tan(太阳高度角)，光线平行；所有物体按同一比例（像素/厘米）画出，影长取整厘米后再算比值，与课本“结果取整厘米数”一致。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const DEG = Math.PI / 180;
const EXAMPLE_ALPHA = Math.atan(1.25) / DEG; // 示例时刻：竹竿长 ÷ 影长 = 1.25
const shadow = (h, alpha) => h / Math.tan(alpha * DEG);

/**
 * 画一幅阳光场景。o = { k: 像素/厘米, ground: 地面 y, objs: [{ x: 底部像素 x, h: 高 cm, kind: 'pole'|'tree', label, sLabel }] }
 * 太阳在左上方，影子向右。
 */
function drawScene(svg, o, alpha) {
  svg.innerHTML = '';
  const [W, H] = svg.getAttribute('viewBox').split(' ').slice(2).map(Number);
  svgEl('rect', { x: 0, y: 0, width: W, height: o.ground, class: 'sky' }, svg);
  svgEl('rect', { x: 0, y: o.ground, width: W, height: H - o.ground, class: 'grass' }, svg);
  const sun = [40, 36]; // 太阳在左上方（很远，光线可看作平行）
  svgEl('circle', { cx: sun[0], cy: sun[1], r: 20, class: 'sun' }, svg);
  o.objs.forEach((ob) => {
    const len = shadow(ob.h, alpha);
    const sx = ob.x + len * o.k;
    const yTop = o.ground - ob.h * o.k;
    svgEl('line', { x1: ob.x, y1: o.ground + 1, x2: sx, y2: o.ground + 1, class: 'shd' }, svg);
    svgEl('line', { x1: ob.x, y1: yTop, x2: sx, y2: o.ground, class: 'ray' }, svg);
    if (ob.kind === 'tree') {
      const h = ob.h * o.k;
      svgEl('rect', { x: ob.x - h * 0.035, y: o.ground - h * 0.5, width: h * 0.07, height: h * 0.5, class: 'trunk' }, svg);
      svgEl('ellipse', { cx: ob.x, cy: yTop + h * 0.28, rx: h * 0.22, ry: h * 0.28, class: 'crown' }, svg);
    } else {
      svgEl('line', { x1: ob.x, y1: o.ground, x2: ob.x, y2: yTop, class: 'pole' }, svg);
    }
    if (ob.label && ob.kind === 'tree') svgEl('text', { x: ob.x + ob.h * o.k * 0.05, y: o.ground - ob.h * o.k * 0.22, class: 'lbl', 'text-anchor': 'start' }, svg).textContent = ob.label;
    else if (ob.label) svgEl('text', { x: ob.x - 8, y: (yTop + o.ground) / 2, class: 'lbl', 'text-anchor': 'end' }, svg).textContent = ob.label;
    if (ob.sLabel) svgEl('text', { x: (ob.x + sx) / 2, y: o.ground + 24, class: 'lbl s', 'text-anchor': 'middle' }, svg).textContent = ob.sLabel === true ? `${Math.round(len)} cm` : ob.sLabel;
  });
}

/* 第 3 页 */
function initIntro() {
  drawScene($('introFig'), { k: 0.2, ground: 320, objs: [{ x: 150, h: 1300, kind: 'tree', label: '？' }, { x: 560, h: 200, kind: 'pole' }] }, EXAMPLE_ALPHA);
}

/* 第 4 页：同样长的竹竿 */
function initExp1() {
  const objs = [80, 330, 580].map((x) => ({ x, h: 100, kind: 'pole', label: '100 cm', sLabel: true }));
  const render = () => {
    const a = +$('a1').value;
    $('a1v').textContent = `${a}°`;
    drawScene($('exp1'), { k: 1.1, ground: 255, objs }, a);
    $('e1Msg').innerHTML = `三根竹竿的影长都是 <b>${Math.round(shadow(100, a))} cm</b>。`;
  };
  $('a1').addEventListener('input', render);
  render();
}

/* 第 5 页：不同长度的竹竿 + 关系图 */
const POLES = [[50, 0], [100, 110], [150, 290], [200, 540]]; // [长 cm, 位置 cm]
function initExp2() {
  const st = { a: 45 };
  const k = 0.85;
  const render = () => {
    $('a2v').textContent = `${st.a.toFixed(1)}°`;
    drawScene($('exp2'), { k, ground: 265, objs: POLES.map(([h, p]) => ({ x: 40 + p * k, h, kind: 'pole', label: `${h}`, sLabel: true })) }, st.a);
    const sh = POLES.map(([h]) => Math.round(shadow(h, st.a)));
    $('liveTab').innerHTML = `<tr><th>竹竿长/cm</th>${POLES.map(([h]) => `<td>${h}</td>`).join('')}</tr>
      <tr><th>影长/cm</th>${sh.map((v) => `<td>${v}</td>`).join('')}</tr>
      <tr><th>比值</th>${POLES.map(([h], i) => `<td class="hl">${(h / sh[i]).toFixed(2)}</td>`).join('')}</tr>`;
    const p = $('plot');
    p.innerHTML = '';
    const [ox, oy, sx, sy] = [44, 170, 270 / 300, 150 / 220];
    for (let v = 0; v <= 300; v += 50) {
      svgEl('line', { x1: ox + v * sx, x2: ox + v * sx, y1: oy, y2: oy - 150, class: 'pg' }, p);
      svgEl('text', { x: ox + v * sx, y: oy + 15, class: 'pt' }, p).textContent = v;
    }
    for (let v = 0; v <= 200; v += 50) {
      svgEl('line', { x1: ox, x2: ox + 270, y1: oy - v * sy, y2: oy - v * sy, class: 'pg' }, p);
      svgEl('text', { x: ox - 6, y: oy - v * sy + 4, class: 'pt', 'text-anchor': 'end' }, p).textContent = v;
    }
    svgEl('text', { x: ox + 270, y: oy + 29, class: 'pt', 'text-anchor': 'end' }, p).textContent = '影长/cm';
    svgEl('text', { x: ox - 4, y: 12, class: 'pt', 'text-anchor': 'start' }, p).textContent = '竹竿长/cm';
    const t = Math.tan(st.a * DEG);
    const xe = Math.min(300, 220 / t);
    svgEl('line', { x1: ox, y1: oy, x2: ox + xe * sx, y2: oy - xe * t * sy, class: 'pl' }, p);
    POLES.forEach(([h], i) => svgEl('circle', { cx: ox + sh[i] * sx, cy: oy - h * sy, r: 4.5, class: 'pp' }, p));
  };
  $('a2').addEventListener('input', (e) => { st.a = +e.target.value; render(); });
  $('a2fix').addEventListener('click', () => { st.a = EXAMPLE_ALPHA; $('a2').value = st.a; render(); });
  render();
}

/* 第 7 页：大树与竹竿（示例时刻） */
function initSolve() {
  drawScene($('solveFig'), { k: 0.25, ground: 340, objs: [
    { x: 180, h: 1300, kind: 'tree', label: 'x cm', sLabel: '1040 cm' },
    { x: 580, h: 200, kind: 'pole', label: '200 cm', sLabel: '160 cm' },
  ] }, EXAMPLE_ALPHA);
}

/* 第 8 页：一个上午的影子（太阳高度按简化模型 62°·sin(π(t−6)/12)，仅示意趋势） */
const sunAlt = (t) => 62 * Math.sin((Math.PI * (t - 6)) / 12);
function initDay() {
  const render = () => {
    const t = +$('tIn').value;
    const a = sunAlt(t);
    const hh = Math.floor(t);
    const mm = Math.round((t - hh) * 60);
    $('tV').textContent = `${hh}:${String(mm).padStart(2, '0')}`;
    drawScene($('dayFig'), { k: 0.3, ground: 440, objs: [
      { x: 170, h: 1300, kind: 'tree', label: '1300 cm', sLabel: true },
      { x: 620, h: 200, kind: 'pole', label: '200 cm', sLabel: true },
    ] }, a);
    const sT = Math.round(shadow(1300, a));
    const sP = Math.round(shadow(200, a));
    $('dayTab').innerHTML = `<tr><th></th><th>高/cm</th><th>影长/cm</th><th>高与影长的比值</th></tr>
      <tr><th>大树</th><td>1300</td><td>${sT}</td><td class="hl">${(1300 / sT).toFixed(2)}</td></tr>
      <tr><th>竹竿</th><td>200</td><td>${sP}</td><td class="hl">${(200 / sP).toFixed(2)}</td></tr>`;
  };
  $('tIn').addEventListener('input', render);
  render();
}

window.LESSON = {
  init() {
    initIntro();
    initExp1();
    initExp2();
    initSolve();
    initDay();
  },
};
