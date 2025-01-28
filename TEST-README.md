# File Upload Testing

This repository contains automated tests to verify the functionality of the file upload feature. It covers both positive and negative scenarios, along with some identified bugs.

## Design Approach Overview

This framework follows the Page Object Model (POM) design pattern, with deliberate design choices to prioritize debugging, simplicity, collaboration, and reusability. Below is an explanation of the approach and its benefits:

### Key Features of the Design

1. **Locators Inside Methods for Easier Debugging**  
   - Locators are purposefully kept inside the methods where they are used.  
   - This simplifies debugging, as the locator and its corresponding logic are in one place, avoiding unnecessary abstraction.  
   - When the UI changes, it’s easier to identify and update the affected locators without sifting through multiple files.  

2. **Adherence to the DRY Principle**  
   - **DRY (Don’t Repeat Yourself)** ensures that reusable logic and actions (e.g., filling forms, clicking buttons) are encapsulated into methods shared across the framework.  
   - This reduces redundancy and maintenance overhead while ensuring consistency in test execution.  

3. **KISS Principle in Action**  
   - **KISS (Keep It Stupid Simple)** is applied to ensure that the framework remains straightforward:  
     - The design is easy to understand, even for junior QA engineers.  
     - By avoiding over-engineering, the test framework is lightweight and intuitive to work with.  

4. **Dynamic Test Data**  
   - Test data is dynamically driven directly from the test case specification files.  
   - This eliminates hardcoding, ensures flexibility, and enables seamless updates to test cases without modifying the core framework.  

5. **Enhanced Collaboration**  
   - This approach is highly accessible to **junior QA automation engineers**, enabling them to contribute effectively without needing extensive knowledge of advanced design patterns.  
   - Collaboration is streamlined, and test preparation becomes significantly faster, as the framework is easy to grasp and extend.  


### Advantages of This Approach

1. **Improved Debugging**  
   - Locators are scoped within their respective methods, making it easier to trace and resolve issues when tests fail.  

2. **Reduced Maintenance Effort**  
   - UI changes require minimal updates since common actions and locators are centralized in reusable methods.  

3. **Accelerated Test Writing**  
   - Tests are intuitive, and the inclusion of dynamic test data allows for rapid test creation and execution.  

4. **Simplified Collaboration**  
   - The design supports both senior and junior engineers, enabling the entire QA team to contribute efficiently.  
   - Onboarding new engineers is quicker since the framework is designed to be easy to understand.  

5. **Faster Refactoring and Scalability**  
   - The framework is flexible and can adapt to changing requirements or new test scenarios without introducing unnecessary complexity.  

6. **Dynamic Test Execution**  
   - Using test case specification files to drive test data ensures flexibility, enabling tests to adapt dynamically to varying input scenarios.  


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

1. **To install Playwright for end-to-end testing:**
- npm init playwright@latest

2. **To Install Allure**
- brew install allure

3. **To install allure report in playwright**
- npm i -D @playwright/test allure-playwright

4. **To generate test result as report**
- allure generate allure-results -o allure-report --clean 

5. **To run the test for file upload feature**
- npx playwright test fileUpload.spec.ts --project=chromium
- npx playwright test fileUpload.spec.ts --project=firefox
- npx playwright test fileUpload.spec.ts --project=webkit

6. **To run the test for chatbot feature**
- npx playwright test chatbot.spec.ts --project=chromium

7. **To run the test for visual regression test**
- npx playwright test visualRegression.spec.ts

8. **To serve the report in web browser**
- allure serve allure-results