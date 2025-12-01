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
      >
        <span class="item-icon">{{ item.icon }}</span>
        <span class="item-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElementType, type PaletteItem } from '@/types/types'

const paletteItems = ref<PaletteItem[]>([
  {
    type: ElementType.DIV,
    label: 'Container',
    icon: '',
    defaultContent: '',
    defaultStyles: {
      width: '200px',
      height: '100px',
      backgroundColor: '#e0e0e0',
      border: '2px solid #999',
      borderRadius: '4px',
      padding: '10px'
    }
  },
  {
    type: ElementType.TEXT,
    label: 'Text',
    icon: '',
    defaultContent: 'Sample Text',
    defaultStyles: {
      fontSize: '16px',
      color: '#333',
      padding: '8px'
    }
  },
  {
    type: ElementType.BUTTON,
    label: 'Button',
    icon: '',
    defaultContent: 'Click Me',
    defaultStyles: {
      backgroundColor: '#007bff',
      color: '#ffffff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 'bold'
    }
  },
  {
    type: ElementType.IMAGE,
    label: 'Image',
    icon: '',
    defaultContent: 'https://via.placeholder.com/150',
    defaultStyles: {
      width: '150px',
      height: '150px',
      border: '1px solid #ccc'
    }
  }
])

function handleDragStart(event: DragEvent, item: PaletteItem) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('application/json', JSON.stringify(item))
  }
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
</style>
