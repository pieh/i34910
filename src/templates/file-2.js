import React from "react"
import { graphql } from "gatsby"

export default function T({ data }) {
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export const q = graphql`
  query C($source: String!) {
    allFile(filter: { sourceInstanceName: { eq: $source } }) {
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
