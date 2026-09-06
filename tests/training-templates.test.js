import { describe, it, expect } from "vitest";
import { TRAINING_TEMPLATES, getTrainingTemplateById } from "../src/data/trainingTemplates.js";

describe("FitCycle Scientific Workout Splits & Periodization Registry", () => {
  it("contains all 5 classical evidence-based split templates", () => {
    expect(TRAINING_TEMPLATES).toHaveLength(5);
    const ids = TRAINING_TEMPLATES.map(t => t.id);
    expect(ids).toContain("template-ppl");
    expect(ids).toContain("template-phul");
    expect(ids).toContain("template-arnold");
    expect(ids).toContain("template-531");
    expect(ids).toContain("template-fullbody");
  });

  it("ensures every template has complete metadata, highlights and cycle", () => {
    TRAINING_TEMPLATES.forEach(template => {
      expect(template.name).toBeTruthy();
      expect(template.badge).toBeTruthy();
      expect(template.category).toBeTruthy();
      expect(template.frequency).toBeTruthy();
      expect(template.highlights.length).toBeGreaterThan(0);
      expect(template.cycle).toBeDefined();
      expect(template.cycle.days.length).toBe(template.cycleDaysCount);
      expect(template.plans.length).toBeGreaterThan(0);
    });
  });

  it("ensures every day in template cycle points to a valid plan within template.plans", () => {
    TRAINING_TEMPLATES.forEach(template => {
      const planIds = new Set(template.plans.map(p => p.id));
      template.cycle.days.forEach(day => {
        expect(planIds.has(day.planId)).toBe(true);
      });
    });
  });

  it("ensures non-rest plans contain curated exercises with default weights and reps", () => {
    TRAINING_TEMPLATES.forEach(template => {
      template.plans.forEach(plan => {
        if (!plan.isRest) {
          expect(plan.exercises.length).toBeGreaterThanOrEqual(3);
          plan.exercises.forEach(ex => {
            expect(ex.exerciseId).toBeTruthy();
            expect(ex.name).toBeTruthy();
            expect(ex.setsCount).toBeGreaterThan(0);
            expect(ex.targetReps).toBeTruthy();
            expect(typeof ex.defaultWeight).toBe("number");
          });
        }
      });
    });
  });

  it("retrieves template by ID accurately via getTrainingTemplateById", () => {
    const ppl = getTrainingTemplateById("template-ppl");
    expect(ppl).not.toBeNull();
    expect(ppl.name).toContain("推拉腿");

    const arnold = getTrainingTemplateById("template-arnold");
    expect(arnold).not.toBeNull();
    expect(arnold.name).toContain("阿诺德");

    const unknown = getTrainingTemplateById("non-existent");
    expect(unknown).toBeNull();
  });
});
