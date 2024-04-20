// Assuming patchData is your array of patch notes loaded from the JSON file
document.addEventListener('DOMContentLoaded', function() {
    fetch('../patchNotes.json')
        .then(response => response.json())
        .then(data => {
            // Sort patch notes by date in descending order
            const sortedPatches = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            // Get the latest two patch notes
            const latestPatches = sortedPatches.slice(0, 2);
            displayLatestPatches(latestPatches); // Function to display the latest two patches
        })
        .catch(error => console.error('Error loading patch notes:', error));
});

function displayLatestPatches(patches) {
    const latestNewsSection = document.getElementById('latestNews');
    // Remove the line that clears innerHTML to preserve existing elements like your <h2> tag
    
    // Now create a container for the patches to keep them separate from your <h2>
    const patchesContainer = document.createElement('div');
    patchesContainer.className = 'patches-container';

    patches.forEach(patch => {
        const patchCard = document.createElement('div');
        patchCard.className = 'patch-note-card';
        patchCard.innerHTML = `
            <div class="patch-note-info">
                <a href="${patch.url}" target="_blank"><h3>Patch ${patch.version} Notes</h3></a>
                <p>${patch.summary}</p>
            </div>
        `;
        patchesContainer.appendChild(patchCard);
    });

    // Append the new container to the latestNewsSection
    latestNewsSection.appendChild(patchesContainer);
}

