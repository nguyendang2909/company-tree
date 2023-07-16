## Introduction
Company tree application

## Prerequisites
nodejs
yarn
Make sure ports 3000 is free

## Installation & Configuration
```
yarn install
```

## Running the Application
```
yarn dev
```

http://localhost:3000

## Test
```
yarn test
yarn test:coverage
```

## GraphQL query

[POST] http://localhost:3000/graphql

```
query {
    companies {
        id,
        createdAt,
        name,
        parentId,
        cost,
        children {
            id,
            createdAt,
            name,
            parentId,
            cost,
            children {
                id,
                createdAt,
                name,
                parentId,
                cost,
                children {
                    id,
                    name,
                    createdAt,
                    parentId
                }
            }
        }
    }
}
```


