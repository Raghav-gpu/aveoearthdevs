// Complete System Test - Verify all services and workflows
const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:8080';
const FRONTEND_URL = 'http://localhost:5176';
const AI_URL = 'http://localhost:8002';
const PRODUCT_VERIFICATION_URL = 'http://localhost:8001';

async function testCompleteSystem() {
    console.log('🔍 Complete System Test');
    console.log('=======================\n');

    const results = {
        backend: false,
        frontend: false,
        ai: false,
        productVerification: false,
        database: false,
        categories: false,
        brands: false,
        products: false
    };

    // Test Backend
    try {
        const response = await fetch(`${BACKEND_URL}/health`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend is running:', data);
            results.backend = true;
        }
    } catch (error) {
        console.log('❌ Backend not accessible:', error.message);
    }

    // Test Frontend
    try {
        const response = await fetch(FRONTEND_URL);
        if (response.ok) {
            console.log('✅ Frontend is accessible');
            results.frontend = true;
        }
    } catch (error) {
        console.log('❌ Frontend not accessible:', error.message);
    }

    // Test AI Service
    try {
        const response = await fetch(`${AI_URL}/health`);
        if (response.ok) {
            console.log('✅ AI Service is running');
            results.ai = true;
        }
    } catch (error) {
        console.log('⚠️  AI Service not accessible:', error.message);
    }

    // Test Product Verification
    try {
        const response = await fetch(`${PRODUCT_VERIFICATION_URL}/health`);
        if (response.ok) {
            console.log('✅ Product Verification Service is running');
            results.productVerification = true;
        }
    } catch (error) {
        console.log('⚠️  Product Verification Service not accessible:', error.message);
    }

    // Test Database Connection via Backend
    if (results.backend) {
        try {
            const response = await fetch(`${BACKEND_URL}/products/categories`);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Database connection working - Categories:', data.length || 0);
                results.database = true;
                results.categories = true;
            } else {
                console.log('❌ Categories endpoint failed:', response.status, await response.text());
            }
        } catch (error) {
            console.log('❌ Database connection test failed:', error.message);
        }

        try {
            const response = await fetch(`${BACKEND_URL}/products/brands`);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Brands endpoint working - Brands:', data.length || 0);
                results.brands = true;
            } else {
                console.log('❌ Brands endpoint failed:', response.status);
            }
        } catch (error) {
            console.log('❌ Brands test failed:', error.message);
        }

        try {
            const response = await fetch(`${BACKEND_URL}/products/`);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Products endpoint working - Products:', data.items?.length || 0);
                results.products = true;
            } else {
                console.log('❌ Products endpoint failed:', response.status);
            }
        } catch (error) {
            console.log('❌ Products test failed:', error.message);
        }
    }

    console.log('\n📊 Test Summary:');
    console.log('================');
    console.log(`Backend: ${results.backend ? '✅' : '❌'}`);
    console.log(`Frontend: ${results.frontend ? '✅' : '❌'}`);
    console.log(`AI Service: ${results.ai ? '✅' : '⚠️'}`);
    console.log(`Product Verification: ${results.productVerification ? '✅' : '⚠️'}`);
    console.log(`Database Connection: ${results.database ? '✅' : '❌'}`);
    console.log(`Categories: ${results.categories ? '✅' : '❌'}`);
    console.log(`Brands: ${results.brands ? '✅' : '❌'}`);
    console.log(`Products: ${results.products ? '✅' : '❌'}`);

    if (results.backend && results.frontend && results.database) {
        console.log('\n🎉 Core system is operational!');
        return true;
    } else {
        console.log('\n⚠️  Some components need attention.');
        return false;
    }
}

testCompleteSystem().catch(console.error);

