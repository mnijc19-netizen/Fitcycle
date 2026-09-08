import { describe, it, expect } from "vitest";
import { 
  CARDIO_MODES, 
  calculateZone2HeartRate, 
  calculateCardioCalories, 
  calculateCardioTonnage, 
  createCardioSession 
} from "../src/engine/cardioEngine.js";

describe("Cardio Engine & Zone 2 Fat-Loss Physiology", () => {
  it("calculates accurate Zone 2 heart rate range based on age (Maffetone/Tanaka)", () => {
    // 25 years old: Max HR = 195, 60% = 117, 70% = 137
    const z25 = calculateZone2HeartRate(25);
    expect(z25.maxHr).toBe(195);
    expect(z25.zone2Min).toBe(117);
    expect(z25.zone2Max).toBe(137);
    expect(z25.formattedRange).toBe("117 ~ 137 bpm");
    expect(z25.bodySensoryCue).toBeTruthy();

    // 40 years old: Max HR = 180, 60% = 108, 70% = 126
    const z40 = calculateZone2HeartRate(40);
    expect(z40.maxHr).toBe(180);
    expect(z40.zone2Min).toBe(108);
    expect(z40.zone2Max).toBe(126);
  });

  it("calculates calories burned using METs scientific formula", () => {
    // Incline walk: METs 7.0, 20 min, 70kg -> (7.0 * 3.5 * 70 / 200) * 20 = 171.5 -> 172 kcal
    const cals = calculateCardioCalories("incline_walk", 20, 70);
    expect(cals).toBe(172);

    // Elliptical: METs 6.5, 30 min, 80kg -> (6.5 * 3.5 * 80 / 200) * 30 = 273 kcal
    const calsElliptical = calculateCardioCalories("elliptical", 30, 80);
    expect(calsElliptical).toBe(273);
  });

  it("calculates equivalent resistance tonnage according to Constitution Chapter 2", () => {
    // Incline walk: 20 min, 70kg, incline 10% -> 20 * 70 * (1 + 0.1) * 0.7 = 1078 kg
    const tonnage = calculateCardioTonnage("incline_walk", 20, 70);
    expect(tonnage).toBe(1078);

    // Elliptical (rowing_bike): calories = 160 -> calories * 12.5 = 2000 kg
    const tonnageElliptical = calculateCardioTonnage("elliptical", 20, 70, 160);
    expect(tonnageElliptical).toBe(2000);
  });

  it("creates a standardized cardio session object", () => {
    const session = createCardioSession({
      modeKey: "incline_walk",
      durationMinutes: 20,
      weightKg: 70,
      age: 25
    });

    expect(session.modeKey).toBe("incline_walk");
    expect(session.durationMinutes).toBe(20);
    expect(session.calories).toBe(172);
    expect(session.equivalentTonnage).toBe(1078);
    expect(session.zone2Target).toBe("117 ~ 137 bpm");
    expect(session.timestamp).toBeTypeOf("number");
  });
});
