<template>
  <div class="tree-node">
    <div class="node-content" @click="toggle">
      <span class="toggle-icon" v-if="node.children && node.children.length > 0">
        {{ isExpanded ? "▼" : "▶" }}
      </span>
      <span class="node-label">{{ node.label }}</span>
      <span class="node-count" v-if="node.children && node.children.length > 0">
        ({{ node.children.length }})
      </span>
    </div>

    <!-- ĐÂY LÀ PHẦN ĐỆ QUY: Component tự gọi chính nó -->
    <!-- ĐIỀU KIỆN DỪNG: v-if="isExpanded && node.children && node.children.length > 0" -->
    <div v-if="isExpanded && node.children && node.children.length > 0" class="children">
      <TreeNode v-for="child in node.children" :key="child.id" :node="child" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// QUAN TRỌNG: Component cần có name để tự tham chiếu
defineOptions({
  name: "TreeNode",
});

interface TreeNodeData {
  id: number | string;
  label: string;
  children?: TreeNodeData[];
}

interface Props {
  node: TreeNodeData;
}

const props = defineProps<Props>();
const isExpanded = ref(false);

const toggle = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.tree-node {
  margin-left: 0;
}

.node-content {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.node-content:hover {
  background-color: #f0f0f0;
}

.toggle-icon {
  width: 20px;
  font-size: 12px;
  color: #666;
  margin-right: 8px;
}

.node-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.node-count {
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}

.children {
  margin-left: 24px;
  border-left: 1px solid #e0e0e0;
  padding-left: 8px;
}
</style>
