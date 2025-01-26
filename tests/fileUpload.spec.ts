import { expect, test } from '@playwright/test';
import { QNAPage } from '../page-objects/qnaPage';

test.beforeEach('should launch Web UI and clean up files', async ({ page }) => {
    const url = 'http://localhost:8000/';
    await page.goto(url);
    const pageTitle = await page.title();
    expect(pageTitle).toBe('Vite + React + TS');
    expect(page.url()).toBe(url);
    await expect(page.getByRole('heading')).toHaveText('File Uploader and Question Answering System');
});

test('should upload a supported single file', async ({ page }) => {
    const onQnaPage = new QNAPage(page);
    await onQnaPage.uploadSupportedSingleFile();
    await onQnaPage.deleteAllFiles();
});

test('should NOT upload an unsupported single file', async ({ page }) => {
    const onQnaPage = new QNAPage(page);
    await onQnaPage.uploadUnsupportedSingleFile();
});

test('should upload and process a single supported file', async ({ page }) => {
    const onQnaPage = new QNAPage(page);
    await onQnaPage.uploadSupportedSingleFile();
    await onQnaPage.processUploadedFile();
    await onQnaPage.deleteAllFiles();
});

test('should upload multiple supported files', async ({ page }) => {
    const onQnaPage = new QNAPage(page);
    await onQnaPage.uploadSupportedMultipleFiles();
    await onQnaPage.deleteAllFiles();
});

test('should process each multiple uploaded file individually', async ({ page }) => {
    const onQnaPage = new QNAPage(page);
    await onQnaPage.uploadSupportedMultipleFiles();
    await onQnaPage.processUploadedFile();
    await onQnaPage.deleteAllFiles();
});

test('should delete all uploaded files', async ({ page }) => {
    const onQnaPage = new QNAPage(page);
    await onQnaPage.uploadSupportedMultipleFiles();
    await onQnaPage.deleteAllFiles();
});