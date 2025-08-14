import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Product Data Fetcher",
  version: "1.0.0"
});

async function getProductInfo() {
    try {
        const response = await fetch('https://express-project-smoky.vercel.app/products')
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return { success: true, products: data }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

async function getProductById(productId) {
    try {
        const response = await fetch(`https://express-project-smoky.vercel.app/products/${productId}`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return { success: true, product: data }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

async function searchProducts(query) {
    try {
        const response = await fetch('https://express-project-smoky.vercel.app/products')
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        
        // Filter products based on query (search in name, description, etc.)
        const filteredProducts = data.filter(product => 
            product.name?.toLowerCase().includes(query.toLowerCase()) ||
            product.description?.toLowerCase().includes(query.toLowerCase()) ||
            product.category?.toLowerCase().includes(query.toLowerCase())
        )
        
        return { 
            success: true, 
            query: query,
            totalFound: filteredProducts.length,
            products: filteredProducts 
        }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

server.tool('getProductDetails', {
    description: "Fetch all product details from the API",
    handler: async() => {
        const productData = await getProductInfo()
        return {content: [{ type: "text", text: JSON.stringify(productData, null, 2) }]};
    }
})

server.tool('getProductById', {
    description: "Fetch a specific product by its ID",
    parameters: z.object({
        productId: z.string().describe("The ID of the product to fetch")
    }),
    handler: async({productId}) => {
        const productData = await getProductById(productId)
        return {content: [{ type: "text", text: JSON.stringify(productData, null, 2) }]};
    }
})

server.tool('searchProducts', {
    description: "Search products by name, description, or category",
    parameters: z.object({
        query: z.string().describe("Search term to find products")
    }),
    handler: async({query}) => {
        const searchResults = await searchProducts(query)
        return {content: [{ type: "text", text: JSON.stringify(searchResults, null, 2) }]};
    }
})

async function init(params) {
    console.error('runnig server')
const transport = new StdioServerTransport();
await server.connect(transport);
    
}

init()
