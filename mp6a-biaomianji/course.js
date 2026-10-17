'use strict';
/* 六上 长方体和正方体的表面积 · 本课互动：例 4 纸盒展开 / 折回，3 组相对的面在立体图和展开图上同时高亮并标出长 × 宽；
 * 正方体展开；例 5 无盖鱼缸——点按钮装上 / 拿掉 6 块玻璃，面积和实时相加；练习题的立体图。
 * 立体图、展开图都按题目尺寸精确绘制（../shared/poly3d.js、mcube.js）。 */
const $ = (id) => document.getElementById(id);
const VIEWS = [];
const reg = (f) => { VIEWS.push(f.v || f); return f; };
const fmt = (v) => String(+v.toFixed(2));
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});
const PAIR_COLOR = ['#f7e19a', '#f6c99a', '#b9e2c4'];
const NAME_PAIR = { 上: 0, 下: 0, 前: 1, 后: 1, 左: 2, 右: 2 };
const faceDims = (k, [l, w, h]) => [[l, w], [l, h], [w, h]][NAME_PAIR[k]];

/* 第 3 页：例 4 纸盒 6 × 5 × 4 */
function initBox() {
  const D = [6, 5, 4];
  const net = MCube.cuboidNet(...D);
  const s = { k: 'all' };
  const PAIR_TXT = ['上、下两个面：长 6 cm、宽 5 cm（长方体的<b>长和宽</b>）', '前、后两个面：长 6 cm、宽 4 cm（长方体的<b>长和高</b>）', '左、右两个面：长 5 cm、宽 4 cm（长方体的<b>宽和高</b>）'];
  const f = reg(MCube.foldView($('boxv'), {
    t: 1, scale: 22, scaleFolded: 46, yaw: -28, pitch: 18, slider: $('boxT'),
    net: () => ({
      ...net,
      color: (i) => { const p = NAME_PAIR[net.names[i]]; return s.k === 'all' || +s.k === p ? PAIR_COLOR[p] : '#eef2f6'; },
      label: (i) => { const [a, b] = faceDims(net.names[i], D); return `${net.names[i]} ${a}×${b}`; },
    }),
  }));
  btnGroup($('pairK'), (k) => {
    s.k = k;
    f.refresh();
    $('pairMsg').innerHTML = k === 'all' ? '6 个面分成 3 组，每组两个面<b>完全相同</b>。' : PAIR_TXT[+k];
  });
  $('pairMsg').innerHTML = '6 个面分成 3 组，每组两个面<b>完全相同</b>。';
  $('boxPlay').addEventListener('click', () => f.play());
}

/* 第 5 页：正方体 3 dm */
function initCube() {
  const net = MCube.cuboidNet(3, 3, 3);
  reg(MCube.foldView($('cubev'), { t: 1, scale: 30, scaleFolded: 72, slider: $('cubeT'), net: () => ({ ...net, color: () => '#b9e2c4', label: () => '3×3' }) }));
}

/* 练习题的小立体图（不旋转），open: 去掉上面 */
function exBox(el, [l, w, h], txt, o = {}) {
  const v = reg(Poly3D.view(el, { w: 340, h: 200, scale: o.scale || 10, yaw: -30, pitch: 24, center: [l / 2, w / 2, h / 2], rotate: false }));
  v.add(() => [
    ...MCube.boxFaces(l, w, h).filter((f) => !(o.open && f.key === '上')).map((f) => ({ type: 'face', pts: f.pts, out: f.out, color: o.color || '#cfe7f6' })),
    { type: 'text', p: [l / 2, 0, 0], text: txt[0], cls: 'dim', dx: -20, dy: 22, top: true },
    { type: 'text', p: [l, w / 2, 0], text: txt[1], cls: 'dim', dx: 8, dy: 18, top: true },
    { type: 'text', p: [0, 0, h / 2], text: txt[2], cls: 'dim', dx: -52, top: true },
  ]);
  v.update();
}

/* 第 7 页：例 5 无盖鱼缸，点按钮装 / 拿玻璃 */
function initTank() {
  const D = [5, 3, 3.5];
  const on = { 上: true, 下: true, 前: true, 后: true, 左: true, 右: true };
  const v = reg(Poly3D.view($('tankv'), { w: 560, h: 440, scale: 62, yaw: -32, pitch: 26, center: [D[0] / 2, D[1] / 2, D[2] / 2] }));
  v.add(() => MCube.boxFaces(...D).filter((f) => on[f.key]).map((f) => {
    const [a, b] = faceDims(f.key, D);
    return { type: 'face', pts: f.pts, out: f.out, color: '#bfe3f2', label: `${f.key} ${a}×${b}` };
  }));
  const box = $('tankK');
  box.innerHTML = MCube.boxFaces(...D).map((f) => `<button type="button" class="btn solid" data-f="${f.key}">${f.key}面</button>`).join('');
  const render = () => {
    const list = Object.keys(on).filter((k) => on[k]);
    const parts = list.map((k) => { const [a, b] = faceDims(k, D); return a * b; });
    const sum = parts.reduce((a, b) => a + b, 0);
    const ok = list.length === 5 && !on.上;
    const msg = $('tankMsg');
    msg.className = `tip feedback ${ok ? 'fb-ok' : ''}`;
    msg.innerHTML = `装了 <b>${list.length}</b> 块玻璃，面积和 = ${parts.map(fmt).join(' + ') || 0} = <b>${fmt(sum)}</b> dm²${ok ? '<br><span class="ok">✓ 这就是无盖鱼缸：下、前、后、左、右 5 个面。</span>' : ''}`;
    box.querySelectorAll('[data-f]').forEach((b) => b.classList.toggle('solid', on[b.dataset.f]));
    v.update();
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-f]');
    if (!b) return;
    on[b.dataset.f] = !on[b.dataset.f];
    render();
  });
  render();
}

window.LESSON = {
  init() {
    initBox();
    initCube();
    exBox($('p1v'), [5, 4, 2.5], ['5 cm', '4 cm', '2.5 cm'], { scale: 22 });
    exBox($('p2v'), [4, 4, 4], ['4 cm', '4 cm', '4 cm'], { scale: 22 });
    initTank();
    exBox($('q1v'), [14, 10, 8], ['14 cm', '10 cm', '8 cm'], { scale: 8, open: true, color: '#cdeccf' });
    exBox($('q2v'), [10, 10, 10], ['10 cm', '10 cm', '10 cm'], { scale: 9, open: true, color: '#cdeccf' });
  },
  onRender(slide) { VIEWS.forEach((v) => { if (slide.contains(v.svg)) v.update(); }); },
};
