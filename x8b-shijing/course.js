'use strict';
/* 《诗经》二首 · 本课数据。诗文模板见 ../shared/poem.js（一章一行）；本课独有“关雎比兴对照”“蒹葭三章换字高亮”“两字一顿打拍子” */

const POEMS = {
  guanju: {
    title: '关雎', author: '《诗经·周南》', layout: 'h',
    lines: [
      { t: '关关雎鸠，在河之洲。窈窕淑女，君子好逑。', r: '关关/雎鸠，在河/之洲。窈窕/淑女，君子/好逑。', y: '雎鸠鸟关关和鸣，在河中的小洲上。文静美好的姑娘，是君子的好配偶。' },
      { t: '参差荇菜，左右流之。窈窕淑女，寤寐求之。', r: '参差/荇菜，左右/流之。窈窕/淑女，寤寐/求之。', y: '长短不齐的荇菜，在船的左右两边捞取。文静美好的姑娘，醒着睡着都想追求她。' },
      { t: '求之不得，寤寐思服。悠哉悠哉，辗转反侧。', r: '求之/不得，寤寐/思服。悠哉/悠哉，辗转/反侧。', y: '追求她却得不到，日日夜夜思念她。思念绵绵不尽，翻来覆去睡不着。' },
      { t: '参差荇菜，左右采之。窈窕淑女，琴瑟友之。', r: '参差/荇菜，左右/采之。窈窕/淑女，琴瑟/友之。', y: '长短不齐的荇菜，在左右两边采摘。文静美好的姑娘，弹琴鼓瑟来亲近她。' },
      { t: '参差荇菜，左右芼之。窈窕淑女，钟鼓乐之。', r: '参差/荇菜，左右/芼之。窈窕/淑女，钟鼓/乐之。', y: '长短不齐的荇菜，在左右两边挑选。文静美好的姑娘，敲钟击鼓使她快乐。' },
    ],
    notes: {
      雎鸠: '一种水鸟，一般认为就是鱼鹰，传说雌雄形影不离（雎读 jū，鸠读 jiū）', 关关: '拟声词，鸟的鸣叫声', 之洲: '洲，水中的陆地',
      窈窕: '文静美好的样子（读 yǎo tiǎo）', 淑女: '善良美好的女子', 好逑: '好的配偶（好读 hǎo）。逑，配偶', 荇菜: '一种可食的水草',
      流之: '流，求取', 寤寐: '这里指日日夜夜。寤，醒时。寐，睡时（读 wù mèi）', 思服: '思念。服，思念', 悠哉: '悠哉悠哉：形容思念之情绵绵不尽',
      友之: '琴瑟友之：弹琴鼓瑟对她表示亲近', 芼之: '芼，挑选（读 mào）', 乐之: '钟鼓乐之：敲钟击鼓使她快乐',
    },
  },
  jianjia: {
    title: '蒹葭', author: '《诗经·秦风》', layout: 'h',
    lines: [
      { t: '蒹葭苍苍，白露为霜。所谓伊人，在水一方。溯洄从之，道阻且长。溯游从之，宛在水中央。', r: '蒹葭/苍苍，白露/为霜。所谓/伊人，在水/一方。溯洄/从之，道阻/且长。溯游/从之，宛在/水中央。', y: '芦苇茂盛，白露凝结成霜。我所思念的那个人，在河水的另一边。逆流而上去追寻她，道路艰险又漫长。顺流而下去追寻她，她好像在河水中央。' },
      { t: '蒹葭萋萋，白露未晞。所谓伊人，在水之湄。溯洄从之，道阻且跻。溯游从之，宛在水中坻。', r: '蒹葭/萋萋，白露/未晞。所谓/伊人，在水/之湄。溯洄/从之，道阻/且跻。溯游/从之，宛在/水中坻。', y: '芦苇茂盛，白露还没有干。我所思念的那个人，在河岸边。逆流而上去追寻她，道路艰险又陡峭。顺流而下去追寻她，她好像在水中的小高地上。' },
      { t: '蒹葭采采，白露未已。所谓伊人，在水之涘。溯洄从之，道阻且右。溯游从之，宛在水中沚。', r: '蒹葭/采采，白露/未已。所谓/伊人，在水/之涘。溯洄/从之，道阻/且右。溯游/从之，宛在/水中沚。', y: '芦苇茂盛鲜明，白露还没有完。我所思念的那个人，在河水边。逆流而上去追寻她，道路艰险又迂曲。顺流而下去追寻她，她好像在水中的小块陆地上。' },
    ],
    notes: {
      蒹葭: '芦苇（读 jiān jiā）', 苍苍: '茂盛的样子', 伊人: '那人，指所爱的人', 一方: '在水一方：在水的另一边，指对岸',
      溯洄: '溯洄从之：逆流而上去追寻。从，跟随、追寻（读 sù huí）', 道阻: '阻，艰险', 溯游: '顺流而下', 宛在: '宛在水中央：好像在水的中央，意思是相距不远却无法接近',
      萋萋: '茂盛的样子', 未晞: '晞，干（读 xī）', 之湄: '湄，岸边，水与草相接的地方（读 méi）', 且跻: '跻，（路）高而陡（读 jī）', 水中坻: '坻，水中的小高地（读 chí）',
      采采: '茂盛鲜明的样子', 未已: '没有完，这里指还没有干', 之涘: '涘，水边（读 sì）', 且右: '右，向右迂曲', 水中沚: '沚，水中的小块陆地（读 zhǐ）',
    },
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成诗句

/* 蒹葭三章：按句对齐，换字高亮 */
const SPLIT = (t) => t.split(/(?<=[，。])/).filter(Boolean);
const ROW_NOTES = [
  '苍苍 → 萋萋 → 采采：都是茂盛，换字换韵，读来回环。',
  '为霜 → 未晞 → 未已：露水由凝霜到未干到未完——时间在推移，追寻了很久。',
  '三章完全相同：“所谓伊人”反复咏唱，思念始终如一。',
  '一方 → 之湄 → 之涘：伊人的位置在变，若隐若现，捉摸不定。',
  '三章完全相同：“溯洄从之”——一次次逆流追寻。',
  '且长 → 且跻 → 且右：路长、路陡、路曲——越来越难。',
  '三章完全相同：“溯游从之”——再换个方向追寻。',
  '水中央 → 水中坻 → 水中沚：“宛在”——好像就在眼前，却总到不了。',
];
function buildChong() {
  const zs = POEMS.jianjia.lines.map((l) => SPLIT(l.t));
  const table = document.getElementById('cgTable');
  table.innerHTML = `<tr><th></th><th>第一章</th><th>第二章</th><th>第三章</th></tr>` + zs[0].map((_, r) => {
    const cells = zs.map((z) => [...z[r]]);
    const same = (i) => cells.every((c) => c[i] === cells[0][i]);
    return `<tr data-r="${r}"><th>${r + 1}</th>${cells.map((c) => `<td>${c.map((ch, i) => (same(i) ? ch : `<b>${ch}</b>`)).join('')}</td>`).join('')}</tr>`;
  }).join('');
  table.addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-r]');
    if (!tr) return;
    table.querySelectorAll('tr').forEach((x) => x.classList.toggle('cur', x === tr));
    document.getElementById('cgNote').textContent = ROW_NOTES[+tr.dataset.r];
  });
  document.getElementById('hlBtn').addEventListener('click', (e) => {
    const on = table.classList.toggle('hl');
    e.target.classList.toggle('solid', on);
  });
}

/* 打拍子：两字一顿 */
const BEATS = {
  guanju: { lines: ['关关雎鸠', '在河之洲', '窈窕淑女', '君子好逑'], rhyme: ['洲', '逑'] },
  jianjia: { lines: ['蒹葭苍苍', '白露为霜', '所谓伊人', '在水一方', '溯洄从之', '道阻且长', '溯游从之', '宛在水中央'], rhyme: ['苍', '霜', '方', '长', '央'] },
};
let beatKey = 'guanju';
let beatN = 0;
function renderBeat() {
  const b = BEATS[beatKey];
  let k = 0;
  document.getElementById('btLines').innerHTML = b.lines.map((line) => {
    const chars = [...line];
    const groups = chars.length === 5 ? [chars.slice(0, 2), chars.slice(2)] : [chars.slice(0, 2), chars.slice(2, 4)];
    return `<p>${groups.map((g) => {
      k += 1;
      return `<span class="bt-g${k <= beatN ? ' on' : ''}">${g.map((ch, i) => (i === g.length - 1 && b.rhyme.includes(ch) && g === groups[groups.length - 1] ? `<em>${ch}</em>` : ch)).join('')}</span>`;
    }).join('<i>|</i>')}</p>`;
  }).join('');
}
function initBeat() {
  document.querySelectorAll('[data-bp]').forEach((btn) => btn.addEventListener('click', () => {
    beatKey = btn.dataset.bp;
    beatN = 0;
    document.querySelectorAll('[data-bp]').forEach((x) => x.classList.toggle('solid', x === btn));
    renderBeat();
  }));
  document.getElementById('btTap').addEventListener('click', () => {
    const total = BEATS[beatKey].lines.length * 2;
    beatN = beatN >= total ? 1 : beatN + 1;
    renderBeat();
  });
  document.getElementById('btReset').addEventListener('click', () => { beatN = 0; renderBeat(); });
  renderBeat();
}

const MOMENTS = [
  {
    name: '译《关雎》一章', pic: 'xingcai',
    prompt: '另选《关雎》的一章，试着翻译成白话诗。',
    hint: '学余冠英：每句字数大致整齐，句末押韵，用口语，有民歌的味道。',
    example: '长长短短的荇菜，左边右边去捞采。那个好姑娘呀，醒了梦里都难忘怀。',
  },
  {
    name: '译《蒹葭》一章', pic: 'jianjia',
    prompt: '把《蒹葭》第一章翻译成白话诗。',
    hint: '保留“蒹葭”“白露”“伊人”的画面，保留“从之”“宛在”的追寻感；尽量押韵。',
    example: '芦苇青青一大片，白露凝霜冷清清。我想念的那个人，就在河水那一边。逆着水流去找她，道路难走又漫长；顺着水流去找她，好像就在水中央。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    Poem.init();
    buildChong();
    initBeat();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
  },
};
