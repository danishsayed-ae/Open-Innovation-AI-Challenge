import { expect, test } from '@playwright/test';
import { QNAPage } from '../page-objects/qnaPage';
import path from 'path';

let onQnaPage: QNAPage;

const transactionReceiptFileName = 'transaction-receipt.pdf';
const laptopServiceInvoiceFileName = 'laptop-service-invoice.pdf';
const transactionReceiptPDFPath = path.resolve(__dirname, `../test-resources/${transactionReceiptFileName}`);
const laptopServiceInvoicePDFPath = path.resolve(__dirname, `../test-resources/${laptopServiceInvoiceFileName}`);
const question = 'What is the total amount?';
const expectedAnswer = 'The total amount is AED 100.0';
const notApplicableQuestion = 'What is the weather today?';
const notApplicableAnswer = 'Sorry, Question is not applicable to the documents submitted.';
const questionsAndAnswers = [
    { question: 'What is the total amount?', expected: 'AED 100.0' },
    { question: 'What is the status of the receipt?', expected: 'successful' },
    { question: 'What is the transaction date?', expected: '15 Jan 2025' },
    { question: 'How many banks are mentioned?', expected: 'Two banks' },
    { question: 'What is the reference number?', expected: '530PE3C6A5E5E800' },
    { question: 'What is the currency?', expected: 'AED' },
    { question: 'What is the beneficiary name?', expected: 'Sarfaraz Qureshi' },
];

test.describe('chatbot response tests', () => {
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

    test('should NOT respond accurately without uploading document', async () => {
        await onQnaPage.askSingleQuestion(question, notApplicableAnswer);
    });

    test('should NOT respond accurately without processing document', async () => {
        await onQnaPage.uploadSupportedSingleFile(transactionReceiptPDFPath, transactionReceiptFileName);
        await onQnaPage.askSingleQuestion(question, notApplicableAnswer);
    });

    test('should respond accurately for relevant question', async () => {
        test.setTimeout(60000);
        await onQnaPage.uploadSupportedSingleFile(transactionReceiptPDFPath, transactionReceiptFileName);
        await onQnaPage.verifyIfFileUploadedSuccessfully([transactionReceiptFileName]);
        await onQnaPage.processAllUploadedFiles();
        await onQnaPage.askSingleQuestion(question, expectedAnswer);
    });

    test('should respond accurately for irrelevant question', async () => {
        test.setTimeout(60000);
        await onQnaPage.uploadSupportedSingleFile(transactionReceiptPDFPath, transactionReceiptFileName);
        await onQnaPage.verifyIfFileUploadedSuccessfully([transactionReceiptFileName]);
        await onQnaPage.processAllUploadedFiles();
        await onQnaPage.askSingleQuestion(notApplicableQuestion, notApplicableAnswer);
    });

    test('should respond accurately for multiple questions', async () => {
        test.setTimeout(60000);
        await onQnaPage.uploadSupportedSingleFile(transactionReceiptPDFPath, transactionReceiptFileName);
        await onQnaPage.verifyIfFileUploadedSuccessfully([transactionReceiptFileName]);
        await onQnaPage.processAllUploadedFiles();
        await onQnaPage.askMultipleQuestions(questionsAndAnswers);
    });
});