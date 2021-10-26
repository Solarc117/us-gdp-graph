'use strict';

let isDarkTheme = true;

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  const body = document.body,
    rects = document.querySelectorAll('rect'),
    canvas = document.querySelector('.canvas'),
    darkStyles = {
      body: {
        background: 'hsl(0, 0%, 20%)',
        color: 'hsl(33, 100%, 75%)',
      },
      rects: {
        fill: 'hsl(182, 25%, 40%)',
      },
    },
    lightStyles = {
      body: {
        background: 'hsl(0, 0%, 95%)',
        color: 'hsl(182, 25%, 40%)',
      },
      rects: {
        fill: 'hsl(33, 100%, 75%)',
      },
    },
    duration = 500;

  canvas.classList.toggle('light');
  canvas.classList.toggle('dark');
  body.classList.toggle('light');
  body.classList.toggle('dark');

  body.animate(
    isDarkTheme
      ? [lightStyles.body, darkStyles.body]
      : [darkStyles.body, lightStyles.body],

    duration
  );
  rects.forEach(rect =>
    rect.animate(
      isDarkTheme
        ? [lightStyles.rects, darkStyles.rects]
        : [darkStyles.rects, lightStyles.rects],

      duration
    )
  );
}

const button = document.querySelector('.theme-button');
button.addEventListener('click', toggleTheme);
