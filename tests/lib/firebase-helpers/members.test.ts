import { createMockDocRef, setupFirebaseHelpers } from "./firebase-test-mocks";
import {
  FirebaseTablesEnum,
  StatusEnum,
  FirebaseMemberFieldsEnum,
} from "@/lib/enums";

jest.mock("@/lib/firebase", () => ({
  db: {},
}));

jest.mock("firebase/firestore");

jest.mock("firebase-admin", () => {
  const mockFieldValue = {
    serverTimestamp: jest.fn(() => "mock-timestamp"),
  };

  const mockFirestore = jest.fn(() => ({
    collection: jest.fn(),
    settings: jest.fn(),
  }));

  (mockFirestore as any).FieldValue = mockFieldValue;

  return {
    apps: [],
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn(() => ({ type: "service_account" })),
    },
    firestore: mockFirestore,
  };
});

jest.mock("@/lib/firebase-helpers/general", () => ({
  __esModule: true,
  default: jest.fn((obj) => obj),
  getFirebaseTable: jest.fn(),
}));

jest.mock("@/lib/firebase-helpers/initializeAdmin", () => ({
  initializeAdmin: jest.fn(),
}));

jest.mock("@/lib/firebase-helpers/filters", () => ({
  filterLookup: jest.fn(),
  updateFilterReferences: jest.fn(),
  updateAdminFilterReferences: jest.fn(),
  addNewLabel: jest.fn(),
  addLabelRef: jest.fn(),
}));

jest.mock("@/lib/firebase-helpers/emails", () => ({
  getIdByEmail: jest.fn(),
  addSecureEmail: jest.fn(),
}));

jest.mock("@/lib/api-helpers/auth", () => ({
  verifyAdminToken: jest.fn(),
  verifyEmailAuthToken: jest.fn(),
}));

jest.mock("@/helpers", () => ({
  cloakEmail: jest.fn((email) => `${email.substring(0, 1)}***`),
}));

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  limit,
  startAfter,
  getCountFromServer,
  documentId,
  serverTimestamp,
} from "firebase/firestore";
import * as admin from "firebase-admin";
import {
  getMembers,
  updateMember,
  addMemberToFirebase,
  getAllMemberReferencesToDelete,
  deleteReferences,
  getMemberRef,
  getNumberOfMembers,
  CreateMemberFields,
} from "@/lib/firebase-helpers/members";
import { getFirebaseTable } from "@/lib/firebase-helpers/general";
import { initializeAdmin } from "@/lib/firebase-helpers/initializeAdmin";
import {
  filterLookup,
  updateFilterReferences,
  updateAdminFilterReferences,
  addNewLabel,
  addLabelRef,
} from "@/lib/firebase-helpers/filters";
import { getIdByEmail, addSecureEmail } from "@/lib/firebase-helpers/emails";
import { verifyAdminToken, verifyEmailAuthToken } from "@/lib/api-helpers/auth";

const mockCollection = collection as jest.Mock;
const mockDoc = doc as jest.Mock;
const mockGetDoc = getDoc as jest.Mock;
const mockGetDocs = getDocs as jest.Mock;
const mockAddDoc = addDoc as jest.Mock;
const mockUpdateDoc = updateDoc as jest.Mock;
const mockQuery = query as jest.Mock;
const mockWhere = where as jest.Mock;
const mockLimit = limit as jest.Mock;
const mockStartAfter = startAfter as jest.Mock;
const mockGetCountFromServer = getCountFromServer as jest.Mock;
const mockDocumentId = documentId as jest.Mock;
const mockServerTimestamp = serverTimestamp as jest.Mock;
const mockGetFirebaseTable = getFirebaseTable as jest.Mock;
const mockInitializeAdmin = initializeAdmin as jest.Mock;
const mockFilterLookup = filterLookup as jest.Mock;
const mockUpdateFilterReferences = updateFilterReferences as jest.Mock;
const mockUpdateAdminFilterReferences =
  updateAdminFilterReferences as jest.Mock;
const mockAddNewLabel = addNewLabel as jest.Mock;
const mockAddLabelRef = addLabelRef as jest.Mock;
const mockGetIdByEmail = getIdByEmail as jest.Mock;
const mockAddSecureEmail = addSecureEmail as jest.Mock;
const mockVerifyAdminToken = verifyAdminToken as jest.Mock;
const mockVerifyEmailAuthToken = verifyEmailAuthToken as jest.Mock;

describe("lib/firebase-helpers/members", () => {
  beforeEach(() => {
    setupFirebaseHelpers.beforeEach();
    mockInitializeAdmin.mockResolvedValue(undefined);
    mockServerTimestamp.mockReturnValue("mock-timestamp");
  });

  describe("getMembers", () => {
    const mockMemberData = {
      id: "member1",
      name: "Test User",
      regions: [createMockDocRef("region1", FirebaseTablesEnum.REGIONS)],
      industries: [
        createMockDocRef("industry1", FirebaseTablesEnum.INDUSTRIES),
      ],
      focuses: [createMockDocRef("focus1", FirebaseTablesEnum.FOCUSES)],
      experience: createMockDocRef("exp1", FirebaseTablesEnum.EXPERIENCE),
      maskedEmail: "t***@example.com",
      lastModified: { toDate: () => new Date("2024-01-01") },
      lastModifiedBy: "admin",
      requests: "",
      unsubscribed: false,
      status: StatusEnum.APPROVED,
    };

    beforeEach(() => {
      mockCollection.mockReturnValue({
        withConverter: jest.fn().mockReturnThis(),
      });
      mockQuery.mockReturnValue({});
      mockWhere.mockReturnValue({});
      mockGetDocs.mockResolvedValue({
        docs: [
          {
            id: "member1",
            data: () => mockMemberData,
          },
        ],
      });
      mockGetFirebaseTable.mockResolvedValue([
        { id: "region1", fields: { name: "Hawaii" } },
        { id: "industry1", fields: { name: "Tech" } },
        { id: "focus1", fields: { name: "Web Dev" } },
        { id: "exp1", fields: { name: "1-2 years" } },
      ]);
      mockFilterLookup.mockImplementation((data, refs) =>
        refs.map((r) => r.id),
      );
    });

    it("should get members without token", async () => {
      const result = await getMembers();

      expect(mockGetFirebaseTable).toHaveBeenCalledWith(
        FirebaseTablesEnum.FOCUSES,
        true,
      );
      expect(mockGetFirebaseTable).toHaveBeenCalledWith(
        FirebaseTablesEnum.INDUSTRIES,
        true,
      );
      expect(result.members).toHaveLength(1);
      expect(result.members[0].name).toBe("Test User");
    });

    it("should get members with admin token", async () => {
      mockVerifyAdminToken.mockResolvedValue(true);
      mockVerifyEmailAuthToken.mockResolvedValue("admin@example.com");
      mockGetIdByEmail.mockResolvedValue("admin123");

      const result = await getMembers({ token: "admin-token" });

      expect(mockVerifyAdminToken).toHaveBeenCalledWith("admin-token", false);
      expect(mockGetFirebaseTable).toHaveBeenCalledWith(
        FirebaseTablesEnum.FOCUSES,
        false,
      );
      expect(result.members[0]).toHaveProperty("emailAbbr");
      expect(result.members[0]).toHaveProperty("requests");
    });

    it("should get members with non-admin token", async () => {
      mockVerifyAdminToken.mockResolvedValue(false);
      mockVerifyEmailAuthToken.mockResolvedValue("user@example.com");
      mockGetIdByEmail.mockResolvedValue("member1");

      const result = await getMembers({ token: "user-token" });

      expect(result.members[0]).toHaveProperty("emailAbbr");
    });

    it("should handle pagination", async () => {
      const mockCursor = "member1";
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        id: mockCursor,
      });
      mockStartAfter.mockReturnValue({});
      mockLimit.mockReturnValue({});
      mockGetDocs.mockResolvedValue({
        docs: [
          { id: "member1", data: () => mockMemberData },
          { id: "member2", data: () => ({ ...mockMemberData, id: "member2" }) },
        ],
      });

      const result = await getMembers({
        paginated: true,
        limit: 1,
        cursor: mockCursor,
      });

      expect(result).toHaveProperty("cursor");
      expect(result).toHaveProperty("hasMore");
    });

    it("should filter members without includeFilters", async () => {
      const result = await getMembers({ includeFilters: false });

      expect(result.members[0].focus).toEqual(["focus1"]);
      expect(result.members[0].industry).toEqual(["industry1"]);
    });

    it("should filter out members without names", async () => {
      mockGetDocs.mockResolvedValue({
        docs: [
          { id: "member1", data: () => ({ ...mockMemberData, name: null }) },
        ],
      });

      const result = await getMembers();

      expect(result.members).toHaveLength(0);
    });

    it("should sort members by name", async () => {
      mockGetDocs.mockResolvedValue({
        docs: [
          { id: "member1", data: () => ({ ...mockMemberData, name: "Zoe" }) },
          { id: "member2", data: () => ({ ...mockMemberData, name: "Alice" }) },
        ],
      });

      const result = await getMembers();

      expect(result.members[0].name).toBe("Alice");
      expect(result.members[1].name).toBe("Zoe");
    });

    it("should handle memberIds filter", async () => {
      const result = await getMembers({ memberIds: ["member1", "member2"] });

      expect(mockWhere).toHaveBeenCalled();
    });

    it("should handle custom filter data", async () => {
      mockGetDocs.mockResolvedValue({
        docs: [
          {
            id: "member1",
            data: () => mockMemberData,
          },
        ],
      });
      mockFilterLookup.mockReturnValue([{ name: "Hawaii", id: "region1" }]);

      const result = await getMembers();

      expect(result.members).toHaveLength(1);
    });
  });

  describe("updateMember", () => {
    const mockMemberData = {
      id: "member1",
      name: "Updated User",
      status: StatusEnum.APPROVED,
      focus: [{ id: "focus1", name: "Web Dev" }],
      industry: [{ id: "industry1", name: "Tech" }],
      region: "region1",
      yearsExperience: "1-2 years",
    };

    beforeEach(() => {
      const mockDocRef = {
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => ({
            status: StatusEnum.APPROVED,
            focuses: [createMockDocRef("focus1", FirebaseTablesEnum.FOCUSES)],
            industries: [
              createMockDocRef("industry1", FirebaseTablesEnum.INDUSTRIES),
            ],
            regions: [createMockDocRef("region1", FirebaseTablesEnum.REGIONS)],
            experience: createMockDocRef("exp1", FirebaseTablesEnum.EXPERIENCE),
          }),
        }),
        update: jest.fn().mockResolvedValue(undefined),
      };

      (admin.firestore as unknown as jest.Mock).mockReturnValue({
        collection: jest.fn().mockReturnValue({
          doc: jest.fn().mockReturnValue(mockDocRef),
        }),
      });

      mockUpdateFilterReferences.mockResolvedValue([[], []]);
      mockUpdateAdminFilterReferences.mockResolvedValue(undefined);
    });

    it("should update member successfully", async () => {
      await updateMember(mockMemberData, "admin", true);

      expect(mockInitializeAdmin).toHaveBeenCalled();
      expect(mockUpdateFilterReferences).toHaveBeenCalled();
    });

    it("should throw error if member does not exist", async () => {
      const mockDocRef = {
        get: jest.fn().mockResolvedValue({
          exists: false,
        }),
      };

      (admin.firestore as unknown as jest.Mock).mockReturnValue({
        collection: jest.fn().mockReturnValue({
          doc: jest.fn().mockReturnValue(mockDocRef),
        }),
      });

      await expect(updateMember(mockMemberData, "admin", true)).rejects.toThrow(
        "Member with uid member1 does not exist",
      );
    });

    it("should not allow non-admin to change status", async () => {
      const mockUpdate = jest.fn().mockResolvedValue(undefined);
      const mockDocRef = {
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => ({
            status: StatusEnum.PENDING,
            focuses: [],
            industries: [],
            regions: [],
            experience: createMockDocRef("exp1", FirebaseTablesEnum.EXPERIENCE),
          }),
        }),
        update: mockUpdate,
      };

      (admin.firestore as unknown as jest.Mock).mockReturnValue({
        collection: jest.fn().mockReturnValue({
          doc: jest.fn().mockReturnValue(mockDocRef),
        }),
      });

      await updateMember(mockMemberData, "user", false);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          status: StatusEnum.PENDING,
        }),
      );
    });

    it("should handle suggested focuses", async () => {
      const memberWithSuggested = {
        ...mockMemberData,
        focusSuggested: "New Focus",
      };

      await updateMember(memberWithSuggested, "admin", true);

      expect(mockAddNewLabel).toHaveBeenCalledWith(
        "New Focus",
        FirebaseMemberFieldsEnum.FOCUSES.toString(),
        "admin",
        expect.anything(),
      );
    });

    it("should handle suggested industries", async () => {
      const memberWithSuggested = {
        ...mockMemberData,
        industrySuggested: "New Industry",
      };

      await updateMember(memberWithSuggested, "admin", true);

      expect(mockAddNewLabel).toHaveBeenCalledWith(
        "New Industry",
        FirebaseMemberFieldsEnum.INDUSTRIES.toString(),
        "admin",
        expect.anything(),
      );
    });

    it("should handle regions array values", async () => {
      const memberWithArrayRegions = {
        ...mockMemberData,
        regions: [
          { id: "region1", name: "Hawaii" },
          { id: "region2", name: "Kauai" },
        ],
      };

      await updateMember(memberWithArrayRegions, "admin", true);

      expect(mockUpdateFilterReferences).toHaveBeenCalled();
    });

    it("should handle string region values", async () => {
      const memberWithStringRegion = {
        ...mockMemberData,
        region: "region1",
      };

      await updateMember(memberWithStringRegion, "admin", true);

      expect(mockUpdateFilterReferences).toHaveBeenCalled();
    });

    it("should handle object region values", async () => {
      const memberWithObjectRegion = {
        ...mockMemberData,
        region: { id: "region1", name: "Hawaii" },
      };

      await updateMember(memberWithObjectRegion as any, "admin", true);

      expect(mockUpdateFilterReferences).toHaveBeenCalled();
    });
  });

  describe("addMemberToFirebase", () => {
    const mockFields: CreateMemberFields = {
      name: "New User",
      email: "new@example.com",
      location: "Hawaii",
      website: "https://example.com",
      focusesSelected: ["focus1"],
      title: "Engineer",
      yearsExperience: "1-2 years",
      industriesSelected: ["industry1"],
      companySize: "Small",
    };

    beforeEach(() => {
      mockCollection.mockReturnValue({});
      mockDoc.mockReturnValue(
        createMockDocRef("new-member", FirebaseTablesEnum.MEMBERS),
      );
      mockGetDocs.mockResolvedValue({
        empty: false,
        docs: [
          {
            ref: createMockDocRef("exp1", FirebaseTablesEnum.EXPERIENCE),
          },
        ],
      });
      mockAddDoc.mockResolvedValue(
        createMockDocRef("new-member", FirebaseTablesEnum.MEMBERS),
      );
      mockAddLabelRef.mockResolvedValue(
        createMockDocRef("new-label", FirebaseTablesEnum.FOCUSES),
      );
      mockAddSecureEmail.mockResolvedValue(undefined);
    });

    it("should add member successfully", async () => {
      const result = await addMemberToFirebase(mockFields);

      expect(mockAddDoc).toHaveBeenCalled();
      expect(mockAddSecureEmail).toHaveBeenCalledWith(
        "new@example.com",
        expect.anything(),
      );
      expect(result.id).toBe("new-member");
    });

    it("should handle suggested focus", async () => {
      const fieldsWithSuggested = {
        ...mockFields,
        focusSuggested: "New Focus",
      };

      await addMemberToFirebase(fieldsWithSuggested);

      expect(mockAddLabelRef).toHaveBeenCalledWith("New Focus", "focuses");
    });

    it("should handle suggested industry", async () => {
      const fieldsWithSuggested = {
        ...mockFields,
        industrySuggested: "New Industry",
      };

      await addMemberToFirebase(fieldsWithSuggested);

      expect(mockAddLabelRef).toHaveBeenCalledWith(
        "New Industry",
        "industries",
      );
    });

    it("should handle string focusesSelected", async () => {
      const fieldsWithString = {
        ...mockFields,
        focusesSelected: "focus1",
      };

      await addMemberToFirebase(fieldsWithString);

      expect(mockAddDoc).toHaveBeenCalled();
    });

    it("should throw error if experience not found", async () => {
      mockGetDocs.mockResolvedValue({
        empty: true,
        docs: [],
      });

      await expect(addMemberToFirebase(mockFields)).rejects.toThrow(
        "No experience found with name 1-2 years",
      );
    });

    it("should handle member with unsubscribed flag", async () => {
      const fieldsWithUnsub = {
        ...mockFields,
        unsubscribed: true,
      };

      await addMemberToFirebase(fieldsWithUnsub);

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          unsubscribed: true,
        }),
      );
    });

    it("should handle addDoc error", async () => {
      mockAddDoc.mockRejectedValue(new Error("Firestore error"));

      await expect(addMemberToFirebase(mockFields)).rejects.toThrow(
        "Firestore error",
      );
    });
  });

  describe("getAllMemberReferencesToDelete", () => {
    it("should get all member references", async () => {
      const mockMemberData = {
        focuses: [createMockDocRef("focus1", FirebaseTablesEnum.FOCUSES)],
        industries: [
          createMockDocRef("industry1", FirebaseTablesEnum.INDUSTRIES),
        ],
        regions: [createMockDocRef("region1", FirebaseTablesEnum.REGIONS)],
        experience: createMockDocRef("exp1", FirebaseTablesEnum.EXPERIENCE),
      };

      mockDoc.mockReturnValue({
        withConverter: jest.fn().mockReturnThis(),
      });
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockMemberData,
      });

      const result = await getAllMemberReferencesToDelete("member1");

      expect(result).toHaveProperty("memberRef");
      expect(result).toHaveProperty("focuses");
      expect(result).toHaveProperty("industries");
      expect(result).toHaveProperty("regions");
      expect(result).toHaveProperty("experience");
      expect(result).toHaveProperty("secureMemberData");
    });

    it("should return null if member does not exist", async () => {
      mockDoc.mockReturnValue({
        withConverter: jest.fn().mockReturnThis(),
      });
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      const result = await getAllMemberReferencesToDelete("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("deleteReferences", () => {
    it("should delete member from reference documents", async () => {
      const memberRef = createMockDocRef("member1", FirebaseTablesEnum.MEMBERS);
      const reference1 = createMockDocRef("ref1", FirebaseTablesEnum.FOCUSES);
      const reference2 = createMockDocRef("ref2", FirebaseTablesEnum.FOCUSES);

      mockGetDoc
        .mockResolvedValueOnce({
          data: () => ({
            members: [
              createMockDocRef("member1", FirebaseTablesEnum.MEMBERS),
              createMockDocRef("member2", FirebaseTablesEnum.MEMBERS),
            ],
          }),
        })
        .mockResolvedValueOnce({
          data: () => ({
            members: [createMockDocRef("member1", FirebaseTablesEnum.MEMBERS)],
          }),
        });

      await deleteReferences(memberRef, [reference1, reference2], "admin");

      expect(mockUpdateDoc).toHaveBeenCalledTimes(2);
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        reference1,
        expect.objectContaining({
          last_modified: "mock-timestamp",
          last_modified_by: "admin",
        }),
      );
    });

    it("should use default currentUser", async () => {
      const memberRef = createMockDocRef("member1", FirebaseTablesEnum.MEMBERS);
      const reference = createMockDocRef("ref1", FirebaseTablesEnum.FOCUSES);

      mockGetDoc.mockResolvedValue({
        data: () => ({
          members: [createMockDocRef("member1", FirebaseTablesEnum.MEMBERS)],
        }),
      });

      await deleteReferences(memberRef, [reference]);

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        reference,
        expect.objectContaining({
          last_modified_by: "admin edit",
        }),
      );
    });
  });

  describe("getMemberRef", () => {
    it("should return member document reference", async () => {
      mockDoc.mockReturnValue({
        withConverter: jest.fn().mockReturnThis(),
        id: "member1",
      });

      const result = await getMemberRef("member1");

      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        FirebaseTablesEnum.MEMBERS,
        "member1",
      );
      expect(result).toHaveProperty("id", "member1");
    });
  });

  describe("getNumberOfMembers", () => {
    it("should return count of approved members", async () => {
      mockQuery.mockReturnValue({});
      mockWhere.mockReturnValue({});
      mockGetCountFromServer.mockResolvedValue({
        data: () => ({ count: 42 }),
      });

      const result = await getNumberOfMembers();

      expect(result).toBe(42);
      expect(mockWhere).toHaveBeenCalledWith(
        "status",
        "==",
        StatusEnum.APPROVED,
      );
    });
  });
});
