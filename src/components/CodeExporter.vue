<template>
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>Export Code</h2>
                <button class="btn-close" @click="closeModal">✕</button>
            </div>

            <div class="modal-body">
                <div class="code-section">
                    <div class="code-header">
                        <h3>HTML</h3>
                        <button class="btn-copy" @click="copyToClipboard(generatedHTML)">
                            📋 Copy
                        </button>
                    </div>
                    <pre><code>{{ generatedHTML }}</code></pre>
                </div>

                <div class="code-section">
                    <div class="code-header">
                        <h3>CSS</h3>
                        <button class="btn-copy" @click="copyToClipboard(generatedCSS)">
                            📋 Copy
                        </button>
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
import { computed } from 'vue'
import { useBuilderStore } from '@/stores/builderStore'

defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    close: []
}>()

const builderStore = useBuilderStore()

const generatedHTML = computed(() => {
    if (builderStore.allElements.length === 0) {
        return '<!-- No elements to export -->'
    }

    let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
    html += '  <meta charset="UTF-8">\n'
    html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
    html += '  <title>Generated Page</title>\n'
    html += '  <link rel="stylesheet" href="styles.css">\n'
    html += '</head>\n<body>\n'
    html += '  <div class="container">\n'

    builderStore.allElements.forEach((element, index) => {
        const className = `element-${index + 1}`

        if (element.type === 'image') {
            html += `    <img src="${element.content}" alt="Image" class="${className}" />\n`
        } else if (element.type === 'button') {
            html += `    <button class="${className}">${element.content}</button>\n`
        } else if (element.type === 'text') {
            html += `    <p class="${className}">${element.content}</p>\n`
        } else {
            html += `    <div class="${className}">${element.content || ''}</div>\n`
        }
    })

    html += '  </div>\n'
    html += '</body>\n</html>'

    return html
})

const generatedCSS = computed(() => {
    if (builderStore.allElements.length === 0) {
        return '/* No styles to export */'
    }

    let css = '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n'
    css += 'body {\n  font-family: Arial, sans-serif;\n}\n\n'
    css += '.container {\n  position: relative;\n  width: 100%;\n  min-height: 100vh;\n}\n\n'

    builderStore.allElements.forEach((element, index) => {
        const className = `.element-${index + 1}`
        css += `${className} {\n`

        Object.entries(element.styles).forEach(([property, value]) => {
            if (value) {
                // Convert camelCase to kebab-case
                const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase()
                css += `  ${cssProperty}: ${value};\n`
            }
        })

        css += '}\n\n'
    })

    return css
})

function closeModal() {
    emit('close')
}

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!')
    }).catch(err => {
        console.error('Failed to copy:', err)
    })
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
    border-radius: 8px;
    width: 100%;
    max-width: 800px;
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
}

.modal-header h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
}

.btn-close {
    background: none;
    border: none;
    font-size: 24px;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s ease;
}

.btn-close:hover {
    background: #f8f9fa;
}

.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.code-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.code-header h3 {
    margin: 0;
    font-size: 16px;
    color: #495057;
    font-weight: 600;
}

.btn-copy {
    padding: 6px 12px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s ease;
}

.btn-copy:hover {
    background: #0056b3;
}

pre {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 16px;
    overflow-x: auto;
    margin: 0;
}

code {
    font-family: 'Courier New', monospace;
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
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
}

.btn-secondary:hover {
    background: #5a6268;
}
</style>
