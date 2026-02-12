# Contoso University - Database Schema Diagrams

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    INSTRUCTOR ||--o{ DEPARTMENT : administers
    DEPARTMENT ||--o{ COURSE : offers
    STUDENT ||--o{ STUDENTCOURSE : enrolls
    COURSE ||--o{ STUDENTCOURSE : has

    INSTRUCTOR {
        int ID PK
        string FirstName
        string LastName
        datetime HireDate
    }

    DEPARTMENT {
        int ID PK
        string Name
        money Budget
        datetime StartDate
        int InstructorID FK
    }

    COURSE {
        int ID PK
        string Title
        int Credits
        int DepartmentID FK
    }

    STUDENT {
        int ID PK
        string FirstName
        string LastName
        datetime EnrollmentDate
    }

    STUDENTCOURSE {
        int StudentID PK,FK
        int CourseID PK,FK
    }
```

## Database Schema Overview

```mermaid
graph TB
    subgraph "Core Entities"
        S[Student<br/>10,000 records]
        C[Course<br/>6 records]
        I[Instructor<br/>1,000 records]
        D[Department<br/>4 records]
    end
    
    subgraph "Junction Table"
        SC[StudentCourse<br/>10,000 enrollments]
    end
    
    I -->|administers| D
    D -->|offers| C
    S -->|enrolls via| SC
    C -->|has| SC
    
    style S fill:#e1f5ff
    style C fill:#fff5e1
    style I fill:#e1ffe1
    style D fill:#ffe1f5
    style SC fill:#f0f0f0
```

## Table Relationships Flow

```mermaid
flowchart LR
    A[Instructor] -->|1:M| B[Department]
    B -->|1:M| C[Course]
    C -->|M:M| D[StudentCourse]
    E[Student] -->|M:M| D
    
    style A fill:#90EE90
    style B fill:#FFB6C1
    style C fill:#FFD700
    style D fill:#DDA0DD
    style E fill:#87CEEB
```

## Detailed Schema with Constraints

```mermaid
classDiagram
    class Student {
        +int ID
        +string FirstName [Required]
        +string LastName [Required]
        +DateTime EnrollmentDate
        +IEnumerable~StudentCourse~ StudentCourse
    }
    
    class Course {
        +int ID
        +string Title [3-50 chars]
        +int Credits [0-5]
        +Department Department
        +IList~StudentCourse~ StudentCourse
    }
    
    class Instructor {
        +int ID
        +string FirstName [≤50]
        +string LastName [≤50]
        +DateTime HireDate
        +IList~Course~ Courses
    }
    
    class Department {
        +int ID
        +string Name [3-50 chars]
        +decimal Budget [money]
        +DateTime StartDate
        +Instructor Instructor
    }
    
    class StudentCourse {
        +int StudentID
        +int CourseID
        +Student Student
        +Course Course
    }
    
    Instructor "1" --> "*" Department : administers
    Department "1" --> "*" Course : offers
    Student "1" --> "*" StudentCourse : enrolls
    Course "1" --> "*" StudentCourse : has
```

## Data Flow During Initialization

```mermaid
sequenceDiagram
    participant Init as DbInitializer
    participant DB as Database
    participant Inst as Instructors
    participant Dept as Departments
    participant Crse as Courses
    participant Stud as Students
    participant Enrl as Enrollments
    
    Init->>DB: EnsureCreatedAsync()
    Init->>DB: Check if Student table has data
    
    alt Database is empty
        Init->>Inst: Generate 1,000 instructors (Bogus)
        Inst->>DB: Save instructors
        
        Init->>Dept: Create 4 departments
        Dept->>DB: Save departments
        
        Init->>Crse: Create 6 courses
        Crse->>DB: Save courses
        
        Init->>Stud: Generate 10,000 students (Bogus)
        Stud->>DB: Save students
        
        Init->>Enrl: Create 10,000 enrollments
        Enrl->>DB: Save enrollments
    else Database has data
        Init->>DB: Skip seeding
    end
```

## Query Performance Considerations

```mermaid
graph TD
    A[Query Request] --> B{Include Related Data?}
    B -->|Yes| C[Use .Include]
    B -->|No| D[Direct Query]
    
    C --> E{Read-Only?}
    D --> E
    
    E -->|Yes| F[Use .AsNoTracking]
    E -->|No| G[Track Changes]
    
    F --> H[Execute Query]
    G --> H
    
    H --> I{Large Dataset?}
    I -->|Yes| J[Use Pagination]
    I -->|No| K[Return Results]
    
    J --> K
    
    style A fill:#e1f5ff
    style H fill:#fff5e1
    style K fill:#90EE90
```

## Table Size and Growth Projection

```mermaid
pie title Current Seed Data Distribution
    "Students" : 10000
    "Instructors" : 1000
    "Enrollments" : 10000
    "Courses" : 6
    "Departments" : 4
```

## Foreign Key Constraints

```mermaid
graph LR
    subgraph "Primary Keys"
        I_PK[Instructor.ID]
        D_PK[Department.ID]
        C_PK[Course.ID]
        S_PK[Student.ID]
    end
    
    subgraph "Foreign Keys"
        D_FK[Department.InstructorID]
        C_FK[Course.DepartmentID]
        SC_S_FK[StudentCourse.StudentID]
        SC_C_FK[StudentCourse.CourseID]
    end
    
    I_PK -.->|references| D_FK
    D_PK -.->|references| C_FK
    S_PK -.->|references| SC_S_FK
    C_PK -.->|references| SC_C_FK
    
    style I_PK fill:#90EE90
    style D_PK fill:#FFB6C1
    style C_PK fill:#FFD700
    style S_PK fill:#87CEEB
```

## Data Access Patterns

```mermaid
graph TB
    subgraph "Common Queries"
        Q1[Get Student Enrollments]
        Q2[Get Courses by Department]
        Q3[Get Department Administrator]
        Q4[Get Course Enrollments]
    end
    
    subgraph "Tables Accessed"
        T1[tbl_Student]
        T2[tbl_StudentCourse]
        T3[tbl_Course]
        T4[tbl_Department]
        T5[tbl_Instructor]
    end
    
    Q1 --> T1
    Q1 --> T2
    Q1 --> T3
    
    Q2 --> T3
    Q2 --> T4
    
    Q3 --> T4
    Q3 --> T5
    
    Q4 --> T3
    Q4 --> T2
    Q4 --> T1
    
    style Q1 fill:#e1f5ff
    style Q2 fill:#fff5e1
    style Q3 fill:#e1ffe1
    style Q4 fill:#ffe1f5
```

## Database Deployment Architecture

```mermaid
graph TD
    A[Application Code] --> B[Entity Framework Core]
    B --> C[DbContext]
    C --> D{Environment}
    
    D -->|Development| E[Local SQL Server]
    D -->|Production| F[Azure SQL Database]
    
    F --> G[Azure Resource Group]
    G --> H[App Service]
    G --> I[Application Insights]
    G --> J[Key Vault]
    
    J -.->|Connection String| H
    H -.->|Telemetry| I
    
    style F fill:#0078D4
    style G fill:#50C878
    style A fill:#e1f5ff
```

## How to View These Diagrams

These diagrams are written in Mermaid syntax and can be viewed in:

1. **GitHub**: Automatically rendered in markdown files
2. **VS Code**: Install "Markdown Preview Mermaid Support" extension
3. **Online**: Copy/paste code to https://mermaid.live/
4. **Documentation Sites**: Most modern documentation platforms support Mermaid

## Diagram Legend

- **Solid Lines**: Direct relationships (foreign keys)
- **Dashed Lines**: Navigation properties (EF Core)
- **1:M**: One-to-Many relationship
- **M:M**: Many-to-Many relationship (via junction table)
- **PK**: Primary Key
- **FK**: Foreign Key

## Related Documentation

- [Full Database Schema Documentation](./DATABASE_SCHEMA.md)
- [Quick Reference Guide](./DATABASE_QUICK_REFERENCE.md)
