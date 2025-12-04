<template>
  <div class="app-container">
    <header class="app-header">
      <h1></h1>
      <div class="header-actions">
        <button class="btn-preview" @click="showPreview = true">review HTML</button>
      </div>
    </header>

    <div class="builder-layout">
      <ComponentPalette />
      <BuilderCanvas />
      <PropertiesPanel />
    </div>

    <HTMLPreview :is-open="showPreview" @close="showPreview = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ComponentPalette from "./components/ComponentPalette.vue";
import BuilderCanvas from "./components/BuilderCanvas.vue";
import PropertiesPanel from "./components/PropertiesPanel.vue";
import HTMLPreview from "./components/HTMLPreview.vue";
import { useBuilderStore } from "./stores/builderStore";

const builderStore = useBuilderStore();
const showPreview = ref(false);
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
    sans-serif;
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
  flex-wrap: wrap;
}

.btn-preview {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-preview {
  background: white;
  color: #667eea;
  font-size: 16px;
}

.btn-preview:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.builder-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
