import { useCallback, useEffect, useState, Fragment, useMemo, useRef } from 'react'
import { Button, NextIcon, PrevIcon } from './button'
import usePageBlocks from '@/hooks/use-page-blocks'
import useGenerateContentBlocks from '@/hooks/use-generate-content-blocks'
import Loading from './loading'

// Container dimensions
const BOX_WIDTH = 500
const BOX_HEIGHT = 600
const PADDING = 20
const BORDER = 2
const VIEWPORT_HEIGHT = BOX_HEIGHT - PADDING * 2 - BORDER

export default function Reader({ input }) {
  const [isReady, setIsReady] = useState(false)

  const [breakPoints, setBreakPoints] = useState([])
  const sortedBreakPoints = useMemo(() => {
    return breakPoints.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  }, [breakPoints])

  const [currenPageIndex, setCurrentPageIndex] = useState(0)
  const [currenPageBlocks, setCurrentPageData] = useState([])

  const { contentBlocks } = useGenerateContentBlocks(input)
  const { getPageBlocksByBreakPoint } = usePageBlocks()

  // if all breakpoints are set, we're ready to render the content
  useEffect(() => {
    breakPoints.length * VIEWPORT_HEIGHT > BOX_HEIGHT && setIsReady(true)
  }, [breakPoints.length])

  // Get the content blocks for the current page
  useEffect(() => {
    if (isReady && contentBlocks.length && sortedBreakPoints.length) {
      setCurrentPageData(
        getPageBlocksByBreakPoint(
          contentBlocks,
          sortedBreakPoints[currenPageIndex],
          sortedBreakPoints[currenPageIndex + 1]
        )
      )
    }
  }, [currenPageIndex, isReady, breakPoints, sortedBreakPoints, contentBlocks, getPageBlocksByBreakPoint])

  const onPageBreak = useCallback(({ lineIndex, wordIndex }) => {
    setBreakPoints((prevState) => {
      const pageBreak = `${lineIndex}-${wordIndex}`
      if (prevState.includes(pageBreak)) return prevState
      return [...prevState, pageBreak]
    })
  }, [])

  const flipBack = useCallback(() => {
    setCurrentPageIndex((prevState) => prevState - 1)
  }, [])

  const flipForward = useCallback(() => {
    setCurrentPageIndex((prevState) => prevState + 1)
  }, [])

  return (
    <div className="flex items-center gap-4">
      <Button onClick={flipBack} disabled={currenPageIndex === 0}>
        <PrevIcon />
        <span>Prev</span>
      </Button>

      <div className="flex flex-col gap-2">
        <div
          className="border border-dashed rounded-lg relative font-serif bg-[#faebd785]"
          style={{
            width: `${BOX_WIDTH}px`,
            height: `${BOX_HEIGHT}px`,
            padding: `${PADDING}px`,
          }}
        >
          {!isReady && <Loading />}

          {/*
             First render whole content with opacity 0,
             to get break points and calculate pages
          */}
          {!isReady && <Content contentBlocks={contentBlocks} opacity={0} onPageBreak={onPageBreak} />}

          {/* 
            After we have calculated the breakpoints, render the content again
            with opacity 1 and only the current page
           */}
          {isReady && <Content contentBlocks={currenPageBlocks} opacity={1} />}
        </div>

        <div className="text-center">
          <span>
            Page {currenPageIndex + 1} of {sortedBreakPoints.length}
          </span>
        </div>
      </div>

      <Button onClick={flipForward} disabled={currenPageIndex === sortedBreakPoints.length - 1}>
        <span>Next</span>
        <NextIcon />
      </Button>
    </div>
  )
}

const Content = ({ contentBlocks, opacity, onPageBreak }) => {
  return (
    <ContentWrapper opacity={opacity}>
      {contentBlocks.map((line, lineIndex) => {
        return (
          <div key={`line-${lineIndex}`}>
            <Line heading={line.style === 'heading'}>
              {line.words.map((word, wordIndex) => (
                <Fragment key={`word-${lineIndex + wordIndex}`}>
                  <Word lineIndex={lineIndex} wordIndex={wordIndex} onPageBreak={onPageBreak}>
                    {word}
                  </Word>

                  {/* Draw empty space between words, if not last word */}
                  {line.words[wordIndex + 1] && ' '}
                </Fragment>
              ))}
            </Line>
          </div>
        )
      })}
    </ContentWrapper>
  )
}

function ContentWrapper({ children, opacity = 1 }) {
  return (
    <div className="w-full relative break-normal" style={{ opacity }}>
      {children}
    </div>
  )
}

function Line({ heading, children }) {
  return <p className={heading ? 'text-3xl text-center mb-8' : ''}>{children}</p>
}

function Word({ children, lineIndex, wordIndex, onPageBreak }) {
  const ref = useRef(null)

  // Check if the word is the first word of the new line
  // If so, call the onPageBreak callback
  useEffect(() => {
    if (ref.current && onPageBreak) {
      const { offsetLeft, offsetTop, offsetHeight } = ref.current
      const isFirstWord = lineIndex === 0 && wordIndex === 0
      const pageSequence = parseInt(offsetTop / VIEWPORT_HEIGHT) + 1
      const pageBottomPoint = pageSequence * VIEWPORT_HEIGHT
      const wordBottomPoint = offsetTop + offsetHeight
      const isOnNewLine =
        offsetLeft === 0 &&
        offsetTop !== 0 &&
        (wordBottomPoint > pageBottomPoint || pageBottomPoint - wordBottomPoint <= 5)

      if (isFirstWord || isOnNewLine) {
        onPageBreak({ lineIndex, wordIndex })
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref}>{children}</span>
}
