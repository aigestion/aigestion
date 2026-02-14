const { notionRequest, getEnv } = require('../utils/notion');

const pageId = getEnv('NOTION_OS_PAGE_ID');

if (!pageId || pageId.includes('your-')) {
  console.error('❌ NOTION_OS_PAGE_ID not found or invalid in .env');
  process.exit(1);
}

async function createDatabase(title, properties) {
  console.log(`🏗️ Creating database: ${title}...`);
  try {
    const dbPayload = {
      parent: { type: 'page_id', page_id: pageId },
      title: [{ type: 'text', text: { content: title } }],
      properties: properties,
    };
    const response = await notionRequest('/databases', 'POST', dbPayload);
    console.log(`✅ Created '${title}' Database! ID: ${response.id}`);
    return response.id;
  } catch (error) {
    console.error(`❌ Error creating '${title}':`, error.message);
    return null;
  }
}

async function getExistingDatabases() {
  console.log('🔍 Checking for existing databases...');
  try {
    const response = await notionRequest(`/blocks/${pageId}/children`, 'GET');
    return response.results
      .filter(block => block.type === 'child_database')
      .reduce((acc, db) => {
        acc[db.child_database.title] = db.id;
        return acc;
      }, {});
  } catch (error) {
    console.error('❌ Error checking existing databases:', error.message);
    return {};
  }
}

async function buildOSStructure() {
  console.log(`🚀 Building/Updating AIGestion OS Structure inside Page ${pageId}...`);

  const existingDbs = await getExistingDatabases();

  // 1. Tasks Database
  let tasksId = existingDbs['Tasks'];
  if (!tasksId) {
    tasksId = await createDatabase('Tasks', {
      Name: { title: {} },
      Status: {
        select: {
          options: [
            { name: 'To Do', color: 'gray' },
            { name: 'In Progress', color: 'blue' },
            { name: 'Done', color: 'green' },
          ],
        },
      },
      Priority: {
        select: {
          options: [
            { name: 'High', color: 'red' },
            { name: 'Medium', color: 'yellow' },
            { name: 'Low', color: 'blue' },
          ],
        },
      },
      'Due Date': { date: {} },
    });
  } else {
    console.log('⏩ Tasks Database already exists.');
  }

  // 2. Content Database
  let contentId = existingDbs['Content'];
  if (!contentId) {
    contentId = await createDatabase('Content', {
      Title: { title: {} },
      Type: {
        select: {
          options: [
            { name: 'Article', color: 'blue' },
            { name: 'Video', color: 'red' },
            { name: 'Social Post', color: 'purple' },
          ],
        },
      },
      Status: {
        select: {
          options: [
            { name: 'Idea', color: 'gray' },
            { name: 'Drafting', color: 'yellow' },
            { name: 'Published', color: 'green' },
          ],
        },
      },
      'Publication Date': { date: {} },
      // Add relation to Tasks if Tasks DB exists
      ...(tasksId ? { 'Related Tasks': { relation: { database_id: tasksId } } } : {}),
    });
  } else {
    console.log('⏩ Content Database already exists.');
  }

  // 3. Clients Database
  let clientsId = existingDbs['Clients'];
  if (!clientsId) {
    clientsId = await createDatabase('Clients', {
      Name: { title: {} },
      'Contact Email': { email: {} },
      Status: {
        select: {
          options: [
            { name: 'Lead', color: 'blue' },
            { name: 'Active', color: 'green' },
            { name: 'Archived', color: 'gray' },
          ],
        },
      },
    });
  } else {
    console.log('⏩ Clients Database already exists.');
  }

  console.log('\n🎉 AIGestion OS Structure Sync Complete!');
  console.log(`Tasks DB: ${tasksId}`);
  console.log(`Content DB: ${contentId}`);
  console.log(`Clients DB: ${clientsId}`);

  // Output for next steps (important for CI or automation)
  console.log(`__DB_TASKS__:${tasksId}`);
  console.log(`__DB_CONTENT__:${contentId}`);
  console.log(`__DB_CLIENTS__:${clientsId}`);
}

buildOSStructure();
