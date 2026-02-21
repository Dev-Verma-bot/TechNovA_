import React from "react";
import {
    Shield,
    ShieldCheck,
    FileCheck2,
    LockKeyhole,
    CheckCircle2,
    KeyRound,
    Fingerprint,
    Download,
    Scale,
    Headphones,
} from "lucide-react";

const standards = [
    {
        icon: ShieldCheck,
        title: "GDPR Compliant",
        description:
            "Strict adherence to General Data Protection Regulations to protect your privacy rights globally.",
    },
    {
        icon: FileCheck2,
        title: "FCRA Certified",
        description:
            "Aligned with Fair Credit Reporting Act requirements for data accuracy and lending transparency.",
    },
    {
        icon: LockKeyhole,
        title: "SOC 2 Type II",
        description:
            "Independently audited controls that protect infrastructure, systems, and customer information.",
    },
];

const securityItems = [
    { icon: Shield, text: "AES-256 Encryption" },
    { icon: KeyRound, text: "SSL/TLS 1.3 in Transit" },
    { icon: Fingerprint, text: "Multi-Factor Authentication" },
];

const rights = [
    {
        title: "Right to Access",
        text: "Request a copy of the personal data we store about your account at any time.",
    },
    {
        title: "Right to Erasure",
        text: "Request deletion of your personal data when retention is no longer required.",
    },
];

const PrivacyPolicy = () => {
    return (
        <div className="bg-[#f4f7fb] text-slate-900">
            <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-14 pb-16">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-4 py-1.5 text-xs md:text-sm font-semibold">
                        <Shield className="w-4 h-4" />
                        Trusted by 2M+ Users
                    </span>

                    <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight text-slate-900">
                        Your Privacy and{" "}
                        <span className="text-blue-600">Data Security</span>
                    </h1>

                    <p className="max-w-3xl mx-auto mt-5 text-slate-600 text-base md:text-lg leading-relaxed">
                        We apply bank-grade encryption and compliance controls to protect your
                        financial data through every stage of the lending journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
                    {standards.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                                {React.createElement(item.icon, { className: "w-5 h-5 text-blue-600" })}
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-slate-600 leading-7">{item.description}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-10">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
                                How we use your data
                            </h2>
                            <p className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed">
                                We only collect information necessary to evaluate your loan
                                application and verify identity. This includes employment details,
                                income verification, and credit profile signals.
                            </p>
                            <ul className="mt-6 space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                                    <span className="text-slate-700">
                                        Identity verification through secure and approved data sources.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                                    <span className="text-slate-700">
                                        Credit risk analysis using explainable scoring models.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                                    <span className="text-slate-700">
                                        Fraud prevention safeguards to protect account access and integrity.
                                    </span>
                                </li>
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
                                Your rights as an applicant
                            </h2>
                            <p className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed">
                                Transparency is part of our compliance model. You remain in control
                                of your personal data.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4 mt-6">
                                {rights.map((item) => (
                                    <div
                                        key={item.title}
                                        className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                                    >
                                        <h3 className="text-blue-600 text-sm font-bold uppercase tracking-wide">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-slate-700 leading-7">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 md:p-8">
                            <div className="flex items-center gap-3">
                                <Scale className="w-6 h-6 text-blue-600" />
                                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                                    Our commitment to fairness
                                </h2>
                            </div>
                            <p className="mt-4 text-slate-700 text-base md:text-lg leading-relaxed">
                                Our lending models are reviewed regularly by independent experts to
                                reduce bias and promote equal access to credit through explainable AI.
                            </p>
                        </section>
                    </div>

                    <aside className="space-y-5">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6">
                            <h3 className="text-xl font-extrabold text-slate-900">
                                Security Infrastructure
                            </h3>
                            <div className="mt-5 space-y-5">
                                {securityItems.map((item) => (
                                    <div key={item.text}>
                                        <p className="flex items-center gap-2 text-slate-800 font-semibold text-sm md:text-base">
                                            {React.createElement(item.icon, { className: "w-4 h-4 text-blue-600" })}
                                            {item.text}
                                        </p>
                                        <div className="h-1.5 rounded bg-blue-600 mt-2" />
                                    </div>
                                ))}
                            </div>

                            <a href="/CredNova_Privacy_Policy.pdf#toolbar=0" target="_blank" rel="noopener noreferrer" className="w-full mt-6 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold py-3 text-sm md:text-base inline-flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" />
                                Privacy Policy (PDF)
                            </a>
                            <p className="text-center mt-3 text-xs text-slate-500">
                                Last updated: Oct 2023
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-[#071530] text-white p-6 relative overflow-hidden">
                            <h3 className="text-2xl font-black tracking-tight">Need help?</h3>
                            <p className="mt-3 text-blue-100 text-sm md:text-base leading-7">
                                Contact our Data Protection Officer for any privacy or compliance concerns.
                            </p>
                            <Headphones className="absolute right-4 bottom-3 w-16 h-16 text-blue-200/20" />
                        </div>
                    </aside>
                </div>
            </section>

        </div>
    );
};

export default PrivacyPolicy;

