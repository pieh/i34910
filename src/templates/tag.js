import React from "react"
import { graphql } from "gatsby"

export default function T({ data }) {
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export const q = graphql`
  query A($stage: Int!, $tagId: String!) {
    allPost(
      filter: {
        stage: { eq: $stage }
        tags: { elemMatch: { id: { eq: $tagId } } }
      }
      sort: { fields: id }
    ) {
      nodes {
        stage
        title
        categories {
          title
        }
        tags {
          title
        }
      }
    }
    allTag(
      filter: {
        id: { eq: $tagId }
        posts: { elemMatch: { stage: { eq: $stage } } }
      }
      sort: { fields: id }
    ) {
      nodes {
        title
        posts {
          title
          stage
        }
      }
    }
  }
`
