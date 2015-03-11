/* 
  Codename: Find Kosher
  Author: Joshua Meier
*/

// Libraries
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var async = require('async');

// Database
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongo.db("mongodb://localhost:27017/findkosher", {native_parser:true});

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Main server logic
app.get('/', function(req, res) {
		
	// Prepare the database
	mongoose.createConnection('mongodb://localhost/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var restaurantSchema = new Schema ({
			name: String,
			formatted_address: String,
			lat: Number,
			lng: Number,
			phone: String,
			fax: String,
			neighborhood: String,
			metro_area: String,
			cuisines: Array,
			price_range: Number,
			category: Array,
			additional_info: String,
			hashgacha: Array,
			last_updated_by: String,
			last_updated_on: Date,
			last_updated_here: { type: Date, default: Date.now },
			Hours: String,
			rest_record_number: Number,
			reviews: Array
		})
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
	});
	
	// Start scraping
	var url_base = 'http://www.shamash.org/kosher/search.php?Recno=%RECNO%&Comm=two'
	
	// Setup a concurrent scraper with concurrency 1
	var q = async.queue(function (task, callback) {
		request(task.url, function(error, response, html) {
			if (!error) {
				// Load the DOM
				$ = cheerio.load(html);
				
				// No Matches Found is stored in an <h1>
				if($('h1').length !== 1) {
					callback(null, 1, task.url, html)
				} else {
					callback(null, 0, null, null)
				}
			}
		});
	}, 1);
	
	// When all have been processed..
	q.drain = function() {
	    console.log('all items have been processed');
	}
		
	// Build each request
	var urls = [];
	for (var i = 1; i < 5; i++) {
		// Setup the URL to point to this resturaunt ID
		urls[i] = url_base.replace("%RECNO%", i);				
		q.push({ url: urls[i]}, function(error, contains_data, url, html) {
			if (contains_data) {
				var new_restaurant = new Restaurant(
					{
						name: String,
						formatted_address: String,
						lat: Number,
						lng: Number,
						phone: String,
						fax: String,
						neighborhood: String,
						metro_area: String,
						cuisines: Array,
						price_range: Number,
						category: Array,
						additional_info: String,
						hashgacha: Array,
						last_updated_by: String,
						last_updated_on: Date,
						Hours: String,
						rest_record_number: Number,
						reviews: Array
					})

				
				
				
			}
		});	
	}
});

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;