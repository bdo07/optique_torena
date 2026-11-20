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
            'frame_shape' => 'rond',
            'colors' => ['Noir', 'Doré'],
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
        ]);
    }
}
