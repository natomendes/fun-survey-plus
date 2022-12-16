# Save Survey Result

> ## Successful Case

1. ❌ Receive a **PUT** request on route **/api/surveys/{survey_id}/results**.
2. ❌ Validate if was made by an **user**.
3. ✅ Validate **survey_id** field.
4. ✅ Validate **answer**.
5. ✅ **Create/Update** the survey result.
6. ✅ Returns **200** and the survey result.

> ## Exceptions

1. ❌ Returns error **404** if API is not founded.
2. ❌ Returns error **403** if user is not valid.
3. ✅ Returns error **403** if param survey_id is invalid.
4. ✅ Returns error **403** if answer sent by the client is invalid.
5. ✅ Returns error **500** if something goes wrong while creating/updating the survey result.
6. ✅ Returns error **500** if something goes wrong while loading the survey result.