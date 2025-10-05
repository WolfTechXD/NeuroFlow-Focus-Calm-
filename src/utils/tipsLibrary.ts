import { Tip, TipCategory, InteractiveGuide } from '../types/tips';

export const tipCategories: TipCategory[] = [
    {
        id: 'focus',
        name: 'Focus & Attention',
        icon: '🎯',
        color: 'from-blue-400 to-cyan-500',
        description: 'Strategies to improve concentration and reduce distractions',
        targetCondition: 'both'
    },
    {
        id: 'organization',
        name: 'Organization',
        icon: '📋',
        color: 'from-green-400 to-emerald-500',
        description: 'Systems and tools for better organization and planning',
        targetCondition: 'both'
    },
    {
        id: 'emotional',
        name: 'Emotional Regulation',
        icon: '💖',
        color: 'from-pink-400 to-rose-500',
        description: 'Managing emotions, stress, and sensory overwhelm',
        targetCondition: 'both'
    },
    {
        id: 'social',
        name: 'Social Skills',
        icon: '👥',
        color: 'from-purple-400 to-indigo-500',
        description: 'Navigating social situations and communication',
        targetCondition: 'autism'
    },
    {
        id: 'sensory',
        name: 'Sensory Management',
        icon: '🌈',
        color: 'from-yellow-400 to-orange-500',
        description: 'Dealing with sensory sensitivities and preferences',
        targetCondition: 'autism'
    },
    {
        id: 'productivity',
        name: 'Productivity Hacks',
        icon: '⚡',
        color: 'from-red-400 to-pink-500',
        description: 'Time management and productivity strategies',
        targetCondition: 'adhd'
    }
];

export const lifeTips: Tip[] = [
    // Free Tips (Demo)
    {
        id: 'pomodoro-basic',
        title: 'The Pomodoro Technique',
        content: `Break your work into 25-minute focused sessions followed by 5-minute breaks. This technique works especially well for ADHD brains because:

• It provides structure and clear time boundaries
• Makes large tasks feel less overwhelming
• Builds in regular dopamine hits from completing sessions
• The timer creates external accountability

Start with just one or two sessions per day and gradually increase as it becomes habit.`,
        category: tipCategories[0],
        difficulty: 'beginner',
        timeToRead: 2,
        isPremium: false,
        tags: ['time-management', 'focus', 'pomodoro'],
        helpful: 42,
        hasAudio: true
    },
    {
        id: 'fidget-tools',
        title: 'Fidget Tools for Focus',
        content: `Fidgeting isn't distraction - it's regulation! Having something to do with your hands can actually improve focus for many neurodivergent people.

Great fidget options:
• Stress balls or fidget cubes
• Thinking putty or slime
• Spinner rings or worry stones
• Textured fabric squares
• Pop-it toys (yes, even for adults!)

Keep them handy during meetings, calls, or study sessions.`,
        category: tipCategories[0],
        difficulty: 'beginner',
        timeToRead: 1,
        isPremium: false,
        tags: ['fidgeting', 'sensory', 'focus'],
        helpful: 38,
        hasAudio: true
    },
    {
        id: 'body-doubling',
        title: 'Body Doubling Magic',
        content: `"Body doubling" means working alongside someone else, even if you're doing different tasks. This creates accountability and mimics the external structure many ADHD brains need.

Try:
• Virtual coworking sessions online
• Study sessions with friends (even virtually)
• Working at cafés or libraries
• Setting up "parallel play" work dates

The presence of others helps maintain focus and momentum.`,
        category: tipCategories[5],
        difficulty: 'beginner',
        timeToRead: 2,
        isPremium: false,
        tags: ['accountability', 'productivity', 'social'],
        helpful: 31,
        hasAudio: true
    },
    {
        id: 'sensory-breaks',
        title: 'Sensory Reset Breaks',
        content: `When feeling overwhelmed, take a 5-minute sensory break:

• Step outside for fresh air and different lighting
• Listen to calming music with headphones
• Do some gentle stretching or movement
• Hold something with a pleasant texture
• Practice deep breathing exercises

Regular sensory breaks prevent overwhelm and meltdowns.`,
        category: tipCategories[2],
        difficulty: 'beginner',
        timeToRead: 1,
        isPremium: false,
        tags: ['sensory', 'breaks', 'self-care'],
        helpful: 29,
        hasAudio: true
    },
    {
        id: 'dopamine-menu',
        title: 'Create a Dopamine Menu',
        content: `Make a "menu" of activities that give you dopamine hits, organized by how much time/energy they take:

**Appetizers** (0-5 min):
• Listen to favorite song
• Watch funny videos
• Text a friend
• Pet an animal

**Main Courses** (30-60 min):
• Exercise or dance
• Creative projects
• Video games
• Call a loved one

Keep this list handy for motivation slumps!`,
        category: tipCategories[2],
        difficulty: 'beginner',
        timeToRead: 2,
        isPremium: false,
        tags: ['dopamine', 'motivation', 'self-care'],
        helpful: 47,
        hasAudio: true
    },

    // Premium Tips
    {
        id: 'executive-function-toolkit',
        title: 'Executive Function Toolkit',
        content: `Executive function challenges are common in ADHD and autism. Build your toolkit with these strategies:

**Planning & Organization:**
• Use visual calendars and color-coding
• Break projects into tiny, specific steps
• Set multiple alarms and reminders
• Create "launch pads" near doors with essentials

**Working Memory Support:**
• Write everything down immediately
• Use voice memos for ideas on-the-go
• Create visual reminders and sticky notes
• Practice the "one-minute rule" - if it takes less than a minute, do it now

**Emotional Regulation:**
• Develop a feelings vocabulary
• Use mood tracking apps
• Practice the STOP technique (Stop, Take a breath, Observe, Proceed)
• Create a self-soothing kit

**Advanced Strategies:**
• Time-blocking for deep work
• Energy management over time management
• Creating "good enough" standards
• Building in buffer time for transitions

Remember: these are skills to be learned, not character flaws to be fixed!`,
        category: tipCategories[1],
        difficulty: 'intermediate',
        timeToRead: 8,
        isPremium: true,
        tags: ['executive-function', 'planning', 'organization', 'comprehensive'],
        helpful: 73,
        hasAudio: true
    },
    {
        id: 'masking-recovery',
        title: 'Masking and Recovery Strategies',
        content: `Masking (hiding autistic traits) is exhausting and can lead to burnout. Here's how to recognize and recover:

**Signs You're Masking:**
• Extreme fatigue after social situations
• Feeling like you're "performing" constantly
• Suppressing stims or natural behaviors
• Copying others' social behaviors
• Feeling disconnected from your authentic self

**Recovery Strategies:**
• Schedule unmasking time daily
• Create safe spaces where you can be yourself
• Practice saying no to social demands
• Allow yourself to stim freely
• Reconnect with your interests and passions

**Gradual Unmasking:**
• Start with trusted people or online communities
• Practice one authentic behavior at a time
• Set boundaries around social expectations
• Remember: you don't owe anyone "normal"

**Building Authentic Connections:**
• Seek out neurodivergent-friendly spaces
• Share your needs and preferences openly
• Find people who appreciate your authentic self
• Practice self-compassion during the process

Recovery from masking is a journey, not a destination. Be patient with yourself.`,
        category: tipCategories[2],
        difficulty: 'advanced',
        timeToRead: 10,
        isPremium: true,
        tags: ['autism', 'masking', 'authenticity', 'recovery', 'burnout'],
        helpful: 89,
        hasAudio: true
    },
    {
        id: 'adhd-hyperfocus-management',
        title: 'Hyperfocus: Blessing and Curse',
        content: `Hyperfocus can be incredibly productive but also problematic. Learn to work with it:

**Harnessing Hyperfocus:**
• Notice your hyperfocus triggers and patterns
• Prepare your environment before entering hyperfocus
• Set up food, water, and bathroom reminders
• Use timers to break for basic needs
• Choose your hyperfocus targets strategically

**Managing Hyperfocus Downsides:**
• Set multiple alarms for important appointments
• Use the "hyperfocus prep ritual":
  - Use bathroom
  - Get snacks and water
  - Set 2-hour maximum timer
  - Tell someone what you're doing

**Post-Hyperfocus Recovery:**
• Expect some mental fatigue
• Plan easier tasks for after intense focus
• Don't judge yourself for the "crash"
• Use this time for rest and gentle activities

**When Hyperfocus Becomes Problematic:**
• Missing meals, sleep, or social obligations
• Neglecting important responsibilities
• Physical discomfort from not moving
• Anxiety when interrupted

Remember: hyperfocus is a superpower when managed well, but it needs boundaries to be sustainable.`,
        category: tipCategories[0],
        difficulty: 'advanced',
        timeToRead: 7,
        isPremium: true,
        tags: ['adhd', 'hyperfocus', 'productivity', 'management'],
        helpful: 65,
        hasAudio: true
    },
    {
        id: 'stimming-guide',
        title: 'Stimming: Your Natural Regulation Tool',
        content: `Stimming (self-stimulatory behavior) is natural and helpful for regulation. Here's how to embrace it:

**Types of Stimming:**
• Movement: hand flapping, rocking, bouncing
• Tactile: rubbing textures, squishing objects
• Visual: watching repetitive motions, lights
• Auditory: humming, verbal repetition
• Vestibular: spinning, swinging

**Benefits of Stimming:**
• Reduces anxiety and stress
• Helps process emotions
• Improves focus and concentration
• Provides sensory regulation
• Expresses joy and excitement

**Workplace-Friendly Stims:**
• Fidget jewelry (spinner rings, textured bracelets)
• Silent foot bouncing under desk
• Stress balls or thinking putty
• Clicking pens (if others don't mind)
• Doodling or drawing patterns

**Creating Stim-Friendly Spaces:**
• Designate areas where all stims are welcome
• Keep stim toys accessible
• Normalize stimming in your social circles
• Educate others about why stimming helps

**When Others Don't Understand:**
• Explain that stimming helps you function better
• Offer alternatives if your stims are disruptive
• Stand firm on your right to regulate your nervous system
• Find stimming buddies who understand

Your stims are valid and necessary - don't let anyone make you feel ashamed of your natural regulation methods!`,
        category: tipCategories[4],
        difficulty: 'intermediate',
        timeToRead: 6,
        isPremium: true,
        tags: ['autism', 'stimming', 'regulation', 'sensory', 'acceptance'],
        helpful: 78,
        hasAudio: true
    }
];

export const interactiveGuides: InteractiveGuide[] = [
    {
        id: 'adhd-master-guide',
        title: 'ADHD Mastery: A Complete Life Guide',
        description: 'Comprehensive guide covering all aspects of living well with ADHD',
        estimatedTime: 120,
        difficulty: 'intermediate',
        tags: ['adhd', 'comprehensive', 'life-skills'],
        isPremium: true,
        chapters: [
            {
                id: 'understanding-adhd',
                title: 'Understanding Your ADHD Brain',
                content: 'Deep dive into how ADHD affects executive function, attention, and daily life...',
                hasAudio: true,
                estimatedTime: 15,
                order: 1
            },
            {
                id: 'time-management',
                title: 'Time Management Strategies',
                content: 'Practical systems for managing time when your brain works differently...',
                hasAudio: true,
                estimatedTime: 20,
                order: 2
            }
        ]
    },
    {
        id: 'autism-workplace-guide',
        title: 'Thriving in the Workplace: An Autism Guide',
        description: 'Navigate workplace challenges and advocate for your needs',
        estimatedTime: 90,
        difficulty: 'advanced',
        tags: ['autism', 'workplace', 'advocacy'],
        isPremium: true,
        chapters: [
            {
                id: 'disclosure-decisions',
                title: 'To Disclose or Not to Disclose',
                content: 'Weighing the pros and cons of autism disclosure at work...',
                hasAudio: true,
                estimatedTime: 12,
                order: 1
            }
        ]
    }
];

export const getFreeTips = () => lifeTips.filter(tip => !tip.isPremium);
export const getPremiumTips = () => lifeTips.filter(tip => tip.isPremium);
export const getTipsByCategory = (categoryId: string) =>
    lifeTips.filter(tip => tip.category.id === categoryId);
export const getTipsByDifficulty = (difficulty: string) =>
    lifeTips.filter(tip => tip.difficulty === difficulty);