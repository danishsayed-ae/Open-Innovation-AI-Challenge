import { Page } from "playwright";
import { expect, request } from "@playwright/test";

export class QNAPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Uploads a supported single file
     * @param filePath Enter the file path
     * @param fileName Enter the file name
     */
    async uploadSupportedSingleFile(filePath, fileName) {
        await this.page.locator('input[type="file"]').setInputFiles(filePath);
        const uploadButton = this.page.locator('.items-center.space-x-2 button').first();
        await uploadButton.click();
        await expect(this.page.locator('.space-x-2.flex-grow .text-sm')).toHaveText(fileName);
    }

    /**
     * Verifies if the file was uploaded successfully
     * @param fileName Enter the file name
     */
    async verifyIfFileUploadedSuccessfully(fileNames) {
        const apiContext = await request.newContext({
            baseURL: 'http://localhost:8000',
        });

        const response = await apiContext.get('/documents/');
        expect(response.ok()).toBeTruthy();
        const documents = await response.json();
        for (let i = 0; i < fileNames.length; i++) {
            const uploadedDocument = documents.find(doc => doc.filename === fileNames[i]);
            expect(uploadedDocument).toBeDefined();
            expect(uploadedDocument.processed).toBe(false);
            expect(uploadedDocument.deleted).toBe(false);
        }
    }

    /**
     * Uploads an unsupported single file
     * @param filePath Enter the file path
     */
    async uploadUnsupportedSingleFile(filePath) {
        await this.page.locator('input[type="file"]').setInputFiles(filePath);
        const uploadButton = this.page.locator('.items-center.space-x-2 button').first();
        await uploadButton.click();
        const dialog = await this.page.waitForEvent('dialog');
        expect(dialog.message()).toBe('Failed to upload file. Please try again.');
        await dialog.accept();
    }

    /**
     * Uploads multiple supported files
     * @param filePaths Enter the file path
     * @param fileNames Enter the file name
     */
    async uploadSupportedMultipleFiles(filePaths, fileNames) {
        for (let i = 0; i < filePaths.length; i++) {
            // Set the file input using the file path
            await this.page.locator('input[type="file"]').setInputFiles(filePaths[i]);

            // Verify the upload button is enabled and click it
            const uploadButton = this.page.locator('.items-center.space-x-2 button').first();
            await expect(uploadButton).toBeEnabled();
            await uploadButton.click();

            // Verify that the uploaded file name is correctly displayed
            await expect(this.page.locator('.space-x-2.flex-grow .text-sm').nth(i)).toHaveText(fileNames[i]);
        }
    }

    /**
     * Processes all the uploaded files
     */
    async processAllUploadedFiles() {
        const fileRows = this.page.locator('.p-2.bg-secondary');
        const fileCount = await fileRows.count();

        for (let i = 0; i < fileCount; i++) {
            const statusLocator = fileRows.nth(i).locator('div.inline-flex');
            const processButton = fileRows.nth(i).getByRole('button', { name: 'Process file' });
            const statusText = await statusLocator.textContent();

            if (statusText === 'Unprocessed') {
                await expect(statusLocator).toHaveText('Unprocessed');
                await processButton.click();
                await expect.soft(this.page.locator('.lucide-loader-circle.animate-spin')).toBeVisible();
                await expect(statusLocator).toHaveText('Processed');
            }
            else {
                console.log('File already processed!');
            }
        }
    }

    /**
     * Deletes all the uploaded files
     */
    async deleteAllFiles() {
        const deleteButtons = this.page.locator('.flex.items-center.space-x-2').getByRole('button', { name: 'Delete file' });
        let fileCount = await deleteButtons.count();

        for (let i = 0; i < fileCount; i++) {
            const firstButton = deleteButtons.first();
            await expect(firstButton).toBeVisible();
            await firstButton.click();
        }
    }

    /**
     * Asks a question to the chatbot
     * @param question Enter the question you want to ask
     * @param expectedAnswer Enter the expected answer
     */
    async askSingleQuestion(question, expectedAnswer) {
        await this.page.getByRole('textbox', { name: 'Ask a question about the' }).fill(question);
        await this.page.getByRole('button', { name: 'Ask Question' }).click();
        const chatbotResponse = await this.page.locator('.space-y-4 .p-4').textContent();
        expect(chatbotResponse).toContain(expectedAnswer);
    }

    /**
     * Asks multiple questions to the chatbot
     * @param questionsAndAnswers Enter multiple questions and expected answers for the same
     */
    async askMultipleQuestions(questionsAndAnswers) {
        for (const { question, expected } of questionsAndAnswers) {
            await this.page.getByRole('textbox', { name: 'Ask a question about the' }).fill(question);
            const apiResponse = this.page.waitForResponse(response => response.url().includes('/qna/') && response.status() === 200);
            await this.page.getByRole('button', { name: 'Ask Question' }).click();
            await apiResponse;
            const chatbotResponse = await this.page.locator('.space-y-4 .p-4').textContent();
            expect.soft(chatbotResponse).toContain(expected);
        }
    }

    /**
     * Captures a snapshot of the QnA page for visual regression testing
     */
    async captureSnapshot() {
        await expect(this.page).toHaveScreenshot('qna-page.png');
    }

}