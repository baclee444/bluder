<template>
  <div class="tree-demo">
    <h1>Ví dụ Component Đệ Quy trong Vue</h1>

    <div class="demo-container">
      <div class="info-panel">
        <h2>📚 Giải thích</h2>
        <div class="info-content">
          <h3>Điều kiện bắt buộc để tránh Stack Overflow:</h3>
          <ol>
            <li>
              <strong>Điều kiện dừng (v-if):</strong>
              <code>v-if="isExpanded && node.children && node.children.length > 0"</code>
              <p>Chỉ render component con khi có children</p>
            </li>
            <li>
              <strong>Tên component:</strong>
              <code>defineOptions({ name: 'TreeNode' })</code>
              <p>Component cần có name để tự tham chiếu</p>
            </li>
            <li>
              <strong>Dữ liệu giảm dần:</strong>
              <p>Mỗi lần đệ quy, truyền vào node con (nhỏ hơn node cha)</p>
            </li>
          </ol>

          <h3>⚠️ Ví dụ SAI (gây Stack Overflow):</h3>
          <pre><code>&lt;!-- KHÔNG CÓ ĐIỀU KIỆN DỪNG --&gt;
&lt;TreeNode :node="node" /&gt;

&lt;!-- ĐIỀU KIỆN DỪNG SAI --&gt;
&lt;TreeNode v-if="true" :node="node" /&gt;</code></pre>

          <h3>✅ Ví dụ ĐÚNG:</h3>
          <pre><code>&lt;!-- CÓ ĐIỀU KIỆN DỪNG RÕ RÀNG --&gt;
&lt;TreeNode 
  v-if="node.children && node.children.length > 0"
  v-for="child in node.children"
  :key="child.id"
  :node="child"
/&gt;</code></pre>
        </div>
      </div>

      <div class="tree-panel">
        <h2>🌳 Cây thư mục (Click để mở/đóng)</h2>
        <div class="tree-container">
          <TreeNode :node="treeData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TreeNode from "./TreeNode.vue";

interface TreeNodeData {
  id: number | string;
  label: string;
  children?: TreeNodeData[];
}

// Dữ liệu mẫu - cấu trúc cây thư mục
const treeData = ref<TreeNodeData>({
  id: 1,
  label: "📁 src",
  children: [
    {
      id: 2,
      label: "📁 components",
      children: [
        {
          id: 3,
          label: "📄 TreeNode.vue",
        },
        {
          id: 4,
          label: "📄 BuilderCanvas.vue",
        },
        {
          id: 5,
          label: "📄 PropertiesPanel.vue",
        },
      ],
    },
    {
      id: 6,
      label: "📁 stores",
      children: [
        {
          id: 7,
          label: "📄 builderStore.ts",
        },
      ],
    },
    {
      id: 8,
      label: "📁 views",
      children: [
        {
          id: 9,
          label: "📁 admin",
          children: [
            {
              id: 10,
              label: "📄 Dashboard.vue",
            },
            {
              id: 11,
              label: "📄 Users.vue",
            },
          ],
        },
        {
          id: 12,
          label: "📁 public",
          children: [
            {
              id: 13,
              label: "📄 Home.vue",
            },
          ],
        },
      ],
    },
    {
      id: 14,
      label: "📄 App.vue",
    },
    {
      id: 15,
      label: "📄 main.ts",
    },
  ],
});
</script>

<style scoped>
.tree-demo {
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

.info-panel,
.tree-panel {
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

.info-content h3 {
  color: #34495e;
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 12px;
  font-weight: 600;
}

.info-content ol {
  padding-left: 20px;
}

.info-content li {
  margin-bottom: 16px;
}

.info-content strong {
  color: #2c3e50;
  font-weight: 600;
}

.info-content code {
  background: #f8f9fa;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 13px;
  color: #e83e8c;
  border: 1px solid #e9ecef;
}

.info-content pre {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid #e9ecef;
  margin-top: 8px;
}

.info-content pre code {
  background: transparent;
  padding: 0;
  border: none;
  color: #333;
  font-size: 13px;
  line-height: 1.5;
}

.info-content p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}

.tree-container {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  min-height: 400px;
}

@media (max-width: 1024px) {
  .demo-container {
    grid-template-columns: 1fr;
  }
}
</style>
