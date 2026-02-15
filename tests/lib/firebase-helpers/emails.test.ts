import {
  createMockDocRef,
  createMockDocSnapshot,
  setupFirebaseHelpers,
} from "./firebase-test-mocks";
import { FirebaseTablesEnum, StatusEnum } from "@/lib/enums";

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
      cert: jest.fn(),
    },
    auth: jest.fn(() => ({
      generateSignInWithEmailLink: jest.fn(),
    })),
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

jest.mock("@/lib/email", () => ({
  sendLoginPromptEmail: jest.fn(),
}));

import { doc, getDoc } from "firebase/firestore";
import * as admin from "firebase-admin";
import {
  getEmails,
  getEmailById,
  getIdByEmail,
  emailExists,
  addSecureEmail,
  sendVerificationEmail,
} from "@/lib/firebase-helpers/emails";
import { getFirebaseTable } from "@/lib/firebase-helpers/general";
import { initializeAdmin } from "@/lib/firebase-helpers/initializeAdmin";
import { sendLoginPromptEmail } from "@/lib/email";

const mockDoc = doc as jest.Mock;
const mockGetDoc = getDoc as jest.Mock;
const mockGetFirebaseTable = getFirebaseTable as jest.Mock;
const mockInitializeAdmin = initializeAdmin as jest.Mock;
const mockSendLoginPromptEmail = sendLoginPromptEmail as jest.Mock;

describe("lib/firebase-helpers/emails", () => {
  beforeEach(() => {
    setupFirebaseHelpers.beforeEach();
    mockInitializeAdmin.mockResolvedValue(undefined);
  });

  describe("getEmails", () => {
    it("should return all emails when approved=false", async () => {
      const secureMemberData = [
        { id: "member1", fields: { email: "test1@example.com" } },
        { id: "member2", fields: { email: "test2@example.com" } },
      ];

      mockGetFirebaseTable.mockResolvedValue(secureMemberData);

      const memberDoc1 = createMockDocSnapshot("member1", {
        name: "Test User 1",
        masked_email: "t***1@example.com",
        status: StatusEnum.APPROVED,
        unsubscribed: false,
      });

      const memberDoc2 = createMockDocSnapshot("member2", {
        name: "Test User 2",
        masked_email: "t***2@example.com",
        status: StatusEnum.PENDING,
        unsubscribed: false,
      });

      mockDoc.mockReturnValueOnce("docRef1").mockReturnValueOnce("docRef2");
      mockGetDoc
        .mockResolvedValueOnce(memberDoc1)
        .mockResolvedValueOnce(memberDoc2);

      const result = await getEmails(false);

      expect(mockGetFirebaseTable).toHaveBeenCalledWith(
        FirebaseTablesEnum.SECURE_MEMBER_DATA,
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: "member1",
        email: "test1@example.com",
        name: "Test User 1",
        emailAbbr: "t***1@example.com",
        status: StatusEnum.APPROVED,
      });
    });

    it("should return only approved emails when approved=true", async () => {
      const secureMemberData = [
        { id: "member1", fields: { email: "test1@example.com" } },
        { id: "member2", fields: { email: "test2@example.com" } },
      ];

      mockGetFirebaseTable.mockResolvedValue(secureMemberData);

      const memberDoc1 = createMockDocSnapshot("member1", {
        name: "Test User 1",
        status: StatusEnum.APPROVED,
      });

      const memberDoc2 = createMockDocSnapshot("member2", {
        name: "Test User 2",
        status: StatusEnum.PENDING,
      });

      mockDoc.mockReturnValueOnce("docRef1").mockReturnValueOnce("docRef2");
      mockGetDoc
        .mockResolvedValueOnce(memberDoc1)
        .mockResolvedValueOnce(memberDoc2);

      const result = await getEmails(true);

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe(StatusEnum.APPROVED);
    });

    it("should filter out empty emails", async () => {
      const secureMemberData = [
        { id: "member1", fields: { email: "test1@example.com" } },
        { id: "member2", fields: { email: "" } },
      ];

      mockGetFirebaseTable.mockResolvedValue(secureMemberData);

      const memberDoc1 = createMockDocSnapshot("member1", {
        name: "Test User 1",
        status: StatusEnum.APPROVED,
      });

      mockDoc.mockReturnValueOnce("docRef1");
      mockGetDoc.mockResolvedValueOnce(memberDoc1);

      const result = await getEmails(false);

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe("test1@example.com");
    });

    it("should handle documents that don't exist", async () => {
      const secureMemberData = [
        { id: "member1", fields: { email: "test1@example.com" } },
      ];

      mockGetFirebaseTable.mockResolvedValue(secureMemberData);

      const memberDoc = createMockDocSnapshot("member1", null, false);

      mockDoc.mockReturnValueOnce("docRef1");
      mockGetDoc.mockResolvedValueOnce(memberDoc);

      const result = await getEmails(false);

      expect(result).toHaveLength(0);
    });

    it("should handle missing optional fields", async () => {
      const secureMemberData = [
        {
          id: "member1",
          fields: { email: "test1@example.com", unsubscribe_key: "key123" },
        },
      ];

      mockGetFirebaseTable.mockResolvedValue(secureMemberData);

      const memberDoc = createMockDocSnapshot("member1", {});

      mockDoc.mockReturnValueOnce("docRef1");
      mockGetDoc.mockResolvedValueOnce(memberDoc);

      const result = await getEmails(false);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "member1",
        email: "test1@example.com",
        name: null,
        emailAbbr: null,
        status: null,
        unsubscribed: false,
        unsubKey: "key123",
      });
    });

    it("should throw error on getDoc failure", async () => {
      const secureMemberData = [
        { id: "member1", fields: { email: "test1@example.com" } },
      ];

      mockGetFirebaseTable.mockResolvedValue(secureMemberData);
      mockDoc.mockReturnValueOnce("docRef1");
      mockGetDoc.mockRejectedValueOnce(new Error("Firestore error"));

      await expect(getEmails(false)).rejects.toThrow("Firestore error");
    });
  });

  describe("getEmailById", () => {
    it("should return email by userId", async () => {
      const secureMemberData = [
        { id: "member1", fields: { email: "test1@example.com" } },
        { id: "member2", fields: { email: "test2@example.com" } },
      ];

      mockGetFirebaseTable.mockResolvedValue(secureMemberData);

      const memberDoc1 = createMockDocSnapshot("member1", {
        name: "Test User 1",
        status: StatusEnum.APPROVED,
      });

      const memberDoc2 = createMockDocSnapshot("member2", {
        name: "Test User 2",
        status: StatusEnum.APPROVED,
      });

      mockDoc.mockReturnValueOnce("docRef1").mockReturnValueOnce("docRef2");
      mockGetDoc
        .mockResolvedValueOnce(memberDoc1)
        .mockResolvedValueOnce(memberDoc2);

      const result = await getEmailById("member2");

      expect(result).toMatchObject({
        id: "member2",
        email: "test2@example.com",
      });
    });

    it("should return undefined when userId not found", async () => {
      const secureMemberData = [
        { id: "member1", fields: { email: "test1@example.com" } },
      ];

      mockGetFirebaseTable.mockResolvedValue(secureMemberData);

      const memberDoc1 = createMockDocSnapshot("member1", {
        name: "Test User 1",
        status: StatusEnum.APPROVED,
      });

      mockDoc.mockReturnValueOnce("docRef1");
      mockGetDoc.mockResolvedValueOnce(memberDoc1);

      const result = await getEmailById("nonexistent");

      expect(result).toBeUndefined();
    });
  });

  describe("getIdByEmail", () => {
    it("should return userId by email", async () => {
      const secureMemberData = [
        { id: "member1", fields: { email: "test1@example.com" } },
        { id: "member2", fields: { email: "test2@example.com" } },
      ];

      mockGetFirebaseTable.mockResolvedValue(secureMemberData);

      const memberDoc1 = createMockDocSnapshot("member1", {
        name: "Test User 1",
        status: StatusEnum.APPROVED,
      });

      const memberDoc2 = createMockDocSnapshot("member2", {
        name: "Test User 2",
        status: StatusEnum.APPROVED,
      });

      mockDoc.mockReturnValueOnce("docRef1").mockReturnValueOnce("docRef2");
      mockGetDoc
        .mockResolvedValueOnce(memberDoc1)
        .mockResolvedValueOnce(memberDoc2);

      const result = await getIdByEmail("test2@example.com");

      expect(result).toBe("member2");
    });

    it("should return null when email not found", async () => {
      const secureMemberData = [
        { id: "member1", fields: { email: "test1@example.com" } },
      ];

      mockGetFirebaseTable.mockResolvedValue(secureMemberData);

      const memberDoc1 = createMockDocSnapshot("member1", {
        name: "Test User 1",
        status: StatusEnum.APPROVED,
      });

      mockDoc.mockReturnValueOnce("docRef1");
      mockGetDoc.mockResolvedValueOnce(memberDoc1);

      const result = await getIdByEmail("nonexistent@example.com");

      expect(result).toBeNull();
    });
  });

  describe("emailExists", () => {
    it("should return true when email exists", async () => {
      const secureMemberData = [
        { id: "member1", fields: { email: "test1@example.com" } },
        { id: "member2", fields: { email: "test2@example.com" } },
      ];

      mockGetFirebaseTable.mockResolvedValue(secureMemberData);

      const result = await emailExists("test2@example.com");

      expect(result).toBe(true);
    });

    it("should return false when email does not exist", async () => {
      const secureMemberData = [
        { id: "member1", fields: { email: "test1@example.com" } },
      ];

      mockGetFirebaseTable.mockResolvedValue(secureMemberData);

      const result = await emailExists("nonexistent@example.com");

      expect(result).toBe(false);
    });

    it("should return false for empty secure member data", async () => {
      mockGetFirebaseTable.mockResolvedValue([]);

      const result = await emailExists("test@example.com");

      expect(result).toBe(false);
    });
  });

  describe("addSecureEmail", () => {
    it("should add secure email with member reference", async () => {
      const mockMemberDocRef = createMockDocRef(
        "member123",
        FirebaseTablesEnum.MEMBERS,
      );
      const mockDocRef = { id: "member123" };
      const mockSet = jest.fn().mockResolvedValue(undefined);
      const mockDoc = jest
        .fn()
        .mockReturnValue({ set: mockSet, ...mockDocRef });
      const mockCollection = jest.fn().mockReturnValue({ doc: mockDoc });

      (admin.firestore as unknown as jest.Mock).mockReturnValue({
        collection: mockCollection,
      });

      const result = await addSecureEmail(
        "test@example.com",
        mockMemberDocRef as any,
      );

      expect(mockInitializeAdmin).toHaveBeenCalled();
      expect(mockCollection).toHaveBeenCalledWith(
        FirebaseTablesEnum.SECURE_MEMBER_DATA,
      );
      expect(mockDoc).toHaveBeenCalledWith("member123");
      expect(mockSet).toHaveBeenCalledWith({
        last_modified: "mock-timestamp",
        last_modified_by: expect.any(String),
        email: "test@example.com",
        member: mockMemberDocRef.path,
      });
      expect(result).toMatchObject(mockDocRef);
    });
  });

  describe("sendVerificationEmail", () => {
    it("should generate and send verification email", async () => {
      const mockGenerateLink = jest
        .fn()
        .mockResolvedValue("https://example.com/verify?token=abc123");

      (admin.auth as jest.Mock).mockReturnValue({
        generateSignInWithEmailLink: mockGenerateLink,
      });

      await sendVerificationEmail(
        "test@example.com",
        "https://example.com/callback",
      );

      expect(mockInitializeAdmin).toHaveBeenCalled();
      expect(mockGenerateLink).toHaveBeenCalledWith("test@example.com", {
        url: "https://example.com/callback",
        handleCodeInApp: true,
      });
      expect(mockSendLoginPromptEmail).toHaveBeenCalledWith({
        emailAddress: "test@example.com",
        promptLink: "https://example.com/verify?token=abc123",
      });
    });

    it("should throw error on email sending failure", async () => {
      const mockGenerateLink = jest
        .fn()
        .mockRejectedValue(new Error("Email send failed"));

      (admin.auth as jest.Mock).mockReturnValue({
        generateSignInWithEmailLink: mockGenerateLink,
      });

      await expect(
        sendVerificationEmail(
          "test@example.com",
          "https://example.com/callback",
        ),
      ).rejects.toThrow("Email send failed");
    });
  });
});
