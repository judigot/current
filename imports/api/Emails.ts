import { Mongo } from "meteor/mongo";

export interface Email {
  _id?: string;
  value: object;
  createdAt: Date;
}

export const EmailsCollection = new Mongo.Collection<Email>("emails");
