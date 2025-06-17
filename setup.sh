#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up LLM Summarizer Showdown...${NC}"

# Create virtual environment for backend
echo -e "\n${GREEN}Setting up Python virtual environment...${NC}"
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
echo -e "\n${GREEN}Installing Python dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "\n${YELLOW}Creating .env file...${NC}"
    cat > .env <<EOL
# OpenAI API Key (get it from https://platform.openai.com/account/api-keys)
OPENAI_API_KEY=your_openai_api_key_here

# HuggingFace Token (get it from https://huggingface.co/settings/tokens)
HUGGINGFACE_TOKEN=your_huggingface_token_here
EOL
    echo -e "${GREEN}.env file created. Please update it with your API keys.${NC}"
else
    echo -e "\n${GREEN}.env file already exists.${NC}"
fi

# Install Node.js dependencies
echo -e "\n${GREEN}Installing Node.js dependencies...${NC}"
cd frontend
npm install

# Create a .env file for the frontend
if [ ! -f ".env" ]; then
    echo -e "\n${YELLOW}Creating frontend .env file...${NC}"
    cat > .env <<EOL
REACT_APP_API_URL=http://localhost:8000
EOL
    echo -e "${GREEN}Frontend .env file created.${NC}"
else
    echo -e "\n${GREEN}Frontend .env file already exists.${NC}"
fi

# Build the frontend
echo -e "\n${GREEN}Building the frontend...${NC}"
npm run build

cd ..

echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "\nTo start the application, run the following commands in separate terminals:"
echo -e "1. Backend: ${YELLOW}source venv/bin/activate && uvicorn backend.main:app --reload${NC}"
echo -e "2. Frontend: ${YELLOW}cd frontend && npm start${NC}"
echo -e "\nThen open your browser to: ${YELLOW}http://localhost:3000${NC}"
