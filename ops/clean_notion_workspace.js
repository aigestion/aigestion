const { notionRequest, getEnv } = require('../utils/notion');

async function cleanWorkspace() {
  console.log('🧹 Starting Notion Workspace Cleanup (Native Mode)...');

  try {
    // Search for all resources
    const response = await notionRequest('/search', 'POST', {
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
    });

    const resources = response.results;
    console.log(`🔍 Found ${resources.length} resources.`);

    if (resources.length === 0) {
      console.log('✅ Workspace is already clean.');
      return;
    }

    const SAFE_LIST = ['AIGestion OS', 'AIGestion Root', 'AIGestion.net', 'AIGestion'];

    for (const resource of resources) {
      const type = resource.object;
      const id = resource.id;
      let name = 'Untitled';

      // Extract Name
      if (type === 'page') {
        const props = resource.properties || {};
        const titleKey = Object.keys(props).find(k => props[k].type === 'title');
        if (titleKey && props[titleKey].title && props[titleKey].title.length > 0) {
          name = props[titleKey].title[0].plain_text;
        }
      } else if (type === 'database') {
        if (resource.title && resource.title.length > 0) {
          name = resource.title[0].plain_text;
        }
      }

      // Checks
      if (SAFE_LIST.some(safe => name.includes(safe))) {
        console.log(`🛡️  Skipping [${type}] "${name}" (SAFE LIST)`);
        continue;
      }

      if (resource.archived) {
        console.log(`⏭️  Skipping [${type}] "${name}" (Already archived)`);
        continue;
      }

      // Archive
      console.log(`🗑️  Archiving [${type}] "${name}" (${id})...`);
      try {
        const endpoint = type === 'page' ? `/pages/${id}` : `/databases/${id}`;
        await notionRequest(endpoint, 'PATCH', { archived: true });
        console.log(`✅ Archived successfully.`);
      } catch (err) {
        console.error(`❌ Failed to archive: ${err.message}`);
      }
    }

    console.log('🏁 Cleanup Complete.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

cleanWorkspace();
