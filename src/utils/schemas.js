// Compatibility wrapper: re-export the canonical firebase services implementation.
// This file preserves older import paths that referenced `src/utils/schemas.js`.
// Compatibility wrapper: re-export the canonical firebase services implementation.
// This file preserves older import paths that referenced `src/utils/schemas.js`.
// The single source of truth for Firebase operations is `src/firebase/services.js`.

import * as services from '../firebase/services';

export * from '../firebase/services';
export default services;