// 3D 肌肉解剖动态与高亮图谱生成器 (100% 本地渲染，无需外网，永不出现问号破图)
export function getMuscleDiagramSvg(category = "胸部", target = "") {
  // 根据部位和目标肌群返回精美的 3D 人体解剖高亮矢量图
  let highlightColor = "#f59e0b"; // 琥珀金 / 亮橙
  let activeMuscleGroup = "chest";

  if (category === "胸部") {
    activeMuscleGroup = "chest";
  } else if (category === "背部") {
    activeMuscleGroup = "back";
  } else if (category === "肩部") {
    activeMuscleGroup = "shoulders";
  } else if (category === "手臂") {
    activeMuscleGroup = target.includes("二头") || target.includes("肱肌") ? "biceps" : "triceps";
  } else if (category === "腿部") {
    activeMuscleGroup = target.includes("后侧") || target.includes("腘绳") || target.includes("硬拉") || target.includes("弯举") ? "hamstrings" : (target.includes("提踵") || target.includes("小腿") ? "calves" : "quads");
  } else if (category === "核心") {
    activeMuscleGroup = "abs";
  }

  // 返回对应肌肉高亮的 3D 风格 SVG (带柔和发光与解剖轮廓)
  return generateDiagramSvg(activeMuscleGroup, target);
}

function generateDiagramSvg(type, targetText) {
  const highlightAmber = "#f59e0b";
  const highlightOrange = "#ea580c";
  const bodyBase = "#3f3f46";
  const bodyDark = "#27272a";
  const glowId = `glow-${type}`;

  // 基础人体 3D 解剖形态 (带透视与肌肉分块)
  switch (type) {
    case "chest":
      return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <defs>
          <linearGradient id="${glowId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${highlightAmber}" />
            <stop offset="100%" stop-color="${highlightOrange}" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${highlightOrange}" flood-opacity="0.6"/>
          </filter>
        </defs>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- 头部与颈部 -->
          <circle cx="100" cy="30" r="14" fill="${bodyDark}" stroke="${bodyBase}" stroke-width="2"/>
          <path d="M94 44 L90 54 M106 44 L110 54" stroke="${bodyBase}" stroke-width="3"/>
          <!-- 三角肌 -->
          <path d="M68 54 Q50 64 54 85 Q65 85 72 70 Z" fill="${bodyBase}" stroke="#52525b" stroke-width="1.5"/>
          <path d="M132 54 Q150 64 146 85 Q135 85 128 70 Z" fill="${bodyBase}" stroke="#52525b" stroke-width="1.5"/>
          <!-- 胸大肌 (高亮发光目标) -->
          <path d="M72 58 Q95 56 98 78 Q88 95 68 90 Q65 72 72 58 Z" fill="url(#${glowId})" filter="url(#shadow)" stroke="#fff" stroke-width="1"/>
          <path d="M128 58 Q105 56 102 78 Q112 95 132 90 Q135 72 128 58 Z" fill="url(#${glowId})" filter="url(#shadow)" stroke="#fff" stroke-width="1"/>
          <!-- 腹肌与躯干 -->
          <path d="M80 94 L80 150 L120 150 L120 94" stroke="${bodyBase}" stroke-width="2"/>
          <rect x="85" y="98" width="13" height="12" rx="2" fill="${bodyDark}" stroke="${bodyBase}"/>
          <rect x="102" y="98" width="13" height="12" rx="2" fill="${bodyDark}" stroke="${bodyBase}"/>
          <rect x="85" y="113" width="13" height="12" rx="2" fill="${bodyDark}" stroke="${bodyBase}"/>
          <rect x="102" y="113" width="13" height="12" rx="2" fill="${bodyDark}" stroke="${bodyBase}"/>
          <!-- 手臂轮廓 -->
          <path d="M54 85 L44 130 M146 85 L156 130" stroke="${bodyBase}" stroke-width="7" stroke-linecap="round"/>
        </g>
      </svg>`;

    case "back":
      return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <defs>
          <linearGradient id="${glowId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#0284c7" />
          </linearGradient>
          <filter id="shadow-back" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0284c7" flood-opacity="0.6"/>
          </filter>
        </defs>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- 头部后脑勺 -->
          <circle cx="100" cy="30" r="14" fill="${bodyDark}" stroke="${bodyBase}" stroke-width="2"/>
          <!-- 斜方肌上束 -->
          <path d="M88 44 Q100 48 112 44 L130 58 Q100 70 70 58 Z" fill="${bodyBase}" stroke="#52525b" stroke-width="1.5"/>
          <!-- 背阔肌 V字倒三角 (高亮) -->
          <path d="M70 60 Q100 72 98 125 Q75 105 60 75 Z" fill="url(#${glowId})" filter="url(#shadow-back)" stroke="#fff" stroke-width="1"/>
          <path d="M130 60 Q100 72 102 125 Q125 105 140 75 Z" fill="url(#${glowId})" filter="url(#shadow-back)" stroke="#fff" stroke-width="1"/>
          <!-- 脊柱与下背 -->
          <line x1="100" y1="65" x2="100" y2="145" stroke="#71717a" stroke-width="2" stroke-dasharray="3,3"/>
          <!-- 手臂后侧 -->
          <path d="M58 75 L45 125 M142 75 L155 125" stroke="${bodyBase}" stroke-width="7" stroke-linecap="round"/>
        </g>
      </svg>`;

    case "shoulders":
      return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <defs>
          <linearGradient id="${glowId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24" />
            <stop offset="100%" stop-color="#d97706" />
          </linearGradient>
          <filter id="shadow-sh" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#d97706" flood-opacity="0.6"/>
          </filter>
        </defs>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="100" cy="30" r="14" fill="${bodyDark}" stroke="${bodyBase}" stroke-width="2"/>
          <!-- 三角肌左右球形 (高亮) -->
          <path d="M68 50 Q46 62 50 86 Q64 86 72 70 Z" fill="url(#${glowId})" filter="url(#shadow-sh)" stroke="#fff" stroke-width="1"/>
          <path d="M132 50 Q154 62 150 86 Q136 86 128 70 Z" fill="url(#${glowId})" filter="url(#shadow-sh)" stroke="#fff" stroke-width="1"/>
          <!-- 胸部与躯干 -->
          <path d="M72 58 Q100 56 128 58 L120 145 L80 145 Z" fill="${bodyDark}" stroke="${bodyBase}" stroke-width="2"/>
          <path d="M50 86 L40 135 M150 86 L160 135" stroke="${bodyBase}" stroke-width="6" stroke-linecap="round"/>
        </g>
      </svg>`;

    case "triceps":
    case "biceps":
      return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <defs>
          <linearGradient id="${glowId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a855f7" />
            <stop offset="100%" stop-color="#7e22ce" />
          </linearGradient>
          <filter id="shadow-arm" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#7e22ce" flood-opacity="0.6"/>
          </filter>
        </defs>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="100" cy="30" r="14" fill="${bodyDark}" stroke="${bodyBase}" stroke-width="2"/>
          <path d="M72 54 L128 54 L118 140 L82 140 Z" fill="${bodyDark}" stroke="${bodyBase}" stroke-width="2"/>
          <!-- 左右手臂手臂肌肉 (高亮) -->
          <rect x="42" y="60" width="18" height="38" rx="8" fill="url(#${glowId})" filter="url(#shadow-arm)" stroke="#fff" stroke-width="1"/>
          <rect x="140" y="60" width="18" height="38" rx="8" fill="url(#${glowId})" filter="url(#shadow-arm)" stroke="#fff" stroke-width="1"/>
          <!-- 前臂 -->
          <path d="M51 98 L44 140 M149 98 L156 140" stroke="${bodyBase}" stroke-width="6" stroke-linecap="round"/>
        </g>
      </svg>`;

    case "quads":
    case "hamstrings":
    case "calves":
      return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <defs>
          <linearGradient id="${glowId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f97316" />
            <stop offset="100%" stop-color="#c2410c" />
          </linearGradient>
          <filter id="shadow-leg" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#c2410c" flood-opacity="0.6"/>
          </filter>
        </defs>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- 盆骨核心 -->
          <path d="M75 30 L125 30 L115 65 L85 65 Z" fill="${bodyDark}" stroke="${bodyBase}" stroke-width="2"/>
          <!-- 大腿股四头肌/腘绳肌 (高亮) -->
          <rect x="70" y="70" width="24" height="60" rx="10" fill="url(#${glowId})" filter="url(#shadow-leg)" stroke="#fff" stroke-width="1"/>
          <rect x="106" y="70" width="24" height="60" rx="10" fill="url(#${glowId})" filter="url(#shadow-leg)" stroke="#fff" stroke-width="1"/>
          <!-- 小腿与脚踝 -->
          <path d="M82 135 L80 185 M118 135 L120 185" stroke="${bodyBase}" stroke-width="7" stroke-linecap="round"/>
        </g>
      </svg>`;

    case "abs":
    default:
      return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <defs>
          <linearGradient id="${glowId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#10b981" />
            <stop offset="100%" stop-color="#047857" />
          </linearGradient>
          <filter id="shadow-abs" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#047857" flood-opacity="0.6"/>
          </filter>
        </defs>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="100" cy="30" r="14" fill="${bodyDark}" stroke="${bodyBase}" stroke-width="2"/>
          <path d="M72 58 Q100 56 128 58 L120 145 L80 145 Z" fill="${bodyDark}" stroke="${bodyBase}" stroke-width="2"/>
          <!-- 腹肌核心 (高亮) -->
          <rect x="86" y="75" width="12" height="14" rx="2" fill="url(#${glowId})" filter="url(#shadow-abs)" stroke="#fff"/>
          <rect x="102" y="75" width="12" height="14" rx="2" fill="url(#${glowId})" filter="url(#shadow-abs)" stroke="#fff"/>
          <rect x="86" y="93" width="12" height="14" rx="2" fill="url(#${glowId})" filter="url(#shadow-abs)" stroke="#fff"/>
          <rect x="102" y="93" width="12" height="14" rx="2" fill="url(#${glowId})" filter="url(#shadow-abs)" stroke="#fff"/>
          <rect x="86" y="111" width="12" height="14" rx="2" fill="url(#${glowId})" filter="url(#shadow-abs)" stroke="#fff"/>
          <rect x="102" y="111" width="12" height="14" rx="2" fill="url(#${glowId})" filter="url(#shadow-abs)" stroke="#fff"/>
        </g>
      </svg>`;
  }
}
