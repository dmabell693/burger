const connection = require("../config/connection");

printQuestionMarks = num => {
    const arr = [];

    for (let i = 0; i < num; i++) {
        arr.push("?");
    }

    return arr.toString();
}

// objToSql = obj => {
//     const arr = [];

//     for (let key in obj) {
//         let value = obj[key];

//         if (Object.hasOwnProperty.call(obj, key)) {
//             if (typeof value === "string" && value.indexOf(" ") >= 0) {
//                 value = "'" + value + "'";
//             }

//             arr.push(key + "=" + value);
//         }
//     }

//     return arr.toString();
// }

function objToSql(ob) {
    var arr = [];
  
    // loop through the keys and push the key/value as a string int arr
    for (var key in ob) {
      var value = ob[key];
      // check to skip hidden properties
      if (Object.hasOwnProperty.call(ob, key)) {
        // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
        if (typeof value === "string" && value.indexOf(" ") >= 0) {
          value = "'" + value + "'";
        }
        // e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
        // e.g. {sleepy: true} => ["sleepy=true"]
        arr.push(key + "=" + value);
      }
    }
  
    // translate array of strings to a single comma-separated string
    return arr.toString();
  }

const orm = {
    selectAll: function (tableInput, callback) {
        let queryString = "SELECT * FROM " + tableInput + ";";
        connection.query(queryString, function (err, results) {
            if (err) {
                throw err;
            }
            callback(results);
        });
    },

    insertOne: function (table, cols, vals, callback) {
        let queryString = "INSERT INTO " + table;

        queryString += " (";
        queryString += cols.toString();
        queryString += ") ";
        queryString += "VALUES (";
        queryString += printQuestionMarks(vals.length);
        queryString += ") ";

        console.log(queryString);

        connection.query(queryString, vals, function (err, result) {
            if (err) {
                throw err;
            }

            callback(result);
        });
    },

    updateOne: function (table, objColVals, condition, callback) {
        let queryString = "UPDATE " + table;

        queryString += " SET ";
        queryString += objToSql(objColVals);
        queryString += " WHERE ";
        queryString += condition;

        console.log(queryString);
        connection.query(queryString, function(err, result) {
            if (err) {
                throw err;
            }

            callback(result);
        });
    }
};

module.exports = orm;