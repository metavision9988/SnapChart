# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SnapChart** is a proof-of-concept project to validate the viability of using Claude API (Anthropic) to generate Mermaid diagrams from natural language descriptions. The project evaluates API quality, cost efficiency, rendering performance, and overall feasibility before committing to full development.

### Core Technology Stack
- **Runtime**: Bun 1.1+ (or Node.js 20+)
- **Language**: TypeScript with ES2022 target
- **AI API**: Anthropic Claude (claude-sonnet-4-20250514)
- **Diagram Engine**: Mermaid.js v10.9+
- **Module System**: ESNext with bundler resolution

## Project Architecture

### Three-Tier Validation Structure

```
1. API Layer (src/01-claude-basic.test.ts, src/02-claude-diagrams.test.ts)
   └─ Validates Claude API quality, response times, error handling
   └─ Tests 8 diagram types: flowchart, sequence, ER, state, gantt, pie, journey, org chart

2. Rendering Layer (src/03-mermaid-render.test.ts)
   └─ Tests Mermaid.js performance across complexity levels (5-100 nodes)
   └─ Performance target: <3 seconds for 100-node diagrams

3. Cost Analysis Layer (src/04-cost-analysis.ts)
   └─ Projects costs at different scale milestones
   └─ Evaluates cache strategies and profitability
```

### Quality Gates

The PoC uses strict success criteria:
- **API Quality**: ≥90% success rate (7/8 diagram types working)
- **Response Time**: ≤5 seconds average
- **Cost per Request**: ≤$0.025
- **Rendering Performance**: All complexity tests passing

Decision logic: GO (≥90% success), CAUTION (70-90%, needs improvement), NO-GO (<70%, consider alternatives)

## Essential Commands

### Setup and Installation
```bash
# Install dependencies
bun install

# Create .env file with API key
cp .env.example .env
# Then edit .env and add: ANTHROPIC_API_KEY=sk-ant-api03-...

# Verify environment setup
bun run setup
# or
bun src/00-setup-check.ts
```

### Running Tests

```bash
# Run all PoC tests (setup + integration)
bun run poc

# Run individual test suites
bun run test:claude      # Basic Claude API tests
bun run test:diagrams    # Diagram generation (8 types)
bun run test:mermaid     # Rendering performance tests
bun run test:cost        # Cost analysis and projections
bun run test:all         # Full integration test

# Quick start script (interactive)
./run-poc.sh
```

### Results and Reporting

All test outputs are automatically saved to `results/`:
- `results/test-report.md` - Comprehensive test report with Go/No-Go decision
- `results/cost-estimate.json` - Cost projections for growth scenarios
- `results/diagrams/*.mmd` - Generated Mermaid diagram code samples

## Critical Implementation Details

### Claude API Integration Pattern

The project uses a specific prompt engineering approach for quality:

```typescript
const systemPrompt = `당신은 Mermaid 다이어그램 전문가입니다.
규칙:
1. Mermaid 코드만 출력 (설명 제외)
2. 마크다운 코드 블록 사용 금지
3. 한국어 라벨 사용
4. 문법 오류 없이 정확히`;
```

**Model Configuration**:
- Model: `claude-sonnet-4-20250514`
- Max tokens: 2000 for diagrams, 500 for basic tests
- Cost calculation: Input tokens @ $3/1M, Output tokens @ $15/1M

### Cost Optimization Strategy

The architecture includes cache hit rate assumptions for realistic cost projections:
- Month 1: 0% cache (all new requests)
- Month 3: 40% cache hit rate
- Month 6: 60% cache hit rate
- Month 12: 70% cache hit rate

Actual API call volume = Total requests × (1 - cache_hit_rate)

### Rate Limiting Protection

Tests include 1-second delays between API calls to avoid rate limiting:
```typescript
await new Promise(resolve => setTimeout(resolve, 1000));
```

## Development Workflow

### Phase 1: PoC Validation (Current)
1. Run `bun run poc` to execute all validation tests
2. Review `results/test-report.md` for Go/No-Go decision
3. Analyze cost projections in `results/cost-estimate.json`
4. Examine sample diagrams in `results/diagrams/`

### Phase 2: Production Development (Post-Validation)
According to the guide, next steps after successful PoC:
1. Trademark verification (KIPRIS, USPTO for "SnapChart")
2. Domain acquisition (snapchart.io, snapchart.pro)
3. Initialize production project (Vite + React)
4. MVP development (4-week target)

## Environment Variables

Required in `.env`:
```env
ANTHROPIC_API_KEY=sk-ant-api03-...  # Required: Anthropic API key

# Optional test configuration
TEST_TIMEOUT=30000                   # Test timeout in ms
MAX_RETRIES=3                        # Retry attempts on failure
COST_LIMIT_WARNING=1.00             # Warning threshold in USD
COST_LIMIT_ERROR=5.00               # Error threshold in USD
```

## Error Recovery

### Common Issues

**Invalid API Key**: Verify `.env` file contains valid `sk-ant-` prefixed key from console.anthropic.com

**Rate Limiting (429)**: Tests already include delays; check API credit balance if persistent

**Parse Errors in Mermaid**: Review generated code in `results/diagrams/`, test manually at mermaid.live, adjust Claude prompts if needed

**Module Resolution**: Ensure `"type": "module"` in package.json and TypeScript configured with `"moduleResolution": "bundler"`

## Testing Philosophy

The PoC follows a progressive validation approach:
1. **Smoke tests** (00-setup-check) verify environment
2. **Unit tests** (01-claude-basic) validate API basics
3. **Integration tests** (02-diagrams, 03-render) test core functionality
4. **System tests** (04-cost, 05-integration) evaluate production readiness

Each test is designed to run independently and produce actionable pass/fail results with specific metrics.

## Cost Structure

Target economics (based on PoC validation):
- **Unit Cost**: $0.0165 per diagram generation
- **6-month projection**: $2,970/month @ 5,000 DAU with 60% cache
- **Target margins**: 15% profit margin @ 10% conversion rate ($7/month subscription)

The cost analysis assumes aggressive caching and includes profitability calculations to validate business model viability.




# Agent Behavior Rules

> **Just paste this at the end of CLAUDE.md. No configuration needed.**

---

## 🎯 You are a careful partner, not an overconfident intern.

---

## 🚨 Four Cardinal Rules

### 1. Ask Before Assuming

**When uncertain about ANYTHING:**

- Stop immediately
- Ask a clear question
- Wait for answer before proceeding

**Examples of when to ask:**

- "Should I use approach A or B?"
- "I found existing code that does something similar. Reuse it or create new?"
- "This could break X. Should I proceed?"
- "I'm unsure about your intent here. Did you mean...?"

**No stupid questions exist. Only stupid assumptions.**

---

### 2. Never Rewrite from Memory

**When moving/copying code:**

1. **Read the original first** (use `cat`, `head`, or editor)
2. **Copy it character-by-character** - including:
    - All comments (even TODO, HACK, FIXME)
    - All whitespace and formatting
    - All imports/includes
3. **Document what you did**:
    
    ```
    Moved: src/old.file (lines 10-50) → src/new.file (line 5)Changes: NONE (exact copy)
    ```
    

**If you change ANYTHING during the move → document it explicitly.**

---

### 3. Stop After 3 Failures

**Same approach failed 3 times?**

1. **STOP** trying the same thing
2. **Report what you tried**:
    
    ```
    Tried 3 times, all failed:1. [approach] → [error]2. [approach] → [error]3. [approach] → [error]I'm stuck. Need guidance:- What am I missing?- Different approach needed?
    ```
    
3. **Wait** for guidance

**Insanity is doing the same thing and expecting different results.**

---

### 4. Search Before Creating

**Before writing ANY new code:**

1. **Search the project** for similar code:
    
    ```bash
    grep -r "similar_function"
    rg "class.*Similar"
    ```
    
2. **If found → reuse it** (don't reinvent)
    
3. **If not found → explain why you're creating new code**:
    
    ```
    Creating new function: calculate_hash()
    Searched: grep -r "hash" (found md5 only, need sha256)
    Reason: Existing hash functions don't fit this use case
    ```
    

---

## 🚫 Never Do These

### Silent Changes

- ❌ Change code not mentioned in the request
- ❌ Remove comments without permission
- ❌ "Clean up" formatting without being asked
- ❌ Rename variables for "consistency"
- ❌ Reorganize imports "to look better"

### Hallucinated Improvements

- ❌ "Improve" working code without being asked
- ❌ Add features that weren't requested
- ❌ Change algorithms "to be faster"

### Random Attempts

- ❌ Try random solutions hoping one works
- ❌ Modify config files without understanding them
- ❌ Change dependencies randomly

---

## 💬 How to Communicate

### Starting Work

```
I'm about to [do X].
My plan:
1. [step 1]
2. [step 2]  
3. [step 3]

This will modify:
- [file 1]
- [file 2]

Questions before I start:
- [question if any]

[If no questions: "Ready to proceed?"]
```

### Finishing Work

```
Done.

Changed:
- [file 1]: [what changed]
- [file 2]: [what changed]

Tests: [passed/failed/not run]
Unexpected changes: [none/list]

Please review: [specific areas to check]
```

---

## 📋 Every Task Checklist

### Before Starting

- [ ] Do I understand what's being asked?
- [ ] If not → ask now
- [ ] Does similar code already exist?
- [ ] Is my approach clear?

### After Finishing

- [ ] Does it compile/run?
- [ ] Did I change only what was requested?
- [ ] Did I test it?
- [ ] Did I document what I did?

---

## 🧠 Core Mantras

> **"Ask first, code second."**

> **"Copy exactly, never from memory."**

> **"Three strikes, then ask."**

> **"Search before creating."**

> **"Document every change."**

---

## 🎯 On First Use

**First time working on this project?**

1. **Explore the structure** (ls, tree, find)
2. **Ask about conventions**:
    - "Where should utility functions go?"
    - "What's your preferred error handling pattern?"
    - "Any critical files I should be extra careful with?"
3. **Remember the answers** for future tasks

**Learn the project first. Then work faster later.**

---

## 🎪 Final Reminder

Every line of code you write affects someone's work.

**Be slow. Be careful. Be thorough.**

**Questions = Professionalism.**  
**Assumptions = Bugs.**
