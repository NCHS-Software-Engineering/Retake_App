# RetakeAppAustinJackMitch

## Project overview:
1. What the project does:
- This project lets teachers manage and give our their retakes more efficently by lettings students email them or signup directly though the website to take a retake. Teachers then see the test that they have to retake and give them retake questions based on what quetsions they got wrong durring the actual test. 
3. How does it work:
- This project works by using an ExpressJS server to make queries to the SQL database to manage data in the following tables users (teachers/students), classes, tests, questions, and retake requests. This is all accessiable by using our interface we render out to the client using EJS from our server. By using EJS we can make the UI look very easy to use while keeping the advanced logic in the backend. 
4. What platform requirements are specified:
- Windows/Linux
5. Installation requirements:
- Download newest verion of NodeJS
- Clone or download this repo
6. Instuctions on how to configure project so its runnable:
- Everythign configues automaticly when ran
7. Instuctions on how to run project:
- git clone [this repo]
- npm i
- npm start
8. High level desciption of your projects architecture:
- MVC (Model View Controller) Express handles routing and middleware and SQL holds datastrucure
9. Detailed description of project data schema:
- Uses SQL db
- Users: ID (INT) | username (STRING) | email (STRING) | password hash (TEXT) | role (STRING)
- classes: ID (INT) | Class Name (STRING) | teacherId (INT)
- tests: ID (INT) | test Name (STRING) | teacherId (INT)
- questions: ID (INT) | question num (INT) | question (STRING) 
10. Capture all user stories that remain in product backlog:
As a student, I want to receive an email confirmation after submitting a retake request so that I know my request was received and is being processed.
As a teacher, I want to filter requests by class and status so that I can handle approvals more quickly.
As a student, I want to view my retake history and final grades after each retake so that I can track my progress over time.
As a teacher, I want to automatically generate retake questions only for the topics students struggled with so that retakes focus on areas of improvement.
As an administrator, I want to manage (add/remove/edit) teachers and classes so that the system remains up to date.
As a teacher, I want an automated email reminder system for upcoming retakes so that students are reminded to show up.
As a student, I want to see the date and time of an approved retake in my dashboard so that I can prepare.
As a teacher, I want to be able to override retake dates or student eligibility in emergency circumstances so that exceptions can be handled easily.
11. Capture all known issues:
- UI style needs work and is diffrent styles for most pages, needs fix
