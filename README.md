# Cat Images Fetcher

A simple, responsive web application that fetches and displays cat images from TheCatAPI. Built with vanilla JavaScript, HTML, and CSS.

## Features

- Fetch random cat images
- Filter images by breed
- Display breed information on each cat card
- Select number of images to display (1-10)
- Responsive design for all screen sizes
- Loading states and error handling
- Input validation
- Clean, light mode interface

## How to Run the Project

1. **Download or clone the repository**
   ```bash
   git clone <repository-url>
   cd cats
   ```

2. **Open the application**
   - Simply double-click `index.html` to open it in your web browser
   - Or right-click `index.html` and select "Open with" your preferred browser

That's it! The application will work directly without needing a local server.

## API Documentation

### 1. Base URL

```
https://api.thecatapi.com/v1
```

### 2. Endpoints

This project uses the following endpoints from TheCatAPI:

- **GET /images/search** - Get random or filtered cat images
- **GET /breeds** - Get all cat breeds for filtering

### 3. Required Parameters

#### `/images/search`
- `limit` (query parameter): Number of images to return (1-10 without API key, 1-100 with API key)
- `breed_ids` (query parameter, optional): Filter by breed IDs (comma-separated)

#### `/breeds`
- No required parameters

### 4. Authentication

**API Key (Optional)**
- The API key is optional for basic usage
- Without an API key, you can fetch up to 10 images per request
- With an API key, you can fetch up to 100 images and access additional features
- Send the API key via:
  - Header: `x-api-key: YOUR_API_KEY`
  - Query parameter: `?api_key=YOUR_API_KEY`

To get an API key, visit [TheCatAPI](https://thecatapi.com/) and sign up.

### 5. Sample JSON Response

#### Response from `/images/search`:

```json
[
  {
    "id": "ebv",
    "url": "https://cdn2.thecatapi.com/images/ebv.jpg",
    "width": 176,
    "height": 540,
    "breeds": [
      {
        "id": "abys",
        "name": "Abyssinian",
        "temperament": "Active, Energetic, Independent, Intelligent, Gentle",
        "origin": "Egypt",
        "life_span": "14 - 15"
      }
    ]
  }
]
```

#### Response from `/breeds`:

```json
[
  {
    "id": "abys",
    "name": "Abyssinian",
    "temperament": "Active, Energetic, Independent, Intelligent, Gentle",
    "origin": "Egypt",
    "country_codes": "EG",
    "country_code": "EG",
    "life_span": "14 - 15",
    "wikipedia_url": "https://en.wikipedia.org/wiki/Abyssinian_(cat)"
  }
]
```

## Fetch Implementation

The project uses `fetch()` with `async/await` to make API requests:

```javascript
async function fetchCatImages(limit, breedId) {
    var url = API_BASE_URL + '/images/search?limit=' + encodeURIComponent(limit);

    if (breedId && breedId.trim() !== '') {
        url += '&breed_ids=' + encodeURIComponent(breedId.trim());
    }

    var response = await fetch(url, {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error('API request failed: ' + response.status);
    }

    return await response.json();
}

async function fetchBreeds() {
    var url = API_BASE_URL + '/breeds';
    var response = await fetch(url, { method: 'GET' });
    return await response.json();
}
```

## Display in HTML (DOM)

The application displays results using:
- **Card Layout**: Each cat image is displayed in a responsive card
- **Grid Gallery**: Images are arranged in a responsive grid
- **Breed Information**: Breed name is displayed on each card when available
- **Responsive Images**: Images adapt to different screen sizes
- **Hover Effects**: Cards have hover animations

## Error Handling

The application includes comprehensive error handling:

- **No results found**: Displays "no cats found. try again!" message
- **Failed API call**: Shows error messages for connection or server issues
- **Loading message**: Shows "loading..." text and skeleton loaders during API requests

## Input Validation

- **Empty fields**: Validates that inputs are properly formatted
- **Invalid characters**: Uses `encodeURIComponent()` to sanitize inputs
- **Disabled button while loading**: Prevents double-clicks during API requests
- **Auto-trim whitespace**: Automatically trims whitespace from inputs

## Loading State

The application displays loading indicators:
- **Loading text**: Shows "loading..." in the status badge
- **Loading text on button**: Shows "loading..." text on the fetch button
- **Skeleton loaders**: Displays placeholder cards while fetching data

## Responsive Design

The website is fully responsive and works on:
- **Desktop**: Full-width grid with multiple columns
- **Tablet**: Adjusted grid layout
- **Mobile**: Single column layout with optimized spacing
- **All screen sizes**: Uses CSS media queries for breakpoints at 768px and 480px

## File Structure

```
cats/
├── index.html      # Main HTML file
├── style.css       # Stylesheet
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Code Organization

- **Functions only**: No constructors or classes, uses function-based approach
- **Separated concerns**: 
  - API functions: `fetchCatImages()`, `fetchBreeds()`
  - DOM functions: `displayCats()`, `showLoadingSkeleton()`, `populateBreeds()`
  - Utility functions: `escapeHtml()`, `setButtonLoading()`
- **No duplicated code**: Reusable functions throughout

## UI Components

The interface includes:
- **Breed filter**: Dropdown to filter images by breed
- **Limit selector**: Dropdown to select number of images (1-10)
- **Buttons**: Fetch and Clear buttons
- **Results container**: Grid display for cat images with breed information
- **Error container**: Displays error messages
- **Status bar**: Shows loading status and result count
- **Footer**: Credits with API source link

## CSS Features

- **Card layout**: Responsive card design for images
- **Grid gallery**: CSS Grid for responsive image display
- **Breed display**: Styled breed information in blue accent color
- **Responsive images**: Images scale properly on all devices
- **Hover effects**: Smooth transitions on card hover
- **Custom color theme**: Light mode with blue accent colors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Credits

API provided by [TheCatAPI](https://thecatapi.com/)

## License

This project is open source and available for educational purposes.
