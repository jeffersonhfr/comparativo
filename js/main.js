window.cameras = [];

const nextStep2 = (event) => {
  window.dataLayer.push({
    event: 'view_step',
    step_name: 'selection',
  });
  if (event) event.preventDefault();
  document.querySelector('.step1').classList.add('hide');
  document.querySelector('.step2').classList.remove('hide');

  // Enable Tom Select inputs
  if (window.cameraSelects) {
    window.cameraSelects[1].enable();
    window.cameraSelects[2].enable();
  } else {
    camera2Input.disabled = false;
    camera3Input.disabled = false;
  }

  submitButton.disabled = false;
};

function createCameraDropdown(inputElement) {
  const formatDisplayText = (camera) => {
    if (!camera['Outros nomes'] || camera['Outros nomes'] === 'NÃO') {
      return camera.Modelo;
    }
    const alternateNames = camera['Outros nomes'].split('|').map((name) => name.trim());
    return `${camera.Modelo} (${alternateNames.join(' / ')})`;
  };

  const options = camerasGerais.map((camera) => {
    const searchTerms = [camera.Modelo, ...(camera['Outros nomes'] && camera['Outros nomes'] !== 'NÃO' ? camera['Outros nomes'].split('|').map((name) => name.trim()) : [])];

    return {
      value: camera.Modelo,
      text: formatDisplayText(camera),
      searchTerms: searchTerms.join(' '),
    };
  });

  return new TomSelect(inputElement, {
    options: options,
    maxItems: 1,
    searchField: ['value', 'searchTerms'],
    placeholder: 'Selecione uma câmera',
    dropdownParent: 'body',
    maxOptions: 500,
    render: {
      option: function (data, escape) {
        return `<div class="option">${escape(data.text)}</div>`;
      },
      item: function (data, escape) {
        return `<div class="item">${escape(data.text)}</div>`;
      },
    },
  });
}

function setupCameraSelection(input, inputNumber) {
  const tomSelect = createCameraDropdown(input);

  tomSelect.on('change', function () {
    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);
  });

  tomSelect.updateImage = function () {
    const image = document.querySelector(`.camera-item-${inputNumber}`);
    const selectedCamera = findCameraByName(input.value);
    image.src = selectedCamera ? selectedCamera.Imagem : 'https://extranet.canon.com.br/ecommerce/_files/comparativo-camera/image/camera-silhueta.png';
  };

  return tomSelect;
}

window.changeCamera1 = function () {
  changeCamera(1);
};

window.changeCamera2 = function () {
  changeCamera(2);
};

window.changeCamera3 = function () {
  changeCamera(3);
};

function changeCamera(inputNumber) {
  const input = document.querySelector(`.camera${inputNumber}`);
  const image = document.querySelector(`.camera-item-${inputNumber}`);
  const otherInputs = [camera1Input, camera2Input, camera3Input].filter((_, index) => index + 1 !== inputNumber);
  const selectedCamera = findCameraByName(input.value);

  if (selectedCamera) {
    window.dataLayer.push({
      event: 'select_camera',
      camera_model: selectedCamera.Modelo,
      position: inputNumber,
    });

    const isDuplicateModel = otherInputs.some((otherInput) => {
      const otherCamera = findCameraByName(otherInput.value);
      return otherCamera && otherCamera.Modelo === selectedCamera.Modelo;
    });

    if (isDuplicateModel) {
      window.cameraSelects[inputNumber - 1].clear();
      image.src = 'https://extranet.canon.com.br/ecommerce/_files/comparativo-camera/image/camera-silhueta.png';
      alert(`Este modelo (${selectedCamera.Modelo}) já está selecionado. \n\nAlguns equipamentos possuem outros nomes dependendo do continente em que é comercializado.`);
      return;
    }
  }

  image.src = selectedCamera ? selectedCamera.Imagem : 'https://extranet.canon.com.br/ecommerce/_files/comparativo-camera/image/camera-silhueta.png';
}

function searchCameras() {
  const selectedModels = [camera1Input.value.trim(), camera2Input.value.trim(), camera3Input.value.trim()]
    .map((inputValue) => {
      const camera = findCameraByName(inputValue);
      return camera ? camera.Modelo : null;
    })
    .filter(Boolean);

  const filteredCameras = camerasGerais.filter((camera) => selectedModels.includes(camera.Modelo));

  if (filteredCameras.length >= 2) {
    window.cameras = filteredCameras;

    window.dataLayer.push({
      event: 'compare_products',
      products: window.cameras.map((c) => ({
        item_name: c.Modelo,
      })),
      number_of_items: window.cameras.length,
    });

    generateTable(window.cameras);
    document.querySelector('.step2').classList.add('hide');
    document.querySelector('.step3').classList.remove('hide');
  } else if (!document.querySelector('.step2').classList.contains('hide')) {
    alert('Selecione pelo menos dois modelos para comparar.');
  }
}

function updateCategoryHeaders() {
  const categoryHeaders = document.querySelectorAll('.spec-category-header');
  const container = document.querySelector('.box-information-compare');
  
  if (!container) return;

  categoryHeaders.forEach(header => {
    const titleSpan = header.querySelector('.title-category');
    if (!titleSpan) return;

    const containerWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;
    const centerPosition = containerWidth / 2 + scrollLeft;

    titleSpan.style.transform = `translateX(${-scrollLeft}px)`;
    titleSpan.style.left = '50%';
  });
}

function initCategoryHeaders() {
  const container = document.querySelector('.box-information-compare');
  if (!container) return;

  const resizeObserver = new ResizeObserver(() => {
    updateCategoryHeaders();
  });

  resizeObserver.observe(container);
  updateCategoryHeaders();

  container.addEventListener('scroll', () => {
    updateCategoryHeaders();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  window.dataLayer.push({
    event: 'view_step',
    step_name: 'start',
  });

  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('buy-button') && !e.target.classList.contains('disabled')) {
      const modelCell = e.target.closest('.model-cell');
      if (modelCell) {
        const model = modelCell.querySelector('.model-name').textContent;
        window.dataLayer.push({
          event: 'begin_checkout',
          product_name: model,
        });
      }
    }

    if (e.target.matches('a[href^="http"]') && e.target.textContent === 'Acessar Manual') {
      const row = e.target.closest('tr');
      if (row) {
        window.dataLayer.push({
          event: 'download_manual',
          camera_model: row.querySelector('.cell-spec').textContent,
        });
      }
    }
  });

  const pdfButton = document.getElementById('generate-pdf');
  if (pdfButton) {
    pdfButton.addEventListener('click', () => {
      if (window.cameras && window.cameras.length) {
        window.dataLayer.push({
          event: 'download_pdf',
          camera_models: window.cameras.map((c) => c.Modelo).join(','),
        });
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', initCategoryHeaders);
