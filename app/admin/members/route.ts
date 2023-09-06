import { getFirebaseTable, getMembers, MemberPublic } from "@/lib/api";
import { FirebaseTablesEnum, StatusEnum } from "@/lib/enums";
import { NextResponse } from "next/server";

export const revalidate = 6000;

export async function GET() {
  const members: MemberPublic[] = await getMembers(
    await getFirebaseTable(FirebaseTablesEnum.FOCUSES),
    await getFirebaseTable(FirebaseTablesEnum.INDUSTRIES),
    await getFirebaseTable(FirebaseTablesEnum.REGIONS),
    [StatusEnum.APPROVED, StatusEnum.IN_PROGRESS, StatusEnum.PENDING]
  );

  return NextResponse.json(members, {
    status: 200,
  });
}
