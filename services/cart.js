// const fs = require("fs");
// const path = require("path");
// const cartFilePath = path.join(__dirname, "..", "data", "cart.json");
// const { writeJsonFile, readJsonFile } = require("../helpers");

// const readCart = () => {
//   try {
//     const data = fs.readFileSync(cartFilePath, "utf-8");

//     return JSON.parse(data);
//   } catch (error) {
//     return [];
//   }
// };

// const writeCart = (cart) => {
//   fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2), "utf-8");
// };

// const addItemToCart = (itemId, quantity) => {
//   const cart = readCart();
//   const inventory = readJsonFile("./data", "inventory.json");
//   const item = inventory.find((item) => item.id === itemId);

//   for (let i = 0; i < quantity; i++) {
//     cart.push(item);
//   }

//   writeCart(cart);
// };

// const getCartTotals = () => {
//   const cart = readCart();
//   const inventory = readJsonFile("./data", "inventory.json");

//   let totalQuantity = 0;
//   let totalPrice = 0;

//   cart.forEach((cartItem) => {
//     if (cartItem) {
//       // Check if cartItem is not null
//       const item = inventory.find(
//         (inventoryItem) => inventoryItem.id === cartItem.id
//       );
//       if (item) {
//         totalQuantity += 1; // Assuming each cart item represents a single unit
//         totalPrice += item.priceInCents / 100;
//       } else {
//         console.log("Item not found in inventory for:", cartItem); // Log if item not found
//       }
//     } else {
//       console.log("Found null cart item, skipping...");
//     }
//   });

//   console.log("Total Quantity:", totalQuantity);
//   console.log("Total Price:", totalPrice.toFixed(2));

//   return { totalQuantity, totalPrice };
// };

// const emptyCart = () => {
//   writeCart([]);
// };

// module.exports = {
//   readCart,
//   addItemToCart,
//   getCartTotals,
//   emptyCart,
// };

const fs = require("fs");
const path = require("path");
const cartFilePath = path.join(__dirname, "..", "data", "cart.json");
const { writeJsonFile, readJsonFile } = require("../helpers");

const readCart = () => {
  try {
    const data = fs.readFileSync(cartFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeCart = (cart) => {
  fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2), "utf-8");
};

const addItemToCart = (itemId, quantity) => {
  const cart = readCart();
  const inventory = readJsonFile("./data", "inventory.json");
  const item = inventory.find((item) => item.id === itemId);

  if (item) {
    cart.push({ ...item, quantity: quantity });
  } else {
    console.log(
      `Item with ID ${itemId} not found in inventory, cannot add to cart.`
    );
  }

  writeCart(cart);
};

const getCartTotals = () => {
  const cart = readCart();
  const inventory = readJsonFile("./data", "inventory.json");

  let totalQuantity = 0;
  let totalPrice = 0;

  cart.forEach((cartItem) => {
    if (cartItem) {
      // Check if cartItem is not null
      const item = inventory.find(
        (inventoryItem) => inventoryItem.id === cartItem.id
      );
      if (item) {
        totalQuantity += 1; // Assuming each cart item represents a single unit
        totalPrice += item.priceInCents / 100;
      } else {
        console.log("Item not found in inventory for:", cartItem); // Log if item not found
      }
    } else {
      console.log("Item out-of-stock, sorry!, skipping...");
    }
  });

  console.log("Total Quantity:", totalQuantity);
  console.log("Total Price:", totalPrice.toFixed(2));

  return { totalQuantity, totalPrice };
};

const emptyCart = () => {
  writeCart([]);
};

module.exports = {
  readCart,
  addItemToCart,
  getCartTotals,
  emptyCart,
};
