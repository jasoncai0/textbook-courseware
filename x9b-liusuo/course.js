'use strict';
/* 溜索 · 本课数据与互动：惊险分镜慢放（监视器 + 胶片条 + 自动慢放）、炼字翻卡、补上“我”字对比、慢镜头写作 */

/* ---------- 分镜：pic 图片，pos 取景位置，shot 景别 ---------- */
const FRAMES = [
  { shot: '黑场 · 声音', pic: 'xiagu', pos: '50% 20%', t: '不信这声音就是怒江。首领也不多说，用小腿磕一下马。马却更觉迟疑，牛们也慢下来。' },
  { shot: '远景 · 鹰', pic: 'xiagu', pos: '70% 35%', t: '一只大鹰旋了半圈，忽然一歪身，扎进山那侧的声音里。马帮像是得到信号，都止住了。' },
  { shot: '大远景 · 俯拍', pic: 'xiagu', pos: '50% 80%', t: '万丈绝壁飞快垂下去，马帮原来就在这壁顶上。转了多半日，总觉山低风冷，却不料一直是在万丈之处盘桓。' },
  { shot: '主观镜头', pic: 'xiagu', pos: '50% 95%', t: '俯望那江，蓦地心中一颤，惨叫一声。急转身，却什么也没有，只是再不敢轻易向下探视。' },
  { shot: '特写 · 索', pic: 'liusuo', pos: '30% 30%', t: '那索似有千钧之力，扯住两岸石壁，谁也动弹不得，仿佛再有锱铢之力加在上面，不是山倾，就是索崩。' },
  { shot: '中景 · 飞身', pic: 'liusuo', pos: '50% 40%', t: '只一跃，腿已入套。脚一用力，飞身离岸，嗖的一下小过去，' },
  { shot: '俯拍 · 鹰在人下', pic: 'liusuo', pos: '50% 85%', t: '那只大鹰在瘦小汉子身下十余丈处移来移去，翅膀尖上几根羽毛被风吹得抖。' },
  { shot: '主观 · 天像海', pic: 'liusuo', pos: '50% 0%', t: '猛一送，只觉耳边生风，聋了一般，任什么也听不见，僵着脖颈盯住天，倒像俯身看海。' },
  { shot: '特写 · 手', pic: 'liusuo', pos: '45% 25%', t: '这索由十几股竹皮扭绞而成，磨得赛刀。手划出血来，黏黏的反倒抓得紧索。' },
  { shot: '近景 · 落地', pic: 'duian', pos: '40% 60%', t: '猛地耳边有人笑：“看脚底板！”方才觉出已到索头，几个汉子笑着在吃烟，眼纹一直扯到耳边。' },
  { shot: '远景 · 鹰捕蛇', pic: 'duian', pos: '80% 30%', t: '那鹰斜移着，忽然一栽身，射到壁上，顷刻又飞起来，翅膀一鼓一鼓地扇动。' },
];
const SLOW_MS = 5200;

function buildStrip() {
  document.getElementById('strip').innerHTML = FRAMES.map((f, i) => `<button type="button" class="sf" data-i="${i}">
    <i data-bg="assets/${f.pic}.jpg" style="background-position:${f.pos}"></i><b>${i + 1}</b><span>${f.shot}</span></button>`).join('');
}
buildStrip();

function initBoard() {
  let cur = 0;
  let timer = null;
  const pic = document.getElementById('monPic');
  const btn = document.getElementById('slowBtn');
  const show = (i) => {
    cur = (i + FRAMES.length) % FRAMES.length;
    const f = FRAMES[cur];
    pic.classList.remove('kb');
    void pic.offsetWidth; // 重新触发推镜动画
    pic.style.backgroundImage = `url(assets/${f.pic}.jpg)`;
    pic.style.backgroundPosition = f.pos;
    pic.classList.toggle('dark', cur === 0);
    pic.classList.add('kb');
    document.getElementById('monShot').textContent = `第 ${cur + 1} 格 · ${f.shot}`;
    document.getElementById('monTxt').textContent = f.t;
    document.getElementById('fNo').textContent = `${cur + 1} / ${FRAMES.length}`;
    document.querySelectorAll('#strip .sf').forEach((s, k) => s.classList.toggle('on', k === cur));
  };
  const stop = () => { clearInterval(timer); timer = null; btn.textContent = '▶ 慢放'; };
  btn.addEventListener('click', () => {
    if (timer) { stop(); return; }
    btn.textContent = '❚❚ 暂停';
    timer = setInterval(() => { if (cur === FRAMES.length - 1) stop(); else show(cur + 1); }, SLOW_MS);
  });
  document.getElementById('prevF').addEventListener('click', () => { stop(); show(cur - 1); });
  document.getElementById('nextF').addEventListener('click', () => { stop(); show(cur + 1); });
  document.getElementById('strip').addEventListener('click', (e) => {
    const s = e.target.closest('.sf');
    if (s) { stop(); show(+s.dataset.i); }
  });
  show(0);
  return stop;
}

/* ---------- 炼字 ---------- */
const CLUES = [
  { q: '首领也不多说，用小腿磕一下马。', a: '“磕”：轻轻一碰，不用鞭也不用喊——写出首领的沉稳老练，也写出马的“迟疑”。' },
  { q: '马帮如极稠的粥，慢慢流向那个山口。', a: '“极稠的粥”“流”：牛马挤成一团，缓慢、黏滞地向前挪——不愿走，又不得不走。' },
  { q: '那索似有千钧之力，扯住两岸石壁，谁也动弹不得。', a: '“扯”：一根索像要把两岸拉到一起，紧绷到极点——再加一点力，“不是山倾，就是索崩”。' },
  { q: '汉子们咦咦喂喂地吼起来，停一刻，又吼着撞那回声。', a: '“撞”：吼声和回声像实物一样相撞，峡谷之空旷、汉子们之豪壮，都在这一个字里。' },
  { q: '脚倒像生下来第一遭知道世界上还有土地，亲亲热热跺几下。', a: '“亲亲热热跺几下”：死里逃生后对土地的亲近和庆幸，惊魂未定又如释重负。' },
];

/* ---------- 补上“我”字 ---------- */
const ME = [
  '不由捏紧了心，准备一睹气贯滇西的那江',
  '俯望那江，蓦地心中一颤，惨叫一声',
  '战战兢兢跨上角框',
  '渐渐就有血溅到唇上、鼻子上，自然顾不到，命在天上',
  '上得马上，才觉出一身黏汗，风吹得身子抖起来',
];

function initMe() {
  const list = document.getElementById('meList');
  list.innerHTML = ME.map((t) => `<p><ins>我</ins>${t}。</p>`).join('');
  document.getElementById('meBtn').addEventListener('click', (e) => {
    const on = list.classList.toggle('with-me');
    e.target.textContent = on ? '去掉“我”字' : '补上“我”字试试';
  });
}

const MOMENTS = [
  {
    name: '第一次跳水', pic: 'liusuo',
    prompt: '写你第一次从高处跳下（跳水、蹦床、跳马）的那几秒。',
    hint: '把一秒拆成几格：站上去时看到的、迈出那一步时听到的、身体悬空时的感觉、落下后脚和腿的反应。',
    example: '站在三米板的尽头，水面像一块晃动的蓝玻璃，远得发亮。教练喊了一声，耳朵里只剩自己的心跳。脚一蹬，风从耳边擦过，肚子里空了一下，眼前一白——“啪”，凉水一下子灌进鼻子。爬上岸，腿还在抖，脚踩在湿瓷砖上，觉得地面真结实。',
  },
  {
    name: '走过独木桥', pic: 'xiagu',
    prompt: '写一次走过高处窄桥、栈道或悬崖边小路的经历。',
    hint: '学课文：不写“我很害怕”，只写看到的、听到的、身体的反应；可以写一写身边的人怎样从容。',
    example: '桥板只有一掌宽，底下的溪水哗哗地响，越听越远。眼睛不敢往下，只盯着前面爷爷的后脚跟。手心攥出了汗，滑滑的抓不住绳。爷爷回头笑：“看前头，别看脚。”走到对岸，腿一软，坐在石头上半天没说话。',
  },
];

let stopSlow = () => {};
window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: ['读这一句', '品这个字'], moments: MOMENTS });
    stopSlow = initBoard();
    initMe();
  },
  onRender: (slide, step) => {
    if (!slide.classList.contains('s-board')) stopSlow();
    Narrative.onRender(slide, step);
  },
};
