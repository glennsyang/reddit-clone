import React from "react";
import { PostsQuery, usePostsQuery } from "../generated/graphql";
import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { UpdootSection } from "../components/UpdootSection";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { withApollo } from "../utils/withApollo";

const Index = () => {
    const { data, error, loading, fetchMore, variables } = usePostsQuery({
        variables: {
            limit: 15,
            cursor: null,
        },
        notifyOnNetworkStatusChange: true,
    });

    if (!loading && !data) {
        return (
            <div>
                <div>you got query failed for some reason</div>
                <div>{error?.message}</div>
            </div>
        )
    }

    return (
        <Layout>
            {!data && loading ? (
                <div>loading...</div>
            ) : (
                    <Stack spacing={8}>
                        {data!.posts.posts.map((p) => !p ? null : (
                            <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                                <UpdootSection post={p} />
                                <Box flex={1}>
                                    <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                                        <Link>
                                            <Heading fontSize="xl">{p.title}</Heading>
                                        </Link>
                                    </NextLink>
                                    <Text>posted by {p.creator.username}</Text>
                                    <Flex align="center">
                                        <Text flex={1} mt={4}>{p.textSnippet}</Text>
                                        <Box ml="auto">
                                            <EditDeletePostButtons id={p.id} creatorId={p.creator.id} />
                                        </Box>
                                    </Flex>
                                </Box>
                            </Flex>
                        ))}
                    </Stack>
                )}
            {data && data.posts.hasMore ? (
                <Flex>
                    <Button onClick={() => {
                        fetchMore({
                            variables: {
                                limit: variables?.limit,
                                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
                            },
                            // updateQuery: (previousValue, { fetchMoreResult }): PostsQuery => {
                            //     if (!fetchMoreResult) {
                            //         return previousValue as PostsQuery;
                            //     }

                            //     return {
                            //         __typename: "Query",
                            //         posts: {
                            //             __typename: "PaginatedPosts",
                            //             hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                            //             posts: [
                            //                 ...(previousValue as PostsQuery).posts.posts,
                            //                 ...(fetchMoreResult as PostsQuery).posts.posts,
                            //             ]
                            //         },
                            //     };
                            // }
                        });
                    }}
                        isLoading={loading}
                        m="auto"
                        my={8}
                    >
                        load more
                    </Button>
                </Flex>
            ) : null}
        </Layout>
    );
};

export default withApollo({ ssr: true })(Index);
