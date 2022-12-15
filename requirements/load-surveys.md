# List Surveys

> ## Successful Case

1. ✅ Receive a **GET** request on route **/api/surveys**.
2. ✅ Validate if was made by an **user**.
3. ✅ Returns **204** if no survey is found.
4. ✅ Returns **200** with surveys list.

> ## Exceptions

1. ✅ Returns error **404** if API is not founded.
2. ✅ Returns error **403** if user is not logged in.
3. ✅ Returns error **500** if something goes wrong while listing the surveys.