import { type Page, type Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addProductButton: Locator;
  readonly searchInput: Locator;
  readonly productGrid: Locator;
  readonly dialogTitle: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly priceInput: Locator;
  readonly categoryInput: Locator;
  readonly imageInput: Locator;
  readonly saveButton: Locator;
  readonly deleteConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addProductButton = page.getByRole('button', { name: /(agregar|add product)/i });
    this.searchInput = page.getByPlaceholder(/(buscar|search)/i);
    this.productGrid = page.locator('.grid'); 
    this.dialogTitle = page.locator('[data-slot="dialog-title"]');
    this.nameInput = page.getByLabel(/(nombre|name)/i);
    this.descriptionInput = page.getByLabel(/(descripción|description)/i);
    this.priceInput = page.getByLabel(/(precio|price)/i);
    this.categoryInput = page.getByLabel(/(categoría|category)/i);
    this.imageInput = page.locator('input[type="file"]'); 
    this.saveButton = page.getByRole('button', { name: /(guardar|actualizar|crear|save|update|create)/i });
    this.deleteConfirmButton = page.getByRole('button', { name: /(eliminar|delete)/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async createProduct(name: string, desc: string, price: string, cat: string, imagePath: string) {
    await this.addProductButton.click();
    await expect(this.dialogTitle).toBeVisible();
    await this.fillForm(name, desc, price, cat, imagePath);
    await this.saveButton.click();
    // Wait for dialog to close
    await expect(this.dialogTitle).not.toBeVisible();
  }

  async updateProduct(oldName: string, newName: string) {
    // Find the product card via text look-up, then find the edit button within it.
    // Using a more robust locator approach:
    await this.page.locator('div').filter({ hasText: oldName }).getByRole('button').filter({ hasText: /edit/i }).first().click();
    
    await expect(this.dialogTitle).toBeVisible();
    await this.nameInput.fill(newName);
    await this.saveButton.click();
    await expect(this.dialogTitle).not.toBeVisible();
  }

  async deleteProduct(name: string) {
    // Find delete button near the product name.
    // In ProductGrid, Edit is first button, Delete is second button (variant destructive).
    // The destructive button usually has a trash icon.
    // We target the button that is inside the card filtering by the product name.
    const card = this.page.locator('div.border').filter({ hasText: name }).first();
    // Assuming the structure is Card -> Footer -> Actions. 
    // We verify if we can find the delete button by variant class 'bg-destructive' or 'destructive' variant class
    
    // Attempt to click the button with trash icon or specific class if aria-label is missing
    await card.locator('button').last().click(); // Assuming Delete is the last button in the footer
    
    await expect(this.page.getByText(/(are you sure|estás seguro)/i)).toBeVisible(); // Dialog title
    await this.deleteConfirmButton.click();
  }

  async searchProduct(term: string) {
    await this.searchInput.fill(term);
  }

  private async fillForm(name: string, desc: string, price: string, cat: string, imagePath: string) {
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(desc);
    await this.priceInput.fill(price);
    await this.categoryInput.fill(cat);
    
    // For file upload
    await this.imageInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from('this is a test image')
    });
  }
}
