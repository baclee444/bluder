<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>HTML Preview</h2>
        <button class="btn-close" @click="closeModal">✕</button>
      </div>

      <div class="modal-body">
        <!-- Preview Tab -->
        <div class="tab-buttons">
          <button
            :class="['tab-btn', { active: activeTab === 'preview' }]"
            @click="activeTab = 'preview'"
          >
            Preview
          </button>
          <button
            :class="['tab-btn', { active: activeTab === 'html' }]"
            @click="activeTab = 'html'"
          >
            HTML
          </button>
          <button :class="['tab-btn', { active: activeTab === 'css' }]" @click="activeTab = 'css'">
            CSS
          </button>
        </div>

        <!-- Preview Content -->
        <div v-show="activeTab === 'preview'" class="preview-container">
          <iframe ref="previewFrame" class="preview-iframe" :srcdoc="fullHTML"></iframe>
        </div>

        <!-- HTML Code -->
        <div v-show="activeTab === 'html'" class="code-section">
          <div class="code-header">
            <h3>HTML Code</h3>
            <button class="btn-copy" @click="copyToClipboard(generatedHTML)">📋 Copy</button>
          </div>
          <pre><code>{{ generatedHTML }}</code></pre>
        </div>

        <!-- CSS Code -->
        <div v-show="activeTab === 'css'" class="code-section">
          <div class="code-header">
            <h3>CSS Code</h3>
            <button class="btn-copy" @click="copyToClipboard(generatedCSS)">📋 Copy</button>
          </div>
          <pre><code>{{ generatedCSS }}</code></pre>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useBuilderStore } from "@/stores/builderStore";
import type { BuilderElement } from "@/types/types";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const builderStore = useBuilderStore();
const activeTab = ref<"preview" | "html" | "css">("preview");
const previewFrame = ref<HTMLIFrameElement | null>(null);

const generatedHTML = computed(() => {
  if (builderStore.allElements.length === 0) {
    return "<!-- No elements to preview -->";
  }

  let html = '  <div class="container">\n';

  builderStore.allElements.forEach((element: BuilderElement, index: number) => {
    const className = `element-${index + 1}`;

    if (element.type === "image") {
      html += `   <img src="${element.content}" alt="Image" class="${className}" />\n`;
    } else if (element.type === "button") {
      html += `    <button class="${className}">${element.content}</button>\n`;
    } else if (element.type === "text") {
      html += `    <p class="${className}">${element.content}</p>\n`;
    } else {
      html += `    <div class="${className}">${element.content || ""}</div>\n`;
    }
  });

  html += "  </div>";

  return html;
});

const generatedCSS = computed(() => {
  if (builderStore.allElements.length === 0) {
    return "/* No styles to preview */";
  }

  let css = "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n";
  css += "body {\n  font-family: Arial, sans-serif;\n}\n\n";
  css += ".container {\n  position: relative;\n  width: 100%;\n  min-height: 100vh;\n}\n\n";

  builderStore.allElements.forEach((element: BuilderElement, index: number) => {
    const className = `.element-${index + 1}`;
    css += `${className} {\n`;

    Object.entries(element.styles).forEach(([property, value]) => {
      if (value) {
        // Convert camelCase to kebab-case
        const cssProperty = property.replace(/([A-Z])/g, "-$1").toLowerCase();
        css += `  ${cssProperty}: ${value};\n`;
      }
    });

    css += "}\n\n";
  });

  return css;
});

const fullHTML = computed(() => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
${generatedCSS.value}
  </style>
</head>
<body>
${generatedHTML.value}
</body>
</html>`;
});

function closeModal() {
  emit("close");
}

function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
      alert("Failed to copy to clipboard");
    });
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #dee2e6;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tab-buttons {
  display: flex;
  gap: 8px;
  padding: 16px 24px;
  border-bottom: 1px solid #dee2e6;
  background: #f8f9fa;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: white;
  color: #495057;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: #e9ecef;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.preview-container {
  flex: 1;
  padding: 24px;
  overflow: auto;
  background: #f8f9fa;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  background: white;
}

.code-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.code-header h3 {
  margin: 0;
  font-size: 16px;
  color: #495057;
  font-weight: 600;
}

.btn-copy {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-copy:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

pre {
  flex: 1;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
  margin: 0;
}

code {
  font-family: "Courier New", monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}
</style>
