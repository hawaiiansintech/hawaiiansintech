import {
  InvalidEnumValueError,
  InvalidQueryParamTypeError,
  handleApiErrors,
} from "@/lib/api-helpers/errors";
import { checkMethods, checkQueryParams } from "@/lib/api-helpers/format";
import { FirebaseTablesEnum } from "@/lib/enums";
import { getFilters } from "@/lib/firebase-helpers/filters";
import { Filter } from "@/lib/firebase-helpers/interfaces";
import { NextApiRequest, NextApiResponse } from "next";

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  checkQueryParams(req, { filterTable: "string" });
  if (Array.isArray(req.query.filterTable)) {
    throw new InvalidQueryParamTypeError("filterTable", "string");
  }
  const filterTableOptions = [
    FirebaseTablesEnum.FOCUSES,
    FirebaseTablesEnum.INDUSTRIES,
    FirebaseTablesEnum.REGIONS,
  ];
  const filterTable = req.query.filterTable as FirebaseTablesEnum;
  if (!filterTableOptions.includes(filterTable)) {
    throw new InvalidEnumValueError("filterTable", filterTable);
  }
  const filters: Filter[] = await getFilters(filterTable);
  return res.status(200).send({ filters });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    checkMethods(req.method, ["GET"]);
    await getHandler(req, res);
  } catch (error) {
    return handleApiErrors(error, res);
  }
}
