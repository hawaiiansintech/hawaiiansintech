import { setupFirebaseHelpers } from "./firebase-test-mocks";

const mockApps: any[] = [];

jest.mock("firebase-admin", () => ({
  get apps() {
    return mockApps;
  },
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(() => ({ type: "service_account" })),
  },
  firestore: jest.fn(() => ({
    settings: jest.fn(),
  })),
}));

jest.mock("@/lib/firebase-helpers/general", () => ({
  __esModule: true,
  default: jest.fn((obj) => obj),
}));

import * as admin from "firebase-admin";
import { initializeAdmin } from "@/lib/firebase-helpers/initializeAdmin";

describe("lib/firebase-helpers/initializeAdmin", () => {
  const originalEnv = process.env;
  const originalWindow = global.window;

  beforeEach(() => {
    setupFirebaseHelpers.beforeEach();
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    mockApps.length = 0;
    delete (global as any).window;
  });

  afterEach(() => {
    process.env = originalEnv;
    global.window = originalWindow;
  });

  describe("initializeAdmin", () => {
    it("should initialize Firebase Admin when not already initialized", async () => {
      const mockServiceAccount = {
        project_id: "test-project",
        client_email: "test@example.com",
        private_key: "test-key",
      };

      process.env.FIREBASE_SERVICE_ACCOUNT_KEY =
        JSON.stringify(mockServiceAccount);

      await initializeAdmin();

      expect(admin.credential.cert).toHaveBeenCalledWith(mockServiceAccount);
      expect(admin.initializeApp).toHaveBeenCalledWith({
        credential: { type: "service_account" },
      });
      expect(admin.firestore).toHaveBeenCalled();
    });

    it("should not initialize if already initialized", async () => {
      const mockServiceAccount = {
        project_id: "test-project",
        client_email: "test@example.com",
        private_key: "test-key",
      };

      process.env.FIREBASE_SERVICE_ACCOUNT_KEY =
        JSON.stringify(mockServiceAccount);
      mockApps.push({ name: "test-app" });

      await initializeAdmin();

      expect(admin.initializeApp).not.toHaveBeenCalled();
    });

    it("should not initialize in browser environment", async () => {
      (global as any).window = {};
      const mockServiceAccount = {
        project_id: "test-project",
        client_email: "test@example.com",
        private_key: "test-key",
      };

      process.env.FIREBASE_SERVICE_ACCOUNT_KEY =
        JSON.stringify(mockServiceAccount);

      await initializeAdmin();

      expect(admin.initializeApp).not.toHaveBeenCalled();
    });

    it("should throw error when FIREBASE_SERVICE_ACCOUNT_KEY is not set", async () => {
      delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

      await expect(initializeAdmin()).rejects.toThrow(
        "The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.",
      );

      expect(admin.initializeApp).not.toHaveBeenCalled();
    });

    it("should throw error when FIREBASE_SERVICE_ACCOUNT_KEY is invalid JSON", async () => {
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY = "invalid-json{";

      await expect(initializeAdmin()).rejects.toThrow(
        "The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not a valid JSON string.",
      );

      expect(admin.initializeApp).not.toHaveBeenCalled();
    });

    it("should throw error when Firebase initialization fails", async () => {
      const mockServiceAccount = {
        project_id: "test-project",
        client_email: "test@example.com",
        private_key: "test-key",
      };

      process.env.FIREBASE_SERVICE_ACCOUNT_KEY =
        JSON.stringify(mockServiceAccount);
      (admin.initializeApp as jest.Mock).mockImplementation(() => {
        throw new Error("Init failed");
      });

      await expect(initializeAdmin()).rejects.toThrow(
        "Failed to initialize Firebase Admin SDK with the provided service account key.",
      );
    });

    it("should configure firestore settings after initialization", async () => {
      const mockServiceAccount = {
        project_id: "test-project",
        client_email: "test@example.com",
        private_key: "test-key",
      };
      const mockSettings = jest.fn();
      const mockFirestoreInstance = { settings: mockSettings };

      process.env.FIREBASE_SERVICE_ACCOUNT_KEY =
        JSON.stringify(mockServiceAccount);
      (admin.firestore as unknown as jest.Mock).mockReturnValue(
        mockFirestoreInstance,
      );
      (admin.initializeApp as jest.Mock).mockImplementation(() => {});

      await initializeAdmin();

      expect(mockSettings).toHaveBeenCalledWith({
        ignoreUndefinedProperties: true,
      });
    });
  });
});
