<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name_fr');
            $table->string('name_ar');
            $table->string('slug')->unique();
            $table->string('reference')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('old_price', 10, 2)->nullable();
            $table->text('description_fr')->nullable();
            $table->text('description_ar')->nullable();
            
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained('brands')->nullOnDelete();
            
            $table->string('gender')->default('unisexe'); // homme, femme, unisexe, enfant
            $table->string('frame_shape')->default('rectangle'); // rond, carre, rectangle, aviateur, cat-eye, etc.
            $table->json('colors')->nullable();
            $table->json('specifications')->nullable();
            
            $table->boolean('is_available')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(false);
            $table->boolean('is_best_seller')->default(false);
            $table->unsignedInteger('views_count')->default(0);
            
            $table->timestamps();

            $table->index('category_id');
            $table->index('brand_id');
            $table->index('gender');
            $table->index('frame_shape');
            $table->index('price');
            $table->index('is_available');
            $table->index('is_featured');
            $table->index('is_new');
            $table->index('is_best_seller');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
