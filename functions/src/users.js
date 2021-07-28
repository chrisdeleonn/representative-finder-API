const admin = require('firebase-admin')
const fbcreds = require('../credentials.json')

function connectDB() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(fbcreds),
    })
  }
  return admin.firestore()
}

exports.getUser = (req, res) => {
  const db = connectDb()

  db.collection('users')
    .where('email', '==', req.params.email)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const user = doc.data()
        user.id = doc.id
        res.status(200).json({
          status: 'success',
          data: user,
          message: 'User found',
          statusCode: 200,
        })
      })
    })
    .catch((err) => res.status(500).send('User could not be found'))
}

exports.createUser = (req, res) => {
  const db = connectDb()

  db.collection('users')
    .add(req.body)
    .then((docRef) => res.send({ id: docRef.id }))
    .catch((err) => res.status(500).send('User could not be created'))
}
