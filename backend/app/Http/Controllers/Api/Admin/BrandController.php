<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    public function index(): JsonResponse
    {
        $brands = Brand::withCount('products')->orderBy('name', 'asc')->get();
        return response()->json($brands);
    }

    public function show(int $id): JsonResponse
    {
        $brand = Brand::withCount('products')->findOrFail($id);
        return response()->json($brand);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150|unique:brands,name',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'logo_url' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:5120',
            'is_active' => 'boolean',
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $c = 1;
        while (Brand::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$c}";
            $c++;
        }
        $validated['slug'] = $slug;

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('brands', 'public');
            $validated['logo_url'] = "/storage/{$path}";
        }

        $brand = Brand::create($validated);

        return response()->json([
            'message' => 'Marque créée avec succès. / تم إنشاء العلامة التجارية بنجاح.',
            'brand' => $brand,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $brand = Brand::findOrFail($id);

        $validated = $request->validate([
            'name' => "required|string|max:150|unique:brands,name,{$id}",
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'logo_url' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:5120',
            'is_active' => 'boolean',
        ]);

        if ($brand->name !== $validated['name']) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $c = 1;
            while (Brand::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = "{$baseSlug}-{$c}";
                $c++;
            }
            $validated['slug'] = $slug;
        }

        if ($request->hasFile('logo')) {
            if ($brand->logo_url && Str::startsWith($brand->logo_url, '/storage/')) {
                Storage::disk('public')->delete(Str::replaceFirst('/storage/', '', $brand->logo_url));
            }
            $path = $request->file('logo')->store('brands', 'public');
            $validated['logo_url'] = "/storage/{$path}";
        }

        $brand->update($validated);

        return response()->json([
            'message' => 'Marque mise à jour. / تم تحديث العلامة التجارية بنجاح.',
            'brand' => $brand,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $brand = Brand::findOrFail($id);

        if ($brand->logo_url && Str::startsWith($brand->logo_url, '/storage/')) {
            Storage::disk('public')->delete(Str::replaceFirst('/storage/', '', $brand->logo_url));
        }

        $brand->delete();

        return response()->json([
            'message' => 'Marque supprimée. / تم حذف العلامة التجارية بنجاح.'
        ]);
    }
}
