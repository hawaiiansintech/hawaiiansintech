import {
  createFirebaseScenarios,
  setupFirebaseHelpers,
  createMockDocRef,
  createMockDocSnapshot,
} from "./firebase-test-mocks";
import {
  FirebaseTablesEnum,
  StatusEnum,
  YearsOfExperienceEnum,
  FirebaseMemberFieldsEnum,
} from "@/lib/enums";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  serverTimestamp: jest.fn(() => "mock-timestamp"),
  arrayUnion: jest.fn((...args) => ({ _arrayUnion: args })),
  arrayRemove: jest.fn((...args) => ({ _arrayRemove: args })),
}));

jest.mock("firebase-admin", () => {
  const mockFieldValue = {
    serverTimestamp: jest.fn(() => "admin-timestamp"),
    arrayUnion: jest.fn((...args) => ({ _adminArrayUnion: args })),
    arrayRemove: jest.fn((...args) => ({ _adminArrayRemove: args })),
  };

  const mockFirestore = jest.fn(() => ({
    doc: jest.fn((path) => ({ path })),
  }));

  (mockFirestore as any).FieldValue = mockFieldValue;

  return {
    firestore: mockFirestore,
    FieldValue: mockFieldValue,
  };
});

jest.mock("@/lib/firebase", () => ({
  db: {},
}));

jest.mock("@/lib/firebase-helpers/general", () => ({
  __esModule: true,
  default: jest.fn((obj) => obj),
  getFirebaseTable: jest.fn(),
  getReferences: jest.fn(),
}));

jest.mock("@/lib/firebase-helpers/members", () => ({
  deleteReferences: jest.fn(),
  getMemberRef: jest.fn(),
}));

import * as firestore from "firebase/firestore";
import * as general from "@/lib/firebase-helpers/general";
import * as members from "@/lib/firebase-helpers/members";
import {
  fieldNameToTable,
  addNewLabel,
  updateAdminFilterReferences,
  getExperienceData,
  addMemberToReferences,
  updateFilterReferences,
  addLabelRef,
  addMemberToLabels,
  deleteMemberFromLabels,
  filterLookup,
  getFiltersBasic,
  getFilters,
} from "@/lib/firebase-helpers/filters";

describe("lib/firebase-helpers/filters", () => {
  const mockScenarios = createFirebaseScenarios({
    getDoc: firestore.getDoc,
    getDocs: firestore.getDocs,
  });

  beforeEach(setupFirebaseHelpers.beforeEach);

  describe("fieldNameToTable", () => {
    it("should map field names to correct table enums", () => {
      expect(fieldNameToTable[FirebaseMemberFieldsEnum.INDUSTRIES]).toBe(
        FirebaseTablesEnum.INDUSTRIES,
      );
      expect(fieldNameToTable[FirebaseMemberFieldsEnum.FOCUSES]).toBe(
        FirebaseTablesEnum.FOCUSES,
      );
      expect(fieldNameToTable[FirebaseMemberFieldsEnum.REGIONS]).toBe(
        FirebaseTablesEnum.REGIONS,
      );
      expect(fieldNameToTable[FirebaseMemberFieldsEnum.EXPERIENCE]).toBe(
        FirebaseTablesEnum.EXPERIENCE,
      );
    });
  });

  describe("addNewLabel", () => {
    it("should add new label and update document", async () => {
      const mockDocRef = {
        update: jest.fn().mockResolvedValue("write-result"),
      } as any;
      const newLabelRef = createMockDocRef("new-label-id", "focuses");

      (firestore.collection as jest.Mock).mockReturnValue("collection-ref");
      (firestore.query as jest.Mock).mockReturnValue("query-ref");
      (firestore.where as jest.Mock).mockReturnValue("where-clause");
      mockScenarios.emptyQuery();
      (firestore.addDoc as jest.Mock).mockResolvedValue(newLabelRef);

      await addNewLabel(
        "Frontend",
        FirebaseMemberFieldsEnum.FOCUSES,
        "user123",
        mockDocRef,
      );

      expect(firestore.addDoc).toHaveBeenCalled();
      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          [FirebaseMemberFieldsEnum.FOCUSES]: expect.any(Object),
          last_modified_by: "user123",
        }),
      );
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe("updateAdminFilterReferences", () => {
    const mockDocRef = {
      update: jest.fn().mockResolvedValue(undefined),
    } as any;
    const ref1 = createMockDocRef("ref1", "focuses");
    const ref2 = createMockDocRef("ref2", "focuses");

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should add and remove references for non-experience fields", async () => {
      await updateAdminFilterReferences(
        [ref1],
        [ref2],
        mockDocRef,
        FirebaseMemberFieldsEnum.FOCUSES,
        "user123",
      );

      expect(mockDocRef.update).toHaveBeenCalledTimes(2);
      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          last_modified_by: "user123",
        }),
      );
    });

    it("should update experience field with single reference", async () => {
      await updateAdminFilterReferences(
        [ref1],
        [],
        mockDocRef,
        FirebaseMemberFieldsEnum.EXPERIENCE,
        "user123",
      );

      expect(mockDocRef.update).toHaveBeenCalledTimes(1);
      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          [FirebaseMemberFieldsEnum.EXPERIENCE]: expect.any(Object),
          last_modified_by: "user123",
        }),
      );
    });

    it("should handle empty references to delete", async () => {
      await updateAdminFilterReferences(
        [ref1],
        [],
        mockDocRef,
        FirebaseMemberFieldsEnum.FOCUSES,
        "admin",
      );

      expect(mockDocRef.update).toHaveBeenCalledTimes(1);
    });

    it("should handle empty references to add", async () => {
      await updateAdminFilterReferences(
        [],
        [ref1],
        mockDocRef,
        FirebaseMemberFieldsEnum.FOCUSES,
        "admin",
      );

      expect(mockDocRef.update).toHaveBeenCalledTimes(1);
    });

    it("should use default currentUser when not provided", async () => {
      await updateAdminFilterReferences(
        [ref1],
        [],
        mockDocRef,
        FirebaseMemberFieldsEnum.FOCUSES,
        "",
      );

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          last_modified_by: "admin edit",
        }),
      );
    });
  });

  describe("getExperienceData", () => {
    it("should return all experience levels as FilterData", () => {
      const result = getExperienceData();

      expect(result).toHaveLength(Object.keys(YearsOfExperienceEnum).length);
      expect(result[0]).toHaveProperty("fields");
      expect(result[0]).toHaveProperty("id");
      expect((result[0] as any).fields).toHaveProperty("name");
    });

    it("should include all YearsOfExperienceEnum values", () => {
      const result = getExperienceData();
      const names = result.map((item: any) => item.fields.name);

      Object.values(YearsOfExperienceEnum).forEach((value) => {
        expect(names).toContain(value);
      });
    });
  });

  describe("addMemberToReferences", () => {
    const memberDocRef = createMockDocRef("member-123", "members");
    const filterRef1 = createMockDocRef("filter-1", "focuses");
    const filterRef2 = createMockDocRef("filter-2", "focuses");

    it("should add member to references with existing members", async () => {
      const existingMemberRef = createMockDocRef("existing-member", "members");
      mockScenarios.documentExists("filter-1", {
        members: [existingMemberRef],
      });
      (firestore.getDoc as jest.Mock).mockResolvedValue(
        createMockDocSnapshot("filter-1", { members: [existingMemberRef] }),
      );
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

      await addMemberToReferences(memberDocRef, [filterRef1], "user123");

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        filterRef1,
        expect.objectContaining({
          members: [existingMemberRef, memberDocRef],
          last_modified_by: "user123",
        }),
      );
    });

    it("should add member to references with no existing members", async () => {
      (firestore.getDoc as jest.Mock).mockResolvedValue(
        createMockDocSnapshot("filter-1", { members: null }),
      );
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

      await addMemberToReferences(memberDocRef, [filterRef1]);

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        filterRef1,
        expect.objectContaining({
          members: [memberDocRef],
          last_modified_by: "admin edit",
        }),
      );
    });

    it("should handle multiple references", async () => {
      (firestore.getDoc as jest.Mock).mockResolvedValue(
        createMockDocSnapshot("filter", { members: [] }),
      );
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

      await addMemberToReferences(
        memberDocRef,
        [filterRef1, filterRef2],
        "admin",
      );

      expect(firestore.updateDoc).toHaveBeenCalledTimes(2);
    });
  });

  describe("updateFilterReferences", () => {
    const memberId = "member-123";
    const memberRef = createMockDocRef(memberId, "members");

    beforeEach(() => {
      (general.getReferences as jest.Mock).mockResolvedValue([]);
      (members.getMemberRef as jest.Mock).mockResolvedValue(memberRef);
      (members.deleteReferences as jest.Mock).mockResolvedValue(undefined);
      (firestore.getDoc as jest.Mock).mockResolvedValue(
        createMockDocSnapshot("ref", { members: [] }),
      );
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);
    });

    it("should return empty arrays for unknown filter name", async () => {
      const [added, deleted] = await updateFilterReferences(
        memberId,
        [],
        [],
        "unknown-filter" as any,
        "user123",
        false,
      );

      expect(added).toEqual([]);
      expect(deleted).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith(
        "Unknown filter name: unknown-filter",
      );
    });

    it("should calculate references to add and delete", async () => {
      const oldRef = createMockDocRef("old-ref", "focuses");
      const newRef = createMockDocRef("new-ref", "focuses");
      const keepRef = createMockDocRef("keep-ref", "focuses");

      (general.getReferences as jest.Mock)
        .mockResolvedValueOnce([newRef, keepRef])
        .mockResolvedValueOnce([oldRef, keepRef]);

      const [added, deleted] = await updateFilterReferences(
        memberId,
        ["old-ref", "keep-ref"],
        ["new-ref", "keep-ref"],
        FirebaseMemberFieldsEnum.FOCUSES,
        "user123",
        false,
      );

      expect(added.length).toBe(1);
      expect(added[0].id).toBe("new-ref");
      expect(deleted.length).toBe(1);
      expect(deleted[0].id).toBe("old-ref");
    });

    it("should update filters when updateFilters is true", async () => {
      const newRef = createMockDocRef("new-ref", "focuses");
      const oldRef = createMockDocRef("old-ref", "focuses");

      (general.getReferences as jest.Mock)
        .mockResolvedValueOnce([newRef])
        .mockResolvedValueOnce([oldRef]);

      await updateFilterReferences(
        memberId,
        ["old-ref"],
        ["new-ref"],
        FirebaseMemberFieldsEnum.FOCUSES,
        "user123",
        true,
      );

      expect(members.deleteReferences).toHaveBeenCalled();
      const deleteCall = (members.deleteReferences as jest.Mock).mock.calls[0];
      expect(deleteCall[1][0].id).toBe("old-ref");
      expect(firestore.updateDoc).toHaveBeenCalled();
    });

    it("should not update filters when updateFilters is false", async () => {
      await updateFilterReferences(
        memberId,
        [],
        [],
        FirebaseMemberFieldsEnum.FOCUSES,
        "user123",
        false,
      );

      expect(members.deleteReferences).not.toHaveBeenCalled();
      expect(firestore.updateDoc).not.toHaveBeenCalled();
    });
  });

  describe("addLabelRef", () => {
    const collectionName = FirebaseTablesEnum.FOCUSES;

    beforeEach(() => {
      (firestore.collection as jest.Mock).mockReturnValue("collection-ref");
      (firestore.query as jest.Mock).mockReturnValue("query-ref");
      (firestore.where as jest.Mock).mockReturnValue("where-clause");
    });

    it("should return existing label if it exists", async () => {
      const existingDocRef = createMockDocRef("existing-label", collectionName);

      const querySnapshot = {
        empty: false,
        docs: [
          {
            id: "existing-label",
            data: () => ({ name: "Frontend", status: StatusEnum.PENDING }),
            ref: existingDocRef,
          },
        ],
      };

      (firestore.getDocs as jest.Mock).mockResolvedValue(querySnapshot);

      const result = await addLabelRef("Frontend", collectionName, "user123");

      expect(result).toBe(existingDocRef);
      expect(firestore.addDoc).not.toHaveBeenCalled();
    });

    it("should create new label if it does not exist", async () => {
      const newDocRef = createMockDocRef("new-label", collectionName);

      mockScenarios.emptyQuery();
      (firestore.addDoc as jest.Mock).mockResolvedValue(newDocRef);

      const result = await addLabelRef("Backend", collectionName, "user123");

      expect(result).toBe(newDocRef);
      expect(firestore.addDoc).toHaveBeenCalledWith(
        "collection-ref",
        expect.objectContaining({
          name: "Backend",
          status: StatusEnum.PENDING,
          last_modified_by: "user123",
          members: [],
        }),
      );
    });

    it("should use default currentUser when not provided", async () => {
      mockScenarios.emptyQuery();
      (firestore.addDoc as jest.Mock).mockResolvedValue(
        createMockDocRef("label", collectionName),
      );

      await addLabelRef("DevOps", collectionName);

      expect(firestore.addDoc).toHaveBeenCalledWith(
        "collection-ref",
        expect.objectContaining({
          last_modified_by: "backend default",
        }),
      );
    });
  });

  describe("addMemberToLabels and deleteMemberFromLabels", () => {
    const memberRef = createMockDocRef("member-123", "members");
    const industryRef = createMockDocRef("industry-1", "industries");
    const focusRef = createMockDocRef("focus-1", "focuses");
    const regionRef = createMockDocRef("region-1", "regions");
    const experienceRef = createMockDocRef("experience-1", "experience");

    beforeEach(() => {
      (firestore.getDoc as jest.Mock).mockResolvedValue(
        createMockDocSnapshot("member-123", {
          [FirebaseMemberFieldsEnum.INDUSTRIES]: [industryRef],
          [FirebaseMemberFieldsEnum.FOCUSES]: [focusRef],
          [FirebaseMemberFieldsEnum.REGIONS]: [regionRef],
          [FirebaseMemberFieldsEnum.EXPERIENCE]: experienceRef,
        }),
      );
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);
    });

    it("should add member to all label references", async () => {
      await addMemberToLabels(memberRef);

      expect(firestore.updateDoc).toHaveBeenCalledTimes(4);
      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          members: expect.objectContaining({ _arrayUnion: [memberRef] }),
        }),
      );
    });

    it("should remove member from all label references", async () => {
      await deleteMemberFromLabels(memberRef);

      expect(firestore.updateDoc).toHaveBeenCalledTimes(4);
      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          members: expect.objectContaining({ _arrayRemove: [memberRef] }),
        }),
      );
    });
  });

  describe("filterLookup", () => {
    const mockItems = [
      {
        id: "focus1",
        fields: { name: "Frontend", status: StatusEnum.APPROVED },
      },
      {
        id: "focus2",
        fields: { name: "Backend", status: StatusEnum.APPROVED },
      },
    ];

    const ref1 = createMockDocRef("focus1", "focuses");
    const ref2 = createMockDocRef("focus2", "focuses");

    it("should return matching filters for valid memberData", () => {
      const result = filterLookup(mockItems, [ref1, ref2]);

      expect(result).toEqual([
        { id: "focus1", name: "Frontend", status: StatusEnum.APPROVED },
        { id: "focus2", name: "Backend", status: StatusEnum.APPROVED },
      ]);
    });

    it("should return first name when returnFirstName is true", () => {
      const result = filterLookup(mockItems, [ref1], true);

      expect(result).toBe("Frontend");
    });

    it("should return null for non-matching references", () => {
      const nonExistentRef = createMockDocRef("non-existent", "focuses");
      const result = filterLookup(mockItems, [nonExistentRef]);

      expect(result).toEqual([null]);
    });

    it("should return null when memberData is undefined", () => {
      const result = filterLookup(mockItems, undefined);

      expect(result).toBeNull();
    });

    it("should return null when memberData is null", () => {
      const result = filterLookup(mockItems, null as any);

      expect(result).toBeNull();
    });

    it("should return null when memberData is empty array", () => {
      const result = filterLookup(mockItems, []);

      expect(result).toBeNull();
    });

    it("should return null when items is empty array", () => {
      const result = filterLookup([], [ref1]);

      expect(result).toBeNull();
    });

    it("should handle items with non-string name", () => {
      const itemsWithNonStringName = [
        {
          id: "focus1",
          fields: { name: 123 as any, status: StatusEnum.APPROVED },
        },
      ];

      const result = filterLookup(itemsWithNonStringName, [ref1]);

      expect(result).toEqual([
        { id: "focus1", name: null, status: StatusEnum.APPROVED },
      ]);
    });

    it("should handle items with invalid status", () => {
      const itemsWithInvalidStatus = [
        {
          id: "focus1",
          fields: { name: "Frontend", status: "invalid" as any },
        },
      ];

      const result = filterLookup(itemsWithInvalidStatus, [ref1]);

      expect(result).toEqual([
        { id: "focus1", name: "Frontend", status: null },
      ]);
    });
  });

  describe("getFiltersBasic", () => {
    const mockMembers = [
      {
        id: "member1",
        yearsExperience: YearsOfExperienceEnum.ONE_TO_TWO,
        region: "Hawaii",
      } as any,
      {
        id: "member2",
        yearsExperience: YearsOfExperienceEnum.THREE_TO_FOUR,
        region: "Hawaii",
      } as any,
      {
        id: "member3",
        yearsExperience: YearsOfExperienceEnum.ONE_TO_TWO,
        region: "California",
      } as any,
    ];

    beforeEach(() => {
      (general.getFirebaseTable as jest.Mock).mockResolvedValue([
        { id: "region1", fields: { name: "Hawaii" } },
        { id: "region2", fields: { name: "California" } },
      ]);
    });

    it("should return basic filters with counts for regions", async () => {
      const result = await getFiltersBasic(
        mockMembers,
        FirebaseTablesEnum.REGIONS,
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        name: "Hawaii",
        id: "region1",
        filterType: FirebaseTablesEnum.REGIONS,
        count: 2,
        hasApprovedMembers: true,
      });
      expect(result[0].members).toEqual(["member1", "member2"]);
    });

    it("should handle experience filter type", async () => {
      const result = await getFiltersBasic(mockMembers, "experience");

      expect(result.length).toBeGreaterThan(0);
      const oneToTwoYearFilter = result.find(
        (f) => f.name === YearsOfExperienceEnum.ONE_TO_TWO,
      );
      expect(oneToTwoYearFilter).toBeDefined();
      expect(oneToTwoYearFilter?.count).toBe(2);
    });

    it("should use provided filterData instead of querying", async () => {
      const mockFilterData = [{ id: "hawaii", fields: { name: "Hawaii" } }];
      const testMembers = [{ id: "m1", region: "Hawaii" } as any];

      const result = await getFiltersBasic(
        testMembers,
        FirebaseTablesEnum.REGIONS,
        mockFilterData,
      );

      expect(general.getFirebaseTable).not.toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Hawaii");
      expect(result[0].count).toBe(1);
    });

    it("should set hasApprovedMembers to false for filters with no members", async () => {
      const result = await getFiltersBasic([], FirebaseTablesEnum.REGIONS);

      expect(result.every((f) => f.hasApprovedMembers === false)).toBe(true);
      expect(result.every((f) => f.count === 0)).toBe(true);
    });
  });

  describe("getFilters", () => {
    const mockFilterData = [
      {
        id: "filter1",
        fields: {
          name: "Frontend",
          status: StatusEnum.APPROVED,
          members: [{ id: "member1" }, { id: "member2" }],
        },
      },
      {
        id: "filter2",
        fields: {
          name: "Backend",
          status: StatusEnum.APPROVED,
          members: [{ id: "member3" }],
        },
      },
      {
        id: "filter3",
        fields: {
          name: "Pending Filter",
          status: StatusEnum.PENDING,
          members: [{ id: "member4" }],
        },
      },
      {
        id: "filter4",
        fields: {
          status: StatusEnum.APPROVED,
          members: [],
        },
      },
    ];

    beforeEach(() => {
      (general.getFirebaseTable as jest.Mock).mockResolvedValue(mockFilterData);
    });

    it("should return only approved filters", async () => {
      const result = await getFilters(FirebaseTablesEnum.FOCUSES);

      expect(result).toHaveLength(2);
      expect(result.every((f) => f.name !== "Pending Filter")).toBe(true);
    });

    it("should exclude filters without names", async () => {
      const result = await getFilters(FirebaseTablesEnum.FOCUSES);

      expect(result.every((f) => f.name !== null)).toBe(true);
    });

    it("should sort filters by count in descending order", async () => {
      const result = await getFilters(FirebaseTablesEnum.FOCUSES);

      expect(result[0].count).toBeGreaterThanOrEqual(result[1].count);
      expect(result[0].name).toBe("Frontend");
    });

    it("should limit by approved members when specified", async () => {
      const approvedMemberIds = ["member1", "member3"];

      const result = await getFilters(
        FirebaseTablesEnum.FOCUSES,
        true,
        approvedMemberIds,
      );

      expect(result).toHaveLength(2);
      expect(result.every((f) => f.hasApprovedMembers === true)).toBe(true);
    });

    it("should exclude filters with no approved members when limiting", async () => {
      const approvedMemberIds = ["member1"];

      const result = await getFilters(
        FirebaseTablesEnum.FOCUSES,
        true,
        approvedMemberIds,
      );

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Frontend");
    });

    it("should use provided filterData instead of querying", async () => {
      const customFilterData = [
        {
          id: "custom1",
          fields: {
            name: "Custom",
            status: StatusEnum.APPROVED,
            members: [{ id: "m1" }],
          },
        },
      ] as any;

      const result = await getFilters(
        FirebaseTablesEnum.FOCUSES,
        false,
        undefined,
        customFilterData,
      );

      expect(general.getFirebaseTable).not.toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Custom");
    });

    it("should include all filters when not limiting by members", async () => {
      const result = await getFilters(FirebaseTablesEnum.FOCUSES, false);

      expect(result.every((f) => f.hasApprovedMembers === true)).toBe(true);
    });

    it("should map member IDs correctly", async () => {
      const result = await getFilters(FirebaseTablesEnum.FOCUSES);

      expect(result[0].members).toEqual(["member1", "member2"]);
      expect(result[1].members).toEqual(["member3"]);
    });
  });
});
