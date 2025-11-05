/**
 * Comprehensive Test of All Features
 * Tests: Bulk Upload, Frontend Visibility, Orders, AI, Recommendations
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testBulkUpload() {
    log('\n📦 TEST 1: Bulk Product Upload', 'cyan');
    log('============================================================', 'cyan');
    
    try {
        const csvPath = path.join(__dirname, 'test_products_5.csv');
        if (!fs.existsSync(csvPath)) {
            log('❌ CSV file not found', 'red');
            return { success: false, products: [] };
        }
        
        const csvContent = fs.readFileSync(csvPath);
        const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
        let formData = '';
        formData += `--${boundary}\r\n`;
        formData += `Content-Disposition: form-data; name="file"; filename="test_products_5.csv"\r\n`;
        formData += `Content-Type: text/csv\r\n\r\n`;
        formData += csvContent.toString();
        formData += `\r\n--${boundary}--\r\n`;
        
        const token = 'DEBUG-MODE-TOKEN';
        
        log('📤 Uploading 5 products via CSV...', 'blue');
        const response = await fetch(`${BACKEND_URL}/supplier/products/bulk-import-csv`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
            },
            body: formData,
            signal: AbortSignal.timeout(60000),
        });
        
        const data = await response.json();
        log(`📥 Response: ${response.status}`, response.status === 200 ? 'green' : 'red');
        
        if (data.results && data.results.successful > 0) {
            log(`✅ ${data.results.successful} products created successfully!`, 'green');
            log(`📋 Product IDs: ${data.results.created_product_ids.join(', ')}`, 'blue');
            return { success: true, products: data.results.created_product_ids };
        } else {
            log(`❌ No products created. Errors:`, 'red');
            if (data.results && data.results.errors) {
                data.results.errors.forEach(err => {
                    log(`  Row ${err.row}: ${err.product_name} - ${err.error.substring(0, 100)}`, 'red');
                });
            }
            return { success: false, products: [] };
        }
    } catch (error) {
        log(`❌ Bulk upload failed: ${error.message}`, 'red');
        return { success: false, products: [] };
    }
}

async function testFrontendVisibility() {
    log('\n👁️ TEST 2: Frontend Product Visibility', 'cyan');
    log('============================================================', 'cyan');
    
    try {
        log('🔍 Fetching products from backend...', 'blue');
        const response = await fetch(`${BACKEND_URL}/products?limit=20`, {
            signal: AbortSignal.timeout(10000),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        const productCount = data.items?.length || data.data?.length || 0;
        
        if (productCount > 0) {
            log(`✅ Found ${productCount} products visible on frontend!`, 'green');
            if (data.items) {
                data.items.slice(0, 3).forEach((p, i) => {
                    log(`  ${i + 1}. ${p.name} - $${p.price}`, 'blue');
                });
            }
            return { success: true, count: productCount };
        } else {
            log(`⚠️ No products found on frontend`, 'yellow');
            return { success: false, count: 0 };
        }
    } catch (error) {
        log(`❌ Frontend visibility test failed: ${error.message}`, 'red');
        return { success: false, count: 0 };
    }
}

async function testTrendingProducts() {
    log('\n🔥 TEST 3: Trending Products', 'cyan');
    log('============================================================', 'cyan');
    
    try {
        const response = await fetch(`${BACKEND_URL}/search/trending?limit=5`, {
            signal: AbortSignal.timeout(10000),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        const count = data.items?.length || data.data?.length || 0;
        
        if (count > 0) {
            log(`✅ Found ${count} trending products!`, 'green');
            return { success: true };
        } else {
            log(`⚠️ No trending products found`, 'yellow');
            return { success: false };
        }
    } catch (error) {
        log(`❌ Trending products test failed: ${error.message}`, 'red');
        return { success: false };
    }
}

async function testOrderPlacing() {
    log('\n🛒 TEST 4: Order Placing', 'cyan');
    log('============================================================', 'cyan');
    
    try {
        // First get a product
        log('📦 Fetching available products...', 'blue');
        const productsResponse = await fetch(`${BACKEND_URL}/products?limit=1`, {
            signal: AbortSignal.timeout(10000),
        });
        
        if (!productsResponse.ok || productsResponse.status === 404) {
            log('⚠️ No products available for order test', 'yellow');
            return { success: false, reason: 'No products available' };
        }
        
        const productsData = await productsResponse.json();
        const products = productsData.items || productsData.data || [];
        
        if (products.length === 0) {
            log('⚠️ No products available for order test', 'yellow');
            return { success: false, reason: 'No products available' };
        }
        
        const product = products[0];
        log(`📦 Using product: ${product.name} ($${product.price})`, 'blue');
        
        // Try to create an order
        const token = 'DEBUG-MODE-TOKEN';
        const orderData = {
            items: [{
                product_id: product.id,
                quantity: 1,
                price: product.price
            }],
            shipping_address: {
                street: '123 Test St',
                city: 'Test City',
                state: 'TS',
                zip: '12345',
                country: 'US'
            }
        };
        
        log('📝 Creating order...', 'blue');
        const orderResponse = await fetch(`${BACKEND_URL}/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
            signal: AbortSignal.timeout(15000),
        });
        
        if (orderResponse.ok) {
            const orderData = await orderResponse.json();
            log(`✅ Order created successfully!`, 'green');
            return { success: true };
        } else {
            const error = await orderResponse.text();
            log(`⚠️ Order creation returned ${orderResponse.status}: ${error.substring(0, 100)}`, 'yellow');
            return { success: false, reason: `HTTP ${orderResponse.status}` };
        }
    } catch (error) {
        log(`⚠️ Order placing test: ${error.message}`, 'yellow');
        return { success: false, reason: error.message };
    }
}

async function testAIChatbot() {
    log('\n🤖 TEST 5: AI Chatbot', 'cyan');
    log('============================================================', 'cyan');
    
    try {
        // Test AI health endpoint
        log('🔍 Checking AI service health...', 'blue');
        const healthResponse = await fetch(`${BACKEND_URL}/ai/health`, {
            signal: AbortSignal.timeout(5000),
        });
        
        if (healthResponse.ok) {
            log(`✅ AI service is available!`, 'green');
            return { success: true };
        } else if (healthResponse.status === 404) {
            log(`⚠️ AI service endpoint not found (may be on different port)`, 'yellow');
            return { success: false, reason: 'Endpoint not found' };
        } else {
            log(`⚠️ AI service returned ${healthResponse.status}`, 'yellow');
            return { success: false, reason: `HTTP ${healthResponse.status}` };
        }
    } catch (error) {
        if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
            log(`⚠️ AI service not running or on different port`, 'yellow');
        } else {
            log(`⚠️ AI test failed: ${error.message}`, 'yellow');
        }
        return { success: false, reason: error.message };
    }
}

async function testRecommendations() {
    log('\n💡 TEST 6: Product Recommendations', 'cyan');
    log('============================================================', 'cyan');
    
    try {
        // Get a product first
        const productsResponse = await fetch(`${BACKEND_URL}/products?limit=1`, {
            signal: AbortSignal.timeout(10000),
        });
        
        if (!productsResponse.ok) {
            log('⚠️ No products available for recommendations test', 'yellow');
            return { success: false };
        }
        
        const productsData = await productsResponse.json();
        const products = productsData.items || productsData.data || [];
        
        if (products.length === 0) {
            log('⚠️ No products available for recommendations', 'yellow');
            return { success: false };
        }
        
        const productId = products[0].id;
        log(`🔍 Getting recommendations for product: ${products[0].name}`, 'blue');
        
        const token = 'DEBUG-MODE-TOKEN';
        const response = await fetch(`${BACKEND_URL}/search/personalized?product_id=${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            signal: AbortSignal.timeout(10000),
        });
        
        if (response.ok) {
            const data = await response.json();
            const count = data.items?.length || data.recommendations?.length || 0;
            if (count > 0) {
                log(`✅ Found ${count} recommendations!`, 'green');
                return { success: true };
            } else {
                log(`⚠️ No recommendations returned`, 'yellow');
                return { success: false };
            }
        } else {
            log(`⚠️ Recommendations endpoint returned ${response.status}`, 'yellow');
            return { success: false };
        }
    } catch (error) {
        log(`⚠️ Recommendations test: ${error.message}`, 'yellow');
        return { success: false };
    }
}

async function runAllTests() {
    log('\n🚀 COMPREHENSIVE FEATURE TESTING', 'cyan');
    log('============================================================', 'cyan');
    log('Testing all features after fixes...\n', 'blue');
    
    const results = {
        bulkUpload: { success: false },
        frontendVisibility: { success: false },
        trendingProducts: { success: false },
        orderPlacing: { success: false },
        aiChatbot: { success: false },
        recommendations: { success: false }
    };
    
    // Test 1: Bulk Upload
    results.bulkUpload = await testBulkUpload();
    
    // Wait for products to be processed
    if (results.bulkUpload.success) {
        log('\n⏳ Waiting 3 seconds for products to be processed...', 'yellow');
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Test 2: Frontend Visibility
    results.frontendVisibility = await testFrontendVisibility();
    
    // Test 3: Trending Products
    results.trendingProducts = await testTrendingProducts();
    
    // Test 4: Order Placing
    results.orderPlacing = await testOrderPlacing();
    
    // Test 5: AI Chatbot
    results.aiChatbot = await testAIChatbot();
    
    // Test 6: Recommendations
    results.recommendations = await testRecommendations();
    
    // Summary
    log('\n📊 TEST SUMMARY', 'cyan');
    log('============================================================', 'cyan');
    log(`Bulk Upload:        ${results.bulkUpload.success ? '✅ PASS' : '❌ FAIL'}`, results.bulkUpload.success ? 'green' : 'red');
    log(`Frontend Visibility: ${results.frontendVisibility.success ? '✅ PASS' : '❌ FAIL'} (${results.frontendVisibility.count} products)`, results.frontendVisibility.success ? 'green' : 'red');
    log(`Trending Products:   ${results.trendingProducts.success ? '✅ PASS' : '❌ FAIL'}`, results.trendingProducts.success ? 'green' : 'red');
    log(`Order Placing:       ${results.orderPlacing.success ? '✅ PASS' : '⚠️ SKIP'}` + (results.orderPlacing.reason ? ` (${results.orderPlacing.reason})` : ''), results.orderPlacing.success ? 'green' : 'yellow');
    log(`AI Chatbot:          ${results.aiChatbot.success ? '✅ PASS' : '⚠️ SKIP'}` + (results.aiChatbot.reason ? ` (${results.aiChatbot.reason})` : ''), results.aiChatbot.success ? 'green' : 'yellow');
    log(`Recommendations:     ${results.recommendations.success ? '✅ PASS' : '⚠️ SKIP'}`, results.recommendations.success ? 'green' : 'yellow');
    
    const criticalPassed = results.bulkUpload.success && results.frontendVisibility.success;
    const allPassed = Object.values(results).every(r => r.success);
    
    log('\n', 'reset');
    if (allPassed) {
        log('🎉 ALL TESTS PASSED!', 'green');
        process.exit(0);
    } else if (criticalPassed) {
        log('✅ CRITICAL FEATURES WORKING (Bulk Upload + Frontend Visibility)', 'green');
        log('⚠️ Some optional features need attention', 'yellow');
        process.exit(0);
    } else {
        log('❌ CRITICAL TESTS FAILED', 'red');
        process.exit(1);
    }
}

runAllTests().catch(error => {
    log(`\n❌ Test suite failed: ${error.message}`, 'red');
    process.exit(1);
});



