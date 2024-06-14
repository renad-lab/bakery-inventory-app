// const readline = require("readline");
// const fs = require("fs");
// const path = require("path");

// const inventoryFilePath = path.join(__dirname, "../data/inventory.json");
// const cartFilePath = path.join(__dirname, "../data/cart.json");

// function readInventoryFile() {
//   try {
//     const inventoryData = fs.readFileSync(inventoryFilePath, "utf8");
//     return JSON.parse(inventoryData);
//   } catch (error) {
//     console.error(`Error reading inventory file: ${error.message}`);
//     return [];
//   }
// }

// function writeInventoryFile(inventory) {
//   try {
//     const jsonInventory = JSON.stringify(inventory, null, 2);
//     fs.writeFileSync(inventoryFilePath, jsonInventory);
//     console.log("Inventory file updated successfully.");
//   } catch (error) {
//     console.error(`Error writing inventory file: ${error.message}`);
//   }
// }

// function readCartFile() {
//   try {
//     const cartData = fs.readFileSync(cartFilePath, "utf8");
//     return JSON.parse(cartData);
//   } catch (error) {
//     console.error(`Error reading cart file: ${error.message}`);
//     return [];
//   }
// }

// function clearCartFile() {
//   try {
//     const emptyCart = [];
//     const jsonCart = JSON.stringify(emptyCart, null, 2);
//     fs.writeFileSync(cartFilePath, jsonCart);
//     console.log("Cart file cleared successfully.");
//   } catch (error) {
//     console.error(`Error clearing cart file: ${error.message}`);
//   }
// }

// function performCheckout() {
//   let inventory = readInventoryFile();
//   let cart = readCartFile();

//   cart.forEach((cartItem) => {
//     const foundItem = inventory.find((invItem) => invItem.id === cartItem.id);
//     if (foundItem) {
//       foundItem.quantity -= cartItem.quantity;
//       if (foundItem.quantity < 0) {
//         foundItem.quantity = 0; // Ensure quantity doesn't go negative
//       }
//     } else {
//       console.log(`Item with ID ${cartItem.id} not found in inventory.`);
//     }
//   });

//   writeInventoryFile(inventory);
//   clearCartFile();
//   console.log("Checkout complete.");
// }
// // transfer to index.js use inquirer
// // function askForPaymentMethod() {
// //   const rl = readline.createInterface({
// //     input: process.stdin,
// //     output: process.stdout,
// //   });

// //   rl.question("Choose payment method (cash/card/giftcard): ", (answer) => {
// //     switch (answer.toLowerCase()) {
// //       case "cash":
// //         console.log("Payment by cash selected.");
// //         break;
// //       case "card":
// //         console.log("Payment by card selected.");
// //         break;
// //       case "giftcard":
// //         console.log("Payment by gift card selected.");
// //         break;
// //       default:
// //         console.log("Invalid payment method. Please try again.");
// //         rl.close();
// //         askForPaymentMethod();
// //         return;
// //     }
// //     performCheckout();
// //     rl.close();
// //   });
// // }

// module.exports = {
//   // askForPaymentMethod,
//   performCheckout,
// };

const fs = require("fs");
const path = require("path");

const inventoryFilePath = path.join(__dirname, "../data/inventory.json");
const cartFilePath = path.join(__dirname, "../data/cart.json");

function readInventoryFile() {
  try {
    const inventoryData = fs.readFileSync(inventoryFilePath, "utf8");
    return JSON.parse(inventoryData);
  } catch (error) {
    console.error(`Error reading inventory file: ${error.message}`);
    return [];
  }
}

function writeInventoryFile(inventory) {
  try {
    const jsonInventory = JSON.stringify(inventory, null, 2);
    fs.writeFileSync(inventoryFilePath, jsonInventory);
    console.log("Inventory file updated successfully.");
  } catch (error) {
    console.error(`Error writing inventory file: ${error.message}`);
  }
}

function readCartFile() {
  try {
    const cartData = fs.readFileSync(cartFilePath, "utf8");
    return JSON.parse(cartData);
  } catch (error) {
    console.error(`Error reading cart file: ${error.message}`);
    return [];
  }
}

function clearCartFile() {
  try {
    const emptyCart = [];
    const jsonCart = JSON.stringify(emptyCart, null, 2);
    fs.writeFileSync(cartFilePath, jsonCart);
    console.log("Cart file cleared successfully.");
  } catch (error) {
    console.error(`Error clearing cart file: ${error.message}`);
  }
}

async function performCheckout() {
  let inventory = readInventoryFile();
  let cart = readCartFile();
  cart.forEach((cartItem) => {
    // Check if cartItem is not null
    const foundItem = inventory.find((invItem) => invItem.id === cartItem.id);
    if (foundItem) {
      foundItem.quantity -= cartItem.quantity;
      console.log(foundItem.quantity);
      if (foundItem.quantity < 0) {
        console.log(foundItem.quantity);
        foundItem.quantity = 0; // Ensure quantity doesn't go negative
      }
    } else {
      console.log(`Item with ID ${cartItem.id} not found in inventory.`);
    }
  });

  writeInventoryFile(inventory);
  clearCartFile();
  console.log("Checkout complete.");
}

module.exports = {
  performCheckout,
};
