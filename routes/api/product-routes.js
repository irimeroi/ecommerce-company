const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
    // be sure to include its associated Category and Tag data
    try {
        const productData = await Product.findAll();
        res.status(200).json(productData);
    } catch (err) {
        res.status(500).json(err)
    }
});

// get one product
router.get('/:id', async (req, res) => {
    try {
        const productData = await Product.findByPk(req.params.id, {
            include: [Category, Tag]
        });
        if (!productData) {
            res.status(404).json({ message: 'No category found with this id' });
            return;
        }
        res.status(200).json(productData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// create new product
router.post('/', (req, res) => {
    /* req.body should look like this...
      {
        "product_name": "",
        "category_id": 1,
        "price": 200.00,
        "stock": 3,
        "tagIds": [1, 2, 3, 4]
      }
    */
    Product.create(req.body)
        .then((product) => {
            // this checks if there are tagIds in the req.body and then creates associations between the new product and the tags
            if (req.body.tagIds.length) {
                const productTagIdArr = req.body.tagIds.map((tag_id) => {
                    //it also creates an object with the product id and the new tag id
                    return {
                        product_id: product.id,
                        tag_id,
                    };
                });
                //creates multiple productTag records
                return ProductTag.bulkCreate(productTagIdArr);
            }
            res.status(200).json(product);
        })
        .then((productTagIds) => res.status(200).json(productTagIds))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    Product.update(req.body, {
        where: {
            id: req.params.id,
        },
    })
        .then((product) => {
            if (req.body.tagIds && req.body.tagIds.length) {

                ProductTag.findAll({
                    where: { product_id: req.params.id }
                }).then((productTags) => {
                    // extracts values from ProductTag
                    const productTagIds = productTags.map(({ tag_id }) => tag_id);
                    //it filters the tags_id values from req.body to ensure that only new tags are included in the newProductTag
                    const newProductTags = req.body.tagIds
                        .filter((tag_id) => !productTagIds.includes(tag_id))
                        .map((tag_id) => {
                            return {
                                product_id: req.params.id,
                                tag_id,
                            };
                        });

                    //filters the productTags to find the ones with tag_id values not present in the req.body.tagIds
                    //then extracts the id value of these records and stores them in the productTagsToRemove array
                    const productTagsToRemove = productTags
                        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
                        .map(({ id }) => id);
                    // runs both asynchronous actions (destroy and cready)
                    return Promise.all([
                        ProductTag.destroy({ where: { id: productTagsToRemove } }),
                        ProductTag.bulkCreate(newProductTags),
                    ]);
                });
            }

            return res.json(product);
        })
        .catch((err) => {
            // console.log(err);
            res.status(400).json(err);
        });
});

router.delete('/:id', async (req, res) => {
    try {
        const productData = await Product.destroy({
            where: { id: req.params.id }
        });
        if (!productData) {
            res.status(404).json({ message: 'No category found with this id' });
            return;
        }
        res.status(200).json(productData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
