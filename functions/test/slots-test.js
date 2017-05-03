const _ = require("lodash");
const slots = require("../slots")(config.admin);

describe("Slots", function () {
  describe("generateTopics", () => {
    it("handles groups of 1", () => {
      let uids = ['a'];
      let topics = slots.generateTopics(2, uids);

      let topicIds = Object.keys(topics);
      assert.equal(topicIds.length, 1);

      let topic = topics[topicIds[0]];
      assert.equal(topic.data.id, topicIds[0]);
      assert.ok(topic.data.name);
      assert.deepEqual(topic.members, uids);
    });

    it("handles groups of <groupSize>", () => {
      let uids = ['a', 'b'];
      let topics = slots.generateTopics(2, uids);

      let topicIds = Object.keys(topics);
      assert.equal(topicIds.length, 1);

      let topic = topics[topicIds[0]];
      assert.equal(topic.data.id, topicIds[0]);
      assert.ok(topic.data.name);
      assert.deepEqual(topic.members, uids);
    });

    it("doesn't leave anyone on their own", () => {
      let uids = ['a', 'b', 'c'];
      let topics = slots.generateTopics(2, uids);

      let topicIds = Object.keys(topics);
      assert.equal(topicIds.length, 1);

      let topic = topics[topicIds[0]];
      assert.equal(topic.data.id, topicIds[0]);
      assert.ok(topic.data.name);
      assert.deepEqual(topic.members, uids);
    });

    it("creates multiple groups", () => {
      let uids = ['a', 'b', 'c', 'd'];
      let topics = slots.generateTopics(2, uids);

      let topicIds = Object.keys(topics);
      assert.equal(topicIds.length, 2);

      _.each(topics, topic => {
        assert.equal(topic.members.length, 2);
      });
    });
  })
});
