import { useEffect, useRef, useState } from "react";

const INITIAL_BOT_MESSAGE =
    "Hi, I'm Uzima. I'm here to help you pause, reflect, and take a small step toward feeling better. How are you feeling right now?";

const MOOD_OPTIONS = [
    { label: "😰 Anxious", value: "anxious" },
    { label: "😔 Sad", value: "sad" },
    { label: "😤 Stressed", value: "stressed" },
    { label: "😠 Angry", value: "angry" },
    { label: "😴 Drained", value: "drained" },
    { label: "🙂 Okay", value: "okay" },
];

const CONVERSATION_PATHS = {
    anxious: {
        followUp:
            "That sounds difficult. What feels closest to what you're experiencing right now?",
        options: [
            "My thoughts won't slow down",
            "I feel tense",
            "I'm worried about something",
            "I just need to calm down",
        ],
        reflection:
            "You don't need to solve everything at once. Let's focus on helping your mind and body settle first.",
    },

    sad: {
        followUp:
            "I'm sorry you're having a difficult moment. What would feel most helpful right now?",
        options: [
            "I want to talk about it",
            "I feel lonely",
            "I need a distraction",
            "I just want a small step",
        ],
        reflection:
            "You don't have to force yourself to feel better immediately. Sometimes the next helpful step can be very small.",
    },

    stressed: {
        followUp:
            "It sounds like a lot is competing for your attention. What's weighing on you the most?",
        options: [
            "Too much to do",
            "I can't focus",
            "I feel physically tense",
            "I need to slow down",
        ],
        reflection:
            "When everything feels urgent, it can help to pause before deciding what deserves your attention first.",
    },

    angry: {
        followUp:
            "Something seems to have pushed you to your limit. What would help most right now?",
        options: [
            "I need to cool down",
            "I want to vent",
            "I need some space",
            "I want to regain control",
        ],
        reflection:
            "You don't have to act on the feeling immediately. Creating even a little space can make the next decision easier.",
    },

    drained: {
        followUp:
            "It sounds like your energy is running low. What kind of tired are you feeling?",
        options: [
            "Mentally exhausted",
            "Physically tired",
            "Burned out",
            "I just need a reset",
        ],
        reflection:
            "Low energy can make even simple things feel heavier. Let's keep the next step gentle and realistic.",
    },

    okay: {
        followUp:
            "It's good to check in even when things are relatively steady. What would you like to focus on?",
        options: [
            "Maintaining my balance",
            "Reducing stress",
            "Improving my mood",
            "A quick wellness exercise",
        ],
        reflection:
            "Small habits can help protect the calm moments too.",
    },
};

const CRISIS_PATTERN =
    /(suicide|kill myself|end my life|take my life|self[- ]?harm|hurt myself|want to die|cannot go on|can't go on|end it all|overdose|no reason to live)/i;

function normalizeText(value) {
    return value.toLowerCase().trim();
}

function includesAny(value, terms) {
    return terms.some((term) => value.includes(term));
}

function classifyMood(value) {
    const text = normalizeText(value);

    if (
        includesAny(text, [
            "anxious",
            "anxiety",
            "panic",
            "worried",
            "nervous",
            "scared",
            "racing thoughts",
        ])
    ) {
        return "anxious";
    }

    if (
        includesAny(text, [
            "sad",
            "down",
            "low",
            "lonely",
            "empty",
            "crying",
            "hopeless",
            "numb",
        ])
    ) {
        return "sad";
    }

    if (
        includesAny(text, [
            "angry",
            "mad",
            "furious",
            "frustrated",
            "irritated",
            "annoyed",
        ])
    ) {
        return "angry";
    }

    if (
        includesAny(text, [
            "stressed",
            "overwhelmed",
            "pressure",
            "busy",
            "too much",
            "can't focus",
            "tense",
        ])
    ) {
        return "stressed";
    }

    if (
        includesAny(text, [
            "tired",
            "drained",
            "exhausted",
            "burnout",
            "burned out",
            "no energy",
        ])
    ) {
        return "drained";
    }

    return "okay";
}

function getSupportResponse(branch, value) {
    const text = normalizeText(value);

    if (branch === "anxious") {
        if (
            includesAny(text, [
                "thought",
                "slow",
                "worried",
                "racing",
            ])
        ) {
            return {
                title: "Bring yourself back to the present",
                text:
                    "Try this slowly: look around and name 5 things you can see. Then notice 4 things you can physically feel. You don't need to make the thoughts disappear — just give your attention somewhere else for a moment.",
            };
        }

        return {
            title: "A slower breathing rhythm",
            text:
                "Relax your shoulders if you can. Breathe in gently for 4 seconds, pause briefly, then breathe out slowly for 6 seconds. Repeat a few times without forcing the breath.",
        };
    }

    if (branch === "sad") {
        if (
            includesAny(text, [
                "lonely",
                "talk",
                "someone",
                "alone",
            ])
        ) {
            return {
                title: "A small connection",
                text:
                    "You don't have to explain everything perfectly. Consider sending someone you trust a simple message such as: 'I'm having a rough day and could use someone to talk to.'",
            };
        }

        return {
            title: "One gentle next step",
            text:
                "Pick one small action that feels possible: drink some water, change rooms, step outside for a few minutes, or sit somewhere comfortable. The goal isn't to fix everything — just to make this moment slightly easier.",
        };
    }

    if (branch === "stressed") {
        if (
            includesAny(text, [
                "too much",
                "urgent",
                "busy",
                "do",
            ])
        ) {
            return {
                title: "Reduce the mental pile",
                text:
                    "Write down everything competing for your attention. Then choose just one thing that genuinely needs to happen next. You can come back to the rest later.",
            };
        }

        return {
            title: "Release some tension",
            text:
                "Take a moment to unclench your jaw, lower your shoulders, and relax your hands. Notice where your body is holding tension and let one area soften.",
        };
    }

    if (branch === "angry") {
        return {
            title: "Create a little space",
            text:
                "Before responding or making a decision, give yourself a short pause. Step away if possible, breathe out slowly, and ask yourself: 'What do I need right now to respond instead of react?'",
        };
    }

    if (branch === "drained") {
        return {
            title: "Lower the pressure",
            text:
                "You don't need to be productive every moment. Choose the smallest useful thing you can do next, then give yourself permission to pause afterward.",
        };
    }

    return {
        title: "A quick reset",
        text:
            "Take five slow breaths and notice how your body feels. Then ask yourself one simple question: 'What is one thing I can do today that supports me?'",
    };
}

function createBotMessage(id, text, variant = "default") {
    return {
        id,
        sender: "bot",
        text,
        variant,
    };
}

function createUserMessage(id, text) {
    return {
        id,
        sender: "user",
        text,
        variant: "default",
    };
}

export default function MentalHealthPage() {
    const [messages, setMessages] = useState([
        createBotMessage(1, INITIAL_BOT_MESSAGE, "intro"),
    ]);

    const [inputValue, setInputValue] = useState("");
    const [stage, setStage] = useState("mood");
    const [branch, setBranch] = useState("okay");
    const [lastSupport, setLastSupport] = useState(null);

    const messageIdRef = useRef(2);
    const feedEndRef = useRef(null);

    useEffect(() => {
        feedEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages]);

    function pushBotMessage(text, variant = "default") {
        setMessages((current) => [
            ...current,
            createBotMessage(
                messageIdRef.current++,
                text,
                variant
            ),
        ]);
    }

    function pushUserMessage(text) {
        setMessages((current) => [
            ...current,
            createUserMessage(
                messageIdRef.current++,
                text
            ),
        ]);
    }

    function resetConversation() {
        messageIdRef.current = 2;

        setMessages([
            createBotMessage(
                1,
                INITIAL_BOT_MESSAGE,
                "intro"
            ),
        ]);

        setInputValue("");
        setStage("mood");
        setBranch("okay");
        setLastSupport(null);
    }

    function handleSubmit(rawValue) {
        const value =
            typeof rawValue === "string"
                ? rawValue
                : inputValue;

        const trimmed = value.trim();

        if (!trimmed) return;

        pushUserMessage(trimmed);
        setInputValue("");

        if (CRISIS_PATTERN.test(trimmed)) {
            pushBotMessage(
                "I'm really sorry you're carrying this right now. Your immediate safety matters more than continuing this conversation. Please contact someone you trust, go somewhere you feel safer, or seek urgent local support.",
                "crisis"
            );

            setStage("crisis");
            return;
        }

        if (stage === "mood") {
            const detectedMood = classifyMood(trimmed);

            setBranch(detectedMood);

            pushBotMessage(
                CONVERSATION_PATHS[detectedMood].reflection,
                "reflection"
            );

            pushBotMessage(
                CONVERSATION_PATHS[detectedMood].followUp,
                "question"
            );

            setStage("followup");

            return;
        }

        if (stage === "followup") {
            const support = getSupportResponse(
                branch,
                trimmed
            );

            setLastSupport(support);

            pushBotMessage(
                `${support.title}\n\n${support.text}`,
                "tip"
            );

            pushBotMessage(
                "Would you like another approach, or do you want to reflect on how you're feeling now?",
                "question"
            );

            setStage("support");

            return;
        }

        if (stage === "support") {
            const text = normalizeText(trimmed);

            if (
                includesAny(text, [
                    "another",
                    "more",
                    "different",
                    "another approach",
                ])
            ) {
                const support = getSupportResponse(
                    branch,
                    "alternative"
                );

                pushBotMessage(
                    `${support.title}\n\n${support.text}`,
                    "tip"
                );

                return;
            }

            if (
                includesAny(text, [
                    "better",
                    "good",
                    "calmer",
                    "helped",
                ])
            ) {
                pushBotMessage(
                    "I'm glad you checked in with yourself. You don't need to feel completely better for a small shift to matter.",
                    "reflection"
                );

                setStage("complete");

                return;
            }

            pushBotMessage(
                "That's okay. Feelings don't always change immediately. If you'd like, we can try another small approach or start a fresh check-in.",
                "reflection"
            );

            return;
        }

        if (stage === "complete") {
            pushBotMessage(
                "Whenever you need a moment to pause and check in, I'm here.",
                "system"
            );
        }
    }

    function handleSelection(value) {
        if (value === "Start over") {
            resetConversation();
            return;
        }

        handleSubmit(value);
    }

    function getQuickReplies() {
        if (stage === "mood") {
            return MOOD_OPTIONS;
        }

        if (stage === "followup") {
            return CONVERSATION_PATHS[branch].options.map(
                (option) => ({
                    label: option,
                    value: option,
                })
            );
        }

        if (stage === "support") {
            return [
                {
                    label: "Another approach",
                    value: "another approach",
                },
                {
                    label: "I feel a little better",
                    value: "I feel a little better",
                },
                {
                    label: "Start over",
                    value: "Start over",
                },
            ];
        }

        return [
            {
                label: "Start over",
                value: "Start over",
            },
        ];
    }

    const quickReplies = getQuickReplies();
    const crisisActive = stage === "crisis";

    return (
        <section className="mental-health-page">
            <header className="mental-health-hero">
                <div>
                    <p className="app-eyebrow">
                        UZIMA WELLNESS
                    </p>

                    <h1>
                        Take a moment for yourself
                    </h1>

                    <p className="app-subtitle">
                        A private space to pause, reflect on how
                        you're feeling, and explore small ways to
                        support your wellbeing.
                    </p>
                </div>

                <div className="mental-health-hero__badge">
                    Guided check-in
                </div>
            </header>

            <div className="mental-health-layout">
                <section
                    className="mental-health-chat"
                    aria-label="Wellbeing check-in"
                >
                    <div className="mental-health-chat__header">
                        <div>
                            <p className="mental-health-eyebrow">
                                UZIMA COMPANION
                            </p>

                            <h2>
                                How are you feeling?
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="mental-health-reset"
                            onClick={resetConversation}
                        >
                            New check-in
                        </button>
                    </div>

                    <div
                        className="mental-health-chat__feed"
                        aria-live="polite"
                    >
                        {messages.map((message) => (
                            <article
                                key={message.id}
                                className={`chat-bubble chat-bubble--${message.sender} chat-bubble--${message.variant}`}
                            >
                                {message.text}
                            </article>
                        ))}

                        <div ref={feedEndRef} />
                    </div>

                    {crisisActive && (
                        <div className="mental-health-crisis">
                            <p className="mental-health-crisis__eyebrow">
                                Immediate support
                            </p>

                            <p className="mental-health-crisis__copy">
                                If you feel you may be in immediate
                                danger, please contact local emergency
                                services, go to the nearest emergency
                                department, or reach out to someone you
                                trust who can stay with you.
                            </p>
                        </div>
                    )}

                    <form
                        className="mental-health-chat__composer"
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSubmit();
                        }}
                    >
                        {!crisisActive && (
                            <div className="mental-health-quick-replies">
                                {quickReplies.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className="mental-health-chip"
                                        onClick={() =>
                                            handleSelection(
                                                option.value
                                            )
                                        }
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="mental-health-input-row">
                            <input
                                type="text"
                                className="mental-health-input"
                                value={inputValue}
                                onChange={(event) =>
                                    setInputValue(
                                        event.target.value
                                    )
                                }
                                placeholder={
                                    crisisActive
                                        ? "Start a new check-in when you're ready"
                                        : "Tell me what's on your mind..."
                                }
                                disabled={crisisActive}
                                aria-label="Type a reply"
                            />

                            <button
                                type="submit"
                                className="mental-health-send"
                                disabled={crisisActive}
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </section>

                <aside className="mental-health-sidebar">
                    <article className="mental-health-card mental-health-card--note">
                        <p className="mental-health-card__eyebrow">
                            YOUR SPACE
                        </p>

                        <h2>
                            Pause without pressure
                        </h2>

                        <p>
                            There is no perfect answer here. Start with
                            what feels closest to how you're feeling,
                            and take the conversation at your own pace.
                        </p>
                    </article>

                    <article className="mental-health-card mental-health-card--support">
                        <p className="mental-health-card__eyebrow">
                            WELLBEING TOOLS
                        </p>

                        <h2>
                            Small actions can matter
                        </h2>

                        <ul className="mental-health-list">
                            <li>
                                Slow breathing to reduce physical tension
                            </li>

                            <li>
                                Grounding when thoughts feel overwhelming
                            </li>

                            <li>
                                Breaking difficult moments into smaller steps
                            </li>

                            <li>
                                Reaching out when connection would help
                            </li>
                        </ul>
                    </article>

                    <article className="mental-health-card">
                        <p className="mental-health-card__eyebrow">
                            CHECK-IN
                        </p>

                        <h2>
                            How you're feeling can change
                        </h2>

                        <p>
                            You can return at any time and start a new
                            conversation based on how you're feeling in
                            that moment.
                        </p>
                    </article>
                </aside>
            </div>
        </section>
    );
}