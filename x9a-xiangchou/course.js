'use strict';
/* 乡愁 · 本课数据与互动：句式表（点表头高亮一列）、去掉叠词对比、仿写。通用部分见 ../shared/narrative.js */

const COLS = ['时间', '量词', '叠词', '意象', '我在……', '……在……'];
const ROWS = [
  ['小时候', '一枚', '小小的', '邮票', '这头', '母亲 · 那头'],
  ['长大后', '一张', '窄窄的', '船票', '这头', '新娘 · 那头'],
  ['后来啊', '一方', '矮矮的', '坟墓', '外头', '母亲 · 里头'],
  ['而现在', '一湾', '浅浅的', '海峡', '这头', '大陆 · 那头'],
];
const COL_NOTE = ['时间顺序：贯穿一生', '量词准确：枚、张、方、湾', '叠词：音韵柔和绵长', '意象由小到大', '“我”始终在一头', '对方由亲人到祖国'];

function initGrid() {
  const box = document.getElementById('gridTb');
  box.innerHTML = `<table><thead><tr>${COLS.map((c, i) => `<th><button type="button" class="btn" data-c="${i}">${c}</button></th>`).join('')}</tr></thead>
    <tbody>${ROWS.map((r) => `<tr>${r.map((v, i) => `<td data-c="${i}">${v}</td>`).join('')}</tr>`).join('')}</tbody>
    <tfoot><tr>${COL_NOTE.map((n, i) => `<td data-c="${i}">${n}</td>`).join('')}</tr></tfoot></table>`;
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-c]');
    if (!b || b.tagName !== 'BUTTON') return;
    const c = b.dataset.c;
    const on = !b.classList.contains('solid');
    box.querySelectorAll(`[data-c="${c}"]`).forEach((el) => el.classList.toggle('hl', on));
    b.classList.toggle('solid', on);
  });
}

const DIE = [
  ['乡愁是一枚', '小小的', '邮票'], ['乡愁是一张', '窄窄的', '船票'], ['乡愁是一方', '矮矮的', '坟墓'], ['乡愁是一湾', '浅浅的', '海峡'],
];

function initDie() {
  const box = document.getElementById('dieLines');
  box.innerHTML = DIE.map(([a, d, n]) => `<p>${a}<em>${d}</em>${n}</p>`).join('');
  const btn = document.querySelector('.die-btn');
  btn.addEventListener('click', () => {
    const off = box.classList.toggle('no-die');
    btn.textContent = off ? '还原叠词' : '去掉叠词';
  });
}

const MOMENTS = [
  {
    name: '我的“乡愁”', pic: 'youpiao',
    prompt: '仿照《乡愁》写一首小诗：选三四个时间段，每段找一个连着你和亲人的物件，用“一（量词）（叠词）的（物件）”来写。',
    hint: '物件要真实、具体；量词和叠词要贴切；保持“我在这头，……在那头”的结构。',
    example: '小时候\n思念是一根长长的电话线\n我在这头\n外婆在那头\n上学后\n思念是一张薄薄的车票\n我在城里\n故乡在山里\n而现在\n思念是一条短短的语音\n我按下这头\n外婆在那头笑',
  },
  {
    name: '补一节', pic: 'chuanpiao',
    prompt: '假如在“长大后”与“后来啊”之间再加一节，你会选什么意象？试着写出来，并说说理由。',
    hint: '注意意象要“由小到大”，情感要逐层加深。',
    example: '中年时\n乡愁是一封长长的家书\n我在这头\n父亲在那头\n（理由：家书比船票更沉，写出漂泊多年后对家人的牵挂。）',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initGrid();
    initDie();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
