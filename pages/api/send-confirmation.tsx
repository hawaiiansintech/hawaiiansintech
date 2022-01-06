import SendGrid from "@sendgrid/mail";

const SENDGRID_TEMPLATE = `d-ea5f534a9ed44d07a354c614e8d7f6b4`;

interface MailBody {
  email: string;
  name: string;
}

export interface MailRequest {
  body: MailBody;
  method?: "POST";
}

SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function sendConfirmation(req: MailRequest, res) {
  try {
    await SendGrid.send({
      to: req.body.email,
      from: {
        name: "Hawaiians In Tech",
        email: "aloha@hawaiiansintech.org",
      },
      templateId: SENDGRID_TEMPLATE,
      dynamicTemplateData: {
        fullName: req.body.name,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
  return res.status(200).json({ error: "" });
}
