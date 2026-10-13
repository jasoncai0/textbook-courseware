'use strict';
/* 白杨礼赞 · 本课数据。本课独有：欲扬先抑感情曲线、“树—人”象征对照 */

/* ---------- 感情曲线：x 段落，y 0~100 感情高低；step 第几步画出；hymn 赞美句 ---------- */
const PTS = [
  { p: 1, y: 82, t: '我赞美白杨树！', step: 1, hymn: true, dx: 10, dy: -16 },
  { p: 2, y: 62, t: '雄壮 · 伟大', step: 2, dx: 54, dy: 4 },
  { p: 2.6, y: 18, t: '单调 · 倦怠（抑）', step: 2, low: true, dx: 0, dy: 26 },
  { p: 3, y: 80, t: '惊奇地叫了一声', step: 3, dx: -84, dy: -8 },
  { p: 4, y: 86, t: '实在是不平凡的一种树', step: 3, hymn: true, dx: -10, dy: -18 },
  { p: 5, y: 88, t: '力争上游（形）', step: 4, dx: 0, dy: 30 },
  { p: 6, y: 88, t: '决不是平凡的树', step: 4, hymn: true, dx: -6, dy: -18 },
  { p: 6.8, y: 42, t: '也许你要说它不美（抑）', step: 5, low: true, dx: -40, dy: 28 },
  { p: 7.3, y: 92, t: '伟丈夫 · 四个难道', step: 5, dx: 4, dy: -20 },
  { p: 8, y: 94, t: '白杨不是平凡的树（象征）', step: 6, hymn: true, dx: 34, dy: 34 },
  { p: 9, y: 100, t: '我要高声赞美白杨树！', step: 6, hymn: true, dx: -80, dy: -16 },
];
const CX = (p) => 60 + (p - 1) * 98;
const CY = (y) => 290 - y * 2.4;
(function buildCurve() {
  const svg = document.getElementById('curve');
  let html = '<rect x="0" y="0" width="900" height="330" rx="12" fill="#f8f4ea"/>';
  html += '<line x1="40" y1="290" x2="880" y2="290" stroke="#b9ad92"/><text class="t-s" x="868" y="284">段落</text><text class="t-s" x="8" y="40">感情</text>';
  for (let p = 1; p <= 9; p += 1) html += `<text class="t-s t-c" x="${CX(p)}" y="310">${p}</text>`;
  html += '<rect x="100" y="210" width="110" height="80" fill="#c9d6dd" opacity=".45"/><rect x="620" y="170" width="70" height="120" fill="#c9d6dd" opacity=".45"/>';
  let prev = null;
  [1, 2, 3, 4, 5, 6].forEach((s) => {
    const pts = PTS.filter((q) => q.step === s);
    const chain = prev ? [prev, ...pts] : pts;
    const d = chain.map((q, i) => `${i ? 'L' : 'M'}${CX(q.p)} ${CY(q.y)}`).join(' ');
    html += `<g data-step="${s}"><path class="draw" pathLength="1" d="${d}" stroke="#8a3b22" stroke-width="4" fill="none" stroke-linejoin="round"/>`;
    pts.forEach((q) => {
      const x = CX(q.p); const y = CY(q.y);
      const mark = q.hymn ? `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" transform="rotate(45 ${x} ${y})" fill="#c0392b"/>` : `<circle cx="${x}" cy="${y}" r="7" fill="${q.low ? '#5d7c8c' : '#8a3b22'}"/>`;
      html += `${mark}<text class="t-m t-c" x="${x + q.dx}" y="${y + q.dy}" fill="${q.low ? '#3f5f6e' : '#3d2c22'}">${q.t}</text>`;
    });
    html += '</g>';
    prev = pts[pts.length - 1];
  });
  html += '<text class="t-s" x="112" y="282" fill="#3f5f6e">抑</text><text class="t-s" x="632" y="282" fill="#3f5f6e">抑</text>';
  svg.innerHTML = html;
}());

/* ---------- 树—人对照：第 n 步亮起树上第 n 个部位 ---------- */
function updateTree(slide, step) {
  if (!slide.classList.contains('s-tree')) return;
  for (let i = 1; i <= 5; i += 1) slide.querySelector(`#pp${i}`).classList.toggle('hl', step === i || step >= 6);
  slide.querySelector('#poplar').classList.toggle('focus', step >= 1 && step <= 5);
}

const POEMS = {
  by68: {
    title: '白杨礼赞（第 6—8 段）', author: '茅盾',
    lines: [
      '这就是白杨树，西北极普通的一种树，然而决不是平凡的树！',
      '它没有婆娑的姿态，没有屈曲盘旋的虬枝。也许你要说它不美。',
      '如果美是专指“婆娑”或“旁逸斜出”之类而言，那么，白杨树算不得树中的好女子。',
      '但是它伟岸，正直，朴质，严肃，也不缺乏温和，更不用提它的坚强不屈与挺拔，它是树中的伟丈夫！',
      '当你在积雪初融的高原上走过，看见平坦的大地上傲然挺立这么一株或一排白杨树，难道你就觉得它只是树？',
      '难道你就不想到它的朴质，严肃，坚强不屈，至少也象征了北方的农民？',
      '难道你竟一点也不联想到，在敌后的广大土地上，到处有坚强不屈，就像这白杨树一样傲然挺立的守卫他们家乡的哨兵？',
      '难道你又不更远一点想到，这样枝枝叶叶靠紧团结，力求上进的白杨树，宛然象征了今天在华北平原纵横决荡，用血写出新中国历史的那种精神和意志？',
      '白杨不是平凡的树。它在西北极普遍，不被人重视，就跟北方的农民相似；它有极强的生命力，磨折不了，压迫不倒，也跟北方的农民相似。',
      '我赞美白杨树，就因为它不但象征了北方的农民，尤其象征了今天我们民族解放斗争中所不可缺的朴质、坚强、力求上进的精神。',
    ].map((t) => ({ t })),
    notes: {},
  },
};
Poem.render(POEMS);

const MOMENTS = [
  {
    name: '写一种植物', pic: 'fengxue',
    prompt: '选一种你熟悉的植物（如竹、梅、小草、蒲公英），先写它的形，再写它的神，最后点出它象征的人或精神。',
    hint: '物与人要有相似点：竹子“有节、空心、四季常青”，可以象征有气节、虚心、坚韧的人。',
    example: '校门口的那排香樟，从不开引人注目的花，叶子却四季常绿。夏天它撑开浓荫，冬天也不肯落尽叶子，新叶长出来，才悄悄让老叶落下。我常想，它多像我们学校的门卫张师傅：天天站在那里，没人特别注意他，可风里雨里，他总在。',
  },
  {
    name: '写一件物品', pic: 'nongmin',
    prompt: '选一件普通的物品（如路灯、粉笔、旧板凳），写出它“普通”又“不平凡”的地方。',
    hint: '学“极普通……然而决不是平凡”的句式；可以用一两个反问把感情推高。',
    example: '粉笔是最普通的东西，白白的一小截，一盒才几块钱。然而它决不是平凡的：它一点点磨短，把字留在黑板上，把知识留在我们心里。难道你看着讲台上那一堆粉笔头，就只觉得它们是粉笔？难道你不想到那些在讲台前一站就是几十年的老师？',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    Poem.init();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateTree(slide, step);
  },
};
