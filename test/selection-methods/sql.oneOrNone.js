const assert = require('power-assert')
const sinon = require('sinon')

const sql = require('../../')
const { testSql } = require('../test')

describe('sql.oneOrNone', () => {
  beforeEach(() => {
    sql.client = undefined
  })

  it('select one row which is given back as return', async () => {
    const expectedRow = { column: 'value' }
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: [expectedRow] }))
    }

    sql.client = client
    const actualRow = await sql.oneOrNone(sql`SELECT "*" FROM "table"`)

    assert.deepEqual(actualRow, expectedRow)

    assert(client.query.calledOnce)

    testSql(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT "*" FROM "table"',
        parameters: []
      }
    )
  })

  it('select one row which is given back as return also if there is no row in the results', async () => {
    const expectedRow = undefined
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: [expectedRow] }))
    }

    sql.client = client
    const actualRow = await sql.oneOrNone(sql`SELECT "*" FROM "table"`)

    assert.equal(actualRow, expectedRow)

    assert(client.query.calledOnce)

    testSql(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT "*" FROM "table"',
        parameters: []
      }
    )
  })

  it('throw an exception if a there is more than one row in the result', async () => {
    const expectedRows = [{ column: 'value' }, { column: 'value' }]
    const client = {
      query: sinon.fake.returns(Promise.resolve({ rows: expectedRows }))
    }

    sql.client = client
    try {
      await sql.oneOrNone(sql`SELECT "*" FROM "table"`)
      assert(false)
    } catch (e) {
      assert.equal(e.message, 'Expects to have not more than one row in the query result')
    }

    assert(client.query.calledOnce)

    testSql(
      client.query.getCall(0).args[0],
      {
        text: 'SELECT "*" FROM "table"',
        parameters: []
      }
    )
  })
})
