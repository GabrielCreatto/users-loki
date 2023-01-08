import express, { Request, Response, Express } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../connections/users.connection";
import User from "../models/users.model";
import logger from '../utils/users.logger';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const newUser = req.body as User;
        logger.info({ message: `Started call: insert user.`, labels: { inputBody: newUser } });

        const result = await collections.users?.insertOne(newUser);
        console.log(result);

        if (result) {
            logger.info({ message: `Successfully created a new user with id ${result.insertedId}.`, labels: { result: result, statusCode: 201 } });
            res.status(201).send(`Successfully created a new user with id ${result.insertedId}.`);
        } else {
            logger.info({ message: `User cannot be inserted.`, labels: { statusCode: 500 } });
            res.status(500).send("Failed to create a new user.");
        }
    } catch (error) {
        console.log(error);
        logger.error({ message: `Failed to create a new user.`, labels: { error: error, statusCode: 400 } });
        res.status(400).send(error);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        logger.info({ message: `Started call: get user.`, labels: { params: id } });

        const query = { _id: new ObjectId(id) };
        const result = await collections.users?.findOne(query);

        if (result) {
            logger.info({ message: `Successfully got user by id ${result.insertedId}.`, labels: { result: result } });
            res.status(201).send(result);
        } else {
            logger.info({ message: `User not found.`, labels: { statusCode: 404 } });
            res.status(404).send("User not found.");
        }
    } catch (error) {
        console.log(error);
        logger.error({ message: `Failed to got user.`, labels: { error: error, statusCode: 400 } });
        res.status(400).send(error);
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        logger.info({ message: `Started call: get all users.` });

        const result = await collections.users?.find().toArray();

        if (result) {
            logger.info({ message: `Successfully got all users.`, labels: { result: result, statusCode: 201 } });
            res.status(201).send(result);
        } else {
            res.status(404).send("User not found.");
        }
    } catch (error) {
        console.log(error);
        logger.error({ message: `Failed to got all user.`, labels: { error: error, statusCode: 400 } });
        res.status(400).send(error);
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        logger.info({ message: `Started call: delete user.`, labels: { params: id } });

        const query = { _id: new ObjectId(id) };
        const result = await collections.users?.deleteOne(query);

        if (result && result.deletedCount) {
            logger.info({ message: `Successfully deleted user by id ${id}.`, labels: { result: result, statusCode: 202 } });
            res.status(202).send(`Successfully deleted user with id ${id}`);
        } else if (!result) {
            logger.info({ message: `Failed to deleted user with id ${id}.`, labels: { statusCode: 400 } });
            res.status(400).send(`Failed to deleted user with id ${id}`);
        } else if (!result.deletedCount) {
            logger.info({ message: `User with id ${id} does not exists.`, labels: { statusCode: 404 } });
            res.status(404).send(`User with id ${id} does not exists`);
        }
    } catch (error) {
        console.log(error);
        logger.error({ message: `Failed to delete user.`, labels: { error: error, statusCode: 400 } });
        res.status(400).send(error);
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const updatedUser: User = req.body as User;
        const query = { _id: new ObjectId(id) };
        logger.info({ message: `Started call: update user.`, labels: { inputBody: updatedUser } });

        const result = await collections.users?.updateOne(query, { $set: updatedUser });

        if (result && result.modifiedCount > 0) {
            logger.info({ message: `Successfully updated user by id ${id}.`, labels: { result: result, statusCode: 200 } });
            res.status(200).send(`Successfully updated user by id ${id}!`);
        } else if (result && result.modifiedCount === 0 && result.matchedCount === 1) {
            logger.info({ message: `User has no change.`, labels: { result: result, statusCode: 400 } });
            res.status(400).send(`User has no change!`);
        } else {
            logger.info({ message: `User with id: ${id} does't exists.`, labels: { statusCode: 404 } });
            res.status(404).send(`User with id: ${id} does't exists!`);
        }
    } catch (error) {
        console.error(error);
        logger.error({ message: `Failed to update user.`, labels: { error: error, statusCode: 400 } });
        res.status(400).send(error);
    }
});

export default router