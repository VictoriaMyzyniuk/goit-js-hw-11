import './css/styles.css';
import ImgApiService from './fetchImg';
import Notiflix, { Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const ImgEl = new ImgApiService();

const formEl = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

let simpleLightBox = new SimpleLightbox('.gallery a');

formEl.addEventListener('submit', onFormSubmit);
window.addEventListener('scroll', onScrollLoad);

function onScrollLoad() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (clientHeight + scrollTop >= scrollHeight) {
    toGetImages();
  }
}

function toGetImages() {
  ImgEl.fetchImg()
    .then(({ total, totalHits, hits }) => {
      if (hits.length === 0 && totalHits === 0 && total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        insertMarkup(hits);

        if (ImgEl.page === 1) {
          Notiflix.Notify.success(`Horray! We found ${totalHits} images`);
        } else {
          const { height: cardHeight } = document
            .querySelector('.gallery')
            .firstElementChild.getBoundingClientRect();

          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
          });
        }

        simpleLightBox.refresh();

        if (total === totalHits) {
          Notiflix.Notify.info(
            `We're sorry, but you've reached the end of search results.`
          );
        }
        ImgEl.incrementPage();
      }
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, something went wrong');
    })
    .finally(() => {
      formEl.reset();
    });
}
function onFormSubmit(e) {
  e.preventDefault();

  ImgEl.query = e.currentTarget.elements.searchQuery.value.trim();
  ImgEl.resetPage();
  gallery.innerHTML = '';
  toGetImages();
}

function insertMarkup(array) {
  const galeryMarkup = array
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <a href="${largeImageURL}" class="gallery__link">
        <div class="photo-card">
           <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
      </div>
      </a>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeEnd', galeryMarkup);
}
