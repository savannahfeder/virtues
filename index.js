// NEXT STEPS
// - fix Lint so that - in this project only - it changes quotes to single quotes
// - make gitignore file
// -----------
// - refactor from fetch to use async await
// - make quotes render once every day
// - error catching for quote API
// - make fonts more readable
// - publish to chrome web store!
// --------
// - button to generate new quote and image (small 🔁 button in corner?)
// - only show short quotes (or make font smaller for long ones)
// - cache quotes or have a json file with all quotes downloaded
// - ability to choose which stoic author
//    -> saves the author in local storage

const date = new Date();
document.getElementById('time').textContent = date.toLocaleTimeString('en-us', {
  timeStyle: 'short',
});

fetch(
  'https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature'
)
  .then((res) => res.json())
  .then((data) => {
    document.body.style.backgroundImage = `url(${data.urls.regular})`;
    document.getElementById(
      'photographer'
    ).textContent = `Photo by ${data.user.name}`;
  })
  .catch((err) => {
    document.body.style.backgroundImage = `url(
      https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080
    )`;
    document.getElementById('photographer').textContent = 'By: Dodi Achmad';
  });

const getCurrentTime = () => {
  const todaysDate = new Date();
  document.getElementById('time').textContent = todaysDate.toLocaleTimeString(
    'en-us',
    { timeStyle: 'short' }
  );
};

setInterval(getCurrentTime, 1000);

// returns number between 0 and 515 (516 total MA quotes)
const getRandomIndex = () => Math.round(Math.random() * 515);

fetch('https://stoic-server.herokuapp.com/search/marcus')
  .then((res) => res.json())
  .then((data) => {
    const index = getRandomIndex();
    const currentQuote = data[index];
    document.getElementById('quote').textContent = `"${currentQuote.body}"`;
    document.getElementById('author').textContent = currentQuote.author;
  });
