//appending thumbnail pics prints in order
//AIzaSyBSlP4gPCojbCgP0kns_XgvDAa38-sx4vg   (futuretubies)
//AIzaSyBYRDGmU8l00ww9MrHfT_xYg4swNBw7iNM (minsooerickim)
function keyWordSearch() {
    gapi.client.setApiKey('AIzaSyBSlP4gPCojbCgP0kns_XgvDAa38-sx4vg');
    gapi.client.load('youtube', 'v1', function() {
            makeRequest();
            makeRequestViews();
    });
}

function makeRequest() {
    var q = $('#query').val();
    var request = gapi.client.youtube.search.list({
            q: q,
            part: 'snippet',
            maxResults: 3,
            type: "video"                     
    });
    request.execute(function(response) {    
        const strRes = JSON.stringify(response.result);
        var dict = JSON.parse(strRes);
        parseVidId(dict);
        parseImage(dict);
    });
}

function makeRequestViews(arrId) {
    var request = gapi.client.youtube.videos.list({
            part: 'statistics',
            id: arrId                
    });
    request.execute(function(response) {    
        const strRes = JSON.stringify(response.result);
        var dict = JSON.parse(strRes);
        parseViews(arrId, dict);
    });
}

//getting vidId for views
function parseVidId(dict) {
    let arrIds = [];

    var items = dict.items;

    for (var i = 0; i < items.length; ++i) {
        var obj = items[i];
    
        arrIds.push(obj.id.videoId);
    }
    
    for (var i = 0; i < arrIds.length; ++i) {
        makeRequestViews(arrIds[i]);
    }
}

let bruhId = [];
let bruhView = [];
var thumbDict = {};
// let views = [];
//parsing views after request
function parseViews(arryId, dict) {
    let arrViews = [];
    let viewCounts = [];
    let views = [];

    var items = dict.items;

    for (var item in items) {
        arrViews.push(item, items[item]);
    }

    for (var i = 0; i < arrViews.length; ++i) {
        viewCounts.push(arrViews[i].statistics)
    }
    
    views = (viewCounts["1"].viewCount);
    
    bruhView.push(views.toString());
    bruhId.push(arryId);
    thumbDict[arryId + ""] = views;
}

//getting thumbnail
function parseImage(dict) {
    let arrIds = [];
    let arr = [];

    var items = dict.items;
    
    for (var i = 0; i < items.length; ++i) {
        var obj = items[i];
    
        arr.push(obj.snippet.thumbnails.high.url);
    }

    for (var i = 0; i < items.length; ++i) {
        var obj = items[i];
    
        arrIds.push(obj.id.videoId);
    }
    createImage(arr, arrIds);
}

let orderedIds = [];
let orderedViews = [];
//inserting thumbnail
function createImage(arr, arrIds) {
    for (var i = 0; i < arr.length; ++i) {
        img = document.createElement('img');
        img.src = arr[i];
        img.id = arrIds[i];
        img.classList.add(i.toString());
        // img.onclick = mostViews(this.id);
        document.getElementById('thumb-container').appendChild(img);
    }
}

var firstTime = 0;
function remove(el) {
    if (firstTime == 0) {
        //removing title
        var element = document.getElementById('logo');
        element.innerHTML = "";

    //replacing start to next
        button = document.getElementById('start-img');
        button.src = "imgs/next.png";
    }
    firstTime = firstTime + 1;
}

var correct = 0;
function next() {
    var one = document.getElementsByClassName("0")[0].id;
    var two = document.getElementsByClassName("1")[0].id;
    var three = document.getElementsByClassName("2")[0].id;

    //ordering array as shown on page
    if (one == bruhId[0]) {
        orderedIds.push(bruhId[0])
        orderedViews.push(bruhView[0]);
    }
    else {
        if (one == bruhId[1]) {
            orderedIds.push(bruhId[1])
            orderedViews.push(bruhView[1])
        }
        else {
            orderedIds.push(bruhId[2]);
            orderedViews.push(bruhView[2]);
        }
    }

    if (two == bruhId[1]) {
        orderedIds.push(bruhId[1]);
        orderedViews.push(bruhView[1]);
    }
    else {
        if (two == bruhId[0]) {
            orderedIds.push(bruhId[0]);
            orderedViews.push(bruhView[0]);
        }
        else {
            orderedIds.push(bruhId[2]);
            orderedViews.push(bruhView[2]);
        }
    }

    if (three == bruhId[2]) {
        orderedIds.push(bruhId[2]);
        orderedViews.push(bruhView[2]);
    }
    else {
        if (three == bruhId[0]) {
            orderedIds.push(bruhId[0]);
            orderedViews.push(bruhView[0]);
        }
        else {
            orderedIds.push(bruhId[1]);
            orderedViews.push(bruhView[1]);
        }
    }

    //get index with most views
    var winningIndex = getWinningIndex();

    console.log(orderedIds);
    console.log(orderedViews);
    console.log(winningIndex);

    var thumb0 = document.getElementById(orderedIds[0]);
    var thumb1 = document.getElementById(orderedIds[1]);
    var thumb2 = document.getElementById(orderedIds[2]);
    
    thumb0.onclick = function() {
        thumb0.classList.add("blur");
        thumb1.classList.add("blur");
        thumb2.classList.add("blur");
            
        if (winningIndex == 0) {
            img = document.createElement('span');
            img.classList.add("correct1");
            document.getElementById('thumb-container').appendChild(img);
            correct = 1;
        }
        else {
            correct = 0;
            img = document.createElement('span');
            img.classList.add("wrong1");
            document.getElementById('thumb-container').appendChild(img);

            if (winningIndex == 1) {
                img = document.createElement('span');
                img.classList.add("correct2");
                document.getElementById('thumb-container').appendChild(img);
            }
            else {
                img = document.createElement('span');
                img.classList.add("correct3");
                document.getElementById('thumb-container').appendChild(img);
            }
        }

        if (counter == 6) {
            //remove next and query box
            queryBox = document.getElementById('boxNbutt');
            queryBox.remove();

            //remove thumbnails
            document.getElementById('thumb-container').innerHTML = "";

            //add goodJob 
            goodJob = document.createElement('img');
            goodJob.setAttribute('id', 'goodJob');
            goodJob.src = "imgs/goodJob.png";
            document.getElementById('buttons').appendChild(goodJob);

            //add something final a cute image or sum
            finalImage = document.createElement('img');
            finalImage.style.paddingTop = '6.57%';
            finalImage.src = "imgs/gameOver.png";
            finalImage.style.paddingTop = "50px";
            document.getElementById('thumb-container').appendChild(finalImage);

            document.getElementById('questionNumber').remove();
        }
    }
    thumb1.onclick = function() {
        thumb0.classList.add("blur");
        thumb1.classList.add("blur");
        thumb2.classList.add("blur");

        if (winningIndex == 1) {
            correct = 1;
            img = document.createElement('span');
            img.classList.add("correct2");
            document.getElementById('thumb-container').appendChild(img);
        }
        else {
            correct = 0;
            img = document.createElement('span');
            img.classList.add("wrong2");
            document.getElementById('thumb-container').appendChild(img);

            if (winningIndex == 0) {
                img = document.createElement('span');
                img.classList.add("correct1");
                document.getElementById('thumb-container').appendChild(img);
            }
            else {
                img = document.createElement('span');
                img.classList.add("correct3");
                document.getElementById('thumb-container').appendChild(img);                
            }
        }

        if (counter == 6) {
            //remove next and query box
            queryBox = document.getElementById('boxNbutt');
            queryBox.remove();

            //remove thumbnails
            document.getElementById('thumb-container').innerHTML = "";

            //add goodJob 
            goodJob = document.createElement('img');
            goodJob.setAttribute('id', 'goodJob');
            goodJob.src = "imgs/goodJob.png";
            document.getElementById('buttons').appendChild(goodJob);

            //add something final a cute image or sum
            finalImage = document.createElement('img');
            finalImage.style.paddingTop = '6.57%';
            finalImage.src = "imgs/gameOver.png";
            document.getElementById('thumb-container').appendChild(finalImage);
            
            document.getElementById('questionNumber').remove();
        }
    }
    thumb2.onclick = function() {
        thumb0.classList.add("blur");
        thumb1.classList.add("blur");
        thumb2.classList.add("blur");

        if (winningIndex == 2) {
            correct = 1;
            img = document.createElement('span');
            img.classList.add("correct3");
            document.getElementById('thumb-container').appendChild(img);
        }
        else {
            correct = 0;
            img = document.createElement('span');
            img.classList.add("wrong3");
            document.getElementById('thumb-container').appendChild(img);

            if (winningIndex == 0) {
                img = document.createElement('span');
                img.classList.add("correct1");
                document.getElementById('thumb-container').appendChild(img);               
            }
            else {
                img = document.createElement('span');
                img.classList.add("correct2");
                document.getElementById('thumb-container').appendChild(img);                
            }
        }

        if (counter == 6) {
            //remove next and query box
            queryBox = document.getElementById('boxNbutt');
            queryBox.remove();

            //remove thumbnails
            document.getElementById('thumb-container').innerHTML = "";

            //add goodJob 
            goodJob = document.createElement('img');
            goodJob.setAttribute('id', 'goodJob');
            goodJob.src = "imgs/goodJob.png";
            document.getElementById('buttons').appendChild(goodJob);

            //add something final a cute image or sum
            finalImage = document.createElement('img');
            finalImage.style.paddingTop = '6.57%';
            finalImage.src = "imgs/gameOver.png";
            document.getElementById('thumb-container').appendChild(finalImage);

            document.getElementById('questionNumber').remove();
        }
    }
}
function getWinningIndex() {
    var highest = 0;
    for (var i = 1; i < 3; ++i) {
        if (parseInt(orderedViews[i]) > parseInt(orderedViews[highest])) {
            highest = i;
        }
    }
    return highest;
}

var counter = 1;
var pointCounter = 1;
function removeThumbs() {
    //clearing previous thumbs
    document.getElementById('thumb-container').innerHTML = "";
    bruhId = [];
    bruhView = [];
    thumbDict = {};
    orderedIds = [];
    orderedViews = [];

    if (counter != 1) {
        document.getElementById('questionNumber').remove();
    }

    console.log('test');
    questionNumber = document.createElement('img');
    questionNumber.id = 'questionNumber';
    questionNumber.src = "imgs/question/" + counter.toString() + ".png";
    document.getElementById('buttons').prepend(questionNumber);
    // //restating placeholder value
    // textBox = getElementById('query');
    // textBox.placeholder = "TYPE A NEW WORD OR PHRASE HERE:)" 

    // //last question
    // if (counter == 2) {

    // }
    //adding points
    if (pointCounter == 1) {
        point = document.createElement('img');
        point.setAttribute('id', 'pointSystem');
        point.src = "imgs/points/" + (counter - 1).toString() + ".png";
        document.getElementById('points').appendChild(point);
        pointCounter += 1;
    }
    if (correct == 1) {
        point = document.getElementById("pointSystem");
        point.src = "imgs/points/" + (pointCounter - 1).toString() + ".png";

        pointCounter = pointCounter + 1;
        correct = 0;
    }
    counter++;
}

function checkQuery() {
    var userInput = document.getElementById('query');
    if (userInput.value == "") {
        alert("TIP: Type something in the search box before proceeding for more interesting results!");
    }
}