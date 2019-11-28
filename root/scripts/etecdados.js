/*
 * https://etecdados.github.io
 * etecdados v1.0.0
 * copyright 2019 by etecdados
 * created on 2013/06/24 12:10
 * author fernando silva
 * last update on 2019/09/26
 */

 /* policy --------------------------------------------------- */
function loadPolicy (parameter) {
    // get element
    var element = document.getElementById(parameter.id);
    // title
    document.getElementById("h5_policy").innerHTML = element.innerHTML;
    // replace
    var html = parameter.id.replace("button_", "");
    // load html (jQuery)
    $("#div_content").load(html + ".html");
}

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

/* remove link ---------------------------------------------- */
var removeLink = [
    'id:',
    'https://drive.google.com/drive/folders/',
    'https://drive.google.com/open?id=',
    'https://drive.google.com/file/d/',
    'https://docs.google.com/spreadsheets/d/',
    '/edit?usp=sharing',
    '/view?usp=sharing',
    '?usp=sharing',
    '/view'
];

/* include link --------------------------------------------- */
var includeLink = [
    'https://drive.google.com/uc?export=view&id=',
    'https://drive.google.com/file/d/',
    '/preview'
];

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
    // link
    var idSheet = parameter1;
    // remove link
    for (var a = 0; a < removeLink.length; a++) {
        idSheet = idSheet.replace(removeLink[a], "");
    }
    // values
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: idSheet,
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
        ["users!A3:Z",    "userLength",     "userValues"],
        ["projects!A3:Z", "projectsLength", "projectsValues"],
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
        ["data!A4:Z",      "dataLength",      "dataValues"],
        ["activity!A4:Z",  "activityLength",  "activityValues"],
        ["site!A4:Z",      "siteLength",      "siteValues"],
        ["alert!A3:Z",     "alertLength",     "alertValues"],
        ["files!A4:Z",     "filesLength",     "filesValues"],
        ["technical!A3:Z", "technicalLength", "technicalValues"]
    ];
    // get values
    for (var a = 0; a < sheets.length; a++) {
        getValues(link, sheets[a][0], sheets[a][1], sheets[a][2]);
    }
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
var projectsColumns = 4;
// push into array
pushArray(projectsTotal, projects, projectsColumns, projectsValue);

/* data ----------------------------------------------------- */
var data = new Array();
// get item
var dataTotal = sessionStorage.getItem("dataLength");
var dataValue = sessionStorage.getItem("dataValues");
// total columns
var dataColumns = 21;
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

/* technical ------------------------------------------------ */
var technical = new Array();
// get item
var technicalTotal = sessionStorage.getItem("technicalLength");
var technicalValue = sessionStorage.getItem("technicalValues");
// total columns
var technicalColumns = 3;
// push into array
pushArray(technicalTotal, technical, technicalColumns, technicalValue);

/* check text ----------------------------------------------- */
function checkText() {
    if (text[0] == null) {
        document.getElementById("div_login").className = "d-none";
        document.cookie = "reload=0;";
    } else {
        document.getElementById("div_spinner").className = "d-none";
        document.cookie = "reload=1;";
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
    var loginColumns = 12;
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
        // conditional
        if (login[a].indexOf(email) > 0) {
            search = a;
            break;
        }
    }
    // conditional
    if (search == null) {
        // user not found
        modalUser.className = "d-block";
    } else if (login[search][2] != password) {
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
        location.href = "../elecnor";
    }
}

/* trigger login  ------------------------------------------- */
function triggerLogin(e) {
    // conditional
    if (e.keyCode == 13) {
        document.getElementById("button_login").click();
    }
}

/* logout --------------------------------------------------- */
function logout() {
    // split
    var cookies = document.cookie.split(";");
    // delete cookies
    for (var a = 0; a < cookies.length; a++) {
        var value = cookies[a];
        var index = value.indexOf("=");
        var name  = index > -1 ? value.substr(0, index) : value;
        // delete
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    // redirect
    location.href = "../login";
}

/* load projects -------------------------------------------- */
function loadProjects() {
    // get element
    var element = document.getElementById("div_logo");
    // total
    var total = new Array();
    // push
    for (var a = 0; a < projects.length; a++) {
        total.push(projects[a][2]);
    }        
    // filter
    var filter = Array.from(new Set(total));
    // create buttons
    for (var a = 0; a < filter.length; a++) {
        // create element
        var tagButton = document.createElement("button");
        // set attribute
        tagButton.setAttribute("type", "button");
        tagButton.setAttribute("class", "button_projects m-2");
        tagButton.setAttribute("value", a + 1);
        tagButton.setAttribute("id", "button_project" + (a + 1));
        tagButton.setAttribute("data-toggle", "modal");
        tagButton.setAttribute("data-target", "#div_validation");
        tagButton.setAttribute("style", "background-image: url(../root/images/" + filter[a].toLowerCase() + ".png);");
        tagButton.setAttribute("onclick", "validation(this)");
        // append child
        element.appendChild(tagButton);
    }
}

/* set map -------------------------------------------------- */
function setMap(parameter) {
    // get element
    var element = parameter.id;
    // replace
    var index = element.replace("map", "");
    // position and link cookie
    document.cookie = "position=" + index + "; path=/";
    document.cookie = "link=" + projects[index][3] + "; path=/";
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
    if (split[parseInt(element.value) + 2] == "TRUE") {
        var index;
        var total = new Array();
        // push into array
        for (var a = 0; a < projects.length; a++) {
            total.push(projects[a][1]);
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
            for (var b = 0; b < projects.length; b++) {
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
                hyperlink.innerHTML = projects[b][0];
                content.appendChild(hyperlink);    
            }
        } else {
            // modal
            element.setAttribute("data-target", "");
            // position and link cookie
            document.cookie = "position=" + index + "; path=/";
            document.cookie = "link=" + projects[index][3] + "; path=/";
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

/* check data ----------------------------------------------- */
function checkData() {
    // create element
    var tagScript = document.createElement("script");
    // set attribute
    tagScript.setAttribute("type", "text/javascript");
    tagScript.setAttribute("src", "../root/scripts/towers.js");
    // append child
    document.head.appendChild(tagScript);
    // get element
    var element = document.getElementById("div_map");
    // conditional
    if (data[0] == null || getCookie("reload") == 0) {
        // reload cookie
        document.cookie = "reload=1;";
        // change class
        element.className = "d-none";
        // reload page
        setTimeout(function(){
            window.location.reload();
        }, 2000);
    } else {
        // reload cookie
        document.cookie = "reload=0;";
        // change class
        document.getElementById("div_spinner").className = "d-none";
        element.className = "d-block";
        // create script
        var script = document.createElement("script");
        script.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=" + apiKeyMaps + "&callback=googleMaps");
        element.appendChild(script);
        // tag element
        var tagTr;
        var tagTd;
        // summary
        for (var c = 0; c < activity.length; c++) {
            // create element
            tagTr = document.createElement("tr");
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
                    tagTd = document.createElement("td");
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
        // technical
        for (var e = 0; e < technical.length; e++) {
            // create element
            tagTr = document.createElement("tr");
            // append child
            document.getElementById("tbody_technical").appendChild(tagTr);
            // td
            for (var f = 0; f < technical[e].length - 1; f++) {
                // create element
                tagTd = document.createElement("td");
                // inner html
                tagTd.innerHTML = technical[e][f];
                // append child
                tagTr.appendChild(tagTd);
                // conditional
                if (f == 0) {
                    tagTd.setAttribute("class", "text-left small");
                } else {
                    tagTd.setAttribute("class", "text-left small font-weight-bold");
                }
            }
        }
        // show controls (jQuery)
        setTimeout(function(){
            $('#div_controls').show();
        }, 2000);
    }
}

/* colors --------------------------------------------------- */
var colors = [
    /*0*/ "#DC143C", // crimson
    /*1*/ "#4169E1", // royal blue
    /*2*/ "#3CB371", // medium sea green
    /*3*/ "#FFD700", // gold
    /*4*/ "#DA70D6", // orchid
    /*5*/ "#87CEFA", // light sky blue
    /*6*/ "#FF7F50", // coral
    /*7*/ "#A0522D", // sienna
    /*8*/ "#808080", // gray  
];

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
            total.push(data[a][6]);
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
        cables.appendChild(tagDiv);
        cables.appendChild(tagP);
        cables.appendChild(tagUl);
    }
    // list
    for (var c = 0; c < filter.length; c++) {
        // create element
        var tagLi       = document.createElement("li");
        var tagSpan     = document.createElement("span");
        var tagICicrcle = document.createElement("i");
        var tagIMinus   = document.createElement("i");
        var clone       = tagSpan.cloneNode(true);
        // set attribute
        tagICicrcle.setAttribute("class", "mr-2 fas fa-circle");
        tagICicrcle.setAttribute("style", "color:" + colors[c] + "; opacity: 0.8");
        tagIMinus.setAttribute("class", "mr-2 mb-1 fas fa-minus");
        tagIMinus.setAttribute("style", "color:" + colors[c]);
        tagSpan.setAttribute("id", "span_legend" + c);
        clone.setAttribute("class", "badge badge-pill badge-danger float-right ml-2 filter_legend");
        clone.setAttribute("id", "span_filter" + c);
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
                tagICicrcle.setAttribute("class", "d-none");
                tagIMinus.setAttribute("class", "d-none");
            } else {
                // inner html
                tagSpan.innerHTML = description;
            }
        }
        // append child
        tagUl.appendChild(tagLi);
        // conditional
        if (parameter2 == true) {
            tagLi.appendChild(tagICicrcle);
        } else {
            tagLi.appendChild(tagIMinus);
        }
        tagLi.appendChild(tagSpan);
        tagLi.appendChild(clone);
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
    for (var a = 0; a < removeLink.length; a++) {
        element = element.replace(removeLink[a], "");
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
                if (values[b].search(removeLink[0]) >= 0) {
                    // push
                    idFile.push(values[b].replace(removeLink[0], ""));
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
                    img.setAttribute("src", includeLink[0] + idFile[c]);
                    div.appendChild(img);
                } else {
                    iframe.setAttribute("src", includeLink[1] + idFile[c] + includeLink[2]);
                    div.appendChild(iframe);
                }
            }
        }
    }
}

/* map ------------------------------------------------------ */
var map;
// sheet columns
var colTower       = 1;
var colType        = 1 + colTower;
var colHeight      = 1 + colType;
var colSpan        = 1 + colHeight;
var colWeight      = 1 + colSpan;
var colSection     = 1 + colWeight;
var colLatitude    = 1 + colSection;
var colLongitude   = 1 + colLatitude;
var colActivity    = 0 + colLongitude;
var colDescription = 9 + colActivity;
var colLink        = 2 + colDescription;
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
		var weight = 5.0;
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
				{lat: parseFloat(data[a + 0][colLatitude]), lng: parseFloat(data[a + 0][colLongitude])},
				{lat: parseFloat(data[a + 1][colLatitude]), lng: parseFloat(data[a + 1][colLongitude])}
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
                                position = 8;
                                break;
                            } else if (activity[auxiliary][1] == data[a][colActivity + parseInt(element)]) {
                                position = parseInt(activity[auxiliary][activityColor]);
                                break;
                            }
                        }
                    break;
                    }
                }
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
                    default:
                        stroke = colors[8];
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
var iconMarkers  = new Array();
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
        var circle = 'opacity="0.8" d="M0.0,6.5 a17.0,6.5 0 1,0 34.0,0.0 a17.0,6.5 0 1,0 -34.0,0.0 M6.0,6.5 a8.0,3.5 0 0,1 22.0,0.0 a8.0,3.5 0 0,1 -22.0,0.0 Z"';
        var color;
        var displayGallery;
        var displayMarker;
        var hidden;
        var opacity = 0.8;
        var position;
        var rgb;
        var status;
        var weight = 0.0;
        // coordinates
        var coordinates = new google.maps.LatLng(data[a][colLatitude], data[a][colLongitude]);
        // conditional
        if (a == 0) {
            // clear markers on map
            for (var b = 0; b < iconMarkers.length; b++) {
                iconMarkers[b].setMap(null);
                alertMarkers[b].setMap(null);
            }
            // clear array
            iconMarkers = [];
            alertMarkers = [];
        }
        // conditional
        if (element == 0) {
            // total
            var total = new Array();
            // push
            for (var c = 0; c < data.length; c++) {
                total.push(data[c][colSection]);
            }        
            // filter
            var filter = Array.from(new Set(total));
            // position
            for (var d = 0; d < filter.length; d++) {
                // conditional
                if (filter[d] == data[a][colSection]) {
                    position = d;
                    status = filter[d];
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
                        // status
                        status = activity[auxiliary][1];
						// conditional
						if (status == "") {
                            position      = 8;
                            displayMarker = "d-none";
							break;
					    } else if (status == data[a][colActivity + parseInt(element)]) {
                            position = parseInt(activity[auxiliary][activityColor]);
                            displayMarker = "";
						    break;
					    } else {
                            // no break
                            position      = 8;
                            displayMarker = "d-none";
                            status        = "";
                        }
				    }
				    break;
				}
            }
        }
        // marker color
        switch(position) {
            case 0:
                color = colors[0];
                break;
            case 1:
                color = colors[1];
                break;
            case 2:
                color = colors[2];
                break;
            case 3:
                color = colors[3];
                break;
            case 4:
                color = colors[4];
                break;
            case 5:
                color = colors[5];
                break;
            case 6:
                color = colors[6];
                break;
            case 7:
                color = colors[7];
                break;
            default:
                color = colors[8];
                opacity = 0.0;
                weight  = 0.9;
        }
        // create new marker
        var marker = new google.maps.Marker({
            icon: {
                fillColor: color,
                fillOpacity: opacity,
                path: "M0.00,-38.00 m-5.50, 0 a5.50,5.50 0 1,0 11.00,0.00 a5.50,5.50 0 1,0 -11.00,0.00",
                scale: 1,
                strokeColor: "#909090",
                strokeOpacity: 1.0,
                strokeWeight: weight
            },
            map: map,
            position: coordinates,
            reference: status
        });
        // push
        iconMarkers.push(marker);
        // alert
        for (var g = 0; g < alertText.length; g++) {
            // conditional
            if (alertText[g][1] == "" || data[a][colDescription] == "") {
                position = 4;
                hidden = "hidden";
                break;
            } else if (alertText[g][1] == data[a][colDescription]) {
                opacity = 1.0;
                position = parseInt(alertText[g][0]);
                hidden = "";
                break;
            }
        }
        // convert rgb
        function convertRGB(parameter) {
            // match
            var string = parameter.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
            return "rgb(" + parseInt(string[1], 16) + "," + parseInt(string[2], 16) + "," + parseInt(string[3], 16) + ")";
        }
        // alert color
        switch(position) {
            case 0:
                rgb = convertRGB(colors[0]);
                break;
            case 1:
                rgb = convertRGB(colors[1]);
                break;
            case 2:
                rgb = convertRGB(colors[2]);
                break;
            case 3:
                rgb = convertRGB(colors[3]);
                break;
            default:
                rgb = "rgba(0, 0, 0, 0.0)";
        }
        // create new marker (alert)
        var alertMarker = new google.maps.Marker({
            clickable: false,
            icon: {
                anchor: new google.maps.Point(17, 6.5),
                url: 'data:image/svg+xml;utf-8,' +
                        '<svg width="34" height="17" viewBox="0 0 34 17" xmlns="http://www.w3.org/2000/svg">' +
                            '<path fill="' + rgb + '" ' + circle + '/>' +
                        '</svg>'
            },
            map: map,
            optimized: false,
            position: coordinates
        });
        // push (alert)
        alertMarkers.push(alertMarker);
        // display gallery
        if (data[a][colLink] == "") {
            displayGallery = "d-none";
        } else {
            displayGallery = "";
        }
        // content
        var content =
            '<div class="accordion" id="div_content">' +
                '<span class="text-primary">' + data[a][colTower] + '</span>' +
                '<div>' +
                    '<a href="#div_table" data-toggle="collapse">' +
                        '<i class="fas fa-caret-down"></i>' +
                    '</a>' +
                    '<div id="div_table" class="collapse" data-parent="#div_content">' +
                        '<table class="table table-sm text-left">' +
                            '<tr>' +
                                '<td>' + text[41][language] + '</td>' +
                                '<td>' + data[a][colType] + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[42][language]   + '</td>' +
                                '<td>' + data[a][colHeight] + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[43][language] + '</td>' +
                                '<td>' + data[a][colSpan] + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[61][language] + '</td>' +
                                '<td>' + data[a][colWeight] + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[23][language]    + '</td>' +
                                '<td>' + data[a][colSection] + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[44][language] + '</td>' +
                                '<td>' + parseFloat(data[a][colLatitude]).toFixed(6) + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[45][language] + '</td>' +
                                '<td>' + parseFloat(data[a][colLongitude]).toFixed(6) + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' + text[33][language] + '</td>' +
                                '<td>' +
                                    '<a target="_blank" class="text-primary" href="https://www.google.com/maps/dir//' + parseFloat(data[a][colLatitude]) + ',' + parseFloat(data[a][colLongitude]) + '">' +
                                        '<span>Google Maps</span>' +
                                    '</a>' +
                                '</td>' +
                            '</tr>' +
                            '<tr class="' + displayGallery + '">' +
                                '<td>' + text[25][language] + '</td>' +
                                '<td>' +
                                    '<a href="#" data-toggle="modal" data-target="#div_gallery" id="' + data[a][colLink] + '" onclick="gallery(this, &apos;' + text[22][language] + ' ' + data[a][colTower] + '&apos;)">' +
                                    '<i class="far fa-images"></i> ' +
                                    '<span>' + text[24][language] + '</span>' +
                                    '</a>' +
                                '</td>' +
                            '</tr>' +
                            '<tr class="text-center ' + displayMarker + '">' +
                                '<td colspan="2">' +
                                    '<span class="mr-2" style="color: ' + color + '; opacity: 0.8;">' +
                                        '<i class="fas fa-circle"></i>' +
                                    '</span>' +
                                    '<small>' + status + '</small>' +
                                '</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                '</div>' +
                '<div ' + hidden + '>' +
                    '<div class="collapsed badge badge-pill badge-dark w-100">' +
                    '<svg width="34" height="17" viewBox="0 0 34 17" xmlns="http://www.w3.org/2000/svg" id="alert">' +
                        '<path fill="' + rgb + '"' + circle + '/>' +
                    '</svg>' +
                        '<span class="ml-1 mr-1">' + data[a][colDescription] + '</span>' +
                    '</div>' +
                    '<a href="#div_alert" data-toggle="collapse" class="text-dark">' +
                        '<i class="fas fa-caret-down"></i>' +
                    '</a>' +
                    '<div id="div_alert" class="collapse border-top" data-parent="#div_content">' +
                        '<div class="p-2">' + data[a][colDescription + 1] + '</div>' +
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

/* map type ------------------------------------------------- */
var towerMarkers = new Array();
// map type
function mapType(parameter) {
    // variables
    var color;
    var position;
    var type;
    // get element
    var element = document.getElementById(parameter.id);
    // conditional
    if (element == null) {
        type = parameter;
    } else {
        type = element.value;
    }
    // set map
    map.setMapTypeId(type);
    // conditional
    if (type == "hybrid" || type == "dark") {
        color = "#FFFFFF";
    } else {
        color = "#7F7F7F";
    }
    // change marker
    for (var a = 0;  a < data.length; a++) {
        // coordinates
        var coordinates = new google.maps.LatLng(data[a][colLatitude], data[a][colLongitude]);
        // conditional
        if (a == 0) {
            // clear markers on map
            for (var b = 0; b < towerMarkers.length; b++) {
                towerMarkers[b].setMap(null);
            }
            // clear array
            towerMarkers = [];
        }
        // tower type
        for (var c = 0; c < towers.length; c++) {
            // upper
            var upper = data[a][2].toUpperCase();
            // conditional
            if (towers[c][0] == upper.trim()) {
                position = c;
                break;
            } else {
                position = 0;
            }
        }
          // create new marker
        var marker = new google.maps.Marker({
            clickable: false,
            icon: {
                path: towers[position][1],
                scale: 1.0,
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: 0.7,
            },
            map: map,
            position: coordinates,
            reference: a
        });
        // set markers
        towerMarkers.push(marker);
    }
}

/* google maps ---------------------------------------------- */
function googleMaps() {
    // central map
    var central = Math.round(data.length / 2);
    // properties
    var properties = {
        center: new google.maps.LatLng(data[central][colLatitude], data[central][colLongitude]),
        fullscreenControl: true,
        fullscreenControlOptions: {position: google.maps.ControlPosition.LEFT_CENTER},
        mapTypeControl: false,
        mapTypeControlOptions: {mapTypeIds: ['roadmap', 'hybrid', 'terrain', 'dark']},
        streetViewControl: false,
        zoom: 13,
        zoomControl: true,
        zoomControlOptions: {position: google.maps.ControlPosition.LEFT_CENTER}
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
    // dark theme
    var dark = new google.maps.StyledMapType([
        {"elementType": "geometry", "stylers": [{"color": "#212121"}]},
        {"elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
        {"elementType": "labels.text.fill", "stylers": [{"color": "#757575"}]},
        {"elementType": "labels.text.stroke", "stylers": [{"color": "#212121"}]},
        {"featureType": "administrative", "elementType": "geometry", "stylers": [{"color": "#757575"},{"visibility" : "off"}]},
        {"featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{"color": "#9E9E9E"}]},
        {"featureType": "administrative.land_parcel", "stylers": [{"visibility": "off"}]},
        {"featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{"color": "#BDBDBD"}]},
        {"featureType": "administrative.neighborhood", "stylers": [{"visibility": "off"}]},
        {"featureType": "poi", "stylers": [{"visibility": "off"}]},
        {"featureType": "poi", "elementType": "labels.text", "stylers": [{"visibility": "off"}]},
        {"featureType": "poi", "elementType": "labels.text.fill", "stylers": [{"color": "#757575"}]},
        {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#181818"}]},
        {"featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{"color": "#616161"}]},
        {"featureType": "poi.park", "elementType": "labels.text.stroke", "stylers": [{"color": "#1B1B1B"}]},
        {"featureType": "road", "elementType": "geometry.fill", "stylers": [{"color": "#2C2C2C"}]},
        {"featureType": "road", "elementType": "labels", "stylers": [{"visibility": "off"}]},
        {"featureType": "road", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
        {"featureType": "road", "elementType": "labels.text.fill", "stylers": [{"color": "#8A8A8A"}]},
        {"featureType": "road.arterial", "stylers": [{"visibility": "off"}]},
        {"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"color": "#373737"}]},
        {"featureType": "road.highway", "elementType": "geometry", "stylers": [{"color": "#3C3C3C"}]},
        {"featureType": "road.highway", "elementType": "labels", "stylers": [{"visibility": "off"}]},
        {"featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{"color": "#4E4E4E"}]},
        {"featureType": "road.local", "stylers": [{"visibility": "off"}]},
        {"featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{"color": "#616161"}]},
        {"featureType": "transit", "stylers": [{"visibility": "off"}]},
        {"featureType": "transit", "elementType": "labels.text.fill", "stylers": [{"color": "#757575"}]},
        {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#000000"}]},
        {"featureType": "water", "elementType": "labels.text", "stylers": [{"visibility": "off"}]},
        {"featureType": "water", "elementType": "labels.text.fill", "stylers": [{"color": "#3D3D3D"}]}
    ]);
    // set dark
    map.mapTypes.set('dark', dark);
    // site
    for (var a = 0; a < site.length; a++) {
        // marker
        var marker = new google.maps.Marker({
            icon: "../root/vectors/marker.svg",
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
    // set map type
    mapType("hybrid");
    // filter markers
    google.maps.event.addListener(map, 'idle', function() {
        filterLegend();
        filterTowers();
    });
}
/* filter legend -------------------------------------------- */
function filterLegend() {
    // bounds
    var bounds = map.getBounds();
    // array
    var result = new Array();
    // get markers
    for (var a = 0; a < iconMarkers.length; a++) {
        // conditional
        if (bounds.contains(iconMarkers[a].getPosition()) === true) {
            // push
            result.push(iconMarkers[a].reference);
        }
    }
    // filter
    var filter = Array.from(new Set(result));
    // total
    var total = document.getElementById("div_list").getElementsByTagName("LI").length;
    // set values
    for (var b = 0; b < total; b++) {
        // get element
        var spanLegend = document.getElementById("span_legend" + b).innerHTML;
        var spanFilter = document.getElementById("span_filter" + b);
        // filter
        for (var c = 0; c < filter.length; c++) {
            // occurrences
            var occurrences = result.filter(function(count) {
                return count === filter[c];
            }).length;
            // conditional
            if (spanLegend == "") {
                break;
            } else if (spanLegend == filter[c]) {
                spanFilter.innerHTML = occurrences;
                break;
            } else {
                spanFilter.innerHTML = "";
            }
        }
    }
}

/* filter towers -------------------------------------------- */
function filterTowers() {
    // bounds
    var bounds = map.getBounds();
    // array
    var result = new Array();
    var type   = new Array();
    // get markers
    for (var a = 0; a < towerMarkers.length; a++) {
        // conditional
        if (bounds.contains(towerMarkers[a].getPosition()) === true) {
            // push
            result.push(towerMarkers[a].reference);
            type.push(data[towerMarkers[a].reference][2]);
        }
    }
    // total
    var total = result.length;
    // inner html
    document.getElementById("th_filter").innerHTML = total;
    // variables
    var cloneTr;
    var cloneTd1;
    var cloneTd2;
    var distance = 0;
    var filter   = Array.from(new Set(type));
    var first    = result[0] ? result[0] : 0;
    var last     = result[total - 1] ? result[total - 1] : 0;
    var table    = '#table_filter > tbody';
    var weight   = 0;
    // clear body (jQuery)
    $(table).html("");
    // conditional
    if (total == 0) {
        // hide (jQuery)
        $(table).hide();
    } else {
        // show (jQuery)
        $(table).show();
    }
    // weight and distance
    for (var b = 0; b < total; b++) {
        weight = weight + parseFloat(data[first + b][5]);
        // conditional
        if (b < total - 1) {
            distance = distance + parseFloat(data[first + b][4]);
        }
    }
    // create element 
    var tagTr = document.createElement("tr");
    var tagTd = document.createElement("td");
    // values
    var values = [data[first][1], data[last][1], distance.toFixed(2), weight.toFixed(2)];
    // data
    for (var c = 0; c < values.length; c++) {
        // clone
        cloneTr  = tagTr.cloneNode(true);
        cloneTd1 = tagTd.cloneNode(true);
        cloneTd2 = tagTd.cloneNode(true);
        // inner html
        cloneTd1.innerHTML = text[67 + c][language].toUpperCase();
        cloneTd2.innerHTML = values[c];
        // append child
        cloneTr.appendChild(cloneTd1);
        cloneTr.appendChild(cloneTd2);
        // jQuery
        $(table).append(cloneTr);
    }
    // type
    for (var d = 0; d < filter.length; d++) {
        // clone
        cloneTr  = tagTr.cloneNode(true);
        cloneTd1 = tagTd.cloneNode(true);
        cloneTd2 = tagTd.cloneNode(true);
        // occurrences
        var occurrences = type.filter(function(count) {
            return count === filter[d];
        }).length;
        // inner html
        cloneTd1.innerHTML = filter[d];
        cloneTd2.innerHTML = occurrences;
        // append child
        cloneTr.appendChild(cloneTd1);
        cloneTr.appendChild(cloneTd2);
        // jQuery
        $(table).append(cloneTr);
    }
}

/* show filter ---------------------------------------------- */
function showFilter(parameter) {
    // get element
    var element = document.getElementById(parameter.id).value;
    var filter  = document.getElementById("div_filter");
    // conditional
    if (element == 0) {
        filter.style.display = "none";
    } else {
        filter.style.display = "block";
    }
}

/* search file (jQuery) ------------------------------------- */
$(document).ready(function(){
    $("#input_search").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#tbody_search tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});

/* link file ------------------------------------------------ */
function linkFile(parameter) {
    // get element
    var element = document.getElementById("iframe_file");
    // link
    var link = filesText[parameter][4];
    // remove
    for (var a = 0; a < removeLink.length; a++) {
        link = link.replace(removeLink[a], "");
    }
    // set attribute
    element.setAttribute("src", includeLink[1] + link + includeLink[2]);
}

/* list files ----------------------------------------------- */
function listFiles() {
    // get element
    var element = document.getElementById("tbody_search");
    // list
    for (var a = 0; a < filesText.length; a++) {
        // check empty
        if (filesText[a][1] != "") {
            // create element
            var tagTr     = document.createElement("tr");
            var tagTd     = document.createElement("td");
            var tagButton = document.createElement("button");
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
                        clone.appendChild(tagButton);
                        // set attribute
                        tagButton.setAttribute("type", "button");
                        tagButton.setAttribute("class", "btn btn-link p-0 border-0");
                        tagButton.setAttribute("data-toggle", "modal");
                        tagButton.setAttribute("data-target", "#div_file");
                        tagButton.setAttribute("onclick", "linkFile(" + a + ")");
                        // inner html
                        tagButton.innerHTML = '<i class="fas fa-external-link-alt"></i>';
                }
            }
        }
    }
}

/* clear iframe --------------------------------------------- */
function clearIframe() {
    // get element
    var element = document.getElementById("iframe_file");
    // set attribute
    element.setAttribute("src", "");
}