import SendGrid from "@sendgrid/mail";
SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

export interface NewSubmissionEmailProps {
  airtableID: string;
  name: string;
  email: string;
  removeRequest?: boolean;
}

const emailTemplate = ({
  airtableID,
  name,
  email,
  removeRequest,
}: NewSubmissionEmailProps) => {
  const MESSAGE_BODY = `
  <p>Get started by opening up the <a href="https://airtable.com/${
    process.env.AIRTABLE_BASE_NEW
  }/tblQkhLLpdJ7YYsx2">Airtable requests table</a>.</p>
  <p><strong>1. Check the request for the "Anything else?" field first${
    removeRequest ? ", beyond the request to remove." : "."
  }</strong> Just in case there are special requests or instructions.</p>
  <p><strong>2. ${
    email
      ? `Reach out to ${name} at ${email} about the ${
          removeRequest
            ? "removal.</strong>"
            : "changes.</strong> This is a good way for us to connect with members. One day, we'll build a tokenized/automated approach for requests that don't change freeform fields. One day."
        }`
      : `This is the awkward step. So, we don't have their email.</strong> We advised them to follow <a href='http://hawaiiansintech.org/edit/thank-you?emailNull=true'>these instructions</a>. So, now, we wait until they reach out through one of those listed "channels". If we don't hear back for awhile, confirm there wasn't a note.`
  }</p>
  <p><strong>3. Once we hear back,${
    removeRequest
      ? " take a deep breath.</strong> Okay, now right-click and delete the record."
      : " move the member's status to Pending.</strong> Make the requested changes.</p><ul><li>If there were any updates to Location, we'll need to manually look over and the relevant Region (which is an indexed/searchable field).</li><li>If any freeform fields (location/title/suggested/etc.) were changed, check for misspelling. Remember to try use proper diacriticals (wehewehe.org is your friend).</li><li>If their URL was updated, make sure it works.</li></ul><p>Then move Status to Approved!"
  }</p>
  `;
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=Edge">
      <!--<![endif]-->
      <!--[if (gte mso 9)|(IE)]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <!--[if (gte mso 9)|(IE)]>
  <style type="text/css">
    body {width: 600px;margin: 0 auto;}
    table {border-collapse: collapse;}
    table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
    img {-ms-interpolation-mode: bicubic;}
  </style>
<![endif]-->
      <style type="text/css">
    body, p, div {
      font-family: arial,helvetica,sans-serif;
      font-size: 16px;
    }
    body {
      color: #000000;
    }
    body a {
      color: #fc7442;
      text-decoration: none;
    }
    p { margin: 0; padding: 0; }
    table.wrapper {
      width:100% !important;
      table-layout: fixed;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img.max-width {
      max-width: 100% !important;
    }
    .column.of-2 {
      width: 50%;
    }
    .column.of-3 {
      width: 33.333%;
    }
    .column.of-4 {
      width: 25%;
    }
    ul ul ul ul  {
      list-style-type: disc !important;
    }
    ol ol {
      list-style-type: lower-roman !important;
    }
    ol ol ol {
      list-style-type: lower-latin !important;
    }
    ol ol ol ol {
      list-style-type: decimal !important;
    }
    @media screen and (max-width:480px) {
      .preheader .rightColumnContent,
      .footer .rightColumnContent {
        text-align: left !important;
      }
      .preheader .rightColumnContent div,
      .preheader .rightColumnContent span,
      .footer .rightColumnContent div,
      .footer .rightColumnContent span {
        text-align: left !important;
      }
      .preheader .rightColumnContent,
      .preheader .leftColumnContent {
        font-size: 80% !important;
        padding: 5px 0;
      }
      table.wrapper-mobile {
        width: 100% !important;
        table-layout: fixed;
      }
      img.max-width {
        height: auto !important;
        max-width: 100% !important;
      }
      a.bulletproof-button {
        display: block !important;
        width: auto !important;
        font-size: 80%;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .columns {
        width: 100% !important;
      }
      .column {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      .social-icon-column {
        display: inline-block !important;
      }
    }
  </style>
      <!--user entered Head Start--><!--End Head user entered-->
    </head>
    <body>
      <center class="wrapper" data-link-color="#fc7442" data-body-style="font-size:16px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#e5e5e5;">
        <div class="webkit">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#e5e5e5">
            <tr>
              <td valign="top" bgcolor="#e5e5e5" width="100%">
                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="100%">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <!--[if mso]>
    <center>
    <table><tr><td width="600">
  <![endif]-->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                      <tr>
                                        <td role="modules-container" style="padding:10px 20px 20px 20px; color:#000000; text-align:left;" bgcolor="#eee" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
    <tr>
      <td role="module-content">
        <p>${name}</p>
      </td>
    </tr>
  </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="0bd39e58-dc98-4e61-a26b-acbe84fe4b6a">
    <tbody>
      <tr>
        <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center"><img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="144" alt="" data-proportionally-constrained="true" data-responsive="false" src="http://cdn.mcauto-images-production.sendgrid.net/c3cb94bafc1ef987/5ff60b90-4257-4ae9-babb-697d189b2df0/240x231.png" height="139"></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="c1d45e49-e730-4fd9-b793-f7a2f302faa5" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:17px 0px 4px 0px; line-height:28px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 24px"><strong>${
          removeRequest ? "Removal Request from" : "New Request from"
        } ${name}</strong></span></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="80092f30-00f3-4bfe-9c91-43068e62e34d.1" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:2px 0px 6px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><strong>No forget, follow the checklist!</strong></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="086f81dc-ae1d-4d7c-80d1-6bb03ce3a889.2">
    <tbody>
      <tr>
        <td style="padding:0px 0px 10px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="0f0986bc-650a-4911-a3fe-9469a69a309e.1" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:4px 0px 12px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: left">
        ${MESSAGE_BODY}
        </div><div></div></div></td>
      </tr>
    </tbody>
  </table></td>
                                      </tr>
                                    </table>
                                    <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </center>
    </body>
  </html>
`;
};

export async function sendNewSubmissionEmail({
  airtableID,
  name,
  email,
  removeRequest,
}: NewSubmissionEmailProps) {
  SendGrid.sendMultiple({
    // to: ["hawaiiansintech@tellaho.com", "emmit.parubrub@gmail.com"],
    to: ["hawaiiansintech@tellaho.com"],
    from: {
      email: "aloha@hawaiiansintech.org",
      name: "Hawaiians in Tech",
    },
    subject: `New Request`,
    html: emailTemplate({
      airtableID: airtableID,
      name: name,
      email: email,
      removeRequest: removeRequest,
    }),
  });
}
