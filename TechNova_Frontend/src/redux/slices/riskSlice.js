import { createSlice } from '@reduxjs/toolkit';

const baseInitialState = {
    applicationId: null,
    score: null,
    category: null, // 'green' | 'yellow' | 'red'
    status: null, // 'approved' | 'manual' | 'declined'
    features: [],
    suggestions: [],
    message: "",
    riskCategory: "",
    probabilityApproval: null,
    probabilityDefault: null,
    rejectionReasons: "",
    isLoading: false,
};

const getStoredDecisionState = () => {
    try {
        const raw = localStorage.getItem('decisionState');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (error) {
        return null;
    }
};

const saveDecisionState = (state) => {
    try {
        localStorage.setItem('decisionState', JSON.stringify(state));
    } catch (error) {
        // ignore storage write errors
    }
};

const clearDecisionState = () => {
    try {
        localStorage.removeItem('decisionState');
    } catch (error) {
        // ignore storage remove errors
    }
};

const initialState = {
    ...baseInitialState,
    ...(getStoredDecisionState() || {}),
};

const decisionSlice = createSlice({
    name: 'decision',
    initialState,
    reducers: {
        setDecisionData: (state, action) => {
            const {
                applicationId,
                score,
                features,
                suggestions,
                status,
                category,
                message,
                riskCategory,
                probabilityApproval,
                probabilityDefault,
                rejectionReasons,
            } = action.payload;
            state.applicationId = applicationId;
            state.score = score;

            // Prefer backend status/category if available, else infer from score
            if (status) {
                state.status = status;
            } else {
                if (score >= 750) state.status = 'approved';
                else if (score >= 600) state.status = 'manual';
                else state.status = 'declined';
            }

            if (category) {
                state.category = category;
            } else {
                if (score >= 750) state.category = 'green';
                else if (score >= 600) state.category = 'yellow';
                else state.category = 'red';
            }

            state.features = features || [];
            state.suggestions = suggestions || [];
            state.message = message || "";
            state.riskCategory = riskCategory || "";
            state.probabilityApproval = probabilityApproval ?? null;
            state.probabilityDefault = probabilityDefault ?? null;
            state.rejectionReasons = rejectionReasons || "";
            state.isLoading = false;
            saveDecisionState({ ...state });
        },
        setDecisionLoading: (state, action) => {
            state.isLoading = action.payload;
            saveDecisionState({ ...state });
        },
        resetDecision: () => {
            clearDecisionState();
            return baseInitialState;
        },
    }
});

export const { setDecisionData, setDecisionLoading, resetDecision } = decisionSlice.actions;

export const selectDecision = (state) => state.risk || baseInitialState;

export default decisionSlice.reducer;
