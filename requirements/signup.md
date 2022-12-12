# SignUp

> ## Successful Case

1. ✅ Receive a **POST** request on route **/api/signup**.
2. ✅ Validate required fields **name**, **email**, **password** and **passwordConfirmation**.
3. ✅ Validate if **password** and **passwordConfirmation** match.
4. ✅ Validate if **email** is a valid e-mail.
5. ✅ **Validate** if an user with the provided email already exists.
6. ✅ Generate an **hashed** password.
7. ✅ **Create** an user account with the data provided, **replacing** the password with the hashed password.
8. ✅ Generate an access **token** from the user ID.
9. ✅ **Update** the user account with the access token created.
10. ✅ Returns **200** with the access token and user name.

> ## Exceptions

1. ✅ Returns error **404** if API is not founded.
2. ✅ Returns error **400** if name, email, password or passwordConfirmation are not provided by the client.
3. ✅ Returns error **400** if password and passwordConfirmation don't match.
4. ✅ Returns error **400** if provided email is an invalid e-mail.
5. ✅ Returns error **403** if provided email is already in use.
6. ✅ Returns error **500** if something goes wrong while genereting hashed password.
7. ✅ Returns error **500** if something goes wrong while creating the user account.
8. ✅ Returns error **500** if something goes wrong while generating access token.
9. ✅ Returns error **500** if something goes wrong while trying to update user accout with the access token generated.