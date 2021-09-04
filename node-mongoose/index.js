const mongoose = require('mongoose');

const Dishes = require('./models/dishes');


const URL = 'mongodb://localhost:27017/confusion';
const connect = mongoose.connect(URL);

connect.then((db) => {
  console.log('Connected to server!');

  Dishes.create({
    name: 'Uthapizza',
    description: 'test'
  })
  .then((dish) => {
    console.log('Created dish:');
    console.log(dish);

    console.log('Updating dish...');

    return Dishes.findByIdAndUpdate(dish._id, {
      $set: { description: 'Updated test' }
    }, {
      new: true
    }).exec();
  })
  .then((dish) => {
    console.log('Updated dish:');
    console.log(dish);

    dish.comments.push({
      rating: 5,
      comment: 'I\'m getting a sinking feeling!',
      author: 'Leonardo di Carpaccio'
    });

    return dish.save();
  })
  .then((dish) => {
    console.log('Updated dish comments:');
    console.log(dish);

    console.log('Dropping Dishes...');
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