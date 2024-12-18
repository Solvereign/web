"use strict";

/**
 * This file tests the CS142 Project 2 JavaScript assignment problems. It prints
 * what it finds to the console log and updates the text being displayed in the
 * window with a summary of the results.
 */

/* eslint-env browser, node */
// huwisagchuudig hadgalah func/obj
const vars = (function() {
	const obj = {varDeclared: ["vars", "varDeclared"]};

	return {
		add(name, property) {
			if(typeof obj[name] === 'undefined') {
				obj[name] = property;
				// obj.push(name);
			}
		},

		get(name) {
			if(typeof obj[name] !== 'undefined') {
				return obj[name];
			}
			return 0;
		},

		set(name, property) {
			if(typeof obj[name] !== 'undefined') {
				obj[name] = property;
			}
		},

		list() {
			console.log(obj);
		},

	};
}());
// Result message for Problems 1-3
// vars.add("vars", "");
vars.add("p1Message", "SUCCESS");
vars.add("p2Message", "SUCCESS");
vars.add("p3Message", "SUCCESS");

// Keep track of all the var statements
// vars.add("varDeclared", ["varDeclared", "p1Message", "p2Message", "p3Message"]);

// Utility functions
function arraysAreTheSame(a1, a2) {
  if (!Array.isArray(a1) || !Array.isArray(a2) || a1.length !== a2.length) {
    return false;
  }
  for (var i = 0; i < a1.length; i += 1) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
}

// ************************* Test cs142MakeMultiFilter *************************

if (typeof cs142MakeMultiFilter !== "function") {
  console.error(
    "cs142MakeMultiFilter is not a function",
    typeof cs142MakeMultiFilter,
  );
  vars.set("p1Message", "FAILURE");
} else {
  var originalArray = [1, 2, 3];
  var filterFunc = window.cs142MakeMultiFilter(originalArray);

  var secondArray = [1, 2, 3, 4];
  var filterFuncTwo = window.cs142MakeMultiFilter(secondArray);

  if (typeof filterFunc !== "function") {
    console.error(
      "cs142MakeMultiFilter does not return a function",
      filterFunc,
    );
    vars.set("p1Message", "FAILURE");
  } else {
    var result = filterFunc();
    if (!arraysAreTheSame([1, 2, 3], result)) {
      console.error(
        "filter function with no args does not return the original array",
        result,
      );
      vars.set("p1Message", "FAILURE");
    }

    var callbackPerformed = false;
    result = filterFunc(
      function (item) {
        return item !== 2;
      }, 
      function (callbackResult) {
        callbackPerformed = true;
        if (!arraysAreTheSame([1, 3], callbackResult)) {
          console.error(
            "filter function callback does not filter 2 correctly",
            callbackResult,
          );
          vars.set("p1Message", "FAILURE");
        }
        if (!arraysAreTheSame([1, 2, 3], this)) {
          console.error(
            "filter function callback does not pass original array as this",
            this,
          );
          vars.set("p1Message", "FAILURE");
        }
      },
    );

    if (!callbackPerformed) {
      console.error("filter function callback not performed");
      vars.set("p1Message", "FAILURE");
    }

    if (result !== filterFunc) {
      console.error("filter function does not return itself", result);
      vars.set("p1Message", "FAILURE");
    }

    result = filterFunc(function (item) {
      return item !== 3;
    });
    if (result !== filterFunc) {
      console.error("filter function does not return itself 2", result);
      vars.set("p1Message", "FAILURE");
    }

    result = filterFunc();
    if (!arraysAreTheSame([1], result)) {
      console.error(
        "filter function callback does not filter 3 correctly", 
        result,
      );
      vars.set("p1Message", "FAILURE");
    }
    result = filterFuncTwo(
      function (item) {
        return item !== 1;
      }, 
      function (callbackResult) {
        if (!arraysAreTheSame([2, 3, 4], callbackResult)) {
          console.error(
            "second filter does not filter 1 (check for global variable usage)",
            callbackResult,
          );
          vars.set("p1Message", "FAILURE");
        }
        if (!arraysAreTheSame([1, 2, 3, 4], this)) {
          console.error(
            "filter function callback does not pass original array as this", 
            this,
          );
          vars.set("p1Message", "FAILURE");
        }
      },
    );
  }
}
console.log("Test cs142MakeMultiFilter:", vars.get("p1Message"));

// ************************ Test Cs142TemplateProcessor ************************

if (typeof Cs142TemplateProcessor !== "function") {
  console.error(
    "Cs142TemplateProcessor is not a function",
    typeof Cs142TemplateProcessor,
  );
  vars.set("p2Message", "FAILURE");
} else {
	vars.add("template", "My favorite month is {{month}} but not the day {{day}} or the year {{year}}");

  vars.add("dateTemplate", new window.Cs142TemplateProcessor(vars.get("template")));
	
  vars.add("dictionary",{ month: "July", day: "1", year: "2016" });
  vars.add("str", vars.get("dateTemplate").fillIn(vars.get("dictionary")));

  if (vars.get("str") !== "My favorite month is July but not the day 1 or the year 2016") {
    console.error("Cs142TemplateProcessor didn't work");
    vars.set("p2Message", "FAILURE");
  }
  
  vars.get("varDeclared").push("template");
  vars.get("varDeclared").push("dateTemplate");
  vars.get("varDeclared").push("dictionary");
  vars.get("varDeclared").push("str");
}
console.log("Test Cs142TemplateProcessor:", vars.get("p2Message"));

// *** Test to see if the symbols we defined are in the global address space ***

vars.get("varDeclared").forEach(function (sym) {
  if (window[sym] !== undefined) {
    console.error("Found my symbol", sym, "in DOM");
    vars.set("p3Message", "FAILURE");
  }
});
console.log("Test Problem 3:", vars.get("p3Message"));

// Store the result back into the global space under the object name
// cs142Project2Results
window.cs142Project2Results = {
  p1Message: vars.get("p1Message"),
  p2Message: vars.get("p2Message"),
  p3Message: vars.get("p3Message"),
};

// Once the browser loads our companion HTML in cs142-test-project2.html we
// update it with the results of our testing. This code will make more
// sense after the next project.
window.onload = function () {
  document.getElementById("cs142p1").innerHTML = vars.get("p1Message");
  document.getElementById("cs142p2").innerHTML = vars.get("p2Message");
  document.getElementById("cs142p3").innerHTML = vars.get("p3Message");
};
