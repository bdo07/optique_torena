<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PromotionController extends Controller
{
    public function index(): JsonResponse
    {
        $promotions = Promotion::orderBy('id', 'desc')->get();
        return response()->json($promotions);
    }

    public function show(int $id): JsonResponse
    {
        $promotion = Promotion::findOrFail($id);
        return response()->json($promotion);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title_fr' => 'required|string|max:200',
            'title_ar' => 'required|string|max:200',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'discount_percentage' => 'nullable|integer|min:1|max:100',
            'promotional_price' => 'nullable|numeric|min:0',
            'cta_text_fr' => 'nullable|string|max:100',
            'cta_text_ar' => 'nullable|string|max:100',
            'cta_link' => 'nullable|string|max:255',
            'banner_image_url' => 'nullable|string',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:5120',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('banner_image')) {
            $path = $request->file('banner_image')->store('promotions', 'public');
            $validated['banner_image_url'] = "/storage/{$path}";
        }

        $promotion = Promotion::create($validated);

        return response()->json([
            'message' => 'Promotion créée avec succès. / تم إنشاء العرض بنجاح.',
            'promotion' => $promotion,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $promotion = Promotion::findOrFail($id);

        $validated = $request->validate([
            'title_fr' => 'required|string|max:200',
            'title_ar' => 'required|string|max:200',
            'description_fr' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'discount_percentage' => 'nullable|integer|min:1|max:100',
            'promotional_price' => 'nullable|numeric|min:0',
            'cta_text_fr' => 'nullable|string|max:100',
            'cta_text_ar' => 'nullable|string|max:100',
            'cta_link' => 'nullable|string|max:255',
            'banner_image_url' => 'nullable|string',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:5120',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('banner_image')) {
            if ($promotion->banner_image_url && Str::startsWith($promotion->banner_image_url, '/storage/')) {
                Storage::disk('public')->delete(Str::replaceFirst('/storage/', '', $promotion->banner_image_url));
            }
            $path = $request->file('banner_image')->store('promotions', 'public');
            $validated['banner_image_url'] = "/storage/{$path}";
        }

        $promotion->update($validated);

        return response()->json([
            'message' => 'Promotion mise à jour. / تم تحديث العرض بنجاح.',
            'promotion' => $promotion,
        ]);
    }

    public function toggle(int $id): JsonResponse
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->update(['is_active' => ! $promotion->is_active]);

        return response()->json([
            'message' => 'Statut de la promotion modifié.',
            'is_active' => $promotion->is_active,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $promotion = Promotion::findOrFail($id);

        if ($promotion->banner_image_url && Str::startsWith($promotion->banner_image_url, '/storage/')) {
            Storage::disk('public')->delete(Str::replaceFirst('/storage/', '', $promotion->banner_image_url));
        }

        $promotion->delete();

        return response()->json([
            'message' => 'Promotion supprimée. / تم حذف العرض بنجاح.'
        ]);
    }
}
