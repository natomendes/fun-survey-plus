# Sign In

> ## Successful Case

1. ✅ Receive a **POST** request on route **/api/login**.
2. ✅ Validate required fields **email**, **password**.
3. ✅ Validate if **email** is a valid e-mail.
4. ✅ **Search** for an user with the email and password provided.
5. ✅ Generate an access **token** from the user ID.
6. ✅ **Update** the user account with the access token created.
7. ✅ Returns **200** with the access token and user name.

> ## Exceções

1. ✅ Returns error **404** if API is not founded.
2. ✅ Returns error **400** if email or password are not provided by the client.
3. ✅ Returns error **400** if provided email is an invalid e-mail.
4. ✅ Returns error **401** if user with provided information is not found.
5. ✅ Returns error **500** if something goes wrong while generating access token.
6. ✅ Returns error **500** if something goes wrong while trying to update user accout with the access token generated.