# Project Overrides Template

This document lists all intentional deviations from the standard Angular coding patterns defined in `angular-coding-standards.md`. Each override includes what rule is being broken, why it's necessary, and when it should be fixed.

## How to Document an Override

Each override should include:
- **Standard Violated**: Reference the specific coding standard (e.g., CS-S03)
- **Current Implementation**: Show the actual code or pattern being used
- **Why**: Explain the business or technical reason for the deviation
- **When to Fix**: Timeline or conditions for resolving (or mark as permanent)
- **Fix Plan/Mitigation**: How to resolve it, or how risks are mitigated

## Example Override

### Performance-Critical State Updates
**Standard Violated**: CS-S01 (One-way data flow)
**Current Implementation**: 
```typescript
// Component directly updates state instead of using service
export class RealTimeComponent {
  updateProgress(currentTime: number) {
    patchState(this.store, { currentTime }); // Direct update
  }
}
```
**Why**: Performance - frequent updates (60fps) would create unacceptable overhead through service layer
**When to Fix**: This is an acceptable permanent override for real-time updates
**Mitigation**: 
- Only time-critical updates bypass the service layer
- All other state changes follow standard patterns
- Updates are scoped to specific performance-critical properties
