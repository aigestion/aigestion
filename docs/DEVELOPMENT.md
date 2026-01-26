# 🚀 AIGestion Development Guide

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Git Workflow](#git-workflow)
- [Debugging](#debugging)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start

### Prerequisites
```bash
# Required Software
- Node.js 22+
- Python 3.11+
- Docker & Docker Compose
- pnpm 8.15.0+
- Git
```

### One-Command Setup
```bash
# Clone and setup
git clone https://github.com/aigestion/aigestion-net.git
cd aigestion-net
pnpm install
pnpm run setup

# Start development
pnpm run dev
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env

# Required variables
NODE_ENV=development
DATABASE_URL=postgresql://...
MONGODB_URL=mongodb://...
REDIS_URL=redis://...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=...
```

---

## 🛠️ Development Environment

### IDE Configuration
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  }
}
```

### VS Code Extensions
```json
// Recommended Extensions
[
  "ms-vscode.vscode-typescript-next",
  "esbenp.prettier-vscode",
  "dbaeumer.vscode-eslint",
  "bradlc.vscode-tailwindcss",
  "ms-vscode.vscode-json",
  "github.copilot",
  "github.copilot-chat"
]
```

### Docker Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 📁 Project Structure Deep Dive

### Monorepo Organization
```
aigestion/
├── 📁 backend/                 # Node.js API Server
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # Request handlers
│   │   ├── 📁 services/        # Business logic
│   │   ├── 📁 repositories/    # Data access
│   │   ├── 📁 middleware/      # Express middleware
│   │   ├── 📁 routes/          # API routes
│   │   ├── 📁 types/           # TypeScript types
│   │   ├── 📁 utils/           # Utilities
│   │   └── 📄 server.ts        # Application entry
│   ├── 📁 __tests__/           # Test files
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
├── 📁 frontend/                # React Applications
│   ├── 📁 apps/
│   │   ├── 📁 admindashboard/  # Admin interface
│   │   ├── 📁 clientdashboard/ # Client portal
│   │   ├── 📁 demodashboard/   # Demo showcase
│   │   └── 📁 website-epic/    # Marketing site
│   ├── 📁 shared/              # Shared components
│   └── 📄 package.json
├── 📁 ml-service/              # Python AI Services
│   ├── 📁 app/
│   │   ├── 📁 models/          # ML models
│   │   ├── 📁 services/        # AI services
│   │   └── 📄 main.py
│   └── 📄 requirements.txt
├── 📁 packages/                # Shared Libraries
│   ├── 📁 types/               # Shared types
│   ├── 📁 utils/               # Common utilities
│   └── 📁 config/              # Configuration
├── 📁 docs/                    # Documentation
├── 📁 scripts/                 # Build & deploy scripts
└── 📁 infrastructure/          # IaC configurations
```

### File Naming Conventions
```typescript
// Components: PascalCase
UserProfile.tsx
DashboardLayout.tsx

// Services: camelCase
userService.ts
authService.ts

// Utilities: camelCase
formatDate.ts
validateEmail.ts

// Types: PascalCase
UserType.ts
ApiResponse.ts

// Constants: UPPER_SNAKE_CASE
API_ENDPOINTS.ts
ERROR_MESSAGES.ts
```

---

## 📝 Coding Standards

### TypeScript Guidelines

#### 1. Strict Type Safety
```typescript
// ✅ Good: Explicit types
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

const getUser = async (id: string): Promise<User | null> => {
  return await userRepository.findById(id);
};

// ❌ Bad: Implicit any
const getUser = async (id) => {
  return await userRepository.findById(id);
};
```

#### 2. Interface vs Type
```typescript
// ✅ Use interface for objects
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// ✅ Use type for unions or computed types
type UserRole = 'admin' | 'user' | 'moderator';
type Id = string | number;
```

#### 3. Function Signatures
```typescript
// ✅ Descriptive parameter names
const createUser = async (
  userData: CreateUserRequest,
  options: CreateUserOptions = {}
): Promise<User> => {
  // Implementation
};

// ❌ Vague parameter names
const create = async (data, opts) => {
  // Implementation
};
```

### React/TypeScript Patterns

#### 1. Component Structure
```typescript
// ✅ Proper component structure
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  onUpdate
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getById(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {onUpdate && (
        <button onClick={() => onUpdate(user)}>
          Update User
        </button>
      )}
    </div>
  );
};
```

#### 2. Custom Hooks
```typescript
// ✅ Custom hook pattern
interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

export const useUser = (userId: string): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (updates: Partial<User>) => {
    try {
      const updatedUser = await userService.update(userId, updates);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  useEffect(() => {
    userService.getById(userId)
      .then(setUser)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error, updateUser };
};
```

### Backend Patterns

#### 1. Controller Structure
```typescript
// ✅ Clean controller pattern
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger
  ) {}

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.userService.findById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        data: user,
        status: 200,
        message: 'User retrieved successfully'
      };
    } catch (error) {
      this.logger.error('Failed to get user', { id, error });
      throw error;
    }
  }

  @Post('/')
  async createUser(
    @Body() userData: CreateUserRequest
  ): Promise<ApiResponse<User>> {
    try {
      const user = await this.userService.create(userData);

      return {
        data: user,
        status: 201,
        message: 'User created successfully'
      };
    } catch (error) {
      this.logger.error('Failed to create user', { userData, error });
      throw error;
    }
  }
}
```

#### 2. Service Layer
```typescript
// ✅ Service with dependency injection
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly logger: Logger
  ) {}

  async create(userData: CreateUserRequest): Promise<User> {
    // Validate input
    const validatedData = this.validateUserData(userData);

    // Check for duplicates
    const existingUser = await this.userRepository.findByEmail(
      validatedData.email
    );

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user
    const user = await this.userRepository.create({
      ...validatedData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    this.logger.info('User created successfully', { userId: user.id });

    return user;
  }

  private validateUserData(data: CreateUserRequest): CreateUserRequest {
    // Add validation logic
    return data;
  }
}
```

---

## 🧪 Testing Guidelines

### Unit Testing

#### 1. Test Structure
```typescript
// ✅ Organized test file
describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    mockEmailService = createMockEmailService();

    userService = new UserService(
      mockUserRepository,
      mockEmailService,
      mockLogger
    );
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const userData: CreateUserRequest = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      };

      const expectedUser: User = {
        id: '123',
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.create(userData);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(userData)
      );
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        userData.email,
        userData.name
      );
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      const userData: CreateUserRequest = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      };

      const existingUser: User = {
        id: '123',
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(userService.create(userData))
        .rejects
        .toThrow(ConflictException);
    });
  });
});
```

#### 2. Mock Utilities
```typescript
// test-utils.ts
export const createMockUserRepository = (): jest.Mocked<UserRepository> => ({
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn()
});

export const createMockUserService = (): UserService => {
  const mockRepo = createMockUserRepository();
  const mockEmail = createMockEmailService();
  return new UserService(mockRepo, mockEmail, mockLogger);
};
```

### Integration Testing

#### 1. API Testing
```typescript
// integration/user.test.ts
describe('User API', () => {
  let app: Express;
  let testDb: TestDatabase;

  beforeAll(async () => {
    testDb = await setupTestDatabase();
    app = await createTestApp(testDb);
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  beforeEach(async () => {
    await testDb.clear();
  });

  describe('POST /api/users', () => {
    it('should create a user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.data).toMatchObject(userData);
      expect(response.body.data.id).toBeDefined();
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({})
        .expect(400);

      expect(response.body.errors).toContain('name is required');
      expect(response.body.errors).toContain('email is required');
    });
  });
});
```

### Frontend Testing

#### 1. Component Testing
```typescript
// UserProfile.test.tsx
describe('UserProfile', () => {
  const mockUser: User = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  };

  it('should display user information', async () => {
    // Mock the service
    jest.spyOn(userService, 'getById')
      .mockResolvedValue(mockUser);

    render(<UserProfile userId="123" />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  it('should show loading state', () => {
    jest.spyOn(userService, 'getById')
      .mockImplementation(() => new Promise(() => {}));

    render(<UserProfile userId="123" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should call onUpdate when update button is clicked', async () => {
    const mockOnUpdate = jest.fn();

    jest.spyOn(userService, 'getById')
      .mockResolvedValue(mockUser);

    render(<UserProfile userId="123" onUpdate={mockOnUpdate} />);

    await waitFor(() => {
      expect(screen.getByText('Update User')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Update User'));

    expect(mockOnUpdate).toHaveBeenCalledWith(mockUser);
  });
});
```

---

## 🌿 Git Workflow

### Branch Strategy
```bash
# Main branches
main          # Production code
develop        # Integration branch

# Feature branches
feature/user-auth
feature/ai-chat
feature/dashboard-ui

# Release branches
release/v2.1.0

# Hotfix branches
hotfix/security-patch
hotfix/critical-bug
```

### Commit Message Format
```bash
# Format: <type>(<scope>): <description>

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting
refactor: Code refactoring
test:     Tests
chore:    Build process

# Examples
feat(auth): add JWT authentication
fix(api): resolve user creation bug
docs(readme): update installation guide
test(user): add unit tests for UserService
```

### Pull Request Process
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat(feature): implement new feature"

# 3. Push and create PR
git push origin feature/new-feature
# Create PR on GitHub

# 4. PR Checklist
- [ ] Tests pass
- [ ] Code coverage > 80%
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Security scan passed
```

---

## 🐛 Debugging

### Backend Debugging
```typescript
// Debug configuration
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "program": "${workspaceFolder}/backend/src/server.ts",
  "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
  "env": {
    "NODE_ENV": "development"
  },
  "runtimeArgs": ["-r", "ts-node/register"],
  "console": "integratedTerminal"
}
```

### Frontend Debugging
```typescript
// React DevTools integration
if (process.env.NODE_ENV === 'development') {
  import('./ReactDevTools').then(() => {
    // React DevTools initialized
  });
}

// Debug logging
const debug = require('debug')('aigestion:user');

export class UserService {
  async createUser(userData: CreateUserRequest): Promise<User> {
    debug('Creating user with data: %O', userData);

    try {
      const user = await this.userRepository.create(userData);
      debug('User created successfully: %s', user.id);
      return user;
    } catch (error) {
      debug('Failed to create user: %O', error);
      throw error;
    }
  }
}
```

### Database Debugging
```typescript
// Query logging
import { logger } from './utils/logger';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    logger.debug('Executing query: %s with params: %s', query, id);

    const result = await this.db.query(query, [id]);
    logger.debug('Query result: %O', result.rows);

    return result.rows[0] || null;
  }
}
```

---

## ⚡ Performance

### Frontend Performance
```typescript
// Code splitting
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const UserDashboard = lazy(() => import('./UserDashboard'));

// Memoization
const ExpensiveComponent = memo(({ data }: Props) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveTransform(item));
  }, [data]);

  return <div>{/* render processed data */}</div>;
});

// Virtual scrolling
import { FixedSizeList as List } from 'react-window';

const VirtualizedList: React.FC<{ items: Item[] }> = ({ items }) => (
  <List
    height={600}
    itemCount={items.length}
    itemSize={50}
    itemData={items}
  >
    {({ index, style, data }) => (
      <div style={style}>
        {data[index].name}
      </div>
    )}
  </List>
);
```

### Backend Performance
```typescript
// Database connection pooling
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Caching strategy
export class CachedUserService {
  private cache = new Map<string, User>();

  async findById(id: string): Promise<User | null> {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    // Fetch from database
    const user = await this.userRepository.findById(id);

    // Cache the result
    if (user) {
      this.cache.set(id, user);
    }

    return user;
  }
}

// Batch processing
export class BatchProcessor {
  async processBatch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 10
  ): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(item => processor(item))
      );
      results.push(...batchResults);
    }

    return results;
  }
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear all caches
pnpm run clean
rm -rf node_modules
pnpm install

# Check TypeScript errors
pnpm run typecheck

# Check linting errors
pnpm run lint
```

#### 2. Database Connection Issues
```bash
# Check database status
docker-compose ps db

# View database logs
docker-compose logs db

# Test connection
pnpm run db:test-connection
```

#### 3. Environment Issues
```bash
# Validate environment variables
pnpm run env:validate

# Show current environment
pnpm run env:show

# Reset environment
cp .env.example .env
```

### Performance Issues
```bash
# Profile Node.js application
node --prof backend/dist/server.js
node --prof-process isolate-*.log > performance.txt

# Analyze bundle size
pnpm run analyze:bundle

# Check memory usage
pnpm run memory:profile
```

### Debug Commands
```bash
# Health check
pnpm run health:check

# Service status
pnpm run status:all

# Logs
pnpm run logs:backend
pnpm run logs:frontend
```

---

## 📚 Additional Resources

### Documentation
- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Security Guidelines](./SECURITY.md)

### Tools
- [VS Code Configuration](../.vscode/)
- [ESLint Configuration](../eslint.config.cjs)
- [Prettier Configuration](../.prettierrc)

### External Links
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

*Last Updated: 2025-01-25*
*Development Guide Version: 2.0.0-GOLD*
