import { expect, test } from '@playwright/test';
import { QNAPage } from '../page-objects/qnaPage';
import path from 'path';

const pdfFileName = 'sample.pdf';
const textFileName = 'sample.txt';
const docFileName = 'sample.docx';
const samplePDFPath = path.resolve(__dirname, `../test-resources/${pdfFileName}`);
const sampleTextPath = path.resolve(__dirname, `../test-resources/${textFileName}`);
const sampleDOCPath = path.resolve(__dirname, `../test-resources/${docFileName}`);
const filePaths = [samplePDFPath, sampleTextPath];
const fileNames = [pdfFileName, textFileName];

test.describe('file upload tests', () => {
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

    test('should upload a supported single file', async () => {
        await onQnaPage.uploadSupportedSingleFile(samplePDFPath, pdfFileName);
        await onQnaPage.verifyIfFileUploadedSuccessfully([pdfFileName]);
    });

    test('should delete a single uploaded file', async () => {
        await onQnaPage.uploadSupportedSingleFile(samplePDFPath, pdfFileName);
        await onQnaPage.verifyIfFileUploadedSuccessfully([pdfFileName]);
        await onQnaPage.deleteAllFiles();
    });

    test('should NOT upload an unsupported single file', async () => {
        await onQnaPage.uploadUnsupportedSingleFile(sampleDOCPath);
    });

    test('should upload and process a single supported file', async () => {
        await onQnaPage.uploadSupportedSingleFile(samplePDFPath, pdfFileName);
        await onQnaPage.verifyIfFileUploadedSuccessfully([pdfFileName]);
        await onQnaPage.processAllUploadedFiles();
    });

    test('should delete a single processed file', async () => {
        await onQnaPage.uploadSupportedSingleFile(samplePDFPath, pdfFileName);
        await onQnaPage.verifyIfFileUploadedSuccessfully([pdfFileName]);
        await onQnaPage.processAllUploadedFiles();
        await onQnaPage.deleteAllFiles();
    });

    test('should upload multiple supported files', async () => {
        await onQnaPage.uploadSupportedMultipleFiles(filePaths, fileNames);
        await onQnaPage.verifyIfFileUploadedSuccessfully(fileNames);
    });

    test('should process each multiple uploaded file individually', async () => {
        await onQnaPage.uploadSupportedMultipleFiles(filePaths, fileNames);
        await onQnaPage.verifyIfFileUploadedSuccessfully(fileNames);
        await onQnaPage.processAllUploadedFiles();
    });

    test('should delete all multiple uploaded files', async () => {
        await onQnaPage.uploadSupportedMultipleFiles(filePaths, fileNames);
        await onQnaPage.deleteAllFiles();
    });
});