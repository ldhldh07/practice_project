# Learnings

## 2026-02-17 Initial Setup

- vitest 3.2.4, jsdom, globals: true
- 기존 테스트: client.test.ts, validate.test.ts (shared 레이어)
- vitest.config.ts에 path alias 설정 완료
- 테스트 패턴: describe/it, vi.fn(), vi.stubGlobal
- 한국어 에러 메시지 사용 중

## 2026-02-17 Department Tree Utility Tests

### Coverage

- `buildDepartmentTree`: 7 test cases
  - Empty array → empty array
  - Single root department
  - Multiple roots (sorted by name)
  - Nested hierarchy (parent → child → grandchild)
  - Children sorting via localeCompare
  - Unsorted input handling
  - Complex multi-branch tree
- `flattenDepartmentTree`: 5 test cases
  - Empty tree → empty array
  - Single node → [node]
  - Nested tree → depth-first order
  - Multiple branches → depth-first order
  - Multiple root trees
- `findDescendantDepartmentIds`: 7 test cases
  - Target not found → []
  - Leaf node → [targetId]
  - Target with children → [targetId, ...childIds]
  - Deep nesting → all levels
  - Multiple branches
  - Empty tree
  - Second root tree search

### Test Data Pattern

- Typed test data matching `Department` type
- All fields: `{ id, parentId, name, description, headCount }`
- Korean department names for realism
- Explicit `children: []` for leaf nodes in tree assertions

### Assertions

- Array length checks
- ID sequence verification
- Name sorting verification (localeCompare)
- Depth-first order verification
- Empty array edge cases

### Results

- 19 tests passed
- Test file: `src/entities/department/model/department.tree.test.ts`
- Execution time: 20ms
- Spec: `4-1-부서-트리-조회` (Department Tree View)

## 2026-02-17 Text Highlight Segmentation Tests

### Coverage

- `splitByHighlight`: 17 test cases
  - Empty text → []
  - Empty/whitespace highlight → [{value: text, highlighted: false}]
  - No match found → [{value: text, highlighted: false}]
  - Single match in middle → segments with highlighted match
  - Match at start → leading empty segment
  - Match at end → trailing empty segment
  - Multiple matches → alternating segments
  - Consecutive matches → overlapping pattern
  - Case insensitive matching (gi flag)
  - Regex special chars (dot, parenthesis, bracket)
  - Partial word match
  - Entire text match
  - Korean text support
  - Mixed Korean/English

### Implementation Findings

**Trailing Empty Segments**: The implementation always produces a trailing empty segment when match ends at text boundary. This is due to `split(regex)` behavior with capturing groups.

**Regex Special Characters**: The function does NOT escape regex special chars in the highlight string. This means:

- `.` is treated as wildcard (matches any char)
- `(`, `[`, `*`, `+`, etc. cause regex syntax errors
- This is a known limitation documented in tests

**Case Insensitivity**: Uses `gi` flag, so "Hello" matches "hello"

**Alternating Pattern**: Uses `i % 2 === 1` to determine highlighted segments (odd indices after split)

### Test Data Pattern

- Simple ASCII strings for basic cases
- Korean text for i18n validation
- Mixed Korean/English for real-world scenarios
- Regex special chars to document edge cases

### Assertions

- Array structure verification
- Segment value/highlighted flag checks
- Empty segment handling
- Error throwing for invalid regex patterns

### Results

- 17 tests passed
- Test file: `src/shared/lib/split-by-highlight.test.ts`
- Execution time: 4ms
- Spec: `1-1-직원-목록-조회` (Employee List Search - keyword highlighting)

### Recommendations

- Consider escaping regex special chars if literal matching is required
- Consider filtering out empty segments if they cause UI issues
- Document the trailing empty segment behavior in function JSDoc

## 2026-02-17 Error Taxonomy Tests

### Coverage

- **Error Class Hierarchy**: 14 test cases
  - `BaseError`: code, message, name='BaseError'
  - `ApiError`: extends BaseError, has statusCode, data
  - `NotFoundError`: extends ApiError, code='NOT_FOUND', statusCode=404
  - `BadRequestError`: extends ApiError, code='BAD_REQUEST', statusCode=400, accepts data
  - `NetworkError`: extends BaseError, code='NETWORK_ERROR'
  - `TimeoutError`: extends NetworkError, code='TIMEOUT'
  - `ValidationError`: has issues array (ZodIssue-compatible)
  - `ResponseParseError`: extends BaseError, code='RESPONSE_PARSE_ERROR'

- **Type Guards**: 18 test cases
  - `AppError.is`: BaseError instances, inheritance, standard Error, non-error values
  - `AppError.isApi`: ApiError instances, NotFoundError/BadRequestError inheritance, NetworkError exclusion
  - `AppError.isNetwork`: NetworkError instances, TimeoutError inheritance, ApiError exclusion
  - `AppError.isValidation`: ValidationError instances, ApiError/BaseError exclusion
  - `AppError.isResponseParse`: ResponseParseError instances, ApiError/BaseError exclusion
  - `AppError.hasCode`: code matching, code mismatch, non-BaseError instances, ApiError subclasses

- **Factory**: 6 test cases
  - `AppError.fromCode`: creates BadRequestError, NotFoundError, NetworkError, TimeoutError
  - Unknown code fallback → ApiError
  - Data passing to BadRequestError

- **Error Message Mapping**: 4 test cases
  - `getErrorMessage`: known code → mapped message
  - Unknown code → fallback message
  - Unknown code without fallback → default message
  - All ERROR_CODES constants have mappings (except UNKNOWN_ERROR which intentionally maps to default)

### Implementation Findings

**Inheritance Chain**: TimeoutError → NetworkError → BaseError, NotFoundError/BadRequestError → ApiError → BaseError

**Type Guard Behavior**: Type guards correctly distinguish between error classes using `instanceof` checks

**Factory Fallback**: `AppError.fromCode` returns generic `ApiError` for unknown codes, preserving code/statusCode/data

**UNKNOWN_ERROR Special Case**: The `UNKNOWN_ERROR` code itself maps to the default fallback message "알 수 없는 오류가 발생했습니다.", which is expected behavior

**ZodIssue Mock**: Tests use `as any` cast for ZodIssue mock to avoid full zod type dependency in tests

### Test Data Pattern

- Error instances with custom messages
- Error codes from ERROR_CODES constants
- Mock ZodIssue with minimal compatible shape
- Korean error messages matching production

### Assertions

- `instanceof` checks for inheritance
- Property value checks (code, message, statusCode, data)
- Type guard boolean returns
- Error message string matching

### Results

- 47 tests passed
- Test file: `src/shared/lib/errors/errors.test.ts`
- Execution time: 6ms
- Spec: Error Handling Policy (AGENTS.md - transport/network, API/protocol, validation/parse, domain rule)

### Recommendations

- Error taxonomy aligns with AGENTS.md policy
- Type guards enable error-aware retry logic in query layer
- Factory pattern supports centralized error creation from API responses
- Message mapping provides consistent user-facing error text

## 2026-02-17 Department Tree Atom Integration Tests

### Coverage

- **A. departmentTreeAtom (source → derived)**: 3 test cases
  - Flat source data → tree structure derivation
  - Empty source → empty tree
  - Source update → tree auto-update

- **B. visibleDepartmentTreeAtom (source + search → filtered)**: 6 test cases
  - Empty search → full tree visible
  - Keyword match → filtered tree
  - Parent inclusion when children match
  - Case insensitive search
  - No match → empty tree
  - Whitespace trimming

- **C. selectedDepartmentDescendantsAtom (source + selected → descendants)**: 5 test cases
  - No selection (null) → empty array
  - Leaf node selection → [leafId]
  - Parent node selection → [parentId, ...childIds]
  - Root node selection → all descendants
  - Invalid id → empty array

- **D. toggleDepartmentExpandAtom (action atom)**: 4 test cases
  - Toggle unexpanded → adds to set
  - Toggle expanded → removes from set
  - Multiple toggles → correct state
  - Immutability verification (new Set created)

- **E. selectDepartmentAtom (action atom)**: 3 test cases
  - Set selection → updates selectedDepartmentIdAtom
  - Set null → clears selection
  - Overwrite previous selection

- **F. Cross-atom chain (full integration)**: 6 test cases
  - Source → selection → descendants consistency
  - Source change → derived auto-update
  - Search filter + tree update consistency
  - Complex scenario: expand + select + search + descendants
  - Selection clear → descendants clear
  - Empty source with all atoms

### Implementation Findings

**Jotai Vanilla Store Testing**: Used `createStore()` from jotai for pure atom testing without React. Pattern:

```ts
const store = createStore();
store.set(sourceAtom, value);
const result = store.get(derivedAtom);
```

**Atom Derivation Chain**: Source atoms (`departmentSourceAtom`, `selectedDepartmentIdAtom`, `departmentTreeSearchAtom`) → Derived atoms (`departmentTreeAtom`, `visibleDepartmentTreeAtom`, `selectedDepartmentDescendantsAtom`) → Action atoms (`toggleDepartmentExpandAtom`, `selectDepartmentAtom`)

**Descendant Order**: `findDescendantDepartmentIds` returns IDs in depth-first traversal order, not sorted by ID. Tests use `.toContain()` instead of `.toEqual()` for order-independent verification.

**Immutability**: Action atoms create new Set instances instead of mutating existing ones, verified by reference inequality checks.

**Search Filter Behavior**:

- Trims whitespace from keyword
- Case insensitive matching (`.toLowerCase()`)
- Includes parent nodes when children match (recursive filter)

### Test Data Pattern

- Typed mock data matching `Department` type
- All fields: `{ id, parentId, name, description, headCount }`
- Korean department names: "본사", "개발팀", "디자인팀", "프론트엔드팀", "백엔드팀"
- Hierarchical structure: 본사 → 개발팀/디자인팀 → 프론트엔드팀/백엔드팀

### Assertions

- Array length checks
- Set membership checks (`.has()`)
- ID containment checks (`.toContain()`)
- Tree structure verification (children array length)
- Null/empty state verification
- Reference inequality for immutability

### Results

- 27 tests passed
- Test file: `src/entities/department/model/department-tree.atom.test.ts`
- Execution time: 16ms
- Spec: `4-1-부서-트리-조회` (Department Tree View - atom integration level)

### Recommendations

- Jotai vanilla store testing pattern is effective for atom integration tests without React overhead
- Atom derivation chains auto-update correctly when source atoms change
- Action atoms maintain immutability by creating new Set instances
- Search filter correctly includes parent nodes when children match
- Descendant calculation follows depth-first traversal order (implementation detail documented in tests)
## 2026-02-17 API Boundary Integration Tests

### Coverage

- **employeeApi**: 13 test cases
  - `getList`: success chain (valid response → validated EmployeesResponse), query param serialization, validation failure (missing field), validation failure (wrong type)
  - `getById`: success chain (valid response → validated Employee), validation failure (incomplete data), validation failure (invalid enum)
  - `create`: success chain (valid payload → validated Employee), validation failure (invalid response)
  - `update`: success chain (partial update → validated Employee), validation failure (invalid response)
  - `remove`: success (200 → resolves), HTTP error (404 → throws)

- **attendanceApi**: 11 test cases
  - `getByEmployee`: success chain (valid response → validated AttendanceListResponse), nullable fields (checkIn/checkOut null), validation failure (missing status field), validation failure (wrong type), validation failure (invalid enum)
  - `create`: success chain (valid payload → validated Attendance), optional note field handling, validation failure (invalid response)
  - `update`: success chain (partial update → validated Attendance), status change with null checkIn/checkOut, validation failure (invalid response)

### Implementation Findings

**Full Chain Verification**: Tests verify the complete API → http client → validateSchema → typed data or error flow without mocking `validateSchema`. This is an integration test, not a unit test.

**Fetch Mocking Pattern**: Used `vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(data)))` to mock at the fetch level, allowing the full chain to run naturally.

**Response Body Consumption**: Response body can only be read once. Tests that need multiple assertions use try-catch blocks instead of multiple `await expect()` calls to avoid "Body has already been read" errors.

**DELETE Endpoint Behavior**: The http client always calls `res.json()`, so DELETE endpoints must return `{}` (empty JSON object) instead of null body. Tests verify the promise resolves without throwing, not the return value (typed as `Promise<void>`).

**ValidationError Structure**: When validation fails, `validateSchema` throws `ValidationError` with:
- `message`: custom error message (e.g., "직원 목록 응답 검증 실패")
- `issues`: array of ZodIssue objects with detailed validation errors

**Enum Validation**: Invalid enum values (e.g., `status: "invalid-status"`) trigger ValidationError, verifying runtime type safety beyond TypeScript compile-time checks.

**Nullable Fields**: Attendance schema correctly handles `checkIn: null` and `checkOut: null` for absent/vacation status, verified by tests.

**Optional Fields**: Employee `profileImage` and Attendance `note` are optional, verified by tests that omit these fields.

### Test Data Pattern

- Valid mock data matching schema exactly (all required fields, correct types, valid enums)
- Invalid mock data with intentional violations:
  - Missing required fields (e.g., email 누락)
  - Wrong types (e.g., id: "not-a-number")
  - Invalid enum values (e.g., status: "invalid-status")
- Korean field values for realism (names, notes)
- Realistic date/time strings (ISO format)

### Assertions

- Type checks: `expect(error).toBeInstanceOf(ValidationError)`
- Message checks: `expect(error.message).toBe("직원 목록 응답 검증 실패")`
- Issues array checks: `expect(error.issues.length).toBeGreaterThan(0)`
- Data structure checks: `expect(result.employees).toHaveLength(1)`
- Field value checks: `expect(result.name).toBe("홍길동")`
- Null handling: `expect(result.checkIn).toBeNull()`
- Promise resolution: `await expect(api.remove(1)).resolves.not.toThrow()`

### Results

- 24 tests passed (13 employee + 11 attendance)
- Test files:
  - `src/entities/employee/api/employee.api.test.ts`
  - `src/entities/attendance/api/attendance.api.test.ts`
- Execution time: 21ms total
- Specs:
  - Employee data-definition (runtime validation)
  - Attendance data-definition (runtime validation)
  - Error handling policy (ValidationError taxonomy)

### Recommendations

**Integration Test Value**: These tests verify the full API boundary chain, catching issues that unit tests would miss:
- Schema drift between API response and zod schema
- Missing validation calls in API methods
- Incorrect error message strings
- Type coercion issues (e.g., string IDs instead of numbers)

**Test Pattern Reusability**: The fetch mocking pattern (`vi.stubGlobal("fetch", ...)`) and try-catch assertion pattern can be reused for other API boundary tests.

**Validation Coverage**: Tests cover all validation failure modes:
- Missing required fields
- Wrong types
- Invalid enum values
- This ensures runtime type safety beyond TypeScript compile-time checks

**Error Message Consistency**: All validation errors use Korean messages matching production error handling policy.

**DELETE Endpoint Quirk**: The http client's `res.json()` call means DELETE endpoints must return `{}` instead of empty body. This is a known limitation of the current client implementation.

**Next Steps**: Consider adding tests for:
- Network errors (fetch rejection)
- HTTP error responses (400, 401, 500)
- Retry policy verification (error-aware retry logic from AGENTS.md)
