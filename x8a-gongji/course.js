'use strict';
/* 国行公祭，为佑世界和平 · 本课数据与本课独有的“论证结构图”、任务二采访提纲、任务三消息写作。通用互动见 ../shared/narrative.js */

/* 六段：role 作用，key 关键句（原文），ev 事实论据（原文概括） */
const PARAS = [
  { n: '第 1 段', role: '由新闻引出观点', key: '南京的历史，人类的记忆。……中国人民永远牢记南京大屠杀历史，与全世界爱好和平与正义的人们共同维护和平。', ev: ['国家公祭鼎铭文', '第四个国家公祭日，以隆重的公祭仪式悼念死难同胞'] },
  { n: '第 2 段', role: '正面事实：世界在纪念', key: '历史，不可能被忘却！', ev: ['美国《波士顿环球邮报》发表长篇文章', '加拿大安大略省议会通过动议', '美国圣迭戈市的图书馆举办活动', '加利福尼亚州罗伯特·威尔逊纪念碑前摆满鲜花', '日本老师组成的研究会建议将相关词语列入教科书'] },
  { n: '第 3 段', role: '反面事实：右翼在否认', key: '但人们也看到，在日本，右翼分子否认历史的态度仍然顽固。', ev: ['在连锁酒店摆放美化侵略战争的书籍', '大规模篡改历史教材', '大阪市市长要解除与旧金山市的姐妹城市关系'] },
  { n: '第 4 段', role: '驳斥：事实不会消失', key: '历史不会因时代变迁而改变，事实也不会因巧舌抵赖而消失。', ev: ['日内瓦裁军会议取消了日本和平演讲的资格', '联合国人权理事会提出 218 项建议'] },
  { n: '第 5 段', role: '对比：城市的命运', key: '80 年，沧海桑田。', ev: ['《纽约时报》称其为“恐怖之城”', '国际和平城市协会宣布南京成为“国际和平城市”'] },
  { n: '第 6 段', role: '总结：和平誓言', key: '从“恐怖之城”到“和平之城”，南京的命运变迁足证和平是何等珍贵。……铭记历史、缅怀先烈、珍爱和平、开创未来，中国一以贯之的和平誓言，彰显坚定的信念、磅礴的力量。', ev: [] },
];

// 必须在 deck.js 统计分步之前生成（中心观点占第 1 步）
document.getElementById('argFlow').innerHTML = PARAS.map((p, i) =>
  `<li data-step="${i + 2}"><button type="button" class="an" data-i="${i}"><b>${p.n}</b><span>${p.role}</span></button></li>`).join('');

function showPara(i) {
  const p = PARAS[i];
  document.querySelectorAll('#argFlow .an').forEach((b, k) => b.classList.toggle('cur', k === i));
  document.getElementById('argDetail').innerHTML = `<p class="ad-no">${p.n} · ${p.role}</p>
    <blockquote>${p.key}</blockquote>
    ${p.ev.length ? `<p class="ad-h">事实论据</p><ul>${p.ev.map((e) => `<li>${e}</li>`).join('')}</ul>` : '<p class="ad-h">回扣标题，总结全文，发出和平誓言。</p>'}`;
}

const SORT = [
  { s: '历史，不可能被忘却！', ok: ['观点'], q: '第 2 段的结论' },
  { s: '加拿大安大略省议会于 2017 年 10 月通过有关……的动议', ok: ['事实论据'], q: '有时间、有机构' },
  { s: '历史不会因时代变迁而改变，事实也不会因巧舌抵赖而消失。', ok: ['观点'], q: '驳斥的立足点' },
  { s: '2017 年 11 月，日内瓦裁军会议取消了日本和平演讲的资格', ok: ['事实论据'], q: '国际社会的回应' },
  { s: '2017 年 9 月，国际和平城市协会宣布，南京成为“国际和平城市”。', ok: ['事实论据'], q: '城市命运的变迁' },
  { s: '南京的命运变迁足证和平是何等珍贵。', ok: ['观点'], q: '由事实推出的结论' },
];

/* 任务二：采访提纲（课本示例） */
const PLAN_DEMO = {
  pTime: '× 月 ×× 日下午放学后，×× 社区居委会办公室',
  pWho: '在防控新冠肺炎疫情过程中表现突出的社区干部刘阿姨',
  pWhy: '了解刘阿姨在疫情防控中的工作情况和所思所感',
  pHow: '深度访谈，照片拍摄',
  pTool: '纸、笔、相机或手机',
  pQs: '（1）您在疫情防控中承担哪些工作？\n（2）疫情防控中让您感触最深的有哪些事？（请对方详细讲述）\n（3）您在疫情防控中遇到了哪些困难？又是怎样克服的？\n（4）经过这次疫情防控，您对自己的本职工作有哪些新的理解？对同事、社区居民等有哪些新的认识？（请对方具体讲述）',
};
const MIN_QUESTIONS = 3;
const CLOSED_Q = /(吗|是不是|对不对|好不好|有没有)[？?]?\s*$/;

function checkQuestions() {
  const lines = document.getElementById('pQs').value.split('\n').map((s) => s.trim()).filter(Boolean);
  const tips = [];
  if (lines.length < MIN_QUESTIONS) tips.push(`问题有 ${lines.length} 个，建议至少准备 ${MIN_QUESTIONS} 个，并按由浅入深排好顺序。`);
  const closed = lines.filter((l) => CLOSED_Q.test(l));
  if (closed.length) tips.push(`有 ${closed.length} 个问题对方可能只答“是/不是”，试着改成“怎样”“哪些”“为什么”。`);
  if (!tips.length) tips.push('问题数量和问法都不错。再看看：问题具体吗？前后有没有逻辑联系？');
  document.getElementById('qRes').textContent = tips.join(' ');
}

function initPlan() {
  const ids = Object.keys(PLAN_DEMO);
  document.getElementById('planDemo').addEventListener('click', () => ids.forEach((id) => { document.getElementById(id).value = PLAN_DEMO[id]; }));
  document.getElementById('planClear').addEventListener('click', () => { ids.forEach((id) => { document.getElementById(id).value = ''; }); document.getElementById('qRes').textContent = ''; });
  document.getElementById('qCheck').addEventListener('click', checkQuestions);
}

/* 任务三：消息写作同步预览，主观、夸张的词标黄 */
const SUBJECTIVE = /(非常|特别|无比|极其|简直|十分|最最|超级|太.{1,4}了|真是|无敌)/g;
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mark = (s) => esc(s).replace(SUBJECTIVE, '<mark>$1</mark>');

function renderNews() {
  const v = (id) => document.getElementById(id).value.trim();
  const [title, head, lead, body, tail] = ['nTitle', 'nHead', 'nLead', 'nBody', 'nTail'].map(v);
  const box = document.getElementById('nPreview');
  if (!title && !lead && !body) {
    box.innerHTML = '<p class="hint">在左边写，这里同步排版；主观、夸张的词会被标黄，提醒你斟酌。</p>';
    return;
  }
  box.innerHTML = `<h3>${mark(title) || '（标题）'}</h3>
    <p class="pv lead"><b>${esc(head)}</b>${head ? '　' : ''}${mark(lead) || '（导语）'}</p>
    ${body ? `<p class="pv body">${mark(body)}</p>` : ''}
    ${tail ? `<p class="pv tail">${mark(tail)}</p>` : ''}`;
}

function initNews() {
  ['nTitle', 'nHead', 'nLead', 'nBody', 'nTail'].forEach((id) => document.getElementById(id).addEventListener('input', renderNews));
}

window.LESSON = {
  init() {
    Narrative.init({ sort: SORT, kinds: ['观点', '事实论据'] });
    document.getElementById('argFlow').addEventListener('click', (e) => {
      const b = e.target.closest('.an');
      if (b) showPara(+b.dataset.i);
    });
    initPlan();
    initNews();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    if (slide.classList.contains('s-arg') && step >= 2) showPara(Math.min(step - 1, PARAS.length) - 1);
  },
};
