d// -- Follow moongose docs --- // 
// How to use mongoDB with nodeJs app using mongoose (ODM) and perfrom CRUD Operations 
// require module
const mongoose = require('mongoose');
// set strictQuery : false || necessary after mongoose latest update 
mongoose.set('strictQuery', false);
// connection to local server db
mongoose.connect('mongodb://127.0.0.1:27017/peopleDB');

// fruit schema
const fruitSchema = new mongoose.Schema({
    name: {
        // data validation
        type: String, 
        required: [true, "Please check your data entry, no name specified"]
    }, 
    rating: {
        // data validation
        type: Number, 
        min: 1,
        max: 10
    }, 
    review: String
});
// fruit model
const Fruit = mongoose.model("Fruit", fruitSchema);


// create schema
const personSchema = new mongoose.Schema({
    name: String,
    age: {
        // data validation
        type: Number, 
        min: 20, 
        max: 25
    },
    Home: String,
    // embedd document into another document
    // embedd fruit document inside property favouriteFruit inside person document
    favouriteFruit: fruitSchema
  });
  
// create model on schema
// Database -> PeopleDB // Collection -> People
// mongodb will automatically convert Person (singular) to people (plural)
const Person = mongoose.model('Person', personSchema);

// Create new fruit
const pineapple = new Fruit({
    name: "Pineapple",
    score: 9, 
    review: "Great fruit."
});
// save fruit to Fruit collection
pineapple.save();

// create document
const person = new Person({ 
    name: 'Krrish Singh',
    age: 21,
    Home: 'Sikandrabad',
    // add pineapple as embedd document to new person
    favouriteFruit: pineapple
 });
// save document in peopleDB as collection || NOTE: comment after executing once else will
// save again & again, work after running cmd - node app.js
person.save();

// array of documents
var arr = [
    {name: 'Kuldeep', age: 21, Home:'Delhi'},
    {name: 'kushverdhan', age: 22, Home: 'Lucknow'}, 
    {name: 'Manas Mishra', age: 22, Home: 'Gorakhpur'}
];

// Insert multiple documents in peopleDB
// Note: mongoose dropped callback support in many func like insertMany, deleteOne, findOne. || Read migrating to 7 dropped callback support || 
// Tip: Use chatGPT and refactor the code writtern using callback to async/await or promise.
// But, it's better to use your own mind and search your way through docs......


// Person.insertMany(arr, function(err){
//     if(err) {
//         console.log(err)
//     }
//     else{
//         console.log('Succesfully saved all the people to peopleDB');
//     } 
// });

// using Promise
Person.insertMany(arr)
 .then(() => {
    console.log("Successfully saved all the people to peopleDB");
 })
 .catch(error => {
    console.log(error);
 })

// How to read from DB -- find()
// Calling find() on Person Collection, passing a callback which either return the error or result which we call
// as People. 
// Won't work - Use promise or async/await 
// Person.find(function(error, People) {
//     if(error) {
//         console.log(error);
//     }
//     else {
//         // Close the connection after getting response from callback
//         // Now, we don't need to do close the connection manually using Ctrl + C everytime we run app.js in hyper 
//         moongose.connection.close();
//         // print individual person name
//         People.forEach(function(person){
//             console.log(person.name);
//         })
//     }
// })

// Using Promise
Person.find()
    .then(People => {
        // Close the connection after getting response from callback
        // Now, we don't need to do close the connection manually using Ctrl + C everytime we run app.js in hyper 
        // mongoose.connection.close();

        // print individual person name
        People.forEach(person => {
            console.log(person.name);
        });
    })
    .catch(error => {
        console.log(error);
    });

// Same code using async/await
// Find operation
/*
async function findRecord(){
try {
    const People = await Person.find().exec();
    mongoose.connection.close();
    People.forEach(person => {
        console.log(person.name);
    });
} catch (error) {
    console.log(error);
}
}; findRecord();

// Insert operation
async function insertRecord(){
try {
    await Person.insertMany(arr);
    console.log('Successfully saved all the people to peopleDB');
} catch (error) {
    console.log(error);
}}; insertRecord();
*/
// Update operation
// async function updateRecord() {
// try {
//     // const filter = { /* your filter criteria */ };
//     // const update = { /* your update data */ };
//     // updateOne(filter, update);
// await Person.updateOne({_id: "65c9cf09f27885e48e286bbb"}, {name: "Harsh Singh"});
//         console.log("Successfully update the document")
// } catch (error) {
//     console.log(error);
// }
// };
// updateRecord();

// Update using promise
Person.updateOne({_id: "65c9cf1640df64d6265ec24b"}, {name: "Harsh Singh"})
    .then(result => {
        console.log("Document updated successfully");
        console.log(result); // Optional: Log the update result
    })
    .catch(error => {
        console.log("Error updating document:", error);
    });

// async function deleteRecord(){
//     try{
//         await Person.deleteOne({name : "Harsh Singh"})
//         console.log("deleted Successfully")
//     }
//     catch(error){
//         console.log(error);
//     }}
//     // Don't close the connection above!
// deleteRecord(); 
// --> deleteMany Same syntax 

// MongoNotConnectedError if this connection is close then won't able to delete or modify in db
// mongoose.connection.close();

/* Most Used Commands in mongosh shell - 

    node app.js, moongosh
    show dbs
    use PersonDB
    show collections
    db.people.find() // show everything (Read)
    db.dropDatabase()
    db.collectionName.drop()
*/

// ** TADA !! **
// Now we know how to use & integrate Database with our backend node app (Using mongoose) 