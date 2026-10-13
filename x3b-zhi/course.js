'use strict';
/* 纸的发明（三下 10）· 本课数据与互动。翻页引擎见 ../shared/deck.js */

/* 词句段运用：照流程图说一次手工活动 */
const FLOWS = [
  {
    name: '造纸（课文）', steps: ['剪碎或切断', '浸', '捣', '捞', '晒'],
    prompt: '对照流程图，读一读课文里蔡伦造纸的那段话。',
    example: '他把树皮、麻头、破布等原料剪碎或切断，浸在水里捣烂成浆；再把浆捞出来晒干，就成了一种既轻便又好用的纸。',
  },
  {
    name: '剪纸', steps: ['折', '画', '剪', '展开'],
    prompt: '剪一朵窗花，是怎样一步一步做成的？',
    example: '我先把一张红纸对折两次，再用铅笔在纸上画出花纹，然后拿剪刀沿着线小心地剪，最后轻轻展开，一朵漂亮的窗花就剪好了。',
  },
  {
    name: '捏泥人', steps: ['揉', '捏', '搓', '粘', '晾'],
    prompt: '捏一个小泥人，先做什么，后做什么？',
    example: '我先把彩泥揉软，再捏出圆圆的脑袋和身子，然后搓两根细条当胳膊，把它们粘在身子两边，最后放在窗台上晾干。',
  },
  {
    name: '拼装玩具', steps: ['看图纸', '找零件', '拼', '拧紧', '试一试'],
    prompt: '拼装一个玩具小车，按顺序说一说。',
    example: '我先仔细看图纸，再把车身、轮子、螺丝一样样找出来，然后按图把零件拼在一起，用小螺丝刀把螺丝拧紧，最后把小车放在地上推一推，它跑起来了！',
  },
  {
    name: '编花绳', steps: ['套', '挑', '翻', '换'],
    prompt: '和同学玩翻花绳，怎么翻出新花样？',
    example: '我先把绳子套在两只手上，同学用手指挑起两边的绳子，往外一翻，变成了“面条”；接着我们换过来，又翻出了“牛槽”。',
  },
];

function initFlow() {
  const $ = (id) => document.getElementById(id);
  const show = (i) => {
    const f = FLOWS[i];
    document.querySelectorAll('#flowBtns .btn').forEach((b, k) => b.classList.toggle('solid', k === i));
    $('flowChips').innerHTML = f.steps.map((s) => `<span class="fstep">${s}</span>`).join('<i>→</i>');
    $('flowPrompt').textContent = f.prompt;
    $('flowExampleText').textContent = `示例：${f.example}`;
    $('flowExampleText').hidden = true;
    $('flowText').value = '';
  };
  $('flowBtns').innerHTML = FLOWS.map((f, i) => `<button class="btn" type="button" data-i="${i}">${f.name}</button>`).join('');
  $('flowBtns').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-i]');
    if (b) show(+b.dataset.i);
  });
  $('flowExample').addEventListener('click', () => { $('flowExampleText').hidden = false; });
  show(0);
}

function initCells() {
  document.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (cell) cell.classList.toggle('open');
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initFlow();
    initCells();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
