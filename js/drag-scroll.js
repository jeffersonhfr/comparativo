function initDragToScroll() {
  const scrollContainers = document.querySelectorAll('.box-information-compare');
  if (!scrollContainers.length) return;

  scrollContainers.forEach((scrollContainer) => {
    let isDown = false;
    let startX, startY, scrollLeft, scrollTop;
    let touchStartX, touchStartY;
    let isScrolling = false;

    // Mouse events
    scrollContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - scrollContainer.offsetLeft;
      startY = e.pageY - scrollContainer.offsetTop;
      scrollLeft = scrollContainer.scrollLeft;
      scrollTop = scrollContainer.scrollTop;
      scrollContainer.style.cursor = 'grabbing';
    });

    scrollContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const y = e.pageY - scrollContainer.offsetTop;

      const walkX = (x - startX) * 2;
      const walkY = Math.abs(x - startX) > Math.abs(y - startY) ? 0 : (y - startY) * 0.5;

      scrollContainer.scrollLeft = scrollLeft - walkX;
      scrollContainer.scrollTop = scrollTop - walkY;
    });

    scrollContainer.addEventListener('mouseup', () => {
      isDown = false;
      scrollContainer.style.cursor = 'grab';
    });

    scrollContainer.addEventListener('mouseleave', () => {
      isDown = false;
      scrollContainer.style.cursor = 'grab';
    });

    // Touch events
    scrollContainer.addEventListener(
      'touchstart',
      (e) => {
        // Reset flags
        isScrolling = false;
        isDown = false;

        // Store initial touch coordinates
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        // Store initial scroll positions
        scrollLeft = scrollContainer.scrollLeft;
        scrollTop = scrollContainer.scrollTop;
      },
      { passive: true }
    );

    scrollContainer.addEventListener(
      'touchmove',
      (e) => {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;

        // Calculate movement deltas
        const deltaX = currentX - touchStartX;
        const deltaY = currentY - touchStartY;

        // Determine if we're still scrolling or just started
        if (!isScrolling) {
          // Determine scroll direction based on movement angle
          const angle = Math.abs((Math.atan2(deltaY, deltaX) * 180) / Math.PI);

          // If angle is closer to horizontal (between 30 and 150 degrees)
          if (angle >= 30 && angle <= 150) {
            isScrolling = true;

            // Prevent default to stop page scroll
            e.preventDefault();
          } else {
            // Allow normal page scrolling
            return;
          }
        }

        // Perform scroll
        scrollContainer.scrollLeft = scrollLeft - deltaX;
        scrollContainer.scrollTop = scrollTop - deltaY;
      },
      { passive: false }
    );

    scrollContainer.addEventListener(
      'touchend',
      () => {
        isDown = false;
        isScrolling = false;
      },
      { passive: true }
    );

    scrollContainer.addEventListener(
      'touchcancel',
      () => {
        isDown = false;
        isScrolling = false;
      },
      { passive: true }
    );
  });
}
