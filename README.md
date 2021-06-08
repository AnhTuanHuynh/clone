# shareone

> Share file one time

## APIs

### Public

[x] `POST /files`

[x] `GET /files/:id`

// Hoang

[] `POST /sessions` 

[] `PUT /sessions/:session_id/file` 

// Tuan

[x] `PATCH /sessions/:session_id/confirmation`

[x] `GET /sessions/:session_id` 

// Tuan + Hoang

[] Download files of session

  - `GET /sessions:/session_id/zip` (get session, then push to queue)
  - Zip files to a tarball
  - Send message back to user (websocket)

[] Authentication with JWT
