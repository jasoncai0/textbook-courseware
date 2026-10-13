'use strict';
/* 猎人海力布 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 品读 · 课后第 1 题：五件事 */
const PLOT = [
  { step: 1, stage: '救白蛇', text: '射伤老鹰，救下小白蛇', pic: 'jiushe', x: 10, y: 92 },
  { step: 2, stage: '得宝石', text: '珍宝不要，只要龙王嘴里的宝石', pic: 'longgong', x: 30, y: 78 },
  { step: 3, stage: '听到消息', text: '鸟儿说大山要崩塌、洪水要来', pic: 'niaoyi', x: 50, y: 62 },
  { step: 4, stage: '劝乡亲', text: '急得掉泪，乡亲们却不相信', pic: 'quan', x: 70, y: 46 },
  { step: 5, stage: '变成石头', text: '说出真相，乡亲们得救', pic: 'shitou', x: 90, y: 40 },
];

/* 品读 · 人物：做的事 → 怎样的人 */
const CLUE_LABELS = ['海力布做了什么', '看出他是……'];
const CLUES = [
  { q: '每次打猎回来，总是把猎物分给大家，自己只留下很少的一份。', a: '<b>热心助人</b>：有好东西先想着大家。' },
  { q: '海力布什么珍宝也不要……“请把您嘴里含着的那颗宝石送给我吧。”', a: '<b>不贪财</b>：要宝石是为了打猎——后来“分给大家的猎物更多了”。' },
  { q: '海力布急得掉下了眼泪，说：“我可以发誓，我说的话千真万确。”', a: '<b>心里装着乡亲</b>：大家不信，他比谁都急。' },
  { q: '要救乡亲们，只有牺牲自己。他想到这里，就镇定地对大家说……', a: '<b>舍己为人</b>：明知会变成石头，还是镇定地说出真相。' },
];

/* 品读 · 创造性复述：三种讲法，每种几个选项 */
const RETELL = [
  {
    mode: '换个角色讲',
    items: [
      { name: '海力布的口吻', prompt: '用“我”来讲海力布劝说乡亲们搬家的部分。',
        points: ['“海力布”换成“我”，对乡亲们说话用“你们”“大家”', '讲出“我”心里的想法：焦急、为难，最后下定决心', '不漏关键情节：劝搬家 → 没人信 → 急得掉泪 → 老人问原因 → 说出真相'],
        start: '那天在深山里，我听见带头的鸟说：“今天晚上，这里的大山要崩塌……”我的心一下子揪紧了——山下住着我的乡亲们啊！我顾不上打猎，一口气跑回村子……' },
      { name: '老人的口吻', prompt: '以那位老人的口吻，讲一讲海力布劝大家搬家的经过。',
        points: ['“我”一开始为什么不相信？', '看见海力布急得掉眼泪，“我”心里怎么想？', '海力布变成石头后，“我”有什么感受？'],
        start: '我在这山下住了一辈子啦。那天傍晚，海力布慌慌张张地跑回来，让我们赶快搬家。住得好好的，搬什么家呢？可我知道，这孩子从来不说谎话……' },
      { name: '带头的鸟', prompt: '用那只带头的鸟的口吻，讲讲它看到的事。',
        points: ['鸟儿是怎么知道大山要崩塌的？（合理想象）', '它看见树下的猎人含着宝石在听', '它后来看见了什么？'],
        start: '那天，山里的动物们都慌了：地底下传来轰隆隆的声音，溪水也变浑了。我赶紧招呼伙伴们：“咱们赶快飞到别处去吧！”就在那时，我看见树下站着一个猎人……' },
    ],
  },
  {
    mode: '添加情节',
    items: [
      { name: '龙宫挑宝', prompt: '课文只说龙王“让他自己挑选珍宝”。宝库里有些什么？海力布是怎么挑的？',
        points: ['想象宝库里珍宝的样子、颜色、光彩', '加上海力布和龙王的对话', '情节要合理：符合海力布不贪财的性格'],
        start: '宝库的门一打开，满屋金光闪闪：珊瑚树有一人多高，夜明珠像一个个小月亮……龙王笑着说：“恩人，喜欢什么就拿什么。”海力布看了一圈，摇摇头……' },
      { name: '宝石的神奇', prompt: '海力布有了宝石，“打猎方便极了”。他听到过哪些动物说话？',
        points: ['选一两种动物，编一编它们说的话', '说说海力布怎样用听到的话帮大家', '别忘了：他听到的话不能告诉别人'],
        start: '一天清早，海力布刚走进山林，就听见两只松鼠在吵架：“东山的松子熟啦！”“西坡的榛子更多！”海力布笑了……' },
      { name: '世代纪念', prompt: '“人们世世代代纪念海力布。”洪水退去以后，人们是怎样纪念他的？',
        points: ['乡亲们回到石头旁做了什么、说了什么', '大人怎样把这个故事讲给孩子听', '结尾回到“据说现在还能找到那块石头”'],
        start: '洪水退了，乡亲们回到山坡上，围着那块石头，久久不肯离开。那位老人摸着石头说：“好孩子，是你救了我们大家……”' },
    ],
  },
  {
    mode: '变换顺序 · 改结尾',
    items: [
      { name: '先讲石头', prompt: '交流平台的办法：先说“有一块石头是一位猎人变的”，设下悬念，再讲故事。',
        points: ['开头先抛出最不可思议的地方', '用一个问题吊起听众的胃口', '再从“从前有一个猎人”讲起'],
        start: '在北方的大山脚下，立着一块奇怪的石头，远远看去，像一个背着弓的猎人。老人们说，这块石头原来是一个人。一个人怎么会变成石头呢？这要从一条小白蛇说起……' },
      { name: '改一个结尾', prompt: '如果乡亲们一开始就相信了海力布，故事会怎样？讲一个新结尾，再和原结尾比一比。',
        points: ['新结尾要和前面的情节连得上', '想一想：原故事为什么让海力布变成石头？', '比一比：哪个结尾更打动人？为什么？'],
        start: '老人听了，拉着海力布的手说：“孩子，我们信你！”大家连夜收拾东西，赶着牛羊往远处走去……可是，人们还会世世代代纪念海力布吗？' },
    ],
  },
];

/* 读与写 · 小练笔：给石头写一段话 */
const MOMENTS = [
  { name: '介绍牌', pic: 'shitou',
    prompt: '课后小练笔：根据课文内容，给那块叫“海力布”的石头写一段话，简要介绍它的来历。',
    hint: '像景点的介绍牌：这块石头叫什么？原来是谁？为什么变成了石头？语言简洁。',
    example: '海力布石：相传，这块石头原来是一位叫海力布的猎人。他救了龙王的女儿小白蛇，得到一颗能听懂动物说话的宝石。一天，他听见鸟儿说大山要崩塌、洪水要淹没村子。为了让乡亲们相信他、赶快搬走，他说出了真相，变成了这块石头。人们世世代代纪念这位舍己救人的猎人。' },
  { name: '石头自述', pic: 'quan',
    prompt: '用石头“我”的口吻，向来往的游客介绍自己的来历。',
    hint: '“我”就是海力布。可以加一两句“我”的心里话，但来历要简要。',
    example: '你好，远方的客人！别看我只是山坡上的一块石头，我原来可是一个猎人，名叫海力布。那年，我听见鸟儿说大山要崩塌，就急忙劝乡亲们搬家。为了让大家相信，我说出了宝石的秘密，就变成了石头。乡亲们得救了，我一点儿也不后悔。' },
  { name: '三句话讲给小朋友', pic: 'jiushe',
    prompt: '把故事缩成三四句话，讲给弟弟妹妹听。',
    hint: '为本单元习作“缩写故事”做准备：保留主要情节，删去对话和细节。',
    example: '从前有个猎人叫海力布，他救了龙王的女儿，得到一颗能听懂动物说话的宝石，可是听到的话不能告诉别人，不然就会变成石头。有一天，他听鸟儿说大山要崩塌，就劝乡亲们搬家。为了让大家相信，他说出了真相，变成了石头，乡亲们得救了。' },
];

/* 创造性复述：选讲法 → 选角度 → 看要点、听开头 */
function initRetell(box, modes) {
  const state = { m: 0, i: 0 };
  const draw = () => {
    const mode = modes[state.m];
    const it = mode.items[state.i];
    box.innerHTML = `<div class="rt-side">
        <div class="rt-modes">${modes.map((m, k) => `<button type="button" class="btn${k === state.m ? ' solid' : ''}" data-m="${k}">${m.mode}</button>`).join('')}</div>
        <div class="rt-items">${mode.items.map((x, k) => `<button type="button" class="rt-item${k === state.i ? ' on' : ''}" data-i="${k}">${x.name}</button>`).join('')}</div>
      </div>
      <div class="rt-card">
        <p class="rt-prompt">${it.prompt}</p>
        <ul class="rt-points">${it.points.map((p) => `<li>${p}</li>`).join('')}</ul>
        <button type="button" class="btn" data-start>听听开头</button>
        <p class="rt-start" hidden>${it.start}</p>
      </div>`;
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.m !== undefined) { state.m = +b.dataset.m; state.i = 0; draw(); }
    else if (b.dataset.i !== undefined) { state.i = +b.dataset.i; draw(); }
    else if (b.hasAttribute('data-start')) box.querySelector('.rt-start').hidden = false;
  });
  draw();
}

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initRetell(document.getElementById('retell'), RETELL);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
