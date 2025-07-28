const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQSCuP7luNbTXwzyoU7OuAjF8rsyvKg22xYvXS6r2FTVwN0N3vfC0cI_oMsa9Xr0Z3Icdp8j8FQN4wj/pub?output=csv';

let newsData = [];
let loadedCount = 0;
const LOAD_STEP = 10;

function formatDate(dateStr) {
  if (!dateStr) return '';
  // Поддержка формата ДД.ММ.ГГГГ
  if (/^\d{1,2}\.\d{1,2}\.\d{2,4}$/.test(dateStr)) {
    let [d,m,y] = dateStr.split('.');
    d = d.padStart(2,'0');
    m = m.padStart(2,'0');
    if(y.length === 2) y = '20' + y;
    return `${d}.${m}.${y}`;
  }
  // Другие форматы можно добавить здесь
  return dateStr;
}

// Конвертация ссылок Google Drive в прямые
function convertDriveLinkToDirect(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}

async function loadNews() {
  const container = document.getElementById('news-container');
  container.textContent = 'Загрузка новостей...';

  try {
    const url = CSV_URL + '&_=' + new Date().getTime();
    const response = await fetch(url, {cache: 'no-store'});
    if(!response.ok) throw new Error('Ошибка загрузки CSV');
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    newsData = parsed.data.reverse(); // последние сверху
    loadedCount = 0;
    container.innerHTML = '';
    if(newsData.length === 0) {
      container.textContent = 'Новостей пока нет.';
      return;
    }
    loadMoreNews();

    window.addEventListener('scroll', onScrollLoadMore);

  } catch(e) {
    container.textContent = 'Не удалось загрузить новости.';
    console.error(e);
  }
}

function loadMoreNews() {
  const container = document.getElementById('news-container');
  const nextItems = newsData.slice(loadedCount, loadedCount + LOAD_STEP);
  nextItems.forEach(item => {
    const newsItem = document.createElement('article');
    newsItem.className = 'news-item';

    const dateEl = document.createElement('time');
    dateEl.className = 'news-date';
    dateEl.textContent = formatDate(item.date || '');
    newsItem.appendChild(dateEl);

    if(item.image && item.image.trim()) {
      const img = document.createElement('img');
      img.className = 'news-image';
      img.src = convertDriveLinkToDirect(item.image.trim());
      img.alt = 'Новостное изображение';
      newsItem.appendChild(img);
    }

    const textEl = document.createElement('p');
    textEl.className = 'news-text';
    // переносы строк в <br>
    textEl.innerHTML = (item.text || '').replace(/\n/g, '<br>');
    newsItem.appendChild(textEl);

    container.appendChild(newsItem);
  });
  loadedCount += nextItems.length;
}

function onScrollLoadMore() {
  if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 150)) {
    if (loadedCount < newsData.length) {
      loadMoreNews();
    } else {
      window.removeEventListener('scroll', onScrollLoadMore);
    }
  }
}

if(document.getElementById('news-container')) {
  loadNews();
}