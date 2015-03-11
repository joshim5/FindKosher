// Look at Store Name seperately

var storeName = $("table:eq(4) tr h2").text()

// Iterate through the data and prepare the database appropriately

var table = $("table:eq(4)");
table.find('tr').each(function(i, el) {
    var $tds = $(this).find('td'),
        header = $tds.eq(0).text(),
        text = $tds.eq(1).text();
		html = $tds.eq(1).html()
    
    if (header === "Address/Phone:") {
		// Grab the entire address/phone field
        var txt = html;

		// Change newlines to spaces
		txt = txt.replace(/<br>/g, " ");

		// Construct regular expressions for grabbing fax/phone fields
		var phoneRe = /<b>phone:<\/b>/;
		var faxRe = /<b>fax:<\/b>/;
		var phoneResults = phoneRe.exec(txt);
		var faxResults = faxRe.exec(txt);
		var phoneStart = phoneResults["index"];
		var faxStart = faxResults["index"];

		// Hack - clean up HTML tags
		var addressDiv = document.createElement("div");
		var phoneDiv = document.createElement("div");
		var faxDiv = document.createElement("div");
		addressDiv.innerHTML = txt.substring(0, phoneStart);
		phoneDiv.innerHTML = txt.substring(phoneStart+14, faxStart);
		faxDiv.innerHTML = txt.substring(faxStart+12);
		var addressText = addressDiv.innerText;
		var phoneText = phoneDiv.innerText;
		var faxText = faxDiv.innerText;
		if (faxText === "[please provide] ") faxText = "";

		// Lat / lng
		var lat = 0.0;
		var lng = 0.0;
		var formattedAddress = "N/A";

		var jsonURL = 'http://maps.google.com/maps/api/geocode/json?address=' + addressText
		$.getJSON(jsonURL, function(GData) {
			if (GData["status"] === "OK" && GData.results.length > 1) {
				lat = GData.results[0].geometry.location.lat;
				lng = GData.results[0].geometry.location.lng;
				formattedAddress = GData.results[0].formatted_address;

				// INSERT TO DATABASE HERE

			}
		});
    } else if (header === "Metro Area:") {
        // Insert text to database
    } else if (header === "Cuisines:") {
        // Insert array [text.split(" / ")] into database
    } else if (header === "Price Range:") {
        var matchesCount = text.split("$").length - 1;
		// Insert matchesCount into database
    } else if (header === "Category:") {
        // Insert array ptext.split(", ")] into database
    } else if (header === "Hashgacha/Supervision:") {
        // Insert text into database
    } else if (header === "Last Updated By:") {
        // Insert text into database
    } else if (header === "Last Updated On:") {
        
    } 
});








// 2. Address/phone/fax:

// Grab the entire address/phone field
var txt = $("table:eq(4) tr:eq(1) td:eq(1)").html();

// Change newlines to spaces
txt = txt.replace(/<br>/g, " ");

// Construct regular expressions for grabbing fax/phone fields
var phoneRe = /<b>phone:<\/b>/;
var faxRe = /<b>fax:<\/b>/;
var phoneResults = phoneRe.exec(txt);
var faxResults = faxRe.exec(txt);
var phoneStart = phoneResults["index"];
var faxStart = faxResults["index"];

// Hack - clean up HTML tags
var addressDiv = document.createElement("div");
var phoneDiv = document.createElement("div");
var faxDiv = document.createElement("div");
addressDiv.innerHTML = txt.substring(0, phoneStart);
phoneDiv.innerHTML = txt.substring(phoneStart+14, faxStart);
faxDiv.innerHTML = txt.substring(faxStart+12);
var addressText = addressDiv.innerText;
var phoneText = phoneDiv.innerText;
var faxText = faxDiv.innerText;
if (faxText === "[please provide] ") faxText = "";

// Lat / lng
var lat = 0.0;
var lng = 0.0;
var formattedAddress = "N/A";

var jsonURL = 'http://maps.google.com/maps/api/geocode/json?address=' + addressText
$.getJSON(jsonURL, function(GData) {
	if (GData["status"] === "OK" && GData.results.length > 1) {
		lat = GData.results[0].geometry.location.lat;
		lng = GData.results[0].geometry.location.lng;
		formattedAddress = GData.results[0].formatted_address;
		
		// INSERT TO DATABASE HERE
		
	}
});

// neighborhood: String,



metro_area: String,
cuisines: Array,
price_range: Number,
category: Number,
additional_info: String,
hashgacha: Array,
last_updated_by: String,
last_updated_on: Date,
Hours: String,
rest_record_number: Number,
reviews: Array