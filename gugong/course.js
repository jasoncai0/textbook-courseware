'use strict';

/* ================= 故宫平面示意（北在上，坐标系 0..300 × -60..460） ================= */
const PLAN = [
  { id: 'shenwumen', n: '神武门', x: 150, y: 20, w: 34, h: 12, c: 'gate', lp: 't' },
  { id: 'yuhuayuan', n: '御花园', x: 150, y: 72, w: 80, h: 36, c: 'gdn', lp: 'in' },
  { id: 'kunninggong', n: '坤宁宫', x: 150, y: 106, w: 56, h: 12, c: 'bld', lp: 'in' },
  { id: 'jiaotaidian', n: '交泰殿', x: 150, y: 124, w: 16, h: 12, c: 'bld', lp: 'r' },
  { id: 'qianqinggong', n: '乾清宫', x: 150, y: 144, w: 60, h: 16, c: 'bld', lp: 'in' },
  { id: 'xiliugong', n: '西六宫', x: 80, y: 115, w: 48, h: 60, c: 'blk', lp: 'in' },
  { id: 'dongliugong', n: '东六宫', x: 220, y: 115, w: 48, h: 60, c: 'blk', lp: 'in' },
  { id: 'qianqingmen', n: '乾清门', x: 150, y: 170, w: 36, h: 8, c: 'gate', lp: 'none' },
  { id: 'baohedian', n: '保和殿', x: 150, y: 198, w: 54, h: 14, c: 'bld', lp: 'in' },
  { id: 'zhonghedian', n: '中和殿', x: 150, y: 216, w: 14, h: 14, c: 'bld', lp: 'r' },
  { id: 'taihedian', n: '太和殿', x: 150, y: 240, w: 70, h: 20, c: 'bld', lp: 'in' },
  { id: 'wuyingdian', n: '武英殿', x: 72, y: 278, w: 36, h: 22, c: 'bld', lp: 'b' },
  { id: 'wenhuadian', n: '文华殿', x: 228, y: 278, w: 36, h: 22, c: 'bld', lp: 'b' },
  { id: 'taihemen', n: '太和门', x: 150, y: 292, w: 48, h: 12, c: 'bld', lp: 'in' },
  { id: 'donghuamen', n: '东华门', x: 280, y: 300, w: 10, h: 24, c: 'gate', lp: 'b' },
  { id: 'xihuamen', n: '西华门', x: 20, y: 300, w: 10, h: 24, c: 'gate', lp: 'b' },
  { id: 'duanmen', n: '端门', x: 150, y: 410, w: 30, h: 10, c: 'gate', lp: 'r' },
  { id: 'tiananmen', n: '天安门', x: 150, y: 438, w: 40, h: 12, c: 'gate', lp: 'r' },
];
const EXTRA_POINTS = {
  wumen: { n: '午门', x: 150, y: 372 },
  jinshuiqiao: { n: '金水桥', x: 150, y: 322 },
  guangchang: { n: '乾清门广场', x: 150, y: 181 },
  jingshan: { n: '景山', x: 150, y: -30 },
};
const POINTS = Object.fromEntries([
  ...PLAN.map((b) => [b.id, { n: b.n, x: b.x, y: b.y }]),
  ...Object.entries(EXTRA_POINTS),
]);

function labelSvg(b) {
  const pos = {
    in: [b.x, b.y + 3, 'middle', 'lbl in'],
    r: [b.x + b.w / 2 + 3, b.y + 3, 'start', 'lbl'],
    l: [b.x - b.w / 2 - 3, b.y + 3, 'end', 'lbl'],
    b: [b.x, b.y + b.h / 2 + 10, 'middle', 'lbl'],
    t: [b.x, b.y - b.h / 2 - 3, 'middle', 'lbl'],
  }[b.lp];
  if (!pos) return '';
  const [x, y, anchor, cls] = pos;
  return `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${b.n}</text>`;
}

function planBase(withLabels) {
  const corners = [[20, 20], [280, 20], [20, 380], [280, 380]]
    .map(([x, y]) => `<rect class="bld" x="${x - 6}" y="${y - 6}" width="12" height="12"/>`).join('');
  const blds = PLAN.map((b) => `<rect class="${b.c}" x="${b.x - b.w / 2}" y="${b.y - b.h / 2}" width="${b.w}" height="${b.h}"/>`).join('');
  const bridges = [140, 145, 150, 155, 160].map((x) => `<rect x="${x - 1.5}" y="316" width="3" height="12" fill="#fff" stroke="#a89c86" stroke-width=".5"/>`).join('');
  const labels = withLabels
    ? PLAN.map(labelSvg).join('') +
      '<text class="lbl" x="150" y="384" fill="#fff">午门</text><text class="lbl" x="212" y="336" text-anchor="start">金水桥</text><text class="lbl" x="150" y="-34">景山</text>'
    : '';
  return `<g class="plan-base">
    <ellipse cx="150" cy="-30" rx="40" ry="18" fill="#9cbf86"/>
    <rect class="moat" x="10" y="10" width="280" height="380"/>
    <rect class="wall" x="20" y="20" width="260" height="360"/>
    <rect class="tai" x="104" y="186" width="92" height="68"/>
    <path d="M100 312 Q150 340 200 312" fill="none" stroke="#6fb1d6" stroke-width="4"/>${bridges}
    <path class="gate" d="M114 352 H186 V390 H174 V366 H126 V390 H114 Z"/>
    ${blds}${corners}${labels}
  </g>`;
}

function renderPlans() {
  document.querySelectorAll('svg[data-plan]').forEach((svg) => {
    svg.insertAdjacentHTML('afterbegin', planBase(svg.dataset.plan === 'labels' && svg.id !== 'routeMap'));
  });
  document.querySelector('.cover-plan').innerHTML = planBase(false);
  const mini = document.getElementById('minimap');
  mini.innerHTML = planBase(false) +
    '<line id="miniTrail" x1="150" y1="438" x2="150" y2="438" stroke="#9e2b25" stroke-width="6" stroke-linecap="round"/>' +
    '<circle class="here-ring" id="miniRing" cx="150" cy="438" r="14"/><circle class="here" id="miniHere" cx="150" cy="438" r="11"/>';
}

/* ================= 各页的重复图形（用代码生成，避免手写几百个元素） ================= */
const svgOf = (id) => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);

function buildTerrace() {
  const svg = svgOf('terrace');
  const tiers = [[70, 730, 370], [130, 670, 290], [190, 610, 210]];
  let rails = '';
  let heads = '';
  let spouts = '';
  tiers.forEach(([x0, x1, top]) => {
    rails += `<line x1="${x0}" y1="${top - 12}" x2="${x1}" y2="${top - 12}"/>`;
    for (let x = x0 + 8; x <= x1 - 8; x += 24) {
      rails += `<line x1="${x}" y1="${top}" x2="${x}" y2="${top - 18}"/><circle cx="${x}" cy="${top - 19}" r="2.4"/>`;
      heads += `<circle class="pop" cx="${x}" cy="${top + 7}" r="3.8" style="animation-delay:${(((x - x0) / (x1 - x0)) * 0.8).toFixed(2)}s"/>`;
      spouts += `<path class="spout" d="M${x} ${top + 10} q 4 6 3 26" style="animation-delay:${rand(0, 0.8).toFixed(2)}s"/>`;
    }
  });
  svg.querySelector('.rails').innerHTML = rails;
  svg.querySelector('.chis').innerHTML = heads;
  svg.querySelector('.spouts').innerHTML = spouts;
  svg.querySelector('.rain').innerHTML = Array.from({ length: 70 }, () => {
    const x = rand(0, 800).toFixed(0);
    return `<line x1="${x}" y1="0" x2="${x - 4}" y2="18" style="animation-delay:${rand(0, 0.9).toFixed(2)}s"/>`;
  }).join('');
}

function buildTaihe() {
  const svg = svgOf('taihe');
  let posts = '';
  for (let x = 50; x <= 750; x += 30) posts += `M${x} 410 V390 `;
  svg.querySelector('.posts').setAttribute('d', posts);
  svg.querySelector('.cols').innerHTML = Array.from({ length: 12 }, (_, i) =>
    `<rect x="${130 + i * 48}" y="258" width="12" height="114"/>`).join('');
}

function buildPillars() {
  const xs = [150, 215, 280, 498, 563, 628];
  svgOf('inner').querySelector('.pillars').innerHTML = xs.map((x) => {
    let d = `M${x + 11} 465`;
    let left = true;
    for (let y = 465; y > 80; y -= 36) {
      d += ` Q${left ? x - 8 : x + 30} ${y - 18} ${x + 11} ${y - 36}`;
      left = !left;
    }
    return `<rect x="${x}" y="40" width="22" height="430" fill="url(#goldG)"/>
      <path class="draw" pathLength="1" d="${d}" fill="none" stroke="#8a5200" stroke-width="5" stroke-linecap="round"/>`;
  }).join('') + '<text class="t-s" x="604" y="34" fill="#f3d77a">六根蟠龙金柱</text>';
}

function buildDadian() {
  const svg = svgOf('dadian');
  const figures = (x0, x1, color) => {
    let out = '';
    for (let row = 0, y = 210; y <= 446; y += 29, row += 1) {
      for (let x = x0; x <= x1; x += 24) {
        out += `<use href="#official" x="${x}" y="${y}" width="12" height="22" fill="${color}" style="animation-delay:${(row * 0.12).toFixed(2)}s"/>`;
      }
    }
    return out;
  };
  svg.querySelector('.officials').innerHTML = figures(110, 340, '#34507a') + figures(450, 680, '#7a3434');
  const colors = ['#d9a520', '#9e2b25', '#2f6b5e'];
  let flags = '';
  for (let i = 0, y = 196; y <= 450; y += 34, i += 1) {
    const c = colors[i % 3];
    flags += `<use href="#flag" x="362" y="${y}" width="14" height="34" fill="${c}" style="animation-delay:${(i * 0.1).toFixed(2)}s"/>`;
    flags += `<use href="#flag" x="424" y="${y}" width="14" height="34" fill="${c}" style="animation-delay:${(i * 0.1).toFixed(2)}s"/>`;
  }
  svg.querySelector('.flags').innerHTML = flags;
  const burners = [[232, 150, '香炉'], [300, 128, '铜龟'], [500, 128, '铜鹤'], [568, 150, '香炉']];
  svg.querySelector('.incense').innerHTML = burners.map(([x, y, n]) => {
    const smoke = Array.from({ length: 6 }, (_, i) =>
      `<circle class="smoke" cx="${x}" cy="${y - 6}" r="5" style="animation-delay:${(i * 0.5).toFixed(1)}s;--dx:${rand(-12, 12).toFixed(0)}px"/>`).join('');
    return `${smoke}<rect x="${x - 7}" y="${y - 6}" width="14" height="10" rx="3" fill="#6b5a3c"/><text class="t-s t-c" x="${x}" y="${y + 16}">${n}</text>`;
  }).join('');
}

function buildJingshan() {
  const svg = svgOf('jingshan');
  const dirt = Array.from({ length: 36 }, () => {
    const cx = rand(340, 460);
    const cy = rand(90, 135);
    const onSide = Math.random() < 0.5;
    const mx = onSide ? (Math.random() < 0.5 ? 262 : 538) : rand(262, 538);
    const my = onSide ? rand(152, 438) : (Math.random() < 0.5 ? 152 : 438);
    return `<circle class="dirt" cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="4" style="--dx:${(mx - cx).toFixed(0)}px;--dy:${(my - cy).toFixed(0)}px;animation-delay:${rand(0, 1.2).toFixed(2)}s"/>`;
  }).join('');
  svg.querySelector('.dirts').innerHTML = dirt;

  const roof = (cx, y, w, h) => `<path d="M${cx - w / 2} ${y + h} Q${cx - w * 0.42} ${y + h * 0.6} ${cx - w * 0.32} ${y} H${cx + w * 0.32} Q${cx + w * 0.42} ${y + h * 0.6} ${cx + w / 2} ${y + h} Z" fill="#e2a91f" stroke="#9a6b10" stroke-width=".8"/>`;
  const hall = (cx, y, w, s) => roof(cx, y, w, 16 * s) + `<rect x="${cx - w * 0.4}" y="${y + 16 * s}" width="${w * 0.8}" height="${12 * s}" fill="#9e2b25"/>`;
  let rows = '';
  let towers = '';
  let walls = '';
  for (let i = 0; i < 6; i += 1) {
    const s = 0.45 + i * 0.12;
    const y = 104 + i * 50;
    rows += hall(400, y, 170 * s, s) + hall(400 - 230 * s, y + 6 * s, 100 * s, s) + hall(400 + 230 * s, y + 6 * s, 100 * s, s);
    if (i % 2 === 1) {
      towers += [400 - 380 * s, 400 + 380 * s].map((x) =>
        roof(x, y - 14 * s, 60 * s, 12 * s) + roof(x, y, 76 * s, 14 * s) + `<rect x="${x - 22 * s}" y="${y + 14 * s}" width="${44 * s}" height="${12 * s}" fill="#9e2b25"/>`).join('');
    }
    walls += `<rect x="${400 - 470 * s}" y="${y + 30 * s}" width="${940 * s}" height="${5 * s}" fill="#a3322a"/><rect x="${400 - 470 * s}" y="${y + 29 * s}" width="${940 * s}" height="${1.6 * s}" fill="#e2a91f"/>`;
  }
  svg.querySelector('.rows').innerHTML = rows;
  svg.querySelector('.towers').innerHTML = towers;
  svg.querySelector('.walls').innerHTML = walls;
}

/* ================= 龙 → 凤 渐变 ================= */
const TILE_COUNT = 48;
const FENG_MAX_RATIO = 0.6; // 凤凰“逐渐增加”，但龙不会消失
const tileOrder = Array.from({ length: TILE_COUNT }, (_, i) => i).sort((a, b) => ((a * 37) % 48) - ((b * 37) % 48));

function initLongfeng() {
  const tiles = document.getElementById('lfTiles');
  tiles.innerHTML = Array.from({ length: TILE_COUNT }, () => '<span class="tile">龍</span>').join('');
  document.getElementById('lfSlider').addEventListener('input', (e) => setLongfeng(+e.target.value));
}

function setLongfeng(v) {
  const fengCount = Math.round(TILE_COUNT * FENG_MAX_RATIO * (v / 100));
  const fengSet = new Set(tileOrder.slice(0, fengCount));
  document.querySelectorAll('#lfTiles .tile').forEach((t, i) => {
    const isFeng = fengSet.has(i);
    t.classList.toggle('feng', isFeng);
    t.textContent = isFeng ? '鳳' : '龍';
  });
  document.getElementById('lfMeter').style.width = `${100 - v * 0.55}%`;
  document.getElementById('lfNames').style.opacity = v >= 60 ? 1 : 0;
  document.getElementById('lfSlider').value = v;
}

let lfTimer = null;
function animateLongfeng(to) {
  clearInterval(lfTimer);
  let v = +document.getElementById('lfSlider').value;
  lfTimer = setInterval(() => {
    v = Math.min(to, v + 2);
    setLongfeng(v);
    if (v >= to) clearInterval(lfTimer);
  }, 50);
}

/* ================= 任务一：路线图 ================= */
const ROUTE_SPOTS = ['wumen', 'jinshuiqiao', 'taihemen', 'taihedian', 'zhonghedian', 'baohedian', 'wenhuadian', 'wuyingdian',
  'qianqinggong', 'jiaotaidian', 'kunninggong', 'dongliugong', 'xiliugong', 'yuhuayuan', 'shenwumen', 'donghuamen', 'xihuamen'];
const ROUTE_DEMO = ['wumen', 'jinshuiqiao', 'taihemen', 'taihedian', 'zhonghedian', 'baohedian', 'qianqinggong', 'jiaotaidian', 'kunninggong', 'yuhuayuan', 'shenwumen'];
const EXITS = ['shenwumen', 'donghuamen'];
const BACKTRACK_PX = 40; // 向南走超过这个距离，算“走回头路”

let route = [];

function initRouteMap() {
  const g = document.getElementById('spots');
  g.innerHTML = ROUTE_SPOTS.map((id) => {
    const p = POINTS[id];
    const right = p.x <= 150;
    return `<g class="spot" data-id="${id}">
      <circle cx="${p.x}" cy="${p.y}" r="7"/><text class="lbl num" x="${p.x}" y="${p.y + 3}"></text>
      <text class="lbl" x="${p.x + (right ? 10 : -10)}" y="${p.y + 3}" text-anchor="${right ? 'start' : 'end'}" stroke="#fff" stroke-width="3" paint-order="stroke">${p.n}</text>
    </g>`;
  }).join('');
  g.addEventListener('click', (e) => {
    const spot = e.target.closest('.spot');
    if (spot) setRoute([...route, spot.dataset.id]);
  });
  document.getElementById('routeUndo').onclick = () => setRoute(route.slice(0, -1));
  document.getElementById('routeClear').onclick = () => setRoute([]);
  document.getElementById('routeDemo').onclick = () => setRoute([...ROUTE_DEMO]);
  document.getElementById('routeCheck').onclick = () => showFeedback(checkRoute(route));
}

function setRoute(next) {
  route = next;
  document.getElementById('routeLine').setAttribute('points', route.map((id) => `${POINTS[id].x},${POINTS[id].y}`).join(' '));
  document.querySelectorAll('#spots .spot').forEach((s) => {
    const idx = route.lastIndexOf(s.dataset.id);
    s.classList.toggle('picked', idx >= 0);
    s.querySelector('.num').textContent = idx >= 0 ? idx + 1 : '';
  });
  document.getElementById('routeList').innerHTML = route.map((id) => `<li>${POINTS[id].n}</li>`).join('');
  showFeedback({ level: '', text: route.length ? `已选 ${route.length} 站，继续点，或按“检查路线”。` : '提示：参考材料一（游览顺序）、材料三（进出口）、材料四（平面图）。' });
}

function checkRoute(r) {
  if (r.length === 0) return { level: 'warn', text: '还没有画路线，先点一点地图上的圆点吧。' };
  if (r[0] !== 'wumen') return { level: 'warn', text: '起点不对：根据材料三，午门是唯一的参观入口。' };
  const last = r[r.length - 1];
  if (!EXITS.includes(last)) return { level: 'warn', text: '终点不对：参观结束后，要从神武门或东华门离开（材料三）。' };
  if (r.includes('xihuamen')) return { level: 'warn', text: '西华门不是出口哦，路线里去掉它吧。' };
  if (new Set(r).size !== r.length) return { level: 'warn', text: '有景点重复了。故宫是单向参观，尽量不走回头路。' };
  if (r.length < 5) return { level: 'warn', text: '路线有点短，一日游可以再加几个想看的景点。' };
  for (let i = 1; i < r.length; i += 1) {
    if (POINTS[r[i]].y - POINTS[r[i - 1]].y > BACKTRACK_PX) {
      return { level: 'warn', text: `从“${POINTS[r[i - 1]].n}”往南回到“${POINTS[r[i]].n}”，走了回头路。按由南向北的顺序调整一下吧。` };
    }
  }
  const tail = last === 'shenwumen' ? '出了神武门，对面就是景山，可以登高望故宫！' : '从东华门出宫，也很方便。';
  return { level: 'ok', text: `路线合理！午门进，共 ${r.length} 站。${tail}` };
}

function showFeedback({ level, text }) {
  const fb = document.getElementById('routeFeedback');
  fb.className = `tip feedback ${level}`;
  fb.textContent = text;
}

/* ================= 任务二：讲解卡 ================= */
const GUIDES = [
  {
    n: '太和殿', where: '进太和门，三大殿的第一座，正好在中轴线上。',
    look: '高二十八米，故宫最大的殿堂；金黄色琉璃瓦重檐屋顶，十二根红色大圆柱；殿内有金漆雕龙宝座、六根蟠龙金柱，藻井里的金龙口中垂下宝珠。',
    use: '举行重大典礼。皇帝即位、生日、婚礼和元旦，都在这里接受朝贺。',
    story: '俗称“金銮殿”；龙头、宝珠正对着下面的宝座。',
    speech: '爸爸妈妈，请看前面这座最高大的宫殿——太和殿，大家都叫它“金銮殿”。它高二十八米，差不多有九层楼那么高，是故宫里最大的殿堂。你们抬头看，金黄的琉璃瓦在蓝天下闪闪发光……',
  },
  {
    n: '太和门', where: '走进午门，跨过金水桥，桥的北面就是。',
    look: '门的两侧，一对威武的铜狮守卫着。',
    use: '前朝的大门。皇帝大婚纳彩、迎娶都要经过这里。',
    story: '光绪年间这里失火，一个多月后皇帝就要大婚，来不及修，工匠们扎了一座彩棚太和门，惟妙惟肖，风吹不摇！',
    speech: '各位家人，这座大门叫太和门。你们知道吗？一百多年前，它曾经被大火烧毁，可是一个多月后皇帝就要结婚了……',
  },
  {
    n: '三大殿台基', where: '太和殿、中和殿、保和殿都站在它上面。',
    look: '七米多高，一共三层；每层边上都有汉白玉栏杆，刻着龙凤流云。',
    use: '一千多个螭首嘴里有小圆洞，是台基的排水管道。',
    story: '下大雨的时候，一千多个螭首一齐吐水，叫“千龙吐水”。',
    speech: '大家低头看看栏杆下面这些龙头一样的石雕，它们叫螭首。别小看它们，它们嘴里的小圆洞，其实是排水管道……',
  },
  {
    n: '御花园', where: '后三宫往北，就是御花园。',
    look: '二十多座建筑，亭台楼阁、池馆水榭掩映在青松翠柏中，还有假山怪石、花坛盆景、藤萝翠竹。',
    use: '皇家的花园，供皇帝和后妃游玩休息。',
    story: '面积不大，却毫无拥挤和重复的感觉，仿佛进入了苏州园林。',
    speech: '走了这么久，我们来到了御花园。和前面庄严的大殿比起来，这里是不是一下子变得轻松了？请看那座假山……',
  },
  {
    n: '景山', where: '出神武门，对面就是景山。',
    look: '站在高处望故宫：重重殿宇，层层楼阁，道道宫墙，错综相连又井然有序。',
    use: '现在是风景优美的景山公园，是看故宫全景的好地方。',
    story: '据说是明代修紫禁城时，用护城河里挖出的泥土堆起来的。',
    speech: '最后，我们登上景山。你们猜，这座山是怎么来的？据说呀，它是用挖护城河的泥土堆起来的……',
  },
];

function initGuide() {
  const box = document.getElementById('guideSpots');
  box.innerHTML = GUIDES.map((g, i) => `<button class="btn" data-i="${i}">${g.n}</button>`).join('');
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) showGuide(+btn.dataset.i);
  });
  showGuide(0);
}

function showGuide(i) {
  const g = GUIDES[i];
  document.querySelectorAll('#guideSpots .btn').forEach((b, k) => b.classList.toggle('solid', k === i));
  document.getElementById('guideCard').innerHTML =
    `<dt>在哪儿</dt><dd>${g.where}</dd><dt>什么样</dt><dd>${g.look}</dd><dt>做什么</dt><dd>${g.use}</dd><dt>小故事</dt><dd>${g.story}</dd>`;
  document.getElementById('guideSpeech').textContent = `开场白示例：${g.speech}`;
}

/* ================= 接入通用引擎（../shared/deck.js） ================= */
function updateMinimap(slide) {
  const mini = document.getElementById('minimap');
  const p = POINTS[slide.dataset.stop];
  mini.classList.toggle('show', Boolean(p));
  if (!p) return;
  ['miniHere', 'miniRing'].forEach((id) => {
    const c = document.getElementById(id);
    c.setAttribute('cx', p.x);
    c.setAttribute('cy', p.y);
  });
  document.getElementById('miniTrail').setAttribute('y2', p.y);
}

function onStep(slide, s) {
  if (slide.classList.contains('s-longfeng')) {
    if (s >= 2) animateLongfeng(100);
    else if (s === 0) { clearInterval(lfTimer); setLongfeng(0); }
  }
}

window.LESSON = {
  init() {
    renderPlans();
    buildTerrace();
    buildTaihe();
    buildPillars();
    buildDadian();
    buildJingshan();
    initLongfeng();
    initRouteMap();
    initGuide();
  },
  onRender(slide, s) {
    onStep(slide, s);
    updateMinimap(slide);
  },
};
