const mongoose = require('mongoose')

exports.connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((res) => console.log(`MongoDB Connect: ${res.connection.host}`.cyan.underline.bold))
  .catch((e) => console.log(e.message))  
}