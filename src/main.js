/* eslint-disable no-unused-vars */

/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

import gsap from 'gsap'
import ScrollTrigger from 'gsap/src/ScrollTrigger'
import './styles.css'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

gsap.registerPlugin(ScrollTrigger)

/*
document.addEventListener('DOMContentLoaded', function () {
  const navLink1 = document.getElementById('nav_link_1')
  if (navLink1) {
    navLink1.innerText =
      'Undergoing maintenance. Ill be back in order in a few hours. Happy exploring.'
    navLink1.style.color = 'white'
    navLink1.style.fontWeight = 'bold'
  }
})
  */

// Hide console logs

document.addEventListener('DOMContentLoaded', function () {
  const originalConsoleLog = console.log
  let hasLogged = false
  console.log = function () {
    if (!hasLogged) {
      originalConsoleLog.call(
        console,
        'Designed & Developed by Taun Healy of Circa9'
      )
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

  // Add fade-in and stagger animations
  fadeInWebsite()

  // Add scroll to top functionality
  setupScrollToTop()

  // Add the glowing sphere effect
  initGlowingSphere()

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

    // Remove font size changes
    activeButton.querySelectorAll('*').forEach((el) => {
      el.style.color = 'var(--brand-secondary)'
      el.style.fontSize = '' // Reset font size to default
    })
    inactiveButton.querySelectorAll('*').forEach((el) => {
      el.style.color = ''
      el.style.fontSize = '' // Reset font size to default
    })
  }

  function handleButtonClick(
    showContainer,
    hideContainer,
    activeButton,
    inactiveButton
  ) {
    // Remove the fade-out animation for buttons
    toggleContainers(showContainer, hideContainer)
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

  // Add smooth scrolling for navigation links
  setupSmoothScrolling()

  // Add the blog card read-more effect
  setupBlogCardReadMoreEffect()
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
    }, 300) // Reduced from 700 to 300 milliseconds
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
      gsap.to(fxContainer, { opacity: 1, duration: 0.3 })
      animate()
    })
    card.addEventListener('mouseleave', () => {
      isHovering = false
      gsap.to(fxContainer, { opacity: 0, duration: 0.3 })
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

// Hover Animations for Projects
function setupHoverAnimations() {
  const items = document.querySelectorAll('.main_left_titles_item')
  const projectsImage = document.querySelector('.fixed-image-container')

  console.log('Items found:', items.length)
  console.log('Projects image container found:', !!projectsImage)

  // Create a single image element that we'll reuse
  const img = document.createElement('img')
  img.style.position = 'absolute'
  img.style.top = '0'
  img.style.left = '0'
  img.style.width = '100%'
  img.style.height = '100%'
  img.style.objectFit = 'cover'
  img.style.opacity = '0' // Start with the image hidden

  if (projectsImage) {
    projectsImage.appendChild(img)
  }

  // Initialize the neon balls animation
  const neonBallsCanvas = initGlowingSphere()

  let currentItem = null

  function hoverIn(item) {
    if (!projectsImage || currentItem === item) return

    currentItem = item
    const mainImage = item.querySelector('img')
    console.log('Hover in', mainImage.src)

    gsap.killTweensOf(img)
    gsap.killTweensOf(neonBallsCanvas)

    // Set the new image source before starting the animation
    img.src = mainImage.src

    // Use a short delay to ensure the new image is loaded
    setTimeout(() => {
      gsap.fromTo(
        img,
        { opacity: 0.5, scale: 1.05 }, // Increased start opacity and reduced scale
        {
          duration: 0.4, // Slightly reduced duration
          opacity: 1,
          scale: 1,
          ease: 'power2.out',
          onStart: () => {
            console.log('Animation started')
            gsap.to(neonBallsCanvas, { duration: 0.3, opacity: 0 })
          },
          onComplete: () => console.log('Animation completed'),
        }
      )
    }, 50) // Short delay to allow image loading
  }

  function hoverOut() {
    if (!projectsImage || !currentItem) return
    console.log('Hover out')

    currentItem = null
    gsap.killTweensOf(img)
    gsap.killTweensOf(neonBallsCanvas)

    gsap.to(img, {
      duration: 0.3,
      opacity: 0,
      scale: 1.1,
      ease: 'power2.in',
      onComplete: () => {
        console.log('Hover out animation completed')
        gsap.to(neonBallsCanvas, { duration: 0.5, opacity: 1 })
      },
    })
  }

  if (projectsImage) {
    items.forEach((item, index) => {
      const mainImage = item.querySelector('img')
      if (mainImage) {
        console.log(`Adding event listeners to item ${index}`)
        item.addEventListener('mouseenter', () => hoverIn(item))
        item.addEventListener('mouseleave', hoverOut)
      } else {
        console.error(`No image found for item ${index}`)
      }
    })
  } else {
    console.error('Projects image container not found')
  }
}

// Make sure to call the function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setupHoverAnimations)

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

// New function to create the glowing sphere
function initGlowingSphere() {
  const container = document.querySelector('.fixed-image-container')
  if (!container) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )
  const renderer = new THREE.WebGLRenderer({ alpha: true })

  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  const geometry = new THREE.PlaneGeometry(2, 2)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector3(
          container.clientWidth,
          container.clientHeight,
          1
        ),
      },
    },
    vertexShader: `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float iTime;
      uniform vec3 iResolution;

      float stepping(float t){
          if(t<0.)return -1.+pow(1.+t,2.);
          else return 1.-pow(1.-t,2.);
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord )
      {
        vec2 uv = (fragCoord*2.-iResolution.xy)/iResolution.y;
        fragColor = vec4(0);
        uv = normalize(uv) * length(uv);
        for(int i=0;i<12;i++){
            float t = iTime + float(i)*3.141592/12.*(5.+1.*stepping(sin(iTime*3.)));
            vec2 p = vec2(cos(t),sin(t));
            p *= cos(iTime + float(i)*3.141592*cos(iTime/8.));
            vec3 col = cos(vec3(0,1,-1)*3.141592*2./3.+3.141925*(iTime/2.+float(i)/5.)) * 0.5 + 0.5;
            // Adjust color to purple hues
            col = mix(vec3(0.3, 0, 0.6), vec3(0.15, 0, 0.3), col.x);
            fragColor += vec4(0.03/length(uv-p*0.9)*col,1.0);
        }
        fragColor.xyz = pow(fragColor.xyz,vec3(2.2));
        fragColor.xyz = smoothstep(0.0, 0.8, fragColor.xyz);
        fragColor.w = 1.0;
      }

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `,
    transparent: true,
  })

  const quad = new THREE.Mesh(geometry, material)
  scene.add(quad)

  camera.position.z = 1

  function animate() {
    requestAnimationFrame(animate)
    material.uniforms.iTime.value += 0.01
    renderer.render(scene, camera)
  }

  animate()

  // Resize handler
  window.addEventListener('resize', () => {
    const width = container.clientWidth
    const height = container.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    material.uniforms.iResolution.value.set(width, height, 1)
  })

  return renderer.domElement
}

function setupBlogCardReadMoreEffect() {
  const blogCards = document.querySelectorAll('.blog_card_wrap')

  blogCards.forEach((card) => {
    const readMoreElement = card.querySelector('.blog_card_read-more')
    const categoryCircle = card.querySelector('.blog_card_category-circle')
    if (!readMoreElement || !categoryCircle) return

    const originalText = readMoreElement.innerText
    let interval

    function shuffleText(target, progress) {
      const finalText = 'open'
      return finalText
        .split('')
        .map((letter, index) => {
          if (index < progress) {
            return finalText[index]
          }
          return String.fromCharCode(97 + Math.floor(Math.random() * 26))
        })
        .join('')
        .slice(0, 5)
    }

    function animateText(forward = true) {
      clearInterval(interval)
      let iteration = forward ? 0 : 5
      const maxIterations = 5

      interval = setInterval(() => {
        if (forward && iteration >= maxIterations) {
          clearInterval(interval)
          readMoreElement.innerText = 'explore'
          return
        }
        if (!forward && iteration <= 0) {
          clearInterval(interval)
          readMoreElement.innerText = originalText
          return
        }

        readMoreElement.innerText = shuffleText(originalText, iteration)
        iteration += forward ? 0.5 : -0.5
      }, 30)
    }

    // Add neon glow effect
    const neonGlow = createNeonGlowEffect(categoryCircle)

    card.addEventListener('mouseenter', () => {
      animateText(true)
      neonGlow.visible = true
    })
    card.addEventListener('mouseleave', () => {
      animateText(false)
      neonGlow.visible = false
    })
  })
}

function createNeonGlowEffect(element) {
  const rect = element.getBoundingClientRect()
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
  const renderer = new THREE.WebGLRenderer({ alpha: true })

  renderer.setSize(rect.width, rect.height)
  element.appendChild(renderer.domElement)

  const geometry = new THREE.CircleGeometry(0.5, 32)
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const circle = new THREE.Mesh(geometry, material)
  scene.add(circle)

  camera.position.z = 1

  // Add bloom effect
  const renderScene = new RenderPass(scene, camera)
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(rect.width, rect.height),
    1.5,
    0.4,
    0.85
  )
  bloomPass.threshold = 0
  bloomPass.strength = 2
  bloomPass.radius = 0.5

  const composer = new EffectComposer(renderer)
  composer.addPass(renderScene)
  composer.addPass(bloomPass)

  function animate() {
    requestAnimationFrame(animate)
    composer.render()
  }
  animate()

  // Hide initially
  renderer.domElement.style.opacity = 0
  renderer.domElement.style.transition = 'opacity 0.3s'

  return {
    get visible() {
      return this._visible
    },
    set visible(value) {
      this._visible = value
      renderer.domElement.style.opacity = value ? 1 : 0
    },
  }
}
