export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface Endpoint {
  id: string;
  method: HttpMethod;
  path: string;
  title: string;
  description: string;
  group: string;
  requestBody?: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  response: string;
}

const endpoints: Endpoint[] = [
  // Auth
  {
    id: "auth-register",
    group: "Auth",
    method: "POST",
    path: "/api/v1/auth/register",
    title: "Register",
    description: "Create a new user account. Returns the created user object and an access token for immediate authentication.",
    requestBody: JSON.stringify({ username: "johndoe", email: "john@example.com", password: "s3cur3P@ss!" }, null, 2),
    response: JSON.stringify({
      success: true,
      data: {
        user: { id: "usr_a1b2c3d4", username: "johndoe", email: "john@example.com", created_at: "2025-03-24T10:00:00Z" },
        token: "eyJhbGciOiJIUzI1NiIs..."
      }
    }, null, 2),
  },
  {
    id: "auth-login",
    group: "Auth",
    method: "POST",
    path: "/api/v1/auth/login",
    title: "Login",
    description: "Authenticate with email and password. Returns a JWT access token valid for 24 hours.",
    requestBody: JSON.stringify({ email: "john@example.com", password: "s3cur3P@ss!" }, null, 2),
    response: JSON.stringify({
      success: true,
      data: { token: "eyJhbGciOiJIUzI1NiIs...", expires_in: 86400 }
    }, null, 2),
  },
  {
    id: "auth-me",
    group: "Auth",
    method: "GET",
    path: "/api/v1/auth/me",
    title: "Get Current User",
    description: "Retrieve the authenticated user's profile. Requires a valid Bearer token in the Authorization header.",
    response: JSON.stringify({
      success: true,
      data: { id: "usr_a1b2c3d4", username: "johndoe", email: "john@example.com", avatar_url: null, created_at: "2025-03-24T10:00:00Z" }
    }, null, 2),
  },

  // Posts
  {
    id: "posts-list",
    group: "Posts",
    method: "GET",
    path: "/api/v1/posts",
    title: "List Posts",
    description: "Retrieve a paginated list of posts. Supports filtering by tag, author, and full-text search via query parameters.",
    params: [
      { name: "page", type: "integer", required: false, description: "Page number (default: 1)" },
      { name: "limit", type: "integer", required: false, description: "Items per page (default: 20, max: 100)" },
      { name: "tag", type: "string", required: false, description: "Filter by tag slug" },
    ],
    response: JSON.stringify({
      success: true,
      data: [
        { id: "pst_x9y8z7", title: "Getting Started with REST APIs", slug: "getting-started-rest-apis", excerpt: "A comprehensive guide...", author: { id: "usr_a1b2c3d4", username: "johndoe" }, tags: ["api", "tutorial"], created_at: "2025-03-20T14:30:00Z" }
      ],
      meta: { page: 1, limit: 20, total: 47 }
    }, null, 2),
  },
  {
    id: "posts-create",
    group: "Posts",
    method: "POST",
    path: "/api/v1/posts",
    title: "Create Post",
    description: "Create a new post. Requires authentication. The body field supports Markdown formatting.",
    requestBody: JSON.stringify({ title: "My New Post", body: "# Hello World\n\nThis is **markdown** content.", tags: ["tutorial", "api"] }, null, 2),
    response: JSON.stringify({
      success: true,
      data: { id: "pst_n3w1d5", title: "My New Post", slug: "my-new-post", body: "# Hello World\n\nThis is **markdown** content.", tags: ["tutorial", "api"], created_at: "2025-03-24T12:00:00Z" }
    }, null, 2),
  },
  {
    id: "posts-update",
    group: "Posts",
    method: "PUT",
    path: "/api/v1/posts/:id",
    title: "Update Post",
    description: "Update an existing post by ID. Only the post author or an admin can perform this action.",
    params: [{ name: "id", type: "string", required: true, description: "Post ID" }],
    requestBody: JSON.stringify({ title: "Updated Title", body: "Updated content." }, null, 2),
    response: JSON.stringify({
      success: true,
      data: { id: "pst_x9y8z7", title: "Updated Title", body: "Updated content.", updated_at: "2025-03-24T13:00:00Z" }
    }, null, 2),
  },
  {
    id: "posts-delete",
    group: "Posts",
    method: "DELETE",
    path: "/api/v1/posts/:id",
    title: "Delete Post",
    description: "Permanently delete a post. This action cannot be undone. Requires author or admin privileges.",
    params: [{ name: "id", type: "string", required: true, description: "Post ID" }],
    response: JSON.stringify({ success: true, message: "Post deleted successfully." }, null, 2),
  },

  // Comments
  {
    id: "comments-list",
    group: "Comments",
    method: "GET",
    path: "/api/v1/posts/:postId/comments",
    title: "List Comments",
    description: "Retrieve all comments for a specific post, ordered by creation date (newest first).",
    params: [{ name: "postId", type: "string", required: true, description: "Parent post ID" }],
    response: JSON.stringify({
      success: true,
      data: [
        { id: "cmt_q1w2e3", body: "Great article!", author: { id: "usr_f5g6h7", username: "janedoe" }, created_at: "2025-03-21T09:15:00Z" }
      ]
    }, null, 2),
  },
  {
    id: "comments-create",
    group: "Comments",
    method: "POST",
    path: "/api/v1/posts/:postId/comments",
    title: "Add Comment",
    description: "Add a comment to a post. Requires authentication. Comments support plain text only.",
    params: [{ name: "postId", type: "string", required: true, description: "Parent post ID" }],
    requestBody: JSON.stringify({ body: "This is a great post, thanks for sharing!" }, null, 2),
    response: JSON.stringify({
      success: true,
      data: { id: "cmt_r4t5y6", body: "This is a great post, thanks for sharing!", author: { id: "usr_a1b2c3d4", username: "johndoe" }, created_at: "2025-03-24T14:00:00Z" }
    }, null, 2),
  },
  {
    id: "comments-delete",
    group: "Comments",
    method: "DELETE",
    path: "/api/v1/posts/:postId/comments/:id",
    title: "Delete Comment",
    description: "Remove a comment from a post. Only the comment author or post author can delete comments.",
    params: [
      { name: "postId", type: "string", required: true, description: "Parent post ID" },
      { name: "id", type: "string", required: true, description: "Comment ID" },
    ],
    response: JSON.stringify({ success: true, message: "Comment deleted." }, null, 2),
  },

  // Tags
  {
    id: "tags-list",
    group: "Tags",
    method: "GET",
    path: "/api/v1/tags",
    title: "List Tags",
    description: "Retrieve all available tags with their post count. Results are sorted by popularity.",
    response: JSON.stringify({
      success: true,
      data: [
        { id: "tag_1", name: "API", slug: "api", post_count: 23 },
        { id: "tag_2", name: "Tutorial", slug: "tutorial", post_count: 18 },
        { id: "tag_3", name: "JavaScript", slug: "javascript", post_count: 15 },
      ]
    }, null, 2),
  },
  {
    id: "tags-create",
    group: "Tags",
    method: "POST",
    path: "/api/v1/tags",
    title: "Create Tag",
    description: "Create a new tag. Requires admin privileges. Tag slugs are auto-generated from the name.",
    requestBody: JSON.stringify({ name: "GraphQL" }, null, 2),
    response: JSON.stringify({
      success: true,
      data: { id: "tag_4", name: "GraphQL", slug: "graphql", post_count: 0 }
    }, null, 2),
  },
];

export const groups = ["Auth", "Posts", "Comments", "Tags"] as const;
export default endpoints;
