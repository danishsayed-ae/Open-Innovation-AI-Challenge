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

test('should ask question for uploaded file', async ({ page }) => {
    const onQnaPage = new QNAPage(page);
    await onQnaPage.askQuestion();
});