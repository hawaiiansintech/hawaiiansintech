import { createMocks } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";
import { testInvalidMethod, testUnexpectedError } from "./api-test-utils";
import {
  createStandardMocks,
  createMockScenarios,
  setupHelpers,
} from "./test-mocks";
import {
  InvalidApiMethodError,
  MissingHeaderError,
  MissingBodyParamError,
  MissingQueryParamError,
  InvalidBodyParamTypeError,
  TokenVerificationError,
} from "@/lib/api-helpers/errors";

jest.mock("@/lib/api-helpers/auth", () => createStandardMocks.auth());
jest.mock("@/lib/firebase-helpers/emails", () => createStandardMocks.emails());
jest.mock("@/lib/firebase-helpers/initializeAdmin", () =>
  createStandardMocks.initializeAdmin(),
);
jest.mock("@/lib/api-helpers/format", () => createStandardMocks.format());
jest.mock("firebase-admin", () => createStandardMocks.firebaseAdmin());

import handler from "@/pages/api/emails";
import * as auth from "@/lib/api-helpers/auth";
import * as emailsHelper from "@/lib/firebase-helpers/emails";

describe("/api/emails", () => {
  const mockFormat = require("@/lib/api-helpers/format");
  const mockScenarios = createMockScenarios({
    auth,
    emails: emailsHelper,
    format: mockFormat,
  });

  const mockFirestore = require("firebase-admin").firestore;
  const mockInitializeAdmin =
    require("@/lib/firebase-helpers/initializeAdmin").initializeAdmin;
  const {
    checkQueryParams,
    checkBodyParams,
  } = require("@/lib/api-helpers/format");

  beforeEach(() => {
    setupHelpers.resetMocks();
    (checkQueryParams as jest.Mock).mockImplementation((req, params) => {
      if (req.query.id === undefined) {
        throw new MissingQueryParamError("id");
      }
      if (Array.isArray(req.query.id)) {
        throw new InvalidBodyParamTypeError("id", "string");
      }
    });
    (checkBodyParams as jest.Mock).mockImplementation((req, params) => {
      if (!req.body.uid) {
        throw new MissingBodyParamError("uid");
      }
      if (!req.body.email) {
        throw new MissingBodyParamError("email");
      }
      if (!req.body.currentUser) {
        throw new MissingBodyParamError("currentUser");
      }
    });
  });

  describe("GET requests", () => {
    describe("Get all emails (admin only)", () => {
      it("should return all emails for admin user", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: {},
          headers: { authorization: "Bearer admin-token" },
        });

        const mockEmails = [
          { id: "user1", email: "user1@example.com" },
          { id: "user2", email: "user2@example.com" },
        ];

        mockScenarios.validAdmin();
        (emailsHelper.getEmails as jest.Mock).mockResolvedValue(mockEmails);

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(200);
        const responseData = res._getData();
        expect(responseData).toEqual({ emails: mockEmails });
        expect(emailsHelper.getEmails).toHaveBeenCalled();
      });

      it("should handle empty emails list", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: {},
          headers: { authorization: "Bearer admin-token" },
        });

        (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("admin-token");
        (auth.verifyAdminToken as jest.Mock).mockResolvedValue(true);
        (emailsHelper.getEmails as jest.Mock).mockResolvedValue([]);

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getData()).toEqual({ emails: [] });
      });
    });

    describe("Get email by id", () => {
      it("should return email for admin user", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: { id: "user123" },
          headers: { authorization: "Bearer admin-token" },
        });

        const mockEmail = { id: "user123", email: "user123@example.com" };
        const mockEmails = [mockEmail];

        (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("admin-token");
        (auth.verifyAdminToken as jest.Mock).mockResolvedValue(true);
        (emailsHelper.getEmails as jest.Mock).mockResolvedValue(mockEmails);
        (checkQueryParams as jest.Mock).mockImplementation(() => {});

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getData()).toEqual({ email: mockEmail });
      });

      it("should return email for matching user email", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: { id: "user123" },
          headers: { authorization: "Bearer user-token" },
        });

        const mockEmail = { id: "user123", email: "user123@example.com" };
        const mockEmails = [mockEmail];

        (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("user-token");
        (auth.verifyAdminToken as jest.Mock).mockResolvedValue(false);
        (auth.verifyEmailAuthToken as jest.Mock).mockResolvedValue(
          "user123@example.com",
        );
        (emailsHelper.getEmails as jest.Mock).mockResolvedValue(mockEmails);
        (checkQueryParams as jest.Mock).mockImplementation(() => {});

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getData()).toEqual({ email: mockEmail });
      });

      it("should handle case-insensitive email matching", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: { id: "user123" },
          headers: { authorization: "Bearer user-token" },
        });

        const mockEmail = { id: "user123", email: "user123@example.com" };
        const mockEmails = [mockEmail];

        (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("user-token");
        (auth.verifyAdminToken as jest.Mock).mockResolvedValue(false);
        (auth.verifyEmailAuthToken as jest.Mock).mockResolvedValue(
          "USER123@EXAMPLE.COM",
        );
        (emailsHelper.getEmails as jest.Mock).mockResolvedValue(mockEmails);
        (checkQueryParams as jest.Mock).mockImplementation(() => {});

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getData()).toEqual({ email: mockEmail });
      });

      it("should handle missing email in results", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: { id: "nonexistent" },
          headers: { authorization: "Bearer admin-token" },
        });

        (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("admin-token");
        (auth.verifyAdminToken as jest.Mock).mockResolvedValue(true);
        (emailsHelper.getEmails as jest.Mock).mockResolvedValue([]);
        (checkQueryParams as jest.Mock).mockImplementation(() => {});

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getData()).toEqual({ email: undefined });
      });

      it("should reject unauthorized access to specific email", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: { id: "user123" },
          headers: { authorization: "Bearer user-token" },
        });

        const mockEmail = { id: "user123", email: "user123@example.com" };
        const mockEmails = [mockEmail];

        (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("user-token");
        (auth.verifyAdminToken as jest.Mock).mockResolvedValue(false);
        (auth.verifyEmailAuthToken as jest.Mock).mockResolvedValue(
          "different@example.com",
        );
        (emailsHelper.getEmails as jest.Mock).mockResolvedValue(mockEmails);
        (checkQueryParams as jest.Mock).mockImplementation(() => {});

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(401);
        expect(JSON.parse(res._getData())).toEqual({
          message: "Not authorized to access this account",
        });
      });

      it("should handle array id query parameter", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: { id: ["user1", "user2"] },
          headers: { authorization: "Bearer admin-token" },
        });

        (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("admin-token");

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(500);
        expect(JSON.parse(res._getData())).toEqual({
          message: "Invalid type for query parameter id. Expected string.",
        });
      });
    });
  });

  describe("PATCH requests", () => {
    it("should handle non-existent member during update", async () => {
      const { req, res } = createMocks({
        method: "PATCH",
        body: {
          uid: "nonexistent",
          email: "newemail@example.com",
          currentUser: "admin",
        },
      });

      (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("admin-token");
      (auth.verifyAdminToken as jest.Mock).mockResolvedValue(true);
      (checkBodyParams as jest.Mock).mockImplementation(() => {});

      const mockDoc = {
        exists: false,
      };
      const mockDocRef = {
        get: jest.fn().mockResolvedValue(mockDoc),
      };
      const mockCollection = {
        doc: jest.fn().mockReturnValue(mockDocRef),
      };
      mockFirestore.mockReturnValue({
        collection: jest.fn().mockReturnValue(mockCollection),
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Member with uid nonexistent does not exist",
      });
    });

    it("should handle array id in PATCH body", async () => {
      const { req, res } = createMocks({
        method: "PATCH",
        query: { id: ["user1", "user2"] },
        body: {
          uid: "user123",
          email: "newemail@example.com",
          currentUser: "admin",
        },
      });

      (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("admin-token");

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Invalid type for query parameter id. Expected string.",
      });
    });
  });

  describe("Error handling tests", () => {
    it("should handle missing authorization header", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {},
        headers: {},
      });

      (auth.verifyAuthHeader as jest.Mock).mockRejectedValue(
        new MissingHeaderError(),
      );

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Authorization header missing",
      });
    });

    it("should handle invalid admin token", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {},
        headers: { authorization: "Bearer invalid-token" },
      });

      (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("invalid-token");
      (auth.verifyAdminToken as jest.Mock).mockRejectedValue(
        new TokenVerificationError("Invalid admin token"),
      );

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(401);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Invalid admin token",
      });
    });

    it("should handle missing query parameter for GET by id", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { id: undefined },
        headers: { authorization: "Bearer admin-token" },
      });

      (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("admin-token");

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Query parameter id missing",
      });
    });

    it("should handle missing body parameters for PATCH", async () => {
      const { req, res } = createMocks({
        method: "PATCH",
        body: { uid: "user123" },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Body parameter email missing",
      });
    });
  });

  it(
    "should return 405 for POST requests",
    testInvalidMethod(handler, "POST", "Method POST not allowed"),
  );

  it(
    "should return 405 for PUT requests",
    testInvalidMethod(handler, "PUT", "Method PUT not allowed"),
  );

  it(
    "should return 405 for DELETE requests",
    testInvalidMethod(handler, "DELETE", "Method DELETE not allowed"),
  );

  it(
    "should handle unexpected errors",
    testUnexpectedError(
      handler,
      "GET",
      () => {
        (auth.verifyAuthHeader as jest.Mock).mockRejectedValue(
          new Error("Unexpected error"),
        );
      },
      { authorization: "Bearer token" },
      {},
    ),
  );
});
