import { useEffect, useRef, useState } from "react";

const INITIAL_BOT_MESSAGE =
    "I am a guided wellbeing check-in, not a therapist. I cannot provide clinical care, but I can ask a few questions and share simple coping tips. How are you feeling today?";

const MOOD_OPTIONS = [
    { label: "Anxious", value: "anxious" },
    { label: "Sad", value: "sad" },
    { label: "Stressed", value: "stressed" },
    { label: "Angry", value: "angry" },
    { label: "Okay", value: "okay" },
];

const FOLLOW_UPS = {
    anxious: {
        question: "What is showing up most right now?",
        options: ["Racing thoughts", "Tight chest", "Trouble sleeping", "I need a reset"],
    },
    sad: {
        question: "What would help most in this moment?",
        options: ["Grounding", "A tiny routine", "Talk it out", "Just listen"],
    },
    stressed: {
        question: "What feels most urgent?",
        options: ["Too much to do", "Can't focus", "Body tension", "Slow me down"],
    },
    angry: {
        question: "Would you like to cool down or vent a little?",
        options: ["Cool down", "Vent it out", "Step away", "Breathe first"],
    },
    okay: {
        question: "Would you like a small maintenance tip?",
        options: ["Breathing", "Grounding", "Check-in", "Something gentle"],
    },
};

const CRISIS_PATTERN = /(suicid|kill myself|end my life|take my life|self[- ]?harm|hurt myself|want to die|cannot go on|can't go on|end it all|overdose|no reason to live)/i;

const CRISIS_MESSAGE =
    "Please contact a Kenyan helpline now: Kenya Red Cross 1199, LVCT/one2one 1190, or NACADA 1192. If you are in immediate danger, call local emergency services or go to the nearest hospital now.";

function normalizeText(value) {
    return value.toLowerCase().trim();
}

function includesAny(value, terms) {
    return terms.some(term => value.includes(term));
}

function classifyMood(value) {
    const text = normalizeText(value);

    if (includesAny(text, ["anxious", "panic", "worried", "stressed", "overwhelmed", "racing thoughts"])) {
        return "anxious";
    }

    if (includesAny(text, ["sad", "down", "low", "numb", "empty", "lonely", "hopeless", "crying", "cry"])) {
        return "sad";
    }

    if (includesAny(text, ["angry", "mad", "frustrated", "irritated", "furious", "fed up"])) {
        return "angry";
    }

    if (includesAny(text, ["stressed", "pressure", "busy", "overwhelmed", "tense"])) {
        return "stressed";
    }

    return "okay";
}

function buildTip(branch, value) {
    const text = normalizeText(value);

    if (branch === "anxious" || branch === "stressed") {
        if (includesAny(text, ["racing thoughts", "can't focus", "cannot focus", "body tension", "tight chest", "reset", "slow"])) {
            return {
                label: "Grounding reset",
                text: "Try the 5-4-3-2-1 grounding exercise: name 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, and 1 you can taste.",
            };
        }

        return {
            label: "Breathing reset",
            text: "Try 4-4-6 breathing: inhale for 4, hold for 4, exhale for 6. Repeat 4 times and relax your shoulders as you exhale.",
        };
    }

    if (branch === "sad") {
        if (includesAny(text, ["talk", "listen", "someone", "support"])) {
            return {
                label: "Reach out step",
                text: "Send one short message to someone you trust, even if it is only: 'I am having a rough moment and could use a quick check-in.'",
            };
        }

        return {
            label: "Grounding reset",
            text: "Name 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, and 1 you can taste. Then drink a glass of water if you can.",
        };
    }

    if (branch === "angry") {
        if (includesAny(text, ["vent", "talk", "write", "breathe"])) {
            return {
                label: "Cool-down reset",
                text: "Unclench your jaw, drop your shoulders, and take 10 slow exhale breaths. If possible, step away from the trigger for one minute.",
            };
        }

        return {
            label: "Cool-down reset",
            text: "Try the 10-second pause: breathe out slowly, count to 10, and name one thing you can control right now.",
        };
    }

    return {
        label: "Gentle reset",
        text: "Sit upright, place both feet on the floor, and take 5 slow breaths. Notice one thing that feels safe or steady around you.",
    };
}

function createBotMessage(id, text, variant = "default") {
    return { id, sender: "bot", text, variant };
}

function createUserMessage(id, text) {
    return { id, sender: "user", text, variant: "default" };
}

function getQuickReplies(stage, branch) {
    if (stage === "mood") {
        return MOOD_OPTIONS;
    }

    if (stage === "followup") {
        return FOLLOW_UPS[branch]?.options.map(option => ({ label: option, value: option })) ?? [];
    }

    if (stage === "tip") {
        return [
            { label: "Another tip", value: "another tip" },
            { label: "Start over", value: "start over" },
        ];
    }

    return [{ label: "Start over", value: "start over" }];
}

export default function MentalHealthPage() {
    const [messages, setMessages] = useState([createBotMessage(1, INITIAL_BOT_MESSAGE, "intro")]);
    const [inputValue, setInputValue] = useState("");
    const [stage, setStage] = useState("mood");
    const [branch, setBranch] = useState("okay");
    const messageIdRef = useRef(2);
    const feedEndRef = useRef(null);

    useEffect(() => {
        feedEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages]);

    function pushBotMessage(text, variant = "default") {
        setMessages(current => [...current, createBotMessage(messageIdRef.current++, text, variant)]);
    }

    function pushUserMessage(text) {
        setMessages(current => [...current, createUserMessage(messageIdRef.current++, text)]);
    }

    function resetConversation() {
        messageIdRef.current = 2;
        setMessages([createBotMessage(1, INITIAL_BOT_MESSAGE, "intro")]);
        setInputValue("");
        setStage("mood");
        setBranch("okay");
    }

    function handleSelection(value) {
        if (value === "start over") {
            resetConversation();
            return;
        }

        handleSubmit(value);
    }

    function handleSubmit(rawValue) {
        const value = typeof rawValue === "string" ? rawValue : inputValue;
        const trimmed = value.trim();

        if (!trimmed) {
            return;
        }

        pushUserMessage(trimmed);
        setInputValue("");

        if (CRISIS_PATTERN.test(trimmed)) {
            pushBotMessage(CRISIS_MESSAGE, "crisis");
            setStage("crisis");
            return;
        }

        if (stage === "mood") {
            const nextBranch = classifyMood(trimmed);
            setBranch(nextBranch);
            pushBotMessage(FOLLOW_UPS[nextBranch].question, "question");
            setStage("followup");
            return;
        }

        if (stage === "followup") {
            const tip = buildTip(branch, trimmed);
            pushBotMessage(tip.text, "tip");
            pushBotMessage("If you want another quick reset, tap another chip or ask for one more tip.", "system");
            setStage("tip");
            return;
        }

        if (stage === "tip") {
            if (includesAny(normalizeText(trimmed), ["another tip", "more", "yes", "something else"])) {
                pushBotMessage(buildTip(branch, "").text, "tip");
                return;
            }

            pushBotMessage("Tap Start over to begin a new check-in, or choose another short request.", "system");
            return;
        }

        if (stage === "crisis") {
            pushBotMessage("The crisis support flow is paused until you restart the check-in.", "system");
        }
    }

    const quickReplies = getQuickReplies(stage, branch);
    const crisisActive = stage === "crisis";

    return (
        <section className="mental-health-page">
            <header className="mental-health-hero">
                <div>
                    <p className="app-eyebrow">Wellbeing</p>
                    <h1>Guided mental health check-in</h1>
                    <p className="app-subtitle">
                        This is a frontend-only MVP. It is not a therapist and cannot provide clinical care, but it can check in, branch through simple answers, and share a coping tip.
                    </p>
                </div>

                <div className="mental-health-hero__badge">Rule-based chat</div>
            </header>

            <div className="mental-health-layout">
                <section className="mental-health-chat" aria-label="Mental health chatbot">
                    <div className="mental-health-chat__header">
                        <div>
                            <p className="mental-health-eyebrow">Chatbot</p>
                            <h2>How are you feeling today?</h2>
                        </div>

                        <button type="button" className="mental-health-reset" onClick={resetConversation}>
                            Start over
                        </button>
                    </div>

                    <div className="mental-health-chat__feed" aria-live="polite" aria-relevant="additions text">
                        {messages.map(message => (
                            <article
                                key={message.id}
                                className={`chat-bubble chat-bubble--${message.sender} chat-bubble--${message.variant}`}
                            >
                                {message.text}
                            </article>
                        ))}
                        <div ref={feedEndRef} />
                    </div>

                    {crisisActive ? (
                        <div className="mental-health-crisis">
                            <p className="mental-health-crisis__eyebrow">Crisis support</p>
                            <p className="mental-health-crisis__copy">{CRISIS_MESSAGE}</p>
                            <div className="mental-health-crisis__numbers">
                                <span>Kenya Red Cross 1199</span>
                                <span>LVCT/one2one 1190</span>
                                <span>NACADA 1192</span>
                            </div>
                        </div>
                    ) : null}

                    <form
                        className="mental-health-chat__composer"
                        onSubmit={event => {
                            event.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <div className="mental-health-quick-replies" aria-label="Suggested replies">
                            {quickReplies.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className="mental-health-chip"
                                    onClick={() => handleSelection(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        <div className="mental-health-input-row">
                            <input
                                type="text"
                                className="mental-health-input"
                                value={inputValue}
                                onChange={event => setInputValue(event.target.value)}
                                placeholder={
                                    crisisActive
                                        ? "The crisis flow is paused"
                                        : "Type a short reply or pick a suggestion"
                                }
                                disabled={crisisActive}
                                aria-label="Type a reply"
                            />

                            <button type="submit" className="mental-health-send" disabled={crisisActive}>
                                Send
                            </button>
                        </div>
                    </form>
                </section>

                <aside className="mental-health-sidebar">
                    <article className="mental-health-card mental-health-card--note">
                        <p className="mental-health-card__eyebrow">What this demo does</p>
                        <h2>Simple, rule-based support</h2>
                        <p>
                            The bot opens with a check-in, branches by mood, then gives a dummy breathing or grounding exercise. It does not use AI and it does not replace a clinician.
                        </p>
                    </article>

                    <article className="mental-health-card mental-health-card--support">
                        <p className="mental-health-card__eyebrow">Kenya crisis numbers</p>
                        <h2>Visible immediately when needed</h2>
                        <ul className="mental-health-list">
                            <li>Kenya Red Cross 1199</li>
                            <li>LVCT/one2one 1190</li>
                            <li>NACADA 1192</li>
                        </ul>
                    </article>

                    <article className="mental-health-card">
                        <p className="mental-health-card__eyebrow">Coping tools</p>
                        <h2>Generic examples only</h2>
                        <ul className="mental-health-list">
                            <li>4-4-6 breathing</li>
                            <li>5-4-3-2-1 grounding</li>
                            <li>A tiny next step like drinking water or messaging someone you trust</li>
                        </ul>
                    </article>
                </aside>
            </div>
        </section>
    );
}