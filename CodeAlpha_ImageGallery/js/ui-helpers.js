// UI Utilities and Animations
class UIHelpers {
    static showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    static createSnowfall() {
        const snowflakes = ['❅', '❆', '•'];

        for (let i = 0; i < 20; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];

            const size = Math.random() * 1.2 + 0.5;
            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;

            snowflake.style.fontSize = `${size}rem`;
            snowflake.style.left = `${left}%`;
            snowflake.style.animationDuration = `${duration}s`;
            snowflake.style.animationDelay = `${delay}s`;

            elements.snowContainer.appendChild(snowflake);
        }
    }

    static showLoading() {
        elements.loadingSpinner.style.display = 'block';
        elements.loadMoreBtn.style.display = 'none';
    }

    static hideLoading() {
        elements.loadingSpinner.style.display = 'none';
    }

    static showError(message) {
        elements.imagesGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    }
}