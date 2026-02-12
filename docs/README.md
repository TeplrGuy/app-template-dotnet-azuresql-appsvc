# Contoso University - Documentation Index

## Database Documentation

### 📘 [Database Schema Documentation](./DATABASE_SCHEMA.md)
**Comprehensive guide to the Contoso University database schema**

This document provides detailed information about:
- Complete entity relationship diagram
- Detailed table structures with all columns and constraints
- Entity Framework Core model configuration
- Data annotations and validation rules
- Database initialization and seeding process
- Common query examples
- Performance considerations
- Extension recommendations

**Best for**: New developers, architects, and anyone needing complete schema understanding

---

### ⚡ [Database Quick Reference Guide](./DATABASE_QUICK_REFERENCE.md)
**Fast lookup guide for developers**

This document provides:
- Table summary at a glance
- Key fields reference for all entities
- Common code snippets for CRUD operations
- Validation rules summary
- Troubleshooting guide
- Performance tips
- Testing queries

**Best for**: Daily development work, quick lookups, and troubleshooting

---

### 📊 [Database Diagrams](./DATABASE_DIAGRAMS.md)
**Visual representations of the database schema**

This document includes:
- Entity relationship diagrams (ERD)
- Database schema overview
- Table relationships flow diagrams
- Detailed class diagrams with constraints
- Data flow during initialization
- Query performance considerations
- Foreign key constraint diagrams
- Data access patterns

**Best for**: Visual learners, presentations, and architectural discussions

---

## SRE Documentation

### 🔧 [SRE Knowledge Base](./SRE-KNOWLEDGE-BASE.md)
**Site Reliability Engineering best practices and runbooks**

Contains operational procedures, monitoring guidelines, and troubleshooting steps for production support.

---

## Quick Navigation

### For New Team Members
1. Start with [Database Schema Documentation](./DATABASE_SCHEMA.md) for comprehensive overview
2. Review [Database Diagrams](./DATABASE_DIAGRAMS.md) for visual understanding
3. Bookmark [Quick Reference Guide](./DATABASE_QUICK_REFERENCE.md) for daily use

### For Database Changes
1. Review [Database Schema Documentation](./DATABASE_SCHEMA.md) to understand current structure
2. Follow Entity Framework Core best practices
3. Consider migration strategy (currently using EnsureCreated, should move to Migrations)
4. Update all three database documents when making schema changes

### For Performance Issues
1. Check [Quick Reference Guide - Performance Tips](./DATABASE_QUICK_REFERENCE.md#performance-tips)
2. Review [Database Diagrams - Query Performance](./DATABASE_DIAGRAMS.md#query-performance-considerations)
3. Consult [SRE Knowledge Base](./SRE-KNOWLEDGE-BASE.md) for operational insights

### For Troubleshooting
1. Start with [Quick Reference Guide - Troubleshooting](./DATABASE_QUICK_REFERENCE.md#troubleshooting)
2. Review [Database Schema - Common Queries](./DATABASE_SCHEMA.md#common-queries)
3. Check [SRE Knowledge Base](./SRE-KNOWLEDGE-BASE.md) for known issues

---

## Database Schema at a Glance

```
├── tbl_Instructor (1,000 records)
│   └── administers → tbl_Department (4 records)
│       └── offers → tbl_Course (6 records)
│           └── enrolls via → tbl_StudentCourse (10,000 records)
│               └── enrolled by → tbl_Student (10,000 records)
```

### Core Entities
- **Student**: Students enrolled in the university
- **Course**: Courses offered by departments  
- **Instructor**: Faculty members
- **Department**: Academic departments
- **StudentCourse**: Junction table for student enrollments

### Key Relationships
- Instructor → Department (1:M) - One instructor administers multiple departments
- Department → Course (1:M) - One department offers multiple courses
- Student ↔ Course (M:M) - Students enroll in courses via StudentCourse junction table

---

## Technology Stack

- **Framework**: .NET 6 MVC / ASP.NET Core
- **ORM**: Entity Framework Core 6
- **Database**: Azure SQL Database
- **Cloud Platform**: Microsoft Azure
- **CI/CD**: GitHub Actions
- **Monitoring**: Azure Application Insights
- **Infrastructure as Code**: Bicep
- **Load Testing**: Azure Load Testing

---

## Related Files

### Source Code
- Models: `src/ContosoUniversity.API/Models/`
- DbContext: `src/ContosoUniversity.API/Data/ContosoUniversityAPIContext.cs`
- Seed Data: `src/ContosoUniversity.API/Data/DbInitializer.cs`

### Configuration
- Connection Strings: `src/ContosoUniversity.API/appsettings.json`
- Startup: `src/ContosoUniversity.API/Program.cs`

### Infrastructure
- Azure Resources: `infra/core/main.bicep`
- SQL Setup: `scripts/create-sql-users.sql`

---

## Contributing to Documentation

When making changes to the database schema:

1. ✅ Update entity classes in `src/ContosoUniversity.API/Models/`
2. ✅ Update DbContext configuration if needed
3. ✅ Update `DATABASE_SCHEMA.md` with new table/column details
4. ✅ Update `DATABASE_QUICK_REFERENCE.md` with new snippets
5. ✅ Update `DATABASE_DIAGRAMS.md` with new diagrams
6. ✅ Test all code snippets in documentation
7. ✅ Update this index if adding new documentation files

---

## Documentation Standards

- Use markdown format for all documentation
- Include code examples with proper syntax highlighting
- Use tables for structured data reference
- Include diagrams using Mermaid syntax
- Keep examples up-to-date with current codebase
- Cross-reference related documentation sections
- Include troubleshooting tips for common issues

---

## Feedback and Questions

For questions about:
- **Database Schema**: Review documentation first, then consult development team
- **Performance Issues**: Check SRE Knowledge Base and Application Insights
- **Production Issues**: Follow runbooks in SRE documentation
- **Documentation Updates**: Submit PR with changes to relevant docs

---

*Last Updated: 2026-02-12*
