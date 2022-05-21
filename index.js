// NEXT STEPS
// - Continue: cache quotes and images to reduce load time (see how other apps do it)
// - publish to chrome web store!
// --------
// - refactor from fetch to use async await
// - button to generate new quote and image (small 🔁 button in corner?)
// - cache quotes or have a json file with all quotes downloaded
// - ability to choose which stoic author
//    -> saves the author in local storage

// const quotesLeftInStorage = JSON.parse(localStorage.getItem('quotes'));

const renderPage = () => {
  renderBackground();
  renderQuote();
};

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

setInterval(getCurrentTime, 1000);

// <=============== BACKGROUND IMAGE =================>

const fetchBackgroundImage = async () => {
  try {
    const response = await fetch(
      'https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature'
    );
    return response.json();
  } catch (err) {
    // TODO: doesn't catch error; watch back Scrimba video to understand why
    console.log(err);
    const backupImageData = {
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
    };
    return backupImageData;
  }
};

const renderBackground = async () => {
  const data = await fetchBackgroundImage();
  console.log(data);
  document.body.style.backgroundImage = `url(${data.urls.regular})`;
  document.getElementById(
    'photographer'
  ).textContent = `Photo by ${data.user.name}`;
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
  const data = await fetchQuotes();
  console.log(data);
  const numQuotes = data.length;
  let currentQuoteData = data[getRandomIndex(numQuotes)];
  while (checkIfQuoteTooLong(currentQuoteData)) {
    currentQuoteData = data[getRandomIndex(numQuotes)];
  }
  document.getElementById('quote').textContent = `"${currentQuoteData.body}"`;
  document.getElementById('author').textContent = currentQuoteData.author;
};

const saveNQuotesToLocalStorage = async (n) => {
  // TODO: fetch quotes and save them below
  const quotessss = await fetchQuotes();
  const quotes = ['quote', 'quote2', 'quote3'];
  const quotesToStore = [];
  const numQuotes = quotes.length;
  for (let i = 0; i < n; i++) {
    const randomIndex = getRandomIndex(numQuotes);
    const randomQuote = quotes[randomIndex];
    quotes.push(randomQuote);
  }
  localStorage.setItem('savedQuotes', JSON.stringify(quotesToStore));
};

const retreiveQuoteFromLocalStorage = () => {
  // replace array in local storage with one w/o just-retreived quote
  // update quotesLeftInStorage length
};

// if (quotesLeftInStorage.length <= 1) {
//   saveNQuotesToLocalStorage(10);
// }

renderPage();
