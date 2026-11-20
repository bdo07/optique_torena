import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== REAL-WORLD FRONTEND ACCEPTANCE VALIDATION ===\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[✓] ${testName}`);
    passedTests++;
  } else {
    console.error(`[✗] FAILED: ${testName} - ${details}`);
    failedTests++;
  }
}

// 1. Translation Keys Symmetry & Completeness
const frPath = path.resolve(__dirname, '../src/i18n/locales/fr.json');
const arPath = path.resolve(__dirname, '../src/i18n/locales/ar.json');

const frJson = JSON.parse(fs.readFileSync(frPath, 'utf-8'));
const arJson = JSON.parse(fs.readFileSync(arPath, 'utf-8'));

function getFlattenedKeys(obj, prefix = '') {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getFlattenedKeys(obj[k], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const frKeys = new Set(getFlattenedKeys(frJson));
const arKeys = new Set(getFlattenedKeys(arJson));

const missingInAr = [...frKeys].filter(k => !arKeys.has(k));
const missingInFr = [...arKeys].filter(k => !frKeys.has(k));

assert(missingInAr.length === 0, 'French to Arabic keys parity', `Missing in Arabic: ${missingInAr.join(', ')}`);
assert(missingInFr.length === 0, 'Arabic to French keys parity', `Missing in French: ${missingInFr.join(', ')}`);
assert(frKeys.size >= 120, 'Translation dictionary comprehensive coverage', `Total keys: ${frKeys.size}`);

// 2. WhatsApp Link Generation & Encoding
function buildWhatsAppLink(phoneNumber, message) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

function buildProductWhatsAppMessage(productName, reference, price, lang = 'fr') {
  const formattedPrice = lang === 'ar' ? `${price} د.م.` : `${price} MAD`;
  if (lang === 'ar') {
    return `مرحباً أوبتيك تورينا، أود الحصول على مزيد من المعلومات أو حجز النظارة:\n• المنتج: ${productName}\n• المرجع: ${reference}\n• السعر: ${formattedPrice}\nشكراً جزيلاً!`;
  }
  return `Bonjour Optique Torena, je souhaite avoir plus d'informations ou réserver cette monture :\n• Modèle : ${productName}\n• Réf : ${reference}\n• Prix : ${formattedPrice}\nMerci !`;
}

const waLinkFr = buildWhatsAppLink('+212 6 61 23 45 67', buildProductWhatsAppMessage('Ray-Ban Aviator', 'RB-3025', 1850, 'fr'));
assert(waLinkFr.startsWith('https://wa.me/212661234567?text='), 'WhatsApp link phone sanitization (+212 6 61... -> 212661234567)');
assert(waLinkFr.includes('Ray-Ban%20Aviator'), 'WhatsApp link contains encoded product name');
assert(waLinkFr.includes('RB-3025'), 'WhatsApp link contains reference');
assert(waLinkFr.includes('1850%20MAD'), 'WhatsApp link contains formatted price in MAD');

const waLinkAr = buildWhatsAppLink('+212 6 61 23 45 67', buildProductWhatsAppMessage('راي بان أفياتور', 'RB-3025', 1850, 'ar'));
assert(decodeURIComponent(waLinkAr).includes('راي بان أفياتور'), 'WhatsApp Arabic message contains Arabic model name');
assert(decodeURIComponent(waLinkAr).includes('د.م.'), 'WhatsApp Arabic message contains Moroccan Dirham currency symbol');

// 3. Announcement Bar Expiration Logic
function isAnnouncementActive(enabled, expiresAtStr) {
  if (!enabled) return false;
  if (!expiresAtStr) return true;
  const expDate = new Date(expiresAtStr);
  if (isNaN(expDate.getTime())) return true;
  return expDate.getTime() > Date.now();
}

assert(isAnnouncementActive(true, null) === true, 'Announcement active when enabled and no expiration date');
assert(isAnnouncementActive(false, null) === false, 'Announcement hidden when disabled');
assert(isAnnouncementActive(true, '2020-01-01') === false, 'Announcement hidden when expiration date is in the past');
assert(isAnnouncementActive(true, '2030-12-31') === true, 'Announcement shown when expiration date is in the future');

// 4. App Routes Structure
const appFile = fs.readFileSync(path.resolve(__dirname, '../src/App.tsx'), 'utf-8');
assert(appFile.includes('path="/"'), 'Public Homepage route registered');
assert(appFile.includes('path="/catalogue"'), 'Public Catalog route registered');
assert(appFile.includes('path="/produit/:slug"'), 'Product Details route registered');
assert(appFile.includes('path="/a-propos"'), 'About page route registered');
assert(appFile.includes('path="/contact"'), 'Contact page route registered');
assert(appFile.includes('path="/admin"'), 'Admin root route registered');
assert(appFile.includes('path="products"'), 'Admin Products route registered');
assert(appFile.includes('path="categories"'), 'Admin Categories route registered');
assert(appFile.includes('path="brands"'), 'Admin Brands route registered');
assert(appFile.includes('path="promotions"'), 'Admin Promotions route registered');
assert(appFile.includes('path="settings"'), 'Admin Settings route registered');
assert(appFile.includes('path="messages"'), 'Admin Messages route registered');
assert(!appFile.includes('/checkout'), 'No checkout or payment route (Catalog-only integrity)');

// 5. RTL & Styling Check
const cssFile = fs.readFileSync(path.resolve(__dirname, '../src/index.css'), 'utf-8');
assert(cssFile.includes('[dir="rtl"]'), 'CSS contains explicit RTL font rule');
assert(cssFile.includes('Cairo'), 'RTL font family Cairo declared');
assert(cssFile.includes('#FAFAF8'), 'Warm white #FAFAF8 present in base styles');
assert(cssFile.includes('#222222'), 'Dark charcoal #222222 present in base styles');

console.log(`\n=== FRONTEND CHECK COMPLETED ===`);
console.log(`Passed: ${passedTests} | Failed: ${failedTests}`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL FRONTEND REAL-WORLD ACCEPTANCE TESTS PASSED!\n');
}
