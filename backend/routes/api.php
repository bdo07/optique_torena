<?php

use App\Http\Controllers\Api\Admin\BrandController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\ContactMessageController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\PromotionController;
use App\Http\Controllers\Api\Admin\SettingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/settings', [PublicController::class, 'settings']);
Route::get('/categories', [PublicController::class, 'categories']);
Route::get('/brands', [PublicController::class, 'brands']);
Route::get('/products', [PublicController::class, 'products']);
Route::get('/products/{slug}', [PublicController::class, 'product']);
Route::get('/promotions', [PublicController::class, 'promotions']);
Route::post('/contact', [PublicController::class, 'contact']);

/*
|--------------------------------------------------------------------------
| Admin Authentication
|--------------------------------------------------------------------------
*/
Route::post('/admin/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Admin Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/stats', [DashboardController::class, 'stats']);

    // Products Management
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::post('/products/{id}', [ProductController::class, 'update']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::post('/products/{id}/images', [ProductController::class, 'uploadImage']);
    Route::delete('/products/images/{imageId}', [ProductController::class, 'deleteImage']);
    Route::put('/products/images/{imageId}/primary', [ProductController::class, 'setPrimaryImage']);

    // Category Management
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::post('/categories/{id}', [CategoryController::class, 'update']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Brand Management
    Route::get('/brands', [BrandController::class, 'index']);
    Route::post('/brands', [BrandController::class, 'store']);
    Route::get('/brands/{id}', [BrandController::class, 'show']);
    Route::post('/brands/{id}', [BrandController::class, 'update']);
    Route::put('/brands/{id}', [BrandController::class, 'update']);
    Route::delete('/brands/{id}', [BrandController::class, 'destroy']);

    // Promotions Management
    Route::get('/promotions', [PromotionController::class, 'index']);
    Route::post('/promotions', [PromotionController::class, 'store']);
    Route::get('/promotions/{id}', [PromotionController::class, 'show']);
    Route::post('/promotions/{id}', [PromotionController::class, 'update']);
    Route::put('/promotions/{id}', [PromotionController::class, 'update']);
    Route::match(['put', 'patch'], '/promotions/{id}/toggle', [PromotionController::class, 'toggle']);
    Route::delete('/promotions/{id}', [PromotionController::class, 'destroy']);

    // Website Settings
    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'update']);
    Route::post('/upload', [SettingController::class, 'upload']);

    // Contact Messages
    Route::get('/messages', [ContactMessageController::class, 'index']);
    Route::put('/messages/{id}/read', [ContactMessageController::class, 'markAsRead']);
    Route::delete('/messages/{id}', [ContactMessageController::class, 'destroy']);
});
