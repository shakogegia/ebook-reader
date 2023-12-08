import { useCallback } from 'react'

export default function usePageBlocks() {
  const getPageBlocksByBreakPoint = useCallback((contentBlocks, start, end) => {
    const [startLineIndex, startWordIndex] = start.split('-').map(Number)
    const [endLineIndex, endWordIndex] = end?.split('-').map(Number) || [
      contentBlocks.length - 1,
      contentBlocks[contentBlocks.length - 1].words.length - 1,
    ]

    // Filter the array
    return contentBlocks.reduce((acc, curr, lineIndex) => {
      // Check if the current line is within the range
      if (lineIndex >= startLineIndex && lineIndex <= endLineIndex) {
        let words

        if (lineIndex === startLineIndex && lineIndex === endLineIndex) {
          // If the start and end lines are the same
          words = curr.words.slice(startWordIndex, endWordIndex + 1)
        } else if (lineIndex === startLineIndex) {
          // If it's the start line
          words = curr.words.slice(startWordIndex)
        } else if (lineIndex === endLineIndex) {
          // If it's the end line
          words = curr.words.slice(0, endWordIndex)
        } else {
          // If it's in between the start and end lines
          words = curr.words
        }

        // Add the object to the accumulator if it has words
        if (words.length > 0) {
          acc.push({ ...curr, words })
        }
      }

      return acc
    }, [])
  }, [])

  return { getPageBlocksByBreakPoint }
}
