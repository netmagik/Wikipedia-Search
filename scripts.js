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
  if(!searchTerm) {
    searchResult.innerHTML = '';
    return;
  }
  
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${searchTerm}`;
    
    const response = await fetch(url);
    const results = await response.json();
    
    
    // Render Search Results
    
    const searchResultsHTML = generateSearchResultsHTML(results.query.search, searchTerm);
    
    // Add search results to the initial searchResult to display it on the page:
    searchResult.innerHTML = searchResultsHTML;
    
    
//     console.log({
//       'term': searchTerm,
//       'results': results.query.search
//     });
    
  } catch (error) {
    console.log(error);
  }
});

const stripHtml = (html) => {
    let div = document.createElement('div');
    div.textContent = html;
    return div.textContent;
};

const highlight = (str, keyword, className = "highlight") => {
    const hl = `<span class="${className}">${keyword}</span>`;
    return str.replace(new RegExp(keyword, 'gi'), hl);
};

const generateSearchResultsHTML = (results, searchTerm) => {
  return results.map(result => {
    const title = highlight(stripHtml(result.title), searchTerm);
    const snippet = highlight(stripHtml(result.snippet), searchTerm);
    return `<article>
            <a href="https://en.wikipedia.org/?curid=${result.pageid}">
            <h2>${title}</h2>
            </a>
            <div class="summary">
            ${snippet}...
            </div>
            </article>`;
  })
  .join('');
}