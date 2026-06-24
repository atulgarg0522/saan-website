import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'expertise',
  title: 'Expertise',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Platform/Infra', value: 'platform' },
          { title: 'AI/Data', value: 'ai' },
          { title: 'Observability', value: 'observability' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Used to sort skills pills on the home page.',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      category: 'category',
      order: 'order',
    },
    prepare(selection) {
      const { title, category, order } = selection
      return {
        title,
        subtitle: `Category: ${category} | Order: ${order || 0}`,
      }
    },
  },
})
