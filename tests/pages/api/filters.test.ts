import { createMocks } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";
import { testInvalidMethod, testUnexpectedError } from "./api-test-utils";
import { createStandardMocks, setupHelpers } from "./test-mocks";
import {
  InvalidEnumValueError,
  InvalidQueryParamTypeError,
  InvalidApiMethodError,
} from "@/lib/api-helpers/errors";
import { FirebaseTablesEnum } from "@/lib/enums";

jest.mock("@/lib/firebase-helpers/filters", () =>
  createStandardMocks.filters(),
);
jest.mock("@/lib/api-helpers/format", () => createStandardMocks.format());

import handler from "@/pages/api/filters";
import * as filtersHelper from "@/lib/firebase-helpers/filters";

describe("/api/filters", () => {
  beforeEach(setupHelpers.beforeEach);

  describe("GET requests", () => {
    it("should return filters for focuses table", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { filterTable: FirebaseTablesEnum.FOCUSES },
      });

      const mockFilters = [
        { id: "1", name: "Frontend Development" },
        { id: "2", name: "Backend Development" },
      ];

      (filtersHelper.getFilters as jest.Mock).mockResolvedValue(mockFilters);

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual({
        filters: mockFilters,
      });
      expect(filtersHelper.getFilters).toHaveBeenCalledWith(
        FirebaseTablesEnum.FOCUSES,
      );
    });

    it("should return filters for industries table", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { filterTable: FirebaseTablesEnum.INDUSTRIES },
      });

      const mockFilters = [
        { id: "1", name: "Technology" },
        { id: "2", name: "Healthcare" },
      ];

      (filtersHelper.getFilters as jest.Mock).mockResolvedValue(mockFilters);

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual({
        filters: mockFilters,
      });
      expect(filtersHelper.getFilters).toHaveBeenCalledWith(
        FirebaseTablesEnum.INDUSTRIES,
      );
    });

    it("should return filters for regions table", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { filterTable: FirebaseTablesEnum.REGIONS },
      });

      const mockFilters = [
        { id: "1", name: "North America" },
        { id: "2", name: "Asia Pacific" },
      ];

      (filtersHelper.getFilters as jest.Mock).mockResolvedValue(mockFilters);

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual({
        filters: mockFilters,
      });
      expect(filtersHelper.getFilters).toHaveBeenCalledWith(
        FirebaseTablesEnum.REGIONS,
      );
    });

    it("should handle invalid filter table enum", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { filterTable: "invalid-table" },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Invalid value for enum filterTable: invalid-table",
      });
    });

    it("should handle array query parameter", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { filterTable: ["multiple", "values"] },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        message:
          "Invalid type for query parameter filterTable. Expected string.",
      });
    });

    it("should handle missing filterTable parameter", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {},
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Invalid value for enum filterTable: undefined",
      });
    });

    it("should handle empty filters result", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { filterTable: FirebaseTablesEnum.FOCUSES },
      });

      (filtersHelper.getFilters as jest.Mock).mockResolvedValue([]);

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getData()).toEqual({
        filters: [],
      });
    });

    it("should handle Firebase errors", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { filterTable: FirebaseTablesEnum.FOCUSES },
      });

      (filtersHelper.getFilters as jest.Mock).mockRejectedValue(
        new Error("Firebase connection failed"),
      );

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Firebase connection failed",
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
    "should return 405 for PATCH requests",
    testInvalidMethod(handler, "PATCH", "Method PATCH not allowed"),
  );

  it(
    "should handle unexpected errors",
    testUnexpectedError(
      handler,
      "GET",
      () => {
        const { getFilters } = require("@/lib/firebase-helpers/filters");
        getFilters.mockRejectedValue(new Error("Unexpected error"));

        const { checkQueryParams } = require("@/lib/api-helpers/format");
        checkQueryParams.mockImplementation(() => {});
      },
      {},
      { filterTable: "focuses" },
    ),
  );
});
