<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * List products with admin search and filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'brand', 'images', 'primaryImage']);

        if ($request->filled('search')) {
            $search = trim($request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('name_fr', 'like', "%{$search}%")
                  ->orWhere('name_ar', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->query('brand_id'));
        }

        if ($request->has('is_available') && $request->query('is_available') !== '') {
            $query->where('is_available', filter_var($request->query('is_available'), FILTER_VALIDATE_BOOLEAN));
        }

        $products = $query->orderBy('id', 'desc')->paginate(15);

        return response()->json($products);
    }

    /**
     * Show single product for editing.
     */
    public function show(int $id): JsonResponse
    {
        $product = Product::with(['category', 'brand', 'images'])->findOrFail($id);

        return response()->json($product);
    }

    /**
     * Store a new product.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_fr' => 'required|string|max:200',
            'name_ar' => 'required|string|max:200',
            'reference' => 'required|string|max:100|unique:products,reference',
            'price' => 'required|numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'gender' => 'required|in:homme,femme,unisexe,enfant',
            'frame_shape' => 'required|string|max:100',
            'colors' => 'nullable|array',
            'specifications' => 'nullable|array',
            'is_available' => 'boolean',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'is_best_seller' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:5120',
            'image_urls' => 'nullable|array',
            'image_urls.*' => 'nullable|url',
        ]);

        $baseSlug = Str::slug($validated['name_fr']);
        $slug = $baseSlug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }
        $validated['slug'] = $slug;

        $product = Product::create($validated);

        // Handle uploaded image files
        $imageOrder = 0;
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => "/storage/{$path}",
                    'is_primary' => $imageOrder === 0,
                    'order' => $imageOrder++,
                ]);
            }
        }

        // Handle image URLs provided as array of strings
        if (!empty($validated['image_urls'])) {
            foreach ($validated['image_urls'] as $url) {
                if (!empty($url)) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $url,
                        'is_primary' => $imageOrder === 0,
                        'order' => $imageOrder++,
                    ]);
                }
            }
        }

        $product->load(['category', 'brand', 'images']);

        return response()->json([
            'message' => 'Produit créé avec succès. / تم إنشاء المنتج بنجاح.',
            'product' => $product,
        ], 201);
    }

    /**
     * Update an existing product.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name_fr' => 'required|string|max:200',
            'name_ar' => 'required|string|max:200',
            'reference' => "required|string|max:100|unique:products,reference,{$id}",
            'price' => 'required|numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'gender' => 'required|in:homme,femme,unisexe,enfant',
            'frame_shape' => 'required|string|max:100',
            'colors' => 'nullable|array',
            'specifications' => 'nullable|array',
            'is_available' => 'boolean',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'is_best_seller' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:5120',
            'image_urls' => 'nullable|array',
            'image_urls.*' => 'nullable|url',
        ]);

        // Keep slug in sync if name changed
        if ($product->name_fr !== $validated['name_fr']) {
            $baseSlug = Str::slug($validated['name_fr']);
            $slug = $baseSlug;
            $counter = 1;
            while (Product::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        $product->update($validated);

        // Add additional images if uploaded
        $highestOrder = (int) $product->images()->max('order');
        $hasPrimary = $product->images()->where('is_primary', true)->exists();

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('products', 'public');
                $highestOrder++;
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => "/storage/{$path}",
                    'is_primary' => ! $hasPrimary,
                    'order' => $highestOrder,
                ]);
                $hasPrimary = true;
            }
        }

        if (!empty($validated['image_urls'])) {
            foreach ($validated['image_urls'] as $url) {
                if (!empty($url)) {
                    $highestOrder++;
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $url,
                        'is_primary' => ! $hasPrimary,
                        'order' => $highestOrder,
                    ]);
                    $hasPrimary = true;
                }
            }
        }

        $product->load(['category', 'brand', 'images']);

        return response()->json([
            'message' => 'Produit mis à jour avec succès. / تم تحديث المنتج بنجاح.',
            'product' => $product,
        ]);
    }

    /**
     * Delete product and its images.
     */
    public function destroy(int $id): JsonResponse
    {
        $product = Product::with('images')->findOrFail($id);

        foreach ($product->images as $image) {
            if (Str::startsWith($image->image_url, '/storage/')) {
                $relative = Str::replaceFirst('/storage/', '', $image->image_url);
                Storage::disk('public')->delete($relative);
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Produit supprimé avec succès. / تم حذف المنتج بنجاح.'
        ]);
    }

    /**
     * Upload an image to a product.
     */
    public function uploadImage(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp,svg|max:5120',
            'is_primary' => 'nullable|boolean',
        ]);

        $path = $request->file('image')->store('products', 'public');
        $isPrimary = $request->boolean('is_primary') || $product->images()->count() === 0;

        if ($isPrimary) {
            $product->images()->update(['is_primary' => false]);
        }

        $image = ProductImage::create([
            'product_id' => $product->id,
            'image_url' => "/storage/{$path}",
            'is_primary' => $isPrimary,
            'order' => $product->images()->count() + 1,
        ]);

        return response()->json([
            'message' => 'Image téléversée.',
            'image' => $image,
        ], 201);
    }

    /**
     * Delete a single product image.
     */
    public function deleteImage(int $imageId): JsonResponse
    {
        $image = ProductImage::findOrFail($imageId);
        $productId = $image->product_id;
        $wasPrimary = $image->is_primary;

        if (Str::startsWith($image->image_url, '/storage/')) {
            $relative = Str::replaceFirst('/storage/', '', $image->image_url);
            Storage::disk('public')->delete($relative);
        }

        $image->delete();

        // If the deleted image was primary, promote the first remaining image
        if ($wasPrimary) {
            $first = ProductImage::where('product_id', $productId)->first();
            if ($first) {
                $first->update(['is_primary' => true]);
            }
        }

        return response()->json([
            'message' => 'Image supprimée avec succès.'
        ]);
    }

    /**
     * Set image as primary.
     */
    public function setPrimaryImage(int $imageId): JsonResponse
    {
        $image = ProductImage::findOrFail($imageId);

        ProductImage::where('product_id', $image->product_id)->update(['is_primary' => false]);
        $image->update(['is_primary' => true]);

        return response()->json([
            'message' => 'Image principale mise à jour.'
        ]);
    }
}
