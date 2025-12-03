<template>
  <div class="component-palette">
    <h3>Components</h3>
    <div class="palette-items">
      <div
        v-for="item in paletteItems"
        :key="item.type"
        class="palette-item"
        draggable="true"
        @dragstart="handleDragStart($event, item)"
        @dragend="handleDragEnd"
      >
        <span class="item-icon">{{ item.icon }}</span>
        <span class="item-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- Ghost Element -->
    <Transition name="ghost-fade">
      <div
        v-if="ghostElement"
        class="ghost-element"
        :style="{
          left: ghostPosition.x + 'px',
          top: ghostPosition.y + 'px',
        }"
      >
        <span class="item-icon">{{ ghostElement.icon }}</span>
        <span class="item-label">{{ ghostElement.label }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElementType, type PaletteItem } from "@/types/types";

const paletteItems = ref<PaletteItem[]>([
  {
    type: ElementType.DIV,
    label: "Container",
    icon: "📦",
    defaultContent: "",
    defaultStyles: {
      width: "200px",
      height: "100px",
      backgroundColor: "#e0e0e0",
      border: "2px solid #999",
      borderRadius: "4px",
      padding: "10px",
    },
  },
  {
    type: ElementType.TEXT,
    label: "Text",
    icon: "📝",
    defaultContent: "Sample Text",
    defaultStyles: {
      fontSize: "16px",
      color: "#333",
      padding: "8px",
    },
  },
  {
    type: ElementType.BUTTON,
    label: "Button",
    icon: "🔘",
    defaultContent: "Click Me",
    defaultStyles: {
      backgroundColor: "#007bff",
      color: "#ffffff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: "bold",
    },
  },
  {
    type: ElementType.IMAGE,
    label: "Image",
    icon: "🖼️",
    defaultContent: "https://via.placeholder.com/150",
    defaultStyles: {
      width: "150px",
      height: "150px",
      border: "1px solid #ccc",
    },
  },
]);

// Ghost element state
const ghostElement = ref<PaletteItem | null>(null);
const ghostPosition = ref({ x: 0, y: 0 });

function handleDragStart(event: DragEvent, item: PaletteItem) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("application/json", JSON.stringify(item));

    // Ẩn default drag image của browser
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    event.dataTransfer.setDragImage(img, 0, 0);
  }

  // Tạo ghost element
  ghostElement.value = item;

  // Lắng nghe sự kiện di chuyển chuột để cập nhật vị trí ghost
  document.addEventListener("dragover", updateGhostPosition);
}

function updateGhostPosition(event: DragEvent) {
  ghostPosition.value = {
    x: event.clientX + 10, // Offset một chút để không che chuột
    y: event.clientY + 10,
  };
}

function handleDragEnd() {
  // Xóa ghost element
  ghostElement.value = null;

  // Cleanup event listener
  document.removeEventListener("dragover", updateGhostPosition);
}
</script>

<style scoped>
.component-palette {
  width: 250px;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
  padding: 20px;
  overflow-y: auto;
}

.component-palette h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.palette-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
  user-select: none;
}

.palette-item:hover {
  border-color: #007bff;
  background: #f0f8ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.15);
}

.palette-item:active {
  cursor: grabbing;
  transform: translateY(0);
}

.item-icon {
  font-size: 24px;
}

.item-label {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

/* Ghost Element */
.ghost-element {
  position: fixed;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  pointer-events: none;
  opacity: 0.8;
  z-index: 9999;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
  transform: rotate(-3deg);
  animation: ghostFloat 0.3s ease-in-out infinite alternate;
}

.ghost-element .item-icon {
  font-size: 24px;
}

.ghost-element .item-label {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

@keyframes ghostFloat {
  from {
    transform: rotate(-3deg) translateY(0);
  }
  to {
    transform: rotate(-3deg) translateY(-4px);
  }
}

/* Ghost fade transition */
.ghost-fade-enter-active,
.ghost-fade-leave-active {
  transition: opacity 0.2s ease;
}

.ghost-fade-enter-from,
.ghost-fade-leave-to {
  opacity: 0;
}
</style>
