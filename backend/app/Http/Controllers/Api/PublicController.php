<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    /**
     * Get all website settings.
     */
    public function settings(): JsonResponse
    {
        $settings = WebsiteSetting::all();
        
        $keyed = [];
        foreach ($settings as $setting) {
            $keyed[$setting->key] = [
                'key' => $setting->key,
                'value_fr' => $setting->value_fr,
                'value_ar' => $setting->value_ar,
                'group' => $setting->group,
                'type' => $setting->type,
            ];
        }

        return response()->json($keyed);
    }

    /**
     * Get active categories.
     */
    public function categories(): JsonResponse
    {
        $categories = Category::where('is_active', true)
            ->withCount(['products' => function ($query) {
                $query->where('is_available', true);
            }])
            ->orderBy('order', 'asc')
            ->get();

        return response()->json($categories);
    }

    /**
     * Get active brands.
     */
    public function brands(): JsonResponse
    {
        $brands = Brand::where('is_active', true)
            ->withCount(['products' => function ($query) {
                $query->where('is_available', true);
            }])
            ->orderBy('name', 'asc')
            ->get();

        return response()->json($brands);
    }

    /**
     * Get products with filters and search.
     */
    public function products(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'brand', 'images', 'primaryImage']);

        // Filter by category slug or id
        if ($request->filled('category')) {
            $cat = $request->query('category');
            $query->whereHas('category', function ($q) use ($cat) {
                $q->where('slug', $cat)->orWhere('id', $cat);
            });
        }

        // Filter by brand slug or id
        if ($request->filled('brand')) {
            $brand = $request->query('brand');
            $query->whereHas('brand', function ($q) use ($brand) {
                $q->where('slug', $brand)->orWhere('id', $brand);
            });
        }

        // Filter by gender
        if ($request->filled('gender')) {
            $query->where('gender', strtolower($request->query('gender')));
        }

        // Filter by frame shape
        if ($request->filled('shape')) {
            $query->where('frame_shape', strtolower($request->query('shape')));
        }

        $driver = \DB::getDriverName();
        $likeOp = $driver === 'pgsql' ? 'ILIKE' : 'like';

        // Filter by color (json search)
        if ($request->filled('color')) {
            $color = strtolower($request->query('color'));
            $query->where(function ($q) use ($color, $likeOp) {
                $q->where('colors', $likeOp, "%{$color}%");
            });
        }

        // Filter by price range
        if ($request->filled('price_min')) {
            $query->where('price', '>=', (float) $request->query('price_min'));
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', (float) $request->query('price_max'));
        }

        // Filter by availability
        if ($request->has('is_available')) {
            $query->where('is_available', filter_var($request->query('is_available'), FILTER_VALIDATE_BOOLEAN));
        }

        // Filter by special flags
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }
        if ($request->boolean('new')) {
            $query->where('is_new', true);
        }
        if ($request->boolean('best_seller')) {
            $query->where('is_best_seller', true);
        }
        if ($request->boolean('promotions')) {
            $query->whereNotNull('old_price')->whereColumn('old_price', '>', 'price');
        }

        // Search query
        if ($request->filled('search')) {
            $search = trim($request->query('search'));
            $query->where(function ($q) use ($search, $likeOp) {
                $q->where('name_fr', $likeOp, "%{$search}%")
                  ->orWhere('name_ar', $likeOp, "%{$search}%")
                  ->orWhere('reference', $likeOp, "%{$search}%")
                  ->orWhere('description_fr', $likeOp, "%{$search}%")
                  ->orWhere('description_ar', $likeOp, "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->query('sort', 'featured');
        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'featured':
            default:
                $query->orderBy('is_featured', 'desc')
                      ->orderBy('created_at', 'desc');
                break;
        }

        $perPage = min((int) $request->query('per_page', 12), 48);
        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Get single product by slug or reference.
     */
    public function product(string $slug): JsonResponse
    {
        $product = Product::with(['category', 'brand', 'images'])
            ->where('slug', $slug)
            ->orWhere('reference', $slug)
            ->firstOrFail();

        // Increment view count
        $product->increment('views_count');

        // Related products in the same category or brand
        $related = Product::with(['category', 'brand', 'primaryImage', 'images'])
            ->where('id', '!=', $product->id)
            ->where('is_available', true)
            ->where(function ($q) use ($product) {
                $q->where('category_id', $product->category_id)
                  ->orWhere('brand_id', $product->brand_id);
            })
            ->take(4)
            ->get();

        return response()->json([
            'product' => $product,
            'related' => $related,
        ]);
    }

    /**
     * Get active promotions.
     */
    public function promotions(): JsonResponse
    {
        $promotions = Promotion::where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_date')
                  ->orWhere('start_date', '<=', now()->toDateString());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>=', now()->toDateString());
            })
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($promotions);
    }

    /**
     * Submit contact inquiry.
     */
    public function contact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:150',
            'subject' => 'nullable|string|max:200',
            'message' => 'required|string|max:2000',
            'product_reference' => 'nullable|string|max:100',
        ]);

        $message = ContactMessage::create($validated);

        return response()->json([
            'message' => 'Votre message a bien été envoyé. Notre équipe vous contactera dans les plus brefs délais.',
            'message_ar' => 'تم استلام رسالتكم بنجاح. سيتواصل معكم فريقنا في أقرب وقت ممكن.',
            'data' => $message,
        ], 201);
    }
}
