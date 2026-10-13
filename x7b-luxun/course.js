'use strict';
/* 回忆鲁迅先生（节选）· 本课独有的“生活细节卡片墙”与旁批问答。通用部分见 ../shared/narrative.js */

/* cat：阅读提示里的三类琐事；t 片段名；q 课文原句；a 看到的鲁迅 */
const CARDS = [
  { cat: '朋友', t: '笑声', q: '若有人说了什么可笑的话，鲁迅先生笑得连烟卷都拿不住了，常常是笑得咳嗽起来。', a: '开朗，真诚，平易近人' },
  { cat: '起居', t: '走路', q: '他刚抓起帽子来往头上一扣，同时左腿就伸出去了，仿佛不顾一切地走去。', a: '干脆利落，精神饱满' },
  { cat: '朋友', t: '深夜送客', q: '鲁迅先生嘱咐许先生一定让坐小汽车回去，并且一定嘱咐许先生付钱。', a: '体贴，关心青年' },
  { cat: '朋友', t: '包饺子', q: '可是鲁迅先生还是在饭桌上举着筷子问许先生：“我再吃几个吗？”', a: '宽厚，懂得鼓励人' },
  { cat: '朋友', t: '“好久不见”', q: '周先生转身坐在躺椅上才自己笑起来，他是在开着玩笑。', a: '风趣幽默' },
  { cat: '朋友', t: '“天晴啦”', q: '许先生和鲁迅先生都笑着，一种对于冲破忧郁心境的展然的会心的笑。', a: '理解青年的心思' },
  { cat: '朋友', t: '青年来信', q: '但他还是展读着每封由不同角落里投来的青年的信，眼睛不济时，便戴起眼镜来看，常常看到夜里很深的时光。', a: '严格又爱护青年' },
  { cat: '朋友', t: '校样', q: '“擦一擦，拿着鸡吃，手是腻的。”', a: '随和，不拘小节，不看重名声' },
  { cat: '家人', t: '让车', q: '看完了电影出来，又只叫到一部汽车，鲁迅先生又一定不肯坐，让周建人先生的全家坐着先走了。', a: '谦让，处处为别人着想' },
  { cat: '家人', t: '桥边', q: '鲁迅先生坐在那儿，和一个乡下的安静老人一样。', a: '平和朴素，从容' },
  { cat: '起居', t: '休息', q: '“坐在椅子上翻一翻书就是休息了。”', a: '勤奋，惜时' },
  { cat: '家人', t: '鱼丸', q: '“他说不新鲜，一定也有他的道理，不加以查看就抹杀是不对的。”', a: '尊重孩子，实事求是' },
  { cat: '家人', t: '包书', q: '那包方方正正的，连一个角也不准歪一点或扁一点，而后拿着剪刀，把捆书的那绳头都剪得整整齐齐。', a: '认真细致，一丝不苟' },
  { cat: '起居', t: '病中', q: '死了是不要紧的，只要留给人类更多，鲁迅先生就是这样。', a: '忘我工作，无私奉献' },
];
const TILT = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 1.5];

function initWall() {
  const wall = document.getElementById('wall');
  wall.innerHTML = CARDS.map((c, i) => `<button type="button" class="note-card" data-i="${i}" data-cat="${c.cat}" style="--tilt:${TILT[i % TILT.length]}deg">
    <b>${c.t}</b><span class="nq">${c.q}</span><span class="na">我看到：${c.a}</span></button>`).join('');
  const count = () => {
    const shown = [...wall.children].filter((c) => !c.hidden);
    document.getElementById('wallCount').textContent = `${shown.filter((c) => c.classList.contains('open')).length} / ${shown.length} 张已打开`;
  };
  wall.addEventListener('click', (e) => {
    const card = e.target.closest('.note-card');
    if (card) { card.classList.toggle('open'); count(); }
  });
  document.querySelector('.wall-tools').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    document.querySelectorAll('.wall-tools .btn').forEach((x) => x.classList.toggle('solid', x === b));
    [...wall.children].forEach((c) => { c.hidden = Boolean(b.dataset.cat) && c.dataset.cat !== b.dataset.cat; });
    count();
  });
  count();
}

/* 旁批问答；cut：可“删掉试试”的句子 */
const PANGPI = [
  { q: '“喜欢吃硬的东西”，有人说这里暗示鲁迅先生刚硬的性格。你同意这种看法吗？', a: '可以讨论，言之成理即可。作者只是如实记下饮食习惯；读者可以由此联想，但要注意别过度解读——这正是“生活化的鲁迅”。' },
  { q: '写海婴，写许先生，跟写鲁迅先生有什么关系？', a: '侧面烘托：海婴的天真、许先生的忙碌与辛劳，写出了鲁迅家里的生活气息；许先生把家务全担起来，鲁迅才能专心工作，“头发有些是白了的”也让人心疼。' },
  {
    q: '如果把“陪到八点钟，十点钟”这句删掉，效果有何不同？', a: '时间一点点往后推，读的人也跟着“陪”得越来越久，感受到鲁迅待客的耐心和辛苦；删掉后只剩一个结果，没有了这种绵长的感觉。',
    full: '于是又陪下去，陪到八点钟，十点钟，常常陪到十二点钟。', cut: '于是又陪下去，常常陪到十二点钟。',
  },
  { q: '“我”的回答（“天晴啦，太阳出来啦。”）是否有所暗示？', a: '暗示“我”心里的忧郁一扫而光。鲁迅和许先生听懂了，所以“会心”地笑——他们懂得这个年轻人。' },
  { q: '鱼丸这件事反映了鲁迅先生什么品质？', a: '尊重孩子，不因为是小孩的话就忽视；凡事要“查看”，实事求是。' },
  { q: '一边对潦草的书信“深恶痛绝”，一边仍展读每封来信，这反映鲁迅先生对待青年怎样的态度？', a: '要求严格，又真心爱护：批评的是“存心”，关心的是写信的人。' },
];

function initPangpi() {
  const box = document.getElementById('ppList');
  box.innerHTML = PANGPI.map((p, i) => `<div class="pp-row" data-i="${i}"><p class="pp-q"><i>${i + 1}</i>${p.q}</p>
    ${p.full ? `<p class="pp-cut">${p.full}</p>` : ''}
    <div class="btns">${p.full ? '<button type="button" class="btn" data-act="cut">删掉试试</button>' : ''}<button type="button" class="btn" data-act="ans">看看参考</button></div>
    <p class="pp-a">${p.a}</p></div>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const row = b.closest('.pp-row');
    const p = PANGPI[+row.dataset.i];
    if (b.dataset.act === 'ans') { row.classList.toggle('show'); return; }
    const cut = row.classList.toggle('cut');
    row.querySelector('.pp-cut').textContent = cut ? p.cut : p.full;
    b.textContent = cut ? '还原原句' : '删掉试试';
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initWall();
    initPangpi();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
