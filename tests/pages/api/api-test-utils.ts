import { createMocks } from "node-mocks-http";

/**
 * Generic API test utilities for DRY testing
 */

export interface ApiTestConfig {
  handler: any;
  allowedMethods: string[];
  forbiddenMethods?: string[];
  requiresAuth?: boolean;
  requiresBody?: boolean;
}

/**
 * Test helper for HTTP method validation
 */
export function testInvalidMethod(
  handler: any,
  method: string,
  expectedMessage?: string,
) {
  return async () => {
    const { req, res } = createMocks({ method: method as any });
    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(405);
    const response = JSON.parse(res._getData());
    if (expectedMessage) {
      expect(response.message).toBe(expectedMessage);
    } else {
      expect(response.message).toContain(`Method ${method} not allowed`);
    }
  };
}

/**
 * Test helper for missing authorization header
 */
export function testMissingAuthHeader(handler: any, method: string = "GET") {
  return async () => {
    const { req, res } = createMocks({
      method: method as any,
      headers: {},
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(400);
    const response = JSON.parse(res._getData());
    expect(response.message).toBe("Authorization header missing");
  };
}

/**
 * Test helper for invalid token scenarios
 */
export function testInvalidToken(
  handler: any,
  method: string = "GET",
  mockSetup?: () => void,
) {
  return async () => {
    const { req, res } = createMocks({
      method: method as any,
      headers: { authorization: "Bearer invalid-token" },
    });

    if (mockSetup) {
      mockSetup();
    }

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(401);
    const response = JSON.parse(res._getData());
    expect(response.message).toMatch(/token|Invalid/i);
  };
}

/**
 * Test helper for missing body parameters
 */
export function testMissingBodyParam(
  handler: any,
  method: string = "POST",
  body: any = {},
  expectedParam?: string,
) {
  return async () => {
    const { req, res } = createMocks({
      method: method as any,
      body,
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(400);
    const response = JSON.parse(res._getData());
    if (expectedParam) {
      expect(response.message).toContain(expectedParam);
    } else {
      expect(response.message).toContain("missing");
    }
  };
}

/**
 * Test helper for unexpected errors
 */
export function testUnexpectedError(
  handler: any,
  method: string,
  mockSetup: () => void,
  headers?: any,
  queryOrBody?: any,
) {
  return async () => {
    const mockData: any = {
      method: method as any,
      headers: headers || { authorization: "Bearer token" },
    };

    // For GET requests, use query parameters; for others, use body
    if (method === "GET") {
      mockData.query = queryOrBody || {};
    } else {
      mockData.body = queryOrBody || {};
    }

    const { req, res } = createMocks(mockData);

    mockSetup();
    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
    const response = JSON.parse(res._getData());
    expect(response.message).toBe("Unexpected error");
  };
}

/**
 * Enhanced test generators for common patterns
 */

/**
 * Generate authentication tests for an endpoint
 */
export function generateAuthTests(handler: any, method: string = "GET") {
  return {
    missingHeader: testMissingAuthHeader(handler, method),
    invalidToken: testInvalidToken(handler, method),
  };
}

/**
 * Generate validation tests for body parameters
 */
export function generateBodyValidationTests(
  handler: any,
  requiredParams: string[],
  method: string = "POST",
) {
  return requiredParams.reduce(
    (tests, param) => {
      tests[`missing_${param}`] = testMissingBodyParam(
        handler,
        method,
        {},
        param,
      );
      return tests;
    },
    {} as Record<string, () => Promise<void>>,
  );
}

/**
 * Test suite generator for complete endpoint coverage
 */
export function generateEndpointTests(
  handler: any,
  config: {
    allowedMethods: string[];
    requiresAuth?: boolean;
    bodyParams?: string[];
    queryParams?: string[];
    customTests?: Record<string, () => Promise<void>>;
  },
) {
  describe("Common endpoint tests", () => {
    // Method validation
    const forbiddenMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"].filter(
      (method) => !config.allowedMethods.includes(method),
    );

    forbiddenMethods.forEach((method) => {
      it(
        `should reject ${method} requests`,
        testInvalidMethod(handler, method),
      );
    });

    // Authentication tests
    if (config.requiresAuth) {
      describe("Authentication", () => {
        const authTests = generateAuthTests(handler, config.allowedMethods[0]);

        it("should reject missing auth header", authTests.missingHeader);
        it("should reject invalid token", authTests.invalidToken);
      });
    }

    // Body validation tests
    if (config.bodyParams?.length) {
      describe("Body validation", () => {
        const validationTests = generateBodyValidationTests(
          handler,
          config.bodyParams,
          config.allowedMethods.find((m) => m !== "GET") || "POST",
        );

        Object.entries(validationTests).forEach(([name, test]) => {
          it(`should reject ${name.replace("_", " ")}`, test);
        });
      });
    }

    // Custom tests
    if (config.customTests) {
      describe("Custom scenarios", () => {
        Object.entries(config.customTests).forEach(([name, test]) => {
          it(name, test);
        });
      });
    }
  });
}

/**
 * Response assertion helpers
 */
export const expectApiResponse = {
  success: (res: any, expectedData?: any) => {
    expect(res._getStatusCode()).toBe(200);
    if (expectedData) {
      const data = JSON.parse(res._getData());
      expect(data).toEqual(expect.objectContaining(expectedData));
    }
  },

  error: (
    res: any,
    expectedStatus: number,
    expectedMessage?: string | RegExp,
  ) => {
    expect(res._getStatusCode()).toBe(expectedStatus);
    const data = JSON.parse(res._getData());

    if (typeof expectedMessage === "string") {
      expect(data.message).toBe(expectedMessage);
    } else if (expectedMessage instanceof RegExp) {
      expect(data.message).toMatch(expectedMessage);
    }
  },

  hasFields: (res: any, fields: string[]) => {
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    fields.forEach((field) => {
      expect(data).toHaveProperty(field);
    });
  },
};

/**
 * Mock assertion helpers
 */
export const expectMockCalls = {
  toHaveBeenCalledOnce: (mockFn: jest.Mock) => {
    expect(mockFn).toHaveBeenCalledTimes(1);
  },

  toHaveBeenCalledWith: (mockFn: jest.Mock, expectedArgs: any[]) => {
    expect(mockFn).toHaveBeenCalledWith(...expectedArgs);
  },

  notToHaveBeenCalled: (mockFn: jest.Mock) => {
    expect(mockFn).not.toHaveBeenCalled();
  },
};
