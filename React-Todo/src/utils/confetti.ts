export function launchConfetti(): void {
  const colors = [
    '#6366f1','#8b5cf6','#ec4899','#f59e0b',
    '#22c55e','#3b82f6','#06b6d4','#f43f5e',
  ]
  const shapes = ['50%', '2px', '4px', '6px']

  for (let i = 0; i < 70; i++) {
    const el    = document.createElement('div')
    const size  = Math.random() * 9 + 5
    const color = colors[Math.floor(Math.random() * colors.length)]
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    const dur   = (Math.random() * 0.9 + 1.0).toFixed(2)
    const delay = (Math.random() * 0.7).toFixed(2)

    el.className = 'confetti-bit'
    el.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${Math.random() * 100}%;
      top: -${size + 10}px;
      border-radius: ${shape};
      pointer-events: none;
      z-index: 9999;
      --dur: ${dur}s;
      --delay: ${delay}s;
      animation-fill-mode: both;
    `
    document.body.appendChild(el)
    setTimeout(() => el.remove(), (parseFloat(dur) + parseFloat(delay) + 0.5) * 1000)
  }
}
