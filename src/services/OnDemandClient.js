import axios from 'axios';

class OnDemandClient {
    /**
     * Initialize the OnDemand Chat Client
     * @param {string} apiKey - Your OnDemand API Key
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.on-demand.io/chat/v1';
        this.headers = {
            'Content-Type': 'application/json',
            'apikey': this.apiKey
        };
    }

    /**
     * Helper to handle API requests
     */
    async _request(method, endpoint, data = null, params = null) {
        try {
            const config = {
                method: method,
                url: `${this.baseURL}${endpoint}`,
                headers: this.headers,
                data: data,
                params: params
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error(`Error [${method} ${endpoint}]:`, error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // ==========================================
    // Session Management
    // ==========================================

    /**
     * Create a new Chat Session
     * @param {string} externalUserId - Unique ID for the user in your system
     * @param {Array} pluginIds - List of plugin IDs (optional)
     */
    async createSession(externalUserId, pluginIds = []) {
        const payload = {
            externalUserId: externalUserId,
            pluginIds: pluginIds
        };
        return this._request('POST', '/sessions', payload);
    }

    /**
     * Get details of a specific Chat Session
     * @param {string} sessionId 
     */
    async getSession(sessionId) {
        return this._request('GET', `/sessions/${sessionId}`);
    }

    /**
     * Get all Chat Sessions
     * @param {number} limit - Number of sessions to fetch (default 10)
     * @param {string} sort - 'asc' or 'desc'
     */
    async getAllSessions(limit = 10, sort = 'asc') {
        return this._request('GET', '/sessions', null, { limit, sort });
    }

    // ==========================================
    // Chat Interaction
    // ==========================================

    /**
     * Submit a Query to the Chat API
     * @param {string} sessionId - The Session ID
     * @param {string} query - The user's question
     * @param {string} endpointId - The model endpoint (e.g., 'predefined-openai-gpt4o')
     * @param {string} responseMode - 'sync', 'stream', or 'webhook' (default 'sync')
     */
    async submitQuery(sessionId, query, endpointId = "predefined-openai-gpt4o", responseMode = "sync") {
        const payload = {
            endpointId: endpointId,
            query: query,
            pluginIds: [],
            responseMode: responseMode
        };
        return this._request('POST', `/sessions/${sessionId}/query`, payload);
    }

    // ==========================================
    // Message History
    // ==========================================

    /**
     * Get a specific Chat Message
     * @param {string} sessionId 
     * @param {string} messageId 
     */
    async getMessage(sessionId, messageId) {
        return this._request('GET', `/sessions/${sessionId}/messages/${messageId}`);
    }

    /**
     * Get all messages for a session
     * @param {string} sessionId 
     * @param {number} limit 
     * @param {string} cursor - ID of the last message seen (for pagination)
     */
    async getAllMessages(sessionId, limit = 10, cursor = null) {
        const params = { limit };
        if (cursor) params.cursor = cursor;
        
        return this._request('GET', `/sessions/${sessionId}/messages`, null, params);
    }
}

export default OnDemandClient;
