import * as Yup from "yup";
import { StatusEnum } from "../enums";

const focusIndustrySchema = Yup.array()
  .of(
    Yup.object().shape({
      name: Yup.string().required(),
      id: Yup.string().required(),
    }),
  )
  .nullable();

export const memberPublicValidator = Yup.object().shape({
  companySize: Yup.string().nullable(),
  emailAbbr: Yup.string().nullable(),
  focus: focusIndustrySchema,
  focusSuggested: Yup.string().nullable(),
  id: Yup.string().required(),
  industry: focusIndustrySchema,
  industrySuggested: Yup.string().nullable(),
  lastModified: Yup.date().nullable(),
  link: Yup.string().url().nullable(),
  location: Yup.string().nullable(),
  name: Yup.string().nullable(),
  region: Yup.string().nullable(),
  status: Yup.string().oneOf(Object.values(StatusEnum)).nullable(),
  title: Yup.string().nullable(),
  unsubscribed: Yup.boolean().nullable(),
  yearsExperience: Yup.string().nullable(),
});
