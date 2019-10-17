var WorldsCards;
var DeckList=[];
var SearchResults;
var Score;

$( document ).ready(function() {
    console.log( "ready!" );
    // read flat file into string
    // $.get('../assets/dok-spoilers-2019-10-14.csv', function(data) {
      // var worlds_cards = $.csv.toObjects(csvData);
      // console.log('data loaded');
    // })
    WorldsCards = $.csv.toObjects(csvData);
    // console.log(worldsCards);
});

// clears deck list
$('.card-form').submit(function(e) {
  e.preventDefault();
  // do some other stuff here
  clearDeckList();
});

$('.card-input').keydown(function(e) {
  // TODO modify to search input string instead of just... a single char
  var charCode = e.charCode || e.keyCode;
  // search data for matching titles
  if (isAlphaNumeric(charCode)) {
    var char = String.fromCharCode(charCode);
    SearchResults = GetMatchingCards(char);
    // console.log(SearchResults);
    populateSearchResults();
  } else {
    // console.log('key not alphanumeric')
  }
});

function GetMatchingCards(charPressed) {
  var results = [];
  for(var i=0; i<csvData.length; i++) {
    var card = WorldsCards[i];
    if (typeof card !== 'undefined' && 'Name' in card) {
      var cardFirstLetter = WorldsCards[i].Name.charAt(0);
      // console.log(cardFirstLetter);
      charPressed = charPressed.toUpperCase();
      if (charPressed == cardFirstLetter) {
          results.push(WorldsCards[i])
      }
    }
  }

  $('.search-count').text(`(${results.length})`);
  return results;
}

function clearDeckList() {
  DeckList = [];
  $('.deck-list').empty();
  $('.deck-count').text('');

  Score = 0;
  $('.aerc-score').text(0);
}
function addToDeckList(card) {
  if (DeckList.length >= 36) {
    return;
  }

  DeckList.push(card);

  updateDeckModelView();
  updateDeckMetaView();
}

function updateDeckMetaView() {
  computeScore();
  $('.deck-count').text(`(${DeckList.length})`)
}

function updateDeckModelView() {
  $('.deck-list').empty();
  $('.deck-list li').unbind();

  for(var i=0; i<DeckList.length; i++){
    var card = DeckList[i];
    $('.deck-list').append(`<li data-index="${i}">${card.Name} ${card["Aerc Score"]}</li>`)
  }

  $('.deck-list li').click(function () {
    var cardIndex = $(this).attr('data-index');
    DeckList.splice(cardIndex, 1);
    console.log('deleting ', cardIndex);

    updateDeckModelView();
    updateDeckMetaView();
  });
}

function computeScore() {
  Score = 0;
  for(var i=0; i<DeckList.length; i++) {
    var card = DeckList[i]
    Score += parseFloat(card["Aerc Score"]);
  }

  $('.aerc-score').text(Score.toFixed(2));
}

function populateSearchResults() {
    // clear out search results First
    $('.search-list').empty();

    for(var i=0; i<SearchResults.length; i++) {
      var card = SearchResults[i]
      $('.search-list').append(`<li data-name="${card.Name}" data-score="${card["Aerc Score"]}">${card.Name} ${card["Aerc Score"]}</li>`)
    }

    // attach click handler
    $('.search-list li').click(function() {
      var cardName = $(this).attr('data-name');
      var cardValue = $(this).attr('data-score');
      var localCard = {'Name': cardName, 'Aerc Score': cardValue};
      addToDeckList(localCard);
    });
}

function isAlphaNumeric(code) {
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  return true;
};
