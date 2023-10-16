export enum StatusEnum {
  APPROVED = "approved",
  IN_PROGRESS = "in_progress",
  PENDING = "pending",
  ARCHIVED = "archived",
}

export enum CompanySizeEnum {
  ONE = "1",
  TWO_TO_NINE = "2 - 9",
  TEN_TO_NINETEEN = "10 - 19",
  TWENTY_TO_FORTY_NINE = "20 - 49",
  FIFTY_TO_NINETY_NINE = "50 - 99",
  ONE_HUNDRED_TO_NINE_HUNDRED_NINETY_NINE = "100 - 999",
  ONE_THOUSAND_TO_FOUR_THOUSAND_NINE_HUNDRED_NINETY_NINE = "1000 - 4999",
  FIVE_THOUSAND_TO_TEN_THOUSAND = "5000 - 10000",
  MORE_THAN_TEN_THOUSAND = "More than 10000",
  NA = "N/A",
}

export enum YearsOfExperienceEnum {
  LESS_THAN_ONE = "Less than a year",
  ONE_TO_TWO = "1 - 2 years",
  THREE_TO_FOUR = "3 - 4 years",
  FIVE_TO_NINE = "5 - 9 years",
  TEN_TO_NINETEEN = "10 - 19 years",
  MORE_THAN_FIFTEEN = "More than 20 years",
}

export enum FirebaseTablesEnum {
  ADMINS = "admins",
  FOCUSES = "focuses",
  INDUSTRIES = "industries",
  MEMBERS = "members",
  REGIONS = "regions",
  REVIEW = "review",
  SECURE_MEMBER_DATA = "secureMemberData",
}

export enum FirebaseDefaultValuesEnum {
  LAST_MODIFIED_BY = "new_member_form",
}

export enum StorageEnum {
  PREVIOUS_PAGE = "previousPage",
  USER_NAME = "userName",
  USER_ID = "uid",
  USER_EMAIL = "email",
  PROFILE_PICTURE = "profilePicture",
  EMAIL_IS_VERIFIED = "emailIsVerified",
  LOGIN_TYPE_NAME = "loginTypeName",
  LOGIN_TYPE_IMAGE = "loginTypeImage",
  LOGIN_ERROR_MESSAGE = "loginErrorMessage",
}
