function initFixedRows() {
  const table = document.getElementById('camera-table');
  if (!table) return;

  const headerRow1 = table.rows[0];
  const headerRow2 = table.rows[1];

  if (!headerRow1 || !headerRow2) return;

  // Remover header fixo anterior se existir
  const oldFixedHeader = document.querySelector('.fixed-header');
  if (oldFixedHeader) {
    oldFixedHeader.remove();
  }

  // Create fixed header container
  const fixedHeader = document.createElement('div');
  fixedHeader.className = 'fixed-header';
  fixedHeader.style.display = 'none';
  fixedHeader.style.position = 'fixed';
  fixedHeader.style.top = '0';
  fixedHeader.style.backgroundColor = '#fff';
  fixedHeader.style.zIndex = '1000';
  fixedHeader.style.overflowX = 'hidden';
  fixedHeader.style.textAlign = 'center';
  fixedHeader.style.paddingTop = '10px'; // Adicionado padding no topo

  const fixedTable = document.createElement('table');
  fixedTable.style.borderCollapse = 'separate';
  fixedTable.style.borderSpacing = '5px';
  fixedTable.style.tableLayout = 'fixed';
  fixedTable.style.position = 'relative';

  // Clone rows and preserve their content exactly as is
  const clonedRow1 = headerRow1.cloneNode(true);
  const clonedRow2 = headerRow2.cloneNode(true);

  // Ajustar altura das células da imagem
  const imgCells = clonedRow1.getElementsByClassName('cell-img');
  Array.from(imgCells).forEach(cell => {
    cell.style.height = '120px'; // Aumentado a altura
    cell.style.paddingTop = '10px'; // Adicionado padding no topo
  });

  // Ensure first cell of each row has the correct fixed styling
  clonedRow1.cells[0].style.position = 'sticky';
  clonedRow1.cells[0].style.left = '0';
  clonedRow1.cells[0].style.zIndex = '30';
  clonedRow1.cells[0].style.backgroundColor = '#fff';

  clonedRow2.cells[0].style.position = 'sticky';
  clonedRow2.cells[0].style.left = '0';
  clonedRow2.cells[0].style.zIndex = '30';
  clonedRow2.cells[0].style.backgroundColor = '#fff';

  fixedTable.appendChild(clonedRow1);
  fixedTable.appendChild(clonedRow2);
  fixedHeader.appendChild(fixedTable);

  document.body.appendChild(fixedHeader);

  // Ajustar posicionamento e altura das imagens
  const images = fixedHeader.getElementsByTagName('img');
  Array.from(images).forEach(img => {
    img.style.maxHeight = '100px';
    img.style.marginTop = '10px';
  });

  const tableOffset = table.getBoundingClientRect().top + window.pageYOffset;
  let lastWidth = 0;

  // Sync horizontal scroll
  const syncScroll = () => {
    const container = table.closest('.box-information-compare');
    if (container) {
      fixedHeader.scrollLeft = container.scrollLeft;
    }
  };

  function updateColumnWidths() {
    const container = table.closest('.box-information-compare');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    // Update table widths
    fixedTable.style.width = `${table.offsetWidth}px`;
    fixedHeader.style.width = `${containerRect.width}px`;

    // Position the fixed header
    fixedHeader.style.left = '50%';
    fixedHeader.style.transform = 'translateX(-50%)';

    // Add padding to match the container's padding
    const computedStyle = window.getComputedStyle(container);
    fixedHeader.style.paddingLeft = computedStyle.paddingLeft;
    fixedHeader.style.paddingRight = computedStyle.paddingRight;

    // Update individual cell widths
    [clonedRow1, clonedRow2].forEach((row, rowIndex) => {
      const originalRow = [headerRow1, headerRow2][rowIndex];
      Array.from(row.cells).forEach((cell, cellIndex) => {
        const originalCell = originalRow.cells[cellIndex];
        const width = originalCell.offsetWidth;
        cell.style.width = `${width}px`;
        cell.style.minWidth = `${width}px`;

        // Ensure first column stays fixed
        if (cellIndex === 0) {
          cell.style.position = 'sticky';
          cell.style.left = '0';
          cell.style.zIndex = '30';
          cell.style.backgroundColor = '#fff';
        }
      });
    });
  }

  // Add scroll event listener to container
  const container = table.closest('.box-information-compare');
  if (container) {
    container.addEventListener('scroll', syncScroll);
  }

  // Handle scroll events for showing/hiding fixed header
  window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset;
    const tableRect = table.getBoundingClientRect();
    const containerRect = table.parentElement.getBoundingClientRect();

    if (scrollTop > tableOffset && tableRect.bottom > 0 && containerRect.bottom > 0) {
      fixedHeader.style.display = 'block';
      if (table.offsetWidth !== lastWidth) {
        updateColumnWidths();
        lastWidth = table.offsetWidth;
      }
    } else {
      fixedHeader.style.display = 'none';
    }
  });

  // Update on window resize
  window.addEventListener('resize', updateColumnWidths);

  // Initial update
  updateColumnWidths();
}