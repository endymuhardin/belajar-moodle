# Bab 13: Troubleshooting

Troubleshooting adalah keterampilan penting dalam manajemen Moodle untuk mengidentifikasi, mendiagnosis, dan menyelesaikan masalah yang muncul. Bab ini akan membahas masalah umum, solusi praktis, dan pendekatan sistematis untuk troubleshooting di lingkungan Moodle.

## Pengenalan Troubleshooting

### Pendekatan Troubleshooting

**Scientific Method:**
1. **Identify the Problem**: Identifikasi masalah dengan jelas
2. **Gather Information**: Kumpulkan informasi relevan
3. **Formulate Hypothesis**: Buat hipotesis penyebab
4. **Test Hypothesis**: Uji hipotesis
5. **Implement Solution**: Implementasikan solusi
6. **Verify Resolution**: Verifikasi penyelesaian
7. **Document**: Dokumentasikan proses

### Types of Issues

**Technical Issues:**

- Server performance
- Database connectivity
- File permissions
- Network problems

**Functional Issues:**

- Feature not working
- Configuration errors
- Integration problems
- User interface issues

**Performance Issues:**

- Slow page loads
- High resource usage
- Scalability problems
- Optimization needs

## Masalah Umum dan Solusi

### 1. Installation and Setup Issues

#### Masalah: Moodle Tidak Terinstall

**Symptoms:**

- White screen after installation
- Database connection errors
- Permission denied errors
- Missing requirements

**Solutions:**

```bash
# Check PHP requirements
php -v
php -m | grep -i "pdo\|gd\|xml\|intl\|curl"

# Check database connection
mysql -h localhost -u moodleuser -p

# Check file permissions
ls -la /var/www/moodle/
chown -R www-data:www-data /var/www/moodle/
chmod -R 755 /var/www/moodle/

# Check PHP error log
tail -f /var/log/php/error.log
```

#### Masalah: Docker Environment Issues

**Symptoms:**

- Containers not starting
- Port conflicts
- Volume mount issues
- Network connectivity problems

**Solutions:**

```bash
# Check Docker status
docker ps
docker compose ps

# Check container logs
docker compose logs moodle
docker compose logs mariadb

# Restart containers
docker compose down
docker compose up -d

# Check port availability
netstat -tulpn | grep :80
netstat -tulpn | grep :443

# Check volume permissions
ls -la volumes/
chmod -R 777 volumes/
```

### 2. Performance Issues

#### Masalah: Slow Page Loading

**Symptoms:**

- Pages take long to load
- High server load
- Database queries slow
- Memory usage high

**Solutions:**

```bash
# Check server resources
top
htop
free -h
df -h

# Check MySQL performance
mysql -u root -p -e "SHOW PROCESSLIST;"
mysql -u root -p -e "SHOW STATUS LIKE 'Slow_queries';"

# Enable Moodle debugging
nano config.php
// Add these lines:
$CFG->debug = DEBUG_DEVELOPER;
$CFG->debugdisplay = 1;

# Clear Moodle cache
php admin/cli/purge_caches.php

# Optimize database
php admin/cli/mysql.php --engine=InnoDB
```

#### Masalah: High Resource Usage

**Symptoms:**

- Server becoming unresponsive
- Memory exhaustion
- High CPU usage
- Disk space issues

**Solutions:**

```bash
# Check memory usage
free -h
cat /proc/meminfo

# Check CPU usage
top -c
htop

# Check disk usage
df -h
du -sh /var/www/moodledata/

# Check large files
find /var/www/moodledata -type f -size +100M

# Clear temporary files
rm -rf /var/www/moodledata/temp/
rm -rf /var/www/moodledata/cache/
```

### 3. User and Authentication Issues

#### Masalah: Login Problems

**Symptoms:**

- Cannot login with valid credentials
- Password reset not working
- Session timeout issues
- Authentication plugin errors

**Solutions:**

```bash
# Check user database
mysql -u root -p -e "SELECT username, email FROM mdl_user WHERE username='admin';"

# Reset admin password
php admin/cli/reset_password.php

# Check authentication settings
mysql -u root -p -e "SELECT * FROM mdl_config WHERE name LIKE 'auth%';"

# Clear user sessions
TRUNCATE TABLE mdl_sessions;
TRUNCATE TABLE mdl_sessions2;

# Check authentication plugin status
mysql -u root -p -e "SELECT * FROM mdl_config_plugins WHERE plugin='manual';"
```

#### Masalah: Permission Issues

**Symptoms:**

- Access denied errors
- Cannot upload files
- Cannot create courses
- Role assignment problems

**Solutions:**

```bash
# Check file permissions
ls -la /var/www/moodle/
ls -la /var/www/moodledata/

# Fix permissions
chown -R www-data:www-data /var/www/moodle/
chown -R www-data:www-data /var/www/moodledata/
chmod -R 755 /var/www/moodle/
chmod -R 777 /var/www/moodledata/

# Check Moodle config.php permissions
chmod 644 /var/www/moodle/config.php

# Check directory ownership
chown www-data:www-data /var/www/moodle/moodledata/
```

### 4. Database Issues

#### Masalah: Database Connection Errors

**Symptoms:**

- Database connection failed
- Too many connections
- Database server not responding
- Query timeout errors

**Solutions:**

```bash
# Check MySQL status
systemctl status mysql
mysql -u root -p -e "SHOW STATUS;"

# Check MySQL configuration
nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Increase max connections
[mysqld]
max_connections = 500

# Check database size
mysql -u root -p -e "SELECT table_schema AS 'Database',
ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.TABLES
GROUP BY table_schema;"

# Optimize tables
mysqlcheck -u root -p --optimize --all-databases
```

#### Masalah: Database Corruption

**Symptoms:**

- Tables marked as crashed
- Data inconsistency
- Query errors
- Performance degradation

**Solutions:**

```bash
# Check table status
mysql -u root -p -e "CHECK TABLE mdl_user;"

# Repair tables
mysql -u root -p -e "REPAIR TABLE mdl_user;"

# Backup before major repairs
mysqldump -u root -p moodle > moodle_backup_before_repair.sql

# Check all Moodle tables
mysql -u root -p moodle -e "CHECK TABLE mdl%;"

# Repair all tables if needed
mysql -u root -p moodle -e "REPAIR TABLE mdl%;"
```

### 5. File and Upload Issues

#### Masalah: Cannot Upload Files

**Symptoms:**

- Upload fails
- File size limit reached
- File type not allowed
- Permission denied errors

**Solutions:**

```bash
# Check PHP upload settings
php -i | grep -i "upload_max_filesize\|post_max_size"

# Check Moodle file settings
mysql -u root -p -e "SELECT * FROM mdl_config WHERE name LIKE '%maxbytes%' OR name LIKE '%upload%';"

# Check disk space
df -h
du -sh /var/www/moodledata/

# Check file permissions
ls -la /var/www/moodledata/temp/
ls -la /var/www/moodledata/filedir/

# Fix permissions
chmod 777 /var/www/moodledata/temp/
chmod 755 /var/www/moodledata/filedir/
chown www-data:www-data /var/www/moodledata/temp/
chown www-data:www-data /var/www/moodledata/filedir/
```

#### Masalah: Missing Files

**Symptoms:**

- Images not showing
- Files cannot be downloaded
- Broken links
- 404 errors

**Solutions:**

```bash
# Check if files exist in filedir
find /var/www/moodledata/filedir/ -name "*.jpg" | head -10
find /var/www/moodledata/filedir/ -name "*.pdf" | head -10

# Check file integrity
php admin/cli/check_files.php

# Rebuild file paths
php admin/cli/maintenance.php --buildfilepaths

# Check database file records
mysql -u root -p -e "SELECT COUNT(*) FROM mdl_files WHERE filesize > 0;"
mysql -u root -p -e "SELECT COUNT(*) FROM mdl_files WHERE filename <> '.';"
```

## Advanced Troubleshooting

### 1. Debug Mode Setup

**Enable Debug Mode:**

```php
// In config.php
$CFG->debug = DEBUG_DEVELOPER;      // Show all errors
$CFG->debugdisplay = 1;             // Display errors
$CFG->debugsmtp = 1;                // Show SMTP debug info
$CFG->perfdebug = 15;               // Performance debugging
$CFG->debugvalidators = 1;          // HTML validation
```

**Debug Levels:**

- `DEBUG_MINIMAL`: Show fatal errors only
- `DEBUG_NORMAL`: Show errors, warnings, and notices
- `DEBUG_ALL`: Show all reasonable debugging information
- `DEBUG_DEVELOPER`: Show everything including development info

### 2. Log Analysis

**Moodle Log Files:**

```bash
# Check Moodle logs
tail -f /var/log/moodle/error.log
tail -f /var/log/moodle/debug.log

# Check specific user activity
grep "username" /var/log/moodle/error.log

# Check recent errors
find /var/log/moodle/ -name "*.log" -mtime -7 -exec tail -f {} \;
```

**Server Log Files:**

```bash
# Apache/Nginx logs
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log

# PHP error log
tail -f /var/log/php/error.log

# MySQL logs
tail -f /var/log/mysql/error.log
tail -f /var/log/mysql/slow.log

# System logs
tail -f /var/log/syslog
tail -f /var/log/messages
```

### 3. Performance Monitoring

**Monitoring Commands:**

```bash
# Real-time monitoring
htop
iotop
iftop
nethogs

# Moodle-specific monitoring
php admin/cli/maintenance.php --status
php admin/cli/check_database_schema.php

# Database monitoring
mysqladmin processlist
mysqladmin extended-status
```

**Performance Testing:**

```bash
# Apache benchmark
ab -n 100 -c 10 http://your-moodle-site.com/

# Siege testing
siege -c 50 -t 1M http://your-moodle-site.com/

# Load testing with JMeter
# Create JMeter test plan and run
```

## Prevention and Maintenance

### 1. Regular Maintenance Tasks

**Daily Tasks:**
```bash
# Check logs
tail -n 100 /var/log/moodle/error.log

# Check disk space
df -h

# Check process status
systemctl status apache2 mysql
```

**Weekly Tasks:**
```bash
# Clear cache
php admin/cli/purge_caches.php

# Check database size
mysql -u root -p -e "SELECT table_schema, ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'DB Size in MB' FROM information_schema.TABLES GROUP BY table_schema;"

# Backup verification
# Check backup files exist and are not corrupted
```

**Monthly Tasks:**
```bash
# System update
apt update && apt upgrade -y

# Security audit
# Check for security updates and vulnerabilities

# Performance review
# Analyze performance metrics and optimize
```

### 2. Monitoring Setup

**System Monitoring:**
```bash
# Install monitoring tools
apt install htop iotop iftop nethogs

# Set up log rotation
nano /etc/logrotate.d/moodle

# Configure monitoring alerts
# Set up email alerts for critical issues
```

**Moodle-Specific Monitoring:**
```bash
# Moodle health check
php admin/cli/check_database_schema.php
php admin/cli/maintenance.php --status

# Course statistics
php admin/cli/course_stats.php
```

### 3. Documentation and Procedures

**Troubleshooting Checklist:**

- Issue identification
- Information gathering
- Hypothesis testing
- Solution implementation
- Verification
- Documentation

**Escalation Procedures:**

- Define when to escalate
- Identify escalation points
- Establish communication channels
- Document resolution processes

## Emergency Procedures

### 1. System Failure Response

**Immediate Actions:**
1. **Assess the situation**: Determine scope and impact
2. **Communicate**: Notify stakeholders
3. **Isolate**: Prevent further damage
4. **Restore**: Apply backup procedures
5. **Verify**: Confirm system functionality

**Communication Plan:**

- **Internal**: IT team, management
- **External**: Users, vendors, stakeholders
- **Methods**: Email, phone, chat, announcements

### 2. Security Incident Response

**Security Incident Steps:**
1. **Identify**: Detect security breach
2. **Contain**: Isolate affected systems
3. **Eradicate**: Remove threat
4. **Recover**: Restore systems
5. **Learn**: Document and improve

**Common Security Issues:**

- Brute force attacks
- SQL injection attempts
- File inclusion vulnerabilities
- Cross-site scripting (XSS)

## Resources and Support

### 1. Official Resources

**Moodle Documentation:**

- [Moodle Docs](https://docs.moodle.org)
- [Moodle Forums](https://moodle.org)
- [Moodle Tracker](https://tracker.moodle.org)
- [Moodle Community](https://moodle.net)

**Technical Documentation:**

- Installation guides
- Configuration documentation
- Security advisories
- Release notes

### 2. Community Support

**Moodle Community:**

- Official forums
- Stack Overflow
- Reddit communities
- LinkedIn groups

**Professional Support:**

- Moodle Partners
- Certified service providers
- Independent consultants
- Development agencies

### 3. Tools and Utilities

**Diagnostic Tools:**

- Moodle CLI tools
- Database management tools
- Performance monitoring tools
- Security scanning tools

**Utilities:**

- File management tools
- Log analysis tools
- Network monitoring tools
- System administration tools

## Kesimpulan

Troubleshooting adalah keterampilan esensial dalam manajemen Moodle. Dengan pendekatan sistematis, tools yang tepat, dan dokumentasi yang baik, Anda dapat:

- Mengidentifikasi masalah dengan cepat
- Mendiagnosis penyebab akar
- Implementasikan solusi efektif
- Mencegah masalah berulang
- Meningkatkan system reliability
- Memberikan pengalaman pengguna yang lebih baik

Dengan mengikuti best practices dan procedures yang dijelaskan dalam bab ini, Anda dapat menjadi troubleshooter yang efektif dan handal untuk lingkungan Moodle Anda.

---

**Sebelumnya:** [Bab 12 - Backup dan Restore →](backup-restore.md)

**Appendix:** [Referensi dan Dokumentasi →](referensi.md)