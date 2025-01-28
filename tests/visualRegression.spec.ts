import { expect, test } from '@playwright/test';
import { QNAPage } from '../page-objects/qnaPage';

test.describe('visual regression tests', () => {
    let onQnaPage: QNAPage;
    test.beforeEach('should launch Web UI', async ({ page }) => {
        const url = 'http://localhost:8000/';
        await page.goto(url);
        const pageTitle = await page.title();
        expect(pageTitle).toBe('Vite + React + TS');
        expect(page.url()).toBe(url);
        await expect(page.getByRole('heading')).toHaveText('File Uploader and Question Answering System');
        onQnaPage = new QNAPage(page);
        await onQnaPage.deleteAllFiles();
    });

    test('should capture snapshot for visual regression', async () => {
        await onQnaPage.captureSnapshot();
    });
});