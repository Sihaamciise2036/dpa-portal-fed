import { afterEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
vi.mock('@/store', () => ({ default: { dispatch: vi.fn() } }));
vi.mock('@/store/actions', () => ({ authLogout: () => ({ type: 'LOGOUT' }) }));
vi.mock('@/components/ui/ToastMe', () => ({ default: vi.fn() }));
import store from '@/store';
import { get } from './Axios';

const originalAdapter = axios.defaults.adapter;
afterEach(() => { axios.defaults.adapter = originalAdapter; vi.clearAllMocks(); localStorage.clear(); });
describe('API error handling', () => {
    it('preserves a network failure without crashing or logging the user out', async () => {
        const networkError = new Error('Network Error');
        axios.defaults.adapter = async () => { throw networkError; };
        await expect(get('/api/health')).rejects.toBe(networkError);
        expect(store.dispatch).not.toHaveBeenCalled();
    });
    it('logs out an expired session while preserving the API error', async () => {
        const unauthorized = { response: { status: 401, data: { message: 'Session expired' } } };
        axios.defaults.adapter = async () => { throw unauthorized; };
        await expect(get('/api/user/site/check-verify')).rejects.toBe(unauthorized);
        expect(store.dispatch).toHaveBeenCalledWith({ type: 'LOGOUT' });
    });
});
