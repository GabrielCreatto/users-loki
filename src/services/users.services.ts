import express, { Request, Response, Express } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../connections/users.connection";
import User from "../models/users.model";
import logger from '../utils/users.logger';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const newUser = req.body as User;
        const result = await collections.users?.insertOne(newUser)
        console.log(result)

        result
            ? res.status(201).send(`Successfully created a new user with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new user.");
    } catch (error) {
        console.log(error);
        logger.error({message: error, labels: {statusCode: 400}});
        res.status(400).send(error);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const query = { _id: new ObjectId(id) };
        const result = await collections.users?.findOne(query);

        result
            ? res.status(201).send(result)
            : res.status(404).send("User not found.");
    } catch (error) {
        console.log(error);
        logger.error({message: error, labels: {statusCode: 400}});
        res.status(400).send(error);
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await collections.users?.find().toArray();

        result
            ? res.status(201).send(result)
            : res.status(404).send("User not found.");
    } catch (error) {
        console.log(error);
        logger.error({message: error, labels: {statusCode: 400}});
        res.status(400).send(error);
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const query = { _id: new ObjectId(id) };
        const result = await collections.users?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed user with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove user with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`User with id ${id} does not exist`);
        }

    } catch (error) {
        console.log(error);
        logger.error({message: error, labels: {statusCode: 400}});
        res.status(400).send(error);
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
  
    try {
        const updatedUser: User = req.body as User;
        const query = { _id: new ObjectId(id) };
      
        const result = await collections.users?.updateOne(query, { $set: updatedUser});
  
        if (result && result.modifiedCount > 0) {
            res.status(200).send(`Successfully updated user with id ${id}!`);
        } else if (result && result.modifiedCount === 0 && result.matchedCount === 1) {
            res.status(400).send(`User has no change!`);
        } else {
            res.status(404).send(`User with id: ${id} don't exists!`);
        }
    } catch (error) {
        console.error(error);
        logger.error({message: error, labels: {statusCode: 400}});
        res.status(400).send(error);
    }
  });

export default router