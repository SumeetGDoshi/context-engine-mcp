# Example Usage Guide

This guide shows complete examples of using Context Engine MCP Server.

## Example 1: Adding Authentication to an API

### Step 1: Research

**You:** "I need to add JWT authentication to my Express API"

**Context Engine:**
```
🔍 Starting research phase for: "add JWT authentication to Express API"

I'll analyze your codebase to understand:
- Current authentication (if any)
- Existing middleware patterns
- API route structure
- Configuration management

Spawning parallel research agents...
```

**Output:** Creates `thoughts/shared/research/2025-11-16-jwt-auth.md`

```markdown
# Research: JWT Authentication

## Summary
Currently no authentication exists. API is open.

## Current State
- Express app at `src/app.ts`
- Routes defined in `src/routes/`
- No auth middleware found
- Environment config in `src/config/env.ts`

## Recommended Approach
Based on existing patterns:
- Use middleware pattern (like `src/middleware/logger.ts`)
- Store JWT secret in env config
- Add auth middleware to protected routes

## File References
- `src/app.ts:15-45` - Express app setup
- `src/routes/users.ts:10` - User routes (need protection)
- `src/middleware/logger.ts` - Example middleware pattern
```

### Step 2: Create Plan

**You:** "Create implementation plan"

**Context Engine:**
```
✅ Research found at: thoughts/shared/research/2025-11-16-jwt-auth.md

📋 Creating implementation plan...

Based on research, I'll create a plan with these phases:
1. Install dependencies and set up JWT config
2. Create authentication middleware
3. Add login/register endpoints
4. Protect existing routes
5. Add tests

Creating plan...
```

**Output:** Creates `thoughts/shared/plans/2025-11-16-jwt-auth.md`

```markdown
# JWT Authentication Implementation Plan

## Phase 1: Dependencies and Configuration

### Changes Required:

#### 1. Install Dependencies
```bash
npm install jsonwebtoken bcryptjs
npm install --save-dev @types/jsonwebtoken @types/bcryptjs
```

#### 2. Update Environment Config
**File**: `src/config/env.ts`
```typescript
export const config = {
  // existing config...
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: '7d'
  }
}
```

### Success Criteria:

#### Automated Verification:
- [ ] Dependencies install: `npm install`
- [ ] TypeScript compiles: `npm run build`
- [ ] No type errors: `npm run typecheck`

#### Manual Verification:
- [ ] JWT_SECRET can be set in .env
- [ ] Config loads correctly in dev environment

---

## Phase 2: Authentication Middleware

### Changes Required:

#### 1. Create Auth Middleware
**File**: `src/middleware/auth.ts` (new file)
```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles: `npm run build`
- [ ] Unit tests pass: `npm test src/middleware/auth.test.ts`
- [ ] Linting passes: `npm run lint`

#### Manual Verification:
- [ ] Middleware rejects requests without token
- [ ] Middleware rejects requests with invalid token
- [ ] Middleware allows requests with valid token

---

## Phase 3: Auth Endpoints

[... more phases ...]

## Testing Strategy

### Unit Tests:
- Auth middleware with valid/invalid tokens
- Password hashing and comparison
- JWT token generation and verification

### Integration Tests:
- Login flow end-to-end
- Register flow end-to-end
- Protected route access

### Manual Testing:
1. Register new user via POST /auth/register
2. Login with credentials via POST /auth/login
3. Use returned token to access protected route
4. Verify expired tokens are rejected
```

### Step 3: Approve Plan

**You:** "Approve plan"

**Context Engine:**
```
✅ Plan approved!

You can now proceed with implementation using 'implement_plan'.
```

### Step 4: Implement

**You:** "Implement the plan"

**Context Engine:**
```
🚀 Implementation phase started

Plan: thoughts/shared/plans/2025-11-16-jwt-auth.md

Implementing Phase 1: Dependencies and Configuration...

[installs dependencies]
[updates config files]

✓ Phase 1 automated checks pass
⏸️  Manual verification required before proceeding:
  - [ ] JWT_SECRET can be set in .env
  - [ ] Config loads correctly in dev environment

Please verify and confirm to continue.
```

**You:** "Confirmed, config works"

**Context Engine:**
```
✅ Continuing to Phase 2...

Implementing Phase 2: Authentication Middleware...
[creates middleware file]
[adds tests]

✓ Phase 2 automated checks pass
✓ All tests pass

Continuing to Phase 3...
```

### Step 5: Validate

**You:** "Validate implementation"

**Context Engine:**
```
✅ Validation phase started

Running automated verification...

## Validation Report: JWT Authentication

### Implementation Status
✓ Phase 1: Dependencies - Complete
✓ Phase 2: Auth Middleware - Complete
✓ Phase 3: Auth Endpoints - Complete
✓ Phase 4: Route Protection - Complete
✓ Phase 5: Tests - Complete

### Automated Verification Results
✓ Dependencies installed
✓ Build passes: `npm run build`
✓ Tests pass (18/18): `npm test`
✓ Linting passes: `npm run lint`
✓ Type checking passes: `npm run typecheck`

### Code Review Findings

#### Matches Plan:
✓ JWT middleware created at src/middleware/auth.ts
✓ Auth routes at src/routes/auth.ts
✓ Protected routes updated
✓ All tests added as specified

#### Deviations from Plan:
- Added password strength validation (improvement)
- Used argon2 instead of bcryptjs (better security)

#### No Issues Found

### Manual Testing Required:
1. End-to-end authentication flow:
   - [ ] Register new user
   - [ ] Login with credentials
   - [ ] Access protected route with token
   - [ ] Verify token expiration works

2. Security testing:
   - [ ] Weak passwords rejected
   - [ ] Invalid tokens rejected
   - [ ] Expired tokens rejected

### Overall Status: PASS ✅

All automated criteria met.
Ready for manual testing and PR review.
```

## Example 2: Quick Bug Fix

### Scenario: Fix a small bug

**You:** "The user profile page crashes when email is null"

**Context Engine:**
```
⚠️  No research found. Start with research to analyze the codebase.

Even for bug fixes, research helps understand:
- Where the bug occurs (file:line)
- What causes it
- Related code that might have same issue
- Existing error handling patterns

Shall I research this bug?
```

**You:** "Yes, research it"

**Context Engine:**
```
🔍 Researching bug: "user profile crashes on null email"

Found:
- Profile component: `src/components/UserProfile.tsx:45`
- Email display without null check
- Same pattern in 3 other components

Creating research doc...
✓ Research complete

Next: Create a plan to fix this systematically?
```

**You:** "Create plan"

**Context Engine:**
```
📋 Plan created:

Phase 1: Fix UserProfile component
Phase 2: Fix similar issues in other components  
Phase 3: Add PropTypes validation
Phase 4: Add tests for null handling

Approve?
```

**You:** "Just fix UserProfile, skip the others"

**Context Engine:**
```
Updated plan:

Phase 1: Fix UserProfile component ✓
~~Phase 2: Fix other components~~ (Out of scope)
Phase 3: Add test for null email
Phase 4: Update PropTypes

Approve?
```

**You:** "Approved"

**Context Engine:** [Implements, validates, done]

---

## Example 3: Team Collaboration

### Developer A (Morning)

**Developer A:** "Research how we handle file uploads"

**Context Engine:**
```
🔍 Researching file upload handling...

Created: thoughts/shared/research/2025-11-16-file-uploads.md

Summary:
- Using multer middleware
- Stored in /uploads directory
- Max size: 10MB
- No virus scanning currently
```

### Developer B (Afternoon, Different Location)

**Developer B:** "I need to add virus scanning to file uploads"

**Context Engine:**
```
✅ Found existing research: thoughts/shared/research/2025-11-16-file-uploads.md

Using this research to create implementation plan...

Plan phases:
1. Install ClamAV integration
2. Add scanning middleware after multer
3. Handle infected files
4. Add tests

Approve?
```

**Developer B:** "Approved"

[Implementation proceeds...]

**Result:** Both developers stay aligned without meetings. Research from morning helps afternoon work.

---

## Example 4: Preventing Bad Decisions

### Scenario: Developer tries to implement without understanding

**Developer:** "Add caching to all API endpoints"

**Context Engine:**
```
⚠️  No research found.

Before implementing caching, you should research:
- What caching currently exists?
- Which endpoints would benefit most?
- What caching strategy is used elsewhere?
- Are there endpoints that should NOT be cached?

Shall I research the current state first?
```

**Developer:** "Just cache everything"

**Context Engine:**
```
❌ BLOCKED: Cannot implement without research.

Without research, you might:
- Cache endpoints that return user-specific data (security issue)
- Use wrong caching strategy for your stack
- Conflict with existing caching
- Miss configuration requirements

Let me research first (takes 2 minutes), then we'll create a proper plan.
```

**Developer:** "Fine, research it"

**Context Engine:** 
```
🔍 Research complete.

Findings:
- Redis already configured but unused
- User endpoints should NOT be cached (personalized)
- Analytics endpoints SHOULD be cached (expensive)
- Current response time issues are from N+1 queries, not lack of caching

Recommendation: Fix the database queries first, then add strategic caching.

Create plan for this approach?
```

**Result:** Prevented wasted work on wrong solution.

---

## Tips for Best Results

1. **Trust the process** - Research feels slow but prevents hours of rework
2. **Review plans carefully** - They're easier to fix than code
3. **Use manual verification** - Let humans verify UX/performance
4. **Keep context low** - Better to split into multiple tasks
5. **Document decisions** - Future you will thank you

---

## Common Patterns

### Pattern: New Feature
```
Research (understand existing) 
  → Plan (spec all changes)
  → Implement (execute plan)
  → Validate (verify it works)
```

### Pattern: Bug Fix
```
Research (find root cause)
  → Plan (fix + tests + related issues)
  → Implement (systematic fix)
  → Validate (confirm fix + no regressions)
```

### Pattern: Refactoring
```
Research (understand current architecture)
  → Plan (incremental migration strategy)
  → Implement (phase by phase)
  → Validate (confirm no behavior changes)
```

### Pattern: Integration
```
Research (understand both systems)
  → Plan (connection points + error handling)
  → Implement (with feature flags)
  → Validate (test failure modes)
```
