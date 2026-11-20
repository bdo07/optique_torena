<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class OptiqueTorenaApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed database
        $this->artisan('db:seed');
    }

    public function test_public_settings_endpoint_returns_data(): void
    {
        $response = $this->getJson('/api/settings');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'shop_name',
            'phone',
            'whatsapp_number',
            'announcement_enabled',
            'hero_title',
        ]);
    }

    public function test_public_categories_returns_active_categories(): void
    {
        $response = $this->getJson('/api/categories');
        $response->assertStatus(200);
        $response->assertJsonFragment(['slug' => 'lunettes-de-vue']);
    }

    public function test_public_products_list_and_filters(): void
    {
        $response = $this->getJson('/api/products?gender=homme');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'current_page',
            'total',
        ]);
    }

    public function test_public_single_product_by_slug(): void
    {
        $product = Product::first();
        $response = $this->getJson("/api/products/{$product->slug}");
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'product' => [
                'id',
                'name_fr',
                'name_ar',
                'reference',
                'price',
            ],
            'related',
        ]);
    }

    public function test_public_contact_inquiry_submission(): void
    {
        $response = $this->postJson('/api/contact', [
            'name' => 'Karim Benjelloun',
            'phone' => '+212612345678',
            'email' => 'karim@example.com',
            'subject' => 'Disponibilité monture Steve McQueen',
            'message' => 'Bonjour, avez-vous la monture en boutique pour un essayage demain ?',
            'product_reference' => 'PER-0714',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Karim Benjelloun',
            'product_reference' => 'PER-0714',
        ]);
    }

    public function test_admin_routes_are_protected(): void
    {
        $response = $this->getJson('/api/admin/stats');
        $response->assertStatus(401);
    }

    public function test_admin_login_and_access_dashboard(): void
    {
        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@optiquetorena.ma',
            'password' => 'TorenaAdmin2026!',
        ]);

        $response->assertStatus(200);
        $token = $response->json('token');
        $this->assertNotEmpty($token);

        // Access protected route with Bearer token
        $statsResponse = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->getJson('/api/admin/stats');

        $statsResponse->assertStatus(200);
        $statsResponse->assertJsonStructure([
            'stats' => [
                'total_products',
                'available_products',
                'out_of_stock',
                'featured_products',
            ],
        ]);
    }

    public function test_admin_can_create_product(): void
    {
        $admin = User::where('is_admin', true)->first();
        $token = $admin->createToken('test-token')->plainTextToken;

        $category = Category::first();
        $brand = Brand::first();

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->postJson('/api/admin/products', [
            'name_fr' => 'Test Monture Luxe',
            'name_ar' => 'إطار فاخر للتجربة',
            'reference' => 'TEST-9999',
            'price' => 1950.00,
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'gender' => 'unisexe',
            'frame_shape' => 'pantoo',
            'colors' => ['Noir', 'Doré'],
            'specifications' => [
                'material' => 'Acétate & Titane',
                'lens' => 'Anti-reflet',
                'dimensions' => '50 □ 20 - 145 mm',
                'origin' => 'Italie',
            ],
            'description_fr' => 'Description test',
            'description_ar' => 'وصف تجريبي',
            'is_available' => true,
            'is_featured' => true,
            'is_new' => true,
            'is_best_seller' => false,
            'image_urls' => ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80'],
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('products', [
            'reference' => 'TEST-9999',
            'price' => 1950.00,
            'frame_shape' => 'pantoo',
        ]);
        $productId = $response->json('product.id');

        // Test Update
        $updateResp = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->putJson("/api/admin/products/{$productId}", [
            'name_fr' => 'Test Monture Luxe Modifiée',
            'name_ar' => 'إطار فاخر معدل',
            'reference' => 'TEST-9999',
            'price' => 1850.00,
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'gender' => 'homme',
            'frame_shape' => 'pantoo',
            'colors' => ['Noir'],
            'is_available' => true,
        ]);
        $updateResp->assertStatus(200);
        $this->assertDatabaseHas('products', [
            'id' => $productId,
            'name_fr' => 'Test Monture Luxe Modifiée',
            'price' => 1850.00,
        ]);

        // Test Delete (clean-up)
        $deleteResp = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->deleteJson("/api/admin/products/{$productId}");
        $deleteResp->assertStatus(200);
        $this->assertDatabaseMissing('products', ['id' => $productId]);
    }

    public function test_admin_category_and_brand_crud(): void
    {
        $admin = User::where('is_admin', true)->first();
        $token = $admin->createToken('test-token')->plainTextToken;

        // Category CRUD
        $catResp = $this->withHeaders(['Authorization' => "Bearer {$token}"])
            ->postJson('/api/admin/categories', [
                'name_fr' => 'Catégorie Test',
                'name_ar' => 'فئة تجريبية',
                'description_fr' => 'Test desc',
                'is_active' => true,
            ]);
        $catResp->assertStatus(201);
        $catId = $catResp->json('category.id');

        $this->withHeaders(['Authorization' => "Bearer {$token}"])
            ->deleteJson("/api/admin/categories/{$catId}")
            ->assertStatus(200);

        // Brand CRUD
        $brandResp = $this->withHeaders(['Authorization' => "Bearer {$token}"])
            ->postJson('/api/admin/brands', [
                'name' => 'Brand Test Torena',
                'is_active' => true,
            ]);
        $brandResp->assertStatus(201);
        $brandId = $brandResp->json('brand.id');

        $this->withHeaders(['Authorization' => "Bearer {$token}"])
            ->deleteJson("/api/admin/brands/{$brandId}")
            ->assertStatus(200);
    }

    public function test_admin_promotions_crud_and_toggle(): void
    {
        $admin = User::where('is_admin', true)->first();
        $token = $admin->createToken('test-token')->plainTextToken;

        $promoResp = $this->withHeaders(['Authorization' => "Bearer {$token}"])
            ->postJson('/api/admin/promotions', [
                'title_fr' => 'Promo Ete Torena',
                'title_ar' => 'عرض الصيف تورينار',
                'discount_percentage' => 30,
                'promotional_price' => 890.00,
                'start_date' => '2026-06-01',
                'end_date' => '2026-08-31',
                'is_active' => true,
            ]);
        $promoResp->assertStatus(201);
        $promoId = $promoResp->json('promotion.id');

        // Toggle
        $toggleResp = $this->withHeaders(['Authorization' => "Bearer {$token}"])
            ->patchJson("/api/admin/promotions/{$promoId}/toggle");
        $toggleResp->assertStatus(200);

        // Delete clean-up
        $this->withHeaders(['Authorization' => "Bearer {$token}"])
            ->deleteJson("/api/admin/promotions/{$promoId}")
            ->assertStatus(200);
    }

    public function test_admin_settings_update_and_public_reflection(): void
    {
        $admin = User::where('is_admin', true)->first();
        $token = $admin->createToken('test-token')->plainTextToken;

        $updResp = $this->withHeaders(['Authorization' => "Bearer {$token}"])
            ->postJson('/api/admin/settings', [
                'settings' => [
                    'announcement_text' => [
                        'value_fr' => 'Nouvelle collection Torena 2026 disponible',
                        'value_ar' => 'تشكيلة جديدة تورينا 2026 متوفرة الآن',
                    ],
                    'phone' => [
                        'value_fr' => '+212 5 22 11 22 33',
                        'value_ar' => '+212 5 22 11 22 33',
                    ],
                ],
            ]);
        $updResp->assertStatus(200);

        // Verify public API returns new values
        $pubResp = $this->getJson('/api/settings');
        $pubResp->assertStatus(200);
        $this->assertEquals('Nouvelle collection Torena 2026 disponible', $pubResp->json('announcement_text.value_fr'));
        $this->assertEquals('+212 5 22 11 22 33', $pubResp->json('phone.value_fr'));
    }

    public function test_admin_logout_revokes_token(): void
    {
        $loginResp = $this->postJson('/api/admin/login', [
            'email' => 'admin@optiquetorena.ma',
            'password' => 'TorenaAdmin2026!',
        ]);
        $token = $loginResp->json('token');

        // Verify valid
        $this->withHeaders(['Authorization' => "Bearer {$token}"])
            ->getJson('/api/admin/stats')
            ->assertStatus(200);

        // Logout
        $logoutResp = $this->withHeaders(['Authorization' => "Bearer {$token}"])
            ->postJson('/api/admin/logout');
        $logoutResp->assertStatus(200);

        // Flush guard caches to verify token revocation
        $this->app['auth']->forgetGuards();
        \Illuminate\Support\Facades\Auth::forgetGuards();

        // Verify revoked
        $this->withHeaders(['Authorization' => "Bearer {$token}"])
            ->getJson('/api/admin/stats')
            ->assertStatus(401);
    }
}
