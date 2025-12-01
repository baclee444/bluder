export enum ElementType {
    DIV = 'div',
    TEXT = 'text',
    BUTTON = 'button',
    IMAGE = 'image'
}

export interface StyleProperties {
    width?: string
    height?: string
    backgroundColor?: string
    color?: string
    padding?: string
    margin?: string
    border?: string
    borderRadius?: string
    fontSize?: string
    fontWeight?: string
    textAlign?: string
    display?: string
    position?: string
    top?: string
    left?: string
}

export interface BuilderElement {
    id: string
    type: ElementType
    content: string
    styles: StyleProperties
    position: {
        x: number
        y: number
    }
}

export interface PaletteItem {
    type: ElementType
    label: string
    icon: string
    defaultContent: string
    defaultStyles: StyleProperties
}