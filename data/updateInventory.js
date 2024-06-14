const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/inventory.json");

// Function to read the inventory data from inventory.json
const readInventory = () => {
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading inventory.json:", error);
    return [];
  }
};

// Function to write updated inventory data to inventory.json
const writeInventory = (inventory) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(inventory, null, 2));
    console.log("Inventory data saved successfully.");
  } catch (error) {
    console.error("Error writing inventory.json:", error);
  }
};

// Function to update quantities randomly for items with zero quantity
const updateInventory = () => {
  let inventory = readInventory();

  inventory.forEach((item) => {
    if (item.quantity === 0) {
      item.quantity = getRandomQuantity();
    }
  });

  writeInventory(inventory);
};

// Function to generate a random quantity between 1 and 100 (inclusive)
const getRandomQuantity = () => {
  return Math.floor(Math.random() * 100) + 1;
};

// Export the updateInventory function to be used elsewhere
module.exports = {
  updateInventory,
};

// Call updateInventory function to update inventory quantities
updateInventory();
