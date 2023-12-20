import express, { Express,Request,Response} from "express";
import bodyParser from "body-parser";
import {databaseConnector} from "../config/database.config";
import userRoutes from "../routes/user.route"
import leaveRoutes from "../routes/leave.route"
import leaveBalanceRoutes from "../routes/leave-balance.route"

const app: Express = express();
const port = 3000;

app.use(databaseConnector);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Base route!");
});

app.use("/user",userRoutes);
app.use("/leave",leaveRoutes);
app.use("/leave-balance",leaveBalanceRoutes);
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
