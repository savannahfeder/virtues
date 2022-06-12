// <==================== TIME =======================>

const renderTime = () => {
  const todaysDate = new Date();
  document.getElementById('time').textContent = todaysDate.toLocaleTimeString(
    'en-us',
    { timeStyle: 'short' }
  );
};

// <=============== BACKGROUND IMAGE =================>

const backupImages = [
  {
    urls: {
      full: 'https://images.unsplash.com/photo-1500829243541-74b677fecc30?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTMxMDUyNTA&ixlib=rb-1.2.1&q=80',
      regular:
        'https://images.unsplash.com/photo-1500829243541-74b677fecc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTMxMDUyNTA&ixlib=rb-1.2.1&q=80&w=1080',
      small:
        'https://images.unsplash.com/photo-1500829243541-74b677fecc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTMxMDUyNTA&ixlib=rb-1.2.1&q=80&w=400',
    },
    user: {
      name: 'Daniil Silantev',
    },
  },
];

const fetchImage = async () => {
  try {
    const response = await fetch(
      'https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature'
    );
    return response.json();
  } catch (err) {
    console.log(err);
    return backupImages[0];
  }
};

const renderBackground = () => {
  const currentImage = retreiveImageFromLocalStorage();
  document.body.style.backgroundImage = `url(${currentImage.urls.regular})`;
  document.getElementById(
    'photographer'
  ).textContent = `Photo by ${currentImage.user.name}`;
};

const saveNImagesToLocalStorage = async (n) => {
  const images = [];
  for (let i = 0; i < n; i++) {
    const image = await fetchImage();
    images.push(image);
  }
  saveToLocalStorage('savedImages', images);
  console.log(`Saved ${n} images to local storage!`);
};

const retreiveImageFromLocalStorage = () => {
  const retreivedImage = retrieveFromLocalStorage('todaysImage');
  if (retreivedImage) {
    return retreivedImage;
  } else {
    console.log('Image was not successfully retreived. Returned backup image.');
    return backupImages[0];
  }
};

const saveTodaysImage = () => {
  const retreivedImages = retrieveFromLocalStorage('savedImages');
  const todaysImage = retreivedImages.pop();
  numImagesLeftInStorage = retreivedImages.length;
  saveToLocalStorage('todaysImage', todaysImage);
  saveToLocalStorage('savedImages', retreivedImages);
};

// <================== QUOTES ====================>

const backupQuotes = [
  {
    body: `The happiness of your life depends upon the quality of your thoughts: therefore, guard accordingly, and take care that you entertain no notions unsuitable to virtue and reasonable nature.`,
    author: `Marcus Aurelius`,
  },
  {
    body: `The best revenge is to be unlike him who performed the injury.`,
    author: `Marcus Aurelius`,
  },
  {
    body: `Our life is what our thoughts make it.`,
    author: `Marcus Aurelius`,
  },
];

const getRandomIndex = (arrayLength) => {
  return Math.round(Math.random() * (arrayLength - 1));
};

const getRandomQuote = (quotes) => {
  const numQuotes = quotes.length;
  let randomQuote = quotes[getRandomIndex(numQuotes)];
  while (checkIfQuoteTooLong(randomQuote)) {
    randomQuote = quotes[getRandomIndex(numQuotes)];
  }
  return randomQuote;
};

const checkIfQuoteTooLong = (quote) => {
  const maxQuoteChars = 155;
  const quoteLength = quote.body.length;
  return quoteLength > maxQuoteChars;
};

const fetchQuotes = async () => {
  try {
    let response = await fetch(
      'https://stoic-server.herokuapp.com/search/marcus'
    );
    return await response.json();
  } catch (err) {
    console.log(err);
    return backupQuotes;
  }
};

const renderQuote = async () => {
  const currentQuote = retreiveQuoteFromLocalStorage();
  document.getElementById('quote').textContent = `"${currentQuote.body}"`;
  document.getElementById('author').textContent = currentQuote.author;
};

const saveNQuotesToLocalStorage = async (n) => {
  const quotes = await fetchQuotes();
  const quotesToStore = [];
  for (let i = 0; i < n; i++) {
    const randomQuote = getRandomQuote(quotes);
    quotesToStore.push(randomQuote);
  }
  saveToLocalStorage('savedQuotes', quotesToStore);
  console.log(`Saved ${n} quotes to local storage!`);
};

const retreiveQuoteFromLocalStorage = () => {
  const retreivedQuote = retrieveFromLocalStorage('todaysQuote');
  if (retreivedQuote) {
    return retreivedQuote;
  } else {
    console.log('Quote was not successfully retreived. Returned backup quote.');
    return backupQuotes[0];
  }
};

const saveTodaysQuote = () => {
  const retreivedQuotes = retrieveFromLocalStorage('savedQuotes');
  const todaysQuote = retreivedQuotes.pop();
  numQuotesLeftInStorage = retreivedQuotes.length;
  saveToLocalStorage('todaysQuote', todaysQuote);
  saveToLocalStorage('savedQuotes', retreivedQuotes);
};

// <================== GENERAL FUNCTIONS ==================>

const retrieveFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const saveDate = () => {
  const todaysDate = new Date().toDateString();
  saveToLocalStorage('lastSavedDate', todaysDate);
};

const isNewDay = () => {
  const previousDate = retrieveFromLocalStorage('lastSavedDate');
  const todaysDate = new Date().toDateString();
  console.log(todaysDate);
  return previousDate !== todaysDate;
};
const fillStorage = async () => {
  let quotesLeftInStorage = retrieveFromLocalStorage('savedQuotes');
  let numQuotesLeftInStorage = quotesLeftInStorage
    ? quotesLeftInStorage.length
    : 0;

  let imagesLeftInStorage = retrieveFromLocalStorage('savedImages');
  let numImagesLeftInStorage = imagesLeftInStorage
    ? imagesLeftInStorage.length
    : 0;

  if (numImagesLeftInStorage <= 1) {
    await saveNImagesToLocalStorage(3);
  }

  if (numQuotesLeftInStorage <= 1) {
    await saveNQuotesToLocalStorage(3);
  }
};

const refreshData = async () => {
  await fillStorage();
  saveTodaysQuote();
  saveTodaysImage();
  saveDate();
};

// <===================== REFRESH =====================>
document.getElementById('refresh').addEventListener('click', () => {
  refreshData();
  renderPage();
});

// <================== RUN APPLICATION ==================>

const renderPage = async () => {
  await fillStorage();
  if (isNewDay()) {
    refreshData();
    renderPage();
  } else {
    renderBackground();
    renderQuote();
    renderTime();
  }
};

// RUN
renderTime();
setInterval(renderTime, 1000);
renderPage();
