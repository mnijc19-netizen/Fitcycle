import { describe, it, expect, vi } from "vitest";
import {
  exportStateToBackupObject,
  validateBackupPayload,
  resolveSyncConflict,
  pushToGitHubGist,
  pullFromGitHubGist,
  syncToCustomEndpoint,
  GIST_FILENAME
} from "../src/engine/cloudSyncEngine.js";

describe("FitCycle Cloud Sync Engine", () => {
  describe("1. exportStateToBackupObject & validateBackupPayload", () => {
    it("packs store state into a versioned, timestamped backup object", () => {
      const mockStore = {
        plans: [{ id: "p1", name: "推" }],
        workoutLogs: [{ id: "l1", totalVolume: 3000 }],
        pinnedExerciseIds: ["ex-bench"],
        cycleMode: "weekly",
        settings: { themeMode: "dark" }
      };

      const backup = exportStateToBackupObject(mockStore);
      expect(backup.schemaVersion).toBe("1.9.0");
      expect(backup.appName).toBe("FitCycle");
      expect(backup.timestamp).toBeGreaterThan(0);
      expect(backup.plans).toHaveLength(1);
      expect(backup.workoutLogs).toHaveLength(1);
      expect(backup.pinnedExerciseIds).toContain("ex-bench");
    });

    it("validates valid backup payload successfully", () => {
      const validPayload = {
        plans: [{ id: "p1" }],
        workoutLogs: [{ id: "l1" }],
        timestamp: 1700000000000
      };

      const result = validateBackupPayload(validPayload);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedData.plans).toHaveLength(1);
      expect(result.sanitizedData.workoutLogs).toHaveLength(1);
    });

    it("rejects non-object or incomplete payloads", () => {
      expect(validateBackupPayload(null).isValid).toBe(false);
      expect(validateBackupPayload("string").isValid).toBe(false);
      expect(validateBackupPayload({ foo: "bar" }).isValid).toBe(false);
    });
  });

  describe("2. Conflict Resolution (resolveSyncConflict)", () => {
    it("selects the latest timestamp by default", () => {
      const local = { timestamp: 1000, val: "local" };
      const remote = { timestamp: 2000, val: "remote" };

      expect(resolveSyncConflict(local, remote, "latest")).toBe(remote);
      expect(resolveSyncConflict(remote, local, "latest")).toBe(remote);
    });

    it("honors explicit strategy 'remote' or 'local'", () => {
      const local = { timestamp: 5000, val: "local" };
      const remote = { timestamp: 1000, val: "remote" };

      expect(resolveSyncConflict(local, remote, "remote")).toBe(remote);
      expect(resolveSyncConflict(local, remote, "local")).toBe(local);
    });
  });

  describe("3. pushToGitHubGist", () => {
    it("creates a new secret Gist if gistId is not provided", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "new-gist-123", updated_at: "2026-09-06T12:00:00Z" })
      });

      const res = await pushToGitHubGist({
        token: "ghp_secretToken",
        data: { test: true },
        customFetch: mockFetch
      });

      expect(res.success).toBe(true);
      expect(res.gistId).toBe("new-gist-123");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.github.com/gists",
        expect.objectContaining({ method: "POST" })
      );
    });

    it("updates existing Gist if gistId is provided", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "existing-gist-456", updated_at: "2026-09-06T12:30:00Z" })
      });

      const res = await pushToGitHubGist({
        token: "ghp_secretToken",
        gistId: "existing-gist-456",
        data: { test: true },
        customFetch: mockFetch
      });

      expect(res.success).toBe(true);
      expect(res.gistId).toBe("existing-gist-456");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.github.com/gists/existing-gist-456",
        expect.objectContaining({ method: "PATCH" })
      );
    });

    it("handles API errors gracefully", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => "Bad credentials"
      });

      const res = await pushToGitHubGist({
        token: "ghp_invalid",
        data: {},
        customFetch: mockFetch
      });

      expect(res.success).toBe(false);
      expect(res.message).toContain("401");
    });
  });

  describe("4. pullFromGitHubGist", () => {
    it("pulls and parses backup file from Gist", async () => {
      const mockPayload = {
        schemaVersion: "1.9.0",
        plans: [{ id: "p1" }],
        workoutLogs: [{ id: "l1" }],
        timestamp: 1725620000000
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          updated_at: "2026-09-06T12:00:00Z",
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(mockPayload)
            }
          }
        })
      });

      const res = await pullFromGitHubGist({
        token: "ghp_secret",
        gistId: "gist-abc",
        customFetch: mockFetch
      });

      expect(res.success).toBe(true);
      expect(res.data.plans).toHaveLength(1);
      expect(res.data.workoutLogs).toHaveLength(1);
    });

    it("returns failure when Gist is missing backup file", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          files: {
            "unrelated.txt": { content: "hello" }
          }
        })
      });

      const res = await pullFromGitHubGist({
        token: "ghp_secret",
        gistId: "gist-abc",
        customFetch: mockFetch
      });

      // Will fail validation because "unrelated.txt" content is not valid FitCycle backup
      expect(res.success).toBe(false);
    });
  });

  describe("5. syncToCustomEndpoint", () => {
    it("posts payload with authorization header to custom endpoint", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true
      });

      const res = await syncToCustomEndpoint({
        endpoint: "https://my-supabase.co/rest/v1/sync",
        apiKey: "anon-key-123",
        data: { test: true },
        customFetch: mockFetch
      });

      expect(res.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://my-supabase.co/rest/v1/sync",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            apikey: "anon-key-123",
            Authorization: "Bearer anon-key-123"
          })
        })
      );
    });
  });
});
