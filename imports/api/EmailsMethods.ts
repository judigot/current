import { Meteor } from "meteor/meteor";
import { EmailsCollection, Email } from "./Emails";

Meteor.methods({
  async "emails.insert"({ value }: Pick<Email, "value">) {
    return await EmailsCollection.insertAsync({ value, createdAt: new Date() });
  },
  async "emails.getAll"() {
    return await EmailsCollection.find(
      {},
      { sort: { createdAt: -1 } }
    ).fetchAsync();
  },
});
