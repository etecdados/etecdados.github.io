/*
 * https://etecdados.github.io
 * etecdados v1.0.0
 * copyright 2019 by etecdados
 * created on 2013/06/24 12:10
 * author fernando silva
 * last update on 2019/07/25
 */

/* google set ----------------------------------------------- */
var apiKeySheets  = "AIzaSyCUHNFWOyP2Y25UKw1swqVQCS2MTaFIpok";
var apiKeyMaps    = "AIzaSyAIFODSjhKFZBXo_bh_LjYGGANHmsGu0UQ";
var accessKey     = "1dZe1ctuPzVp887vb7ttc8zbAdDQew_w761hqemr7O04";
var clientKey     = "535886128905-4aenaehdlshf0v2f9ehvomk0f4kej16l.apps.googleusercontent.com";
var databaseKey   = "1ZcP8Rax-xRtegYTHQ_1BJjtOQmnQT8kMQb7Bi9Guls4";
var discoveryDocs = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var scopeReadonly = "https://www.googleapis.com/auth/spreadsheets.readonly";

/* cookies -------------------------------------------------- */
var language = getCookie("language") ? getCookie("language") : 0;
var map      = getCookie("map")      ? getCookie("map")      : null;
var mapLink  = getCookie("mapLink")  ? getCookie("mapLink")  : null;
var username = getCookie("username") ? getCookie("username") : null;

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

/* initial setup -------------------------------------------- */
function initialSetup() {
    gapi.load("client:auth2", function() {
        gapi.client.init({
            apiKey: apiKeySheets,
            clientId: clientKey,
            discoveryDocs: discoveryDocs,
            scope: scopeReadonly,
        }).then(function() {
            // listen
            gapi.auth2.getAuthInstance().isSignedIn.listen(getAccess);
            gapi.auth2.getAuthInstance().isSignedIn.listen(getData);
            // get
            getAccess(gapi.auth2.getAuthInstance().isSignedIn.get());
            getData(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    });
}

/* access setup --------------------------------------------- */
function accessSetup() {
    gapi.load("client:auth2", function() {
        gapi.client.init({
            apiKey: apiKeySheets,
            clientId: clientKey,
            discoveryDocs: discoveryDocs,
            scope: scopeReadonly,
        }).then(function() {
            // listen
            gapi.auth2.getAuthInstance().isSignedIn.listen(getAccess);
            gapi.auth2.getAuthInstance().isSignedIn.listen(getMap);
            // get
            getAccess(gapi.auth2.getAuthInstance().isSignedIn.get());
            getMap(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    });
    // conditional
    if (username == null || text[0] == "") {
        location.href = "../";
    }
}

/* get access ----------------------------------------------- */
function getAccess() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: accessKey,
        range: "access!A2:B2",
    }).then(function(response) {
        // result
        var ranges = response.result;
        // conditional
        if (ranges.values[0][1] == "TRUE") {
            logout();
            // redirect
            location.href = "../info";
        }
    });
}

/* get data ------------------------------------------------- */
function getData() {
    // variables
    var ranges;
    var keys;
    // users
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: databaseKey,
        range: "users!A2:Z",
    }).then(function(response) {
        // result
        ranges = response.result;
        // keys
        keys = Object.keys(ranges.values).length;
        // set item
        sessionStorage.setItem("userLength", keys);
        sessionStorage.setItem("userValues", ranges.values);
    });
    // language
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: databaseKey,
        range: "language!B2:Z",
    }).then(function(response) {
        // result
        ranges = response.result;
        // keys
        keys = Object.keys(ranges.values).length;
        // set item
        sessionStorage.setItem("languageLength", keys);
        sessionStorage.setItem("languageValues", ranges.values);
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
    // projects
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: databaseKey,
        range: "projects!A2:Z",
    }).then(function(response) {
        // result
        ranges = response.result;
        // keys
        keys = Object.keys(ranges.values).length;
        // set item
        sessionStorage.setItem("projectsLength", keys);
        sessionStorage.setItem("projectsValues", ranges.values);
    });
}

/* get map -------------------------------------------------- */
function getMap() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: mapLink,
        range: "database!A2:Z"
        }).then(function(response) {
            // result
            var ranges = response.result;
            // keys
            var keys = Object.keys(ranges.values).length;
            // set item
            sessionStorage.setItem("mapLength", keys);
            sessionStorage.setItem("mapValues", ranges.values);
        });
}

/* set language --------------------------------------------- */
function setLanguage(parameter) {
    // get element
    var element = document.getElementById(parameter.id).value;
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
    // multidimensional array
    for (var a = 0; a <= total; a++) {
        parameter2.push([]);
    }
    // total columns
    var columns = parameter3;
    // split
    var split = parameter4.split(",");
    // push into array
    for (var b = 0; b < total; b++) {
        for (var c = 0; c < columns; c++) {
            parameter2[b].push(split[b * columns + c]);
        }
    }
}

/* text ----------------------------------------------------- */
var text = new Array();
// get item
var textTotal = sessionStorage.getItem("languageLength");
var textValue = sessionStorage.getItem("languageValues");
// total columns
var textColumns = 3;
// push into array
pushArray(textTotal, text, textColumns, textValue);

/* check text ----------------------------------------------- */
function checkText() {
    if (text[0] == "") {
        document.getElementById("div_login").className = "d-none";
        document.cookie = "reload=0";
    } else {
        document.getElementById("div_spinner").className = "d-none";
        document.cookie = "reload=1";
    }
}

/* reload --------------------------------------------------- */
function reloadPage() {
    if (getCookie("reload") == 0) {
        setTimeout(function(){
            window.location.reload();
        }, 3000);
    }
}

/* projects ------------------------------------------------- */
var projects = new Array();
// get item
var projectsTotal = sessionStorage.getItem("projectsLength");
var projectsValue = sessionStorage.getItem("projectsValues");
// total columns
var projectsColumns = 5;
// push into array
pushArray(projectsTotal, projects, projectsColumns, projectsValue);

/* data ----------------------------------------------------- */
var data = new Array();
// get item
var dataTotal = sessionStorage.getItem("mapLength");
var dataValue = sessionStorage.getItem("mapValues");
// total columns
var dataColumns = 14;
// push into array
pushArray(dataTotal, data, dataColumns, dataValue);

/* check data ----------------------------------------------- */
function checkData() {
    // get element
    var element = document.getElementById("div_map");
    // change class
    element.className = "d-none";
    // conditional
    if (data[0][0] == null || getCookie("reload") == 0) {
        // reload cookie
        document.cookie = "reload=1";
        // reload
        setTimeout(function(){
            window.location.reload();
        }, 1500);
    } else {
        // change class
        element.className = "d-block";
        document.getElementById("div_spinner").className = "d-none";
        // create script
        var script = document.createElement("script");
        script.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=" + apiKeyMaps + "&callback=googleMaps");
        element.appendChild(script);
        // reload cookie
        document.cookie = "reload=0";
    }
}

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
    pushArray(loginTotal, login, loginColumns, loginValue);
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

/* logout --------------------------------------------------- */
function logout() {
    // split
    var cookies = document.cookie.split(";");
    // delete cookies
    for (var a = 0; a < cookies.length; a++) {
        var value    = cookies[a];
        var position = value.indexOf("=");
        var name     = position > -1 ? value.substr(0, position) : value;
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    // redirect
    location.href = "../";
}

/* set map -------------------------------------------------- */
function setMap(parameter) {
    // element
    var element = parameter.id;
    // replace
    var position = element.replace("map", "");
    // map and link cookie
    document.cookie = "map=" + position + "; path=/";
    document.cookie = "mapLink=" + projects[position][4] + "; path=/";
}

/* validation ----------------------------------------------- */
function validation(parameter) {
    // get element
    var element = document.getElementById(parameter.id);
    var dialog  = document.getElementById("div_modalDialog");
    var content = document.getElementById("div_modalMap");
    // clear content
    content.innerHTML = "";
    // modal (jQuery)
    var notice = $(".modal_access");
    var list   = $(".modal_map");
    // split
    var split = sessionStorage.getItem("userProjects").split(",");
    // conditional
    if (split[element.value] == "TRUE") {
        // check map
        var position;
        var total = new Array();
        // push into array
        for (var a = 0; a < projects.length; a++) {
            total.push(projects[a][0]);
            // position
            if (total[a] == element.value && position == null) {
                position = a;
            }
        }
        // occurrences
        var occurrences = total.filter(function(count){return count === element.value;}).length;
        // conditional
        if (occurrences > 1) {
            // modal
            notice.css("display", "none");
            list.css("display", "block");
            dialog.setAttribute("class", "modal-dialog");
            // create links
            for (var b = 0; b < projects.length - 1; b++) {
                // create element
                var link = document.createElement("a");
                // set attributes
                if (total[b] == element.value) {
                    link.setAttribute("class", "text-decoration-none list-group-item list-group-item-action");
                } else {
                    link.setAttribute("class", "text-decoration-none list-group-item list-group-item-action d-none");
                }
                link.setAttribute("href", "map");
                link.setAttribute("id", "map" + b);
                link.setAttribute("onclick", "setMap(this)");
                link.innerHTML = projects[b][2];
                content.appendChild(link);    
            }
        } else {
            // modal
            element.setAttribute("data-target", "");
            // map and link  cookie
            document.cookie = "map=" + position + "; path=/";
            document.cookie = "mapLink=" + projects[position][4] + "; path=/";
            // redirect
            location.href = "map";
        }
    } else {
        // modal
        notice.css("display", "block");
        list.css("display", "none");
        dialog.setAttribute("class", "modal-dialog modal-sm");
    }
}

/* google maps ---------------------------------------------- */
function googleMaps() {
    // properties
    var googleMaps = new google.maps.Map(document.getElementById('div_map'), {
        center: {lat: -3.717963, lng: -40.989187},
        zoom: 13
    });
}