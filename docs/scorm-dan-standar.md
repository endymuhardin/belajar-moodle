# Bab 8: SCORM dan Standar E-Learning

SCORM (Sharable Content Object Reference Model) adalah standar industri untuk e-learning yang memungkinkan konten pembelajaran dapat dibagikan, digunakan kembali, dan dilacak di berbagai platform LMS. Bab ini akan membahas secara mendalam implementasi SCORM di Moodle dan standar e-learning lainnya.

## Pengenalan SCORM

### Apa itu SCORM?

**SCORM** adalah seperangkat standar teknis untuk e-learning yang dikembangkan oleh ADL (Advanced Distributed Learning). SCORM memastikan bahwa:

- Konten dapat dioperasikan di berbagai LMS
- Progress pembelajaran dapat dilacak
- Data dapat dikomunikasikan antara konten dan LMS
- Konten dapat dikemas dan didistribusikan dengan mudah

### Versi SCORM

1. **SCORM 1.1** (Versi pertama, jarang digunakan)
2. **SCORM 1.2** (Masih banyak digunakan, kompatibilitas luas)
3. **SCORM 2004** (Versi terbaru, fitur lebih lengkap)
    - 2nd Edition (2004)
    - 3rd Edition (2006)
    - 4th Edition (2009)

### Komponen SCORM

**Content Aggregation Model (CAM):**

- Manifest file (imsmanifest.xml)
- Organization structure
- Resource files
- Metadata

**Run-Time Environment (RTE):**

- API communication
- Data model
- Launch and tracking

**Sequencing and Navigation (SN):**

- Learning activities sequencing
- Navigation controls
- Rollup rules

## Implementasi SCORM di Moodle

### 1. Upload Package SCORM

**Cara Upload SCORM di Moodle:**

1. Buka course dan aktifkan **Edit mode**
2. Klik **Add an activity or resource**
3. Pilih **SCORM package**
4. Isi detail:
    - **Name**: Nama aktivitas SCORM
    - **Description**: Deskripsi konten
    - **Package**: Upload file .zip SCORM

![SCORM package upload](img/scorm/01-scorm-upload.png)

### 2. Konfigurasi SCORM

**Settings Umum:**

- **Display**: Cara menampilkan SCORM (Current window, New window, etc.)
- **Display course structure**: Menampilkan atau menyembunyikan struktur
- **Toc display**: Posisi table of contents
- **Auto-update frequency**: Frekuensi update progress

**Grade Settings:**

- **Grading method**: Cara penilaian (Learning objects, Highest grade, Average grade, etc.)
- **Maximum grade**: Nilai maksimum
- **Attempts number**: Jumlah percobaan
- **What to grade when**: Kapan penilaian dilakukan

**Availability:**

- **Available from/to**: Waktu tersedia
- **Grade category**: Kategori nilai
- **Require view**: Apakah harus dilihat untuk complete
- **Require status**: Status yang diperlukan

### 3. Tracking SCORM

**Data yang Dilacak:**

- **cmi.core.lesson_status**: Status (completed, passed, failed, etc.)
- **cmi.core.score.raw**: Nilai mentah
- **cmi.core.session_time**: Waktu sesi
- **cmi.core.exit**: Mode exit
- **cmi.objectives.n.id**: ID objektif pembelajaran
- **cmi.objectives.n.status**: Status objektif

**Progress Tracking:**

- Completion status
- Success status
- Score tracking
- Time spent
- Attempts tracking

## Standar E-Learning Lainnya

### 1. xAPI (Experience API/Tin Can)

**Apa itu xAPI:**

- Standar terbaru untuk learning tracking
- Lebih fleksibel dari SCORM
- Dapat melacak learning experiences di luar LMS
- Menggunakan format "Actor, Verb, Object, Result"

**Implementasi di Moodle:**

- Via plugins seperti "Learning Record Store"
- Mendukung mobile learning
- Dapat melacak offline activities
- Komunikasi via Learning Record Store (LRS)

### 2. AICC (Aviation Industry CBT Committee)

**Karakteristik AICC:**

- Standar lama, masih digunakan di beberapa industri
- HTTP-based communication
- File-based content structure
- Simple tracking mechanism

### 3. cmi5 (Computer Managed Instruction)

**Fitur cmi5:**

- Profil xAPI untuk e-learning
- Mendukung offline content
- Better security
- Modern web technologies
- Improved launch and tracking

### 4. LTI (Learning Tools Interoperability)

**Apa itu LTI:**

- Standar untuk integrasi eksternal tools
- OAuth-based authentication
- Secure communication
- Deep linking capabilities

**Implementasi di Moodle:**

- External tool activities
- Grade passback
- User provisioning
- Content integration

## Best Practices SCORM Development

### 1. Authoring Tools untuk SCORM

**Professional Tools:**

- **Articulate Storyline 360**: Tool komprehensif dengan SCORM support
- **Adobe Captivate**: Tool powerful untuk interactive content
- **iSpring Suite**: PowerPoint-based authoring
- **Lectora Inspire**: Tool dengan responsive design

**Open Source/Free Tools:**

- **H5P**: Interactive content dengan SCORM export
- **Adapt Learning**: Framework untuk responsive content
- **Raptivity**: Interactive elements builder
- **EasyGenerator**: Simple authoring tool

### 2. Design Principles untuk SCORM

**Content Structure:**

- Modular design
- Consistent navigation
- Clear learning objectives
- Appropriate chunking

**Technical Considerations:**

- File size optimization
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility compliance

**Tracking Strategy:**

- Meaningful completion criteria
- Appropriate scoring
- Progress checkpoints
- Time tracking

### 3. Common Issues dan Solusi

**Upload Issues:**

- **Problem**: Package tidak terupload
- **Solution**: Check file size, compression, dan manifest validity

**Tracking Issues:**

- **Problem**: Progress tidak tersimpan
- **Solution**: Check API communication, browser settings

**Display Issues:**

- **Problem**: Layout tidak responsive
- **Solution**: Test di berbagai devices dan browsers

**Security Issues:**

- **Problem**: Content tidak secure
- **Solution**: HTTPS, proper authentication

## Advanced SCORM Features

### 1. Sequencing and Navigation

**Sequencing Rules:**

- Pre-requisites
- Flow control
- Conditional branching
- Adaptive learning paths

**Navigation Controls:**

- Table of contents
- Previous/Next buttons
- Menu navigation
- Search functionality

### 2. Interactions and Assessment

**Question Types:**

- Multiple choice
- True/false
- Fill-in-the-blank
- Drag and drop
- Hotspot
- Essay

**Feedback Mechanisms:**

- Immediate feedback
- Branching feedback
- Remediation content
- Adaptive difficulty

### 3. Media and Multimedia

**Video Integration:**

- Embedded video
- Streaming video
- Interactive video
- Video assessments

**Audio Integration:**

- Narration
- Sound effects
- Audio descriptions
- Podcast integration

## Testing dan Quality Assurance

### 1. SCORM Testing Tools

**Testing Tools:**

- **SCORM Cloud**: Cloud-based testing platform
- **ADL Test Suite**: Official testing tools
- **Rustici Engine**: SCORM engine testing
- **Moodle Debug Mode**: Built-in testing

**Test Scenarios:**

- Package upload test
- Content display test
- Tracking test
- Cross-platform test

### 2. Compliance Testing

**SCORM Conformance:**

- Manifest validation
- API communication test
- Data model compliance
- Sequencing test

**Accessibility Testing:**

- Screen reader compatibility
- Keyboard navigation
- Color contrast
- Alternative text

## Analytics dan Reporting

### 1. SCORM Analytics di Moodle

**Available Data:**

- Completion rates
- Time spent per module
- Score distributions
- Attempt patterns
- Drop-off points

**Reports:**

- Individual progress reports
- Course completion reports
- Performance analytics
- Engagement metrics

### 2. Advanced Analytics

**Custom Tracking:**

- Custom JavaScript tracking
- External analytics integration
- Real-time monitoring
- Predictive analytics

## Integration dengan Sistem Lain

### 1. HRIS Integration

**Integration Points:**

- User synchronization
- Course assignments
- Completion reporting
- Certification management

### 2. Content Management Systems

**CMS Integration:**

- WordPress integration
- Drupal integration
- Custom CMS solutions
- Headless CMS

### 3. Mobile Learning

**Mobile Considerations:**

- Responsive design
- Offline capabilities
- Mobile app integration
- Push notifications

## Case Studies

### 1. Corporate Training Implementation

**Scenario:** Perusahaan multinasional dengan 10,000+ karyawan

**Challenge:** Standardisasi training lintas negara

**Solution:**

- SCORM-based compliance training
- Multi-language support
- Centralized tracking
- Automated certification

**Results:**

- 90% completion rate
- 60% reduction in training costs
- Consistent quality across regions

### 2. Educational Institution Implementation

**Scenario:** Universitas dengan program blended learning

**Challenge:** Integrasi konten dari berbagai publisher

**Solution:**

- SCORM package standardization
- Custom authoring tools
- Learning analytics dashboard
- Mobile compatibility

**Results:**

- Improved student engagement
- Better learning outcomes
- Reduced instructor workload

## Future Trends

### 1. Emerging Technologies

**AI and ML Integration:**

- Adaptive learning paths
- Personalized content
- Predictive analytics
- Automated content generation

**VR/AR Integration:**

- Immersive learning experiences
- Virtual simulations
- Augmented reality overlays
- 3D learning environments

### 2. Next Generation Standards

**xAPI Evolution:**

- Enhanced tracking capabilities
- IoT integration
- Blockchain-based credentials
- Cross-platform compatibility

## Kesimpulan

SCORM dan standar e-learning lainnya memainkan peran penting dalam ekosistem pembelajaran digital. Memahami implementasi SCORM di Moodle, best practices development, dan tren masa depan akan membantu Anda membuat solusi e-learning yang robust, scalable, dan efektif.

Dengan mengikuti panduan ini, Anda dapat mengimplementasikan SCORM dengan sukses, mengatasi tantangan umum, dan memanfaatkan kekuatan standar e-learning untuk menciptakan pengalaman pembelajaran yang superior.

---

**Berikutnya:** [Bab 9 - Learning Progress Tracking →](learning-progress-tracking.md)

**Sebelumnya:** [Bab 7 - Courseware Authoring →](courseware-authoring.md)