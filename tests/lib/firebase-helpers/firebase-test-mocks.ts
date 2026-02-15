/**
 * Firebase Helpers Test Mock Utilities
 *
 * Standardized mock setups for Firebase Firestore operations.
 * Keep jest.mock() calls in test files but use these standardized mock implementations.
 */

export const createFirebaseMocks = {
  firestore: () => ({
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    deleteDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
  }),

  db: () => ({}),
};

export const createMockDocRef = (id: string, tableName: string) =>
  ({
    id,
    path: `${tableName}/${id}`,
    type: "document",
    firestore: {},
    parent: {
      id: tableName,
      path: tableName,
    },
    converter: null,
    withConverter: jest.fn(),
  }) as any;

export const createMockDocSnapshot = (
  id: string,
  data: any,
  exists: boolean = true,
) => ({
  id,
  exists: () => exists,
  data: () => data,
  ref: createMockDocRef(id, "test-collection"),
});

export const createMockQuerySnapshot = (docs: any[]) => ({
  docs: docs.map((doc) =>
    createMockDocSnapshot(doc.id, doc.fields || doc.data, true),
  ),
  size: docs.length,
  empty: docs.length === 0,
});

export const createFirebaseScenarios = (mocks: any) => ({
  successfulQuery: (mockData: any[]) => {
    if (mocks.getDocs) {
      mocks.getDocs.mockResolvedValue(createMockQuerySnapshot(mockData));
    }
  },

  emptyQuery: () => {
    if (mocks.getDocs) {
      mocks.getDocs.mockResolvedValue(createMockQuerySnapshot([]));
    }
  },

  documentExists: (id: string, data: any) => {
    if (mocks.getDoc) {
      mocks.getDoc.mockResolvedValue(createMockDocSnapshot(id, data, true));
    }
  },

  documentNotExists: () => {
    if (mocks.getDoc) {
      mocks.getDoc.mockResolvedValue(createMockDocSnapshot("", null, false));
    }
  },

  deleteSuccess: () => {
    if (mocks.deleteDoc) {
      mocks.deleteDoc.mockResolvedValue(undefined);
    }
  },

  deleteError: (error: Error) => {
    if (mocks.deleteDoc) {
      mocks.deleteDoc.mockRejectedValue(error);
    }
  },

  queryError: (error: Error) => {
    if (mocks.getDocs) {
      mocks.getDocs.mockRejectedValue(error);
    }
  },
});

export const setupFirebaseHelpers = {
  resetMocks: () => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.debug = jest.fn();
  },

  beforeEach: () => {
    setupFirebaseHelpers.resetMocks();
  },
};
