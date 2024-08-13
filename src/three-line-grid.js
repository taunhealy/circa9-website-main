import * as THREE from 'three'

export function createLineGrid(container) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  // Set the background color to dark blue
  renderer.setClearColor(0x000814, 1) // Dark blue background

  // Add fog to the scene
  scene.fog = new THREE.FogExp2(0x000814, 0.0001)

  // Create horizontal lines with glow effect
  const lineColor = 0x2800dc // New deep blue color for the lines
  const lineMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(lineColor) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying vec2 vUv;
      void main() {
        float intensity = 1.0 - distance(vUv, vec2(0.5, 0.5)) * 2.5;
        vec3 gradientColor = mix(vec3(1.2, 1, 1.5), color, vUv.y);
        gl_FragColor = vec4(gradientColor, 1.0) * intensity;
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
  })
  const lines = []

  // Canvas dimensions (A1 portrait size in millimeters)
  const canvasWidth = 594
  const canvasHeight = 841

  // Scale factor to fit the canvas on screen
  const scaleFactor =
    Math.min(
      container.clientWidth / canvasWidth,
      container.clientHeight / canvasHeight
    ) * 0.9

  // Scaled canvas dimensions
  const scaledWidth = canvasWidth * scaleFactor
  const scaledHeight = canvasHeight * scaleFactor

  // Adjust the lines to fit inside the canvas
  const totalLines = 90
  const lineHeight = scaledHeight / totalLines
  const lineSpacing = lineHeight

  for (let i = 0; i < totalLines; i++) {
    const geometry = new THREE.PlaneGeometry(scaledWidth, lineHeight)
    const line = new THREE.Mesh(geometry, lineMaterial)
    line.position.set(0, i * lineSpacing - scaledHeight / 2 + lineHeight / 2, 0)
    lines.push(line)
    scene.add(line)
  }

  // Update camera position
  camera.position.z =
    Math.max(scaledWidth, scaledHeight) /
    (2 * Math.tan((Math.PI * camera.fov) / 360))

  // Animation variables
  const animationDuration = 5000 // Duration for a full cycle (in milliseconds)
  let animationTime = 0

  function animate() {
    requestAnimationFrame(animate)

    // Increment the animation time
    animationTime += 16 // Approximately 60 FPS (1000ms / 60)
    if (animationTime >= animationDuration) {
      animationTime -= animationDuration
    }

    const elapsedTime = animationTime / animationDuration

    lines.forEach((line, index) => {
      // Calculate the phase shift based on the line's index
      const phaseShift = index / totalLines

      // Calculate the current scale factor for this line
      const scaleFactor =
        Math.sin((elapsedTime + phaseShift) * Math.PI * 2) * 0.5 + 1.5

      // Apply the scale factor to the line's height
      line.scale.y = scaleFactor

      // Adjust the line's vertical position to keep it anchored at the bottom
      line.position.y =
        index * lineSpacing - scaledHeight / 2 + (lineHeight * scaleFactor) / 2

      // Update the line's color and opacity
      line.material.uniforms.color.value
        .setRGB(0.16, 0, 0.86) // RGB values for #2800dc
        .multiplyScalar(0.3 + scaleFactor * 1.7)
    })

    renderer.render(scene, camera)
  }

  // Update window resize event handler
  window.addEventListener('resize', () => {
    const newScaleFactor =
      Math.min(
        container.clientWidth / canvasWidth,
        container.clientHeight / canvasHeight
      ) * 0.9
    const newScaledWidth = canvasWidth * newScaleFactor
    const newScaledHeight = canvasHeight * newScaleFactor

    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)

    // Update line positions and sizes
    const newLineHeight = newScaledHeight / totalLines
    const newLineSpacing = newLineHeight

    lines.forEach((line, index) => {
      line.scale.set(
        newScaledWidth / scaledWidth,
        newLineHeight / lineHeight,
        1
      )
      line.position.set(
        0,
        index * newLineSpacing - newScaledHeight / 2 + newLineHeight / 2,
        0
      )
    })

    camera.position.z =
      Math.max(newScaledWidth, newScaledHeight) /
      (2 * Math.tan((Math.PI * camera.fov) / 360))
  })

  return { animate }
}
