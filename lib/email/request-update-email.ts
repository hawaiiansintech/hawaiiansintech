import SendGrid from "@sendgrid/mail";
import { ADMIN_EMAILS, getEmailTemplate, REPLY_EMAIL } from "./utils";
SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

export interface RequestUpdateEmailProps {
  firebaseId: string;
  name: string;
  email: string;
  removeRequest?: boolean;
}

export async function sendRequestUpdateEmail({
  firebaseId,
  name,
  email,
  removeRequest,
}: RequestUpdateEmailProps) {
  const firebaseUrl = `https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/firestore/data/~2Fmembers~2F${firebaseId}`;
  const MESSAGE_BODY = `
  <p>Get started by opening up the <a href="${firebaseUrl}"> user</a> on Firebase and navigate to the requests.</p>
  <p><strong>1. Check the "Anything else?" field first${
    removeRequest ? ", beyond the request to remove." : "."
  }</strong> Just in case there are special requests or instructions.</p>
  <p><strong>2. ${
    email
      ? `Reach out to ${name} at ${email} about the ${
          removeRequest
            ? "removal.</strong>"
            : "changes.</strong> This is a good way for us to connect with members. One day, we'll build a tokenized/automated approach for requests that don't change freeform fields. One day."
        }`
      : `This is the awkward step. So, we don't have their email.</strong> We advised them to follow <a href='http://hawaiiansintech.org/edit/thank-you?email=null'>these instructions</a>. So, now, we wait.`
  }</p>
  <p><strong>3. Once we hear back,${
    removeRequest
      ? " take a deep breath.</strong> Okay, now right-click and delete the record."
      : " move the member's status to Pending.</strong> Make the requested changes.</p><ul><li>If there were any updates to Location, we'll need to manually look over and the relevant Region (which is an indexed/searchable field).</li><li>If any freeform fields (location/title/suggested/etc.) were changed, check for misspelling. Remember to try use proper diacriticals (wehewehe.org is your friend).</li><li>If their URL was updated, make sure it works.</li></ul><p>Then move Status to Approved!"
  }</p>
  ${
    firebaseId
      ? `<p><em><strong>Member ID:</strong> ${firebaseId}</em></p>`
      : ""
  }
  `;
  const emailTemplate = getEmailTemplate({
    body: MESSAGE_BODY,
    prependMessage: name,
    title: `${
      removeRequest ? "💔 Removal requested from" : "✨ Change requested from"
    } ${name}`,
  });

  SendGrid.sendMultiple({
    to: ADMIN_EMAILS,
    from: {
      email: REPLY_EMAIL,
      name: "Hawaiians in Tech",
    },
    subject: `${
      removeRequest ? "💔 Removal requested from" : "✨ Change requested from"
    } ${name}`,
    html: emailTemplate,
  });
}
