[![Build Status](https://travis-ci.org/sharaal/sql-pg.svg)](https://travis-ci.org/sharaal/sql-pg)
[![Coverage Status](https://coveralls.io/repos/github/sharaal/sql-pg/badge.svg)](https://coveralls.io/github/sharaal/sql-pg)
[![dependencies Status](https://david-dm.org/sharaal/sql-pg/status.svg)](https://david-dm.org/sharaal/sql-pg)

# Getting Started

## Initialisation

```javascript
const sql = require('sql-pg')
sql.client = client // Assign initialised `pg` client
```

## Usage

### Methods

Simple CRUD operations can be done without writing any SQL Statements.

E.g. some user operations:

```javascript
// Insert a user with a name and email
const userId = await sql.insert('users', { name: 'Sharaal', email: 'eMail@sharaal.de' })

// Select the user by the ID
const user = (await sql.select('users', { id: userId }))[0]

// Update the user after verified the email validation request
await sql.update('users', { validated: 1 }, { id: userId })

// Delete the user
await sql.delete('users', { id: userId })
```

### SQL Tag and Tag Helpers

For all use cases which are not simple CRUD operations, the SQL Tag and Tag Helpers can be used, variables will be exchanged with PostgreSQL placeholders and the values overgiven as parameters.

E.g. list of not activated users filtered by name and with pagination:

```javascript
const name = 'raa'
const page = 0

const users = await sql.query(sql`
  SELECT name, email FROM users
    WHERE
      validated IS NULL
      AND
      name LIKE ${'%' + name + '%'}
    ${sql.pagination(page)}
`)
```

For all details of the methods, the SQL tag and the tag helpers have a look into the [Wiki](https://github.com/Sharaal/test/wiki).

# Alternative Databases

* MySQL: [sql-mysql](https://www.npmjs.com/package/sql-mysql)
