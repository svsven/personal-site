let animations = [];
const STATE_KEY = "particles.showParticles";
const container = document.getElementById("particle-container");
const wrapper = document.getElementById("particles");
const toggleButton = document.getElementById("toggle-particles");
const toggleOffLine = document.getElementById("toggle-off-line");
const PARTICLE_COUNT_SMALL_SCREEN = 12;
const PARTICLE_COUNT_LARGE_SCREEN = 36;

const getRandomPosition = () => {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
  };
};

const createElement = (index) => {
  const el = document.createElement("span");
  el.classList.add("particle", `particle-${index}`);
  return el;
};

const checkPositions = (startPosition, endPosition) => {
  const min = 30;
  const max = 60;

  const xDiff = Math.abs(startPosition.x - endPosition.x);
  const yDiff = Math.abs(startPosition.y - endPosition.y);

  return xDiff >= min && xDiff <= max && yDiff >= min && yDiff <= max;
};

const animateParticle = (element, index) => {
  let startPosition, endPosition;
  let attempts = 0;
  const maxAttempts = 100;
  do {
    startPosition = getRandomPosition();
    endPosition = getRandomPosition();
    attempts++;
  } while (
    !checkPositions(startPosition, endPosition) &&
    attempts < maxAttempts
  );

  const animation = element.animate(
    [
      {
        opacity: 0,
        transform: `translate(${startPosition.x}vw, ${startPosition.y}vh)`,
      },
      { opacity: 1 },
      {
        opacity: 0,
        transform: `translate(${endPosition.x}vw, ${endPosition.y}vh)`,
      },
    ],
    {
      duration: Math.random() * (16000 - 8000) + 8000,
      delay: Math.random() * 2000,
      easing: "ease-in-out",
      direction: "alternate",
    },
  );

  animations[index] = animation;
  animation.onfinish = () => {
    animateParticle(element, index);
  };
};

const createParticles = (particleCount) => {
  if (container) {
    for (let i = 0; i < particleCount; i++) {
      const element = createElement(i);
      container.appendChild(element);
      animateParticle(element, i);
    }
  }
};

const clearParticles = () => {
  animations.forEach((animation) => animation.cancel());
  animations = [];

  const particles = document.querySelectorAll(".particle");
  particles.forEach((particle) => particle.remove());
};

const toggleParticles = (newState = false) => {
  localStorage.setItem(STATE_KEY, newState);
  container.style.display = newState ? "block" : "none";
  toggleOffLine.style.display = newState ? "none" : "block";

  if (!animations || animations.length === 0) {
    createParticles(
      isLargerScreen.matches
        ? PARTICLE_COUNT_LARGE_SCREEN
        : PARTICLE_COUNT_SMALL_SCREEN,
    );
  }

  animations.forEach((animation) => {
    if (newState) {
      animation.play();
    } else {
      animation.pause();
    }
  });
};

const isLargerScreen = window.matchMedia("(min-width: 600px)");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

prefersReducedMotion.onchange = (e) => {
  toggleParticles(e.matches ? false : true);
};

isLargerScreen.onchange = (e) => {
  clearParticles();
  createParticles(
    isLargerScreen.matches
      ? PARTICLE_COUNT_LARGE_SCREEN
      : PARTICLE_COUNT_SMALL_SCREEN,
  );
};

const initialize = () => {
  localStorage.setItem(
    STATE_KEY,
    prefersReducedMotion.matches ? "false" : "true",
  );

  if (!prefersReducedMotion.matches) {
    createParticles(
      isLargerScreen.matches
        ? PARTICLE_COUNT_LARGE_SCREEN
        : PARTICLE_COUNT_SMALL_SCREEN,
    );
  } else {
    toggleOffLine.style.display = "block";
  }
};

if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    const enabled = localStorage.getItem(STATE_KEY) === "true";

    toggleParticles(!enabled);
  });
}

window.addEventListener("load", initialize);
