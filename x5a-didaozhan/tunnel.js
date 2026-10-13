'use strict';
/* 冀中的地道战 · 地道剖面示意图（不按真实比例）。四个图解页共用一张底图，各页叠加自己的标注：
 *   <div class="tn-box"> 放在 <section class="slide s-tunnel" data-part="a|b|c|d"> 里；
 *   a 第 4 段 地道的样子　b 第 5 段 出口与关口　c 第 6 段 防破坏（按钮 / 分步切换演示）　d 第 7 段 联络
 * 标注 <g data-step> 分步出现；.cap 提示条显示当前这一步对应的课文原句。
 * 画面克制：陷坑、地雷只画位置符号，不画伤亡。
 */
const Tunnel = (() => {
  const house = (x, w, cls = '') => `<g class="house ${cls}"><rect x="${x}" y="90" width="${w}" height="30"/><polygon points="${x - 6},92 ${x + w / 2},68 ${x + w + 6},92"/></g>`;
  const crops = (from, to) => Array.from({ length: Math.floor((to - from) / 14) }, (_, i) => {
    const x = from + i * 14;
    return `M${x} 120 v-14 M${x} 112 l-5 -5 M${x} 110 l5 -6`;
  }).join(' ');
  const thorns = [[100, 104], [118, 98], [138, 102], [156, 106]].map(([x, y]) =>
    `<path class="thorn" d="M${x - 12} 120 L${x - 6} ${y} L${x} 116 L${x + 5} ${y - 4} L${x + 10} 116 L${x + 15} ${y + 2} L${x + 18} 120"/>`).join('');
  const person = (x, y, s = 1, cls = '') => `<g class="person ${cls}" transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-26" r="6"/><path d="M-6 -18 h12 l2 14 h-16 z"/><path d="M-4 -4 l-3 4 M4 -4 l3 4" stroke-width="3"/></g>`;

  const BASE = `
    <defs>
      <pattern id="soilP" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#c9a274"/><path d="M5 10 h8 M25 28 h10 M15 34 h5" stroke="#b48d60" stroke-width="2"/></pattern>
    </defs>
    <rect width="1000" height="120" fill="#efe4cc"/>
    <rect y="120" width="1000" height="360" fill="url(#soilP)"/>
    <path class="crop" d="${crops(520, 880)} ${crops(966, 1000)}"/>
    ${house(250, 70)}${house(430, 70, 'hq')}${house(895, 62)}
    <ellipse class="hay" cx="380" cy="110" rx="26" ry="14"/>
    ${thorns}
    <line x1="0" y1="120" x2="1000" y2="120" stroke="#7a5a32" stroke-width="3"/>
    <!-- 枯井和暗沟（靠近出口） -->
    <rect class="well" x="30" y="120" width="30" height="310"/><rect class="rim" x="24" y="110" width="42" height="10"/>
    <polygon class="hole" points="112,196 128,204 60,262 60,246"/>
    <!-- 地道 -->
    <rect class="hole" x="110" y="120" width="34" height="40"/>
    <rect class="hole" x="110" y="158" width="880" height="46"/>
    <path class="ladder" d="M116 124 v34 M138 124 v34 M116 132 h22 M116 142 h22 M116 152 h22"/>
    <!-- 陷坑 -->
    <rect class="hole" x="165" y="122" width="50" height="28"/>
    <line class="board" x1="160" y1="121" x2="220" y2="121"/>
    <path class="grass" d="M166 120 l3 -7 l3 7 M184 120 l3 -8 l3 8 M202 120 l3 -7 l3 7"/>
    <!-- 坚固的洞 -->
    <rect class="hole" x="160" y="202" width="60" height="36" rx="6"/>
    <!-- 大洞 + 小洞 + 气孔 -->
    <rect class="hole" x="250" y="146" width="150" height="120" rx="10"/>
    ${[256, 292, 328, 364].map((x) => `<rect class="hole" x="${x}" y="262" width="30" height="28" rx="6"/>`).join('')}
    <path class="timber" d="M262 150 v116 M388 150 v116 M254 151 h142"/>
    <rect class="hole" x="376" y="120" width="8" height="28"/>
    <polygon class="beam" points="376,148 384,148 402,262 360,262"/>
    <circle class="lamp" cx="326" cy="214" r="5"/>
    <!-- 拐弯处的岔道：两条死道 -->
    <path class="hole" d="M530 202 h26 v42 h54 v26 h-80 z"/>
    <rect class="hole" x="640" y="202" width="26" height="60"/>
    <circle class="mine" cx="596" cy="257" r="6"/>
    <!-- 孑口 + 吊板 -->
    <rect x="720" y="158" width="24" height="28" fill="url(#soilP)"/>
    <rect class="plank" x="712" y="168" width="8" height="18"/>
    <text class="lw" x="900" y="188">通往别村 →</text>`;

  /* ---------- 各页标注：step 第几步出现；cap 这一步对应的原句 ---------- */
  const lead = (x1, y1, x2, y2) => `<line class="leader" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  const PARTS = {
    a: {
      intro: '读第 4 段，找一找：地道挖在哪里？有多高？里面有什么？',
      items: [
        { step: 1, cap: '村里的地道挖在街道下面，跟别村相通的地道挖在庄稼地下面。', svg: '<rect class="hi" x="110" y="158" width="880" height="46"/><text class="lb" x="600" y="420">地道：横的，竖的，直的，弯的 · 家家相连，村村相通</text>' },
        { step: 2, cap: '地道有四尺多高，个儿高的人弯着腰可以通过；地道的顶离地面三四尺，不妨碍上面种庄稼。', svg: '<path class="dim" d="M466 120 v38 M460 120 h12 M460 158 h12 M466 160 v44 M460 204 h12"/><text class="lb" x="476" y="146">顶离地面三四尺</text><text class="lw" x="476" y="188">四尺多高，弯着腰可以通过</text>' },
        { step: 3, cap: '地道里每隔一段距离就有一个大洞，洞顶用木料撑住，很牢靠。……一个大洞容得下一百来人，最大的能容二百多人。', svg: '<rect class="hi" x="250" y="146" width="150" height="120" rx="10"/><text class="lb" x="236" y="346">大洞：洞顶用木料撑住，很牢靠</text><text class="lb" x="236" y="370">容得下一百来人，住上三五天不成问题</text>' },
        { step: 4, cap: '大洞四壁又挖了许多小洞，有的住人，有的拴牲口，有的搁东西，有的作厕所。', svg: '<rect class="hi" x="254" y="260" width="142" height="32" rx="6"/><text class="lb" x="236" y="314">小洞：住人 · 拴牲口 · 搁东西 · 作厕所</text>' },
        { step: 5, cap: '洞里有通到地面的气孔，从气孔里还能漏下光线来。气孔的口子都开在隐蔽的地方，敌人很难发现。', svg: `<circle class="hi" cx="380" cy="118" r="30"/>${lead(470, 48, 400, 100)}<text class="lb" x="470" y="44">气孔：通到地面，漏下光线；口子开在隐蔽的地方</text>` },
      ],
    },
    b: {
      intro: '读第 5 段，从外到里看：敌人想进地道，要过几道关？',
      items: [
        { step: 1, cap: '地道的出口也开在隐蔽的地方，外面堆满荆棘。', svg: `<circle class="hi" cx="127" cy="112" r="34"/>${lead(150, 34, 130, 80)}<text class="lb" x="40" y="30">出口：开在隐蔽的地方，外面堆满荆棘</text>` },
        { step: 2, cap: '有的还在旁边挖一个陷坑……上面用木板虚盖着，板上铺些草。', svg: `<rect class="hi" x="160" y="114" width="60" height="40"/>${lead(330, 62, 205, 112)}<text class="lb" x="210" y="58">陷坑：上面用木板虚盖着，板上铺些草</text>` },
        { step: 3, cap: '在地道里，离出口不远的地方挖几个特别坚固的洞，民兵拿着武器在洞里警戒。', svg: `<rect class="hi" x="160" y="202" width="60" height="36" rx="6"/>${person(190, 236, .9)}${lead(190, 240, 190, 292)}<text class="lb" x="110" y="312">坚固的洞：民兵在洞里警戒</text>` },
        { step: 4, cap: '拐弯的地方挖一些岔道，叫“迷惑洞”，敌人万一进来了，分不清哪条是死道，哪条是活道。', svg: '<path class="hi" d="M530 202 h26 v42 h54 v26 h-80 z M640 202 h26 v60 h-26 z"/><text class="tg" x="560" y="296">死道</text><text class="tg" x="644" y="282">死道</text><text class="lw" x="566" y="188">活道 →</text><text class="lb" x="480" y="350">岔道叫“迷惑洞”：分不清死道、活道</text>' },
        { step: 5, cap: '原来地道里每隔一段就有个很窄的“孑口”，只能容一个人爬过去。只要一个人拿一根木棒，就可以把“孑口”守住。', svg: `<circle class="hi" cx="732" cy="194" r="20"/>${lead(740, 40, 734, 172)}<text class="lb" x="600" y="30">孑口：只能容一个人爬过去 · 一夫当关，万夫莫开</text>` },
      ],
    },
    c: {
      intro: '敌人尝到了地道的厉害，想方设法来破坏。点一点：火攻、水攻、毒气攻，怎么办？',
      modes: {
        fire: { cap: '火攻 → 洞口准备着土和沙，可以用来灭火。', svg: '<g class="fx fx-fire"><path class="flame" d="M112 120 q6 -30 14 -14 q4 -22 12 -6 q6 -18 8 20 z"/><path class="sand" d="M112 204 q16 -22 32 0 z"/><text class="lb" x="40" y="40">火攻 → 洞口准备着土和沙，用来灭火</text></g>' },
        water: { cap: '水攻 → 把地道跟枯井暗沟连接起来，敌人放水的时候，水从洞口进来，就流到枯井暗沟里去了。', svg: '<g class="fx fx-water"><rect class="w1" x="110" y="120" width="34" height="84"/><polygon class="w2" points="112,196 128,204 60,262 60,246"/><rect class="w3" x="30" y="300" width="30" height="130"/><text class="lb" x="80" y="40">水攻 → 水从洞口进来，流到枯井暗沟里去了</text></g>' },
        gas: { cap: '毒气攻 → “孑口”上装着吊板，如果敌人放毒气，就把吊板放下来挡住，不让毒气往里透。', svg: '<g class="fx fx-gas"><g class="cloud"><circle cx="150" cy="182" r="16"/><circle cx="172" cy="176" r="14"/><circle cx="190" cy="186" r="13"/><circle cx="130" cy="188" r="12"/></g><circle class="hi" cx="732" cy="194" r="22"/><text class="lb" x="460" y="40">毒气攻 → 放下孑口上的吊板，挡住毒气</text></g>' },
        move: { cap: '任敌人想出什么毒辣的法子也不怕，因为各个村子的地道是相通的，大不了转移到旁的村子去。', svg: '<g class="fx fx-move"><g class="walkers"><circle cx="0" cy="190" r="6"/><circle cx="-26" cy="190" r="6"/><circle cx="-52" cy="190" r="6"/></g><text class="lb" x="520" y="40">各个村子的地道是相通的 → 转移到旁的村子去</text></g>' },
      },
    },
    d: {
      intro: '读第 7 段的第一句：这一段要讲什么？',
      items: [
        { step: 1, cap: '民兵指挥部派出一些人分布在各处，发现了敌情就吆喝起来，一个接一个，一直传到指挥部里。老百姓管这种吆喝叫“无线电”。', svg: `<text class="lb" x="440" y="62">指挥部</text>${[940, 800, 640].map((x, i) => `${person(x, 120, 1, 'dark')}<path class="call" style="animation-delay:${i * .6}s" d="M${x - 12} 90 q-8 8 0 16 M${x - 20} 86 q-12 12 0 24"/>`).join('')}<text class="lb" x="500" y="30">“无线电”：吆喝起来，一个接一个，传到指挥部</text>` },
        { step: 2, cap: '地道里面可就用“有线电”了，一根铁丝牵住一个小铜铃，这儿一拉，那儿就响，拉几下表示什么意思是早就约好了的。', svg: `<path class="wire" d="M700 162 H392"/>${person(704, 202, .9)}<g class="bell"><path d="M384 162 v6 M376 182 q8 -18 16 0 z"/><circle cx="384" cy="184" r="2.5"/></g><text class="lb" x="420" y="400">“有线电”：一根铁丝牵住一个小铜铃，这儿一拉，那儿就响</text>` },
      ],
    },
  };
  const MODE_ORDER = ['fire', 'water', 'gas', 'move'];

  function build(box, key) {
    const part = PARTS[key];
    const overlay = part.items
      ? part.items.map((it) => `<g data-step="${it.step}">${it.svg}</g>`).join('')
      : Object.values(part.modes).map((m) => m.svg).join('');
    box.innerHTML = `<svg class="tn" viewBox="0 0 1000 480">${BASE}${overlay}</svg>`;
  }

  function setMode(slide, mode) {
    const part = PARTS.c;
    slide.querySelector('.tn').dataset.mode = mode || '';
    slide.querySelectorAll('[data-mode]').forEach((b) => { if (b.tagName === 'BUTTON') b.classList.toggle('solid', b.dataset.mode === mode); });
    slide.querySelector('.cap').textContent = mode ? part.modes[mode].cap : part.intro;
  }

  function init() {
    document.querySelectorAll('.s-tunnel').forEach((slide) => {
      build(slide.querySelector('.tn-box'), slide.dataset.part);
      if (slide.dataset.part === 'c') {
        slide.addEventListener('click', (e) => {
          const b = e.target.closest('button[data-mode]');
          if (b) setMode(slide, b.dataset.mode);
        });
      }
    });
  }

  function render(slide, step) {
    if (!slide.classList.contains('s-tunnel')) return;
    const key = slide.dataset.part;
    if (key === 'c') { setMode(slide, MODE_ORDER[Math.min(step, MODE_ORDER.length) - 1]); return; }
    const hit = PARTS[key].items.filter((it) => it.step <= step).pop();
    slide.querySelector('.cap').textContent = hit ? hit.cap : PARTS[key].intro;
  }

  return { init, render };
})();
