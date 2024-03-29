import { MailDataToSend, MailDataToSendType } from "common";
import { Route, sendMail, AUTH_ERROR_MESSAGE } from "server";

export type SendMailPostResponse = undefined;

export type SendMailPostBody = MailDataToSendType;

export const postSendMailRoute = new Route<SendMailPostResponse>(
  "POST",
  "/send",
  async (req) => {
    const { user } = req.session;
    if (!user) return { status: "failed", message: AUTH_ERROR_MESSAGE };

    const body: SendMailPostBody = req.body;
    const attachments = req.files?.attachments;

    await sendMail(user, new MailDataToSend({ ...body }), attachments);

    return { status: "success" };
  }
);
