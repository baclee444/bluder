<template>
  <div class="app-container">
    <header class="app-header">
      <h1>HTML/CSS Builder</h1>
      <div class="header-actions">
        <button class="btn-save" @click="handleSave">💾 Save</button>
        <button class="btn-load" @click="handleLoad">📂 Load</button>
        <button class="btn-export" @click="showExporter = true">📤 Export Code</button>
        <button class="btn-download" @click="handleDownload">⬇️ Download JSON</button>
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          style="display: none"
          @change="handleFileImport"
        />
        <button class="btn-import" @click="fileInput?.click()">⬆️ Import JSON</button>
        <button class="btn-clear" @click="handleClear">🗑️ Clear All</button>
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
import { ref, onMounted } from "vue";
import ComponentPalette from "./components/ComponentPalette.vue";
import BuilderCanvas from "./components/BuilderCanvas.vue";
import PropertiesPanel from "./components/PropertiesPanel.vue";
import CodeExporter from "./components/CodeExporter.vue";
import { useBuilderStore } from "./stores/builderStore";

const builderStore = useBuilderStore();
const showExporter = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// Auto-load project on mount
onMounted(() => {
  builderStore.loadProject();
});

function handleSave() {
  const success = builderStore.saveProject();
  if (success) {
    alert("✅ Project saved successfully!");
  } else {
    alert("❌ Failed to save project");
  }
}

function handleLoad() {
  if (builderStore.hasUnsavedChanges()) {
    if (!confirm("You have unsaved changes. Load saved project?")) {
      return;
    }
  }

  const success = builderStore.loadProject();
  if (success) {
    alert("✅ Project loaded successfully!");
  } else {
    alert("ℹ️ No saved project found");
  }
}

function handleDownload() {
  const json = builderStore.exportProject();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `builder-project-${new Date().getTime()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  alert("✅ Project downloaded!");
}

function handleFileImport(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    if (builderStore.hasUnsavedChanges()) {
      if (!confirm("You have unsaved changes. Import this project?")) {
        return;
      }
    }

    const success = builderStore.importProject(content);
    if (success) {
      alert("✅ Project imported successfully!");
    } else {
      alert("❌ Failed to import project. Invalid format.");
    }
  };
  reader.readAsText(file);

  // Reset input
  target.value = "";
}

function handleClear() {
  if (builderStore.allElements.length === 0) {
    return;
  }

  if (confirm("Are you sure you want to clear all elements?")) {
    builderStore.clearCanvas();
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

.btn-save,
.btn-load,
.btn-export,
.btn-download,
.btn-import,
.btn-clear {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save {
  background: #28a745;
  color: white;
}

.btn-save:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-load {
  background: #17a2b8;
  color: white;
}

.btn-load:hover {
  background: #138496;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
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

.btn-download {
  background: #ffc107;
  color: #333;
}

.btn-download:hover {
  background: #e0a800;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.btn-import {
  background: #6f42c1;
  color: white;
}

.btn-import:hover {
  background: #5a32a3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3);
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
