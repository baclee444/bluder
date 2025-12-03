# 🎉 Tính năng mới: Ghost Element & Save/Load Projects

## ✨ Tính năng 1: Ghost Element

### Mô tả

Khi kéo component từ palette, bạn sẽ thấy một **bản sao bán trong suốt** (ghost element) theo con trỏ chuột, giúp bạn thấy rõ vị trí sẽ thả component.

### Đặc điểm

- 🎨 **Bán trong suốt** với gradient đẹp mắt
- 🎭 **Animation nhẹ nhàng** (float effect)
- 🖱️ **Theo chuột** với offset nhỏ
- ⚡ **Smooth transition** khi xuất hiện/biến mất

### Cách sử dụng

1. Kéo bất kỳ component nào từ palette bên trái
2. Quan sát ghost element xuất hiện và theo chuột
3. Thả vào canvas để tạo element

### Technical Details

- **File**: `ComponentPalette.vue`
- **State**: `ghostElement`, `ghostPosition`
- **Events**: `dragstart`, `dragover`, `dragend`
- **CSS**: Fixed position, pointer-events: none, z-index: 9999

---

## 💾 Tính năng 2: Save/Load Projects

### Mô tả

Lưu và tải lại projects của bạn với nhiều cách khác nhau: localStorage, download JSON, hoặc import JSON file.

### Các nút chức năng

#### 1. 💾 Save

- **Chức năng**: Lưu project vào localStorage của browser
- **Cách dùng**: Click nút "Save" trên header
- **Kết quả**: Alert "✅ Project saved successfully!"
- **Lưu ý**: Data chỉ lưu trên browser hiện tại

#### 2. 📂 Load

- **Chức năng**: Tải lại project đã lưu từ localStorage
- **Cách dùng**: Click nút "Load" trên header
- **Confirmation**: Nếu có thay đổi chưa lưu, sẽ hỏi xác nhận
- **Kết quả**: Restore tất cả elements đã lưu

#### 3. 📤 Export Code

- **Chức năng**: Export HTML/CSS code (tính năng cũ)
- **Cách dùng**: Click nút "Export Code"
- **Kết quả**: Modal hiển thị HTML và CSS code

#### 4. ⬇️ Download JSON

- **Chức năng**: Download project dưới dạng JSON file
- **Cách dùng**: Click nút "Download JSON"
- **Kết quả**: File `builder-project-[timestamp].json` được download
- **Lợi ích**: Backup, share với người khác, version control

#### 5. ⬆️ Import JSON

- **Chức năng**: Import project từ JSON file
- **Cách dùng**: Click nút "Import JSON" → Chọn file .json
- **Confirmation**: Nếu có thay đổi chưa lưu, sẽ hỏi xác nhận
- **Kết quả**: Load project từ file

#### 6. 🗑️ Clear All

- **Chức năng**: Xóa tất cả elements (tính năng cũ)
- **Cách dùng**: Click nút "Clear All"
- **Confirmation**: Hỏi xác nhận trước khi xóa

### Auto-load

- Project tự động load từ localStorage khi mở app
- Không cần click "Load" mỗi lần refresh

### Workflow đề xuất

#### Workflow 1: Làm việc hàng ngày

```
1. Mở app → Auto-load project cũ
2. Chỉnh sửa design
3. Click "💾 Save" định kỳ
4. Khi xong, click "⬇️ Download JSON" để backup
```

#### Workflow 2: Share với team

```
1. Hoàn thành design
2. Click "⬇️ Download JSON"
3. Gửi file .json cho teammate
4. Teammate click "⬆️ Import JSON" để mở
```

#### Workflow 3: Version control

```
1. Mỗi milestone, download JSON với tên có ý nghĩa
   - builder-project-v1-homepage.json
   - builder-project-v2-with-footer.json
2. Có thể quay lại version cũ bằng Import
```

---

## 🔧 Technical Implementation

### builderStore.ts - New Actions

```typescript
// Save to localStorage
saveProject(): boolean

// Load from localStorage
loadProject(): boolean

// Export to JSON string
exportProject(): string

// Import from JSON string
importProject(jsonString: string): boolean

// Check if has unsaved changes
hasUnsavedChanges(): boolean
```

### Data Structure

```json
{
  "elements": [
    {
      "id": "element-1234567890-abc123",
      "type": "button",
      "content": "Click Me",
      "styles": {
        "backgroundColor": "#007bff",
        "color": "#ffffff",
        "padding": "10px 20px",
        "position": "absolute",
        "top": "100px",
        "left": "200px"
      },
      "position": {
        "x": 200,
        "y": 100
      }
    }
  ],
  "timestamp": "2025-12-03T10:00:00.000Z",
  "version": "1.0"
}
```

### localStorage Key

```
Key: "builder-project"
```

---

## 🎯 Use Cases

### Use Case 1: Học sinh làm bài tập

- Làm dở, save lại
- Tắt máy, về nhà
- Mở lại → auto-load → tiếp tục làm

### Use Case 2: Designer làm mockup

- Tạo nhiều versions
- Download JSON cho mỗi version
- So sánh bằng cách import từng file

### Use Case 3: Team collaboration

- Designer tạo design → Download JSON
- Developer import → Xem structure
- Feedback → Designer update → Share lại

### Use Case 4: Portfolio

- Lưu các projects đã làm
- Organize bằng file names
- Demo cho client bằng cách import

---

## ⚠️ Lưu ý quan trọng

### localStorage Limitations

- ✅ **Pros**: Tự động, không cần server, nhanh
- ❌ **Cons**:
  - Chỉ lưu trên browser hiện tại
  - Clear browser data → mất hết
  - Giới hạn ~5-10MB

### Best Practices

1. **Save thường xuyên**: Click "💾 Save" mỗi khi có thay đổi quan trọng
2. **Backup định kỳ**: Download JSON file để backup
3. **Đặt tên file rõ ràng**: Khi download, rename file có ý nghĩa
4. **Version control**: Giữ nhiều versions cho các milestones

### Troubleshooting

**Q: Tại sao Load không hoạt động?**

- A: Kiểm tra xem đã Save chưa, hoặc browser đã clear data

**Q: Import JSON báo lỗi?**

- A: File JSON bị corrupt hoặc không đúng format

**Q: Mất data sau khi refresh?**

- A: Chưa click Save trước khi refresh

**Q: Muốn chuyển sang browser khác?**

- A: Download JSON → Mở browser khác → Import JSON

---

## 🚀 Next Steps

### Tính năng có thể thêm sau:

- [ ] Auto-save mỗi 30s
- [ ] Multiple save slots (Project 1, 2, 3...)
- [ ] Cloud sync với backend
- [ ] Undo/Redo history
- [ ] Keyboard shortcuts (Ctrl+S để save)

---

## 📊 Comparison

| Feature         | Before      | After                 |
| --------------- | ----------- | --------------------- |
| Drag feedback   | ❌ Không có | ✅ Ghost Element      |
| Save project    | ❌ Không có | ✅ localStorage       |
| Backup          | ❌ Không có | ✅ Download JSON      |
| Share           | ❌ Khó      | ✅ Import/Export JSON |
| Auto-load       | ❌ Không có | ✅ Có                 |
| Unsaved warning | ❌ Không có | ✅ Có                 |

---

Made with ❤️ - Happy Building! 🏗️
