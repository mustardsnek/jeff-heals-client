import { gql, useQuery } from "@apollo/client";
import {
  BasePage,
  CardPane,
  IPost,
  Post,
  PostCard,
  PostHero,
} from "@mustardsnek/vesslio-storybook";
import { GetStaticPaths, GetStaticProps } from "next";
import client from "../../lib/apollo";

const GET_POST_SLUGS = gql`
  query {
    posts {
      slug
    }
  }
`;

const GET_POSTS = gql`
  query {
    posts {
      headerImage
      title
      content {
        document
      }
      author {
        name
      }
      slug
      publishDate
      story
      tags {
        name
        slug
      }
    }
  }
`;
const GET_PAGE = gql`
  query GetPage($title: String!) {
    page(where: { title: $title }) {
      title
      content {
        document
      }
    }
  }
`;

const GET_POST = gql`
  query GetPost($slug: String!) {
    post(where: { slug: $slug }) {
      headerImage
      title
      content {
        document
      }
      author {
        name
        pfp
      }
      slug
      publishDate
      story
      tags {
        name
        slug
      }
    }
  }
`;

export default function BlogPost({ data }) {
  const similarPosts = useQuery(GET_POSTS);
  if (!data) {
    return <></>;
  } else
    return (
      <BasePage>
        <PostHero post={data.post}></PostHero>
        <div className="container-fluid post-bg">
          <div className="row p-md-5 p-sm-2 post-page-bg">
            <div className="col-md-8 col-sm-12">
              <Post {...data.post}></Post>
            </div>
            <div className="col-md-4 col-sm-12 ">
              <CardPane
                intro={
                  <div className="h4 base-text p-0 m-0 text-center">
                    Browse similar stories
                  </div>
                }
                cards={[
                  ...(similarPosts.data
                    ? similarPosts.data.posts.map((p: IPost, idx: number) => {
                        return <PostCard post={p} key={idx}></PostCard>;
                      })
                    : []),
                ]}
                vertical={true}
              ></CardPane>
            </div>
          </div>
        </div>
      </BasePage>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data, errors } = await client.query({
    query: GET_POST_SLUGS,
  });
  if (errors) {
    console.log("errors in query");
  }
  const paths = data.posts.map((p: IPost) => {
    return { params: { slug: p.slug } };
  });
  return {
    paths: paths || [],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data, errors } = await client.query({
    query: GET_POST,
    variables: { slug: params.slug },
  });
  if (errors) {
    console.log("errors getting static props");
  }
  return {
    props: {
      data,
    },
  };
};
