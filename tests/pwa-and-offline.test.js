import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { isOnline, networkStatusText } from "../src/utils/networkStatus.js";

describe("FitCycle PWA & Offline Resilience", () => {
  it("validates manifest.webmanifest structure and required fields", () => {
    const manifestPath = path.resolve(__dirname, "../public/manifest.webmanifest");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const content = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(content);

    expect(manifest.name).toContain("FitCycle");
    expect(manifest.short_name).toBe("FitCycle");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("./");
    expect(manifest.theme_color).toBe("#09090b");
    expect(manifest.background_color).toBe("#09090b");
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  });

  it("ensures public/sw.js service worker file exists and caches app shell", () => {
    const swPath = path.resolve(__dirname, "../public/sw.js");
    expect(fs.existsSync(swPath)).toBe(true);

    const swContent = fs.readFileSync(swPath, "utf-8");
    expect(swContent).toContain("addEventListener('install'");
    expect(swContent).toContain("addEventListener('fetch'");
    expect(swContent).toContain("caches.open");
  });

  it("checks index.html contains manifest link", () => {
    const indexPath = path.resolve(__dirname, "../index.html");
    const indexContent = fs.readFileSync(indexPath, "utf-8");
    expect(indexContent).toContain('rel="manifest"');
    expect(indexContent).toContain('href="./manifest.webmanifest"');
  });

  it("provides reactive network status and offline helper text", () => {
    expect(isOnline.value).toBeDefined();
    expect(typeof networkStatusText.value).toBe("string");
  });

  it("verifies mobile fullscreen capsule meta tags and stable viewport architecture", () => {
    const indexPath = path.resolve(__dirname, "../index.html");
    const indexContent = fs.readFileSync(indexPath, "utf-8");

    // Fullscreen and minimal capsule meta tags
    expect(indexContent).toContain('interactive-widget=overlays-content');
    expect(indexContent).toContain('name="apple-mobile-web-app-capable" content="yes"');
    expect(indexContent).toContain('name="apple-touch-fullscreen" content="yes"');
    expect(indexContent).toContain('min-h-[100lvh]');

    // Stable 100lvh in style.css to eliminate scroll resizing
    const cssPath = path.resolve(__dirname, "../src/style.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");
    expect(cssContent).toContain('min-height: 100lvh');
  });
});
