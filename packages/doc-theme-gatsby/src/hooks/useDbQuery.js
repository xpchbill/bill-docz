import { useStaticQuery, graphql } from 'gatsby'

export const useDbQuery = () => {
  try {
    const data = useStaticQuery(graphql`
      query {
        docDb {
          id
          db
        }
      }
    `)

    return JSON.parse(data.docDb.db)
  } catch (err) {
    console.error(err)
    console.error('Error when parsing doc database')
    return {}
  }
}
