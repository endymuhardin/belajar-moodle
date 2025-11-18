# Bab 11: Complete Learning Workflow

Bab ini membahas end-to-end workflow pembelajaran di Moodle, mulai dari authoring courseware menggunakan CMI5, deployment ke Moodle, hingga eksekusi course lengkap dengan enrollment, attendance, assignment submission, progress tracking, final exam, dan course result.

## Overview: Learning Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                  COMPLETE LEARNING WORKFLOW                  │
└─────────────────────────────────────────────────────────────┘

Phase 1: AUTHORING                Phase 2: DEPLOYMENT
┌──────────────┐                  ┌──────────────┐
│ Create CMI5  │                  │ Upload to    │
│ Content      │ ────────────────>│ Moodle       │
│              │                  │              │
└──────────────┘                  └──────────────┘
                                         │
        ┌────────────────────────────────┘
        │
        ▼
Phase 3: COURSE EXECUTION          Phase 4: ASSESSMENT
┌──────────────┐                  ┌──────────────┐
│ 1. Enrollment│                  │ 7. Final Exam│
│ 2. Attendance│                  │ 8. Grading   │
│ 3. Learning  │                  │ 9. Results   │
│ 4. Assignments│                 │10. Analytics │
│ 5. Progress  │                  │              │
│ 6. Discussion│                  │              │
└──────────────┘                  └──────────────┘
```

## PHASE 1: Authoring Courseware with CMI5

### Step 1: Plan Course Structure

**Define Learning Objectives:**
```yaml
Course: "Introduction to Web Development"
Duration: 8 weeks
Objectives:
  - Understand HTML5 basics
  - Master CSS3 styling
  - Create responsive layouts
  - Build interactive websites with JavaScript

Modules:
  Module 1: HTML Fundamentals (Week 1-2)
  Module 2: CSS Styling (Week 3-4)
  Module 3: Responsive Design (Week 5-6)
  Module 4: JavaScript Basics (Week 7-8)
```

### Step 2: Create CMI5 Package

**Directory Structure:**
```
web-dev-course/
├── cmi5.xml                    # Course structure
├── tincan.xml                  # xAPI configuration
├── module1/
│   ├── index.html             # Lesson launcher
│   ├── lesson1.html           # HTML Basics
│   ├── lesson2.html           # Tags & Elements
│   ├── quiz1.html             # Module quiz
│   └── assets/
│       ├── css/
│       ├── js/
│       └── images/
├── module2/
│   └── ...
└── shared/
    ├── xapi-wrapper.js        # xAPI library
    └── cmi5-client.js         # CMI5 client library
```

**cmi5.xml Structure:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<courseStructure xmlns="https://w3id.org/xapi/profiles/cmi5/v1/CourseStructure.xsd">
    <course id="https://example.com/webdev101">
        <title>
            <langstring lang="en">Introduction to Web Development</langstring>
            <langstring lang="id">Pengenalan Pengembangan Web</langstring>
        </title>
        <description>
            <langstring lang="en">Complete web development fundamentals</langstring>
        </description>

        <!-- Block 1: HTML Fundamentals -->
        <block id="https://example.com/webdev101/block1">
            <title>
                <langstring lang="en">Module 1: HTML Fundamentals</langstring>
            </title>

            <!-- AU 1: HTML Basics -->
            <au id="https://example.com/webdev101/au1"
                moveOn="CompletedOrPassed"
                masteryScore="0.8"
                launchMethod="OwnWindow">
                <title>
                    <langstring lang="en">Lesson 1: HTML Basics</langstring>
                </title>
                <url>module1/lesson1.html</url>
            </au>

            <!-- AU 2: Tags & Elements -->
            <au id="https://example.com/webdev101/au2"
                moveOn="CompletedOrPassed"
                masteryScore="0.8"
                launchMethod="OwnWindow">
                <title>
                    <langstring lang="en">Lesson 2: Tags & Elements</langstring>
                </title>
                <url>module1/lesson2.html</url>
            </au>

            <!-- AU 3: Module Quiz -->
            <au id="https://example.com/webdev101/quiz1"
                moveOn="Passed"
                masteryScore="0.7"
                launchMethod="OwnWindow">
                <title>
                    <langstring lang="en">Module 1 Quiz</langstring>
                </title>
                <url>module1/quiz1.html</url>
            </au>
        </block>

        <!-- Additional blocks for Module 2, 3, 4... -->
    </course>
</courseStructure>
```

### Step 3: Implement xAPI Tracking

**Initialize CMI5 Session:**
```javascript
// cmi5-client.js
class CMI5Client {
    constructor() {
        // Get cmi5 parameters from URL
        this.params = this.getURLParams();
        this.endpoint = this.params.endpoint;
        this.fetch = this.params.fetch;
        this.registration = this.params.registration;
        this.actor = this.params.actor;

        // Initialize TinCan
        this.tincan = new TinCan({
            recordStores: [{
                endpoint: this.endpoint,
                auth: "Basic " + btoa(this.fetch)
            }]
        });
    }

    // Send initialized statement
    initialize() {
        const stmt = {
            actor: JSON.parse(this.actor),
            verb: {
                id: "http://adlnet.gov/expapi/verbs/initialized",
                display: {"en-US": "initialized"}
            },
            object: {
                id: this.params.activityId,
                definition: {
                    type: "http://adlnet.gov/expapi/activities/cmi5/block"
                }
            },
            context: {
                registration: this.params.registration,
                contextActivities: {
                    grouping: [{
                        id: this.params.groupingId
                    }]
                }
            }
        };

        this.tincan.sendStatement(stmt);
    }

    // Send completed statement
    complete(score, success) {
        const stmt = {
            actor: JSON.parse(this.actor),
            verb: {
                id: "http://adlnet.gov/expapi/verbs/completed",
                display: {"en-US": "completed"}
            },
            object: {
                id: this.params.activityId,
                definition: {
                    type: "http://adlnet.gov/expapi/activities/cmi5/block"
                }
            },
            result: {
                score: {
                    scaled: score,
                    raw: score * 100,
                    min: 0,
                    max: 100
                },
                success: success,
                completion: true,
                duration: this.calculateDuration()
            },
            context: {
                registration: this.params.registration
            }
        };

        this.tincan.sendStatement(stmt);
    }

    // Track progress
    sendProgress(progress) {
        const stmt = {
            actor: JSON.parse(this.actor),
            verb: {
                id: "http://adlnet.gov/expapi/verbs/progressed",
                display: {"en-US": "progressed"}
            },
            object: {
                id: this.params.activityId
            },
            result: {
                extensions: {
                    "https://w3id.org/xapi/cmi5/result/extensions/progress": progress
                }
            }
        };

        this.tincan.sendStatement(stmt);
    }
}
```

**Lesson Implementation:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Lesson 1: HTML Basics</title>
    <script src="../shared/tincan-min.js"></script>
    <script src="../shared/cmi5-client.js"></script>
</head>
<body>
    <div id="lesson-content">
        <h1>HTML Basics</h1>
        <p>HTML (HyperText Markup Language) is...</p>

        <!-- Interactive content -->
        <div class="interactive-section">
            <h2>Practice: Create Your First HTML</h2>
            <textarea id="code-editor"></textarea>
            <button onclick="checkAnswer()">Submit</button>
        </div>

        <button onclick="completeLesson()">Mark as Complete</button>
    </div>

    <script>
        // Initialize CMI5
        const cmi5 = new CMI5Client();
        cmi5.initialize();

        let progress = 0;

        // Track page scroll progress
        window.addEventListener('scroll', function() {
            const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrolled > progress + 10) {
                progress = scrolled;
                cmi5.sendProgress(progress / 100);
            }
        });

        function checkAnswer() {
            // Check student's code
            const code = document.getElementById('code-editor').value;
            const isCorrect = validateHTML(code);

            // Send statement
            cmi5.complete(isCorrect ? 1.0 : 0.5, isCorrect);
        }

        function completeLesson() {
            cmi5.complete(1.0, true);
            window.close();
        }
    </script>
</body>
</html>
```

### Step 4: Package for Deployment

```bash
# Create zip package
cd web-dev-course
zip -r web-dev-course-cmi5.zip cmi5.xml tincan.xml module1/ module2/ shared/

# Verify package structure
unzip -l web-dev-course-cmi5.zip
```

## PHASE 2: Deployment to Moodle

### Step 1: Install CMI5 Plugin

**Via Site Administration:**
```
1. Site administration → Plugins → Install plugins
2. Upload cmi5launch plugin (moodle-mod_cmi5launch.zip)
3. Click "Install plugin from ZIP file"
4. Confirm installation
5. Configure plugin settings
```

**Manual Installation:**
```bash
# Via SSH to Moodle server
cd /var/www/html/mod/
git clone https://github.com/cmi5-au/moodle-mod_cmi5launch.git cmi5launch

# Set permissions
chown -R www-data:www-data cmi5launch
chmod -R 755 cmi5launch

# Then visit Site administration → Notifications to complete installation
```

### Step 2: Configure LRS (Learning Record Store)

**Option A: Use Moodle's Built-in LRS**
```
Site administration → Plugins → Activity modules → CMI5
- Enable internal LRS: Yes
- LRS endpoint: Automatically configured
- Authentication: OAuth 2.0
```

**Option B: External LRS (Learning Locker)**
```
Site administration → Plugins → Activity modules → CMI5
- LRS endpoint: https://your-lrs.com/data/xAPI/
- LRS key: your_key
- LRS secret: your_secret
- Authentication method: Basic Auth
```

### Step 3: Create Course in Moodle

**1. Create New Course:**
```
Site administration → Courses → Manage courses and categories
- Click "Create new course"
- Course full name: Introduction to Web Development
- Course short name: WEBDEV101
- Course start date: [select date]
- Course end date: [select date]
- Course format: Topics
- Number of sections: 4
```

**2. Configure Course Settings:**
```
- Enrollment methods: Manual enrollment, Self enrollment
- Completion tracking: Enabled
- Enable completion tracking: Yes
- Show activity completion conditions: Yes
```

### Step 4: Upload CMI5 Package

**1. Add CMI5 Activity:**
```
1. Turn editing on
2. In Topic 1, click "Add an activity or resource"
3. Select "CMI5 Package"
4. Click "Add"
```

**2. Configure CMI5 Activity:**
```
General:
- Name: Module 1 - HTML Fundamentals
- Description: Learn HTML basics through interactive lessons

Package:
- Upload file: web-dev-course-cmi5.zip
- Display: New window
- Width: 1024px
- Height: 768px

Grade:
- Type: Point
- Maximum grade: 100
- Grade to pass: 70

Completion:
- Completion tracking: Show activity as complete when conditions are met
- Require view: Yes
- Require grade: Yes
- Expect completed on: [date]
```

## PHASE 3: Course Execution

### Step 1: Student Enrollment

**Manual Enrollment (by Teacher):**
```
Course page → Participants → Enrol users
- Search for users
- Select enrollment method: Manual enrollments
- Assign role: Student
- Click "Enrol"
```

**Self-Enrollment (by Students):**
```
Students:
1. Log in to Moodle
2. Browse to course catalog
3. Find "Introduction to Web Development"
4. Click "Enrol me"
5. (Optional) Enter enrollment key if required
```

**Bulk Enrollment:**
```csv
# users.csv
username,email,firstname,lastname,course1,role1
student1,student1@example.com,John,Doe,WEBDEV101,student
student2,student2@example.com,Jane,Smith,WEBDEV101,student
```

```
Site administration → Users → Upload users
- Upload CSV file
- Map fields
- Confirm enrollment
```

### Step 2: Attendance Tracking

**Install Attendance Module:**
```
Site administration → Plugins → Install plugins
- Search: Attendance
- Install "Attendance" plugin
```

**Configure Attendance:**
```
Course → Add activity → Attendance
- Name: Weekly Attendance
- Grade: 10 points
- Sessions:
  - Week 1: Monday 10:00-12:00
  - Week 2: Monday 10:00-12:00
  - [etc.]
```

**Take Attendance:**
```
Teacher:
1. Go to Attendance activity
2. Select session
3. Mark attendance:
   - Present (P)
   - Absent (A)
   - Late (L)
   - Excused (E)
4. Add remarks if needed
5. Save
```

**Student Self-Attendance (QR Code):**
```
Enable self-marking:
- Attendance settings → Allow students to record own attendance
- Generate QR code for each session
- Students scan QR code to mark attendance
- Time limit: 15 minutes from session start
```

### Step 3: Learning Activities

**A. Interactive Lessons (CMI5):**
```
Students:
1. Click "Module 1 - HTML Fundamentals"
2. Launch window opens
3. Complete lessons in sequence:
   - Lesson 1: HTML Basics
   - Lesson 2: Tags & Elements
   - Quiz 1: Module Assessment
4. Progress tracked automatically via xAPI
5. Grade recorded in Moodle gradebook
```

**B. Discussion Forums:**
```
Add activity → Forum
- Forum type: Standard forum for general use
- Name: Weekly Discussion
- Topics:
  - Week 1: Introduction & Goals
  - Week 2: HTML Best Practices
  - [etc.]

Grading:
- Whole forum grading: Yes
- Maximum grade: 10
- Grading criteria:
  - Quality of posts
  - Interaction with peers
  - Constructive feedback
```

### Step 4: Assignment Submission

**Create Assignment:**
```
Add activity → Assignment
- Name: Project 1 - Personal Portfolio Website
- Description: Create a personal portfolio using HTML & CSS
- Submission types:
  - File submissions: Yes (accept .zip)
  - Maximum number of uploaded files: 1
  - Maximum submission size: 10MB
- Due date: Week 4, Friday 23:59
- Cut-off date: Week 5, Sunday 23:59
- Grade:
  - Type: Point
  - Maximum grade: 100
  - Grade to pass: 70

Feedback types:
- Feedback comments: Yes
- Annotate PDF: Yes
- Feedback files: Yes
```

**Student Submission:**
```
Students:
1. Click assignment
2. Click "Add submission"
3. Drag & drop files or browse
4. Upload portfolio.zip
5. Click "Save changes"
6. Confirm submission
```

**Teacher Grading:**
```
Teacher:
1. Assignment → View all submissions
2. Select student
3. Download submission
4. Review work
5. Grade (0-100)
6. Provide feedback:
   - Written comments
   - Annotated PDF
   - Rubric (if configured)
7. Save changes
8. Release grades
```

### Step 5: Progress Tracking

**Course Completion:**
```
Course settings → Course completion
- Completion requirements:
  - CMI5 modules: All completed with passing grade
  - Assignments: All submitted and graded
  - Attendance: Minimum 80%
  - Forum participation: At least 5 posts
  - Final exam: Passed (≥70%)
```

**Student Progress Dashboard:**
```
Students can view:
- Overall course progress %
- Completed activities (checkmarks)
- Pending activities
- Grades for completed work
- Time spent on each activity (from xAPI)
- Predicted completion date
```

**Teacher Analytics:**
```
Reports → Course completion
- View completion status per student
- Filter by criteria
- Export to CSV

Reports → Activity completion
- See which activities are bottlenecks
- Identify struggling students
- Plan interventions
```

### Step 6: Collaborative Learning

**Group Projects:**
```
Course → Participants → Groups
- Create groups (3-4 students each)
- Assign group leaders
- Create group assignment:
  - Submission: Group submission
  - All members get same grade
```

**Peer Assessment:**
```
Add activity → Workshop
- Name: Peer Review - Portfolio Sites
- Submission phase: Week 6-7
- Assessment phase: Week 7-8
- Grading strategy: Rubric
- Each student reviews 3 peers
- Final grade: 50% submission + 50% peer reviews
```

## PHASE 4: Assessment & Final Exam

### Step 1: Create Final Exam

**Quiz Configuration:**
```
Add activity → Quiz
- Name: Final Exam - Web Development Fundamentals
- Timing:
  - Open: Week 8, Monday 00:00
  - Close: Week 8, Friday 23:59
  - Time limit: 120 minutes
- Grade:
  - Grade to pass: 70
  - Maximum grade: 100
  - Attempts allowed: 1

Question behavior:
- Shuffle: Yes
- How questions behave: Deferred feedback
- Review options: After quiz closes

Extra restrictions:
- Require password: exam2024
- Browser security: Full screen pop-up with JavaScript security
- Safe Exam Browser: Required (optional)
```

**Add Questions:**
```
Quiz → Edit quiz → Add → a new question

Question types:
1. Multiple choice (30 questions, 2 points each)
   - HTML basics
   - CSS properties
   - Responsive design
   - JavaScript fundamentals

2. True/False (10 questions, 1 point each)

3. Short answer (5 questions, 6 points each)
   - Code snippets
   - Best practices

Total: 100 points
```

### Step 2: Exam Proctoring (Optional)

**Safe Exam Browser:**
```
Quiz settings → Extra restrictions
- Require the use of Safe Exam Browser: Yes
- Download configuration file
- Students install Safe Exam Browser
- Import configuration
- Take exam in locked-down browser
```

**Live Proctoring:**
```
Options:
1. Zoom integration
   - Install mod_zoom plugin
   - Create Zoom meeting
   - Monitor students during exam

2. ProctorU/Examity integration
   - Third-party proctoring service
   - Students verify identity
   - AI + human proctoring

3. In-person proctoring
   - Computer lab
   - Supervised exam session
```

### Step 3: Grading & Results

**Automatic Grading:**
```
Quiz:
- Multiple choice: Auto-graded immediately
- True/False: Auto-graded immediately
- Matching: Auto-graded immediately

Review grades:
- Quiz → Results → Grades
- Verify auto-grading
- Manually grade short answer questions
```

**Assignment Grading with Rubric:**
```
Create rubric:
1. Assignment → Advanced grading → Rubric
2. Define criteria:
   - Code quality (0-25 points)
   - Design & layout (0-25 points)
   - Functionality (0-25 points)
   - Documentation (0-25 points)
3. Save rubric
4. Use rubric for grading:
   - Select levels for each criterion
   - Auto-calculate total
   - Provide feedback
```

### Step 4: Final Course Results

**Gradebook Configuration:**
```
Course → Grades → Setup → Gradebook setup

Categories:
1. Participation (15%)
   - Attendance: 5%
   - Forum posts: 10%

2. Assignments (35%)
   - Project 1: 15%
   - Project 2: 20%

3. CMI5 Modules (25%)
   - Module 1-4: 25%

4. Final Exam (25%)

Aggregation:
- Weighted mean of grades
- Drop lowest: 0
- Extra credit: None

Grade to pass: 70
```

**Generate Reports:**
```
Reports → User report
- Per student detailed view
- All grades and activities
- Course completion status

Reports → Overview report
- Class statistics
- Average grades
- Pass/fail rates
- Export to Excel/PDF
```

### Step 5: Certificates & Badges

**Issue Certificates:**
```
Install Certificate plugin:
Site administration → Plugins → Install plugins → Certificate

Create certificate:
1. Add activity → Certificate
2. Design template:
   - Student name
   - Course name
   - Grade achieved
   - Completion date
   - Instructor signature
3. Availability: After course completion
```

**Award Badges:**
```
Site administration → Badges → Add new badge

Course badge:
- Name: Web Development Expert
- Description: Successfully completed WEBDEV101
- Criteria:
  - Course completion: Yes
  - Minimum grade: 80%
  - All activities completed

Enable backpack:
- Students can export to Mozilla Backpack
- Share on LinkedIn, portfolios
```

## Analytics & Continuous Improvement

### Learning Analytics

**Course Analytics Dashboard:**
```
Reports → Course analytics
- Student engagement
- Activity completion rates
- Average time per activity
- Risk indicators (students at risk of failing)
- Predicted outcomes
```

**xAPI Analytics (from LRS):**
```
Learning Locker Dashboard:
- Detailed learning paths
- Time spent per lesson
- Quiz attempt patterns
- Social learning interactions
- Correlation between activities and outcomes
```

### Feedback Collection

**End-of-Course Survey:**
```
Add activity → Feedback
- Course satisfaction
- Content quality
- Instructor effectiveness
- Platform usability
- Suggestions for improvement
```

**Continuous Feedback:**
```
Add activity → Choice (polls)
- Weekly check-ins
- Pace feedback
- Difficulty level
- Resource helpfulness
```

### Course Improvement

**Analyze Results:**
```
Questions to answer:
- Which topics had lowest completion?
- Which quizzes had lowest scores?
- Where did students spend most time?
- What correlates with success?
- What feedback was most common?
```

**Implement Changes:**
```
Next iteration improvements:
- Add more practice exercises for difficult topics
- Improve lesson clarity based on feedback
- Adjust pacing based on time data
- Update outdated content
- Add more interactive elements
```

## Summary: Complete Workflow Checklist

### Authoring Phase ✓
- [ ] Define learning objectives
- [ ] Create course structure
- [ ] Develop CMI5 content
- [ ] Implement xAPI tracking
- [ ] Test package locally
- [ ] Package for deployment

### Deployment Phase ✓
- [ ] Install CMI5 plugin
- [ ] Configure LRS
- [ ] Create Moodle course
- [ ] Upload CMI5 package
- [ ] Configure activities
- [ ] Set completion criteria

### Execution Phase ✓
- [ ] Enroll students
- [ ] Track attendance
- [ ] Monitor learning progress
- [ ] Grade assignments
- [ ] Facilitate discussions
- [ ] Provide feedback

### Assessment Phase ✓
- [ ] Conduct final exam
- [ ] Grade all submissions
- [ ] Calculate final grades
- [ ] Issue certificates/badges
- [ ] Generate reports
- [ ] Collect feedback

### Improvement Phase ✓
- [ ] Analyze results
- [ ] Review feedback
- [ ] Identify improvements
- [ ] Update content
- [ ] Document lessons learned

---

**Berikutnya:** [Bab 12 - Learning Progress & Assessment →](learning-progress-tracking.md)

**Resources:**

- [CMI5 Specification](https://github.com/AICC/CMI-5_Spec_Current)
- [xAPI Registry](https://registry.tincanapi.com/)
- [Moodle Gradebook Documentation](https://docs.moodle.org/en/Gradebook)
