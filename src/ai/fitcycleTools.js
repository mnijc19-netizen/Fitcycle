import {
  store,
  getTodayPlan,
  getExerciseDetails,
  startWorkout,
  toggleSetCompletion,
  addExerciseToActiveWorkout,
  replaceExerciseInActiveWorkout,
  finishWorkout,
  savePlan,
  saveCustomCycle,
  setUISkin,
  startRestTimer,
  stopRestTimer
} from "../store/fitnessStore.js";

const EMPTY_OBJECT_SCHEMA = { type: "object", properties: {}, additionalProperties: false };
const INDEX = { type: "integer", minimum: 0 };
const POSITIVE_NUMBER = { type: "number", minimum: 0, maximum: 2000 };
const REPS = { type: "integer", minimum: 0, maximum: 1000 };
const ID = { type: "string", minLength: 1, maxLength: 160 };

const exerciseInPlanSchema = {
  type: "object",
  properties: {
    exerciseId: ID,
    name: { type: "string", minLength: 1, maxLength: 120 },
    setsCount: { type: "integer", minimum: 1, maximum: 20 },
    defaultWeight: POSITIVE_NUMBER,
    targetReps: { type: "string", minLength: 1, maxLength: 40 }
  },
  required: ["exerciseId", "name"],
  additionalProperties: false
};

const planSchema = {
  type: "object",
  properties: {
    id: ID,
    name: { type: "string", minLength: 1, maxLength: 120 },
    shortName: { type: "string", minLength: 1, maxLength: 30 },
    color: { type: "string", enum: ["amber", "sky", "purple", "emerald", "zinc"] },
    coreTarget: { type: "string", maxLength: 300 },
    isRest: { type: "boolean" },
    exercises: { type: "array", maxItems: 40, items: exerciseInPlanSchema }
  },
  required: ["name", "shortName", "color", "exercises"],
  additionalProperties: false
};

const cycleDaySchema = {
  type: "object",
  properties: {
    id: ID,
    name: { type: "string", minLength: 1, maxLength: 80 },
    shortName: { type: "string", minLength: 1, maxLength: 30 },
    planId: ID,
    color: { type: "string", enum: ["amber", "sky", "purple", "emerald", "zinc"] },
    isRest: { type: "boolean" }
  },
  required: ["id", "name", "shortName", "planId", "color", "isRest"],
  additionalProperties: false
};

const definitions = [
  ["get_today_context", "读取今天的循环排期、计划和训练概况。", EMPTY_OBJECT_SCHEMA, "query"],
  ["get_active_workout", "读取当前正在进行的训练和训练组。", EMPTY_OBJECT_SCHEMA, "query"],
  ["search_exercises", "按名称、别名、分类或标签搜索动作库。", {
    type: "object",
    properties: {
      query: { type: "string", minLength: 1, maxLength: 80 },
      limit: { type: "integer", minimum: 1, maximum: 20 }
    },
    required: ["query"],
    additionalProperties: false
  }, "query"],
  ["get_exercise_detail", "读取一个动作的完整详情。", {
    type: "object", properties: { exercise_id: ID }, required: ["exercise_id"], additionalProperties: false
  }, "query"],
  ["get_recent_workouts", "读取最近完成的训练记录。", {
    type: "object", properties: { limit: { type: "integer", minimum: 1, maximum: 30 } }, additionalProperties: false
  }, "query"],
  ["get_training_stats", "汇总指定天数内的训练次数、组数、容量和时长。", {
    type: "object", properties: { days: { type: "integer", minimum: 1, maximum: 3650 } }, additionalProperties: false
  }, "query"],
  ["start_workout", "从已有计划开始一次训练；当前已有训练时会拒绝覆盖。", {
    type: "object",
    properties: { plan_id: ID, date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" } },
    required: ["plan_id"], additionalProperties: false
  }, "low"],
  ["log_workout_set", "记录并完成当前训练中的一组，可撤销。", {
    type: "object",
    properties: { exercise_index: INDEX, set_index: INDEX, weight: POSITIVE_NUMBER, reps: REPS, is_warmup: { type: "boolean" } },
    required: ["exercise_index", "set_index", "weight", "reps"], additionalProperties: false
  }, "low"],
  ["update_workout_set", "修改当前训练中的训练组，可撤销。", {
    type: "object",
    properties: { exercise_index: INDEX, set_index: INDEX, weight: POSITIVE_NUMBER, reps: REPS, is_warmup: { type: "boolean" }, completed: { type: "boolean" } },
    required: ["exercise_index", "set_index"], additionalProperties: false
  }, "low"],
  ["add_or_replace_workout_exercise", "向当前训练增加动作或替换指定动作，可撤销。", {
    type: "object",
    properties: { mode: { type: "string", enum: ["add", "replace"] }, exercise_id: ID, exercise_index: INDEX },
    required: ["mode", "exercise_id"], additionalProperties: false
  }, "low"],
  ["finish_workout", "完成当前训练并写入历史，可撤销。", EMPTY_OBJECT_SCHEMA, "low"],
  ["create_or_update_plan", "创建或更新训练计划，执行前必须由用户确认具体变更。", {
    type: "object", properties: { plan: planSchema }, required: ["plan"], additionalProperties: false
  }, "confirm"],
  ["update_cycle", "修改循环、锚定日期或周计划，执行前必须由用户确认。", {
    type: "object",
    properties: {
      cycle: { type: "object", properties: { id: ID, name: { type: "string", minLength: 1, maxLength: 100 }, days: { type: "array", minItems: 1, maxItems: 31, items: cycleDaySchema } }, required: ["id", "name", "days"], additionalProperties: false },
      mode: { type: "string", enum: ["cycle", "weekly"] },
      anchor_date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
      weekly_schedule: { type: "object", additionalProperties: { type: "string", minLength: 1, maxLength: 160 } }
    },
    minProperties: 1, additionalProperties: false
  }, "confirm"],
  ["update_training_preferences", "修改休息时间、声音、震动或重量单位，执行前必须由用户确认。", {
    type: "object",
    properties: {
      default_rest_seconds: { type: "integer", minimum: 15, maximum: 1800 },
      sound_enabled: { type: "boolean" },
      vibration_enabled: { type: "boolean" },
      weight_unit: { type: "string", enum: ["kg", "lb"] }
    },
    minProperties: 1, additionalProperties: false
  }, "confirm"],
  ["set_unlocked_skin", "切换到用户已经解锁的皮肤；不能解锁皮肤或验证暗号。", {
    type: "object", properties: { skin_name: { type: "string", enum: ["default", "chamber"] } }, required: ["skin_name"], additionalProperties: false
  }, "confirm"]
];

export const FITCYCLE_TOOL_DEFINITIONS = definitions.map(([name, description, parameters]) => ({
  type: "function",
  function: { name, description, parameters }
}));

const metadata = Object.fromEntries(definitions.map(([name, , schema, risk]) => [name, { schema, risk }]));

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function validateJsonSchema(schema, value, path = "参数") {
  const errors = [];
  if (schema.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [`${path}必须是对象`];
    const keys = Object.keys(value);
    if (schema.minProperties && keys.length < schema.minProperties) errors.push(`${path}至少需要 ${schema.minProperties} 个字段`);
    for (const required of schema.required || []) {
      if (!(required in value)) errors.push(`${path}.${required}为必填项`);
    }
    if (schema.additionalProperties === false) {
      for (const key of keys) if (!schema.properties?.[key]) errors.push(`${path}.${key}不是允许的字段`);
    }
    for (const key of keys) {
      const childSchema = schema.properties?.[key] || (typeof schema.additionalProperties === "object" ? schema.additionalProperties : null);
      if (childSchema) errors.push(...validateJsonSchema(childSchema, value[key], `${path}.${key}`));
    }
  } else if (schema.type === "array") {
    if (!Array.isArray(value)) return [`${path}必须是数组`];
    if (schema.minItems != null && value.length < schema.minItems) errors.push(`${path}项目过少`);
    if (schema.maxItems != null && value.length > schema.maxItems) errors.push(`${path}项目过多`);
    value.forEach((item, index) => errors.push(...validateJsonSchema(schema.items, item, `${path}[${index}]`)));
  } else if (schema.type === "string") {
    if (typeof value !== "string") return [`${path}必须是字符串`];
    if (schema.minLength != null && value.length < schema.minLength) errors.push(`${path}不能为空`);
    if (schema.maxLength != null && value.length > schema.maxLength) errors.push(`${path}过长`);
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${path}格式不正确`);
  } else if (schema.type === "integer") {
    if (!Number.isInteger(value)) return [`${path}必须是整数`];
  } else if (schema.type === "number") {
    if (typeof value !== "number" || !Number.isFinite(value)) return [`${path}必须是数字`];
  } else if (schema.type === "boolean" && typeof value !== "boolean") {
    return [`${path}必须是布尔值`];
  }
  if (["number", "integer"].includes(schema.type) && typeof value === "number") {
    if (schema.minimum != null && value < schema.minimum) errors.push(`${path}不能小于 ${schema.minimum}`);
    if (schema.maximum != null && value > schema.maximum) errors.push(`${path}不能大于 ${schema.maximum}`);
  }
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}不是允许的值`);
  return errors;
}

function timerSnapshot() {
  return {
    running: store.restTimer.running,
    remaining: store.restTimer.remaining
  };
}

function restoreTimer(snapshot) {
  if (snapshot?.running && snapshot.remaining > 0) startRestTimer(snapshot.remaining);
  else stopRestTimer();
}

function activeSet(args) {
  const exercise = store.activeWorkout?.exercises?.[args.exercise_index];
  const setItem = exercise?.sets?.[args.set_index];
  if (!exercise || !setItem) throw new Error("找不到指定训练组");
  return { exercise, setItem };
}

function isRealDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function executeTool(name, args) {
  if (name === "get_today_context") {
    const { cycleDay, plan } = getTodayPlan();
    return { data: { date: new Date().toISOString().slice(0, 10), cycleDay: clone(cycleDay), plan: clone(plan), cycle: clone(store.activeCycle), cycleMode: store.cycleMode, anchorDate: store.anchorDate, weeklySchedule: clone(store.weeklySchedule), hasActiveWorkout: Boolean(store.activeWorkout) } };
  }
  if (name === "get_active_workout") return { data: clone(store.activeWorkout) };
  if (name === "search_exercises") {
    const query = args.query.toLowerCase();
    const limit = args.limit || 10;
    const data = store.exercises.filter((exercise) =>
      [exercise.name, exercise.category, ...(exercise.aliases || []), ...(exercise.tags || [])]
        .filter(Boolean).join(" ").toLowerCase().includes(query)
    ).slice(0, limit).map(({ id, name: exerciseName, category, tags, defaultSets, defaultReps }) => ({ id, name: exerciseName, category, tags, defaultSets, defaultReps }));
    return { data };
  }
  if (name === "get_exercise_detail") {
    const exercise = getExerciseDetails(args.exercise_id);
    if (!exercise) throw new Error("找不到指定动作");
    return { data: clone(exercise) };
  }
  if (name === "get_recent_workouts") return { data: clone(store.workoutLogs.slice(0, args.limit || 7)) };
  if (name === "get_training_stats") {
    const days = args.days || 30;
    const cutoff = Date.now() - days * 86400000;
    const logs = store.workoutLogs.filter((log) => (log.completedAt || log.timestamp || 0) >= cutoff);
    return { data: { days, workouts: logs.length, totalSets: logs.reduce((sum, log) => sum + (log.totalSets || 0), 0), totalVolume: logs.reduce((sum, log) => sum + (log.totalVolume || 0), 0), durationSeconds: logs.reduce((sum, log) => sum + (log.durationSeconds || 0), 0) } };
  }
  if (name === "start_workout") {
    if (store.activeWorkout) throw new Error("已有训练正在进行，AI 不会覆盖它");
    if (!store.plans.some((plan) => plan.id === args.plan_id)) throw new Error("找不到指定计划");
    if (args.date && !isRealDate(args.date)) throw new Error("训练日期不是有效日期");
    const beforeTab = store.activeTab;
    startWorkout(args.plan_id, args.date || null);
    return { data: clone(store.activeWorkout), message: "训练已开始", undo: () => { stopRestTimer(); store.activeWorkout = null; store.activeTab = beforeTab; } };
  }
  if (name === "log_workout_set" || name === "update_workout_set") {
    if (!store.activeWorkout) throw new Error("当前没有进行中的训练");
    const { setItem } = activeSet(args);
    const before = clone(setItem);
    const beforeTimer = timerSnapshot();
    if (args.weight != null) setItem.weight = args.weight;
    if (args.reps != null) setItem.reps = args.reps;
    if (args.is_warmup != null) setItem.isWarmup = args.is_warmup;
    const targetCompleted = name === "log_workout_set" ? true : args.completed;
    if (targetCompleted != null && setItem.completed !== targetCompleted) toggleSetCompletion(args.exercise_index, args.set_index);
    return {
      data: clone(setItem), message: name === "log_workout_set" ? "训练组已记录" : "训练组已更新",
      undo: () => { Object.assign(setItem, before); restoreTimer(beforeTimer); }
    };
  }
  if (name === "add_or_replace_workout_exercise") {
    if (!store.activeWorkout) throw new Error("当前没有进行中的训练");
    const exercise = getExerciseDetails(args.exercise_id);
    if (!exercise) throw new Error("找不到指定动作");
    const before = clone(store.activeWorkout.exercises);
    if (args.mode === "replace") {
      if (!Number.isInteger(args.exercise_index)) throw new Error("替换动作时必须提供 exercise_index");
      if (!store.activeWorkout.exercises[args.exercise_index]) throw new Error("找不到要替换的动作");
      replaceExerciseInActiveWorkout(args.exercise_index, exercise);
    } else addExerciseToActiveWorkout(exercise);
    return { data: { mode: args.mode, exercise: { id: exercise.id, name: exercise.name } }, message: args.mode === "add" ? "动作已加入训练" : "训练动作已替换", undo: () => { store.activeWorkout.exercises = before; } };
  }
  if (name === "finish_workout") {
    if (!store.activeWorkout) throw new Error("当前没有进行中的训练");
    const beforeWorkout = clone(store.activeWorkout);
    const beforeLogs = clone(store.workoutLogs);
    const beforeTimer = timerSnapshot();
    const summary = finishWorkout();
    return { data: summary, message: "训练已完成并写入历史", undo: () => { store.workoutLogs = beforeLogs; store.activeWorkout = beforeWorkout; restoreTimer(beforeTimer); } };
  }
  if (name === "create_or_update_plan") {
    const before = clone(store.plans);
    savePlan(args.plan);
    return { data: clone(args.plan), message: "训练计划已保存", undo: () => { store.plans = before; } };
  }
  if (name === "update_cycle") {
    const before = { activeCycle: clone(store.activeCycle), mode: store.cycleMode, anchorDate: store.anchorDate, weeklySchedule: clone(store.weeklySchedule) };
    for (const day of args.cycle?.days || []) if (!store.plans.some((plan) => plan.id === day.planId)) throw new Error(`循环引用了不存在的计划：${day.planId}`);
    if (args.anchor_date && !isRealDate(args.anchor_date)) throw new Error("锚定日期不是有效日期");
    if (args.cycle) saveCustomCycle(args.cycle);
    if (args.mode) store.cycleMode = args.mode;
    if (args.anchor_date) store.anchorDate = args.anchor_date;
    if (args.weekly_schedule) store.weeklySchedule = clone(args.weekly_schedule);
    return { data: { cycle: clone(store.activeCycle), mode: store.cycleMode, anchorDate: store.anchorDate }, message: "训练循环已更新", undo: () => { store.activeCycle = before.activeCycle; store.cycleMode = before.mode; store.anchorDate = before.anchorDate; store.weeklySchedule = before.weeklySchedule; } };
  }
  if (name === "update_training_preferences") {
    const before = clone(store.settings);
    if (args.default_rest_seconds != null) store.settings.defaultRestSeconds = args.default_rest_seconds;
    if (args.sound_enabled != null) store.settings.soundEnabled = args.sound_enabled;
    if (args.vibration_enabled != null) store.settings.vibrationEnabled = args.vibration_enabled;
    if (args.weight_unit != null) store.settings.weightUnit = args.weight_unit;
    return { data: clone(store.settings), message: "训练偏好已更新", undo: () => { store.settings = before; } };
  }
  if (name === "set_unlocked_skin") {
    if (!store.settings.unlockedSkins.includes(args.skin_name)) throw new Error("该皮肤尚未由用户解锁，AI 无权启用");
    const before = store.settings.uiSkin;
    setUISkin(args.skin_name);
    return { data: { uiSkin: store.settings.uiSkin }, message: "外观已切换", undo: () => setUISkin(before) };
  }
  throw new Error("未知工具");
}

function confirmationPreview(name, args) {
  if (name === "create_or_update_plan") return `保存计划“${args.plan.name}”，包含 ${args.plan.exercises.length} 个动作`;
  if (name === "update_cycle") return args.cycle
    ? `将循环改为“${args.cycle.name}”（${args.cycle.days.length} 天）${args.anchor_date ? `，锚定日 ${args.anchor_date}` : ""}`
    : `修改循环排期：${Object.entries(args).map(([key, value]) => `${key}=${typeof value === "object" ? JSON.stringify(value) : value}`).join("，")}`;
  if (name === "update_training_preferences") return `修改训练偏好：${Object.entries(args).map(([key, value]) => `${key}=${value}`).join("，")}`;
  if (name === "set_unlocked_skin") return `切换到已解锁皮肤“${args.skin_name}”`;
  return `执行 ${name}`;
}

export function createFitcycleToolRuntime() {
  const completed = new Map();
  const pending = new Map();
  const undoActions = new Map();

  function perform(callId, name, args) {
    try {
      const output = executeTool(name, args);
      const result = { success: true, callId, tool: name, message: output.message || "查询完成", data: output.data, undoAvailable: Boolean(output.undo) };
      if (output.undo) undoActions.set(callId, output.undo);
      completed.set(callId, result);
      pending.delete(callId);
      return result;
    } catch (error) {
      const result = { success: false, callId, tool: name, message: error instanceof Error ? error.message : "工具执行失败" };
      completed.set(callId, result);
      pending.delete(callId);
      return result;
    }
  }

  return {
    request(toolCall, { modelSupportsTools = true } = {}) {
      const callId = String(toolCall?.id || "");
      if (!modelSupportsTools) return { success: false, callId, message: "当前模型不支持 tools，未执行任何 Fitcycle 操作", code: "tools_unsupported" };
      if (!callId) return { success: false, callId, message: "缺少 call_id，已拒绝执行", code: "missing_call_id" };
      if (completed.has(callId)) return { ...completed.get(callId), deduplicated: true };
      if (pending.has(callId)) return { ...pending.get(callId), deduplicated: true };
      const name = toolCall?.function?.name;
      const meta = metadata[name];
      if (!meta) return { success: false, callId, message: "未知工具，已拒绝执行", code: "unknown_tool" };
      let args;
      try {
        args = JSON.parse(toolCall.function.arguments || "{}");
      } catch {
        return { success: false, callId, tool: name, message: "工具参数不是有效 JSON", code: "invalid_json" };
      }
      const errors = validateJsonSchema(meta.schema, args);
      if (errors.length) return { success: false, callId, tool: name, message: errors.join("；"), code: "invalid_arguments" };
      if (meta.risk === "confirm") {
        const result = { success: false, status: "confirmation_required", callId, tool: name, args, preview: confirmationPreview(name, args) };
        pending.set(callId, result);
        return result;
      }
      return perform(callId, name, args);
    },
    confirm(callId) {
      const item = pending.get(callId);
      if (!item) return { success: false, callId, message: "没有待确认的操作" };
      return perform(callId, item.tool, item.args);
    },
    cancel(callId) {
      const item = pending.get(callId);
      pending.delete(callId);
      const result = { success: false, status: "cancelled", callId, tool: item?.tool, message: "用户已取消，未修改 Fitcycle" };
      completed.set(callId, result);
      return result;
    },
    undo(callId) {
      const undo = undoActions.get(callId);
      if (!undo) return { success: false, callId, message: "该操作不可撤销或已经撤销" };
      try {
        undo();
        undoActions.delete(callId);
        return { success: true, callId, message: "已撤销该操作" };
      } catch {
        return { success: false, callId, message: "撤销失败，训练数据未被进一步修改" };
      }
    },
    clear() {
      completed.clear();
      pending.clear();
      undoActions.clear();
    }
  };
}
