# ⏱️ StudyTracker

StudyTracker is a gamified time and task management application explicitly designed for learning and studying. It helps users maintain motivation by "paying" a virtual salary for study time and task completions while strictly enforcing discipline through weekly and monthly reward and penalty mechanics.

The application runs entirely client-side on the browser, ensuring your data remains private and securely stored locally via **IndexedDB**.

---

## 🌟 Key Features

*   **Task Management:** Add, mark as complete, or delete daily tasks effortlessly.
*   **Integrated Study Timer:**
    *   Start/stop study sessions with a simple click.
    *   Accumulate actual study time seamlessly.
    *   Option to manually log study hours.
*   **Gamified Reward System:**
    *   **Study Time:** Earn +10,000 VND (virtual currency) for every hour studied.
    *   **Daily Tasks:** Earn a +20,000 VND bonus for completing 100% of your daily tasks.
    *   **Withdrawals / Self-Rewards:** "Withdraw" your virtual earnings to reward yourself in real life (e.g., buying a book, getting coffee). This deducts from your available balance transparently and maintains a withdrawal history.
*   **Discipline Mechanics (Rewards & Penalties):**
    *   **Weekly Streak Reward:** Complete 100% of all tasks from Monday to Sunday for a massive bonus (+100,000 VND).
    *   **Daily Penalty:** Lose money for every uncompleted task at the end of the day (-10,000 VND/task).
    *   **Monthly Evaluation:** A major reward if you hit your target study hours for the month; a stiff penalty if you fall short.
*   **Customizable Goals:**
    *   Personalize the **Name** and **Target Value** for both your cumulative Savings Goal and your Monthly Study Hours goal.
*   **Comprehensive Statistics & Charts:**
    *   Interactive line charts for study hours and bar charts for daily task completion.
    *   Compare performance across multiple timeframes: Last 14 days, 8 weeks, 12 months, or yearly overview.
*   **Data Security & Recovery:**
    *   Export and Import your data easily via JSON files.
    *   Smart native browser warnings if you attempt to close the app without saving.
    *   One-click complete data reset/wipe (with secure confirmation).

---

## ⚙️ Earnings & Discipline Logic

The system actively evaluates your discipline to calculate earnings:

1.  **Hourly Wage:** `Study Hours × 10,000 VND` (Accumulates continuously; e.g., exactly 10k per 60 mins).
2.  **Daily Completion Bonus:** `+20,000 VND` if all tasks added for the day are checked as completed.
3.  **Daily Missed Penalty:** `-10,000 VND` for *each* task left uncompleted at the end of the day.
4.  **Weekly Streak:** If you achieve a 100% task completion rate every single day from Monday to Sunday: `+100,000 VND` bonus. *Note: Missing 3 or more tasks total during the week incurs a -50,000 VND penalty.*
5.  **Monthly Goal:** If total monthly study hours >= your Monthly Goal (default 50h): `+500,000 VND` bonus. If you fail to hit the goal: `-200,000 VND` penalty.

*Note: Weekly and monthly rewards/penalties are automatically calculated and applied only when a week or month officially concludes.*

---

## 🛠️ Technology Stack

*   **Framework:** React 18, Vite
*   **Styling:** Pure CSS3 (combining CSS variables for dynamic themes/colors) & fully Responsive Design.
*   **Local Database:** `Dexie.js` (A wrapper for IndexedDB) - allows persistent, fast storage directly inside the browser without requiring a backend server.
*   **Charts:** `Recharts`
*   **Icons:** `lucide-react`
*   **Dates Handling:** `date-fns`

---

## 🚀 Installation & Setup

This project requires **Node.js** (version 18+ is highly recommended).

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/appChamCong.git
    cd appChamCong
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The app will smoothly launch and be available at `http://localhost:5173`.

4.  **Build for production** (for deployment):
    ```bash
    npm run build
    # The optimized static assets will be outputted to the "dist" directory.
    ```

---

## 📂 Data Management Notice

*   **No Dedicated Backend DB:** All your tasks, study sessions, and withdrawal histories are stored purely locally inside your browser's IndexedDB. **If you use incognito mode, clear browser site data, or switch devices, your data will not carry over automatically.**
*   **Syncing Across Devices:** It's highly recommended to utilize the "Export Data" button (located at the bottom of the Sidebar) to save your progress as a `.json` file. You can then use "Import Data" on another device to seamlessly continue your progress.

---

*Stay disciplined, hit your targets, and earn those virtual rewards! 🎯*
