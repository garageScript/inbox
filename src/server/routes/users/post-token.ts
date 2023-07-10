import {
  Route,
  createAuthenticationMail,
  createToken,
  getUser,
  isValidEmail,
  sendMail,
  startTimer
} from "server";

export type TokenPostResponse = undefined;

export const postTokenRoute = new Route<TokenPostResponse>(
  "POST",
  "/token",
  async (req) => {
    const email = req.body.email as string;

    if (!isValidEmail(email)) {
      return {
        status: "failed",
        message: "Signup failed because email is invalid."
      };
    }

    const [adminUser, createdUser] = await Promise.all([
      getUser({ username: "admin" }),
      createToken(email)
    ]);

    if (!adminUser) throw new Error("Admin user does not exist.");
    const { id, username, token } = createdUser;

    const authenticationEamil = createAuthenticationMail(
      email,
      token,
      username
    );

    await sendMail(adminUser, authenticationEamil);

    startTimer(id);

    return { status: "success" };
  }
);
