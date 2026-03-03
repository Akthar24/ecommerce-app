```javascript
const OrderService = require('../services/OrderService');
const ProductService = require('../services/ProductService');

exports.createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body; // items: [{productId, quantity}]
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await ProductService.getProductById(item.productId);

      if (!product) {
        console.warn(`Product with id ${item.productId} not found. Skipping item.`);
        continue;
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await OrderService.createOrder(userId, orderItems, totalAmount);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
```