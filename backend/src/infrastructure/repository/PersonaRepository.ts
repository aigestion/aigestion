import { injectable } from 'inversify';
import { BaseRepository } from './BaseRepository';
import { IPersona, Persona } from '../../models/Persona';

export interface IPersonaRepository extends BaseRepository<IPersona> {
  findByOwner(ownerId: string): Promise<IPersona[]>;
  findPublic(limit?: number, offset?: number): Promise<{ personas: IPersona[]; total: number }>;
  findById(id: string): Promise<IPersona | null>;
  create(idOrItem: string | Partial<IPersona>, maybeItem?: Partial<IPersona>): Promise<IPersona>;
  update(id: string, data: Partial<IPersona>): Promise<IPersona | null>;
  delete(id: string): Promise<boolean>;
}

@injectable()
export class PersonaRepository extends BaseRepository<IPersona> implements IPersonaRepository {
  async findByOwner(ownerId: string): Promise<IPersona[]> {
    return await Persona.find({ ownerId }).sort({ createdAt: -1 }).exec();
  }

  async findPublic(limit = 20, offset = 0): Promise<{ personas: IPersona[]; total: number }> {
    const [personas, total] = await Promise.all([
      Persona.find({ isPublic: true })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate('ownerId', 'name email') // Populate basic owner info
        .exec(),
      Persona.countDocuments({ isPublic: true }),
    ]);
    return { personas, total };
  }

  override async findById(id: string): Promise<IPersona | null> {
    return await Persona.findById(id).exec();
  }

  override async create(
    idOrItem: string | Partial<IPersona>,
    maybeItem?: Partial<IPersona>,
  ): Promise<IPersona> {
    const data = typeof idOrItem === 'string' ? maybeItem ?? {} : idOrItem;
    if (typeof idOrItem === 'string') {
      (data as any)._id = idOrItem;
    }
    const persona = new Persona(data as any);
    return await persona.save();
  }

  override async update(id: string, data: Partial<IPersona>): Promise<IPersona | null> {
    return await Persona.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  override async delete(id: string): Promise<boolean> {
    const result = await Persona.findByIdAndDelete(id).exec();
    return !!result;
  }
}
