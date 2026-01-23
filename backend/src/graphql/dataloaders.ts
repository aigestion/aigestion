import DataLoader from 'dataloader';

import { IProject, Project } from '../models/Project';
/**
 * User DataLoader
 * Evita N+1 queries al cargar usuarios
 */
import { IUser, User } from '../models/User';

/**
 * User DataLoader
 * Evita N+1 queries al cargar usuarios
 */
export class UserDataLoader {
  private loader: DataLoader<string, IUser | null>;

  constructor() {
    this.loader = new DataLoader(async userIds => {
      const users = await User.find({ _id: { $in: userIds } });
      const userMap = new Map(users.map(u => [u.id, u]));
      return userIds.map(id => userMap.get(id) || null);
    });
  }

  load(id: string) {
    return this.loader.load(id);
  }

  loadMany(ids: string[]) {
    return this.loader.loadMany(ids);
  }

  clearCache(id?: string) {
    if (id) {
      this.loader.clear(id);
    } else {
      this.loader.clearAll();
    }
  }
}

/**
 * Project DataLoader
 */
export class ProjectDataLoader {
  private loader: DataLoader<string, IProject | null>;

  constructor() {
    this.loader = new DataLoader(async projectIds => {
      const projects = await Project.find({ _id: { $in: projectIds } });
      const projectMap = new Map(projects.map(p => [p.id, p]));
      return projectIds.map(id => projectMap.get(id) || null);
    });
  }

  load(id: string) {
    return this.loader.load(id);
  }

  clearCache(id?: string) {
    if (id) {
      this.loader.clear(id);
    } else {
      this.loader.clearAll();
    }
  }
}

import { IMission, Mission } from '../models/Mission';

/**
 * Mission DataLoader
 */
export class MissionDataLoader {
  private loader: DataLoader<string, IMission | null>;

  constructor() {
    this.loader = new DataLoader(async missionIds => {
      const missions = await Mission.find({ _id: { $in: missionIds } });
      const missionMap = new Map(missions.map(m => [m.id, m]));
      return missionIds.map(id => missionMap.get(id) || null);
    });
  }

  load(id: string) {
    return this.loader.load(id);
  }

  clearCache(id?: string) {
    if (id) {
      this.loader.clear(id);
    } else {
      this.loader.clearAll();
    }
  }
}

/**
 * Crear dataloaders para GraphQL context
 */
export function createDataloaders() {
  return {
    userLoader: new UserDataLoader(),
    projectLoader: new ProjectDataLoader(),
    missionLoader: new MissionDataLoader(),
  };
}
