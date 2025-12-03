<template>
  <div class="ghost-showcase">
    <header class="showcase-header">
      <h1>🎭 Ghost Element Showcase</h1>
      <p class="subtitle">Tìm hiểu về Ghost Element trong Web Builder</p>
    </header>

    <nav class="tab-navigation">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </nav>

    <div class="tab-content">
      <!-- Tab 1: Giới thiệu -->
      <div v-if="activeTab === 'intro'" class="content-panel">
        <div class="intro-grid">
          <div class="intro-card">
            <div class="card-icon">🎯</div>
            <h3>Ghost Element là gì?</h3>
            <p>
              <strong>Ghost Element</strong> (phần tử ma) là bản sao bán trong suốt của component
              xuất hiện khi bạn kéo (drag) component trong web builder.
            </p>
            <p>
              Nó giúp người dùng thấy rõ vị trí sẽ thả component, cải thiện trải nghiệm kéo-thả đáng
              kể.
            </p>
          </div>

          <div class="intro-card">
            <div class="card-icon">✨</div>
            <h3>Đặc điểm chính</h3>
            <ul>
              <li><strong>Bán trong suốt:</strong> opacity: 0.5-0.7</li>
              <li><strong>Theo chuột:</strong> position: fixed</li>
              <li><strong>Không tương tác:</strong> pointer-events: none</li>
              <li><strong>Tự động xóa:</strong> sau khi drop</li>
              <li><strong>Z-index cao:</strong> luôn hiển thị trên cùng</li>
            </ul>
          </div>

          <div class="intro-card">
            <div class="card-icon">🔄</div>
            <h3>Vòng đời</h3>
            <div class="lifecycle">
              <div class="lifecycle-step">
                <span class="step-number">1</span>
                <div class="step-content">
                  <strong>dragstart</strong>
                  <p>Tạo ghost element</p>
                </div>
              </div>
              <div class="lifecycle-arrow">→</div>
              <div class="lifecycle-step">
                <span class="step-number">2</span>
                <div class="step-content">
                  <strong>drag</strong>
                  <p>Cập nhật vị trí</p>
                </div>
              </div>
              <div class="lifecycle-arrow">→</div>
              <div class="lifecycle-step">
                <span class="step-number">3</span>
                <div class="step-content">
                  <strong>dragend</strong>
                  <p>Xóa ghost element</p>
                </div>
              </div>
            </div>
          </div>

          <div class="intro-card">
            <div class="card-icon">💡</div>
            <h3>Tại sao cần Ghost Element?</h3>
            <ul>
              <li>✅ Feedback trực quan cho người dùng</li>
              <li>✅ Hiển thị rõ vị trí sẽ thả</li>
              <li>✅ Tránh mất component gốc khi kéo</li>
              <li>✅ Cải thiện UX đáng kể</li>
              <li>✅ Chuẩn trong các builder hiện đại</li>
            </ul>
          </div>
        </div>

        <div class="comparison-preview">
          <h3>📊 So sánh nhanh</h3>
          <div class="comparison-table">
            <div class="table-row header">
              <div class="table-cell">Tiêu chí</div>
              <div class="table-cell">Không có Ghost</div>
              <div class="table-cell">Có Ghost</div>
            </div>
            <div class="table-row">
              <div class="table-cell">Trải nghiệm</div>
              <div class="table-cell">❌ Kém</div>
              <div class="table-cell">✅ Tốt</div>
            </div>
            <div class="table-row">
              <div class="table-cell">Thấy vị trí thả</div>
              <div class="table-cell">❌ Không</div>
              <div class="table-cell">✅ Có</div>
            </div>
            <div class="table-row">
              <div class="table-cell">Feedback trực quan</div>
              <div class="table-cell">❌ Không</div>
              <div class="table-cell">✅ Có</div>
            </div>
            <div class="table-row">
              <div class="table-cell">Độ phức tạp code</div>
              <div class="table-cell">✅ Đơn giản</div>
              <div class="table-cell">⚠️ Trung bình</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Demo tương tác -->
      <div v-if="activeTab === 'demo'" class="content-panel">
        <GhostElementDemo />
      </div>

      <!-- Tab 3: So sánh -->
      <div v-if="activeTab === 'comparison'" class="content-panel">
        <GhostComparison />
      </div>

      <!-- Tab 4: Code -->
      <div v-if="activeTab === 'code'" class="content-panel">
        <div class="code-section">
          <h2>💻 Implementation Code</h2>

          <div class="code-example">
            <h3>1. Setup State</h3>
            <pre><code>import { ref } from 'vue'

interface Component {
  id: string
  label: string
  icon: string
}

// Ghost element state
const ghostElement = ref&lt;Component | null&gt;(null)
const ghostPosition = ref({ x: 0, y: 0 })</code></pre>
          </div>

          <div class="code-example">
            <h3>2. Handle Drag Start</h3>
            <pre><code>const handleDragStart = (event: DragEvent, component: Component) => {
  // Tạo ghost element
  ghostElement.value = component
  
  // Ẩn default drag image của browser
  if (event.dataTransfer) {
    const img = new Image()
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    event.dataTransfer.setDragImage(img, 0, 0)
    event.dataTransfer.effectAllowed = 'copy'
  }

  // Lắng nghe sự kiện di chuyển chuột
  document.addEventListener('dragover', updateGhostPosition)
}</code></pre>
          </div>

          <div class="code-example">
            <h3>3. Update Ghost Position</h3>
            <pre><code>const updateGhostPosition = (event: DragEvent) => {
  ghostPosition.value = {
    x: event.clientX + 10, // Offset để không che chuột
    y: event.clientY + 10
  }
}</code></pre>
          </div>

          <div class="code-example">
            <h3>4. Handle Drag End</h3>
            <pre><code>const handleDragEnd = () => {
  // Xóa ghost element
  ghostElement.value = null
  
  // Cleanup event listener
  document.removeEventListener('dragover', updateGhostPosition)
}</code></pre>
          </div>

          <div class="code-example">
            <h3>5. Template</h3>
            <pre><code>&lt;!-- Draggable component --&gt;
&lt;div
  draggable="true"
  @dragstart="handleDragStart($event, component)"
  @dragend="handleDragEnd"
&gt;
  {{ component.label }}
&lt;/div&gt;

&lt;!-- Ghost Element --&gt;
&lt;div
  v-if="ghostElement"
  class="ghost-element"
  :style="{
    left: ghostPosition.x + 'px',
    top: ghostPosition.y + 'px'
  }"
&gt;
  {{ ghostElement.label }}
&lt;/div&gt;</code></pre>
          </div>

          <div class="code-example">
            <h3>6. CSS Styling</h3>
            <pre><code>.ghost-element {
  position: fixed;           /* Theo chuột */
  pointer-events: none;      /* Không tương tác */
  opacity: 0.7;              /* Bán trong suốt */
  z-index: 9999;             /* Luôn ở trên */
  transform: rotate(-5deg);  /* Nghiêng nhẹ */
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
}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import GhostElementDemo from "./GhostElementDemo.vue";
import GhostComparison from "./GhostComparison.vue";

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: "intro", label: "Giới thiệu", icon: "📚" },
  { id: "demo", label: "Demo tương tác", icon: "🎮" },
  { id: "comparison", label: "So sánh", icon: "⚖️" },
  { id: "code", label: "Code", icon: "💻" },
];

const activeTab = ref("intro");
</script>

<style scoped>
.ghost-showcase {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.showcase-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.showcase-header h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
}

.tab-navigation {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab-button {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.tab-button.active {
  background: white;
  color: #667eea;
  border-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tab-content {
  max-width: 1400px;
  margin: 0 auto;
}

.content-panel {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Intro Grid */
.intro-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.intro-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.intro-card h3 {
  color: #2c3e50;
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: 600;
}

.intro-card p {
  color: #555;
  line-height: 1.6;
  margin-bottom: 12px;
}

.intro-card ul {
  list-style: none;
  padding: 0;
}

.intro-card li {
  color: #555;
  margin-bottom: 8px;
  padding-left: 0;
}

/* Lifecycle */
.lifecycle {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.lifecycle-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.step-content {
  text-align: center;
}

.step-content strong {
  color: #2c3e50;
  font-size: 14px;
  display: block;
  margin-bottom: 4px;
}

.step-content p {
  color: #666;
  font-size: 12px;
  margin: 0;
}

.lifecycle-arrow {
  font-size: 24px;
  color: #667eea;
  font-weight: bold;
}

/* Comparison Table */
.comparison-preview {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comparison-preview h3 {
  color: #2c3e50;
  font-size: 20px;
  margin-bottom: 16px;
  font-weight: 600;
}

.comparison-table {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.table-row.header {
  background: #667eea;
  color: white;
  font-weight: 600;
}

.table-row:not(.header) {
  background: white;
}

.table-row:not(.header):nth-child(even) {
  background: #f8f9fa;
}

.table-cell {
  padding: 12px 16px;
  border-right: 1px solid #e9ecef;
}

.table-cell:last-child {
  border-right: none;
}

/* Code Section */
.code-section h2 {
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 24px;
  font-weight: 600;
}

.code-example {
  margin-bottom: 24px;
}

.code-example h3 {
  color: #34495e;
  font-size: 18px;
  margin-bottom: 12px;
  font-weight: 600;
}

.code-example pre {
  background: #282c34;
  color: #abb2bf;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 14px;
  line-height: 1.6;
}

.code-example code {
  color: #abb2bf;
}

@media (max-width: 1024px) {
  .intro-grid {
    grid-template-columns: 1fr;
  }

  .lifecycle {
    flex-direction: column;
  }

  .lifecycle-arrow {
    transform: rotate(90deg);
  }
}
</style>
