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
var clientKey     = "535886128905-4aenaehdlshf0v2f9ehvomk0f4kej16l.apps.googleusercontent.com";
var databaseKey   = "1ZcP8Rax-xRtegYTHQ_1BJjtOQmnQT8kMQb7Bi9Guls4";
var discoveryDocs = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var scopeReadonly = "https://www.googleapis.com/auth/spreadsheets.readonly";

/* cookies -------------------------------------------------- */
var language = getCookie("language") ? getCookie("language") : 1;
var link     = getCookie("link")     ? getCookie("link")     : null;
var position = getCookie("position") ? getCookie("position") : null;
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
            gapi.auth2.getAuthInstance().isSignedIn.listen(getDatabase);
            // get
            getAccess(gapi.auth2.getAuthInstance().isSignedIn.get());
            getDatabase(gapi.auth2.getAuthInstance().isSignedIn.get());
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
            gapi.auth2.getAuthInstance().isSignedIn.listen(getProject);
            // get
            getAccess(gapi.auth2.getAuthInstance().isSignedIn.get());
            getProject(gapi.auth2.getAuthInstance().isSignedIn.get());
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
        spreadsheetId: "1dZe1ctuPzVp887vb7ttc8zbAdDQew_w761hqemr7O04",
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

/* get database --------------------------------------------- */
function getDatabase() {
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
    // language
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: databaseKey,
        range: "language!A2:Z",
    }).then(function(response) {
        // result
        ranges = response.result;
        // keys
        keys = Object.keys(ranges.values).length;
        // set item
        sessionStorage.setItem("languageLength", keys);
        sessionStorage.setItem("languageValues", ranges.values);
        // bilble
        switch(language) {
            case "2":
                document.getElementById("a_bible").href = "https://www.bible.com/es/bible/128/JHN.3.16.NVI";
                break;
            case "3":
                document.getElementById("a_bible").href = "https://www.bible.com/bible/111/JHN.3.16.NIV";
                break;
            default:
                document.getElementById("a_bible").href = "https://www.bible.com/pt/bible/129/JHN.3.16.NVI";
        }
    });
}

/* get project ---------------------------------------------- */
function getProject() {
    // database
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: link,
        range: "data!A3:Z"
        }).then(function(response) {
            // result
            var ranges = response.result;
            // keys
            var keys = Object.keys(ranges.values).length;
            // set item
            sessionStorage.setItem("dataLength", keys);
            sessionStorage.setItem("dataValues", ranges.values);
        });
    // activity
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: link,
        range: "activity!A4:Z"
        }).then(function(response) {
            // result
            var ranges = response.result;
            // keys
            var keys = Object.keys(ranges.values).length;
            // set item
            sessionStorage.setItem("activityLength", keys);
            sessionStorage.setItem("activityValues", ranges.values);
        });
    // site
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: link,
        range: "site!A4:Z"
        }).then(function(response) {
            // result
            var ranges = response.result;
            // keys
            var keys = Object.keys(ranges.values).length;
            // set item
            sessionStorage.setItem("siteLength", keys);
            sessionStorage.setItem("siteValues", ranges.values);
        });
    // alert
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: link,
        range: "alert!A3:Z"
        }).then(function(response) {
            // result
            var ranges = response.result;
            // keys
            var keys = Object.keys(ranges.values).length;
            // set item
            sessionStorage.setItem("alertLength", keys);
            sessionStorage.setItem("alertValues", ranges.values);
        });
}

/* set language --------------------------------------------- */
function setLanguage(parameter) {
    // get element
    var element = document.getElementById(parameter.id).value;
    // switch
    switch(element) {
        case "2":
            document.cookie = "language=" + element + "; path=/";
            location.reload();
            break;
        case "3":
            document.cookie = "language=" + element + "; path=/";
            location.reload();
            break;
        default:
            document.cookie = "language=1; path=/";
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
var textColumns = 4;
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
var dataTotal = sessionStorage.getItem("dataLength");
var dataValue = sessionStorage.getItem("dataValues");
// total columns
var dataColumns = 20;
// push into array
pushArray(dataTotal, data, dataColumns, dataValue);

/* activity ------------------------------------------------- */
var activity = new Array();
// get item
var activityTotal = sessionStorage.getItem("activityLength");
var activityValue = sessionStorage.getItem("activityValues");
// total columns
var activityColumns = 9;
// push into array
pushArray(activityTotal, activity, activityColumns, activityValue);

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
            break;
        }
    }
    // conditional
    if (search == null) {
        // user not found
        modalUser.className = "d-block";
    } else if (login[search][loginColumns - 1] != password) {
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
        var index = value.indexOf("=");
        var name     = index > -1 ? value.substr(0, index) : value;
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
    var index = element.replace("map", "");
    // position and link cookie
    document.cookie = "position=" + index + "; path=/";
    document.cookie = "link=" + projects[index][4] + "; path=/";
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
        var index;
        var total = new Array();
        // push into array
        for (var a = 0; a < projects.length; a++) {
            total.push(projects[a][0]);
            // index
            if (total[a] == element.value && index == null) {
                index = a;
            }
        }
        // occurrences
        var occurrences = total.filter(function(count){
            return count === element.value;
        }).length;
        // conditional
        if (occurrences > 1) {
            // modal
            notice.css("display", "none");
            list.css("display", "block");
            dialog.setAttribute("class", "modal-dialog");
            // projects list
            for (var b = 0; b < projects.length - 1; b++) {
                // hyperlink
                var hyperlink = document.createElement("a");
                // set attributes
                if (total[b] == element.value) {
                    hyperlink.setAttribute("class", "text-decoration-none list-group-item list-group-item-action");
                } else {
                    hyperlink.setAttribute("class", "text-decoration-none list-group-item list-group-item-action d-none");
                }
                hyperlink.setAttribute("href", "map");
                hyperlink.setAttribute("id", "map" + b);
                hyperlink.setAttribute("onclick", "setMap(this)");
                hyperlink.innerHTML = projects[b][2];
                content.appendChild(hyperlink);    
            }
        } else {
            // modal
            element.setAttribute("data-target", "");
            // position and link cookie
            document.cookie = "position=" + index + "; path=/";
            document.cookie = "link=" + projects[index][4] + "; path=/";
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

/* open sidebar --------------------------------------------- */
function openSidebar() {
    document.getElementById("div_sidebar").style.width = "233px";
    // collapse navbar (jQuery)
    $(".collapse").collapse("hide");
}
  
/* close sidebar -------------------------------------------- */
function closeSidebar() {
    document.getElementById("div_sidebar").style.width = "0";
}

/* colors --------------------------------------------------- */
var colors = [
    /*0*/ "#96989A", // gray
    /*1*/ "#FF0000", // red
    /*2*/ "#00FF00", // green
    /*3*/ "#0000FF", // blue
    /*4*/ "#FFFF00", // yellow
    /*5*/ "#FFFFFF", // white
    /*6*/ "#9900CC", // purple
    /*7*/ "#00FFFF", // cyan
    /*8*/ "#FF6600", // orange
    /*9*/ "#000000", // black
    /*10*/"#F48884"  // pink
];

/* marker color --------------------------------------------- */
var markerColor = [
    /*0*/ "../root/images/marker_gray.png",
    /*1*/ "../root/images/marker_red.png",
    /*2*/ "../root/images/marker_green.png",
    /*3*/ "../root/images/marker_blue.png",
    /*4*/ "../root/images/marker_yellow.png",
    /*5*/ "../root/images/marker_white.png",
    /*6*/ "../root/images/marker_purple.png",
    /*7*/ "../root/images/marker_cyan.png",
    /*8*/ "../root/images/marker_orange.png",
    /*9*/ "../root/images/marker_black.png",
    /*10*/"../root/images/marker_pink.png",
];

/* alert color----------------------------------------------- */
var alertColor = [
    /*0*/ "../root/images/alert_transparent.png",
    /*1*/ "../root/images/alert_red.png",
    /*2*/ "../root/images/alert_green.png",
    /*3*/ "../root/images/alert_blue.png",
    /*4*/ "../root/images/alert_yellow.png",
    /*5*/ "../root/images/alert_white.png"
];

/* check data ----------------------------------------------- */
function checkData() {
    // get element
    var element = document.getElementById("div_map");
    // conditional
    if (data[0][0] == null || getCookie("reload") == 0) {
        // reload cookie
        document.cookie = "reload=1";
        // change class
        element.className = "d-none";
        // reload page
        setTimeout(function(){
            window.location.reload();
        }, 1500);
    } else {
        // reload cookie
        document.cookie = "reload=0";
        // change class
        document.getElementById("div_spinner").className = "d-none";
        element.className = "d-block";
        // create script
        var script = document.createElement("script");
        script.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=" + apiKeyMaps + "&callback=googleMaps");
        element.appendChild(script);
        // section
        var section = new Array();
        // push
        for (var a = 1; a < data.length - 1; a++) {
            section.push(data[a][5]);
        }
        // filter
        var filter = Array.from(new Set(section));
        // get element
        var legend = document.getElementById("div_towers");
        // create element
        var tagDiv = document.createElement("div");
        var tagUl  = document.createElement("ul");
        // set attribute
        tagDiv.setAttribute("class", "bg-primary text-white text-center p-1 mb-1");
        tagUl.setAttribute("class", "ul_legend p-1");
        // inner html
        tagDiv.innerHTML = text[22][language].toUpperCase();
        // append child
        legend.appendChild(tagDiv);
        legend.appendChild(tagUl);
        // list
        for (var b = 0; b < filter.length; b++) {
            // create element
            var tagLi   = document.createElement("li");
            var tagImg  = document.createElement("img");
            var tagSpan = document.createElement("span");
            // set attribute
            tagImg.setAttribute("src", markerColor[b + 1]);
            tagImg.setAttribute("alt", "marker");
            tagImg.setAttribute("height", "13px");
            tagImg.setAttribute("class", "mr-2 mb-1");
            // inner html
            tagSpan.innerHTML = text[32][language].toUpperCase() + " " + filter[b];
            // append child
            tagUl.appendChild(tagLi);
            tagLi.appendChild(tagImg);
            tagLi.appendChild(tagSpan);
        }
        // show controls (jQuery)
        setTimeout(function(){
            $('#div_controls').show();
         }, 2000);
    }
}

/* google maps ---------------------------------------------- */
function googleMaps() {
    // map
    var map;
    // central map
    var central = Math.round(data.length / 2);
    // properties
    var properties = {
        center: new google.maps.LatLng(data[central][6], data[central][7]),
        fullscreenControl: true,
        fullscreenControlOptions: {position: google.maps.ControlPosition.RIGHT_BOTTOM},
        mapTypeControl: false,
        mapTypeId: "roadmap", // hybrid
        streetViewControl: false,
        zoom: 13
    };
    // new map
    map = new google.maps.Map(document.getElementById("div_map"), properties);
    // menu
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById("div_menu"));
    // date
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(document.getElementById("div_date"));
    // legend
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById("div_legend"));
}