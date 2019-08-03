/*
 * https://etecdados.github.io
 * etecdados v1.0.0
 * copyright 2019 by etecdados
 * created on 2013/06/24 12:10
 * author fernando silva
 * last update on 2019/07/25
 */

/* variables ------------------------------------------------ */
var users;
var username = getCookie("username") ? getCookie("username") : null;
var language = getCookie("language") ? getCookie("language") : 0;

 /* google api ----------------------------------------------- */
var apikey_gsheet   = "AIzaSyBke8vUjVil_hL3-G9OJWWsVYJgn1ZdCRY";
var apikey_gmaps    = "";
var client_id       = "345990898270-gh1f4t9pe4lhgcmgfnubojanrqnsmhs5.apps.googleusercontent.com";
var database_main   = "1ZcP8Rax-xRtegYTHQ_1BJjtOQmnQT8kMQb7Bi9Guls4";
var discovery_docs  = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var request_scope   = "https://www.googleapis.com/auth/spreadsheets.readonly";

/* initial setup -------------------------------------------- */
function initialSetup() {
    gapi.client.init({
        apiKey: apikey_gsheet,
        clientId: client_id,
        discoveryDocs: discovery_docs,
        scope: request_scope,
    }).then(function() {
        // listen
        gapi.auth2.getAuthInstance().isSignedIn.listen(getUsers);
        gapi.auth2.getAuthInstance().isSignedIn.listen(getLanguage);
        // get
        getUsers(gapi.auth2.getAuthInstance().isSignedIn.get());
        getLanguage(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

/* load library --------------------------------------------- */
function loadLibrary() {
    gapi.load("client:auth2", initialSetup);
}

/* get cookie ----------------------------------------------- */
function getCookie(parameter) {
    // values
    var values = "; " + document.cookie;
    // split
    var split = values.split("; " + parameter + "=");
    // check
    if (split.length == 2) {
        return split.pop().split(";").shift()
    };
}

/* get users ------------------------------------------------ */
function getUsers() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: database_main,
        range: "users!A2:Z",
    }).then(function(response) {
        // result
        users = response.result;
    });
}

/* get language --------------------------------------------- */
function getLanguage() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: database_main,
        range: "language!B2:Z",
    }).then(function(response) {
        // result
        var range = response.result;
        // set item
        sessionStorage.setItem("lastname", range.values);
        // bilble link
        switch(language) {
            case "1":
                document.getElementById("a_bible").href = "https://www.bible.com/es/bible/128/JHN.3.16.NVI";
                break;
            case "2":
                document.getElementById("a_bible").href = "https://www.bible.com/bible/111/JHN.3.16.NIV";
                break;
            default:
                document.getElementById("a_bible").href = "https://www.bible.com/pt/bible/129/JHN.3.16.NVI";
        }
    });
}

/* set language --------------------------------------------- */
function setLanguage(parameter) {
    // id
    var identifier = parameter.id;
    // get element
    var element = document.getElementById(identifier).value;
    // switch
    switch(element) {
        case "1":
            document.cookie = "language=" + element + "; path=/";
            location.reload();
            break;
        case "2":
            document.cookie = "language=" + element + "; path=/";
            location.reload();
            break;
        default:
            document.cookie = "language=0; path=/";
            location.reload();
    }
}

/* text ----------------------------------------------------- */
var text = new Array();
// total rows
var rows = 11;
// total columns
var columns = 3;
// multidimensional arrays
for (var i = 0; i < rows; i++ ) {
    text.push([]);
}
// get item
var item = sessionStorage.getItem("lastname");
// split
var split = item.split(",")
// push into array
for (var i = 0; i < rows; i++) {
    for (var b = 0; b < columns; b++) {
        text[i].push(split[i * columns + b]);
    }
}

/* login ---------------------------------------------------- */
function login() {
    // get email and password
    var email    = document.getElementById("input_email").value;
    var password = document.getElementById("input_password").value;
    // keys length
    var keys = Object.keys(users.values).length;
    // temporary array
    var temporary = new Array();
    // push
    for (var i = 0; i < keys; i++) {
        temporary.push(users.values[i]);
    }
    // search user
    var search;
    var auxiliary = 0;
    for (var i = 0; i < temporary.length; i++) {
        if (temporary[i][1] == email) {
            search = i;
            auxiliary = temporary[search].length - 1;
            break;
        }
    }
    // clear modal
    document.getElementById("span_user").className = "d-none";
    document.getElementById("span_password").className = "d-none";
    // validate
    if (search == null) {
        // user not found
        document.getElementById("span_user").className = "d-block";
    } else if (temporary[search][auxiliary] != password) {
        // incorrect password
        document.getElementById("span_password").className = "d-block";
    } else {
        // username cookie
        document.cookie = "username=" + email + "; path=/";
        // redirect
        location.href = "../elecnor";
    }
}

/* security ------------------------------------------------- */
function security() {
    // check login
    if (username == null) {
        location.href = "../";
    }
}