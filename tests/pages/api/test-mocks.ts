/**
 * Working Mock Consolidation Utilities
 *
 * This file provides standardized mock setups and scenarios that work with Jest's requirements.
 * The key is to keep the jest.mock() calls in each test file but standardize the mock implementations.
 */

import {
  InvalidApiMethodError,
  MissingHeaderError,
  MissingBodyParamError,
  MissingQueryParamError,
  TokenVerificationError,
  CloudflareVerificationError,
} from "@/lib/api-helpers/errors";

/**
 * Standard mock factory functions that return mock implementations
 * These can be used directly in jest.mock() calls
 */
export const createStandardMocks = {
  auth: () => ({
    verifyAuthHeader: jest.fn(),
    verifyAdminToken: jest.fn(),
    verifyAdminOrEmailAuthToken: jest.fn(),
    verifyEmailAuthToken: jest.fn(),
    verifyTurnstileToken: jest.fn(),
  }),

  format: () => ({
    checkMethods: jest.fn((method, allowedMethods) => {
      if (!allowedMethods.includes(method)) {
        throw new InvalidApiMethodError(`Method ${method} not allowed`);
      }
    }),
    checkQueryParams: jest.fn(),
    checkBodyParams: jest.fn(),
  }),

  members: () => ({
    getMembers: jest.fn(),
    updateMember: jest.fn(),
    addMemberToFirebase: jest.fn(),
    getMemberRef: jest.fn(),
  }),

  emails: () => ({
    getEmails: jest.fn(),
    emailExists: jest.fn(),
    sendVerificationEmail: jest.fn(),
  }),

  filters: () => ({
    getFilters: jest.fn(),
    addMemberToLabels: jest.fn(),
    deleteMemberFromLabels: jest.fn(),
  }),

  emailService: () => ({
    sendConfirmationEmails: jest.fn(),
  }),

  sensitiveChangeEmail: () => ({
    sendSensitiveChangesEmail: jest.fn(),
  }),

  memberValidator: () => ({
    memberPublicValidator: {
      validate: jest.fn(),
    },
  }),

  firebaseAdmin: () => ({
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        })),
      })),
      FieldValue: {
        serverTimestamp: jest.fn(() => "mock-timestamp"),
      },
    })),
    apps: [],
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn(),
      applicationDefault: jest.fn(),
    },
  }),

  // Initialize admin
  initializeAdmin: () => ({
    initializeAdmin: jest.fn(),
  }),

  // Crypto
  crypto: () => ({
    randomBytes: jest.fn(() => ({
      toString: jest.fn(() => "abc123"),
    })),
  }),
};

/**
 * Mock scenario helper functions
 * These work with the imported mock modules to set up common scenarios
 */
export const createMockScenarios = (mockModules: any) => ({
  validUser: () => {
    if (mockModules.auth) {
      mockModules.auth.verifyAuthHeader.mockResolvedValue("user-token");
      mockModules.auth.verifyAdminToken.mockResolvedValue(false);
    }
  },

  validAdmin: () => {
    if (mockModules.auth) {
      mockModules.auth.verifyAuthHeader.mockResolvedValue("admin-token");
      mockModules.auth.verifyAdminToken.mockResolvedValue(true);
    }
  },

  authError: (error: Error) => {
    if (mockModules.auth) {
      mockModules.auth.verifyAuthHeader.mockRejectedValue(error);
    }
  },

  bodyParamError: (param: string) => {
    if (mockModules.format) {
      mockModules.format.checkBodyParams.mockImplementation(() => {
        throw new MissingBodyParamError(param);
      });
    }
  },

  queryParamError: (param: string) => {
    if (mockModules.format) {
      mockModules.format.checkQueryParams.mockImplementation(() => {
        throw new MissingQueryParamError(param);
      });
    }
  },

  successfulMemberOps: () => {
    if (mockModules.members) {
      mockModules.members.getMembers.mockResolvedValue({
        members: [],
        focuses: [],
        industries: [],
        regions: [],
        experience: [],
        cursor: null,
        hasMore: false,
      });
      mockModules.members.updateMember.mockResolvedValue({
        writeTime: "2023-01-01",
      });
      mockModules.members.addMemberToFirebase.mockResolvedValue({
        id: "new-id",
      });
      mockModules.members.getMemberRef.mockResolvedValue("mock-ref");
    }
  },

  emailExists: (exists: boolean = false) => {
    if (mockModules.emails) {
      mockModules.emails.emailExists.mockResolvedValue(exists);
    }
  },

  turnstileSuccess: () => {
    if (mockModules.auth) {
      mockModules.auth.verifyTurnstileToken.mockResolvedValue(undefined);
    }
  },

  turnstileError: () => {
    if (mockModules.auth) {
      mockModules.auth.verifyTurnstileToken.mockRejectedValue(
        new CloudflareVerificationError("Turnstile verification failed"),
      );
    }
  },
});

export const setupHelpers = {
  resetMocks: () => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
    console.debug = jest.fn();
  },

  beforeEach: () => {
    setupHelpers.resetMocks();
  },
};

/**
 * Usage Pattern:
 *
 * // In test file:
 * import * as auth from "@/lib/api-helpers/auth";
 * import { createStandardMocks, createMockScenarios } from "./working-mocks";
 *
 * jest.mock("@/lib/api-helpers/auth", () => createStandardMocks.auth());
 *
 * describe("test", () => {
 *   const mockScenarios = createMockScenarios({ auth });
 *
 *   beforeEach(setupHelpers.beforeEach);
 *
 *   it("test case", () => {
 *     mockScenarios.validAdmin();
 *     // test logic
 *   });
 * });
 */
