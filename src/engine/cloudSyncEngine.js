/**
 * FitCycle Cloud Sync Engine
 * Lightweight, privacy-first cross-device sync supporting:
 * 1. GitHub Gist (zero-cost serverless backup/restore using user's Personal Access Token)
 * 2. Custom REST / Supabase Endpoint
 * 3. Local JSON export/import and timestamp-based conflict resolution
 */

export const BACKUP_SCHEMA_VERSION = "1.9.0";
export const GIST_FILENAME = "fitcycle-backup.json";

/**
 * Packs reactive store state into a clean, portable backup payload
 * @param {Object} storeState 
 * @returns {Object} backup payload with metadata
 */
export function exportStateToBackupObject(storeState = {}) {
  const timestamp = Date.now();
  const dateStr = new Date(timestamp).toISOString();

  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    appName: "FitCycle",
    exportedAt: dateStr,
    timestamp,
    plans: Array.isArray(storeState.plans) ? JSON.parse(JSON.stringify(storeState.plans)) : [],
    exercises: Array.isArray(storeState.exercises) ? JSON.parse(JSON.stringify(storeState.exercises)) : [],
    pinnedExerciseIds: Array.isArray(storeState.pinnedExerciseIds) ? [...storeState.pinnedExerciseIds] : [],
    activeCycle: storeState.activeCycle ? JSON.parse(JSON.stringify(storeState.activeCycle)) : null,
    anchorDate: storeState.anchorDate || dateStr.slice(0, 10),
    cycleMode: storeState.cycleMode || "cycle",
    weeklySchedule: storeState.weeklySchedule ? JSON.parse(JSON.stringify(storeState.weeklySchedule)) : {},
    workoutLogs: Array.isArray(storeState.workoutLogs) ? JSON.parse(JSON.stringify(storeState.workoutLogs)) : [],
    bodyMetrics: Array.isArray(storeState.bodyMetrics) ? JSON.parse(JSON.stringify(storeState.bodyMetrics)) : [],
    honorProfile: storeState.honorProfile ? JSON.parse(JSON.stringify(storeState.honorProfile)) : null,
    settings: storeState.settings ? JSON.parse(JSON.stringify(storeState.settings)) : {}
  };
}

/**
 * Validates whether a given object is a legitimate FitCycle backup payload
 * @param {any} payload 
 * @returns {Object} { isValid: boolean, error?: string, sanitizedData?: Object }
 */
export function validateBackupPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { isValid: false, error: "备份文件格式无效（非 JSON 对象）" };
  }

  // Check required core sections
  if (!Array.isArray(payload.workoutLogs) && !Array.isArray(payload.plans)) {
    return { isValid: false, error: "缺少必要的训练记录或计划字段" };
  }

  const sanitizedData = {
    plans: Array.isArray(payload.plans) ? payload.plans : [],
    exercises: Array.isArray(payload.exercises) ? payload.exercises : [],
    pinnedExerciseIds: Array.isArray(payload.pinnedExerciseIds) ? payload.pinnedExerciseIds : [],
    activeCycle: payload.activeCycle || null,
    anchorDate: payload.anchorDate || null,
    cycleMode: payload.cycleMode || "cycle",
    weeklySchedule: payload.weeklySchedule || {},
    workoutLogs: Array.isArray(payload.workoutLogs) ? payload.workoutLogs : [],
    bodyMetrics: Array.isArray(payload.bodyMetrics) ? payload.bodyMetrics : [],
    honorProfile: payload.honorProfile || null,
    settings: payload.settings || {},
    timestamp: Number(payload.timestamp) || Date.now()
  };

  return {
    isValid: true,
    sanitizedData
  };
}

/**
 * Resolves conflict between local state and remote cloud backup
 * @param {Object} localPayload 
 * @param {Object} remotePayload 
 * @param {'latest'|'remote'|'local'} strategy 
 * @returns {Object} resolved payload
 */
export function resolveSyncConflict(localPayload, remotePayload, strategy = "latest") {
  if (!localPayload) return remotePayload;
  if (!remotePayload) return localPayload;

  if (strategy === "remote") return remotePayload;
  if (strategy === "local") return localPayload;

  // Default: latest timestamp wins
  const localTime = Number(localPayload.timestamp) || 0;
  const remoteTime = Number(remotePayload.timestamp) || 0;

  if (remoteTime >= localTime) {
    return remotePayload;
  }
  return localPayload;
}

/**
 * Pushes backup payload to GitHub Gist
 * If gistId is empty, creates a new Secret Gist and returns its ID
 * @param {Object} options - { token, gistId, data, description, customFetch }
 * @returns {Promise<Object>} { success: boolean, gistId: string, updatedAt: string, message: string }
 */
export async function pushToGitHubGist({
  token,
  gistId = "",
  data,
  description = "FitCycle Sports Science Cloud Backup",
  customFetch = fetch
}) {
  if (!token) {
    return { success: false, message: "缺少 GitHub Personal Access Token" };
  }

  const payload = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json"
  };

  const body = JSON.stringify({
    description,
    public: false,
    files: {
      [GIST_FILENAME]: {
        content: payload
      }
    }
  });

  try {
    const isUpdate = Boolean(gistId && gistId.trim());
    const url = isUpdate 
      ? `https://api.github.com/gists/${gistId.trim()}`
      : "https://api.github.com/gists";
    
    const method = isUpdate ? "PATCH" : "POST";
    const res = await customFetch(url, { method, headers, body });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return { 
        success: false, 
        message: `GitHub API 响应失败 (${res.status}): ${errText.slice(0, 100)}` 
      };
    }

    const resJson = await res.json();
    return {
      success: true,
      gistId: resJson.id,
      updatedAt: resJson.updated_at || new Date().toISOString(),
      message: isUpdate ? "已成功更新至云端 Gist！" : "已创建并备份至新私有 Gist！"
    };
  } catch (err) {
    return {
      success: false,
      message: `网络或同步请求异常: ${err.message || String(err)}`
    };
  }
}

/**
 * Pulls backup payload from GitHub Gist
 * @param {Object} options - { token, gistId, customFetch }
 * @returns {Promise<Object>} { success: boolean, data?: Object, updatedAt?: string, message: string }
 */
export async function pullFromGitHubGist({
  token,
  gistId,
  customFetch = fetch
}) {
  if (!token || !gistId) {
    return { success: false, message: "缺少 Token 或 Gist ID" };
  }

  const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  };

  try {
    const url = `https://api.github.com/gists/${gistId.trim()}`;
    const res = await customFetch(url, { method: "GET", headers });

    if (!res.ok) {
      return { success: false, message: `拉取失败，HTTP 状态码: ${res.status}` };
    }

    const resJson = await res.json();
    const fileObj = resJson.files?.[GIST_FILENAME] || Object.values(resJson.files || {})[0];

    if (!fileObj || !fileObj.content) {
      return { success: false, message: "Gist 中未找到 FitCycle 备份文件" };
    }

    const parsed = JSON.parse(fileObj.content);
    const validation = validateBackupPayload(parsed);

    if (!validation.isValid) {
      return { success: false, message: `备份数据校验失败: ${validation.error}` };
    }

    return {
      success: true,
      data: validation.sanitizedData,
      updatedAt: resJson.updated_at,
      message: "成功从云端拉取备份数据！"
    };
  } catch (err) {
    return {
      success: false,
      message: `拉取备份解析异常: ${err.message || String(err)}`
    };
  }
}

/**
 * Syncs backup payload to a custom REST / Supabase webhook endpoint
 * @param {Object} options - { endpoint, apiKey, data, customFetch }
 * @returns {Promise<Object>}
 */
export async function syncToCustomEndpoint({
  endpoint,
  apiKey = "",
  data,
  customFetch = fetch
}) {
  if (!endpoint) {
    return { success: false, message: "缺少自定义云端接口地址" };
  }

  const headers = {
    "Content-Type": "application/json"
  };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
    headers["apikey"] = apiKey; // Supabase compatibility
  }

  try {
    const payload = typeof data === "string" ? data : JSON.stringify(data);
    const res = await customFetch(endpoint, {
      method: "POST",
      headers,
      body: payload
    });

    if (!res.ok) {
      return { success: false, message: `接口同步失败 (${res.status})` };
    }

    return {
      success: true,
      message: "已同步至自定义云端！"
    };
  } catch (err) {
    return {
      success: false,
      message: `请求自定义接口失败: ${err.message || String(err)}`
    };
  }
}
