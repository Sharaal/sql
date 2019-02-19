function sql(textFragments, ...valueFragments) {
  textFragments = JSON.parse(JSON.stringify(textFragments))

  let text = textFragments.shift()
  let parameters = []

  let textFragment
  let valueFragment
  do {
    valueFragment = valueFragments.shift()
    if (valueFragment) {
      if (typeof valueFragment !== 'object') {
        valueFragment = sql.value(valueFragment)
      }
      text += valueFragment.text
      parameters = parameters.concat(valueFragment.parameters)
    }
    textFragment = textFragments.shift()
    if (textFragment) {
      text += textFragment
    }
  } while (textFragment)

  let i = 0
  text = text.replace(
    /(\$)/g,
    () => `$${++i}`
  )

  return { text, parameters }
}

function escapeIdentifier(identifier) {
  return `"${identifier.replace(/"/g, '""')}"`
}

sql.identifiers = identifiers => ({
  text: identifiers.map(escapeIdentifier).join(', '),
  parameters: []
})

sql.identifier = identifier => sql.identifiers([identifier])

sql.values = values => ({
  text: Array.apply(null, { length: values.length }).map(() => '$').join(', '),
  parameters: values
})

sql.value = value => sql.values([value])

sql.pairs = (pairs, separator = ', ') => {
  const texts = []
  const parameters = []
  for (const key of Object.keys(pairs)) {
    const value = pairs[key]
    texts.push(`${escapeIdentifier(key)} = $`)
    parameters.push(value)
  }
  return {
    text: texts.join(separator),
    parameters
  }
}

module.exports = sql
