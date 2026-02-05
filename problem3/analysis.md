
# Inefficiencies and anti-patterns
- The filter/sort work reruns every time `prices` changes, even though prices are not used in that memo. That is extra CPU on every price tick.
- Priority is recalculated multiple times for the same item (once in filter and many times in sort). Compute it once and reuse it.
- `getPriority` is defined inline but not part of the memo deps. If it ever captures state, this becomes a hook dependency bug. Safer to move it to module scope or memoize it.
- The sort comparator never returns `0`, so equal priorities can shuffle on every render.
- `formattedBalances` is computed and then ignored, while `rows` maps the raw list again. That is wasted work and also drops the formatted value.
- `index` is used as the React key. With sorting, this causes remounts and state loss. Use a stable and unique identifier like `${blockchain}-${currency}`.

# Correctness and type-safety issues
- `WalletBalance` does not include `blockchain` but the code reads it. That is a TypeScript error.
- The filter uses `lhsPriority`, which is undefined, and the `amount <= 0` check is inverted. It should be `amount > 0`.
- `formattedAmount` is read from `balance.formatted`, but `sortedBalances` never adds it, so the value is `undefined`.
- `prices[balance.currency]` can be `undefined`, leading to `NaN` USD values. Default to `0`.
- `children` is destructured but never rendered, which is misleading. Either render `{children}` or remove it.

# Refactor approach
- Build a single derived list: add priority, filter, sort, then format the amount. Returning `null` for unsupported chains.
- Keep memo dependencies tight: sorting depends on `balances`, while USD values depend on `prices`.
- Render rows from the formatted list and use a stable key.
