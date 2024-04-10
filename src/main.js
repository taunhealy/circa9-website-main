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
        x: -25,
        duration: 0.7,
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
