// used https://developer.riotgames.com/docs/lol

let latestVersion = ''; // Store the latest game version globally
let championsData = []; // Define championsData as an empty array

fetch('https://ddragon.leagueoflegends.com/api/versions.json')
    .then(response => response.json())
    .then(versions => {
        latestVersion = versions[0]; // Update the global variable
        const championsUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`;
        return fetch(championsUrl);
    })
    .then(response => response.json())
    .then(data => {
        championsData = Object.values(data.data); // Assign fetched data to championsData
        populateChampions(championsData); // Populate champions with initial data
    })
    .catch(error => console.error('Error fetching champions data:', error));

function populateChampions(data) {
    const container = document.getElementById('champions');
    container.innerHTML = ''; // Clear the container before populating
    displayChampions(data); // Pass the data to displayChampions
}

function displayChampions(champions) {
    const container = document.getElementById('champions');
    container.innerHTML = ''; // Clear the container before populating

    champions.forEach(champ => {
        const champElement = document.createElement('div');
        champElement.className = 'champion-card';
        champElement.innerHTML = `
            <img src="http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.id}_0.jpg" alt="${champ.name}">
            <h2>${champ.name}</h2>
            <p>${champ.title}</p>
        `;
        container.appendChild(champElement);

        // Event listener for opening the popup
        champElement.addEventListener('click', () => openPopup(champ));
    });
}

window.searchChampions = function() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const filteredChampions = championsData.filter(champ =>
        champ.name.toLowerCase().includes(searchTerm)
    );
    displayChampions(filteredChampions); // Display only champions that match the search term
}
    
// Updated function to open a popup with more details including abilities
function openPopup(champ) {
    const championDetailsUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${champ.id}.json`;

    fetch(championDetailsUrl)
        .then(response => response.json())
        .then(data => {
            const detailedChampData = data.data[champ.id];
            // Generate abilities HTML with data-index attributes
            const abilitiesHtml = detailedChampData.spells.map((spell, index) => {
                const skillType = ['Q', 'W', 'E', 'R'][index]; // Determine skill type based on index
                return `<img src="https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${spell.image.full}" alt="${spell.name}" class="skill-icon" data-index="${index}" data-skilltype="${skillType}" data-skillname="${spell.name}">`;
            }).join('') + `
                <img src="https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/passive/${detailedChampData.passive.image.full}" alt="Passive: ${detailedChampData.passive.name}" class="skill-icon" data-index="passive" data-skilltype="Passive" data-skillname="${detailedChampData.passive.name}">
            `;

            // Create the popup overlay with champion details and abilities
            const popupOverlay = document.createElement('div');
            popupOverlay.className = 'popup-overlay';
            popupOverlay.innerHTML = `
                <div class="popup-content">
                    <span class="close-btn">&times;</span>
                    <div class="popup-inner">
                        <div class="champion-image">
                            <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg" alt="${champ.name}">
                        </div>
                        <div class="champion-details">
                            <h2>${champ.name} - ${champ.title}</h2>
                            <p>${detailedChampData.lore}</p>
                            <div class="abilities-icons">${abilitiesHtml}</div>
                            <div class="skill-description"></div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(popupOverlay);
            popupOverlay.style.display = 'flex';

            // Setup close button and outside click functionality
            const closeBtn = popupOverlay.querySelector('.close-btn');
            closeBtn.addEventListener('click', () => {
                popupOverlay.style.display = 'none';
                document.body.removeChild(popupOverlay);
            });
            popupOverlay.addEventListener('click', (e) => {
                if (e.target === popupOverlay) {
                    closeBtn.click();
                }
            });

            // Setup event listeners for skill icons
            document.querySelectorAll('.skill-icon').forEach(icon => {
                icon.addEventListener('click', () => {

                    document.querySelectorAll('.skill-icon').forEach(otherIcon => {
                        otherIcon.classList.remove('skill-icon-selected');
                    });
                    icon.classList.add('skill-icon-selected');

                    const index = icon.getAttribute('data-index');
                    const skillType = icon.getAttribute('data-skilltype');
                    const skillName = icon.getAttribute('data-skillname');
                    let description;
                    if (index === 'passive') {
                        description = detailedChampData.passive.description;
                    } else {
                        description = detailedChampData.spells[index].description;
                    }
                    const skillDescriptionDiv = document.querySelector('.skill-description');
                    skillDescriptionDiv.innerHTML = `
                        <p><strong>${skillType} - ${skillName}</strong>: ${description}</p>
                    `;
                });
            });
        })
        .catch(error => console.error(`Error fetching details for ${champ.id}:`, error));
}

    


