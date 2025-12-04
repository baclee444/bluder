<template>
    <div class="properties-panel">
        <h3>Properties</h3>

        <div v-if="!builderStore.selectedElement" class="no-selection">
            <p>Select an element to edit its properties</p>
        </div>

        <div v-else class="properties-form">
            <div class="property-section">
                <h4>Element: {{ getElementTypeLabel(builderStore.selectedElement.type) }}</h4>
            </div>

            <!-- Content Editor -->
            <div v-if="builderStore.selectedElement.type !== 'div'" class="property-group">
                <label>Content</label>
                <input v-if="builderStore.selectedElement.type === 'image'" type="text"
                    :value="builderStore.selectedElement.content" @input="updateContent($event)"
                    placeholder="Image URL" />
                <textarea v-else :value="builderStore.selectedElement.content" @input="updateContent($event)"
                    rows="3"></textarea>
            </div>

            <!-- Style Properties -->
            <div class="property-section">
                <h4>Styles</h4>
            </div>

            <div class="property-group">
                <label>Width</label>
                <input type="text" :value="builderStore.selectedElement.styles.width || ''"
                    @input="updateStyle('width', $event)" placeholder="e.g., 200px, 50%" />
            </div>

            <div class="property-group">
                <label>Height</label>
                <input type="text" :value="builderStore.selectedElement.styles.height || ''"
                    @input="updateStyle('height', $event)" placeholder="e.g., 100px, auto" />
            </div>

            <div class="property-group">
                <label>Background Color</label>
                <div class="color-input-group">
                    <input type="color" :value="builderStore.selectedElement.styles.backgroundColor || '#ffffff'"
                        @input="updateStyle('backgroundColor', $event)" />
                    <input type="text" :value="builderStore.selectedElement.styles.backgroundColor || ''"
                        @input="updateStyle('backgroundColor', $event)" placeholder="#ffffff" />
                </div>
            </div>

            <div v-if="builderStore.selectedElement.type !== 'image'" class="property-group">
                <label>Text Color</label>
                <div class="color-input-group">
                    <input type="color" :value="builderStore.selectedElement.styles.color || '#000000'"
                        @input="updateStyle('color', $event)" />
                    <input type="text" :value="builderStore.selectedElement.styles.color || ''"
                        @input="updateStyle('color', $event)" placeholder="#000000" />
                </div>
            </div>

            <div class="property-group">
                <label>Padding</label>
                <input type="text" :value="builderStore.selectedElement.styles.padding || ''"
                    @input="updateStyle('padding', $event)" placeholder="e.g., 10px, 10px 20px" />
            </div>

            <div class="property-group">
                <label>Border</label>
                <input type="text" :value="builderStore.selectedElement.styles.border || ''"
                    @input="updateStyle('border', $event)" placeholder="e.g., 1px solid #000" />
            </div>

            <div class="property-group">
                <label>Border Radius</label>
                <input type="text" :value="builderStore.selectedElement.styles.borderRadius || ''"
                    @input="updateStyle('borderRadius', $event)" placeholder="e.g., 4px, 50%" />
            </div>

            <div v-if="builderStore.selectedElement.type !== 'image'" class="property-group">
                <label>Font Size</label>
                <input type="text" :value="builderStore.selectedElement.styles.fontSize || ''"
                    @input="updateStyle('fontSize', $event)" placeholder="e.g., 16px" />
            </div>

            <!-- Actions -->
            <div class="property-actions">
                <button class="btn-delete" @click="handleDelete">
                    Delete Element
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useBuilderStore } from '@/stores/builderStore'
import { ElementType } from '@/types/types'

const builderStore = useBuilderStore()

function getElementTypeLabel(type: ElementType): string {
    const labels = {
        [ElementType.DIV]: 'Container',
        [ElementType.TEXT]: 'Text',
        [ElementType.BUTTON]: 'Button',
        [ElementType.IMAGE]: 'Image'
    }
    return labels[type] || type
}

function updateContent(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement
    if (builderStore.selectedElement) {
        builderStore.updateElementContent(builderStore.selectedElement.id, target.value)
    }
}

function updateStyle(property: string, event: Event) {
    const target = event.target as HTMLInputElement
    if (builderStore.selectedElement) {
        builderStore.updateElementStyles(builderStore.selectedElement.id, {
            [property]: target.value
        })
    }
}

function handleDelete() {
    if (builderStore.selectedElement) {
        builderStore.deleteElement(builderStore.selectedElement.id)
    }
}
</script>

<style scoped>
.properties-panel {
    width: 300px;
    background: #f8f9fa;
    border-left: 1px solid #dee2e6;
    padding: 20px;
    overflow-y: auto;
}

.properties-panel h3 {
    margin: 0 0 20px 0;
    font-size: 18px;
    color: #333;
    font-weight: 600;
}

.no-selection {
    text-align: center;
    color: #6c757d;
    padding: 40px 20px;
    font-size: 14px;
}

.properties-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.property-section h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #495057;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.property-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.property-group label {
    font-size: 13px;
    font-weight: 500;
    color: #495057;
}

.property-group input[type="text"],
.property-group textarea {
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.2s ease;
}

.property-group input[type="text"]:focus,
.property-group textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.color-input-group {
    display: flex;
    gap: 8px;
}

.color-input-group input[type="color"] {
    width: 50px;
    height: 38px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    cursor: pointer;
}

.color-input-group input[type="text"] {
    flex: 1;
}

.property-actions {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #dee2e6;
}

.btn-delete {
    width: 100%;
    padding: 10px 16px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
}

.btn-delete:hover {
    background: #c82333;
}

.btn-delete:active {
    transform: translateY(1px);
}
</style>
