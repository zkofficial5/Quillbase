<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::withCount('posts')
            ->orderByDesc('posts_count')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $tags->map(fn($tag) => [
                'id'         => 'tag_' . $tag->id,
                'name'       => $tag->name,
                'slug'       => $tag->slug,
                'post_count' => $tag->posts_count,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:tags',
        ]);

        $tag = Tag::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            'success' => true,
            'data'    => [
                'id'         => 'tag_' . $tag->id,
                'name'       => $tag->name,
                'slug'       => $tag->slug,
                'post_count' => 0,
            ],
        ], 201);
    }
}