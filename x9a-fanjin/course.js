'use strict';
/* 范进中举 · 本课数据与互动：喜极而疯慢镜头、中举前后对比开关、喜剧悲剧投票、可笑背后、读写迁移。通用部分见 ../shared/narrative.js */

/* 慢镜头：t 原文（课本原文），tag 描写类型，note 批注 */
const FRAMES = [
  { t: '范进不看便罢，看了一遍，又念一遍，', tag: '动作', note: '看了又念——不敢相信，反复确认。' },
  { t: '自己把两手拍了一下，笑了一声道：“噫！好了！我中了！”', tag: '动作 · 语言', note: '几十年的期盼一下子实现，狂喜。' },
  { t: '说着，往后一交跌倒，牙关咬紧，不省人事。', tag: '神态', note: '喜极攻心，承受不住。' },
  { t: '他爬将起来，又拍着手大笑道：“噫！好！我中了！”', tag: '动作 · 语言', note: '“笑了一声”变成“大笑”，“好了”变成“好”——已经失常。' },
  { t: '笑着，不由分说，就往门外飞跑，把报录人和邻居都吓了一跳。', tag: '动作', note: '疯态外露，旁人都吓了一跳。' },
  { t: '走出大门不多路，一脚踹在塘里，挣起来，头发都跌散了，两手黄泥，淋淋漓漓一身的水，', tag: '外貌', note: '狼狈不堪，自己却毫无知觉。' },
  { t: '众人拉他不住，拍着笑着，一直走到集上去了。', tag: '动作', note: '彻底疯了。笑声背后，是科举对读书人的毒害。' },
];

function initSlow() {
  const list = document.getElementById('frames');
  const no = document.getElementById('slowNo');
  let cur = 0;
  list.innerHTML = FRAMES.map((f, i) => `<li class="fr" data-i="${i}"><span class="fr-t">${f.t}</span><span class="fr-n"><i>${f.tag}</i>${f.note}</span></li>`).join('');
  const show = (i) => {
    cur = Math.max(0, Math.min(FRAMES.length - 1, i));
    list.querySelectorAll('.fr').forEach((li, k) => {
      li.classList.toggle('seen', k <= cur);
      li.classList.toggle('cur', k === cur);
    });
    no.textContent = `${cur + 1} / ${FRAMES.length}`;
    document.querySelector('.slow-pic').style.setProperty('--z', 1 + cur * 0.06);
  };
  document.getElementById('slowPrev').addEventListener('click', () => show(cur - 1));
  document.getElementById('slowNext').addEventListener('click', () => show(cur + 1));
  document.getElementById('slowAll').addEventListener('click', () => {
    list.querySelectorAll('.fr').forEach((li) => li.classList.add('seen'));
  });
  list.addEventListener('click', (e) => {
    const li = e.target.closest('.fr');
    if (li) show(+li.dataset.i);
  });
  show(0);
}

/* 中举前后：who 人物，k 方面，a 中举前，b 中举后（课本原文） */
const ROWS = [
  { who: '胡屠户', k: '称呼', a: '“我自倒运，把个女儿嫁与你这现世宝穷鬼”', b: '“贤婿老爷，方才不是我敢大胆，是你老太太的主意”' },
  { who: '胡屠户', k: '评价', a: '“像你这尖嘴猴腮，也该撒抛尿自己照照！”', b: '“我的这个贤婿，才学又高，品貌又好”' },
  { who: '胡屠户', k: '贺礼', a: '手里拿着一副大肠和一瓶酒', b: '提着七八斤肉，四五千钱，正来贺喜' },
  { who: '胡屠户', k: '动作', a: '被胡屠户一口啐在脸上，骂了一个狗血喷头', b: '一路低着头替他扯了几十回' },
  { who: '众邻居', k: '表现', a: '家里已是饿了两三天。', b: '有拿鸡蛋来的，有拿白酒来的，也有背了斗米来的，也有捉两只鸡来的。' },
  { who: '张乡绅', k: '表现', a: '“世先生同在桑梓，一向有失亲近。”', b: '“谨具贺仪五十两……弟有空房一所……就送与世先生”' },
];

function initFlip() {
  const table = document.getElementById('flipTable');
  table.innerHTML = `<div class="ft-row ft-head"><span></span><span>中举前</span><span>中举后</span></div>` +
    ROWS.map((r) => `<div class="ft-row"><span class="ft-k"><b>${r.who}</b>${r.k}</span><span class="ft-a">${r.a}</span><span class="ft-b">${r.b}</span></div>`).join('');
  document.querySelector('.switch').addEventListener('click', (e) => {
    const b = e.target.closest('.sw');
    if (!b) return;
    document.querySelectorAll('.sw').forEach((x) => x.classList.toggle('cur', x === b));
    table.dataset.v = b.dataset.v;
  });
}

function initVote() {
  document.querySelector('.vote').addEventListener('click', (e) => {
    const b = e.target.closest('.vt');
    if (!b) return;
    const em = b.querySelector('em');
    em.textContent = +em.textContent + 1;
  });
}

const PICKS = {
  laugh: [
    { t: '“天上的星宿是打不得的！”', ok: true, why: '把举人当神仙——对功名的迷信' },
    { t: '“果然天上‘文曲星’是打不得的，而今菩萨计较起来了。”', ok: true, why: '手疼本是心虚，却归于菩萨——愚昧' },
    { t: '屠户把银子攥在手里紧紧的，把拳头舒过来', ok: true, why: '嘴上推辞，手里攥紧——贪财又虚伪' },
    { t: '“晚生久仰老先生，只是无缘，不曾拜会。”', ok: true, why: '刚中举就满口官场套话' },
    { t: '张乡绅四面将眼睛望了一望，说道：“世先生果是清贫。”', ok: true, why: '送银送房，是在拉拢“新贵”' },
    { t: '“胡老爹方才这个嘴巴打的亲切，少顷范老爷洗脸，还要洗下半盆猪油来！”', ok: true, why: '邻居打趣，满场都是看热闹的人' },
  ],
};

const MOMENTS = [
  {
    name: '细节：攥银子', pic: 'cheji',
    prompt: '积累拓展四.3：分析“屠户把银子攥在手里紧紧的，把拳头舒过来……屠户连忙把拳头缩了回去，往腰里揣”这一细节的表达效果。',
    hint: '抓住“攥”“紧紧的”“舒”“连忙”“缩”“揣”几个动词，说说胡屠户心里在想什么。',
    example: '“攥在手里紧紧的”说明他舍不得放手；“把拳头舒过来”是做做样子的推辞；范进一说“还有这几两银子”，他就“连忙”缩回、“往腰里揣”——几个动作把胡屠户贪财又要面子的虚伪写得活灵活现。',
  },
  {
    name: '改编课本剧', pic: 'baoxi',
    prompt: '积累拓展五：选“报喜—发疯”或“胡屠户打醒女婿”一段，改编成课本剧片段。',
    hint: '先写舞台说明（时间、地点、布景），再写人物台词，动作和神态放在括号里。',
    example: '【时间：出榜那日上午　地点：范家茅草棚】\n（锣声大作，三个报录人冲进门。）\n报录人：（高声）快请范老爷出来，恭喜高中了！\n老太太：（从屋里探出头，声音发抖）诸位请坐，小儿方才出去了……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ picks: PICKS, moments: MOMENTS });
    initSlow();
    initFlip();
    initVote();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
