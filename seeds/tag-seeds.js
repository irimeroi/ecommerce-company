const { Tag } = require('../models');

const tagData = [
  {
    tag_name: 'size small/medium',
  },
  {
    tag_name: 'size large/extra large',
  },
  {
    tag_name: 'blue',
  },
  {
    tag_name: 'red',
  },
  {
    tag_name: 'green',
  },
  {
    tag_name: 'white',
  },
  {
    tag_name: 'size 5 to 7',
  },
  {
    tag_name: 'size 8 to 10',
  },
];

const seedTags = () => Tag.bulkCreate(tagData);

module.exports = seedTags;
