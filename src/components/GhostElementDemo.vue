<template>
  <div class="ghost-demo">
    <h1>Ghost Element trong Web Builder</h1>

    <div class="demo-container">
      <!-- Panel giải thích -->
      <div class="info-panel">
        <h2>📚 Ghost Element là gì?</h2>
        <div class="info-content">
          <p class="definition">
            <strong>Ghost Element</strong> (phần tử ma) là bản sao bán trong suốt của component xuất
            hiện khi bạn kéo (drag) component trong builder.
          </p>

          <h3>🎯 Mục đích:</h3>
          <ul>
            <li>Hiển thị vị trí sẽ thả component</li>
            <li>Cải thiện trải nghiệm kéo-thả</li>
            <li>Feedback trực quan cho người dùng</li>
            <li>Tránh làm mất component gốc khi kéo</li>
          </ul>

          <h3>✨ Đặc điểm:</h3>
          <ul>
            <li><strong>Bán trong suốt:</strong> opacity: 0.5-0.7</li>
            <li><strong>Theo chuột:</strong> position: fixed</li>
            <li><strong>Không tương tác:</strong> pointer-events: none</li>
            <li><strong>Tự động xóa:</strong> sau khi drop</li>
          </ul>

          <h3>🔧 Cách hoạt động:</h3>
          <ol>
            <li><strong>dragstart:</strong> Tạo ghost element</li>
            <li><strong>drag:</strong> Cập nhật vị trí theo chuột</li>
            <li><strong>dragend:</strong> Xóa ghost element</li>
          </ol>
        </div>
      </div>

      <!-- Demo area -->
      <div class="demo-panel">
        <h2>🎮 Thử nghiệm (Kéo các component)</h2>

        <!-- Component palette -->
        <div class="component-palette">
          <h3>Component Palette</h3>
          <div class="palette-items">
            <div
              v-for="component in components"
              :key="component.id"
              class="palette-item"
              draggable="true"
              @dragstart="handleDragStart($event, component)"
              @dragend="handleDragEnd"
            >
              <span class="icon">{{ component.icon }}</span>
              <span class="label">{{ component.label }}</span>
            </div>
          </div>
        </div>

        <!-- Drop zone -->
        <div
          class="drop-zone"
          @dragover.prevent="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          :class="{ 'drag-over': isDragOver }"
        >
          <div v-if="droppedComponents.length === 0" class="placeholder">
            <p>👆 Kéo component vào đây</p>
            <p class="hint">Quan sát Ghost Element khi kéo</p>
          </div>

          <div v-for="(comp, index) in droppedComponents" :key="index" class="dropped-component">
            <span class="icon">{{ comp.icon }}</span>
            <span class="label">{{ comp.label }}</span>
            <button @click="removeComponent(index)" class="remove-btn">×</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ghost Element - Đây là phần tử ma -->
    <div
      v-if="ghostElement"
      class="ghost-element"
      :style="{
        left: ghostPosition.x + 'px',
        top: ghostPosition.y + 'px',
      }"
    >
      <span class="icon">{{ ghostElement.icon }}</span>
      <span class="label">{{ ghostElement.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Component {
  id: string;
  label: string;
  icon: string;
}

// Danh sách components có thể kéo
const components = ref<Component[]>([
  { id: "button", label: "Button", icon: "🔘" },
  { id: "input", label: "Input", icon: "📝" },
  { id: "card", label: "Card", icon: "🃏" },
  { id: "image", label: "Image", icon: "🖼️" },
  { id: "text", label: "Text", icon: "📄" },
  { id: "container", label: "Container", icon: "📦" },
]);

// Ghost element state
const ghostElement = ref<Component | null>(null);
const ghostPosition = ref({ x: 0, y: 0 });

// Drop zone state
const isDragOver = ref(false);
const droppedComponents = ref<Component[]>([]);

// Xử lý khi bắt đầu kéo
const handleDragStart = (event: DragEvent, component: Component) => {
  // Tạo ghost element
  ghostElement.value = component;

  // Ẩn default drag image của browser
  if (event.dataTransfer) {
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    event.dataTransfer.setDragImage(img, 0, 0);
    event.dataTransfer.effectAllowed = "copy";
  }

  // Lắng nghe sự kiện di chuyển chuột để cập nhật vị trí ghost
  document.addEventListener("dragover", updateGhostPosition);
};

// Cập nhật vị trí ghost element theo chuột
const updateGhostPosition = (event: DragEvent) => {
  ghostPosition.value = {
    x: event.clientX + 10, // Offset một chút để không che chuột
    y: event.clientY + 10,
  };
};

// Xử lý khi kết thúc kéo
const handleDragEnd = () => {
  // Xóa ghost element
  ghostElement.value = null;
  document.removeEventListener("dragover", updateGhostPosition);
};

// Xử lý khi kéo qua drop zone
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

// Xử lý khi rời khỏi drop zone
const handleDragLeave = () => {
  isDragOver.value = false;
};

// Xử lý khi thả component
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  if (ghostElement.value) {
    // Thêm component vào drop zone
    droppedComponents.value.push({ ...ghostElement.value });
  }
};

// Xóa component đã thả
const removeComponent = (index: number) => {
  droppedComponents.value.splice(index, 1);
};
</script>

<style scoped>
.ghost-demo {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: 700;
}

.demo-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* Info Panel */
.info-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  font-size: 20px;
  margin-bottom: 16px;
  font-weight: 600;
}

.info-content {
  color: #555;
  line-height: 1.6;
}

.definition {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 15px;
}

.info-content h3 {
  color: #34495e;
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 12px;
  font-weight: 600;
}

.info-content ul,
.info-content ol {
  padding-left: 24px;
  margin-bottom: 16px;
}

.info-content li {
  margin-bottom: 8px;
  font-size: 14px;
}

.info-content strong {
  color: #2c3e50;
  font-weight: 600;
}

/* Demo Panel */
.demo-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.component-palette {
  margin-bottom: 24px;
}

.component-palette h3 {
  font-size: 16px;
  color: #34495e;
  margin-bottom: 12px;
  font-weight: 600;
}

.palette-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.palette-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

.palette-item:active {
  cursor: grabbing;
}

.palette-item .icon {
  font-size: 20px;
}

.palette-item .label {
  font-size: 14px;
  font-weight: 500;
}

/* Drop Zone */
.drop-zone {
  min-height: 300px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
}

.drop-zone.drag-over {
  background: #e7f3ff;
  border-color: #667eea;
  border-style: solid;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  color: #adb5bd;
}

.placeholder p {
  margin: 8px 0;
  font-size: 18px;
}

.placeholder .hint {
  font-size: 14px;
  color: #ced4da;
}

.dropped-component {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.dropped-component:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dropped-component .icon {
  font-size: 20px;
}

.dropped-component .label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.remove-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #c82333;
  transform: scale(1.1);
}

/* Ghost Element - ĐÂY LÀ PHẦN TỬ MA */
.ghost-element {
  position: fixed;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  pointer-events: none; /* Không tương tác với chuột */
  opacity: 0.7; /* Bán trong suốt */
  z-index: 9999; /* Luôn ở trên cùng */
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
  transform: rotate(-5deg); /* Nghiêng một chút cho sinh động */
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

.ghost-element .icon {
  font-size: 20px;
}

.ghost-element .label {
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 1024px) {
  .demo-container {
    grid-template-columns: 1fr;
  }

  .palette-items {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
