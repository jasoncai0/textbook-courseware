'use strict';
/* 再塑生命的人 · 本课数据与本课独有互动：雾中航船滑块、井房“黑暗—触觉—语言”体验页 */

const PICKS = {
  echo: [
    { t: '老师安妮·莎莉文来到我家的这一天，是我一生中最重要的一天。', ok: true, why: '开头点明：这一天是生命的转折' },
    { t: '回想此前和此后截然不同的生活，我不能不感慨万分。', ok: true, why: '“截然不同”——生命被重新塑造' },
    { t: '恰恰在此时，爱的光明照到了我的身上。', ok: true, why: '“爱的光明”照进黑暗的生命' },
    { t: '水唤醒了我的灵魂，并给予我光明、希望、快乐和自由。', ok: true, why: '单句成段，写出“再塑”的震撼' },
    { t: '我们沿着小路散步到井房，房顶上盛开的金银花芬芳扑鼻。', ok: false, why: '交代地点和环境，不是照应标题的句子' },
    { t: '啊！世界上还有比我更幸福的孩子吗？', ok: true, why: '结尾抒情：新生命的幸福' },
  ],
};

const CLUE_LABELS = ['课文语句', '课本旁批'];
const CLUES = [
  { q: '“海港已经临近”<br>“爱的光明照到了我的身上”', a: '到底这一天有什么不寻常的事要发生？' },
  { q: '我似乎能感觉得到，她就是那个来对我启示世间的真理、给我深切的爱的人——安妮·莎莉文老师。', a: '启示真理，给“我”以爱——莎莉文老师再塑“我”生命的两个支点。' },
  { q: '我并不知道这就是在写字……我不过是依样画葫芦模仿莎莉文老师的动作而已。', a: '叙事之中穿插“我”的感受与认识。画出这样的句子，感受“我”学习中的苦与乐。' },
  { q: '水唤醒了我的灵魂，并给予我光明、希望、快乐和自由。', a: '“水”本身真的有这么大的魔力吗？' },
];

const MOMENTS = [
  {
    name: '一道难题', pic: 'jingfang',
    prompt: '写一次你琢磨很久、突然想通一道题的经历。',
    hint: '先写卡住时的着急，再写“突然”看到了什么，最后单独一句写出那一刻的感受。',
    example: '那道几何题我画了三遍图，还是找不到思路。我盯着那个三角形，越看越烦。忽然，我的笔尖无意中在两个点之间划了一道——辅助线！我一下子愣住了：原来答案一直就藏在图里。\n那一刻，整道题都亮了。',
  },
  {
    name: '一句话的意思', pic: 'jinyinhua',
    prompt: '写一次你突然明白了大人一句话的意思的经历。',
    hint: '那句话是谁说的？当时你怎么理解？后来因为什么事突然懂了？',
    example: '外婆常说“慢慢来，比较快”，我一直觉得这话说反了……直到那天我急着系鞋带，越急越打成死结。',
  },
  {
    name: '一件后悔的事', pic: 'wawa',
    prompt: '学着课文写“悔恨莫及”：写一件你后来才明白、心里很后悔的事。',
    hint: '前后对照着写：当时怎么做、怎么想；后来明白了什么、心里怎样。',
    example: '那天我把弟弟的积木城堡一脚踢倒，还觉得很痛快……',
  },
];

/* 雾中航船：滑块拨开雾，海港灯亮 */
function initFog() {
  const range = document.getElementById('fogRange');
  const svg = document.getElementById('fogSvg');
  const apply = () => {
    const v = +range.value / 100;
    svg.querySelector('#fogLayer').style.opacity = String(1 - v * 0.95);
    svg.querySelector('.harbor-light').style.opacity = String(v);
    svg.querySelector('.boat').style.transform = `translateX(${v * 200}px)`;
  };
  range.addEventListener('input', apply);
  apply();
}

/* 掌心拼写：点手掌重新写一遍 water */
function initPalm() {
  const palm = document.getElementById('palm');
  const replay = () => {
    palm.classList.remove('spelling');
    void palm.getBoundingClientRect();
    palm.classList.add('spelling');
  };
  palm.addEventListener('click', replay);
  palm.addEventListener('keydown', (e) => { if (e.key === 'Enter') replay(); });
}

function updateSense(slide, step) {
  if (!slide.classList.contains('s-sense')) return;
  for (let i = 1; i <= 5; i += 1) slide.classList.toggle(`st${i}`, step >= i);
  const palm = slide.querySelector('#palm');
  palm.classList.toggle('spelling', step >= 3);
}

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initFog();
    initPalm();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateSense(slide, step);
  },
};
