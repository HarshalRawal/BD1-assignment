import express from 'express';
import cors from 'cors';
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(cors());

const taxRate = 5;
const discountedPrice = 10;
const loyaltyRate = 2;

app.get('/cart-total', (req, res) => {
  let { newItemPrice, cartTotal } = req.query;
  newItemPrice = parseFloat(newItemPrice);
  cartTotal = parseFloat(cartTotal);
  if (isNaN(newItemPrice) || isNaN(cartTotal)) {
    return res
      .status(400)
      .send('Invalid input: newItemPrice and cartTotal must be numbers.');
  }
  return res.status(200).send((newItemPrice + cartTotal).toString());
});

//http://localhost:3000/membership-discount?cartTotal=3600&isMember=true
app.get('/membership-discount', (req, res) => {
  let { cartTotal, isMember } = req.query;

  // Parse and validate cartTotal
  cartTotal = parseFloat(cartTotal);
  if (isNaN(cartTotal)) {
    return res.status(400).json({ error: 'cartTotal must be a valid number.' });
  }

  // Convert isMember to boolean
  const member = isMember === 'true';

  // Calculate final price
  const finalPrice = member
    ? cartTotal - (cartTotal * discountedPrice) / 100
    : cartTotal;

  // Return structured JSON response
  return res.status(200).send(finalPrice.toString());
});

//http://localhost:3000/calculate-tax?cartTotal=3600

app.get('/calculate-tax', (req, res) => {
  let { cartTotal } = req.query;
  cartTotal = parseFloat(cartTotal);
  if (isNaN(cartTotal)) {
    return res.status(400).send(`cartTotal is not a number`);
  }
  const tax = (cartTotal * taxRate) / 100;
  return res.status(200).send(tax.toString());
});
app.listen(PORT, () => {
  console.log(`server running on Port ${PORT}`);
});

//http://localhost:3000/shipping-cost?weight=2&distance=600

app.get('/shipping-cost', (req, res) => {
  let { weight, distance } = req.query;
  weight = parseFloat(weight);
  distance = parseFloat(distance);
  if (isNaN(weight) || isNaN(distance)) {
    return res.status(400).send('weight and distance has to be a number');
  }
  const shippingCost = weight * distance * 0.1;
  return res.status(200).send(shippingCost.toString());
});

//http://localhost:3000/loyalty-points?purchaseAmount=3600

app.get('/loyalty-points', (req, res) => {
  const purchaseAmount = parseFloat(req.query.purchaseAmount);
  if (isNaN(purchaseAmount)) {
    return res.status(400).send(`purschaseAmount has to a number`);
  }
  const loyaltyPoint = loyaltyRate * purchaseAmount;
  return res.status(200).send(loyaltyPoint.toString());
});

//http://localhost:3000/estimate-delivery?shippingMethod=express&distance=600
app.get('/estimate-delivery', (req, res) => {
  let { shippingMethod, distance } = req.query;
  if (!shippingMethod || !distance) {
    return res
      .status(400)
      .send(`Both shippingMethod and distance are required`);
  }
  distance = parseFloat(distance);
  if (isNaN(distance)) {
    return res.status(400).send('Distance has to be a number');
  }
  let time;
  if (shippingMethod === 'express') {
    time = distance / 100;
    return res.status(200).send(time.toString());
  } else if (shippingMethod === 'standard') {
    time = distance / 50;
    return res.status(200).send(time.toString());
  } else {
    return res.status(400).send('invalid shipping Method');
  }
});
