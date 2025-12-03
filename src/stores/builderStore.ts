import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BuilderElement, ElementType, StyleProperties } from '@/types/types'

export const useBuilderStore = defineStore('builder', () => {
    // State
    const elements = ref<BuilderElement[]>([])
    const selectedElementId = ref<string | null>(null)

    // Getters
    const selectedElement = computed(() => {
        if (!selectedElementId.value) return null
        return elements.value.find(el => el.id === selectedElementId.value) || null
    })

    const allElements = computed(() => elements.value)

    // Actions
    function addElement(
        type: ElementType,
        content: string,
        styles: StyleProperties,
        position: { x: number; y: number }
    ) {
        const newElement: BuilderElement = {
            id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            content,
            styles: { ...styles, position: 'absolute', top: `${position.y}px`, left: `${position.x}px` },
            position
        }
        elements.value.push(newElement)
        selectedElementId.value = newElement.id
        return newElement.id
    }

    function updateElement(id: string, updates: Partial<BuilderElement>) {
        const index = elements.value.findIndex(el => el.id === id)
        if (index !== -1) {
            elements.value[index] = { ...elements.value[index], ...updates } as BuilderElement
        }
    }

    function updateElementStyles(id: string, styles: Partial<StyleProperties>) {
        const element = elements.value.find(el => el.id === id)
        if (element) {
            element.styles = { ...element.styles, ...styles }
        }
    }

    function updateElementContent(id: string, content: string) {
        const element = elements.value.find(el => el.id === id)
        if (element) {
            element.content = content
        }
    }

    function deleteElement(id: string) {
        const index = elements.value.findIndex(el => el.id === id)
        if (index !== -1) {
            elements.value.splice(index, 1)
            if (selectedElementId.value === id) {
                selectedElementId.value = null
            }
        }
    }

    function selectElement(id: string | null) {
        selectedElementId.value = id
    }

    function clearCanvas() {
        elements.value = []
        selectedElementId.value = null
    }

    // ===== SAVE/LOAD FUNCTIONALITY =====

    const STORAGE_KEY = 'builder-project'

    function saveProject() {
        const project = {
            elements: elements.value,
            timestamp: new Date().toISOString()
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
            return true
        } catch (error) {
            console.error('Failed to save project:', error)
            return false
        }
    }

    function loadProject() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                const project = JSON.parse(saved)
                elements.value = project.elements || []
                selectedElementId.value = null
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to load project:', error)
            return false
        }
    }

    function exportProject() {
        const project = {
            elements: elements.value,
            timestamp: new Date().toISOString(),
            version: '1.0'
        }
        return JSON.stringify(project, null, 2)
    }

    function importProject(jsonString: string) {
        try {
            const project = JSON.parse(jsonString)
            if (project.elements && Array.isArray(project.elements)) {
                elements.value = project.elements
                selectedElementId.value = null
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to import project:', error)
            return false
        }
    }

    function hasUnsavedChanges() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (!saved) return elements.value.length > 0

            const project = JSON.parse(saved)
            return JSON.stringify(elements.value) !== JSON.stringify(project.elements)
        } catch {
            return false
        }
    }

    return {
        // State
        elements,
        selectedElementId,
        // Getters
        selectedElement,
        allElements,
        // Actions
        addElement,
        updateElement,
        updateElementStyles,
        updateElementContent,
        deleteElement,
        selectElement,
        clearCanvas,
        // Save/Load
        saveProject,
        loadProject,
        exportProject,
        importProject,
        hasUnsavedChanges
    }
})
