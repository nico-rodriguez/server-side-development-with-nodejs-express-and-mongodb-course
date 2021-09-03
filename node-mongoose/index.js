const mongoose = require('mongoose');

const Dishes = require('./models/dishes');


const URL = 'mongodb://localhost:27017/confusion';
const connect = mongoose.connect(URL);

connect.then((db) => {
  console.log('Connected to server!');

  let newDish = Dishes({
    name: 'Uthapizza',
    description: 'test'
  });

  newDish.save()
    .then((dish) => {
      console.log('Saved dish');
      console.log(dish);

      return Dishes.find({}).exec();
    })
    .then((dishes) => {
      console.log('Dishes collection:');
      console.log(dishes);

      return Dishes.deleteMany({});
    })
    .then(() => {
      console.log('Closing connection to server...');
      return mongoose.connection.close();
    })
    .catch((err) => {
      console.error(err);
    });
});