import { Meteor } from "meteor/meteor";
import { LinksCollection, Link } from "./links";

Meteor.methods({
  async "links.getLinks"() {
    return LinksCollection.find({}).fetch();
  },
});
