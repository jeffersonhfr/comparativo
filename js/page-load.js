// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    searchCameras();
  });

  // Array para armazenar as instâncias do Tom Select
  window.cameraSelects = [];

  [1, 2, 3].forEach((num) => {
    const input = document.querySelector(`.camera${num}`);

    // Criar dropdown
    const tomSelect = setupCameraSelection(input, num);
    window.cameraSelects.push(tomSelect);

    // Manter a lógica de mudança de câmera
    input.addEventListener('change', () => changeCamera(num));
  });

  loadCamerasFromURL();
  initDragToScroll();
});
