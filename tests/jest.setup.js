// Jest setup file
// Add any global test setup here

// Mock Firebase Admin SDK
jest.mock("firebase-admin", () => ({
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn(),
  })),
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
}));

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "test-project";
process.env.FIREBASE_PRIVATE_KEY = "test-key";
process.env.FIREBASE_CLIENT_EMAIL = "test@test.com";
