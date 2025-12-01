<template>
    <div class="builder-canvas" @drop="handleDrop" @dragover="handleDragOver" @click="handleCanvasClick"
        @mousemove="handleMouseMove" @mouseup="handleMouseUp">
        <div v-if="builderStore.allElements.length === 0" class="empty-state">
            <p>Drag components here to start building</p>
        </div>

        <div v-for="element in builderStore.allElements" :key="element.id" :class="['canvas-element', {
            selected: element.id === builderStore.selectedElementId,
            dragging: isDragging && draggedElementId === element.id
        }]" :style="element.styles as any" @click.stop="handleElementClick(element.id)"
            @mousedown.stop="handleElementMouseDown($event, element.id)">
            <template v-if="element.type === 'image'">
                <img :src="element.content" :alt="element.content"
                    style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;" />
            </template>
            <template v-else-if="element.type === 'button'">
                <button type="button" style="width: 100%; height: 100%; cursor: pointer; pointer-events: none;">
                    {{ element.content }}
                </button>
            </template>
            <template v-else>
                {{ element.content }}
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBuilderStore } from '@/stores/builderStore'
import type { PaletteItem } from '@/types/types'

const builderStore = useBuilderStore()

// Drag state cho việc di chuyển element
const isDragging = ref(false)
const draggedElementId = ref<string | null>(null)
const dragOffset = ref({ x: 0, y: 0 })

function handleDragOver(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy'
    }
}

function handleDrop(event: DragEvent) {
    event.preventDefault()

    if (!event.dataTransfer) return

    const data = event.dataTransfer.getData('application/json')
    if (!data) return

    try {
        const item: PaletteItem = JSON.parse(data)
        const canvas = event.currentTarget as HTMLElement
        const rect = canvas.getBoundingClientRect()

        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        builderStore.addElement(
            item.type,
            item.defaultContent,
            item.defaultStyles,
            { x, y }
        )
    } catch (error) {
        console.error('Error parsing dropped data:', error)
    }
}

// ===== XỬ LÝ DI CHUYỂN ELEMENT =====

function handleElementMouseDown(event: MouseEvent, elementId: string) {
    // Chọn element
    builderStore.selectElement(elementId)

    // Bắt đầu drag
    isDragging.value = true
    draggedElementId.value = elementId

    // Lấy element hiện tại
    const element = builderStore.allElements.find(el => el.id === elementId)
    if (!element) return

    // Tính offset: khoảng cách từ vị trí click đến góc trên-trái của element
    const canvas = (event.currentTarget as HTMLElement).parentElement as HTMLElement
    const rect = canvas.getBoundingClientRect()

    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top

    dragOffset.value = {
        x: clickX - element.position.x,
        y: clickY - element.position.y
    }
}

function handleMouseMove(event: MouseEvent) {
    if (!isDragging.value || !draggedElementId.value) return

    event.preventDefault()

    const canvas = event.currentTarget as HTMLElement
    const rect = canvas.getBoundingClientRect()

    // Tính vị trí mới
    const newX = event.clientX - rect.left - dragOffset.value.x
    const newY = event.clientY - rect.top - dragOffset.value.y

    // Cập nhật vị trí element
    builderStore.updateElement(draggedElementId.value, {
        position: { x: newX, y: newY },
        styles: {
            ...builderStore.allElements.find(el => el.id === draggedElementId.value)?.styles,
            top: `${newY}px`,
            left: `${newX}px`
        }
    })
}

function handleMouseUp() {
    isDragging.value = false
    draggedElementId.value = null
}

function handleElementClick(id: string) {
    if (!isDragging.value) {
        builderStore.selectElement(id)
    }
}

function handleCanvasClick() {
    if (!isDragging.value) {
        builderStore.selectElement(null)
    }
}
</script>

<style scoped>
.builder-canvas {
    flex: 1;
    background: #ffffff;
    position: relative;
    min-height: 600px;
    min-width: 400px;
    background-image:
        linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
}

.empty-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #6c757d;
    font-size: 18px;
    pointer-events: none;
}

.canvas-element {
    position: absolute;
    cursor: grab;
    transition: box-shadow 0.2s ease;
    min-width: 20px;
    min-height: 20px;
    user-select: none;
}

.canvas-element:active {
    cursor: grabbing;
}

.canvas-element.dragging {
    cursor: grabbing;
    opacity: 0.8;
    z-index: 1000;
}

.canvas-element:hover {
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
}

.canvas-element.selected {
    box-shadow: 0 0 0 3px #007bff;
    outline: 2px dashed #007bff;
    outline-offset: 2px;
}

.canvas-element button {
    border: none;
    background: inherit;
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
    padding: 0;
    border-radius: inherit;
}
</style>
