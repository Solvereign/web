"use strict";

const mongoose = require('mongoose');

/**
 * Create a Mongoose Schema.
 */
const activity = new mongoose.Schema({
	user_id: mongoose.Schema.Types.ObjectId,
	activity_type: Number,
	object_id: mongoose.Schema.Types.ObjectId,
	date_time: { type: Date, default: Date.now },
});
/*
esreg ni surug temdegtei.
1 - registering user +
2 - logging in user  ++
3 - adding photo +
4 - adding comment + comment-n bish, zurgiinh ni id-g hadgalchihsan
5 - liking photo ++
*/

/**
 * Create a Mongoose Model.
 */
const Activity = mongoose.model('Activity', activity);

/**
 * Make this available to our application.
 */
module.exports = Activity;
