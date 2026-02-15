import { NextApiResponse } from "next";

export class MissingHeaderError extends Error {
  constructor() {
    super("Authorization header missing");
    this.name = "MissingHeaderError";
  }
}

export class MissingTokenError extends Error {
  constructor() {
    super("Authorization token missing in header");
    this.name = "MissingTokenError";
  }
}

export class TokenVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenVerificationError";
  }
}

export class InvalidApiMethodError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidApiMethodError";
  }
}

export class MissingQueryError extends Error {
  constructor() {
    super("Query missing");
    this.name = "MissingQueryError";
  }
}

export class MissingQueryParamError extends Error {
  constructor(param: string) {
    super(`Query parameter ${param} missing`);
    this.name = "MissingQueryParamError";
  }
}

export class InvalidQueryParamTypeError extends Error {
  constructor(param: string, expectedType: string) {
    super(
      `Invalid type for query parameter ${param}. Expected ${expectedType}.`,
    );
    this.name = "InvalidQueryParamTypeError";
  }
}

export class MissingBodyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ItemNotFoundError";
  }
}

export class MissingBodyParamError extends Error {
  constructor(param: string) {
    super(`Body parameter ${param} missing`);
    this.name = "MissingBodyParamError";
  }
}

export class InvalidBodyParamTypeError extends Error {
  constructor(param: string, expectedType: string) {
    super(
      `Invalid type for query parameter ${param}. Expected ${expectedType}.`,
    );
    this.name = "InvalidBodyParamTypeError";
  }
}

export class ItemNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ItemNotFoundError";
  }
}

export class InvalidEnumValueError extends Error {
  constructor(param: string, value: string) {
    super(`Invalid value for enum ${param}: ${value}`);
    this.name = "InvalidEnumValueError";
  }
}

export class KeyVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KeyVerificationError";
  }
}

export class CloudflareVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudflareVerificationError";
  }
}

export function handleApiErrors(error: Error, res: NextApiResponse) {
  if (
    error instanceof MissingHeaderError ||
    error instanceof MissingQueryError ||
    error instanceof MissingQueryParamError ||
    error instanceof MissingBodyParamError ||
    error instanceof InvalidQueryParamTypeError ||
    error instanceof InvalidEnumValueError
  ) {
    return res.status(400).json({ message: error.message });
  }
  if (
    error instanceof MissingTokenError ||
    error instanceof TokenVerificationError ||
    error instanceof KeyVerificationError ||
    error instanceof CloudflareVerificationError
  ) {
    return res.status(401).json({ message: error.message });
  }
  if (error instanceof ItemNotFoundError) {
    return res.status(404).json({ message: error.message });
  }
  if (error instanceof InvalidApiMethodError) {
    return res.status(405).json({ message: error.message });
  }
  return res.status(500).json({ message: error.message });
}
