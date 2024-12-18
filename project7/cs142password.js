
const {createHash, randomBytes} = require('node:crypto');



/**
 * Return a salted and hashed password entry from a clear text password.
 * @param {string} clearTextPassword
 * @return {object} passwordEntry where passwordEntry is an object with two
 * string properties:
 *    salt - The salt used for the password.
 *    hash - The sha1 hash of the password and salt.
 */
function makePasswordEntry(clearTextPassword) {
	const hash = createHash('sha1');
	const salt = randomBytes(8).toString("hex");
	
	hash.update(clearTextPassword + salt);
	const hashedWord = hash.digest("hex");
	// console.log("hashedWord: ", hashedWord);
	// console.log("salt:", salt);

	return {
		salt: salt,
		hash: hashedWord,
	}
}

/**
 * Return true if the specified clear text password and salt generates the
 * specified hash.
 * @param {string} hash
 * @param {string} salt
 * @param {string} clearTextPassword
 * @return {boolean}
 */
function doesPasswordMatch(hash, salt, clearTextPassword) {
	const saltedPassword = clearTextPassword+salt;

	const hashGenerator = createHash('sha1');

	const hashedPassword = hashGenerator.update(saltedPassword).digest('hex');

	return (hash === hashedPassword);

}

module.exports = {makePasswordEntry, doesPasswordMatch};