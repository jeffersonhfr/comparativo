// URL handling functions
function updateURL(cameras) {
  const params = new URLSearchParams();
  cameras.forEach((camera, index) => {
    params.set(`camera${index + 1}`, camera.Modelo);
  });
  window.history.pushState({}, '', `?${params.toString()}`);
}

function loadCamerasFromURL() {
  const params = new URLSearchParams(window.location.search);
  const cameraInputs = [camera1Input, camera2Input, camera3Input];
  let hasValidCameras = false;

  cameraInputs.forEach((input, index) => {
    const cameraModel = params.get(`camera${index + 1}`);
    if (cameraModel && camerasGerais.some((camera) => camera.Modelo === cameraModel)) {
      // Update Tom Select input
      if (window.cameraSelects && window.cameraSelects[index]) {
        window.cameraSelects[index].setValue(cameraModel);
      } else {
        input.value = cameraModel;
      }
      input.dispatchEvent(new Event('input'));
      hasValidCameras = true;
    }
  });

  if (hasValidCameras) {
    searchCameras();
    document.querySelector('.step1').classList.add('hide');
    document.querySelector('.step3').classList.remove('hide');
  }
};