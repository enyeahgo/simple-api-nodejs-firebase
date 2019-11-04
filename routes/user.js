const express = require('express')
const bodyParser = require('body-parser')
var admin = require("firebase-admin")
var serviceAccount = require("firebase-admin/service-account.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://create-cheap-commerce.firebaseio.com"
})


let usersdb = admin.database()
let ref = usersdb.ref("Users")

const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))

// api for adding user
router.post('/create_user', (req, res) => {

    var user_id = ref.push().key;
    var userRef = ref.child(user_id);
    userData = req.body
    userData.id = user_id

    userRef.set(userData).then(user => {
        console.log('User inserted!')
        var result = { success: true, message: 'User inserted with user id: ' + user_id }
        result = JSON.parse(JSON.stringify(result));
        res.send(result);
    }).catch(error => {
        var result = { success: false, message: error.message }
        result = JSON.parse(JSON.stringify(result));
        res.send(result);
    })
});

// api for getting all users
router.get('/users', (req, res) => {
    let users_array = []
    var query = ref.orderByKey();
    query.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                // key will be "ada" the first time and "alan" the second time
                var key = childSnapshot.key;
                // childData will be the actual contents of the child
                var childData = childSnapshot.val();
                users_array.push(childData)
            });
            console.info(users_array)
            result = JSON.stringify(users_array);
    		res.send(result);

        }).catch(error => {
            res.json({ success: false, message: error.message });
        });
});

// api for updating user
router.get('/update/:user_id', (req, res) => {

    user_id = req.params.user_id;
    userObj = req.params;

    ref.child(user_id).update(userObj).then(user => {
        console.info(user)
        res.json({ success: true, message: 'User Updated.' });
    }).catch(error => {
        res.json({ success: false, message: error.message });
    })
});

// api to delete a user
router.get('/delete/:user_id', (req, res) => {

    user_id = req.params.user_id;

    ref.child(user_id).remove().then(user => {
        console.info(user)
        res.json({ success: true, message: 'User Deleted.' });
    }).catch(error => {
        res.json({ success: false, message: error.message });
    })
});

module.exports = router