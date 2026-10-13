'use strict';
/* 一棵小桃树 · 本课数据与专属互动：双线命运对照、称呼计数、旁批对话 */

/* 双线命运：tree / me 是两条线的高低（0 低谷 ~ 1 高处），q 是课文原句 */
const TWIN = [
  { stage: '埋核', tree: '桃核埋在墙角，“蓄着我的梦”', me: '孩子，想做一个“幸福一生”的梦', t: 0.55, m: 0.75,
    q: '我却无论如何不能安睡，想这甜甜的梦是做不成了，又不甘心不做，就爬起来，将桃核埋在院子角落的土里，想让它在那儿蓄着我的梦。' },
  { stage: '发芽', tree: '瘦瘦的，黄黄的；人说“没出息”', me: '执着地偏要它开花结果', t: 0.35, m: 0.8,
    q: '大家都笑话它，奶奶也说：“这种桃树是没出息的……”我却不大相信，执着地偏要它将来开花结果哩。' },
  { stage: '长大', tree: '无人理会，默默地长上来', me: '“我的梦是绿色的”', t: 0.5, m: 0.85,
    q: '它长得很慢，一个春天，才长上二尺来高，样子也极猥琐。但我却十分地高兴了：它是我的，它是我的梦种儿长的。' },
  { stage: '离家', tree: '被猪拱折，被嫌想砍，奶奶护着', me: '进城，血气方刚；后觉渺小、幼稚', t: 0.25, m: 0.45,
    q: '走出了山，来到城里，我才知道我的渺小……但是，我慢慢发现我的幼稚，我的天真了，人世原来有人世的大书，我却连第一行文字还读不懂呢。' },
  { stage: '重逢', tree: '弯弯的身子，已有院墙高', me: '心境垂垂暮老；奶奶去世，懊丧', t: 0.55, m: 0.18,
    q: '这时候，奶奶也去世了，真是祸不单行……它竟然还在长着，弯弯的身子，努力撑着的枝条，已经有院墙高了。' },
  { stage: '开花', tree: '太白、太淡，苦涩涩地笑', me: '忧伤：这莫不是我梦的精灵？', t: 0.45, m: 0.3,
    q: '却开得太白了，太淡了……像是患了重病的少女，苍白白的脸，又偏苦涩涩地笑着。我忍不住几分忧伤，泪珠儿又要下来了。' },
  { stage: '风雨', tree: '千百次俯下，又挣扎起来', me: '心里喊着奶奶', t: 0.15, m: 0.12,
    q: '雨还在下着，我的小桃树千百次地俯下身去，又千百次地挣扎起来……（上一段：我心里喊着我的奶奶。）' },
  { stage: '花苞', tree: '顶端一个欲绽的花苞，像指示灯', me: '稍稍安慰，盼它明日开放', t: 0.75, m: 0.65,
    q: '竟还保留着一个欲绽的花苞……像风浪里航道上的指示灯，闪着时隐时现的嫩黄的光，嫩红的光。我心里稍稍有些安慰了。' },
];

const PANGPI = [
  { at: '第 1—2 段', text: '今天的黄昏，雨下得这般大……看我的小桃树在风雨里哆嗦。', note: '寻常的情景，不寻常的情感。', ans: '一场春雨、一树落花本是寻常事，作者却“千般万般地无奈何”——因为这棵桃树连着他的梦、他的童年和奶奶，所以情感格外深。' },
  { at: '第 4 段', text: '大家都笑话它，奶奶也说：“这种桃树是没出息的……”', note: '课文中一些描写反复出现，比如多次描写小桃树“没出息”。散文中这类地方，往往寄托着深意，要仔细体会。', ans: '“没出息”说的是桃树，也像在说出身山村、不被看好的“我”。反复写，是在为后文桃树（和“我”）的坚韧不屈蓄势。' },
  { at: '第 6 段', text: '那家乡的土院，那土院里的小桃树便再没有去想了。', note: '是什么使“我”遗忘了小桃树？', ans: '进城后天地大了，“我”血气方刚，一心要“轰轰烈烈地干一番事业”，忙于奋斗，就把儿时的梦和小桃树抛在了脑后。' },
  { at: '第 8 段', text: '可我的小桃树……却开得太白了，太淡了……又偏苦涩涩地笑着。', note: '“蓄着我的梦”的桃核长成了树，而且真的开了花。作者仅仅在写花吗？', ans: '不仅写花。花开得白、淡、单薄，像生病的少女苦笑——这也是作者当时失意、忧伤的心境：梦虽然开了花，却开得那样艰难。' },
  { at: '第 12 段', text: '然而，就在那俯地的刹那，我突然看见那树的顶端……竟还保留着一个欲绽的花苞。', note: '“我”的情感在这里来了一个转折，你读出来了吗？', ans: '“然而”一转，从忧伤转为安慰、感激。花苞在风雨中“没有掉下去”，给了“我”希望：只要梦还在，就有开花的一天。' },
];

/* 双线：结构在顶层生成（deck.js 在加载时统计分步，必须先有 data-step） */
document.getElementById('twinGrid').innerHTML = TWIN.map((d, i) => `<button type="button" class="tw-col" data-step="${i + 1}" data-i="${i}">
    <span class="tw-tree">${d.tree}</span><b class="tw-stage">${d.stage}</b><span class="tw-me">${d.me}</span></button>`).join('');

const X = (i) => (i + 0.5) * (800 / TWIN.length);
const Y = (v) => 112 - v * 104;
function linePath(key, n) {
  return TWIN.slice(0, n).map((d, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(d[key]).toFixed(1)}`).join(' ');
}

function showTwin(i) {
  document.querySelectorAll('.tw-col').forEach((c, k) => c.classList.toggle('active', k === i));
  const d = TWIN[i];
  document.getElementById('twinQuote').innerHTML = `<b>${d.stage}：</b>${d.q}`;
}

function renderTwin(step) {
  const n = Math.max(0, Math.min(TWIN.length, step));
  document.getElementById('lineTree').setAttribute('d', linePath('t', n));
  document.getElementById('lineMe').setAttribute('d', linePath('m', n));
  if (n) showTwin(n - 1);
}

function initPangpi() {
  const box = document.getElementById('ppList');
  box.innerHTML = PANGPI.map((p) => `<div class="pp">
      <div class="pp-text"><small>${p.at}</small>${p.text}</div>
      <div class="pp-note"><span>旁批</span>${p.note}<button type="button" class="btn">我的理解</button><p class="pp-ans" hidden>${p.ans}</p></div>
    </div>`).join('');
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('.pp-note .btn');
    if (btn) btn.nextElementSibling.hidden = !btn.nextElementSibling.hidden;
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initPangpi();
    document.getElementById('twinGrid').addEventListener('click', (e) => {
      const col = e.target.closest('.tw-col');
      if (col && col.classList.contains('on')) showTwin(+col.dataset.i);
    });
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-twin')) renderTwin(step);
    if (slide.classList.contains('s-count')) document.getElementById('countNum').textContent = Math.min(step, 7);
  },
};
