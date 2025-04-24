const searchForm = document.getElementById('searchForm');
const characterNameInput = document.getElementById('characterNameInput');
const resultsDiv = document.getElementById('results');

const API_BASE_URL = 'https://anapioficeandfire.com/api/characters';

function showLoading() {
    resultsDiv.innerHTML = '<p class="loading">Loading...</p>';
}

function showError(message) {
    resultsDiv.innerHTML = `<p class="error">Error: ${message}</p>`;
}

function displayResults(characters) {
    resultsDiv.innerHTML = '';

    if (!characters || characters.length === 0) {
        resultsDiv.innerHTML = '<p>No characters found matching that name.</p>';
        return;
    }

    characters.forEach(character => {
        const card = document.createElement('div');
        card.classList.add('character-card');

        const displayName = character.name || (character.aliases && character.aliases[0]) || 'Unknown';
        card.innerHTML += `<h2>${displayName}</h2>`;

        const addDetail = (label, value) => {
            if (value && value.length > 0) {

                const displayValue = Array.isArray(value) ? value.join(', ') : value;
                card.innerHTML += `<p><strong>${label}:</strong> ${displayValue}</p>`;
            } else {
                 card.innerHTML += `<p><strong>${label}:</strong> N/A</p>`;
            }
        };

        addDetail('Name', character.name);
        addDetail('Gender', character.gender);
        addDetail('Culture', character.culture);
        addDetail('Born', character.born);
        addDetail('Died', character.died);

         if (character.titles && character.titles.length > 0 && character.titles[0] !== "") {
            card.innerHTML += `<p><strong>Titles:</strong></p><ul>${character.titles.map(title => `<li>${title}</li>`).join('')}</ul>`;
        } else {
            card.innerHTML += `<p><strong>Titles:</strong> N/A</p>`;
        }

        if (character.aliases && character.aliases.length > 0 && character.aliases[0] !== "") {
            card.innerHTML += `<p><strong>Aliases:</strong></p><ul>${character.aliases.map(alias => `<li>${alias}</li>`).join('')}</ul>`;
        } else {
            card.innerHTML += `<p><strong>Aliases:</strong> N/A</p>`;
        }

        addDetail('Played By', character.playedBy);

        resultsDiv.appendChild(card);
    });
}


searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const characterName = characterNameInput.value.trim();

    if (!characterName) {
        showError("Please enter a character name.");
        return;
    }

    showLoading();

    const searchUrl = `${API_BASE_URL}?name=${encodeURIComponent(characterName)}`;

    try {
        const response = await fetch(searchUrl);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status} (${response.statusText})`);
        }

        const data = await response.json();
        displayResults(data);

    } catch (error) {
        console.error("Failed to fetch character data:", error);
        showError(`Failed to fetch data. ${error.message}`);
    }
});
