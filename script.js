// base url ng api
var API_BASE_URL = 'https://api.thecatapi.com/v1';

// dito yung function ng actual na pag fetch ng breed sa api
async function fetchBreeds() {
    var url = API_BASE_URL + '/breeds';

    try {
        var response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('API request failed: ' + response.status);
        }

        var data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        throw error;
    }
}

// ito yung function para mafetch yung images nung cats sa api
async function fetchCatImages(limit, breedId) {
    var url = API_BASE_URL + '/images/search?limit=' + encodeURIComponent(limit);

    if (breedId && breedId.trim() !== '') {
        url += '&breed_ids=' + encodeURIComponent(breedId.trim());
    }

    try {
        var response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('API request failed: ' + response.status);
        }

        var data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        throw error;
    }
}

//dito yung cards na ginagamit natin pang display ng info
function displayCats(cats) {
    var grid = document.getElementById('catsGrid');
    
    if (!cats || cats.length === 0) {
        grid.innerHTML = '<div class="cats-empty">no cats found. try again!</div>';
        return;
    }

    var html = '';
    for (var i = 0; i < cats.length; i++) {
        var cat = cats[i];
        var id = cat.id || 'unknown';
        var url = cat.url || '';
        var width = cat.width || '';
        var height = cat.height || '';
        var breedName = '';
        
        if (cat.breeds && cat.breeds.length > 0 && cat.breeds[0].name) {
            breedName = cat.breeds[0].name;
        }

        html += '<div class="cats-card">';
        html += '  <div class="cats-card-image">';
        html += '    <img src="' + escapeHtml(url) + '" alt="cat image ' + escapeHtml(id) + '" loading="lazy">';
        html += '  </div>';
        html += '  <div class="cats-card-body">';
        html += '    <div class="cats-card-info">';
        html += '      <div class="cats-card-id">id: ' + escapeHtml(id) + '</div>';
        if (breedName) {
            html += '      <div class="cats-card-breed">breed: ' + escapeHtml(breedName) + '</div>';
        }
        if (width && height) {
            html += '      <div class="cats-card-size">' + escapeHtml(width) + ' × ' + escapeHtml(height) + '</div>';
        }
        html += '    </div>';
        html += '    <a href="' + escapeHtml(url) + '" target="_blank" rel="noreferrer" class="cats-card-link" aria-label="open image">';
        html += '      open';
        html += '    </a>';
        html += '  </div>';
        html += '</div>';
    }

    grid.innerHTML = html;
}


function showLoadingSkeleton(count) {
    var grid = document.getElementById('catsGrid');
    var html = '';

    for (var i = 0; i < count; i++) {
        html += '<div class="cats-card cats-skeleton">';
        html += '  <div class="cats-skeleton-image"></div>';
        html += '  <div class="cats-card-body">';
        html += '    <div class="cats-skeleton-text"></div>';
        html += '    <div class="cats-skeleton-button"></div>';
        html += '  </div>';
        html += '</div>';
    }

    grid.innerHTML = html;
}

// ito yung nag hahandle ng click ng fetch cats button
async function handleFetchClick() {
    var limitSelect = document.getElementById('catsLimitSelect');
    var breedSelect = document.getElementById('catsBreedSelect');
    var fetchBtn = document.getElementById('catsFetchBtn');
    var errorBox = document.getElementById('catsErrorBox');
    var statusBadge = document.getElementById('catsStatusBadge');
    var statusText = document.getElementById('catsStatusText');
    var countText = document.getElementById('catsCountText');

    var limit = parseInt(limitSelect.value, 10) || 1;
    var breedId = breedSelect.value.trim();

    errorBox.textContent = '';
    errorBox.style.display = 'none';

    if (limit < 1 || limit > 10) {
        limit = 10;
    }

    setButtonLoading(fetchBtn, true);
    statusBadge.className = 'cats-status-badge cats-status-loading';
    statusText.textContent = 'loading...';
    countText.textContent = '0 results';

    showLoadingSkeleton(limit);

    try {
        var cats = await fetchCatImages(limit, breedId);
        displayCats(cats);
        countText.textContent = cats.length + (cats.length === 1 ? ' result' : ' results');
        statusBadge.className = 'cats-status-badge cats-status-success';
        statusText.textContent = 'success!';
    } catch (error) {
        document.getElementById('catsGrid').innerHTML = '';
        countText.textContent = '0 results';
        statusBadge.className = 'cats-status-badge cats-status-error';
        statusText.textContent = 'error occurred';
        
        var errorMessage = 'failed to fetch cats. please check your connection and try again.';
        errorBox.textContent = errorMessage;
        errorBox.style.display = 'block';
    } finally {
        setButtonLoading(fetchBtn, false);
    }
}

function handleClearClick() {
    document.getElementById('catsGrid').innerHTML = '';
    document.getElementById('catsBreedSelect').value = '';
    document.getElementById('catsLimitSelect').value = '10';
    document.getElementById('catsErrorBox').textContent = '';
    document.getElementById('catsErrorBox').style.display = 'none';
    document.getElementById('catsCountText').textContent = '0 results';
    document.getElementById('catsStatusBadge').className = 'cats-status-badge cats-status-success';
    document.getElementById('catsStatusText').textContent = 'ready';
}

function setButtonLoading(button, isLoading) {
    if (!button) return;

    if (isLoading) {
        button.disabled = true;
        button.classList.add('cats-btn-loading');
    } else {
        button.disabled = false;
        button.classList.remove('cats-btn-loading');
    }
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// dito namn yung sa dropdown bale lahat ng breeds nilalagay doon sa dropdown
function populateBreeds(breeds) {
    var breedSelect = document.getElementById('catsBreedSelect');
    
    if (!breedSelect || !breeds || breeds.length === 0) {
        return;
    }

    for (var i = 0; i < breeds.length; i++) {
        var breed = breeds[i];
        var option = document.createElement('option');
        option.value = breed.id || '';
        option.textContent = breed.name || 'unknown';
        breedSelect.appendChild(option);
    }
}

//  dito yung pag fefetch ng breed ng pusa
async function loadBreeds() {
    try {
        var breeds = await fetchBreeds();
        populateBreeds(breeds);
    } catch (error) {
        console.error('failed to load breeds:', error);
    }
}


function setupEventListeners() {
    var fetchBtn = document.getElementById('catsFetchBtn');
    var clearBtn = document.getElementById('catsClearBtn');
    var form = document.querySelector('.cats-search-section');

    if (fetchBtn) {
        fetchBtn.addEventListener('click', handleFetchClick);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', handleClearClick);
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFetchClick();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadBreeds();
});
