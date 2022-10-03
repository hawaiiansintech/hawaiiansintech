import { Filter, MemberPublic } from "@/lib/api";
import { experienceOptions } from "../intake-form/WorkExperience";

export async function getExperience(
  members: MemberPublic[]
): Promise<Filter[]> {
  const expList = [];
  experienceOptions.forEach((exp) => {
    expList.push({
      name: exp.name,
      id: exp.id,
      filterType: "experience",
      members: [],
      count: 0,
      hasApprovedMembers: false,
    });
  });
  const memExp = members.filter((member) => member.yearsExperience);
  memExp.forEach((member) => {
    let expIndex = expList.findIndex(
      (exp) => exp.name === member.yearsExperience
    );
    if (!expList[expIndex].hasApprovedMembers)
      expList[expIndex].hasApprovedMembers = true;
    expList[expIndex].count++;
    expList[expIndex].members.push(member.id);
  });
  return expList;
}
