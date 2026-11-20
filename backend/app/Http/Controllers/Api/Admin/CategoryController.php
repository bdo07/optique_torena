<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('products')->orderBy('order', 'asc')->get();
        return response()->json($categories);
    }

    public function show(int $id): JsonResponse
    {
        $category = Category::withCount('products')->findOrFail($id);
        return response()->json($category);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_fr' => 'required|string|max:150',
            'name_ar' => 'required|string|max:150',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'image_url' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:5120',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $baseSlug = Str::slug($validated['name_fr']);
        $slug = $baseSlug;
        $c = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$c}";
            $c++;
        }
        $validated['slug'] = $slug;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $validated['image_url'] = "/storage/{$path}";
        }

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Catégorie créée avec succès. / تم إنشاء الفئة بنجاح.',
            'category' => $category,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name_fr' => 'required|string|max:150',
            'name_ar' => 'required|string|max:150',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'image_url' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:5120',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        if ($category->name_fr !== $validated['name_fr']) {
            $baseSlug = Str::slug($validated['name_fr']);
            $slug = $baseSlug;
            $c = 1;
            while (Category::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = "{$baseSlug}-{$c}";
                $c++;
            }
            $validated['slug'] = $slug;
        }

        if ($request->hasFile('image')) {
            if ($category->image_url && Str::startsWith($category->image_url, '/storage/')) {
                Storage::disk('public')->delete(Str::replaceFirst('/storage/', '', $category->image_url));
            }
            $path = $request->file('image')->store('categories', 'public');
            $validated['image_url'] = "/storage/{$path}";
        }

        $category->update($validated);

        return response()->json([
            'message' => 'Catégorie mise à jour. / تم تحديث الفئة بنجاح.',
            'category' => $category,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        if ($category->image_url && Str::startsWith($category->image_url, '/storage/')) {
            Storage::disk('public')->delete(Str::replaceFirst('/storage/', '', $category->image_url));
        }

        $category->delete();

        return response()->json([
            'message' => 'Catégorie supprimée. / تم حذف الفئة بنجاح.'
        ]);
    }
}
