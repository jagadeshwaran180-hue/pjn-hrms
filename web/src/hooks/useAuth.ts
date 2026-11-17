/**
 * Re-export useAuth from AuthContext to maintain backwards compatibility
 * while guaranteeing single-source-of-truth state across the application.
 */
export { useAuth, useAuthContext } from '../context/AuthContext';
export type { UserSession } from '../types';
