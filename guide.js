const GUIDE_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR8MHFjkuPlvjctHFmRf1VEmJ0C1xjF4M9DzVEkg2PtxhjcOCzDleTcvPsebZnsey3rYbUfv5uN7qM9/pub?output=csv';

let guideData = [];
let loadedGuideCount = 0;
const LOAD_GUIDE_STEP = 10;

async function loadGuides() {
  const container = document.getElementById('guide-container');
  container.textContent = 'Загрузка...';

  try {
    const url = GUIDE_CSV_URL + '&_=' + new Date().getTime();
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Ошибка загрузки CSV');
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    guideData = parsed.data.reverse();
    loadedGuideCount = 0;
    container.innerHTML = '';

    if (guideData.length === 0) {
      container.textContent = 'Гайдов пока нет.';
      return;
    }

    loadMoreGuides();

    window.addEventListener('scroll', onScrollLoadMoreGuide);

  } catch (e) {
    container.textContent = 'Не удалось загрузить гайды.';
    console.error(e);
  }
}

function loadMoreGuides() {
  const container = document.getElementById('guide-container');
  const nextItems = guideData.slice(loadedGuideCount, loadedGuideCount + LOAD_GUIDE_STEP);
  nextItems.forEach(item => {
    const guideItem = document.createElement('div');
    guideItem.className = 'guide-item';

    const titleEl = document.createElement('h3');
    titleEl.textContent = item.title || item.Title || item.TITLE || 'Без названия';
    guideItem.appendChild(titleEl);

    const textEl = document.createElement('p');
    let rawText = item.text || item.Text || item.TEXT || '';
    rawText = rawText.replace(/\n{2,}/g, '\n');
    textEl.innerHTML = rawText.replace(/\n/g, '<br>');
    guideItem.appendChild(textEl);

    container.appendChild(guideItem);
  });
  loadedGuideCount += nextItems.length;
}

function onScrollLoadMoreGuide() {
  if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200)) {
    if (loadedGuideCount < guideData.length) {
      loadMoreGuides();
    } else {
      window.removeEventListener('scroll', onScrollLoadMoreGuide);
    }
  }
}

if (document.getElementById('guide-container')) {
  loadGuides();
}