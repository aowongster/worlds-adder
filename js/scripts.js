var WorldsCards;
var DeckList=[];
var SearchResults;
var Score;

$( document ).ready(function() {
    WorldsCards = $.csv.toObjects(csvData);
});

// clears deck list
$('.card-form').submit(function(e) {
  e.preventDefault();
  // do some other stuff here
  clearDeckList();
});

$('.card-input').keyup(function(e) {
  var charCode = e.charCode || e.keyCode;
  if (isAlphaNumeric(charCode) || charCode === 8) { // hard code backspace
    var inputText = $('.card-input').val();
    if (inputText.length > 0) {
      SearchResults = GetMatchingCardsFromInputString(inputText);
      populateSearchResults();
    } else if (inputText.length === 0) {
      $('.search-list').empty();
      SearchResults = [];
    }
    $('.search-count').text(`(${SearchResults.length})`);
  }
});

// full string matching for faster lookup
function GetMatchingCardsFromInputString(str) {
  var results = [];
  for (var i = 0; i < csvData.length; i++) {
    var card = WorldsCards[i];
    if (typeof card !== 'undefined' && 'Name' in card) {
      var cardName = WorldsCards[i].Name.toLowerCase();
      if (cardName.includes(str)) {
        results.push(WorldsCards[i]);
      }
    }
  }
  return results;
}

// matching for single char
function GetMatchingCards(charPressed) {
  var results = [];
  for(var i=0; i<csvData.length; i++) {
    var card = WorldsCards[i];
    if (typeof card !== 'undefined' && 'Name' in card) {
      var cardFirstLetter = WorldsCards[i].Name.charAt(0);
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
