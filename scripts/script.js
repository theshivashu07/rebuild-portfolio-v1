(() => {
  "use strict";

  /* Character-wave timing controls. Keep these values as tuned in your file. */
  const STEP_MS = 64;
  const PULSE_MS = 1000;
  const BASE_WEIGHT = 400;
  const PEAK_WEIGHT = 800;
  const BASE_SLANT = 0;
  const PEAK_SLANT = 0;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const segmentText = (text) => {
    if (typeof Intl.Segmenter === "function") {
      const segmenter = new Intl.Segmenter(undefined, {
        granularity: "grapheme",
      });
      return Array.from(segmenter.segment(text), (item) => item.segment);
    }
    return Array.from(text);
  };

  document.querySelectorAll("[data-wave-heading]").forEach((heading) => {
    const visual = heading.querySelector("[data-wave-visual]");
    const accessible = heading.querySelector("[data-wave-accessible]");
    if (!visual) return;

    const text = heading.dataset.text || heading.textContent.trim();
    const characters = segmentText(text);
    if (accessible) accessible.textContent = text;

    visual.replaceChildren();
    const animatedCharacters = [];

    characters.forEach((character, index) => {
      if (/\s/u.test(character)) {
        visual.appendChild(document.createTextNode(character));
        return;
      }

      const span = document.createElement("span");
      span.className = "wave-char";
      span.setAttribute("aria-hidden", "true");
      span.style.fontVariationSettings = `"wght" ${BASE_WEIGHT}, "slnt" ${BASE_SLANT}`;
      span.textContent = character;
      visual.appendChild(span);
      animatedCharacters.push({ element: span, index });
    });

    if (reducedMotion.matches || !Element.prototype.animate) {
      animatedCharacters.forEach(({ element }) => {
        element.style.fontVariationSettings = '"wght" 650, "slnt" 0';
      });
      return;
    }

    const cycleMs = characters.length * STEP_MS + PULSE_MS;
    const peakAt = (PULSE_MS * 0.5) / cycleMs;
    const returnAt = PULSE_MS / cycleMs;

    animatedCharacters.forEach(({ element, index }) => {
      element.animate(
        [
          {
            fontVariationSettings: `"wght" ${BASE_WEIGHT}, "slnt" ${BASE_SLANT}`,
            offset: 0,
          },
          {
            fontVariationSettings: `"wght" ${PEAK_WEIGHT}, "slnt" ${PEAK_SLANT}`,
            offset: peakAt,
          },
          {
            fontVariationSettings: `"wght" ${BASE_WEIGHT}, "slnt" ${BASE_SLANT}`,
            offset: returnAt,
          },
          {
            fontVariationSettings: `"wght" ${BASE_WEIGHT}, "slnt" ${BASE_SLANT}`,
            offset: 1,
          },
        ],
        {
          duration: cycleMs,
          delay: index * STEP_MS,
          iterations: 4,
          easing: "linear",
          fill: "both",
        },
      );
    });

    reducedMotion.addEventListener?.("change", (event) => {
      if (event.matches) {
        animatedCharacters.forEach(({ element }) => {
          element.getAnimations().forEach((animation) => animation.cancel());
          element.style.fontVariationSettings = '"wght" 650, "slnt" 0';
        });
      }
    });
  });

  /* -------------------- Draggable image spotlight -------------------- */
  document.querySelectorAll("[data-spotlight]").forEach((stage) => {
    const images = Array.from(stage.querySelectorAll("img"));
    const sharpImage = stage.querySelector(".portrait-image--sharp");
    if (!sharpImage) return;

    let loadedImages = 0;
    let imageFailed = false;
    const markImageLoaded = () => {
      loadedImages += 1;
      if (loadedImages === images.length && !imageFailed) {
        stage.classList.add("has-image");
      }
    };
    images.forEach((image) => {
      image.addEventListener("load", markImageLoaded, { once: true });
      image.addEventListener(
        "error",
        () => {
          imageFailed = true;
          stage.classList.remove("has-image");
        },
        { once: true },
      );
      if (image.complete && image.naturalWidth > 0) markImageLoaded();
    });

    const SPOT_WIDTH = 0.38;
    const SPOT_HEIGHT = 0.56;
    let dragging = false;

    const setSpotPosition = (x, y) => {
      const maxX = 1 - SPOT_WIDTH;
      const maxY = 1 - SPOT_HEIGHT;
      const clampedX = Math.max(0, Math.min(maxX, x));
      const clampedY = Math.max(0, Math.min(maxY, y));

      stage.style.setProperty("--spot-x", `${clampedX * 100}%`);
      stage.style.setProperty("--spot-y", `${clampedY * 100}%`);
      stage.setAttribute(
        "aria-valuenow",
        String(Math.round((clampedX / maxX) * 100)),
      );
    };

    const moveSpotToPointer = (event) => {
      const bounds = stage.getBoundingClientRect();
      const pointerX = (event.clientX - bounds.left) / bounds.width;
      const pointerY = (event.clientY - bounds.top) / bounds.height;
      setSpotPosition(pointerX - SPOT_WIDTH / 2, pointerY - SPOT_HEIGHT / 2);
    };

    stage.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      dragging = true;
      stage.setPointerCapture?.(event.pointerId);
      moveSpotToPointer(event);
    });

    stage.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      moveSpotToPointer(event);
    });

    const stopDragging = () => {
      dragging = false;
    };
    stage.addEventListener("pointerup", stopDragging);
    stage.addEventListener("pointercancel", stopDragging);
    stage.addEventListener("lostpointercapture", stopDragging);

    /* Keyboard support: focus the image and use arrow keys to move the frame. */
    stage.addEventListener("keydown", (event) => {
      const bounds = stage.getBoundingClientRect();
      const stepX = 18 / bounds.width;
      const stepY = 18 / bounds.height;
      const currentX =
        parseFloat(getComputedStyle(stage).getPropertyValue("--spot-x")) /
          100 || 0.09;
      const currentY =
        parseFloat(getComputedStyle(stage).getPropertyValue("--spot-y")) /
          100 || 0.06;
      let nextX = currentX;
      let nextY = currentY;

      if (event.key === "ArrowLeft") nextX -= stepX;
      else if (event.key === "ArrowRight") nextX += stepX;
      else if (event.key === "ArrowUp") nextY -= stepY;
      else if (event.key === "ArrowDown") nextY += stepY;
      else return;

      event.preventDefault();
      setSpotPosition(nextX, nextY);
    });
  });
})();



