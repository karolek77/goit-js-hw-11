import axios from 'axios';
import Notiflix from 'notiflix';

const apiKey = '39776849-446dca6e4ae3723aaf2933f5e';
const apiUrl = 'https://pixabay.com/api/';
let currentPage = 1;

function searchParamsPixabay(query, page) {
  const perPage = 40;
  const params = new URLSearchParams({
    key: apiKey,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage,
  });
  return params;
}

async function fetchImages(query) {
  const params = searchParamsPixabay(query, currentPage);
  const url = `${apiUrl}?${params}`;

  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error('Failed to fetch images from Pixabay');
    }
    currentPage++;

    return response.data;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return [];
  }
}
export { fetchImages };
