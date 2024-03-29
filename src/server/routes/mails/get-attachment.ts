import { AUTH_ERROR_MESSAGE, Route, getAttachment } from "server";

export const getAttachmentRoute = new Route<Buffer>(
  "GET",
  "/attachment/:id",
  async (req) => {
    const { user } = req.session;
    if (!user) return { status: "failed", message: AUTH_ERROR_MESSAGE };
    const attachment = await getAttachment(req.params.id);
    if (attachment === undefined) return { status: "failed" };
    return attachment;
  }
);
