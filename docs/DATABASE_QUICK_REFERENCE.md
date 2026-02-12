# Database Schema - Quick Reference Guide

## Table Summary

| Table Name         | Primary Key | Row Count (Seed) | Purpose                          |
|--------------------|-------------|------------------|----------------------------------|
| tbl_Student        | ID          | 10,000           | Student records                  |
| tbl_Course         | ID          | 6                | Course catalog                   |
| tbl_Instructor     | ID          | 1,000            | Faculty members                  |
| tbl_Department     | ID          | 4                | Academic departments             |
| tbl_StudentCourse  | StudentID, CourseID | 10,000   | Student enrollments (junction)   |

## Relationships at a Glance

```
Instructor (1) ──── (M) Department (1) ──── (M) Course (M) ──── (M) Student
                                                               via StudentCourse
```

## Entity Classes Location

All models are in: `src/ContosoUniversity.API/Models/`

- `Student.cs` → tbl_Student
- `Course.cs` → tbl_Course  
- `Instructor.cs` → tbl_Instructor
- `Department.cs` → tbl_Department
- `StudentCourse.cs` → tbl_StudentCourse

## Key Fields Reference

### Student
```
ID (PK), FirstName*, LastName*, EnrollmentDate
* = Required
```

### Course
```
ID (PK), Title* (3-50 chars), Credits* (0-5), DepartmentID (FK)
```

### Instructor
```
ID (PK), FirstName* (≤50), LastName* (≤50), HireDate
```

### Department
```
ID (PK), Name* (3-50 chars), Budget (money), StartDate, InstructorID (FK)
```

### StudentCourse
```
StudentID (PK, FK), CourseID (PK, FK)
Composite Key: (StudentID, CourseID)
```

## Common Code Snippets

### Adding a New Student
```csharp
var student = new Student 
{
    FirstName = "John",
    LastName = "Doe",
    EnrollmentDate = DateTime.Now
};
await context.Student.AddAsync(student);
await context.SaveChangesAsync();
```

### Enrolling a Student in a Course
```csharp
var enrollment = new StudentCourse 
{
    StudentID = 1,
    CourseID = 2
};
await context.StudentCourse.AddAsync(enrollment);
await context.SaveChangesAsync();
```

### Creating a New Course
```csharp
var course = new Course 
{
    Title = "Introduction to Programming",
    Credits = 4,
    Department = await context.Departments
        .FirstOrDefaultAsync(d => d.Name == "Engineering")
};
await context.Courses.AddAsync(course);
await context.SaveChangesAsync();
```

### Query Students in a Department
```csharp
var students = await context.Student
    .Include(s => s.StudentCourse)
        .ThenInclude(sc => sc.Course)
            .ThenInclude(c => c.Department)
    .Where(s => s.StudentCourse.Any(sc => 
        sc.Course.Department.Name == "Mathematics"))
    .ToListAsync();
```

## Database Initialization

**File**: `src/ContosoUniversity.API/Data/DbInitializer.cs`

**Method**: `DbInitializer.Initialize(ContosoUniversityAPIContext context)`

**Call in**: Program.cs startup

```csharp
// Seed database on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider
        .GetRequiredService<ContosoUniversityAPIContext>();
    await DbInitializer.Initialize(context);
}
```

## Validation Rules Summary

| Field                  | Validation                        |
|------------------------|-----------------------------------|
| Student.FirstName      | Required                          |
| Student.LastName       | Required                          |
| Course.Title           | Required, 3-50 characters         |
| Course.Credits         | Required, 0-5 range               |
| Instructor.FirstName   | Required, max 50 characters       |
| Instructor.LastName    | Required, max 50 characters       |
| Department.Name        | Required, 3-50 characters         |
| Department.Budget      | Required, money type              |

## Troubleshooting

### Issue: Foreign Key Constraint Error
**Solution**: Ensure parent entities exist before adding child entities. Follow order: Instructor → Department → Course → Student → StudentCourse

### Issue: Duplicate Key Error in StudentCourse
**Solution**: Check if enrollment already exists. The composite key (StudentID, CourseID) must be unique.

### Issue: Database Not Seeding
**Solution**: Check if Student table has data. `DbInitializer` skips seeding if data exists. Drop and recreate database to re-seed.

### Issue: Connection String Not Found
**Solution**: Ensure `ContosoUniversityAPIContext` connection string is configured in:
- `appsettings.json` (local)
- Azure App Service Configuration (production)
- GitHub Secret `AZURE_CONTOSO_CONN_STRING` (CI/CD)

## Performance Tips

1. **Use AsNoTracking()** for read-only queries:
   ```csharp
   var students = await context.Student.AsNoTracking().ToListAsync();
   ```

2. **Project only needed columns**:
   ```csharp
   var names = await context.Student
       .Select(s => new { s.FirstName, s.LastName })
       .ToListAsync();
   ```

3. **Avoid N+1 queries** with Include:
   ```csharp
   // Good: Single query with JOIN
   var students = await context.Student
       .Include(s => s.StudentCourse)
       .ToListAsync();
   
   // Bad: N+1 queries
   var students = await context.Student.ToListAsync();
   foreach (var student in students)
   {
       var courses = student.StudentCourse.ToList(); // Extra query per student!
   }
   ```

4. **Use bulk operations** for large inserts:
   ```csharp
   await context.Student.AddRangeAsync(manyStudents);
   await context.SaveChangesAsync();
   ```

## Testing Queries

Use Azure Data Studio or SQL Server Management Studio to test queries directly:

```sql
-- Get all courses with department names
SELECT c.Title, c.Credits, d.Name as Department
FROM tbl_Course c
INNER JOIN tbl_Department d ON c.DepartmentID = d.ID;

-- Get student enrollment count per course
SELECT c.Title, COUNT(sc.StudentID) as EnrolledStudents
FROM tbl_Course c
LEFT JOIN tbl_StudentCourse sc ON c.ID = sc.CourseID
GROUP BY c.Title;

-- Get departments with budget > $200K
SELECT d.Name, d.Budget, i.FirstName + ' ' + i.LastName as Administrator
FROM tbl_Department d
INNER JOIN tbl_Instructor i ON d.InstructorID = i.ID
WHERE d.Budget > 200000;
```

## Migration from EnsureCreated to Migrations

Current approach uses `EnsureCreated()` which is **not suitable for production**. To implement proper migrations:

```bash
# Install EF Core CLI tools
dotnet tool install --global dotnet-ef

# Create initial migration
dotnet ef migrations add InitialCreate --project src/ContosoUniversity.API

# Apply migration to database
dotnet ef database update --project src/ContosoUniversity.API

# Future schema changes
dotnet ef migrations add AddNewColumn --project src/ContosoUniversity.API
dotnet ef database update --project src/ContosoUniversity.API
```

## Additional Resources

- Full Documentation: [docs/DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
- Entity Framework Core: https://docs.microsoft.com/en-us/ef/core/
- Azure SQL Database: https://docs.microsoft.com/en-us/azure/azure-sql/
- Query Performance: https://docs.microsoft.com/en-us/ef/core/performance/
