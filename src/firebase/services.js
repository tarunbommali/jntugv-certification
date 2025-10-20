// Re-export all named exports from the modular services and provide a default
// export for compatibility with existing code that imports the default.

export * from './services_modular/index.js';
import servicesDefault from './services_modular/index.js';
export default servicesDefault;