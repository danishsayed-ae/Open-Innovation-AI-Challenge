# File Upload Testing

This repository contains automated tests to verify the functionality of the file upload feature. It covers both positive and negative scenarios, along with some identified bugs.


## Bugs

1. **UI Alignment Issue**: The "Choose File" button is not vertically center-aligned.
2. **Error Details**: The error message should include the details of the supported file types and size.
3. **Supported File Types**: The system should inform the user of the supported file types when selecting files.
4. **File Section Reset**: After clicking the upload button, the "Choose File" section should be cleared to indicate that another file can be uploaded.
5. **Processing Failure on Hover**: After a failed upload, hovering over the play or delete buttons shows "no file chosen" instead of the proper file status.
6. **File Deletion After Refresh**: After uploading a document, refreshing the page should clear the uploaded documents.
7. **API Response After Delete**: The API does not return a response after a document is deleted. It should return an informative message like "file deleted successfully".
8. **API Response After File Upload**: The API should have a status field to indicate the status of upload such as true/false.
9. **Server Error**: The API is throwing 500 internal server error for the following question "Is the transaction amount more than 500?"
    Steps to reproduce:
    1. Launch the Web UI
    2. Upload transaction receipt document
    3. Process the document
    4. Click on the chatbot and ask the following question: "Is the transaction amount more than 500?"
    5. Wait for the API response


## Installation Instructions

### To install Playwright for end-to-end testing:
npm init playwright@latest

### To Install Allure
brew install allure

### To install allure report in playwright
npm i -D @playwright/test allure-playwright

### To generate test result as report
allure generate allure-results -o allure-report --clean 

### To run the test for file upload feature
npx playwright test fileUpload.spec.ts --project=chromium
npx playwright test fileUpload.spec.ts --project=firefox
npx playwright test fileUpload.spec.ts --project=webkit

### To run the test for chatbot feature
npx playwright test chatbot.spec.ts --project=chromium
npx playwright test chatbot.spec.ts --project=firefox
npx playwright test chatbot.spec.ts --project=webkit 


### To serve the report in web browser
allure serve allure-results