const nextStep2 = (event) => {
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

// Função para criar dropdown com todos os modelos
// Função para criar dropdown com todos os modelos
function createCameraDropdown(inputElement) {
  // Função auxiliar para formatar o texto de exibição
  const formatDisplayText = (camera) => {
    if (!camera['Outros nomes'] || camera['Outros nomes'] === 'NÃO') {
      return camera.Modelo;
    }
    const alternateNames = camera['Outros nomes'].split('|').map(name => name.trim());
    return `${camera.Modelo} (${alternateNames.join(' / ')})`;
  };

  // Criar opções para o dropdown
  const options = camerasGerais.map((camera) => {
    // Array com todos os termos de busca
    const searchTerms = [
      camera.Modelo,
      ...(camera['Outros nomes'] && camera['Outros nomes'] !== 'NÃO' 
        ? camera['Outros nomes'].split('|').map(name => name.trim())
        : [])
    ];

    return {
      value: camera.Modelo, // Mantém o valor original para compatibilidade
      text: formatDisplayText(camera), // Texto formatado para exibição
      searchTerms: searchTerms.join(' ') // Termos para busca
    };
  });

  // Criar instância do TomSelect com as opções configuradas
  return new TomSelect(inputElement, {
    options: options,
    maxItems: 1,
    searchField: ['value', 'searchTerms'],
    placeholder: 'Selecione uma câmera',
    dropdownParent: 'body',
    maxOptions: 500,
    render: {
      option: function(data, escape) {
        return `<div class="option">${escape(data.text)}</div>`;
      },
      item: function(data, escape) {
        return `<div class="item">${escape(data.text)}</div>`;
      }
    }
  });
}

// Função para configurar seleção de câmera (mantida para compatibilidade)
function setupCameraSelection(input, inputNumber) {
  const tomSelect = createCameraDropdown(input);

  tomSelect.on('change', function() {
    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);
  });

  tomSelect.updateImage = function() {
    const image = document.querySelector(`.camera-item-${inputNumber}`);
    const selectedCamera = findCameraByName(input.value);
    image.src = selectedCamera ? selectedCamera.Imagem : 'https://extranet.canon.com.br/ecommerce/_files/comparativo-camera/image/camera-silhueta.png';
  };

  return tomSelect;
}

// Função para configurar seleção de câmera
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
    const isDuplicateModel = otherInputs.some((otherInput) => {
      const otherCamera = findCameraByName(otherInput.value);
      return otherCamera && otherCamera.Modelo === selectedCamera.Modelo;
    });

    if (isDuplicateModel) {
      // If it's a duplicate, find alternative names
      const otherNames = selectedCamera['Outros nomes'] && selectedCamera['Outros nomes'] !== 'NÃO' ? selectedCamera['Outros nomes'].split('|').join(', ') : 'nenhum nome alternativo';

      // Reset Tom Select
      window.cameraSelects[inputNumber - 1].clear();
      image.src = 'https://extranet.canon.com.br/ecommerce/_files/comparativo-camera/image/camera-silhueta.png';
      alert(`Este modelo (${selectedCamera.Modelo}) já está selecionado. \n\nAlguns equipamentos possuem outros nomes dependendo do continente em que é comercializado.`);
      return;
    }
  }

  image.src = selectedCamera ? selectedCamera.Imagem : 'https://extranet.canon.com.br/ecommerce/_files/comparativo-camera/image/camera-silhueta.png';
}

function searchCameras() {
  // Usar os valores dos inputs do Tom Select
  const selectedModels = [camera1Input.value.trim(), camera2Input.value.trim(), camera3Input.value.trim()]
    .map((inputValue) => {
      const camera = findCameraByName(inputValue);
      return camera ? camera.Modelo : null;
    })
    .filter(Boolean);

  const filteredCameras = camerasGerais.filter((camera) => selectedModels.includes(camera.Modelo));

  if (filteredCameras.length >= 2) {
    cameras = filteredCameras;
    generateTable(cameras);
    document.querySelector('.step2').classList.add('hide');
    document.querySelector('.step3').classList.remove('hide');
  } else if (!document.querySelector('.step2').classList.contains('hide')) {
    alert('Selecione pelo menos dois modelos para comparar.');
  }
}