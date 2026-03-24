<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['user', 'tags'])
            ->withCount('comments');

        if ($request->tag) {
            $query->whereHas('tags', fn($q) =>
                $q->where('slug', $request->tag)
            );
        }

        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $posts = $query->latest()->paginate($request->get('limit', 20));

        return response()->json([
            'success' => true,
            'data'    => $posts->map(fn($post) => [
                'id'             => 'pst_' . $post->id,
                'title'          => $post->title,
                'slug'           => $post->slug,
                'excerpt'        => $post->excerpt,
                'author'         => [
                    'id'       => 'usr_' . $post->user->id,
                    'username' => $post->user->name,
                ],
                'tags'           => $post->tags->pluck('slug'),
                'comments_count' => $post->comments_count,
                'created_at'     => $post->created_at,
            ]),
            'meta'    => [
                'page'  => $posts->currentPage(),
                'limit' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    public function show($id)
    {
        $post = Post::with(['user', 'tags'])->withCount('comments')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => [
                'id'             => 'pst_' . $post->id,
                'title'          => $post->title,
                'slug'           => $post->slug,
                'body'           => $post->body,
                'excerpt'        => $post->excerpt,
                'author'         => [
                    'id'       => 'usr_' . $post->user->id,
                    'username' => $post->user->name,
                ],
                'tags'           => $post->tags->pluck('slug'),
                'comments_count' => $post->comments_count,
                'created_at'     => $post->created_at,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
            'tags'  => 'array',
        ]);

        $post = $request->user()->posts()->create([
            'title' => $request->title,
            'body'  => $request->body,
            'slug'  => Str::slug($request->title),
        ]);

        if ($request->tags) {
            $tagIds = collect($request->tags)->map(function ($tagName) {
                return Tag::firstOrCreate(
                    ['slug' => Str::slug($tagName)],
                    ['name' => $tagName]
                )->id;
            });
            $post->tags()->sync($tagIds);
        }

        $post->load('tags');

        return response()->json([
            'success' => true,
            'data'    => [
                'id'         => 'pst_' . $post->id,
                'title'      => $post->title,
                'slug'       => $post->slug,
                'body'       => $post->body,
                'tags'       => $post->tags->pluck('slug'),
                'created_at' => $post->created_at,
            ],
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'body'  => 'sometimes|string',
        ]);

        if ($request->has('title')) {
            $post->title = $request->title;
            $post->slug  = Str::slug($request->title);
        }

        if ($request->has('body')) {
            $post->body    = $request->body;
            $post->excerpt = Str::limit(strip_tags($request->body), 150);
        }

        $post->save();
        $post->refresh();

        return response()->json([
            'success' => true,
            'data'    => [
                'id'         => 'pst_' . $post->id,
                'title'      => $post->title,
                'body'       => $post->body,
                'updated_at' => $post->updated_at,
            ],
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Post deleted successfully.',
        ]);
    }
}