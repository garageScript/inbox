import {
  Route,
  decrementBadgeCount,
  getMailBody,
  markRead,
  markSaved,
  AUTH_ERROR_MESSAGE
} from "server";

export type MarkMailPostResponse = undefined;

export interface MarkMailPostBody {
  mail_id: string;
  read?: boolean;
  save?: boolean;
}

export const postMarkMailRoute = new Route<MarkMailPostResponse>(
  "POST",
  "/mark",
  async (req) => {
    const { user } = req.session;
    if (!user) return { status: "failed", message: AUTH_ERROR_MESSAGE };

    const body: MarkMailPostBody = req.body;
    const { mail_id, read, save } = body;

    const mail = await getMailBody(user.id, mail_id);

    if (!mail) {
      return {
        status: "failed",
        message: "Invalid request. You may not manipulate other users' email"
      };
    }

    if (read === true) {
      decrementBadgeCount([user]).catch(console.error);
      await markRead(mail_id);
    }

    if (typeof save === "boolean") await markSaved(mail_id, save);

    return { status: "success" };
  }
);
