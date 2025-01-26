# File Upload Testing

This repository contains automated tests to verify the functionality of the file upload feature. It covers both positive and negative scenarios, along with some identified bugs.

## Test Cases

- **Test Single File Upload**: Verifies uploading a single file.
- **Test Wrong Format File Upload**: Verifies uploading a file in an unsupported format.
- **Test Multiple File Upload**: Verifies uploading multiple files at once.
- **Test Single Upload Processing**: Verifies that a single file is processed correctly after upload.
- **Test Multiple Upload Processing**: Verifies that multiple files are processed correctly after upload.
- **Test Document Deletion**: Verifies that a document can be deleted successfully.

## Bugs

1. **UI Alignment Issue**: The "Choose File" button is not vertically center-aligned.
2. **Error Details**: The error message should include the details of the supported file types and size.
3. **Supported File Types**: The system should inform the user of the supported file types when selecting files.
4. **File Section Reset**: After clicking the upload button, the "Choose File" section should be cleared to indicate that another file can be uploaded.
5. **Processing Failure on Hover**: After a failed upload, hovering over the play or delete buttons shows "no file chosen" instead of the proper file status.
6. **File Deletion After Refresh**: After uploading a document, refreshing the page should clear the uploaded documents.
7. **API Response After Delete**: The API does not return a response after a document is deleted. It should return an informative message like "file deleted successfully".

## Installation Instructions

### Install Playwright

# To install Playwright for end-to-end testing:
npm init playwright@latest

# To Install Allure
brew install allure

# To install allure report in playwright
npm i -D @playwright/test allure-playwright

# To generate test result as report
allure generate allure-results -o allure-report --clean 

# To run the test
npx playwright test --project=chromium

# To serve the report in web browser
allure serve allure-results