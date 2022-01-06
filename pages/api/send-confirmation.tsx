import SendGrid from "@sendgrid/mail";

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
      templateId: process.env.SENDGRID_TEMPLATE,
      dynamicTemplateData: {
        fullName: req.body.name,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
  return res.status(200).json({ error: "" });
}
