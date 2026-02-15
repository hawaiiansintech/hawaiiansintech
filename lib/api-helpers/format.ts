import { NextApiRequest } from "next";
import {
  InvalidApiMethodError,
  InvalidBodyParamTypeError,
  MissingQueryError,
  MissingBodyParamError,
  MissingBodyError,
  MissingQueryParamError,
  InvalidQueryParamTypeError,
} from "./errors";

export function checkMethods(method: string, allowedMethods: string[]) {
  if (!allowedMethods.includes(method)) {
    throw new InvalidApiMethodError(
      `Only ${allowedMethods.join(", ")} requests are allowed.`,
    );
  }
}

export function checkQueryParams(
  req: NextApiRequest,
  params: { [key: string]: string },
) {
  if (req.query === null) {
    throw new MissingQueryError();
  }
  for (const param in params) {
    if (req.query[param] === undefined) {
      throw new MissingQueryParamError(
        `Missing query parameter: ${param} for ${req.url}`,
      );
    }
    // checks for "string", "number", "boolean", or "object"
    if (typeof req.query[param] !== params[param]) {
      throw new InvalidQueryParamTypeError(param, params[param]);
    }
  }
}

export function checkBodyParams(
  req: NextApiRequest,
  params: { [key: string]: string },
) {
  if (!req.body) {
    throw new MissingBodyError(`Missing body for ${req.url}`);
  }
  for (const param in params) {
    if (req.body[param] === undefined) {
      throw new MissingBodyParamError(
        `Missing body parameter: ${param} for ${req.url}`,
      );
    }
    // checks for "string", "number", "boolean", or "object"
    if (typeof req.body[param] !== params[param]) {
      throw new InvalidBodyParamTypeError(param, params[param]);
    }
  }
}
