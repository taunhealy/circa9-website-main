/* eslint-disable no-unused-vars */
console.log('JavaScript file is being read.')
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

import gsap from 'gsap'
import ScrollTrigger from 'gsap/src/ScrollTrigger'
import './styles.css'
import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

console.log('main.js is loading')

gsap.registerPlugin(ScrollTrigger)

console.log('main.js is loading')

console.log(
  'VANTA object:',
  typeof VANTA !== 'undefined' ? VANTA : 'VANTA not found'
)

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM content loaded')

  console.log(
    'VANTA object after DOM load:',
    typeof VANTA !== 'undefined' ? VANTA : 'VANTA not found'
  )

  console.log(
    'VANTA.TOPOLOGY:',
    typeof VANTA !== 'undefined' && VANTA.TOPOLOGY ? 'exists' : 'does not exist'
  )

  // Initialize Vanta effect
  initHeroTopologyEffect()

  // Initialize other effects
  initInteractiveParticles()
  setupHoverAnimations()
  initBlogCardEffects()

  // Add fade-in and stagger animations
  fadeInWebsite()
  staggerHeroElements()

  // Filtering functionality
  const customButton = document.getElementById('button-custom')
  const themesButton = document.getElementById('button-themes')
  const customContainer = document.getElementById('work-is-custom')
  const themesContainer = document.getElementById('work-is-themes')

  function toggleContainers(showContainer, hideContainer) {
    gsap.to(hideContainer, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        hideContainer.style.display = 'none'
        showContainer.style.display = 'block'
        gsap.fromTo(
          showContainer,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        )
      },
    })
  }

  function setActiveButton(activeButton, inactiveButton) {
    activeButton.classList.add('is-active')
    inactiveButton.classList.remove('is-active')

    activeButton.style.color = 'var(--brand-secondary)'
    inactiveButton.style.color = ''

    activeButton
      .querySelectorAll('*')
      .forEach((el) => (el.style.color = 'var(--brand-secondary)'))
    inactiveButton.querySelectorAll('*').forEach((el) => (el.style.color = ''))
  }

  function handleButtonClick(
    showContainer,
    hideContainer,
    activeButton,
    inactiveButton
  ) {
    if (hideContainer.style.display !== 'none') {
      toggleContainers(showContainer, hideContainer)
    } else {
      showContainer.style.display = 'block'
      gsap.fromTo(showContainer, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    }
    setActiveButton(activeButton, inactiveButton)
  }

  customButton.addEventListener('click', () =>
    handleButtonClick(
      customContainer,
      themesContainer,
      customButton,
      themesButton
    )
  )
  themesButton.addEventListener('click', () =>
    handleButtonClick(
      themesContainer,
      customContainer,
      themesButton,
      customButton
    )
  )

  // Initialize with custom projects visible
  customContainer.style.display = 'block'
  themesContainer.style.display = 'none'
  setActiveButton(customButton, themesButton)

  // Set the CSS variable
  document.documentElement.style.setProperty('--brand-secondary', '#2800dc')

  console.log('main.js has finished loading')
})

// Animations

function initHeroTopologyEffect() {
  const cgContainer = document.querySelector('.cg_container')
  if (!cgContainer) {
    console.error('cg_container element not found')
    return
  }

  if (typeof VANTA === 'undefined' || typeof VANTA.TOPOLOGY !== 'function') {
    console.error(
      'VANTA.TOPOLOGY is not a function. Make sure the script is loaded correctly.'
    )
    return
  }

  try {
    window.vantaEffect = VANTA.TOPOLOGY({
      el: cgContainer,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x4838ff,
      backgroundColor: 0x0,
      points: 12,
      maxDistance: 20.0,
      spacing: 15.0,
      THREE: THREE, // Explicitly pass THREE
      speed: 1.5,
    })
    console.log('Vanta effect initialized successfully')
  } catch (error) {
    console.error('Error initializing Hero Topology Effect:', error)
  }
}

function initInteractiveParticles() {
  console.log('Initializing Interactive Particles Effect')
  const fxContainer = document.querySelector('.fx_container')
  if (!fxContainer) {
    console.error('fx_container element not found')
    return
  }

  const { scene, camera, renderer, particles, raycaster, pointer } =
    initThreeScene(fxContainer)

  function animate() {
    particles.rotation.x += 0.0005
    particles.rotation.y += 0.001

    const geometry = particles.geometry
    const attributes = geometry.attributes

    raycaster.setFromCamera(pointer, camera)

    const intersects = raycaster.intersectObject(particles)

    if (intersects.length > 0) {
      if (particles.userData.INTERSECTED != intersects[0].index) {
        attributes.size.array[particles.userData.INTERSECTED] = 20
        particles.userData.INTERSECTED = intersects[0].index
        attributes.size.array[particles.userData.INTERSECTED] = 20 * 1.25
        attributes.size.needsUpdate = true
      }
    } else if (particles.userData.INTERSECTED !== null) {
      attributes.size.array[particles.userData.INTERSECTED] = 20
      attributes.size.needsUpdate = true
      particles.userData.INTERSECTED = null
    }

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }

  animate()

  window.addEventListener('resize', () => {
    camera.aspect = fxContainer.clientWidth / fxContainer.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(fxContainer.clientWidth, fxContainer.clientHeight)
  })
}

function initThreeScene(container) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    1,
    10000
  )
  camera.position.z = 250

  const renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  const particles = createParticles()
  scene.add(particles)

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  container.addEventListener('pointermove', (event) => {
    const rect = container.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1
  })

  return { scene, camera, renderer, particles, raycaster, pointer }
}

function createParticles() {
  const PARTICLE_SIZE = 20
  let boxGeometry = new THREE.BoxGeometry(200, 200, 200, 16, 16, 16)

  boxGeometry.deleteAttribute('normal')
  boxGeometry.deleteAttribute('uv')

  boxGeometry = mergeVertices(boxGeometry)

  const positionAttribute = boxGeometry.getAttribute('position')

  const colors = []
  const sizes = []

  const color = new THREE.Color()

  for (let i = 0, l = positionAttribute.count; i < l; i++) {
    color.setHSL(3.05 + 0.1 * (i / l), 3.0, 3.7)
    color.toArray(colors, i * 3)
    sizes[i] = PARTICLE_SIZE * 0.5
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', positionAttribute)
  geometry.setAttribute(
    'customColor',
    new THREE.Float32BufferAttribute(colors, 3)
  )
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
      alphaTest: { value: 0.9 },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 customColor;
      varying vec3 vColor;
      void main() {
        vColor = customColor;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float alphaTest;
      varying vec3 vColor;
      void main() {
        vec2 xy = gl_PointCoord.xy - vec2(0.5);
        float ll = length(xy);
        if (ll > 0.5) discard;
        gl_FragColor = vec4(color * vColor, 1.0 - (ll * 2.0));
        if (gl_FragColor.a < alphaTest) discard;
      }
    `,
  })

  return new THREE.Points(geometry, material)
}

function initBlogCardEffects() {
  const blogCards = document.querySelectorAll('.blog_card_wrap')
  console.log(`Found ${blogCards.length} blog cards`)

  blogCards.forEach((card, index) => {
    console.log(`Initializing card ${index + 1}`)
    addGradientBorder(card)
  })
}

function addGradientBorder(card) {
  // Create a wrapper div for the gradient border
  const wrapper = document.createElement('div')
  wrapper.className = 'gradient-border-wrapper'

  // Move the card's contents into the wrapper
  wrapper.innerHTML = card.innerHTML
  card.innerHTML = ''
  card.appendChild(wrapper)

  // Add the gradient border class to the card
  card.classList.add('gradient-border')
}

function setupHoverAnimations() {
  const items = document.querySelectorAll('.main_left_titles_item')
  const projectsImage = document.querySelector('.projects_image')

  if (!projectsImage) {
    console.error('projects_image element not found')
    return
  }

  items.forEach((item) => {
    const mainImage = item.querySelector('img')

    if (!mainImage) {
      return
    }

    function hoverIn() {
      gsap.killTweensOf(projectsImage)

      projectsImage.style.backgroundImage = `url("${mainImage.src}")`

      gsap.fromTo(
        projectsImage,
        {
          opacity: 0,
          x: -100,
          scale: 1,
        },
        {
          duration: 0.7,
          opacity: 1,
          x: 0,
          scale: 1,
          ease: 'power2.out',
        }
      )
    }

    function hoverOut() {
      gsap.killTweensOf(projectsImage)
      gsap.to(projectsImage, {
        duration: 0.3,
        opacity: 0,
        ease: 'power2.in',
      })
    }

    item.addEventListener('mouseenter', hoverIn)
    item.addEventListener('mouseleave', hoverOut)
  })
}

// Make sure to call the function after it's defined
setupHoverAnimations()

function fadeInWebsite() {
  const mainPage = document.querySelector('.page_main')
  if (mainPage) {
    gsap.to(mainPage, {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    })
  } else {
    console.error('.page_main element not found')
  }
}

function staggerHeroElements() {
  const heroElements = document.querySelectorAll('.hero_section > *')
  if (heroElements.length > 0) {
    gsap.from(heroElements, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
      delay: 0.5, // Delay the stagger animation to start after the initial fade-in
    })
  } else {
    console.error('No .hero_section children found')
  }
}
