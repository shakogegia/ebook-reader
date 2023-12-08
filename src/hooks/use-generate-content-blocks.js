import { useCallback, useEffect, useState } from 'react'

const hashLineregex = /^#+$/

export default function useGenerateContentBlocks(input) {
  const [contentBlocks, setContentBlocks] = useState([])

  const generateContetBlocks = useCallback((_input) => {
    // split content into lines
    const lines = _input.split('\n')

    // remove empty lines and trim
    const linesArray = lines
      .filter((line) => line.trim() !== '' && line.trim() !== '.')
      .map((line) => line.trim())

    const result = []
    let previousLine = ''

    linesArray.forEach((line, index) => {
      // if line is a just a hash, skip it
      if (!hashLineregex.test(line)) {
        const words = line.split(' ')

        // basic style is body
        let style = 'body'

        // check if line is a heading
        if (
          previousLine === '#' &&
          linesArray[index + 1] === '##' &&
          linesArray[index + 2] === '###' &&
          linesArray[index + 3] === '####'
        ) {
          style = 'heading'
        }

        result.push({ words, style: style })
      }
      previousLine = line
    })

    return result
  }, [])

  useEffect(() => {
    if (input) {
      setContentBlocks(generateContetBlocks(input))
    }
  }, [generateContetBlocks, input])

  return { contentBlocks }
}
