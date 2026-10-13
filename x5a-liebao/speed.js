'use strict';
/* 提高阅读速度 · 小工具（五上第二单元四课各放一份相同拷贝：x5a-dashi / x5a-jiangxianghe / x5a-liebao / x5a-didaozhan）
 * 在 course.js 之前加载；LESSON.init 里调用 Speed.init()，onRender 里调用 Speed.onRender(slide)。
 *   计时阅读  <div class="sp-timer" data-noswipe><div class="sp-text"><p>原文</p>…</div></div>
 *             点“开始计时”原文才显示；“读完了”算出用时、字数（只数汉字和数字）、每分钟字数，每次记一行。
 *   连词成句  <div class="sp-pacer" data-noswipe data-text="秦国的国君|历来|不守信用，/我怕|有负赵王所托，/…">
 *             / 分句子里的意群，| 再把意群分成词（可不写 |）。逐字 / 逐词 / 连词成句三种读法依次点亮，
 *             读完比一比眼睛停了几次、用了几秒（时间按每次停顿的固定节奏估算，只作对比演示）。
 *   闪卡      <div class="sp-flash" data-noswipe data-items="词语|句子|…">  闪现一下就遮住，看谁一眼看完。
 *   关键词句  <button data-kw>：切换本页 .kw-on，.kwable 里非关键内容变淡，.kw 高亮。
 */
const Speed = (() => {
  const GOAL = 300; // 课标第三学段：默读一般读物每分钟不少于 300 字
  const TOO_FAST = 1200; // 超过这个速度多半是没读完就点了
  const TICK_MS = 250;
  // 每停一次的演示时长：逐字固定；逐词、连词成句按字数略加长
  const PACE_MS = { char: () => 200, word: (n) => 220 + 40 * n, chunk: (n) => 300 + 30 * n };
  const PACE_NAME = { char: '一个字一个字地读', word: '一个词一个词地读', chunk: '连词成句地读' };
  const FLASH_MS = 800;
  const countChars = (s) => (s.match(/[一-鿿]/g) || []).length + (s.match(/\d+/g) || []).length;
  const mmss = (ms) => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const words = (ms) => { const s = Math.max(1, Math.round(ms / 1000)); return `${Math.floor(s / 60)} 分 ${s % 60} 秒`; };

  /* ---------- 计时阅读 ---------- */
  function initTimer(box) {
    const text = box.querySelector('.sp-text');
    const total = countChars(text.textContent);
    box.insertAdjacentHTML('afterbegin', `<div class="sp-bar">
      <button class="btn solid" type="button" data-sp="start">开始计时</button>
      <button class="btn" type="button" data-sp="stop" disabled>读完了</button>
      <span class="sp-clock">0:00</span><span class="sp-total">全文约 ${total} 字</span></div>`);
    box.insertAdjacentHTML('beforeend', '<ol class="sp-log"></ol>');
    box.classList.add('sp-wait');
    const $ = (sel) => box.querySelector(sel);
    let t0 = 0;
    let timer = null;
    const tick = () => { $('.sp-clock').textContent = mmss(Date.now() - t0); };
    box.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-sp]');
      if (!btn) return;
      if (btn.dataset.sp === 'start') {
        clearInterval(timer);
        t0 = Date.now();
        timer = setInterval(tick, TICK_MS);
        tick();
        text.scrollTop = 0;
        box.classList.remove('sp-wait');
        box.classList.add('sp-run');
        $('[data-sp="start"]').textContent = '重新计时';
        $('[data-sp="stop"]').disabled = false;
        return;
      }
      if (!timer) return;
      clearInterval(timer);
      timer = null;
      const ms = Date.now() - t0;
      const rate = Math.round(total / (ms / 60000));
      box.classList.remove('sp-run');
      $('[data-sp="stop"]').disabled = true;
      $('[data-sp="start"]').textContent = '再读一次';
      const tooFast = rate > TOO_FAST;
      const ok = rate >= GOAL && !tooFast;
      const say = tooFast ? '这么快？真的读完、读懂了吗？' : ok ? `达到了每分钟 ${GOAL} 字` : '集中注意力，不回读，再试一次';
      $('.sp-log').insertAdjacentHTML('beforeend', `<li class="${ok ? 'ok' : ''}">用时 <b>${words(ms)}</b>，每分钟约 <b>${rate}</b> 字<small>${say}</small></li>`);
    });
  }

  /* ---------- 连词成句 ---------- */
  const pacers = [];
  function initPacer(box) {
    const chunks = box.dataset.text.split('/');
    const hasWords = box.dataset.text.includes('|');
    const modes = hasWords ? ['char', 'word', 'chunk'] : ['char', 'chunk'];
    const wordHtml = (w) => `<span class="wd">${[...w].map((ch) => `<i>${ch}</i>`).join('')}</span>`;
    box.innerHTML = `<div class="btns">${modes.map((m) => `<button class="btn" type="button" data-pace="${m}">${PACE_NAME[m]}</button>`).join('')}</div>
      <p class="sp-pace">${chunks.map((c) => `<span class="ck">${c.split('|').map(wordHtml).join('')}</span>`).join('')}</p>
      <p class="sp-pace-res"></p>`;
    const state = { box, timer: null };
    pacers.push(state);
    box.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-pace]');
      if (btn) runPacer(state, btn.dataset.pace);
    });
  }

  function stopPacer(state) {
    clearTimeout(state.timer);
    state.timer = null;
  }

  const UNIT = { char: '.sp-pace i', word: '.sp-pace .wd', chunk: '.sp-pace .ck' };
  function runPacer(state, mode) {
    const { box } = state;
    stopPacer(state);
    const units = [...box.querySelectorAll(UNIT[mode])];
    box.querySelectorAll('.sp-pace .now, .sp-pace .read').forEach((u) => u.classList.remove('now', 'read'));
    box.querySelectorAll('[data-pace]').forEach((b) => b.classList.toggle('solid', b.dataset.pace === mode));
    box.querySelector('.sp-pace').dataset.mode = mode;
    const res = box.querySelector('.sp-pace-res');
    res.textContent = '';
    const ms = units.map((u) => PACE_MS[mode](u.textContent.length));
    let k = 0;
    const step = () => {
      if (k > 0) units[k - 1].classList.replace('now', 'read');
      if (k === units.length) {
        const sec = (ms.reduce((a, b) => a + b, 0) / 1000).toFixed(1);
        res.innerHTML = `${PACE_NAME[mode]}：眼睛停了 <b>${units.length}</b> 次，用了约 <b>${sec}</b> 秒。`;
        state.timer = null;
        return;
      }
      units[k].classList.add('now');
      state.timer = setTimeout(step, ms[k]);
      k += 1;
    };
    step();
  }

  /* ---------- 闪卡 ---------- */
  function initFlash(box) {
    const items = box.dataset.items.split('|');
    box.innerHTML = `<div class="sp-card"><span>点“闪一下”，看谁一眼看完卡片上的所有内容</span></div>
      <div class="btns"><button class="btn solid" type="button" data-fl="go">闪一下</button>
      <button class="btn" type="button" data-fl="show">揭晓</button><span class="sp-fl-n"></span></div>`;
    const card = box.querySelector('.sp-card');
    let i = -1;
    let hideTimer = null;
    const show = (masked) => {
      card.classList.toggle('masked', masked);
      card.innerHTML = masked ? '<span>刚才卡片上写的是什么？说一说</span>' : `<span>${items[i]}</span>`;
    };
    box.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-fl]');
      if (!btn) return;
      clearTimeout(hideTimer);
      if (btn.dataset.fl === 'go') {
        i = (i + 1) % items.length;
        box.querySelector('.sp-fl-n').textContent = `第 ${i + 1} / ${items.length} 张`;
        show(false);
        hideTimer = setTimeout(() => show(true), FLASH_MS);
      } else if (i >= 0) {
        show(false);
      }
    });
  }

  /* ---------- 关键词句 ---------- */
  function initKeyToggle(btn) {
    const label = btn.textContent;
    btn.addEventListener('click', () => {
      const on = btn.closest('.slide').classList.toggle('kw-on');
      btn.classList.toggle('solid', on);
      btn.textContent = on ? '显示全文' : label;
    });
  }

  return {
    init() {
      document.querySelectorAll('.sp-timer').forEach(initTimer);
      document.querySelectorAll('.sp-pacer').forEach(initPacer);
      document.querySelectorAll('.sp-flash').forEach(initFlash);
      document.querySelectorAll('[data-kw]').forEach(initKeyToggle);
    },
    // 离开本页就停下连词成句的演示
    onRender(slide) {
      pacers.forEach((p) => { if (!slide.contains(p.box)) stopPacer(p); });
    },
  };
})();
