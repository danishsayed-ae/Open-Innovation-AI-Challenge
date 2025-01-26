import { Page } from "playwright";
import { expect } from "@playwright/test";
import path from 'path';

const pdfFileName = 'sample.pdf';
const textFileName = 'sample.txt';
const docFileName = 'sample.docx';
const samplePDFPath = path.resolve(__dirname, `../test-resources/${pdfFileName}`);
const sampleTextPath = path.resolve(__dirname, `../test-resources/${textFileName}`);
const sampleDOCPath = path.resolve(__dirname, `../test-resources/${docFileName}`);

export class QNAPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async uploadSupportedSingleFile() {
        await this.page.locator('input[type="file"]').setInputFiles(samplePDFPath);
        const uploadButton = this.page.locator('.items-center.space-x-2 button').first();
        await expect(uploadButton).toBeEnabled();
        uploadButton.click();
        await expect(this.page.locator('.space-x-2.flex-grow .text-sm')).toHaveText(pdfFileName);
    }

    async uploadUnsupportedSingleFile() {
        await this.page.locator('input[type="file"]').setInputFiles(sampleDOCPath);
        const uploadButton = this.page.locator('.items-center.space-x-2 button').first();
        await expect(uploadButton).toBeEnabled();
        uploadButton.click();
        const dialog = await this.page.waitForEvent('dialog');
        expect(dialog.message()).toBe('Failed to upload file. Please try again.');
        await dialog.accept();
    }

    async uploadSupportedMultipleFiles() {
        await this.page.locator('input[type="file"]').setInputFiles(samplePDFPath);
        const uploadButton = this.page.locator('.items-center.space-x-2 button').first();
        uploadButton.click();
        await expect(this.page.locator('.space-x-2.flex-grow .text-sm').nth(0)).toHaveText(pdfFileName);
        await this.page.locator('input[type="file"]').setInputFiles(sampleTextPath);
        uploadButton.click();
        await expect(this.page.locator('.space-x-2.flex-grow .text-sm').nth(1)).toHaveText(textFileName);
    }

    async processUploadedFile() {
        const unprocessedFiles = this.page.locator('text=Unprocessed');
        const fileCount = await unprocessedFiles.count();

        for (let i = 0; i < fileCount; i++) {
            await expect(unprocessedFiles.nth(i)).toHaveText('Unprocessed');
            await this.page.getByRole('button', { name: 'Process file' }).nth(i).click();
            await expect.soft(this.page.locator('.lucide-loader-circle.animate-spin')).toBeVisible();
            const dialog = await this.page.waitForEvent('dialog');
            expect(dialog.message()).toBe('Failed to process document. Please try again.');
            await dialog.accept();
        }
    }

    async deleteAllFiles() {
        const deleteButtons = this.page.locator('.flex.items-center.space-x-2').getByRole('button', { name: 'Delete file' });
        let fileCount = await deleteButtons.count();

        for (let i = 0; i < fileCount; i++) {
            const firstButton = deleteButtons.first();
            await expect(firstButton).toBeVisible();
            await firstButton.click();
        }
    }

    async askQuestion() {
        await this.page.getByRole('textbox', { name: 'Ask a question about the' }).fill('Explain the uploaded file');
        await this.page.getByRole('button', { name: 'Ask Question' }).click();
        const dialog = await this.page.waitForEvent('dialog');
        expect(dialog.message()).toBe('Failed to ask question. Please try again.');
        await dialog.accept();
    }

    async captureSnapshot() {
        await expect(this.page).toHaveScreenshot('qna-page.png');
    }

}