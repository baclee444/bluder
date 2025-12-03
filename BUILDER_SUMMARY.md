# 🎯 Web Builder - Tóm tắt nhanh

## Luồng hoạt động chính

### 1. Thêm Element (Drag & Drop)

```
ComponentPalette → BuilderCanvas → builderStore.addElement()
```

- Kéo component từ palette
- Thả vào canvas
- Store tạo element mới với ID unique
- Auto-select element vừa tạo

### 2. Di chuyển Element

```
mousedown → mousemove → builderStore.updateElement() → mouseup
```

- Click vào element
- Tính dragOffset (khoảng cách từ click đến góc element)
- Di chuyển chuột → cập nhật position
- Thả chuột → kết thúc

### 3. Chỉnh sửa Properties

```
Click element → PropertiesPanel → builderStore.updateElementStyles/Content()
```

- Click element để select
- Properties panel hiển thị form
- Thay đổi input → cập nhật store
- Canvas tự động re-render

### 4. Export Code

```
CodeExporter → Đọc builderStore.allElements → Generate HTML/CSS
```

- Duyệt qua tất cả elements
- Generate HTML tags với class names
- Generate CSS với styles tương ứng
- Copy to clipboard

## Data Structure

```typescript
// Element trong store
interface BuilderElement {
  id: string                    // "element-1234567890-abc123"
  type: ElementType             // 'div' | 'text' | 'button' | 'image'
  content: string               // Nội dung text hoặc URL
  styles: StyleProperties       // CSS properties
  position: { x: number, y: number }  // Vị trí trên canvas
}

// Store state
{
  elements: BuilderElement[]
  selectedElementId: string | null
}
```

## Components

1. **ComponentPalette** - Danh sách components có thể kéo
2. **BuilderCanvas** - Canvas để thả và di chuyển elements
3. **PropertiesPanel** - Form chỉnh sửa properties
4. **CodeExporter** - Modal export HTML/CSS
5. **builderStore** - Pinia store quản lý state

## Câu hỏi quan trọng cần trả lời

### Tính năng cốt lõi

1. Có cần **nested components** (element trong element) không?
2. Có cần **Undo/Redo** không?
3. Có cần **Save/Load projects** không?
4. Có cần **Copy/Paste** elements không?

### UX Improvements

5. Có cần **Ghost Element** khi drag không?
6. Có cần **keyboard shortcuts** không?
7. Có cần **alignment guides** không?
8. Có cần **multi-select** không?

### Export

9. Có cần export sang **React/Vue components** không?
10. Có cần export với **Tailwind/Bootstrap** không?

## Đề xuất cải tiến ngay

### Quick Wins (Dễ implement, impact cao)

- ✅ Thêm Ghost Element khi drag
- ✅ Keyboard shortcuts: Delete, Arrow keys
- ✅ Save/Load to LocalStorage
- ✅ Copy/Paste elements (Ctrl+C/V)

### Medium Priority

- ⚠️ Undo/Redo với history stack
- ⚠️ Z-index management (Bring to Front/Back)
- ⚠️ Alignment guides khi di chuyển
- ⚠️ Layers panel

### Advanced Features

- 💡 Nested components với tree structure
- 💡 Responsive preview (Mobile/Tablet/Desktop)
- 💡 Real-time collaboration
- 💡 Component library mở rộng

---

📄 **Xem chi tiết**: [builder_flow_analysis.md](./builder_flow_analysis.md)
