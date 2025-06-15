const express = require('express');
const authroute = require('./routers/authRoute');
const cors = require('cors')
const booksRouter = require('./routers/book')

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json())


app.use('/auth', authroute);

app.use(express.urlencoded({ extended: true }));

// Use the books router
app.use("/api/books", booksRouter);




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});