<template>
  <div class="app-container">
    <header class="app-header">
      <h1>HTML/CSS Builder</h1>
      <div class="header-actions">
        <button class="btn-export" @click="showExporter = true">
          Export Code
        </button>
        <button class="btn-clear" @click="handleClear">
          Clear All
        </button>
      </div>
    </header>

    <div class="builder-layout">
      <ComponentPalette />
      <BuilderCanvas />
      <PropertiesPanel />
    </div>

    <CodeExporter :is-open="showExporter" @close="showExporter = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentPalette from './components/ComponentPalette.vue'
import BuilderCanvas from './components/BuilderCanvas.vue'
import PropertiesPanel from './components/PropertiesPanel.vue'
import CodeExporter from './components/CodeExporter.vue'
import { useBuilderStore } from './stores/builderStore'

const builderStore = useBuilderStore()
const showExporter = ref(false)

function handleClear() {
  if (builderStore.allElements.length === 0) {
    return
  }

  if (confirm('Are you sure you want to clear all elements?')) {
    builderStore.clearCanvas()
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100vh;
  overflow: hidden;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-export,
.btn-clear {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-export {
  background: white;
  color: #667eea;
}

.btn-export:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-clear {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-clear:hover {
  background: rgba(255, 255, 255, 0.3);
}

.builder-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
