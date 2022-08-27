import './css/styles.css';
import ImgApiService from './fetchImg';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
var debounce = require('lodash.debounce');

const ImgEl = new ImgApiService();

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29542171-d27caeadb94251ff2cc88b8a0';
const DEBOUNCE_DELAY = 500;

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('input');
const markupContainer = document.querySelector('.gallery');

formEl.addEventListener('submit', onFormSubmit);
// inputEl.addEventListener('input', debounce(fetchImg, DEBOUNCE_DELAY));

function onFormSubmit(e) {
  e.preventDefault();

  ImgEl.query = e.currentTarget.elements.searchQuery.value.trim();
  ImgEl.resetPage();
  ImgEl.fetchImg().then(({ totalHits, hits }) => {
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      insertMarkup(hits);
      Notiflix.Notify.success(`Horray! We found ${totalHits} images`);
    }
  });
}

// function insertMarkup(params) {
//   markupContainer.insertAdjacentHTML('beforeend', `<div>cats</div>`);
// }
function insertMarkup(array) {
  const galeryMarkup = array
    .map(({ previewURL, tags, likes, views, comments, downloads }) => {
      return `
    <div class="photo-card">
    <a>
  <img src="${previewURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views:</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments:</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>
      ${downloads}
    </p>
  </div>
</div>`;
    })
    .join('');

  markupContainer.insertAdjacentHTML('beforeEnd', galeryMarkup);
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: '250',
  });
}
