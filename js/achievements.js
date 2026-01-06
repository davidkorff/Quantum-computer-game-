/**
 * Quantum Quest - Achievements System
 *
 * Handles achievement display, popups, and tracking.
 */

class AchievementsManager {
    constructor(progressManager) {
        this.progress = progressManager;
        this.pendingPopups = [];
        this.isShowingPopup = false;
    }

    // Check and unlock achievement
    check(achievementId) {
        const unlocked = this.progress.unlockAchievement(achievementId);
        if (unlocked) {
            this.showPopup(unlocked);
            return true;
        }
        return false;
    }

    // Show achievement popup
    showPopup(achievement) {
        this.pendingPopups.push(achievement);
        if (!this.isShowingPopup) {
            this.displayNextPopup();
        }
    }

    displayNextPopup() {
        if (this.pendingPopups.length === 0) {
            this.isShowingPopup = false;
            return;
        }

        this.isShowingPopup = true;
        const achievement = this.pendingPopups.shift();

        const popup = document.getElementById('achievement-popup');
        const icon = document.getElementById('popup-achievement-icon');
        const name = document.getElementById('popup-achievement-name');
        const xp = document.getElementById('popup-achievement-xp');

        icon.textContent = achievement.icon;
        name.textContent = achievement.name;
        xp.textContent = `+${achievement.xp} XP`;

        popup.classList.remove('hidden');

        // Auto-hide after 4 seconds
        setTimeout(() => {
            popup.classList.add('hidden');
            setTimeout(() => this.displayNextPopup(), 500);
        }, 4000);
    }

    // Render achievements screen
    renderAchievementsScreen() {
        const stats = this.progress.getStats();

        // Update summary
        document.getElementById('achievements-earned').textContent = stats.achievementsEarned;
        document.getElementById('achievements-total').textContent = stats.totalAchievements;
        document.getElementById('total-xp').textContent = stats.xp.toLocaleString();

        // Render each category
        this.renderCategory('learning', 'learning-achievements');
        this.renderCategory('lab', 'lab-achievements');
        this.renderCategory('coding', 'coding-achievements');
        this.renderCategory('special', 'special-achievements');
    }

    renderCategory(category, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        const achievements = Object.values(GameData.achievements)
            .filter(a => a.category === category);

        for (const achievement of achievements) {
            const earned = this.progress.hasAchievement(achievement.id);
            const card = this.createAchievementCard(achievement, earned);
            container.appendChild(card);
        }
    }

    createAchievementCard(achievement, earned) {
        const card = document.createElement('div');
        card.className = `achievement-card ${earned ? 'earned' : 'locked'}`;

        card.innerHTML = `
            <div class="achievement-card-icon">${achievement.icon}</div>
            <div class="achievement-card-info">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                <span class="achievement-card-xp">${earned ? '✓ ' : ''}+${achievement.xp} XP</span>
            </div>
        `;

        return card;
    }

    // Check various conditions for achievements
    checkTimeBasedAchievements() {
        this.progress.checkTimeAchievements();
    }

    checkLessonSpeed(startTime) {
        const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
        if (elapsed < 5) {
            this.check('speed-demon');
        }
    }

    // Check for specific circuit patterns
    checkCircuitAchievements(circuit) {
        const gates = circuit.gates;

        // Check for Bell state pattern: H followed by CNOT
        if (this.hasPattern(gates, ['H'], ['CNOT'])) {
            this.check('bell-state');
        }

        // Check for GHZ pattern
        if (circuit.numQubits >= 3 && this.hasGHZPattern(gates)) {
            this.check('ghz-state');
        }

        // Check for teleportation pattern
        if (circuit.numQubits >= 3 && this.hasTeleportPattern(gates)) {
            this.check('teleportation');
        }
    }

    hasPattern(gates, ...patterns) {
        const gateNames = gates.map(g => g.name);
        for (const pattern of patterns) {
            if (!pattern.every(p => gateNames.includes(p))) {
                return false;
            }
        }
        return true;
    }

    hasGHZPattern(gates) {
        // H on first qubit, cascading CNOTs
        const hasH = gates.some(g => g.name === 'H');
        const cnotCount = gates.filter(g => g.name === 'CNOT').length;
        return hasH && cnotCount >= 2;
    }

    hasTeleportPattern(gates) {
        // Bell pair + Bell measurement
        const cnotCount = gates.filter(g => g.name === 'CNOT').length;
        const hCount = gates.filter(g => g.name === 'H').length;
        return cnotCount >= 2 && hCount >= 2;
    }
}

// Export
window.AchievementsManager = AchievementsManager;
