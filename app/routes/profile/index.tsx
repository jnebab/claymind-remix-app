import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import Container from "~/components/Container";
import { Post, getSession } from "~/session";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("posts")) {
    return session.get("posts");
  }
  return [];
}

export default function Profile() {
  const posts = useLoaderData();
  const navigate = useNavigate();

  return (
    <Container>
      <div tabIndex={0} role="region" className="w-[600px] mx-auto">
        <div className="w-full flex items-center justify-between mb-6">
          <h3 className="font-bold text-2xl">Posts</h3>
          <button onClick={() => navigate("/")}>New Post</button>
        </div>
        {posts && posts?.length > 0 ? (
          <table className="border border-gray-400 w-full">
            <thead>
              <tr>
                <th scope="col" className="px-4">
                  Title
                </th>
                <th scope="col" className="w-[300px] px-4">
                  Body
                </th>
                <th scope="col" className="px-4">
                  Username
                </th>
                <th scope="col" className="px-4">
                  Is Human
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post: Post) => {
                return (
                  <tr key={post.postId}>
                    <th scope="row" className="px-4">
                      {post.title}
                    </th>
                    <td className="w-[300px] px-4">{post.body}</td>
                    <td className="px-4">{post.username?.toLowerCase()}</td>
                    <td className="px-4">
                      {post.iAmHuman === "on" ? "Yes" : "No"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No posts at the moment.</p>
        )}
      </div>
    </Container>
  );
}
