import { describe, expect, it } from "vitest";
import {
  recognizeMachineByQuery,
  extractQueryFeatures,
  FEATURE_CATEGORIES
} from "../src/engine/machineRecognitionEngine.js";
import { DEFAULT_EXERCISES } from "../src/data/defaultPlans.js";

describe("machineRecognitionEngine (Offline Colloquial Gym Machine Recognition)", () => {
  it("recognizes '一个坐着手往前推的黄色杠杆器械' as ex-machine-chest-press with confidence >= 0.90", () => {
    const query = "一个坐着手往前推的黄色杠杆器械";
    const matches = recognizeMachineByQuery(query, DEFAULT_EXERCISES);

    expect(matches.length).toBeGreaterThan(0);
    const topMatch = matches[0];

    expect(topMatch.exercise.id).toBe("ex-machine-chest-press");
    expect(topMatch.exercise.name).toBe("固定器械推胸");
    expect(topMatch.confidence).toBeGreaterThanOrEqual(0.90);
    expect(topMatch.matchedFeatures.length).toBeGreaterThanOrEqual(3);
    expect(topMatch.reasoning).toBeTruthy();
    expect(typeof topMatch.reasoning).toBe("string");
  });

  it("recognizes '躺着往上蹬大腿的斜面大器械' as ex-hack-squat with confidence >= 0.90", () => {
    const query = "躺着往上蹬大腿的斜面大器械";
    const matches = recognizeMachineByQuery(query, DEFAULT_EXERCISES);

    expect(matches.length).toBeGreaterThan(0);
    const topMatch = matches[0];

    expect(topMatch.exercise.id).toBe("ex-hack-squat");
    expect(topMatch.exercise.name).toContain("哈克深蹲");
    expect(topMatch.confidence).toBeGreaterThanOrEqual(0.90);
    expect(topMatch.matchedFeatures.some(f => f.includes("蹬") || f.includes("仰卧") || f.includes("大腿"))).toBe(true);
  });

  it("recognizes '坐着往下拉背的器械' as ex-lat-pulldown with confidence >= 0.90", () => {
    const query = "坐着往下拉背的器械";
    const matches = recognizeMachineByQuery(query, DEFAULT_EXERCISES);

    expect(matches.length).toBeGreaterThan(0);
    const topMatch = matches[0];

    expect(topMatch.exercise.id).toBe("ex-lat-pulldown");
    expect(topMatch.confidence).toBeGreaterThanOrEqual(0.90);
    expect(topMatch.matchedFeatures.some(f => f.includes("下拉") || f.includes("背"))).toBe(true);
  });

  it("recognizes chest fly machine '蝴蝶机夹胸' / '坐着两手往中间合拢的器械'", () => {
    const query = "坐着两手往中间合拢的器械";
    const matches = recognizeMachineByQuery(query, DEFAULT_EXERCISES);

    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].exercise.id).toBe("ex-pec-deck-fly");
    expect(matches[0].confidence).toBeGreaterThanOrEqual(0.80);
  });

  it("recognizes leg extension machine '坐着把小腿向上踢直的腿屈伸器械'", () => {
    const query = "坐着把小腿向上踢直的腿屈伸器械";
    const matches = recognizeMachineByQuery(query, DEFAULT_EXERCISES);

    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].exercise.id).toBe("ex-leg-extension");
    expect(matches[0].confidence).toBeGreaterThanOrEqual(0.85);
  });

  it("recognizes leg curl machines '趴着小腿往后勾的腿弯举器械'", () => {
    const query = "趴着小腿往后勾的腿弯举器械";
    const matches = recognizeMachineByQuery(query, DEFAULT_EXERCISES);

    expect(matches.length).toBeGreaterThan(0);
    const candidateIds = ["ex-lying-leg-curl", "ex-seated-leg-curl", "ex-seated-leg-curl-machine"];
    expect(candidateIds).toContain(matches[0].exercise.id);
    expect(matches[0].confidence).toBeGreaterThanOrEqual(0.80);
  });

  it("gives >= 0.95 confidence for exact exercise name and alias matches", () => {
    const benchMatch = recognizeMachineByQuery("平板杠铃卧推", DEFAULT_EXERCISES);
    expect(benchMatch[0].exercise.id).toBe("ex-barbell-bench-press");
    expect(benchMatch[0].confidence).toBeGreaterThanOrEqual(0.95);

    const rdlMatch = recognizeMachineByQuery("罗马尼亚硬拉", DEFAULT_EXERCISES);
    expect(rdlMatch[0].exercise.id).toBe("ex-rdl");
    expect(rdlMatch[0].confidence).toBeGreaterThanOrEqual(0.95);
  });

  it("handles empty or whitespace-only queries gracefully", () => {
    expect(recognizeMachineByQuery("")).toEqual([]);
    expect(recognizeMachineByQuery("   ")).toEqual([]);
    expect(recognizeMachineByQuery(null)).toEqual([]);
    expect(recognizeMachineByQuery(undefined)).toEqual([]);
  });

  it("respects options.limit and options.threshold", () => {
    const matches = recognizeMachineByQuery("推胸", DEFAULT_EXERCISES, { limit: 2, threshold: 0.40 });
    expect(matches.length).toBeLessThanOrEqual(2);
    matches.forEach(m => {
      expect(m.confidence).toBeGreaterThanOrEqual(0.40);
    });
  });

  it("extractQueryFeatures extracts multi-category tokens", () => {
    const features = extractQueryFeatures("一个坐着手往前推的黄色杠杆器械");
    expect(features.detectedTags.has("posture:seated")).toBe(true);
    expect(features.detectedTags.has("action:push_forward")).toBe(true);
    expect(features.detectedTags.has("visual:yellow")).toBe(true);
    expect(features.detectedTags.has("equipment:lever_hammer_machine")).toBe(true);
  });
});
