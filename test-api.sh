#!/bin/bash

# Test script for Reposa API

echo "🧪 Testing Reposa API"
echo "===================="
echo ""

# Health check
echo "1. Testing health endpoint..."
curl -s http://localhost:3000/health | jq .
echo ""

# Analyze repository
echo "2. Testing analyze endpoint with kubernetes/kubernetes..."
curl -s -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/kubernetes/kubernetes"}' \
  | jq .
echo ""

echo "✅ Tests complete!"
