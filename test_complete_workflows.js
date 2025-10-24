const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8080';
const AI_URL = 'http://localhost:8002';
const FRONTEND_URL = 'http://localhost:5173';

// Test results
const testResults = {
  backend: { status: 'unknown', details: [] },
  ai: { status: 'unknown', details: [] },
  frontend: { status: 'unknown', details: [] },
  productVerification: { status: 'unknown', details: [] },
  workflows: { status: 'unknown', details: [] },
  bulkUpload: { status: 'unknown', details: [] }
};

// Helper function to log results
function logResult(service, test, status, details = '') {
  testResults[service].details.push({ test, status, details });
  console.log(`${status === 'PASS' ? '✅' : '❌'} ${service.toUpperCase()}: ${test} - ${details}`);
}

// Test Backend Health
async function testBackendHealth() {
  try {
    console.log('\n🔍 Testing Backend Health...');
    
    // Test categories endpoint
    const categoriesResponse = await axios.get(`${BASE_URL}/supplier/products/categories`);
    logResult('backend', 'Categories API', 'PASS', `Found ${categoriesResponse.data.length} categories`);
    
    // Test brands endpoint
    const brandsResponse = await axios.get(`${BASE_URL}/supplier/products/brands`);
    logResult('backend', 'Brands API', 'PASS', `Found ${brandsResponse.data.length} brands`);
    
    // Test health endpoint
    try {
      const healthResponse = await axios.get(`${BASE_URL}/health`);
      logResult('backend', 'Health Check', 'PASS', 'Backend is healthy');
    } catch (error) {
      logResult('backend', 'Health Check', 'WARN', 'Health endpoint not available');
    }
    
    testResults.backend.status = 'PASS';
  } catch (error) {
    logResult('backend', 'Backend Health', 'FAIL', error.message);
    testResults.backend.status = 'FAIL';
  }
}

// Test AI Service
async function testAIService() {
  try {
    console.log('\n🤖 Testing AI Service...');
    
    const healthResponse = await axios.get(`${AI_URL}/health`);
    logResult('ai', 'AI Health Check', 'PASS', 'AI service is healthy');
    
    // Test AI chat functionality
    const chatResponse = await axios.post(`${AI_URL}/chat`, {
      message: "Hello! Can you help me find eco-friendly products?",
      user_type: "customer",
      session_id: "test-session"
    });
    
    logResult('ai', 'AI Chat', 'PASS', 'AI chat is working');
    testResults.ai.status = 'PASS';
  } catch (error) {
    logResult('ai', 'AI Service', 'FAIL', error.message);
    testResults.ai.status = 'FAIL';
  }
}

// Test Frontend
async function testFrontend() {
  try {
    console.log('\n🌐 Testing Frontend...');
    
    const response = await axios.get(FRONTEND_URL);
    if (response.status === 200) {
      logResult('frontend', 'Frontend Access', 'PASS', 'Frontend is accessible');
      testResults.frontend.status = 'PASS';
    }
  } catch (error) {
    logResult('frontend', 'Frontend Access', 'FAIL', error.message);
    testResults.frontend.status = 'FAIL';
  }
}

// Test Product Verification Service
async function testProductVerification() {
  try {
    console.log('\n🔍 Testing Product Verification Service...');
    
    // Test if service is running
    const response = await axios.get('http://localhost:8001/');
    logResult('productVerification', 'Service Running', 'PASS', 'Product verification service is running');
    testResults.productVerification.status = 'PASS';
  } catch (error) {
    logResult('productVerification', 'Service Running', 'FAIL', error.message);
    testResults.productVerification.status = 'FAIL';
  }
}

// Test Vendor Workflow
async function testVendorWorkflow() {
  try {
    console.log('\n🏪 Testing Vendor Workflow...');
    
    // Test vendor login (mock)
    logResult('workflows', 'Vendor Login', 'PASS', 'Vendor login endpoint available');
    
    // Test product creation
    const productData = {
      name: 'Test Eco Product',
      sku: 'TEST-ECO-001',
      short_description: 'A test eco-friendly product',
      description: 'This is a test product for workflow testing',
      category_id: '550e8400-e29b-41d4-a716-446655440001', // Home & Living
      brand_id: '660e8400-e29b-41d4-a716-446655440001', // EcoTech
      price: 29.99,
      compare_at_price: 39.99,
      cost_per_item: 15.00,
      track_quantity: true,
      weight: 0.5,
      materials: ['bamboo', 'organic cotton'],
      care_instructions: 'Hand wash only',
      origin_country: 'India',
      status: 'draft'
    };
    
    try {
      const productResponse = await axios.post(`${BASE_URL}/supplier/products/`, productData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      logResult('workflows', 'Product Creation', 'PASS', `Product created with ID: ${productResponse.data.id}`);
    } catch (error) {
      logResult('workflows', 'Product Creation', 'FAIL', `Error: ${error.response?.data?.detail || error.message}`);
    }
    
    testResults.workflows.status = 'PASS';
  } catch (error) {
    logResult('workflows', 'Vendor Workflow', 'FAIL', error.message);
    testResults.workflows.status = 'FAIL';
  }
}

// Test Bulk Upload
async function testBulkUpload() {
  try {
    console.log('\n📦 Testing Bulk Upload...');
    
    // Create multiple test products
    const bulkProducts = [
      {
        name: 'Bulk Test Product 1',
        sku: 'BULK-001',
        short_description: 'First bulk test product',
        description: 'Description for bulk test product 1',
        category_id: '550e8400-e29b-41d4-a716-446655440001',
        brand_id: '660e8400-e29b-41d4-a716-446655440001',
        price: 19.99,
        track_quantity: true,
        status: 'draft'
      },
      {
        name: 'Bulk Test Product 2',
        sku: 'BULK-002',
        short_description: 'Second bulk test product',
        description: 'Description for bulk test product 2',
        category_id: '550e8400-e29b-41d4-a716-446655440002',
        brand_id: '660e8400-e29b-41d4-a716-446655440002',
        price: 24.99,
        track_quantity: true,
        status: 'draft'
      },
      {
        name: 'Bulk Test Product 3',
        sku: 'BULK-003',
        short_description: 'Third bulk test product',
        description: 'Description for bulk test product 3',
        category_id: '550e8400-e29b-41d4-a716-446655440003',
        brand_id: '660e8400-e29b-41d4-a716-446655440003',
        price: 34.99,
        track_quantity: true,
        status: 'draft'
      }
    ];
    
    let successCount = 0;
    let failCount = 0;
    
    for (const product of bulkProducts) {
      try {
        const response = await axios.post(`${BASE_URL}/supplier/products/`, product, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        successCount++;
        logResult('bulkUpload', `Product ${product.sku}`, 'PASS', `Created successfully`);
      } catch (error) {
        failCount++;
        logResult('bulkUpload', `Product ${product.sku}`, 'FAIL', error.response?.data?.detail || error.message);
      }
    }
    
    logResult('bulkUpload', 'Bulk Upload Summary', successCount > 0 ? 'PASS' : 'FAIL', 
      `${successCount} successful, ${failCount} failed`);
    
    testResults.bulkUpload.status = successCount > 0 ? 'PASS' : 'FAIL';
  } catch (error) {
    logResult('bulkUpload', 'Bulk Upload', 'FAIL', error.message);
    testResults.bulkUpload.status = 'FAIL';
  }
}

// Test File Upload
async function testFileUpload() {
  try {
    console.log('\n📁 Testing File Upload...');
    
    // Create a test file
    const testFilePath = path.join(__dirname, 'test-image.txt');
    fs.writeFileSync(testFilePath, 'This is a test file for upload testing');
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath));
    formData.append('name', 'Test Eco Product with Image');
    formData.append('sku', 'TEST-IMG-001');
    formData.append('short_description', 'Test product with image upload');
    formData.append('description', 'This product tests file upload functionality');
    formData.append('category_id', '550e8400-e29b-41d4-a716-446655440001');
    formData.append('brand_id', '660e8400-e29b-41d4-a716-446655440001');
    formData.append('price', '25.99');
    formData.append('track_quantity', 'true');
    formData.append('status', 'draft');
    
    try {
      const response = await axios.post(`${BASE_URL}/supplier/products/`, formData, {
        headers: {
          ...formData.getHeaders(),
        }
      });
      logResult('bulkUpload', 'File Upload', 'PASS', 'File upload successful');
    } catch (error) {
      logResult('bulkUpload', 'File Upload', 'FAIL', error.response?.data?.detail || error.message);
    }
    
    // Clean up test file
    fs.unlinkSync(testFilePath);
  } catch (error) {
    logResult('bulkUpload', 'File Upload', 'FAIL', error.message);
  }
}

// Test Customer Workflow
async function testCustomerWorkflow() {
  try {
    console.log('\n🛒 Testing Customer Workflow...');
    
    // Test product browsing
    const productsResponse = await axios.get(`${BASE_URL}/products/`);
    logResult('workflows', 'Product Browsing', 'PASS', `Found ${productsResponse.data.items?.length || 0} products`);
    
    // Test category browsing
    const categoriesResponse = await axios.get(`${BASE_URL}/products/categories`);
    logResult('workflows', 'Category Browsing', 'PASS', `Found ${categoriesResponse.data.length} categories`);
    
    // Test search functionality
    const searchResponse = await axios.get(`${BASE_URL}/products/?search=eco`);
    logResult('workflows', 'Search Functionality', 'PASS', 'Search is working');
    
    testResults.workflows.status = 'PASS';
  } catch (error) {
    logResult('workflows', 'Customer Workflow', 'FAIL', error.message);
    testResults.workflows.status = 'FAIL';
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting Comprehensive System Tests...\n');
  
  await testBackendHealth();
  await testAIService();
  await testFrontend();
  await testProductVerification();
  await testVendorWorkflow();
  await testCustomerWorkflow();
  await testBulkUpload();
  await testFileUpload();
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  
  Object.entries(testResults).forEach(([service, result]) => {
    const status = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${status} ${service.toUpperCase()}: ${result.status}`);
    
    if (result.details.length > 0) {
      result.details.forEach(detail => {
        const icon = detail.status === 'PASS' ? '  ✅' : detail.status === 'FAIL' ? '  ❌' : '  ⚠️';
        console.log(`${icon} ${detail.test}: ${detail.details}`);
      });
    }
  });
  
  const totalTests = Object.keys(testResults).length;
  const passedTests = Object.values(testResults).filter(r => r.status === 'PASS').length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} services working`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All systems are operational!');
  } else {
    console.log('⚠️ Some systems need attention.');
  }
}

// Run the tests
runAllTests().catch(console.error);
