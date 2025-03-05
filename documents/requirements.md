# Key Requirements and Considerations

## Functional Requirements

### Game Setup (Admin-Only):
- Admins create questions with multiple-choice or text-based answers.
- Admins set a timer for answer submission deadlines.
- A shareable link is generated for guests to join the game via app download.
- Admins can modify the game at any time.

### Landing Page:
- New users create profiles with a first name and selfie.
- Existing users log in and are directed to the question and answer page.

### Question and Answer Page:
- Displays questions with a visible countdown timer for submissions.
- Users can edit answers before the timer expires.
- Post-timer, users vote publicly on correct answers (no downvoting).
- Votes can be edited or removed by users.
- The answer with the most votes is locked as correct (admins can override).
- Admins review and confirm final results.
- A leaderboard displays the top 3 winners.

### Forums:
- Open group chat for all guests (admins moderate).
- Private chats created and managed by guests.
- Notifications for new messages.

## Non-Functional Requirements

### Scalability:
- Handle varying guest counts (dozens to hundreds) with concurrent interactions.
- Support real-time updates for timers, voting, and chats.
- Efficiently manage media (e.g., selfies, chat photos).

### Usability:
- Intuitive, simple interface for all guests, including non-technical users.
- Fast load times and responsive interactions.

### Customer Experience:
- Reliable real-time notifications.
- Engaging and seamless game flow.

### Security:
- Protect user data (selfies, chats) with encryption and access controls.
- Secure authentication and authorization.