// Function to format numbers with '.' as thousands separator
export const formatCurrency = (amount: string) => {
  return 'Rp '+amount
    .toString() // Convert number to string
    .split('') // Split the number into individual characters
    .reverse() // Reverse the string to make it easier to group digits
    .reduce((acc: string[], digit, index) => { // Explicitly define acc as string[]
      if (index % 3 === 0 && index !== 0) {
        acc.push('.'); // Add a dot every 3 digits
      }
      acc.push(digit); // Push the current digit
      return acc;
    }, []) // Initialize acc as an empty array of strings
    .reverse() // Reverse back to the correct order
    .join(''); // Join the array into a string
};
