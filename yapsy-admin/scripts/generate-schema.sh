#!/bin/bash

# Script to generate OpenAPI TypeScript schema from API docs
# Uses NEXT_PUBLIC_API_URL environment variable from .env file

set -e  # Exit on error

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Generating OpenAPI TypeScript schema...${NC}"

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Path to .env file
API_URL="${NEXT_PUBLIC_API_URL:-}"

if [ -z "$API_URL" ]; then
    ENV_FILE="$PROJECT_ROOT/.env"
    if [ -f "$ENV_FILE" ]; then
        API_URL=$(grep -E "^NEXT_PUBLIC_API_URL=" "$ENV_FILE" | sed -E 's/^NEXT_PUBLIC_API_URL="?([^"]*)"?/\1/' | head -n 1)
    fi
fi

if [ -z "$API_URL" ]; then
    echo -e "${RED}❌ Error: NEXT_PUBLIC_API_URL not found in environment or .env${NC}"
    exit 1
fi

# Check if NEXT_PUBLIC_API_URL is set
if [ -z "$API_URL" ]; then
    echo -e "${RED}❌ Error: NEXT_PUBLIC_API_URL is not set in .env file${NC}"
    echo -e "${YELLOW}💡 Please add NEXT_PUBLIC_API_URL to your .env file${NC}"
    echo -e "${YELLOW}   Example: NEXT_PUBLIC_API_URL=\"http://localhost:3000\"${NC}"
    exit 1
fi

# Construct the full API docs URL
DOCS_URL="${API_URL}/api/admin/v1/docs-json"

echo -e "${YELLOW}📡 Using API URL: ${API_URL}${NC}"
echo -e "${YELLOW}📄 Fetching OpenAPI spec from: ${DOCS_URL}${NC}"

# Output file path
OUTPUT_FILE="$PROJECT_ROOT/src/schema.d.ts"

# Run openapi-typescript
cd "$PROJECT_ROOT"
npx openapi-typescript "$DOCS_URL" -o "$OUTPUT_FILE"

# Check if generation was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Schema generated successfully at: src/schema.d.ts${NC}"
else
    echo -e "${RED}❌ Schema generation failed${NC}"
    exit 1
fi

