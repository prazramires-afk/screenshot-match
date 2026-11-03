import type { OrganizerCategory, RoutineActivity, Settings } from "./types";

/* ---------- defaults ---------- */

export const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  defaultFocusDuration: 25,
  morningReminder: false,
  morningReminderTime: "08:00",
  eveningReminder: false,
  eveningReminderTime: "21:00",
  habitReminders: false,
  notificationsEnabled: false,
  firstUsedAt: "",
};

export const DEFAULT_ROUTINE: RoutineActivity[] = [
  { id: "routine-brain-dump", title: "Morning Brain Dump", minutes: 5, kind: "brain-dump", enabled: true },
  { id: "routine-breathing", title: "Mindful Breathing", minutes: 3, kind: "breathing", enabled: true },
  { id: "routine-focus", title: "Focus Session", minutes: 15, kind: "focus", enabled: true },
  { id: "routine-observation", title: "Mindful Observation", minutes: 5, kind: "observation", enabled: true },
  { id: "routine-reflection", title: "Evening Reflection", minutes: 5, kind: "reflection", enabled: true },
];

/* ---------- daily messages ---------- */

export const DAILY_MESSAGES = [
  "A calm mind is a clear mind. Start small, start now.",
  "You don't need to do everything today. Only what matters.",
  "Attention is the rarest form of generosity. Give it to this moment.",
  "Clarity comes not from thinking more, but from noticing what's already there.",
  "One intentional hour beats a rushed and scattered day.",
  "Let go of what you cannot control. Hold gently what you can.",
  "The mind clears the way a window does: by staying still and open.",
  "Small rituals, repeated daily, become the architecture of a peaceful life.",
  "You are allowed to pause. Rest is part of the work.",
  "Write it down. An unrecorded thought costs you attention all day.",
  "Focus is less about force and more about removing friction.",
  "Breathe in slowly. Nothing needs to be solved in this exact second.",
  "The day is shaped by what you choose to notice.",
  "A finished small thing is worth more than an imagined big thing.",
  "Your attention is your most valuable resource. Spend it like it matters.",
  "Quiet is not emptiness. It is where your own voice becomes audible.",
  "Progress on the inside rarely looks dramatic. It looks like returning.",
  "You can begin again at any hour. The day has many doors.",
  "Trade urgency for intention, once, today.",
  "What you water grows. Notice what you are watering.",
  "Simplicity is the daily practice of saying no with kindness.",
  "The best time to clear your mind was yesterday. The second best is now.",
  "Not every thought deserves a reply.",
  "End the day lighter than you began it.",
];

/* ---------- guided journaling prompts ---------- */

export const GUIDED_PROMPTS = [
  "What is occupying my mind today?",
  "What can I control right now?",
  "What made me feel good today?",
  "What am I avoiding, and why?",
  "What deserves my attention this week?",
  "What can I let go of today?",
  "What did I learn today?",
  "What would I do if I knew no one was judging me?",
  "Which thought kept repeating today? Is it true?",
  "What am I grateful for that I usually overlook?",
  "What does my ideal calm evening look like?",
  "What is one thing I can simplify tomorrow?",
];

/* ---------- breathing patterns ---------- */

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  /** seconds: [inhale, holdAfterInhale, exhale, holdAfterExhale] (0 = skip) */
  steps: [number, number, number, number];
}

export const BREATHING_PATTERNS: BreathingPattern[] = [
  { id: "box", name: "Box Breathing", description: "4-4-4-4 · steady and balancing", steps: [4, 4, 4, 4] },
  { id: "478", name: "4-7-8 Breathing", description: "4-7-8 · calming and sleep-friendly", steps: [4, 7, 8, 0] },
  { id: "slow", name: "Slow Breathing", description: "5-5 · long, gentle waves", steps: [5, 0, 5, 0] },
  { id: "deep", name: "Deep Breathing", description: "4-2-6 · full, grounding breaths", steps: [4, 2, 6, 0] },
  { id: "quick", name: "Quick Breathing Reset", description: "3-1-3-1 · a fast mid-day reset", steps: [3, 1, 3, 1] },
];

/* ---------- meditation library ---------- */

export interface MeditationSegment {
  minutes: number;
  text: string;
}

export interface MeditationProgram {
  id: string;
  title: string;
  minutes: number;
  intro: string;
  segments: MeditationSegment[];
}

export const MEDITATIONS: MeditationProgram[] = [
  {
    id: "reset-3",
    title: "3-Minute Mental Reset",
    minutes: 3,
    intro: "A short pause to settle a busy mind, wherever you are.",
    segments: [
      { minutes: 1, text: "Sit comfortably and let your eyes soften. Take three slow breaths, feeling the air move in and out. Notice where your body touches the chair, the floor, your clothes. Nothing to change yet — just arrive." },
      { minutes: 1, text: "Now widen your attention. Thoughts will come; let them pass like cars you watch from a window. You don't need to follow any of them. If you get carried away, gently return to the breath. Each return is the practice." },
      { minutes: 1, text: "Ask yourself quietly: what matters most in the next hour? Let one word surface. Hold it lightly. Take one more deep breath, and when you're ready, open your eyes and carry that word with you." },
    ],
  },
  {
    id: "mindfulness-5",
    title: "5-Minute Mindfulness",
    minutes: 5,
    intro: "A classic grounded mindfulness sit for any time of day.",
    segments: [
      { minutes: 1, text: "Find your seat. Let your spine be tall but not stiff, hands resting wherever they like. Close your eyes or lower your gaze. Take one deep breath and exhale with a soft sigh." },
      { minutes: 2, text: "Bring attention to the sensation of breathing — the cool air in, the warmer air out. Notice the pause between breaths. When the mind wanders (it will), simply note \"thinking\" and come back. Coming back is the whole exercise." },
      { minutes: 1, text: "Now listen. Let sounds come to you without naming or judging them. Distant traffic, a door, your own breath. Let the room be full of sound and you simply receiving it." },
      { minutes: 1, text: "Return attention to the body. Wiggle your fingers and toes. Take one deeper breath. Open your eyes slowly, and notice one thing in the room as if for the first time." },
    ],
  },
  {
    id: "relaxation-10",
    title: "10-Minute Relaxation",
    minutes: 10,
    intro: "A longer unwind for tense days, guided from head to toe.",
    segments: [
      { minutes: 2, text: "Lie down or recline. Let your arms and legs fall where they fall. Breathe slowly — in for four, out for six — and with each exhale, let the surface beneath you hold a little more of your weight." },
      { minutes: 3, text: "Bring attention to your forehead and eyes. Uncrease the brow, soften the jaw, let the tongue rest from the roof of the mouth. Feel the face becoming heavy and quiet. Move down to the neck and shoulders: shrug once, then drop and let go." },
      { minutes: 3, text: "Sweep through the arms, chest, and belly. Notice any gripping and invite it to melt on each exhale. There is nothing to fix in the body right now — only places to release." },
      { minutes: 2, text: "Let your whole body rest as one calm field. If sleep comes, let it. If thoughts come, let them drift past like clouds. When you're ready, take a deep breath, stretch, and return slowly." },
    ],
  },
  {
    id: "morning",
    title: "Morning Meditation",
    minutes: 5,
    intro: "Set the tone before the day sets it for you.",
    segments: [
      { minutes: 1, text: "Sit up tall — you're greeting the day. Take five conscious breaths, making the exhale longer than the inhale. Feel yourself waking from the inside." },
      { minutes: 2, text: "Picture the day ahead as a path. See the few things that truly matter today standing like stones on that path. You don't need to grasp them — just see them clearly. Notice how the rest of the day can be lighter." },
      { minutes: 1, text: "Choose one intention for the day in a single sentence, for example: \"Today I move at my own pace.\" Repeat it once silently." },
      { minutes: 1, text: "Take three deeper breaths. On each exhale, silently say: ready. Open your eyes and begin." },
    ],
  },
  {
    id: "evening",
    title: "Evening Meditation",
    minutes: 5,
    intro: "Put the day down gently before sleep.",
    segments: [
      { minutes: 1, text: "Get comfortable. Lights low if possible. Breathe out slowly three times, as if setting down bags you've carried all day." },
      { minutes: 2, text: "Review the day like a photo album, without commentary: morning, midday, evening. Whatever happened — done or undone — let it be a closed chapter. Tomorrow's pages are still blank." },
      { minutes: 1, text: "Name one good thing from today, however small. A warm drink, a kind word, a moment of sun. Let it be the last thing you spend attention on." },
      { minutes: 1, text: "Feel the bed or chair holding you completely. With each exhale sink one layer deeper. There is nothing more to do today. Let sleep come to you." },
    ],
  },
  {
    id: "body-awareness",
    title: "Body Awareness Meditation",
    minutes: 7,
    intro: "A steady scan that anchors attention in the body.",
    segments: [
      { minutes: 1, text: "Sit or lie down and close your eyes. Take three easy breaths. Today the body is the home for your attention — everything else can wait outside." },
      { minutes: 2, text: "Start at the feet. Feel contact, warmth, tingling, or nothing at all — everything counts. Move slowly up through the legs, noticing where sensation is vivid and where it's vague. No judging; just mapping." },
      { minutes: 2, text: "Continue through the hips, belly, and chest. Notice the breath moving the chest and belly like a tide. Rest your attention there for a few breaths, riding the movement." },
      { minutes: 2, text: "Finish through the shoulders, arms, hands, and up to the face and crown. Now feel the whole body at once — one breathing whole. Rest here until the timer ends, then gently open your eyes." },
    ],
  },
];

/* ---------- mindful pause exercises ---------- */

export interface MindfulPause {
  id: string;
  title: string;
  minutes: number;
  instructions: string;
}

export const MINDFUL_PAUSES: MindfulPause[] = [
  {
    id: "surroundings",
    title: "Observe your surroundings",
    minutes: 3,
    instructions:
      "Stop what you're doing and slowly look around. Name silently: five things you can see, four you can hear, three you can touch. Move your gaze slowly, like a camera panning. This pulls attention out of thought and back into the room.",
  },
  {
    id: "sensations",
    title: "Notice physical sensations",
    minutes: 3,
    instructions:
      "Close your eyes if comfortable. Scan from head to toe: where is there warmth, tension, tingling, weight? Don't fix anything — just notice three sensations and describe them in three silent words.",
  },
  {
    id: "sounds",
    title: "Listen to ambient sounds",
    minutes: 3,
    instructions:
      "Let your ears do the work. Count how many different sounds you can hear in one minute — near and far, human and mechanical. Listen to one sound all the way through before moving to the next.",
  },
  {
    id: "screen-break",
    title: "Take a screen-free break",
    minutes: 5,
    instructions:
      "Put the phone face down and step away from all screens. Stretch, get water, look out a window. If your hand reaches for a device, notice the reach — that impulse is worth seeing clearly.",
  },
  {
    id: "sit-quietly",
    title: "Sit quietly without distractions",
    minutes: 5,
    instructions:
      "Sit with nothing: no music, no phone, no task. Just sit. Boredom and thoughts will surface; watch them like weather. Two minutes will feel long. That's fine — length is not the point, presence is.",
  },
];

/* ---------- suggested habits ---------- */

export const SUGGESTED_HABITS: { name: string; icon: string; type: "daily" | "weekly"; timesPerWeek: number }[] = [
  { name: "Morning journaling", icon: "pen-line", type: "daily", timesPerWeek: 7 },
  { name: "Meditation", icon: "flower-2", type: "daily", timesPerWeek: 7 },
  { name: "Reading", icon: "book-open", type: "daily", timesPerWeek: 7 },
  { name: "No-phone morning", icon: "phone-off", type: "daily", timesPerWeek: 7 },
  { name: "Walking outdoors", icon: "footprints", type: "daily", timesPerWeek: 7 },
  { name: "Gratitude writing", icon: "heart", type: "daily", timesPerWeek: 7 },
  { name: "Digital detox", icon: "unplug", type: "weekly", timesPerWeek: 3 },
  { name: "Evening reflection", icon: "moon", type: "daily", timesPerWeek: 7 },
  { name: "Breathing exercises", icon: "wind", type: "daily", timesPerWeek: 7 },
  { name: "Planning tomorrow", icon: "list-checks", type: "daily", timesPerWeek: 7 },
];

/* ---------- brain dump buckets ---------- */

export const BRAIN_BUCKETS: { id: "todo" | "worry" | "remember" | "uncontrollable" | "random"; label: string; hint: string }[] = [
  { id: "todo", label: "Things to do", hint: "Tasks waiting for you" },
  { id: "worry", label: "Things worrying me", hint: "Concerns circling in your head" },
  { id: "remember", label: "Things to remember", hint: "Ideas and details worth keeping" },
  { id: "uncontrollable", label: "Things I cannot control", hint: "Better observed than carried" },
  { id: "random", label: "Random thoughts", hint: "Everything else passing through" },
];

/* ---------- organizer categories ---------- */

export const ORGANIZER_CATEGORIES: { id: OrganizerCategory; label: string }[] = [
  { id: "personal", label: "Personal" },
  { id: "work", label: "Work & Study" },
  { id: "relationships", label: "Relationships" },
  { id: "goals", label: "Goals" },
  { id: "worries", label: "Worries" },
  { id: "ideas", label: "Ideas" },
];

export const CATEGORY_LABELS: Record<OrganizerCategory, string> = Object.fromEntries(
  ORGANIZER_CATEGORIES.map((c) => [c.id, c.label]),
) as Record<OrganizerCategory, string>;

/* ---------- distraction types ---------- */

export const DISTRACTION_TYPES: { id: "phone" | "social" | "environment" | "thought" | "other"; label: string }[] = [
  { id: "phone", label: "Phone" },
  { id: "social", label: "Social media" },
  { id: "environment", label: "Environment" },
  { id: "thought", label: "Random thoughts" },
  { id: "other", label: "Other" },
];

/* ---------- digital detox challenges ---------- */

export const DETOX_CHALLENGES = [
  { id: "break-5", title: "5-minute screen break", minutes: 5, description: "Step away from every screen for five minutes. Stretch, breathe, look out a window." },
  { id: "detox-15", title: "15-minute digital detox", minutes: 15, description: "Phone down, notifications ignored. Do one small analog thing: make tea, tidy a shelf, sit outside." },
  { id: "offline-30", title: "30-minute offline activity", minutes: 30, description: "Read, walk, cook, or journal for half an hour with no device in hand." },
  { id: "no-phone-morning", title: "No-phone morning", minutes: 60, description: "Keep the phone untouched for the first hour after waking. Let the day start as yours." },
  { id: "screen-free-evening", title: "Screen-free evening", minutes: 90, description: "An evening with no screens after a set hour. Read, talk, rest, sleep better." },
];

/* ---------- mental notes library (60 original insights) ---------- */

export interface MentalNote {
  id: string;
  title: string;
  category: "Clarity" | "Focus" | "Mindfulness" | "Decluttering" | "Discipline" | "Rest" | "Digital" | "Self-awareness" | "Gratitude" | "Intentional living";
  body: string;
  takeaway: string;
}

export const NOTE_CATEGORIES = [
  "Clarity", "Focus", "Mindfulness", "Decluttering", "Discipline",
  "Rest", "Digital", "Self-awareness", "Gratitude", "Intentional living",
] as const;

export const MENTAL_NOTES: MentalNote[] = [
  // Clarity
  { id: "n01", title: "The mind holds one thought well", category: "Clarity", body: "Working memory can juggle only a handful of items at once. When you try to hold twenty things, you lose all of them a little. Clarity is not knowing more — it is carrying less at any given moment.", takeaway: "Write things down so your mind can hold one thing at a time." },
  { id: "n02", title: "Name it to tame it", category: "Clarity", body: "A vague worry feels bigger than a named one. Putting a precise label on what you feel — \"I'm anxious about tomorrow's meeting\" — moves activity from the emotional brain to the thinking brain.", takeaway: "When overwhelmed, describe the feeling in one exact sentence." },
  { id: "n03", title: "Clarity is a practice, not a mood", category: "Clarity", body: "People wait to feel clear before acting, but it usually works the other way around. Small acts of sorting — a list, a tidy desk, a decision made — produce the feeling of clarity rather than following it.", takeaway: "Do one tiny organizing act and let clarity follow." },
  { id: "n04", title: "Two kinds of uncertainty", category: "Clarity", body: "Some uncertainty is lack of information — that needs research. Most mental fog is surplus information: too many inputs, opinions and open tabs. The first is solved by gathering; the second by pruning.", takeaway: "Ask: do I need more data, or fewer inputs?" },
  { id: "n05", title: "The morning question", category: "Clarity", body: "Days scatter when they begin with other people's demands. One question — \"what would make today feel well spent?\" — sets a private compass before the world sets its own.", takeaway: "Ask yourself the morning question before opening any feed." },
  { id: "n06", title: "Fog is often fatigue", category: "Clarity", body: "We treat mental fog as a thinking problem and reach for more thinking — more plans, more analysis. But fog is frequently the body asking for water, movement, food or sleep.", takeaway: "Before strategizing, check the basics: water, walk, rest." },

  // Focus
  { id: "n07", title: "Focus follows meaning", category: "Focus", body: "Concentration fails fastest on work that feels pointless. Before fighting distraction, reconnect with why the task matters to you — even if the reason is simply that you chose it.", takeaway: "Restate the 'why' of a task before starting it." },
  { id: "n08", title: "Start with a staircase", category: "Focus", body: "The brain resists big, undefined efforts but accepts small, concrete ones. \"Write the report\" invites avoidance; \"open the document and write one ugly sentence\" invites motion.", takeaway: "Shrink the first step until it feels almost too small." },
  { id: "n09", title: "Attention is a muscle with limits", category: "Focus", body: "Sustained attention draws on a finite reservoir. After deep work it genuinely refills with time — this is why breaks are not weakness but part of the design of concentration.", takeaway: "Plan recovery into every block of deep work." },
  { id: "n10", title: "One tab, one task", category: "Focus", body: "Multitasking is rapid switching, and every switch leaves a residue of attention on the previous task. The cost is invisible but real — often a fifth of your usable focus.", takeaway: "Close everything except the single task at hand." },
  { id: "n11", title: "The first ten minutes are the wall", category: "Focus", body: "Almost every session feels hardest in its opening minutes, when the mind still carries its last activity. If you push through the wall, a second wind almost always arrives.", takeaway: "Decide in advance to endure the first ten minutes." },
  { id: "n12", title: "Aim, then work", category: "Focus", body: "Focus without a target is restlessness. Take five seconds before each session to define what 'done' looks like — a finished paragraph, a cleared inbox, a decision made.", takeaway: "Define 'done' before pressing start." },

  // Mindfulness
  { id: "n13", title: "The breath is an anchor", category: "Mindfulness", body: "The breath is always available, always now, and always rhythmic. This is why every meditation tradition uses it: attention on breathing is attention out of past and future.", takeaway: "When lost, follow three full breaths." },
  { id: "n14", title: "Noticing is enough", category: "Mindfulness", body: "Mindfulness is not about having an empty mind. It is the small, repeated act of noticing where attention went and inviting it back. The return, not the staying, is the training.", takeaway: "Count returns, not lapses." },
  { id: "n15", title: "Boredom is a doorway", category: "Mindfulness", body: "We flee boredom within seconds. Yet boredom is often the mind finally becoming quiet enough to notice what it actually wants. Sitting with it briefly reveals what the noise was covering.", takeaway: "Next time you're bored, wait ninety seconds before reaching for your phone." },
  { id: "n16", title: "The body lives in the present", category: "Mindfulness", body: "Thoughts travel to past and future; sensations only exist now. Scanning the body — feet, hands, jaw, breath — is a shortcut back to the present moment.", takeaway: "Ground yourself by feeling three physical sensations." },
  { id: "n17", title: "Single-tasking as meditation", category: "Mindfulness", body: "Washing a dish while only washing the dish is meditation in work clothes. Any activity done with complete attention becomes practice; none done distractedly does.", takeaway: "Choose one routine task today and do it with full attention." },
  { id: "n18", title: "Thoughts are weather", category: "Mindfulness", body: "A thought is an event in the mind, not a command or a truth. Watching thoughts pass like weather trains you to respond from somewhere steadier than the storm.", takeaway: "Label difficult thoughts: 'I'm having the thought that…'" },

  // Decluttering
  { id: "n19", title: "The brain dump effect", category: "Decluttering", body: "Open loops — unfinished tasks, unanswered messages, half-decisions — occupy attention even when you're not aware of them. Getting them onto paper measurably quiets the mind.", takeaway: "Empty your head onto a page tonight." },
  { id: "n20", title: "Decide once", category: "Decluttering", body: "Much clutter is the same decision reconsidered daily: the same emails, the same cupboard, the same 'maybe'. Each small decision made once — and recorded — frees future attention.", takeaway: "Turn recurring maybes into standing decisions." },
  { id: "n21", title: "The worry split", category: "Decluttering", body: "Every worry falls into one of two boxes: something I can act on, or something I cannot. The first deserves a next step; the second deserves acknowledgment and release.", takeaway: "Sort each worry: act, or let go." },
  { id: "n22", title: "Less in, less to manage", category: "Decluttering", body: "Decluttering is easier at the entrance than the exit. Declining one commitment, one subscription, one purchase prevents an hour of future sorting.", takeaway: "Say no to one thing before organizing ten." },
  { id: "n23", title: "A tidy field of view", category: "Decluttering", body: "Visible clutter competes for attention even when ignored. The desk, the phone's home screen, the first browser tab — these are your mental landscape. Clearing them clears a little of you.", takeaway: "Clear one visible surface, not the whole room." },
  { id: "n24", title: "Close the day's loops", category: "Decluttering", body: "A two-minute evening review — what's done, what moves to tomorrow — lets the mind stop rehearsing overnight. Unwritten tomorrow-tasks are the classic cause of a spinning bedtime brain.", takeaway: "End each day by listing tomorrow's first steps." },

  // Discipline
  { id: "n25", title: "Discipline is self-trust", category: "Discipline", body: "Every kept small promise to yourself is a deposit in an account called self-trust. Discipline is less about force and more about becoming someone your own word reaches.", takeaway: "Keep one small promise to yourself today." },
  { id: "n26", title: "Systems over moods", category: "Discipline", body: "Motivation arrives unpredictably; a system — same time, same place, same first action — works regardless of how you feel. Professionals rely on systems; amateurs rely on moods.", takeaway: "Attach the habit to a fixed time or place." },
  { id: "n27", title: "Never miss twice", category: "Discipline", body: "Missing once is an accident; missing twice is the start of a new habit. The skill is not perfection but the speed of return after a lapse.", takeaway: "After a missed day, make the comeback automatic." },
  { id: "n28", title: "Make it boring", category: "Discipline", body: "Dramatic routines fail because they need drama to sustain them. The most durable habits are almost dull: same hour, same cue, same modest dose.", takeaway: "Design your best habit to be slightly boring." },
  { id: "n29", title: "Two-minute rule", category: "Discipline", body: "Anything that takes under two minutes should be done immediately — not because it's efficient, but because each deferred micro-task becomes an open loop weighing on attention.", takeaway: "Do it now if it takes two minutes." },
  { id: "n30", title: "Identity before outcomes", category: "Discipline", body: "Lasting habits attach to identity: not 'I'm trying to read more' but 'I'm a reader'. Each session is a small vote for the person you're becoming.", takeaway: "Phrase one habit as part of who you are." },

  // Rest
  { id: "n31", title: "Rest is a skill", category: "Rest", body: "Collapsing in front of a screen is not rest; it is low-grade stimulation. Real rest — walking, napping, daydreaming, silence — actually restores attention.", takeaway: "Choose one truly restorative activity this week." },
  { id: "n32", title: "Breaks before you need them", category: "Rest", body: "By the time you feel exhausted, recovery takes much longer. Short breaks taken early keep performance on a plateau instead of riding a rollercoaster of spikes and crashes.", takeaway: "Take a five-minute break every hour of focused work." },
  { id: "n33", title: "Sleep is attention maintenance", category: "Rest", body: "During deep sleep the brain literally clears metabolic waste and consolidates what mattered. Cutting sleep to gain hours reliably costs more focus than it gains time.", takeaway: "Protect your last hour before bed as sleep prep." },
  { id: "n34", title: "The transition ritual", category: "Rest", body: "Work expands into evenings when nothing marks its end. A small ritual — a walk around the block, changing clothes, closing the laptop with intention — tells the brain the shift is real.", takeaway: "Invent a five-minute end-of-work ritual." },
  { id: "n35", title: "Rest without guilt", category: "Rest", body: "Recovery only restores if you let it. Resting while mentally flogging yourself for resting burns energy anyway. Rest is not a reward for finishing; it is a requirement for continuing.", takeaway: "Rest fully, without narrating guilt." },
  { id: "n36", title: "Stillness is not wasted time", category: "Rest", body: "The mind's default network — active when you do nothing — is where insights consolidate and connections form. Constant input starves the very system that produces your best ideas.", takeaway: "Schedule ten unscheduled minutes." },

  // Digital
  { id: "n37", title: "Feeds are engineered", category: "Digital", body: "Infinite feeds are designed by teams of specialists to hold attention past the point of enjoyment. Knowing this turns a personal 'failure of willpower' into what it is: a mismatch of design.", takeaway: "Treat the feed as a product aimed at you, not a mirror of your needs." },
  { id: "n38", title: "The first minute rule", category: "Digital", body: "Checking the phone within the first minute of waking trains the brain to begin the day reactive. The first inputs of the morning disproportionately color the whole day.", takeaway: "Delay the first phone check until after a real morning action." },
  { id: "n39", title: "Friction works both ways", category: "Digital", body: "Twenty seconds of added friction — logging out, moving an app, greying the screen — reliably cuts impulsive use. Design your environment once instead of resisting it repeatedly.", takeaway: "Add one step between you and your most-used app." },
  { id: "n40", title: "Notification debt", category: "Digital", body: "Each notification is a tiny request for your attention, made by someone else, about their priorities. Turning off all but human-and-urgent is the single highest-leverage digital change.", takeaway: "Audit notifications today; keep only people, not products." },
  { id: "n41", title: "The phone is a doorway", category: "Digital", body: "A phone on the table — even face down, even silent — measurably lowers conversation depth and focus. Its mere presence signals an elsewhere more interesting than here.", takeaway: "Give the phone a home outside your work and rest spaces." },
  { id: "n42", title: "Boredom is not an emergency", category: "Digital", body: "Most phone checks are attempts to escape a mild discomfort: waiting, uncertainty, awkwardness. Letting the discomfort exist for a moment dissolves much of the pull.", takeaway: "In a queue, breathe before you scroll." },

  // Self-awareness
  { id: "n43", title: "Patterns over incidents", category: "Self-awareness", body: "One bad day means little; a pattern of bad days means something. Journaling turns scattered moments into visible patterns, and patterns can be questioned and changed.", takeaway: "Review a week of notes and look for the pattern." },
  { id: "n44", title: "The question behind the question", category: "Self-awareness", body: "\"What should I do?\" often hides \"what do I actually want?\". When stuck, stop listing options and ask the deeper question first — the answer to the second usually clarifies the first.", takeaway: "Ask yourself what you want, before what you should." },
  { id: "n45", title: "Notice your energy leaks", category: "Self-awareness", body: "Some activities drain more than they give — certain conversations, commitments, feeds. Tracking mood and energy for two weeks makes these leaks impossible to ignore.", takeaway: "Log your energy daily and find the pattern." },
  { id: "n46", title: "Feelings are data, not verdicts", category: "Self-awareness", body: "Anxiety before a task may signal it matters; irritation may signal a crossed boundary. Emotions are information about your inner state — useful, but not orders.", takeaway: "Ask each strong feeling: what are you pointing at?" },
  { id: "n47", title: "You are not your first thought", category: "Self-awareness", body: "The mind produces thousands of thoughts, many contradictory, many borrowed. Identifying with every passing thought is like believing every stranger who talks at you.", takeaway: "Hold thoughts lightly; test them before obeying them." },
  { id: "n48", title: "The stories we rehearse", category: "Self-awareness", body: "We all run inner narratives — 'I'm bad with mornings', 'I always procrastinate'. Rehearsed often enough, stories become self-fulfilling. Editing the story is a legitimate intervention.", takeaway: "Rewrite one limiting sentence about yourself, more accurately." },

  // Gratitude
  { id: "n49", title: "Gratitude trains attention", category: "Gratitude", body: "The mind evolved to notice threats, not gifts. Gratitude practice is attention training: deliberately spotting what is already good rewires what you habitually see.", takeaway: "Name three specific good things tonight." },
  { id: "n50", title: "Specific beats grand", category: "Gratitude", body: "\"I'm grateful for my family\" is a wallpaper thought. \"My sister called just to check in\" lands. The specific detail is what the nervous system actually feels.", takeaway: "Make each gratitude entry concrete and small." },
  { id: "n51", title: "Savoring doubles the good", category: "Gratitude", body: "Pleasant moments pass mostly unmet. Savoring — pausing to fully register a warm drink, good light, a quiet room — effectively doubles the value of the same event.", takeaway: "Fully register one good moment per day." },
  { id: "n52", title: "Gratitude in hard weeks", category: "Gratitude", body: "Gratitude is most powerful when life is difficult — not as denial, but as a counterweight. Even in a hard week, one true small good thing is honest and stabilizing.", takeaway: "On hard days, find one honest good thing." },
  { id: "n53", title: "The gratitude visit", category: "Gratitude", body: "The strongest gratitude practice known is thanking someone directly and specifically. It strengthens the relationship and doubles the benefit for both sides.", takeaway: "Thank one person concretely this week." },
  { id: "n54", title: "Enough is a felt number", category: "Gratitude", body: "The feeling of 'not enough' persists at any level of having. Gratitude doesn't argue with ambition; it reminds you that you already live inside many answered wishes.", takeaway: "Notice one thing you once wished for and now overlook." },

  // Intentional living
  { id: "n55", title: "Intention beats intention-setting", category: "Intentional living", body: "Days lived on autopilot feel shorter and thinner. A single conscious intention at the start of the day — even two words — changes the texture of everything after it.", takeaway: "Set today's intention in two words." },
  { id: "n56", title: "The three priorities rule", category: "Intentional living", body: "A list of fifteen tasks is a list of fifteen failures. Choosing three that genuinely matter makes a day both achievable and satisfying — and the rest was never truly required.", takeaway: "Pick today's three before opening any list." },
  { id: "n57", title: "Say no to protect yes", category: "Intentional living", body: "Every yes spends the same budget of hours. Intentional living is mostly about making your yeses mean something, which requires practiced, kind, unapologetic nos.", takeaway: "Decline one request that doesn't deserve your hours." },
  { id: "n58", title: "Design the default day", category: "Intentional living", body: "Life is not lived in grand decisions but in repeated Tuesdays. Improving the shape of an ordinary day — its first hour, its food, its ending — improves life more than any distant plan.", takeaway: "Improve one hour of your default day." },
  { id: "n59", title: "Values are verbs", category: "Intentional living", body: "You can't verify a value from a poster; you verify it from a calendar. If health is a value, it has appointments; if presence is a value, it has device-free dinners.", takeaway: "Match one calendar entry to one claimed value." },
  { id: "n60", title: "Leave lighter", category: "Intentional living", body: "A good day is not measured only by what you produced, but by what you carried: less resentment, fewer loops, one clearer mind than yesterday. That, too, is progress.", takeaway: "Close each day lighter than you opened it." },
];

/** Deterministic daily picks. */
export function dailyMessage(dayOfYear: number): string {
  return DAILY_MESSAGES[dayOfYear % DAILY_MESSAGES.length] ?? DAILY_MESSAGES[0]!;
}

export function dailyPrompt(dayOfYear: number): string {
  return GUIDED_PROMPTS[dayOfYear % GUIDED_PROMPTS.length] ?? GUIDED_PROMPTS[0]!;
}

export function dailyNote(dayOfYear: number): MentalNote {
  return MENTAL_NOTES[dayOfYear % MENTAL_NOTES.length] ?? MENTAL_NOTES[0]!;
}
