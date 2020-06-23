An example of how to serialize nested mutations in graphql.

Get up and running quick
```
git clone https://github.com/mikeball1289/graphql-sequence
cd graphql-sequence
npm i
npm run build
npm start
```

Navigate to http://localhost:4000 in a browser, try these queries to see the difference in execution.

```
mutation {
    parallel {
        wait300: wait(time: 300)
        wait200: wait(time: 200)
        wait100: wait(time: 100)
    }
}
```

```
mutation {
    serial {
        wait300: wait(time: 300)
        wait200: wait(time: 200)
        wait100: wait(time: 100)
    }
}
```

```
mutation {
    serial {
        wait300: wait(time: 300)
        wait200: wait(time: 200)
        wait100: wait(time: 100)
    }
    serial2 {
        wait100: wait(time: 100)
        wait200: wait(time: 200)
        wait300: wait(time: 300)
    }
}
```
