import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { store } from "../src/store/fitnessStore.js";
import TodayView from "../src/views/TodayView.vue";
import WorkoutSummaryModal from "../src/components/WorkoutSummaryModal.vue";
import fs from "fs";
import path from "path";

describe("FitCycle Master UI Display and Anti-Truncation Quality Assurance Suite", () => {
  let wrapper = null;

  beforeEach(() => {
    store.workoutLogs = [];
    store.activeWorkout = null;
    store.settings.themeMode = "dark";
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
    document.body.innerHTML = "";
  });

  it("TodayView Telemetry: Dual Pods render zero-truncation punchy metrics and full-width insight banner", async () => {
    const eightMinutesAgo = Date.now() - 8 * 60 * 1000;
    store.workoutLogs = [
      {
        id: "log-1",
        planId: "plan-push",
        shortName: "推",
        planName: "推日 (Push) —— 打造铠甲胸与加宽肩膀",
        date: new Date(eightMinutesAgo).toISOString(),
        completedAt: eightMinutesAgo,
        durationSeconds: 1800,
        totalVolume: 5000,
        totalSets: 9
      }
    ];

    wrapper = mount(TodayView);
    const html = wrapper.html();

    expect(html).toContain("怠惰计时");
    expect(html).toContain("8分钟");
    expect(html).toContain("超量合成 · 0扣分");

    expect(html).toContain("肌群状态");
    expect(html).toContain("恢复 0%");
    expect(html).toContain("上次【推】刚刚练完");

    expect(html).toContain("✦");
    expect(html).toContain("距上次打卡已过 8分钟。肌原纤维与神经中枢正在超量合成重组中");
    expect(html).toContain("break-words");

    const podContent = wrapper.find('.grid-cols-2').text();
    expect(podContent).not.toContain("...");
    expect(podContent).not.toContain("· 肌...");
    expect(podContent).not.toContain("· 恢...");
  });

  it("TodayView Telemetry: verifies all physiological lifecycle phases render clean, readable metrics", async () => {
    wrapper = mount(TodayView);

    // Phase 0: Brand new user with 0 workout logs
    store.workoutLogs = [];
    await wrapper.vm.$nextTick();
    let text = wrapper.text();
    expect(text).toContain("首训待开");
    expect(text).toContain("0~72h 安全期");
    expect(text).toContain("尚未记录过训练，完成首场特训打卡即可激活战力排位");

    // Phase 1: 36 hours later
    const thirtySixHoursAgo = Date.now() - 36 * 3600 * 1000;
    store.workoutLogs = [{
      id: "log-2",
      planId: "plan-push",
      shortName: "推",
      date: new Date(thirtySixHoursAgo).toISOString(),
      completedAt: thirtySixHoursAgo,
      totalVolume: 6000,
      totalSets: 10
    }];
    await wrapper.vm.$nextTick();
    text = wrapper.text();
    expect(text).toMatch(/1天(11|12)小时/);
    expect(text).toContain("满血蓄势 · 适宜重载");
    expect(text).toContain("中枢神经疲劳已完全代谢，肌糖原重装充沛");

    // Phase 2: 60 hours later
    const sixtyHoursAgo = Date.now() - 60 * 3600 * 1000;
    store.workoutLogs = [{
      id: "log-3",
      planId: "plan-push",
      shortName: "推",
      date: new Date(sixtyHoursAgo).toISOString(),
      completedAt: sixtyHoursAgo,
      totalVolume: 6000,
      totalSets: 10
    }];
    await wrapper.vm.$nextTick();
    text = wrapper.text();
    expect(text).toMatch(/2天(11|12)小时/);
    expect(text).toContain("72h临界 · 建议开练");
    expect(text).toContain("运动神经募集感正在衰减，建议今日内开练");

    // Phase 3: 96 hours later
    const ninetySixHoursAgo = Date.now() - 96 * 3600 * 1000;
    store.workoutLogs = [{
      id: "log-4",
      planId: "plan-push",
      shortName: "推",
      date: new Date(ninetySixHoursAgo).toISOString(),
      completedAt: ninetySixHoursAgo,
      totalVolume: 6000,
      totalSets: 10
    }];
    await wrapper.vm.$nextTick();
    text = wrapper.text();
    expect(text).toMatch(/(3天23小时|4天)/);
    expect(text).toContain("怠惰扣分 · 速速开练");
    expect(text).toContain("已严重怠惰超 72 小时！战力分按天递减扣除中");
  });

  it("WorkoutSummaryModal: plan title never suffers broken character truncations", () => {
    wrapper = mount(WorkoutSummaryModal, {
      props: {
        visible: true,
        summary: {
          planName: "推日 (Push) —— 打造铠甲胸与加宽肩膀",
          durationSeconds: 1800,
          totalVolume: 5200,
          totalSets: 9
        }
      }
    });

    const titleEl = wrapper.find('.break-words');
    expect(titleEl.exists()).toBe(true);
    expect(titleEl.text()).toContain("推日 (Push) —— 打造铠甲胸与加宽肩膀");
    expect(titleEl.classes()).not.toContain("truncate");
  });

  it("Light Mode vs Dark Mode: Contrast and Readability Verification in TodayView", async () => {
    store.settings.themeMode = "dark";
    wrapper = mount(TodayView);
    let html = wrapper.html();
    expect(html).toContain("bg-zinc-900/90");
    expect(html).toContain("border-zinc-800");

    store.settings.themeMode = "light";
    await wrapper.vm.$nextTick();
    html = wrapper.html();
    expect(html).toContain("bg-white/95");
    expect(html).toContain("border-slate-200/90");
    expect(html).toContain("text-slate-900");
  });

  it("Static Code Quality Gate: Audits all views and components against dangerous sentence truncations", () => {
    const srcDir = path.resolve(process.cwd(), "src");
    
    function getAllVueFiles(dir, fileList = []) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          getAllVueFiles(filePath, fileList);
        } else if (file.endsWith(".vue")) {
          fileList.push(filePath);
        }
      });
      return fileList;
    }

    const vueFiles = getAllVueFiles(srcDir);
    expect(vueFiles.length).toBeGreaterThan(10);

    const violations = [];
    vueFiles.forEach(file => {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");
      
      lines.forEach((line, idx) => {
        if (line.includes("truncate") && (
          line.includes(".subText") ||
          line.includes(".desc") ||
          line.includes(".insight") ||
          line.includes("肌原纤维") ||
          line.includes("恢复度")
        )) {
          violations.push({
            file: path.basename(file),
            line: idx + 1,
            content: line.trim()
          });
        }
      });
    });

    expect(violations).toEqual([]);
  });
});
