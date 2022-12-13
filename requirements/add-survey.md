# Create Survey

> ## Successful Case

1. ❌ Receive a **POST** request on route **/api/surveys**.
2. ❌ Validate if was made by an **admin**.
3. ❌ Validate required fields **question** and **answers**.
4. ❌ **Create** a survey.
5. ❌ Returns **204**.

> ## Exceptions

1. ❌ Returns error **404** if API is not founded.
2. ❌ Returns error **403** if user is not an admin.
3. ❌ Returns error **400** if question or answers are not provided by the client.
4. ❌ Returns error **500** if something goes wrong while creating the survey.
