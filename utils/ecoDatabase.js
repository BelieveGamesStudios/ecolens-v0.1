// This mock database maps MobileNet classes to Eco Data.
// In a real app, this would be an API call.

export const ecoDatabase = {
    "water bottle": {
        name: "Plastic Water Bottle",
        carbon: "82.8 g CO2",
        rating: "D", // A-F scale
        recycle: "Recyclable (PET #1)",
        tip: "Refill a reusable bottle to save 150+ bottles a year!",
        color: "#eab308" // Yellow warning
    },
    "coffee mug": {
        name: "Ceramic Mug",
        carbon: "High (Production)",
        rating: "B+",
        recycle: "Reusable",
        tip: "Use 500+ times to offset production footprint.",
        color: "#22c55e" // Green good
    },
    "cup": { // Catch-all for paper cups
        name: "Disposable Cup",
        carbon: "110 g CO2",
        rating: "F",
        recycle: "Hard to recycle (lined)",
        tip: "Bring your own tumbler next time.",
        color: "#ef4444" // Red bad
    },
    "cellular telephone": {
        name: "Smartphone",
        carbon: "60-80 kg CO2",
        rating: "C",
        recycle: "E-Waste / Trade-in",
        tip: "Keep for 3+ years to reduce impact.",
        color: "#f59e0b"
    },
    "laptop": {
        name: "Laptop Computer",
        carbon: "300+ kg CO2",
        rating: "C-",
        recycle: "E-Waste",
        tip: "Use power saving mode.",
        color: "#f59e0b"
    },
    "keyboard": {
        name: "Computer Keyboard",
        carbon: "25 kg CO2",
        rating: "C",
        recycle: "E-Waste",
        tip: "Look for bamboo or recycled plastic keyboards.",
        color: "#f59e0b"
    },
    "shoe": {
        name: "Footwear",
        carbon: "14 kg CO2",
        rating: "D+",
        recycle: "Specialty Recycling",
        tip: "Donate if wearable. Sneakers are hard to recycle.",
        color: "#f59e0b"
    },
    "running shoe": {
        name: "Running Shoe",
        carbon: "14 kg CO2",
        rating: "D+",
        recycle: "Nike Grind / Specialty",
        tip: "Buy durable shoes to reduce waste.",
        color: "#f59e0b"
    },
    "bag": { // plastic bag, shopping bag
        name: "Plastic Bag (Nylon)",
        carbon: "1.58 kg CO2/kg",
        rating: "F",
        recycle: "Store Drop-off Only",
        tip: "Switch to a reusable canvas tote.",
        color: "#ef4444"
    },
    "nylon": { // In case it picks up 'stocking' or similar
        name: "Nylon Material",
        carbon: "High Impact",
        rating: "F",
        recycle: "Difficult",
        tip: "Microplastics shed in wash. Use a Guppyfriend bag.",
        color: "#ef4444"
    },
    // --- BARCODES (Mock Data) ---
    // A generic map for when we scan a barcode
    "049000028904": { // Coca Cola 12oz
        name: "Coca-Cola Can (Aluminum)",
        carbon: "170g CO2",
        rating: "C",
        recycle: "Infinitely Recyclable",
        tip: "Aluminum is one of the most efficient materials to recycle.",
        color: "#eab308"
    },
    "078000088461": { // Dasani Water
        name: "Dasani Water (Plastic)",
        carbon: "80g CO2",
        rating: "D",
        recycle: "Recyclable (PET #1)",
        tip: "Tap water has 0g carbon footprint!",
        color: "#ef4444"
    },
    "default": {
        name: "Unknown Object",
        carbon: "?",
        rating: "?",
        recycle: "Check local guides",
        tip: "Scan a bottle, cup, phone, or laptop.",
        color: "#6b7280"
    }
};

export function getEcoData(predictionClass) {
    // Simple partial matching
    const key = Object.keys(ecoDatabase).find(k => predictionClass.includes(k));
    return ecoDatabase[key] || ecoDatabase["default"];
}
