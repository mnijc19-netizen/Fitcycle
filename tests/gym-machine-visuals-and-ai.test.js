import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { GYM_EQUIPMENT_VISUALS, findGymEquipmentVisual, getEquipmentDirectUrl } from "../src/data/gymEquipmentVisuals.js";
import { createFitcycleToolRuntime } from "../src/ai/fitcycleTools.js";

describe("Commercial Gym Machine Real-World Visuals & AI Image Tooling", () => {
  it("verifies all registered equipment photos physically exist in public/machines/", () => {
    expect(GYM_EQUIPMENT_VISUALS.length).toBeGreaterThanOrEqual(9);

    for (const eq of GYM_EQUIPMENT_VISUALS) {
      expect(eq.id).toBeDefined();
      expect(eq.name).toBeDefined();
      expect(eq.imageUrl).toMatch(/^\.\/machines\/.+\.jpg$/);

      // Verify physical presence on disk
      const filename = eq.imageUrl.replace("./machines/", "");
      const fullPath = path.resolve(process.cwd(), "public", "machines", filename);
      expect(fs.existsSync(fullPath), `Missing file on disk: ${fullPath}`).toBe(true);

      const stats = fs.statSync(fullPath);
      expect(stats.size).toBeGreaterThan(50000); // High-res image > 50KB
    }
  });

  it("accurately finds equipment by full names, colloquial slang, and English keywords", () => {
    // 1. Hack Squat
    const hack1 = findGymEquipmentVisual("哈克深蹲机");
    const hack2 = findGymEquipmentVisual("哈克深蹲");
    const hack3 = findGymEquipmentVisual("hack squat");
    expect(hack1?.id).toBe("eq-hack-squat");
    expect(hack2?.id).toBe("eq-hack-squat");
    expect(hack3?.id).toBe("eq-hack-squat");
    expect(hack1.appearanceFeature).toContain("45 度");
    expect(hack1.adjustmentTips).toContain("安全锁扣");

    // 2. Leg Press / 倒蹬
    const legPress1 = findGymEquipmentVisual("倒蹬机");
    const legPress2 = findGymEquipmentVisual("45度倒蹬");
    const legPress3 = findGymEquipmentVisual("leg press");
    expect(legPress1?.id).toBe("eq-leg-press");
    expect(legPress2?.id).toBe("eq-leg-press");
    expect(legPress3?.id).toBe("eq-leg-press");

    // 3. Butterfly / Pec Deck (蝴蝶机)
    const pecDeck1 = findGymEquipmentVisual("蝴蝶机");
    const pecDeck2 = findGymEquipmentVisual("蝴蝶机长啥样");
    const pecDeck3 = findGymEquipmentVisual("飞鸟机怎么找");
    expect(pecDeck1?.id).toBe("eq-pec-deck");
    expect(pecDeck2?.id).toBe("eq-pec-deck");
    expect(pecDeck3?.id).toBe("eq-pec-deck");
    expect(pecDeck1.imageUrl).toBe("./machines/pec-deck.jpg");
    expect(getEquipmentDirectUrl(pecDeck1)).toContain("pec-deck.jpg");

    // 4. Cable Crossover / 大飞鸟 / 龙门架
    const cable1 = findGymEquipmentVisual("龙门架");
    const cable2 = findGymEquipmentVisual("大飞鸟");
    expect(cable1?.id).toBe("eq-cable-crossover");
    expect(cable2?.id).toBe("eq-cable-crossover");

    // 5. Smith Machine
    const smith = findGymEquipmentVisual("史密斯架");
    expect(smith?.id).toBe("eq-smith-machine");
  });

  it("handles get_gym_machine_appearance tool execution and formats markdown image output", () => {
    const runtime = createFitcycleToolRuntime();

    // Query Hack Squat
    const res = runtime.request({
      id: "call_test_machine_1",
      function: {
        name: "get_gym_machine_appearance",
        arguments: JSON.stringify({ query: "哈克深蹲机长啥样" })
      }
    });

    expect(res.success).toBe(true);
    expect(res.data.found).toBe(true);
    expect(res.data.equipment.name).toBe("哈克深蹲机");
    expect(res.data.equipment.imageUrl).toBe("./machines/hack-squat.jpg");
    expect(res.message).toContain("哈克深蹲机");
    expect(res.message).toContain("切勿在正文中重复输出 Markdown 图片或外部链接");

    // Query Pec Deck (蝴蝶机)
    const resPec = runtime.request({
      id: "call_test_pec_1",
      function: {
        name: "get_gym_machine_appearance",
        arguments: JSON.stringify({ query: "蝴蝶机长啥样" })
      }
    });
    expect(resPec.success).toBe(true);
    expect(resPec.data.found).toBe(true);
    expect(resPec.data.equipment.name).toContain("蝴蝶机");
    expect(resPec.data.equipment.imageUrl).toBe("./machines/pec-deck.jpg");
    expect(resPec.message).toContain("切勿在正文中重复输出 Markdown 图片或外部链接");

    // Query Unknown machine
    const resUnknown = runtime.request({
      id: "call_test_unknown",
      function: {
        name: "get_gym_machine_appearance",
        arguments: JSON.stringify({ query: "宇宙飞船深蹲仪" })
      }
    });

    expect(resUnknown.success).toBe(true);
    expect(resUnknown.data.found).toBe(false);
    expect(resUnknown.data.availableEquipment).toContain("哈克深蹲机");
  });
});
