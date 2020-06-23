import { IResolvers, ApolloServer } from 'apollo-server';
import { GQLResolver, GQLWaiterTypeResolver } from './graphqlTypes';
import 'graphql-import-node';
import typeDefs from '../gql/schema.gql';

const wait = (n: number) => new Promise(resolve => setTimeout(resolve, n));
async function waitTimer(time: number, start: number) {
    await wait(time);
    return Date.now() - start;
}

type NoParent<T> = T extends (parent: any, args: infer A, context: infer C, info: infer I) => any ? (args: A, context: C, info: I) => any : never;

type GQLDefault<T> = {
    [TK in keyof Required<T>]: NoParent<NonNullable<T[TK]>>
}

type DefaultWaitResolver = GQLDefault<GQLWaiterTypeResolver<undefined>>;

function Parallel(): DefaultWaitResolver {
    return {
        wait: ({ time }, { start }) => waitTimer(time, start),
    };
}

function Serial(): DefaultWaitResolver {
    let promise = Promise.resolve<any>(null);
    
    return {
        wait: ({ time }, { start }) => {
            promise = promise.then(() => waitTimer(time, start));
            return promise;
        }
    }
}

const resolvers: GQLResolver & IResolvers = {
    Query: {
        hello: () => 'Hello!'
    },
    Mutation: {
        parallel: (_, args, context) => Parallel(),
        serial: (_, args, context) => Serial(),
        serial2: (_, args, context) => Serial(),
    }
};

const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: () => ({ start: Date.now() })
});

server.listen().then(({ url }) => console.log(url));