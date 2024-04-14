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
