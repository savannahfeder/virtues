// NEXT STEPS
// - fix bug: saveNImagesToLocalStorage is trying to save promises to local storage. Solutions:
//            - store preset # of URLs in (spend ~20 mins finding pics and save urls into a static folder)
//                  - Problem: app isn't very robust. Save the images instead in a folder?
// - find unsplash API that retuns *multiple* images
// - change font for quote to improve readability & feel
// - make content appear 50% down the page (check Stackoverflow)
// - cache images (first, copy and paste smilar quotes functions, then make them abstract)
// - publish to chrome web store!
// --------
// - refactor from fetch to use async await
// - button to generate new quote and image (small 🔁 button in corner?)
// - cache quotes or have a json file with all quotes downloaded
// - ability to choose which stoic author
//    -> saves the author in local storage

// <==================== TIME =======================>

const date = new Date();
document.getElementById('time').textContent = date.toLocaleTimeString('en-us', {
  timeStyle: 'short',
});

const getCurrentTime = () => {
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
  console.log('Fetching image...');
  try {
    const response = await fetch(
      'https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature'
    );
    return response.json();
  } catch (err) {
    console.log('Failing to fetch image...');
    console.log(err);
    return backupImages[0];
  }
};

const renderBackground = () => {
  console.log('[1] Rendering background...');
  const currentImage = retreiveImageFromLocalStorage();
  console.log('Current image below...');
  console.log(currentImage);
  console.log('[3/4] Now rendering background');
  document.body.style.backgroundImage = `url(${currentImage.urls.regular})`;
  document.getElementById(
    'photographer'
  ).textContent = `Photo by ${currentImage.user.name}`;
};

// Copied below (later, refactor to abstract functions)...

const saveNImagesToLocalStorage = async (n) => {
  console.log('[3] If no images in storage...');
  const images = [];
  for (let i = 0; i < n; i++) {
    const image = await fetchImage();
    images.push(image);
  }
  localStorage.setItem('savedImages', JSON.stringify(images));
  console.log(`Saved ${n} images to local storage!`);
};

const retreiveImageFromLocalStorage = () => {
  console.log('[2] Retreiving images from storage...');
  const retreivedImages = JSON.parse(localStorage.getItem('savedImages'));
  if (retreivedImages) {
    const retreivedImage = retreivedImages.pop();
    imagesLeftInStorage = retreivedImages.length;
    localStorage.setItem('savedImages', JSON.stringify(retreivedImages));
    return retreivedImage;
  } else {
    saveNImagesToLocalStorage(2);
    return backupImages[0];
  }
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
  localStorage.setItem('savedQuotes', JSON.stringify(quotesToStore));
  console.log(`Saved ${n} quotes to local storage!`);
};

const retreiveQuoteFromLocalStorage = () => {
  const retreivedQuotes = JSON.parse(localStorage.getItem('savedQuotes'));
  if (retreivedQuotes) {
    const retreivedQuote = retreivedQuotes.pop();
    quotesLeftInStorage = retreivedQuotes.length;
    localStorage.setItem('savedQuotes', JSON.stringify(retreivedQuotes));
    return retreivedQuote;
  } else {
    return backupQuotes[0];
  }
};

// <================== RUN APPLICATION ==================>

setInterval(getCurrentTime, 1000);

let quotesLeftInStorage = JSON.parse(localStorage.getItem('savedQuotes'));
let numQuotesLeftInStorage = quotesLeftInStorage
  ? quotesLeftInStorage.length
  : 0;

let imagesLeftInStorage = JSON.parse(localStorage.getItem('savedImages'));
let numImagesLeftInStorage = imagesLeftInStorage
  ? imagesLeftInStorage.length
  : 0;

const renderPage = () => {
  renderBackground();
  renderQuote();
  // TODO: renderTime()
};

if (numQuotesLeftInStorage <= 1) {
  saveNQuotesToLocalStorage(10);
}

if (numImagesLeftInStorage <= 1) {
  saveNImagesToLocalStorage(5);
}

renderPage();
