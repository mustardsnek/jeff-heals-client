import { CustomRenderer } from "@/components/CustomRenderer";
import { gql, useQuery } from "@apollo/client";
import { BasePage } from "@mustardsnek/vesslio-storybook";

const GET_PAGES = gql`
  query {
    pages(where: { title: { equals: "AboutIFS" } }) {
      content {
        document(hydrateRelationships: true)
      }
    }
  }
`;

export default function AboutIFS() {
  const { data, loading, error } = useQuery(GET_PAGES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <BasePage>
      <CustomRenderer
        document={data.pages[0].content?.document}
      ></CustomRenderer>
    </BasePage>
  );
}
