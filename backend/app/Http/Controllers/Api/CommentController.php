<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index($postId)
    {
        $post     = Post::findOrFail($postId);
        $comments = $post->comments()
            ->with('user')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $comments->map(fn($comment) => [
                'id'         => 'cmt_' . $comment->id,
                'body'       => $comment->body,
                'author'     => [
                    'id'       => 'usr_' . $comment->user->id,
                    'username' => $comment->user->name,
                ],
                'created_at' => $comment->created_at,
            ]),
        ]);
    }

    public function store(Request $request, $postId)
    {
        $post = Post::findOrFail($postId);

        $request->validate([
            'body' => 'required|string',
        ]);

        $comment = $post->comments()->create([
            'user_id' => $request->user()->id,
            'body'    => $request->body,
        ]);

        $comment->load('user');

        return response()->json([
            'success' => true,
            'data'    => [
                'id'         => 'cmt_' . $comment->id,
                'body'       => $comment->body,
                'author'     => [
                    'id'       => 'usr_' . $comment->user->id,
                    'username' => $comment->user->name,
                ],
                'created_at' => $comment->created_at,
            ],
        ], 201);
    }

    public function destroy(Request $request, $postId, $id)
    {
        $post    = Post::findOrFail($postId);
        $comment = $post->comments()->findOrFail($id);

        if ($comment->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted.',
        ]);
    }
}