<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\TagController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Public routes — no token needed
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
    });

    Route::get('posts',                           [PostController::class,   'index']);
    Route::get('posts/{id}',                      [PostController::class,   'show']);
    Route::get('posts/{postId}/comments',         [CommentController::class,'index']);
    Route::get('tags',                            [TagController::class,    'index']);

    // Protected routes — must send valid token
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('auth/me',                         [AuthController::class,   'me']);
        Route::post('auth/logout',                    [AuthController::class,   'logout']);

        Route::post('posts',                          [PostController::class,   'store']);
        Route::put('posts/{id}',                      [PostController::class,   'update']);
        Route::delete('posts/{id}',                   [PostController::class,   'destroy']);

        Route::post('posts/{postId}/comments',        [CommentController::class,'store']);
        Route::delete('posts/{postId}/comments/{id}', [CommentController::class,'destroy']);

        Route::post('tags',                           [TagController::class,    'store']);
    });
});