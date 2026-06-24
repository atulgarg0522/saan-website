import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { codeInput } from '@sanity/code-input'

export default defineConfig({
  name: 'default',
  title: 'SaaN Digital Studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dummy_project_id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Custom nav order: Posts → Projects → Services → Expertise → Settings
            S.documentTypeListItem('post').title('Posts'),
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('service').title('Services'),
            S.documentTypeListItem('expertise').title('Expertise'),
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            // Filter out types we have explicitly positioned
            ...S.documentTypeListItems().filter(
              (item) =>
                !['post', 'project', 'service', 'expertise', 'siteSettings', 'author', 'category'].includes(
                  item.getId() || ''
                )
            ),
            // Also include author and category at the bottom
            S.documentTypeListItem('author').title('Authors'),
            S.documentTypeListItem('category').title('Categories'),
          ]),
    }),
    visionTool(),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
  },
})
