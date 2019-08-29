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
var apiKeyDrive   = "AIzaSyDCkCbZhcCrB6hMeg6gIKYz_CAEQmd0--c";
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
            // get
            gapi.auth2.getAuthInstance().isSignedIn.get(getAccess());
            gapi.auth2.getAuthInstance().isSignedIn.get(getDatabase());
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
            // get
            gapi.auth2.getAuthInstance().isSignedIn.get(getAccess());
            gapi.auth2.getAuthInstance().isSignedIn.get(getProject());
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
    var keys;
    var ranges;
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
    // variables
    var keys;
    var ranges;
    // data
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: link,
        range: "data!A4:Z"
        }).then(function(response) {
            // result
            ranges = response.result;
            // keys
            keys = Object.keys(ranges.values).length;
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
            ranges = response.result;
            // keys
            keys = Object.keys(ranges.values).length;
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
            ranges = response.result;
            // keys
            keys = Object.keys(ranges.values).length;
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
            ranges = response.result;
            // keys
            keys = Object.keys(ranges.values).length;
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
    for (var a = 0; a < total; a++) {
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
var activityColumns = 10;
// push into array
pushArray(activityTotal, activity, activityColumns, activityValue);

/* site ----------------------------------------------------- */
var site = new Array();
// get item
var siteTotal = sessionStorage.getItem("siteLength");
var siteValue = sessionStorage.getItem("siteValues");
// total columns
var siteColumns = 4;
// push into array
pushArray(siteTotal, site, siteColumns, siteValue);

/* alert ---------------------------------------------------- */
var alertText = new Array();
// get item
var alertTextTotal = sessionStorage.getItem("alertLength");
var alertTextValue = sessionStorage.getItem("alertValues");
// total columns
var alertTextColumns = 3;
// push into array
pushArray(alertTextTotal, alertText, alertTextColumns, alertTextValue);

/* check text ----------------------------------------------- */
function checkText() {
    if (text[0] == null) {
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
    /*0*/ "#FF0000", // red
    /*1*/ "#0000FF", // blue
    /*2*/ "#00FF00", // green
    /*3*/ "#FFFF00", // yellow
    /*4*/ "#9900CC", // purple
    /*5*/ "#00FFFF", // cyan
    /*6*/ "#FF6600", // orange
    /*7*/ "#000000", // black
    /*8*/ "#F48884", // pink
    /*9*/ "#FFFFFF", // white
    /*10*/"#96989A"  // gray
];

/* marker color --------------------------------------------- */
var markerColor = [
    /*0*/ "../root/images/marker_red.png",
    /*1*/ "../root/images/marker_blue.png",
    /*2*/ "../root/images/marker_green.png",
    /*3*/ "../root/images/marker_yellow.png",
    /*4*/ "../root/images/marker_purple.png",
    /*5*/ "../root/images/marker_cyan.png",
    /*6*/ "../root/images/marker_orange.png",
    /*7*/ "../root/images/marker_black.png",
    /*8*/ "../root/images/marker_pink.png",
    /*9*/ "../root/images/marker_white.png",
    /*10*/"../root/images/marker_gray.png"
];

/* alert color----------------------------------------------- */
var alertColor = [
    /*0*/ "../root/images/alert_red.png",
    /*1*/ "../root/images/alert_blue.png",
    /*2*/ "../root/images/alert_green.png",
    /*3*/ "../root/images/alert_yellow.png",
    /*4*/ "../root/images/alert_white.png",
    /*5*/ "../root/images/alert_transparent.png"
];

/* check data ----------------------------------------------- */
function checkData() {
    // get element
    var element = document.getElementById("div_map");
    // conditional
    if (data[0] == null || getCookie("reload") == 0) {
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
        // summary
        for (var c = 0; c < activity.length; c++) {
            // create element
            var tagTr = document.createElement("tr");
            // append child
            document.getElementById("tbody_summary").appendChild(tagTr);
            // conditional
            if (activity[c][2] == "") {
                tagTr.setAttribute("class", "bg-primary text-white");
            }
            // td
            for (var d = 0; d < activity[c].length; d++) {
                // conditional
                if (d < 7 && activity[c][1] != "") {
                    // create element
                    var tagTd = document.createElement("td");
                    // inner html
                    tagTd.innerHTML = activity[c][d];
                    // append child
                    tagTr.appendChild(tagTd);
                    // conditional
                    if (d == 0 || d == 1) {
                        tagTd.setAttribute("class", "text-left");
                    }
                }
            }
        }
        // show controls (jQuery)
        setTimeout(function(){
            $('#div_controls').show();
        }, 2000);
    }
}

/* legend --------------------------------------------------- */
function legend(parameter) {
    // variable
    var auxiliary;
    var filter;
    var title;
    var total = new Array();
    // get element
    var element = document.getElementById("div_list");
    // conditional
    if (parameter == 0) {
        // push
        for (var a = 0; a < data.length; a++) {
            total.push(data[a][5]);
        }
        // filter (section)
        filter = Array.from(new Set(total));
    } else {
        // check parameter
        for (var b = 0; b < activity.length; b++) {
            // conditional
            if (parameter == parseInt(activity[b][0])) {
                // filter (activity)
                filter    = new Array(8);
                auxiliary = b + 1;
                break;
            }
        }
    }
    // create element
    var tagDiv = document.createElement("div");
    var tagUl  = document.createElement("ul");
    // set attribute
    tagDiv.setAttribute("class", "bg-primary text-white text-center p-1 mt-1");
    tagUl.setAttribute("class", "ul_legend p-1");
    // switch
    switch(parameter) {
        case 1:
            title = text[26][language];
            break;
        case 2:
            title = text[27][language];
            break;
        case 3:
            title = text[28][language];
            break;
        case 4:
            title = text[29][language];
            break;
        default:
            title = text[22][language];
    }
    // inner html
    tagDiv.innerHTML = title.toUpperCase();
    // append child
    element.appendChild(tagDiv);
    element.appendChild(tagUl);
    // list
    for (var c = 0; c < filter.length; c++) {
        // create element
        var tagLi   = document.createElement("li");
        var tagImg  = document.createElement("img");
        var tagSpan = document.createElement("span");
        // set attribute
        tagImg.setAttribute("src", markerColor[c]);
        tagImg.setAttribute("alt", "marker");
        tagImg.setAttribute("height", "13px");
        tagImg.setAttribute("class", "mr-2 mb-1");
        // conditional
        if (parameter == 0) {
            // inner html
            tagSpan.innerHTML = filter[c];    
        } else {
            // description
            var description = activity[c + auxiliary][1];
            // conditional
            if (description == "") {
                // set attribute
                tagImg.setAttribute("class", "d-none");
            } else {
                // inner html
                tagSpan.innerHTML = description;
            }
        }
        // append child
        tagUl.appendChild(tagLi);
        tagLi.appendChild(tagImg);
        tagLi.appendChild(tagSpan);
    }
}

/* gallery -------------------------------------------------- */
function gallery(parameter) {
    // get element
    var element = parameter.id;
    var content = document.getElementById("div_inner");
    var ol      = document.getElementById("ol_indicators");
    // clear content
    content.innerHTML = "";
    ol.innerHTML = "";
    // remove
    var remove = [
        'id:',
        'https://drive.google.com/drive/folders/',
        'https://drive.google.com/open?id=',
        '?usp=sharing'
    ]
    // include
    var include = [
        'https://drive.google.com/uc?export=view&id=',
        'https://drive.google.com/file/d/',
        '/preview'
    ]
    // replace
    for (var a = 0; a < remove.length; a++) {
        element = element.replace(remove[a], "");
    }
    // url
    var url = "https://www.googleapis.com/drive/v3/files?q='" + element + "'+in+parents&key=" + apiKeyDrive;
    // request
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.send();
    request.onreadystatechange = function() {
        // conditional
        if (request.readyState == XMLHttpRequest.DONE) {
            // replace
            var result = request.response.replace(/\n|"|{|}| /g, '');
            // split
            var values = result.split(",");
            // new array
            var idFile   = new Array();
            var mimeType = new Array();
            // search and push
            for (var b = 0; b < values.length; b++) {
                // conditional
                if (values[b].search(remove[0]) >= 0) {
                    // push
                    idFile.push(values[b].replace(remove[0], ""));
                } else if (values[b].search("mimeType:") >= 0) {
                    // conditional
                    if (values[b].search("image") >= 0) {
                        mimeType.push(true);
                    } else {
                        mimeType.push(false);
                    }
                }
            }
            // carousel content
            for (var c = 0; c < idFile.length; c++) {
                // create element
                var li     = document.createElement("li");
                var span   = document.createElement("span");
                var div    = document.createElement("div");
                var img    = document.createElement("img");
                var iframe = document.createElement("iframe");
                // conditional
                if (c == 0) {
                    // set attribute
                    li.setAttribute("class", "active");
                    div.setAttribute("class", "carousel-item active");
                } else {
                    div.setAttribute("class", "carousel-item");
                }
                // set attribute
                li.setAttribute("data-target", "#div_carousel");
                li.setAttribute("data-slide-to", c);
                span.setAttribute("class", "text-primary");
                img.setAttribute("class", "d-block m-auto");
                // inner html
                span.innerHTML =  c + 1;
                // append child
                ol.appendChild(li);
                li.appendChild(span);
                content.appendChild(div);
                // conditional
                if (mimeType[c] == true) {
                    // set attribute
                    img.setAttribute("src", include[0] + idFile[c]);
                    // append child
                    div.appendChild(img);
                } else {
                    // set attribute
                    iframe.setAttribute("src", include[1] + idFile[c] + include[2]);
                    // append child
                    div.appendChild(iframe);
                }
            }
        }
    }
}

/* google maps ---------------------------------------------- */
function googleMaps() {
    // variables
    var auxiliary = 0;
    var display;
    var hidden;
    var icon;
    var map;
    var optimized;
    var pointX    = new google.maps.Point(0, 0);
    var pointY    = new google.maps.Point(16.5, 5.5);
    var position;
    var size      = new google.maps.Size(50, 50);
    // sheet
    var tower       = 1;
    var type        = 1 + tower;
    var height      = 1 + type;
    var span        = 1 + height;
    var section     = 1 + span;
    var latitude    = 1 + section;
    var longitude   = 1 + latitude;
    var activities  = 4 + longitude;
    var description = 5 + activities;
    var link        = 2 + description;
    // central map
    var central = Math.round(data.length / 2);
    // properties
    var properties = {
        center: new google.maps.LatLng(data[central][latitude], data[central][longitude]),
        fullscreenControl: true,
        fullscreenControlOptions: {position: google.maps.ControlPosition.RIGHT_BOTTOM},
        mapTypeControl: false,
        mapTypeId: "hybrid", // roadmap
        streetViewControl: false,
        zoom: 13
    };
    // info window
    var info = new google.maps.InfoWindow();
    // new map
    map = new google.maps.Map(document.getElementById("div_map"), properties);
    // menu
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById("div_menu"));
    // date
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(document.getElementById("div_date"));
    // legend
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById("div_legend"));
    // path
    var path1 = new Array();
    var path2 = new Array();
    var path3 = new Array();
    // coordinates
    for (var a = 0; a < data.length; a++) {
        path1.push(new google.maps.LatLng(parseFloat(data[a][latitude + 0]), parseFloat(data[a][longitude + 0])));
        path2.push(new google.maps.LatLng(parseFloat(data[a][latitude + 2]), parseFloat(data[a][longitude + 2])));
        path3.push(new google.maps.LatLng(parseFloat(data[a][latitude + 4]), parseFloat(data[a][longitude + 4])));
    }
    // polyline
    function polyline(parameter) {
        new google.maps.Polyline({
            geodesic: true,
            map: map,
            path: parameter,
            strokeColor: '#FFC107',
            strokeOpacity: 0.8,
            strokeWeight: 1.0
        });
    }
    // set polyline
    polyline(path1);
    polyline(path2);
    polyline(path3);
    // markers
    function markers(parameter) {
        // coordinates
        var coordinates = new google.maps.LatLng(data[auxiliary][latitude], data[auxiliary][longitude]);
        // position
        if (parameter == 0) {
            // variables
            var total = new Array();
            // push
            for (var a = 0; a < data.length; a++) {
                total.push(data[a][section]);
            }
            // filter
            var filter = Array.from(new Set(total));
            // check
            for (var b = 0; b < filter.length; b++) {
                // conditional
                if (filter[b] == data[auxiliary][section]) {
                    position = b;
                    break;
                }
            }
        } else {
            // activity
            for (var c = 0; c < activity.length; c++) {
                // conditional
                if (activity[c][1] == "") {
                    position = 10;
                    break;
                } else if (activity[c][1] == data[auxiliary][activities + parameter]) {
                    position = parseInt(activity[c][8]);
                    break;
                }
            }
        }
        // marker color
        switch(position) {
            case 0:
                icon = markerColor[0];
                break;
            case 1:
                icon = markerColor[1];
                break;
            case 2:
                icon = markerColor[2];
                break;
            case 3:
                icon = markerColor[3];
                break;
            case 4:
                icon = markerColor[4];
                break;
            case 5:
                icon = markerColor[5];
                break;
            case 6:
                icon = markerColor[6];
                break;
            case 7:
                icon = markerColor[7];
                break;
            case 8:
                icon = markerColor[8];
                break;
            case 9:
                icon = markerColor[9];
                break;
            default:
                icon = markerColor[10];
        }
        // marker
        var marker = new google.maps.Marker({
            icon: icon,
            map: map,
            position: coordinates,
        });
        // alert
        for (var d = 0; d < alertText.length; d++) {
            // conditional
            if (alertText[d][1] == "" || data[auxiliary][description] == "") {
                position = 5;
                hidden = "hidden";
                break;
            } else if (alertText[d][1] == data[auxiliary][description]) {
                position = parseInt(alertText[d][0]);
                hidden = "";
                break;
            }
        }
        // alert color
        switch(position) {
            case 0:
                icon = new google.maps.MarkerImage(alertColor[0], size, pointX, pointY);
                optimized = false;
                break;
            case 1:
                icon = new google.maps.MarkerImage(alertColor[1], size, pointX, pointY);
                optimized = false;
                break;
            case 2:
                icon = new google.maps.MarkerImage(alertColor[2], size, pointX, pointY);
                optimized = false;
                break;
            case 3:
                icon = new google.maps.MarkerImage(alertColor[3], size, pointX, pointY);
                optimized = false;
                break;
            case 4:
                icon = new google.maps.MarkerImage(alertColor[4], size, pointX, pointY);
                optimized = false;
                break;
            default:
                icon = new google.maps.MarkerImage(alertColor[5], size, pointX, pointY);        
                optimized = true;
        }
        // marker (alert)
        new google.maps.Marker({
            icon: icon,
            map: map,
            optimized: optimized,
            position: coordinates
        });
        // display gallery
        if (data[auxiliary][link] == "") {
            display = "d-none";
        } else {
            display = "";
        }
        // content
        var content =
            '<div class="accordion" id="div_content">' +
                '<span class="text-primary">' + data[auxiliary][tower] + '</span>' +
                '<div>' +
                    '<a href="#div_table" data-toggle="collapse">' +
                        '<i class="fas fa-caret-down"></i>' +
                    '</a>' +
                    '<div id="div_table" class="collapse" data-parent="#div_content">' +
                        '<table class="table table-sm text-left">' +
                            '<tr>' +
                                '<td>' + text[41][language] + '</td>' +
                                '<td>' + data[auxiliary][type] + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[42][language] + '</td>' +
                                '<td>' + data[auxiliary][height] + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[43][language] + '</td>' +
                                '<td>' + data[auxiliary][span] + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[23][language] + '</td>' +
                                '<td>' + data[auxiliary][section] + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[44][language] + '</td>' +
                                '<td>' + parseFloat(data[auxiliary][latitude]).toFixed(6) + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[45][language] + '</td>' +
                                '<td>' + parseFloat(data[auxiliary][longitude]).toFixed(6) + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[33][language] + '</td>' +
                                '<td>' +
                                    '<a target="_blank" class="text-primary" href="https://www.google.com/maps/dir//' + data[auxiliary][latitude] + ',' + data[auxiliary][longitude] + '">' +
                                        '<span>Google Maps</span>' +
                                    '</a>' + 
                                '</td>' +
                            '</tr>' +
                            '<tr class="' + display + '">' +
                                '<td>' + text[25][language] + '</td>' +
                                '<td>' +
                                    '<a href="#" data-toggle="modal" data-target="#div_gallery" id="' + data[auxiliary][link] + '" onclick="gallery(this)">' +
                                        '<span>' + text[24][language] + '</span>' +
                                        ' <i class="far fa-images"></i>' +
                                    '</a>' +
                                '</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                '</div>' +
                '<div ' + hidden + '>' +
                    '<a href="#div_alert" data-toggle="collapse" class="collapsed badge badge-dark w-100">' +
                        '<img alt="alert icon" class="img_info" src="' + alertColor[position] + '">' +
                        '<span class="ml-1 mr-1">' + data[auxiliary][description] + '</span>' +
                        '<i class="fas fa-caret-down"></i>' +
                    '</a>' +
                    '<div id="div_alert" class="collapse" data-parent="#div_content">' +
                        '<div class="p-2">' + data[auxiliary][description + 1] + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ;
        // mouseover
        marker.addListener("mouseover", function(){
            info.setContent(content);
            info.open(map, marker);
        });
        // click
        marker.addListener("click", function(){
            info.setContent(content);
            info.open(map, marker);
        });
        // increment
        auxiliary++;
    }
    // execute
    function execute(parameter) {
        // set markers
        for (var x = 0; x < data.length; x++) {
            markers(parameter);
            // conditional
            if (x == 0) {
                legend(parameter);
            }
        }
    }

    execute(1);
}