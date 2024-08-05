/* eslint-disable no-unused-vars */

/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

import gsap from 'gsap'
import ScrollTrigger from 'gsap/src/ScrollTrigger'
import './styles.css'
import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

gsap.registerPlugin(ScrollTrigger)

// Hide console logs
document.addEventListener('DOMContentLoaded', function () {
  const originalConsoleLog = console.log
  let hasLogged = false
  console.log = function () {
    if (!hasLogged) {
      originalConsoleLog.call(console, 'Designed & Developed by Circa9')
      hasLogged = true
    }
  }
})

// Scroll to top button
document.addEventListener('DOMContentLoaded', function () {
  const footerScroll = document.querySelector('.footer_scroll')

  if (footerScroll) {
    footerScroll.addEventListener('click', (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    })
  }
})

// Initialize Vanta effect
document.addEventListener('DOMContentLoaded', function () {
  // Initialize Vanta effect
  initHeroTopologyEffect()

  // Initialize other effects
  initInteractiveParticles()
  setupHoverAnimations()
  initBlogCardEffects()

  // Add fade-in and stagger animations
  fadeInWebsite()

  // Add scroll to top functionality
  setupScrollToTop()

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
    // Fade out both buttons
    gsap.to([activeButton, inactiveButton], {
      opacity: 0,
      duration: 0.3,
      stagger: 0.1,
      onComplete: () => {
        if (hideContainer.style.display !== 'none') {
          toggleContainers(showContainer, hideContainer)
        } else {
          showContainer.style.display = 'block'
          gsap.fromTo(
            showContainer,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
          )
        }
        setActiveButton(activeButton, inactiveButton)

        // Fade in both buttons
        gsap.to([activeButton, inactiveButton], {
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.4, // Delay the fade-in to allow for container transition
        })
      },
    })
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

  // Add smooth scrolling for navigation links
  setupSmoothScrolling()
})

// Animations

// Vanta effect Topology
function initHeroTopologyEffect() {
  const cgContainer = document.querySelector('.cg_container')
  if (!cgContainer) return

  if (typeof VANTA === 'undefined' || typeof VANTA.TOPOLOGY !== 'function')
    return

  window.addEventListener('load', () => {
    setTimeout(() => {
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
          points: 10,
          maxDistance: 20.0,
          spacing: 15.0,
          showDots: false,
        })
      } catch (error) {
        cgContainer.style.backgroundColor = '#000'
      }
    }, 1000)
  })
}

// Interactive Particles
function initInteractiveParticles() {
  const fxContainer = document.querySelector('.fx_container')
  if (!fxContainer) return

  const { scene, camera, renderer, particles, raycaster, pointer } =
    initThreeScene(fxContainer)

  let animationId = null
  let isHovering = false

  function animate() {
    if (!isHovering) {
      cancelAnimationFrame(animationId)
      return
    }

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
    animationId = requestAnimationFrame(animate)
  }

  // Add hover event listeners to all cards
  const cards = document.querySelectorAll('.blog_card_wrap')
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      isHovering = true
      gsap.to(fxContainer, { opacity: 1, duration: 0.5 })
      animate()
    })
    card.addEventListener('mouseleave', () => {
      isHovering = false
      gsap.to(fxContainer, { opacity: 0, duration: 0.5 })
    })
  })

  // Initial state: hidden
  fxContainer.style.opacity = 0

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
  blogCards.forEach((card) => {
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

// Hover Animations for Projects
function setupHoverAnimations() {
  const items = document.querySelectorAll('.main_left_titles_item')
  const projectsImage = document.querySelector('.projects_image')

  function hoverIn(mainImage) {
    if (!projectsImage) return
    gsap.killTweensOf(projectsImage)
    projectsImage.style.backgroundImage = `url("${mainImage.src}")`
    gsap.fromTo(
      projectsImage,
      { opacity: 0, x: -50, scale: 1 },
      { duration: 1.2, opacity: 1, x: 0, scale: 1, ease: 'power3.out' }
    )
  }

  function hoverOut() {
    if (!projectsImage) return
    gsap.killTweensOf(projectsImage)
    gsap.to(projectsImage, {
      duration: 0.75,
      opacity: 0,
      ease: 'power2.in',
    })
  }

  if (projectsImage) {
    items.forEach((item) => {
      const mainImage = item.querySelector('img')
      if (mainImage) {
        item.addEventListener('mouseenter', () => hoverIn(mainImage))
        item.addEventListener('mouseleave', hoverOut)
      }
    })
  }
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
  }
}

function setupScrollToTop() {
  const footerScroll = document.querySelector('.footer_scroll')

  if (footerScroll) {
    footerScroll.addEventListener('click', (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    })
  }
}

function setupSmoothScrolling() {
  const navLinks = {
    nav_blog: '#blog_section',
    nav_work: '#work_wrap',
    nav_contact: '#contact_section',
  }

  Object.entries(navLinks).forEach(([navId, targetSelector]) => {
    const navElement = document.getElementById(navId)
    if (navElement) {
      navElement.addEventListener('click', (e) => {
        e.preventDefault()
        if (navId === 'nav_contact') {
          const contactMessage = document.getElementById('nav_contact_message')
          const emailAddress = document.querySelector('.email-address')

          if (contactMessage && emailAddress) {
            navigator.clipboard
              .writeText(emailAddress.textContent.trim())
              .then(() => {
                contactMessage.style.display = 'block'
                gsap.fromTo(
                  contactMessage,
                  { opacity: 0 },
                  { opacity: 1, duration: 0.5 }
                )

                setTimeout(() => {
                  gsap.to(contactMessage, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                      contactMessage.style.display = 'none'
                    },
                  })
                }, 7000)
              })
              .catch((err) => {
                console.error('Failed to copy email: ', err)
              })
          }
        } else {
          const targetElement = document.querySelector(targetSelector)
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        }
      })
    }
  })
}
