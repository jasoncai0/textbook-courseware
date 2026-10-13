'use strict';
/* 中国人失掉自信力了吗 · 本课数据与互动：驳论文结构图（点段落 → 点层）、中国的脊梁卡片、读写迁移。通用部分见 ../shared/narrative.js */

/* 四层结构：对方观点 → 驳论据 → 驳论证 → 立论 */
const LAYERS = [
  { name: '对方观点', sub: '树靶子', cls: 'l0' },
  { name: '驳论据', sub: '事实只证明失掉了“他信力”', cls: 'l1' },
  { name: '驳论证', sub: '推不出“失掉自信力”：现在是“自欺力”', cls: 'l2' },
  { name: '立论', sub: '我们有并不失掉自信力的中国人在', cls: 'l3' },
];

/* 全文 9 段（与课本逐字一致；dot 为加点语句） L：所属层，why：放对后显示的说明 */
const PARAS = [
  { L: 0, why: '对方的论据：三个“事实”', t: '从公开的文字上看起来：两年以前，我们总自夸着“地大物博”，是事实；不久就不再自夸了，只希望着国联，也是事实；现在是既不夸自己，也不信国联，<u>改为一味求神拜佛，怀古伤今了</u>——却也是事实。' },
  { L: 0, why: '对方的论点', t: '于是有人慨叹曰：中国人失掉自信力了。' },
  { L: 1, why: '信地、信物、信国联，都不是信自己——只能说失掉了“他信力”', t: '如果单据这一点现象而论，自信其实是早就失掉了的。先前信“地”，信“物”，后来信“国联”，都没有相信过“自己”。假使这也算一种“信”，那也只能说中国人曾经有过“他信力”，自从对国联失望之后，便把这他信力都失掉了。' },
  { L: 2, why: '求神拜佛是在麻醉自己', t: '失掉了他信力，就会疑，一个转身，也许能够只相信了自己，倒是一条新生路，但不幸的是逐渐玄虚起来了。信“地”和“物”，还是切实的东西，国联就渺茫，不过这还可以令人不久就省悟到依赖它的不可靠。<u>一到求神拜佛，可就玄虚之至了，有益或是有害，一时就找不出分明的结果来，它可以令人更长久的麻醉着自己。</u>' },
  { L: 2, why: '结论：发展的是“自欺力”，不是失掉“自信力”', t: '中国人现在是在发展着“自欺力”。' },
  { L: 3, why: '“然而”一转，亮出观点', t: '“自欺”也并非现在的新东西，现在只不过日见其明显，笼罩了一切罢了。然而，在这笼罩之下，我们有并不失掉自信力的中国人在。' },
  { L: 3, why: '论据：从古以来的“中国的脊梁”', t: '我们从古以来，就有埋头苦干的人，有拼命硬干的人，有为民请命的人，有舍身求法的人，……虽是等于为帝王将相作家谱的所谓“正史”，也往往掩不住他们的光耀，这就是中国的脊梁。' },
  { L: 3, why: '论据：现在也有；“失掉自信力”加于全体是诬蔑', t: '这一类的人们，就是现在也何尝少呢？他们有确信，不自欺；他们在前仆后继的战斗，不过一面总在被摧残，被抹杀，消灭于黑暗中，不能为大家所知道罢了。说中国人失掉了自信力，用以指一部分人则可，倘若加于全体，那简直是诬蔑。' },
  { L: 3, why: '结论：要看筋骨和脊梁，看地底下', t: '要论中国人，必须不被搽在表面的自欺欺人的脂粉所诓骗，却看看他的筋骨和脊梁。自信力的有无，状元宰相的文章是不足为据的，要自己去看地底下。' },
];

function initStruct() {
  const text = document.getElementById('zxText');
  const layers = document.getElementById('zxLayers');
  const msg = document.getElementById('zxMsg');
  let picked = null;

  text.innerHTML = PARAS.map((p, i) => `<p class="zx-p" data-i="${i}"><b class="no">${i + 1}</b>${p.t}</p>`).join('') + '<p class="zx-date">九月二十五日</p>';
  layers.innerHTML = LAYERS.map((l, k) => `<button type="button" class="zx-layer ${l.cls}" data-k="${k}">
    <span class="zx-name">${l.name}</span><small>${l.sub}</small><span class="zx-slot"></span></button>`).join('<i class="zx-arr">↓</i>');

  const place = (i) => {
    const p = PARAS[i];
    const el = text.querySelector(`.zx-p[data-i="${i}"]`);
    el.classList.remove('picked');
    el.classList.add('done', LAYERS[p.L].cls);
    const slot = layers.querySelector(`.zx-layer[data-k="${p.L}"] .zx-slot`);
    if (!slot.querySelector(`[data-i="${i}"]`)) {
      slot.insertAdjacentHTML('beforeend', `<em data-i="${i}">${i + 1}</em>`);
      [...slot.children].sort((a, b) => a.dataset.i - b.dataset.i).forEach((c) => slot.appendChild(c));
    }
  };

  text.addEventListener('click', (e) => {
    const el = e.target.closest('.zx-p');
    if (!el || el.classList.contains('done')) return;
    text.querySelectorAll('.zx-p').forEach((x) => x.classList.toggle('picked', x === el));
    picked = +el.dataset.i;
    msg.textContent = `第 ${picked + 1} 段属于哪一层？点右边的方框。`;
  });
  layers.addEventListener('click', (e) => {
    const box = e.target.closest('.zx-layer');
    if (!box) return;
    if (picked === null) { msg.textContent = '先点左边一段原文。'; return; }
    const p = PARAS[picked];
    if (+box.dataset.k === p.L) {
      place(picked);
      msg.innerHTML = `<b>第 ${picked + 1} 段 · ${LAYERS[p.L].name}</b>：${p.why}`;
      picked = null;
      if (!text.querySelector('.zx-p:not(.done)')) msg.innerHTML += '　<b>全部放好了！先破后立，层次清清楚楚。</b>';
    } else {
      box.classList.remove('no');
      void box.offsetWidth; // 重新触发抖动动画
      box.classList.add('no');
      msg.textContent = `再想想：第 ${picked + 1} 段是在摆对方的说法、驳对方，还是亮出作者自己的观点？`;
    }
  });
  document.getElementById('zxAll').addEventListener('click', () => {
    PARAS.forEach((_, i) => place(i));
    picked = null;
    msg.textContent = '第 1–2 段 对方观点；第 3 段 驳论据；第 4–5 段 驳论证；第 6–9 段 立论。';
  });
  document.getElementById('zxReset').addEventListener('click', () => {
    text.querySelectorAll('.zx-p').forEach((x) => { x.className = 'zx-p'; });
    layers.querySelectorAll('.zx-slot').forEach((s) => { s.innerHTML = ''; });
    picked = null;
    msg.textContent = '先点左边一段原文，再点右边它所属的一层。';
  });
}

/* 积累拓展四：四种“脊梁”（人物为示例，鼓励学生补充） */
const SPINES = [
  { k: '埋头苦干的人', pic: 'maitou', who: '大禹治水，三过家门而不入；李冰父子修都江堰' },
  { k: '拼命硬干的人', pic: 'qianpu', who: '张骞出使西域，历尽艰险，十三年后归来' },
  { k: '为民请命的人', pic: 'jiliang', who: '包拯为民申冤；海瑞直言上疏' },
  { k: '舍身求法的人', pic: 'qiufa', who: '玄奘西行取经；鉴真六次东渡' },
];

function initSpines() {
  const box = document.getElementById('spines');
  box.innerHTML = SPINES.map((s, i) => `<button type="button" class="spine" data-i="${i}">
    <span class="sp-pic" data-bg="assets/${s.pic}.jpg"></span><b>有${s.k}</b><span class="sp-who">${s.who}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.spine');
    if (c) c.classList.toggle('open');
  });
}

const MOMENTS = [
  {
    name: '仿写：排比 + 比喻', pic: 'jiliang',
    prompt: '模仿“我们从古以来，就有埋头苦干的人……这就是中国的脊梁”，用排比和比喻写一段话。',
    hint: '先想一个比喻（脊梁 → 灯塔？基石？根？），再用三四个结构相同的短语组成排比。',
    example: '我们的城市里，有凌晨扫街的人，有深夜守着急诊室的人，有风雨里送快递的人，有寒暑不休修线路的人……他们的名字很少被人记住，却默默托起了城市的每一个清晨，这就是城市的基石。',
  },
  {
    name: '辩论：正方立论', pic: 'maitou',
    prompt: '论题“逆境是否有利于人成长”。如果你是正方（逆境有利于成长），写出你的立论。',
    hint: '一句话亮明观点，再用一两个事实论据、一句道理论据来证明。',
    example: '我方认为逆境有利于人成长。孟子说“生于忧患，死于安乐”；司马迁遭受宫刑，发愤著成《史记》。逆境逼着人思考、磨炼人的意志，困难越大，成长得越快。',
  },
  {
    name: '辩论：反方驳论', pic: 'qianpu',
    prompt: '如果你是反方，请先引出正方的观点，再指出它的漏洞，最后亮出自己的观点。',
    hint: '可以驳论据（例子是个别的），也可以驳论证（“有人在逆境中成才”推不出“逆境有利于人成长”）。',
    example: '对方说司马迁在逆境中写成《史记》，所以逆境有利于成长。可是，更多人在逆境中被压垮了，只举成功者，是以偏概全。司马迁成功靠的是坚定的志向，不是逆境本身。我方认为：顺境更有利于成长，关键在于是否有志向和毅力。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initStruct();
    initSpines();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
