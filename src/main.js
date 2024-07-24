/* eslint-disable no-unused-vars */
console.log('JavaScript file is being read.')
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import './styles.css'
import gsap from 'gsap'

document.addEventListener('DOMContentLoaded', function () {
  const mainTitles = document.querySelectorAll('.main_left_titles_item')

  mainTitles.forEach((title) => {
    const mainImage = title.querySelector('.main_image')
    let imageTimeline = gsap.timeline({ paused: true })

    // Define the image animation
    imageTimeline.to(mainImage, {
      duration: 0.5,
      x: 45,
      display: 'block',
      height: '100%',
      marginLeft: '35%',
      scale: '2',
      onComplete: function () {
        imageTimeline.reverse() // Reverse the timeline on complete
      },
    })

    title.addEventListener('mouseover', function () {
      // Trigger the image animation
      imageTimeline.play()

      // Animate the title independently
      gsap.to(title, {
        x: 25,
        duration: 0.5,
        opacity: 1,
        ease: 'power3.out',
      })
    })

    title.addEventListener('mouseout', function () {
      // Animate the title back to its original position independently
      gsap.to(title, {
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
      })
    })
  })
})

document.addEventListener('DOMContentLoaded', function () {
  // Select all elements with the class 'blog_card_wrap'
  const blogCards = document.querySelectorAll('.blog_card_wrap')

  blogCards.forEach(function (blogCard) {
    // Define GSAP animation for each card
    const hoverAnimation = gsap.to(blogCard, {
      duration: 0.3,
      borderColor: 'pink',
      borderWidth: 1.2,
      paused: true, // Animation paused initially
    })

    // Define GSAP animation for rotating the icon
    const iconAnimation = gsap.to(
      blogCard.querySelectorAll('.g_link-title_icon'),
      {
        duration: 0.3,
        rotation: 45, // Rotate 45 degrees
        paused: true, // Animation paused initially
      }
    )

    // Trigger animations on hover for each card
    blogCard.addEventListener('mouseenter', function () {
      hoverAnimation.play()
      iconAnimation.play() // Play icon rotation animation
    })

    blogCard.addEventListener('mouseleave', function () {
      hoverAnimation.reverse() // Reverse card animation on mouse leave
      iconAnimation.reverse() // Reverse icon rotation animation on mouse leave
    })
  })
})

document.addEventListener('DOMContentLoaded', function () {
  const contactMessage = document.getElementById('nav_contact_message')
  const contactButton = document.getElementById('nav_contact')
  const emailAddress = document.getElementById('email_address')
  const homeImage = document.getElementById('home_image')

  const timeline = gsap.timeline({ paused: true })
  timeline.to(contactMessage, {
    opacity: 1,
    duration: 0.72,
    ease: 'power3.out',
    display: 'block',
  })
  timeline.to(homeImage, {
    opacity: 0,
    duration: 3,
    ease: 'power3.out',
  })
  timeline.to(homeImage, {
    opacity: 1,
    duration: 1,
    ease: 'power1.out',
  })
  timeline.to(contactMessage, {
    delay: 2,
    opacity: 0,
    duration: 2,
    ease: 'power1.out',
    display: 'none',
  })

  contactButton.addEventListener('click', function () {
    timeline.restart()
    // Copy email address to clipboard
    navigator.clipboard
      .writeText(emailAddress.innerText)
      .then(() => {
        console.log('Email address copied to clipboard - test')
      })
      .catch((error) => {
        console.error('Unable to copy email address to clipboard:', error)
      })
  })
})

document.addEventListener('DOMContentLoaded', function () {
  const footerText = document.querySelector('.footer_text')

  if (footerText) {
    const currentYear = new Date().getFullYear()
    footerText.innerText = 'Circa9 Studio © ' + currentYear.toString()
  } else {
    console.error("Element with class 'footer_text' not found.")
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const NavLinkIDs = document.querySelectorAll('#nav_link_id')

  NavLinkIDs.forEach(function (NavLinkID) {
    // Add event listener for mouseover
    NavLinkID.addEventListener('mouseover', function () {
      // Apply color change with fade effect
      NavLinkID.style.transition = 'color 0.21s'
      NavLinkID.style.color = '#4f38ff'
    })

    // Add event listener for mouseout
    NavLinkID.addEventListener('mouseout', function () {
      // Reset color back to white with fade effect
      NavLinkID.style.transition = 'color 0.3s'
      NavLinkID.style.color = 'white'
    })
  })

  const recentProjectImage = document.querySelector(
    '.hero_recent-project_image'
  )
  recentProjectImage.style.transition = 'transform 0.3s' // Add transition for scaling

  recentProjectImage.addEventListener('mouseover', function () {
    recentProjectImage.style.transform = 'scale(1.07)'
  })

  recentProjectImage.addEventListener('mouseout', function () {
    recentProjectImage.style.transform = 'scale(1)' // Reset scale on mouseout
  })
})

document.addEventListener('DOMContentLoaded', function () {
  // Learn more button click to scroll to blog

  document
    .querySelector('.btn_main_wrap')
    .addEventListener('click', function () {
      // Scroll to the target element smoothly
      document.querySelector('.blog_wrap').scrollIntoView({
        behavior: 'smooth',
      })
    })

  document.querySelector('#nav_blog').addEventListener('click', function () {
    //scroll to the target element smoothly
    document.querySelector('.blog_wrap').scrollIntoView({
      behavior: 'smooth',
    })
  })

  document.querySelector('#nav_work').addEventListener('click', function () {
    //scroll to the target element smoothly
    document.querySelector('#work_wrap').scrollIntoView({
      behavior: 'smooth',
    })
  })
})

