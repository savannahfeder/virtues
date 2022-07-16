// Before Deployment
// Thought: maybe don't move forward *until* you've made a database? That way, your server can send pictures instead of urls
//   - add loading component
//   - Functions not throwing errors when hit net::ERR_CONNECTION_TIMED_OUT (and possibly other errors)
//   - Change new tab icon & Virtues icon
//   - switch Scrimba API with Unsplash
//   - Apply for production: https://unsplash.com/oauth/applications/331127 - requires link

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
  } catch (error) {
    console.log('Error thrown in fetchImage function!');
    throw error;
  }
};

const renderBackground = () => {
  const currentImage = retreiveImageFromLocalStorage();
  document.body.style.backgroundImage = `url(${currentImage.urls.regular})`;
  document.getElementById(
    'photographer'
  ).textContent = `Photo by ${currentImage.user.name} on Unsplash`;
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
    throw new Error('Failed to retreive image from local storage.');
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
    console.log('Error thrown in fetchQuotes function!');
    throw err;
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
    throw new Error('Quote was not successfully retreived from local storage.');
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
  const retrievedJSONData = localStorage.getItem(key);
  if (retrievedJSONData === ('undefined' || 'null')) {
    return null;
  } else {
    const parsedData = JSON.parse(retrievedJSONData);
    return parsedData;
  }
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
  try {
    if (numImagesLeftInStorage <= 1) {
      saveNImagesToLocalStorage(3);
    }
    if (numQuotesLeftInStorage <= 1) {
      saveNQuotesToLocalStorage(3);
    }
    if (!isTodaysImageInStorage) {
      saveTodaysImage();
    }
    if (!isTodaysQuoteInStorage) {
      saveTodaysQuote();
    }
  } catch (err) {
    console.log('Error thrown in fillStorage function!');
    throw err;
  }
};

const refreshData = async () => {
  fillStorage();
  saveDate();
};

const isDataInStorage = () => {
  return (
    numImagesLeftInStorage &&
    numQuotesLeftInStorage &&
    numImagesLeftInStorage &&
    numQuotesLeftInStorage
  );
};

const renderApp = () => {
  renderBackground();
  renderQuote();
  renderTime();
};

// <===================== REFRESH =====================>
document.getElementById('refresh').addEventListener('click', () => {
  refreshData();
  try {
    renderApp();
  } catch (err) {
    console.log(err);
  }
});

// <================== RUN APPLICATION ==================>
const countItemsInStorage = (key) => {
  const items = retrieveFromLocalStorage(key);
  const numItemsLeftInStorage = items ? items.length : 0;
  return numItemsLeftInStorage;
};

let numQuotesLeftInStorage = countItemsInStorage('savedQuotes');
let numImagesLeftInStorage = countItemsInStorage('savedImages');
let isTodaysQuoteInStorage = countItemsInStorage('todaysQuote') === 1;
let isTodaysImageInStorage = countItemsInStorage('todaysImage') === 1;

const runAppAndCatchErrors = async () => {
  console.log('Running application!');
  try {
    await runApp();
  } catch (error) {
    resetApp();
  }
};

const resetApp = async () => {
  console.log('Resetting app!');
  try {
    emptyStorage();
    await fillStorage();
    runApp(); //!!! problem: because runApp catches the error, if it hits an error, it'll call itself recursively
  } catch (error) {
    // handleError()
  }
};

const runApp = async () => {
  try {
    if (!isDataInStorage()) {
      await fillStorage();
    }
    if (isNewDay()) {
      refreshData();
      runApp();
    } else {
      renderApp();
    }
  } catch (error) {
    console.log('Error thrown in runApp function!');
    throw error;
  }
};

const emptyStorage = () => {
  localStorage.clear();
};

const handleError = () => {
  try {
    renderDefaultValues();
  } catch (error) {
    renderErrorMessage();
  }
};

// RUN
renderTime();
setInterval(renderTime, 1000);
runAppAndCatchErrors();
