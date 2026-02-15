import {
  createFirebaseScenarios,
  setupFirebaseHelpers,
  createMockDocRef,
} from "./firebase-test-mocks";
import { FirebaseTablesEnum, StatusEnum } from "@/lib/enums";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

jest.mock("@/lib/firebase", () => ({
  db: {},
}));

import * as firestore from "firebase/firestore";
import serverSideOnly, {
  getReferences,
  deleteDocument,
  getFirebaseTable,
  filterLookup,
} from "@/lib/firebase-helpers/general";

describe("lib/firebase-helpers/general", () => {
  const mockScenarios = createFirebaseScenarios({
    getDoc: firestore.getDoc,
    getDocs: firestore.getDocs,
    deleteDoc: firestore.deleteDoc,
  });

  beforeEach(setupFirebaseHelpers.beforeEach);

  describe("serverSideOnly", () => {
    it("should return the module object on server-side", () => {
      const testModule = { test: "value" };
      const result = serverSideOnly(testModule);
      expect(result).toBe(testModule);
    });

    it("should throw error when called on client-side", () => {
      const originalWindow = global.window;
      (global as any).window = {};

      const testModule = { test: "value" };
      expect(() => serverSideOnly(testModule)).toThrow(
        "This module can only be used on the server-side.",
      );

      global.window = originalWindow;
    });
  });

  describe("getReferences", () => {
    beforeEach(() => {
      (firestore.doc as jest.Mock).mockImplementation((db, table, id) =>
        createMockDocRef(id, table),
      );
    });

    it("should return array of document references for valid IDs", async () => {
      const referenceIds = ["id1", "id2", "id3"];
      const table = FirebaseTablesEnum.MEMBERS;

      const result = await getReferences(referenceIds, table);

      expect(result).toHaveLength(3);
      expect(firestore.doc).toHaveBeenCalledTimes(3);
      expect(firestore.doc).toHaveBeenCalledWith({}, table, "id1");
      expect(firestore.doc).toHaveBeenCalledWith({}, table, "id2");
      expect(firestore.doc).toHaveBeenCalledWith({}, table, "id3");
    });

    it("should return empty array for null referenceIds", async () => {
      const result = await getReferences(null, FirebaseTablesEnum.MEMBERS);

      expect(result).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith(
        "getReferences called with invalid referenceIds:",
        null,
      );
      expect(firestore.doc).not.toHaveBeenCalled();
    });

    it("should return empty array for undefined referenceIds", async () => {
      const result = await getReferences(undefined, FirebaseTablesEnum.MEMBERS);

      expect(result).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith(
        "getReferences called with invalid referenceIds:",
        undefined,
      );
      expect(firestore.doc).not.toHaveBeenCalled();
    });

    it("should return empty array for non-array referenceIds", async () => {
      const result = await getReferences(
        "not-an-array" as any,
        FirebaseTablesEnum.MEMBERS,
      );

      expect(result).toEqual([]);
      expect(console.warn).toHaveBeenCalled();
      expect(firestore.doc).not.toHaveBeenCalled();
    });

    it("should skip invalid reference IDs", async () => {
      const referenceIds = [
        "valid-id",
        null,
        "",
        undefined,
        "another-valid-id",
      ];
      const table = FirebaseTablesEnum.FOCUSES;

      const result = await getReferences(referenceIds as any, table);

      expect(result).toHaveLength(2);
      expect(firestore.doc).toHaveBeenCalledTimes(2);
      expect(firestore.doc).toHaveBeenCalledWith({}, table, "valid-id");
      expect(firestore.doc).toHaveBeenCalledWith({}, table, "another-valid-id");
      expect(console.warn).toHaveBeenCalledTimes(3);
    });

    it("should handle empty array", async () => {
      const result = await getReferences([], FirebaseTablesEnum.MEMBERS);

      expect(result).toEqual([]);
      expect(firestore.doc).not.toHaveBeenCalled();
    });

    it("should work with different table enums", async () => {
      const referenceIds = ["id1"];

      await getReferences(referenceIds, FirebaseTablesEnum.FOCUSES);
      expect(firestore.doc).toHaveBeenCalledWith(
        {},
        FirebaseTablesEnum.FOCUSES,
        "id1",
      );

      jest.clearAllMocks();

      await getReferences(referenceIds, FirebaseTablesEnum.INDUSTRIES);
      expect(firestore.doc).toHaveBeenCalledWith(
        {},
        FirebaseTablesEnum.INDUSTRIES,
        "id1",
      );
    });
  });

  describe("deleteDocument", () => {
    it("should successfully delete an existing document", async () => {
      const mockDocRef = createMockDocRef("test-id", "test-table");
      mockScenarios.documentExists("test-id", { field: "value" });
      mockScenarios.deleteSuccess();

      await deleteDocument(mockDocRef);

      expect(firestore.getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(firestore.deleteDoc).toHaveBeenCalledWith(mockDocRef);
      expect(console.log).toHaveBeenCalledWith(
        "Document successfully deleted:",
        "test-id",
      );
    });

    it("should not delete if document does not exist", async () => {
      const mockDocRef = createMockDocRef("non-existent", "test-table");
      mockScenarios.documentNotExists();

      await deleteDocument(mockDocRef);

      expect(firestore.getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(firestore.deleteDoc).not.toHaveBeenCalled();
    });

    it("should handle delete errors gracefully", async () => {
      const mockDocRef = createMockDocRef("test-id", "test-table");
      const deleteError = new Error("Delete failed");

      mockScenarios.documentExists("test-id", { field: "value" });
      mockScenarios.deleteError(deleteError);

      await deleteDocument(mockDocRef);

      expect(firestore.getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(firestore.deleteDoc).toHaveBeenCalledWith(mockDocRef);
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting document: ",
        deleteError,
      );
    });
  });

  describe("getFirebaseTable", () => {
    beforeEach(() => {
      (firestore.collection as jest.Mock).mockReturnValue("mock-collection");
      (firestore.query as jest.Mock).mockImplementation((...args) => ({
        _query: args,
      }));
      (firestore.where as jest.Mock).mockReturnValue("where-clause");
    });

    it("should return all documents when approved is false", async () => {
      const mockData = [
        { id: "doc1", fields: { name: "Test 1", status: StatusEnum.PENDING } },
        { id: "doc2", fields: { name: "Test 2", status: StatusEnum.APPROVED } },
      ];

      mockScenarios.successfulQuery(mockData);

      const result = await getFirebaseTable(FirebaseTablesEnum.MEMBERS, false);

      expect(firestore.collection).toHaveBeenCalledWith(
        {},
        FirebaseTablesEnum.MEMBERS,
      );
      expect(firestore.query).toHaveBeenCalledWith("mock-collection");
      expect(firestore.where).not.toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it("should filter by approved status when approved is true", async () => {
      const mockData = [
        { id: "doc1", fields: { name: "Test 1", status: StatusEnum.APPROVED } },
      ];

      mockScenarios.successfulQuery(mockData);

      const result = await getFirebaseTable(FirebaseTablesEnum.MEMBERS, true);

      expect(firestore.collection).toHaveBeenCalledWith(
        {},
        FirebaseTablesEnum.MEMBERS,
      );
      expect(firestore.where).toHaveBeenCalledWith(
        "status",
        "==",
        StatusEnum.APPROVED,
      );
      expect(result).toEqual(mockData);
    });

    it("should default to approved=false when not specified", async () => {
      mockScenarios.successfulQuery([]);

      await getFirebaseTable(FirebaseTablesEnum.FOCUSES);

      expect(firestore.where).not.toHaveBeenCalled();
    });

    it("should return empty array when no documents found", async () => {
      mockScenarios.emptyQuery();

      const result = await getFirebaseTable(FirebaseTablesEnum.INDUSTRIES);

      expect(result).toEqual([]);
    });

    it("should work with different table enums", async () => {
      mockScenarios.successfulQuery([]);

      await getFirebaseTable(FirebaseTablesEnum.FOCUSES);
      expect(firestore.collection).toHaveBeenCalledWith(
        {},
        FirebaseTablesEnum.FOCUSES,
      );

      jest.clearAllMocks();

      await getFirebaseTable(FirebaseTablesEnum.INDUSTRIES);
      expect(firestore.collection).toHaveBeenCalledWith(
        {},
        FirebaseTablesEnum.INDUSTRIES,
      );

      jest.clearAllMocks();

      await getFirebaseTable(FirebaseTablesEnum.REGIONS);
      expect(firestore.collection).toHaveBeenCalledWith(
        {},
        FirebaseTablesEnum.REGIONS,
      );
    });

    it("should handle query errors", async () => {
      const queryError = new Error("Query failed");
      mockScenarios.queryError(queryError);

      await expect(
        getFirebaseTable(FirebaseTablesEnum.MEMBERS),
      ).rejects.toThrow("Query failed");
    });
  });

  describe("filterLookup", () => {
    const mockItems = [
      {
        id: "focus1",
        name: "Frontend",
        filterType: "focuses",
        status: "approved",
      },
      {
        id: "focus2",
        name: "Backend",
        filterType: "focuses",
        status: "approved",
      },
      {
        id: "focus3",
        name: "DevOps",
        filterType: "focuses",
        status: "approved",
      },
    ];

    it("should return matching filters for valid memberData", () => {
      const memberData = ["focus1", "focus3"];

      const result = filterLookup(mockItems, memberData);

      expect(result).toEqual([
        { id: "focus1", name: "Frontend", status: "approved" },
        { id: "focus3", name: "DevOps", status: "approved" },
      ]);
    });

    it("should return first name when returnFirstName is true", () => {
      const memberData = ["focus2"];

      const result = filterLookup(mockItems, memberData, true);

      expect(result).toBe("Backend");
    });

    it("should return null for non-existent IDs", () => {
      const memberData = ["non-existent"];

      const result = filterLookup(mockItems, memberData);

      expect(result).toEqual([null]);
    });

    it("should handle mixed valid and invalid IDs", () => {
      const memberData = ["focus1", "non-existent", "focus2"];

      const result = filterLookup(mockItems, memberData);

      expect(result).toEqual([
        { id: "focus1", name: "Frontend", status: "approved" },
        null,
        { id: "focus2", name: "Backend", status: "approved" },
      ]);
    });

    it("should return null when memberData is undefined", () => {
      const result = filterLookup(mockItems, undefined);

      expect(result).toBeNull();
    });

    it("should return null when memberData is null", () => {
      const result = filterLookup(mockItems, null as any);

      expect(result).toBeNull();
    });

    it("should return null when memberData is not an array", () => {
      const result = filterLookup(mockItems, "not-an-array" as any);

      expect(result).toBeNull();
    });

    it("should return null when memberData is empty array", () => {
      const result = filterLookup(mockItems, []);

      expect(result).toBeNull();
    });

    it("should handle items without name property", () => {
      const itemsWithoutNames = [
        { id: "focus1", status: "approved" },
        { id: "focus2", name: "Backend", status: "approved" },
      ] as any;
      const memberData = ["focus1", "focus2"];

      const result = filterLookup(itemsWithoutNames, memberData);

      expect(result).toEqual([
        { id: "focus1", name: null, status: "approved" },
        { id: "focus2", name: "Backend", status: "approved" },
      ]);
    });

    it("should handle items without id property", () => {
      const itemsWithoutIds = [
        { name: "Frontend", status: "approved" },
        { id: "focus2", name: "Backend", status: "approved" },
      ] as any;
      const memberData = ["focus2"];

      const result = filterLookup(itemsWithoutIds, memberData);

      expect(result).toEqual([
        { id: "focus2", name: "Backend", status: "approved" },
      ]);
    });

    it("should preserve order of memberData", () => {
      const memberData = ["focus3", "focus1", "focus2"];

      const result = filterLookup(mockItems, memberData);

      expect(result).toEqual([
        { id: "focus3", name: "DevOps", status: "approved" },
        { id: "focus1", name: "Frontend", status: "approved" },
        { id: "focus2", name: "Backend", status: "approved" },
      ]);
    });

    it("should return first name as null when returnFirstName is true but item has no name", () => {
      const itemsWithoutNames = [{ id: "focus1", status: "approved" }] as any;
      const memberData = ["focus1"];

      const result = filterLookup(itemsWithoutNames, memberData, true);

      expect(result).toBeNull();
    });
  });
});
