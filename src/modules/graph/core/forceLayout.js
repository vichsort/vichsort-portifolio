/**
 * Layout de forças simples para o grafo de conhecimento (poucas dezenas de nós).
 *
 * Determinístico: as posições iniciais saem de uma espiral na ordem dos nós,
 * então o mesmo grafo sempre gera o mesmo desenho. Roda inteiro de uma vez
 * (sem animação), e o resultado é esticado para caber em width × height.
 *
 * @param {{ id: string, radius?: number }[]} nodes
 * @param {{ source: string, target: string }[]} edges
 * @param {{ width: number, height: number, padding?: number, iterations?: number }} options
 * @returns {Map<string, { x: number, y: number }>}
 */
export function forceLayout(nodes, edges, { width, height, padding = 24, iterations = 400 }) {
  const points = nodes.map((node, i) => {
    // Espiral de Fermat: espalha os nós sem sobreposição inicial
    const angle = i * 2.399963
    const r = 10 * Math.sqrt(i + 1)
    return { id: node.id, radius: node.radius || 6, x: r * Math.cos(angle), y: r * Math.sin(angle), vx: 0, vy: 0 }
  })
  const byId = new Map(points.map((p) => [p.id, p]))
  const links = edges.map((e) => [byId.get(e.source), byId.get(e.target)]).filter(([a, b]) => a && b)

  const repulsion = 900
  const springLength = 46
  const springStrength = 0.04
  const gravity = 0.012

  for (let step = 0; step < iterations; step++) {
    const cooling = 1 - step / iterations

    for (let i = 0; i < points.length; i++) {
      const a = points[i]
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j]
        let dx = a.x - b.x
        let dy = a.y - b.y
        const dist2 = Math.max(dx * dx + dy * dy, 1)
        const dist = Math.sqrt(dist2)
        const minDist = a.radius + b.radius + 6
        // Repulsão de carga, mais um empurrão extra quando os círculos se tocam
        const force = repulsion / dist2 + (dist < minDist ? (minDist - dist) * 0.5 : 0)
        dx /= dist
        dy /= dist
        a.vx += dx * force
        a.vy += dy * force
        b.vx -= dx * force
        b.vy -= dy * force
      }
    }

    for (const [a, b] of links) {
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 0.01)
      const force = (dist - springLength) * springStrength
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      a.vx += fx
      a.vy += fy
      b.vx -= fx
      b.vy -= fy
    }

    for (const p of points) {
      p.vx -= p.x * gravity
      p.vy -= p.y * gravity
      // Limite de deslocamento por passo, que diminui ao longo da simulação
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
      const max = 12 * cooling + 0.5
      if (speed > max) {
        p.vx = (p.vx / speed) * max
        p.vy = (p.vy / speed) * max
      }
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.6
      p.vy *= 0.6
    }
  }

  // Estica para a área disponível, cada eixo com a própria escala: o grafo
  // ocupa a largura toda em vez de virar um círculo no meio de um retângulo
  const minX = Math.min(...points.map((p) => p.x))
  const maxX = Math.max(...points.map((p) => p.x))
  const minY = Math.min(...points.map((p) => p.y))
  const maxY = Math.max(...points.map((p) => p.y))
  const scaleX = (width - padding * 2) / (maxX - minX || 1)
  const scaleY = (height - padding * 2) / (maxY - minY || 1)

  return new Map(
    points.map((p) => [p.id, { x: padding + (p.x - minX) * scaleX, y: padding + (p.y - minY) * scaleY }])
  )
}
