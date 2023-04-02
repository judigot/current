import { Meteor } from "meteor/meteor";
import { LinksCollection, Link } from "./Links";

Meteor.methods({
  async "links.getLinks"() {
    return LinksCollection.find({}).fetch();
  },
});
