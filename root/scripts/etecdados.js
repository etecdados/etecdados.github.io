/*
 * https://etecdados.github.io
 * etecdados v1.0.0
 * copyright 2019 by etecdados
 * created on 2013/06/24 12:10
 * author fernando silva
 * last update on 2019/09/26
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

/* get values ----------------------------------------------- */
function getValues(parameter1, parameter2, parameter3, parameter4) {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: parameter1,
        range: parameter2,
    }).then(function(response) {
        // result
        var ranges = response.result;
        // keys
        var keys = Object.keys(ranges.values).length;
        // set item
        sessionStorage.setItem(parameter3, keys);
        sessionStorage.setItem(parameter4, ranges.values);
    });
}

/* get database --------------------------------------------- */
function getDatabase() {
    // sheets
    var sheets = [
        ["users!A2:Z",    "userLength",     "userValues"],
        ["projects!A2:Z", "projectsLength", "projectsValues"],
        ["language!A2:Z", "languageLength", "languageValues"]
    ];
    // get values
    for (var a = 0; a < sheets.length; a++) {
        getValues(databaseKey, sheets[a][0], sheets[a][1], sheets[a][2]);
    }
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
}

/* get project ---------------------------------------------- */
function getProject() {
    // sheets
    var sheets = [
        ["data!A4:Z",     "dataLength",     "dataValues"],
        ["activity!A4:Z", "activityLength", "activityValues"],
        ["site!A4:Z",     "siteLength",     "siteValues"],
        ["alert!A3:Z",    "alertLength",    "alertValues"],
        ["files!A4:Z",    "filesLength",    "filesValues"]
    ];
    // get values
    for (var a = 0; a < sheets.length; a++) {
        getValues(link, sheets[a][0], sheets[a][1], sheets[a][2]);
    }
}

/* set language --------------------------------------------- */
function setLanguage(parameter) {
    // get element
    var element = document.getElementById(parameter.id).value;
    var input   = document.getElementById("input_general");
    // conditional
    if (input != null) {
        // checked (sidebar)
        input.checked = true;
        document.getElementById("input_hybrid").checked  = true;
    }
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
    // conditional
    if (parameter4 != null) {
        // split
        var split = parameter4.split(",");
        // push into array
        for (var b = 0; b < total; b++) {
            for (var c = 0; c < columns; c++) {
                parameter2[b].push(split[b * columns + c]);
            }
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
var activityColumns = 9;
// push into array
pushArray(activityTotal, activity, activityColumns, activityValue);

/* site ----------------------------------------------------- */
var site = new Array();
// get item
var siteTotal = sessionStorage.getItem("siteLength");
var siteValue = sessionStorage.getItem("siteValues");
// total columns
var siteColumns = 6;
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

/* files ---------------------------------------------------- */
var filesText = new Array();
// get item
var filesTextTotal = sessionStorage.getItem("filesLength");
var filesTextValue = sessionStorage.getItem("filesValues");
// total columns
var filesTextColumns = 6;
// push into array
pushArray(filesTextTotal, filesText, filesTextColumns, filesTextValue);

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

/* trigger login  ------------------------------------------- */
function triggerLogin(e) {
    // conditional
    if (e.keyCode == 13) {
        // click
        document.getElementById("button_login").click();
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
    // get element
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
    /*4*/ "#FF00FF", // magenta
    /*5*/ "#00FFFF", // cyan
    /*6*/ "#FFA500", // orange
    /*7*/ "#000000", // black
    /*8*/ "#A0500A", // brown
    /*9*/ "#A5A5A5"  // gray
];

/* marker color --------------------------------------------- */
var markerColor = [
    /*0*/ "../root/xml/marker-red.svg",
    /*1*/ "../root/xml/marker-blue.svg",
    /*2*/ "../root/xml/marker-green.svg",
    /*3*/ "../root/xml/marker-yellow.svg",
    /*4*/ "../root/xml/marker-magenta.svg",
    /*5*/ "../root/xml/marker-cyan.svg",
    /*6*/ "../root/xml/marker-orange.svg",
    /*7*/ "../root/xml/marker-black.svg",
    /*8*/ "../root/xml/marker-brown.svg",
    /*9*/ "../root/xml/marker-transparent.svg"
];

/* alert color----------------------------------------------- */
var alertColor = [
    /*0*/ "../root/xml/alert-red.svg",
    /*1*/ "../root/xml/alert-blue.svg",
    /*2*/ "../root/xml/alert-green.svg",
    /*3*/ "../root/xml/alert-yellow.svg",
    /*4*/ "../root/xml/alert-transparent.svg"
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
function legend(parameter1, parameter2) {
    // variable
    var auxiliary;
    var filter;
    var title;
    // get element
    var element = document.getElementById("div_list");
    var cables  = document.getElementById("div_cables");
    // clear div
    cables.innerHTML = "";
    // conditional
    if (parameter1 == 0) {
        // array
        var total = new Array();
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
            if (parameter1 == parseInt(activity[b][0])) {
                // filter (activity)
                filter    = new Array(8);
                auxiliary = b + 1;
                break;
            }
        }
    }
    // create element
    var tagDiv = document.createElement("div");
    var tagP   = document.createElement("p");
    var tagUl  = document.createElement("ul");
    // set attribute
    tagDiv.setAttribute("class", "bg-primary text-white text-center p-1 mt-1");
    tagP.setAttribute("class", "text-center text-primary pt-1 m-0");
    tagUl.setAttribute("class", "ul_legend p-1 mb-0");
    // switch
    switch(parseInt(parameter1)) {
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
            tagP.innerHTML = text[51][language].toUpperCase();
            break;
        case 5:
            title = text[29][language];
            tagP.innerHTML = text[52][language].toUpperCase();
            break;
        case 6:
            title = text[29][language];
            tagP.innerHTML = text[53][language].toUpperCase();
            break;
        case 7:
            title = text[58][language];
            break;
        case 8:
            title = text[59][language];
            break;
        default:
            title = text[23][language];
    }
    // inner html
    tagDiv.innerHTML = title.toUpperCase();
    // conditional
    if (parameter2 == true) {
        // clear div
        element.innerHTML = "";
        // append child
        element.appendChild(tagDiv);
        element.appendChild(tagUl);
    } else {
        // append child
        cables.appendChild(tagDiv);
        cables.appendChild(tagP);
        cables.appendChild(tagUl);
    }
    
    // list
    for (var c = 0; c < filter.length; c++) {
        // create element
        var tagLi   = document.createElement("li");
        var tagImg  = document.createElement("img");
        var tagSpan = document.createElement("span");
        var tagI    = document.createElement("i");
        // set attribute
        tagImg.setAttribute("src", markerColor[c]);
        tagImg.setAttribute("alt", "marker");
        tagImg.setAttribute("height", "13px");
        tagImg.setAttribute("class", "mr-2 mb-1");
        tagI.setAttribute("class", "mr-2 mb-1 fas fa-minus");
        tagI.setAttribute("style", "color:" + colors[c]);
        // conditional
        if (parameter1 == 0) {
            // inner html
            tagSpan.innerHTML = filter[c];    
        } else {
            // description
            var description = activity[c + auxiliary][1];
            // conditional
            if (description == "") {
                // set attribute
                tagImg.setAttribute("class", "d-none");
                tagI.setAttribute("class", "d-none");
            } else {
                // inner html
                tagSpan.innerHTML = description;
            }
        }
        // append child
        tagUl.appendChild(tagLi);
        // conditional
        if (parameter2 == true) {
            tagLi.appendChild(tagImg);
        } else {
            tagLi.appendChild(tagI);
        }
        tagLi.appendChild(tagSpan);
    }
}

/* gallery -------------------------------------------------- */
function gallery(parameter1, parameter2) {
    // get element
    var element = parameter1.id;
    var content = document.getElementById("div_inner");
    var ol      = document.getElementById("ol_indicators");
    var span    = document.getElementById("span_tower");
    // clear content
    content.innerHTML = "";
    ol.innerHTML      = "";
    // number tower
    span.innerHTML = parameter2;
    // remove
    var remove = [
        'id:',
        'https://drive.google.com/drive/folders/',
        'https://drive.google.com/open?id=',
        '?usp=sharing'
    ];
    // include
    var include = [
        'https://drive.google.com/uc?export=view&id=',
        'https://drive.google.com/file/d/',
        '/preview'
    ];
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
                li.setAttribute("class", "pl-1 pr-1 border-0")
                span.setAttribute("class", "text-dark");
                img.setAttribute("class", "d-block m-auto");
                // inner html
                span.innerHTML = ('0' + (c + 1)).slice(-2);
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

/* map ------------------------------------------------------ */
var map;
// sheet columns
var sheetTower       = 1;
var sheetType        = 1 + sheetTower;
var sheetHeight      = 1 + sheetType;
var sheetSpan        = 1 + sheetHeight;
var sheetSection     = 1 + sheetSpan;
var sheetLatitude    = 1 + sheetSection;
var sheetLongitude   = 1 + sheetLatitude;
var sheetActivity    = 0 + sheetLongitude;
var sheetDescription = 9 + sheetActivity;
var sheetLink        = 2 + sheetDescription;
// sheet activity
var activityColor = 7;
var activityRows  = 8;

/* polyline ------------------------------------------------- */
var polylines = new Array();
// add polyline
function addPolyline(parameter) {
    // span cables
	document.getElementById("span_cables").innerHTML = '<i class="far fa-dot-circle"></i>';
    // get element
    var element;
    // conditional
    if (typeof parameter == "number") {
        element = parameter;
    } else {
        element = document.getElementById(parameter.id).value;
    }
    // legend
	legend(element, false);
	// set map
	for (var a = 0; a < data.length; a++) {
        // variables
		var position;
		var stroke;
		var weight;
		// conditional
		if (a == 0) {
			for (var b = 0; b < polylines.length; b++) {
				polylines[b].setMap(null);
			}
			// clear
			polylines = [];
		}
		// coordinates
		var coordinates = new Array();
		// conditional
		if (a + 1 >= data.length) {
			break;
		} else {
            // get coordinates
			coordinates = [
				{lat: parseFloat(data[a + 0][sheetLatitude]), lng: parseFloat(data[a + 0][sheetLongitude])},
				{lat: parseFloat(data[a + 1][sheetLatitude]), lng: parseFloat(data[a + 1][sheetLongitude])}
            ];
            // conditional
            if (element == 0) {
                stroke = "#FFC107";
                weight = 1.0;
            } else {
                // activity
                for (var b = 0; b < activity.length; b++) {
                    // conditional
                    if (activity[b][0] == element) {
                        // position
                        for (var c = 0; c < activityRows; c++) {
                            // auxiliary
                            var auxiliary = b + c + 1;
                            // conditional
                            if (activity[auxiliary][1] == "") {
                                position = 9;
                                break;
                            } else if (activity[auxiliary][1] == data[a][sheetActivity + parseInt(element)]) {
                                position = parseInt(activity[auxiliary][activityColor]);
                                break;
                            }
                        }
                    break;
                    }
                }
                // weight
                weight = 5.0;
                // stroke color
                switch(position) {
                    case 0:
                        stroke = colors[0];
                        break;
                    case 1:
                        stroke = colors[1];
                        break;
                    case 2:
                        stroke = colors[2];
                        break;
                    case 3:
                        stroke = colors[3];
                        break;
                    case 4:
                        stroke = colors[4];
                        break;
                    case 5:
                        stroke = colors[5];
                        break;
                    case 6:
                        stroke = colors[6];
                        break;
                    case 7:
                        stroke = colors[7];
                        break;
                    case 8:
                        stroke = colors[8];
                        break;
                    default:
                        stroke = colors[9];
                        weight = 1.0;
                }
            }
            // new polyline
            var polyline = new google.maps.Polyline({
                geodesic: true,
                map: map,
                path: coordinates,
                strokeColor: stroke,
                strokeOpacity: 0.8,
                strokeWeight: weight
            });
            // push
            polylines.push(polyline);
		}
	}
}

/* markers -------------------------------------------------- */
var towerMarkers = new Array();
var alertMarkers = new Array();
// add markers
function addMarkers(parameter) {
    // polyline
    addPolyline(0);
    // icon cables
    document.getElementById("span_cables").innerHTML = '<i class="far fa-circle"></i>';
    // radio cables (jQuery)
    $("input[name=cables]").prop("checked", false);
    // get element
    var element;
    // conditional;
    if (typeof parameter == "number") {
        element = parameter;
    } else {
        element = document.getElementById(parameter.id).value;
    }
    // legend
    legend(element, true);
    // info window
    var info = new google.maps.InfoWindow();
    // icon activity and others
    var spanActivity = document.getElementById("span_activity");
    var spanOthers   = document.getElementById("span_others");
    // conditional
    if (element < 4) {
        spanActivity.innerHTML = '<i class="far fa-dot-circle"></i>';
        spanOthers.innerHTML   = '<i class="far fa-circle"></i>';
    } else {
        spanActivity.innerHTML = '<i class="far fa-circle"></i>';
        spanOthers.innerHTML   = '<i class="far fa-dot-circle"></i>';
    }
    // set map
    for (var a = 0;  a < data.length; a++) {
        // variables
        var display;
        var hidden;
        var icon;
        var optimized;
        var position;
        // points
        var pointX = new google.maps.Point(0, 0);
        var pointY = new google.maps.Point(16.5, 5.5);
        var pointZ = new google.maps.Size(34, 13);
        // coordinates
        var coordinates = new google.maps.LatLng(data[a][sheetLatitude], data[a][sheetLongitude]);
        // conditional
        if (a == 0) {
            // clear markers on map
            for (var b = 0; b < towerMarkers.length; b++) {
                towerMarkers[b].setMap(null);
                alertMarkers[b].setMap(null);
            }
            // clear array
            towerMarkers = [];
            alertMarkers = [];
        }
        // conditional
        if (element == 0) {
            // total
            var total = new Array();
            // push
            for (var c = 0; c < data.length; c++) {
                total.push(data[c][sheetSection]);
            }        
            // filter
            var filter = Array.from(new Set(total));
            // position
            for (var d = 0; d < filter.length; d++) {
                // conditional
                if (filter[d] == data[a][sheetSection]) {
                    position = d;
                    break;
                }
            }
        } else {
            // activity
            for (var e = 0; e < activity.length; e++) {
				// conditional
				if (activity[e][0] == element) {
					// position
					for (var f = 0; f < activityRows; f++) {
						// auxiliary
                        var auxiliary = e + f + 1;
						// conditional
						if (activity[auxiliary][1] == "") {
							position = 9;
							break;
					    } else if (activity[auxiliary][1] == data[a][sheetActivity + parseInt(element)]) {
                            position = parseInt(activity[auxiliary][activityColor]);
						    break;
					    } else {
                            // no break
                            position = 9;
                        }
				    }
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
            default:
                icon = markerColor[9];
        }
        // create new marker
        var marker = new google.maps.Marker({
            icon: icon,
            map: map,
            position: coordinates
        });
        // push
        towerMarkers.push(marker);
        // alert
        for (var g = 0; g < alertText.length; g++) {
            // conditional
            if (alertText[g][1] == "" || data[a][sheetDescription] == "") {
                position = 4;
                hidden = "hidden";
                break;
            } else if (alertText[g][1] == data[a][sheetDescription]) {
                position = parseInt(alertText[g][0]);
                hidden = "";
                break;
            }
        }
        // alert color
        switch(position) {
            case 0:
                icon = new google.maps.MarkerImage(alertColor[0], pointZ, pointX, pointY);
                optimized = false;
                break;
            case 1:
                icon = new google.maps.MarkerImage(alertColor[1], pointZ, pointX, pointY);
                optimized = false;
                break;
            case 2:
                icon = new google.maps.MarkerImage(alertColor[2], pointZ, pointX, pointY);
                optimized = false;
                break;
            case 3:
                icon = new google.maps.MarkerImage(alertColor[3], pointZ, pointX, pointY);
                optimized = false;
                break;
            default:
                icon = new google.maps.MarkerImage(alertColor[4], pointZ, pointX, pointY);        
                optimized = true;
        }
        // create new marker (alert)
        var alertMarker = new google.maps.Marker({
            icon: icon,
            map: map,
            optimized: optimized,
            position: coordinates
        });
        // push (alert)
        alertMarkers.push(alertMarker);
        // display gallery
        if (data[a][sheetLink] == "") {
            display = "d-none";
        } else {
            display = "";
        }
        // content
        var content =
            '<div class="accordion" id="div_content">' +
                '<span class="text-primary">' + data[a][sheetTower] + '</span>' +
                '<div>' +
                    '<a href="#div_table" data-toggle="collapse">' +
                        '<i class="fas fa-caret-down"></i>' +
                    '</a>' +
                    '<div id="div_table" class="collapse" data-parent="#div_content">' +
                        '<table class="table table-sm text-left">' +
                            '<tr>' +
                                '<td>' + text[41][language] + '</td>' +
                                '<td>' + data[a][sheetType] + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[42][language]   + '</td>' +
                                '<td>' + data[a][sheetHeight] + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[43][language] + '</td>' +
                                '<td>' + data[a][sheetSpan] + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[23][language]    + '</td>' +
                                '<td>' + data[a][sheetSection] + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[44][language] + '</td>' +
                                '<td>' + parseFloat(data[a][sheetLatitude]).toFixed(6) + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[45][language] + '</td>' +
                                '<td>' + parseFloat(data[a][sheetLongitude]).toFixed(6) + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[33][language] + '</td>' +
                                '<td>' +
                                    '<a target="_blank" class="text-primary" href="https://www.google.com/maps/dir//' + parseFloat(data[a][sheetLatitude]) + ',' + parseFloat(data[a][sheetLongitude]) + '">' +
                                        '<span>Google Maps</span>' +
                                    '</a>' +
                                '</td>' +
                            '</tr>' +
                            '<tr class="' + display + '">' +
                                '<td>' + text[25][language] + '</td>' +
                                '<td>' +
                                    '<a href="#" data-toggle="modal" data-target="#div_gallery" id="' + data[a][sheetLink] + '" onclick="gallery(this, &apos;' + text[22][language] + ' ' + data[a][sheetTower] + '&apos;)">' +
                                    '<i class="far fa-images"></i> ' +
                                    '<span>' + text[24][language] + '</span>' +
                                    '</a>' +
                                '</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                '</div>' +
                '<div ' + hidden + '>' +
                    '<div class="collapsed badge badge-pill badge-dark w-100">' +
                        '<img alt="alert icon" class="img_info" src="' + alertColor[position] + '">' +
                        '<span class="ml-1 mr-1">' + data[a][sheetDescription] + '</span>' +
                    '</div>' +
                    '<a href="#div_alert" data-toggle="collapse" class="text-dark">' +
                        '<i class="fas fa-caret-down"></i>' +
                    '</a>' +
                    '<div id="div_alert" class="collapse border-top" data-parent="#div_content">' +
                        '<div class="p-2">' + data[a][sheetDescription + 1] + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ;
        // info (mouseover)
        function infoMouseover(marker) {
            google.maps.event.addListener(marker, 'mouseover', (function(marker, content, info) {
                return function() {
                    info.setContent(content);
                    info.open(map, marker);
                };
            })(marker, content, info));
        }
        // info (click)
        function infoClick(marker) {
            google.maps.event.addListener(marker, 'click', (function(marker, content, info) {
                return function() {
                    info.setContent(content);
                    info.open(map, marker);
                };
            })(marker, content, info));
        }
        // execute
        infoMouseover(marker);
        infoClick(marker);
    }
}

/* google maps ---------------------------------------------- */
function googleMaps() {
    // central map
    var central = Math.round(data.length / 2);
    // properties
    var properties = {
        center: new google.maps.LatLng(data[central][sheetLatitude], data[central][sheetLongitude]),
        fullscreenControl: true,
        fullscreenControlOptions: {position: google.maps.ControlPosition.RIGHT_BOTTOM},
        mapTypeControl: false,
        mapTypeId: "hybrid",
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
    // info window
    var info = new google.maps.InfoWindow();
    // site
    for (var a = 0; a < site.length; a++) {
        // marker
        var marker = new google.maps.Marker({
            icon: "../root/xml/marker-site.svg",
            map: map,
            position: new google.maps.LatLng(parseFloat(site[a][3]), parseFloat(site[a][4])),
        });
        // content
        var content =
            '<div id="div_site">' +
                '<strong class="p-2 text-primary">' + site[a][1] + '</strong>' +
                '<table class="table table-sm mt-2 text-left">' +
                    '<tr>' +
                        '<td>' + text[50][language] + '</td>' +
                        '<td>' + site[a][2] + '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>' + text[44][language] + '</td>' +
                        '<td>' + parseFloat(site[a][3]).toFixed(6) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>' + text[45][language] + '</td>' +
                        '<td>' + parseFloat(site[a][4]).toFixed(6) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>' + text[33][language] + '</td>' +
                        '<td>' +
                            '<a target="_blank" class="text-primary" href="https://www.google.com/maps/dir//' + parseFloat(site[a][3]).toFixed(6) + ',' + parseFloat(site[a][4]).toFixed(6) + '">' +
                                '<span>Google Maps</span>' +
                            '</a>' +
                        '</td>' +
                    '</tr>' +
                '</table>' +
            '</div>'
        ;
        // info (mouseover)
        function infoMouseover(marker) {
            google.maps.event.addListener(marker, 'mouseover', (function(marker, content, info) {
                return function() {
                    info.setContent(content);
                    info.open(map, marker);
                };
            })(marker, content, info));
        }
        // info (click)
        function infoClick(marker) {
            google.maps.event.addListener(marker, 'click', (function(marker, content, info) {
                return function() {
                    info.setContent(content);
                    info.open(map, marker);
                };
            })(marker, content, info));
        }
        // execute
        infoMouseover(marker);
        infoClick(marker);
    }
    // set polyline
    addPolyline(0);
    // set markers
    addMarkers(0);
}

/* map type ------------------------------------------------- */
function mapType(parameter) {
    // get element
    var element = document.getElementById(parameter.id).value;
    // set map
    map.setMapTypeId(element);
}

/* search (jQuery) ------------------------------------------ */
$(document).ready(function(){
    $("#input_search").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#tbody_search tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});

/* list files ----------------------------------------------- */
function listFiles() {
    // get element
    var element = document.getElementById("tbody_search");
    // list
    for (var a = 0; a < filesText.length; a++) {
        // create element
        var tagTr = document.createElement("tr");
        var tagTd = document.createElement("td");
        var tagA  = document.createElement("a");
        // append child
        element.appendChild(tagTr);
        // td
        for (var b = 0; b < filesTextColumns - 1; b++) {
            // clone
            var clone = tagTd.cloneNode(true);
            // append child
            tagTr.appendChild(clone);
            // switch
            switch(b) {
                case 0:
                    clone.innerHTML = ('00' + (a + 1)).slice(-3);
                    break;
                case 1:
                    clone.setAttribute("class", "text-left");
                    clone.innerHTML = filesText[a][1];
                    break;
                case 2:
                    clone.innerHTML = filesText[a][2];
                    break;
                case 3:
                    clone.innerHTML = filesText[a][3];
                    break;
                default:
                    clone.appendChild(tagA);
                    tagA.setAttribute("target", "_blank");
                    tagA.setAttribute("href", filesText[a][4]);
                    tagA.innerHTML = '<i class="fas fa-external-link-alt"></i>';
            }
        }
    }
}