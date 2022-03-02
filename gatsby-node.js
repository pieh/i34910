exports.sourceNodes = ({ actions }) => {
  actions.createNode({
    id: `post-1`,
    stage: 1,
    title: "Post 1",
    tags: [`tag-1`],
    categories: [],
    sort: 5,
    nested: {
      sort: 5,
      stage: 1,
      title: "Post 1",
      same: true,
    },
    same: true,
    internal: {
      type: `Post`,
      contentDigest: `post-1`,
    },
  })

  actions.createNode({
    id: `post-2`,
    stage: 2,
    title: "Post 2",
    tags: [`tag-1`],
    categories: [`category-1`],
    sort: 3,
    nested: {
      sort: 3,
      stage: 2,
      title: "Post 2",
      same: true,
    },
    same: true,
    internal: {
      type: `Post`,
      contentDigest: `post-2`,
    },
  })

  actions.createNode({
    id: `post-3`,
    stage: 3,
    title: "Post 3",
    tags: [`tag-1`, `tag-2`],
    categories: [`category-1`],
    sort: 7,
    nested: {
      sort: 7,
      stage: 3,
      title: "Post 3",
      same: true,
    },
    same: true,
    internal: {
      type: `Post`,
      contentDigest: `post-3`,
    },
  })

  actions.createNode({
    id: `tag-1`,
    title: `Tag 1`,
    posts: [`post-1`, `post-2`, `post-3`],
    sort: 3,
    internal: {
      type: `Tag`,
      contentDigest: `tag-1`,
    },
  })

  actions.createNode({
    id: `tag-2`,
    title: `Tag 2`,
    posts: [`post-3`],
    sort: 1,
    internal: {
      type: `Tag`,
      contentDigest: `tag-2`,
    },
  })

  actions.createNode({
    id: `category-1`,
    title: `Category 1`,
    posts: [`post-2`, `post-3`],
    sort: 9,
    internal: {
      type: `Category`,
      contentDigest: `cat-1`,
    },
  })
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    Post: {
      sort: {
        type: `Int!`,
        resolve: source => {
          return source.sort
        },
      },
    },
    NestedSort: {
      sort: {
        type: `Int!`,
        resolve: source => {
          return source.sort
        },
      },
    },
  })
}

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type NestedSort {
      stage: Int!
      title: String!
      sort: Int!
      same: Boolean!
    }

    type Post implements Node {
      stage: Int!
      title: String!
      sort: Int!
      nested: NestedSort!
      tags: [Tag!]! @link
      same: Boolean!
      categories: [Category!]! @link
    }

    type Tag implements Node {
      title: String!
      posts: [Post!]! @link
      sort: Int!
    }

    type Category implements Node {
      title: String!
      posts: [Post!]! @link
      sort: Int!
    }
  `)
}

exports.createPages = async ({ actions, graphql }) => {
  const paths = []

  const r1 = await graphql(`
    {
      allPost(filter: { nested: { title: { ne: "Post 2" } } }) {
        nodes {
          id
        }
      }
    }
  `)

  const r2 = await graphql(`
    {
      allPost(
        filter: { nested: { stage: { ne: 1 } } }
        sort: { fields: [nested___sort], order: [DESC] }
      ) {
        nodes {
          id
        }
      }
    }
  `)

  const result = await graphql(`
    {
      allPost(
        filter: { nested: { stage: { ne: 1 }, title: { ne: "Post 2" } } }
        sort: { fields: [nested___sort, sort], order: [DESC, ASC] }
      ) {
        nodes {
          id
        }
      }
    }
  `)

  console.log(
    require(`util`).inspect(
      {
        p1: r1.data.allPost.nodes,
        p2: r2.data.allPost.nodes,
        final: result.data.allPost.nodes,
      },
      { depth: Infinity }
    )
  )

  const fileTemplate = require.resolve(`./src/templates/file`)
  const fileTemplate2 = require.resolve(`./src/templates/file-2`)
  const fileTemplate3 = require.resolve(`./src/templates/file-3`)
  for (const file of result.data.allFile.nodes) {
    {
      const path = `/file/${file.name}`
      actions.createPage({
        path,
        component: fileTemplate,
        context: {
          id: file.id,
          source: file.sourceInstanceName,
        },
      })
      paths.push(path)
    }

    {
      const path = `/file2/${file.name}`
      actions.createPage({
        path,
        component: fileTemplate2,
        context: {
          id: file.id,
          source: file.sourceInstanceName,
        },
      })
      paths.push(path)
    }

    {
      const path = `/file3/${file.name}`
      actions.createPage({
        path,
        component: fileTemplate3,
        context: {
          id: file.id,
          source: file.sourceInstanceName,
        },
      })
      paths.push(path)
    }
  }

  const result2 = await graphql(`
    {
      allPost(
        sort: { fields: nested___sort, order: DESC }
        filter: { nested: { stage: { eq: 1 }, same: { eq: true } } }
      ) {
        nodes {
          nested {
            title
          }
          internal {
            contentDigest
          }
        }
      }
      allFile {
        nodes {
          id
          name
          sourceInstanceName
        }
      }
    }
  `)
  // console.log(require(`util`).inspect(result, { depth: Infinity }))
  // process.exit(0)
  const stages = [1, 2]
  const tags = [`tag-1`, `tag-2`]
  const categories = [`category-1`]

  const tagTemplate = require.resolve(`./src/templates/tag`)

  for (const stage of stages) {
    for (const tag of tags) {
      const path = `/tag/${tag}/${stage}`
      paths.push(path)
      actions.createPage({
        path,
        component: tagTemplate,
        context: {
          tagId: tag,
          stage,
        },
      })
    }
  }

  console.log(`created pages`, paths)
}
