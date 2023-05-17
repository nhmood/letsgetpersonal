/*
 * let's get personal v0.1
 * move the personal life section on wiki pages to the top
 *
 * nhmood @ goosecode
 * jan 14th, 2020
 *
*/
console.log("Let's Get Personal v0.1");


function movePersonal(){
  // grab the personal life header by id
  var personalHeader = document.getElementById("Personal_life");
  console.debug(personalHeader);
  // if we can't find that div, doesn't exist on the page and we can stop here
  if( personalHeader === null){
    console.debug("Couldn't find any Personal Life");
    return;
  }

  // move the Personal Life entry in the TOC list
  moveTOC();

  // grab the parent node that houses the header
  var personal = personalHeader.parentNode;
  console.debug(personal);


  // we are going to collect all the relevant sub divs for personal life
  // into a container that we will reattach to the top later
  var info = [personal];

  // loop through until we find another header
  while(true){
    // grab the last element that we pushed into the info container
    // then grab its next element sibling (thing right next to it)
    var element = info.slice(-1).pop();
    var next = element.nextElementSibling;
    console.debug(next);

    // if the next thing is null OR its another header, we can stop searching
    if (next === null || next.tagName == "H2"){
      console.debug("No additional fields found, we are done");
      break;
    }

    // otherwise, push the element to our info container and keep searching
    console.debug("Pushing element to info", next);
    info.push(next);
  }
  console.debug(info);

  // create a move container to house all the personal life info
  // then append all the elements to it
  var move = document.createElement("div");
  info.forEach(function(e){ move.appendChild(e) });
  var hr = document.createElement("hr");
  var br = document.createElement("br");
  move.appendChild(br);
  move.appendChild(hr);
  move.appendChild(br);
  move.appendChild(br);
  console.debug(move);

  // grab the table of contents and append this new persona life div
  // right before it
  var toc = document.querySelector('meta[property="mw:PageProp/toc"]');
  console.debug(toc);
  toc.parentNode.insertBefore(move, toc);

  return true;
}

function moveTOC(){
  // grab the Personal Life TOC element, the "(Top)" starter element,
  // and the next TOC element after "(Top)"
  // we need to Node.insertBefore so the next TOC item is required
  // (can't just insertAfter the Top element)
  var tocPersonalLife = document.getElementById("toc-Personal_life");
  var tocTop = document.getElementById("toc-mw-content-text");
  var next = tocTop.nextElementSibling;

  tocTop.parentNode.insertBefore(tocPersonalLife, next);
}


// get state from chrome storage
async function getState(){
  // wrap the chrome.storage.local.get call in a promise such that we can
  // await it and configure components synchronously
  var p = new Promise(function(resolve, reject){
    chrome.storage.local.get('lgp_enabled', function(data) {
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


// async start function so we can wait on the returned getState
async function start(){
  var enabled = await getState();
  if (enabled){ movePersonal(); }
}


start();
