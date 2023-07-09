import {
  AUTH_ERROR_MESSAGE,
  MailSearchResult,
  Route,
  searchMail
} from "server";

export type SearchGetResponse = MailSearchResult[];

export const getSearchRoute = new Route<SearchGetResponse>(
  "GET",
  "/search/:value",
  async (req) => {
    const { user } = req.session;
    if (!user) return { status: "failed", message: AUTH_ERROR_MESSAGE };

    const value = decodeURIComponent(req.params.value);
    const field = req.query.field as unknown as string | undefined;
    const { username } = user;
    const result = await searchMail(value, username, field);

    return { status: "success", body: result };
  }
);
