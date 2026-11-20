<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('website_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value_fr')->nullable();
            $table->text('value_ar')->nullable();
            $table->string('group')->default('general'); // announcement, hero, about, contact, social, seo
            $table->string('type')->default('text'); // text, textarea, boolean, color, image
            $table->string('description')->nullable();
            $table->timestamps();

            $table->index('group');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('website_settings');
    }
};
