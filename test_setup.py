#!/usr/bin/env python3
"""
Test script to verify SoulSeer setup
"""

import sys
import os
import subprocess

def test_python_dependencies():
    """Test if Python dependencies can be imported"""
    print("🐍 Testing Python dependencies...")
    
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        import pydantic
        print("✅ Python dependencies OK")
        return True
    except ImportError as e:
        print(f"❌ Python dependencies failed: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    print("🗄️ Testing database connection...")
    
    try:
        sys.path.append('backend')
        from backend.app.core.database import engine
        from backend.app.models.user import Base
        
        # Try to create tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database connection OK")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_node_dependencies():
    """Test if Node.js dependencies can be installed"""
    print("📦 Testing Node.js setup...")
    
    try:
        os.chdir('frontend')
        result = subprocess.run(['npm', 'install', '--legacy-peer-deps'], 
                              capture_output=True, text=True, timeout=60)
        if result.returncode == 0:
            print("✅ Node.js dependencies OK")
            return True
        else:
            print(f"❌ Node.js dependencies failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Node.js test failed: {e}")
        return False
    finally:
        os.chdir('..')

def main():
    """Run all tests"""
    print("🔮 Testing SoulSeer Setup...")
    print("=" * 50)
    
    tests = [
        test_python_dependencies,
        test_database_connection,
        test_node_dependencies
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! SoulSeer is ready to go!")
        print("\n🚀 Next steps:")
        print("1. cd backend && python -m uvicorn app.main:app --reload")
        print("2. cd frontend && npm run dev")
        print("3. Open http://localhost:5173")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
