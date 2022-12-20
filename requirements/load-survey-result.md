# Load Survey Result

> ## Successful Case

1. ❌ Receive a **GET** request on route **/api/surveys/{survey_id}/results**
2. ❌ Validate if was made by an **user**.
3. ✅ Returns **200** and the survey result.

> ## Exceptions

1. ❌ Returns error **404** if API is not founded.
2. ❌ Returns error **403** if user is invalid.
3. ✅ Returns error **403** if survey is invalid.
4. ✅ Returns error **500** if something goes wrong while loading the survey result.