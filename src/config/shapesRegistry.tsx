import type { ComponentType, SVGProps } from 'react'

export type ShapeId =
  | 'square'
  | 'rectangle'
  | 'star'
  | 'pentagon'
  | 'hexagon'
  | 'circle'
  | 'oval'
  | 'triangle'

export interface ShapeDefinition {
  id: ShapeId
  label: string
  Component: ComponentType<SVGProps<SVGSVGElement>>
}

function Square(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <rect x="10" y="10" width="80" height="80" />
    </svg>
  )
}

function Rectangle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <rect x="5" y="25" width="90" height="50" />
    </svg>
  )
}

function Star(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <polygon points="50,5 61,38 95,38 68,58 79,91 50,72 21,91 32,58 5,38 39,38" />
    </svg>
  )
}

function Pentagon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <polygon points="50,8 93,40 76,88 24,88 7,40" />
    </svg>
  )
}

function Hexagon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" />
    </svg>
  )
}

function Circle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <circle cx="50" cy="50" r="42" />
    </svg>
  )
}

function Oval(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <ellipse cx="50" cy="50" rx="42" ry="28" />
    </svg>
  )
}

function Triangle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <polygon points="50,10 90,85 10,85" />
    </svg>
  )
}

/** Edit this list to add or remove shapes available in the game. */
export const SHAPES: ShapeDefinition[] = [
  { id: 'square', label: 'Square', Component: Square },
  { id: 'rectangle', label: 'Rectangle', Component: Rectangle },
  { id: 'star', label: 'Star', Component: Star },
  { id: 'pentagon', label: 'Pentagon', Component: Pentagon },
  { id: 'hexagon', label: 'Hexagon', Component: Hexagon },
  { id: 'circle', label: 'Circle', Component: Circle },
  { id: 'oval', label: 'Oval', Component: Oval },
  { id: 'triangle', label: 'Triangle', Component: Triangle },
]

export const SHAPE_IDS = SHAPES.map((s) => s.id)

export function getShapeById(id: string): ShapeDefinition | undefined {
  return SHAPES.find((s) => s.id === id)
}
