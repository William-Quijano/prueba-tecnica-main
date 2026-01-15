import { test, expect } from '@playwright/test';
import { ProductPage } from './pages/ProductPage';

test.describe('Product Management E2E', () => {
  let productPage: ProductPage;
  const timestamp = Date.now();
  const productName = `Product ${timestamp}`;
  const productDesc = `Description ${timestamp}`;
  const updatedName = `Product ${timestamp} Edited`;
  
  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    await productPage.goto();
  });

  test('should perform full CRUD lifecycle', async ({ page }) => {
    // 1. Create Product
    console.log(`Creating product: ${productName}`);
    await productPage.createProduct(productName, productDesc, '150', 'Test Category', 'fake-image.png');
    
    // Verify creation success
    await expect(page.getByText(productName)).toBeVisible();

    // 2. Search Product
    await productPage.searchProduct(productName);
    // Wait for list to update (debounced)
    await page.waitForTimeout(1000); 
    await expect(page.getByText(productName)).toBeVisible();

    // 3. Update Product
    console.log(`Updating product to: ${updatedName}`);
    await productPage.updateProduct(productName, updatedName);
    
    // Verify update success
    await expect(page.getByText(updatedName)).toBeVisible();
    
    // 4. Delete Product
    console.log(`Deleting product: ${updatedName}`);
    await productPage.deleteProduct(updatedName);
    
    // Verify deletion
    await expect(page.getByText(updatedName)).not.toBeVisible();
  });
});
