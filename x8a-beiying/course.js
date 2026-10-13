'use strict';
/* 背影 · 本课数据。本课独有：“背影”四次出现的线索图、买橘子动作慢镜头（父亲只画背影） */

/* ---------- 慢镜头：每一帧 = 父亲的位置 / 姿势 + 原文 ---------- */
// x, y：脚下位置；rot：身体倾斜；pose：arms-down / arms-up / arms-hold；legs：down / up
const FRAMES = [
  { v: '戴 · 穿', t: '我看见他戴着黑布小帽，穿着黑布大马褂，深青布棉袍，', x: 80, y: 200, rot: 0, pose: 'arms-down', legs: 'down' },
  { v: '走', t: '蹒跚地走到铁道边，', x: 118, y: 200, rot: 0, pose: 'arms-down', legs: 'down', wobble: true },
  { v: '探', t: '慢慢探身下去，尚不大难。', x: 160, y: 300, rot: 14, pose: 'arms-down', legs: 'down' },
  { v: '攀', t: '可是他穿过铁道，要爬上那边月台，就不容易了。他用两手攀着上面，', x: 428, y: 300, rot: 0, pose: 'arms-up', legs: 'down' },
  { v: '缩', t: '两脚再向上缩；', x: 432, y: 268, rot: 0, pose: 'arms-up', legs: 'up' },
  { v: '倾', t: '他肥胖的身子向左微倾，显出努力的样子，这时我看见他的背影，我的泪很快地流下来了。', x: 436, y: 250, rot: -12, pose: 'arms-up', legs: 'up', tear: true },
  { v: '抱', t: '我再向外看时，他已抱了朱红的橘子往回走了。', x: 520, y: 200, rot: 0, pose: 'arms-hold', legs: 'down' },
  { v: '放 · 爬', t: '过铁道时，他先将橘子散放在地上，自己慢慢爬下，', x: 432, y: 300, rot: 0, pose: 'arms-up', legs: 'down', ground: true },
  { v: '扑', t: '再抱起橘子走。……将橘子一股脑儿放在我的皮大衣上。于是扑扑衣上的泥土，心里很轻松似的。', x: 96, y: 200, rot: 0, pose: 'arms-down', legs: 'down' },
];
// 动词行在 deck.js 统计分步之前生成
document.getElementById('verbs').innerHTML = FRAMES.map((f, i) => `<span class="vb" data-step="${i + 1}">${f.v}</span>`).join('<i>→</i>');

function updateSlow(slide, step) {
  if (!slide.classList.contains('s-slow')) return;
  const f = FRAMES[Math.max(0, Math.min(step, FRAMES.length) - 1)];
  const fa = document.getElementById('fa');
  fa.style.transform = `translate(${f.x}px, ${f.y}px) rotate(${f.rot}deg)`;
  fa.classList.toggle('wobble', Boolean(f.wobble));
  const body = document.getElementById('faBody');
  ['arms-down', 'arms-up', 'arms-hold'].forEach((p) => body.classList.toggle(`show-${p}`, p === f.pose));
  body.classList.toggle('show-legs-up', f.legs === 'up');
  document.getElementById('slowTear').style.opacity = f.tear && step <= FRAMES.length ? '1' : '0';
  document.getElementById('orgGround').style.opacity = f.ground ? '1' : '0';
  document.getElementById('slowText').textContent = step ? f.t : '按 → 开始慢镜头。';
  slide.querySelectorAll('.vb').forEach((v, i) => v.classList.toggle('now', i === Math.min(step, FRAMES.length) - 1));
}

/* ---------- 思考探究三：细节聚光灯 ---------- */
const SPOT = [
  { t: '父亲因为事忙，本已说定不送我，', m: '事情确实多，儿子也二十岁了——理智上觉得不必送。' },
  { t: '叫旅馆里一个熟识的茶房陪我同去。他再三嘱咐茶房，甚是仔细。', m: '不送也要找人陪，还“再三”“仔细”地嘱咐——放心不下。' },
  { t: '但他终于不放心，怕茶房不妥帖；', m: '越想越担心：茶房靠得住吗？' },
  { t: '颇踌躇了一会。', m: '心里在“忙”和“不放心”之间反复掂量。' },
  { t: '他踌躇了一会，终于决定还是自己送我去。', m: '爱子之情压倒了一切——还是自己送才安心。' },
  { t: '我再三劝他不必去；他只说：“不要紧，他们去不好！”', m: '话很短，没有道理可讲，只有不放心。' },
];
function initSpot() {
  const box = document.getElementById('spot');
  box.innerHTML = SPOT.map((s) => `<button type="button" class="sp"><span class="sp-t">${s.t}</span><span class="sp-m">${s.m}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.sp');
    if (b) b.classList.toggle('lit');
  });
}

/* ---------- 积累拓展四：语言赏析（翻卡） ---------- */
const CLUES = [
  { q: '回家变卖典质，父亲还了亏空；又借钱办了丧事。这些日子，家中光景很是惨淡，一半为了丧事，一半为了父亲赋闲。', a: '句子简短，“变卖”“还”“借”几个动作交代家境的窘迫；“一半……一半……”平实，却把惨淡的原因说得清清楚楚，为下文父亲的处境作铺垫。' },
  { q: '他给我拣定了靠车门的一张椅子；我将他给我做的紫毛大衣铺好座位。他嘱我路上小心，夜里要警醒些，不要受凉。又嘱托茶房好好照应我。', a: '“拣定”“嘱”“嘱托”——动作细致，琐碎叮咛不厌其烦，父亲的细心与关爱尽在其中；“他给我做的紫毛大衣”一句，也藏着父爱。' },
  { q: '我本来要去的，他不肯，只好让他去。我看见他戴着黑布小帽……蹒跚地走到铁道边，慢慢探身下去，尚不大难。', a: '外貌描写朴素，“黑布”“深青布”暗示家境；“蹒跚”“慢慢探身”写出肥胖父亲行动的不便，为下文爬月台的艰难蓄势。' },
  { q: '他少年出外谋生，独立支持，做了许多大事。哪知老境却如此颓唐！他触目伤怀，自然情不能自已。', a: '“少年”与“老境”对比，写出父亲的失意；“触目伤怀”“情不能自已”带着理解与同情——儿子终于体谅了父亲的脾气。语言简净，文白相间，典雅。' },
];

const MOMENTS = [
  {
    name: '写一个“慢镜头”', pic: 'panpa',
    prompt: '选一个亲人为你做事的瞬间，学课文用一串动词把它“放慢”写出来。',
    hint: '先想好这个瞬间里有哪几个动作，选最准确的动词；可以加一点外貌、神态，但别直接写“爱”。',
    example: '外婆把最后一个饺子捏好，扶着桌沿慢慢站起来，膝盖“咔”地响了一声。她顿了顿，一手撑腰，一手端起盖帘，一步一步挪到灶边。锅里的水翻着白花，她踮起脚，把饺子一个个顺着锅沿滑下去，又拿勺背轻轻推了推，怕它们粘了底。热气扑上来，她眯着眼，额上的汗也顾不上擦。',
  },
  {
    name: '“聪明”与“迂”', pic: 'chezhan',
    prompt: '你在长辈面前，有没有过“聪明过分”的时候？写下那件事和你现在的想法。',
    hint: '当时你怎么想、怎么说；现在回头看，你读懂了长辈的什么？',
    example: '那次开学，爸爸非要给我的行李箱贴三张写着电话的纸条。我嫌他“老土”，偷偷撕了两张。后来箱子真在车站被人拿错了，就是剩下那张纸条让箱子回到了我手里。现在想想，那时的我，真是太聪明了。',
  },
  {
    name: '给父亲写几句回信', pic: 'juzi',
    prompt: '假如你是作者，读完父亲“大去之期不远矣”的来信，你会怎样回信？',
    hint: '可以提到那年冬天的车站和橘子，说出当年没说出口的话。',
    example: '父亲：来信收到。您说膀子疼，举箸提笔都不便，我读了很难受。我总想起那年冬天在浦口车站，您穿过铁道去买橘子，爬月台时那样吃力……那时我不懂事，还嫌您迂。如今我也做了父亲，才明白您的心。望您保重身体，我一得空就回去看您。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['原句', '赏析'], moments: MOMENTS });
    initSpot();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateSlow(slide, step);
  },
};
