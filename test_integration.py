#!/usr/bin/env python3
"""
Comprehensive Integration Test Suite for AveoEarth Backend, AI Service, and Frontend
"""

import asyncio
import json
import time
import httpx
import sys
from typing import Dict, Any, List
from dataclasses import dataclass

@dataclass
class TestResult:
    test_name: str
    passed: bool
    error: str = None
    response_data: Dict[Any, Any] = None
    response_time: float = 0.0

class IntegrationTester:
    def __init__(self):
        self.backend_url = "http://localhost:8000"
        self.ai_url = "http://localhost:8002"
        self.frontend_url = "http://localhost:5173"
        self.results: List[TestResult] = []
        
    async def test_backend_health(self) -> TestResult:
        """Test backend health endpoint"""
        start_time = time.time()
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.backend_url}/health")
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    return TestResult(
                        test_name="Backend Health Check",
                        passed=True,
                        response_data=data,
                        response_time=response_time
                    )
                else:
                    return TestResult(
                        test_name="Backend Health Check",
                        passed=False,
                        error=f"Status code: {response.status_code}",
                        response_time=response_time
                    )
        except Exception as e:
            return TestResult(
                test_name="Backend Health Check",
                passed=False,
                error=str(e),
                response_time=time.time() - start_time
            )
    
    async def test_backend_root(self) -> TestResult:
        """Test backend root endpoint"""
        start_time = time.time()
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.backend_url}/")
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    return TestResult(
                        test_name="Backend Root Endpoint",
                        passed=True,
                        response_data=data,
                        response_time=response_time
                    )
                else:
                    return TestResult(
                        test_name="Backend Root Endpoint",
                        passed=False,
                        error=f"Status code: {response.status_code}",
                        response_time=response_time
                    )
        except Exception as e:
            return TestResult(
                test_name="Backend Root Endpoint",
                passed=False,
                error=str(e),
                response_time=time.time() - start_time
            )
    
    async def test_ai_health(self) -> TestResult:
        """Test AI service health endpoint"""
        start_time = time.time()
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.ai_url}/health")
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    return TestResult(
                        test_name="AI Service Health Check",
                        passed=True,
                        response_data=data,
                        response_time=response_time
                    )
                else:
                    return TestResult(
                        test_name="AI Service Health Check",
                        passed=False,
                        error=f"Status code: {response.status_code}",
                        response_time=response_time
                    )
        except Exception as e:
            return TestResult(
                test_name="AI Service Health Check",
                passed=False,
                error=str(e),
                response_time=time.time() - start_time
            )
    
    async def test_ai_chat_without_auth(self) -> TestResult:
        """Test AI chat endpoint without authentication"""
        start_time = time.time()
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "message": "Hello, can you help me find sustainable products?",
                    "session_id": "test-session-123"
                }
                response = await client.post(
                    f"{self.ai_url}/chat",
                    json=payload,
                    timeout=30.0
                )
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    return TestResult(
                        test_name="AI Chat (No Auth)",
                        passed=True,
                        response_data=data,
                        response_time=response_time
                    )
                else:
                    error_data = response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text
                    return TestResult(
                        test_name="AI Chat (No Auth)",
                        passed=False,
                        error=f"Status code: {response.status_code}, Error: {error_data}",
                        response_time=response_time
                    )
        except Exception as e:
            return TestResult(
                test_name="AI Chat (No Auth)",
                passed=False,
                error=str(e),
                response_time=time.time() - start_time
            )
    
    async def test_frontend_accessibility(self) -> TestResult:
        """Test frontend accessibility"""
        start_time = time.time()
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.frontend_url)
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    return TestResult(
                        test_name="Frontend Accessibility",
                        passed=True,
                        response_data={"content_length": len(response.text)},
                        response_time=response_time
                    )
                else:
                    return TestResult(
                        test_name="Frontend Accessibility",
                        passed=False,
                        error=f"Status code: {response.status_code}",
                        response_time=response_time
                    )
        except Exception as e:
            return TestResult(
                test_name="Frontend Accessibility",
                passed=False,
                error=str(e),
                response_time=time.time() - start_time
            )
    
    async def test_backend_search_endpoint(self) -> TestResult:
        """Test backend search endpoint"""
        start_time = time.time()
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "query": "sustainable",
                    "page": 1,
                    "limit": 10
                }
                response = await client.post(
                    f"{self.backend_url}/search/",
                    json=payload,
                    timeout=10.0
                )
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    return TestResult(
                        test_name="Backend Search Endpoint",
                        passed=True,
                        response_data=data,
                        response_time=response_time
                    )
                else:
                    error_data = response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text
                    return TestResult(
                        test_name="Backend Search Endpoint",
                        passed=False,
                        error=f"Status code: {response.status_code}, Error: {error_data}",
                        response_time=response_time
                    )
        except Exception as e:
            return TestResult(
                test_name="Backend Search Endpoint",
                passed=False,
                error=str(e),
                response_time=time.time() - start_time
            )
    
    async def test_backend_products_endpoint(self) -> TestResult:
        """Test backend products endpoint"""
        start_time = time.time()
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.backend_url}/products/",
                    timeout=10.0
                )
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    return TestResult(
                        test_name="Backend Products Endpoint",
                        passed=True,
                        response_data=data,
                        response_time=response_time
                    )
                else:
                    error_data = response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text
                    return TestResult(
                        test_name="Backend Products Endpoint",
                        passed=False,
                        error=f"Status code: {response.status_code}, Error: {error_data}",
                        response_time=response_time
                    )
        except Exception as e:
            return TestResult(
                test_name="Backend Products Endpoint",
                passed=False,
                error=str(e),
                response_time=time.time() - start_time
            )
    
    async def test_ai_stats_endpoint(self) -> TestResult:
        """Test AI service stats endpoint"""
        start_time = time.time()
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.ai_url}/stats")
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    return TestResult(
                        test_name="AI Stats Endpoint",
                        passed=True,
                        response_data=data,
                        response_time=response_time
                    )
                else:
                    return TestResult(
                        test_name="AI Stats Endpoint",
                        passed=False,
                        error=f"Status code: {response.status_code}",
                        response_time=response_time
                    )
        except Exception as e:
            return TestResult(
                test_name="AI Stats Endpoint",
                passed=False,
                error=str(e),
                response_time=time.time() - start_time
            )
    
    async def run_all_tests(self):
        """Run all integration tests"""
        print("Starting Comprehensive Integration Tests...")
        print("=" * 60)
        
        # Backend tests
        print("\nTesting Backend Service...")
        self.results.append(await self.test_backend_health())
        self.results.append(await self.test_backend_root())
        self.results.append(await self.test_backend_search_endpoint())
        self.results.append(await self.test_backend_products_endpoint())
        
        # AI service tests
        print("\nTesting AI Service...")
        self.results.append(await self.test_ai_health())
        self.results.append(await self.test_ai_stats_endpoint())
        self.results.append(await self.test_ai_chat_without_auth())
        
        # Frontend tests
        print("\nTesting Frontend...")
        self.results.append(await self.test_frontend_accessibility())
        
        # Print results
        self.print_results()
    
    def print_results(self):
        """Print test results summary"""
        print("\n" + "=" * 60)
        print("TEST RESULTS SUMMARY")
        print("=" * 60)
        
        passed_tests = [r for r in self.results if r.passed]
        failed_tests = [r for r in self.results if not r.passed]
        
        print(f"\nPassed: {len(passed_tests)}/{len(self.results)}")
        print(f"Failed: {len(failed_tests)}/{len(self.results)}")
        
        if passed_tests:
            print("\nPASSED TESTS:")
            for result in passed_tests:
                print(f"  - {result.test_name} ({result.response_time:.3f}s)")
                if result.response_data:
                    print(f"    Response: {json.dumps(result.response_data, indent=2)[:200]}...")
        
        if failed_tests:
            print("\nFAILED TESTS:")
            for result in failed_tests:
                print(f"  - {result.test_name} ({result.response_time:.3f}s)")
                print(f"    Error: {result.error}")
        
        print("\n" + "=" * 60)
        
        # Overall health check
        if len(failed_tests) == 0:
            print("ALL TESTS PASSED! System is healthy.")
        elif len(failed_tests) <= 2:
            print("Most tests passed. Minor issues detected.")
        else:
            print("Multiple test failures detected. System needs attention.")

async def main():
    """Main test runner"""
    tester = IntegrationTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())