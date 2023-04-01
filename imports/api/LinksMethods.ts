import { Meteor } from "meteor/meteor";
import { LinksCollection, Link } from "./links";

const getLinks = async () => {
  return await LinksCollection.find({});
};

Meteor.methods({
  async "links.getLinks"() {
    return LinksCollection.find({}).fetch();
  },
});
