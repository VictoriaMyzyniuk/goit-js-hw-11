import axios from 'axios';

export default class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchImg() {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '29542171-d27caeadb94251ff2cc88b8a0';

    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image-type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    );
    // this.incrementPage();
    console.log(response.data);
    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

// async function fetchImg(e) {
//   const text = e.target.value;
//   const response = await fetch(
//     ${BASE_URL}?key=${KEY}&q=${text}&image-type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40
//   );
//   const result = await response.json();
//   console.log(result);
//   console.log(text);
//   return result;
// }
