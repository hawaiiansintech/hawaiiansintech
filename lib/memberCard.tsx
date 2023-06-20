import Button, { ButtonSize, ButtonVariant } from "@/components/Button";
import { FirebaseTablesEnum, StatusEnum } from "@/lib/enums";
import {
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { MemberPublic } from "./api";
import { db } from "./firebase";
import { memberConverter } from "./firestore-converters/member";

export interface referencesToDelete {
  memberRef: DocumentReference;
  focuses: DocumentReference[];
  industries: DocumentReference[];
  regions: DocumentReference[];
  secureMemberData: DocumentReference;
}

export async function getReferencesToDelete(
  uid: string
): Promise<referencesToDelete> {
  const documentRef = doc(db, FirebaseTablesEnum.MEMBERS, uid).withConverter(
    memberConverter
  );
  const documentSnapshot = await getDoc(documentRef);
  if (!documentSnapshot.exists()) {
    return null;
  }
  const data = documentSnapshot.data();
  const returnData = {
    memberRef: documentRef,
    focuses: data.focuses,
    industries: data.industries,
    regions: data.regions,
    secureMemberData: doc(db, FirebaseTablesEnum.SECURE_MEMBER_DATA, uid),
  };
  return returnData;
}

export async function deleteReferences(
  memberRef: DocumentReference,
  references: DocumentReference[]
) {
  for (const reference of references) {
    const documentSnapshot = await getDoc(reference);
    const memberRefs = documentSnapshot.data().members;
    const memberRefToDelete = memberRef.id;
    const updatedMemberRefs = memberRefs.filter(
      (ref) => ref.id !== memberRefToDelete
    );
    console.log("Removing member from:", reference.id);
    await updateDoc(reference, {
      members: updatedMemberRefs,
      last_modified: serverTimestamp(),
      last_modified_by: sessionStorage.getItem("user"),
    });
  }
}

export async function deleteDocument(docRef: DocumentReference) {
  const documentSnapshot = await getDoc(docRef);
  if (documentSnapshot.exists()) {
    try {
      await deleteDoc(docRef);
      console.log("Document successfully deleted:", docRef.id);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }
}

export default function MemberCard(
  member: MemberPublic,
  deleteSelected: boolean,
  selectDelect: (id: string) => void,
  isHidden: boolean,
  setIsHidden: (id: string) => void,
  showDelete: boolean
) {
  let backgroundColor = "#f2f2f2";
  switch (member.status) {
    case StatusEnum.APPROVED:
      backgroundColor = "#d4edda";
      break;
    case StatusEnum.PENDING:
      backgroundColor = "#fff3cd";
      break;
    case StatusEnum.IN_PROGRESS:
      backgroundColor = "#cce5ff";
      break;
    case StatusEnum.DECLINED:
      backgroundColor = "#f8d7da";
      break;
    default:
      break;
  }

  const handleDeleteSelect = () => {
    selectDelect(member.id);
  };

  const handleConfirmDelete = async () => {
    const references = await getReferencesToDelete(member.id);
    const memberRef = references.memberRef;
    console.log("removing focuses references");
    await deleteReferences(memberRef, references.focuses);
    console.log("removing industries references");
    await deleteReferences(memberRef, references.industries);
    console.log("removing regions references");
    await deleteReferences(memberRef, references.regions);
    console.log("removing secureMemberData document");
    await deleteDocument(references.secureMemberData);
    console.log("removing member document");
    await deleteDocument(references.memberRef);
    setIsHidden(member.id);
  };

  return isHidden ? null : (
    <div className="member-container" key={member.id}>
      <div className="member-header">
        <h2 style={{ display: "flex" }}>
          {member.name}, {member.title}
          {showDelete &&
            (!deleteSelected ? (
              <div style={{ marginLeft: "1rem", marginTop: "0" }}>
                <Button
                  size={ButtonSize.Small}
                  customWidth="10rem"
                  customFontSize="1rem"
                  onClick={handleDeleteSelect}
                >
                  Delete
                </Button>
              </div>
            ) : (
              <div style={{ marginLeft: "1rem", display: "flex" }}>
                <div style={{ marginRight: "0.5rem" }}>
                  <Button
                    size={ButtonSize.Small}
                    customWidth="12rem"
                    customFontSize="1rem"
                    onClick={handleConfirmDelete}
                    variant={ButtonVariant.Secondary}
                  >
                    ✔️ (confirm delete)
                  </Button>
                </div>
                <div>
                  <Button
                    size={ButtonSize.Small}
                    customWidth="12rem"
                    customFontSize="1rem"
                    onClick={handleDeleteSelect}
                    variant={ButtonVariant.Secondary}
                  >
                    ❌ (don't delete)
                  </Button>
                </div>
              </div>
            ))}
        </h2>
      </div>
      <div className="member-body">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Title</th>
              <th>Status</th>
              <th>Last Modified</th>
              <th>Location</th>
              <th>Company Size</th>
              <th>Region</th>
              <th>Focuses</th>
              <th>Industries</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.title}</td>
              <td>{member.status}</td>
              <td>{member.lastModified}</td>
              <td>{member.location}</td>
              <td>{member.companySize}</td>
              <td>{member.region}</td>
              <td>
                {member.focus &&
                  member.focus.map((focus) => (
                    <div key={member.id + focus.id}>
                      {focus.name} - {focus.status}
                    </div>
                  ))}
              </td>
              <td>
                {member.industry &&
                  member.industry.map((industry) => (
                    <div key={member.id + industry.id}>
                      {industry.name} - {industry.status}
                    </div>
                  ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <style jsx>{`
        h2 {
          font-size: 1.5rem;
        }
        .member-container {
          background-color: ${backgroundColor};
          border-radius: 0.25rem;
          box-shadow: 0 0 0.1rem rgba(0, 0, 0, 0.2);
          margin: 1rem;
          padding: 1rem;
        }
        .member-header {
          margin-bottom: 1rem;
        }
        .member-header h1 h2 h3 h4 {
          margin-bottom: 0.5rem;
          text-align: left;
        }
        .member-body {
          font-size: 1rem;
          display: flex;
          justify-content: space-between;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          padding: 0.5rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
        }
        .member-details {
          width: 50%;
        }
        .member-body h4 {
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .member-body ul {
          margin-top: 0.5rem;
          margin-bottom: 1rem;
          margin-left: 1rem;
        }
        .member-body li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
