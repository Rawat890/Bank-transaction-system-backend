import app from "./src/app.js";
import { PORT } from './src/config/config.js';
import connectDB from './src/db/db.js';

connectDB();
app.listen(PORT, () => {
 console.log("Server started at port - ", PORT)
});