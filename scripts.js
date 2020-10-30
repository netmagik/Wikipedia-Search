const searchTerm = document.querySelector('#searchTerm');
const searchResult = document.querySelector('#searchResult');

searchTerm.focus();

searchTerm.addEventListener('input', function(event) {
  search(event.target.value);
});

// Create debounce function to improve performance
const debounce = (fn, delay=500) => {
  let timeoutID;
  
  return (...args) => {
    // Cancel the previous timer
     if (timeoutID) {
    clearTimeout(timeoutID);
  }
    // Set up a new timer
    timeoutID = setTimeout(() => {
      fn.apply(null, args);
    }, delay);    
  }
}

const search = debounce(async (searchTerm) => {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${searchTerm}`;
    
    const response = await fetch(url);
    const results = await response.json();
    
    console.log({
      'term': searchTerm,
      'results': results.query.search
    });
    
  } catch (error) {
    console.log(error);
  }
});