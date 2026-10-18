const items = document.querySelectorAll(".enter");

// Only one soundtrack should play at a time.
document.querySelectorAll("video").forEach((video) => {
  video.addEventListener("play", () => {
    document.querySelectorAll("video").forEach((other) => {
      if (other !== video) other.pause();
    });
  });
});

requestAnimationFrame(() => {
  items.forEach((item, index) => {
    window.setTimeout(() => item.classList.add("is-visible"), 70 + index * 90);
  });
});

const portrait = document.querySelector(".portrait-stage");
const finePointer = window.matchMedia("(pointer: fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (portrait && finePointer && !reducedMotion) {
  let frame;
  const updatePortrait = (event) => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      const x = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight - 0.5) * 2));
      portrait.style.setProperty("--portrait-x", `${x * 4}px`);
      portrait.style.setProperty("--portrait-y", `${y * 2}px`);
      portrait.style.setProperty("--portrait-r", `${x * 0.45}deg`);
    });
  };

  window.addEventListener("pointermove", updatePortrait, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => {
    portrait.style.setProperty("--portrait-x", "0px");
    portrait.style.setProperty("--portrait-y", "0px");
    portrait.style.setProperty("--portrait-r", "0deg");
  });
}
