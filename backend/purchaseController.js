const Purchase = require("./purchaseModel");

const getPurchases = (req, res, next) => {
  Purchase.find()
    .then((result) => {
      res.json({ result });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
};

const addPurchase = (req, res, next) => {
  const purchaseData = req.body; // This is the array of items with purchaseId

  // Insert the items grouped by purchaseId
  const groupedData = purchaseData.reduce((acc, item) => {
    if (!acc[item.purchaseId]) {
      acc[item.purchaseId] = [];
    }
    acc[item.purchaseId].push({
      _id: item._id,
      userid: item.userid,
      id: item.id,
      title: item.title,
      date: item.date,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
    });
    return acc;
  }, {});

  // Convert the grouped data into an array of purchase objects
  const purchases = Object.keys(groupedData).map((purchaseId) => ({
    purchaseId: purchaseId,
    items: groupedData[purchaseId],
  }));

  // Save the purchase data to the database
  Purchase.insertMany(purchases)
    .then((result) => {
      res.json({ success: true, data: result });
    })
    .catch((error) => {
      res.json({ success: false, message: error.message });
    });
};

const deletePurchase = (req, res, next) => {
  const { id } = req.body;
  Purchase.deleteOne({ id })
    .then((result) => {
      res.json({ result });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
};

const updatePurchase = (req, res, next) => {
  const { id, title, price, category, rating, imageUrl } = req.body;
  Purchase.updateOne(
    { id },
    {
      title,
      price,
      category,
      rating,
      imageUrl,
    }
  )
    .then((result) => {
      res.json({ result });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
};

exports.getPurchases = getPurchases;
exports.addPurchase = addPurchase;
exports.deletePurchase = deletePurchase;
exports.updatePurchase = updatePurchase;
