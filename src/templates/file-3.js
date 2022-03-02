import React from "react"
import { graphql } from "gatsby"

export default function T({ data }) {
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export const q = graphql`
  query D($id: String!, $source: String!) {
    allFile(filter: { id: { ne: $id }, sourceInstanceName: { eq: $source } }) {
      nodes {
        name
        sourceInstanceName
        internal {
          content
        }
      }
    }
  }
`
