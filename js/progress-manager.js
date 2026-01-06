/**
 * Quantum Quest - Progress Manager
 *
 * Handles saving/loading progress, XP, achievements, and progress codes.
 * Uses localStorage with exportable/importable progress codes.
 */

class ProgressManager {
    constructor() {
        this.storageKey = 'quantumquest_progress';
        this.data = this.load();
    }

    // Default progress state
    getDefaultProgress() {
        return {
            version: 1,
            xp: 0,
            level: 1,
            currentEra: 'era1',
            completedLessons: [],
            completedEras: [],
            completedChallenges: [],
            achievements: [],
            quizScores: {},
            circuitsBuilt: 0,
            totalPlayTime: 0,
            streak: 0,
            lastPlayDate: null,
            settings: {
                soundEnabled: true,
                animationsEnabled: true
            }
        };
    }

    // Load progress from localStorage
    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                // Merge with defaults to handle new properties
                return { ...this.getDefaultProgress(), ...data };
            }
        } catch (e) {
            console.error('Failed to load progress:', e);
        }
        return this.getDefaultProgress();
    }

    // Save progress to localStorage
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }

    // ================================
    // Progress Code System
    // ================================

    /**
     * Generate a progress code that encodes the player's complete state.
     * Format: QQ-XXXX-XXXX-XXXX
     * Encodes: level, XP, completed eras, achievements count, challenges count
     */
    generateProgressCode() {
        const d = this.data;

        // Create a compact representation
        const state = {
            v: 1, // version
            l: d.level,
            x: d.xp,
            e: d.completedEras.length,
            a: d.achievements.length,
            c: d.completedChallenges.length,
            s: d.completedLessons.length,
            // Bitmap of completed eras (8 bits)
            eb: this.erasToBitmap(d.completedEras),
            // Checksum for validation
            cs: 0
        };

        // Add checksum
        state.cs = this.calculateChecksum(state);

        // Encode to base36 string
        const encoded = this.encodeState(state);

        // Format as QQ-XXXX-XXXX-XXXX
        return this.formatCode(encoded);
    }

    /**
     * Import progress from a code
     */
    importProgressCode(code) {
        try {
            // Remove formatting
            const cleaned = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();

            if (!cleaned.startsWith('QQ')) {
                throw new Error('Invalid code format');
            }

            // Decode the state
            const state = this.decodeState(cleaned.substring(2));

            // Validate checksum
            const expectedCs = state.cs;
            state.cs = 0;
            if (this.calculateChecksum(state) !== expectedCs) {
                throw new Error('Invalid checksum');
            }

            // Apply the state
            this.applyImportedState(state);

            return { success: true, message: 'Progress imported successfully!' };
        } catch (e) {
            console.error('Import failed:', e);
            return { success: false, message: 'Invalid progress code' };
        }
    }

    erasToBitmap(completedEras) {
        let bitmap = 0;
        const eraOrder = ['era1', 'era2', 'era3', 'era4', 'era5', 'era6', 'era7', 'era8'];
        for (let i = 0; i < eraOrder.length; i++) {
            if (completedEras.includes(eraOrder[i])) {
                bitmap |= (1 << i);
            }
        }
        return bitmap;
    }

    bitmapToEras(bitmap) {
        const eras = [];
        const eraOrder = ['era1', 'era2', 'era3', 'era4', 'era5', 'era6', 'era7', 'era8'];
        for (let i = 0; i < eraOrder.length; i++) {
            if (bitmap & (1 << i)) {
                eras.push(eraOrder[i]);
            }
        }
        return eras;
    }

    calculateChecksum(state) {
        const str = JSON.stringify(state);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash) % 10000;
    }

    encodeState(state) {
        // Simple encoding: pack numbers into base36 string
        const parts = [
            state.v.toString(36).padStart(1, '0'),
            state.l.toString(36).padStart(2, '0'),
            state.x.toString(36).padStart(4, '0'),
            state.e.toString(36).padStart(1, '0'),
            state.a.toString(36).padStart(2, '0'),
            state.c.toString(36).padStart(2, '0'),
            state.s.toString(36).padStart(2, '0'),
            state.eb.toString(36).padStart(2, '0'),
            state.cs.toString(36).padStart(3, '0')
        ];
        return parts.join('').toUpperCase();
    }

    decodeState(encoded) {
        // Decode the base36 string back to state
        let pos = 0;
        const readPart = (len) => {
            const part = encoded.substring(pos, pos + len);
            pos += len;
            return parseInt(part, 36);
        };

        return {
            v: readPart(1),
            l: readPart(2),
            x: readPart(4),
            e: readPart(1),
            a: readPart(2),
            c: readPart(2),
            s: readPart(2),
            eb: readPart(2),
            cs: readPart(3)
        };
    }

    formatCode(encoded) {
        // Format as QQ-XXXX-XXXX-XXXX
        const full = 'QQ' + encoded.padStart(12, '0');
        return `${full.substring(0, 4)}-${full.substring(4, 8)}-${full.substring(8, 12)}-${full.substring(12, 16)}`;
    }

    applyImportedState(state) {
        this.data.level = state.l;
        this.data.xp = state.x;
        this.data.completedEras = this.bitmapToEras(state.eb);

        // Reconstruct completed lessons based on completed eras
        this.data.completedLessons = [];
        for (const eraId of this.data.completedEras) {
            const era = GameData.eras.find(e => e.id === eraId);
            if (era) {
                this.data.completedLessons.push(...era.lessons);
            }
        }

        this.save();
    }

    // ================================
    // XP and Level Management
    // ================================

    addXP(amount, source = 'unknown') {
        const oldLevel = this.data.level;
        this.data.xp += amount;

        // Check for level up
        const newLevel = this.calculateLevel(this.data.xp);
        if (newLevel > oldLevel) {
            this.data.level = newLevel;
            this.save();
            return {
                xpGained: amount,
                leveledUp: true,
                oldLevel,
                newLevel,
                title: GameData.levels.find(l => l.level === newLevel)?.title
            };
        }

        this.save();
        return { xpGained: amount, leveledUp: false };
    }

    calculateLevel(xp) {
        let level = 1;
        for (const levelData of GameData.levels) {
            if (xp >= levelData.xpRequired) {
                level = levelData.level;
            } else {
                break;
            }
        }
        return level;
    }

    getXPForNextLevel() {
        const nextLevel = GameData.levels.find(l => l.level === this.data.level + 1);
        return nextLevel ? nextLevel.xpRequired - this.data.xp : 0;
    }

    getProgressToNextLevel() {
        const currentLevelData = GameData.levels.find(l => l.level === this.data.level);
        const nextLevelData = GameData.levels.find(l => l.level === this.data.level + 1);

        if (!nextLevelData) return 100; // Max level

        const currentMin = currentLevelData.xpRequired;
        const nextMin = nextLevelData.xpRequired;
        const progress = ((this.data.xp - currentMin) / (nextMin - currentMin)) * 100;

        return Math.min(100, Math.max(0, progress));
    }

    // ================================
    // Lesson Progress
    // ================================

    completeLesson(lessonId) {
        if (!this.data.completedLessons.includes(lessonId)) {
            this.data.completedLessons.push(lessonId);

            // Get lesson XP
            const lesson = GameData.lessons[lessonId];
            let result = null;
            if (lesson) {
                result = this.addXP(lesson.xp, `lesson:${lessonId}`);
            }

            // Check for first lesson achievement
            if (this.data.completedLessons.length === 1) {
                this.unlockAchievement('first-lesson');
            }

            // Check for era completion
            this.checkEraCompletion();

            this.save();
            return result;
        }
        return null;
    }

    isLessonComplete(lessonId) {
        return this.data.completedLessons.includes(lessonId);
    }

    getEraProgress(eraId) {
        const era = GameData.eras.find(e => e.id === eraId);
        if (!era) return { completed: 0, total: 0, percent: 0 };

        const completed = era.lessons.filter(l => this.data.completedLessons.includes(l)).length;
        const total = era.lessons.length;
        const percent = Math.round((completed / total) * 100);

        return { completed, total, percent };
    }

    checkEraCompletion() {
        for (const era of GameData.eras) {
            if (!this.data.completedEras.includes(era.id)) {
                const progress = this.getEraProgress(era.id);
                if (progress.percent === 100) {
                    this.data.completedEras.push(era.id);
                    this.unlockAchievement(`${era.id}-complete`);

                    // Check if all eras complete
                    if (this.data.completedEras.length === GameData.eras.length) {
                        this.unlockAchievement('all-eras');
                    }
                }
            }
        }
    }

    isEraUnlocked(eraId) {
        const era = GameData.eras.find(e => e.id === eraId);
        if (!era) return false;
        if (era.prerequisites.length === 0) return true;

        return era.prerequisites.every(prereq =>
            this.data.completedEras.includes(prereq)
        );
    }

    // ================================
    // Quiz Management
    // ================================

    saveQuizScore(quizId, score, total) {
        const percent = Math.round((score / total) * 100);
        this.data.quizScores[quizId] = {
            score,
            total,
            percent,
            date: new Date().toISOString()
        };

        // Check for perfect score achievement
        if (percent === 100) {
            this.unlockAchievement('perfect-score');
        }

        this.save();
        return percent;
    }

    // ================================
    // Challenge Management
    // ================================

    completeChallenge(challengeId) {
        if (!this.data.completedChallenges.includes(challengeId)) {
            this.data.completedChallenges.push(challengeId);

            // First challenge achievement
            if (this.data.completedChallenges.length === 1) {
                this.unlockAchievement('first-challenge');
            }

            this.save();
            return true;
        }
        return false;
    }

    isChallengeComplete(challengeId) {
        return this.data.completedChallenges.includes(challengeId);
    }

    // ================================
    // Achievement Management
    // ================================

    unlockAchievement(achievementId) {
        if (!this.data.achievements.includes(achievementId)) {
            this.data.achievements.push(achievementId);

            const achievement = GameData.achievements[achievementId];
            if (achievement) {
                this.addXP(achievement.xp, `achievement:${achievementId}`);
            }

            this.save();
            return achievement;
        }
        return null;
    }

    hasAchievement(achievementId) {
        return this.data.achievements.includes(achievementId);
    }

    // ================================
    // Circuit Tracking
    // ================================

    incrementCircuitsBuilt() {
        this.data.circuitsBuilt++;

        // First circuit achievement
        if (this.data.circuitsBuilt === 1) {
            this.unlockAchievement('first-circuit');
        }

        // 100 circuits achievement
        if (this.data.circuitsBuilt === 100) {
            this.unlockAchievement('circuit-100');
        }

        this.save();
    }

    // ================================
    // Streak Management
    // ================================

    updateStreak() {
        const today = new Date().toDateString();
        const lastPlay = this.data.lastPlayDate;

        if (lastPlay) {
            const lastDate = new Date(lastPlay).toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            if (lastDate === today) {
                // Same day, no change
            } else if (lastDate === yesterday) {
                // Consecutive day
                this.data.streak++;
                if (this.data.streak === 7) {
                    this.unlockAchievement('streak-7');
                }
            } else {
                // Streak broken
                this.data.streak = 1;
            }
        } else {
            this.data.streak = 1;
        }

        this.data.lastPlayDate = today;
        this.save();
    }

    // ================================
    // Time-based Achievements
    // ================================

    checkTimeAchievements() {
        const hour = new Date().getHours();

        if (hour >= 0 && hour < 5) {
            this.unlockAchievement('night-owl');
        }

        if (hour >= 5 && hour < 6) {
            this.unlockAchievement('early-bird');
        }
    }

    // ================================
    // Stats
    // ================================

    getStats() {
        return {
            xp: this.data.xp,
            level: this.data.level,
            title: GameData.levels.find(l => l.level === this.data.level)?.title || 'Unknown',
            lessonsCompleted: this.data.completedLessons.length,
            erasCompleted: this.data.completedEras.length,
            challengesCompleted: this.data.completedChallenges.length,
            achievementsEarned: this.data.achievements.length,
            circuitsBuilt: this.data.circuitsBuilt,
            streak: this.data.streak,
            totalLessons: Object.keys(GameData.lessons).length,
            totalEras: GameData.eras.length,
            totalAchievements: Object.keys(GameData.achievements).length,
            progressPercent: Math.round(
                (this.data.completedLessons.length / Object.keys(GameData.lessons).length) * 100
            )
        };
    }

    // ================================
    // Reset
    // ================================

    reset() {
        this.data = this.getDefaultProgress();
        this.save();
    }
}

// Export
window.ProgressManager = ProgressManager;
