import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";

import GymMachineFinderModal from "../src/components/GymMachineFinderModal.vue";
import ExerciseDetailModal from "../src/components/ExerciseDetailModal.vue";
import ExercisePickerModal from "../src/components/ExercisePickerModal.vue";
import ExercisesView from "../src/views/ExercisesView.vue";
import TodayView from "../src/views/TodayView.vue";

import { 
  store, 
  startWorkout, 
  discardActiveWorkout, 
  addExerciseToActiveWorkout,
  replaceExerciseInActiveWorkout
} from "../src/store/fitnessStore.js";
import { aiSession, openAICoachWithContext } from "../src/ai/aiSession.js";
import * as imageProcessor from "../src/ai/imageProcessor.js";
import * as scrollLock from "../src/utils/scrollLock.js";
import { DEFAULT_EXERCISES } from "../src/data/defaultPlans.js";

describe("Milestone 2: Multimodal Gym Machine Finder & Scientific Anatomy UI", () => {
  beforeEach(() => {
    store.pinnedExerciseIds = [];
    store.workoutLogs = [];
    store.activeWorkout = null;
    store.settings.themeMode = "dark";
    store.settings.uiSkin = "default";
    aiSession.drawerOpen = false;
    aiSession.conversation = [];
    aiSession.apiMessages = [];
  });

  afterEach(() => {
    if (store.activeWorkout) {
      discardActiveWorkout();
    }
    vi.restoreAllMocks();
  });

  describe("GymMachineFinderModal.vue", () => {
    it("mounts cleanly when visible and locks body scroll", async () => {
      const lockSpy = vi.spyOn(scrollLock, "lockBodyScroll");
      const unlockSpy = vi.spyOn(scrollLock, "unlockBodyScroll");

      const wrapper = mount(GymMachineFinderModal, {
        props: { visible: true },
        global: {
          stubs: { Teleport: true }
        }
      });

      expect(lockSpy).toHaveBeenCalled();
      expect(wrapper.text()).toContain("器械多模态智能识别");

      await wrapper.setProps({ visible: false });
      expect(unlockSpy).toHaveBeenCalled();
      wrapper.unmount();
    });

    it("renders all 3 multimodal input vectors and 6 fallback colloquial pills", () => {
      const wrapper = mount(GymMachineFinderModal, {
        props: { visible: true },
        global: {
          stubs: { Teleport: true }
        }
      });

      // Vector 1: Camera file input
      const fileInput = wrapper.find('input[type="file"]');
      expect(fileInput.exists()).toBe(true);
      expect(fileInput.attributes("accept")).toContain("image/");

      // Vector 2: Voice button
      const voiceButton = wrapper.find('button[title*="语音"]');
      expect(voiceButton.exists()).toBe(true);

      // Vector 3: Colloquial search input
      const textInput = wrapper.find('input[type="text"]');
      expect(textInput.exists()).toBe(true);

      // 6 Colloquial quick pills
      const expectedPills = [
        "坐着手往前推的黄色杠杆器械",
        "躺着往上蹬大腿的斜面大器械",
        "坐着往下拉背的高位器械",
        "坐着两手往中间夹胸的蝴蝶机",
        "坐着把小腿向上踢直的腿屈伸",
        "趴着小腿往后勾的腿弯举"
      ];
      for (const pill of expectedPills) {
        expect(wrapper.text()).toContain(pill);
      }

      wrapper.unmount();
    });

    it("matches exercise and displays confidence percentage badge upon clicking colloquial quick pill", async () => {
      const wrapper = mount(GymMachineFinderModal, {
        props: { visible: true },
        global: {
          stubs: { Teleport: true }
        }
      });

      // Find pill for chest press machine: "坐着手往前推的黄色杠杆器械"
      const pillButtons = wrapper.findAll("button").filter(b => b.text().includes("坐着手往前推"));
      expect(pillButtons.length).toBeGreaterThan(0);

      await pillButtons[0].trigger("click");
      await nextTick();

      const input = wrapper.find('input[type="text"]');
      expect(input.element.value).toBe("坐着手往前推的黄色杠杆器械");

      // Results should list machine chest press with high confidence
      expect(wrapper.text()).toContain("固定器械推胸");
      expect(wrapper.text()).toMatch(/\d+%\s*(精准匹配|高度匹配)/);
      expect(wrapper.text()).toContain("胸部");
      expect(wrapper.text()).toContain("识别依据");

      wrapper.unmount();
    });

    it("matches exercises on manual natural language query input", async () => {
      const wrapper = mount(GymMachineFinderModal, {
        props: { visible: true },
        global: {
          stubs: { Teleport: true }
        }
      });

      const input = wrapper.find('input[type="text"]');
      await input.setValue("躺着蹬大腿斜面器械");
      await nextTick();

      expect(wrapper.text()).toContain("倒蹬腿举");
      expect(wrapper.text()).toMatch(/\d+%\s*(精准匹配|高度匹配)/);

      wrapper.unmount();
    });

    it("handles camera photo file selection with processImageFile", async () => {
      vi.spyOn(imageProcessor, "processImageFile").mockResolvedValue({
        name: "坐姿划船机.jpg",
        type: "image/jpeg",
        width: 800,
        height: 600,
        dataUrl: "data:image/jpeg;base64,mockImageData",
        size: 10240
      });

      const wrapper = mount(GymMachineFinderModal, {
        props: { visible: true },
        global: {
          stubs: { Teleport: true }
        }
      });

      const fileInput = wrapper.find('input[type="file"]');
      const fakeFile = new File(["test"], "坐姿划船机.jpg", { type: "image/jpeg" });
      Object.defineProperty(fileInput.element, "files", {
        value: [fakeFile],
        writable: true
      });

      await fileInput.trigger("change");
      await flushPromises();

      expect(imageProcessor.processImageFile).toHaveBeenCalledWith(fakeFile);
      expect(wrapper.text()).toContain("已加载照片: 坐姿划船机.jpg");
      // Search results should identify rowing machine
      expect(wrapper.text()).toContain("坐姿绳索划船");

      wrapper.unmount();
    });

    it("1-click '+ 一键加入今日训练' adds exercise to active workout and emits select", async () => {
      startWorkout("plan-push");
      const initialExerciseCount = store.activeWorkout.exercises.length;

      const wrapper = mount(GymMachineFinderModal, {
        props: { visible: true },
        global: {
          stubs: { Teleport: true }
        }
      });

      const input = wrapper.find('input[type="text"]');
      await input.setValue("蝴蝶机夹胸");
      await nextTick();

      const addButtons = wrapper.findAll("button").filter(b => b.text().includes("+ 一键加入今日训练"));
      expect(addButtons.length).toBeGreaterThan(0);

      await addButtons[0].trigger("click");
      await nextTick();

      expect(store.activeWorkout.exercises.length).toBe(initialExerciseCount + 1);
      const lastAdded = store.activeWorkout.exercises[store.activeWorkout.exercises.length - 1];
      expect(lastAdded.name).toContain("夹胸");

      expect(wrapper.emitted("select")).toBeTruthy();
      expect(wrapper.emitted("select")[0][0].name).toContain("夹胸");
      expect(wrapper.emitted("select")[0][1].mode).toBe("add");

      wrapper.unmount();
    });

    it("replace mode renders replace index and replaces exercise at index", async () => {
      startWorkout("plan-push");
      const originalFirstEx = store.activeWorkout.exercises[0].name;

      const wrapper = mount(GymMachineFinderModal, {
        props: { 
          visible: true,
          replaceIndex: 0
        },
        global: {
          stubs: { Teleport: true }
        }
      });

      expect(wrapper.text()).toContain("替换第 1 项");

      const input = wrapper.find('input[type="text"]');
      await input.setValue("腿屈伸踢腿");
      await nextTick();

      const replaceButtons = wrapper.findAll("button").filter(b => b.text().includes("替换当前动作"));
      expect(replaceButtons.length).toBeGreaterThan(0);

      await replaceButtons[0].trigger("click");
      await nextTick();

      expect(store.activeWorkout.exercises[0].name).toContain("腿屈伸");
      expect(store.activeWorkout.exercises[0].name).not.toBe(originalFirstEx);

      expect(wrapper.emitted("select")).toBeTruthy();
      expect(wrapper.emitted("select")[0][1]).toEqual({ mode: "replace", replaceIndex: 0 });

      wrapper.unmount();
    });
  });

  describe("ExerciseDetailModal.vue Biomechanics & AI Coach Enhancements", () => {
    const sampleExercise = DEFAULT_EXERCISES.find(e => e.id === "ex-machine-chest-press") || {
      id: "ex-machine-chest-press",
      name: "固定器械推胸",
      englishName: "Machine Chest Press",
      category: "胸部",
      target: "胸大肌中部、前锯肌",
      secondaryMuscles: ["肱三头肌", "三角肌前束"],
      tips: {
        prep: "调整座椅高度至握把对齐乳头连线",
        execution: "沿导轨向前平推",
        peak: "顶峰内收收紧胸肌",
        negative: "2-3秒控制离心退让",
        breathing: "推起呼气，还原吸气"
      },
      commonMistakes: ["推起时耸肩代偿", "折腕导致腕关节受压"]
    };

    it("renders movement plane badge and force vector alignment cue", () => {
      const wrapper = mount(ExerciseDetailModal, {
        props: {
          visible: true,
          exercise: sampleExercise
        },
        global: {
          stubs: { Teleport: true }
        }
      });

      // Anatomical movement plane badge
      expect(wrapper.text()).toContain("平面:");
      expect(wrapper.text()).toMatch(/(矢状面|冠状面|水平面)/);

      // Force vector cue
      expect(wrapper.text()).toContain("力线避坑指南");
      expect(wrapper.text()).toContain("肌纤维走向与阻力方向同轴");
      expect(wrapper.text()).toContain("胸大肌力线同轴");

      wrapper.unmount();
    });

    it("renders biomechanical compensation checklist", () => {
      const wrapper = mount(ExerciseDetailModal, {
        props: {
          visible: true,
          exercise: sampleExercise
        },
        global: {
          stubs: { Teleport: true }
        }
      });

      expect(wrapper.text()).toContain("常见代偿警示排查表");
      expect(wrapper.text()).toContain("耸肩代偿");
      expect(wrapper.text()).toContain("手腕过度背屈折腕");
      expect(wrapper.text()).toContain("腰椎过度起桥超伸");

      wrapper.unmount();
    });

    it("renders 1-click AI coach pills and invokes openAICoachWithContext when clicked", async () => {
      const wrapper = mount(ExerciseDetailModal, {
        props: {
          visible: true,
          exercise: sampleExercise
        },
        global: {
          stubs: { Teleport: true }
        }
      });

      expect(wrapper.text()).toContain("随身 AI 运动生物力学教练");
      expect(wrapper.text()).toContain("斜板角度多大最好？");
      expect(wrapper.text()).toContain("推胸手腕疼怎么调？");
      expect(wrapper.text()).toContain("怎样最大化孤立刺激？");

      const pillButton = wrapper.findAll("button").find(b => b.text().includes("推胸手腕疼怎么调？"));
      expect(pillButton).toBeDefined();

      await pillButton.trigger("click");
      await nextTick();

      expect(aiSession.drawerOpen).toBe(true);
      expect(aiSession.conversation.length).toBeGreaterThan(0);
      expect(aiSession.conversation[aiSession.conversation.length - 1].text).toContain("推胸手腕疼怎么调？");
      expect(aiSession.apiMessages[aiSession.apiMessages.length - 1].content).toContain("固定器械推胸");

      expect(wrapper.emitted("close")).toBeTruthy();
      wrapper.unmount();
    });
  });

  describe("ExercisePickerModal.vue ⭐常用偏好 & Machine Finder Trigger", () => {
    it("renders ⭐常用偏好 as the first category tab", () => {
      const wrapper = mount(ExercisePickerModal, {
        props: { visible: true },
        global: {
          stubs: { Teleport: true }
        }
      });

      const buttons = wrapper.findAll("button");
      const categoryButtons = buttons.filter(b => b.text().startsWith("⭐") || b.text() === "全部");
      expect(categoryButtons[0].text()).toBe("⭐常用偏好");

      wrapper.unmount();
    });

    it("displays memory pool groups (pinned, frequent, recent) when ⭐常用偏好 is active", async () => {
      // Setup mock logs and pinned IDs
      store.pinnedExerciseIds = ["ex-incline-db-bench"];
      store.workoutLogs = [
        {
          id: "log-1",
          completedAt: Date.now() - 3600 * 1000,
          exercises: [
            {
              exerciseId: "ex-lat-pulldown",
              name: "对握/宽握高位下拉",
              sets: [{ completed: true, weight: 50, reps: 10 }]
            },
            {
              exerciseId: "ex-seated-cable-row",
              name: "坐姿绳索划船",
              sets: [{ completed: true, weight: 45, reps: 12 }]
            }
          ]
        }
      ];

      const wrapper = mount(ExercisePickerModal, {
        props: { visible: true },
        global: {
          stubs: { Teleport: true }
        }
      });

      await nextTick();

      // Pinned section
      expect(wrapper.text()).toContain("置顶动作 (Pinned)");
      expect(wrapper.text()).toContain("上斜哑铃卧推");

      // Frequent / Recent section
      expect(wrapper.text()).toContain("对握/宽握高位下拉");
      expect(wrapper.text()).toContain("坐姿绳索划船");

      wrapper.unmount();
    });

    it("renders prominent '📸 拍照 / 语音秒找未知器械' button and opens GymMachineFinderModal", async () => {
      const wrapper = mount(ExercisePickerModal, {
        props: { visible: true },
        global: {
          stubs: { Teleport: true }
        }
      });

      const finderBtn = wrapper.find('button[class*="from-amber-500"]');
      expect(finderBtn.exists()).toBe(true);
      expect(finderBtn.text()).toContain("拍照 / 语音秒找未知器械");

      await finderBtn.trigger("click");
      await nextTick();

      const finderModal = wrapper.findComponent(GymMachineFinderModal);
      expect(finderModal.exists()).toBe(true);
      expect(finderModal.props("visible")).toBe(true);

      wrapper.unmount();
    });
  });

  describe("ExercisesView.vue & TodayView.vue Multimodal Machine Finder Entry Integration", () => {
    it("ExercisesView renders 📸 识器械 button and opens GymMachineFinderModal", async () => {
      const wrapper = mount(ExercisesView, {
        global: {
          stubs: { Teleport: true }
        }
      });

      const finderButton = wrapper.find('button[title*="拍照/语音智能识器械"]');
      expect(finderButton.exists()).toBe(true);

      await finderButton.trigger("click");
      await nextTick();

      const finderModal = wrapper.findComponent(GymMachineFinderModal);
      expect(finderModal.exists()).toBe(true);
      expect(finderModal.props("visible")).toBe(true);

      wrapper.unmount();
    });

    it("TodayView cockpit mode renders 📸 器械识别 button", async () => {
      const wrapper = mount(TodayView, {
        global: {
          stubs: { Teleport: true }
        }
      });

      const finderLinks = wrapper.findAll("button").filter(b => b.text().includes("器械识别"));
      expect(finderLinks.length).toBeGreaterThan(0);

      await finderLinks[0].trigger("click");
      await nextTick();

      const finderModal = wrapper.findComponent(GymMachineFinderModal);
      expect(finderModal.exists()).toBe(true);
      expect(finderModal.props("visible")).toBe(true);

      wrapper.unmount();
    });

    it("TodayView active workout renders 📸 拍照/语音识器械 quick entry and row action", async () => {
      startWorkout("plan-push");
      const wrapper = mount(TodayView, {
        global: {
          stubs: { Teleport: true }
        }
      });

      const finderBarBtn = wrapper.findAll("button").find(b => b.text().includes("拍照/语音识器械"));
      expect(finderBarBtn).toBeDefined();

      await finderBarBtn.trigger("click");
      await nextTick();

      const finderModal = wrapper.findComponent(GymMachineFinderModal);
      expect(finderModal.exists()).toBe(true);
      expect(finderModal.props("visible")).toBe(true);
      expect(finderModal.props("replaceIndex")).toBe(-1);

      // Row action for replacing
      const rowCameraBtn = wrapper.find('button[title*="器械拍照/语音识别替换"]');
      expect(rowCameraBtn.exists()).toBe(true);

      await rowCameraBtn.trigger("click");
      await nextTick();

      expect(finderModal.props("replaceIndex")).toBe(0);

      wrapper.unmount();
    });
  });
});
