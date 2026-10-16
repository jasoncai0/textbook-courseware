'use strict';
/* 七下 12.1 定义与命题 · 本课互动：长方体里“不相交也不平行”的两条棱、命题拆解台（切出条件 | 结论，再判真假）、
 * 两个假命题的小实验（积为 0；有公共顶点的两个角）。通用部分见 ../shared/math.js、mcheck.js、mgeo.js；图形按坐标计算。 */
const { tex, fmt } = MathKit;
const { dir, arc } = Geo;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;

/* ---------- 第 3 页：长方体（正交投影，绕竖直轴转） ---------- */
function initCuboid() {
  const [W, D, H] = [4, 2.4, 2.5];
  const V = {
    A: [0, 0, H], B: [W, 0, H], C: [W, D, H], D: [0, D, H],
    E: [0, 0, 0], F: [W, 0, 0], G: [W, D, 0], H: [0, D, 0],
  };
  const EDGES = ['AB', 'BC', 'CD', 'DA', 'EF', 'FG', 'GH', 'HE', 'AE', 'BF', 'CG', 'DH'];
  const PITCH = 28 * RAD; // 俯视角
  const s = { yaw: -28, spin: false };
  const proj = ([x, y, z]) => {
    const [px, py, pz] = [x - W / 2, y - D / 2, z - H / 2];
    const c = Math.cos(s.yaw * RAD);
    const n = Math.sin(s.yaw * RAD);
    const x1 = px * c - py * n;
    const y1 = px * n + py * c;
    return [x1, pz * Math.cos(PITCH) + y1 * Math.sin(PITCH)];
  };
  const b = Geo.board($('cuboid'), { x: [-3.3, 3.3], y: [-2.1, 2.1], w: 520 });
  // 离观察者最远的顶点被挡住，从它出发的三条棱画虚线
  const depth = ([x, y, z]) => {
    const y1 = (x - W / 2) * Math.sin(s.yaw * RAD) + (y - D / 2) * Math.cos(s.yaw * RAD);
    return -y1 * Math.cos(PITCH) + (z - H / 2) * Math.sin(PITCH);
  };
  const hidden = () => Object.keys(V).reduce((m, k) => (depth(V[k]) < depth(V[m]) ? k : m), 'A');
  EDGES.forEach((e) => {
    const hot = e === 'AB' ? ' hot-a' : e === 'CG' ? ' hot-b' : '';
    const node = b.seg(() => [proj(V[e[0]]), proj(V[e[1]])], { cls: `gl thin-l${hot}` });
    const prev = b.onUpdate;
    b.onUpdate = () => { node.classList.toggle('hid', e.includes(hidden())); if (prev) prev(); };
  });
  Object.keys(V).forEach((k) => b.text(() => proj(V[k]), k, { dx: -6, dy: V[k][2] ? -6 : 18 }));
  let last = 0;
  const tick = (t) => {
    if (!s.spin) return;
    if (last) s.yaw += (t - last) * 0.03;
    last = t;
    b.update();
    requestAnimationFrame(tick);
  };
  $('cubBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-v]');
    if (!btn) return;
    s.spin = btn.dataset.v === '1' ? !s.spin : false;
    if (btn.dataset.v === '0') s.yaw = -28;
    last = 0;
    $('cubBtns').querySelector('[data-v="1"]').textContent = s.spin ? '停一停' : '转一转';
    b.update();
    if (s.spin) requestAnimationFrame(tick);
  });
  b.update();
}

/* ---------- 命题拆解台 ----------
 * 每个词块：[文字, 角色]，角色 c = 条件、r = 结论、x = 连接词（如果 / 那么 / ，）。
 * 在第 k 个词块前切开：条件词块全在左、结论词块全在右，就算切对。 */
const SP1 = [
  { no: '(1)', w: [['如果', 'x'], ['$a$、$b$ 两数的积', 'c'], ['为 0', 'c'], ['，那么', 'x'], ['$a$、$b$ 两数', 'r'], ['都为 0', 'r']],
    cond: '$a$、$b$ 两数的积为 0', concl: '$a$、$b$ 两数都为 0', truth: false,
    why: '例如 $a=0$，$b=3$：积为 0，但 $b$ 不为 0．（第 6 页可以自己找）' },
  { no: '(2)', w: [['如果', 'x'], ['两个角', 'c'], ['互为补角', 'c'], ['，那么', 'x'], ['这两个角的和', 'r'], ['是 $180^\\circ$', 'r']],
    cond: '两个角互为补角', concl: '这两个角的和是 $180^\\circ$', truth: true, why: '这正是补角的定义．' },
  { no: '(3)', w: [['两直线', 'c'], ['平行', 'c'], ['，', 'x'], ['同旁内角', 'r'], ['互补', 'r']],
    cond: '两直线平行', concl: '同旁内角互补', truth: true, why: '这是 7.2 学过的平行线的性质．' },
  { no: '(4)', w: [['两条直线', 'c'], ['相交', 'c'], ['，', 'x'], ['只有', 'r'], ['一个交点', 'r']],
    cond: '两条直线相交', concl: '它们只有一个交点', truth: true, why: '若有两个交点，过这两点就有两条直线，与“两点确定一条直线”矛盾．' },
  { no: '(5)', w: [['有', 'c'], ['公共顶点', 'c'], ['的', 'c'], ['两个角', 'c'], ['是', 'x'], ['对顶角', 'r']],
    cond: '两个角有公共顶点', concl: '这两个角是对顶角', truth: false,
    why: '有公共顶点的两个角，边不一定互为反向延长线——第 6 页拖一拖就能看到．' },
];
const SP2 = [
  { no: '(1)', w: [['如果', 'x'], ['$a\\lt0$', 'c'], ['，', 'x'], ['$b\\lt0$', 'c'], ['，那么', 'x'], ['$a+b\\lt0$', 'r']],
    cond: '$a\\lt0$，$b\\lt0$', concl: '$a+b\\lt0$', truth: true, why: '两个负数相加，取负号，并把绝对值相加，结果是负数．' },
  { no: '(2)', w: [['如果', 'x'], ['$n\\lt1$', 'c'], ['，那么', 'x'], ['$n^2-1\\lt0$', 'r']],
    cond: '$n\\lt1$', concl: '$n^2-1\\lt0$', truth: false, why: '取 $n=-2$：$n\\lt1$，但 $n^2-1=3\\gt0$．' },
  { no: '(3)', w: [['同角', 'c'], ['的', 'c'], ['补角', 'c'], ['相等', 'r']],
    cond: '两个角是同一个角的补角', concl: '这两个角相等', truth: true, why: '七上 6.3：同角（等角）的补角相等．' },
  { no: '(4)', w: [['直角', 'c'], ['都', 'x'], ['相等', 'r']],
    cond: '两个角都是直角', concl: '这两个角相等', truth: true, why: '直角都等于 $90^\\circ$．' },
];

function okCut(item, k) {
  return item.w.every(([, r], i) => (r === 'c' ? i < k : r === 'r' ? i >= k : true));
}

function initSplitter(host, items) {
  const firstOk = (it) => it.w.findIndex((_, k) => k > 0 && okCut(it, k));
  const s = { i: 0, cut: null, done: items.map(() => ({ cut: false, judged: null })) };
  host.innerHTML = `<div class="btns sp-tabs"></div><div class="sp-sent"></div><p class="tip feedback sp-msg"></p>
    <div class="sp-out"></div><div class="sp-judge" hidden><span>这个判断正确吗？</span><button type="button" class="btn" data-t="1">正确</button><button type="button" class="btn" data-t="0">不正确</button></div>
    <p class="sp-why"></p>`;
  host.setAttribute('data-noswipe', '');
  const q = (c) => host.querySelector(c);
  function render() {
    const it = items[s.i];
    const st = s.done[s.i];
    q('.sp-tabs').innerHTML = items.map((x, i) => `<button type="button" class="btn${i === s.i ? ' solid' : ''}${s.done[i].judged !== null ? ' fin' : ''}" data-i="${i}">${x.no}</button>`).join('');
    const parts = [];
    it.w.forEach(([t, r], k) => {
      if (k > 0) parts.push(`<button type="button" class="sp-gap${st.cut && s.cut === k ? ' on' : ''}" data-k="${k}" aria-label="在这里切开">│</button>`);
      const side = st.cut ? (r === 'x' ? 'x' : k < s.cut ? 'c' : 'r') : '';
      parts.push(`<span class="sp-w ${side ? `sp-${side}` : ''}">${t}</span>`);
    });
    q('.sp-sent').innerHTML = parts.join('');
    const msg = q('.sp-msg');
    if (!st.cut) {
      msg.className = 'tip feedback sp-msg';
      msg.innerHTML = '在句子里点一条竖线，把它切成“条件 | 结论”两部分。';
      q('.sp-out').innerHTML = '';
    } else {
      msg.className = 'tip feedback sp-msg fb-ok';
      msg.innerHTML = `条件：<b class="c-cond">${it.cond}</b>　结论：<b class="c-concl">${it.concl}</b>`;
      q('.sp-out').innerHTML = `<p class="sp-if">如果<span class="c-cond">${it.cond}</span>，那么<span class="c-concl">${it.concl}</span>．</p>`;
    }
    q('.sp-judge').hidden = !st.cut;
    q('.sp-judge').querySelectorAll('[data-t]').forEach((bt) => {
      const pickT = st.judged !== null && bt.dataset.t === (st.judged ? '1' : '0');
      const right = (bt.dataset.t === '1') === it.truth;
      bt.className = `btn${pickT ? (right ? ' ok' : ' no') : ''}`;
    });
    const why = q('.sp-why');
    if (st.judged === null) why.innerHTML = '';
    else if (st.judged === it.truth) why.innerHTML = `<b class="${it.truth ? 'tv' : 'fv'}">${it.truth ? '真命题' : '假命题'}</b>：${it.why}`;
    else why.innerHTML = '再想想：条件成立时，结论<b>一定</b>成立吗？试着举个例子．';
    tex(host);
  }
  host.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-i]');
    const gap = e.target.closest('.sp-gap');
    const tj = e.target.closest('[data-t]');
    const st = s.done[s.i];
    if (tab) {
      s.i = +tab.dataset.i;
      s.cut = s.done[s.i].cut ? firstOk(items[s.i]) : null;
      render();
    } else if (gap) {
      const k = +gap.dataset.k;
      if (okCut(items[s.i], k)) {
        st.cut = true;
        s.cut = k;
        render();
      } else {
        const msg = q('.sp-msg');
        msg.className = 'tip feedback sp-msg fb-warn';
        msg.innerHTML = '这样切不对：条件要说完整，结论里不能混进条件．再找找“如果……那么……”的分界．';
        gap.classList.add('bad');
        setTimeout(() => gap.classList.remove('bad'), 400);
      }
    } else if (tj && st.cut) {
      st.judged = tj.dataset.t === '1';
      if (st.judged !== items[s.i].truth) {
        render();
        st.judged = null; // 判错可以重判
        return;
      }
      render();
    }
  });
  render();
}

/* ---------- 第 6 页：(1) 积为 0 ---------- */
function initAB() {
  const s = { a: 2, b: 3 };
  const upd = () => {
    $('abAV').textContent = s.a; $('abBV').textContent = s.b;
    const p = s.a * s.b;
    const msg = $('abMsg');
    const cond = p === 0;
    const concl = s.a === 0 && s.b === 0;
    msg.className = `tip feedback ${cond && !concl ? 'fb-warn' : cond ? 'fb-ok' : ''}`;
    msg.innerHTML = !cond
      ? `$ab=${p}\\ne0$：条件不成立，这组数说明不了什么．`
      : concl ? '$ab=0$，且 $a$、$b$ 都为 0：条件、结论都成立．再找找别的．'
        : `$ab=${s.a}\\times${s.b < 0 ? `(${s.b})` : s.b}=0$，条件成立；但 $a$、$b$ <b>不都为 0</b>——结论不成立！所以 (1) 是假命题．`;
    tex(msg);
  };
  MathKit.slider($('abA'), (v) => { s.a = v; upd(); });
  MathKit.slider($('abB'), (v) => { s.b = v; upd(); });
}

/* ---------- 第 6 页：(5) 有公共顶点的两个角 ---------- */
function initVertex() {
  const O = [0, 0];
  const R = 2.2;
  const [A, B] = [dir(150), dir(210)].map((u) => [u[0] * R, u[1] * R]);
  const VERT = 330; // ∠COD 与 ∠AOB 成对顶角时 OC 的方向
  const s = { c: 20 };
  const at = (d) => { const u = dir(d); return [u[0] * R, u[1] * R]; };
  const C = () => at(s.c);
  const D = () => at(s.c + 60);
  const b = Geo.board($('vtx'), { x: [-2.9, 2.9], y: [-2.5, 2.5], w: 420 });
  [A, B].forEach((P) => b.seg([O, P], { cls: 'gl c-b' }));
  b.seg(() => [O, C()], { cls: 'gl c-a' });
  b.seg(() => [O, D()], { cls: 'gl c-a' });
  arc(b, O, A, B, { r: 0.55, label: '1' });
  arc(b, O, C, D, { r: 0.55, label: '2' });
  [[A, 'A'], [B, 'B']].forEach(([P, n]) => b.text(P, n, { dx: -16, dy: 6 }));
  b.text(C, 'C', { dx: 6, dy: 6 });
  b.text(D, 'D', { dx: 6, dy: 6 });
  b.text(O, 'O', { dx: -4, dy: 22 });
  b.drag(D, (x, y) => {
    let d = Math.round(Math.atan2(y, x) / RAD) - 60;
    d = ((d % 360) + 360) % 360;
    if (Math.abs(d - VERT) < 4) d = VERT;
    s.c = d;
  });
  b.onUpdate = () => {
    const msg = $('vtxMsg');
    const v = s.c === VERT;
    msg.className = `tip feedback ${v ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = v
      ? '$OC$、$OD$ 恰好是 $OB$、$OA$ 的反向延长线：$\\angle1$、$\\angle2$ 是对顶角．'
      : '$\\angle1$ 与 $\\angle2$ 有公共顶点 $O$，但边<b>不是</b>互为反向延长线——不是对顶角．条件成立、结论不成立．';
    tex(msg);
  };
  b.update();
}

window.LESSON = {
  init() {
    initCuboid();
    initSplitter($('sp1'), SP1);
    initSplitter($('sp2'), SP2);
    initAB();
    initVertex();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
