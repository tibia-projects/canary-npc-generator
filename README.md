# Canary NPC Maker

A modern, web-based visual editor for creating NPCs (Non-Player Characters) for Canary OTServ. This tool provides an intuitive interface to configure all aspects of NPCs and generates ready-to-use Lua scripts.

**Developed by**: Eratsu feat. Claude  
**Version**: v1.0.0  
**Compatibility**: Latest Canary versions

![Canary NPC Creator](assets/imgs/bg.png)

## 🎯 Features

### Visual Character Editor
- **Outfit Selection**: Choose from 249+ available outfits for male/female characters
- **Mount System**: Select from available mounts with enable/disable toggle
- **Color Customization**: Full color palette for head, body, legs, and feet
- **Random Colors**: Generate random colors for all body parts with one click
- **Addon System**: Support for Addon 1, Addon 2, or both (values: 0, 1, 2, 3)
- **Real-time Preview**: Live character image updates as you make changes

### NPC Configuration
- **Basic Settings**: Name, health, walk interval, walk radius, speed, floor change
- **Shop System**: Configure items for buying and selling with prices
- **Conversation System**: Custom greet, bye, walkaway, and sell messages
- **Keywords System**: Add custom keyword-response pairs for NPC interactions

### Code Generation & File Management
- **New Project**: Reset all data with confirmation dialog
- **Open Existing**: Load and edit existing NPC .lua files
- **Lua Script Export**: Generate complete NPC scripts compatible with Canary
- **Download Functionality**: Save generated scripts as .lua files
- **Template-based**: Uses proper Canary NPC structure and syntax
- **Help System**: Built-in help modal with documentation

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, can run directly from file system)

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start creating your NPC!

### Usage
1. **Start New or Open Existing**: Use "New" for fresh NPC or "Open" to load existing .lua file
2. **Configure Appearance**: Select outfit, colors, addons, and mount in the "Basic" tab
3. **Use Random Colors**: Click "Random" button for instant color randomization
4. **Set up Shop** (optional): Add items for buying/selling in the "Buy/Sell" tab
5. **Configure Messages**: Customize NPC dialogue in the "Talking" tab
6. **Add Keywords** (optional): Create custom responses in the "Keywords" tab
7. **Generate Script**: Click "Generate" to create the Lua script
8. **Download**: Save the generated .lua file to your server's NPC directory
9. **Get Help**: Click "Help" for detailed information and tips

## 📁 Project Structure

```
itemeditor/
├── index.html              # Main application file
├── scripts.js              # Outfit and mount management
├── looktype.js             # Character appearance and colors
├── looktype.html           # Color palette component
├── looktype.css            # Styling for looktype component
├── sell-items.js           # Shop selling functionality
├── buy-items.js            # Shop buying functionality
├── keywords.js             # Keyword system management
├── talking.js              # Conversation messages
├── npc-generator.js        # Lua script generation
├── new-npc.js              # New project functionality
├── open-npc.js             # Open existing files functionality
├── help-modal.js           # Help system
├── colors.html             # Color palette reference
├── npc-example.lua         # Template structure
├── assets/
│   └── imgs/               # Background images
└── xml/
    ├── items.xml           # Items database (406 items)
    ├── outfits.xml         # Outfits database (249 outfits)
    └── mounts.xml          # Mounts database
```

## 🎨 Interface Overview

### Navigation Tabs
- **Basic**: Character appearance, outfit selection, basic NPC settings
- **Buy/Sell**: Shop configuration with item management (unified buy/sell entries)
- **Talking**: Message customization with variable support
- **Keywords**: Custom keyword-response system

### Top Menu
- **New**: Reset all data with confirmation dialog
- **Open**: Load existing NPC .lua files with automatic field population
- **Generate**: Create and export Lua scripts
- **Help**: Access documentation and tool information

### Key Components
- **Character Preview**: Real-time outfit visualization with live updates
- **Color Palette**: Visual color selection tool with random color generator
- **Item Search**: Autocomplete search for items by name or ID
- **Data Tables**: Organized display of shop items and keywords
- **File Management**: Import/export system for .lua files
- **Modal System**: User-friendly dialogs for confirmations and information

## 🆕 Latest Updates (v1.0.0)

### New Features
- **File Management System**: Complete New/Open functionality
- **Random Color Generator**: Instant randomization for all body parts
- **Smart Shop Parser**: Handles unified buy/sell entries correctly
- **Visual Tab Indicators**: Active tab highlighting with CSS
- **Help System**: Built-in documentation and information modal
- **Error Handling**: Validation for invalid NPC files
- **Improved UX**: Better visual feedback and user experience

### Bug Fixes
- **Addon System**: Corrected values (0=none, 1=addon1, 2=addon2, 3=both)
- **Mount System**: Proper enable/disable with ID management
- **Shop Generation**: Unified entries for items with both buy/sell prices
- **File Loading**: Robust parser for existing NPC .lua files
- **Global Functions**: Proper scope management for cross-file functionality

## 🔧 Technical Details

### Character Image URL Structure
```
https://outfit-images-oracle.ots.me/latest_walk/animoutfit.php?id={looktype}&addons={addons}&head={head}&body={body}&legs={legs}&feet={feet}&mount={mount}&direction=3
```

### Addon System Logic
- **0**: No addons
- **1**: Addon 1 only
- **2**: Addon 2 only  
- **3**: Both addons (1 + 2)

### Mount System Logic
- **0**: No mount (default or when checkbox unchecked)
- **{mount_id}**: Specific mount ID when checkbox is checked

### Message Variables
- `|PLAYERNAME|`: Player's name
- `{canary}`: Server name placeholder
- `%ix`: Item quantity (sell messages)
- `%s`: Item name (sell messages)
- `%i`: Gold amount (sell messages)

## 📊 Database Information

### Items Database
- **Source**: items.xml loading all items dynamically
- **Categories**: Liquids, quest items, natural tiles, magic fields, etc.
- **Format**: XML with ID, name, and attributes
- **Search**: Autocomplete by name or ID

### Outfits Database
- **Source**: outfits.xml (male/female) with addons
- **Types**: Female (type=0), Male (type=1)
- **Categories**: Free, premium, quest-based, store items
- **Total**: 249+ outfits available

### Mounts Database
- **Source**: mounts.xml with enable/disable toggle
- **Features**: Client IDs, names, and types
- **Integration**: Compatible with Canary mount system

## 🛠️ Generated Script Structure

The generated Lua scripts follow this structure:
1. **NPC Configuration**: Name, health, appearance, flags
2. **Shop Definition**: Buy/sell items with prices
3. **Event Handlers**: Standard Canary NPC events
4. **Custom Keywords**: User-defined keyword responses
5. **Message Callbacks**: Greet, farewell, and interaction messages
6. **Registration**: NPC type registration with Canary

## 🎯 Example Generated Code

```lua
local npcName = "Shopkeeper"

local npcType = Game.createNpcType(npcName)
local npcConfig = {}

npcConfig.name = npcName
npcConfig.description = npcName

npcConfig.health = 100
npcConfig.maxHealth = 100
npcConfig.walkInterval = 1500
npcConfig.walkRadius = 2

npcConfig.outfit = {
    lookType = 136,
    lookHead = 0,
    lookBody = 0,
    lookLegs = 0,
    lookFeet = 0,
    lookAddons = 0,
}

-- Shop, handlers, and callbacks...
-- (Full structure based on user configuration)

npcType:register(npcConfig)
```

## 🌟 Features Highlights

- **No Installation Required**: Runs directly in web browser
- **Real-time Preview**: See changes instantly with live character updates
- **Complete NPC System**: All Canary NPC features supported
- **File Management**: Create new, open existing, and export NPC files
- **Smart Shop System**: Unified buy/sell entries for items
- **User-friendly Interface**: Intuitive design with dark theme and visual feedback
- **Export Ready**: Generated scripts work immediately in Canary
- **Extensible**: Easy to add new features or modify existing ones

## 🤝 Contributing

This project is open for contributions! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Compatibility

- **Server**: Canary OTServ
- **Format**: Lua scripts
- **Version**: Compatible with latest Canary versions

## 💡 Tips

1. **File Management**: Use "New" to start fresh or "Open" to edit existing NPCs
2. **Preview First**: Always check the character preview before generating
3. **Random Colors**: Use the "Random" button for quick color experimentation
4. **Shop Items**: Items can have both buy and sell prices in unified entries
5. **Test Keywords**: Verify keyword responses work as expected
6. **Backup Scripts**: Keep copies of your generated NPC scripts
7. **Item Search**: Use autocomplete search to find items by name or ID
8. **Mount System**: Remember to check the mount checkbox to enable mounts
9. **Visual Feedback**: Active tabs are highlighted for better navigation
10. **Help Available**: Click "Help" button for detailed information and guidance

---

**Created for the Canary OTServ community** 🕊️

**Developed by**: Eratsu feat. Claude  
**Version**: v1.0.0  
**Discord**: [discord.gg/opentibiabr](https://discord.gg/opentibiabr)

For support or questions, please open an issue in this repository. 