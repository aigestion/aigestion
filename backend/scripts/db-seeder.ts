import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aigestion';

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();

    console.log('🌱 Inyectando datos sintéticos...');

    // Seed Missions
    const missions = db.collection('missions');
    await missions.deleteMany({});
    const sampleMissions = Array.from({ length: 10 }).map((_, i) => ({
      id: uuidv4(),
      title: `Operación Soberana ${i + 1}`,
      status: i % 2 === 0 ? 'active' : 'completed',
      priority: i < 3 ? 'high' : 'medium',
      createdAt: new Date(),
    }));
    await missions.insertMany(sampleMissions);
    console.log(`✅ ${sampleMissions.length} Misiones inyectadas.`);

    // Seed Swarm Events
    const events = db.collection('swarmevents');
    await events.deleteMany({});
    const sampleEvents = Array.from({ length: 50 }).map((_, i) => ({
      id: uuidv4(),
      type: 'agent_action',
      agent: i % 3 === 0 ? 'AUDITOR' : i % 3 === 1 ? 'ARCHITECT' : 'DESIGNER',
      content: `Acción automatizada de nivel ${i + 1} ejecutada con éxito.`,
      timestamp: new Date(Date.now() - i * 60000),
    }));
    await events.insertMany(sampleEvents);
    console.log(`✅ ${sampleEvents.length} Eventos de Swarm inyectados.`);

    console.log('🚀 SEEDING COMPLETADO: El Nexus está poblado.');
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
