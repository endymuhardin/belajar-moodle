# Bab 12: Backup dan Restore

Backup dan restore adalah operasi krusial dalam manajemen Moodle untuk memastikan keamanan data dan business continuity. Bab ini akan membahas strategi backup, prosedur restore, dan best practices untuk manajemen data di lingkungan Moodle.

## Pengenalan Backup dan Restore

### Mengapa Backup Penting?

**Data Protection:**

- **Course content**: Konten pembelajaran yang berharga
- **User data**: Data pengguna dan progress
- **Assessment data**: Hasil penilaian dan grade
- **System configuration**: Konfigurasi sistem

**Business Continuity:**

- **Disaster recovery**: Pemulihan setelah bencana
- **System migration**: Migrasi sistem
- **Compliance requirements**: Kepatuhan regulasi
- **Historical data**: Data historis untuk analisis

### Jenis-jenis Backup di Moodle

**1. Complete Backup:**

- Seluruh sistem Moodle
- Database dan file
- Konfigurasi lengkap

**2. Course Backup:**

- Individual course data
- User enrollments
- Grade book data
- Activities dan resources

**3. Automated Backup:**

- Scheduled backups
- Incremental backups
- Cloud storage integration

## Backup Strategy

### 1. Backup Planning

**Backup Schedule:**

- **Daily backups**: Database penting
- **Weekly backups**: Course data
- **Monthly backups**: Complete system
- **On-demand backups**: Sebelum perubahan besar

**Retention Policy:**

- **Daily**: Retain 7-30 days
- **Weekly**: Retain 4-12 weeks
- **Monthly**: Retain 6-12 months
- **Yearly**: Retain 3-7 years

**Storage Strategy:**

- **Local storage**: Quick access
- **Off-site storage**: Disaster recovery
- **Cloud storage**: Scalability
- **Multiple copies**: Redundancy

### 2. Backup Methods

**Moodle Native Backup:**

1. **Course Backup via Interface:**
    - Buka course
    - Administration → Backup
    - Pilih item untuk dibackup
    - Atur schedule dan retention

2. **Command Line Backup:**
```bash
# Backup individual course
php admin/cli/backup.php --courseid=[COURSE_ID] --destination=/path/to/backup

# Backup all courses
php admin/cli/backup.php --allcourses --destination=/path/to/backup
```

**Database Backup:**

```bash
# MySQL/MariaDB backup
mysqldump -u [USERNAME] -p [DATABASE] > moodle_backup_$(date +%Y%m%d).sql

# Compressed backup
mysqldump -u [USERNAME] -p [DATABASE] | gzip > moodle_backup_$(date +%Y%m%d).sql.gz
```

**File System Backup:**

```bash
# Backup Moodle data directory
tar -czf moodledata_backup_$(date +%Y%m%d).tar.gz /path/to/moodledata

# Backup Moodle installation
tar -czf moodle_install_backup_$(date +%Y%m%d).tar.gz /path/to/moodle
```

### 3. Docker Environment Backup

**Docker Volume Backup:**

```bash
# Backup Docker volumes
docker run --rm -v moodle_mariadb_data:/volume -v $(pwd):/backup alpine tar cvf /backup/mariadb_backup.tar volume

docker run --rm -v moodle_moodle_data:/volume -v $(pwd):/backup alpine tar cvf /backup/moodle_backup.tar volume

docker run --rm -v moodle_moodledata_data:/volume -v $(pwd):/backup alpine tar cvf /backup/moodledata_backup.tar volume
```

**Docker Compose Backup Script:**

```bash
#!/bin/bash
# backup-moodle.sh

BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DOCKER_COMPOSE="/path/to/docker-compose.yml"

# Create backup directory
mkdir -p $BACKUP_DIR/$DATE

# Stop containers
docker-compose -f $DOCKER_COMPOSE stop

# Backup volumes
docker run --rm -v moodle_mariadb_data:/volume -v $BACKUP_DIR/$DATE:/backup alpine tar cvf /backup/mariadb_backup.tar volume
docker run --rm -v moodle_moodle_data:/volume -v $BACKUP_DIR/$DATE:/backup alpine tar cvf /backup/moodle_backup.tar volume
docker run --rm -v moodle_moodledata_data:/volume -v $BACKUP_DIR/$DATE:/backup alpine tar cvf /backup/moodledata_backup.tar volume

# Backup configuration files
cp $DOCKER_COMPOSE $BACKUP_DIR/$DATE/
cp .env $BACKUP_DIR/$DATE/  # if exists

# Start containers
docker-compose -f $DOCKER_COMPOSE start

# Compress backup
tar -czf $BACKUP_DIR/moodle_backup_$DATE.tar.gz $BACKUP_DIR/$DATE/
rm -rf $BACKUP_DIR/$DATE

echo "Backup completed: $BACKUP_DIR/moodle_backup_$DATE.tar.gz"
```

## Restore Procedures

### 1. System Restore

**Emergency Restore Steps:**

1. **Assess the Situation:**
    - Identify what needs to be restored
    - Determine the cause of failure
    - Choose appropriate backup version

2. **Prepare Environment:**
    - Stop all services
    - Create temporary workspace
    - Verify backup integrity

3. **Restore Database:**
```bash
# Restore from SQL backup
mysql -u [USERNAME] -p [DATABASE] < moodle_backup_20240101.sql

# Restore from compressed backup
gunzip < moodle_backup_20240101.sql.gz | mysql -u [USERNAME] -p [DATABASE]
```

4. **Restore Files:**
```bash
# Restore Moodle installation
tar -xzf moodle_install_backup_20240101.tar.gz -C /path/to/

# Restore Moodle data
tar -xzf moodledata_backup_20240101.tar.gz -C /path/to/moodledata
```

5. **Update Configuration:**
    - Review config.php settings
    - Update database credentials
    - Verify file permissions

### 2. Course Restore

**Individual Course Restore:**

1. **Via Moodle Interface:**
    - Navigation: Site administration → Courses → Restore course
    - Upload backup file
    - Select restore options
    - Map users and settings

2. **Command Line Restore:**
```bash
# Restore course from backup
php admin/cli/restore.php --backupfile=/path/to/backup.mbz --courseid=[NEW_COURSE_ID]
```

**Course Restore Options:**

- **Course content**: Include all course materials
- **Users**: Include user accounts and enrollments
- **Gradebook**: Include grade data
- **Activities**: Include all activities and submissions
- **Files**: Include uploaded files

### 3. Disaster Recovery

**Disaster Recovery Plan:**

1. **Immediate Actions:**
    - Declare disaster situation
    - Activate disaster recovery team
    - Communicate with stakeholders

2. **Recovery Process:**
    - Restore from latest verified backup
    - Validate system functionality
    - Test critical features

3. **Post-Recovery:**
    - Conduct post-mortem analysis
    - Update disaster recovery procedures
    - Implement preventive measures

## Automation and Monitoring

### 1. Automated Backup Scripts

**Comprehensive Backup Script:**

```bash
#!/bin/bash
# moodle-backup.sh

# Configuration
MOODLE_DIR="/var/www/moodle"
DATA_DIR="/var/www/moodledata"
BACKUP_DIR="/backups/moodle"
DB_NAME="moodle"
DB_USER="moodle_user"
RETENTION_DAYS=30

# Create timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/$TIMESTAMP"

# Create backup directory
mkdir -p $BACKUP_PATH

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $BACKUP_DIR/backup.log
}

log "Starting backup process"

# Database backup
log "Backing up database"
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_PATH/database.sql.gz
if [ $? -eq 0 ]; then
    log "Database backup successful"
else
    log "Database backup failed"
    exit 1
fi

# Moodle files backup
log "Backing up Moodle installation"
tar -czf $BACKUP_PATH/moodle_files.tar.gz $MOODLE_DIR
if [ $? -eq 0 ]; then
    log "Moodle files backup successful"
else
    log "Moodle files backup failed"
fi

# Moodle data backup
log "Backing up Moodle data"
tar -czf $BACKUP_PATH/moodle_data.tar.gz $DATA_DIR
if [ $? -eq 0 ]; then
    log "Moodle data backup successful"
else
    log "Moodle data backup failed"
fi

# Configuration backup
log "Backing up configuration"
cp $MOODLE_DIR/config.php $BACKUP_PATH/
cp /etc/nginx/sites-available/moodle $BACKUP_PATH/  # if using nginx

# Verify backup
log "Verifying backup"
if [ -f "$BACKUP_PATH/database.sql.gz" ] && [ -f "$BACKUP_PATH/moodle_files.tar.gz" ] && [ -F "$BACKUP_PATH/moodle_data.tar.gz" ]; then
    log "Backup verification successful"

    # Compress backup
    cd $BACKUP_DIR
    tar -czf moodle_backup_$TIMESTAMP.tar.gz $TIMESTAMP/
    rm -rf $TIMESTAMP

    log "Backup completed successfully: moodle_backup_$TIMESTAMP.tar.gz"
else
    log "Backup verification failed"
    exit 1
fi

# Clean old backups
log "Cleaning backups older than $RETENTION_DAYS days"
find $BACKUP_DIR -name "moodle_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

log "Backup process completed"
```

### 2. Scheduling Backups

**Cron Jobs Setup:**

```bash
# Daily backup at 2 AM
0 2 * * * /path/to/moodle-backup.sh

# Weekly full backup on Sunday at 3 AM
0 3 * * 0 /path/to/moodle-full-backup.sh

# Monthly backup on 1st at 4 AM
0 4 1 * * /path/to/moodle-monthly-backup.sh
```

**Systemd Timer Setup:**

```ini
# /etc/systemd/system/moodle-backup.timer
[Unit]
Description=Daily Moodle backup
Requires=moodle-backup.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

### 3. Monitoring and Alerts

**Backup Monitoring Script:**

```bash
#!/bin/bash
# monitor-backups.sh

BACKUP_DIR="/backups/moodle"
ALERT_EMAIL="admin@example.com"
MAX_AGE_HOURS=26  # Slightly more than daily

# Check for recent backups
RECENT_BACKUP=$(find $BACKUP_DIR -name "moodle_backup_*.tar.gz" -mtime -1 | wc -l)

if [ $RECENT_BACKUP -eq 0 ]; then
    # Send alert
    echo "ALERT: No recent Moodle backup found!" | mail -s "Moodle Backup Alert" $ALERT_EMAIL

    # Log the issue
    logger -t moodle-backup "ALERT: No recent backup found"

    exit 1
fi

# Check backup file sizes and integrity
for backup in $(find $BACKUP_DIR -name "moodle_backup_*.tar.gz" -mtime -7); do
    # Check file size
    size=$(stat -c%s "$backup")
    if [ $size -lt 10485760 ]; then  # Less than 10MB
        echo "WARNING: Small backup file detected: $backup" | mail -s "Moodle Backup Warning" $ALERT_EMAIL
        logger -t moodle-backup "WARNING: Small backup file: $backup"
    fi

    # Test archive integrity
    if ! tar -tzf "$backup" > /dev/null 2>&1; then
        echo "ERROR: Corrupted backup file: $backup" | mail -s "Moodle Backup Error" $ALERT_EMAIL
        logger -t moodle-backup "ERROR: Corrupted backup: $backup"
    fi
done

echo "Backup monitoring completed successfully"
```

## Best Practices

### 1. Security Considerations

**Data Encryption:**

- Encrypt backup files at rest
- Use secure transfer protocols
- Implement access controls
- Regular security audits

**Access Control:**

- Role-based access to backups
- Secure storage locations
- Audit trail for backup access
- Regular access reviews

**Network Security:**

- Secure backup network traffic
- Isolate backup storage
- Monitor backup transfers
- Implement firewalls

### 2. Performance Optimization

**Backup Performance:**

- Use incremental backups
- Optimize backup schedules
- Utilize compression
- Parallel processing

**Storage Optimization:**

- Implement deduplication
- Use efficient compression
- Optimize storage hierarchy
- Regular cleanup

**Network Optimization:**

- Schedule off-peak backups
- Use bandwidth throttling
- Implement delta transfers
- Optimize transfer protocols

### 3. Documentation and Training

**Documentation Requirements:**

- Backup procedures
- Restore procedures
- Disaster recovery plan
- Contact information

**Training Requirements:**

- Regular training sessions
- Hands-on practice
- Update training materials
- Certification programs

## Troubleshooting

### 1. Common Backup Issues

**Failed Backups:**

- **Symptom**: Backup process fails
- **Cause**: Insufficient space, permissions, network issues
- **Solution**: Check logs, free space, verify permissions

**Corrupted Backups:**

- **Symptom**: Backup files cannot be restored
- **Cause**: Incomplete transfers, storage issues
- **Solution**: Verify integrity, create new backup

**Large Backup Sizes:**

- **Symptom**: Backup files too large
- **Cause**: Accumulated data, unnecessary files
- **Solution**: Clean up, implement incremental backups

### 2. Common Restore Issues

**Database Connection Errors:**

- **Symptom**: Cannot connect to database
- **Cause**: Wrong credentials, database not running
- **Solution**: Verify credentials, start database

**File Permission Issues:**

- **Symptom**: Permission denied errors
- **Cause**: Wrong file ownership, permissions
- **Solution**: Set correct permissions, ownership

**Configuration Mismatch:**

- **Symptom**: System not working after restore
- **Cause**: Different environment, missing settings
- **Solution**: Update configuration, verify settings

## Advanced Topics

### 1. High Availability Setup

**Load Balancing:**

- Multiple application servers
- Database clustering
- File synchronization
- Session management

**Failover Systems:**

- Active-passive setup
- Heartbeat monitoring
- Automatic failover
- Data replication

### 2. Cloud Integration

**Cloud Storage Options:**

- AWS S3 integration
- Azure Blob Storage
- Google Cloud Storage
- Multi-cloud strategies

**Cloud Backup Services:**

- Backup as a Service (BaaS)
- Disaster Recovery as a Service (DRaaS)
- Hybrid cloud solutions
- Cost optimization

### 3. Compliance and Legal

**Compliance Requirements:**

- GDPR compliance
- Data protection regulations
- Industry standards
- Audit requirements

**Legal Considerations:**

- Data retention policies
- Privacy requirements
- Cross-border data transfer
- Legal holds

## Kesimpulan

Backup dan restore adalah komponen krusial dalam manajemen Moodle yang tidak boleh diabaikan. Dengan implementasi strategi backup yang tepat, prosedur restore yang terencana, dan monitoring yang berkelanjutan, Anda dapat:

- Melindungi data berharga
- Memastikan business continuity
- Memenuhi compliance requirements
- Mengurangi downtime
- Meningkatkan kepercayaan pengguna

Dengan mengikuti best practices yang dijelaskan dalam bab ini, Anda dapat membuat sistem backup dan restore yang robust, reliable, dan scalable untuk lingkungan Moodle Anda.

---

**Berikutnya:** [Bab 13 - Troubleshooting →](troubleshooting.md)

**Sebelumnya:** [Bab 11 - Advanced Courseware Development →](advanced-courseware.md)