function generateTable(data) {
  if (!data || data.length < 2) return;

  const table = document.getElementById('camera-table');
  table.innerHTML = '';

  // Create table header with images
  const headerRowImages = document.createElement('tr');
  headerRowImages.innerHTML = '<td class="cell cell-spec"></td>' + data.map((camera) => `<td class="cell cell-img"><img src="${camera.Imagem}" alt="${camera.Modelo}"></td>`).join('');
  table.appendChild(headerRowImages);

  // Create table header with models and buy buttons
  const headerRowModels = document.createElement('tr');
  headerRowModels.innerHTML = '<td class="cell cell-spec sticky-intersection"></td>' + 
    data.map((camera) => {
      const isUrlEmpty = !camera.URL || camera.URL === 'http://';
      const buttonClass = isUrlEmpty ? 'buy-button disabled' : 'buy-button';
      const buttonAttrs = isUrlEmpty ? 
        'disabled style="cursor: not-available; opacity: 0.5;"' : 
        `href="${camera.URL}" target="_blank"`;
      
      return `
        <td class="cell model-cell">
          <div class="model-name">${camera.Modelo}</div>
          <a ${buttonAttrs} class="${buttonClass}">Comprar</a>
        </td>`;
    }).join('');
  table.appendChild(headerRowModels);

  // Define specification categories
  const specCategories = {
    'Informações Gerais': [
      'Ano lançamento (Câmera)',
      'Outros nomes',
      'Sistema',
      'Tipo',
      'Cor da câmera',
      'Material do Corpo',
      'Resistência à Poeira e Água',
      'Idiomas',
      'Dimensões - Produto (LxAxP)',
      'Peso - Produto (c/ bateria e cartão)',
      'Garantia Padrão',
      'Manual'
    ],
    'Sensor e Imagem': [
      'Sensor',
      'BSI - Sensor Retroiluminado',
      'Processador',
      'Resolução Efetiva',
      'Unidade de Pixel (micrómetro)',
      'Resolução Total',
      'Sensibilidade ISO'
    ],
    'Sistema de Lentes': [
      'Compatibilidade com Lentes EF',
      'Compatibilidade com Lentes EF-S',
      'Compatibilidade com Lentes EF-M',
      'Compatibilidade com Lentes RF e RF-S'
    ],
    'Visor e Tela': [
      'Ocular',
      'Abrangência do Ocular',
      'Display EVF (Eletronic View Finder)',
      'Tamanho da tela EVF',
      'Ampliação do EVF',
      'Display EVF com simulação de OVF',
      'Tamanho do LCD',
      'LCD sensível ao toque',
      'LCD articulável'
    ],
    'Recursos de Vídeo': [
      'Vídeo',
      'Oversample do 4K',
      'Máx. grav. contínua',
      'Gravação de vídeos na vertical',
      'Codecs (Vídeo)',
      'HDR PQ',
      'Canon LOG',
      'Custom Picture (Cinema)',
      'Gravação PROXY',
      'Fotografia durante o Vídeo',
      'Time Lapse',
      'Pré Gravação (Vídeos)',
      'Time Code (código de tempo)',
      'Zebra',
      'False Color'
    ],
    'Sistema de Foco': [
      'Sistema de Foco Automático (Sensor)',
      'AF do tipo cruzado',
      'Intervalo máx. de funcionamento AF',
      'Posições de Foco (AF) Auto',
      'Rastreamento de AF Olho',
      'Escolha de olho para rastreamento de AF',
      'Controle de AF pelo olhar',
      'AF com Prioridade de Ação',
      'Reconhecimento do AF',
      'Guia de Foco MF',
      'Focus Peaking MF'
    ],
    'Flash e Iluminação': [
      'Hot Shoe',
      'X-Sync (Vel. Máx. de Sincronismo)',
      'Flash incorporado',
      'Alcance do Flash PopUP',
      'Conector de Sinc. do Flash Estúdio'
    ],
    'Obturador e Velocidade': [
      'Tipos de Obturador',
      'Velocidade do Obturador (Mecânico)',
      'Disparo contínuo máx. (Mecânico)',
      'Velocidade do Obturador (1ª Cort. Eletr.)',
      'Disparo contínuo máx. (1ª Cort. Eletr.)',
      'Velocidade do Obturador (Eletrônico)',
      'Disparo contínuo máx. (Eletrônico)',
      'Temporizador automático do Obturador',
      'Modo Silencioso'
    ],
    'Armazenamento e Formatos': [
      'Cartões de Memória',
      'Formato de Arquivos',
      'Dual Pixel RAW',
      'RAW Burst'
    ],
    'Conectividade': [
      'Wi-Fi',
      'Wi-Fi Frequência',
      'Bluetooth',
      'GPS',
      'NFC',
      'Certificação Mfi (Apple)',
      'Conexão via FTP',
      'Conector Ethernet',
      'HDMI',
      'Tipo do HDMI',
      'Saída limpa do HDMI',
      'Compatível com o EOS Webcam Utility PRO',
      'UVC/UAC via USB',
      'UVC/UAC Resolução',
      'Conexão com SmartPhone via USB-C'
    ],
    'Áudio': [
      'Captura de áudio',
      'Entrada para Microfone externo',
      'Entrada para Fone de ouvido'
    ],
    'Energia': [
      'Bateria',
      'Indicador de Carga - Bateria',
      'Conector N3 ou C3',
      'Carregamento de Bateria por USB-C',
      'Fonte de alimentação compatível'
    ],
    'Informações Adicionais': [
      'Estabilizador de Imagem (IS) no corpo',
      'Toque e Arraste',
      'Registro de pessoas para AF',
      'Múltipla Exposição',
      'Assistente de Panorâmica',
      'Assistente de Painning',
      'Modo HDR',
      'Seleção de Modos de Cena',
      'Modos de Balanço de Branco',
      'Ambiente para funcionamento',
    ]
  };

  // Função para formatar o conteúdo da célula
  const formatCellContent = (value, spec) => {
    if (value === 'SIM') {
      return `<img src="https://image.digital.canon.com.br/lib/fe8d13727d660d7f71/m/1/1f2194aa-a3ce-4e06-a94b-e6411900efc6.png" alt="Sim" style="width: 48px; height: 48px;">`;
    } else if (value === 'NÃO') {
      return `<img src="https://image.digital.canon.com.br/lib/fe8d13727d660d7f71/m/1/b115ec8d-47e5-469a-a67c-1c2d3055b57f.png" alt="Não" style="width: 48px; height: 48px;">`;
    }
    if (spec === 'Manual' && value && value.startsWith('http')) {
      return `<a href="${value}" target="_blank" style="color:rgb(0, 132, 255); text-decoration: none;">Acessar Manual</a>`;
    }
    return value;
  };

  Object.entries(specCategories).forEach(([category, specs]) => {
    // Add empty row to separate categories
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `<td colspan="${data.length + 1}" class="empty-row"></td>`;
    table.appendChild(emptyRow);

    // Add category header
    const categoryRow = document.createElement('tr');
    categoryRow.innerHTML = `<td colspan="${data.length + 1}" class="spec-category-header">${category}</td>`;
    table.appendChild(categoryRow);

    // Add spec rows
    specs.forEach(spec => {
      if (data[0].hasOwnProperty(spec)) {
        const row = document.createElement('tr');
        row.innerHTML =
          `<td class="cell cell-spec">${spec}</td>` +
          data
            .map((camera) => {
              const value = Array.isArray(camera[spec]) ? camera[spec].join(', ') : camera[spec] || '-';
              return `<td class="cell">${formatCellContent(value, spec)}</td>`;
            })
            .join('');
        table.appendChild(row);
      }
    });
  });

  updateURL(data);
  initDragToScroll();
  
  setTimeout(() => {
    const oldFixedHeader = document.querySelector('.fixed-header');
    if (oldFixedHeader) {
      oldFixedHeader.remove();
    }
    initFixedRows();
  }, 100);
}