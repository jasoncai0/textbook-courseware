'use strict';
/* 剃头大师 · 本课数据与漫画分格。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* ================= 漫画：一格一个画面（SVG 小头像），必须在 deck.js 统计分步之前渲染 ================= */
const INK = 'stroke="#3a2a1a" stroke-width="3"';
const EARS = `<circle cx="54" cy="116" r="10" fill="#f6d7b0" ${INK}/><circle cx="146" cy="116" r="10" fill="#f6d7b0" ${INK}/>`;
const FACE = `${EARS}<circle cx="100" cy="112" r="46" fill="#f6d7b0" ${INK}/>`;
const EYES = '<circle cx="84" cy="114" r="4" fill="#2b2b2b"/><circle cx="116" cy="114" r="4" fill="#2b2b2b"/>';
const SMILE = '<path d="M86 134 Q100 146 114 134" fill="none" stroke="#3a2a1a" stroke-width="3" stroke-linecap="round"/>';
const CAPE = `<path d="M34 200 Q44 156 100 158 Q156 156 166 200 Z" fill="#9db8d9" ${INK}/><path d="M60 168 V200 M100 160 V200 M140 168 V200 M44 184 H156" stroke="#6f8fb8" stroke-width="2"/>`;
const HAIR_LONG = '<path d="M50 130 Q40 50 100 52 Q160 50 150 130 L144 98 Q100 76 56 98 Z" fill="#2b2b2b"/><path d="M56 98 Q70 110 66 128 M144 98 Q130 110 134 128" stroke="#2b2b2b" stroke-width="7" fill="none"/>';
const SCISSORS = '<g transform="translate(150 40) rotate(30)"><circle cx="-8" cy="22" r="7" fill="none" stroke="#b0302a" stroke-width="4"/><circle cx="8" cy="22" r="7" fill="none" stroke="#b0302a" stroke-width="4"/><path d="M-4 16 L6 -18 M4 16 L-6 -18" stroke="#777" stroke-width="4" stroke-linecap="round"/></g>';
const FALL = '<g stroke="#2b2b2b" stroke-width="3" fill="none" stroke-linecap="round"><path d="M30 60 q6 8 0 16"/><path d="M170 80 q-6 8 0 16"/><path d="M40 140 q6 8 0 16"/><path d="M165 140 q-6 8 0 16"/></g>';
const FUR = '<g stroke="#2b2b2b" stroke-width="3" stroke-linecap="round">' + [[50, 176], [66, 186], [82, 172], [96, 190], [112, 176], [128, 188], [144, 176], [74, 196], [118, 196], [58, 194], [140, 194], [104, 170]]
  .map(([x, y]) => `<line x1="${x}" y1="${y}" x2="${x + 6}" y2="${y - 7}"/>`).join('') + '</g>';
const HAIR_SHORT = '<path d="M56 104 Q54 62 100 60 Q146 62 144 104 Q100 86 56 104 Z" fill="#2b2b2b"/>';
const HAIR_JAGGED = '<path d="M54 106 L58 72 L68 92 L74 40 L86 84 L96 64 L104 88 L118 34 L126 86 L138 70 L146 106 Q100 88 54 106 Z" fill="#2b2b2b"/>';
const HAIR_PATCHY = '<path d="M60 96 Q62 72 82 70 L86 90 Z M104 66 Q124 64 136 80 L120 92 Z M90 80 L100 74 L104 86 Z" fill="#2b2b2b"/>'
  + '<path d="M50 92 h8 v8 h8 v8 h8 M150 92 h-8 v8 h-8 v8 h-8" fill="none" stroke="#2b2b2b" stroke-width="4"/>';
const SHOCK = '<circle cx="84" cy="112" r="9" fill="#fff" stroke="#2b2b2b" stroke-width="2"/><circle cx="116" cy="112" r="9" fill="#fff" stroke="#2b2b2b" stroke-width="2"/><circle cx="84" cy="112" r="3" fill="#2b2b2b"/><circle cx="116" cy="112" r="3" fill="#2b2b2b"/><ellipse cx="100" cy="138" rx="9" ry="12" fill="#7a2a1e"/>';
const WORRY = '<path d="M88 138 Q100 132 112 138" fill="none" stroke="#3a2a1a" stroke-width="3" stroke-linecap="round"/>';
const sfx = (t, x = 100, y = 30) => `<text x="${x}" y="${y}" class="sfx" text-anchor="middle">${t}</text>`;

const PANELS = [
  { svg: CAPE + FACE + HAIR_LONG + EYES + WORRY + SCISSORS, sfx: '', cap: '我先把姑父的大睡衣给他围上，再摆出剃头师傅的架势' },
  { svg: CAPE + FACE + HAIR_SHORT + EYES + SMILE + FALL + sfx('嚓嚓！', 52, 34), cap: '嚓嚓两剪刀，就剪下一堆头发。“嗬！”小沙高兴了' },
  { svg: CAPE + FUR + FACE + HAIR_SHORT + EYES + SMILE + FALL, sfx: '', cap: '姑父的睡衣就像一张熊皮，上面落满了黑头发' },
  { svg: CAPE + FUR + FACE + HAIR_JAGGED + EYES + WORRY + sfx('哎呀！坏了！', 100, 24), cap: '头发长长短短，这儿翘起，那儿却短得不到一厘米' },
  { svg: CAPE + FUR + FACE + HAIR_PATCHY + EYES + WORRY, sfx: '', cap: '越修越糟……坑坑洼洼，耳朵边却像层层梯田' },
  { svg: CAPE + FUR + FACE + HAIR_PATCHY + SHOCK + sfx('啊——！', 100, 30), cap: '他一照镜子，大叫一声，像见了鬼一样' },
];

document.getElementById('comic').innerHTML = PANELS.map((p, i) => `<figure class="panel-c" data-step="${i + 1}">
  <b class="pn">${i + 1}</b><svg viewBox="0 0 200 200" aria-hidden="true">${p.svg}</svg><figcaption>${p.cap}</figcaption></figure>`).join('');

/* 品读 · 课后第 2 题：理发店闯关（ok 为正确选项下标；最后一关自己提问题） */
const QUIZ = [
  { q: '“剃头大师”指谁？为什么这样称呼？', opts: ['老剃头师傅，他手艺最好', '“我”，自以为剪得熟练，其实是说笑', '姑父，他睡衣上全是头发'], ok: 1, why: '“我”自封“大师”，结果剪得一塌糊涂——题目本身就在说笑。' },
  { q: '“害人精”指谁？小沙为什么这样叫？', opts: ['给小沙剃头的老剃头师傅', '“我”', '小沙的妈妈'], ok: 0, why: '小沙怕剃头，觉得老师傅让他吃尽苦头，就骂人家“害人精”。' },
  { q: '“这一会儿痛一会儿痒的，跟受刑一样。”痛和痒从哪里来？', opts: ['剪刀剪破了耳朵', '推剪咬住头发痛，碎头发掉进脖子痒', '小沙生病了'], ok: 1, why: '联系上文就能读懂：痛是“推剪咬住头发”，痒是“碎头发掉进脖子”。' },
  { q: '“姑父的睡衣就像一张熊皮。”为什么像熊皮？', opts: ['睡衣是用熊皮做的', '睡衣是棕色的', '睡衣上落满了黑头发，毛茸茸的'], ok: 2, why: '剪下的黑头发落满了睡衣，黑乎乎、毛茸茸——头发剪得真多。' },
  { q: '“世界上再也没有比他更优秀的顾客了。”这是真夸吗？', opts: ['是真夸，小沙最有礼貌', '是好笑的反话：头剪坏了，小沙只摸摸耳朵还在，就无所谓了', '是在批评小沙'], ok: 1, why: '头发剪成“梯田”，小沙也不生气——“优秀”是笑着说的反话。' },
];
const QUIZ_LAST = { q: '最后一关：你也来提一个问题！', eg: '例如：小沙为什么只怕剪破耳朵？“我”为什么说剪坏的头是“最时髦的发式”？' };

function initQuiz(box, quiz, last) {
  const total = quiz.length + 1;
  const dots = (k) => `<div class="qz-dots">${Array.from({ length: total }, (_, i) => `<i class="${i < k ? 'ok' : i === k ? 'now' : ''}">✂</i>`).join('')}</div>`;
  const show = (k) => {
    if (k >= quiz.length) {
      box.innerHTML = `${dots(k)}<p class="qz-q">${last.q}</p>
        <textarea class="qz-ask" placeholder="我想问：……"></textarea>
        <p class="qz-why">${last.eg}</p>
        <div class="btns"><button class="btn" type="button" data-again>再闯一遍</button></div>`;
      return;
    }
    const it = quiz[k];
    box.innerHTML = `${dots(k)}<p class="qz-q"><small>第 ${k + 1} 关</small>${it.q}</p>
      <div class="qz-opts">${it.opts.map((o, i) => `<button class="qz-opt" type="button" data-o="${i}">${'ABC'[i]}　${o}</button>`).join('')}</div>
      <p class="qz-why"></p>
      <div class="btns"><button class="btn solid" type="button" data-next hidden>下一关 →</button></div>`;
    box.dataset.k = k;
  };
  box.addEventListener('click', (e) => {
    const opt = e.target.closest('.qz-opt');
    const k = +box.dataset.k;
    if (opt && !box.querySelector('.qz-opt.right')) {
      const it = quiz[k];
      const right = +opt.dataset.o === it.ok;
      opt.classList.remove('wrong'); void opt.offsetWidth;
      opt.classList.add(right ? 'right' : 'wrong');
      box.querySelector('.qz-why').textContent = right ? `✓ ${it.why}` : '再想想：回到课文里找一找这句话的前后文。';
      box.querySelector('[data-next]').hidden = !right;
    }
    if (e.target.closest('[data-next]')) show(k + 1);
    if (e.target.closest('[data-again]')) show(0);
  });
  show(0);
}
/* 品读 · 课后第 3 题：选一选 */
const PICKS = {
  title: [
    { t: '“我”觉得自己剪得像大师，题目写出了“我”的得意', ok: true, why: '对，这是“我”的自我感觉' },
    { t: '其实剪得一塌糊涂，题目和结果一比，特别好笑', ok: true, why: '对，前后对比，幽默' },
    { t: '“我”真的是一位剃头技术很好的大师', ok: false, why: '不对：越修越糟，坑坑洼洼' },
    { t: '题目让人好奇：大师剃得怎么样？想读下去', ok: true, why: '对，能吸引读者' },
    { t: '课文主要写的是老剃头师傅', ok: false, why: '不对：主要写“我”给小沙剃头' },
  ],
};

/* 读与写 · 接着想，接着写 */
const MOMENTS = [
  {
    name: '小沙照镜子时', pic: 'titian',
    prompt: '小沙一照镜子，大叫一声，像见了鬼一样。他会说什么？“我”又会怎么说？',
    hint: '写出两个人的话和动作：一个惊叫，一个想“稳住”他。',
    example: '“啊——这是我吗？”小沙捂着脑袋跳了起来，“我的头怎么变成梯田了！”我赶紧说：“别急别急，这是今年最时髦的发式，叫‘梯田头’，城里的明星都这么剪！”',
  },
  {
    name: '姑父看见小沙时', pic: 'guangtou',
    prompt: '姑父看见小沙坑坑洼洼的头，会是什么表情？会说什么？',
    hint: '想想姑父平时的样子：押小沙去理发店、执一把木尺监督。',
    example: '姑父推了推眼镜，盯着小沙的头看了半天，嘴角抖了两下，终于忍不住笑出了声：“走吧，还得去找‘害人精’——这回付三倍的钱！”',
  },
  {
    name: '写一个有特点的人', pic: 'lifadian',
    prompt: '课文写出了小沙“胆小”的特点。你身边有“小书虫”“热心肠”“故事大王”吗？用一件事写写他的特点。',
    hint: '先说他是个怎样的人，再写一件能看出这个特点的事。',
    example: '我的同桌是个“小书虫”。下课铃响了，大家都冲出去玩，他还捧着一本《西游记》，看到孙悟空大闹天宫，竟然“哈哈”笑出了声，把前排的同学吓了一跳。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initQuiz(document.getElementById('quizBox'), QUIZ, QUIZ_LAST);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
