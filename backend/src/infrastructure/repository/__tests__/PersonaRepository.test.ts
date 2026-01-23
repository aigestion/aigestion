import { PersonaRepository } from '../PersonaRepository';
import { Persona } from '../../../models/Persona';

// Mock the Mongoose model
jest.mock('../../../models/Persona');

describe('PersonaRepository', () => {
    let repo: PersonaRepository;
    const mockPersona = {
        _id: 'persona-id',
        id: 'persona-id',
        ownerId: 'owner-id',
        name: 'Test Persona',
        description: 'A test persona',
        systemPrompt: 'You are a test',
        voiceSettings: { provider: 'test', voiceId: '123' },
        isPublic: true,
        price: 0,
        tags: ['test'],
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn(),
    };
    mockPersona.save.mockResolvedValue(mockPersona);

    beforeEach(() => {
        jest.clearAllMocks();
        repo = new PersonaRepository();
    });

    it('should create a persona', async () => {
        (Persona as any).mockImplementation(() => mockPersona);

        const result = await repo.create({ name: 'Test Persona' });

        expect(Persona).toHaveBeenCalled();
        expect(mockPersona.save).toHaveBeenCalled();
        expect(result).toEqual(mockPersona);
    });

    it('should find personas by owner', async () => {
        const mockFind = {
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([mockPersona]),
        };
        (Persona.find as jest.Mock).mockReturnValue(mockFind);

        const results = await repo.findByOwner('owner-id');
        expect(results).toHaveLength(1);
        expect(Persona.find).toHaveBeenCalledWith({ ownerId: 'owner-id' });
    });

    it('should find public personas with pagination', async () => {
        const mockFind = {
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([mockPersona]),
        };
        (Persona.find as jest.Mock).mockReturnValue(mockFind);
        (Persona.countDocuments as jest.Mock).mockResolvedValue(1);

        const result = await repo.findPublic(10, 0);
        expect(result.personas).toHaveLength(1);
        expect(result.total).toBe(1);
        expect(Persona.find).toHaveBeenCalledWith({ isPublic: true });
        expect(mockFind.skip).toHaveBeenCalledWith(0);
        expect(mockFind.limit).toHaveBeenCalledWith(10);
    });

    it('should find by id', async () => {
        const mockFindById = {
            exec: jest.fn().mockResolvedValue(mockPersona),
        };
        (Persona.findById as jest.Mock).mockReturnValue(mockFindById);

        const result = await repo.findById('persona-id');
        expect(result).toEqual(mockPersona);
        expect(Persona.findById).toHaveBeenCalledWith('persona-id');
    });

    it('should delete a persona', async () => {
        const mockDelete = {
            exec: jest.fn().mockResolvedValue(true),
        };
        (Persona.findByIdAndDelete as jest.Mock).mockReturnValue(mockDelete);

        const result = await repo.delete('persona-id');
        expect(result).toBe(true);
    });
});
