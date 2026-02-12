# Contoso University - Database Schema Documentation

## Overview

The Contoso University database is designed to manage students, courses, instructors, and departments in an educational institution. The schema uses Entity Framework Core with Azure SQL Database and follows a normalized relational database design pattern.

## Technology Stack

- **ORM**: Entity Framework Core 6
- **Database**: Azure SQL Database
- **Context Class**: `ContosoUniversityAPIContext`
- **Namespace**: `ContosoUniversity.API.Models`

## Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Instructor    │         │   Department    │         │     Course      │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ ID (PK)         │◄────────│ InstructorID(FK)│◄────────│ DepartmentID(FK)│
│ FirstName       │         │ ID (PK)         │         │ ID (PK)         │
│ LastName        │         │ Name            │         │ Title           │
│ HireDate        │         │ Budget          │         │ Credits         │
└─────────────────┘         │ StartDate       │         └─────────────────┘
                            └─────────────────┘                 ▲
                                                                │
                                                                │
                            ┌─────────────────┐                │
                            │ StudentCourse   │                │
                            │ (Junction Table)│                │
                            ├─────────────────┤                │
                    ┌───────│ StudentID (PK)  │                │
                    │       │ CourseID (PK)   │────────────────┘
                    │       └─────────────────┘
                    │
                    ▼
        ┌─────────────────┐
        │    Student      │
        ├─────────────────┤
        │ ID (PK)         │
        │ FirstName       │
        │ LastName        │
        │ EnrollmentDate  │
        └─────────────────┘
```

## Database Tables

### 1. tbl_Student

Stores information about students enrolled in the university.

| Column Name      | Data Type     | Constraints           | Description                    |
|------------------|---------------|-----------------------|--------------------------------|
| ID               | INT           | PRIMARY KEY, IDENTITY | Auto-incrementing student ID   |
| FirstName        | NVARCHAR      | NOT NULL, REQUIRED    | Student's first name           |
| LastName         | NVARCHAR      | NOT NULL, REQUIRED    | Student's last name            |
| EnrollmentDate   | DATETIME2     | NOT NULL              | Date student enrolled          |

**Entity Class**: `Student.cs`

**Relationships**:
- One-to-Many with `tbl_StudentCourse` (A student can enroll in multiple courses)

**Validation Rules**:
- `FirstName` and `LastName` are required fields
- `EnrollmentDate` is formatted as `dd/MM/yyyy`

**Seed Data**: 10,000 students are generated using the Bogus library with random names and past enrollment dates.

---

### 2. tbl_Course

Stores information about courses offered by the university.

| Column Name      | Data Type      | Constraints           | Description                          |
|------------------|----------------|-----------------------|--------------------------------------|
| ID               | INT            | PRIMARY KEY, IDENTITY | Auto-incrementing course ID          |
| Title            | NVARCHAR(50)   | NOT NULL, 3-50 chars  | Course title                         |
| Credits          | INT            | NOT NULL, Range 0-5   | Credit hours for the course          |
| DepartmentID     | INT            | FOREIGN KEY           | Reference to department offering it  |

**Entity Class**: `Course.cs`

**Relationships**:
- Many-to-One with `tbl_Department` (A course belongs to one department)
- One-to-Many with `tbl_StudentCourse` (A course can have multiple enrolled students)

**Validation Rules**:
- `Title` must be between 3 and 50 characters
- `Credits` must be between 0 and 5

**Seed Data**: 
- Chemistry (3 credits, Engineering)
- Microeconomics (3 credits, Economics)
- Calculus (4 credits, Mathematics)
- Trigonometry (4 credits, Mathematics)
- Composition (3 credits, English)
- Literature (4 credits, English)

---

### 3. tbl_Instructor

Stores information about instructors teaching at the university.

| Column Name      | Data Type     | Constraints           | Description                    |
|------------------|---------------|-----------------------|--------------------------------|
| ID               | INT           | PRIMARY KEY, IDENTITY | Auto-incrementing instructor ID|
| FirstName        | NVARCHAR(50)  | NOT NULL              | Instructor's first name        |
| LastName         | NVARCHAR(50)  | NOT NULL              | Instructor's last name         |
| HireDate         | DATETIME2     | NOT NULL              | Date instructor was hired      |

**Entity Class**: `Instructor.cs`

**Relationships**:
- One-to-Many with `tbl_Department` (An instructor can lead multiple departments)
- One-to-Many with `tbl_Course` (An instructor can teach multiple courses - navigation property)

**Validation Rules**:
- `FirstName` and `LastName` limited to 50 characters
- `HireDate` is formatted as `dd/MM/yyyy`

**Seed Data**: 1,000 instructors are generated using the Bogus library with random names and past hire dates.

---

### 4. tbl_Department

Stores information about academic departments within the university.

| Column Name      | Data Type     | Constraints           | Description                        |
|------------------|---------------|-----------------------|------------------------------------|
| ID               | INT           | PRIMARY KEY, IDENTITY | Auto-incrementing department ID    |
| Name             | NVARCHAR(50)  | NOT NULL, 3-50 chars  | Department name                    |
| Budget           | MONEY         | NOT NULL              | Department's annual budget         |
| StartDate        | DATETIME2     | NOT NULL              | Date department was established    |
| InstructorID     | INT           | FOREIGN KEY           | Department administrator reference |

**Entity Class**: `Department.cs`

**Relationships**:
- Many-to-One with `tbl_Instructor` (A department has one administrator)
- One-to-Many with `tbl_Course` (A department offers multiple courses)

**Validation Rules**:
- `Name` must be between 3 and 50 characters
- `Budget` is stored as SQL Server MONEY type
- `StartDate` is formatted as `dd/MM/yyyy`

**Seed Data**:
- English (Budget: $350,000)
- Mathematics (Budget: $100,000)
- Engineering (Budget: $350,000)
- Economics (Budget: $100,000)

All departments established on 01/09/2007 with randomly assigned instructors.

---

### 5. tbl_StudentCourse (Junction Table)

Represents the many-to-many relationship between students and courses (enrollment records).

| Column Name      | Data Type     | Constraints              | Description                    |
|------------------|---------------|--------------------------|--------------------------------|
| StudentID        | INT           | PRIMARY KEY (Composite)  | Foreign key to tbl_Student     |
| CourseID         | INT           | PRIMARY KEY (Composite)  | Foreign key to tbl_Course      |

**Entity Class**: `StudentCourse.cs`

**Relationships**:
- Many-to-One with `tbl_Student` (Many enrollments per student)
- Many-to-One with `tbl_Course` (Many enrollments per course)

**Composite Primary Key**: `(StudentID, CourseID)`

**Note**: The foreign key relationships in the entity model are commented out, relying on EF Core conventions.

**Seed Data**: 10,000 enrollment records are created, randomly assigning each student to one course.

## Database Initialization

The database is initialized using the `DbInitializer` class which:

1. Ensures the database is created (`EnsureCreatedAsync`)
2. Checks if data already exists to prevent duplicate seeding
3. Seeds data in the following order to respect foreign key constraints:
   - 1,000 Instructors (using Bogus faker)
   - 4 Departments
   - 6 Courses
   - 10,000 Students (using Bogus faker)
   - 10,000 Student-Course enrollments

## DbContext Configuration

The `ContosoUniversityAPIContext` class configures:

```csharp
public class ContosoUniversityAPIContext : DbContext
{
    // DbSet properties
    public DbSet<Course> Courses { get; set; }
    public DbSet<Student> Student { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<Instructor> Instructors { get; set; }
    public DbSet<StudentCourse> StudentCourse { get; set; }

    // Table mappings
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Map entities to physical table names
        modelBuilder.Entity<Course>().ToTable("tbl_Course");
        modelBuilder.Entity<Student>().ToTable("tbl_Student");
        modelBuilder.Entity<Department>().ToTable("tbl_Department");
        modelBuilder.Entity<Instructor>().ToTable("tbl_Instructor");
        modelBuilder.Entity<StudentCourse>().ToTable("tbl_StudentCourse");
        
        // Configure composite primary key
        modelBuilder.Entity<StudentCourse>()
            .HasKey(c => new { c.CourseID, c.StudentID });
    }
}
```

## Data Annotations Used

| Annotation           | Purpose                                      | Applied To                    |
|----------------------|----------------------------------------------|-------------------------------|
| `[Key]`              | Explicitly mark primary key                  | Course.ID                     |
| `[Required]`         | Field cannot be null                         | Student names                 |
| `[StringLength]`     | Limit string length with min/max            | Multiple string fields        |
| `[Range]`            | Numeric value range validation               | Course.Credits (0-5)          |
| `[DataType]`         | Specify data type for display                | Date fields, Currency         |
| `[DisplayFormat]`    | Format string for display                    | Date fields (dd/MM/yyyy)      |
| `[Column]`           | Specify database column type                 | Department.Budget (money)     |

## Common Queries

### Get All Students with Their Enrolled Courses

```csharp
var students = await context.Student
    .Include(s => s.StudentCourse)
        .ThenInclude(sc => sc.Course)
    .ToListAsync();
```

### Get All Courses in a Department

```csharp
var courses = await context.Courses
    .Include(c => c.Department)
    .Where(c => c.Department.Name == "Mathematics")
    .ToListAsync();
```

### Get Department with Its Administrator

```csharp
var department = await context.Departments
    .Include(d => d.Instructor)
    .FirstOrDefaultAsync(d => d.Name == "Engineering");
```

### Get Students Enrolled in a Specific Course

```csharp
var enrollments = await context.StudentCourse
    .Include(sc => sc.Student)
    .Include(sc => sc.Course)
    .Where(sc => sc.Course.Title == "Calculus")
    .ToListAsync();
```

## Performance Considerations

1. **Indexing**: 
   - Primary keys are automatically indexed
   - Consider adding indexes on foreign keys (StudentID, CourseID, DepartmentID, InstructorID)
   - Consider adding indexes on frequently queried fields (LastName, Name)

2. **Query Optimization**:
   - Use `.AsNoTracking()` for read-only queries
   - Use `.Select()` to project only required columns
   - Avoid N+1 query problems by using `.Include()` appropriately

3. **Connection Resiliency**:
   - Implement retry policies for transient Azure SQL failures
   - Use connection pooling (enabled by default in EF Core)

## Naming Conventions

- **Table Names**: Prefixed with `tbl_` followed by entity name (e.g., `tbl_Student`)
- **Primary Keys**: Named `ID` in entity classes
- **Foreign Keys**: Named with entity name + `ID` (e.g., `DepartmentID`, `InstructorID`)
- **Navigation Properties**: Named after the related entity (singular for one, plural for many)

## Extension Recommendations

To extend the schema, consider adding:

1. **Enrollment Details**: Grade, enrollment status, completion date in `StudentCourse`
2. **Course Sections**: Multiple sections per course with different instructors and schedules
3. **Prerequisites**: Self-referencing relationship in `Course` table
4. **Office Assignments**: One-to-one relationship with `Instructor`
5. **Course Assignments**: Many-to-many relationship between `Instructor` and `Course`
6. **Audit Fields**: CreatedDate, ModifiedDate, CreatedBy, ModifiedBy on all tables

## Connection String Configuration

The application expects a connection string named `ContosoUniversityAPIContext` configured in:
- `appsettings.json` for local development
- Azure Key Vault or App Service Configuration for production
- GitHub Secrets (`AZURE_CONTOSO_CONN_STRING`) for CI/CD deployments

Example connection string format:
```
Server=tcp:{server}.database.windows.net,1433;Initial Catalog={database};
Persist Security Info=False;User ID={username};Password={password};
MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;
Connection Timeout=30;
```

## Related Documentation

- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [Azure SQL Database Documentation](https://docs.microsoft.com/en-us/azure/azure-sql/)
- [Data Annotations Reference](https://docs.microsoft.com/en-us/ef/core/modeling/entity-properties)
- [Fluent API Reference](https://docs.microsoft.com/en-us/ef/core/modeling/)

## Maintenance Notes

1. **Database Migrations**: Currently using `EnsureCreated()` which is not recommended for production. Consider implementing EF Core migrations for schema version control.

2. **Seed Data**: Seed data is only added if tables are empty. To re-seed, the database must be dropped and recreated.

3. **Foreign Key Constraints**: While EF Core navigation properties exist, explicit foreign key relationships are commented out in the `OnModelCreating` method. These should be uncommented for referential integrity enforcement.

4. **Data Validation**: Validation attributes are defined but should be complemented with client-side validation and additional business rules.
