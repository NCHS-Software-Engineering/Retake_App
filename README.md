Overview of app:
    Let teachers assign static retake work for test/quizzes faster and easier. The process involves student signing up to apply for a retake, the teacher can ethier give the student retake work first then give the test retake in the app or just give the student the test retake right away.


Teachers:
    Managing class content
        Create/edit/delete classes
        Create/edit/delete sections
        Inside each section there is option to create the test retake and or retake work     

    Managing retake requests
        Check status of all outgoing requests (Search feature)
        View all resolved retake requests
        Submitted Work:
            If student completed retake work, teacher able to give feedback and or select a test for them to complete
            If student completed test retake, teacher can grade the test (autograde mc if possible)
        Resolve retake request (deletes after 30 days)
        Add new students mannually and assign them retake work



Students:
    Request retake for test
    View status of retake work (not started, submited, graded, ect)
    Complete retake work


TODO:
*Backend input validation, logger to middleware/console
*Backend protection between teacher/students routes via middleware

*Frontend protect routes with teacher/student verification


BACKEND:
- Make it so retakes/relearning work go to one route /assignments instead of split like they are (simplicity)
FRONTEND:
- Able to go to a specific section
- Renders the retake and relearning assignments (basic info)
- Able to rename and delete a assignment
