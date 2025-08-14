async function sortProductsByPrice() {
    try {
        const response = await fetch('https://express-project-smoky.vercel.app/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Sort products by price (lowest to highest)
        const sortedProducts = data.sort((a, b) => a.price - b.price);
        
        console.log('Products sorted by price (lowest to highest):');
        console.log('==========================================');
        
        sortedProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - Price: $${product.price}`);
        });
        
        console.log(`\nTotal products: ${sortedProducts.length}`);
        
    } catch (error) {
        console.error('Error fetching products:', error.message);
    }
}

sortProductsByPrice();
