import { createMocks } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";
import {
  testMissingBodyParam,
  testInvalidMethod,
  testUnexpectedError,
} from "./api-test-utils";
import { createStandardMocks, setupHelpers } from "./test-mocks";
import {
  MissingBodyParamError,
  InvalidApiMethodError,
  CloudflareVerificationError,
} from "@/lib/api-helpers/errors";

jest.mock("@/lib/api-helpers/auth", () => createStandardMocks.auth());
jest.mock("@/lib/firebase-helpers/emails", () => createStandardMocks.emails());
jest.mock("@/lib/api-helpers/format", () => ({
  checkMethods: jest.fn((method, allowedMethods) => {
    if (!allowedMethods.includes(method)) {
      throw new InvalidApiMethodError(`Method ${method} not allowed`);
    }
  }),
  checkBodyParams: jest.fn((req, params) => {
    for (const [key, type] of Object.entries(params)) {
      if (!req.body[key]) {
        throw new MissingBodyParamError(key);
      }
    }
  }),
}));

import handler from "@/pages/api/verify-email";
import * as auth from "@/lib/api-helpers/auth";
import * as emails from "@/lib/firebase-helpers/emails";

describe("/api/verify-email", () => {
  beforeEach(setupHelpers.beforeEach);

  it("should send verification email for valid member", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        turnstileToken: "valid-token",
        email: "test@example.com",
        url: "https://example.com/verify",
      },
      headers: {
        "CF-Connecting-IP": "192.168.1.1",
      },
    });

    (auth.verifyTurnstileToken as jest.Mock).mockResolvedValue(undefined);
    (emails.getEmails as jest.Mock).mockResolvedValue([
      { id: "1", email: "test@example.com" },
      { id: "2", email: "other@example.com" },
    ]);
    (emails.sendVerificationEmail as jest.Mock).mockResolvedValue(undefined);

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      message: "Successfully sent verification email to test@example.com",
    });
    expect(emails.sendVerificationEmail).toHaveBeenCalledWith(
      "test@example.com",
      "https://example.com/verify",
    );
  });

  it("should handle case-insensitive email matching", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        turnstileToken: "valid-token",
        email: "TEST@EXAMPLE.COM",
        url: "https://example.com/verify",
      },
      headers: {
        "CF-Connecting-IP": "192.168.1.1",
      },
    });

    (auth.verifyTurnstileToken as jest.Mock).mockResolvedValue(undefined);
    (emails.getEmails as jest.Mock).mockResolvedValue([
      { id: "1", email: "test@example.com" },
    ]);
    (emails.sendVerificationEmail as jest.Mock).mockResolvedValue(undefined);

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(emails.sendVerificationEmail).toHaveBeenCalledWith(
      "TEST@EXAMPLE.COM",
      "https://example.com/verify",
    );
  });

  it("should return 404 for non-existent member", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        turnstileToken: "valid-token",
        email: "notfound@example.com",
        url: "https://example.com/verify",
      },
      headers: {
        "CF-Connecting-IP": "192.168.1.1",
      },
    });

    (auth.verifyTurnstileToken as jest.Mock).mockResolvedValue(undefined);
    (emails.getEmails as jest.Mock).mockResolvedValue([
      { id: "1", email: "test@example.com" },
    ]);

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({
      message: "Member with email notfound@example.com not found",
    });
    expect(emails.sendVerificationEmail).not.toHaveBeenCalled();
  });

  it(
    "should handle missing body parameters",
    testMissingBodyParam(
      handler,
      "POST",
      { email: "test@example.com" },
      "turnstileToken",
    ),
  );

  it("should handle Turnstile verification failure", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        turnstileToken: "invalid-token",
        email: "test@example.com",
        url: "https://example.com/verify",
      },
      headers: {
        "CF-Connecting-IP": "192.168.1.1",
      },
    });

    (auth.verifyTurnstileToken as jest.Mock).mockRejectedValue(
      new CloudflareVerificationError("Turnstile verification failed"),
    );

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      message: "Turnstile verification failed",
    });
  });

  it(
    "should return 405 for non-POST requests",
    testInvalidMethod(handler, "GET", "Method GET not allowed"),
  );

  it(
    "should handle unexpected errors",
    testUnexpectedError(
      handler,
      "POST",
      () => {
        (auth.verifyTurnstileToken as jest.Mock).mockRejectedValue(
          new Error("Unexpected error"),
        );
      },
      { "CF-Connecting-IP": "192.168.1.1" },
      {
        turnstileToken: "valid-token",
        email: "test@example.com",
        url: "https://example.com/verify",
      },
    ),
  );
});
