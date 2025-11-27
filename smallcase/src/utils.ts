export function getRandomNumber(basePrice: number = 1000) {
    // Generate a price between 80% and 120% of the base price
    const min = basePrice * 0.8;
    const max = basePrice * 1.2;
    return Math.floor(Math.random() * (max - min) + min);
}