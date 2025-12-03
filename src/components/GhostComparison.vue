<template>
  <div class="comparison-demo">
    <h1>So sánh: Có vs Không có Ghost Element</h1>

    <div class="comparison-container">
      <!-- Không có Ghost Element -->
      <div class="demo-section">
        <h2>❌ Không có Ghost Element</h2>
        <p class="description">Trải nghiệm kém, không thấy được vị trí sẽ thả</p>

        <div class="palette">
          <div
            v-for="comp in componentsLeft"
            :key="comp.id"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStartNoGhost($event, comp)"
          >
            {{ comp.icon }} {{ comp.label }}
          </div>
        </div>

        <div class="drop-area" @dragover.prevent @drop="handleDropNoGhost">
          <div v-if="droppedLeft.length === 0" class="empty-state">Kéo component vào đây</div>
          <div v-for="(item, idx) in droppedLeft" :key="idx" class="dropped-item">
            {{ item.icon }} {{ item.label }}
          </div>
        </div>
      </div>

      <!-- Có Ghost Element -->
      <div class="demo-section">
        <h2>✅ Có Ghost Element</h2>
        <p class="description">Trải nghiệm tốt, thấy rõ vị trí sẽ thả</p>

        <div class="palette">
          <div
            v-for="comp in componentsRight"
            :key="comp.id"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStartWithGhost($event, comp)"
            @dragend="handleDragEndWithGhost"
          >
            {{ comp.icon }} {{ comp.label }}
          </div>
        </div>

        <div class="drop-area" @dragover.prevent @drop="handleDropWithGhost">
          <div v-if="droppedRight.length === 0" class="empty-state">Kéo component vào đây</div>
          <div v-for="(item, idx) in droppedRight" :key="idx" class="dropped-item">
            {{ item.icon }} {{ item.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- Ghost Element chỉ hiển thị bên phải -->
    <Transition name="ghost-fade">
      <div
        v-if="ghostData"
        class="ghost-element"
        :style="{
          left: ghostPos.x + 'px',
          top: ghostPos.y + 'px',
        }"
      >
        {{ ghostData.icon }} {{ ghostData.label }}
      </div>
    </Transition>

    <!-- Code examples -->
    <div class="code-examples">
      <h2>💻 Code Implementation</h2>

      <div class="code-grid">
        <div class="code-block">
          <h3>❌ Không có Ghost Element</h3>
          <pre><code>const handleDragStart = (event, component) => {
  // Chỉ set data transfer
  event.dataTransfer.setData('component', 
    JSON.stringify(component))
  
  // ❌ KHÔNG tạo ghost element
  // ❌ KHÔNG theo dõi vị trí chuột
}</code></pre>
        </div>

        <div class="code-block">
          <h3>✅ Có Ghost Element</h3>
          <pre><code>const handleDragStart = (event, component) => {
  // ✅ Tạo ghost element
  ghostData.value = component
  
  // ✅ Ẩn default drag image
  const img = new Image()
  img.src = 'data:image/gif;base64,...'
  event.dataTransfer.setDragImage(img, 0, 0)
  
  // ✅ Theo dõi vị trí chuột
  document.addEventListener('dragover', updateGhostPos)
}

const updateGhostPos = (event) => {
  ghostPos.value = {
    x: event.clientX + 10,
    y: event.clientY + 10
  }
}

const handleDragEnd = () => {
  // ✅ Xóa ghost element
  ghostData.value = null
  document.removeEventListener('dragover', updateGhostPos)
}</code></pre>
        </div>
      </div>

      <div class="css-block">
        <h3>🎨 CSS cho Ghost Element</h3>
        <pre><code>.ghost-element {
  position: fixed;           /* Theo chuột */
  pointer-events: none;      /* Không tương tác */
  opacity: 0.7;              /* Bán trong suốt */
  z-index: 9999;             /* Luôn ở trên */
  transform: rotate(-5deg);  /* Nghiêng nhẹ */
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  animation: float 0.3s ease-in-out infinite alternate;
}

@keyframes float {
  to { transform: rotate(-5deg) translateY(-4px); }
}</code></pre>
      </div>
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

// Components cho bên trái (không có ghost)
const componentsLeft = ref<Component[]>([
  { id: "btn1", label: "Button", icon: "🔘" },
  { id: "inp1", label: "Input", icon: "📝" },
  { id: "card1", label: "Card", icon: "🃏" },
]);

// Components cho bên phải (có ghost)
const componentsRight = ref<Component[]>([
  { id: "btn2", label: "Button", icon: "🔘" },
  { id: "inp2", label: "Input", icon: "📝" },
  { id: "card2", label: "Card", icon: "🃏" },
]);

const droppedLeft = ref<Component[]>([]);
const droppedRight = ref<Component[]>([]);

// Ghost element state
const ghostData = ref<Component | null>(null);
const ghostPos = ref({ x: 0, y: 0 });
let currentDraggedNoGhost: Component | null = null;
let currentDraggedWithGhost: Component | null = null;

// ❌ Không có Ghost Element
const handleDragStartNoGhost = (event: DragEvent, component: Component) => {
  currentDraggedNoGhost = component;
  // Chỉ set data, không tạo ghost
};

const handleDropNoGhost = () => {
  if (currentDraggedNoGhost) {
    droppedLeft.value.push({ ...currentDraggedNoGhost });
    currentDraggedNoGhost = null;
  }
};

// ✅ Có Ghost Element
const handleDragStartWithGhost = (event: DragEvent, component: Component) => {
  currentDraggedWithGhost = component;
  ghostData.value = component;

  // Ẩn default drag image
  if (event.dataTransfer) {
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    event.dataTransfer.setDragImage(img, 0, 0);
  }

  // Theo dõi vị trí chuột
  document.addEventListener("dragover", updateGhostPosition);
};

const updateGhostPosition = (event: DragEvent) => {
  ghostPos.value = {
    x: event.clientX + 10,
    y: event.clientY + 10,
  };
};

const handleDragEndWithGhost = () => {
  ghostData.value = null;
  document.removeEventListener("dragover", updateGhostPosition);
};

const handleDropWithGhost = () => {
  if (currentDraggedWithGhost) {
    droppedRight.value.push({ ...currentDraggedWithGhost });
    currentDraggedWithGhost = null;
  }
};
</script>

<style scoped>
.comparison-demo {
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

.comparison-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
}

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  font-size: 20px;
  margin-bottom: 8px;
  font-weight: 600;
}

.description {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 20px;
}

.palette {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.component-item {
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s;
  font-weight: 500;
}

.component-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.component-item:active {
  cursor: grabbing;
}

.drop-area {
  min-height: 200px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 16px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 168px;
  color: #adb5bd;
  font-size: 14px;
}

.dropped-item {
  padding: 12px 16px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
}

/* Ghost Element */
.ghost-element {
  position: fixed;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  pointer-events: none;
  opacity: 0.7;
  z-index: 9999;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
  transform: rotate(-5deg);
  animation: ghostFloat 0.3s ease-in-out infinite alternate;
  font-weight: 500;
}

@keyframes ghostFloat {
  from {
    transform: rotate(-5deg) translateY(0);
  }
  to {
    transform: rotate(-5deg) translateY(-4px);
  }
}

.ghost-fade-enter-active,
.ghost-fade-leave-active {
  transition: opacity 0.2s;
}

.ghost-fade-enter-from,
.ghost-fade-leave-to {
  opacity: 0;
}

/* Code Examples */
.code-examples {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.code-examples h2 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
}

.code-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.code-block h3,
.css-block h3 {
  font-size: 16px;
  color: #34495e;
  margin-bottom: 12px;
  font-weight: 600;
}

.code-block pre,
.css-block pre {
  background: #282c34;
  color: #abb2bf;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 13px;
  line-height: 1.6;
}

.code-block code,
.css-block code {
  color: #abb2bf;
}

@media (max-width: 1024px) {
  .comparison-container,
  .code-grid {
    grid-template-columns: 1fr;
  }
}
</style>
