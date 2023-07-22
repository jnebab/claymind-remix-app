### Instructions

You will be using Remix as the framework and test data from https://jsonplaceholder.typicode.com/

1. Using the /posts endpoint from jsonplaceholder, create a sign up form with the following fields
   a. Title (Required)
   b. Body (Required)
   c. UserName (Required)
   d. I am a human (Required)

2. UserName is a dropdown of the existing users from the /users endpoint
3. I am a human is a checkbox.
4. A submit button should update the values of the post resource on the API.
5. Validation should happen on the server side and should be displayed on the form if any data is invalid.
6. No react hooks should be implemented (e.g. No useState, No useEffect). Only hooks from Remix.
7. There should be a loading spinner once the user submits the form until the data is received from server.
8. A successful form submission should redirect to another route called /profile which should display the submitted values.
9. Refreshing the /profile route should preserve the submitted values. Use session cookies to preserve the values
10. Once you’re done with the project, you can zip it and send to me via email. Or you can host it somewhere where I can view it on the browser. Up to you. Thanks!
