# 🎨 Vue.js Drag-and-Drop HTML/CSS Builder

A learning project demonstrating how to build a visual page builder using Vue.js, TypeScript, and Pinia.

## ✨ Features

- **Drag & Drop Interface** - Drag HTML elements from palette onto canvas
- **Real-time Styling** - Edit CSS properties and see changes instantly
- **Element Management** - Select, edit, and delete elements
- **Code Export** - Generate clean HTML and CSS code
- **Modern UI** - Beautiful gradient header and intuitive layout

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19.0 or higher

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5174 in your browser.

## 📖 How to Use

### 1. Add Elements

- Drag components from the left sidebar (Container, Text, Button, Image)
- Drop them onto the canvas
- Elements will appear at the drop position

### 2. Style Elements

- Click any element to select it
- Use the properties panel on the right to edit:
  - Content (text, image URL)
  - Width & Height
  - Colors (background, text)
  - Padding & Border
  - Font size
  - And more!

### 3. Export Code

- Click "Export Code" button in the header
- Copy the generated HTML and CSS
- Use in your own projects

### 4. Clear Canvas

- Click "Clear All" to remove all elements
- Confirm the action

## 🏗️ Project Structure

```
src/
├── components/
│   ├── BuilderCanvas.vue      # Main canvas with drag-and-drop
│   ├── ComponentPalette.vue   # Draggable element palette
│   ├── PropertiesPanel.vue    # Styling controls
│   └── CodeExporter.vue        # HTML/CSS export modal
├── stores/
│   └── builderStore.ts         # Pinia state management
├── types/
│   └── types.ts                # TypeScript definitions
└── App.vue                     # Main application
```

## 🎓 Learning Points

This project teaches:

- HTML5 Drag-and-Drop API
- Vue 3 Composition API
- Pinia state management
- TypeScript with Vue
- Dynamic component rendering
- CSS-in-JS styling
- Code generation

## 🔧 Troubleshooting

### Elements won't drop

- Make sure you're dragging onto the canvas area
- Check browser console for errors

### Styles not updating

- Ensure an element is selected (blue outline)
- Try clicking the element again

### Export shows no code

- Add elements to the canvas first
- Verify elements are visible on canvas

## 🚀 Next Steps

Enhance the builder by adding:

- More element types (headings, links, lists)
- Resize handles for elements
- Undo/Redo functionality
- Save/Load projects
- Responsive design preview
- Flexbox/Grid controls

## 📝 License

This is a learning project - feel free to use and modify as needed!

## 🤝 Contributing

This is a learning project, but suggestions and improvements are welcome!

---

Built with ❤️ using Vue.js, TypeScript, and Pinia
