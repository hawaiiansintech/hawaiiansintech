import { createMocks } from "node-mocks-http";
import { testInvalidToken, testUnexpectedError } from "./api-test-utils";
import {
  createStandardMocks,
  createMockScenarios,
  setupHelpers,
} from "./test-mocks";
import {
  MissingHeaderError,
  TokenVerificationError,
  InvalidApiMethodError,
} from "@/lib/api-helpers/errors";

jest.mock("@/lib/api-helpers/auth", () => createStandardMocks.auth());
jest.mock("@/lib/api-helpers/format", () => createStandardMocks.format());

import handler from "@/pages/api/is-admin";
import * as auth from "@/lib/api-helpers/auth";

describe("/api/is-admin", () => {
  const mockScenarios = createMockScenarios({ auth });

  beforeEach(setupHelpers.beforeEach);

  it("should return isAdmin: true for valid admin token", async () => {
    const { req, res } = createMocks({
      method: "GET",
      headers: { authorization: "Bearer admin-token" },
    });

    mockScenarios.validAdmin();

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual({ isAdmin: true });
  });

  it("should return isAdmin: false for valid non-admin token", async () => {
    const { req, res } = createMocks({
      method: "GET",
      headers: { authorization: "Bearer user-token" },
    });

    mockScenarios.validUser();

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual({ isAdmin: false });
  });

  it("should handle missing authorization header", async () => {
    const { req, res } = createMocks({
      method: "GET",
      headers: {},
    });

    (auth.verifyAuthHeader as jest.Mock).mockRejectedValue(
      new MissingHeaderError(),
    );

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      message: "Authorization header missing",
    });
  });

  it(
    "should handle token verification errors",
    testInvalidToken(handler, "GET", () => {
      (auth.verifyAuthHeader as jest.Mock).mockResolvedValue("invalid-token");
      (auth.verifyAdminToken as jest.Mock).mockRejectedValue(
        new TokenVerificationError("Invalid token"),
      );
    }),
  );

  it("should return 405 for unsupported HTTP methods", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: { authorization: "Bearer token" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      message: "Method POST not allowed",
    });
  });

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
    ),
  );
});
