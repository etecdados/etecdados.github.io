/*
 * https://etecdados.github.io
 * etecdados v1.0.0
 * copyright 2019 by etecdados
 * created on 2013/06/24 12:10
 * author fernando silva
 * last update on 2019/07/25
 */

/* variables ------------------------------------------------ */
var range;

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
        range = response.result;
        //document.getElementById("input_email").value = range.values[0][1];
        //document.getElementById("input_password").value = range.values[0][2];
    });
}

/* get language --------------------------------------------- */
function getLanguage() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: database_main,
        range: "language!A2:Z",
    }).then(function(response) {
        // result
        range = response.result;
        // check cookie language
        var key;
        if (getCookie("language") == null) {
            key = 1;
        } else {
            key = getCookie("language");
        }
        // bilble link
        switch(key) {
            case "2":
                document.getElementById("text0004").href = "https://www.bible.com/es/bible/128/JHN.3.16.NVI";
                break;
            case "3":
                document.getElementById("text0004").href = "https://www.bible.com/bible/111/JHN.3.16.NIV";
                break;
            default:
                document.getElementById("text0004").href = "https://www.bible.com/pt/bible/129/JHN.3.16.NVI";
        }
        // text language
        document.getElementById("text0001").innerHTML = range.values[0][key];
        document.getElementById("text0002").innerHTML = range.values[1][key];
        document.getElementById("text0003").innerHTML = range.values[2][key];
        document.getElementById("text0004").innerHTML = range.values[3][key];
        document.getElementById("text0005").innerHTML = range.values[4][key];
        document.getElementById("text0006").innerHTML = range.values[5][key];
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
        case "2":
            document.cookie = "language=" + element;
            location.reload();
            break;
        case "3":
            document.cookie = "language=" + element;
            location.reload();
            break;
        default:
            document.cookie = "language=1";
            location.reload();
    }
}

/* login ---------------------------------------------------- */
function login() {
    // get email and password
    var email    = document.getElementById("input_email").value;
    var password = document.getElementById("input_password").value;
    // users length
    var users = Object.keys(range.values).length;
    // temporary array
    var temporary = new Array();
    // push
    for (var i = 0; i < users; i++) {
        temporary.push(range.values[i]);
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
    // validate
    if (search == null) {
        alert(search);
        alert("Usuário não cadastrado");
    } else if (temporary[search][auxiliary] != password) {
        alert("Senha não confere");
    } else {
        location.href = "../elecnor";
    }
}