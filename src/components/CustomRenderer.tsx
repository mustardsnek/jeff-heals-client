import { gql, useQuery } from "@apollo/client";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import {
  CTA,
  CardFilterer,
  CardPane,
  FAQ,
  IPost,
  Intake,
  MultiHero,
  NumberCardPane,
  PostCard,
  PostCarousel,
  StoryCarousel,
  Suggestions,
} from "@mustardsnek/vesslio-storybook";
import React, { ComponentProps } from "react";

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

const GET_STORIES = gql`
  query {
    posts(where: { story: { equals: true } }) {
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
    }
  }
`;

const GET_TAGS = gql`
  query {
    tags {
      name
      slug
    }
  }
`;

type CustomRendererProps = ComponentProps<typeof DocumentRenderer>;

const defaultElementRenderers: CustomRendererProps["renderers"] = {
  block: {
    // all custom components are block components
    // so they will be wrapped with a <div /> by default
    // we can override that to whatever wrapper we want
    // for eg. using React.Fragment wraps the component with nothing
    block: React.Fragment,
    // customise blockquote elements with your own styles
    blockquote({ children }) {
      return <blockquote>{children}</blockquote>;
    },
    // block code ``` ```
    code({ children }) {
      return <pre>{children}</pre>;
    },
    // and more - check out the types to see all available block elements
  },
  inline: {
    bold: ({ children }) => {
      return <strong>{children}</strong>;
    },
    // inline code ` `
    code: ({ children }) => {
      return <code>{children}</code>;
    },
    // and more - check out the types to see all available inline elements
  },
};

const customComponentRenderers: CustomRendererProps["componentBlocks"] = {
  hero: (props) => {
    return <MultiHero {...props} />;
  },
  cta: (props) => {
    console.log(props);
    return <CTA {...props} />;
  },
  postCarousel: (props) => {
    // posts should be populated dynamically based on search
    const { data, loading, error } = useQuery(GET_POSTS);
    return (
      <PostCarousel
        detailed={props.detailed}
        preview={props.preview}
        posts={data ? data.posts : []}
      />
    );
  },
  suggestions: (props) => {
    return <Suggestions {...props} />;
  },

  storyCarousel: (props) => {
    const { data, loading, error } = useQuery(GET_STORIES);
    return (
      <StoryCarousel preview={props.preview} stories={data ? data.posts : []} />
    );
  },
  intake: (props) => {
    return <Intake {...props} />;
  },
  faq: (props) => {
    return <FAQ {...props} />;
  },
  postCardPane: (props) => {
    const { data, loading, error } = useQuery(GET_POSTS);
    console.log(data);
    return (
      <CardPane
        cards={[
          ...(data
            ? data.posts.map((p: IPost, idx: number) => {
                return <PostCard post={p} key={idx}></PostCard>;
              })
            : []),
        ]}
        intro={props.intro}
        vertical={props.vertical}
      ></CardPane>
    );
  },
  numberCardPane: (props) => {
    return (
      <NumberCardPane
        cards={[...props.cards]}
        intro={props.intro}
      ></NumberCardPane>
    );
  },
  cardFilterer: (props) => {
    const tags = useQuery(GET_TAGS);
    const posts = useQuery(GET_POSTS);
    console.log(posts);
    return (
      <CardFilterer
        targets={[
          ...(tags.data
            ? tags.data.tags.map((t) => {
                return t.name;
              })
            : []),
        ]}
        population={[
          ...(posts.data
            ? posts.data.posts.map((p: IPost, idx: number) => {
                return <PostCard post={p} key={idx}></PostCard>;
              })
            : []),
        ]}
      ></CardFilterer>
    );
  },
};

export function CustomRenderer({ document }: CustomRendererProps) {
  return (
    <DocumentRenderer
      renderers={defaultElementRenderers}
      componentBlocks={customComponentRenderers}
      document={document}
    />
  );
}
