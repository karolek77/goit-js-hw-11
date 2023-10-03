import { fetchImages } from './form-api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

//import InfiniteScroll from 'infinite-scroll';

const galleryImage = document.querySelector('.gallery');

const searchInput = document.querySelector('[name="searchQuery"]');
let currentPage = 1;
const perPage = 40;

const lightbox = new SimpleLightbox(`.gallery a`, {
  captionsData: `alt`,
  captionPosition: `bottom`,
  captionDelay: 250,
});

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('#search-form');
  const loadMoreButton = document.querySelector('.load-more');
  loadMoreButton.style.display = 'none';

  searchForm.addEventListener('submit', async event => {
    event.preventDefault();

    const query = searchInput.value;

    try {
      const imagesData = await fetchImages(query);
      const totalHits = imagesData.totalHits;

      if (imagesData.hits.length > 0) {
        const images = imagesData.hits;
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

        galleryImage.innerHTML = '';

        const imageHtml = images
          .map(image => {
            return `<div class="photo-card">
  <a href="${image.largeImageURL}" class="pagination__next"><img  class="gallery-item" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
  <div class="info">
  <p class="info-item">
    <b>Likes</b>
  ${image.likes}
  </p>
  <p class="info-item">
    <b>Views</b>
  ${image.views}
  </p>
  <p class="info-item">
    <b>Comments</b>
  ${image.comments}
  </p>
  <p class="info-item">
    <b>Downloads</b>
  ${image.downloads}
  </p>
</div>
</div>`;
          })
          .join('');

        galleryImage.innerHTML = imageHtml;
        lightbox.refresh();
        loadMoreButton.style.display = 'block';
        loadMoreButton.textContent = `Load more ${query} images`;
      } else {
        throw new Error('No image information found');
      }
    } catch (error) {
      console.error('Error:', error);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  });

  loadMoreButton.addEventListener('click', async () => {
    currentPage++;

    try {
      const imagesData = await fetchImages(searchInput.value);

      if (imagesData.hits.length > 0) {
        const images = imagesData.hits;
        const totalHits = imagesData.totalHits;

        const imageHtml = images
          .map(image => {
            return `<div class="photo-card">
              <a href="${image.largeImageURL}" class="pagination__next"><img class="gallery-item" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
              <div class="info">
                <p class="info-item">
                  <b>Likes</b>${image.likes}
                </p>
                <p class="info-item">
                  <b>Views</b>${image.views}
                </p>
                <p class="info-item">
                  <b>Comments</b>${image.comments}
                </p>
                <p class="info-item">
                  <b>Downloads</b>${image.downloads}
                </p>
              </div>
            </div>`;
          })
          .join('');

        galleryImage.innerHTML += imageHtml;
        lightbox.refresh();

        const { height: cardHeight } =
          galleryImage.firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });

        if (currentPage * perPage >= totalHits) {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
          loadMoreButton.style.display = 'none';
        }
      } else {
        throw new Error('No image information found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});
