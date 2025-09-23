# Bab 5: Manajemen Pengguna dan Role

Moodle menggunakan sistem role-based access control (RBAC) yang fleksibel untuk mengatur hak akses pengguna. Pada bab ini, kita akan mempelajari berbagai role yang tersedia di Moodle, cara mengelola pengguna, dan mengkonfigurasi permission sesuai kebutuhan institusi.

## Manajemen Pengguna

### Membuat Pengguna Baru

#### Metode 1: Manual User Creation

1. **Login sebagai Administrator**
   - Akses Moodle dengan akun administrator
   - Navigate ke Site Administration

2. **Akses User Management**
   - Go to: **Site administration** → **Users** → **Add a new user**
   - Atau direct URL: `/user/editadvanced.php?id=-1`

3. **Isi Required Fields**

   **General Information:**
   - **Username**: Unique identifier untuk login (lowercase, no spaces)
   - **Authentication method**: Manual accounts (default) atau external authentication
   - **New password**: Minimal 8 karakter dengan kombinasi huruf, angka, dan symbol
   - **First name**: Nama depan user
   - **Surname**: Nama belakang user
   - **Email address**: Valid email untuk notifications

   **Additional Fields:**
   - **Email display**: Control siapa yang bisa lihat email
   - **City/town**: Lokasi user
   - **Country**: Select dari dropdown
   - **Timezone**: User's local timezone
   - **Preferred language**: Interface language untuk user
   - **Description**: Optional bio atau information

4. **Optional Settings**
   - **Force password change**: Require user untuk change password on first login
   - **Generate password and notify user**: System creates password dan email ke user
   - **User picture**: Upload profile photo
   - **Interests**: Tags untuk user interests

5. **Create User**
   - Click "Create user" button
   - User akan immediately active dan dapat login

<!-- TODO: Screenshot Manual user creation form -->

#### Metode 2: Bulk User Upload via CSV

1. **Prepare CSV File**

   Format CSV dengan headers:
   ```csv
   username,password,firstname,lastname,email,city,country,auth
   john.doe,Pass@word123,John,Doe,john@example.com,Jakarta,ID,manual
   jane.smith,Secure#456,Jane,Smith,jane@example.com,Bandung,ID,manual
   ```

   **Required fields:**
   - username
   - firstname
   - lastname
   - email

   **Optional fields:**
   - password (jika tidak ada, akan di-generate)
   - auth (authentication method, default: manual)
   - idnumber (external ID)
   - institution
   - department
   - phone1, phone2
   - address
   - lang (preferred language)
   - timezone
   - course1 (untuk auto-enrollment)
   - role1 (role dalam course1)

2. **Upload Process**
   - Navigate ke: **Site administration** → **Users** → **Upload users**
   - Select CSV file
   - Choose delimiter (comma, semicolon, atau tab)
   - Configure encoding (UTF-8 recommended)

3. **Preview dan Settings**
   - Review detected fields
   - Map CSV columns ke Moodle fields
   - Set upload type:
     - **Add new only**: Skip existing users
     - **Add new and update existing**: Update jika username exists
     - **Update existing only**: Hanya update existing users

4. **User Creation Settings**
   - **New user password**:
     - Field required in file
     - Create password if needed
     - Generate and email password
   - **Force password change**: On first login
   - **Email new users**: Send welcome email

5. **Execute Upload**
   - Review summary
   - Click "Upload users"
   - Check results untuk errors atau warnings

<!-- TODO: Screenshot CSV upload interface -->

#### Metode 3: External Authentication

**LDAP/Active Directory Integration:**
1. Configure LDAP authentication plugin
2. Map LDAP attributes ke Moodle fields
3. Users automatically created on first login

**OAuth2 (Google, Microsoft, Facebook):**
1. Setup OAuth2 service
2. Configure client ID dan secret
3. Users can self-register via social login

**Database Authentication:**
1. Connect ke external database
2. Map database fields
3. Synchronize users periodically

### Menonaktifkan Pengguna (Suspend/Deactivate)

#### Metode 1: Suspend User Account

1. **Navigate ke User List**
   - **Site administration** → **Users** → **Browse list of users**
   - Search untuk user yang akan di-suspend

2. **Edit User Profile**
   - Click edit icon (gear/pencil) pada user row
   - Atau click username lalu "Edit profile"

3. **Suspend Account**
   - Change **Authentication method** ke "No login"
   - Ini prevents user dari login tanpa delete data mereka
   - User's courses, grades, dan content tetap preserved

4. **Alternative: Account Lockout**
   - Di user profile, set **Suspended** ke "Yes"
   - User tidak bisa login tapi account tetap active
   - Useful untuk temporary suspension

<!-- TODO: Screenshot Suspend user interface -->

#### Metode 2: Bulk User Actions

1. **Select Multiple Users**
   - Go to **Site administration** → **Users** → **Bulk user actions**
   - Search dan select users untuk suspend
   - Add ke selection

2. **Choose Action**
   - Select "Force password change"
   - Atau "Delete" untuk permanent removal
   - Atau "Add to cohort" untuk group management

3. **Confirm Action**
   - Review selected users
   - Confirm suspension

#### Metode 3: Automated Suspension

**Inactive User Cleanup:**
1. Configure di **Site administration** → **Users** → **User policies**
2. Set "Delete not fully setup users after" (days)
3. Set "Delete suspended users after" (days)
4. Enable automatic cleanup

**Course Enrollment Expiry:**
1. Set enrollment duration di course settings
2. Configure action when enrollment expires:
   - Keep user enrolled but suspended
   - Unenroll user from course
   - Notify user before expiry

### Mengaktifkan Kembali Pengguna (Reactivate)

#### Reactivate Suspended Account

1. **Find Suspended User**
   - **Site administration** → **Users** → **Browse list of users**
   - Filter by authentication method "No login"
   - Atau search by username/email

2. **Edit User Profile**
   - Click edit icon untuk user
   - Access user profile settings

3. **Restore Access**
   - Change **Authentication method** back ke "Manual accounts"
   - Atau original authentication method (LDAP, OAuth2, etc.)
   - If suspended flag was used, set **Suspended** ke "No"

4. **Reset Password (Optional)**
   - Generate new password
   - Force password change on next login
   - Send password reset email

5. **Verify Reactivation**
   - Check user can login
   - Verify course enrollments still active
   - Confirm role assignments intact

<!-- TODO: Screenshot Reactivate user process -->

#### Bulk Reactivation

1. **Using Bulk Actions**
   - Select multiple suspended users
   - Apply authentication method change
   - Send notification emails

2. **CSV Update Method**
   ```csv
   username,auth
   john.doe,manual
   jane.smith,manual
   ```
   - Upload dengan "Update existing only"
   - Changes authentication method untuk selected users

#### Post-Reactivation Tasks

1. **Review User Permissions**
   - Check role assignments
   - Verify course enrollments
   - Update group memberships if needed

2. **Communication**
   - Send welcome back email
   - Provide updated login instructions
   - Share any system changes

3. **Monitoring**
   - Track login success
   - Monitor untuk issues
   - Provide support if needed

### User Account Management Best Practices

#### Security Considerations

1. **Password Policies**
   - Enforce strong passwords (min 8 chars, mixed case, numbers, symbols)
   - Require periodic password changes
   - Prevent password reuse
   - Lock accounts after failed attempts

2. **Account Monitoring**
   - Regular audit of admin accounts
   - Monitor unusual login patterns
   - Track permission changes
   - Review inactive accounts

3. **Data Protection**
   - Implement data retention policies
   - Regular cleanup of old accounts
   - Secure storage of user data
   - GDPR compliance measures

#### Administrative Workflows

1. **New User Onboarding**
   ```
   Create Account → Assign Roles → Enroll in Courses →
   Send Welcome Email → Monitor First Login → Provide Support
   ```

2. **User Lifecycle Management**
   ```
   Active → Warning (inactivity) → Suspended →
   Archived → Deleted (after retention period)
   ```

3. **Account Recovery Process**
   ```
   User Request → Verify Identity → Check Account Status →
   Reset Password → Reactivate → Confirm Access
   ```

#### Common Issues dan Solutions

**Issue: User Cannot Login**
- Check authentication method
- Verify account not suspended
- Reset password if needed
- Check email confirmation status
- Verify username correct (case-sensitive)

**Issue: Duplicate Accounts**
- Merge user accounts if possible
- Delete duplicate dengan no activity
- Update email untuk prevent duplicates
- Use unique ID field

**Issue: Mass Account Creation Errors**
- Validate CSV format
- Check required fields
- Verify email uniqueness
- Review password requirements
- Test dengan small batch first

## Pengenalan Role di Moodle

### Konsep Dasar Role

Role di Moodle adalah kumpulan permissions (izin) yang menentukan apa yang bisa dan tidak bisa dilakukan oleh seorang user dalam sistem. Setiap user dapat memiliki berbagai role tergantung pada context (lingkup) di mana mereka berada.

**Key Concepts:**
- **Role**: Kumpulan capabilities (kemampuan)
- **Context**: Lingkup dimana role diterapkan (System, Category, Course, Activity)
- **Capabilities**: Permission spesifik (seperti create course, grade students)
- **Assignment**: Pemberian role kepada user dalam context tertentu

<!-- TODO: Screenshot Role assignment interface -->

### Hierarki Context di Moodle

Context menentukan cakupan dimana role berlaku:

1. **System Context**: Seluruh sistem Moodle
2. **Category Context**: Kategori course dan sub-kategorinya
3. **Course Context**: Course tertentu
4. **Activity/Module Context**: Activity atau resource tertentu
5. **Block Context**: Block tertentu
6. **User Context**: Profile user tertentu

<!-- TODO: Screenshot Context hierarchy diagram -->

## Standard Roles di Moodle

### 1. Administrator

**Scope**: System-wide
**Purpose**: Kontrol penuh terhadap sistem Moodle

**Key Capabilities:**
- Akses ke Site Administration
- Install dan manage plugins
- Create dan delete users
- Manage global settings
- Access ke semua courses
- Backup dan restore sistem
- Manage security settings

**Typical Use Cases:**
- IT Administrator
- System Manager
- Technical Support Lead

**Important Capabilities:**
```
moodle/site:config - Configure site settings
moodle/user:create - Create user accounts
moodle/course:create - Create courses
moodle/backup:backupsection - Backup courses
moodle/restore:restoresection - Restore courses
```

<!-- TODO: Screenshot Administrator capabilities -->

**Best Practices:**
- Limit jumlah Administrator (maksimal 2-3 orang)
- Use strong authentication (2FA recommended)
- Regular audit administrator activities
- Document semua changes yang dilakukan

### 2. Manager

**Scope**: Category atau Course level
**Purpose**: Manage courses dan users tanpa access ke system configuration

**Key Capabilities:**
- Create dan manage courses dalam assigned categories
- Enroll dan unenroll users
- Access ke course reports
- Manage course categories
- Assign roles dalam scope mereka
- View course completion reports

**Typical Use Cases:**
- Academic Manager
- Dean atau Head of Department
- Training Manager
- Program Coordinator

**Important Capabilities:**
```
moodle/course:create - Create new courses
moodle/course:delete - Delete courses
moodle/role:assign - Assign roles to users
moodle/user:viewdetails - View user profiles
moodle/course:manageactivities - Manage course activities
```

<!-- TODO: Screenshot Manager interface -->

**Manager vs Administrator:**
| Aspect | Manager | Administrator |
|--------|---------|---------------|
| System settings | ❌ | ✅ |
| Plugin management | ❌ | ✅ |
| User creation | ✅ | ✅ |
| Course management | ✅ | ✅ |
| Site backup | ❌ | ✅ |
| Security settings | ❌ | ✅ |

### 3. Course Creator

**Scope**: System atau Category level
**Purpose**: Create courses baru dan manage courses yang mereka buat

**Key Capabilities:**
- Create courses baru
- Manage courses yang mereka create
- Set initial course settings
- Assign teachers ke courses mereka
- Access ke course templates

**Typical Use Cases:**
- Senior Teacher
- Curriculum Developer
- Instructional Designer
- Department Head

**Important Capabilities:**
```
moodle/course:create - Create new courses
moodle/course:update - Edit course settings
moodle/role:assign - Assign teachers to courses
moodle/course:visibility - Change course visibility
```

<!-- TODO: Screenshot Course Creator workflow -->

**Course Creator Workflow:**
1. Create course dengan basic settings
2. Configure course format dan structure
3. Assign teachers
4. Set enrollment methods
5. Transfer ownership atau maintain access

### 4. Teacher (Editing Teacher)

**Scope**: Course level
**Purpose**: Full control dalam course untuk teaching dan assessment

**Key Capabilities:**
- Edit course content
- Create dan manage activities
- Grade students
- Manage course enrollment
- Access ke gradebook
- Create groups dan groupings
- Backup dan restore course

**Typical Use Cases:**
- Primary Instructor
- Subject Teacher
- Course Owner
- Lead Trainer

**Important Capabilities:**
```
moodle/course:manageactivities - Create/edit activities
moodle/grade:edit - Edit grades
moodle/course:enrol - Enroll students
moodle/backup:backupcourse - Backup course
moodle/restore:restorecourse - Restore course
moodle/course:update - Update course settings
```

<!-- TODO: Screenshot Teacher interface -->

**Teacher Responsibilities:**
- **Content Creation**: Develop learning materials
- **Assessment**: Create dan grade assignments/quizzes
- **Communication**: Interact dengan students
- **Progress Tracking**: Monitor student progress
- **Course Management**: Maintain course organization

### 5. Non-editing Teacher

**Scope**: Course level
**Purpose**: Teaching support tanpa editing privileges

**Key Capabilities:**
- View semua course content
- Grade students (assignments yang sudah ada)
- Participate dalam activities
- View reports dan gradebook
- Communicate dengan students
- Download course content

**Typical Use Cases:**
- Teaching Assistant
- Guest Lecturer
- Grader
- Tutor
- Observer dengan grading rights

**Important Capabilities:**
```
moodle/grade:edit - Edit grades (limited)
moodle/course:viewhiddenactivities - View hidden content
moodle/grade:viewall - View all grades
moodle/user:viewdetails - View student profiles
```

<!-- TODO: Screenshot Non-editing Teacher interface -->

**Non-editing Teacher vs Teacher:**
| Capability | Non-editing Teacher | Teacher |
|------------|-------------------|---------|
| Create activities | ❌ | ✅ |
| Edit course content | ❌ | ✅ |
| Grade assignments | ✅ | ✅ |
| View gradebook | ✅ | ✅ |
| Enroll students | ❌ | ✅ |
| Course backup | ❌ | ✅ |

### 6. Student

**Scope**: Course level
**Purpose**: Learn dan participate dalam course activities

**Key Capabilities:**
- View course content
- Submit assignments
- Take quizzes
- Participate dalam forums
- View own grades
- Download resources
- Participate dalam group activities

**Typical Use Cases:**
- Learner
- Trainee
- Course Participant
- Enrolled User

**Important Capabilities:**
```
moodle/course:view - View course content
moodle/mod/assign:submit - Submit assignments
moodle/mod/quiz:attempt - Attempt quizzes
moodle/mod/forum:replypost - Reply in forums
moodle/grade:view - View own grades
```

<!-- TODO: Screenshot Student interface -->

**Student Experience:**
- **Course Access**: Navigate course content
- **Activity Participation**: Complete assignments dan quizzes
- **Communication**: Forum discussions, messaging
- **Progress Tracking**: View grades dan completion
- **Resource Access**: Download materials

### 7. Guest

**Scope**: System atau Course level (jika guest access enabled)
**Purpose**: Limited access untuk preview content

**Key Capabilities:**
- View course content (read-only)
- Browse public areas
- No submission capabilities
- No grade access
- Limited forum participation

**Typical Use Cases:**
- Course Preview
- Public Content Access
- Demonstration Account
- Trial Access

<!-- TODO: Screenshot Guest access -->

**Guest Limitations:**
- Cannot submit assignments
- Cannot take graded quizzes
- Cannot access gradebook
- No permanent progress tracking
- Limited forum interaction

### 8. Authenticated User

**Scope**: System level (default role)
**Purpose**: Basic privileges untuk logged-in users

**Key Capabilities:**
- Browse course catalog
- View public profiles
- Access frontpage content
- Use messaging system
- View public forums

**Automatic Assignment**: Setiap user yang login automatically mendapat role ini

<!-- TODO: Screenshot Authenticated user interface -->

## Advanced Roles dan Custom Roles

### Department-specific Roles

Banyak institusi membuat custom roles untuk kebutuhan spesifik:

#### Academic Advisor
```
Capabilities:
- View student progress across courses
- Access to completion reports
- Communication dengan students
- Limited grade viewing
```

#### Librarian
```
Capabilities:
- Access ke resource management
- Upload educational materials
- Manage digital library content
- View usage statistics
```

#### Parent/Guardian
```
Capabilities:
- View child's progress
- Access to grade reports
- Limited communication dengan teachers
- No content editing
```

<!-- TODO: Screenshot Custom role creation -->

### Creating Custom Roles

1. **Navigate ke Role Management**
   - Site administration → Users → Permissions → Define roles
   
2. **Create New Role**
   - Click "Add a new role"
   - Choose archetype (base role untuk inherit capabilities)
   - Set role name dan description

3. **Configure Capabilities**
   - Set permissions untuk each capability
   - Use inheritance atau override
   - Test dengan different contexts

4. **Assign Role**
   - Assign role ke users dalam appropriate context
   - Monitor usage dan adjust permissions

<!-- TODO: Screenshot Role creation process -->

## Role Assignment dan Management

### Manual Role Assignment

#### At System Level
1. Navigate ke **Site administration** → **Users** → **Permissions** → **Assign system roles**
2. Select role dari available roles
3. Search dan select users untuk assign
4. Click "Add" untuk assign role

<!-- TODO: Screenshot System role assignment -->

#### At Course Level
1. Go to course
2. Click **Participants** dari course navigation
3. Click **Enrol users** atau **Assign roles**
4. Select role dan search users
5. Confirm assignment

<!-- TODO: Screenshot Course role assignment -->

#### At Category Level
1. Navigate ke course category
2. Click **Assign roles** di category settings
3. Select appropriate role
4. Assign users dengan specific category permissions

### Bulk User Operations

#### CSV Upload
1. Prepare CSV file dengan user data dan role assignments
2. Navigate ke **Site administration** → **Users** → **Upload users**
3. Map CSV columns ke Moodle fields
4. Include role assignment dalam upload process

#### Cohort-based Assignment
1. Create cohorts (groups of users)
2. Assign roles ke entire cohorts
3. Use cohort enrollment untuk automatic course access

<!-- TODO: Screenshot Bulk operations -->

### Role Override dan Prohibit

#### Override
- Mengubah permission dalam specific context
- Child context inherit overrides
- Useful untuk temporary permissions

#### Prohibit
- Explicitly deny permission
- Cannot be overridden di child contexts
- Use untuk security restrictions

<!-- TODO: Screenshot Override/Prohibit interface -->

## Enrollment Methods dan Role Assignment

### Self Enrollment
- Students enroll themselves dengan enrollment key
- Automatic role assignment (usually Student)
- Course-level configuration

### Manual Enrollment
- Teachers/Managers manually enroll users
- Can assign different roles during enrollment
- Full control over who gets access

### Cohort Sync
- Automatic enrollment based pada cohort membership
- Synchronize role assignments
- Useful untuk large-scale deployments

### Database Enrollment
- External database integration
- Automatic role assignment based pada database records
- Enterprise-level user management

<!-- TODO: Screenshot Enrollment methods configuration -->

## Permission System Details

### Capability Matrix

Moodle menggunakan capability matrix untuk determine final permissions:

| Context | Inherit | Allow | Prevent | Prohibit | Final |
|---------|---------|-------|---------|----------|-------|
| System  | -       | ✅    | -       | -        | Allow |
| Course  | ✅      | -     | ❌      | -        | Prevent |
| Activity| ❌      | -     | -       | ❌       | Prohibit |

### Resolution Rules
1. **Prohibit** always wins (highest priority)
2. **Prevent** blocks inherited Allow
3. **Allow** grants permission
4. **Inherit** uses parent context permission

<!-- TODO: Screenshot Permission resolution diagram -->

### Checking Permissions

#### For Administrators
1. Navigate ke **Site administration** → **Users** → **Permissions** → **Check system permissions**
2. Select user dan context
3. Review effective permissions
4. Identify permission sources

#### Permission Reports
- User permission reports
- Role effectiveness analysis
- Capability auditing
- Context-specific permissions

<!-- TODO: Screenshot Permission checking tools -->

## Best Practices untuk Role Management

### 1. Role Design Principles

**Principle of Least Privilege**
- Grant minimum permissions necessary
- Regular review dan cleanup
- Avoid over-privileged accounts

**Role Clarity**
- Clear role names dan descriptions
- Document role purposes
- Consistent role application

**Separation of Duties**
- Different roles untuk different functions
- Avoid conflicting responsibilities
- Clear accountability

### 2. Security Considerations

**Administrator Management**
- Limit administrator accounts
- Use strong authentication
- Regular access reviews
- Activity monitoring

**Guest Access Control**
- Disable guest access if not needed
- Limit guest capabilities
- Monitor guest activities
- Secure public content

**Role Assignment Auditing**
- Regular role assignment reviews
- Remove unused assignments
- Monitor privilege escalation
- Document role changes

### 3. Organizational Alignment

**Academic Structure**
- Align roles dengan organizational hierarchy
- Clear responsibility boundaries
- Support academic workflows
- Faculty self-service capabilities

**Training dan Support**
- Role-specific training programs
- Clear documentation
- Help desk support
- User guides

### 4. Scalability Planning

**Large Institution Considerations**
- Cohort-based management
- Automated role assignment
- Delegation of administration
- Performance optimization

**Growth Management**
- Scalable role structures
- Automated processes
- Resource planning
- Performance monitoring

## Common Role Scenarios

### Scenario 1: University Implementation

**Roles Hierarchy:**
```
System Administrator (1-2 users)
├── Academic Manager (Deans)
├── Department Manager (Heads)
├── Course Creator (Senior Faculty)
├── Teacher (Faculty)
├── Teaching Assistant (Non-editing Teacher)
└── Student
```

**Custom Roles:**
- Academic Advisor
- Librarian
- External Examiner
- Parent/Guardian Access

### Scenario 2: Corporate Training

**Roles Structure:**
```
Training Administrator
├── Training Manager (Department Heads)
├── Course Developer (Course Creator)
├── Trainer (Teacher)
├── Mentor (Non-editing Teacher)
└── Employee (Student)
```

**Custom Roles:**
- HR Administrator
- Compliance Officer
- External Trainer
- Supervisor Access

### Scenario 3: Small Educational Institution

**Simplified Structure:**
```
Administrator (Principal/IT)
├── Teacher (All Faculty)
└── Student
```

**Additional Roles:**
- Parent Access (for younger students)
- Guest (for prospective students)

<!-- TODO: Screenshot Role hierarchy examples -->

## Monitoring dan Reporting

### User Activity Reports

1. **Navigate ke Reports**
   - Site administration → Reports → Logs
   - Course-specific reports
   - User activity tracking

2. **Role Effectiveness Reports**
   - Permission usage analysis
   - Role assignment history
   - Access pattern monitoring

<!-- TODO: Screenshot Activity reports -->

### Compliance Monitoring

**Data Protection Compliance**
- User consent tracking
- Data access monitoring
- Retention policy enforcement
- Privacy rights management

**Academic Integrity**
- Access pattern analysis
- Unusual activity detection
- Grade change auditing
- Content access monitoring

## Troubleshooting Common Issues

### Permission Problems

**Symptoms:**
- Users cannot access expected content
- Error messages about insufficient permissions
- Missing menu items atau functions

**Solutions:**
1. Check role assignments
2. Verify capability settings
3. Look for overrides/prohibits
4. Test dengan different contexts

### Role Assignment Issues

**Symptoms:**
- Users assigned wrong roles
- Multiple conflicting roles
- Roles not taking effect

**Solutions:**
1. Review assignment process
2. Check context hierarchy
3. Clear cache if needed
4. Verify enrollment status

### Performance Issues

**Symptoms:**
- Slow role assignment
- Long login times
- System lag dengan many roles

**Solutions:**
1. Optimize role structure
2. Use cohort-based assignment
3. Regular cleanup unused assignments
4. Database optimization

## Migration dan Import

### Role Migration Between Sites

1. **Export Role Definitions**
   - Use Moodle backup/restore
   - Custom role export tools
   - Documentation transfer

2. **Import Process**
   - Map existing roles
   - Adjust capabilities
   - Test assignments
   - Verify permissions

### User Import dengan Roles

1. **CSV Preparation**
   - Include role information
   - Map organizational structure
   - Prepare cohort assignments

2. **Import Execution**
   - Test dengan small batches
   - Verify role assignments
   - Monitor untuk errors
   - Validate permissions

<!-- TODO: Screenshot Import/Export process -->

## Kesimpulan

Effective role management adalah kunci untuk successful Moodle implementation. Key takeaways:

1. **Understanding Role System**: Pahami capabilities, contexts, dan inheritance
2. **Security First**: Apply principle of least privilege dan regular auditing
3. **Organizational Alignment**: Design roles yang match struktur institusi
4. **Documentation**: Maintain clear documentation untuk semua roles
5. **Regular Review**: Periodic review dan cleanup role assignments
6. **Training**: Provide adequate training untuk all user roles
7. **Monitoring**: Continuous monitoring untuk security dan performance

Dengan proper role management, Moodle dapat provide secure, efficient, dan user-friendly learning environment untuk semua stakeholders.

---

**Key Reminders:**
- Always test role changes di development environment first
- Document semua custom roles dan modifications
- Regular backup sebelum major role system changes
- Monitor system performance after role modifications
- Keep role structure as simple as possible while meeting needs

**Next:** [Bab 6 - Course Management →](course-management.md)