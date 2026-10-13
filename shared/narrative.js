'use strict';
/* 课本插件 · 记叙文模板逻辑。在本课 course.js 之前加载；本课 LESSON.init 里调用 Narrative.init(STORY)，onRender 里调用 Narrative.onRender。
 * STORY 是本课数据：{ plot, sort, kinds, clues, clueLabels, moments, momentStart, picks }，结构见下方各函数注释。
 * 故事页约定（.slide.scene）：
 *   .scene-bg            背景画（div 用 data-bg="assets/x.jpg"（按需加载），或 <video>）
 *   [data-focus="s x% y%"] 镜头：缩放 s，朝 (x, y) 推近；写在 .scene-bg 上是初始镜头，写在字幕行上是走到这一步时的镜头
 *   .subs p[data-step]   字幕式原文；只留最近 SUB_KEEP 句
 *   .rain-layer .rain    雨（.r1/.r2/.r3 由小到大，可配 data-step 逐级加大）
 *   .whiteout / .shake   留白、镜头晃动（配 data-step 使用）
 *   [data-plot="0~1"] [data-plot-text]  情节曲线位置与说明；写在 slide 上或字幕行上
 */
const Narrative = (() => {
  const SUB_KEEP = 3;
  const DEFAULT_FOCUS = '1.06 50% 50%';
  const RAIN = { r1: { n: 50, slant: 4, dur: 1 }, r2: { n: 110, slant: 9, dur: .7 }, r3: { n: 200, slant: 14, dur: .45 } };
  const RAIN_DEFAULT = { n: 80, slant: 6, dur: .8 };
  const rand = (a, b) => a + Math.random() * (b - a);

  function fillRain(g) {
    const kind = Object.keys(RAIN).find((k) => g.classList.contains(k));
    const { n, slant, dur } = RAIN[kind] || RAIN_DEFAULT;
    g.innerHTML = Array.from({ length: n }, () => {
      const x = rand(-20, 820);
      const y = rand(-60, 0);
      return `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x - slant).toFixed(0)}" y2="${(y + 22).toFixed(0)}" style="animation-duration:${dur}s;animation-delay:${rand(0, dur).toFixed(2)}s"/>`;
    }).join('');
  }

  /* 情节曲线：开端缓、发展升、高潮顶、结局落 */
  const CURVE = 'M10 58 C 50 54, 80 44, 110 30 S 140 6, 150 8 S 170 40, 192 52';
  const STAGES = [['开端', 22], ['发展', 82], ['高潮', 150], ['结局', 186]];

  function buildPlotline() {
    const box = document.createElement('div');
    box.className = 'plotline';
    box.id = 'plotline';
    box.innerHTML = `<svg viewBox="0 0 200 76">
      <path class="curve" d="${CURVE}"/>
      <path class="done" id="plotDone" d="${CURVE}"/>
      ${STAGES.map(([t, x]) => `<text class="stage" x="${x}" y="72">${t}</text>`).join('')}
      <circle class="dot" id="plotDot" r="5" cx="10" cy="58"/>
    </svg><span id="plotText"></span>`;
    document.getElementById('frame').appendChild(box);
    const done = box.querySelector('#plotDone');
    const len = done.getTotalLength();
    done.style.strokeDasharray = len;
    done.style.strokeDashoffset = len;
  }

  function latestOn(slide, step, attr) {
    let hit = null;
    slide.querySelectorAll(`[${attr}][data-step]`).forEach((el) => { if (+el.dataset.step <= step) hit = el; });
    return hit;
  }

  function updatePlot(slide, step) {
    const box = document.getElementById('plotline');
    const src = latestOn(slide, step, 'data-plot') || (slide.dataset.plot !== undefined ? slide : null);
    box.classList.toggle('show', Boolean(src));
    if (!src) return;
    const p = Math.max(0, Math.min(1, +src.dataset.plot));
    const done = document.getElementById('plotDone');
    const len = done.getTotalLength();
    const pt = done.getPointAtLength(len * p);
    done.style.strokeDashoffset = len * (1 - p);
    const dot = document.getElementById('plotDot');
    dot.setAttribute('cx', pt.x.toFixed(1));
    dot.setAttribute('cy', pt.y.toFixed(1));
    document.getElementById('plotText').textContent = src.dataset.plotText || '';
  }

  function updateScene(slide, step) {
    const bg = slide.querySelector('.scene-bg');
    if (bg) {
      const src = latestOn(slide, step, 'data-focus');
      const [s, x, y] = (src ? src.dataset.focus : (bg.dataset.focus || DEFAULT_FOCUS)).split(' ');
      bg.style.transformOrigin = `${x} ${y}`;
      // 竖屏手机只能看到画面的一窄条：裁切位置跟着镜头焦点走（16:9 屏上图片铺满，这两项不起作用）
      bg.style.backgroundPosition = `${x} ${y}`;
      bg.style.objectPosition = `${x} ${y}`;
      bg.style.transform = `scale(${s})`;
    }
    const lines = [...slide.querySelectorAll('.subs p[data-step]')];
    const shown = lines.filter((p) => +p.dataset.step <= step);
    lines.forEach((p) => {
      const idx = shown.indexOf(p);
      p.classList.toggle('now', idx === shown.length - 1);
      p.classList.toggle('gone', idx >= 0 && idx < shown.length - SUB_KEEP);
    });
  }

  // 只让当前页的视频播放
  function updateVideos(slide) {
    document.querySelectorAll('.slide video.scene-bg').forEach((v) => {
      if (v.closest('.slide') === slide) v.play().catch(() => { /* 浏览器拒绝自动播放时停在封面帧即可 */ });
      else v.pause();
    });
  }


  /* ================= 品读 · 情节曲线（数据：story.plot，x/y 为百分比位置，step 为第几步出现） ================= */
  let plot = [];
  let plotRatio = 0;

  // 按情节板的实际像素尺寸画曲线：不拉伸，虚线长度和 getTotalLength 一致（之前用 non-scaling-stroke 会画不满）
  function drawPlotCurve(board) {
    const w = board.clientWidth;
    const h = board.clientHeight;
    if (!w || !h) return;
    const d = `M0 ${h} ${plot.map((p) => `L${(p.x / 100 * w).toFixed(1)} ${(p.y / 100 * h).toFixed(1)}`).join(' ')}`;
    const svg = board.querySelector('svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.querySelectorAll('path').forEach((el) => el.setAttribute('d', d));
    const done = svg.querySelector('#plotBoardDone');
    const len = done.getTotalLength();
    done.style.strokeDasharray = len;
    done.style.strokeDashoffset = len * (1 - plotRatio);
  }

  function buildPlotBoard(board) {
    board.innerHTML = `<svg><path class="curve"/><path class="curve-done" id="plotBoardDone"/></svg>` +
      plot.map((p) => `<div class="plot-card" data-step="${p.step}" style="left:${p.x}%;top:${p.y}%">
        <div class="pic" data-bg="assets/${p.pic}.jpg" style="background-position:${p.pos || 'center'}"></div><b>${p.stage}</b><span>${p.text}</span></div>`).join('');
    drawPlotCurve(board);
    new ResizeObserver(() => drawPlotCurve(board)).observe(board);
  }

  function updatePlotBoard(slide, step) {
    const board = slide.querySelector('#plotBoard');
    if (!board || !plot.length) return;
    // 曲线画到最后一张出现的卡片为止
    plotRatio = plot.filter((p) => p.step <= step).length / plot.length;
    drawPlotCurve(board);
  }

  /* ================= 品读 · 给句子分类（数据：story.sort / story.kinds） ================= */
  function initSort(list, items, kinds) {
    list.innerHTML = items.map((it, i) => `<div class="sort-row" data-i="${i}">
      <span class="s">${it.s}</span>
      <span class="btns">${kinds.map((k) => `<button class="btn" type="button" data-k="${k}">${k}</button>`).join('')}</span>
      <span class="res"></span></div>`).join('');
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-k]');
      if (!btn) return;
      const row = btn.closest('.sort-row');
      const item = items[+row.dataset.i];
      row.classList.remove('no');
      if (item.ok.includes(btn.dataset.k)) {
        row.classList.add('ok');
        row.querySelectorAll('button').forEach((b) => b.classList.toggle('solid', b === btn));
        row.querySelector('.res').textContent = `→ ${item.q}`;
      } else {
        void row.offsetWidth; // 重新触发抖动动画
        row.classList.add('no');
        row.querySelector('.res').textContent = '再想想';
      }
    });
  }

  /* ================= 品读 · 翻卡片（数据：story.clues，正反面标签 story.clueLabels） ================= */
  function initClues(box, clues, [front, back]) {
    box.innerHTML = clues.map((c) => `<button class="clue" type="button"><div class="clue-in">
      <div class="clue-face front"><small>${front}（点一点翻面）</small>${c.q}</div>
      <div class="clue-face back"><small>${back}</small>${c.a}</div></div></button>`).join('');
    box.addEventListener('click', (e) => {
      const card = e.target.closest('.clue');
      if (card) card.classList.toggle('flipped');
    });
  }

  /* ================= 读与写 · 朗读符号 ================= */
  function initReading(btn) {
    btn.addEventListener('click', () => {
      const on = btn.closest('.slide').classList.toggle('marks-on');
      btn.textContent = on ? '隐藏朗读符号' : '显示朗读符号';
    });
  }

  /* ================= 读与写 · 走进人物内心（数据：story.moments） ================= */
  function initMoments(moments, start) {
    const $ = (id) => document.getElementById(id);
    const show = (i) => {
      const m = moments[i];
      document.querySelectorAll('#momentBtns .btn').forEach((b, k) => b.classList.toggle('solid', k === i));
      $('momentImg').style.backgroundImage = `url(assets/${m.pic}.jpg)`;
      $('momentPrompt').textContent = m.prompt;
      $('momentHint').textContent = m.hint;
      $('momentExampleText').textContent = `示例：${m.example}`;
      $('momentExampleText').hidden = true;
      $('momentText').value = '';
    };
    $('momentBtns').innerHTML = moments.map((m, i) => `<button class="btn" type="button" data-i="${i}">${m.name}</button>`).join('');
    $('momentBtns').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-i]');
      if (btn) show(+btn.dataset.i);
    });
    $('momentExample').addEventListener('click', () => { $('momentExampleText').hidden = false; });
    show(start || 0);
  }

  /* ================= 选一选（数据：story.picks[key] = [{ t, ok, why }]，容器 <div data-picks="key">） ================= */
  function initPicks(box, items) {
    const total = items.filter((it) => it.ok).length;
    box.innerHTML = `<div class="picks">${items.map((it, i) => `<button class="pick" type="button" data-i="${i}">${it.t}<small></small></button>`).join('')}</div>
      <p class="pick-count">找到 <b>0</b> / ${total}</p>`;
    box.addEventListener('click', (e) => {
      const btn = e.target.closest('.pick');
      if (!btn || btn.classList.contains('right')) return;
      const it = items[+btn.dataset.i];
      btn.classList.remove('wrong');
      void btn.offsetWidth; // 重新触发抖动动画
      btn.classList.add(it.ok ? 'right' : 'wrong');
      btn.querySelector('small').textContent = it.why || (it.ok ? '✓' : '✗');
      const found = box.querySelectorAll('.pick.right').length;
      box.querySelector('.pick-count b').textContent = found;
      box.classList.toggle('all-found', found === total);
    });
  }

  // 页面上有对应容器才初始化，没有就跳过：各课可以按需删减页面
  function initStory(story = {}) {
    const el = (id) => document.getElementById(id);
    plot = story.plot || [];
    if (el('plotBoard') && plot.length) buildPlotBoard(el('plotBoard'));
    if (el('sortList') && story.sort) initSort(el('sortList'), story.sort, story.kinds || ['动作', '语言', '神态']);
    if (el('clues') && story.clues) initClues(el('clues'), story.clues, story.clueLabels || ['当时读到', '知道真相后']);
    if (el('markToggle')) initReading(el('markToggle'));
    if (el('momentBtns') && story.moments) initMoments(story.moments, story.momentStart);
    document.querySelectorAll('[data-picks]').forEach((box) => {
      const items = (story.picks || {})[box.dataset.picks];
      if (items) initPicks(box, items);
    });
  }

  return {
    fillRain,
    init(story) {
      document.querySelectorAll('.rain-layer .rain').forEach(fillRain);
      buildPlotline();
      initStory(story);
    },
    onRender(slide, step) {
      updatePlot(slide, step);
      updatePlotBoard(slide, step);
      if (slide.classList.contains('scene')) updateScene(slide, step);
      updateVideos(slide);
    },
  };
})();
