#!/bin/bash

# Context Engine MCP Server - Quick Start Installer
# This script sets up Context Engine in your project

set -e

echo "🚀 Context Engine MCP Server - Quick Start"
echo "==========================================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. You have: $(node -v)"
    exit 1
fi

echo "✓ Node.js $(node -v) detected"
echo ""

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p thoughts/shared/{research,plans}
mkdir -p thoughts/allison/tickets
mkdir -p .context-engine

echo "✓ Directories created:"
echo "  - thoughts/shared/research/"
echo "  - thoughts/shared/plans/"
echo "  - thoughts/allison/tickets/"
echo "  - .context-engine/"
echo ""

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo ".context-engine/" > .gitignore
    echo "✓ Created .gitignore"
else
    if ! grep -q ".context-engine" .gitignore; then
        echo ".context-engine/" >> .gitignore
        echo "✓ Updated .gitignore"
    fi
fi

# Detect IDE
echo "🔍 Detecting IDE configuration..."

IDE_DETECTED="none"

# Check for Cursor
if [ -d "$HOME/.cursor" ]; then
    IDE_DETECTED="cursor"
    echo "✓ Cursor detected"
fi

# Check for Claude Desktop
if [ -d "$HOME/Library/Application Support/Claude" ]; then
    IDE_DETECTED="claude"
    echo "✓ Claude Desktop detected"
fi

if [ "$IDE_DETECTED" = "none" ]; then
    echo "⚠️  No supported IDE detected (Cursor or Claude Desktop)"
    echo "   You can configure manually later"
fi

echo ""
echo "📦 Installation method:"
echo "  1. Install globally (recommended for CLI usage)"
echo "  2. Install in current project"
echo ""
read -p "Choose [1/2]: " install_choice

if [ "$install_choice" = "1" ]; then
    echo ""
    echo "Installing globally..."
    npm install -g @context-engine/mcp-server
    INSTALLED_GLOBALLY=true
else
    echo ""
    echo "Installing in current project..."
    npm install --save-dev @context-engine/mcp-server
    INSTALLED_GLOBALLY=false
fi

echo ""
echo "✅ Context Engine MCP Server installed!"
echo ""

# Configure IDE
if [ "$IDE_DETECTED" = "cursor" ]; then
    echo "📝 Cursor Configuration:"
    echo ""
    echo "Add this to ~/.cursor/mcp.json:"
    echo ""
    if [ "$INSTALLED_GLOBALLY" = true ]; then
        echo '{'
        echo '  "mcpServers": {'
        echo '    "context-engine": {'
        echo '      "command": "context-engine"'
        echo '    }'
        echo '  }'
        echo '}'
    else
        echo '{'
        echo '  "mcpServers": {'
        echo '    "context-engine": {'
        echo '      "command": "npx",'
        echo '      "args": ["@context-engine/mcp-server"]'
        echo '    }'
        echo '  }'
        echo '}'
    fi
    echo ""
    read -p "Would you like me to configure this automatically? [y/n]: " auto_config
    
    if [ "$auto_config" = "y" ]; then
        MCP_CONFIG="$HOME/.cursor/mcp.json"
        mkdir -p "$(dirname "$MCP_CONFIG")"
        
        if [ "$INSTALLED_GLOBALLY" = true ]; then
            cat > "$MCP_CONFIG" << 'EOF'
{
  "mcpServers": {
    "context-engine": {
      "command": "context-engine"
    }
  }
}
EOF
        else
            cat > "$MCP_CONFIG" << 'EOF'
{
  "mcpServers": {
    "context-engine": {
      "command": "npx",
      "args": ["@context-engine/mcp-server"]
    }
  }
}
EOF
        fi
        
        echo "✓ Cursor configured automatically"
        echo "⚠️  Restart Cursor for changes to take effect"
    fi
fi

if [ "$IDE_DETECTED" = "claude" ]; then
    echo "📝 Claude Desktop Configuration:"
    echo ""
    echo "Add this to ~/Library/Application Support/Claude/claude_desktop_config.json:"
    echo ""
    echo '{'
    echo '  "mcpServers": {'
    echo '    "context-engine": {'
    echo '      "command": "npx",'
    echo '      "args": ["@context-engine/mcp-server"]'
    echo '    }'
    echo '  }'
    echo '}'
    echo ""
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Restart your IDE (Cursor/Claude Desktop)"
echo "2. Try: 'What's my workflow status?'"
echo "3. Start with: 'I need to [your task]'"
echo ""
echo "Resources:"
echo "- Documentation: https://github.com/context-engine/mcp-server"
echo "- Examples: See EXAMPLES.md"
echo "- Support: https://discord.gg/context-engine"
echo ""
echo "Happy coding! 🚀"
