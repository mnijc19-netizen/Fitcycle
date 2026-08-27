import { reactive } from "vue";

export const OPENROUTER_KEY_SESSION_KEY = "fitcycle_openrouter_session_key";
const MODEL_SESSION_KEY = "fitcycle_openrouter_model";

function readSessionValue(key) {
  try {
    return typeof sessionStorage === "undefined" ? "" : sessionStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function writeSessionValue(key, value) {
  try {
    if (typeof sessionStorage === "undefined") return;
    if (value) sessionStorage.setItem(key, value);
    else sessionStorage.removeItem(key);
  } catch {
    // A blocked sessionStorage must not prevent the in-memory assistant from working.
  }
}

export const aiSession = reactive({
  apiKey: readSessionValue(OPENROUTER_KEY_SESSION_KEY),
  selectedModelId: readSessionValue(MODEL_SESSION_KEY),
  models: [],
  drawerOpen: false,
  connectionState: "idle",
  connectionMessage: "",
  conversation: [],
  apiMessages: []
});

export function setSessionApiKey(apiKey) {
  const clean = typeof apiKey === "string" ? apiKey.trim() : "";
  aiSession.apiKey = clean;
  writeSessionValue(OPENROUTER_KEY_SESSION_KEY, clean);
}

export function setSelectedModel(modelId) {
  const clean = typeof modelId === "string" ? modelId : "";
  aiSession.selectedModelId = clean;
  writeSessionValue(MODEL_SESSION_KEY, clean);
}

export function clearConversation() {
  aiSession.conversation.splice(0);
  aiSession.apiMessages.splice(0);
}

export function clearAIConnection() {
  setSessionApiKey("");
  setSelectedModel("");
  aiSession.models.splice(0);
  aiSession.connectionState = "idle";
  aiSession.connectionMessage = "";
  clearConversation();
}

