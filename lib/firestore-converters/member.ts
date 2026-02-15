import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  CompanySizeEnum,
  FirebaseDefaultValuesEnum,
  StatusEnum,
  YearsOfExperienceEnum,
} from "../enums";
import { checkType } from "./common";

export class Member {
  constructor(
    public companySize: CompanySizeEnum,
    public focuses: DocumentReference[],
    public industries: DocumentReference[],
    public link: string,
    public location: string,
    public maskedEmail: string,
    public name: string,
    public regions: DocumentReference[],
    public title: string,
    public yearsExperience: YearsOfExperienceEnum,
    public experience?: DocumentReference,
    public id?: string,
    public lastModified?: Timestamp,
    public lastModifiedBy?: DocumentReference | string,
    public requests?: string,
    public status?: StatusEnum,
    public unsubscribed?: boolean,
  ) {}

  toString() {
    return (
      this.name +
      " - status: {" +
      this.status +
      "} - created at " +
      this.lastModified.toDate().toLocaleString()
    );
  }
}

export const memberConverter: FirestoreDataConverter<Member> = {
  toFirestore(user: Member): DocumentData {
    return {
      company_size: user.companySize,
      focuses: user.focuses,
      industries: user.industries,
      link: user.link,
      location: user.location,
      masked_email: user.maskedEmail,
      name: user.name,
      regions: user.regions,
      title: user.title,
      years_experience: user.yearsExperience,
      experience: user.experience || null,
      last_modified: user.lastModified || serverTimestamp(),
      last_modified_by:
        user.lastModifiedBy || FirebaseDefaultValuesEnum.LAST_MODIFIED_BY,
      requests: user.requests || "",
      status: user.status || StatusEnum.PENDING,
      unsubscribed: user.unsubscribed || false,
    };
  },

  fromFirestore(snapshot: QueryDocumentSnapshot): Member {
    const data = snapshot.data();
    const name = data.name;
    return new Member(
      checkType<CompanySizeEnum>(
        data.company_size,
        "company_size",
        name,
        "string",
      ),
      checkType<DocumentReference[]>(data.focuses, "focuses", name, "object"),
      checkType<DocumentReference[]>(
        data.industries,
        "industries",
        name,
        "object",
      ),
      checkType<string>(data.link, "link", name, "string"),
      checkType<string>(data.location, "location", name, "string"),
      checkType<string>(data.masked_email, "masked_email", name, "string"),
      checkType<string>(data.name, "name", name, "string"),
      checkType<DocumentReference[]>(data.regions, "regions", name, "object"),
      checkType<string>(data.title, "title", name, "string"),
      checkType<YearsOfExperienceEnum>(
        data.years_experience,
        "years_experience",
        name,
        "string",
      ),
      checkType<DocumentReference>(
        data.experience,
        "experience",
        name,
        "object",
      ),
      snapshot.id,
      checkType<Timestamp>(data.last_modified, "last_modified", name, "object"),
      data.last_modified_by || null,
      checkType<string>(data.requests, "requests", name, "string"),
      checkType<StatusEnum>(data.status, "status", name, "string") ||
        StatusEnum.PENDING,
      checkType<boolean>(data.unsubscribed, "unsubscribed", name, "boolean"),
    );
  },
};
