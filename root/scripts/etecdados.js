/*
 * https://etecdados.github.io
 * etecdados v1.0.0
 * copyright 2019 by etecdados
 * created on 2013/06/24 12:10
 * author fernando silva
 * last update on 2019/07/25
 */

/* variables ------------------------------------------------ */
var username = getCookie("username") ? getCookie("username") : null;
var language = getCookie("language") ? getCookie("language") : 0;

 /* google api ----------------------------------------------- */
var apikeyGsheet  = "AIzaSyBke8vUjVil_hL3-G9OJWWsVYJgn1ZdCRY";
var apikeyGmaps   = "";
var clientId      = "345990898270-gh1f4t9pe4lhgcmgfnubojanrqnsmhs5.apps.googleusercontent.com";
var databaseMain  = "1ZcP8Rax-xRtegYTHQ_1BJjtOQmnQT8kMQb7Bi9Guls4";
var discoveryDocs = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var requestScope  = "https://www.googleapis.com/auth/spreadsheets.readonly";

/* initial setup -------------------------------------------- */
function initialSetup() {
    gapi.client.init({
        apiKey: apikeyGsheet,
        clientId: clientId,
        discoveryDocs: discoveryDocs,
        scope: requestScope,
    }).then(function() {
        // listen
        gapi.auth2.getAuthInstance().isSignedIn.listen(getUsers);
        gapi.auth2.getAuthInstance().isSignedIn.listen(getLanguage);
        gapi.auth2.getAuthInstance().isSignedIn.listen(getProjects);
        // get
        getUsers(gapi.auth2.getAuthInstance().isSignedIn.get());
        getLanguage(gapi.auth2.getAuthInstance().isSignedIn.get());
        getProjects(gapi.auth2.getAuthInstance().isSignedIn.get());databaseMain
    });
}

/* load library --------------------------------------------- */
function loadLibrary() {
    gapi.load("client:auth2", initialSetup);
}

/* get cookie ----------------------------------------------- */
function getCookie(parameter) {
    // names
    var names = "; " + document.cookie;
    // split
    var split = names.split("; " + parameter + "=");
    // conditional
    if (split.length == 2) {
        return split.pop().split(";").shift()
    };
}

/* get users ------------------------------------------------ */
function getUsers() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: databaseMain,
        range: "users!A2:Z",
    }).then(function(response) {
        // result
        var range = response.result;
        // keys
        var keys = Object.keys(range.values).length;
        // set item
        sessionStorage.setItem("userLength", keys);
        sessionStorage.setItem("userValues", range.values);
    });
}

/* get language --------------------------------------------- */
function getLanguage() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: databaseMain,
        range: "language!B2:Z",
    }).then(function(response) {
        // result
        var range = response.result;
        // keys
        var keys = Object.keys(range.values).length;
        // set item
        sessionStorage.setItem("languageLength", keys);
        sessionStorage.setItem("languageValues", range.values);
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

/* get projects --------------------------------------------- */
function getProjects() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: databaseMain,
        range: "projects!A2:Z",
    }).then(function(response) {
        // result
        var range = response.result;
        // keys
        var keys = Object.keys(range.values).length;
        // set item
        sessionStorage.setItem("projectsLength", keys);
        sessionStorage.setItem("projectsValues", range.values);
    });
}

/* set language --------------------------------------------- */
function setLanguage(parameter) {
    // identifier
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

/* push array ----------------------------------------------- */
function pushArray(parameter1, parameter2, parameter3, parameter4) {
    // get item
    var total = parameter1;
    var value = parameter2;
    // multidimensional array
    for (var a = 0; a <= total; a++) {
        parameter3.push([]);
    }
    // total columns
    var columns = parameter4;
    // split
    var split = value.split(",");
    // push into array
    for (var b = 0; b < total; b++) {
        for (var c = 0; c < columns; c++) {
            parameter3[b].push(split[b * columns + c]);
        }
    }
}

/* text ----------------------------------------------------- */
var text = new Array();
// get item
var textTotal  = sessionStorage.getItem("languageLength");
var textValue = sessionStorage.getItem("languageValues");
// total columns
var textColumns = 3;
// push into array
pushArray(textTotal, textValue, text, textColumns);

/* login ---------------------------------------------------- */
function login() {
    // array
    var login = new Array();
    // get item
    var loginTotal = sessionStorage.getItem("userLength");
    var loginValue = sessionStorage.getItem("userValues");
    // total columns
    var loginColumns = 9;
    // push into array
    pushArray(loginTotal, loginValue, login, loginColumns);
    // get element
    var email         = document.getElementById("input_email").value;
    var password      = document.getElementById("input_password").value;
    var modalUser     = document.getElementById("span_user");
    var modalPassword = document.getElementById("span_password");
    var modalLogin    = document.getElementById("button_login");
    // clear modal
    modalUser.className     = "d-none";
    modalPassword.className = "d-none";
    // search
    var search;    
    for (var a = 0; a < loginTotal; a++) {
        if (login[a].indexOf(email) > 0) {
            search    = a;
            auxiliary = login[search].length - 1;
            break;
        }
    }
    // conditional
    if (search == null) {
        // user not found
        modalUser.className = "d-block";
    } else if (login[search][auxiliary] != password) {
        // incorrect password
        modalPassword.className = "d-block";
    } else {
        // modal
        modalLogin.setAttribute("data-target", "");
        // set item
        sessionStorage.setItem("userProjects", login[search]);
        // username cookie
        document.cookie = "username=" + email + "; path=/";
        // redirect
        location.href = "../main";
    }
}

/* security ------------------------------------------------- */
function security() {
    // conditional
    if (username == null || text[0] == "") {
        location.href = "../";
    }
}

/* logout --------------------------------------------------- */
function logout() {
    // split
    var cookies = document.cookie.split(";");
    // delete cookies
    for (var i = 0; i < cookies.length; i++) {
        var value    = cookies[i];
        var position = value.indexOf("=");
        var name     = position > -1 ? value.substr(0, position) : value;
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    // redirect
    location.href = "../";
}

/* validation ----------------------------------------------- */
function validation(parameter) {
    // identifier
    var identifier = parameter.id;
    // get element
    var element = document.getElementById(identifier);
    // get item
    var projectValue = sessionStorage.getItem("userProjects");
    // split
    var split = projectValue.split(",");
    // conditional
    if (split[element.value] == "TRUE") {
        // modal
        element.setAttribute("data-target", "");
        // redirect
        location.href = "maps";
    }
}