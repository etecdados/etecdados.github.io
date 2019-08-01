/*
 * https://etecdados.github.io
 * etecdados v1.0.0
 * copyright 2019 by etecdados
 * created on 2013/06/24 12:10
 * author fernando silva
 * last update on 2019/07/25
 */

/* google api ----------------------------------------------- */
var apikey_gsheet   = "AIzaSyBke8vUjVil_hL3-G9OJWWsVYJgn1ZdCRY";
var apikey_maps     = "";
var client_id       = "345990898270-gh1f4t9pe4lhgcmgfnubojanrqnsmhs5.apps.googleusercontent.com";
var database_main   = "1ZcP8Rax-xRtegYTHQ_1BJjtOQmnQT8kMQb7Bi9Guls4";
var discovery_docs  = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var request_scope   = "https://www.googleapis.com/auth/spreadsheets.readonly";

/* get users ------------------------------------------------ */
function getUsers() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: database_main,
        range: "users!A2:Z",
    }).then(function(response) {
        // result
        var range = response.result;
        document.getElementById("input_email").value = range.values[0][1];
        document.getElementById("input_password").value = range.values[0][2];
    });
}

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
        // get
        getUsers(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

/* load library --------------------------------------------- */
function loadLibrary() {
    gapi.load("client:auth2", initialSetup);
}

/* set language --------------------------------------------- */
function setLanguage(element) {
    // get id
    var getId = element.id;
    // get value
    var value = document.getElementById(getId).value;
    // switch
    switch(value) {
        case "1":
            document.cookie = "language=" + value;
            location.reload();
            break;
        case "2":
            document.cookie = "language=" + value;
            location.reload();
            break;
        case "3":
            document.cookie = "language=" + value;
            location.reload();
            break;
        default:
            document.cookie = "language=1";
    }
}