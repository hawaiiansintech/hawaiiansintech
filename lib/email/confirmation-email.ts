import SendGrid from "@sendgrid/mail";
import { ADMIN_EMAILS, getEmailTemplate, REPLY_EMAIL } from "./utils";
SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailTemplateProps {
  airtableID: string;
  name: string;
}

export interface SendConfirmationEmailProps extends EmailTemplateProps {
  email: string;
}

export async function sendConfirmationEmails({
  email,
  airtableID,
  name,
}: SendConfirmationEmailProps) {
  const MESSAGE_BODY = `
    <p>Aloha kāua e ${name},</p>
    <p>Thanks for signing up to join the <strong>Hawaiians in Tech</strong> list.</p>
    <p><strong>Expect one of us to reach out</strong> as soon as we can get to it. We review all changes manually for... quality assurance. 😆 We'll let you know once you're published on the list (happy path), or if we have any questions or requested adjustments.</p>
    <p>By the way, did you know we're just a small crew of kanaka putting this all together? Learn a little more about our (evolving) <a href="https://www.bizjournals.com/pacific/news/2021/08/30/website-hawaiians-in-technology.html">story here</a>.</p>
    <p>Have any ideas for the website or community? Any feedback for how we're running the show? <em>Ahhh, take a hike</em>. Nah, just kidding — <strong>we are always looking for member-led initiatives and ideas</strong>. Please reach out and we can talk story! No shame!</p>
  `;

  const emailTemplate = getEmailTemplate({
    body: MESSAGE_BODY,
    prependMessage: "Our little hui grows by one (yeah, you)",
    title: `Submission confirmation`,
    subtitle: `Mahalo for your interest!`,
  });

  await SendGrid.send({
    to: email,
    from: {
      email: REPLY_EMAIL,
      name: "Hawaiians in Tech",
    },
    subject: "Welcome to Hawaiians in Tech",
    html: emailTemplate,
  });
  const airtableUrl = `https://airtable.com/${process.env.AIRTABLE_BASE}/tblEvo2F3MecUanJu/viwJ4z01vDJ1BaUlo/${airtableID}`;

  const MESSAGE_BODY_2 = `
    <p>Get started by opening up the pending <a href="${airtableUrl}">Submission</a> on Airtable.</p>
    <p><strong>1. Review the submission.</strong></p><ul><li>For Location, we'll need to manually look over and connect the relevant Region (which is a separate, indexed/searchable field).</li><li>If any freeform fields (location/title/suggested/etc.) were used, check for misspelling and/or appropriateness. Remember to try use proper diacriticals (wehewehe.org is your friend).</li><li>Check that their URL works.</li></ul>
    <p><strong>2. Reach out to ${name} at ${email} about their new submission.</strong> Be concise/clear about intention of suggestions.</p>
    <p><strong>3. If all goes well,</strong> double-check all fields and move their Status to Approved!</p>
    ${
      airtableID
        ? `<p><em><strong>Member ID:</strong> ${airtableID}</em></p>`
        : ""
    }
  `;

  const emailTemplate2 = getEmailTemplate({
    body: MESSAGE_BODY_2,
    prependMessage: name,
    title: `New Member Submission from ${name}`,
  });

  await SendGrid.sendMultiple({
    to: ADMIN_EMAILS,
    from: {
      email: REPLY_EMAIL,
      name: "Hawaiians in Tech",
    },
    subject: `New Submission`,
    html: emailTemplate2,
  });
}
