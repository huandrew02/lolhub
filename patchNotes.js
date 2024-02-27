document.addEventListener('DOMContentLoaded', function() {
    let patchData = [];

    fetch('patchNotes.json')
        .then(response => response.json())
        .then(data => {
            patchData = data; 
            displayPatches(patchData);
        })
        .catch(error => console.error('Error loading patch notes:', error));

    function displayPatches(patches) {
        const patchList = document.getElementById('patchList');
        patchList.innerHTML = ''; 
        patches.forEach(patch => {
            const patchElement = document.createElement('article');
            patchElement.className = 'patch';
            patchElement.innerHTML = `
                <h2>Patch ${patch.version}</h2>
                <p><strong>Released on ${patch.date}.</strong> <br>${patch.summary}</p>
                <a href="${patch.url}" target="_blank">Read more</a>
            `;
            patchList.appendChild(patchElement);
        });
    }

    window.searchPatches = function() {
        const searchTerm = document.getElementById('searchBar').value.toLowerCase();
        const filteredPatches = patchData.filter(patch => 
            patch.version.toLowerCase().includes(searchTerm)
        );
        displayPatches(filteredPatches); // Display only patches that match the search term
    }
});
