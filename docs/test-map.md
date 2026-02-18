# Yapsy API — Test Map

> **24 test suites | 170 tests | 0 failures**
>
> Last updated: Feb 18, 2026
>
> All tests are unit tests using Jest + ts-jest with NestJS `Test.createTestingModule`. External dependencies (databases, APIs, Firebase) are fully mocked.

---

## Table of Contents

1. [Common Layer](#1-common-layer)
   - [SubscriptionGuard](#11-subscriptionguard)
   - [SuperAdminGuard](#12-superadminguard)
   - [TransformInterceptor](#13-transforminterceptor)
   - [LoggingInterceptor](#14-logginginterceptor)
   - [HttpExceptionFilter](#15-httpexceptionfilter)
2. [Auth Module](#2-auth-module)
   - [AuthService](#21-authservice)
   - [AuthController](#22-authcontroller)
   - [AdminAuthController](#23-adminauthcontroller)
3. [Users Module](#3-users-module)
   - [UsersService](#31-usersservice)
   - [UsersController](#32-userscontroller)
4. [Tasks Module](#4-tasks-module)
   - [TasksService](#41-tasksservice)
   - [TasksController](#42-taskscontroller)
5. [Notes Module](#5-notes-module)
   - [NotesService](#51-notesservice)
   - [NotesController](#52-notescontroller)
6. [Conversations Module](#6-conversations-module)
   - [ConversationsService](#61-conversationsservice)
   - [ElevenlabsService](#62-elevenlabsservice)
   - [ConversationsController](#63-conversationscontroller)
7. [Journals Module](#7-journals-module)
   - [JournalsService](#71-journalsservice)
8. [Subscriptions Module](#8-subscriptions-module)
   - [RazorpayService](#81-razorpayservice)
9. [Promo Codes Module](#9-promo-codes-module)
   - [PromoCodesService](#91-promocodesservice)
10. [Admin Module](#10-admin-module)
    - [SystemService](#101-systemservice)
11. [Insights Module](#11-insights-module)
    - [InsightsService](#111-insightsservice)
12. [Waitlist Module](#12-waitlist-module)
    - [WaitlistService](#121-waitlistservice)
    - [WaitlistController](#122-waitlistcontroller)

---

## 1. Common Layer

### 1.1 SubscriptionGuard

**File:** `src/common/guards/subscription.guard.spec.ts` (6 tests)

The guard reads `requiresPro` metadata from the route handler. If the decorator is present and true, it checks that the authenticated user has `subscription_status === PRO`. Free, cancelled, or missing users are rejected.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should return true when requiresPro metadata is false | Routes without `@RequiresPro()` allow any user | Reflector returns `false` | `canActivate` returns `true` |
| 2 | should return true when requiresPro metadata is undefined | Routes without the decorator default to unrestricted | Reflector returns `undefined` | `canActivate` returns `true` |
| 3 | should throw ForbiddenException when user is not pro | Free-tier users cannot access pro endpoints | Reflector returns `true`; user `subscription_status: FREE` | Throws `ForbiddenException` with code `SUBSCRIPTION_REQUIRED` |
| 4 | should throw ForbiddenException when user has cancelled subscription | Cancelled users lose pro access | Reflector returns `true`; user `subscription_status: CANCELLED` | Throws `ForbiddenException` |
| 5 | should return true when user is pro | Pro users pass the guard | Reflector returns `true`; user `subscription_status: PRO` | `canActivate` returns `true` |
| 6 | should throw ForbiddenException when no user on request | Unauthenticated requests are rejected | Reflector returns `true`; no user on request | Throws `ForbiddenException` with code `SUBSCRIPTION_REQUIRED` |

---

### 1.2 SuperAdminGuard

**File:** `src/common/guards/super-admin.guard.spec.ts` (4 tests)

Ensures only users with `AdminRole.SUPER_ADMIN` can access admin-protected endpoints. Moderators and missing users are denied.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should return true when user role is SUPER_ADMIN | Super admins pass the guard | User with `role: SUPER_ADMIN` | `canActivate` returns `true` |
| 2 | should throw ForbiddenException when role is not SUPER_ADMIN | Moderators are denied | User with `role: MODERATOR` | Throws `ForbiddenException` with message "Super admin access required" |
| 3 | should throw ForbiddenException when no user on request | Missing user is rejected | No user on request object | Throws `ForbiddenException` |
| 4 | should throw ForbiddenException when user is null | Null user is rejected | `user: null` on request | Throws `ForbiddenException` |

---

### 1.3 TransformInterceptor

**File:** `src/common/interceptors/transform.interceptor.spec.ts` (8 tests)

The global response interceptor wraps all successful responses in a standard `{ success, data, meta? }` envelope. It also detects paginated responses (`{ meta, items }`) and extracts them properly.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should wrap plain data in success and data properties | Regular objects are wrapped | Handler returns `{ id: 1, name: 'Test' }` | `{ success: true, data: { id: 1, name: 'Test' } }` |
| 2 | should pass through data that already has success property | Pre-formatted responses are not double-wrapped | Handler returns `{ success: true, data: ..., meta: ... }` | Returned as-is |
| 3 | should extract meta and items from paginated responses | Paginated results have meta extracted to top level | Handler returns `{ meta: { page: 1 }, items: [...] }` | `{ success: true, data: items, meta: { page: 1 } }` |
| 4 | should handle string data | Primitive strings are wrapped | Handler returns `'test string'` | `{ success: true, data: 'test string' }` |
| 5 | should handle number data | Primitive numbers are wrapped | Handler returns `42` | `{ success: true, data: 42 }` |
| 6 | should handle array data | Arrays are wrapped directly | Handler returns `[1, 2, 3]` | `{ success: true, data: [1, 2, 3] }` |
| 7 | should handle null data | Null is preserved | Handler returns `null` | `{ success: true, data: null }` |
| 8 | should not add meta when data does not have meta and items | Plain objects don't get a spurious meta field | Handler returns `{ id: 1 }` | Result has no `meta` key |

---

### 1.4 LoggingInterceptor

**File:** `src/common/interceptors/logging.interceptor.spec.ts` (4 tests)

Logs every HTTP request in the format `METHOD URL STATUS - TIMEms` to the console. Validates that timing is captured.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should log GET request with 200 | GET requests are logged with correct format | Mock `GET /api/test`, response 200 | `console.log` called with string matching `GET /api/test 200 - Nms` |
| 2 | should log POST request correctly | POST requests are logged | Mock `POST /api/users`, response 201 | Log matches `POST /api/users 201 - Nms` |
| 3 | should log error status codes correctly | Error codes are logged, not swallowed | Mock `GET /api/not-found`, response 404 | Log matches `GET /api/not-found 404 - Nms` |
| 4 | should calculate response time correctly | Response time is non-negative | Default mock request | Extracted responseTime `>= 0` |

---

### 1.5 HttpExceptionFilter

**File:** `src/common/filters/http-exception.filter.spec.ts` (13 tests)

The global exception filter catches all exceptions and formats them into a consistent error envelope: `{ success: false, error: { code, message, statusCode } }`.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should catch HttpException with code and message | Custom error codes are preserved | `HttpException` with `{ code: 'CUSTOM', message: 'msg' }`, status 400 | `{ success: false, error: { code: 'CUSTOM', message: 'msg', statusCode: 400 } }` |
| 2 | should handle BadRequestException with array messages | Validation errors (multiple messages) are joined | `BadRequestException` with `message: ['Error 1', 'Error 2']` | `message: 'Error 1, Error 2'` |
| 3 | should handle BadRequestException with string message | Single string validation errors pass through | `BadRequestException('Validation failed')` | `message: 'Validation failed'` |
| 4 | should handle HttpException with string response | String-only exceptions are handled | `HttpException('Simple error', 400)` | `message: 'Simple error'` |
| 5 | should handle HttpException with error property | `error` field is used as fallback message | `HttpException({ error: 'Error description' })` | `message: 'Error description'` |
| 6 | should map BAD_REQUEST to default code | Missing custom code falls back to status-based code | `BadRequestException('Bad request')` | `code: 'BAD_REQUEST'` |
| 7 | should map UNAUTHORIZED to default code | 401 maps to UNAUTHORIZED | `UnauthorizedException` | `code: 'UNAUTHORIZED'` |
| 8 | should map FORBIDDEN to default code | 403 maps to FORBIDDEN | `ForbiddenException` | `code: 'FORBIDDEN'` |
| 9 | should map NOT_FOUND to default code | 404 maps to NOT_FOUND | `NotFoundException` | `code: 'NOT_FOUND'` |
| 10 | should map CONFLICT to default code | 409 maps to CONFLICT | `ConflictException` | `code: 'CONFLICT'` |
| 11 | should handle generic errors as 500 INTERNAL_ERROR | Non-HTTP errors become 500 | `new Error('Generic error')` | `statusCode: 500`, `code: 'INTERNAL_ERROR'`, `message: 'Internal server error'` |
| 12 | should handle unknown error types | String thrown as exception | `'String error'` | `statusCode: 500`, `code: 'INTERNAL_ERROR'` |
| 13 | should use exception message as fallback | Response object without `message` or `error` field | `HttpException({ someOtherField: 'value' })` | Falls back to `exception.message` |

---

## 2. Auth Module

### 2.1 AuthService

**File:** `src/modules/auth/auth.service.spec.ts` (16 tests)

Core authentication logic: Firebase token exchange, user creation, JWT issuance, token refresh via bcrypt comparison, and admin auth flow.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should call firebaseService.verifyIdToken | Firebase ID token is verified on every auth request | Mock idToken; user found by firebase_uid | `verifyIdToken` called with the token |
| 2 | should return tokens when user found by firebase_uid | Returning users authenticate instantly | User exists with matching `firebase_uid` | Returns `{ access_token, refresh_token, user }` |
| 3 | should link firebase_uid when user found by email | Migrated users get linked on first Firebase login | User found by email but `firebase_uid` is null | `save` called with `firebase_uid` set |
| 4 | should create new user with SubscriptionStatus.FREE | First-time users start on free tier | No user found by uid or email | `create` called with `subscription_status: FREE`, `is_onboarded: false` |
| 5 | should return AuthResponseDto | Response shape is correct | User found | Result has `access_token`, `refresh_token`, and `user` object with correct fields |
| 6 | should find user and update onboarding fields | Onboarding sets name, dob, gender, timezone | User found; dto with all fields | `save` called with updated fields; `is_onboarded: true` |
| 7 | should throw UnauthorizedException when user not found for onboarding | Cannot onboard a non-existent user | `findOne` returns null | Throws `UnauthorizedException` |
| 8 | should throw UnauthorizedException when user not found for refresh | Non-existent user cannot refresh | `findOne` returns null | Throws `UnauthorizedException` |
| 9 | should throw UnauthorizedException when refresh_token_hash is null | Users who logged out cannot refresh | User found but `refresh_token_hash: null` | Throws `UnauthorizedException` |
| 10 | should throw UnauthorizedException when bcrypt.compare returns false | Tampered/wrong refresh token rejected | `bcrypt.compare` returns `false` | Throws `UnauthorizedException` |
| 11 | should return new tokens when refresh token is valid | Valid refresh token produces new token pair | `bcrypt.compare` returns `true` | `bcrypt.compare` called; returns new `{ access_token, refresh_token, user }` |
| 12 | should null out refresh_token_hash on logout | Logout invalidates stored hash | User id provided | `update` called with `refresh_token_hash: null` |
| 13 | should find admin by firebase_uid and return tokens | Returning admins authenticate via firebase_uid | Admin found by `firebase_uid` | Returns `{ access_token, refresh_token, admin }` |
| 14 | should find admin by email when firebase_uid not found | First-time admin login links Firebase UID | Admin found by email only | `save` called with `firebase_uid` set |
| 15 | should throw ForbiddenException when no admin found | Unknown emails are rejected | No admin found by uid or email | Throws `ForbiddenException` |
| 16 | should null out admin refresh_token_hash on logout | Admin logout invalidates hash | Admin id provided | `update` called with `refresh_token_hash: null` |

---

### 2.2 AuthController

**File:** `src/modules/auth/auth.controller.spec.ts` (4 tests)

Validates that the mobile auth controller correctly delegates to `AuthService` and decodes JWT payloads for the refresh endpoint.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should call authService.firebaseAuth with id_token | Firebase auth endpoint delegates correctly | DTO `{ id_token: 'firebase-token' }` | `firebaseAuth` called with `'firebase-token'` |
| 2 | should call authService.completeOnboarding with user.id | Onboard endpoint passes user id from JWT | User `{ id: 'user-1' }`; OnboardingDto | `completeOnboarding` called with `'user-1'` and dto |
| 3 | should decode base64 JWT payload and call refreshTokens | Refresh endpoint decodes JWT without verification | JWT with base64 payload `{ sub: 'user-1' }` | `refreshTokens` called with `'user-1'` and the full token |
| 4 | should call authService.logout and return message | Logout endpoint returns success message | User `{ id: 'user-1' }` | `logout` called; returns `{ message: 'Logged out' }` |

---

### 2.3 AdminAuthController

**File:** `src/modules/auth/admin-auth.controller.spec.ts` (3 tests)

Validates admin auth controller delegation, mirroring the mobile auth pattern.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should call authService.adminFirebaseAuth with id_token | Admin Firebase auth delegates | DTO `{ id_token: 'firebase-token' }` | `adminFirebaseAuth` called with `'firebase-token'` |
| 2 | should decode JWT and call adminRefreshTokens | Admin refresh decodes JWT | JWT with `{ sub: 'admin-1' }` | `adminRefreshTokens` called with `'admin-1'` |
| 3 | should call authService.adminLogout and return message | Admin logout works | Admin `{ id: 'admin-1' }` | `adminLogout` called; returns `{ message: 'Logged out' }` |

---

## 3. Users Module

### 3.1 UsersService

**File:** `src/modules/users/users.service.spec.ts` (12 tests)

CRUD operations on user profiles. Sensitive field `refresh_token_hash` is stripped from all profile responses.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should return user when found by id | Existing user is returned | `findOne` returns mock user | Result equals user |
| 2 | should throw NotFoundException when user not found by id | Missing user throws 404 | `findOne` returns null | Throws `NotFoundException` |
| 3 | should call findOne with lowercased email | Email lookups are case-insensitive | Email `"Test@Email.COM"` | `findOne` called with `"test@email.com"` |
| 4 | should return user when found by email | Email lookup works | `findOne` returns user | Result equals user |
| 5 | should return null when user not found by email | No user for email returns null | `findOne` returns null | Result is `null` |
| 6 | should return profile without refresh_token_hash | Sensitive hash is stripped | User with `refresh_token_hash` | Result does not contain `refresh_token_hash` |
| 7 | should throw NotFoundException when getting profile of missing user | getProfile validates existence | `findOne` returns null | Throws `NotFoundException` |
| 8 | should update profile then return it | updateProfile chains find → update → getProfile | Mock dto `{ name: 'New Name' }` | `update` called; result has new name; no `refresh_token_hash` |
| 9 | should update fcm_token | FCM token update works | DTO `{ fcm_token: 'new-token' }` | `update` called with `{ fcm_token: 'new-token' }` |
| 10 | should soft-delete account | deleteAccount uses soft delete | User exists | `softDelete` called with user id |
| 11 | should return admin view of user without hash | Admin findOneAdmin strips hash | User with hash | Result has no `refresh_token_hash` |
| 12 | should throw NotFoundException for findOneAdmin when user missing | Admin lookup validates existence | `findOne` returns null | Throws `NotFoundException` |

---

### 3.2 UsersController

**File:** `src/modules/users/users.controller.spec.ts` (4 tests)

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should call usersService.getProfile | GET /me delegates | Service returns profile | `getProfile` called with user id |
| 2 | should call usersService.updateProfile | PATCH /me delegates | Service returns updated profile | `updateProfile` called with user id and dto |
| 3 | should update FCM token and return message | PATCH /me/fcm-token delegates | Service resolves | Returns `{ message: 'FCM token updated' }` |
| 4 | should delete account and return message | DELETE /me delegates | Service resolves | Returns `{ message: 'Account deleted' }` |

---

## 4. Tasks Module

### 4.1 TasksService

**File:** `src/modules/tasks/tasks.service.spec.ts` (9 tests)

Task lifecycle: creation, retrieval, completion, rollover (transactional), and soft deletion.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should create and save task | Task creation works with provided fields | DTO with title, scheduled_date, priority | `create` called with user_id and dto; `save` called; result is created task |
| 2 | should use default priority MEDIUM when not provided | Priority defaults to MEDIUM | DTO without priority | `create` called with `priority: TaskPriority.MEDIUM` |
| 3 | should return task when found | Task lookup by id + user_id works | `findOne` returns task | Result equals task |
| 4 | should throw NotFoundException when task not found | Missing task throws 404 | `findOne` returns null | Throws `NotFoundException` |
| 5 | should find task, assign dto, and save | Update merges dto onto task | Existing task; dto with `{ title: 'Updated' }` | `save` called with merged task |
| 6 | should set status to COMPLETED and completed_at | Completing a task sets timestamp | Existing pending task | Result has `status: COMPLETED` and `completed_at` is a Date |
| 7 | should find task and softRemove | Deletion is soft | Existing task | `softRemove` called with the task |
| 8 | should rollover task to new date in a transaction | Rollover marks original as ROLLED_OVER and creates a new PENDING task | Pending task; QueryRunner with transaction mock | `startTransaction`/`commitTransaction` called; original saved with `ROLLED_OVER`; new task created with `new_date`, `source: 'rollover'` |
| 9 | should rollback transaction on error | Failed rollover cleans up | Task not found in transaction | Throws `NotFoundException`; `rollbackTransaction` and `release` called |

---

### 4.2 TasksController

**File:** `src/modules/tasks/tasks.controller.spec.ts` (11 tests)

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should call tasksService.create | POST / delegates | DTO | `create` called with user id and dto |
| 2 | should call tasksService.findAll | GET / delegates with query | TaskQueryDto | `findAll` called with user id and query |
| 3 | should call tasksService.findToday | GET /today delegates | — | `findToday` called with user id |
| 4 | should call tasksService.findOverdue | GET /overdue delegates | — | `findOverdue` called with user id |
| 5 | should call tasksService.findUpcoming | GET /upcoming delegates | — | `findUpcoming` called with user id |
| 6 | should call tasksService.findCalendarMonth | GET /calendar/:year/:month delegates | year=2026, month=2 | `findCalendarMonth` called with user id, 2026, 2 |
| 7 | should call tasksService.findOne | GET /:id delegates | task id | `findOne` called with user id and task id |
| 8 | should call tasksService.update | PATCH /:id delegates | dto | `update` called with user id, task id, dto |
| 9 | should call tasksService.complete | PATCH /:id/complete delegates | task id | `complete` called with user id and task id |
| 10 | should call tasksService.rollover | POST /:id/rollover delegates | RolloverTaskDto | `rollover` called with user id, task id, dto |
| 11 | should call tasksService.remove and return message | DELETE /:id delegates | task id | `remove` called; returns `{ message: 'Task deleted' }` |

---

## 5. Notes Module

### 5.1 NotesService

**File:** `src/modules/notes/notes.service.spec.ts` (8 tests)

CRUD operations on notes, including creation from voice journal processing.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should create and save note | Manual note creation | DTO with content, follow_up_date | `create` called with user_id, content, source `'manual'`; saved |
| 2 | should use default source manual when not provided | Source defaults to manual | DTO without source | `create` called with `source: 'manual'` |
| 3 | should create note from voice with journal_id | Voice-generated notes link to journal | content, journalId, followUpDate | `create` called with `source: 'voice'`, `journal_id` |
| 4 | should create note from voice without follow_up_date | Follow-up date is optional | No followUpDate | `create` called with `follow_up_date: undefined` |
| 5 | should return note when found | Note lookup by id + user_id | `findOne` returns note | Result equals note |
| 6 | should throw NotFoundException when note not found | Missing note throws 404 | `findOne` returns null | Throws `NotFoundException` |
| 7 | should find note, assign dto, and save | Update merges changes | dto with `{ content: 'Updated' }` | `save` called with merged note |
| 8 | should find note and remove | Hard remove (notes are not soft-deleted) | Existing note | `remove` called with the note |

---

### 5.2 NotesController

**File:** `src/modules/notes/notes.controller.spec.ts` (4 tests)

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should call notesService.findAll | GET / delegates | NoteQueryDto | `findAll` called with user id and query |
| 2 | should call notesService.create | POST / delegates | CreateNoteDto | `create` called with user id and dto |
| 3 | should call notesService.update | PATCH /:id delegates | UpdateNoteDto | `update` called with user id, note id, dto |
| 4 | should call notesService.remove and return message | DELETE /:id delegates | note id | `remove` called; returns `{ message: 'Note deleted' }` |

---

## 6. Conversations Module

### 6.1 ConversationsService

**File:** `src/modules/conversations/conversations.service.spec.ts` (9 tests)

Voice check-in session management. Handles free-tier weekly limits, ElevenLabs signed URL generation, journal creation, and async LLM processing kickoff.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should find user and return signed URL and session config | Happy path for session prep | User with valid reset date; mocks for ElevenLabs + tasks | Returns `{ signed_url, session_config }` |
| 2 | should throw 402 when free user reaches weekly limit | Free users are capped at 3 check-ins/week | User with `subscription_status: FREE`, `weekly_check_in_count: 3` | Throws `HttpException` with status 402, code `WEEKLY_LIMIT_REACHED` |
| 3 | should increment weekly_check_in_count | Each session increments the counter | User with `weekly_check_in_count: 1` | `update` called with `weekly_check_in_count: 2` |
| 4 | should reset weekly count when reset date is passed | Counter resets on new week | User with past `weekly_check_in_reset_date` | `update` called with `weekly_check_in_count: 0` and new Monday date |
| 5 | should create and save journal entry | Conversation saving creates a journal | SaveConversationDto with transcript, duration | Journal created with `processing_status: 'processing'`; `processTranscript` called async |
| 6 | should use current date when date not provided | Default date is today | DTO without date | Journal created with today's date |
| 7 | should return processing status for valid UUID | Status polling works | Journal with `processing_status: 'completed'` | Returns `{ processing_status: 'completed' }` |
| 8 | should throw 400 for invalid UUID format | Invalid IDs are rejected early | journalId = `'invalid-id'` | Throws `HttpException` with status 400 |
| 9 | should throw 404 when journal not found | Missing journal returns 404 | `findOne` returns null | Throws `HttpException` with status 404 |

---

### 6.2 ElevenlabsService

**File:** `src/modules/conversations/elevenlabs.service.spec.ts` (4 tests)

External ElevenLabs Conversational AI integration: signed URL generation and session configuration building.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should return signed URL from API | Successful fetch returns URL | `global.fetch` returns `{ ok: true, signed_url: '...' }` | Returns `{ signed_url }` |
| 2 | should throw error when response is not ok | API failures are propagated | `global.fetch` returns `{ ok: false, status: 500 }` | Throws `'Failed to get ElevenLabs signed URL'` |
| 3 | should return session config with user name in prompt | Config includes user context | User `{ name: 'Alice', timezone: 'Asia/Kolkata' }`, no tasks | `system_prompt` contains `'Alice'`, timezone, `'No tasks scheduled'` |
| 4 | should include tasks in system prompt when provided | Tasks are injected into prompt | User + tasks array | `system_prompt` contains task title and task id |

---

### 6.3 ConversationsController

**File:** `src/modules/conversations/conversations.controller.spec.ts` (3 tests)

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should call conversationsService.prepareSession | GET /prepare delegates | — | `prepareSession` called with user id |
| 2 | should call conversationsService.saveConversation | POST / delegates | SaveConversationDto | `saveConversation` called with user id and dto |
| 3 | should call conversationsService.getProcessingStatus | GET /:id/status delegates | journal id | `getProcessingStatus` called with user id and journal id |

---

## 7. Journals Module

### 7.1 JournalsService

**File:** `src/modules/journals/journals.service.spec.ts` (6 tests)

Journal retrieval and mood statistics computation.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should return journal for today | Today's journal is found | `findOne` returns journal matching today's date | Result equals journal |
| 2 | should return null when no journal found for today | No journal today returns null | `findOne` returns null | Result is `null` |
| 3 | should return journal when found by id | Journal lookup works | `findOne` returns journal | Result equals journal |
| 4 | should throw NotFoundException when journal not found | Missing journal throws 404 | `findOne` returns null | Throws `NotFoundException` |
| 5 | should return stats with correct avg_mood | Mood average is calculated correctly | 3 journals with mood_scores `[7, 8, null]` | `avg_mood: 7.5`, `total_entries: 3` |
| 6 | should return 0 avg_mood when no journals have mood_score | No moods defaults to 0 | All journals have `mood_score: null` | `avg_mood: 0` |

---

## 8. Subscriptions Module

### 8.1 RazorpayService

**File:** `src/modules/subscriptions/razorpay.service.spec.ts` (9 tests)

Razorpay payment gateway integration: subscription management and cryptographic signature verification.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should create subscription and return response | Subscription creation via API | `global.fetch` returns subscription response | `fetch` called with correct URL and Basic auth; result matches response |
| 2 | should throw error when create fails | API errors are propagated | `global.fetch` returns `ok: false, status: 400` | Throws `'Razorpay API error'` |
| 3 | should return true when payment signature matches | Valid HMAC signature passes | `paymentId\|subscriptionId` HMAC matches provided signature | Returns `true` |
| 4 | should return false when payment signature does not match | Tampered signature fails | Wrong signature | Returns `false` |
| 5 | should return true when webhook signature matches | Valid webhook signature passes | Body HMAC matches signature | Returns `true` |
| 6 | should return false when webhook signature does not match | Tampered webhook fails | Wrong signature | Returns `false` |
| 7 | should cancel subscription successfully | Cancel API call works | `global.fetch` returns `ok: true` | `fetch` called with cancel URL and POST |
| 8 | should throw error when cancel fails | Cancel failure propagated | `global.fetch` returns `ok: false, status: 404` | Throws `'Razorpay cancel error'` |
| 9 | should return subscription details | Fetch subscription works | `global.fetch` returns subscription response | Result matches response |

---

## 9. Promo Codes Module

### 9.1 PromoCodesService

**File:** `src/modules/promo-codes/promo-codes.service.spec.ts` (14 tests)

Promo code lifecycle: discount calculation (3 types), validation with 4 rejection paths, CRUD, and deactivation.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should calculate PERCENTAGE discount | 20% of 1000 = 200 | Promo type `PERCENTAGE`, value 20; price 1000 | Returns `200` |
| 2 | should calculate FLAT discount | Flat 50 off | Promo type `FLAT`, value 50; price 1000 | Returns `50` |
| 3 | should calculate SET_PRICE discount | Set price to 800 means 200 discount | Promo type `SET_PRICE`, value 800; price 1000 | Returns `200` |
| 4 | should return 0 when SET_PRICE exceeds original | No negative discounts | Promo type `SET_PRICE`, value 1200; price 1000 | Returns `0` |
| 5 | should throw 404 when promo not found | Unknown code is rejected | `findOne` returns null | Throws `HttpException` 404, code `PROMO_NOT_FOUND` |
| 6 | should throw 400 when promo is not active | Inactive promos are rejected | `findOne` returns promo with `is_active: false` | Throws `HttpException` 400, code `PROMO_NOT_ACTIVE` |
| 7 | should throw 400 when promo is expired | Expired promos are rejected | `valid_until` in the past | Throws `HttpException` 400, code `PROMO_EXPIRED` |
| 8 | should throw 400 when max uses reached | Fully redeemed promos are rejected | `current_uses >= max_uses` | Throws `HttpException` 400, code `PROMO_MAX_USES_REACHED` |
| 9 | should return validation result when promo is valid | Valid promo returns discount info | Active promo, 20% off, price 1000 | `{ promo, discountAmount: 200, finalPrice: 800 }` |
| 10 | should return paginated results | findAll paginates correctly | `findAndCount` returns `[promos, 1]` | `items` and `meta.total` correct |
| 11 | should create promo code | New promo is created | CreatePromoDto; no existing code | `create` and `save` called; result equals promo |
| 12 | should throw BadRequestException when code exists | Duplicate codes are rejected | `findOne` returns existing promo | Throws `BadRequestException` with code `PROMO_CODE_EXISTS` |
| 13 | should deactivate promo code | Deactivation sets is_active=false | `update` returns `{ affected: 1 }` | `update` called with `{ is_active: false }` |
| 14 | should throw NotFoundException when deactivating unknown promo | Unknown promo can't be deactivated | `update` returns `{ affected: 0 }` | Throws `NotFoundException` |

---

## 10. Admin Module

### 10.1 SystemService

**File:** `src/modules/admin/system.service.spec.ts` (7 tests)

System health monitoring, cost tracking, and webhook management for the admin dashboard.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should return healthy database when query succeeds | DB ping returns healthy | `manager.query('SELECT 1')` resolves | `database: 'healthy'`; `api: 'healthy'` |
| 2 | should return down database when query fails | DB failure is detected | `manager.query` rejects | `database: 'down'` |
| 3 | should return degraded for elevenlabs/razorpay when env vars not set | Missing env vars show degraded | `ELEVENLABS_API_KEY` and `RAZORPAY_KEY_*` deleted | `elevenlabs: 'degraded'`; `razorpay: 'degraded'` |
| 4 | should return placeholder cost data | Costs are stubbed | — | `{ elevenlabs: { requests: 0, cost: 0 }, gemini: { requests: 0, cost: 0 } }` |
| 5 | should return webhook events with errors | Error log retrieval works | QueryBuilder returns events | Result equals mock events; `take` called with limit |
| 6 | should retry webhook when found | Retry delegates to subscriptions service | `findOne` returns webhook | `retryWebhook` called with id |
| 7 | should throw NotFoundException when webhook not found for retry | Missing webhook throws 404 | `findOne` returns null | Throws `NotFoundException` |

---

## 11. Insights Module

### 11.1 InsightsService

**File:** `src/modules/insights/insights.service.spec.ts` (6 tests)

User mood analytics, theme aggregation, and streak calculation.

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should return mood data points for specified days | Mood data is mapped correctly | 3 journals with dates and scores | Result has `{ date, mood_score, mood_label }` for each |
| 2 | should return theme counts sorted by frequency | Themes are aggregated and ranked | Journals with themes: work x2, family x2, health x1 | First theme is `'work'` or `'family'` (count 2) |
| 3 | should return top 10 themes | Theme list is capped at 10 | 20 journals with unique themes | `result.length <= 10` |
| 4 | should calculate longest streak from journal dates | Longest streak is computed correctly | User with `current_streak: 3`; 5 journal dates | `current_streak: 3`; `longest_streak: 3` |
| 5 | should handle consecutive dates correctly | 4 consecutive days = streak of 4 | 4 consecutive journal dates | `longest_streak: 4` |
| 6 | should handle non-consecutive dates | Gaps break the streak | 3 dates with a gap | `longest_streak: 2` |

---

## 12. Waitlist Module

### 12.1 WaitlistService

**File:** `src/modules/waitlist/waitlist.service.spec.ts` (4 tests)

Pre-launch waitlist signup with duplicate detection and Resend audience sync (fire-and-forget).

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should create and save waitlist entry | New signup creates entry with IP | DTO with email, country, utm_source; IP address | `create` called with all fields + ip_address; `save` called |
| 2 | should use UNKNOWN as default country | Missing country defaults | DTO with email only | `create` called with `country: 'UNKNOWN'` |
| 3 | should throw ConflictException when email exists | Duplicate emails are rejected | `findOne` returns existing entry | Throws `ConflictException` with code `ALREADY_ON_WAITLIST` |
| 4 | should return count of waitlist entries | Count query works | `count` returns 42 | Result is `42` |

---

### 12.2 WaitlistController

**File:** `src/modules/waitlist/waitlist.controller.spec.ts` (2 tests)

| # | Test Case | Hypothesis | Setup | Expected Result |
|---|-----------|-----------|-------|-----------------|
| 1 | should call signup and return success message | POST / delegates and returns friendly message | DTO + IP | `signup` called; returns `{ success: true, message: "You're on the list!" }` |
| 2 | should return waitlist count | GET /count delegates | — | `getCount` called; returns `{ count: 100 }` |

---

## Summary

| Module | File | Tests | Focus |
|--------|------|-------|-------|
| Common / Guards | subscription.guard.spec.ts | 6 | Pro-tier access control |
| Common / Guards | super-admin.guard.spec.ts | 4 | Admin role enforcement |
| Common / Interceptors | transform.interceptor.spec.ts | 8 | Response envelope wrapping |
| Common / Interceptors | logging.interceptor.spec.ts | 4 | Request logging format |
| Common / Filters | http-exception.filter.spec.ts | 13 | Error response formatting |
| Auth | auth.service.spec.ts | 16 | Firebase auth, JWT, refresh, admin auth |
| Auth | auth.controller.spec.ts | 4 | Mobile auth delegation |
| Auth | admin-auth.controller.spec.ts | 3 | Admin auth delegation |
| Users | users.service.spec.ts | 12 | CRUD, profile stripping |
| Users | users.controller.spec.ts | 4 | Controller delegation |
| Tasks | tasks.service.spec.ts | 9 | CRUD, complete, rollover transactions |
| Tasks | tasks.controller.spec.ts | 11 | All endpoint delegation |
| Notes | notes.service.spec.ts | 8 | CRUD, voice note creation |
| Notes | notes.controller.spec.ts | 4 | Controller delegation |
| Conversations | conversations.service.spec.ts | 9 | Session prep, weekly limits, journal save |
| Conversations | elevenlabs.service.spec.ts | 4 | Signed URL, session config |
| Conversations | conversations.controller.spec.ts | 3 | Controller delegation |
| Journals | journals.service.spec.ts | 6 | Lookup, mood stats |
| Subscriptions | razorpay.service.spec.ts | 9 | Payment API, HMAC signatures |
| Promo Codes | promo-codes.service.spec.ts | 14 | Discount math, validation, CRUD |
| Admin | system.service.spec.ts | 7 | Health, costs, webhook retry |
| Insights | insights.service.spec.ts | 6 | Mood data, themes, streaks |
| Waitlist | waitlist.service.spec.ts | 4 | Signup, duplicate detection |
| Waitlist | waitlist.controller.spec.ts | 2 | Controller delegation |
| **Total** | **24 suites** | **170** | |
