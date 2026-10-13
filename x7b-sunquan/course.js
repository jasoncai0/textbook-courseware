'use strict';
/* 孙权劝学 · 本课数据。诗文模板（横排 + 译文）见 ../shared/poem.js；本课独有“三人对话舞台” */

const POEMS = {
  quanxue: {
    title: '孙权劝学', author: '《资治通鉴》', layout: 'h',
    lines: [
      { t: '初，权谓吕蒙曰：“卿今当涂掌事，不可不学！”', r: '初，权/谓/吕蒙/曰：“卿/今/当涂/掌事，不可/不学！”', y: '当初，孙权对吕蒙说：“你现在当权管事，不可以不学习！”' },
      { t: '蒙辞以军中多务。', r: '蒙/辞以/军中/多务。', y: '吕蒙用军中事务繁多来推托。' },
      { t: '权曰：“孤岂欲卿治经为博士邪！', r: '权/曰：“孤/岂欲/卿/治经/为博士/邪！', y: '孙权说：“我难道想要你研究儒家经典成为博士吗！' },
      { t: '但当涉猎，见往事耳。', r: '但/当/涉猎，见往事/耳。', y: '只是应当粗略地阅读，了解历史罢了。' },
      { t: '卿言多务，孰若孤？孤常读书，自以为大有所益。”', r: '卿/言/多务，孰若/孤？孤/常/读书，自以为/大有所益。”', y: '你说事务多，哪里比得上我（事务多）呢？我经常读书，自认为大有好处。”' },
      { t: '蒙乃始就学。', r: '蒙/乃/始/就学。', y: '吕蒙于是开始学习。' },
      { t: '及鲁肃过寻阳，与蒙论议，大惊曰：', r: '及/鲁肃/过/寻阳，与蒙/论议，大惊/曰：', y: '等到鲁肃经过寻阳，和吕蒙谈论议事，鲁肃非常惊奇地说：' },
      { t: '“卿今者才略，非复吴下阿蒙！”', r: '“卿/今者/才略，非复/吴下/阿蒙！”', y: '“你现在的才干和谋略，不再是当年吴地的那个阿蒙了！”' },
      { t: '蒙曰：“士别三日，即更刮目相待，大兄何见事之晚乎！”', r: '蒙/曰：“士/别/三日，即/更/刮目相待，大兄/何/见事/之晚乎！”', y: '吕蒙说：“读书人分别几天，就要另外用新的眼光看待，长兄怎么知晓事情这么晚呢！”' },
      { t: '肃遂拜蒙母，结友而别。', r: '肃/遂/拜/蒙母，结友/而别。', y: '鲁肃于是拜见吕蒙的母亲，和吕蒙结为朋友后告别。' },
    ],
    notes: {
      卿: '古代君对臣的爱称。朋友、夫妇间也以“卿”为爱称', 当涂: '当道，当权', 辞: '推托', 务: '事务', 孤: '古时王侯的自称',
      治经: '研究儒家经典', 博士: '专掌经学传授的学官', 邪: '语气词，同“耶”（读 yé）', 但: '只，只是', 涉猎: '粗略地阅读',
      见往事: '了解历史。见，了解', 及: '到，等到', 过: '经过', 寻阳: '古县名，治所在今湖北黄梅西南', 今者: '如今，现在',
      才略: '才干和谋略', 非复: '不再是', 吴下: '泛指吴地', 阿蒙: '吕蒙的小名', 更: '另，另外', 刮目相待: '拭目相看，用新的眼光看待他。刮，擦拭',
      大兄: '对朋友辈的敬称', 见事: '知晓事情',
    },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* 对话舞台：act 第几场；who 说话人（旁白为空）；tone 语气提示 */
const LINES = [
  { act: 0, who: '', t: '初，权谓吕蒙曰：' },
  { act: 0, who: '孙权', tone: '郑重', t: '“卿今当涂掌事，不可不学！”' },
  { act: 0, who: '吕蒙', tone: '推托', t: '蒙辞以军中多务。' },
  { act: 0, who: '孙权', tone: '反问，略带责备', t: '“孤岂欲卿治经为博士<em>邪</em>！' },
  { act: 0, who: '孙权', tone: '缓和：“耳”，罢了', t: '但当涉猎，见往事<em>耳</em>。' },
  { act: 0, who: '孙权', tone: '恳切，现身说法', t: '卿言多务，孰若孤？孤常读书，自以为大有所益。”' },
  { act: 0, who: '', t: '蒙乃始就学。' },
  { act: 1, who: '', t: '及鲁肃过寻阳，与蒙论议，' },
  { act: 1, who: '鲁肃', tone: '大惊，赞叹', t: '“卿今者才略，非复吴下阿蒙！”' },
  { act: 1, who: '吕蒙', tone: '自信，略带调侃', t: '“士别三日，即更刮目相待，大兄何见事之晚<em>乎</em>！”' },
  { act: 1, who: '', t: '肃遂拜蒙母，结友而别。' },
];
const ACTS = ['第一场 · 劝学', '第二场 · 论议'];

document.getElementById('lines').innerHTML = LINES.map((l, i) => `<p class="ln${l.who ? '' : ' narr'}" data-step="${i + 1}" data-who="${l.who}" data-act="${l.act}">
  <b>${l.who || '旁白'}</b><span>${l.t}</span>${l.tone ? `<i>${l.tone}</i>` : ''}</p>`).join('');

function updateTheater(slide, step) {
  if (!slide.classList.contains('s-stage')) return;
  const cur = LINES[Math.max(0, Math.min(step, LINES.length) - 1)];
  const act = step ? cur.act : 0;
  slide.querySelector('#theater').classList.toggle('act-b', act === 1);
  document.getElementById('thAct').textContent = ACTS[act];
  slide.querySelectorAll('.ln').forEach((p, i) => {
    p.classList.toggle('now', i === step - 1);
    p.classList.toggle('other-act', LINES[i].act !== act);
  });
  slide.querySelectorAll('.actor').forEach((a) => {
    a.classList.toggle('speak', Boolean(step) && a.dataset.who === cur.who);
    a.classList.toggle('off', a.dataset.who === '鲁肃' ? act === 0 : a.dataset.who === '孙权' && act === 1);
  });
}

function initRoles() {
  document.querySelector('.roles').addEventListener('click', (e) => {
    const b = e.target.closest('[data-role]');
    if (!b) return;
    document.querySelectorAll('.roles .btn').forEach((x) => x.classList.toggle('solid', x === b));
    document.querySelectorAll('.ln').forEach((p) => p.classList.toggle('mine', Boolean(b.dataset.role) && p.dataset.who === b.dataset.role));
  });
}

/* 字词卡 */
const WORDS = [
  { k: '通假字', w: '邪', a: '同“耶”，语气词，表反问。', e: '孤岂欲卿治经为博士邪！' },
  { k: '古今异义', w: '博士', a: '古：专掌经学传授的学官。今：最高一级学位。', e: '孤岂欲卿治经为博士邪！' },
  { k: '古今异义', w: '但', a: '古：只，只是。今：常表转折。', e: '但当涉猎，见往事耳。' },
  { k: '古今异义', w: '及', a: '古：到，等到。今：常作连词“和”。', e: '及鲁肃过寻阳' },
  { k: '一词多义', w: '见', a: '了解（见往事）；知晓（何见事之晚）。', e: '但当涉猎，见往事耳。／大兄何见事之晚乎！' },
  { k: '一词多义', w: '当', a: '处在，担任（当涂掌事）；应当（但当涉猎）。', e: '卿今当涂掌事／但当涉猎' },
  { k: '虚词', w: '以', a: '介词，用，拿。', e: '蒙辞以军中多务。' },
  { k: '虚词', w: '乃 · 遂', a: '都可译作“于是，就”。', e: '蒙乃始就学。／肃遂拜蒙母' },
  { k: '虚词', w: '耳 · 乎', a: '耳：罢了，表限止；乎：呢，表反问。', e: '见往事耳。／何见事之晚乎！' },
  { k: '成语', w: '吴下阿蒙', a: '比喻学识尚浅的人。', e: '非复吴下阿蒙！' },
  { k: '成语', w: '刮目相待', a: '用新的眼光看待。', e: '士别三日，即更刮目相待' },
  { k: '固定句式', w: '孰若', a: '与……相比，哪一个……；可译作“哪里比得上”。', e: '卿言多务，孰若孤？' },
];

function initWords() {
  const box = document.getElementById('words');
  box.innerHTML = WORDS.map((w) => `<button type="button" class="wcard"><small>${w.k}</small><b>${w.w}</b><span class="wa">${w.a}<em>${w.e}</em></span></button>`).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.wcard');
    if (c) c.classList.toggle('open');
  });
}

const MOMENTS = [
  {
    name: '改写成课本剧', pic: 'quanxue',
    prompt: '把第一场“劝学”改写成课本剧台词，加上舞台说明（人物的神态、动作）。',
    hint: '台词用现代汉语，意思忠于原文；舞台说明写在括号里。',
    example: '孙权：（放下竹简，郑重地）子明，你如今掌管军务，不能不读书啊！\n吕蒙：（拱手，面露难色）主公，军中事情实在太多……\n孙权：（笑着摇头）我难道要你钻研经书当博士吗？只要粗略读一读，了解历史就行了。你说事多，能比我还多吗？我常常读书，自认为大有好处。\n吕蒙：（低头沉思片刻，抱拳）末将明白了！',
  },
  {
    name: '写一个“刮目相待”的人', pic: 'lunyi',
    prompt: '你身边有没有让你“刮目相待”的人？学课文的写法，用别人的“惊讶”来侧面写他的变化。',
    hint: '不必直接写他怎样努力，写别人见到他时的反应。',
    example: '期末数学成绩一公布，前桌的阿亮猛地转过身，瞪大眼睛看着小周：“九十八？你上学期才六十出头啊！”小周只是笑笑，把那本写满错题的本子往书包里塞了塞。',
  },
  {
    name: '给吕蒙写一封回信', pic: 'dushu',
    prompt: '假如你是吕蒙，开始读书一段时间后，给孙权写一封短信，说说读书的收获。',
    hint: '可以用上课文里的话：“见往事”“大有所益”。',
    example: '主公：自听您劝，末将每日军务之后必读史书。读了才知道，前人行军布阵，胜败都有道理可寻，真是大有所益。从前以“多务”推托，如今想来，实在惭愧。吕蒙敬上。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    Poem.init();
    initRoles();
    initWords();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateTheater(slide, step);
  },
};
