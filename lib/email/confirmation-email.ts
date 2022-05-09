import SendGrid from "@sendgrid/mail";
import { getEmailTemplate, REPLY_EMAIL } from "./utils";
SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailTemplateProps {
  airtableID: string;
  name: string;
}

export interface SendConfirmationEmailProps extends EmailTemplateProps {
  email: string;
}

export async function sendConfirmationEmail({
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
}
