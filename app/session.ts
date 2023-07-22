import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

export type Post = {
  postId: string;
  title: string;
  body: string;
  iAmHuman: string;
  username: string;
};
type SessionData = {
  posts: Post[];
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60,
      path: "/",
      sameSite: "lax",
      secrets: ["claym1nds3cr3t"],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
