/**
 * FitCycle Commercial Gym Equipment Visuals & Real-world Photo Registry
 * Maps commercial gym machines to authentic photography, identification features,
 * seat/pin adjustment guides, and corresponding 3D anatomical exercise IDs.
 */

export const GYM_EQUIPMENT_VISUALS = [
  {
    id: "eq-hack-squat",
    name: "哈克深蹲机",
    englishName: "Hack Squat Machine",
    aliases: ["哈克机", "哈克深蹲", "哈克深蹲架", "斜向深蹲机", "hack squat", "倒蹬深蹲机", "斜深蹲"],
    category: "legs",
    categoryName: "腿部 / 股四头肌与臀大肌",
    imageUrl: "./machines/hack-squat.jpg",
    tags: ["45度斜滑轨", "双肩垫", "斜向防滑踏板", "安全锁把手"],
    appearanceFeature: "机身为 45 度向上倾斜的粗壮双导轨。中间有一块斜靠背和两个宽厚的肩部皮质靠垫，底部是一块大号菱形防滑钢板脚踏，两侧各有一根醒目的安全限位旋转扳手。",
    adjustmentTips: "1. 双肩顶紧肩托靠垫，后背与臀部紧贴倾斜背板；\n2. 双腿微用力站直，将负重微微顶起；\n3. 双手握住身体两侧的把手向外推开安全锁扣；\n4. 缓慢屈膝下蹲至大腿与踏板接近平行；\n5. 完成整组后，在最高点将安全把手重新拉回扣牢，确认卡紧方可下机离开。",
    commonMistakes: "下蹲到底时臀部离开靠垫（骨盆翻转压迫腰椎）、双膝内扣、下蹲过浅仅小腿移动。",
    relatedExerciseIds: ["ex-hack-squats", "ex-barbell-squat", "ex-leg-press"]
  },
  {
    id: "eq-leg-press",
    name: "45度倒蹬机 / 腿举机",
    englishName: "45° Leg Press Machine",
    aliases: ["倒蹬机", "倒蹬", "腿举机", "腿举", "斜卧蹬腿机", "leg press", "蹬腿机"],
    category: "legs",
    categoryName: "腿部 / 股四头肌与臀大肌",
    imageUrl: "./machines/leg-press.jpg",
    tags: ["45度仰卧靠背", "宽大钢脚踏板", "挂片式滑动架", "两侧安全挡板杠杆"],
    appearanceFeature: "一张向后倾斜约 45 度的仰卧座椅，正上方是一块厚重宽大的方形钢制脚踏板。踏板两侧伸出粗钢管用于挂杠铃片，身体两侧各有一根带有橡胶把套的安全锁定杠杆。",
    adjustmentTips: "1. 仰卧在座椅上，背部和臀部紧紧贴牢靠背；\n2. 双脚与肩同宽踩在踏板中间（站位靠上偏臀，站位靠下偏大腿前侧）；\n3. 蹬起踏板至微屈，转动两侧安全手柄解锁；\n4. 受控屈膝下落至大腿接近腹部，发力蹬起；\n5. 【生命线警示】：蹬起时双膝必须保持微屈，绝对不要完全打直锁死膝关节！",
    commonMistakes: "蹬到最高点膝关节超伸反弓（易发生骨折事故）、下落过深导致下背部弓起脱离靠背。",
    relatedExerciseIds: ["ex-leg-press", "ex-barbell-squat", "ex-leg-extension"]
  },
  {
    id: "eq-smith-machine",
    name: "史密斯机 / 综合导轨架",
    englishName: "Smith Machine",
    aliases: ["史密斯", "史密斯架", "导轨杠铃", "固定杠铃架", "smith machine", "史密斯机"],
    category: "full_body",
    categoryName: "全身多功能 / 推胸·深蹲·推肩",
    imageUrl: "./machines/smith-machine.jpg",
    tags: ["固定垂直导轨", "可旋转杠铃杆", "两列密集卡槽", "可调安全挡块"],
    appearanceFeature: "高大的立方形金属框架，两根垂直或微倾斜的光滑导轨上串着一根可以上下滑动、并可通过旋转手腕直接卡在侧面凹槽里的固定杠铃杆。下方通常配有一张可调角度的哑铃卧推凳。",
    adjustmentTips: "1. 先调节导轨底部的两个安全限位铁栓高度（万一力竭杠铃会被挡住，不会压到身体）；\n2. 握住杠铃向上微推，向内或向后旋转手腕即可让挂钩脱离卡槽；\n3. 动作结束或力竭时，反向快速翻转手腕，挂钩即可就近卡入最近的凹槽完成锁定。",
    commonMistakes: "未提前调节底部安全限位卡块；动作中手腕松弛导致杠铃意外脱钩卡住。",
    relatedExerciseIds: ["ex-smith-bench-press", "ex-barbell-bench-press", "ex-barbell-squat"]
  },
  {
    id: "eq-lat-pulldown",
    name: "高位下拉机",
    englishName: "Lat Pulldown Machine",
    aliases: ["高位下拉", "下拉背机", "引体下拉机", "大背机", "lat pulldown", "坐姿下拉"],
    category: "back",
    categoryName: "背部 / 背阔肌与大圆肌",
    imageUrl: "./machines/lat-pulldown.jpg",
    tags: ["高位滑轮", "宽握横杆", "圆柱形大腿压垫", "插销配重塔"],
    appearanceFeature: "头顶高处延伸出一根粗钢臂滑轮，挂着一根宽大的横拉杆（两端微向下弯曲）。座椅前方有一对可以上下调节高度的圆柱形软海绵横垫（用来卡住大腿不被重量带飞），旁边立着垂直的插销配重铁塔。",
    adjustmentTips: "1. 拔出海绵垫旁边的黄色调节销，调节大腿固定垫高度，确保坐下后双腿刚好被死死压实；\n2. 双手全握横杆两侧弯折处，手距约为肩宽 1.5 倍；\n3. 坐入座位，挺胸收腹，将横杠匀速拉向锁骨上胸，感受背部夹紧；\n4. 受控匀速放回至手臂完全伸展，切忌借身体甩动。",
    commonMistakes: "后仰角度过大（变成水平划船）、耸肩代偿、拉杆拉到腹部。",
    relatedExerciseIds: ["ex-lat-pulldown", "ex-close-grip-front-lat-pulldown", "ex-pull-ups"]
  },
  {
    id: "eq-pec-deck",
    name: "蝴蝶机 / 夹胸与反向飞鸟机",
    englishName: "Pec Deck / Butterfly Fly Machine",
    aliases: ["蝴蝶机", "夹胸器", "夹胸机", "飞鸟机", "蝴蝶夹胸", "坐姿飞鸟机", "反向飞鸟机", "蝴蝶式夹胸机", "pec deck", "fly machine"],
    category: "chest",
    categoryName: "胸部 / 胸大肌中缝与肩后束",
    imageUrl: "./machines/pec-deck.jpg",
    tags: ["双旋转立臂", "肘托或垂直把手", "圆弧摆动轨迹", "黄色座椅升降旋钮"],
    appearanceFeature: "垂直靠背座椅，上方两侧各有一个悬垂的旋转金属摇臂，摇臂上附带垂直手柄或前臂软海绵垫。器械顶部有旋转齿轮凸轮盘，旁边连着垂直插销配重铁塔。",
    adjustmentTips: "1. 拔出座椅下方的黄色把手调节高度，确保坐正握把时，手柄与胸肌中缝（乳头线）处于同一水平面；\n2. 背部贴紧靠垫，双臂保持微屈弧度；\n3. 像抱一棵大树一样向胸前收拢合拢，顶峰停顿 1 秒挤压胸肌；\n4. 缓慢放开至胸部拉伸即可，切忌向后拉得过远防止肩关节受损。",
    commonMistakes: "座椅太低导致耸肩借力伤及肩袖、手臂完全打直、借力含胸。",
    relatedExerciseIds: ["ex-cable-fly", "ex-cable-crossover", "ex-dumbbell-fly"]
  },
  {
    id: "eq-cable-crossover",
    name: "龙门架 / 大飞鸟缆绳训练机",
    englishName: "Dual Cable Crossover / Functional Trainer",
    aliases: ["龙门架", "大飞鸟", "小飞鸟", "飞鸟架", "双滑轮缆绳机", "cable crossover", "龙门架飞鸟", "绳索大飞鸟"],
    category: "full_body",
    categoryName: "全身功能性 / 胸·背·肩·手臂全能",
    imageUrl: "./machines/cable-crossover.jpg",
    tags: ["双立柱立塔", "全高度可调滑轮", "顶部引体横梁", "钢丝绳手柄"],
    appearanceFeature: "由两根高耸的立柱配重铁塔和顶部一条横梁相连的大型开阔钢架。每根立柱上都有一个可以从最底部滑到最顶部的可调滑轮套筒，滑轮末端带快挂扣，可以根据需要挂上单手拉环、直杆或麻绳。",
    adjustmentTips: "1. 捏住立柱滑轮套筒上的黄色弹簧插销，上下滑动滑轮到所需高度并松手卡紧孔位；\n2. 根据动作挂上对应握把（如夹胸用 D 型单手环，三头下压用三头麻绳）；\n3. 调节配重插销，双脚前后弓步站稳，收紧核心保持躯干稳定发力。",
    commonMistakes: "两侧滑轮孔位高低不一致；训练时躯干前后剧烈晃动甩动借力。",
    relatedExerciseIds: ["ex-cable-crossover", "ex-cable-lateral-raise", "ex-cable-upright-row", "ex-cable-curl"]
  },
  {
    id: "eq-seated-row",
    name: "坐姿划船机 / 低位拉背机",
    englishName: "Seated Cable Row Machine",
    aliases: ["坐姿划船", "划船机", "低拉机", "坐姿缆绳划船", "seated row", "划船器", "低位划船"],
    category: "back",
    categoryName: "背部 / 背阔肌·斜方肌中下部·菱形肌",
    imageUrl: "./machines/seated-row.jpg",
    tags: ["长条形座椅", "前倾金属脚踏", "底部低位滑轮", "V字双手柄"],
    appearanceFeature: "一条平坦的长条形座椅，前方底部装有一对向前倾斜的钢制脚踏板。前下方延伸出一根低位钢丝绳滑轮，通常挂着一个三角形双手握把（V-bar）或直把，正前方是插销配重铁塔。",
    adjustmentTips: "1. 坐在长凳上，双脚踏紧前方斜向脚踏，双膝微屈不要锁死；\n2. 俯身双手抓稳把手，借腿部轻微蹬力让躯干坐直，挺胸收腹下沉肩膀；\n3. 肩胛骨主动后缩，将把手水平拉向肚脐或下腹部；\n4. 顶峰停留挤压背部 1 秒，然后受控放回手臂，背部保持平直不可驼背。",
    commonMistakes: "躯干前后大幅晃动像划船一样借力、弯腰驼背拉拽伤害腰椎、耸肩借力。",
    relatedExerciseIds: ["ex-seated-cable-row", "ex-barbell-bent-over-row", "ex-chest-supported-row"]
  },
  {
    id: "eq-plate-loaded-row",
    name: "挂片式胸托坐姿划船机 / Matrix分动划船机",
    englishName: "Plate-Loaded Seated Row / Matrix Row",
    aliases: [
      "挂片划船",
      "挂片坐姿划船",
      "挂片划船机",
      "胸托划船",
      "胸垫划船",
      "胸托划船机",
      "Matrix划船",
      "矩阵划船",
      "分动划船",
      "分动划船机",
      "杠杆划船机",
      "plate loaded row",
      "chest supported row machine",
      "坐姿胸托划船",
      "胸托挂片机"
    ],
    category: "back",
    categoryName: "背部 / 斜方肌中下部·菱形肌·背阔肌厚度",
    imageUrl: "./machines/plate-loaded-row.jpg",
    tags: ["垂直胸托支撑垫", "两侧独立挂片杠杆臂", "多角度抓握把手", "圆弧发散轨迹"],
    appearanceFeature: "机身正前方配备一块厚实的竖直皮质胸托支撑垫与可调节高低的座椅。左右两侧各有一根独立旋转的杠杆摆臂，摆臂外侧伸出粗壮的奥林匹克挂片杆（用于加挂大孔杠铃片）。转轴通常有 MATRIX 等高端商用标志，握把提供高位横握、倾斜握与垂直对握多把位，拉动时轨迹向外微发散，高度贴合背肌解剖走向。",
    adjustmentTips: "1. 拔出座椅下方的黄色调节销，调整坐垫高度，使胸托垫上沿位于胸骨正中（避免胸垫卡住锁骨或横膈膜影响呼吸）；\n2. 双脚平踩踏实，胸口完全贴紧前支撑胸托，收紧核心；\n3. 握法与目标肌群：\n   - 高位/横向握把（手肘外展约 60°-75°）：主攻上背、斜方肌中下束、大/小菱形肌，打造背部立体厚度；\n   - 垂直/对握把手（手肘紧贴肋侧后拉）：主攻背阔肌下延及躯干侧向展开；\n4. 动作全程胸骨紧贴胸垫，切忌靠腰部反弓后仰甩动，终点挤压背胛 1 秒，缓慢对抗离心还原。",
    commonMistakes: "身体后仰离开胸垫用腰椎借力（彻底失去器械保护腰椎的核心优势）、只用手臂拉拽而肩胛骨锁死不收缩、下放时松懈任由杠铃片撞击底架。",
    relatedExerciseIds: ["ex-lever-seated-row", "ex-chest-supported-row", "ex-seated-cable-row"]
  },
  {
    id: "eq-leg-extension",
    name: "坐姿腿屈伸机",
    englishName: "Leg Extension Machine",
    aliases: ["腿屈伸", "坐姿踢腿机", "大腿前侧机", "腿伸展机", "leg extension", "坐姿腿伸展", "踢腿机"],
    category: "legs",
    categoryName: "腿部 / 股四头肌孤立雕刻",
    imageUrl: "./machines/leg-extension.jpg",
    tags: ["坐姿椅", "小腿前侧海绵滚轴", "两侧稳固抓握把手", "旋转转轴配重"],
    appearanceFeature: "带靠背的单人座椅，座椅前方伸出一根横向的软海绵圆柱滚轮。座椅两侧各有一根黑色防滑抓手，转轴处连接着插销配重铁塔与黄色角度调节拨盘。",
    adjustmentTips: "1. 调节靠背前后位置，使膝盖弯曲转轴刚好与器械侧面的圆形转轴平齐，膝窝贴紧坐垫前沿；\n2. 调节小腿滚轴高度，让滚轴刚好贴在脚踝正上方、小腿骨下段；\n3. 双手死死抓住两侧把手固定臀部，股四头肌发力将小腿向上踢起直至平直；\n4. 顶峰稍作停顿，受控缓慢下放。",
    commonMistakes: "依靠爆发力猛踢猛砸损伤膝盖十字韧带、膝关节未与器械转轴对齐。",
    relatedExerciseIds: ["ex-leg-extension", "ex-barbell-squat", "ex-leg-press"]
  },
  {
    id: "eq-chest-press",
    name: "坐姿器械推胸机",
    englishName: "Seated Chest Press Machine",
    aliases: ["推胸机", "坐姿推胸", "坐姿推胸器", "推胸器械", "chest press machine", "固定推胸机", "推胸"],
    category: "chest",
    categoryName: "胸部 / 胸大肌整体厚度",
    imageUrl: "./machines/chest-press.jpg",
    tags: ["垂直靠背座椅", "横竖双把位推杆", "黄色座椅升降把", "前方推举摇臂"],
    appearanceFeature: "正坐靠背座椅，两侧向前伸出一对连着独立摆臂的金属握把（通常包含横握与对握两个把位）。座椅下方有醒目的黄色升降卡扣，旁边连着垂直插销配重铁塔。",
    adjustmentTips: "1. 拔出座椅下方的黄色调节销，调节座椅高度，确保手柄刚好正对胸肌中下部（乳头水平线）；\n2. 挺胸收腹，沉肩并后收肩胛骨紧贴靠垫；\n3. 双手向前推起手柄，在推直前保持手肘微屈，切勿锁死；\n4. 缓慢匀速下放让胸肌充分拉伸受力。",
    commonMistakes: "座椅调太低导致推杆对准锁骨甚至脖子（极易引发肩峰撞击）、推起时肩膀前耸脱离靠垫。",
    relatedExerciseIds: ["ex-chest-press-machine", "ex-barbell-bench-press", "ex-dumbbell-bench-press"]
  }
];

/**
 * Normalizes query string for flexible fuzzy matching
 */
function cleanQuery(str) {
  if (typeof str !== "string") return "";
  return str.toLowerCase().replace(/[\s\-_，。？！、\(\)（）/·]/g, "");
}

/**
 * Generates an absolute direct URL for the equipment image
 */
export function getEquipmentDirectUrl(eq) {
  if (!eq || !eq.imageUrl) return "";
  if (typeof window !== "undefined" && window.location) {
    try {
      return new URL(eq.imageUrl, window.location.origin).href;
    } catch {
      return eq.imageUrl;
    }
  }
  return eq.imageUrl;
}

/**
 * Searches and retrieves gym equipment visual profile by name, alias or colloquial description
 */
export function findGymEquipmentVisual(query) {
  if (!query || typeof query !== "string") return null;
  const q = cleanQuery(query);
  if (!q) return null;

  // 1. Exact or alias match
  for (const eq of GYM_EQUIPMENT_VISUALS) {
    if (cleanQuery(eq.id) === q || cleanQuery(eq.name) === q || cleanQuery(eq.englishName) === q) {
      return eq;
    }
    for (const alias of eq.aliases) {
      if (cleanQuery(alias) === q) return eq;
    }
  }

  // 2. Substring containment match (query contains equipment alias, or alias contains query)
  for (const eq of GYM_EQUIPMENT_VISUALS) {
    const candidates = [eq.name, eq.englishName, ...eq.aliases];
    for (const cand of candidates) {
      const c = cleanQuery(cand);
      if (!c) continue;
      // If query contains alias (e.g. "蝴蝶机长啥样" contains "蝴蝶机", "飞鸟机怎么找" contains "飞鸟机")
      if (c.length >= 2 && q.includes(c)) {
        return eq;
      }
      // If alias contains query (e.g. "蝴蝶机" contains "蝴蝶")
      if (q.length >= 2 && c.includes(q)) {
        return eq;
      }
    }
  }

  // 3. Feature tags / keyword matching
  const scored = GYM_EQUIPMENT_VISUALS.map(eq => {
    let score = 0;
    for (const tag of eq.tags) {
      const ct = cleanQuery(tag);
      if (ct.length >= 2 && q.includes(ct)) score += 6;
    }
    for (const alias of eq.aliases) {
      const ca = cleanQuery(alias);
      if (ca.length >= 2 && q.includes(ca)) {
        score += 8;
      }
    }
    return { eq, score };
  });

  scored.sort((a, b) => b.score - a.score);
  if (scored.length > 0 && scored[0].score >= 6) {
    return scored[0].eq;
  }

  return null;
}
