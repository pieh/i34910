import React from "react"
import { graphql } from "gatsby"

export default function T({ data }) {
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export const q = graphql`
  query B($id: String!, $source: String!) {
    allFile(filter: { id: { eq: $id }, sourceInstanceName: { eq: $source } }) {
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
