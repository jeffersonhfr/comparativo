function findCameraByName(inputValue) {
  if (!inputValue) return null;
  
  // Primeiro tenta encontrar pelo modelo principal
  let selectedCamera = camerasGerais.find((camera) => camera.Modelo === inputValue);
  
  // Se não encontrou e não é 'NÃO', procura nos outros nomes
  if (!selectedCamera && inputValue !== 'NÃO') {
    selectedCamera = camerasGerais.find((camera) => {
      if (camera['Outros nomes'] && camera['Outros nomes'] !== 'NÃO') {
        const otherNames = camera['Outros nomes'].split('|');
        return otherNames.some((name) => name.trim() === inputValue);
      }
      return false;
    });
  }
  
  return selectedCamera;
}