/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs142 collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const async = require("async");

const express = require("express");
const app = express();

// Load the Mongoose schema for User, Photo, and SchemaInfo

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!

// const cs142models = require("./modelData/photoApp.js").cs142models;

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/cs142project6", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const fs = require("fs");

const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const processFormBody = multer({ storage: multer.memoryStorage() }).single('uploadedphoto');
const MongoStore = require('connect-mongo');

const { makePasswordEntry, doesPasswordMatch } = require("./cs142password.js");

const SchemaInfo = require("./schema/schemaInfo.js");
const Photo = require("./schema/photo.js");
const User = require("./schema/user.js");
const Activity = require("./schema/activity.js");

// console.log(MongoStore);
app.use(session({
	secret: "secretKey",
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1/cs142project6" })
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.get("/", function (request, response) {
	response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 * 
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", function (request, response) {
	// Express parses the ":p1" from the URL and returns it in the request.params
	// objects.
	console.log("/test called with param1 = ", request.params.p1);

	const param = request.params.p1 || "info";

	if (param === "info") {
		// Fetch the SchemaInfo. There should only one of them. The query of {} will
		// match it.
		SchemaInfo.find({}, function (err, info) {
			if (err) {
				// Query returned an error. We pass it back to the browser with an
				// Internal Service Error (500) error code.
				console.error("Error in /user/info:", err);
				response.status(500).send(JSON.stringify(err));
				return;
			}
			if (info.length === 0) {
				// Query didn't return an error but didn't find the SchemaInfo object -
				// This is also an internal error return.
				response.status(500).send("Missing SchemaInfo");
				return;
			}

			// We got the object - return it in JSON format.
			//   console.log("SchemaInfo", info[0]);
			response.end(JSON.stringify(info[0]));
		});
	} else if (param === "counts") {
		// In order to return the counts of all the collections we need to do an
		// async call to each collections. That is tricky to do so we use the async
		// package do the work. We put the collections into array and use async.each
		// to do each .count() query.
		const collections = [
			{ name: "user", collection: User },
			{ name: "photo", collection: Photo },
			{ name: "schemaInfo", collection: SchemaInfo },
		];
		async.each(
			collections,
			function (col, done_callback) {
				col.collection.countDocuments({}, function (err, count) {
					col.count = count;
					done_callback(err);
				});
			},
			function (err) {
				if (err) {
					response.status(500).send(JSON.stringify(err));
				} else {
					const obj = {};
					for (let i = 0; i < collections.length; i++) {
						obj[collections[i].name] = collections[i].count;
					}
					response.end(JSON.stringify(obj));
				}
			}
		);
	} else {
		// If we know understand the parameter we return a (Bad Parameter) (400)
		// status.
		response.status(400).send("Bad param " + param);
	}
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", function (request, response) {
	if (!request.session.isLoggedIn) {
		response.status(401).send("user not logged in");
		return;
	}
	//   response.status(200).send(cs142models.userListModel());
	User.find({}, (err, users) => {
		if (err) {
			response.status(400).send(JSON.stringify(err));
			return;
		}
		if (users.length === 0) {
			response.status(400).send("Missing users");
			return;
		}

		let userList = [];
		for (const user of users) {
			// console.log(user);
			const myUser = {
				_id: user._id,
				first_name: user.first_name,
				last_name: user.last_name
			};
			userList.push(myUser);
		}


		// console.log(userList);
		response.status(200).send(userList);

	});
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", function (request, response) {
	if (!request.session.isLoggedIn) {
		response.status(401).send("user not logged in");
		return;
	}
	const id = request.params.id;
	//   const user = cs142models.userModel(id);
	//   if (user === null) {
	//     console.log("User with _id:" + id + " not found.");
	//     response.status(400).send("Not found");
	//     return;
	//   }
	//   response.status(200).send(user);

	User.findOne({ _id: id }, function (err, user) {
		if (err) {
			console.log("error in finding user", err);
			response.status(400).send(JSON.stringify(err));
			return;
		}
		if (!user) {
			response.status(400).send("Missing user");
			return;
		}

		let userObj = {
			_id: user._id,
			first_name: user.first_name,
			last_name: user.last_name,
			location: user.location,
			description: user.description,
			occupation: user.occupation,
		};

		// console.log(JSON.stringify(userObj));
		response.status(200).send(JSON.stringify(userObj));
		// response.status(200).send(JSON.stringify(user));

	});
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", function (request, response) {

	if (!request.session.isLoggedIn) {
		response.status(401).send("user not logged in");
		return;
	}

	const id = request.params.id;

	Photo.find({ user_id: id }, function (err, photos) {

		if (err) {
			console.error("Error in Photos: ", err);
			response.status(400).send(JSON.stringify(err));
			return;
		}
		if (photos.length === 0) {
			console.error("no photo ");
			response.status(400).send("photo not found");
			return;
		}
		// console.error("za yah we");
		// console.log(photos);
		let photoList = [];
		for (const photo of photos) {

			const photoObj = {
				_id: photo._id,
				date_time: photo.date_time,
				file_name: photo.file_name,
				user_id: photo.user_id,
				// comments: photo.comments,
				comments: [],
				likedBy: photo.likedBy,
			};
			// console.log("bruh");
			// console.log(photo.comments);
			for (const comment of photo.comments) {
				// console.log(comment);
				const commentObj = {
					comment: comment.comment,
					date_time: comment.date_time,
					_id: comment._id,
					// end user-t id-aas gadna first_name, last_name uguh shaardlagatai baina.
					// tegwel UserPhoto dotor nemelt uurchlult hiihgui
					user: { _id: comment.user_id },
				};
				photoObj.comments.push(commentObj);
			}
			photoList.push(photoObj);
		}

		let addAuthorDetails = (photo, callback0) => {

			// let id = singlePhoto;
			async.each(photo.comments, function (comment, callback1) {
				let user_id = comment.user._id;
				User.findOne({ _id: user_id }, function (err1, author) {
					if (!err1) {
						let authorDetails = {
							_id: author._id,
							first_name: author.first_name,
							last_name: author.last_name,
						};
						comment.user = authorDetails;
					}
					callback1(err1);
				});
			}, function (err2) {
				callback0(err2);
			});
		};

		let done = (err3) => {
			if (err3) {
				response.status(400).send(JSON.stringify(err3));
			}
			else {
				// console.log("user photos amjilttai");
				photoList = photoList.sort((photo1, photo2) => {
					if (photo1.likedBy.length < photo2.likedBy.length) return 1;
					if (photo1.likedBy.length > photo2.likedBy.length) return -1;
					// if(photo1.date_time < photo2.date_time) return -1;
					console.log(photo1.date_time - photo2.date_time);
					return -1 * (photo1.date_time - photo2.date_time);
				});
				response.status(200).send(photoList);
			}
		};
		async.each(photoList, addAuthorDetails, done);
		//odoo photoList maani user ni: {_id } gesen gants value-taigaar belen bolson.

		// console.log(photoObj);


		// response.status(200).send(photoList);
		// console.log("------------Test------------");
		// return;
	});
});

app.post("/admin/login", function (request, response) {

	// console.log(request.body);
	const login_name = request.body.login_name;
	const password = request.body.password;
	User.findOne({ login_name: login_name }, function (err, user) {
		if (err) {
			console.log("error in logging || /admin/login", err);
			response.status(400).send(JSON.stringify(err));
			return;
		}
		if (!user) {
			console.log("no user found");
			response.status(400).send(JSON.stringify("Missing user"));
			return;
		}
		// const passwordObj = makePasswordEntry(password);
		if (!doesPasswordMatch(user.password_digest, user.salt, password)) {
			console.log("password does not match");
			response.status(400).send("unauthorized user");
			return;
		}
		// console.log("user succesfully logged in");
		request.session.isLoggedIn = true;
		request.session._id = user._id;
		request.session.first_name = user.first_name;
		request.session.last_name = user.last_name;

		const newActivity = Activity.create({
			user_id: request.session._id,
			activity_type: 2,
			object_id: null,
		});
		newActivity.then(function (activityObj) {
			activityObj.save();
		})
			.catch((err) => { console.log(err) });

		response.status(200).send({
			_id: user._id,
			last_name: user.last_name,
			first_name: user.first_name,
		});


	});

});

app.post("/admin/logout", function (request, response) {
	if (request.session.isLoggedIn) {

		const newActivity = Activity.create({
			user_id: request.session._id,
			activity_type: -2,
			object_id: null,
		});
		newActivity.then(function (activityObj) {
			activityObj.save();
		})
			.catch((err) => { console.log(err) });

		request.session.destroy(function (err) {
			if (err) console.log("logout: ", err);
		});
		response.status(200).send("user logged out succesfully");
	}
	else {
		console.log("user not logged in");
		response.status(400).send("user is not logged in");
	}
});


app.post("/user", function (request, response) {
	if (request.session.isLoggedIn) {
		// iim ym ch barag bolohgui l dee
		response.status(400).send("user is not logged out");
		return;
	}
	User.findOne({ login_name: request.body.login_name }, function (err, user) {
		if (err) {
			console.log("error in registering user");
			response.status(400).send(JSON.stringify(err));
			return;
		}
		if (!user) {
			const passObj = makePasswordEntry(request.body.password);
			// console.log("passObj", passObj);
			User.create({
				first_name: request.body.first_name,
				last_name: request.body.last_name,
				location: request.body.location,
				description: request.body.description,
				occupation: request.body.occupation,
				login_name: request.body.login_name,
				password_digest: passObj.hash,
				salt: passObj.salt,
			})

				.then(function (userObj) {
					userObj.save();
					request.session.isLoggedIn = true;
					request.session._id = userObj._id;
					request.session.first_name = userObj.first_name;
					request.session.last_name = userObj.last_name;

					const newActivity = Activity.create({
						user_id: request.session._id,
						activity_type: 1,
						object_id: null,
					});
					newActivity.then(function (activityObj) {
						activityObj.save();
					})
						.catch((err) => { console.log(err) });

					response.status(200).send({ _id: userObj._id, login_name: userObj.login_name });
					// console.log(newUser);
					// console.log("added user");

				})
				.catch((err1) => {
					console.error("Error register user", err1);
				});
			return;
		}
		response.status(400).send("login name is already in use");
	});
});

app.post("/commentsOfPhoto/:photo_id", function (request, response) {
	if (!request.session.isLoggedIn) {
		response.status(400).send("user not logged in");
		return;
	}
	if (request.body.comment.length === 0) {
		response.status(400).send("empty comment");
		return;
	}
	const photo_id = request.params.photo_id;

	Photo.findOne({ _id: photo_id }, function (err, photo) {

		if (err) {
			console.error("Error in finding photo (add comment)", err);
			response.status(400).send(err);
			return;
		}
		if (!photo) {
			console.error("no photos");
			response.status(400).send("photo not found");
			return;
		}

		let commentObj = {
			comment: request.body.comment,
			date_time: Date.now(),
			user_id: request.session._id,
		};
		photo.comments.push(commentObj);
		photo.save();
		commentObj = photo.comments[photo.comments.length - 1];
		const author = {
			user_id: request.session._id,
			first_name: request.session.first_name,
			last_name: request.session.last_name,
		};
		const newCommentObj = {
			_id: commentObj._id,
			comment: commentObj.comment,
			date_time: commentObj.date_time,
			user: author,
		};

		const newActivity = Activity.create({
			user_id: request.session._id,
			activity_type: 4,
			object_id: photo._id,
		});
		newActivity.then(function (activityObj) {
			activityObj.save();
		})
			.catch((err) => { console.log(err) });
		// console.log("commentObj: ", commentObj);
		response.status(200).send({ comment: newCommentObj });
	});
});

app.post("/photos/new", function (request, response) {
	if (!request.session.isLoggedIn) {
		response.status(400).send("user is not logged in");
		return;
	}

	processFormBody(request, response, function (err) {
		if (err || !request.file) {
			// XXX -  Insert error handling code here.
			if (err) {
				console.log("error in adding photo: ", err);
				response.status(400).send(err);
				return;
			}
			console.log("no file");
			response.status(400).send("no file specified");
			return;
		}

		// request.file has the following properties of interest:
		//   fieldname    - Should be 'uploadedphoto' since that is what we sent
		//   originalname - The name of the file the user uploaded
		//   mimetype     - The mimetype of the image (e.g., 'image/jpeg',
		//                  'image/png')
		//   buffer       - A node Buffer containing the contents of the file
		//   size         - The size of the file in bytes

		// XXX - Do some validation here.

		// We need to create the file in the directory "images" under an unique name.
		// We make the original file name unique by adding a unique prefix with a
		// timestamp.
		const timestamp = new Date().valueOf();
		const filename = 'U' + String(timestamp) + request.file.originalname;

		fs.writeFile("./images/" + filename, request.file.buffer, function (err1) {
			if (err) {
				console.log("error in writing photo", err1);
				response.status(400).send("error in writing file");
				return;
			}

			// XXX - Once you have the file written into your images directory under the
			// name filename you can create the Photo object in the database

			let newPhoto = Photo.create({
				file_name: filename,
				date_time: Date.now(),
				user_id: request.session._id,
				comments: [],
				likedBy: [],
			});
			newPhoto.then(function (photoObj) {
				photoObj.save();

				const newActivity = Activity.create({
					user_id: request.session._id,
					activity_type: 3,
					object_id: photoObj._id,
				});
				newActivity.then(function (activityObj) {
					activityObj.save();
				})
					.catch((err) => { console.log(err) });

				// console.log("photoObj:" ,photoObj);
				response.status(200).send("added photo successfully");
			})
				.catch((err2) => { console.log(err2); });
		});
	});

});

app.post("/likeDislike/:photo_id", function (request, response) {
	if (!request.session.isLoggedIn) {
		response.status(400).send("user is not logged in");
		return;
	}
	// request dotor:
	// photo_id
	// like eswel dislike bolohig iltgeh huwisagch
	// user_id-g session dotroos awchih baih.
	// eswel tuhain hun ni baiwal dislike gej uzeed, baihgui bol like geh ymu?
	// joohon udaan boloh bhda
	Photo.findOne({ _id: request.body.photo_id }, function (err, photo) {
		if (err) {
			console.error("Error in finding photo (like photo)", err);
			response.status(400).send(err);
			return;
		}
		if (!photo) {
			console.error("no photos");
			response.status(400).send("photo not found");
			return;
		}
		if (request.body.like) {
			photo.likedBy.push(request.session._id);
			photo.save();

			const newActivity = Activity.create({
				user_id: request.session._id,
				activity_type: 5,
				object_id: photo._id,
			});
			newActivity.then(function (activityObj) {
				activityObj.save();
			})
				.catch((err) => { console.log(err) });

			console.log("user %s liked photo %s.", request.session._id, request.body.photo_id);
			response.status(200).send("successully like photo");

		}
		else {
			// console.log("photo.likedBy", photo.likedBy);
			// console.log("_id:", request.session._id);
			photo.likedBy = photo.likedBy.filter((_id) => _id != request.session._id);
			photo.save();

			const newActivity = Activity.create({
				user_id: request.session._id,
				activity_type: -5,
				object_id: photo._id,
			});
			newActivity.then(function (activityObj) {
				activityObj.save();
			})
				.catch((err) => { console.log(err) });

			console.log("disliked photo");
			response.status(200).send("successfully disliked photo");

		}
		// odoo app.get photo deer sort hiij butsaahig nemj uguh heregtei dee.
	});

});

app.get("/activities", function (request, response) {
	if (!request.session.isLoggedIn) {
		response.status(400).send("user is not logged in");
		return;
	}
	Activity.find({}, function (err, activities) {
		if (err) {
			console.error("Error in activies", err);
			response.status(400).send(JSON.stringify(err));
			return;
		}
		if (activities.length === 0) {
			console.error("no activity");
			response.status(400).send("no activity");
			return;
		}
		// activities = activities.sort((act1, act2) => {
		// 	return act2.date_time - act1.date_time;
		// });
		activities = activities.sort((act1, act2) => act2.date_time - act1.date_time);
		response.status(200).send({ activities: activities.slice(0, 5) });
	});
})

app.get("/photo/:id", function (request, response) {
	if (!request.session.isLoggedIn) {
		response.status(401).send("user not logged in");
		return;
	}
	const id = request.params.id;
	Photo.findOne({ _id: id }, function (err, photo) {
		if (err) {
			console.log("error in finding photo", err);
			return;
		}
		if (!photo) {
			response.status(400).send("Missing photo");
			return;
		}
		let photoObj = {
			_id: photo._id,
			file_name: photo.file_name,
		}
		response.status(200).send(photoObj);
	})
})

app.get("/logged", function (request, response) {
	if (!request.session.isLoggedIn) {
		response.status(401).send("user not logged in");
		return;
	}
	let obj = {
		_id: request.session._id,
		first_name: request.session.first_name,
		last_name: request.session.last_name,
	}
	response.status(200).send(obj);
})

// delete comment
app.post("/delete/comment/:comment_id", function (request, response) {
	// photo_id, comment_id 2 heregtei.
	if (!request.session.isLoggedIn) {
		response.status(400).send("user is not logged in");
		return;
	}
	if (request.body.user_id != request.session._id) {
		console.log(request.body);
		response.status(400).send("not authorized");
		return;
	}
	Photo.findOne({ _id: request.body.photo_id }, function (err, photo) {
		if (err) {
			response.status(400).send("error in finding photo in deleting comment");
			return;
		}
		if (!photo) {
			response.status(400).send("photo not found in deleting message");
			return;
		}
		const comArr = photo.comments.filter((comment) => comment._id != request.body.comment_id);
		photo.comments = comArr;
		photo.save();
		Activity.create({
			user_id: request.session._id,
			activity_type: -4,
			object_id: request.body.photo_id,
		})
			.then(function (activityObj) {
				activityObj.save();
			})
			.catch((err) => console.log(err));
		response.status(200).send("deleted comment");
	})
});

app.delete("/delete/photo/:photo_id", function (request, response) {
	console.log("delete photo", request.params);
	console.log("user: ", request.session._id);
	if (!request.session.isLoggedIn) {
		response.status(400).send("user is not logged in");
		return;
	}

	Photo.findOneAndDelete({ _id: request.params.photo_id, user_id: request.session._id }, function (err, photo) {
		if (err) {
			console.log("error in deleting photo:", err);
			response.status(400).send("error in finding photo");
			return;
		}
		if (!photo) {
			console.log("did not find photo in deleting");
			response.status(400).send("did not find photo of user");
			return;
		}
		Activity.deleteMany({ object_id: request.params.photo_id });
		response.status(200).send("successfully deleted the photo");
	});


});
app.delete("/delete/user", function (request, response) {
	if (!request.session.isLoggedIn) {
		response.status(400).send("user is not logged in");
		return;
	}
	/**
	 * ustgah zuils:
	 * uuriinh ni activity +
	 * uuriinh ni zurag deerh buh activity
	 * uuriinh ni buh zurag
	 * uuriinh ni buh comment
	 * uuriinh ni buh like
	 * uuriinh ni account
	 * request.session.clear()
	 */
	let id = request.session._id;
	// yutai ch uuriing ni activity-g ustgay.
	Activity.deleteMany({ user_id: id })
		.then(() => {
			// Photo.find({user_id: request.session._id}, function( err, photos {

			// }))
		})

});

// activiy haruulah heseg.
const server = app.listen(3000, function () {
	const port = server.address().port;
	console.log(
		"Listening at http://localhost:" +
		port +
		" exporting the directory " +
		__dirname
	);
});
