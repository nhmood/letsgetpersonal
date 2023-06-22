// once the page is ready, call the initializer
document.addEventListener('DOMContentLoaded', function() {
  initState();
});

// firefox/chrome localStorage compatibility
if (typeof browser === "undefined"){ var browser = chrome; }

// initialize the state based on the current configuration
async function initState(){
  // await the getState (pulled from browser.storage) then set style
  // in the browser action view
  var state = await getState();
  setStyle(state);


  // make the entire browser action view clickable
  document.getElementsByTagName("body")[0].addEventListener("click", toggleState);
}

// set state into browser storage
async function setState(state){
  // wrap the browser.storage.local.set call in a promise such that we can
  // await it and configure components synchronously
  var p = new Promise(function(resolve, reject){
    browser.storage.local.set({'lgp_enabled': state}, function(e) {
      resolve(state);
    });
  });

  return await p;
}


// get state from browser storage
async function getState(){
  // wrap the browser.storage.local.get call in a promise such that we can
  // await it and configure components synchronously
  var p = new Promise(function(resolve, reject){
    browser.storage.local.get('lgp_enabled', function(data) {
      resolve( data.lgp_enabled );
    });
  });

  // we need to await the state here in case it has never been set before
  // if not set, we need to initialize it (to true)
  var state = await p;
  if (state === undefined){
    var state = await setState(true);
  }

  return state;
}

// set the style of the enable/disable button in the browser action
function setStyle(state){
  // simply toggle the text and colors based on the input state
  if (state){
    indicator.classList.remove("disabled");
    indicator.classList.remove("fa-times");
    indicator.classList.add("enabled");
    indicator.classList.add("fa-check");
    text.innerHTML = "Let's Get Personal Enabled";

  } else {
    indicator.classList.remove("enabled");
    indicator.classList.remove("fa-check");
    indicator.classList.add("disabled");
    indicator.classList.add("fa-times");
    text.innerHTML = "Let's Get Personal Disabled";
  }
}


// toggle the state
async function toggleState(){
  // get the current state
  var state = await getState();

  // set the state to the opposite of the current state (toggle)
  // then update the style similarily
  await setState(!state);
  setStyle(!state);


  // if the current tab is on a wikipedia page, then reload it
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // kind of hacky way of determining if this tab is a wiki page
    // if so, we should reload
    // maybe replace this with proper regex later
    if (tabs[0].url.indexOf("wikipedia.org") != -1){
      browser.tabs.reload(tabs[0].id, function(e){ });
    }
  });

  return true;
}
