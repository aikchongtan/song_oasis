/**
 * ===========================================
 * Export model functions as a module
 * ===========================================
 */
module.exports = (dbPoolInstance) => {
  // `dbPoolInstance` is accessible within this function scope

  let getAll = (callback) => {

    dbPoolInstance.query('SELECT * from products limit 20', (error, queryResult) => {
      if (error) {
        // invoke callback function with results after query has executed
        callback(error, null);
      } else {
        // invoke callback function with results after query has executed
        //console.log("Q Result rows /////////////////////////////////")
        //console.log(queryResult.rows)
        callback(null, queryResult.rows );
      }
    });
  };

  return {
    getAll
  };
};