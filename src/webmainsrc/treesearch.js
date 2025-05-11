const searchInput = document.getElementById('searchInput');
const plantList = document.getElementById('plant-container-main');
const plants = plantList.getElementsByTagName('plant-card-2');

searchInput.addEventListener('keyup', function(event) {
    const searchTerm = event.target.value.toLowerCase();

    Array.from(plants).forEach(function(plant) {
        const plantName = plant.textContent.toLowerCase();
        if (plantName.indexOf(searchTerm) != -1) {
            plant.style.display = 'block';
        } else {
            plant.style.display = 'none';
        }
    });
});