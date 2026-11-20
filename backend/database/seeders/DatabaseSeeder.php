<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Promotion;
use App\Models\User;
use App\Models\WebsiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin User
        $adminEmail = env('ADMIN_EMAIL', 'admin@optiquetorena.ma');
        $adminPassword = env('ADMIN_PASSWORD', 'TorenaAdmin2026!');
        
        User::firstOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'Optique Torena Admin',
                'password' => Hash::make($adminPassword),
                'is_admin' => true,
            ]
        );

        // 2. Categories
        $categories = [
            [
                'name_fr' => 'Lunettes de vue',
                'name_ar' => 'نظارات طبية',
                'slug' => 'lunettes-de-vue',
                'description_fr' => 'Montures optiques de créateurs associant finesse esthétique, légèreté et précision visuelle.',
                'description_ar' => 'إطارات طبية مصممة بعناية تجمع بين الأناقة الفائقة والراحة والدقة البصرية.',
                'image_url' => 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name_fr' => 'Lunettes de soleil',
                'name_ar' => 'نظارات شمسية',
                'slug' => 'lunettes-de-soleil',
                'description_fr' => 'Protection solaire 100% UV et verres polarisés haute performance au design intemporel.',
                'description_ar' => 'حماية كاملة من الأشعة فوق البنفسجية وعدسات مستقطبة عالية الأداء بتصاميم خالدة.',
                'image_url' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name_fr' => 'Protection écran',
                'name_ar' => 'حماية الشاشات',
                'slug' => 'protection-ecran',
                'description_fr' => 'Filtres anti-lumière bleue prévenant la fatigue oculaire lors des sessions de travail prolongées.',
                'description_ar' => 'عدسات حماية من الضوء الأزرق للحد من إجهاد العين خلال ساعات العمل الرقمية.',
                'image_url' => 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name_fr' => 'Lunettes de sport',
                'name_ar' => 'نظارات رياضية',
                'slug' => 'lunettes-de-sport',
                'description_fr' => 'Maintien infaillible, matériaux ultra-résistants et verres ventilés pour toutes vos activités.',
                'description_ar' => 'ثبات مثالي وخامات فائقة المتانة لجميع الأنشطة الرياضية الخارجية والداخلية.',
                'image_url' => 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name_fr' => 'Lunettes pour enfants',
                'name_ar' => 'نظارات للأطفال',
                'slug' => 'lunettes-pour-enfants',
                'description_fr' => 'Montures flexibles, incassables et ergonomiques spécialement conçues pour les plus jeunes.',
                'description_ar' => 'إطارات مرنة وغير قابلة للكسر ومريحة مصممة خصيصاً لتناسب حركة الأطفال.',
                'image_url' => 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'name_fr' => 'Accessoires',
                'name_ar' => 'إكسسوارات',
                'slug' => 'accessoires',
                'description_fr' => 'Étuis en cuir artisanal, cordons élégants et solutions de nettoyage professionnelles.',
                'description_ar' => 'علب جلدية فاخرة وسلاسل أنيقة ومحاليل تنظيف متخصصة للعناية بنظاراتكم.',
                'image_url' => 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?auto=format&fit=crop&w=800&q=80',
                'order' => 6,
                'is_active' => true,
            ],
        ];

        $categoryModels = [];
        foreach ($categories as $cat) {
            $categoryModels[$cat['slug']] = Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        // 3. Brands
        $brands = [
            [
                'name' => 'Torena Atelier',
                'slug' => 'torena-atelier',
                'logo_url' => null,
                'description_fr' => 'Notre collection maison exclusive conçue avec les meilleurs acétates italiens et titane japonais.',
                'description_ar' => 'مجموعتنا الحصرية المصنوعة يدوياً من أجود أنواع الأسيتات الإيطالي والتيتانيوم الياباني.',
                'is_active' => true,
            ],
            [
                'name' => 'Ray-Ban',
                'slug' => 'ray-ban',
                'logo_url' => null,
                'description_fr' => 'La référence historique des icônes Wayfarer, Aviator et Clubmaster.',
                'description_ar' => 'العلامة الأيقونية الأشهر في العالم بنماذجها التاريخية الخالدة.',
                'is_active' => true,
            ],
            [
                'name' => 'Persol',
                'slug' => 'persol',
                'logo_url' => null,
                'description_fr' => 'Artisanat d\'art italien légendaire et flèche distinctive Silver Arrow.',
                'description_ar' => 'رمز الحرفية الإيطالية الأصيلة والسهم الفضي الشهير.',
                'is_active' => true,
            ],
            [
                'name' => 'Tom Ford',
                'slug' => 'tom-ford',
                'logo_url' => null,
                'description_fr' => 'Élégance sophistiquée, finitions luxueuses et signature emblématique en T.',
                'description_ar' => 'قمة الفخامة والأناقة العصرية مع الحرف T المميز.',
                'is_active' => true,
            ],
            [
                'name' => 'Oliver Peoples',
                'slug' => 'oliver-peoples',
                'logo_url' => null,
                'description_fr' => 'Esthétique vintage raffinée, souci du détail et absence délibérée de logos visibles.',
                'description_ar' => 'تصاميم كلاسيكية راقية مستوحاة من كاليفورنيا بدون شعارات ظاهرة.',
                'is_active' => true,
            ],
            [
                'name' => 'Prada',
                'slug' => 'prada',
                'logo_url' => null,
                'description_fr' => 'Lignes avant-gardistes, géométrie audacieuse et raffinement contemporain.',
                'description_ar' => 'خطوط عصرية جريئة تجمع بين الابتكار والذوق الرفيع.',
                'is_active' => true,
            ],
        ];

        $brandModels = [];
        foreach ($brands as $b) {
            $brandModels[$b['slug']] = Brand::updateOrCreate(['slug' => $b['slug']], $b);
        }

        // 4. Products
        $productsData = [
            [
                'name_fr' => 'Torena Aurelia Pantos',
                'name_ar' => 'تورينا أوريليا بانتوس',
                'slug' => 'torena-aurelia-pantos',
                'reference' => 'TOR-8801',
                'price' => 1850.00,
                'old_price' => 2200.00,
                'category_id' => $categoryModels['lunettes-de-vue']->id,
                'brand_id' => $brandModels['torena-atelier']->id,
                'gender' => 'unisexe',
                'frame_shape' => 'rond',
                'colors' => ['Écaille miel', 'Noir mat', 'Ambre fumé'],
                'specifications' => [
                    'material' => 'Acétate Mazzucchelli 1849',
                    'lens_compatibility' => 'Unifocaux & Progressifs',
                    'dimensions' => '48-21-145 mm',
                    'weight' => '22 g',
                    'origin' => 'Fabriqué à la main en Italie',
                ],
                'is_available' => true,
                'is_featured' => true,
                'is_new' => true,
                'is_best_seller' => true,
                'description_fr' => 'Inspirée des modèles intellectuels des années 1950, la monture Aurelia sublime les traits avec son pont en trou de serrure et son acétate délicatement biseauté à la main. Idéale pour le port quotidien prolongé.',
                'description_ar' => 'مستوحاة من كلاسيكيات الخمسينيات، تتميز إطارات أوريليا بجسرها المميز وأسيتاتها المصقول يدوياً بعناية لراحة استثنائية طوال اليوم.',
                'images' => [
                    'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
                ]
            ],
            [
                'name_fr' => 'Persol 714 Steve McQueen Solaire',
                'name_ar' => 'بيرسول 714 ستيف ماكوين الشمسية',
                'slug' => 'persol-714-steve-mcqueen',
                'reference' => 'PER-0714',
                'price' => 3100.00,
                'old_price' => 3600.00,
                'category_id' => $categoryModels['lunettes-de-soleil']->id,
                'brand_id' => $brandModels['persol']->id,
                'gender' => 'homme',
                'frame_shape' => 'aviateur',
                'colors' => ['Havane clair', 'Noir classique'],
                'specifications' => [
                    'material' => 'Acétate pliable breveté & Métal Meflecto',
                    'lens' => 'Verres minéraux polarisés bleu cobalt',
                    'dimensions' => '54-21-140 mm',
                    'uv_protection' => 'Catégorie 3 - 100% UV400',
                    'origin' => 'Turin, Italie',
                ],
                'is_available' => true,
                'is_featured' => true,
                'is_new' => false,
                'is_best_seller' => true,
                'description_fr' => 'Le premier modèle de lunettes pliables au monde, rendu mythique par Steve McQueen. Système exclusif de pliage au niveau du pont et des branches pour une compacité remarquable sans compromis sur le style.',
                'description_ar' => 'أول نموذج قابل للطي في العالم والذي اشتهر به ستيف ماكوين، بنظام طي ميكانيكي متقن وعدسات بلورية مستقطبة لحماية فائقة.',
                'images' => [
                    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80',
                ]
            ],
            [
                'name_fr' => 'Oliver Peoples Gregory Peck Optique',
                'name_ar' => 'أوليفر بيبولز غريغوري بيك الطبية',
                'slug' => 'oliver-peoples-gregory-peck',
                'reference' => 'OP-1962',
                'price' => 2950.00,
                'old_price' => null,
                'category_id' => $categoryModels['lunettes-de-vue']->id,
                'brand_id' => $brandModels['oliver-peoples']->id,
                'gender' => 'unisexe',
                'frame_shape' => 'rond',
                'colors' => ['Raintree', 'Cocobolo', 'Cristal champagne'],
                'specifications' => [
                    'material' => 'Acétate premium sur mesure',
                    'bridge' => 'Pont rétro rétro-incurvé',
                    'dimensions' => '47-23-150 mm',
                    'weight' => '24 g',
                    'origin' => 'Fabriqué au Japon',
                ],
                'is_available' => true,
                'is_featured' => true,
                'is_new' => true,
                'is_best_seller' => false,
                'description_fr' => 'Fruit d\'une collaboration avec les ayants droit de Gregory Peck, cette monture célèbre le style immortel d\'Atticus Finch. Lignes harmonieuses et présence intellectuelle indéniable.',
                'description_ar' => 'تصميم كلاسيكي راقٍ مستوحى من الشخصية السينمائية الشهيرة، يتميز بجسر أنيق وتفاصيل متقنة تضفي هيبة وفخامة.',
                'images' => [
                    'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80',
                ]
            ],
            [
                'name_fr' => 'Tom Ford Snowdon Carré Solaire',
                'name_ar' => 'توم فورد سنودون المربعة الشمسية',
                'slug' => 'tom-ford-snowdon-carre',
                'reference' => 'TF-0237',
                'price' => 3400.00,
                'old_price' => 3900.00,
                'category_id' => $categoryModels['lunettes-de-soleil']->id,
                'brand_id' => $brandModels['tom-ford']->id,
                'gender' => 'homme',
                'frame_shape' => 'carre',
                'colors' => ['Noir brillant & Or', 'Écaille foncée'],
                'specifications' => [
                    'material' => 'Acétate haute densité & Insets plaqués or',
                    'lens' => 'Verres dégradés anti-reflet interne',
                    'dimensions' => '52-20-145 mm',
                    'uv_protection' => '100% Protection UVA/UVB',
                    'origin' => 'Italie',
                ],
                'is_available' => true,
                'is_featured' => false,
                'is_new' => false,
                'is_best_seller' => true,
                'description_fr' => 'Rendue célèbre dans la saga James Bond, la Snowdon incarne le charisme masculin par excellence avec ses proportions généreuses et son T doré emblématique.',
                'description_ar' => 'النموذج الشهير الذي ظهر في أفلام جيمس بوند، يمنح إطلالة ذكورية قوية مع لمسات ذهبية راقية تحمل توقيع توم فورد.',
                'images' => [
                    'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
                ]
            ],
            [
                'name_fr' => 'Torena Screen Shield Pro',
                'name_ar' => 'تورينا سكرين شيلد برو لحماية الشاشات',
                'slug' => 'torena-screen-shield-pro',
                'reference' => 'TOR-BLU40',
                'price' => 890.00,
                'old_price' => 1100.00,
                'category_id' => $categoryModels['protection-ecran']->id,
                'brand_id' => $brandModels['torena-atelier']->id,
                'gender' => 'unisexe',
                'frame_shape' => 'rectangle',
                'colors' => ['Noir titane', 'Bleu minuit', 'Gris acier'],
                'specifications' => [
                    'material' => 'Alliage Bêta-Titane ultra-léger',
                    'lens' => 'BlueFilter™ 420nm sans jaunissement',
                    'dimensions' => '51-18-142 mm',
                    'weight' => '14 g',
                    'origin' => 'Assemblage de précision Torena',
                ],
                'is_available' => true,
                'is_featured' => true,
                'is_new' => true,
                'is_best_seller' => true,
                'description_fr' => 'Pensée pour les professionnels connectés passant plus de 6 heures par jour sur écran. Filtre 99% de la lumière bleue nocive tout en préservant le rendu fidèle des couleurs.',
                'description_ar' => 'صممت للمحترفين ومستخدمي الشاشات الرقمية لساعات طويلة، تحجب الضوء الأزرق الضار مع الحفاظ على نقاء الألوان التام ووزن خفيف جداً.',
                'images' => [
                    'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1000&q=80',
                ]
            ],
            [
                'name_fr' => 'Ray-Ban Clubmaster Classic',
                'name_ar' => 'راي بان كلوب ماستر كلاسيك',
                'slug' => 'ray-ban-clubmaster-classic',
                'reference' => 'RB-3016',
                'price' => 1650.00,
                'old_price' => null,
                'category_id' => $categoryModels['lunettes-de-soleil']->id,
                'brand_id' => $brandModels['ray-ban']->id,
                'gender' => 'unisexe',
                'frame_shape' => 'rectangle',
                'colors' => ['Noir & Doré', 'Écaille & Doré'],
                'specifications' => [
                    'material' => 'Acétate et métal poli',
                    'lens' => 'Verres minéraux G-15 verts',
                    'dimensions' => '51-21-145 mm',
                    'uv_protection' => '100% UV Protection',
                    'origin' => 'Italie',
                ],
                'is_available' => true,
                'is_featured' => true,
                'is_new' => false,
                'is_best_seller' => true,
                'description_fr' => 'Le style rétro inimitable inspiré des années 50. La monture Clubmaster séduit intellectuels, artistes et créateurs par son équilibre parfait entre métal et acétate.',
                'description_ar' => 'تصميم ريترو لا يضاهى مستوحى من خمسينيات القرن الماضي، يجمع بتناغم ساحر بين المعدن المصقول والأسيتات الفاخر.',
                'images' => [
                    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80',
                ]
            ],
            [
                'name_fr' => 'Prada Symbole Cat-Eye Féminine',
                'name_ar' => 'برادا سيمبول عين القطة النسائية',
                'slug' => 'prada-symbole-cat-eye',
                'reference' => 'PRA-17WS',
                'price' => 3800.00,
                'old_price' => 4200.00,
                'category_id' => $categoryModels['lunettes-de-soleil']->id,
                'brand_id' => $brandModels['prada']->id,
                'gender' => 'femme',
                'frame_shape' => 'cat-eye',
                'colors' => ['Noir intense', 'Blanc craie', 'Écaille miel'],
                'specifications' => [
                    'material' => 'Acétate sculptural facetté',
                    'lens' => 'Verres teintés gris anthracite',
                    'dimensions' => '49-20-145 mm',
                    'uv_protection' => 'Protection UV 100%',
                    'origin' => 'Italie',
                ],
                'is_available' => true,
                'is_featured' => true,
                'is_new' => true,
                'is_best_seller' => true,
                'description_fr' => 'Design sculptural géométrique aux branches facettées arborant le triangle iconique Prada. Une pièce maîtresse de mode qui affirme votre personnalité.',
                'description_ar' => 'تصميم نحتي هندسي جذاب مع أذرع مضلعة تحمل مثلث برادا الأيقوني، قطعة فريدة تبرز أنوثتكِ وثقتكِ.',
                'images' => [
                    'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
                ]
            ],
            [
                'name_fr' => 'Torena Bambino Flex Enfant',
                'name_ar' => 'تورينا بامبينو فليكس للأطفال',
                'slug' => 'torena-bambino-flex',
                'reference' => 'TOR-KID02',
                'price' => 650.00,
                'old_price' => null,
                'category_id' => $categoryModels['lunettes-pour-enfants']->id,
                'brand_id' => $brandModels['torena-atelier']->id,
                'gender' => 'enfant',
                'frame_shape' => 'rond',
                'colors' => ['Bleu ciel & Marine', 'Rose poudré', 'Rouge vif'],
                'specifications' => [
                    'material' => 'Silicone médical & Polymère à mémoire de forme',
                    'hinge' => 'Charnières flexibles à 180° sans vis',
                    'dimensions' => '43-15-125 mm',
                    'weight' => '12 g',
                    'origin' => 'Conçu pour résister aux jeux d\'enfants',
                ],
                'is_available' => true,
                'is_featured' => false,
                'is_new' => true,
                'is_best_seller' => false,
                'description_fr' => 'Indestructible et ultra-confortable pour les enfants de 4 à 9 ans. Charnières brevetées sans pièces métalliques tranchantes et maintien parfait sur le nez.',
                'description_ar' => 'إطار مرن غير قابل للكسر ومريح للغاية للأطفال من سن 4 إلى 9 سنوات، بمفصلات آمنة بدون براغي معدنية حادة.',
                'images' => [
                    'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80',
                ]
            ],
            [
                'name_fr' => 'Torena Cuir Étui Artisanal & Kit Entretien',
                'name_ar' => 'حافظة تورينا الجلدية المصنوعة يدوياً مع طقم العناية',
                'slug' => 'torena-etui-cuir-artisanal',
                'reference' => 'TOR-ACC01',
                'price' => 380.00,
                'old_price' => 450.00,
                'category_id' => $categoryModels['accessoires']->id,
                'brand_id' => $brandModels['torena-atelier']->id,
                'gender' => 'unisexe',
                'frame_shape' => 'rectangle',
                'colors' => ['Cuir fauve naturel', 'Cuir noir grainé', 'Vert forêt'],
                'specifications' => [
                    'material' => 'Cuir véritable tannage végétal de Fès',
                    'interior' => 'Doublure velours suédé anti-rayures',
                    'included' => 'Spray optique 50ml + Microfibre micro-tissée',
                    'origin' => 'Fabriqué à la main au Maroc',
                ],
                'is_available' => true,
                'is_featured' => false,
                'is_new' => false,
                'is_best_seller' => true,
                'description_fr' => 'Confectionné par des maîtres artisans maroquiniers à Fès. Protège vos montures de valeur avec raffinement et inclut notre kit de nettoyage d\'atelier.',
                'description_ar' => 'مصنوع يدوياً على أيدي أمهر الحرفيين في فاس من الجلد الطبيعي الأصيل مع بطانة مخملية واقية وطقم تنظيف متكامل.',
                'images' => [
                    'https://images.unsplash.com/photo-1582142306909-195724d33ffc?auto=format&fit=crop&w=1000&q=80',
                ]
            ]
        ];

        foreach ($productsData as $pData) {
            $images = $pData['images'];
            unset($pData['images']);

            $product = Product::updateOrCreate(
                ['reference' => $pData['reference']],
                $pData
            );

            // Create product images
            ProductImage::where('product_id', $product->id)->delete();
            foreach ($images as $index => $imgUrl) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $imgUrl,
                    'is_primary' => $index === 0,
                    'order' => $index,
                ]);
            }
        }

        // 5. Promotions
        $promotions = [
            [
                'title_fr' => 'Offre Spéciale Solaire',
                'title_ar' => 'عرض خاص على النظارات الشمسية',
                'description_fr' => 'Bénéficiez de -20% sur une sélection de nos plus belles solaires créateurs.',
                'description_ar' => 'استفيدوا من خصم 20% على باقة مختارة من أرقى النظارات الشمسية العالمية.',
                'discount_percentage' => 20,
                'promotional_price' => null,
                'cta_text_fr' => 'Voir la sélection',
                'cta_text_ar' => 'عرض التشكيلة',
                'cta_link' => '/catalogue?category=lunettes-de-soleil',
                'banner_image_url' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
                'start_date' => now()->startOfMonth(),
                'end_date' => now()->addMonths(2)->endOfMonth(),
                'is_active' => true,
            ],
            [
                'title_fr' => 'Pack Vision Écran Pro',
                'title_ar' => 'باقة حماية الشاشات الاحترافية',
                'description_fr' => 'Monture anti-lumière bleue + étui en cuir artisanal offert pour tout achat.',
                'description_ar' => 'إطار مضاد للضوء الأزرق + حافظة جلدية فاخرة مهداة مع كل طلب.',
                'discount_percentage' => 15,
                'promotional_price' => null,
                'cta_text_fr' => 'Découvrir',
                'cta_text_ar' => 'اكتشف الباقة',
                'cta_link' => '/catalogue?category=protection-ecran',
                'banner_image_url' => 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80',
                'start_date' => now()->startOfMonth(),
                'end_date' => now()->addMonths(3)->endOfMonth(),
                'is_active' => true,
            ],
        ];

        foreach ($promotions as $promo) {
            Promotion::updateOrCreate(
                ['title_fr' => $promo['title_fr']],
                $promo
            );
        }

        // 6. Website Settings
        $settings = [
            // General
            [
                'key' => 'shop_name',
                'value_fr' => 'Optique Torena',
                'value_ar' => 'أوبتيك تورينا',
                'group' => 'general',
                'type' => 'text',
                'description' => 'Nom de la boutique / اسم المتجر',
            ],
            [
                'key' => 'shop_tagline',
                'value_fr' => 'Haute Lunetterie & Optique de Précision',
                'value_ar' => 'البصريات الراقية والنظارات الفاخرة',
                'group' => 'general',
                'type' => 'text',
                'description' => 'Slogan / الشعار',
            ],
            [
                'key' => 'shop_logo',
                'value_fr' => null,
                'value_ar' => null,
                'group' => 'general',
                'type' => 'image',
                'description' => 'Logo de la boutique / شعار المتجر',
            ],
            [
                'key' => 'shop_favicon',
                'value_fr' => null,
                'value_ar' => null,
                'group' => 'general',
                'type' => 'image',
                'description' => 'Favicon du site / أيقونة الموقع',
            ],
            [
                'key' => 'phone',
                'value_fr' => '+212 5 22 20 30 40',
                'value_ar' => '+212 5 22 20 30 40',
                'group' => 'contact',
                'type' => 'text',
                'description' => 'Numéro de téléphone / رقم الهاتف',
            ],
            [
                'key' => 'whatsapp_number',
                'value_fr' => '212661234567',
                'value_ar' => '212661234567',
                'group' => 'contact',
                'type' => 'text',
                'description' => 'Numéro WhatsApp (sans le +) / رقم الواتساب',
            ],
            [
                'key' => 'whatsapp_display',
                'value_fr' => '+212 6 61 23 45 67',
                'value_ar' => '+212 6 61 23 45 67',
                'group' => 'contact',
                'type' => 'text',
                'description' => 'Affichage WhatsApp / عرض رقم الواتساب',
            ],
            [
                'key' => 'email',
                'value_fr' => 'contact@optiquetorena.ma',
                'value_ar' => 'contact@optiquetorena.ma',
                'group' => 'contact',
                'type' => 'text',
                'description' => 'Email de contact / البريد الإلكتروني',
            ],
            [
                'key' => 'address',
                'value_fr' => '74 Boulevard d\'Anfa, Quartier Gauthier, Casablanca 20050, Maroc',
                'value_ar' => '74 شارع أنفا، حي غوتييه، الدار البيضاء 20050، المغرب',
                'group' => 'contact',
                'type' => 'textarea',
                'description' => 'Adresse physique / العنوان',
            ],
            [
                'key' => 'opening_hours',
                'value_fr' => 'Lundi au Samedi : 09:30 - 13:00 / 15:00 - 20:00 | Dimanche : Fermé',
                'value_ar' => 'من الإثنين إلى السبت : 09:30 - 13:00 / 15:00 - 20:00 | الأحد : مغلق',
                'group' => 'contact',
                'type' => 'textarea',
                'description' => 'Horaires d\'ouverture / أوقات العمل',
            ],
            [
                'key' => 'google_maps_url',
                'value_fr' => 'https://maps.google.com/?q=Casablanca+Gauthier',
                'value_ar' => 'https://maps.google.com/?q=Casablanca+Gauthier',
                'group' => 'contact',
                'type' => 'text',
                'description' => 'Lien Google Maps / رابط خرائط جوجل',
            ],
            [
                'key' => 'instagram_url',
                'value_fr' => 'https://instagram.com/optiquetorena',
                'value_ar' => 'https://instagram.com/optiquetorena',
                'group' => 'social',
                'type' => 'text',
                'description' => 'Lien Instagram / رابط إنستغرام',
            ],
            [
                'key' => 'facebook_url',
                'value_fr' => 'https://facebook.com/optiquetorena',
                'value_ar' => 'https://facebook.com/optiquetorena',
                'group' => 'social',
                'type' => 'text',
                'description' => 'Lien Facebook / رابط فيسبوك',
            ],

            // Promotional Announcement Bar
            [
                'key' => 'announcement_enabled',
                'value_fr' => '1',
                'value_ar' => '1',
                'group' => 'announcement',
                'type' => 'boolean',
                'description' => 'Activer la barre d\'annonce / تفعيل شريط الإعلانات',
            ],
            [
                'key' => 'announcement_text',
                'value_fr' => 'Offre spéciale : -20% sur une sélection de montures solaires et optiques',
                'value_ar' => 'عرض خاص : خصم 20% على تشكيلة مختارة من النظارات الطبية والشمسية',
                'group' => 'announcement',
                'type' => 'text',
                'description' => 'Texte de l\'annonce / نص الإعلان',
            ],
            [
                'key' => 'announcement_cta',
                'value_fr' => 'Découvrir',
                'value_ar' => 'اكتشف الآن',
                'group' => 'announcement',
                'type' => 'text',
                'description' => 'Texte du bouton CTA / نص زر الدعوة للعمل',
            ],
            [
                'key' => 'announcement_link',
                'value_fr' => '/catalogue',
                'value_ar' => '/catalogue',
                'group' => 'announcement',
                'type' => 'text',
                'description' => 'Lien de l\'annonce / رابط الإعلان',
            ],
            [
                'key' => 'announcement_bg_color',
                'value_fr' => '#35483B',
                'value_ar' => '#35483B',
                'group' => 'announcement',
                'type' => 'color',
                'description' => 'Couleur d\'arrière-plan / لون الخلفية',
            ],
            [
                'key' => 'announcement_text_color',
                'value_fr' => '#FAFAF8',
                'value_ar' => '#FAFAF8',
                'group' => 'announcement',
                'type' => 'color',
                'description' => 'Couleur du texte / لون النص',
            ],
            [
                'key' => 'announcement_expires_at',
                'value_fr' => null,
                'value_ar' => null,
                'group' => 'announcement',
                'type' => 'date',
                'description' => 'Date d\'expiration de l\'annonce / تاريخ انتهاء الإعلان',
            ],

            // Hero Section
            [
                'key' => 'hero_title',
                'value_fr' => 'Votre vision, votre style.',
                'value_ar' => 'رؤيتكم، أناقتكم.',
                'group' => 'hero',
                'type' => 'text',
                'description' => 'Titre Hero / العنوان الرئيسي',
            ],
            [
                'key' => 'hero_subtitle',
                'value_fr' => 'Découvrez notre collection de lunettes alliant élégance, confort et qualité.',
                'value_ar' => 'اكتشفوا تشكيلتنا الحصرية من النظارات التي تجمع بين الأناقة الخالدة والراحة التامة والجودة الفائقة.',
                'group' => 'hero',
                'type' => 'textarea',
                'description' => 'Sous-titre Hero / العنوان الفرعي',
            ],
            [
                'key' => 'hero_image',
                'value_fr' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1920&q=80',
                'value_ar' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1920&q=80',
                'group' => 'hero',
                'type' => 'image',
                'description' => 'Image Hero / صورة الواجهة',
            ],
            [
                'key' => 'hero_cta_primary',
                'value_fr' => 'Découvrir la collection',
                'value_ar' => 'استكشف التشكيلة',
                'group' => 'hero',
                'type' => 'text',
                'description' => 'Bouton principal / الزر الرئيسي',
            ],
            [
                'key' => 'hero_cta_secondary',
                'value_fr' => 'Nous contacter',
                'value_ar' => 'تواصل معنا',
                'group' => 'hero',
                'type' => 'text',
                'description' => 'Bouton secondaire / الزر الفرعي',
            ],

            // About Section
            [
                'key' => 'about_title',
                'value_fr' => 'L\'excellence optique au service de votre regard',
                'value_ar' => 'التميز في البصريات لخدمة بصركم وأناقتكم',
                'group' => 'about',
                'type' => 'text',
                'description' => 'Titre de la section À propos / عنوان من نحن',
            ],
            [
                'key' => 'about_text_p1',
                'value_fr' => 'Située au cœur de Casablanca, Optique Torena incarne une vision contemporaine de l\'optique traditionnelle : allier l\'exigence technique de l\'optométrie médicale au raffinement d\'une boutique de haute lunetterie.',
                'value_ar' => 'تقع أوبتيك تورينا في قلب الدار البيضاء، وتجسد رؤية معاصرة للبصريات التقليدية: الجمع بين الدقة التقنية لطب البصريات وأناقة بوتيك النظارات الراقية.',
                'group' => 'about',
                'type' => 'textarea',
                'description' => 'Paragraphe 1 / الفقرة الأولى',
            ],
            [
                'key' => 'about_text_p2',
                'value_fr' => 'Nous sélectionnons nos montures parmi les plus prestigieuses manufactures mondiales et façonnons notre propre ligne avec des acétates nobles italiens et des métaux légers en titane.',
                'value_ar' => 'نختار إطاراتنا من أعرق دور التصميم العالمية ونصنع مجموعتنا الخاصة بأجود خامات الأسيتات الإيطالي وتيتانيوم خفيف الوزن.',
                'group' => 'about',
                'type' => 'textarea',
                'description' => 'Paragraphe 2 / الفقرة الثانية',
            ],
            [
                'key' => 'about_image',
                'value_fr' => 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80',
                'value_ar' => 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80',
                'group' => 'about',
                'type' => 'image',
                'description' => 'Image À propos / صورة من نحن',
            ],

            // SEO
            [
                'key' => 'seo_title',
                'value_fr' => 'Optique Torena | Lunettes de Vue, Solaires & Optométrie au Maroc',
                'value_ar' => 'أوبتيك تورينا | نظارات طبية، شمسية وبصريات دقيقة بالمغرب',
                'group' => 'seo',
                'type' => 'text',
                'description' => 'Meta Title / عنوان الصفحة لمحركات البحث',
            ],
            [
                'key' => 'seo_description',
                'value_fr' => 'Optique Torena : Votre opticien de confiance à Casablanca. Découvrez nos collections exclusives de lunettes de vue et solaires avec conseil personnalisé et verres haute précision.',
                'value_ar' => 'أوبتيك تورينا : أخصائي البصريات الموثوق بالدار البيضاء. استكشفوا تشكيلاتنا الحصرية من النظارات الطبية والشمسية مع استشارات متخصصة.',
                'group' => 'seo',
                'type' => 'textarea',
                'description' => 'Meta Description / وصف الصفحة لمحركات البحث',
            ],
        ];

        foreach ($settings as $setting) {
            WebsiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
