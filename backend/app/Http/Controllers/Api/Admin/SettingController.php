<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    /**
     * Get all website settings for the admin panel.
     */
    public function index(): JsonResponse
    {
        $settings = WebsiteSetting::orderBy('group')->get();

        $grouped = [];
        $keyed = [];
        foreach ($settings as $setting) {
            $grouped[$setting->group][] = $setting;
            $keyed[$setting->key] = [
                'value_fr' => $setting->value_fr,
                'value_ar' => $setting->value_ar,
                'type' => $setting->type,
                'group' => $setting->group,
            ];
        }

        return response()->json([
            'settings' => $settings,
            'grouped' => $grouped,
            'keyed' => $keyed,
        ]);
    }

    /**
     * Bulk update settings.
     */
    public function update(Request $request): JsonResponse
    {
        $items = $request->input('settings', []);

        foreach ($items as $key => $values) {
            $setting = WebsiteSetting::where('key', $key)->first();
            if ($setting) {
                if (is_array($values)) {
                    $setting->update([
                        'value_fr' => $values['value_fr'] ?? $setting->value_fr,
                        'value_ar' => $values['value_ar'] ?? $setting->value_ar,
                    ]);
                } else {
                    $setting->update([
                        'value_fr' => (string) $values,
                        'value_ar' => (string) $values,
                    ]);
                }
            } else {
                // If setting doesn't exist, create it
                if (is_array($values)) {
                    WebsiteSetting::create([
                        'key' => $key,
                        'value_fr' => $values['value_fr'] ?? null,
                        'value_ar' => $values['value_ar'] ?? null,
                        'group' => $values['group'] ?? 'general',
                        'type' => $values['type'] ?? 'text',
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Paramètres du site mis à jour avec succès. / تم حفظ الإعدادات بنجاح.'
        ]);
    }

    /**
     * Upload an image file for settings (logo, hero image, about image, etc.)
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,webp,svg,ico|max:5120',
            'folder' => 'nullable|string|in:branding,hero,about,settings',
        ]);

        $folder = $request->input('folder', 'settings');
        $path = $request->file('file')->store($folder, 'public');

        return response()->json([
            'url' => "/storage/{$path}",
            'message' => 'Fichier téléversé avec succès.',
        ]);
    }
}
