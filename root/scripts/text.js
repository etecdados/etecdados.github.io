/* text ----------------------------------------------------- */
var text = new Array();
// total rows
var rows = 14;
// total columns
var columns = 3;
// multidimensional arrays
for (var i = 0; i < rows; i++ ) {
    text.push([]);
}
// get item
var item = sessionStorage.getItem("records");



// split
var split = item.split(",")
// push into array
for (var i = 0; i < rows; i++) {
    for (var b = 0; b < columns; b++) {
        text[i].push(split[i * columns + b]);
    }
}