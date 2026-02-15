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
  CloudflareVerificationError,
  TokenVerificationError,
} from "@/lib/api-helpers/errors";
import { StatusEnum } from "@/lib/enums";

jest.mock("@/lib/api-helpers/auth", () => createStandardMocks.auth());
jest.mock("@/lib/firebase-helpers/members", () =>
  createStandardMocks.members(),
);
jest.mock("@/lib/firebase-helpers/emails", () => createStandardMocks.emails());
jest.mock("@/lib/firebase-helpers/filters", () =>
  createStandardMocks.filters(),
);
jest.mock("@/lib/email", () => createStandardMocks.emailService());
jest.mock("@/lib/email/send-sensitive-change-email", () =>
  createStandardMocks.sensitiveChangeEmail(),
);
jest.mock("@/lib/validators/memberPublicValidator", () =>
  createStandardMocks.memberValidator(),
);
jest.mock("@/lib/api-helpers/format", () => createStandardMocks.format());

import handler from "@/pages/api/members";
import * as auth from "@/lib/api-helpers/auth";
import * as membersHelper from "@/lib/firebase-helpers/members";
import * as emailsHelper from "@/lib/firebase-helpers/emails";
import * as filtersHelper from "@/lib/firebase-helpers/filters";
import * as emailService from "@/lib/email";
import * as sensitiveChangeEmail from "@/lib/email/send-sensitive-change-email";

describe("/api/members", () => {
  const mockFormat = require("@/lib/api-helpers/format");
  const mockScenarios = createMockScenarios({
    auth,
    members: membersHelper,
    emails: emailsHelper,
    filters: filtersHelper,
    emailService,
    sensitiveChangeEmail,
    format: mockFormat,
  });

  const mockMemberPublicValidator =
    require("@/lib/validators/memberPublicValidator").memberPublicValidator;
  const { checkBodyParams } = require("@/lib/api-helpers/format");

  beforeEach(setupHelpers.beforeEach);

  describe("GET requests", () => {
    describe("With authorization header", () => {
      it("should return members data for authenticated user", async () => {
        const { req, res } = createMocks({
          method: "GET",
          headers: { authorization: "Bearer valid-token" },
        });

        const mockData = {
          members: [{ id: "1", name: "Test User" }],
          focuses: ["Frontend"],
          industries: ["Tech"],
          regions: ["US"],
          experience: ["Senior"],
          cursor: null,
          hasMore: false,
        };

        (membersHelper.getMembers as jest.Mock).mockResolvedValue(mockData);

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual({
          message: "Successfully fetched members and supporting data.",
          ...mockData,
        });
        expect(membersHelper.getMembers).toHaveBeenCalledWith({
          token: "valid-token",
        });
      });
    });

    describe("Without authorization header", () => {
      it("should return public members data without auth", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: {},
        });

        const mockData = {
          members: [{ id: "1", name: "Public User" }],
          focuses: ["Frontend"],
          industries: ["Tech"],
          regions: ["US"],
          experience: ["Senior"],
          cursor: null,
          hasMore: false,
        };

        (membersHelper.getMembers as jest.Mock).mockResolvedValue(mockData);

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual({
          message: "Successfully fetched members and supporting data.",
          ...mockData,
        });
        expect(membersHelper.getMembers).toHaveBeenCalledWith({});
      });

      it("should handle cursor pagination", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: { cursor: "abc123" },
        });

        const mockData = {
          members: [{ id: "2", name: "Next Page User" }],
          focuses: ["Backend"],
          industries: ["Tech"],
          regions: ["EU"],
          experience: ["Mid"],
          cursor: "def456",
          hasMore: true,
        };

        (membersHelper.getMembers as jest.Mock).mockResolvedValue(mockData);

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(200);
        expect(membersHelper.getMembers).toHaveBeenCalledWith({
          cursor: "abc123",
          paginated: true,
        });
      });

      it("should handle memberIds filtering", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: { memberIds: "user1,user2,user3" },
        });

        const mockData = {
          members: [
            { id: "user1", name: "User 1" },
            { id: "user2", name: "User 2" },
          ],
          focuses: [],
          industries: [],
          regions: [],
          experience: [],
          cursor: null,
          hasMore: false,
        };

        (membersHelper.getMembers as jest.Mock).mockResolvedValue(mockData);

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(200);
        expect(membersHelper.getMembers).toHaveBeenCalledWith({
          memberIds: ["user1", "user2", "user3"],
        });
      });

      it("should handle withoutFilters option", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: { withoutFilters: "true" },
        });

        const mockData = {
          members: [{ id: "1", name: "User" }],
          focuses: [],
          industries: [],
          regions: [],
          experience: [],
          cursor: null,
          hasMore: false,
        };

        (membersHelper.getMembers as jest.Mock).mockResolvedValue(mockData);

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(200);
        expect(membersHelper.getMembers).toHaveBeenCalledWith({
          includeFilters: false,
        });
      });

      it("should handle combined query parameters", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: {
            cursor: "abc123",
            memberIds: "user1,user2",
            withoutFilters: "true",
          },
        });

        const mockData = {
          members: [],
          focuses: [],
          industries: [],
          regions: [],
          experience: [],
          cursor: null,
          hasMore: false,
        };

        (membersHelper.getMembers as jest.Mock).mockResolvedValue(mockData);

        await handler(req as any, res as any);

        expect(res._getStatusCode()).toBe(200);
        expect(membersHelper.getMembers).toHaveBeenCalledWith({
          cursor: "abc123",
          paginated: true,
          memberIds: ["user1", "user2"],
          includeFilters: false,
        });
      });
    });
  });

  describe("PUT requests", () => {
    const mockMemberOld = {
      id: "user123",
      name: "Old Name",
      title: "Old Title",
      status: StatusEnum.PENDING,
    };

    const mockMemberNew = {
      id: "user123",
      name: "New Name",
      title: "New Title",
      status: StatusEnum.APPROVED,
    };

    it("should successfully update member for admin", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        body: {
          memberOld: mockMemberOld,
          memberNew: mockMemberNew,
          currentUser: "admin@example.com",
        },
        headers: { authorization: "Bearer admin-token" },
      });

      mockScenarios.validAdmin();
      (auth.verifyAdminOrEmailAuthToken as jest.Mock).mockResolvedValue(
        undefined,
      );
      (checkBodyParams as jest.Mock).mockImplementation(() => {});
      (mockMemberPublicValidator.validate as jest.Mock).mockResolvedValue(
        undefined,
      );
      (membersHelper.updateMember as jest.Mock).mockResolvedValue({
        writeTime: "2023-01-01",
      });
      (membersHelper.getMemberRef as jest.Mock).mockResolvedValue("mock-ref");
      (
        sensitiveChangeEmail.sendSensitiveChangesEmail as jest.Mock
      ).mockResolvedValue(undefined);
      (filtersHelper.addMemberToLabels as jest.Mock).mockResolvedValue(
        undefined,
      );

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Successfully updated user123",
      });

      expect(membersHelper.updateMember).toHaveBeenCalledWith(
        mockMemberNew,
        "admin@example.com",
        true,
      );
      expect(sensitiveChangeEmail.sendSensitiveChangesEmail).toHaveBeenCalled();
      expect(filtersHelper.addMemberToLabels).toHaveBeenCalledWith("mock-ref");
    });

    it("should handle member unapproval by admin", async () => {
      const mockMemberNewUnapproved = {
        ...mockMemberNew,
        status: StatusEnum.PENDING,
      };
      const mockMemberOldApproved = {
        ...mockMemberOld,
        status: StatusEnum.APPROVED,
      };

      const { req, res } = createMocks({
        method: "PUT",
        body: {
          memberOld: mockMemberOldApproved,
          memberNew: mockMemberNewUnapproved,
          currentUser: "admin@example.com",
        },
        headers: { authorization: "Bearer admin-token" },
      });

      (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("admin-token");
      (auth.verifyAdminToken as jest.Mock).mockResolvedValue(true);
      (auth.verifyAdminOrEmailAuthToken as jest.Mock).mockResolvedValue(
        undefined,
      );
      (checkBodyParams as jest.Mock).mockImplementation(() => {});
      (mockMemberPublicValidator.validate as jest.Mock).mockResolvedValue(
        undefined,
      );
      (membersHelper.updateMember as jest.Mock).mockResolvedValue({
        writeTime: "2023-01-01",
      });
      (membersHelper.getMemberRef as jest.Mock).mockResolvedValue("mock-ref");
      (filtersHelper.deleteMemberFromLabels as jest.Mock).mockResolvedValue(
        undefined,
      );

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      expect(filtersHelper.deleteMemberFromLabels).toHaveBeenCalledWith(
        "mock-ref",
      );
    });

    it("should update member without label changes for non-admin", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        body: {
          memberOld: mockMemberOld,
          memberNew: { ...mockMemberNew, status: StatusEnum.PENDING },
          currentUser: "user@example.com",
        },
        headers: { authorization: "Bearer user-token" },
      });

      (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("user-token");
      (auth.verifyAdminToken as jest.Mock).mockResolvedValue(false);
      (auth.verifyAdminOrEmailAuthToken as jest.Mock).mockResolvedValue(
        undefined,
      );
      (checkBodyParams as jest.Mock).mockImplementation(() => {});
      (mockMemberPublicValidator.validate as jest.Mock).mockResolvedValue(
        undefined,
      );
      (membersHelper.updateMember as jest.Mock).mockResolvedValue({
        writeTime: "2023-01-01",
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      expect(filtersHelper.addMemberToLabels).not.toHaveBeenCalled();
      expect(filtersHelper.deleteMemberFromLabels).not.toHaveBeenCalled();
    });

    it("should handle validation errors", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        body: {
          memberOld: mockMemberOld,
          memberNew: { ...mockMemberNew, name: "" },
          currentUser: "user@example.com",
        },
        headers: { authorization: "Bearer user-token" },
      });

      (checkBodyParams as jest.Mock).mockImplementation(() => {});
      (mockMemberPublicValidator.validate as jest.Mock).mockRejectedValue(
        new Error("Name is required"),
      );

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(422);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Name is required",
      });
    });

    it("should handle unauthorized access", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        body: {
          memberOld: mockMemberOld,
          memberNew: mockMemberNew,
          currentUser: "user@example.com",
        },
        headers: { authorization: "Bearer user-token" },
      });

      (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("user-token");
      (auth.verifyAdminToken as jest.Mock).mockResolvedValue(false);
      (auth.verifyAdminOrEmailAuthToken as jest.Mock).mockRejectedValue(
        new TokenVerificationError("Not authorized to access this account"),
      );
      (checkBodyParams as jest.Mock).mockImplementation(() => {});
      (mockMemberPublicValidator.validate as jest.Mock).mockResolvedValue(
        undefined,
      );

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(401);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Not authorized to access this account",
      });
    });
  });

  describe("POST requests", () => {
    const mockPostBody = {
      turnstileToken: "valid-turnstile-token",
      email: "newuser@example.com",
      name: "New User",
      location: "Hawaii",
      title: "Developer",
      website: "https://example.com",
    };

    it("should successfully create new member", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: mockPostBody,
        headers: { "CF-Connecting-IP": "192.168.1.1" },
      });

      (auth.verifyTurnstileToken as jest.Mock).mockResolvedValue(undefined);
      (emailsHelper.emailExists as jest.Mock).mockResolvedValue(false);
      (membersHelper.addMemberToFirebase as jest.Mock).mockResolvedValue({
        id: "new-user-id",
      });
      (emailService.sendConfirmationEmails as jest.Mock).mockResolvedValue(
        undefined,
      );
      (checkBodyParams as jest.Mock).mockImplementation(() => {});

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Successfully added member.",
      });

      expect(auth.verifyTurnstileToken).toHaveBeenCalledWith(
        "valid-turnstile-token",
        "192.168.1.1",
      );
      expect(emailsHelper.emailExists).toHaveBeenCalledWith(
        "newuser@example.com",
      );
      expect(membersHelper.addMemberToFirebase).toHaveBeenCalledWith(
        mockPostBody,
      );
      expect(emailService.sendConfirmationEmails).toHaveBeenCalledWith({
        email: "newuser@example.com",
        recordID: "new-user-id",
        name: "New User",
        location: "Hawaii",
        title: "Developer",
        link: "https://example.com",
      });
    });

    it("should handle existing email error", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: mockPostBody,
        headers: { "CF-Connecting-IP": "192.168.1.1" },
      });

      (auth.verifyTurnstileToken as jest.Mock).mockResolvedValue(undefined);
      (emailsHelper.emailExists as jest.Mock).mockResolvedValue(true);
      (checkBodyParams as jest.Mock).mockImplementation(() => {});

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual({
        error: "409",
        body: "Sorry, please use a different email.",
      });
      expect(membersHelper.addMemberToFirebase).not.toHaveBeenCalled();
    });

    it("should handle Turnstile verification failure", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: mockPostBody,
        headers: { "CF-Connecting-IP": "192.168.1.1" },
      });

      (checkBodyParams as jest.Mock).mockImplementation(() => {});
      (auth.verifyTurnstileToken as jest.Mock).mockRejectedValue(
        new CloudflareVerificationError("Turnstile verification failed"),
      );

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(401);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Turnstile verification failed",
      });
    });

    it("should handle array CF-Connecting-IP header", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: mockPostBody,
        headers: { "CF-Connecting-IP": ["192.168.1.1", "10.0.0.1"] },
      });

      (auth.verifyTurnstileToken as jest.Mock).mockResolvedValue(undefined);
      (emailsHelper.emailExists as jest.Mock).mockResolvedValue(false);
      (membersHelper.addMemberToFirebase as jest.Mock).mockResolvedValue({
        id: "new-user-id",
      });
      (emailService.sendConfirmationEmails as jest.Mock).mockResolvedValue(
        undefined,
      );
      (checkBodyParams as jest.Mock).mockImplementation(() => {});

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      expect(auth.verifyTurnstileToken).toHaveBeenCalledWith(
        "valid-turnstile-token",
        "192.168.1.1",
      );
    });

    it("should handle email sending failure", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: mockPostBody,
        headers: { "CF-Connecting-IP": "192.168.1.1" },
      });

      (auth.verifyTurnstileToken as jest.Mock).mockResolvedValue(undefined);
      (emailsHelper.emailExists as jest.Mock).mockResolvedValue(false);
      (membersHelper.addMemberToFirebase as jest.Mock).mockResolvedValue({
        id: "new-user-id",
      });
      (emailService.sendConfirmationEmails as jest.Mock).mockRejectedValue(
        new Error("Email service failed"),
      );
      (checkBodyParams as jest.Mock).mockImplementation(() => {});

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Email service failed",
      });
    });
  });

  describe("Error handling tests", () => {
    it("should handle missing body parameters for PUT", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        body: { memberOld: {} },
      });

      mockScenarios.bodyParamError("memberNew");

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Body parameter memberNew missing",
      });
    });

    it("should handle missing body parameters for POST", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: { email: "test@example.com" },
      });

      mockScenarios.bodyParamError("turnstileToken");

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Body parameter turnstileToken missing",
      });
    });
  });

  it(
    "should return 405 for PATCH requests",
    testInvalidMethod(handler, "PATCH", "Method PATCH not allowed"),
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
        (membersHelper.getMembers as jest.Mock).mockRejectedValue(
          new Error("Unexpected error"),
        );
      },
      {},
      {},
    ),
  );
});
