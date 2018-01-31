# lockfile
Simple utility to lock and unlock lockfiles

```javascript
import Lockfile from '@paleite/lockfile'
const lf = new Lockfile(__filename)
lf
  .lock()
  .then(() => {
    // ... your code
    lf.unlock()
  })
  .catch(e => {
    console.error(e)
  })
```
