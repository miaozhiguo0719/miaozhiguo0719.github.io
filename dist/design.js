(() => {
  const dialog = document.querySelector(".design-viewer");
  const triggers = [...document.querySelectorAll("[data-design-image]")];
  if (!dialog || !triggers.length) return;

  const image = dialog.querySelector("#design-viewer-image");
  const title = dialog.querySelector("#design-viewer-title");
  const count = dialog.querySelector("#design-viewer-count");
  const closeButton = dialog.querySelector("[data-close-design]");
  const previousButton = dialog.querySelector("[data-prev-design]");
  const nextButton = dialog.querySelector("[data-next-design]");
  let activeIndex = 0;
  let returnTarget = null;
  let pointerStartedOutside = false;

  const gallery = triggers.map(trigger => {
    const source = trigger.querySelector("img");
    const caption = trigger.closest("figure")?.querySelector("figcaption span");
    return {
      trigger,
      image: source,
      title: caption?.textContent.trim() || source?.alt || "设计作品",
    };
  });

  function showImage(index) {
    activeIndex = (index + gallery.length) % gallery.length;
    const item = gallery[activeIndex];
    image.src = item.image.currentSrc || item.image.src;
    image.alt = item.image.alt || item.title;
    title.textContent = item.title;
    count.textContent =
      String(activeIndex + 1).padStart(2, "0") +
      " / " +
      String(gallery.length).padStart(2, "0");
    previousButton.disabled = gallery.length < 2;
    nextButton.disabled = gallery.length < 2;
  }

  function closeViewer() {
    if (dialog.open) dialog.close();
  }

  function isOutsideDialog(event) {
    const box = dialog.getBoundingClientRect();
    return (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    );
  }

  gallery.forEach((item, index) => {
    item.trigger.addEventListener("click", () => {
      returnTarget = item.trigger;
      showImage(index);
      dialog.showModal();
      closeButton.focus({ preventScroll: true });
    });
  });

  closeButton.addEventListener("click", closeViewer);
  previousButton.addEventListener("click", () => showImage(activeIndex - 1));
  nextButton.addEventListener("click", () => showImage(activeIndex + 1));

  dialog.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showImage(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
    // Escape is handled by the native dialog, preserving its focus trap.
  });

  dialog.addEventListener("pointerdown", event => {
    pointerStartedOutside = event.target === dialog && isOutsideDialog(event);
  });
  dialog.addEventListener("click", event => {
    if (pointerStartedOutside && event.target === dialog && isOutsideDialog(event)) {
      closeViewer();
    }
    pointerStartedOutside = false;
  });

  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    if (returnTarget?.isConnected) {
      returnTarget.focus({ preventScroll: true });
    }
  });
})();
