<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Product;
use App\Models\Promotion;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Return admin overview statistics and recent items.
     */
    public function stats(): JsonResponse
    {
        $totalProducts = Product::count();
        $availableProducts = Product::where('is_available', true)->count();
        $outOfStockProducts = Product::where('is_available', false)->count();
        $featuredProducts = Product::where('is_featured', true)->count();
        $totalCategories = Category::count();
        $totalBrands = Brand::count();
        $activePromotions = Promotion::where('is_active', true)->count();
        $unreadMessages = ContactMessage::where('is_read', false)->count();

        // Recent products
        $recentProducts = Product::with(['category', 'brand', 'primaryImage'])
            ->orderBy('id', 'desc')
            ->take(5)
            ->get();

        // Recent contact messages
        $recentMessages = ContactMessage::orderBy('id', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_products' => $totalProducts,
                'available_products' => $availableProducts,
                'out_of_stock' => $outOfStockProducts,
                'featured_products' => $featuredProducts,
                'total_categories' => $totalCategories,
                'total_brands' => $totalBrands,
                'active_promotions' => $activePromotions,
                'unread_messages' => $unreadMessages,
            ],
            'recent_products' => $recentProducts,
            'recent_messages' => $recentMessages,
        ]);
    }
}
