'use strict';
/* 就英法联军远征中国致巴特勒上尉的信 · 本课数据与互动：反语卡（字面 / 实指）、“爱国”选一选、读写迁移。通用部分见 ../shared/narrative.js */

const IRONY = [
  { s: '你认为这次远征是体面的，出色的。', lit: '“体面”“出色”：称赞', real: '复述对方的说法，暗含嘲讽：掠夺怎能“体面”？' },
  { s: '从前他们对巴特农神庙怎么干，现在对圆明园也怎么干，不同的只是干得更彻底，更漂亮，以至于荡然无存。', lit: '“更彻底，更漂亮”：夸奖', real: '破坏得更彻底，罪行更严重' },
  { s: '丰功伟绩！收获巨大！', lit: '赞颂功绩', real: '无耻的抢劫，收获的是赃物' },
  { s: '两个胜利者，一个塞满了腰包，这是看得见的，另一个装满了箱箧。他们手挽手，笑嘻嘻地回到欧洲。', lit: '“胜利者”凯旋', real: '强盗分赃后得意扬扬的丑态' },
  { s: '我们欧洲人是文明人，中国人在我们眼中是野蛮人。这就是文明对野蛮所干的事情。', lit: '“文明”与“野蛮”', real: '所谓的“文明人”干的才是最野蛮的事' },
  { s: '先生，以上就是我对远征中国的全部赞誉。', lit: '“全部赞誉”', real: '全是谴责，一句赞誉也没有' },
];

function initIrony() {
  const box = document.getElementById('irony');
  box.innerHTML = IRONY.map((r) => `<button type="button" class="ir"><span class="ir-s">${r.s}</span>
    <span class="ir-k"><i>字面</i>${r.lit}</span><span class="ir-k real"><i>实指</i>${r.real}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.ir');
    if (c) c.classList.toggle('open');
  });
}

const PICKS = {
  ai: [
    { t: '爱国就要为本国的一切行为喝彩。', ok: false, why: '不分是非，不是真正的爱国' },
    { t: '雨果批判的是侵略者，不是法国人民。', ok: true, why: '“治人者的罪行不是治于人者的过错”' },
    { t: '希望祖国归还赃物，是希望祖国变得正义、干净。', ok: true, why: '“解放了的干干净净的法兰西”' },
    { t: '雨果是法国人，就不该批评法国。', ok: false, why: '正义和良知超越国界' },
    { t: '真正的爱国与维护人类的正义是一致的。', ok: true, why: '雨果站在全人类文明的立场' },
  ],
};

const MOMENTS = [
  {
    name: '给博物馆的留言', pic: 'bowuguan',
    prompt: '假如你在一座异国博物馆里看到从圆明园掠去的文物，请写一段留言，观点要明确。',
    hint: '开头一句亮明观点，再用一两句理由支撑，语气可以克制而坚定。',
    example: '我认为，这些文物应当回到它们的故乡。它们是中国人民世世代代的劳动结晶，是被抢走的，而不是被赠送的。正如雨果所说，真正的物主是被掠夺的中国。',
  },
  {
    name: '评一评雨果', pic: 'shuzhuo',
    prompt: '用一段话评价雨果写这封信的勇气。',
    hint: '可以用“……，而……”“不是……，而是……”这样的句式，让观点更鲜明。',
    example: '雨果不是不爱自己的国家，而是更爱正义。在举国欢庆“胜利”的时候，他敢于说出“两个强盗”，这需要非凡的勇气和良知。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initIrony();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
