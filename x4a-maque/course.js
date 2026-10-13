'use strict';
/* 麻雀 · 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课专属：“像一块石头似的”落下（两只麻雀对比动画）。 */

/* 课后第 1 题：起因 → 经过 → 结果 */
const PLOT = [
  { step: 1, stage: '起因', text: '小麻雀从巢里掉下来，猎狗嗅到了它', pic: 'xiaomaque', x: 12, y: 92 },
  { step: 2, stage: '经过', text: '猎狗走近，张开大嘴，露出牙齿', pic: 'linyin', pos: '60% 60%', x: 37, y: 66 },
  { step: 3, stage: '经过', text: '老麻雀像石头似的落下，护住小麻雀', pic: 'luoxia', x: 63, y: 40 },
  { step: 4, stage: '结果', text: '猎狗愣住，后退；“我”唤回猎狗走开', pic: 'houtui', x: 88, y: 52 },
];

/* 交流平台：看到的、听到的、想到的 */
const KINDS = ['看到的', '听到的', '想到的'];
const SORT = [
  { s: '它嘴角嫩黄，头上长着绒毛', ok: ['看到的'], q: '小麻雀的样子' },
  { s: '分明是刚出生不久，从巢里掉下来的', ok: ['想到的'], q: '“分明”：作者的推想' },
  { s: '好像嗅到了前面有什么野物', ok: ['想到的'], q: '“好像”：作者的猜测' },
  { s: '它挓挲起全身的羽毛', ok: ['看到的'], q: '老麻雀的动作' },
  { s: '绝望地尖叫着', ok: ['听到的'], q: '老麻雀的叫声' },
  { s: '发出嘶哑的声音', ok: ['听到的'], q: '紧张得声音都哑了' },
  { s: '在它看来，猎狗是个多么庞大的怪物啊！', ok: ['想到的'], q: '作者替老麻雀想' },
  { s: '它可能没料到老麻雀会有这么大的勇气', ok: ['想到的'], q: '“可能”：作者替猎狗想' },
];

/* “像一块石头似的”：A 飘飘悠悠飞下来，B 又快又直砸下来 */
const BIRD = `<g class="bird"><ellipse cx="0" cy="0" rx="17" ry="12" fill="#8a6a4a"/><circle cx="13" cy="-8" r="8" fill="#8a6a4a"/>
  <path d="M20 -8 L28 -5 L20 -3 Z" fill="#e0a83a"/><circle cx="15" cy="-10" r="1.8" fill="#222"/>
  <path class="wing" d="M-4 -4 Q-14 -24 -24 -10 Q-14 -4 -4 -2 Z" fill="#6b4e33"/><path d="M-16 2 L-28 6 L-16 6 Z" fill="#6b4e33"/></g>`;
const LANE = `<rect x="0" y="0" width="240" height="260" rx="12" fill="#eef2ea"/>
  <path d="M10 40 Q60 26 120 34" stroke="#7a5a3a" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M0 238 H240" stroke="#b9ad99" stroke-width="3"/>
  <ellipse cx="180" cy="224" rx="30" ry="14" fill="#c9a77a"/><circle cx="208" cy="210" r="11" fill="#c9a77a"/><text x="180" y="252" class="t-c lane-lb">猎狗</text>
  <g class="impact"><path d="M70 236 l-14 -10 M90 236 l0 -16 M110 236 l14 -10" stroke="#b23a2a" stroke-width="3" stroke-linecap="round"/></g>
  <g transform="translate(90 24)"><g class="flier">${BIRD}</g></g>`;
document.querySelectorAll('.drop-lane svg').forEach((svg) => { svg.innerHTML = LANE; });

function initDrop() {
  const box = document.querySelector('.drops');
  document.getElementById('dropBtn').addEventListener('click', () => {
    box.classList.remove('play');
    void box.offsetWidth; // 重新开始动画
    box.classList.add('play');
  });
}

/* 小练笔 */
const MOMENTS = [
  {
    name: '老麻雀落下的一瞬间', pic: 'luoxia',
    prompt: '假如你就是那只小麻雀，看到老麻雀落在面前，你看到了什么？听到了什么？想到了什么？',
    hint: '用上“我看见……我听见……我想……”，把那一瞬间写清楚。',
    example: '我看见妈妈像一块石头似的落在我面前，全身的羽毛都竖了起来。我听见她尖叫着，声音都哑了。我想：妈妈也害怕呀，她在发抖，可她还是挡在我前面……',
  },
  {
    name: '家人做家务', pic: 'linyin',
    prompt: '观察家人炒菜、擦玻璃或者做其他家务的过程，用一段话写下来。（初试身手）',
    hint: '注意用上表示动作的词语，一个动作接一个动作地写。',
    example: '妈妈把锅烧热，倒进一勺油。油“滋滋”地响起来，她把切好的青菜“哗”地倒进锅里，拿起锅铲飞快地翻炒……',
  },
  {
    name: '我自己想', pic: 'houtui',
    prompt: '你见过小动物之间发生的一件事吗？把它写清楚。',
    hint: '先交代时间、地点、谁；再写看到的、听到的、想到的。',
    example: '一个雨后的下午，我在楼下看见一只蚂蚁拖着一粒饭……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ plot: PLOT, sort: SORT, kinds: KINDS, moments: MOMENTS });
    initDrop();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
