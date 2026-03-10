// src/services/localService.js
// Facade: re-export all service functions from domain-specific modules.
// Keeps backward-compatibility so existing import statements don't need to change.

export * from "./taskService";
export * from "./sessionService";
export * from "./financeService";
export * from "./backupService";
