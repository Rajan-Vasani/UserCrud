import express, { NextFunction, Router, Request, Response } from "express";
import { UserService } from "../services/user.service";
import User from "../entities/interfaces/user.interface";
import {
  UserCreateRequest,
  UserUpdateRequest,
} from "../entities/requests/user.request";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

const router: Router = express.Router();
const userService: UserService = new UserService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User[] = await userService.fetchUsers();
    res.json({ message: "data fetched successfully", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching user details");
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next) => {
  const userid = req.params.id;
  try {
    const user: User[] = await userService.fetchUserById(userid);
    res.json({ message: "data fetched successfully by id", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching user details by id");
  }
});

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const createRequest: UserCreateRequest = plainToClass(
      UserCreateRequest,
      req.body
    );
    const validationError = await validate(createRequest);
    if (validationError.length > 0) {
      res.status(400).json({ errors: validationError });
      return;
    }

    const user: User[] = await userService.createUser(createRequest);

    res.json({ message: "user created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in creating user");
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userid = req.params.id;
    const updateRequest: UserUpdateRequest = plainToClass(
      UserUpdateRequest,
      req.body
    );
    const validationError = await validate(updateRequest);
    if (validationError.length > 0) {
      res.status(400).json({ errors: validationError });
      return;
    }
    const user: User[] = await userService.updateUser(updateRequest, userid);
    console.log("user => ", user);
    if (user[0]) {
      res.json({ message: "user updated successfully" });
    } else {
      res.json({ message: "user not updated" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in updating user");
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const empId = req.params.id;
    try {
      const user: User[] = await userService.deleteUser(empId);
      console.log("delete => ", user);
      if (user[0]) {
        res.status(200).json("user deleted successfully");
      } else {
        res.status(500).json("user not deleted");
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json("Error in deleting employee: " + error.message);
      next(error);
    }
  }
);

export default router;
