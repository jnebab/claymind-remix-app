import { json, type ActionArgs, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import Centered from "~/components/Container";
import FormGroup from "~/components/FormGroup";
import classNames from "classnames";
import { Post, commitSession, getSession } from "~/session";

type UserResponse = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
};

type Error = {
  type: "validation";
  title: string;
  body: string;
  username: string;
  iAmHuman: string;
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const username = formData.get("username");
  const iAmHuman = formData.get("iAmHuman");

  const errors = {} as Error;

  // validate the fields
  if (typeof title !== "string" || title.length === 0) {
    errors.title = "Please enter a title";
  }

  if (typeof body !== "string" || body.length === 0) {
    errors.body = "Please enter a body";
  }

  if (typeof username !== "string" || !username) {
    errors.username = "Please select a username";
  }

  if (typeof iAmHuman !== "string" || iAmHuman !== "on") {
    errors.iAmHuman = "Only humans are allowed to submit this form";
  }
  // console.log("errors: ", errors);
  // return data if we have errors
  if (Object.keys(errors).some(Boolean)) {
    console.log("errors: ", errors);
    return json(errors, { status: 400 });
  }

  const newPost = {
    postId: uuidv4(),
    title: `${title}`,
    body: `${body}`,
    username: `${username}`,
    iAmHuman: `${iAmHuman}`,
  } as Post;

  await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("posts")) {
    const posts = session.get("posts");
    if (posts && posts?.length > 0) {
      session.set("posts", [...posts, newPost]);
    }
  } else {
    session.set("posts", [newPost]);
  }

  return redirect("/profile", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function loader() {
  return await fetch("https://jsonplaceholder.typicode.com/users").then((res) =>
    res.json()
  );
}

export default function Index() {
  const users = useLoaderData() as UserResponse[];
  const newPost = useFetcher();
  const isSubmitting = newPost?.state === "submitting" && !newPost?.data;

  return (
    <Centered>
      <newPost.Form
        method="post"
        className="w-full rounded-lg mx-auto max-w-xl border border-neutral-300 bg-white shadow-md p-5 flex flex-col gap-8"
      >
        <h1 className="text-2xl text-neutral-900 text-center font-bold uppercase">
          Create a Post
        </h1>
        <div className="flex flex-col gap-4">
          <FormGroup>
            <label htmlFor="title" className="flex gap-1 items-center">
              Title <Spinner visible={isSubmitting} />
            </label>
            <input
              type="text"
              id="title"
              name="title"
              autoComplete="none"
              autoCorrect="off"
              spellCheck="false"
              className="w-full h-11"
            />
            {newPost?.data?.title ? (
              <em className="text-red-500">{newPost?.data.title}</em>
            ) : null}
          </FormGroup>
          <FormGroup>
            <label htmlFor="body" className="flex gap-1 items-center">
              Body <Spinner visible={isSubmitting} />
            </label>
            <textarea
              id="body"
              name="body"
              rows={5}
              cols={31}
              className="border"
              autoComplete="none"
              autoCorrect="off"
              spellCheck="false"
            />
            {newPost?.data?.body ? (
              <em className="text-red-500">{newPost?.data?.body}</em>
            ) : null}
          </FormGroup>
          <FormGroup>
            <label htmlFor="title" className="flex gap-1 items-center">
              Username <Spinner visible={isSubmitting} />
            </label>
            <select className="w-full h-11" name="username">
              {users && users?.length > 0
                ? users?.map((user) => (
                    <option key={user.id} value={user.username}>
                      {user.username?.toLowerCase()}
                    </option>
                  ))
                : null}
            </select>
            {newPost?.data?.username ? (
              <em className="text-red-500">{newPost?.data?.username}</em>
            ) : null}
          </FormGroup>
          <FormGroup>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="iAmHuman"
                className="h-8 w-8"
                name="iAmHuman"
              />
              <label htmlFor="iAmHuman" className="flex gap-1 items-center">
                I am human <Spinner visible={isSubmitting} />
              </label>
            </div>
            {newPost?.data?.iAmHuman ? (
              <em className="text-red-500">{newPost?.data?.iAmHuman}</em>
            ) : null}
          </FormGroup>
        </div>
        <div className="flex justify-end">
          <button>{isSubmitting ? <Spinner visible /> : "Submit"}</button>
        </div>
      </newPost.Form>
    </Centered>
  );
}

export function SpinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} fill="none" {...props}>
      <path
        d="M12 4.75v1.5M17.127 6.873l-1.061 1.061M19.25 12h-1.5M17.127 17.127l-1.061-1.061M12 17.75v1.5M7.934 16.066l-1.06 1.06M6.25 12h-1.5M7.934 7.934l-1.06-1.06"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner({ visible }: { visible: boolean }) {
  return (
    <SpinnerIcon
      className={classNames("animate-spin transition-opacity", {
        "opacity-0": !visible,
        "opacity-100": visible,
      })}
    />
  );
}
