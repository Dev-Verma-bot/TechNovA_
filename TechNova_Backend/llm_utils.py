from groq import Groq
from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Dict, Any
import json
from config import Config

# Create Groq Client
client = Groq(api_key=Config.GROQ_API_KEY)

# Choose model (example: llama3-70b)
GROQ_MODEL = "llama-3.3-70b-versatile"


# ---------------- STATE ----------------
class LoanAnalysisState(TypedDict):
    application_data: Dict[str, Any]
    prediction_results: Dict[str, Any]
    rejection_reasons: str
    improvements_needed: str
    risk_factors: Dict[str, List[str]]
    risk_category: str
    final_response: str


class LoanLLMAnalyzer:
    def __init__(self):
        self.setup_langgraph()

    def setup_langgraph(self):
        workflow = StateGraph(LoanAnalysisState)

        workflow.add_node("analyze_rejection_reasons", self.analyze_rejection_reasons)
        workflow.add_node("generate_improvements", self.generate_improvements)
        workflow.add_node("identify_risk_factors", self.identify_risk_factors)
        workflow.add_node("format_final_response", self.format_final_response)

        workflow.set_entry_point("analyze_rejection_reasons")
        workflow.add_edge("analyze_rejection_reasons", "generate_improvements")
        workflow.add_edge("generate_improvements", "identify_risk_factors")
        workflow.add_edge("identify_risk_factors", "format_final_response")
        workflow.add_edge("format_final_response", END)

        self.app = workflow.compile()

    # ---------- HELPER FUNCTION ----------
    def generate_llm_response(self, prompt: str) -> str:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert financial risk analyst."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        return response.choices[0].message.content

    # ---------------- NODE 1 ----------------
    def analyze_rejection_reasons(self, state: LoanAnalysisState) -> LoanAnalysisState:

        prompt = f"""
        Analyze why this loan application was rejected.

        Application Data:
        {json.dumps(state['application_data'], indent=2)}

        Prediction Results:
        - Default Probability: {state['prediction_results']['probability_default']:.2%}
        - Risk Category: {state['prediction_results']['risk_category']}

        Feature Importance:
        {json.dumps(dict(list(state['prediction_results']['feature_importance'].items())[:5]), indent=2)}

        Provide a clear and empathetic explanation.
        """

        state['rejection_reasons'] = self.generate_llm_response(prompt)
        return state

    # ---------------- NODE 2 ----------------
    def generate_improvements(self, state: LoanAnalysisState) -> LoanAnalysisState:

        prompt = f"""
        Provide 5 specific improvements to increase approval chances.

        Application Data:
        {json.dumps(state['application_data'], indent=2)}

        Risk Factors:
        {state['rejection_reasons']}
        """

        state['improvements_needed'] = self.generate_llm_response(prompt)
        return state

    # ---------------- NODE 3 ----------------
    def identify_risk_factors(self, state: LoanAnalysisState) -> LoanAnalysisState:

        feature_imp = state['prediction_results']['feature_importance']
        app_data = state['application_data']

        prompt = f"""
        Analyze these values and return STRICT JSON:

        Application Values:
        {json.dumps(app_data, indent=2)}

        Feature Importance:
        {json.dumps(feature_imp, indent=2)}

        Format:
        {{
            "increasing_risk": ["Feature 1"],
            "decreasing_risk": ["Feature 2"]
        }}
        """

        response_text = self.generate_llm_response(prompt)

        try:
            risk_factors = json.loads(response_text)
        except:
            risk_factors = {
                "increasing_risk": ["Credit Score", "DTI Ratio"],
                "decreasing_risk": ["Income", "Employment Stability"]
            }

        state['risk_factors'] = risk_factors
        return state

    # ---------------- NODE 4 ----------------
    def format_final_response(self, state: LoanAnalysisState) -> LoanAnalysisState:

        if state['prediction_results']['predicted_class'] == 1:
            final_response = {
                "status": "approved",
                "message": "Congratulations! Your loan application has been approved.",
                "probability_approval": f"{state['prediction_results']['probability_approval']:.2%}",
                "risk_category": state['prediction_results']['risk_category']
            }
        else:
            final_response = {
                "status": "rejected",
                "message": "We regret to inform you that your loan application was not approved at this time.",
                "probability_default": f"{state['prediction_results']['probability_default']:.2%}",
                "risk_category": state['prediction_results']['risk_category'],
                "rejection_reasons": state['rejection_reasons'],
                "improvements_needed": state['improvements_needed'],
                "risk_factors": state['risk_factors']
            }

        state['final_response'] = json.dumps(final_response, indent=2)
        return state

    # ---------------- MAIN ENTRY ----------------
    def analyze_application(self, application_data, prediction_results):

        initial_state = {
            "application_data": application_data,
            "prediction_results": prediction_results,
            "rejection_reasons": "",
            "improvements_needed": "",
            "risk_factors": {},
            "risk_category": prediction_results['risk_category'],
            "final_response": ""
        }

        final_state = self.app.invoke(initial_state)
        return json.loads(final_state['final_response'])


# Singleton instance
llm_analyzer = LoanLLMAnalyzer()