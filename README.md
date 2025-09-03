# Canary NPC Creator

A modern, web-based visual editor for creating NPCs (Non-Player Characters) for Canary OTServ. This tool provides an intuitive interface to configure all aspects of NPCs and generates ready-to-use Lua scripts.

![Canary NPC Creator](assets/imgs/bg.png)

## 🎯 Features

### Visual Character Editor
- **Outfit Selection**: Choose from 249+ available outfits for male/female characters
- **Mount System**: Select from available mounts with enable/disable toggle
- **Color Customization**: Full color palette for head, body, legs, and feet
- **Addon System**: Support for Addon 1, Addon 2, or both (values: 0, 1, 2, 3)
- **Real-time Preview**: Live character image updates as you make changes

### NPC Configuration
- **Basic Settings**: Name, health, walk interval, walk radius, speed, floor change
- **Shop System**: Configure items for buying and selling with prices
- **Conversation System**: Custom greet, bye, walkaway, and sell messages
- **Keywords System**: Add custom keyword-response pairs for NPC interactions

### Code Generation
- **Lua Script Export**: Generate complete NPC scripts compatible with Canary
- **Download Functionality**: Save generated scripts as .lua files
- **Template-based**: Uses proper Canary NPC structure and syntax

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, can run directly from file system)

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start creating your NPC!

### Usage
1. **Configure Appearance**: Select outfit, colors, addons, and mount in the "Basic" tab
2. **Set up Shop** (optional): Add items for buying/selling in the "Buy/Sell" tab
3. **Configure Messages**: Customize NPC dialogue in the "Talking" tab
4. **Add Keywords** (optional): Create custom responses in the "Keywords" tab
5. **Generate Script**: Click "Generate" to create the Lua script
6. **Download**: Save the generated .lua file to your server's NPC directory

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
- **Buy/Sell**: Shop configuration with item management
- **Talking**: Message customization with variable support
- **Keywords**: Custom keyword-response system

### Key Components
- **Character Preview**: Real-time outfit visualization
- **Color Palette**: Visual color selection tool
- **Item Search**: Autocomplete search for items by name or ID
- **Data Tables**: Organized display of shop items and keywords

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
- **Total Items**: 406 items
- **Categories**: Liquids, quest items, natural tiles, magic fields, etc.
- **Format**: XML with ID, name, and attributes

### Outfits Database
- **Total Outfits**: 249 outfits
- **Types**: Female (type=0), Male (type=1)
- **Categories**: Free, premium, quest-based, store items

### Mounts Database
- Various mounts with client IDs and names
- Compatible with Canary mount system

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
- **Real-time Preview**: See changes instantly
- **Complete NPC System**: All Canary NPC features supported
- **User-friendly Interface**: Intuitive design with dark theme
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

1. **Preview First**: Always check the character preview before generating
2. **Test Keywords**: Verify keyword responses work as expected
3. **Backup Scripts**: Keep copies of your generated NPC scripts
4. **Item IDs**: Use the search function to find correct item IDs
5. **Mount Selection**: Remember to check the mount checkbox to enable mounts

---

**Created for the Canary OTServ community** 🕊️

For support or questions, please open an issue in this repository. 