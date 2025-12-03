# 🎭 Ghost Element trong Web Builder

## Ghost Element là gì?

**Ghost Element** (phần tử ma) là một bản sao bán trong suốt của component xuất hiện khi người dùng kéo (drag) component trong web builder. Nó cải thiện trải nghiệm người dùng bằng cách:

- ✅ Hiển thị rõ vị trí sẽ thả component
- ✅ Cung cấp feedback trực quan
- ✅ Tránh làm mất component gốc khi kéo
- ✅ Làm cho thao tác kéo-thả mượt mà hơn

## 📁 Files Demo

Tôi đã tạo 4 files demo để minh họa Ghost Element:

### 1. `GhostElementDemo.vue`

Demo tương tác đầy đủ với:

- Component palette để kéo
- Drop zone để thả
- Ghost element theo chuột
- Giải thích chi tiết

### 2. `GhostComparison.vue`

So sánh trực quan giữa:

- ❌ Không có Ghost Element
- ✅ Có Ghost Element
- Code examples

### 3. `GhostShowcase.vue`

Tổng hợp tất cả với 4 tabs:

- 📚 Giới thiệu
- 🎮 Demo tương tác
- ⚖️ So sánh
- 💻 Code

### 4. `TreeNode.vue` & `TreeDemo.vue`

Bonus: Component đệ quy (từ câu hỏi trước)

## 🚀 Cách sử dụng

### Option 1: Xem Showcase (Khuyến nghị)

```vue
<template>
  <GhostShowcase />
</template>

<script setup>
import GhostShowcase from "./components/GhostShowcase.vue";
</script>
```

### Option 2: Xem từng demo riêng

```vue
<template>
  <div>
    <!-- Demo tương tác -->
    <GhostElementDemo />

    <!-- Hoặc so sánh -->
    <GhostComparison />
  </div>
</template>

<script setup>
import GhostElementDemo from "./components/GhostElementDemo.vue";
import GhostComparison from "./components/GhostComparison.vue";
</script>
```

## 💻 Implementation

### 1. Setup State

```typescript
import { ref } from "vue";

interface Component {
  id: string;
  label: string;
  icon: string;
}

// Ghost element state
const ghostElement = ref<Component | null>(null);
const ghostPosition = ref({ x: 0, y: 0 });
```

### 2. Handle Drag Start

```typescript
const handleDragStart = (event: DragEvent, component: Component) => {
  // Tạo ghost element
  ghostElement.value = component;

  // Ẩn default drag image của browser
  if (event.dataTransfer) {
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    event.dataTransfer.setDragImage(img, 0, 0);
  }

  // Lắng nghe sự kiện di chuyển chuột
  document.addEventListener("dragover", updateGhostPosition);
};
```

### 3. Update Ghost Position

```typescript
const updateGhostPosition = (event: DragEvent) => {
  ghostPosition.value = {
    x: event.clientX + 10, // Offset để không che chuột
    y: event.clientY + 10,
  };
};
```

### 4. Handle Drag End

```typescript
const handleDragEnd = () => {
  // Xóa ghost element
  ghostElement.value = null;

  // Cleanup event listener
  document.removeEventListener("dragover", updateGhostPosition);
};
```

### 5. Template

```vue
<!-- Draggable component -->
<div
  draggable="true"
  @dragstart="handleDragStart($event, component)"
  @dragend="handleDragEnd"
>
  {{ component.label }}
</div>

<!-- Ghost Element -->
<div
  v-if="ghostElement"
  class="ghost-element"
  :style="{
    left: ghostPosition.x + 'px',
    top: ghostPosition.y + 'px',
  }"
>
  {{ ghostElement.label }}
</div>
```

### 6. CSS Styling

```css
.ghost-element {
  position: fixed; /* Theo chuột */
  pointer-events: none; /* Không tương tác */
  opacity: 0.7; /* Bán trong suốt */
  z-index: 9999; /* Luôn ở trên */
  transform: rotate(-5deg); /* Nghiêng nhẹ */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

  /* Animation cho sinh động */
  animation: ghostFloat 0.3s ease-in-out infinite alternate;
}

@keyframes ghostFloat {
  from {
    transform: rotate(-5deg) translateY(0);
  }
  to {
    transform: rotate(-5deg) translateY(-4px);
  }
}
```

## 🎯 Đặc điểm quan trọng

### 1. Position: Fixed

- Ghost element phải dùng `position: fixed` để theo chuột
- Cập nhật `left` và `top` theo `clientX`, `clientY`

### 2. Pointer Events: None

- Phải set `pointer-events: none` để ghost không chặn sự kiện chuột
- Nếu không, sẽ gây lỗi khi drop

### 3. Z-Index cao

- Set `z-index: 9999` để luôn hiển thị trên cùng
- Đảm bảo ghost không bị che bởi element khác

### 4. Opacity

- Thường dùng `opacity: 0.5 - 0.7`
- Đủ trong suốt để thấy phía dưới
- Đủ rõ để nhận biết component

### 5. Cleanup

- **QUAN TRỌNG**: Phải remove event listener trong `dragend`
- Tránh memory leak

## ⚠️ Lỗi thường gặp

### 1. Ghost không theo chuột

```typescript
// ❌ SAI: Không update position
const handleDragStart = (event, component) => {
  ghostElement.value = component;
  // Thiếu addEventListener
};

// ✅ ĐÚNG: Có update position
const handleDragStart = (event, component) => {
  ghostElement.value = component;
  document.addEventListener("dragover", updateGhostPosition);
};
```

### 2. Ghost chặn sự kiện drop

```css
/* ❌ SAI: Không set pointer-events */
.ghost-element {
  position: fixed;
  opacity: 0.7;
}

/* ✅ ĐÚNG: Set pointer-events: none */
.ghost-element {
  position: fixed;
  opacity: 0.7;
  pointer-events: none; /* QUAN TRỌNG */
}
```

### 3. Memory leak

```typescript
// ❌ SAI: Không cleanup
const handleDragEnd = () => {
  ghostElement.value = null;
  // Thiếu removeEventListener
};

// ✅ ĐÚNG: Có cleanup
const handleDragEnd = () => {
  ghostElement.value = null;
  document.removeEventListener("dragover", updateGhostPosition);
};
```

## 📊 So sánh

| Tiêu chí           | Không có Ghost | Có Ghost      |
| ------------------ | -------------- | ------------- |
| Trải nghiệm        | ❌ Kém         | ✅ Tốt        |
| Thấy vị trí thả    | ❌ Không       | ✅ Có         |
| Feedback trực quan | ❌ Không       | ✅ Có         |
| Độ phức tạp code   | ✅ Đơn giản    | ⚠️ Trung bình |

## 🎨 Ví dụ thực tế

Ghost Element được sử dụng trong:

- **Figma**: Kéo component từ Assets
- **Webflow**: Kéo element vào canvas
- **Framer**: Kéo component từ sidebar
- **Notion**: Kéo block để sắp xếp
- **Trello**: Kéo card giữa các list

## 📚 Tài liệu tham khảo

- [MDN: HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [Vue.js: Event Handling](https://vuejs.org/guide/essentials/event-handling.html)
- [CSS: pointer-events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)

## 🤝 Đóng góp

Nếu bạn có ý tưởng cải thiện demo hoặc tìm thấy bug, hãy tạo issue hoặc pull request!

---

Made with ❤️ for learning Web Builder concepts
